import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const BASE = 'https://infowebworld.com'

export async function GET() {
  let entries = ''

  try {
    const companies = await query<{ slug: string; updated_at: string }>(
      "SELECT slug, updated_at FROM submissions WHERE status IN ('active','paid') AND slug IS NOT NULL ORDER BY updated_at DESC"
    )

    entries = companies
      .map((company) => {
        const lastmod = new Date(company.updated_at).toISOString().split('T')[0]
        return `  <url>
    <loc>${BASE}/company/${company.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
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
