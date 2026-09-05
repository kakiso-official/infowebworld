import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const BASE = 'https://www.infowebworld.com'

type ListingRow = {
  slug: string
  listing_mode: string | null
  updated_at: string | null
  approved_at: string | null
}

/* Sitemap of individual listing + profile pages. Active + paid submissions
   only. Companies (listing_mode='company') route to /profile/<slug>;
   everything else routes to /listing/<slug>.

   Company rows are filtered to the ones that will actually be indexable.
   Until Sep 2026 this sitemap submitted all 5,723 /profile URLs to Google
   while every one of those pages served `noindex, nofollow` — a
   guaranteed "Submitted URL marked noindex" error in Search Console, and
   an invitation for Googlebot to spend its crawl budget on the slowest
   pages on the site. The predicate below mirrors hasSubstantiveProfile()
   in app/profile/[slug]/page.tsx: claimed/verified, or a readable body
   plus one genuinely distinctive signal.
   Keep the two in step — a URL listed here must not render noindex. */
/* A junk description must not count as content here, or this filter would
   list a URL that then renders noindex — the exact mismatch this whole
   change is meant to remove. Mirrors isJunkText() in lib/seo.ts: too short
   to be prose, or the enrichment agent's error text. */
const NOT_JUNK_DESC = `(
  CHAR_LENGTH(COALESCE(description, '')) >= 25
  AND description NOT REGEXP '(?i)(verification failed|bot[- ]gated|requires? javascript|security (checkpoint|challenge|service|measures)|browser verification|access (denied|forbidden)|(unable|failed) +(to +)?(extract|verify|access)|no (content|business information) (available|accessible)|content (not available|unavailable)|(limited|no) information available|homepage returned empty)'
)`

const COMPANY_INDEXABLE_SQL = `(
     -- an owner claimed or verified this listing: always index
     ((verified = 1 OR user_id IS NOT NULL)
       AND CHAR_LENGTH(COALESCE(description, '')) >= 100 AND ${NOT_JUNK_DESC})
  OR (
       -- otherwise: a readable body PLUS at least one distinctive signal.
       -- Derived fields (service_lines, firmographics) are deliberately NOT
       -- accepted as evidence — they sit on 86% / 50% of rows and prove
       -- nothing. See hasSubstantiveProfile() in app/profile/[slug]/page.tsx.
       CHAR_LENGTH(COALESCE(description, '')) >= 150 AND ${NOT_JUNK_DESC}
       AND (
            CHAR_LENGTH(COALESCE(description, '')) >= 300
         OR (JSON_VALID(awards)       AND JSON_LENGTH(awards) > 0)
         OR (JSON_VALID(client_logos) AND JSON_LENGTH(client_logos) > 0)
         OR COALESCE(intro_video_url, '') <> ''
       )
     )
  )`

/* NOTE: the page-level gate also passes a profile that has reviews or child
   products. Those need subqueries that would slow this whole-table scan, so
   they are omitted here — which makes this filter a strict SUBSET of the
   page gate. That is the safe direction: the sitemap may omit a page that
   would index (Google still finds it via internal links), but it can never
   advertise a URL that then renders noindex. */

export async function GET() {
  let rows: ListingRow[] = []
  try {
    rows = await query<ListingRow>(
      `SELECT slug, COALESCE(listing_mode, 'product') as listing_mode,
              updated_at, approved_at
         FROM submissions
        WHERE status IN ('active','paid') AND slug IS NOT NULL AND slug <> ''
          AND (COALESCE(listing_mode, 'product') <> 'company' OR ${COMPANY_INDEXABLE_SQL})
        ORDER BY approved_at DESC, created_at DESC
        LIMIT 50000`
    )
  } catch {
    /* Older schemas lack the Clutch-style columns the predicate reads.
       Fall back to the unfiltered query rather than emitting nothing. */
    try {
      rows = await query<ListingRow>(
        `SELECT slug, COALESCE(listing_mode, 'product') as listing_mode,
                updated_at, approved_at
           FROM submissions
          WHERE status IN ('active','paid') AND slug IS NOT NULL AND slug <> ''
          ORDER BY approved_at DESC, created_at DESC
          LIMIT 50000`
      )
    } catch { /* DB unavailable during build — emit empty sitemap */ }
  }

  const now = new Date().toISOString().split('T')[0]
  const urls = rows.map(r => {
    const path = (r.listing_mode === 'company' ? '/profile/' : '/listing/') + r.slug
    const lastmod = (r.updated_at || r.approved_at)
      ? new Date(String(r.updated_at || r.approved_at)).toISOString().split('T')[0]
      : now
    return `  <url>
    <loc>${BASE}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  })

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
