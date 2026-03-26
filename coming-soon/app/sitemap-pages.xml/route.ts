import { NextResponse } from 'next/server'

const BASE = 'https://infowebworld.com'

const STATIC_PAGES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/blog', changefreq: 'daily', priority: '0.8' },
  { path: '/categories', changefreq: 'weekly', priority: '0.8' },
  { path: '/business', changefreq: 'weekly', priority: '0.9' },
]

export async function GET() {
  const now = new Date().toISOString().split('T')[0]

  const entries = STATIC_PAGES.map(
    (page) => `  <url>
    <loc>${BASE}${page.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
