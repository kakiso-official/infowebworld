import { NextResponse } from 'next/server'
import { getApis, getOss } from '@/lib/developers/store'
import { indexableUrls } from '@/lib/developers/indexing'

const BASE = 'https://www.infowebworld.com'

export const revalidate = 86400

/* InfoWebWorld for Developers sub-sitemap. indexableUrls() applies the same
   index gates the pages use (lib/developers/indexing.ts), so nothing listed
   here is noindex: hubs, methodology, the repo ranking (pages 1-10), the
   companies index, indexable language/topic/country/industry pages (with
   their /page/{n}), good first issues, indexable companies and repos, the
   three API collections, SDK pages, categories and reviewed APIs. The
   search page is never listed. */

export async function GET() {
  const [oss, apis] = await Promise.all([
    getOss().catch(() => null),
    getApis().catch(() => null),
  ])

  const urls = indexableUrls(oss, apis)
    .map(e => `  <url>
    <loc>${BASE}${e.path}</loc>
    <lastmod>${e.lastmod}</lastmod>
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
