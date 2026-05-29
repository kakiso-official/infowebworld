#!/usr/bin/env node
/**
 * Long-running scraper worker — runs as a daemon (PM2 or systemd).
 *
 * Control flow:
 *   1. Worker boots, writes heartbeat row (status='starting').
 *   2. Each poll iteration:
 *      a. Read scrape_worker_control.desired_state from MySQL.
 *      b. If 'running' and under concurrency/cost caps → claim oldest queued job.
 *      c. Write heartbeat row (status, day spend, current jobs).
 *      d. Sleep poll_ms.
 *   3. On SIGINT/SIGTERM: finish in-flight jobs, write status='offline', exit.
 *
 * The worker is a DAEMON — it never exits because the UI clicked Stop.
 * Stop only changes desired_state to 'stopped', which makes the worker
 * idle (no new claims). Start sets it back to 'running'. PM2 handles
 * actual process lifecycle: restarts on crash, auto-start on reboot.
 *
 * Run locally for testing:
 *   npm run scrape:worker
 *
 * Run on Linux server (PM2):
 *   pm2 start ecosystem.config.cjs --only scraper-worker
 *
 * Options:
 *   --worker-id=hetzner-prod-1  (default: hostname-pid)
 *   --concurrency=2             (1–5, default 1)
 *   --model=gemini-2.5-flash    (default gemini-2.5-pro)
 *   --poll=10000                (poll ms, default 10s)
 *   --daily-cap=20              (USD/day, default $20)
 *   --job-cap=0.50              (USD/job, default $0.50)
 *   --l1=ai-and-ml              (only claim jobs of this L1; default any)
 */
import os from 'node:os'
import { loadEnv, requireEnv } from './lib/scrape-env.mjs'
import { closeDb, q1, exec } from './lib/scrape-db.mjs'
import { scrapeListing } from './lib/scrape-pipeline.mjs'
import { closeCrawler } from './lib/scrape-crawler.mjs'

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

const WORKER_ID       = String(args['worker-id'] || `${os.hostname()}-${process.pid}`)
const POLL_MS         = Number(args.poll || 10000)
const CONCURRENCY     = Math.max(1, Math.min(5, Number(args.concurrency || 1)))
const MODEL           = String(args.model || 'gemini-2.5-pro')
const DAILY_CAP_USD   = Number(args['daily-cap'] || 20)
const PER_JOB_CAP_USD = Number(args['job-cap']   || 0.50)
const L1_FILTER       = args.l1 ? String(args.l1) : null

let running = true
let shuttingDown = false
const active = new Map() // jobId -> { startedAt, slug, promise }
let dayKey = new Date().toISOString().slice(0, 10)
let daySpend = 0
let lastHeartbeatError = 0
const startedAt = new Date()

process.on('SIGINT',  () => { console.log('\n[worker] SIGINT — draining'); running = false; shuttingDown = true })
process.on('SIGTERM', () => { console.log('\n[worker] SIGTERM — draining'); running = false; shuttingDown = true })

console.log(`[worker] ${WORKER_ID} starting  poll=${POLL_MS}ms  concurrency=${CONCURRENCY}  model=${MODEL}  daily-cap=$${DAILY_CAP_USD}  job-cap=$${PER_JOB_CAP_USD}${L1_FILTER ? `  l1=${L1_FILTER}` : ''}`)

try {
  await writeHeartbeat('starting').catch(logHeartbeatErr)

  while (running || active.size > 0) {
    /* Reset daily counter at UTC midnight so the daily-cap circuit
       breaker resets in lockstep with the calendar day. */
    const today = new Date().toISOString().slice(0, 10)
    if (today !== dayKey) {
      dayKey = today
      daySpend = 0
      console.log(`[worker] new day ${dayKey} — daily counter reset`)
    }

    /* The UI toggles desired_state via /api/admin/scrape/worker/start|stop.
       We poll on every loop iteration; signal latency = POLL_MS. */
    const desiredState = await readDesiredState().catch(() => 'stopped')

    if (running && desiredState === 'running' && daySpend < DAILY_CAP_USD) {
      while (active.size < CONCURRENCY) {
        const job = await claimNextJob().catch(() => null)
        if (!job) break
        startJob(job)
      }
    }

    const status = computeStatus({ shuttingDown, desiredState, activeCount: active.size })
    await writeHeartbeat(status).catch(logHeartbeatErr)

    if (active.size > 0) {
      await Promise.race([
        Promise.race([...active.values()].map(j => j.promise)),
        sleep(POLL_MS),
      ])
    } else if (running) {
      await sleep(POLL_MS)
    }
  }

  await writeHeartbeat('offline').catch(() => {})
} catch (err) {
  console.error('[worker] fatal:', err.message)
  process.exitCode = 1
} finally {
  await closeCrawler().catch(() => {})
  await closeDb().catch(() => {})
  console.log('[worker] offline')
}

// ─────────────────────────────────────────────────────────────────────────

function startJob(job) {
  console.log(`[worker] ▶ job ${job.id} ${job.slug}`)
  const t0 = Date.now()
  const promise = (async () => {
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
    } finally {
      active.delete(job.id)
    }
  })()
  active.set(job.id, { startedAt: Date.now(), slug: job.slug, promise })
}

async function claimNextJob() {
  /* Atomic claim — UPDATE … LIMIT 1 flips the oldest queued row to
     'running' in one shot, then we re-SELECT it. Multiple worker
     processes can race here safely; affectedRows tells us who won. */
  const claim = await exec(env,
    `UPDATE scrape_jobs
        SET status = 'running'
      WHERE status = 'queued'
        ${L1_FILTER ? 'AND category_l1 = ?' : ''}
      ORDER BY queued_at ASC
      LIMIT 1`,
    L1_FILTER ? [L1_FILTER] : []
  )
  if (claim.affectedRows === 0) return null
  const row = await q1(env,
    `SELECT * FROM scrape_jobs
      WHERE status = 'running'
        ${L1_FILTER ? 'AND category_l1 = ?' : ''}
      ORDER BY queued_at ASC
      LIMIT 1`,
    L1_FILTER ? [L1_FILTER] : []
  )
  return row
}

async function readDesiredState() {
  const row = await q1(env, `SELECT desired_state FROM scrape_worker_control WHERE id = 1`)
  return row?.desired_state ?? 'stopped'
}

function computeStatus({ shuttingDown, desiredState, activeCount }) {
  if (shuttingDown && activeCount === 0) return 'offline'
  if (shuttingDown)                       return 'draining'
  if (desiredState === 'stopped' && activeCount > 0) return 'draining'
  if (desiredState === 'stopped')         return 'idle'
  if (activeCount > 0)                    return 'online'
  return 'idle'
}

async function writeHeartbeat(status) {
  const currentJobs = JSON.stringify(
    [...active.entries()].map(([id, j]) => ({
      id,
      slug: j.slug,
      started_at: new Date(j.startedAt).toISOString(),
    }))
  )
  /* INSERT…ON DUPLICATE KEY UPDATE upserts on the worker_id PK so
     restarting the daemon with the same --worker-id reuses the row
     (started_at is refreshed to reflect the current boot). */
  await exec(env, `
    INSERT INTO scrape_worker_heartbeats
      (worker_id, hostname, status, started_at, last_seen_at,
       current_jobs, day_key, day_spend_usd,
       model, concurrency, poll_ms, daily_cap_usd, per_job_cap_usd, l1_filter)
    VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      status          = VALUES(status),
      started_at      = VALUES(started_at),
      last_seen_at    = NOW(),
      current_jobs    = VALUES(current_jobs),
      day_key         = VALUES(day_key),
      day_spend_usd   = VALUES(day_spend_usd),
      model           = VALUES(model),
      concurrency     = VALUES(concurrency),
      poll_ms         = VALUES(poll_ms),
      daily_cap_usd   = VALUES(daily_cap_usd),
      per_job_cap_usd = VALUES(per_job_cap_usd),
      l1_filter       = VALUES(l1_filter)
  `, [
    WORKER_ID, os.hostname(), status, startedAt,
    currentJobs, dayKey, daySpend,
    MODEL, CONCURRENCY, POLL_MS,
    DAILY_CAP_USD, PER_JOB_CAP_USD, L1_FILTER,
  ])
}

function logHeartbeatErr(err) {
  /* Throttle so a 10-minute DB outage doesn't flood stderr with one
     error per POLL_MS. Process keeps running — next heartbeat retries. */
  const now = Date.now()
  if (now - lastHeartbeatError > 30_000) {
    console.error('[worker] heartbeat write failed:', err.message)
    lastHeartbeatError = now
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
