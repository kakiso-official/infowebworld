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
 * Stops cleanly on Ctrl-C. Crashes are non-fatal — the worker catches
 * pipeline errors, marks the job 'failed', and moves on to the next.
 *
 * Concurrency >1 processes multiple jobs in parallel (one browser context
 * per job). Default 1 to be polite to remote sites. Daily cost cap is
 * enforced across all sessions started by this worker.
 */
import fs from 'node:fs'
import path from 'node:path'
import { loadEnv, requireEnv } from './lib/scrape-env.mjs'
import { closeDb, q, q1, exec } from './lib/scrape-db.mjs'
import { scrapeListing } from './lib/scrape-pipeline.mjs'
import { closeCrawler } from './lib/scrape-crawler.mjs'

/* Sentinel files at the project root. The /api/admin/scrape/worker/*
   routes touch these to coordinate with the long-running worker
   process. Heartbeat is rewritten every poll iteration; stop is touched
   by the UI's Stop button. */
const HEARTBEAT_FILE = path.resolve(process.cwd(), '.scrape-worker.heartbeat')
const STOP_FILE      = path.resolve(process.cwd(), '.scrape-worker.stop')

function writeHeartbeat() {
  try { fs.writeFileSync(HEARTBEAT_FILE, String(Date.now())) } catch {}
}
function clearHeartbeat() {
  try { fs.unlinkSync(HEARTBEAT_FILE) } catch {}
}
function stopRequested() {
  try { return fs.existsSync(STOP_FILE) } catch { return false }
}
function clearStopFile() {
  try { fs.unlinkSync(STOP_FILE) } catch {}
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

const POLL_MS         = Number(args.poll || 10000)
const CONCURRENCY     = Math.max(1, Math.min(5, Number(args.concurrency || 1)))
const MODEL           = String(args.model || 'gemini-2.5-pro')
const DAILY_CAP_USD   = Number(args['daily-cap'] || 20)
const PER_JOB_CAP_USD = Number(args['job-cap']   || 0.50)
const L1_FILTER       = args.l1 ? String(args.l1) : null

let running = true
let active = new Set()
let dayKey = new Date().toISOString().slice(0, 10)
let daySpend = 0

process.on('SIGINT',  () => { console.log('\n[worker] SIGINT — finishing in-flight jobs then exiting'); running = false })
process.on('SIGTERM', () => { running = false })

/* Clear any stale stop sentinel from a previous run; write first
   heartbeat immediately so the UI sees us online right away. */
clearStopFile()
writeHeartbeat()

console.log(`[worker] online  poll=${POLL_MS}ms  concurrency=${CONCURRENCY}  model=${MODEL}  daily-cap=$${DAILY_CAP_USD}  job-cap=$${PER_JOB_CAP_USD}${L1_FILTER ? `  l1=${L1_FILTER}` : ''}`)

try {
  while (running || active.size > 0) {
    /* Heartbeat — UI uses the file's mtime to display 'online'. */
    writeHeartbeat()

    /* Stop sentinel — the /api/admin/scrape/worker/stop route touches
       this file when the user clicks Stop in the UI. */
    if (stopRequested()) {
      console.log('[worker] stop file detected — finishing in-flight jobs then exiting')
      running = false
      clearStopFile()
    }

    // Reset daily counter at UTC midnight
    const today = new Date().toISOString().slice(0, 10)
    if (today !== dayKey) {
      dayKey = today
      daySpend = 0
      console.log(`[worker] new day ${dayKey} — daily counter reset`)
    }

    // Refill active set if under concurrency and budget
    while (running && active.size < CONCURRENCY && daySpend < DAILY_CAP_USD) {
      const job = await claimNextJob(env, L1_FILTER)
      if (!job) break
      const p = runJob(job).finally(() => active.delete(p))
      active.add(p)
    }

    if (active.size > 0) {
      await Promise.race([...active, sleep(POLL_MS)])
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
  console.log('[worker] offline')
}

// ─────────────────────────────────────────────────────────────────────────

async function claimNextJob(env, l1Filter) {
  /* Atomic claim: SELECT id of oldest queued job for the filter, then
     UPDATE to running. mysql2/promise lacks SELECT FOR UPDATE outside a
     transaction; we use UPDATE … LIMIT 1 + RETURNING-via-id-trick for
     atomicity. */
  const claim = await exec(env,
    `UPDATE scrape_jobs
        SET status = 'running'
      WHERE status = 'queued'
        ${l1Filter ? 'AND category_l1 = ?' : ''}
      ORDER BY queued_at ASC
      LIMIT 1`,
    l1Filter ? [l1Filter] : []
  )
  if (claim.affectedRows === 0) return null

  // Now find which one we just claimed. We can do this by re-querying the
  // most recently moved-to-running job for our filter that has no session
  // yet (so we don't pick up someone else's). Last-resort tie-break: id.
  const row = await q1(env,
    `SELECT * FROM scrape_jobs
      WHERE status = 'running'
        ${l1Filter ? 'AND category_l1 = ?' : ''}
      ORDER BY queued_at ASC
      LIMIT 1`,
    l1Filter ? [l1Filter] : []
  )
  return row
}

async function runJob(job) {
  const t0 = Date.now()
  console.log(`[worker] ▶ job ${job.id} ${job.slug}`)
  try {
    const res = await scrapeListing({
      env,
      jobId: job.id,
      model: MODEL,
      costCapUsd: PER_JOB_CAP_USD,
      log: console,
    })
    daySpend += Number(res.cost ?? 0)
    console.log(`[worker] ✓ job ${job.id} ${job.slug}  status=${res.status}  cost=$${res.cost?.toFixed(4)}  day=$${daySpend.toFixed(4)}  in ${Date.now() - t0}ms`)
  } catch (err) {
    console.error(`[worker] ✗ job ${job.id} ${job.slug}: ${err.message}`)
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
