import { NextResponse } from 'next/server'
import { getPublishedPosts } from '@/lib/blog'

const BASE = 'https://www.infowebworld.com'

/* Blog sitemap — built from published posts in the blog_posts table. */
export async function GET() {
  const posts = await getPublishedPosts()
  const now = new Date().toISOString().split('T')[0]

  const urls = posts.map(p => {
    const src = p.updatedAt || p.publishedAt || p.createdAt
    const lastmod = src ? new Date(src).toISOString().split('T')[0] : now
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
