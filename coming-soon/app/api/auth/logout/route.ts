import { NextRequest } from 'next/server'
import { USER_COOKIE_NAME, destroyUserSession, clearUserCookieHeader } from '@/lib/user-auth'

export async function POST(request: NextRequest) {
  const token = request.cookies.get(USER_COOKIE_NAME)?.value
  if (token) {
    try { await destroyUserSession(token) } catch { /* ignore */ }
  }
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': clearUserCookieHeader() } })
}
