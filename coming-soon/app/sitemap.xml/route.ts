import { NextResponse } from 'next/server'

const BASE = 'https://infowebworld.com'

const COUNTRIES = ['in', 'us', 'uk', 'ca', 'au', 'eu']

const SUB_SITEMAPS = [
  'sitemap-pages.xml',
  'sitemap-category.xml',                          // global/root categories
  ...COUNTRIES.map(c => `sitemap-category-${c}.xml`), // per-country categories
  'sitemap-company.xml',
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
