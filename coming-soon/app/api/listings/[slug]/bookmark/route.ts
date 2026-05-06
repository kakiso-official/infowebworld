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

export async function POST(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const auth = await requireUser(request)
  if (auth instanceof Response) return auth

  const { slug } = await ctx.params
  const listingId = await resolveListingId(slug)
  if (!listingId) return Response.json({ ok: false, error: 'Listing not found' }, { status: 404 })

  try {
    await execute(
      'INSERT IGNORE INTO listing_bookmarks (listing_id, user_id) VALUES (?, ?)',
      [listingId, auth.id]
    )
    return Response.json({ ok: true })
  } catch (err) {
    console.error('POST /api/listings/[slug]/bookmark error:', err)
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
      'DELETE FROM listing_bookmarks WHERE listing_id = ? AND user_id = ?',
      [listingId, auth.id]
    )
    return Response.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/listings/[slug]/bookmark error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
