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
   Those are gone. We return a hard 404 for them straight from middleware,
   because:
     - a redirect would keep Google following/holding the old URL, and
     - the app/[...segments] catch-all calls notFound() but, under
       `dynamic = 'force-dynamic'`, the shell streams with a 200 status BEFORE
       notFound() throws — producing a soft-404 (HTTP 200). Middleware is the
       only place the 404 status is authoritative.
   The (\/|$) boundary keeps real routes safe: /insights, /investors,
   /categories, /glossary, /us... never match (they need a / or end after the
   country code). */
const COUNTRY_PREFIX_RE = /^\/(in|us|uk|ca|au|eu|global)(\/|$)/

const GONE_404_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>404 - Page not found | InfoWebWorld</title>
<style>
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#0b1020;color:#e8ecf4;text-align:center;padding:24px}
.c{max-width:480px}
.n{font-size:96px;font-weight:800;letter-spacing:-2px;line-height:1;margin:0 0 8px;background:linear-gradient(135deg,#6366f1,#22d3ee);-webkit-background-clip:text;background-clip:text;color:transparent}
h1{font-size:22px;margin:0 0 10px}
p{color:#9aa4bf;font-size:15px;line-height:1.6;margin:0 0 24px}
a{display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:15px}
</style>
</head>
<body>
<div class="c">
<p class="n">404</p>
<h1>Page not found</h1>
<p>This page doesn&rsquo;t exist. Country-specific URLs were removed - everything now lives on a single global address.</p>
<a href="/">Go to InfoWebWorld home</a>
</div>
</body>
</html>`

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isVercelApp = request.headers.get('host')?.includes('vercel.app') ?? false

  /* Removed country URL space → hard 404 (see COUNTRY_PREFIX_RE above). Set
     the status here because the app catch-all's notFound() soft-404s (200)
     under force-dynamic streaming. */
  if (COUNTRY_PREFIX_RE.test(pathname)) {
    return new NextResponse(GONE_404_HTML, {
      status: 404,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'x-robots-tag': 'noindex, nofollow',
        'cache-control': 'no-store',
      },
    })
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
