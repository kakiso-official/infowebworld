import { NextRequest } from 'next/server'
import { execute, query, queryOne } from '@/lib/db'
import { requireUser } from '@/lib/user-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'

async function resolveListingId(slug: string): Promise<number | null> {
  const row = await queryOne<{ id: number }>(
    'SELECT id FROM submissions WHERE slug = ? LIMIT 1',
    [slug]
  )
  return row ? Number(row.id) : null
}

/* GET: list approved reviews for this listing (newest first). */
export async function GET(_request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const listingId = await resolveListingId(slug)
  if (!listingId) return Response.json({ ok: false, error: 'Listing not found' }, { status: 404 })

  try {
    const rows = await query(
      `SELECT r.id, r.rating, r.title, r.body, r.created_at,
              u.name AS user_name, u.avatar_url AS user_avatar_url
         FROM reviews r
         LEFT JOIN business_users u ON u.id = r.user_id
        WHERE r.listing_id = ? AND r.status = 'approved'
        ORDER BY r.created_at DESC
        LIMIT 50`,
      [listingId]
    )
    return Response.json({ ok: true, reviews: rows })
  } catch (err) {
    console.error('GET /api/listings/[slug]/reviews error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

/* POST: create or replace this user's review for this listing.
   Body: { rating: 1-5, title: string, body: string } */
export async function POST(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const auth = await requireUser(request)
  if (auth instanceof Response) return auth

  const ip = await getClientIp()
  const limited = await checkRateLimit(ip, 'review', 5, 600)
  if (!limited) {
    return Response.json({ ok: false, error: 'Too many reviews — slow down.' }, { status: 429 })
  }

  const { slug } = await ctx.params
  const listingId = await resolveListingId(slug)
  if (!listingId) return Response.json({ ok: false, error: 'Listing not found' }, { status: 404 })

  let body: { rating?: unknown; title?: unknown; body?: unknown }
  try { body = await request.json() } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const rating = Number(body.rating)
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const text = typeof body.body === 'string' ? body.body.trim() : ''

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json({ ok: false, error: 'Rating must be 1-5' }, { status: 400 })
  }
  if (!title || title.length > 120) {
    return Response.json({ ok: false, error: 'Title required (max 120 chars)' }, { status: 400 })
  }
  if (!text || text.length > 4000) {
    return Response.json({ ok: false, error: 'Review body required (max 4000 chars)' }, { status: 400 })
  }

  try {
    await execute(
      `INSERT INTO reviews (listing_id, user_id, rating, title, body, status)
       VALUES (?, ?, ?, ?, ?, 'approved')
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), title = VALUES(title),
                               body = VALUES(body), status = 'approved'`,
      [listingId, auth.id, rating, title, text]
    )
    return Response.json({ ok: true })
  } catch (err) {
    console.error('POST /api/listings/[slug]/reviews error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
