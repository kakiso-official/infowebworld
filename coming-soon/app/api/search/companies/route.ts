import { NextResponse } from 'next/server'
import { query } from '../../../../lib/db'

/* ─────────────────────────────────────────────────────────────
   Company-only search for the /compare flow.

   Mirrors /api/search but restricts to active/paid PRODUCT
   submissions (no companies, no categories, no blog). Powers the
   centered search bar on /compare and the right-rail "Add to
   Compare" search inside the comparison page.

   Lighter response than /api/search since we only need slug + name
   + tagline + logo + category + rating to render the dropdown rows.
   ───────────────────────────────────────────────────────────── */

export const dynamic = 'force-dynamic'

type CompanyHit = {
  id: number
  slug: string
  company_name: string
  tagline: string | null
  logo_url: string | null
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

  if (!q || q.length < 1) {
    return NextResponse.json(
      { ok: true, results: [] },
      { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400' } }
    )
  }

  const like = `%${q}%`
  const prefix = `${q}%`

  // exclude-slug placeholders inlined as a NOT IN list (slug strings only — they
  // come from the URL but are normalised through `.trim().toLowerCase()` and
  // bound as parameters so injection is not possible)
  const excludeSql = exclude.length > 0
    ? `AND s.slug NOT IN (${exclude.map(() => '?').join(',')})`
    : ''

  let rows: CompanyHit[]
  try {
    rows = await query<CompanyHit>(
      `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url,
              c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
              (SELECT AVG(rating) FROM reviews WHERE listing_id = s.id AND status = 'approved') AS rating_avg,
              (SELECT COUNT(*) FROM reviews WHERE listing_id = s.id AND status = 'approved') AS rating_count
       FROM submissions s
       LEFT JOIN categories c ON c.id = s.category_id
       WHERE s.status IN ('active', 'paid')
         AND COALESCE(s.listing_mode, 'product') = 'product'
         AND (s.company_name LIKE ? OR s.tagline LIKE ?)
         ${excludeSql}
       ORDER BY
         CASE WHEN s.company_name LIKE ? THEN 0 ELSE 1 END,
         s.approved_at DESC
       LIMIT 8`,
      [like, like, ...exclude, prefix]
    )
  } catch (err) {
    // Pre-migration tolerance: if listing_mode column is missing the
    // COALESCE evaluates fine, but `reviews` table may not exist on
    // older installs. Fall back to a slimmer query without ratings.
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('reviews')) {
      rows = await query<CompanyHit>(
        `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url,
                c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
                NULL AS rating_avg, 0 AS rating_count
         FROM submissions s
         LEFT JOIN categories c ON c.id = s.category_id
         WHERE s.status IN ('active', 'paid')
           AND COALESCE(s.listing_mode, 'product') = 'product'
           AND (s.company_name LIKE ? OR s.tagline LIKE ?)
           ${excludeSql}
         ORDER BY
           CASE WHEN s.company_name LIKE ? THEN 0 ELSE 1 END,
           s.approved_at DESC
         LIMIT 8`,
        [like, like, ...exclude, prefix]
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
