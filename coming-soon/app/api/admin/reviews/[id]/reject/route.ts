import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * POST /api/admin/reviews/[id]/reject
 * Flip the review to status='rejected'. The row stays in the DB so the
 * reviewer can re-edit + resubmit (which sets it back to 'pending'). No
 * owner notification.
 */
export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  const { id } = await ctx.params
  const reviewId = Number.parseInt(id, 10)
  if (!Number.isFinite(reviewId) || reviewId <= 0) {
    return Response.json({ ok: false, error: 'Invalid review id' }, { status: 400 })
  }

  const row = await queryOne<{ id: number }>(
    'SELECT id FROM reviews WHERE id = ? LIMIT 1',
    [reviewId]
  )
  if (!row) return Response.json({ ok: false, error: 'Review not found' }, { status: 404 })

  try {
    await execute(
      `UPDATE reviews SET status = 'rejected', updated_at = NOW() WHERE id = ?`,
      [reviewId]
    )
    return Response.json({ ok: true, id: reviewId, status: 'rejected' })
  } catch (err) {
    console.error('POST /api/admin/reviews/[id]/reject error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
