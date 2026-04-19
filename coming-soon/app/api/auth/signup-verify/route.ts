import { NextRequest } from 'next/server'
import { randomBytes } from 'node:crypto'
import { compare } from 'bcryptjs'
import { queryOne, execute } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'
import { createUserSession, userCookieHeader } from '@/lib/user-auth'

const MAX_ATTEMPTS = 5

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIp()

    // Verify attempts are rate limited per IP as well as per-email.
    if (!(await checkRateLimit(ip, 'signup-verify', 10, 300))) {
      return Response.json(
        { ok: false, error: 'Too many attempts. Try again in a few minutes.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    const code = String(body.code || '').trim()

    if (!email || !/^\d{6}$/.test(code)) {
      return Response.json({ ok: false, error: 'Enter the 6-digit code from your email.' }, { status: 400 })
    }

    // Block if an account somehow got created in the meantime (race + OAuth)
    const existing = await queryOne<{ id: number }>(
      'SELECT id FROM business_users WHERE email = ? LIMIT 1',
      [email]
    )
    if (existing) {
      await execute('DELETE FROM email_otps WHERE email = ?', [email])
      return Response.json(
        { ok: false, error: 'An account already exists for this email. Try signing in.' },
        { status: 409 }
      )
    }

    // Compute expiry inside MySQL (using NOW()) so client/server timezones
    // can never disagree. seconds_left > 0 means still valid.
    const pending = await queryOne<{
      email: string
      code_hash: string
      password_hash: string
      name: string | null
      seconds_left: number
      attempts: number
    }>(
      `SELECT email, code_hash, password_hash, name, attempts,
              TIMESTAMPDIFF(SECOND, NOW(), expires_at) AS seconds_left
       FROM email_otps WHERE email = ? LIMIT 1`,
      [email]
    )

    if (!pending) {
      return Response.json(
        { ok: false, error: 'No pending verification found. Please request a new code.' },
        { status: 404 }
      )
    }

    if (Number(pending.seconds_left) <= 0) {
      await execute('DELETE FROM email_otps WHERE email = ?', [email])
      return Response.json(
        { ok: false, error: 'This code expired. Please request a new one.' },
        { status: 410 }
      )
    }

    if (pending.attempts >= MAX_ATTEMPTS) {
      await execute('DELETE FROM email_otps WHERE email = ?', [email])
      return Response.json(
        { ok: false, error: 'Too many wrong attempts. Please request a new code.' },
        { status: 429 }
      )
    }

    const match = await compare(code, pending.code_hash)
    if (!match) {
      const nextAttempts = pending.attempts + 1
      const remaining = Math.max(0, MAX_ATTEMPTS - nextAttempts)
      await execute('UPDATE email_otps SET attempts = ? WHERE email = ?', [nextAttempts, email])
      return Response.json(
        {
          ok: false,
          error: remaining > 0
            ? `Incorrect code. ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} left.`
            : 'Too many wrong attempts. Please request a new code.',
        },
        { status: 400 }
      )
    }

    // ✅ Verified — create the user, session, clean up the OTP row.
    const uuid = randomBytes(16).toString('hex').replace(
      /(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5'
    )

    const res = await execute(
      `INSERT INTO business_users
         (uuid, email, name, password_hash, provider, email_verified, last_login_at, last_login_ip)
       VALUES
         (?, ?, ?, ?, 'email', 1, NOW(), ?)`,
      [uuid, email, pending.name, pending.password_hash, ip]
    )

    await execute('DELETE FROM email_otps WHERE email = ?', [email])

    const token = await createUserSession(res.insertId, ip, request.headers.get('user-agent'))

    return Response.json(
      {
        ok: true,
        user: {
          uuid, email, name: pending.name, avatarUrl: null,
          provider: 'email', emailVerified: true,
        },
      },
      { status: 201, headers: { 'Set-Cookie': userCookieHeader(token) } }
    )
  } catch (err) {
    console.error('POST /api/auth/signup-verify error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
