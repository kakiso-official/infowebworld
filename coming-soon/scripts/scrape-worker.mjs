#!/usr/bin/env node
/**
 * Long-running worker — polls scrape_jobs.status='queued' and runs the
 * pipeline against the oldest one. Designed to run in your terminal:
 *
 *   npm run scrape:worker
 *
 * Or with options:
 *
 *   node scripts/scrape-worker.mjs --concurrency=2 --model=gemini-2.5-flash --poll=8000
 *
 * Stops cleanly on Ctrl-C (SIGINT). Job-level crashes are non-fatal —
 * the pipeline marks the session 'failed' and the loop moves on. DB
 * connection blips trigger a reconnect via scrape-db.mjs instead of
 * crashing the process.
 *
 * Stale jobs (status='running' rows orphaned by a previous crashed
 * worker) are auto-reclaimed on boot and every Nth poll. Admin can set
 * a L1 focus filter via the UI — the worker reads it from
 * scraper_runtime_config each iteration, no restart required. Admin can
 * cancel an in-flight job by setting its status='cancelled' — the
 * pipeline aborts between steps via AbortSignal.
 */
import fs from 'node:fs'
import path from 'node:path'
import { loadEnv, requireEnv } from './lib/scrape-env.mjs'
import { closeDb, q, q1, exec } from './lib/scrape-db.mjs'
import { scrapeListing } from './lib/scrape-pipeline.mjs'
import { closeCrawler } from './lib/scrape-crawler.mjs'

const HEARTBEAT_FILE = path.resolve(process.cwd(), '.scrape-worker.heartbeat')
const STOP_FILE      = path.resolve(process.cwd(), '.scrape-worker.stop')
const SPEND_FILE     = path.resolve(process.cwd(), '.scrape-worker.spend')

function writeHeartbeat() { try { fs.writeFileSync(HEARTBEAT_FILE, String(Date.now())) } catch {} }
function clearHeartbeat() { try { fs.unlinkSync(HEARTBEAT_FILE) } catch {} }
function stopRequested() { try { return fs.existsSync(STOP_FILE) } catch { return false } }
function clearStopFile() { try { fs.unlinkSync(STOP_FILE) } catch {} }
function loadSpend(todayKey) {
  try {
    const raw = JSON.parse(fs.readFileSync(SPEND_FILE, 'utf8'))
    if (raw && raw.day === todayKey && typeof raw.spent === 'number') return raw.spent
  } catch {}
  return 0
}
function saveSpend(dayKey, spent) {
  try { fs.writeFileSync(SPEND_FILE, JSON.stringify({ day: dayKey, spent })) } catch {}
}

const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => {
      const [k, ...rest] = a.slice(2).split('=')
      return [k, rest.length ? rest.join('=') : true]
    })
)

const env = loadEnv()
requireEnv(env, ['DATABASE_HOST', 'DATABASE_USER', 'GEMINI_API_KEY'])

const POLL_MS          = Number(args.poll || 10000)
const CONCURRENCY      = Math.max(1, Math.min(5, Number(args.concurrency || 1)))
const MODEL            = String(args.model || 'gemini-2.5-flash')
const DAILY_CAP_USD    = Number(args['daily-cap'] || 20)
const PER_JOB_CAP_USD  = Number(args['job-cap']   || 0.50)
const CLI_L1_FILTER    = args.l1 ? String(args.l1) : null
const STALE_AFTER_MIN  = Number(args['stale-min'] || 30)
const RECLAIM_EVERY_N  = 10  // every Nth poll runs reclaimStaleRunning

let running = true
let forceExit = false
const active = new Map() // jobId -> { promise, slug, startedAt, controller }
let dayKey = new Date().toISOString().slice(0, 10)
let daySpend = loadSpend(dayKey)
let pollTick = 0
let dbL1Filter = null   // latest value from scraper_runtime_config

process.on('SIGINT',  () => {
  if (!running) {
    console.log('\n[worker] second SIGINT — exiting immediately, in-flight jobs may be left in running state')
    forceExit = true
    process.exit(130)
  }
  console.log('\n[worker] SIGINT — finishing in-flight jobs then exiting (Ctrl-C again to force)')
  running = false
})
process.on('SIGTERM', () => { running = false })
process.on('unhandledRejection', err => {
  console.error('[worker] unhandledRejection:', err?.stack || err?.message || err)
})

clearStopFile()
writeHeartbeat()

if (daySpend > 0) console.log(`[worker] resuming day ${dayKey} with $${daySpend.toFixed(4)} already spent`)
console.log(`[worker] online  poll=${POLL_MS}ms  concurrency=${CONCURRENCY}  model=${MODEL}  daily-cap=$${DAILY_CAP_USD}  job-cap=$${PER_JOB_CAP_USD}${CLI_L1_FILTER ? `  l1=${CLI_L1_FILTER}` : ''}`)

try {
  /* Boot-time recovery — the user's most-reported bug: worker died mid-run
     and the orphaned 'running' rows never recovered. Run this BEFORE the
     first claim so we don't try to re-process rows that were already
     mid-pipeline in a previous life. */
  const recovered = await reclaimStaleRunning(env, STALE_AFTER_MIN).catch(err => {
    console.error('[worker] boot reclaim failed:', err.message)
    return { recovered: 0, details: [] }
  })
  if (recovered.recovered > 0) {
    console.log(`[worker] boot reclaim: ${recovered.recovered} stale job(s) recovered`)
    for (const d of recovered.details) console.log(`           ${d.slug}: ${d.action}`)
  }

  while (running || active.size > 0) {
    if (forceExit) break
    writeHeartbeat()
    pollTick++

    if (stopRequested()) {
      console.log('[worker] stop file detected — finishing in-flight jobs then exiting')
      running = false
      clearStopFile()
    }

    const today = new Date().toISOString().slice(0, 10)
    if (today !== dayKey) {
      dayKey = today
      daySpend = 0
      saveSpend(dayKey, 0)
      console.log(`[worker] new day ${dayKey} — daily counter reset`)
    }

    /* Pull the live L1 filter from DB so the admin UI dropdown takes
       effect without a worker restart. The DB value wins over the CLI
       fallback so the dropdown is always authoritative — pass --l1
       only to bootstrap a value when the DB is empty. */
    dbL1Filter = await readDbL1Filter(env).catch(() => dbL1Filter)
    const effectiveL1 = dbL1Filter ?? CLI_L1_FILTER

    /* Check for cancellations against in-flight jobs and abort them.
       Pipeline catches the AbortError between steps and writes the
       session as 'cancelled' on its way out. */
    if (active.size > 0) {
      await applyCancellations().catch(err => {
        console.error('[worker] cancellation check failed:', err.message)
      })
    }

    /* Periodic stale reclaim — guards against the worker recovering from
       its OWN crash (the boot path handled the previous worker's mess).
       Every RECLAIM_EVERY_N polls = ~100s by default. */
    if (pollTick % RECLAIM_EVERY_N === 0) {
      const r = await reclaimStaleRunning(env, STALE_AFTER_MIN).catch(() => null)
      if (r?.recovered > 0) {
        console.log(`[worker] periodic reclaim: ${r.recovered} stale job(s) recovered`)
      }
    }

    if (running && daySpend < DAILY_CAP_USD) {
      while (active.size < CONCURRENCY) {
        const job = await claimNextJob(env, effectiveL1).catch(err => {
          console.error('[worker] claim failed (will retry next poll):', err.message)
          return null
        })
        if (!job) break
        startJob(job)
      }
    }

    if (active.size > 0) {
      await Promise.race([...[...active.values()].map(j => j.promise), sleep(POLL_MS)])
    } else if (running) {
      await sleep(POLL_MS)
    }
  }
} catch (err) {
  console.error('[worker] fatal:', err.message)
  process.exitCode = 1
} finally {
  await closeCrawler().catch(() => {})
  await closeDb().catch(() => {})
  clearHeartbeat()
  console.log(`[worker] offline — day ${dayKey} total spend $${daySpend.toFixed(4)}`)
}

// ─────────────────────────────────────────────────────────────────────────

function startJob(job) {
  const t0 = Date.now()
  /* AbortController gives the pipeline a way to bail at any step
     boundary without us having to plumb cancel flags through every
     helper. The applyCancellations() poller fires controller.abort()
     when scrape_jobs.status flips to 'cancelled'. */
  const controller = new AbortController()
  console.log(`[worker] ▶ job ${job.id} ${job.slug}`)
  const promise = (async () => {
    try {
      const res = await scrapeListing({
        env,
        jobId: job.id,
        model: MODEL,
        costCapUsd: PER_JOB_CAP_USD,
        log: console,
        signal: controller.signal,
      })
      const cost = Number(res?.cost ?? 0)
      daySpend += cost
      saveSpend(dayKey, daySpend)
      console.log(`[worker] ✓ job ${job.id} ${job.slug}  status=${res?.status}  cost=$${cost.toFixed(4)}  day=$${daySpend.toFixed(4)}  in ${Date.now() - t0}ms`)
    } catch (err) {
      const cancelled = err?.name === 'AbortError' || /cancel/i.test(err?.message || '')
      console.error(`[worker] ${cancelled ? '⊘' : '✗'} job ${job.id} ${job.slug}: ${err.message}`)
      try {
        await exec(env,
          `UPDATE scrape_jobs SET status = ? WHERE id = ? AND status = 'running'`,
          [cancelled ? 'cancelled' : 'failed', job.id]
        )
      } catch {}
    } finally {
      active.delete(job.id)
    }
  })()
  active.set(job.id, { promise, slug: job.slug, startedAt: t0, controller })
}

async function claimNextJob(env, l1Filter) {
  /* Race-free atomic claim using the MySQL LAST_INSERT_ID(expr) trick:
     setting `id = LAST_INSERT_ID(id)` in an UPDATE makes that connection's
     LAST_INSERT_ID() return the row that was just updated. */
  const claim = await exec(env,
    `UPDATE scrape_jobs
        SET status = 'running', id = LAST_INSERT_ID(id)
      WHERE status = 'queued'
        ${l1Filter ? 'AND category_l1 = ?' : ''}
      ORDER BY queued_at ASC
      LIMIT 1`,
    l1Filter ? [l1Filter] : []
  )
  if (claim.affectedRows === 0) return null

  const idRow = await q1(env, `SELECT LAST_INSERT_ID() AS id`)
  const claimedId = idRow?.id
  if (!claimedId) return null

  return await q1(env, `SELECT * FROM scrape_jobs WHERE id = ?`, [claimedId])
}

async function readDbL1Filter(env) {
  const row = await q1(env, `SELECT l1_filter FROM scraper_runtime_config WHERE id = 1`)
  return row?.l1_filter ?? null
}

/**
 * Reclaim orphaned 'running' rows. Three cases:
 *   1. Session is missing or stuck 'running' for > N min → re-queue
 *   2. Session is in a terminal state but job didn't catch up → sync
 *   3. Job is 'running' with no last_session_id at all → re-queue
 *
 * Called on boot AND periodically. Boot recovery is the headline fix
 * for the "worker isn't started but 4 listings show as running" bug.
 */
async function reclaimStaleRunning(env, staleAfterMin = 30) {
  const stale = await q(env, `
    SELECT j.id AS job_id, j.slug,
           s.id AS session_id, s.status AS session_status, s.started_at
      FROM scrape_jobs j
      LEFT JOIN scrape_sessions s ON s.id = j.last_session_id
     WHERE j.status = 'running'
       AND (
         s.id IS NULL
         OR (s.status = 'running' AND s.started_at < DATE_SUB(NOW(), INTERVAL ? MINUTE))
         OR s.status IN ('success', 'review', 'failed', 'cancelled')
       )
  `, [staleAfterMin])

  if (!stale.length) return { recovered: 0, details: [] }

  const details = []
  for (const row of stale) {
    /* Don't touch a job we ourselves are currently working on — would
       race with the live pipeline's own writes. */
    if (active.has(row.job_id)) continue

    if (!row.session_id || row.session_status === 'running' || !row.session_status) {
      if (row.session_id) {
        await exec(env, `
          UPDATE scrape_sessions
             SET status = 'failed',
                 error_summary = CONCAT('[abandoned] ', COALESCE(error_summary, '')),
                 finished_at = NOW(),
                 duration_ms = TIMESTAMPDIFF(MICROSECOND, started_at, NOW()) / 1000
           WHERE id = ? AND status = 'running'
        `, [row.session_id])
      }
      await exec(env, `UPDATE scrape_jobs SET status = 'queued' WHERE id = ? AND status = 'running'`, [row.job_id])
      details.push({ slug: row.slug, action: 're-queued' })
    } else {
      await exec(env, `UPDATE scrape_jobs SET status = ? WHERE id = ? AND status = 'running'`,
        [row.session_status, row.job_id])
      details.push({ slug: row.slug, action: `synced → ${row.session_status}` })
    }
  }
  return { recovered: details.length, details }
}

async function applyCancellations() {
  const activeIds = [...active.keys()]
  if (!activeIds.length) return
  /* IN (?, ?, ?) — mysql2 expands an array param, but doing it manually
     keeps the prepared-statement contract explicit and works with the
     existing q/exec wrappers that don't auto-spread. */
  const placeholders = activeIds.map(() => '?').join(',')
  const cancelled = await q(env,
    `SELECT id FROM scrape_jobs WHERE id IN (${placeholders}) AND status = 'cancelled'`,
    activeIds
  )
  for (const row of cancelled) {
    const entry = active.get(row.id)
    if (entry && !entry.controller.signal.aborted) {
      console.log(`[worker] ⊘ cancel requested for job ${row.id} ${entry.slug}`)
      entry.controller.abort()
    }
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
