import { NextResponse } from 'next/server'

const BASE = 'https://www.infowebworld.com'

/* The 6 L1 sector landings — top of the taxonomy, always indexable,
   highest priority after the homepage. */
const SECTORS = [
  'ai-ml',
  'software-saas',
  'it-services-agencies',
  'startups-innovation',
  'local-businesses',
  'professional-services',
]

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  const sectorUrls = SECTORS.map(s => `  <url>
    <loc>${BASE}/${s}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>`)

  /* view-all sector indexes — `/${sector}/view-all-sub-categories-${sector}`.
     Sit just below the sector landings: full @graph CollectionPage carrying
     ItemList + Dataset + DefinedTermSet + HowTo + FAQ, unique answer surface. */
  const viewAllUrls = SECTORS.map(s => `  <url>
    <loc>${BASE}/${s}/view-all-sub-categories-${s}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sectorUrls.join('\n')}
${viewAllUrls.join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
