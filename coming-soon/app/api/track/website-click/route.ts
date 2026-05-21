import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { queryOne, execute } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import {
  isBot, detectDevice, getCountryCode, getClientIp, getUserAgent,
  getVisitorHash, getFingerprintHash,
} from '@/lib/tracking'

const COOKIE_NAME = 'iww_vid'
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60
const DEDUP_MINUTES = 30

/**
 * Records a "Visit website" click from any of our listing surfaces.
 * Body: { slug: string, campaign?: string, userId?: number }
 *
 * - Bot-filtered + IP-rate-limited identically to /api/track/pageview so a
 *   single source can't inflate a listing's number.
 * - 30-min dedup keyed on (visitor_hash, listing_id) keeps the count
 *   honest — repeated clicks by the same visitor in a short window count
 *   once. Long-tail repeated visits (next day, different campaign) do count.
 * - The owner's "Last 30 days" dashboard number is the truth this powers.
 *
 * Uses the same `iww_vid` cookie + IP+UA fingerprint fallback as the
 * pageview endpoint so the visitor identity is consistent across both
 * tables (view ↔ click attribution stays joinable).
 */
export async function POST(request: NextRequest) {
  try {
    if (await isBot()) return Response.json({ ok: true })

    const ip = await getClientIp()
    const limited = await checkRateLimit(ip, 'website-click', 60, 60)
    if (!limited) return Response.json({ ok: true })

    let body: { slug?: string; campaign?: string; userId?: number } = {}
    try { body = await request.json() } catch {}
    const slug = String(body.slug || '').trim().toLowerCase().slice(0, 200)
    if (!slug) return Response.json({ ok: true })
    const campaign = String(body.campaign || 'listing').trim().slice(0, 64) || 'listing'

    const listing = await queryOne<{ id: number }>(
      `SELECT id FROM submissions WHERE slug = ? LIMIT 1`,
      [slug]
    )
    if (!listing) return Response.json({ ok: true })

    const userAgent = await getUserAgent()
    const device = await detectDevice()
    const country = await getCountryCode()

    const existingCookie = request.cookies.get(COOKIE_NAME)?.value
    let visitorId = existingCookie
    let needsCookie = false
    let hash: string
    if (visitorId) {
      hash = getVisitorHash(visitorId)
    } else {
      hash = getFingerprintHash(ip, userAgent)
      visitorId = randomUUID()
      needsCookie = true
    }

    /* 30-min dedup per (visitor, listing) so a rage-clicker can't pad
       a listing's number. A different campaign within the window is
       treated as the same intent (still one click). */
    const recentDup = await queryOne(
      `SELECT 1 FROM listing_outbound_clicks
        WHERE visitor_hash = ? AND listing_id = ?
          AND created_at > DATE_SUB(NOW(), INTERVAL ${DEDUP_MINUTES} MINUTE)
        LIMIT 1`,
      [hash, listing.id]
    )

    if (!recentDup) {
      const referrer = request.headers.get('referer') || ''
      const userId = body.userId && Number.isFinite(Number(body.userId))
        ? Number(body.userId)
        : null
      await execute(
        `INSERT INTO listing_outbound_clicks
           (listing_id, visitor_hash, user_id, campaign, referrer,
            country, device_type, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          listing.id, hash, userId, campaign,
          referrer ? referrer.slice(0, 500) : null,
          country, device, userAgent,
        ]
      )
    }

    const response = NextResponse.json({ ok: true })
    if (needsCookie) {
      response.cookies.set(COOKIE_NAME, visitorId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
      })
    }
    return response
  } catch (err) {
    console.error('POST /api/track/website-click error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
