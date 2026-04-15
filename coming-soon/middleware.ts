import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { COOKIE_NAME, COOKIE_MAX_AGE, GLOBAL_COUNTRY, GLOBAL_COOKIE, geoToCountry, isValidCountry } from './app/config/countries'

/* ── Only these 4 pages are indexable — everything else gets noindex ── */
const INDEXABLE_PATHS = new Set(['', '/', '/business', '/plans', '/contact'])

function shouldNoindex(pathname: string): boolean {
  const firstSeg = pathname.split('/')[1] || ''
  const restPath = isValidCountry(firstSeg)
    ? pathname.slice(firstSeg.length + 1) || '/'
    : pathname
  return !INDEXABLE_PATHS.has(restPath)
}

/** Apply noindex header to non-indexable pages + all vercel.app requests */
function applyRobotsTag(response: NextResponse, pathname: string, isVercelApp: boolean) {
  if (isVercelApp || shouldNoindex(pathname)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isVercelApp = request.headers.get('host')?.includes('vercel.app') ?? false

  // Skip static assets, api, admin, sitemaps
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/iww-hq') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/logo') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/og-image') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/robots') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|css|js|woff|woff2|ttf|webp)$/)
  ) {
    return NextResponse.next()
  }

  const firstSeg = pathname.split('/')[1]

  // First segment is a valid country prefix → let it through
  if (isValidCountry(firstSeg)) {
    const response = NextResponse.next()
    if (!request.cookies.get(COOKIE_NAME)) {
      response.cookies.set(COOKIE_NAME, firstSeg, { path: '/', maxAge: COOKIE_MAX_AGE, sameSite: 'lax' })
    }
    applyRobotsTag(response, pathname, isVercelApp)
    return response
  }

  // No country prefix — determine if we should redirect or serve global

  // If user explicitly chose "Global" → serve root (no redirect)
  const cookieVal = request.cookies.get(COOKIE_NAME)?.value
  if (cookieVal === GLOBAL_COOKIE) {
    const response = NextResponse.rewrite(new URL(`/${GLOBAL_COUNTRY}${pathname}`, request.url))
    applyRobotsTag(response, pathname, isVercelApp)
    return response
  }

  // Check cookie for a saved country preference
  if (cookieVal && isValidCountry(cookieVal)) {
    const url = request.nextUrl.clone()
    url.pathname = `/${cookieVal}${pathname}`
    const response = NextResponse.redirect(url, 307)
    applyRobotsTag(response, pathname, isVercelApp)
    return response
  }

  // Detect from geo header
  const geo = request.headers.get('x-vercel-ip-country')
  const country = geoToCountry(geo)

  if (country) {
    const url = request.nextUrl.clone()
    url.pathname = `/${country}${pathname}`
    const response = NextResponse.redirect(url, 307)
    response.cookies.set(COOKIE_NAME, country, { path: '/', maxAge: COOKIE_MAX_AGE, sameSite: 'lax' })
    applyRobotsTag(response, pathname, isVercelApp)
    return response
  }

  // Unsupported country → serve global (root, no prefix)
  const response = NextResponse.rewrite(new URL(`/${GLOBAL_COUNTRY}${pathname}`, request.url))
  applyRobotsTag(response, pathname, isVercelApp)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api|iww-hq|sitemap|favicon|logo|uploads|og-image|icon\\.svg|robots\\.txt).*)',
  ],
}
