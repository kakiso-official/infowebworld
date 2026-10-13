import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE_NAME } from '@/lib/auth'
import { USER_COOKIE_NAME } from '@/lib/user-auth'
import { AN_IGNORE_COOKIE, AN_VID_COOKIE } from './types'
import type { UaHints } from './classify'

/* ═══════════════════════════════════════════════════════════════════════════
   Everything the collector needs from the HTTP request, read up front as
   plain values: after() runs once the response is sent, so the DB work
   must never touch the request object itself.

   Geo comes from Cloudflare: cf-ipcountry is always sent; cf-ipcity,
   cf-region and cf-timezone only when the "Add visitor location headers"
   managed transform is on - every field is optional. The client IP is used
   for in-memory rate limiting only and is never stored.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CollectorGeo {
  country: string | null   // ISO-3166 alpha-2, upper-case
  region: string | null
  city: string | null
  timezone: string | null
}

export interface CollectorRequest {
  contentLength: number | null
  ip: string
  ua: string
  hints: Omit<UaHints, 'touch'>
  geo: CollectorGeo
  /** Admin console session or the "Exclude this browser" cookie. */
  internal: boolean
  vidCookie: string | null
  userToken: string | null
  /** Host the request was sent to (counts as "our own site" in referrers). */
  host: string | null
  /** False when the browser says the request came from another site. */
  sameOrigin: boolean
}

/* Cloudflare placeholders: XX = unknown, T1 = Tor. */
const NO_COUNTRY = new Set(['XX', 'T1'])

/** City/region header -> readable text. Cloudflare may percent-encode
    non-ASCII names, and raw UTF-8 bytes arrive in Node as latin1 mojibake
    ("MÃ¼nchen"); both are repaired. */
function geoText(raw: string | null, max: number): string | null {
  if (!raw) return null
  let s = raw.trim()
  if (/%[0-9a-f]{2}/i.test(s)) {
    try { s = decodeURIComponent(s) } catch { /* keep as sent */ }
  }
  if (/[\u0080-ÿ]/.test(s) && !/[^\u0000-ÿ]/.test(s)) {
    const fixed = Buffer.from(s, 'latin1').toString('utf8')
    if (!fixed.includes('�')) s = fixed
  }
  s = s.replace(/[\u0000-\u001f\u007f]/g, '').trim()
  return s ? s.slice(0, max) : null
}

function hostOf(value: string | null): string | null {
  if (!value) return null
  const h = value.split(',')[0].trim().toLowerCase().replace(/:\d+$/, '')
  return h || null
}

function originAllowed(origin: string | null, host: string | null): boolean {
  if (!origin) return true                  // older browsers / sendBeacon variants omit it
  let oh: string
  try { oh = new URL(origin).hostname.toLowerCase() } catch { return false }
  if (host && oh === host) return true
  return oh === 'infowebworld.com' || oh.endsWith('.infowebworld.com') || oh === 'localhost' || oh === '127.0.0.1'
}

export function readCollectorRequest(request: NextRequest): CollectorRequest {
  const h = request.headers
  const c = request.cookies

  const country = (h.get('cf-ipcountry') || '').trim().toUpperCase()
  const ip = (h.get('cf-connecting-ip') || h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || '').trim()
  const host = hostOf(h.get('x-forwarded-host') || h.get('host'))
  const len = Number(h.get('content-length'))
  const tz = (h.get('cf-timezone') || '').trim()

  return {
    contentLength: Number.isFinite(len) && len >= 0 ? len : null,
    ip: ip || 'unknown',
    ua: (h.get('user-agent') || '').slice(0, 1000),
    hints: {
      secChUa: h.get('sec-ch-ua'),
      secChUaMobile: h.get('sec-ch-ua-mobile'),
      secChUaPlatform: h.get('sec-ch-ua-platform'),
    },
    geo: {
      country: /^[A-Z]{2}$/.test(country) && !NO_COUNTRY.has(country) ? country : null,
      region: geoText(h.get('cf-region'), 100),
      city: geoText(h.get('cf-ipcity'), 100),
      timezone: /^[A-Za-z0-9_+\-/]{1,64}$/.test(tz) ? tz : null,
    },
    internal: !!c.get(ADMIN_COOKIE_NAME)?.value || !!c.get(AN_IGNORE_COOKIE)?.value,
    vidCookie: c.get(AN_VID_COOKIE)?.value ?? null,
    userToken: c.get(USER_COOKIE_NAME)?.value || null,
    host,
    sameOrigin: originAllowed(h.get('origin'), host),
  }
}
