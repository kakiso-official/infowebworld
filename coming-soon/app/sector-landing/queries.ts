/**
 * Sector-scoped DB queries reused by every L1 sector landing page.
 * All four queries walk up to 4 ancestors (c / cp / cgp / cggp / cgggp)
 * so a listing attached to a deep L4 or L5 category still attributes
 * back to its L1 sector slug.
 */
import { query } from '@/lib/db'
import type { PopL2 } from '../test-category-1-page/PopularSection'
import type { ReviewRow } from '../test-landing-page/NewReviewsSection'
import type { LaunchRow } from '../test-category-1-page/NewLaunchesSection'
import type { PopFirmRow } from '../test-landing-page/PopularSection'

/** Top N L2 categories under a sector (by listing count, then sort_order),
 *  each with its top M listings. Empty L2s are kept so the rail stays full. */
export async function getPopularByL2(sectorSlug: string, l2Limit = 10, productLimit = 9): Promise<PopL2[]> {
  try {
    const cats = await query<{
      id: number; slug: string; name: string; listing_count: number
    }>(
      `SELECT c.id, c.slug, c.name,
              (SELECT COUNT(*)
                 FROM submissions s
                 LEFT JOIN categories sc    ON sc.id    = s.category_id
                 LEFT JOIN categories scp   ON scp.id   = sc.parent_id
                 LEFT JOIN categories scgp  ON scgp.id  = scp.parent_id
                 LEFT JOIN categories scggp ON scggp.id = scgp.parent_id
                WHERE s.status IN ('active', 'paid')
                  AND (sc.id = c.id OR scp.id = c.id OR scgp.id = c.id OR scggp.id = c.id)
              ) AS listing_count
         FROM categories c
        WHERE c.level = 2
          AND c.parent_id = (SELECT id FROM categories WHERE slug = ? AND level = 1)
          AND c.is_launched = 1
        ORDER BY listing_count DESC, c.sort_order ASC
        LIMIT ?`,
      [sectorSlug, l2Limit]
    )

    /* SERIAL fan-out. The MySQL pool is sized at 2 — Promise.all over 10
       L2s instantly blows the queue when more than one sector page renders
       at once. A sequential await loop keeps the page slower (~1–2s vs
       ~300ms) but eliminates "Queue limit reached" thrash. */
    const results = []
    for (const cat of cats) {
      const products = await query<{
        slug: string; company_name: string; logo_url: string | null;
        rating_avg: number | null; rating_count: number | null;
        listing_mode: 'product' | 'company' | string | null
      }>(
        `SELECT s.slug, s.company_name, s.logo_url,
                (SELECT AVG(rating) FROM reviews
                  WHERE listing_id = s.id AND status = 'approved') AS rating_avg,
                (SELECT COUNT(*)    FROM reviews
                  WHERE listing_id = s.id AND status = 'approved') AS rating_count,
                COALESCE(s.listing_mode, 'product') AS listing_mode
           FROM submissions s
           LEFT JOIN categories sc    ON sc.id    = s.category_id
           LEFT JOIN categories scp   ON scp.id   = sc.parent_id
           LEFT JOIN categories scgp  ON scgp.id  = scp.parent_id
           LEFT JOIN categories scggp ON scggp.id = scgp.parent_id
          WHERE s.status IN ('active', 'paid')
            AND (sc.id = ? OR scp.id = ? OR scgp.id = ? OR scggp.id = ?)
          ORDER BY rating_avg DESC, rating_count DESC, s.created_at DESC
          LIMIT ?`,
        [cat.id, cat.id, cat.id, cat.id, productLimit]
      )
      results.push({
        slug: cat.slug,
        name: cat.name,
        products: products.map(p => ({
          slug: p.slug,
          name: p.company_name,
          logoUrl: p.logo_url,
          rating: Number(p.rating_avg ?? 0),
          reviews: Number(p.rating_count ?? 0),
          listingMode: (p.listing_mode === 'company' ? 'company' : 'product') as 'product' | 'company',
        })),
      })
    }
    return results
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) {
      console.warn(`[sector-landing:${sectorSlug}] popular-by-L2 fetch failed:`, err)
    }
    return []
  }
}

/** Latest approved reviews scoped to listings under this sector. */
export async function getLatestSectorReviews(sectorSlug: string, limit = 8): Promise<ReviewRow[]> {
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
         LEFT JOIN categories c     ON c.id     = s.category_id
         LEFT JOIN categories cp    ON cp.id    = c.parent_id
         LEFT JOIN categories cgp   ON cgp.id   = cp.parent_id
         LEFT JOIN categories cggp  ON cggp.id  = cgp.parent_id
         LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id
        WHERE r.status = 'approved'
          AND s.status IN ('active','paid')
          AND (c.slug = ? OR cp.slug = ? OR cgp.slug = ? OR cggp.slug = ? OR cgggp.slug = ?)
        ORDER BY r.created_at DESC
        LIMIT ?`,
      [sectorSlug, sectorSlug, sectorSlug, sectorSlug, sectorSlug, limit]
    )
    return rows.map(r => ({
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
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) {
      console.warn(`[sector-landing:${sectorSlug}] reviews fetch failed:`, err)
    }
    return []
  }
}

/** Most-recently-approved listings scoped to this sector. */
export async function getRecentSectorLaunches(sectorSlug: string, limit = 8): Promise<LaunchRow[]> {
  try {
    const rows = await query<{
      slug: string; company_name: string; tagline: string | null;
      logo_url: string | null;
      listing_mode: 'product' | 'company' | string | null;
      approved_at: string | null; created_at: string | null;
      category_name: string | null; category_slug: string | null;
      rating_avg: number | null; rating_count: number | null;
    }>(
      `SELECT s.slug, s.company_name, s.tagline, s.logo_url,
              COALESCE(s.listing_mode, 'product') AS listing_mode,
              s.approved_at, s.created_at,
              c.name AS category_name, c.slug AS category_slug,
              (SELECT AVG(rating) FROM reviews
                WHERE listing_id = s.id AND status = 'approved') AS rating_avg,
              (SELECT COUNT(*)    FROM reviews
                WHERE listing_id = s.id AND status = 'approved') AS rating_count
         FROM submissions s
         LEFT JOIN categories c     ON c.id     = s.category_id
         LEFT JOIN categories cp    ON cp.id    = c.parent_id
         LEFT JOIN categories cgp   ON cgp.id   = cp.parent_id
         LEFT JOIN categories cggp  ON cggp.id  = cgp.parent_id
         LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id
        WHERE s.status IN ('active','paid')
          AND (c.slug = ? OR cp.slug = ? OR cgp.slug = ? OR cggp.slug = ? OR cgggp.slug = ?)
        ORDER BY COALESCE(s.approved_at, s.created_at) DESC
        LIMIT ?`,
      [sectorSlug, sectorSlug, sectorSlug, sectorSlug, sectorSlug, limit]
    )
    return rows.map(r => ({
      slug: r.slug,
      companyName: r.company_name,
      tagline: r.tagline,
      logoUrl: r.logo_url,
      listingMode: (r.listing_mode === 'company' ? 'company' : 'product') as 'product' | 'company',
      approvedAt: r.approved_at || r.created_at || '',
      categoryName: r.category_name,
      categorySlug: r.category_slug,
      rating: Number(r.rating_avg ?? 0),
      reviews: Number(r.rating_count ?? 0),
    }))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) {
      console.warn(`[sector-landing:${sectorSlug}] launches fetch failed:`, err)
    }
    return []
  }
}

/** Hand-picked listings with pricing + trial fields for the
 *  "Most popular" pricing-card section. */
export async function getPopularSectorTools(sectorSlug: string, limit = 6): Promise<PopFirmRow[]> {
  try {
    const rows = await query<{
      slug: string; company_name: string; logo_url: string | null
      starting_price: string | number | null
      starting_price_period: string | null
      has_free_trial: number | null
      has_free_version: number | null
      rating_avg: number | null; rating_count: number | null
      listing_mode: 'product' | 'company' | string | null
    }>(
      `SELECT s.slug, s.company_name, s.logo_url,
              s.starting_price, s.starting_price_period,
              s.has_free_trial, s.has_free_version,
              COALESCE(s.listing_mode, 'product') AS listing_mode,
              (SELECT AVG(rating) FROM reviews
                WHERE listing_id = s.id AND status = 'approved') AS rating_avg,
              (SELECT COUNT(*)   FROM reviews
                WHERE listing_id = s.id AND status = 'approved') AS rating_count
         FROM submissions s
         LEFT JOIN categories c     ON c.id     = s.category_id
         LEFT JOIN categories cp    ON cp.id    = c.parent_id
         LEFT JOIN categories cgp   ON cgp.id   = cp.parent_id
         LEFT JOIN categories cggp  ON cggp.id  = cgp.parent_id
         LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id
        WHERE s.status IN ('active','paid')
          AND (c.slug = ? OR cp.slug = ? OR cgp.slug = ? OR cggp.slug = ? OR cgggp.slug = ?)
        ORDER BY rating_avg DESC, s.created_at DESC
        LIMIT ?`,
      [sectorSlug, sectorSlug, sectorSlug, sectorSlug, sectorSlug, limit]
    )
    return rows.map(r => ({
      slug: r.slug,
      company_name: r.company_name,
      logo_url: r.logo_url,
      rating_avg: Number(r.rating_avg ?? 0),
      rating_count: Number(r.rating_count ?? 0),
      listing_mode: (r.listing_mode === 'company' ? 'company' : 'product') as 'product' | 'company',
      starting_price: r.starting_price != null ? String(r.starting_price) : '',
      starting_price_period: r.starting_price_period || '',
      has_free_trial: Boolean(Number(r.has_free_trial ?? 0)),
      has_free_version: Boolean(Number(r.has_free_version ?? 0)),
    }))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) {
      console.warn(`[sector-landing:${sectorSlug}] popular tools fetch failed:`, err)
    }
    return []
  }
}
