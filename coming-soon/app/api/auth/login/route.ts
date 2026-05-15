import { NextRequest } from 'next/server'
import { compare } from 'bcryptjs'
import { queryOne, execute } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'
import { createUserSession, userCookieHeader } from '@/lib/user-auth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIp()
    if (!(await checkRateLimit(ip, 'login', 10, 300))) {
      return Response.json({ ok: false, error: 'Too many login attempts. Try again later.' }, { status: 429 })
    }

    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')

    if (!EMAIL_RE.test(email) || !password) {
      return Response.json({ ok: false, error: 'Email and password are required.' }, { status: 400 })
    }

    const user = await queryOne<{
      id: number; uuid: string; email: string; name: string | null
      avatar_url: string | null; password_hash: string | null
      provider: string; email_verified: number
    }>(
      `SELECT id, uuid, email, name, avatar_url, password_hash, provider, email_verified
       FROM business_users WHERE email = ? LIMIT 1`,
      [email]
    )

    if (!user || !user.password_hash) {
      return Response.json({ ok: false, error: 'Invalid email or password.' }, { status: 401 })
    }

    const match = await compare(password, user.password_hash)
    if (!match) return Response.json({ ok: false, error: 'Invalid email or password.' }, { status: 401 })

    const token = await createUserSession(user.id, ip, request.headers.get('user-agent'))
    await execute(`UPDATE business_users SET last_login_at = NOW(), last_login_ip = ? WHERE id = ?`, [ip, user.id])

    return Response.json(
      {
        ok: true,
        user: {
          uuid: user.uuid, email: user.email, name: user.name,
          avatarUrl: user.avatar_url, provider: user.provider,
          emailVerified: Boolean(user.email_verified),
        },
      },
      { headers: { 'Set-Cookie': userCookieHeader(token) } }
    )
  } catch (err) {
    console.error('POST /api/auth/login error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
