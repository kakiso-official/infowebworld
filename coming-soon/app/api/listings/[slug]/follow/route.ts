import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { requireUser } from '@/lib/user-auth'
import { notifyOwnerOnFollow } from '@/lib/notify-owner'

/* Resolve the listing's numeric id from a slug (single indexed lookup). */
async function resolveListingId(slug: string): Promise<number | null> {
  const row = await queryOne<{ id: number }>(
    'SELECT id FROM submissions WHERE slug = ? LIMIT 1',
    [slug]
  )
  return row ? Number(row.id) : null
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const auth = await requireUser(request)
  if (auth instanceof Response) return auth

  const { slug } = await ctx.params
  const listingId = await resolveListingId(slug)
  if (!listingId) return Response.json({ ok: false, error: 'Listing not found' }, { status: 404 })

  try {
    /* INSERT IGNORE returns affectedRows=1 for a new row, 0 for a duplicate
       (re-follow without a prior unfollow). Only the FIRST follow notifies
       the owner so they don't get re-emailed if the user toggles. */
    const result = await execute(
      'INSERT IGNORE INTO listing_follows (listing_id, user_id) VALUES (?, ?)',
      [listingId, auth.id]
    )
    if (result.affectedRows > 0) {
      await notifyOwnerOnFollow({ listingId, actorId: auth.id })
    }
    return Response.json({ ok: true })
  } catch (err) {
    console.error('POST /api/listings/[slug]/follow error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const auth = await requireUser(request)
  if (auth instanceof Response) return auth

  const { slug } = await ctx.params
  const listingId = await resolveListingId(slug)
  if (!listingId) return Response.json({ ok: false, error: 'Listing not found' }, { status: 404 })

  try {
    await execute(
      'DELETE FROM listing_follows WHERE listing_id = ? AND user_id = ?',
      [listingId, auth.id]
    )
    return Response.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/listings/[slug]/follow error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
