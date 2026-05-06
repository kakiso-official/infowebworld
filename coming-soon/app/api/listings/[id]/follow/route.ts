import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'
import { requireUser } from '@/lib/user-auth'

/* POST: follow this listing. Idempotent via UNIQUE(listing_id, user_id). */
export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(request)
  if (auth instanceof Response) return auth

  const { id } = await ctx.params
  const listingId = Number(id)
  if (!Number.isFinite(listingId) || listingId <= 0) {
    return Response.json({ ok: false, error: 'Invalid listing id' }, { status: 400 })
  }

  try {
    await execute(
      'INSERT IGNORE INTO listing_follows (listing_id, user_id) VALUES (?, ?)',
      [listingId, auth.id]
    )
    return Response.json({ ok: true })
  } catch (err) {
    console.error('POST /api/listings/[id]/follow error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

/* DELETE: unfollow. */
export async function DELETE(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(request)
  if (auth instanceof Response) return auth

  const { id } = await ctx.params
  const listingId = Number(id)
  if (!Number.isFinite(listingId) || listingId <= 0) {
    return Response.json({ ok: false, error: 'Invalid listing id' }, { status: 400 })
  }

  try {
    await execute(
      'DELETE FROM listing_follows WHERE listing_id = ? AND user_id = ?',
      [listingId, auth.id]
    )
    return Response.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/listings/[id]/follow error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
