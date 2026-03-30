import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { VALID_COUNTRIES, DEFAULT_COUNTRY, COOKIE_NAME, COOKIE_MAX_AGE, geoToCountry, isValidCountry } from './app/config/countries'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

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

  // Check if first segment is already a valid country
  const firstSeg = pathname.split('/')[1]
  if (isValidCountry(firstSeg)) {
    // Already has country prefix — set cookie if not set and continue
    const response = NextResponse.next()
    if (!request.cookies.get(COOKIE_NAME)) {
      response.cookies.set(COOKIE_NAME, firstSeg, { path: '/', maxAge: COOKIE_MAX_AGE, sameSite: 'lax' })
    }
    return response
  }

  // Determine country: cookie > geo header > default
  let country = DEFAULT_COUNTRY
  const cookieVal = request.cookies.get(COOKIE_NAME)?.value
  if (cookieVal && isValidCountry(cookieVal)) {
    country = cookieVal
  } else {
    const geo = request.headers.get('x-vercel-ip-country')
    country = geoToCountry(geo)
  }

  // Redirect to /{country}{pathname}{search}
  const url = request.nextUrl.clone()
  url.pathname = `/${country}${pathname}`
  const response = NextResponse.redirect(url, 307)
  response.cookies.set(COOKIE_NAME, country, { path: '/', maxAge: COOKIE_MAX_AGE, sameSite: 'lax' })
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api|iww-hq|sitemap|favicon|logo|uploads|og-image|icon\\.svg|robots\\.txt).*)',
  ],
}
