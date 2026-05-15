import { randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { queryOne, execute } from './db'

export const USER_COOKIE_NAME = 'iww_user_token'
export const USER_SESSION_DAYS = 30
export const USER_SESSION_MAX_AGE = USER_SESSION_DAYS * 24 * 60 * 60

export interface BusinessUser {
  id: number
  uuid: string
  email: string
  name: string | null
  avatarUrl: string | null
  /** International-format phone, when known (currently populated by Google
   *  via the People API on sign-in). Null when the user has no phone on
   *  file or hasn't granted the scope. */
  phone: string | null
  provider: string
  emailVerified: boolean
  createdAt: string
}

/**
 * Read the user cookie, validate against business_sessions, return the user.
 * Returns null for missing/expired/invalid sessions. Single indexed DB query.
 */
export async function getUserFromRequest(request: NextRequest): Promise<BusinessUser | null> {
  const token = request.cookies.get(USER_COOKIE_NAME)?.value
  if (!token) return null
  return getUserByToken(token)
}

export async function getUserByToken(token: string): Promise<BusinessUser | null> {
  const row = await queryOne<{
    id: number; uuid: string; email: string; name: string | null
    avatar_url: string | null; phone: string | null
    provider: string; email_verified: number
    created_at: string | Date
  }>(
    `SELECT u.id, u.uuid, u.email, u.name, u.avatar_url, u.phone, u.provider,
            u.email_verified, u.created_at
     FROM business_sessions s
     JOIN business_users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > NOW()
     LIMIT 1`,
    [token]
  )
  if (!row) return null
  return {
    id: row.id,
    uuid: row.uuid,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    phone: row.phone,
    provider: row.provider,
    emailVerified: Boolean(row.email_verified),
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  }
}

/**
 * Guard for API routes that require a logged-in business user.
 * Usage:
 *   const guard = await requireUser(request)
 *   if (guard instanceof Response) return guard
 *   const user = guard
 */
export async function requireUser(request: NextRequest): Promise<BusinessUser | Response> {
  const user = await getUserFromRequest(request)
  if (!user) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  return user
}

/**
 * Insert a new session row and return the raw token to set in the cookie.
 */
export async function createUserSession(
  userId: number,
  ip: string | null,
  userAgent: string | null
): Promise<string> {
  const token = randomBytes(48).toString('hex') // 96 chars, fits varchar(128)
  await execute(
    `INSERT INTO business_sessions (user_id, token, ip_address, user_agent, expires_at)
     VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ${USER_SESSION_DAYS} DAY))`,
    [userId, token, ip, userAgent?.slice(0, 500) || null]
  )
  return token
}

export async function destroyUserSession(token: string): Promise<void> {
  await execute('DELETE FROM business_sessions WHERE token = ?', [token])
}

export function userCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${USER_COOKIE_NAME}=${token}; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=${USER_SESSION_MAX_AGE}`
}

export function clearUserCookieHeader(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${USER_COOKIE_NAME}=; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=0`
}

/**
 * Server-component / layout auth gate. Reads the cookie, validates the session
 * against the DB, and either returns the user or `redirect()`s away (which
 * throws and never returns). Use in every dashboard page so auth is enforced
 * even if the parent layout's guard ever drifts — defense in depth.
 *
 *   const user = await requireDashboardUser()
 *   //  user.id, user.email, etc. are guaranteed non-null past this line
 */
export async function requireDashboardUser(redirectTo: string = '/business'): Promise<BusinessUser> {
  const store = await cookies()
  const token = store.get(USER_COOKIE_NAME)?.value
  if (!token) redirect(redirectTo)
  const user = await getUserByToken(token)
  if (!user) redirect(redirectTo)
  return user
}
