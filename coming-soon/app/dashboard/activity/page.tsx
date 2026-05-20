import { requireDashboardUser } from '@/lib/user-auth'
import { query } from '@/lib/db'
import DashboardHeader from '../DashboardHeader'
import ActivityClient, { type ActivityListing } from './ActivityClient'

export const dynamic = 'force-dynamic'

const SELECT_BASE = `
  s.slug, s.company_name, s.tagline, s.logo_url,
  c.name AS category_name, c.slug AS category_slug, c.color AS category_color
`

interface Row {
  slug: string
  company_name: string
  tagline: string | null
  logo_url: string | null
  category_name: string | null
  category_slug: string | null
  category_color: string | null
  acted_at: string | Date
  review_rating?: number | null
  review_title?: string | null
}

function toView(rows: Row[]): ActivityListing[] {
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

export default async function ActivityPage() {
  const user = await requireDashboardUser()

  /* Fetch all four buckets server-side so the page is fully populated on
     first paint — no client waterfall, no skeleton flash. Each bucket is
     LIMIT 200 (recent activity), most-recent first. */
  let saved: ActivityListing[] = []
  let liked: ActivityListing[] = []
  let disliked: ActivityListing[] = []
  let reviewed: ActivityListing[] = []
  try {
    const [s, l, d, rv] = await Promise.all([
      query<Row>(
        `SELECT ${SELECT_BASE}, b.created_at AS acted_at
           FROM listing_bookmarks b
           JOIN submissions s ON s.id = b.listing_id
           LEFT JOIN categories c ON c.id = s.category_id
          WHERE b.user_id = ? AND s.status IN ('active','paid')
          ORDER BY b.created_at DESC LIMIT 200`,
        [user.id]
      ),
      query<Row>(
        `SELECT ${SELECT_BASE}, r.created_at AS acted_at
           FROM listing_reactions r
           JOIN submissions s ON s.id = r.listing_id
           LEFT JOIN categories c ON c.id = s.category_id
          WHERE r.user_id = ? AND r.kind = 'like' AND s.status IN ('active','paid')
          ORDER BY r.created_at DESC LIMIT 200`,
        [user.id]
      ),
      query<Row>(
        `SELECT ${SELECT_BASE}, r.created_at AS acted_at
           FROM listing_reactions r
           JOIN submissions s ON s.id = r.listing_id
           LEFT JOIN categories c ON c.id = s.category_id
          WHERE r.user_id = ? AND r.kind = 'dislike' AND s.status IN ('active','paid')
          ORDER BY r.created_at DESC LIMIT 200`,
        [user.id]
      ),
      query<Row>(
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
    saved = toView(s); liked = toView(l); disliked = toView(d); reviewed = toView(rv)
  } catch (err) {
    /* Pre-migration: tables don't exist yet → render empty state. */
    const msg = err instanceof Error ? err.message : String(err)
    if (!/listing_bookmarks|listing_reactions|reviews/.test(msg)) throw err
  }

  return (
    <div className="dash">
      <DashboardHeader
        title="Your activity"
        subtitle="Everything you've saved, liked, disliked, and reviewed."
      />
      <ActivityClient
        saved={saved}
        liked={liked}
        disliked={disliked}
        reviewed={reviewed}
      />
    </div>
  )
}
