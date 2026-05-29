import { NextRequest } from 'next/server'
import { query } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

interface WorkerRow {
  worker_id: string
  hostname: string | null
  status: string
  started_at: string
  last_seen_at: string
  current_jobs: unknown
  day_spend_usd: number | string
  model: string | null
  concurrency: number
  daily_cap_usd: number | string
}

interface ControlRow {
  desired_state: 'running' | 'stopped'
  updated_at: string
  updated_by: string | null
  note: string | null
}

interface CurrentJob {
  id: number
  slug: string
  started_at: string
}

/**
 * GET /api/admin/scrape/stats
 *
 * Top-bar counters + per-L1 funnel + 7-day spend + worker fleet status.
 *
 * Worker state lives in scrape_worker_control (desired_state) and
 * scrape_worker_heartbeats (per-process liveness). A heartbeat fresher
 * than 60s = process alive. Polled by the UI every 4s so the dot stays
 * live; cheap query — both tables are tiny (1 control row, ~1 row per
 * worker process).
 */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const [byStatus, byL1, recent, lastSession, controlRows, workerRows] = await Promise.all([
      query<{ status: string; count: number }>(`
        SELECT status, COUNT(*) AS count FROM scrape_jobs GROUP BY status
      `),
      query<{ category_l1: string; status: string; count: number }>(`
        SELECT category_l1, status, COUNT(*) AS count
          FROM scrape_jobs
         GROUP BY category_l1, status
      `),
      query<{ days_ago: number; cost: number; sessions: number }>(`
        SELECT DATEDIFF(NOW(), started_at) AS days_ago,
               SUM(total_cost_usd) AS cost,
               COUNT(*) AS sessions
          FROM scrape_sessions
         WHERE started_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         GROUP BY days_ago
         ORDER BY days_ago ASC
      `),
      query<{ started_at: string; status: string }>(`
        SELECT started_at, status FROM scrape_sessions
         ORDER BY started_at DESC LIMIT 1
      `),
      query<ControlRow>(`
        SELECT desired_state, updated_at, updated_by, note
          FROM scrape_worker_control WHERE id = 1
      `),
      query<WorkerRow>(`
        SELECT worker_id, hostname, status, started_at, last_seen_at,
               current_jobs, day_spend_usd, model, concurrency, daily_cap_usd
          FROM scrape_worker_heartbeats
         WHERE last_seen_at >= DATE_SUB(NOW(), INTERVAL 10 MINUTE)
         ORDER BY last_seen_at DESC
      `),
    ])

    const status: Record<string, number> = { queued: 0, running: 0, review: 0, applied: 0, failed: 0, skipped: 0 }
    for (const r of byStatus) status[r.status] = Number(r.count)

    const l1: Record<string, Record<string, number>> = {}
    for (const r of byL1) {
      if (!l1[r.category_l1]) l1[r.category_l1] = {}
      l1[r.category_l1][r.status] = Number(r.count)
    }

    const sevenDay = recent.reduce((acc, r) => ({
      cost: acc.cost + Number(r.cost ?? 0),
      sessions: acc.sessions + Number(r.sessions ?? 0),
    }), { cost: 0, sessions: 0 })

    const desiredState: 'running' | 'stopped' = controlRows[0]?.desired_state ?? 'stopped'

    /* A worker that crashed without writing the final 'offline' beat
       will leave a stale row with status='online'. Treat any row with
       last_seen_at > 60s ago as offline regardless of its self-reported
       status. */
    const now = Date.now()
    const workers = workerRows.map(w => {
      const lastSeenMs = new Date(w.last_seen_at).getTime()
      const ageSec = Math.floor((now - lastSeenMs) / 1000)
      const alive = ageSec < 60
      let parsedJobs: CurrentJob[] = []
      try {
        const raw = typeof w.current_jobs === 'string' ? JSON.parse(w.current_jobs) : w.current_jobs
        if (Array.isArray(raw)) parsedJobs = raw as CurrentJob[]
      } catch {}
      return {
        workerId: w.worker_id,
        hostname: w.hostname,
        status: alive ? w.status : 'offline',
        startedAt: w.started_at,
        lastSeenAt: w.last_seen_at,
        ageSec,
        alive,
        currentJobs: parsedJobs,
        daySpendUsd: Number(w.day_spend_usd ?? 0),
        model: w.model,
        concurrency: Number(w.concurrency ?? 1),
        dailyCapUsd: Number(w.daily_cap_usd ?? 0),
      }
    })

    const aliveWorkers = workers.filter(w => w.alive)
    const workerLikelyOnline = aliveWorkers.length > 0

    return Response.json({
      ok: true,
      status,
      l1,
      sevenDay,
      /* Legacy fields preserved so older UI bundles keep rendering during
         deploys. The new UI uses desiredState + workers[] directly. */
      workerLikelyOnline,
      workerHeartbeatAt: aliveWorkers[0]?.lastSeenAt ?? null,
      workerStopRequested: desiredState === 'stopped',
      lastActivityAt: lastSession[0]?.started_at ?? null,
      desiredState,
      workers: aliveWorkers,
    })
  } catch (err) {
    console.error('GET /scrape/stats:', err)
    return Response.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
