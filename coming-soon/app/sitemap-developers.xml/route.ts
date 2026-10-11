import { NextResponse } from 'next/server'
import { getApis, getOss } from '@/lib/developers/store'
import { indexableUrls } from '@/lib/developers/indexing'

const BASE = 'https://www.infowebworld.com'

export const revalidate = 86400

/* InfoWebWorld for Developers sub-sitemap. indexableUrls() applies the same
   index gates the pages use (lib/developers/indexing.ts), so nothing listed
   here is noindex. This release ships the hubs, company pages, API categories
   and reviewed API pages only, so URLs of the page types that are not built
   yet (repo pages, facets, good first issues, collections, SDKs, methodology)
   are filtered out until those routes exist. */
const BUILT: RegExp[] = [
  /^\/developers$/,
  /^\/developers\/open-source$/,
  /^\/developers\/open-source\/[a-z0-9-]+$/,
  /^\/developers\/free-apis$/,
  /^\/developers\/free-apis\/[a-z0-9-]+$/,
  /^\/developers\/free-apis\/[a-z0-9-]+\/[a-z0-9-]+$/,
]
const NOT_BUILT = new Set([
  'repos', 'companies', 'languages', 'topics', 'countries', 'industries', 'good-first-issues',
  'no-auth', 'cors-enabled', 'ai-llm', 'sdks', 'methodology', 'search', 'page',
])

function isBuilt(path: string): boolean {
  if (!BUILT.some(re => re.test(path))) return false
  return !path.split('/').slice(2).some(seg => NOT_BUILT.has(seg))
}

export async function GET() {
  const [oss, apis] = await Promise.all([
    getOss().catch(() => null),
    getApis().catch(() => null),
  ])

  const urls = indexableUrls(oss, apis)
    .filter(e => isBuilt(e.path))
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
