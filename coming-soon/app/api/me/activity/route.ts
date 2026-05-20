import { NextRequest } from 'next/server'
import { query } from '@/lib/db'
import { requireUser } from '@/lib/user-auth'

/* ─────────────────────────────────────────────────────────────
   GET /api/me/activity
   Returns the calling user's full activity across listings:
     • saved      — listing_bookmarks
     • liked      — listing_reactions (kind = 'like')
     • disliked   — listing_reactions (kind = 'dislike')
     • reviewed   — reviews (any status — owner sees their own)
   Plus a `flags` payload keyed by slug for fast card hydration:
     { savedSlugs:[…], likedSlugs:[…], dislikedSlugs:[…], reviewedSlugs:[…] }

   no-store — per-cookie data, never edge cached.
   ───────────────────────────────────────────────────────────── */

interface ListingRow {
  id: number
  slug: string
  company_name: string
  tagline: string | null
  logo_url: string | null
  category_name: string | null
  category_slug: string | null
  category_color: string | null
  acted_at: string | Date
  /* Only present on the reviewed bucket */
  review_rating?: number | null
  review_title?: string | null
}

interface ListingView {
  slug: string
  companyName: string
  tagline: string | null
  logoUrl: string | null
  category: { name: string | null; slug: string | null; color: string | null }
  actedAt: string
  /* Only present on the reviewed bucket */
  reviewRating?: number | null
  reviewTitle?: string | null
}

function toView(rows: ListingRow[]): ListingView[] {
  return rows.map(r => ({
    slug: r.slug,
    companyName: r.company_name,
    tagline: r.tagline,
    logoUrl: r.logo_url,
    category: { name: r.category_name, slug: r.category_slug, color: r.category_color },
    actedAt: r.acted_at instanceof Date ? r.acted_at.toISOString() : String(r.acted_at),
    ...(r.review_rating != null ? { reviewRating: Number(r.review_rating) } : {}),
    ...(r.review_title != null ? { reviewTitle: r.review_title } : {}),
  }))
}

export async function GET(request: NextRequest) {
  const guard = await requireUser(request)
  if (guard instanceof Response) return guard
  const user = guard

  /* Each bucket runs the same join shape so the client can render any tab
     with one shared <ActivityList> component. Most-recent-first. */
  const SELECT_BASE = `
    s.id, s.slug, s.company_name, s.tagline, s.logo_url,
    c.name AS category_name, c.slug AS category_slug, c.color AS category_color
  `

  try {
    const [saved, liked, disliked, reviewed] = await Promise.all([
      query<ListingRow>(
        `SELECT ${SELECT_BASE}, b.created_at AS acted_at
           FROM listing_bookmarks b
           JOIN submissions s ON s.id = b.listing_id
           LEFT JOIN categories c ON c.id = s.category_id
          WHERE b.user_id = ? AND s.status IN ('active','paid')
          ORDER BY b.created_at DESC LIMIT 200`,
        [user.id]
      ),
      query<ListingRow>(
        `SELECT ${SELECT_BASE}, r.created_at AS acted_at
           FROM listing_reactions r
           JOIN submissions s ON s.id = r.listing_id
           LEFT JOIN categories c ON c.id = s.category_id
          WHERE r.user_id = ? AND r.kind = 'like' AND s.status IN ('active','paid')
          ORDER BY r.created_at DESC LIMIT 200`,
        [user.id]
      ),
      query<ListingRow>(
        `SELECT ${SELECT_BASE}, r.created_at AS acted_at
           FROM listing_reactions r
           JOIN submissions s ON s.id = r.listing_id
           LEFT JOIN categories c ON c.id = s.category_id
          WHERE r.user_id = ? AND r.kind = 'dislike' AND s.status IN ('active','paid')
          ORDER BY r.created_at DESC LIMIT 200`,
        [user.id]
      ),
      query<ListingRow>(
        `SELECT ${SELECT_BASE}, rv.created_at AS acted_at,
                rv.rating AS review_rating, rv.title AS review_title
           FROM reviews rv
           JOIN submissions s ON s.id = rv.listing_id
           LEFT JOIN categories c ON c.id = s.category_id
          WHERE rv.user_id = ? AND s.status IN ('active','paid')
          ORDER BY rv.created_at DESC LIMIT 200`,
        [user.id]
      ),
    ])

    const savedV = toView(saved)
    const likedV = toView(liked)
    const dislikedV = toView(disliked)
    const reviewedV = toView(reviewed)

    return Response.json(
      {
        ok: true,
        counts: {
          saved: savedV.length,
          liked: likedV.length,
          disliked: dislikedV.length,
          reviewed: reviewedV.length,
        },
        buckets: {
          saved: savedV,
          liked: likedV,
          disliked: dislikedV,
          reviewed: reviewedV,
        },
        flags: {
          savedSlugs: savedV.map(v => v.slug),
          likedSlugs: likedV.map(v => v.slug),
          dislikedSlugs: dislikedV.map(v => v.slug),
          reviewedSlugs: reviewedV.map(v => v.slug),
        },
      },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (err) {
    /* If the engagement tables don't exist yet (pre-migration), return a
       zeroed payload so the activity page renders an empty state instead
       of a 500. */
    const msg = err instanceof Error ? err.message : String(err)
    if (/listing_bookmarks|listing_reactions|reviews/.test(msg)) {
      return Response.json(
        {
          ok: true,
          counts: { saved: 0, liked: 0, disliked: 0, reviewed: 0 },
          buckets: { saved: [], liked: [], disliked: [], reviewed: [] },
          flags: { savedSlugs: [], likedSlugs: [], dislikedSlugs: [], reviewedSlugs: [] },
        },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    }
    throw err
  }
}
