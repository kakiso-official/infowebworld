import { unstable_cache } from 'next/cache'
import { query } from '@/lib/db'
import {
  getPopularByL2, getLatestSectorReviews, getRecentSectorLaunches, getPopularSectorTools,
} from '../sector-landing/queries'
import type { ReviewRow } from '../test-landing-page/NewReviewsSection'

/* ═══════════════════════════════════════════════════════════════════════
   Live data for the AI tools directory (/ai-si-directory). Server-only.

   Every fetcher is unstable_cache'd for 10 minutes (the page itself is
   ISR at the same interval) and degrades to an empty result on a DB
   failure, so a flaky connection hides a section instead of 500ing.
   ═══════════════════════════════════════════════════════════════════════ */

const SECTOR = 'ai-ml'

/* Live AI listings, counted over the listing's category AND its 4
   ancestors. The old sector hero walked only 3 ancestors and so missed
   every listing filed at L5 (519 of 910 in Oct 2026). */
async function fetchAiListingTotal(): Promise<number> {
  try {
    const rows = await query<{ n: number | string }>(
      `SELECT COUNT(*) AS n
         FROM submissions s
         LEFT JOIN categories c     ON c.id     = s.category_id
         LEFT JOIN categories cp    ON cp.id    = c.parent_id
         LEFT JOIN categories cgp   ON cgp.id   = cp.parent_id
         LEFT JOIN categories cggp  ON cggp.id  = cgp.parent_id
         LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id
        WHERE s.status IN ('active','paid')
          AND (c.slug = ? OR cp.slug = ? OR cgp.slug = ? OR cggp.slug = ? OR cgggp.slug = ?)`,
      [SECTOR, SECTOR, SECTOR, SECTOR, SECTOR]
    )
    return Number(rows[0]?.n ?? 0)
  } catch (err) {
    console.warn('[ai-directory] listing total fetch failed:', err)
    return 0
  }
}

/* "Trusted by Users, Reviewed by Buyers": approved reviews of AI listings
   first, then the newest approved reviews from the rest of the directory
   so the marquee is never a thin strip of two or three cards. */
async function fetchAiReviews(limit = 8): Promise<ReviewRow[]> {
  const ai = await getLatestSectorReviews(SECTOR, limit)
  if (ai.length >= limit) return ai
  try {
    const rows = await query<{
      id: number; rating: number; title: string; body: string; created_at: string
      user_name: string | null; user_avatar: string | null; user_email: string | null
      listing_slug: string; listing_name: string; listing_logo: string | null
      listing_mode: 'product' | 'company' | string | null
    }>(
      `SELECT r.id, r.rating, r.title, r.body, r.created_at,
              u.name AS user_name, u.avatar_url AS user_avatar, u.email AS user_email,
              s.slug AS listing_slug, s.company_name AS listing_name,
              s.logo_url AS listing_logo,
              COALESCE(s.listing_mode, 'product') AS listing_mode
         FROM reviews r
         JOIN business_users u ON u.id = r.user_id
         JOIN submissions    s ON s.id = r.listing_id
        WHERE r.status = 'approved'
          AND s.status IN ('active','paid')
        ORDER BY r.created_at DESC
        LIMIT ?`,
      [limit + ai.length]
    )
    const seen = new Set(ai.map(r => r.id))
    const rest: ReviewRow[] = rows
      .filter(r => !seen.has(r.id))
      .map(r => ({
        id: r.id,
        rating: Number(r.rating),
        title: r.title || '',
        body: r.body || '',
        created_at: r.created_at,
        user_name: r.user_name,
        user_avatar: r.user_avatar,
        user_email: r.user_email,
        listing_slug: r.listing_slug,
        listing_name: r.listing_name,
        listing_logo: r.listing_logo,
        listing_mode: (r.listing_mode === 'company' ? 'company' : 'product') as 'product' | 'company',
      }))
    return [...ai, ...rest].slice(0, limit)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) {
      console.warn('[ai-directory] review top-up fetch failed:', err)
    }
    return ai
  }
}

export const getAiListingTotal = unstable_cache(fetchAiListingTotal, ['ai-dir-total-v1'], { revalidate: 600 })
export const getAiReviews = unstable_cache(fetchAiReviews, ['ai-dir-reviews-v1'], { revalidate: 600 })

/* "Featured AI Tool Listings": L2 tabs, listings on a paid (featured) plan
   first within each tab, and the tabs holding them first. */
export const getAiFeaturedByL2 = unstable_cache(
  () => getPopularByL2(SECTOR, 10, 9, { featuredFirst: true }),
  ['ai-dir-featured-v2'],
  { revalidate: 600 }
)

export const getAiLaunches = unstable_cache(
  () => getRecentSectorLaunches(SECTOR, 8),
  ['ai-dir-launches-v1'],
  { revalidate: 600 }
)

export const getAiPopularTools = unstable_cache(
  () => getPopularSectorTools(SECTOR, 6),
  ['ai-dir-popular-tools-v1'],
  { revalidate: 600 }
)
