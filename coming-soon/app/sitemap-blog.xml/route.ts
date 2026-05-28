import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const BASE = 'https://infowebworld.com'

type PostRow = { slug: string; updated_at: string | null; published_at: string | null }

export async function GET() {
  let rows: PostRow[] = []
  try {
    rows = await query<PostRow>(
      `SELECT slug, updated_at, published_at
         FROM blog_posts
        WHERE status = 'published' AND slug IS NOT NULL AND slug <> ''
        ORDER BY published_at DESC
        LIMIT 5000`
    )
  } catch { /* blog_posts table may not exist yet — emit empty */ }

  const now = new Date().toISOString().split('T')[0]
  const urls = rows.map(p => {
    const lastmod = (p.updated_at || p.published_at)
      ? new Date(String(p.updated_at || p.published_at)).toISOString().split('T')[0]
      : now
    return `  <url>
    <loc>${BASE}/blog/${p.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
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
