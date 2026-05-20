import { NextRequest } from 'next/server'
import { execute } from '@/lib/db'
import { getUserFromRequest, requireUser } from '@/lib/user-auth'

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) return Response.json({ ok: true, user: null })
  return Response.json({
    ok: true,
    user: {
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      provider: user.provider,
      emailVerified: user.emailVerified,
    },
  }, {
    // Never cache — must hit the DB per request for auth accuracy
    headers: { 'Cache-Control': 'no-store' },
  })
}

/** Update editable profile fields. Currently only `name` is mutable — email
 *  changes require a re-verification flow, provider/avatar come from OAuth. */
export async function PATCH(request: NextRequest) {
  const guard = await requireUser(request)
  if (guard instanceof Response) return guard
  const user = guard

  let body: { name?: unknown }
  try { body = await request.json() } catch { return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }) }

  const rawName = typeof body.name === 'string' ? body.name.trim() : ''
  if (rawName.length === 0) return Response.json({ ok: false, error: 'Name cannot be empty' }, { status: 400 })
  if (rawName.length > 120) return Response.json({ ok: false, error: 'Name is too long (120 char max)' }, { status: 400 })

  await execute(`UPDATE business_users SET name = ? WHERE id = ?`, [rawName, user.id])
  return Response.json({ ok: true, name: rawName })
}
