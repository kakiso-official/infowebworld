import { NextRequest } from 'next/server'
import crypto from 'node:crypto'
import { query, queryOne, execute } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'
import { adminCookieHeader } from '@/lib/auth'
import { compare } from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIp()
    const allowed = await checkRateLimit(ip, 'admin_login', 5, 300)
    if (!allowed) {
      return Response.json(
        { ok: false, error: 'Too many login attempts. Try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return Response.json(
        { ok: false, error: 'Username and password are required.' },
        { status: 400 }
      )
    }

    const admin = await queryOne<{
      id: number
      password_hash: string
      display_name: string
      role: string
    }>(
      'SELECT id, password_hash, display_name, role FROM admins WHERE username = ? AND is_active = 1',
      [username]
    )

    if (!admin) {
      return Response.json(
        { ok: false, error: 'Invalid credentials.' },
        { status: 401 }
      )
    }

    const passwordMatch = await compare(password, admin.password_hash)
    if (!passwordMatch) {
      return Response.json(
        { ok: false, error: 'Invalid credentials.' },
        { status: 401 }
      )
    }

    const token = crypto.randomBytes(64).toString('hex')
    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
    const userAgent = request.headers.get('user-agent') || ''

    await execute(
      `INSERT INTO admin_sessions (admin_id, token, ip_address, user_agent, expires_at)
       VALUES (?, ?, ?, ?, ?)`,
      [admin.id, token, ip, userAgent, expiresAt.toISOString().slice(0, 19).replace('T', ' ')]
    )

    await execute(
      'UPDATE admins SET last_login_at = NOW(), last_login_ip = ? WHERE id = ?',
      [ip, admin.id]
    )

    return Response.json(
      {
        ok: true,
        admin: {
          name: admin.display_name,
          role: admin.role,
        },
        expiresAt: expiresAt.toISOString(),
      },
      { headers: { 'Set-Cookie': adminCookieHeader(token) } }
    )
  } catch (err) {
    console.error('Admin login error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
