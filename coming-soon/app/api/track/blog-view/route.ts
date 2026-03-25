import { NextRequest } from 'next/server'
import { queryOne, execute } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { isBot, detectDevice, getCountryCode, getClientIp, getUserAgent, getVisitorHash } from '@/lib/tracking'

export async function POST(request: NextRequest) {
  try {
    if (await isBot()) return Response.json({ ok: true })

    const ip = await getClientIp()
    const limited = await checkRateLimit(ip, 'blog_view', 120, 60)
    if (!limited) return Response.json({ ok: true })

    const body = await request.json()

    let postId = Number(body.postId || 0)
    if (!postId && body.slug) {
      const row = await queryOne<{ id: number }>('SELECT id FROM blog_posts WHERE slug = ? LIMIT 1', [body.slug])
      postId = row?.id || 0
    }
    if (!postId) return Response.json({ error: 'postId or slug required' }, { status: 400 })

    const readSeconds = Number(body.readSeconds || body.readTime || 0)
    const userAgent = await getUserAgent()
    const hash = getVisitorHash(ip, userAgent)
    const device = await detectDevice()
    const country = await getCountryCode()

    const existing = await queryOne(
      'SELECT 1 FROM blog_views WHERE visitor_hash = ? AND post_id = ? AND DATE(created_at) = CURDATE() LIMIT 1',
      [hash, postId]
    )

    await execute(
      `INSERT INTO blog_views
       (post_id, session_id, ip_address, user_agent, referrer,
        utm_source, utm_medium, utm_campaign,
        device_type, country_code, visitor_hash, is_unique, read_seconds)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        postId,
        body.sessionId || null,
        ip,
        userAgent,
        String(body.referrer || '').slice(0, 500) || null,
        String(body.utm_source || '').slice(0, 100) || null,
        String(body.utm_medium || '').slice(0, 100) || null,
        String(body.utm_campaign || '').slice(0, 100) || null,
        device,
        country,
        hash,
        existing ? 0 : 1,
        readSeconds,
      ]
    )

    // Track share if flagged
    if (body.share) {
      const today = new Date().toISOString().slice(0, 10)
      await execute(
        `INSERT INTO blog_analytics_daily (post_id, date, views, unique_views, shares)
         VALUES (?, ?, 0, 0, 1)
         ON DUPLICATE KEY UPDATE shares = shares + 1`,
        [postId, today]
      )
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('POST /api/track/blog-view error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
