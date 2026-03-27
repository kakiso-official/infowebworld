import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { queryOne, execute } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { isBot, detectDevice, getCountryCode, getClientIp, getUserAgent, getVisitorHash, getFingerprintHash } from '@/lib/tracking'

const COOKIE_NAME = 'iww_vid'
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year
const DEDUP_MINUTES = 30

export async function POST(request: NextRequest) {
  try {
    if (await isBot()) return Response.json({ ok: true })

    const ip = await getClientIp()
    const limited = await checkRateLimit(ip, 'pageview', 120, 60)
    if (!limited) return Response.json({ ok: true })

    const body = await request.json()
    const page = String(body.page || '/').slice(0, 200)
    const userAgent = await getUserAgent()
    const device = await detectDevice()
    const country = await getCountryCode()

    // --- Persistent visitor ID via HttpOnly cookie ---
    const existingCookie = request.cookies.get(COOKIE_NAME)?.value
    let visitorId = existingCookie
    let needsCookie = false
    let hash: string

    if (visitorId) {
      // Cookie exists → stable hash from persistent ID
      hash = getVisitorHash(visitorId)
    } else {
      // No cookie → fingerprint fallback (IP+UA, no date = no daily reset)
      hash = getFingerprintHash(ip, userAgent)
      visitorId = randomUUID()
      needsCookie = true
    }

    // --- 30-min dedup: same visitor + same page = skip INSERT ---
    const recentDup = await queryOne(
      `SELECT 1 FROM page_views
       WHERE visitor_hash = ? AND page = ?
       AND created_at > DATE_SUB(NOW(), INTERVAL ${DEDUP_MINUTES} MINUTE)
       LIMIT 1`,
      [hash, page]
    )

    if (!recentDup) {
      // First visit of the day? (for is_unique flag)
      const seenToday = await queryOne(
        'SELECT 1 FROM page_views WHERE visitor_hash = ? AND DATE(created_at) = CURDATE() LIMIT 1',
        [hash]
      )

      await execute(
        `INSERT INTO page_views
         (page, session_id, ip_address, user_agent, referrer,
          utm_source, utm_medium, utm_campaign, utm_content,
          device_type, country, visitor_hash, is_unique)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          page,
          body.sessionId || null,
          ip,
          userAgent,
          String(body.referrer || '').slice(0, 500) || null,
          String(body.utm_source || '').slice(0, 100) || null,
          String(body.utm_medium || '').slice(0, 100) || null,
          String(body.utm_campaign || '').slice(0, 100) || null,
          String(body.utm_content || '').slice(0, 200) || null,
          device,
          country,
          hash,
          seenToday ? 0 : 1,
        ]
      )
    }
    // else: duplicate within 30 min → silently skip (no row created)

    // Set cookie for new visitors
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
    console.error('POST /api/track/pageview error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
