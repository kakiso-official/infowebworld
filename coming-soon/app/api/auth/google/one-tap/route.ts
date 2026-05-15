import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'
import { createUserSession, userCookieHeader } from '@/lib/user-auth'
import { upsertOAuthUser, type OAuthProfile } from '@/lib/oauth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'

/**
 * Google One Tap: receive the Google-issued ID token (JWT) from the GSI
 * client, verify it server-side against Google's tokeninfo endpoint (which
 * validates signature + claims), upsert the business_users row via the
 * same path OAuth uses, mint a session, set the cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = await getClientIp()
    if (!(await checkRateLimit(ip, 'one-tap', 10, 60))) {
      return Response.json({ ok: false, error: 'Too many attempts' }, { status: 429 })
    }

    const body = await request.json().catch(() => null)
    const credential = String(body?.credential || '')
    if (!credential) return Response.json({ ok: false, error: 'Missing credential' }, { status: 400 })

    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
    if (!clientId) return Response.json({ ok: false, error: 'Google not configured' }, { status: 503 })

    // Verify the JWT via Google's tokeninfo — returns 400 if invalid, payload
    // on success. Spec-compliant signature + expiration + audience check.
    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    )
    if (!verifyRes.ok) {
      return Response.json({ ok: false, error: 'Invalid Google token' }, { status: 401 })
    }
    const payload = await verifyRes.json() as {
      sub?: string; email?: string; email_verified?: string | boolean
      name?: string; picture?: string
      aud?: string; iss?: string; exp?: string
    }

    // Belt-and-braces claim checks on top of what tokeninfo already validated.
    if (payload.aud !== clientId) {
      return Response.json({ ok: false, error: 'Audience mismatch' }, { status: 401 })
    }
    if (!(payload.iss === 'accounts.google.com' || payload.iss === 'https://accounts.google.com')) {
      return Response.json({ ok: false, error: 'Issuer mismatch' }, { status: 401 })
    }
    if (Number(payload.exp) < Math.floor(Date.now() / 1000)) {
      return Response.json({ ok: false, error: 'Token expired' }, { status: 401 })
    }

    const profile: OAuthProfile = {
      providerId: String(payload.sub || ''),
      email: (payload.email as string) || null,
      name: (payload.name as string) || null,
      avatarUrl: (payload.picture as string) || null,
      // One Tap returns only an ID token, not an access token, so we can't
      // call the People API to fetch the phone. Users who want their phone
      // populated need to sign in via the regular OAuth popup at least once.
      phone: null,
      emailVerified: payload.email_verified === 'true' || payload.email_verified === true,
    }
    if (!profile.providerId) {
      return Response.json({ ok: false, error: 'Missing sub' }, { status: 400 })
    }

    const userIdOrErr = await upsertOAuthUser('google', profile)
    if (typeof userIdOrErr !== 'number') {
      console.error('[one-tap] upsert failed:', userIdOrErr.error)
      return Response.json({ ok: false, error: 'Upsert failed' }, { status: 500 })
    }

    const token = await createUserSession(userIdOrErr, ip, request.headers.get('user-agent'))
    await execute(
      `UPDATE business_users SET last_login_at = NOW(), last_login_ip = ? WHERE id = ?`,
      [ip, userIdOrErr]
    )

    return Response.json(
      { ok: true },
      {
        status: 200,
        headers: { 'Set-Cookie': userCookieHeader(token) },
      }
    )
  } catch (err) {
    console.error('[one-tap] error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
