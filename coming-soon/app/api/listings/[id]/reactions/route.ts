import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'
import { requireUser } from '@/lib/user-auth'

/* POST: like or dislike. Body: { kind: 'like' | 'dislike' }.
   Switches an existing reaction kind in place. */
export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(request)
  if (auth instanceof Response) return auth

  const { id } = await ctx.params
  const listingId = Number(id)
  if (!Number.isFinite(listingId) || listingId <= 0) {
    return Response.json({ ok: false, error: 'Invalid listing id' }, { status: 400 })
  }

  let body: { kind?: string }
  try { body = await request.json() } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }
  const kind = body.kind
  if (kind !== 'like' && kind !== 'dislike') {
    return Response.json({ ok: false, error: 'Invalid kind' }, { status: 400 })
  }

  try {
    await execute(
      `INSERT INTO listing_reactions (listing_id, user_id, kind)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE kind = VALUES(kind)`,
      [listingId, auth.id, kind]
    )
    return Response.json({ ok: true })
  } catch (err) {
    console.error('POST /api/listings/[id]/reactions error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

/* DELETE: remove your reaction (clears like or dislike). */
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
      'DELETE FROM listing_reactions WHERE listing_id = ? AND user_id = ?',
      [listingId, auth.id]
    )
    return Response.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/listings/[id]/reactions error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
