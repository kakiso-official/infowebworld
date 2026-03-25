import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const BASE = 'https://infowebworld.com'

export async function GET() {
  let entries = ''

  try {
    const posts = await query<{ slug: string; updated_at: string }>(
      "SELECT slug, updated_at FROM blog_posts WHERE status = 'published' ORDER BY updated_at DESC"
    )

    entries = posts
      .map((post) => {
        const lastmod = new Date(post.updated_at).toISOString().split('T')[0]
        return `  <url>
    <loc>${BASE}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
      })
      .join('\n')
  } catch {
    // DB unavailable — return empty urlset
  }

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
