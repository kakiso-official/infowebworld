import { NextResponse } from 'next/server'

const BASE = 'https://infowebworld.com'

/* Only the 4 indexable pages — category/company/blog sitemaps disabled to prevent bot-driven quota burn */
const SUB_SITEMAPS = [
  'sitemap-pages.xml',
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
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
