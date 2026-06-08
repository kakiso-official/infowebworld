import { NextRequest } from 'next/server'
import { query } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/verifications
 *
 * List verification requests for moderation. Defaults to status='pending';
 * pass ?status=approved or ?status=rejected to switch tabs. Capped at 200.
 *
 * Joined to submissions + business_users so the admin UI has everything it
 * needs (listing strip, applicant card, evidence summary) in one round-trip.
 */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  const url = new URL(request.url)
  const statusParam = (url.searchParams.get('status') || 'pending').toLowerCase()
  const status =
    statusParam === 'approved' || statusParam === 'rejected' ? statusParam : 'pending'

  try {
    const rows = await query(
      `SELECT
         r.id, r.status, COALESCE(r.request_type, 'verify') AS request_type,
         r.created_at, r.updated_at, r.reviewed_at,
         r.legal_name, r.business_email, r.business_phone,
         r.registration_number, r.owner_role, r.document_url,
         CAST(r.social_proof AS CHAR) AS social_proof,
         r.applicant_notes, r.admin_notes, r.reviewed_by_admin_id,
         r.user_id, u.name AS user_name, u.email AS user_email, u.avatar_url AS user_avatar_url,
         r.listing_id, s.slug AS listing_slug, s.uuid AS listing_uuid,
         s.company_name AS listing_name, s.tagline AS listing_tagline,
         s.logo_url AS listing_logo_url, s.website AS listing_website,
         COALESCE(s.verified, 0) AS listing_verified,
         COALESCE(s.listing_mode, 'product') AS listing_mode
         FROM listing_verification_requests r
         LEFT JOIN business_users u ON u.id = r.user_id
         LEFT JOIN submissions    s ON s.id = r.listing_id
        WHERE r.status = ?
        ORDER BY r.created_at DESC
        LIMIT 200`,
      [status]
    )
    return Response.json({ ok: true, status, requests: rows })
  } catch (err) {
    console.error('GET /api/admin/verifications error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
