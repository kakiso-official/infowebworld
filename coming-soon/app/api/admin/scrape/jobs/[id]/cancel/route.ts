import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * POST /api/admin/scrape/jobs/[id]/cancel
 *
 * Sets scrape_jobs.status='cancelled'. The worker, on its next poll,
 * detects this for jobs in its active map and fires AbortController.abort()
 * — the pipeline catches the AbortError at the next step boundary, writes
 * the session as 'cancelled', and exits.
 *
 * For jobs not currently in flight (worker not started, or job hasn't
 * been claimed yet), this just marks them cancelled directly.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const { id } = await params
    const jobId = Number(id)
    if (!Number.isFinite(jobId)) {
      return Response.json({ ok: false, error: 'Invalid job id' }, { status: 400 })
    }

    const existing = await queryOne<{ status: string; slug: string }>(
      `SELECT status, slug FROM scrape_jobs WHERE id = ?`,
      [jobId]
    )
    if (!existing) return Response.json({ ok: false, error: 'Job not found' }, { status: 404 })

    if (!['queued', 'running'].includes(existing.status)) {
      return Response.json({
        ok: false,
        error: `Cannot cancel a job in status "${existing.status}". Only queued or running jobs can be cancelled.`,
      }, { status: 409 })
    }

    await execute(
      `UPDATE scrape_jobs SET status = 'cancelled' WHERE id = ? AND status IN ('queued','running')`,
      [jobId]
    )

    return Response.json({
      ok: true,
      slug: existing.slug,
      previousStatus: existing.status,
      message: existing.status === 'running'
        ? 'Cancel signal sent. Worker will abort at the next step boundary (~10s).'
        : 'Job removed from the queue.',
    })
  } catch (err) {
    console.error('POST /scrape/jobs/[id]/cancel:', err)
    return Response.json({
      ok: false,
      error: err instanceof Error ? err.message : 'Internal error',
    }, { status: 500 })
  }
}
