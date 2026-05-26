import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/scrape/sessions/[id]
 *
 * Returns the session row, its parsed extraction + citations + critique,
 * and the ordered list of step rows. This is what the Gantt timeline view
 * polls every few seconds while a session is 'running'.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const { id } = await params
    const sessionId = Number(id)
    if (!Number.isFinite(sessionId)) {
      return Response.json({ ok: false, error: 'Invalid session id' }, { status: 400 })
    }

    const session = await queryOne<{
      id: number; scrape_job_id: number; status: string
      total_steps: number; failed_steps: number
      total_input_tokens: number; total_output_tokens: number; total_cost_usd: number
      pages_fetched: number
      extracted_json: string | null; source_citations: string | null; critique_flags: string | null
      screenshot_home_url: string | null; screenshot_secondary_url: string | null
      llm_provider: string | null; model_version: string | null
      started_at: string; finished_at: string | null; duration_ms: number | null
      error_summary: string | null; applied_at: string | null; applied_by: string | null
    }>(`SELECT id, scrape_job_id, status,
              total_steps, failed_steps,
              total_input_tokens, total_output_tokens, total_cost_usd,
              pages_fetched,
              extracted_json, source_citations, critique_flags,
              screenshot_home_url, screenshot_secondary_url,
              llm_provider, model_version,
              started_at, finished_at, duration_ms,
              error_summary, applied_at, applied_by
         FROM scrape_sessions WHERE id = ?`, [sessionId])

    if (!session) return Response.json({ ok: false, error: 'Session not found' }, { status: 404 })

    const steps = await query<{
      id: number; step_name: string; step_index: number; step_type: string; status: string
      input_url: string | null; input_prompt_preview: string | null
      output_status_code: number | null; output_bytes: number | null; output_excerpt: string | null
      input_tokens: number | null; output_tokens: number | null; cost_usd: number | null
      error_message: string | null
      started_at: string; finished_at: string | null; duration_ms: number | null
    }>(`SELECT id, step_name, step_index, step_type, status,
              input_url, input_prompt_preview,
              output_status_code, output_bytes, output_excerpt,
              input_tokens, output_tokens, cost_usd,
              error_message,
              started_at, finished_at, duration_ms
         FROM scrape_session_steps
        WHERE session_id = ?
        ORDER BY step_index ASC`, [sessionId])

    return Response.json({
      ok: true,
      session: {
        ...session,
        total_cost_usd: Number(session.total_cost_usd ?? 0),
        extracted: parseJson(session.extracted_json),
        citations: parseJson(session.source_citations),
        critique: parseJson(session.critique_flags),
      },
      steps: steps.map(s => ({
        ...s,
        cost_usd: s.cost_usd != null ? Number(s.cost_usd) : null,
      })),
    })
  } catch (err) {
    console.error('GET /scrape/sessions/[id]:', err)
    return Response.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

function parseJson(v: string | null) {
  if (!v) return null
  try { return JSON.parse(v) } catch { return null }
}
