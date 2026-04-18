import { NextRequest } from 'next/server'
import { ADMIN_COOKIE_NAME, clearAdminCookieHeader, destroyAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (token) {
    try {
      await destroyAdminSession(token)
    } catch (err) {
      console.error('Admin logout DB error:', err)
    }
  }
  return Response.json(
    { ok: true },
    { headers: { 'Set-Cookie': clearAdminCookieHeader() } }
  )
}
