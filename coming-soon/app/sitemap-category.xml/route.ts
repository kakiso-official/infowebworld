import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const BASE = 'https://infowebworld.com'

/** Shared category sitemap builder — used by both global and per-country routes */
export async function buildCategorySitemap(countryPrefix: string = '') {
  let entries = ''

  try {
    const categories = await query<{ slug: string; updated_at: string; level: number; sector_slug: string }>(
      `SELECT c.slug, c.updated_at, c.level,
        CASE WHEN c.level = 1 THEN c.slug WHEN c.level = 2 THEN p.slug WHEN c.level = 3 THEN gp.slug END as sector_slug
      FROM categories c
      LEFT JOIN categories p ON p.id = c.parent_id
      LEFT JOIN categories gp ON gp.id = p.parent_id
      WHERE c.is_launched = 1 AND c.is_navigation = 1
      ORDER BY c.level, c.updated_at DESC`
    )

    const prefix = countryPrefix ? `${BASE}/${countryPrefix}` : BASE

    entries = categories
      .map((cat) => {
        const lastmod = new Date(cat.updated_at).toISOString().split('T')[0]
        const priority = cat.level === 1 ? '0.8' : cat.level === 2 ? '0.7' : '0.6'
        const loc = cat.level === 1 ? `${prefix}/${cat.slug}` : `${prefix}/${cat.sector_slug}/${cat.slug}`
        return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
      })
      .join('\n')
  } catch {
    // DB unavailable — return empty urlset
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`
}

/** Global/root category sitemap (no country prefix) */
export async function GET() {
  const xml = await buildCategorySitemap('')

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
