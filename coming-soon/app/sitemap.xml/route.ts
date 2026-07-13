import { NextResponse } from 'next/server'

const BASE = 'https://www.infowebworld.com'

/* Full sitemap index — references every sub-sitemap:
   - sitemap-pages.xml       static indexable pages (Home, About, Plans, etc.)
   - sitemap-sectors.xml     6 L1 sector landing pages
   - sitemap-categories.xml  L2-L5 category pages with >= 5 listings
   - sitemap-listings.xml    individual /listing and /profile pages
   - sitemap-blog.xml        published blog posts */
const SUB_SITEMAPS = [
  'sitemap-pages.xml',
  'sitemap-sectors.xml',
  'sitemap-categories.xml',
  'sitemap-listings.xml',
  'sitemap-blog.xml',
]

export async function GET() {
  const entries = SUB_SITEMAPS.map(
    (name) => `  <sitemap><loc>${BASE}/${name}</loc></sitemap>`
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
