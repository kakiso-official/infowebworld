import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { isCategoryIndexable } from '@/lib/category-indexing'

const BASE = 'https://www.infowebworld.com'

const L1_SLUGS = new Set([
  'ai-ml', 'software-saas', 'it-services-agencies',
  'startups-innovation', 'local-businesses', 'professional-services',
])

/* Always computed at request time from the live DB. A build-time prerender
   would freeze the URL list until the next deploy — or freeze an empty one
   if the DB was unreachable during the build. */
export const dynamic = 'force-dynamic'

type Cat = {
  id: number
  parent_id: number | null
  level: number
  slug: string
  is_active: number
  is_launched: number
  seo_no_index: number | null
  sort_order: number | null
  updated_at: string | null
}

/* Sitemap of L2-L5 category pages. Emits exactly the categories whose page
   renders `index` — the rule lives in lib/category-indexing.ts and the page
   (app/[...segments]/page.tsx) calls the same function, so a URL listed
   here can never render noindex:
     · L2 + L3: every active + launched category.
     · L4 + L5: only when the category's subtree holds >= 1 active/paid
       listing (the same set of listings the page shows).
     · never an unlaunched category or one the admin flagged noindex.
   Computed cheaply: one GROUP BY count + one categories read, then the
   per-category totals are rolled UP the parent chain in JS. (A correlated
   5-level-join subquery per category timed out once the listing count grew
   into the thousands — this version is O(listings + categories).) */
export async function GET() {
  let cats: Cat[] = []
  let counts: { category_id: number; n: number }[] = []
  try {
    cats = await query<Cat>(
      `SELECT id, parent_id, level, slug, is_active, is_launched, seo_no_index,
              sort_order, updated_at
         FROM categories`
    )
    counts = await query<{ category_id: number; n: number }>(
      `SELECT category_id, COUNT(*) AS n
         FROM submissions
        WHERE status IN ('active','paid') AND category_id IS NOT NULL
        GROUP BY category_id`
    )
  } catch {
    /* DB unreachable. An empty-but-200 sitemap tells Google this site has no
       category pages; a 503 tells it to come back later. no-store keeps any
       cache from holding on to the failure. */
    return new NextResponse('Sitemap temporarily unavailable', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Retry-After': '3600',
        'Cache-Control': 'no-store',
      },
    })
  }

  const byId = new Map<number, Cat>()
  for (const c of cats) byId.set(Number(c.id), c)

  /* Roll each category's DIRECT listing count up to itself + every ancestor,
     so tree_count(X) = listings anywhere in X's subtree. Mirrors the page's
     descendant UNION, which only counts listings whose own category row is
     active. */
  const treeCount = new Map<number, number>()
  for (const { category_id, n } of counts) {
    let cur = byId.get(Number(category_id))
    if (!cur || !Number(cur.is_active)) continue
    let guard = 0
    while (cur && guard++ < 8) {
      treeCount.set(Number(cur.id), (treeCount.get(Number(cur.id)) || 0) + Number(n))
      cur = cur.parent_id != null ? byId.get(Number(cur.parent_id)) : undefined
    }
  }

  /* L1 ancestor's slug = the sector segment in the URL. */
  function sectorOf(c: Cat): string | null {
    let cur: Cat | undefined = c
    let guard = 0
    while (cur && guard++ < 8) {
      if (Number(cur.level) === 1) return cur.slug
      cur = cur.parent_id != null ? byId.get(Number(cur.parent_id)) : undefined
    }
    return null
  }

  /* Slugs are [a-z0-9-] today, but one stray `&` would make the whole
     document invalid XML and Google would drop every URL in it. */
  const xmlEscape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
     .replace(/"/g, '&quot;').replace(/'/g, '&apos;')

  const now = new Date().toISOString().split('T')[0]
  const emitted = cats
    .filter((c) =>
      Number(c.is_active) && Number(c.level) >= 2 &&
      isCategoryIndexable({
        level: Number(c.level),
        subtreeListings: treeCount.get(Number(c.id)) || 0,
        launched: !!Number(c.is_launched),
        noIndex: !!Number(c.seo_no_index ?? 0),
      }))
    .map((c) => ({ c, sector: sectorOf(c) }))
    .filter((x) => x.sector && L1_SLUGS.has(x.sector))
    .sort((a, b) => Number(a.c.level) - Number(b.c.level) || (a.c.sort_order || 0) - (b.c.sort_order || 0))

  const urls = emitted.map(({ c, sector }) => {
    const lastmod = c.updated_at ? new Date(c.updated_at).toISOString().split('T')[0] : now
    /* Deeper levels = more specific = slightly lower priority. L2=0.8 … L5=0.5. */
    const priority = (0.9 - (Number(c.level) - 1) * 0.1).toFixed(1)
    return `  <url>
    <loc>${xmlEscape(`${BASE}/${sector}/${c.slug}`)}</loc>
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
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
