import { NextResponse } from 'next/server'
import { query } from '../../../../lib/db'

/* ─────────────────────────────────────────────────────────────
   Listing search used by /compare AND the /write-review flow.

   `mode` query param controls which listing modes are returned:
     - (absent) / 'product'  → product listings only  (DEFAULT — keeps
                                /compare and the product review flow exactly
                                as they were)
     - 'company'             → company profiles only   (company reviews)
     - 'all'                 → both                     (universal picker)

   An exact-slug match (`s.slug = q`) is included so /write-review?company=<slug>
   resolves reliably even for multi-word hyphenated slugs that a name LIKE
   would never match. Each result carries its `mode` so callers can build the
   right URL (/listing vs /profile).
   ───────────────────────────────────────────────────────────── */

export const dynamic = 'force-dynamic'

type CompanyHit = {
  id: number
  slug: string
  company_name: string
  tagline: string | null
  logo_url: string | null
  listing_mode: string | null
  category_name: string | null
  category_slug: string | null
  category_color: string | null
  rating_avg: number | null
  rating_count: number | null
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  const excludeRaw = (searchParams.get('exclude') || '').trim()
  const exclude = excludeRaw ? excludeRaw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : []
  // Optional L1-sector filter — when present, only listings whose category
  // walks up to this sector slug are returned (used by /compare).
  const sectorFilter = (searchParams.get('sector') || '').trim().toLowerCase()
  // Listing-mode filter — default 'product' preserves existing callers.
  const modeParam = (searchParams.get('mode') || 'product').toLowerCase()
  const modes = modeParam === 'all'
    ? ['product', 'company']
    : modeParam === 'company'
      ? ['company']
      : ['product']

  if (!q || q.length < 1) {
    return NextResponse.json(
      { ok: true, results: [] },
      { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400' } }
    )
  }

  const like = `%${q}%`
  const prefix = `${q}%`
  const modesIn = modes.map(() => '?').join(',')

  const excludeSql = exclude.length > 0
    ? `AND s.slug NOT IN (${exclude.map(() => '?').join(',')})`
    : ''
  const sectorSql = sectorFilter
    ? `AND (CASE WHEN c.level = 1 THEN c.slug
                 WHEN c.level = 2 THEN cp.slug
                 WHEN c.level = 3 THEN cgp.slug
                 WHEN c.level = 4 THEN cggp.slug
                 WHEN c.level = 5 THEN cgggp.slug
                 ELSE NULL END) = ?`
    : ''

  // Param order mirrors the placeholders below: modes, (like, like, q),
  // exclude, sector, then ORDER-BY (q, prefix).
  const params = [
    ...modes, like, like, q, ...exclude,
    ...(sectorFilter ? [sectorFilter] : []),
    q, prefix,
  ]

  let rows: CompanyHit[]
  try {
    rows = await query<CompanyHit>(
      `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url,
              COALESCE(s.listing_mode, 'product') AS listing_mode,
              c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
              (SELECT AVG(rating) FROM reviews WHERE listing_id = s.id AND status = 'approved') AS rating_avg,
              (SELECT COUNT(*) FROM reviews WHERE listing_id = s.id AND status = 'approved') AS rating_count
       FROM submissions s
       LEFT JOIN categories c     ON c.id     = s.category_id
       LEFT JOIN categories cp    ON cp.id    = c.parent_id
       LEFT JOIN categories cgp   ON cgp.id   = cp.parent_id
       LEFT JOIN categories cggp  ON cggp.id  = cgp.parent_id
       LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id
       WHERE s.status IN ('active', 'paid')
         AND COALESCE(s.listing_mode, 'product') IN (${modesIn})
         AND (s.company_name LIKE ? OR s.tagline LIKE ? OR s.slug = ?)
         ${excludeSql}
         ${sectorSql}
       ORDER BY
         CASE WHEN s.slug = ? THEN 0 WHEN s.company_name LIKE ? THEN 1 ELSE 2 END,
         s.approved_at DESC
       LIMIT 8`,
      params
    )
  } catch (err) {
    // Pre-migration tolerance: older installs may lack the `reviews` table.
    // Fall back to a slimmer query without the rating sub-selects.
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('reviews')) {
      rows = await query<CompanyHit>(
        `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url,
                COALESCE(s.listing_mode, 'product') AS listing_mode,
                c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
                NULL AS rating_avg, 0 AS rating_count
         FROM submissions s
         LEFT JOIN categories c     ON c.id     = s.category_id
         LEFT JOIN categories cp    ON cp.id    = c.parent_id
         LEFT JOIN categories cgp   ON cgp.id   = cp.parent_id
         LEFT JOIN categories cggp  ON cggp.id  = cggp.parent_id
         LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id
         WHERE s.status IN ('active', 'paid')
           AND COALESCE(s.listing_mode, 'product') IN (${modesIn})
           AND (s.company_name LIKE ? OR s.tagline LIKE ? OR s.slug = ?)
           ${excludeSql}
           ${sectorSql}
         ORDER BY
           CASE WHEN s.slug = ? THEN 0 WHEN s.company_name LIKE ? THEN 1 ELSE 2 END,
           s.approved_at DESC
         LIMIT 8`,
        params
      )
    } else {
      throw err
    }
  }

  const results = rows.map(r => ({
    id: r.id,
    slug: r.slug,
    companyName: r.company_name,
    tagline: r.tagline,
    logoUrl: r.logo_url,
    mode: (r.listing_mode === 'company' ? 'company' : 'product') as 'company' | 'product',
    category: r.category_slug ? {
      name: r.category_name,
      slug: r.category_slug,
      color: r.category_color,
    } : null,
    ratingAvg: r.rating_avg != null ? Number(r.rating_avg) : 0,
    ratingCount: Number(r.rating_count ?? 0),
  }))

  return NextResponse.json(
    { ok: true, results },
    { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400' } }
  )
}
