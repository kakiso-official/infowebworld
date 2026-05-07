import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { requireUser } from '@/lib/user-auth'

async function resolveListingId(slug: string): Promise<number | null> {
  const row = await queryOne<{ id: number }>(
    'SELECT id FROM submissions WHERE slug = ? LIMIT 1',
    [slug]
  )
  return row ? Number(row.id) : null
}

/* GET /api/listings/[slug]/reviews/me — return the authed user's own review
   (or null if they haven't written one). Drives the prefill in WriteReviewModal
   so editors don't have to retype rating/title/body. */
export async function GET(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const auth = await requireUser(request)
  if (auth instanceof Response) return auth

  const { slug } = await ctx.params
  const listingId = await resolveListingId(slug)
  if (!listingId) return Response.json({ ok: false, error: 'Listing not found' }, { status: 404 })

  try {
    const row = await queryOne<{
      id: number; rating: number; title: string; body: string; created_at: string
    }>(
      `SELECT id, rating, title, body, created_at
         FROM reviews WHERE listing_id = ? AND user_id = ? LIMIT 1`,
      [listingId, auth.id]
    )
    return Response.json({ ok: true, review: row || null })
  } catch (err) {
    console.error('GET /api/listings/[slug]/reviews/me error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

/* DELETE /api/listings/[slug]/reviews/me — remove the authed user's review. */
export async function DELETE(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const auth = await requireUser(request)
  if (auth instanceof Response) return auth

  const { slug } = await ctx.params
  const listingId = await resolveListingId(slug)
  if (!listingId) return Response.json({ ok: false, error: 'Listing not found' }, { status: 404 })

  try {
    await execute(
      'DELETE FROM reviews WHERE listing_id = ? AND user_id = ?',
      [listingId, auth.id]
    )
    return Response.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/listings/[slug]/reviews/me error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
