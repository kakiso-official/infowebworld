import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * POST /api/admin/scrape/jobs/[id]/requeue
 *
 * Sets job status back to 'queued' so the worker picks it up again. Used
 * by the "Scrape" / "Re-scrape" buttons in the UI. Returns the updated
 * job row. No-op if the job is already running.
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

    const existing = await queryOne<{ status: string }>(`SELECT status FROM scrape_jobs WHERE id = ?`, [jobId])
    if (!existing) {
      return Response.json({ ok: false, error: 'Job not found' }, { status: 404 })
    }
    if (existing.status === 'running') {
      return Response.json({ ok: false, error: 'Job is already running' }, { status: 409 })
    }

    await execute(`UPDATE scrape_jobs SET status = 'queued' WHERE id = ?`, [jobId])
    return Response.json({ ok: true })
  } catch (err) {
    console.error('POST /scrape/jobs/[id]/requeue:', err)
    return Response.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
