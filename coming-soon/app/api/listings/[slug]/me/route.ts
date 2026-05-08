import { NextRequest } from 'next/server'
import { queryOne } from '@/lib/db'
import { getUserFromRequest } from '@/lib/user-auth'

/**
 * GET /api/listings/[slug]/me
 *
 * Returns the *requesting user*'s personal state on this listing — used by
 * the client-side hydration step on /company/[slug]. The page itself is
 * statically cached and identical for everyone (anon or authed); this
 * endpoint is what fills in "am I following?", "did I like it?", "have I
 * already reviewed?", plus the Reviewing-as identity for the review modal.
 *
 * Always responds with 200 + a fully shaped payload — anon visitors get
 * isAuthed=false and the rest defaulted, so the client doesn't need to
 * branch on status.
 *
 * Cache-Control: no-store — this is per-user, per-cookie data; never edge
 * cache it.
 */

interface MePayload {
  isAuthed: boolean
  isFollowing: boolean
  reaction: 'like' | 'dislike' | null
  isBookmarked: boolean
  hasReviewed: boolean
  currentUser: { name: string | null; email: string | null; avatarUrl: string | null } | null
}

const ANON: MePayload = {
  isAuthed: false,
  isFollowing: false,
  reaction: null,
  isBookmarked: false,
  hasReviewed: false,
  currentUser: null,
}

const NO_STORE: HeadersInit = {
  'Cache-Control': 'private, no-store',
  'Content-Type': 'application/json; charset=utf-8',
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params

  const user = await getUserFromRequest(request)
  if (!user) {
    return new Response(JSON.stringify({ ok: true, ...ANON }), { headers: NO_STORE })
  }

  /* Resolve listing id by slug. Returning ANON-shape on miss avoids a 404
     forcing the client to special-case the "listing was deleted" race. */
  const listing = await queryOne<{ id: number }>(
    'SELECT id FROM submissions WHERE slug = ? LIMIT 1',
    [slug]
  )
  if (!listing) {
    return new Response(JSON.stringify({
      ok: true,
      ...ANON,
      isAuthed: true,
      currentUser: { name: user.name, email: user.email, avatarUrl: user.avatarUrl },
    }), { headers: NO_STORE })
  }

  /* Single subselect query — returns one row of flags. Same shape used in
     the old SSR path on /company/[slug]/page.tsx. */
  const stateRow = await queryOne<{
    following: number
    reaction: 'like' | 'dislike' | null
    bookmarked: number
    reviewed: number
  }>(
    `SELECT
       (SELECT 1 FROM listing_follows  WHERE listing_id = ? AND user_id = ?) AS following,
       (SELECT kind FROM listing_reactions WHERE listing_id = ? AND user_id = ?) AS reaction,
       (SELECT 1 FROM listing_bookmarks WHERE listing_id = ? AND user_id = ?) AS bookmarked,
       (SELECT 1 FROM reviews          WHERE listing_id = ? AND user_id = ?) AS reviewed`,
    [
      listing.id, user.id,
      listing.id, user.id,
      listing.id, user.id,
      listing.id, user.id,
    ]
  )

  const payload: MePayload = {
    isAuthed: true,
    isFollowing: Boolean(stateRow?.following),
    reaction: stateRow?.reaction || null,
    isBookmarked: Boolean(stateRow?.bookmarked),
    hasReviewed: Boolean(stateRow?.reviewed),
    currentUser: { name: user.name, email: user.email, avatarUrl: user.avatarUrl },
  }

  return new Response(JSON.stringify({ ok: true, ...payload }), { headers: NO_STORE })
}
