import { NextRequest } from 'next/server'
import { isSearchType, searchDevhub } from '@/lib/developers/search'

/* ═══════════════════════════════════════════════════════════════════════
   GET /api/developers/search?q=&limit=&type= (spec 6.6).

   Backs the DvSearchBox combobox (and anything else that wants JSON
   suggestions). The search PAGE calls searchDevhub() directly in-process
   instead of hitting this route.

   - q: 2-64 chars after normalising (search.ts); shorter answers {total:0}.
   - limit: 1-30, default 5 (hits per group).
   - type: all | api | company | repo | sdk (default all).
   - Same JSON shape for every caller, so the response is cacheable at the
     edge for a few minutes even though it is per-query: Cache-Control
     public with a short browser max-age and a longer CDN s-maxage/SWR.
   - X-Robots-Tag: noindex (this route is also disallowed in robots.txt by
     its /api/ prefix; the header is defence in depth). middleware.ts does
     not run on /api, so headers are set here, not there.
   - Abuse guard: a simple in-memory token bucket per IP, 30 requests per
     10 seconds. No database — this is a single Node process on the VPS,
     so the map is enough; it is pruned opportunistically so it cannot grow
     without bound under a slow trickle of distinct IPs.
   ═══════════════════════════════════════════════════════════════════════ */

const RATE_WINDOW_MS = 10_000
const RATE_MAX = 30
/* Hard cap on distinct IPs tracked at once — a safety valve, not expected
   to be hit on this traffic level. */
const RATE_MAP_MAX = 5000

const hits = new Map<string, number[]>()

function clientIp(request: NextRequest): string {
  const cf = request.headers.get('cf-connecting-ip')
  if (cf) return cf.trim()
  const fwd = request.headers.get('x-forwarded-for')
  return fwd?.split(',')[0]?.trim() || 'unknown'
}

/** True when `ip` is over the limit. Records this request either way. */
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)

  if (hits.size > RATE_MAP_MAX) {
    for (const [key, times] of hits) {
      if (!times.length || now - times[times.length - 1] >= RATE_WINDOW_MS) hits.delete(key)
    }
  }
  return recent.length > RATE_MAX
}

export async function GET(request: NextRequest) {
  const ip = clientIp(request)
  if (isRateLimited(ip)) {
    return Response.json(
      { error: 'Too many search requests. Wait a few seconds and try again.' },
      { status: 429, headers: { 'Retry-After': '10', 'X-Robots-Tag': 'noindex' } },
    )
  }

  const params = request.nextUrl.searchParams
  const q = params.get('q') ?? ''
  const limit = params.get('limit')
  const typeParam = params.get('type')
  const type = isSearchType(typeParam) ? typeParam : 'all'

  const result = await searchDevhub(q, { limit: limit ? Number(limit) : undefined, type })

  return Response.json(result, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex',
      Vary: 'Accept-Encoding',
    },
  })
}
