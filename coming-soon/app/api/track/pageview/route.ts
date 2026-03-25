import { NextRequest } from 'next/server'
import { queryOne, execute } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { isBot, detectDevice, getCountryCode, getClientIp, getUserAgent, getVisitorHash } from '@/lib/tracking'

export async function POST(request: NextRequest) {
  try {
    if (await isBot()) return Response.json({ ok: true })

    const ip = await getClientIp()
    const limited = await checkRateLimit(ip, 'pageview', 120, 60)
    if (!limited) return Response.json({ ok: true })

    const body = await request.json()
    const page = String(body.page || '/').slice(0, 200)
    const userAgent = await getUserAgent()
    const hash = getVisitorHash(ip, userAgent)
    const device = await detectDevice()
    const country = await getCountryCode()

    const existing = await queryOne(
      'SELECT 1 FROM page_views WHERE visitor_hash = ? AND DATE(created_at) = CURDATE() LIMIT 1',
      [hash]
    )

    await execute(
      `INSERT INTO page_views
       (page, session_id, ip_address, user_agent, referrer,
        utm_source, utm_medium, utm_campaign, utm_content,
        device_type, country_code, visitor_hash, is_unique)
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
        existing ? 0 : 1,
      ]
    )

    return Response.json({ ok: true })
  } catch (err) {
    console.error('POST /api/track/pageview error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
