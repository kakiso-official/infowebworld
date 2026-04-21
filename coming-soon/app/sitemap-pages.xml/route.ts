import { NextResponse } from 'next/server'

const BASE = 'https://infowebworld.com'

const COUNTRIES = ['in', 'us', 'uk', 'ca', 'au', 'eu']

/* Only the 4 indexable pages — matches middleware INDEXABLE_PATHS */
const STATIC_PAGES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/business', changefreq: 'weekly', priority: '0.9' },
  { path: '/business/plans', changefreq: 'monthly', priority: '0.8' },
]

export async function GET() {
  const now = new Date().toISOString().split('T')[0]

  const urls: string[] = []

  // Root/global versions
  for (const page of STATIC_PAGES) {
    urls.push(`  <url>
    <loc>${BASE}${page.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  }

  // Country-prefixed versions
  for (const country of COUNTRIES) {
    for (const page of STATIC_PAGES) {
      const path = page.path === '/' ? '' : page.path
      urls.push(`  <url>
    <loc>${BASE}/${country}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
    }
  }

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
