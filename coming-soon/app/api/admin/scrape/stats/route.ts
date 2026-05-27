import { NextRequest } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import { query } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

const HEARTBEAT_FILE = path.resolve(process.cwd(), '.scrape-worker.heartbeat')
const STOP_FILE      = path.resolve(process.cwd(), '.scrape-worker.stop')

/* Reads the worker heartbeat sentinel — the scrape-worker process
   re-writes this file on every poll iteration. Fresh = online. Stale
   (>30s) or missing = offline. Falls back to nulls if the file can't
   be read (e.g. in production where the worker doesn't run). */
function readWorkerHeartbeat(): { online: boolean; lastBeatAt: string | null; stopRequested: boolean } {
  let lastBeatMs: number | null = null
  try {
    const stat = fs.statSync(HEARTBEAT_FILE)
    lastBeatMs = stat.mtimeMs
  } catch {}
  let stopRequested = false
  try { stopRequested = fs.existsSync(STOP_FILE) } catch {}
  return {
    online: lastBeatMs != null && Date.now() - lastBeatMs < 30_000,
    lastBeatAt: lastBeatMs != null ? new Date(lastBeatMs).toISOString() : null,
    stopRequested,
  }
}

/**
 * GET /api/admin/scrape/stats
 *
 * Aggregate counters for the top bar + Dashboards tab. Per-status counts,
 * per-L1 funnel, 7-day cost total, 7-day session count.
 *
 * Polled by the UI every few seconds so the top counter pills stay live.
 */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const [byStatus, byL1, recent, lastSession] = await Promise.all([
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

    const last = lastSession[0]
    /* Prefer the heartbeat file (rewritten every poll iteration) so an
       idle worker is still detected as online. Fall back to the
       last-session timestamp if the heartbeat file is unavailable (e.g.
       running on Vercel where the worker doesn't run). */
    const heartbeat = readWorkerHeartbeat()
    const lastSessionAlive = last
      ? Date.now() - new Date(last.started_at).getTime() < 5 * 60 * 1000
      : false
    const workerLikelyOnline = heartbeat.online || lastSessionAlive

    return Response.json({
      ok: true,
      status,
      l1,
      sevenDay,
      workerLikelyOnline,
      workerHeartbeatAt: heartbeat.lastBeatAt,
      workerStopRequested: heartbeat.stopRequested,
      lastActivityAt: last?.started_at ?? null,
    })
  } catch (err) {
    console.error('GET /scrape/stats:', err)
    return Response.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
