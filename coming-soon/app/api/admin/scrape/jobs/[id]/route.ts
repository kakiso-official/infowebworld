import { NextRequest } from 'next/server'
import { query, queryOne, execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/scrape/jobs/[id]
 *
 * Returns: the job row, parsed current extraction, source citations,
 * and the list of sessions (newest first).
 */
export async function GET(
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

    const job = await queryOne<{
      id: number; slug: string; company_name: string | null; website: string
      category_l1: string; category_slug: string | null; status: string
      total_sessions: number; total_cost_usd: number; last_session_id: number | null
      current_extracted_json: string | null; current_source_citations: string | null
      current_screenshot_home_url: string | null; current_screenshot_secondary_url: string | null
      queued_at: string; applied_at: string | null
    }>(`SELECT id, slug, company_name, website, category_l1, category_slug, status,
              total_sessions, total_cost_usd, last_session_id,
              current_extracted_json, current_source_citations,
              current_screenshot_home_url, current_screenshot_secondary_url,
              queued_at, applied_at
         FROM scrape_jobs WHERE id = ?`, [jobId])

    if (!job) return Response.json({ ok: false, error: 'Job not found' }, { status: 404 })

    const sessions = await query<{
      id: number; status: string; started_at: string; finished_at: string | null
      duration_ms: number | null; total_steps: number; failed_steps: number
      total_input_tokens: number; total_output_tokens: number; total_cost_usd: number
      pages_fetched: number; llm_provider: string | null; model_version: string | null
      applied_at: string | null; error_summary: string | null
    }>(`SELECT id, status, started_at, finished_at, duration_ms,
               total_steps, failed_steps, total_input_tokens, total_output_tokens, total_cost_usd,
               pages_fetched, llm_provider, model_version, applied_at, error_summary
          FROM scrape_sessions
         WHERE scrape_job_id = ?
         ORDER BY started_at DESC
         LIMIT 50`, [jobId])

    return Response.json({
      ok: true,
      job: {
        id: job.id,
        slug: job.slug,
        company_name: job.company_name,
        website: job.website,
        category_l1: job.category_l1,
        category_slug: job.category_slug,
        status: job.status,
        total_sessions: job.total_sessions,
        total_cost_usd: Number(job.total_cost_usd ?? 0),
        last_session_id: job.last_session_id,
        screenshot_home_url: job.current_screenshot_home_url,
        screenshot_secondary_url: job.current_screenshot_secondary_url,
        extracted: parseJson(job.current_extracted_json),
        citations: parseJson(job.current_source_citations),
        queued_at: String(job.queued_at),
        applied_at: job.applied_at ? String(job.applied_at) : null,
      },
      sessions: sessions.map(s => ({
        ...s,
        total_cost_usd: Number(s.total_cost_usd ?? 0),
      })),
    })
  } catch (err) {
    console.error('GET /scrape/jobs/[id]:', err)
    return Response.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/scrape/jobs/[id]
 * Body: { status?, category_slug?, ... }
 *
 * Limited field updates. Used by "Requeue" + "Skip" + "Mark applied" buttons.
 */
export async function PATCH(
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
    const body = await request.json() as Record<string, unknown>

    const allowed = ['status', 'category_l1', 'category_slug', 'company_name', 'website'] as const
    const sets: string[] = []
    const vals: unknown[] = []
    for (const k of allowed) {
      if (body[k] !== undefined) {
        sets.push(`${k} = ?`)
        vals.push(body[k])
      }
    }
    if (!sets.length) {
      return Response.json({ ok: false, error: 'no allowed fields supplied' }, { status: 400 })
    }
    vals.push(jobId)

    await execute(`UPDATE scrape_jobs SET ${sets.join(', ')} WHERE id = ?`, vals)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('PATCH /scrape/jobs/[id]:', err)
    return Response.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

function parseJson(v: string | null) {
  if (!v) return null
  try { return JSON.parse(v) } catch { return null }
}
