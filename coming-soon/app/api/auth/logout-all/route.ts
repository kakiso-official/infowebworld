import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'
import { USER_COOKIE_NAME, requireUser, clearUserCookieHeader } from '@/lib/user-auth'

/** Destroy every active session for the current user — used by the Settings
 *  page's "Sign out everywhere" button. Also clears the calling browser's
 *  cookie so the user lands on /business cleanly. */
export async function POST(request: NextRequest) {
  const guard = await requireUser(request)
  if (guard instanceof Response) return guard
  const user = guard

  await execute(`DELETE FROM business_sessions WHERE user_id = ?`, [user.id])

  return Response.json(
    { ok: true },
    { headers: { 'Set-Cookie': clearUserCookieHeader() } }
  )
}

/** Suppress 405 from accidental GETs (e.g. browser hitting /logout-all from
 *  a typed URL). Returning 200 is intentional — same as a no-op since the
 *  client never relies on this. */
export function GET() {
  return Response.json({ ok: false, error: 'POST only' }, { status: 405 })
}
