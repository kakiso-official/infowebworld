import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const BASE = 'https://infowebworld.com'

type ListingRow = {
  slug: string
  listing_mode: string | null
  updated_at: string | null
  approved_at: string | null
}

/* Sitemap of individual listing + profile pages. Active + paid submissions
   only. Companies (listing_mode='company') route to /profile/<slug>;
   everything else routes to /listing/<slug>. */
export async function GET() {
  let rows: ListingRow[] = []
  try {
    rows = await query<ListingRow>(
      `SELECT slug, COALESCE(listing_mode, 'product') as listing_mode,
              updated_at, approved_at
         FROM submissions
        WHERE status IN ('active','paid') AND slug IS NOT NULL AND slug <> ''
        ORDER BY approved_at DESC, created_at DESC
        LIMIT 50000`
    )
  } catch { /* DB unavailable during build — emit empty sitemap */ }

  const now = new Date().toISOString().split('T')[0]
  const urls = rows.map(r => {
    const path = (r.listing_mode === 'company' ? '/profile/' : '/listing/') + r.slug
    const lastmod = (r.updated_at || r.approved_at)
      ? new Date(String(r.updated_at || r.approved_at)).toISOString().split('T')[0]
      : now
    return `  <url>
    <loc>${BASE}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
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
