import { NextResponse } from 'next/server'
import { query } from '../../../lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  /* Optional L1 sector slug — when set, categories and listings are
     restricted to results whose category traces (self/parent/grand-
     parent) up to that sector. Used by /test-category-1-page so its
     hero search only returns AI/ML hits. */
  const sector = (searchParams.get('sector') || '').trim()
  const sectorOn = sector.length > 0

  if (!q || q.length < 2) {
    return NextResponse.json({ ok: true, results: { categories: [], listings: [], blog: [] }, total: 0 })
  }

  const like = `%${q}%`

  const [categories, listings, blog] = await Promise.all([
    /* Categories — search name + description, navigable only.
       Optional sector filter walks c/p/gp.slug so an L2 or L3 hit
       still attributes to the right L1 sector. */
    query<{
      id: number; name: string; slug: string; level: number;
      color: string; icon: string; description: string;
      parent_name: string | null; parent_slug: string | null;
      sector_slug: string | null; listing_count: number
    }>(
      `SELECT c.id, c.name, c.slug, c.level, c.color, c.icon, c.description,
              c.listing_count,
              p.name AS parent_name, p.slug AS parent_slug,
              CASE WHEN c.level = 1 THEN c.slug
                   WHEN c.level = 2 THEN p.slug
                   WHEN c.level = 3 THEN gp.slug
                   WHEN c.level = 4 THEN ggp.slug
                   WHEN c.level = 5 THEN gggp.slug END AS sector_slug
       FROM categories c
       LEFT JOIN categories p    ON p.id    = c.parent_id
       LEFT JOIN categories gp   ON gp.id   = p.parent_id
       LEFT JOIN categories ggp  ON ggp.id  = gp.parent_id
       LEFT JOIN categories gggp ON gggp.id = ggp.parent_id
       WHERE c.is_launched = 1 AND c.is_navigation = 1
         AND (c.name LIKE ? OR c.description LIKE ?)
         ${sectorOn ? 'AND (c.slug = ? OR p.slug = ? OR gp.slug = ? OR ggp.slug = ? OR gggp.slug = ?)' : ''}
       ORDER BY
         CASE WHEN c.name LIKE ? THEN 0 ELSE 1 END,
         c.level ASC, c.name ASC
       LIMIT 8`,
      sectorOn
        ? [like, like, sector, sector, sector, sector, sector, `${q}%`]
        : [like, like, `${q}%`]
    ),

    /* Listings — search company name, tagline, description.
       listing_mode is returned so client links can branch
       /profile/<slug> for companies vs /company/<slug> for products
       (the URL namespace split set up in S36). Tolerated when missing
       (pre-migration installs) by COALESCE → 'product'.
       Optional sector filter joins up to grandparent so listings
       attached to L2/L3 categories still resolve to the right sector. */
    query<{
      id: number; slug: string; company_name: string; tagline: string;
      logo_url: string; website: string;
      category_name: string; category_slug: string; category_color: string;
      listing_mode: 'product' | 'company' | string
    }>(
      `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url, s.website,
              c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
              COALESCE(s.listing_mode, 'product') AS listing_mode
       FROM submissions s
       LEFT JOIN categories c   ON c.id   = s.category_id
       ${sectorOn ? 'LEFT JOIN categories cp   ON cp.id   = c.parent_id LEFT JOIN categories cgp  ON cgp.id  = cp.parent_id LEFT JOIN categories cggp ON cggp.id = cgp.parent_id LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id' : ''}
       WHERE s.status IN ('active', 'paid')
         AND (s.company_name LIKE ? OR s.tagline LIKE ? OR s.description LIKE ?)
         ${sectorOn ? 'AND (c.slug = ? OR cp.slug = ? OR cgp.slug = ? OR cggp.slug = ? OR cgggp.slug = ?)' : ''}
       ORDER BY
         CASE WHEN s.company_name LIKE ? THEN 0 ELSE 1 END,
         s.approved_at DESC
       LIMIT 6`,
      sectorOn
        ? [like, like, like, sector, sector, sector, sector, sector, `${q}%`]
        : [like, like, like, `${q}%`]
    ),

    /* Blog — use FULLTEXT if available, fallback to LIKE */
    query<{
      id: number; slug: string; title: string; excerpt: string;
      cover_image: string; author: string; category: string
    }>(
      `SELECT id, slug, title, excerpt, cover_image, author, category
       FROM blog_posts
       WHERE status = 'published'
         AND (title LIKE ? OR excerpt LIKE ?)
       ORDER BY
         CASE WHEN title LIKE ? THEN 0 ELSE 1 END,
         published_at DESC
       LIMIT 4`,
      [like, like, `${q}%`]
    ),
  ])

  const total = categories.length + listings.length + blog.length

  return NextResponse.json(
    { ok: true, results: { categories, listings, blog }, total },
    { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400' } }
  )
}
