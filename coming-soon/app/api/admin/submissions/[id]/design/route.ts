import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * PATCH /api/admin/submissions/[id]/design — admin-only design switch for a
 * local-business listing.
 *
 * Updates ONLY submissions.lb_design_mode. Status and every other field are
 * left untouched (no forced re-moderation, no count changes).
 *
 *   'yelp'    = Yelp-style LocalBusinessCard + LocalBusinessProfilePage (default)
 *   'classic' = standard listing card + the /profile CompanyDetailPage
 *
 * Only meaningful for listings in the local-businesses sector — the render
 * branches ignore the column elsewhere. `id` may be the numeric pk or the uuid.
 * Body: { mode: 'yelp' | 'classic' }.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const { id: pathId } = await params
    const body = await request.json().catch(() => ({}))
    const mode = body.mode === 'classic' ? 'classic' : body.mode === 'yelp' ? 'yelp' : null
    if (!mode) {
      return Response.json({ error: "mode must be 'yelp' or 'classic'" }, { status: 400 })
    }

    const isUuid = /^[0-9a-f]{8}-/i.test(pathId)
    const row = await queryOne<{ id: number }>(
      isUuid
        ? 'SELECT id FROM submissions WHERE uuid = ? LIMIT 1'
        : 'SELECT id FROM submissions WHERE id = ? LIMIT 1',
      [pathId]
    )
    if (!row) return Response.json({ error: 'Not found' }, { status: 404 })

    await execute(
      'UPDATE submissions SET lb_design_mode = ?, updated_at = NOW() WHERE id = ?',
      [mode, row.id]
    )

    return Response.json({ ok: true, mode })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (/Unknown column.*lb_design_mode/.test(msg)) {
      return Response.json(
        { error: 'Run database/migration-lb-design-mode.sql first (lb_design_mode column missing).' },
        { status: 400 }
      )
    }
    console.error('PATCH /api/admin/submissions/[id]/design error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
