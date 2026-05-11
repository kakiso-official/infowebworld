import { NextRequest } from 'next/server'
import { query } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/reviews
 * List reviews for moderation. Defaults to status='pending'; pass ?status=approved
 * or ?status=rejected to view other queues. Capped at 200 per call.
 */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  const url = new URL(request.url)
  const statusParam = (url.searchParams.get('status') || 'pending').toLowerCase()
  const status = statusParam === 'approved' || statusParam === 'rejected' ? statusParam : 'pending'

  try {
    const rows = await query(
      `SELECT
         r.id, r.rating, r.title, r.body, r.status, r.created_at, r.updated_at,
         r.user_id, u.name AS user_name, u.email AS user_email, u.avatar_url AS user_avatar_url,
         r.listing_id, s.slug AS listing_slug, s.uuid AS listing_uuid,
         s.company_name AS listing_name, s.logo_url AS listing_logo_url,
         COALESCE(s.listing_mode, 'product') AS listing_mode
         FROM reviews r
         LEFT JOIN business_users u ON u.id = r.user_id
         LEFT JOIN submissions s ON s.id = r.listing_id
        WHERE r.status = ?
        ORDER BY r.created_at DESC
        LIMIT 200`,
      [status]
    )
    return Response.json({ ok: true, reviews: rows, status })
  } catch (err) {
    console.error('GET /api/admin/reviews error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
