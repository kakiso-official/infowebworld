import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/scrape/worker/config
 * POST /api/admin/scrape/worker/config { l1_filter: string | null }
 *
 * Reads/writes scraper_runtime_config (single row, id=1). The worker
 * polls this row on every iteration so the admin UI dropdown takes
 * effect within ~10s without restarting the worker.
 *
 * Pass l1_filter=null (or empty string) to clear the focus and claim
 * jobs from any L1 again.
 */

const VALID_L1 = new Set([
  'ai-and-ml',
  'software-and-saas',
  'it-services-and-agencies',
  'professional-services',
  'startups',
  'local-businesses',
])

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const row = await queryOne<{ l1_filter: string | null; updated_at: string; updated_by: string | null }>(
      `SELECT l1_filter, updated_at, updated_by FROM scraper_runtime_config WHERE id = 1`
    )
    return Response.json({
      ok: true,
      l1_filter: row?.l1_filter ?? null,
      updated_at: row?.updated_at ?? null,
      updated_by: row?.updated_by ?? null,
    })
  } catch (err) {
    console.error('GET /scrape/worker/config:', err)
    return Response.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const body = await request.json().catch(() => ({})) as { l1_filter?: string | null }
    const raw = body.l1_filter
    /* Treat empty string the same as null — clearing the dropdown should
       drop the filter, not write "" which would never match any L1. */
    const value = raw == null || raw === '' ? null : String(raw).trim()
    if (value !== null && !VALID_L1.has(value)) {
      return Response.json({
        ok: false,
        error: `Unknown L1 "${value}". Valid: ${[...VALID_L1].join(', ')}`,
      }, { status: 400 })
    }

    await execute(`
      INSERT INTO scraper_runtime_config (id, l1_filter, updated_by)
      VALUES (1, ?, ?)
      ON DUPLICATE KEY UPDATE
        l1_filter = VALUES(l1_filter),
        updated_by = VALUES(updated_by)
    `, [value, guard.displayName])

    return Response.json({ ok: true, l1_filter: value })
  } catch (err) {
    console.error('POST /scrape/worker/config:', err)
    return Response.json({
      ok: false,
      error: err instanceof Error ? err.message : 'Internal error',
    }, { status: 500 })
  }
}
