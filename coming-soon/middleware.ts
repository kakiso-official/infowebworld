import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/* ── Only these 3 pages are indexable — everything else gets noindex ── */
const INDEXABLE_PATHS = new Set(['', '/', '/business', '/business/plans'])

function shouldNoindex(pathname: string): boolean {
  return !INDEXABLE_PATHS.has(pathname)
}

/* Routes that serve per-user content — must never be cached in a shared cache. */
const AUTH_PATH_RE = /(^|\/)(dashboard|iww-hq)(\/|$)/

/** Apply noindex header to non-indexable pages + all vercel.app requests. Also
    set cache headers: Vercel edge caches all responses via CDN-Cache-Control,
    and public non-auth pages additionally get a short browser cache so back /
    forward navigation is instant instead of a fresh 700 KB HTML re-download. */
function applyHeaders(response: NextResponse, pathname: string, isVercelApp: boolean) {
  if (isVercelApp || shouldNoindex(pathname)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

  if (!AUTH_PATH_RE.test(pathname)) {
    response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  }
}

/* Bare country prefixes — exact matches only (paths under them are handled
   by next.config.ts redirects, which work fine; only /:country with no trailing
   path needs middleware because next.config.ts produces an empty Location
   header when destination is '/'). */
const BARE_COUNTRY_PATHS = new Set([
  '/in', '/us', '/uk', '/ca', '/au', '/eu', '/global',
])

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isVercelApp = request.headers.get('host')?.includes('vercel.app') ?? false

  if (BARE_COUNTRY_PATHS.has(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url, 308)
  }

  const response = NextResponse.next()
  applyHeaders(response, pathname, isVercelApp)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api|iww-hq|sitemap|favicon|logo|uploads|og-image|icon\\.svg|robots\\.txt).*)',
  ],
}
