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

  /* /{sector}/{categorySlug} — L2/L3/L4/L5 category detail pages AND the
     view-all-sub-categories-{sector} index pages. Both are indexable: the
     view-all pages now carry a full @graph (CollectionPage + ItemList +
     Dataset + DefinedTermSet + HowTo + sector-specific FAQ) so they're a
     real AEO/GEO surface, not a duplicate of /categories. */
  if (segments.length === 2 && SECTOR_SLUGS.has(segments[0])) return false

  /* Individual listing + company profile pages. */
  if (segments.length === 2 && (segments[0] === 'listing' || segments[0] === 'profile')) return false

  /* Product comparison pages — let the page's own metadata decide index vs
     noindex (real 2-4 product comparisons are index+follow; empty, invalid-
     slug, and single-product variants set their own noindex). Without this,
     the blanket header below would noindex every /compare URL regardless. */
  if (segments.length === 2 && segments[0] === 'compare') return false

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
    /* Search results stay out of the index but keep their links crawlable
       (follow) so PageRank flows to the listings + categories they surface. */
    const robots = (!isVercelApp && pathname === '/search') ? 'noindex, follow' : 'noindex, nofollow'
    response.headers.set('X-Robots-Tag', robots)
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

/* ── Removed country URL space ──
   The site used to serve /{country}/* URLs (/uk/blog, /us/ai-ml, bare /uk, …).
   Those are gone. We REWRITE them to /url-removed (handler below), which renders
   the real branded site 404 (app/not-found.tsx — navbar, footer, styles) with a
   TRUE 404 status, instead of a bare middleware-authored HTML string. Why a
   rewrite, and not a redirect or just the catch-all:
     - a redirect would keep Google following/holding the old URL, and
     - the app/[...segments] catch-all calls notFound() but, under
       `dynamic = 'force-dynamic'`, its shell streams with a 200 status BEFORE
       notFound() throws — a soft-404 (HTTP 200) Google treats as a live page.
       /url-removed has no dynamic config, so it renders non-streamed and its
       notFound() returns a real 404 (streamed → 200, non-streamed → 404).
   The (\/|$) boundary keeps real routes safe: /insights, /investors,
   /categories, /glossary, /us... never match (they need a / or end after the
   country code). */
const COUNTRY_PREFIX_RE = /^\/(in|us|uk|ca|au|eu|global)(\/|$)/

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isVercelApp = request.headers.get('host')?.includes('vercel.app') ?? false

  /* Removed country URL space → rewrite to /url-removed so the visitor keeps
     their original URL but gets the real branded 404 page with a TRUE 404
     status (see COUNTRY_PREFIX_RE above for why a rewrite, not a redirect or
     the soft-404'ing catch-all). */
  if (COUNTRY_PREFIX_RE.test(pathname)) {
    const gone = NextResponse.rewrite(new URL('/url-removed', request.url))
    gone.headers.set('x-robots-tag', 'noindex, nofollow')
    gone.headers.set('cache-control', 'no-store')
    return gone
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
