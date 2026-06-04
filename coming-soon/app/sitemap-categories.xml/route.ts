import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const BASE = 'https://www.infowebworld.com'

const L1_SLUGS = new Set([
  'ai-ml', 'software-saas', 'it-services-agencies',
  'startups-innovation', 'local-businesses', 'professional-services',
])

const INDEXABLE_THRESHOLD = 5 // mirrors generateMetadata's gate

type CatRow = {
  id: number
  slug: string
  level: number
  sector_slug: string | null
  tree_count: number
  updated_at: string | null
}

/* Sitemap of L2-L5 category pages. Only emits categories that have >= 5
   listings in their descendant tree (matching the public page's robots
   gate). Walking every category nightly is fine — categories table is
   small relative to listings. */
export async function GET() {
  let rows: CatRow[] = []
  try {
    rows = await query<CatRow>(
      `SELECT c.id, c.slug, c.level, c.updated_at,
              CASE WHEN c.level = 2 THEN p.slug
                   WHEN c.level = 3 THEN gp.slug
                   WHEN c.level = 4 THEN ggp.slug
                   WHEN c.level = 5 THEN gggp.slug END AS sector_slug,
              (SELECT COUNT(*) FROM submissions s
                LEFT JOIN categories sc    ON sc.id    = s.category_id
                LEFT JOIN categories scp   ON scp.id   = sc.parent_id
                LEFT JOIN categories scgp  ON scgp.id  = scp.parent_id
                LEFT JOIN categories scggp ON scggp.id = scgp.parent_id
                LEFT JOIN categories scgggp ON scgggp.id = scggp.parent_id
               WHERE s.status IN ('active','paid')
                 AND (sc.id = c.id OR scp.id = c.id OR scgp.id = c.id OR scggp.id = c.id OR scgggp.id = c.id)
              ) AS tree_count
         FROM categories c
         LEFT JOIN categories p     ON p.id     = c.parent_id
         LEFT JOIN categories gp    ON gp.id    = p.parent_id
         LEFT JOIN categories ggp   ON ggp.id   = gp.parent_id
         LEFT JOIN categories gggp  ON gggp.id  = ggp.parent_id
        WHERE c.is_active = 1 AND c.is_launched = 1 AND c.level >= 2
        HAVING tree_count >= ?
        ORDER BY c.level, c.sort_order
        LIMIT 50000`,
      [INDEXABLE_THRESHOLD]
    )
  } catch { /* DB unavailable during build — emit empty sitemap */ }

  const now = new Date().toISOString().split('T')[0]
  const urls = rows
    .filter(r => r.sector_slug && L1_SLUGS.has(r.sector_slug))
    .map(r => {
      const lastmod = r.updated_at ? new Date(r.updated_at).toISOString().split('T')[0] : now
      /* Deeper levels = more specific = slightly lower priority. L2 = 0.8,
         L3 = 0.7, L4 = 0.6, L5 = 0.5. */
      const priority = (0.9 - (r.level - 1) * 0.1).toFixed(1)
      return `  <url>
    <loc>${BASE}/${r.sector_slug}/${r.slug}</loc>
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
