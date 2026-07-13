import { NextResponse } from 'next/server'

const BASE = 'https://www.infowebworld.com'

/* Indexable pages — mirrors middleware INDEXABLE_PATHS minus /investors
   (page-level metadata.robots = noindex even though it appears in the
   allowlist for navigation purposes). */
const STATIC_PAGES = [
  { path: '/',                   changefreq: 'daily',   priority: '1.0' },
  { path: '/business',           changefreq: 'weekly',  priority: '0.95' },
  { path: '/business/plans',     changefreq: 'weekly',  priority: '0.95' },
  { path: '/categories',         changefreq: 'daily',   priority: '0.95' },
  { path: '/about',              changefreq: 'monthly', priority: '0.9' },
  { path: '/terms',              changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy',            changefreq: 'monthly', priority: '0.7' },
  { path: '/cookies',            changefreq: 'monthly', priority: '0.6' },
  { path: '/content-guidelines', changefreq: 'monthly', priority: '0.7' },
  { path: '/do-not-sell',        changefreq: 'monthly', priority: '0.6' },
  { path: '/faqs',               changefreq: 'weekly',  priority: '0.9' },
  { path: '/help',               changefreq: 'weekly',  priority: '0.85' },
  { path: '/glossary',           changefreq: 'weekly',  priority: '0.85' },
  { path: '/category-guides',    changefreq: 'weekly',  priority: '0.85' },
  { path: '/removals',           changefreq: 'monthly', priority: '0.6' },
  { path: '/agencies',           changefreq: 'weekly',  priority: '0.85' },
  { path: '/affiliates',         changefreq: 'weekly',  priority: '0.85' },
  { path: '/media',              changefreq: 'monthly', priority: '0.7' },
  { path: '/team',               changefreq: 'weekly',  priority: '0.8' },
  { path: '/team/past',          changefreq: 'monthly', priority: '0.5' },
  { path: '/insights',           changefreq: 'weekly',  priority: '0.8' },
  { path: '/write-review',       changefreq: 'weekly',  priority: '0.8' },
  { path: '/blog',               changefreq: 'daily',   priority: '0.9' },
]

export async function GET() {
  const now = new Date().toISOString().split('T')[0]

  const urls = STATIC_PAGES.map(page => `  <url>
    <loc>${BASE}${page.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)

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
