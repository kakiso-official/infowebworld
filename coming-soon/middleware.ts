import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/* ── Exact-match indexable static pages ── */
const INDEXABLE_PATHS = new Set([
  '', '/',
  '/business',
  '/business/plans',
  '/categories',
  '/about',
  '/terms',
  '/privacy',
  '/cookies',
  '/content-guidelines',
  '/do-not-sell',
  '/faqs',
  '/help',
  '/glossary',
  '/category-guides',
  '/removals',
  '/agencies',
  '/affiliates',
  '/media',
  '/investors',
  '/team',
  '/team/past',
  '/insights',
  '/write-review',
])

/* L1 sector slugs — used to detect sector landing + category detail routes
   so middleware can allow them through (meta-robots in [...segments]/page.tsx
   then handles the per-page index/noindex decision via the 5-listing
   threshold). Must stay in sync with the L1_SLUGS set in that file. */
const SECTOR_SLUGS = new Set([
  'ai-ml', 'software-saas', 'it-services-agencies',
  'startups-innovation', 'local-businesses', 'professional-services',
])

function shouldNoindex(pathname: string): boolean {
  if (INDEXABLE_PATHS.has(pathname)) return false

  const segments = pathname.split('/').filter(Boolean)

  /* /{sector} — L1 sector landing pages. Always indexable. */
  if (segments.length === 1 && SECTOR_SLUGS.has(segments[0])) return false

  /* /{sector}/{categorySlug} — L2/L3/L4/L5 category detail pages.
     Indexable EXCEPT for the view-all-sub-categories navigation aids
     (those duplicate the /categories index and add no unique content). */
  if (segments.length === 2 && SECTOR_SLUGS.has(segments[0])) {
    if (segments[1].startsWith('view-all-sub-categories-')) return true
    return false
  }

  /* Individual listing + company profile pages. */
  if (segments.length === 2 && (segments[0] === 'listing' || segments[0] === 'profile')) return false

  /* Blog index + posts. */
  if (segments[0] === 'blog') return false

  /* Sector standalone routes used by the legacy /sector/<slug> path. */
  if (segments[0] === 'sector' && segments.length === 2) return false

  /* Everything else (auth, admin, signup, dashboard, settings, etc.) stays noindex. */
  return true
}

/* Routes that serve per-user content — must never be cached in a shared cache.
   This includes the business dashboard and the admin panel. A previous version
   of this file unconditionally set CDN-Cache-Control: public, s-maxage=3600 on
   every response, which would have allowed the Vercel edge to serve one user's
   logged-in dashboard HTML to the next visitor. Auth paths now get explicit
   no-store on every cache layer. */
const AUTH_PATH_RE = /(^|\/)(dashboard|iww-hq)(\/|$)/

/** Apply noindex header to non-indexable pages + all vercel.app requests, then
    cache headers per route class:
    - Auth paths (/dashboard, /iww-hq): hard no-store on browser, CDN, and
      Vercel's own CDN — never share a logged-in response.
    - Public pages: short browser cache + Vercel edge cache for instant back /
      forward navigation. */
function applyHeaders(response: NextResponse, pathname: string, isVercelApp: boolean) {
  if (isVercelApp || shouldNoindex(pathname)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  if (AUTH_PATH_RE.test(pathname)) {
    response.headers.set('Cache-Control', 'private, no-store, no-cache, must-revalidate, max-age=0')
    response.headers.set('CDN-Cache-Control', 'no-store')
    response.headers.set('Vercel-CDN-Cache-Control', 'no-store')
    return
  }

  response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
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

  /* Forward the pathname to server components via a request header so the
     shared InfoPageShell can auto-generate per-page JSON-LD (canonical URL,
     breadcrumbs) without each page having to plumb it through props. */
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  applyHeaders(response, pathname, isVercelApp)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api|iww-hq|sitemap|favicon|logo|uploads|og-image|icon\\.svg|robots\\.txt).*)',
  ],
}
