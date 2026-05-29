import { NextRequest } from 'next/server'
import { query, execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * POST /api/admin/scrape/worker/start
 *
 * Flips scrape_worker_control.desired_state to 'running'. The long-running
 * worker daemon (running under PM2 on the Linux server) polls this row
 * each iteration and resumes claiming queued jobs within ~10s.
 *
 * Returns the count of fresh worker heartbeats so the UI can surface
 * a warning if no worker process is actually online to act on the signal.
 */
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    await execute(`
      INSERT INTO scrape_worker_control (id, desired_state, updated_by, note)
      VALUES (1, 'running', ?, 'Started from admin UI')
      ON DUPLICATE KEY UPDATE
        desired_state = 'running',
        updated_by = VALUES(updated_by),
        note = VALUES(note)
    `, [guard.displayName])

    const workers = await query<{ worker_id: string }>(`
      SELECT worker_id FROM scrape_worker_heartbeats
       WHERE last_seen_at >= DATE_SUB(NOW(), INTERVAL 60 SECOND)
    `)

    return Response.json({
      ok: true,
      workersOnline: workers.length,
      message: workers.length > 0
        ? `Start signal sent — ${workers.length} worker${workers.length === 1 ? '' : 's'} will resume within ~10s.`
        : 'Start signal sent, but no worker process is currently online. Make sure PM2 is running the worker on your server.',
    })
  } catch (err) {
    console.error('POST /scrape/worker/start:', err)
    return Response.json({
      ok: false,
      error: err instanceof Error ? err.message : 'Failed to update worker control',
    }, { status: 500 })
  }
}
