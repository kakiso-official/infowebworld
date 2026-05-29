import { NextRequest } from 'next/server'
import { query, execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * POST /api/admin/scrape/worker/stop
 *
 * Flips scrape_worker_control.desired_state to 'stopped'. The worker
 * daemon stays alive (PM2 manages the process) but stops claiming new
 * jobs within one poll iteration. In-flight jobs are allowed to finish.
 *
 * Click Start in the UI to resume — no SSH / restart needed.
 */
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    await execute(`
      INSERT INTO scrape_worker_control (id, desired_state, updated_by, note)
      VALUES (1, 'stopped', ?, 'Stopped from admin UI')
      ON DUPLICATE KEY UPDATE
        desired_state = 'stopped',
        updated_by = VALUES(updated_by),
        note = VALUES(note)
    `, [guard.displayName])

    const workers = await query<{ worker_id: string; current_jobs: unknown }>(`
      SELECT worker_id, current_jobs FROM scrape_worker_heartbeats
       WHERE last_seen_at >= DATE_SUB(NOW(), INTERVAL 60 SECOND)
    `)

    const inFlight = workers.reduce((sum, w) => {
      try {
        const raw = typeof w.current_jobs === 'string' ? JSON.parse(w.current_jobs) : w.current_jobs
        return sum + (Array.isArray(raw) ? raw.length : 0)
      } catch { return sum }
    }, 0)

    return Response.json({
      ok: true,
      workersOnline: workers.length,
      inFlight,
      message: workers.length === 0
        ? 'Stop signal sent, but no worker process appears online.'
        : inFlight > 0
          ? `Stop signal sent — worker will finish ${inFlight} in-flight job${inFlight === 1 ? '' : 's'} then go idle.`
          : 'Stop signal sent — worker is now idle.',
    })
  } catch (err) {
    console.error('POST /scrape/worker/stop:', err)
    return Response.json({
      ok: false,
      error: err instanceof Error ? err.message : 'Failed to update worker control',
    }, { status: 500 })
  }
}
