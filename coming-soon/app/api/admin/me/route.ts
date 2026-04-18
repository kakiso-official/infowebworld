import { NextRequest } from 'next/server'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request)
  if (!admin) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  return Response.json({
    ok: true,
    admin: {
      id: admin.adminId,
      name: admin.displayName,
      role: admin.role,
    },
  })
}
