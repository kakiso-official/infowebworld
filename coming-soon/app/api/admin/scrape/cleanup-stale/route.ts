import { NextRequest } from 'next/server'
import { query, execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * POST /api/admin/scrape/cleanup-stale
 *
 * Manual trigger for the same stale-running recovery the worker runs on
 * boot. Useful when the user sees "4 listings in running state" but the
 * worker isn't running — they shouldn't have to start the worker just to
 * have it clean up its own mess.
 *
 * Three cases handled per row:
 *   1. Session missing or stuck 'running' > 30 min → re-queue + fail session
 *   2. Session already in a terminal state but job didn't catch up → sync
 *   3. Job 'running' with no session at all → re-queue
 */

interface StaleRow {
  job_id: number
  slug: string
  session_id: number | null
  session_status: string | null
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const staleAfterMin = 30

    const stale = await query<StaleRow>(`
      SELECT j.id AS job_id, j.slug,
             s.id AS session_id, s.status AS session_status
        FROM scrape_jobs j
        LEFT JOIN scrape_sessions s ON s.id = j.last_session_id
       WHERE j.status = 'running'
         AND (
           s.id IS NULL
           OR (s.status = 'running' AND s.started_at < DATE_SUB(NOW(), INTERVAL ? MINUTE))
           OR s.status IN ('success', 'review', 'failed', 'cancelled')
         )
    `, [staleAfterMin])

    if (!stale.length) {
      return Response.json({ ok: true, recovered: 0, details: [] })
    }

    const details: Array<{ slug: string; action: string }> = []
    for (const row of stale) {
      if (!row.session_id || row.session_status === 'running' || !row.session_status) {
        if (row.session_id) {
          await execute(`
            UPDATE scrape_sessions
               SET status = 'failed',
                   error_summary = CONCAT('[abandoned] ', COALESCE(error_summary, '')),
                   finished_at = NOW(),
                   duration_ms = TIMESTAMPDIFF(MICROSECOND, started_at, NOW()) / 1000
             WHERE id = ? AND status = 'running'
          `, [row.session_id])
        }
        await execute(
          `UPDATE scrape_jobs SET status = 'queued' WHERE id = ? AND status = 'running'`,
          [row.job_id]
        )
        details.push({ slug: row.slug, action: 're-queued' })
      } else {
        await execute(
          `UPDATE scrape_jobs SET status = ? WHERE id = ? AND status = 'running'`,
          [row.session_status, row.job_id]
        )
        details.push({ slug: row.slug, action: `synced → ${row.session_status}` })
      }
    }

    return Response.json({ ok: true, recovered: details.length, details })
  } catch (err) {
    console.error('POST /scrape/cleanup-stale:', err)
    return Response.json({
      ok: false,
      error: err instanceof Error ? err.message : 'Internal error',
    }, { status: 500 })
  }
}
