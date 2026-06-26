import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { notifyOwnerOnReview } from '@/lib/notify-owner'

/* TEMP: admin-action notification emails are paused. Flip to `true` to restore. */
const SEND_ADMIN_EMAILS: boolean = false

/**
 * POST /api/admin/reviews/[id]/approve
 * Flip the review to status='approved'. The listing owner is emailed *here*
 * (not when the visitor submits) — so the owner finds out the same time the
 * review becomes publicly visible. Public visibility itself happens on the
 * next /company/[slug] revalidation (auto-48h or admin manual rebuild).
 */
export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  const { id } = await ctx.params
  const reviewId = Number.parseInt(id, 10)
  if (!Number.isFinite(reviewId) || reviewId <= 0) {
    return Response.json({ ok: false, error: 'Invalid review id' }, { status: 400 })
  }

  /* Pull the full row before flipping so we have what notifyOwnerOnReview
     needs (listing_id, user_id, rating, title, body) without a second
     round-trip. We also use it to skip re-notifying if the review is
     already approved (idempotent re-approve clicks). */
  const row = await queryOne<{
    id: number
    listing_id: number
    user_id: number
    rating: number
    title: string
    body: string
    status: 'pending' | 'approved' | 'rejected'
  }>(
    `SELECT id, listing_id, user_id, rating, title, body, status
       FROM reviews WHERE id = ? LIMIT 1`,
    [reviewId]
  )
  if (!row) return Response.json({ ok: false, error: 'Review not found' }, { status: 404 })

  const wasAlreadyApproved = row.status === 'approved'

  try {
    await execute(
      `UPDATE reviews SET status = 'approved', updated_at = NOW() WHERE id = ?`,
      [reviewId]
    )
    /* Notify only on first approval — re-approving an already-approved
       review (e.g., admin double-click) shouldn't re-spam the owner. */
    if (SEND_ADMIN_EMAILS && !wasAlreadyApproved) {
      await notifyOwnerOnReview({
        listingId: row.listing_id,
        reviewerId: row.user_id,
        rating: row.rating,
        title: row.title,
        body: row.body,
      })
    }
    return Response.json({ ok: true, id: reviewId, status: 'approved' })
  } catch (err) {
    console.error('POST /api/admin/reviews/[id]/approve error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
