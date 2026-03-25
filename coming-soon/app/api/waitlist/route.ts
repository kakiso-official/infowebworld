import { NextRequest } from 'next/server'
import { query, execute } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp, getUserAgent } from '@/lib/tracking'

export async function GET(request: NextRequest) {
  try {
    const rows = await query(
      'SELECT id, email, source, created_at FROM waitlist ORDER BY created_at DESC LIMIT 500'
    )
    return Response.json(rows)
  } catch (err) {
    console.error('GET /api/waitlist error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIp()

    const limited = await checkRateLimit(ip, 'waitlist', 5, 60)
    if (!limited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()
    const { email, source } = body

    if (!email || typeof email !== 'string') {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const userAgent = await getUserAgent()

    await execute(
      'INSERT IGNORE INTO waitlist (email, source, ip_address, user_agent) VALUES (?, ?, ?, ?)',
      [email.trim().toLowerCase(), source || 'website', ip, userAgent]
    )

    return Response.json({ ok: true, message: 'Successfully joined the waitlist' })
  } catch (err) {
    console.error('POST /api/waitlist error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
