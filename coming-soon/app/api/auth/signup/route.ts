import { NextRequest } from 'next/server'
import { randomBytes } from 'node:crypto'
import { hash } from 'bcryptjs'
import { queryOne, execute } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'
import { createUserSession, userCookieHeader } from '@/lib/user-auth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIp()
    if (!(await checkRateLimit(ip, 'signup', 5, 300))) {
      return Response.json({ ok: false, error: 'Too many signups. Try again in a few minutes.' }, { status: 429 })
    }

    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    const name = String(body.name || '').trim().slice(0, 120) || null

    if (!EMAIL_RE.test(email)) return Response.json({ ok: false, error: 'Enter a valid email address.' }, { status: 400 })
    if (password.length < 8) return Response.json({ ok: false, error: 'Password must be at least 8 characters.' }, { status: 400 })

    const existing = await queryOne<{ id: number }>('SELECT id FROM business_users WHERE email = ? LIMIT 1', [email])
    if (existing) return Response.json({ ok: false, error: 'An account already exists for this email. Try signing in.' }, { status: 409 })

    const passwordHash = await hash(password, 10)
    const uuid = randomBytes(16).toString('hex').replace(
      /(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5'
    )

    const res = await execute(
      `INSERT INTO business_users (uuid, email, name, password_hash, provider, email_verified, last_login_at, last_login_ip)
       VALUES (?, ?, ?, ?, 'email', 0, NOW(), ?)`,
      [uuid, email, name, passwordHash, ip]
    )

    const token = await createUserSession(res.insertId, ip, request.headers.get('user-agent'))

    return Response.json(
      { ok: true, user: { uuid, email, name, avatarUrl: null, phone: null, provider: 'email', emailVerified: false } },
      { status: 201, headers: { 'Set-Cookie': userCookieHeader(token) } }
    )
  } catch (err) {
    console.error('POST /api/auth/signup error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
