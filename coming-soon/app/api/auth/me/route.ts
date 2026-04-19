import { NextRequest } from 'next/server'
import { getUserFromRequest } from '@/lib/user-auth'

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
