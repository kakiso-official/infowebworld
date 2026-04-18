import type { NextRequest } from 'next/server'
import { queryOne, execute } from './db'

export const ADMIN_COOKIE_NAME = 'iww_adm_token'
export const ADMIN_SESSION_HOURS = 4
export const ADMIN_SESSION_MAX_AGE = ADMIN_SESSION_HOURS * 60 * 60

export interface AdminSession {
  adminId: number
  displayName: string
  role: string
  token: string
}

/**
 * Read the admin cookie, validate against admin_sessions table, return admin details.
 * Returns null for missing/expired/invalid sessions. Single indexed DB query.
 */
export async function getAdminFromRequest(request: NextRequest): Promise<AdminSession | null> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (!token) return null

  const row = await queryOne<{
    admin_id: number
    display_name: string
    role: string
  }>(
    `SELECT s.admin_id, a.display_name, a.role
     FROM admin_sessions s
     JOIN admins a ON a.id = s.admin_id
     WHERE s.token = ? AND s.expires_at > NOW() AND a.is_active = 1
     LIMIT 1`,
    [token]
  )

  if (!row) return null

  return {
    adminId: row.admin_id,
    displayName: row.display_name,
    role: row.role,
    token,
  }
}

/**
 * Guard for admin API routes. Returns either the admin session or a 401 Response.
 * Usage:
 *   const guard = await requireAdmin(request)
 *   if (guard instanceof Response) return guard
 *   const admin = guard
 */
export async function requireAdmin(request: NextRequest): Promise<AdminSession | Response> {
  const admin = await getAdminFromRequest(request)
  if (!admin) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  return admin
}

/**
 * Cookie string used when setting the admin session cookie from a route handler.
 * HttpOnly + SameSite=Lax + Secure in production. Browser auto-sends it on same-origin fetches.
 */
export function adminCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${ADMIN_COOKIE_NAME}=${token}; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=${ADMIN_SESSION_MAX_AGE}`
}

/**
 * Cookie string used when clearing the admin session cookie.
 */
export function clearAdminCookieHeader(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${ADMIN_COOKIE_NAME}=; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=0`
}

/**
 * Delete a session row. Use on logout.
 */
export async function destroyAdminSession(token: string): Promise<void> {
  await execute('DELETE FROM admin_sessions WHERE token = ?', [token])
}
