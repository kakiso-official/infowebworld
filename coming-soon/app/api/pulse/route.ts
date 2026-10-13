import { randomUUID } from 'node:crypto'
import { after, NextResponse, type NextRequest } from 'next/server'
import { AN_VID_COOKIE, type PulseResponse } from '@/lib/analytics/types'
import { isBotUserAgent } from '@/lib/analytics/classify'
import { readCollectorRequest } from '@/lib/analytics/collector-request'
import { parseBatch, isUuid } from '@/lib/analytics/collector-validate'
import { SlidingWindowCounter } from '@/lib/analytics/collector-cache'
import {
  analyticsWritable, countFiltered, flushFilteredCounts, logAnalyticsError, type FilterReason,
} from '@/lib/analytics/collector-state'
import { isCollectorOverloaded, processBatch } from '@/lib/analytics/ingest'

/**
 * POST /api/pulse - first-party analytics collector (lib/analytics/client.ts
 * sends here; wire format: PulseBatch in lib/analytics/types.ts).
 *
 * Answers right away and does every database write in after(), so a slow
 * or unavailable database never delays a visitor:
 *   - batch with a pageview -> 200 { ok, vid } + the iww_vid cookie
 *     (HttpOnly, 1 year, refreshed on every pageview)
 *   - anything else         -> 204
 * Bots, the team's own browsers, floods and malformed bodies are dropped
 * before any database work and only counted (an_filtered_daily).
 * Local dev answers normally but writes nothing unless
 * ANALYTICS_DEV_WRITE=1 (it shares the production database).
 */

const MAX_BODY_BYTES = 16 * 1024
const VID_MAX_AGE_S = 365 * 24 * 60 * 60
const IP_HITS_PER_MIN = 240
const VID_PAGEVIEWS_PER_MIN = 60

/* In-memory, per process (the app is one long-lived container). IPs live
   here for a minute or two and are never written anywhere. */
const ipHits = new SlidingWindowCounter(60_000, 50_000)
const vidPageviews = new SlidingWindowCounter(60_000, 50_000)

const NO_STORE = { 'Cache-Control': 'no-store' }

function noContent(): Response {
  return new Response(null, { status: 204, headers: NO_STORE })
}

/* Flush dropped-hit counters even when only dropped traffic arrives (a
   bot wave): at most one tiny write per minute. */
function scheduleFlush(): void {
  try { after(flushFilteredCounts) } catch { /* no request scope */ }
}

/* The body, or null when it is over MAX_BODY_BYTES. Reads the stream with
   a cap instead of request.text(): a chunked upload has no Content-Length,
   and text() would buffer any size in memory before the check. */
async function readBody(request: NextRequest): Promise<string | null> {
  if (!request.body) return ''
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_BODY_BYTES) {
      reader.cancel().catch(() => {})
      return null
    }
    chunks.push(value)
  }
  return Buffer.concat(chunks).toString('utf8')
}

function drop(reason: FilterReason, hits: number): Response {
  countFiltered(reason, hits)
  scheduleFlush()
  return noContent()
}

export async function POST(request: NextRequest): Promise<Response> {
  const receivedMs = Date.now()
  try {
    const req = readCollectorRequest(request)
    if (req.contentLength !== null && req.contentLength > MAX_BODY_BYTES) return drop('invalid', 1)

    const body = await readBody(request)
    if (body === null) return drop('invalid', 1)
    const { batch, invalid } = parseBatch(body)
    if (!batch) return drop('invalid', 1)
    if (invalid) countFiltered('invalid', invalid)
    if (!req.sameOrigin) return drop('invalid', batch.hits.length)
    if (!batch.hits.length) return noContent()

    const hitCount = batch.hits.length
    if (req.internal) return drop('internal', hitCount)
    if (!req.ua || isBotUserAgent(req.ua)) return drop('bot_ua', hitCount)

    /* The cookie is the identity; the localStorage hint only stands in
       when the cookie is missing (cleared or blocked cookies), so the same
       browser keeps one visitor id. */
    const vid = isUuid(req.vidCookie) ? req.vidCookie.toLowerCase() : (batch.vid ?? randomUUID())
    const pvCount = batch.hits.reduce((n, h) => n + (h.t === 'pv' ? 1 : 0), 0)

    if (ipHits.hit(req.ip, hitCount, receivedMs) > IP_HITS_PER_MIN) return drop('rate_limited', hitCount)
    if (pvCount && vidPageviews.hit(vid, pvCount, receivedMs) > VID_PAGEVIEWS_PER_MIN) return drop('rate_limited', hitCount)

    if (analyticsWritable()) {
      if (isCollectorOverloaded()) {
        countFiltered('overloaded', hitCount)
        scheduleFlush()
      } else {
        const ctx = {
          vid,
          receivedMs,
          ua: req.ua,
          hints: req.hints,
          geo: req.geo,
          userToken: req.userToken,
          host: req.host,
        }
        after(() => processBatch(ctx, batch))
      }
    }

    if (!pvCount) return noContent()
    const res = NextResponse.json<PulseResponse>({ ok: true, vid }, { headers: NO_STORE })
    res.cookies.set(AN_VID_COOKIE, vid, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: VID_MAX_AGE_S,
      path: '/',
    })
    return res
  } catch (err) {
    /* Never let tracking surface an error to the page. */
    logAnalyticsError('pulse', err)
    return noContent()
  }
}
