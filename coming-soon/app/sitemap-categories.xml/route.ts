import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const BASE = 'https://www.infowebworld.com'

const L1_SLUGS = new Set([
  'ai-ml', 'software-saas', 'it-services-agencies',
  'startups-innovation', 'local-businesses', 'professional-services',
])

const INDEXABLE_THRESHOLD = 5 // mirrors generateMetadata's noindex gate

type Cat = {
  id: number
  parent_id: number | null
  level: number
  slug: string
  is_active: number
  is_launched: number
  sort_order: number | null
  updated_at: string | null
}

/* Sitemap of L2-L5 category pages. Emits every active+launched category whose
   descendant tree holds >= 5 active/paid listings (matching the public page's
   robots gate; categories under that are noindex and must stay out of the
   sitemap). Computed cheaply: one GROUP BY count + one categories read, then
   the per-category totals are rolled UP the parent chain in JS. The previous
   correlated 5-level-join subquery (one per ~14k categories) timed out once
   the listing count grew into the thousands and silently emitted an empty
   sitemap — this version is O(listings + categories). */
export async function GET() {
  let cats: Cat[] = []
  let counts: { category_id: number; n: number }[] = []
  try {
    cats = await query<Cat>(
      `SELECT id, parent_id, level, slug, is_active, is_launched, sort_order, updated_at
         FROM categories`
    )
    counts = await query<{ category_id: number; n: number }>(
      `SELECT category_id, COUNT(*) AS n
         FROM submissions
        WHERE status IN ('active','paid') AND category_id IS NOT NULL
        GROUP BY category_id`
    )
  } catch { /* DB unavailable during build — emit empty sitemap */ }

  const byId = new Map<number, Cat>()
  for (const c of cats) byId.set(Number(c.id), c)

  /* Roll each category's DIRECT listing count up to itself + every ancestor,
     so tree_count(X) = listings anywhere in X's subtree. */
  const treeCount = new Map<number, number>()
  for (const { category_id, n } of counts) {
    let cur = byId.get(Number(category_id))
    let guard = 0
    while (cur && guard++ < 8) {
      treeCount.set(cur.id, (treeCount.get(cur.id) || 0) + Number(n))
      cur = cur.parent_id != null ? byId.get(Number(cur.parent_id)) : undefined
    }
  }

  /* L1 ancestor's slug = the sector segment in the URL. */
  function sectorOf(c: Cat): string | null {
    let cur: Cat | undefined = c
    let guard = 0
    while (cur && guard++ < 8) {
      if (cur.level === 1) return cur.slug
      cur = cur.parent_id != null ? byId.get(Number(cur.parent_id)) : undefined
    }
    return null
  }

  const now = new Date().toISOString().split('T')[0]
  const emitted = cats
    .filter((c) =>
      c.is_active && c.is_launched && c.level >= 2 &&
      (treeCount.get(c.id) || 0) >= INDEXABLE_THRESHOLD)
    .map((c) => ({ c, sector: sectorOf(c) }))
    .filter((x) => x.sector && L1_SLUGS.has(x.sector))
    .sort((a, b) => a.c.level - b.c.level || (a.c.sort_order || 0) - (b.c.sort_order || 0))

  const urls = emitted.map(({ c, sector }) => {
    const lastmod = c.updated_at ? new Date(c.updated_at).toISOString().split('T')[0] : now
    /* Deeper levels = more specific = slightly lower priority. L2=0.8 … L5=0.5. */
    const priority = (0.9 - (c.level - 1) * 0.1).toFixed(1)
    return `  <url>
    <loc>${BASE}/${sector}/${c.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
