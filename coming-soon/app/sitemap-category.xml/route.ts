import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const BASE = 'https://infowebworld.com'

export async function GET() {
  let entries = ''

  try {
    const categories = await query<{ slug: string; updated_at: string; level: number }>(
      'SELECT slug, updated_at, level FROM categories WHERE is_launched = 1 AND is_active = 1 AND is_navigation = 1 ORDER BY level, updated_at DESC'
    )

    entries = categories
      .map((cat) => {
        const lastmod = new Date(cat.updated_at).toISOString().split('T')[0]
        const priority = cat.level === 1 ? '0.8' : cat.level === 2 ? '0.7' : '0.6'
        return `  <url>
    <loc>${BASE}/${cat.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
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
