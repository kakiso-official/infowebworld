import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { VALID_COUNTRIES, DEFAULT_COUNTRY, COOKIE_NAME, COOKIE_MAX_AGE, ROOT_COUNTRY, geoToCountry, isValidCountry } from './app/config/countries'

export function proxy(request: NextRequest) {
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

  // If someone visits /us/... → strip prefix and redirect to root
  if (firstSeg === ROOT_COUNTRY) {
    const rest = pathname.replace(new RegExp(`^/${ROOT_COUNTRY}(/|$)`), '/')
    const url = request.nextUrl.clone()
    url.pathname = rest
    const response = NextResponse.redirect(url, 308)
    response.cookies.set(COOKIE_NAME, ROOT_COUNTRY, { path: '/', maxAge: COOKIE_MAX_AGE, sameSite: 'lax' })
    if (isVercelApp) response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return response
  }

  // Check if first segment is already a valid country prefix (non-root)
  if (isValidCountry(firstSeg)) {
    const response = NextResponse.next()
    if (!request.cookies.get(COOKIE_NAME)) {
      response.cookies.set(COOKIE_NAME, firstSeg, { path: '/', maxAge: COOKIE_MAX_AGE, sameSite: 'lax' })
    }
    if (isVercelApp) response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return response
  }

  // No country prefix — determine country: cookie > geo header > default
  let country = DEFAULT_COUNTRY
  const cookieVal = request.cookies.get(COOKIE_NAME)?.value
  if (cookieVal && isValidCountry(cookieVal)) {
    country = cookieVal
  } else {
    const geo = request.headers.get('x-vercel-ip-country')
    country = geoToCountry(geo)
  }

  // US (root country) → serve at root path via rewrite (no redirect, no prefix)
  if (country === ROOT_COUNTRY) {
    const response = NextResponse.rewrite(new URL(`/${ROOT_COUNTRY}${pathname}`, request.url))
    response.cookies.set(COOKIE_NAME, ROOT_COUNTRY, { path: '/', maxAge: COOKIE_MAX_AGE, sameSite: 'lax' })
    if (isVercelApp) response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return response
  }

  // Other countries → redirect to /{country}{pathname}{search}
  const url = request.nextUrl.clone()
  url.pathname = `/${country}${pathname}`
  const response = NextResponse.redirect(url, 307)
  response.cookies.set(COOKIE_NAME, country, { path: '/', maxAge: COOKIE_MAX_AGE, sameSite: 'lax' })
  if (isVercelApp) response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api|iww-hq|sitemap|favicon|logo|uploads|og-image|icon\\.svg|robots\\.txt).*)',
  ],
}
