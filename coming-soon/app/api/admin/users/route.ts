import { NextRequest } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/users
 *
 * Lists everyone who signed up on InfoWebWorld (business_users), newest first,
 * with per-user listing + review counts and a stats summary. Admin-only.
 */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const users = await query(
      `SELECT u.id, u.uuid, u.email, u.name, u.avatar_url, u.provider,
              COALESCE(u.email_verified, 0) AS email_verified, u.created_at,
              (SELECT COUNT(*) FROM submissions s WHERE s.user_id = u.id) AS listing_count,
              (SELECT COUNT(*) FROM reviews r WHERE r.user_id = u.id)      AS review_count
         FROM business_users u
        ORDER BY u.created_at DESC
        LIMIT 2000`
    )

    const stats = await queryOne(
      `SELECT COUNT(*)                                                        AS total,
              COALESCE(SUM(provider = 'google'), 0)                           AS google,
              COALESCE(SUM(provider = 'email'), 0)                            AS email,
              COALESCE(SUM(COALESCE(email_verified, 0) = 1), 0)               AS verified,
              COALESCE(SUM(created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)), 0) AS new_7d
         FROM business_users`
    )

    return Response.json({ ok: true, users, stats: stats || {} })
  } catch (err) {
    console.error('GET /api/admin/users error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
