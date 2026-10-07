import { NextResponse } from 'next/server'
import {
  getCountriesWithListings,
  getCountrySectorPairs,
} from '@/app/countries/country-data'
import {
  COUNTRIES_INDEX_PATH,
  COUNTRY_INDEX_MIN_LISTINGS,
  countryHubPath,
  countrySectorPath,
} from '@/lib/country-paths'

const BASE = 'https://www.infowebworld.com'

/* Always computed at request time from the live DB — a build-time prerender
   would freeze the country list until the next deploy (same reasoning as
   sitemap-categories.xml). */
export const dynamic = 'force-dynamic'

/* Sitemap of the country directory pages (Oct 2026):
     · /countries                     the index — always included
     · /countries/{country}           every country whose live listing count
                                       clears COUNTRY_INDEX_MIN_LISTINGS
     · /countries/{country}/{sector}  every country x sector pair at page 1
                                       that clears COUNTRY_INDEX_MIN_LISTINGS
   Mirrors the page-level robots rule in each page's metadata (lib/country-
   paths.ts + app/countries/*) so nothing listed here ever renders noindex. */
export async function GET() {
  try {
    const [countries, pairs] = await Promise.all([
      getCountriesWithListings(),
      getCountrySectorPairs(),
    ])

    const slugById = new Map(countries.map((c) => [c.id, c.slug]))
    const now = new Date().toISOString().split('T')[0]

    const urls: string[] = [
      `  <url>
    <loc>${BASE}${COUNTRIES_INDEX_PATH}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    ]

    for (const c of countries) {
      if (c.listings < COUNTRY_INDEX_MIN_LISTINGS) continue
      urls.push(`  <url>
    <loc>${BASE}${countryHubPath(c.slug)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`)
    }

    for (const pair of pairs) {
      if (pair.listings < COUNTRY_INDEX_MIN_LISTINGS) continue
      const slug = slugById.get(pair.countryId)
      if (!slug) continue
      urls.push(`  <url>
    <loc>${BASE}${countrySectorPath(slug, pair.sector)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>`)
    }

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
  } catch {
    /* DB unreachable. A 503 tells crawlers to come back later instead of
       seeing an empty-but-200 sitemap that implies the country pages are
       gone. no-store keeps any cache from holding on to the failure. */
    return new NextResponse('Sitemap temporarily unavailable', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Retry-After': '3600',
        'Cache-Control': 'no-store',
      },
    })
  }
}
