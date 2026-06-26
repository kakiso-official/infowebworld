import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { notifyOwnerOnVerificationRejected } from '@/lib/notify-owner'
import { notifyApplicantOnClaimRejected } from '@/lib/notify-submission'

/* TEMP: admin-action notification emails are paused. Flip to `true` to restore. */
const SEND_ADMIN_EMAILS: boolean = false

/**
 * POST /api/admin/verifications/[id]/reject
 *
 * Flips the request to 'rejected'. Does NOT touch submissions.verified —
 * if a listing was somehow already verified via an earlier approved request,
 * rejecting a newer pending one shouldn't strip the badge. Use a separate
 * "revoke" action (future) for that.
 *
 * Owner is emailed with the admin's reason so they know what to fix on
 * their re-application. If the listing was previously verified and we're
 * actually un-verifying it, we revalidate to drop the badge from public.
 */
export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  const admin = guard

  const { id } = await ctx.params
  const requestId = Number.parseInt(id, 10)
  if (!Number.isFinite(requestId) || requestId <= 0) {
    return Response.json({ ok: false, error: 'Invalid request id' }, { status: 400 })
  }

  let body: { adminNotes?: string } = {}
  try { body = await request.json() } catch { /* body optional */ }
  const adminNotesRaw = typeof body.adminNotes === 'string' ? body.adminNotes.trim() : ''
  const adminNotes = adminNotesRaw ? adminNotesRaw.slice(0, 2000) : null

  const row = await queryOne<{
    id: number
    listing_id: number
    user_id: number
    status: 'pending' | 'approved' | 'rejected'
    request_type: 'verify' | 'claim' | string
    company_name: string | null
    listing_slug: string
  }>(
    `SELECT r.id, r.listing_id, r.user_id, r.status,
            COALESCE(r.request_type, 'verify') AS request_type,
            s.company_name, s.slug AS listing_slug
       FROM listing_verification_requests r
       LEFT JOIN submissions s ON s.id = r.listing_id
      WHERE r.id = ? LIMIT 1`,
    [requestId]
  )
  if (!row) {
    return Response.json({ ok: false, error: 'Request not found' }, { status: 404 })
  }

  const wasAlreadyRejected = row.status === 'rejected'

  try {
    await execute(
      `UPDATE listing_verification_requests
          SET status = 'rejected',
              admin_notes = ?,
              reviewed_by_admin_id = ?,
              reviewed_at = NOW()
        WHERE id = ?`,
      [adminNotes, admin.adminId, requestId]
    )

    if (SEND_ADMIN_EMAILS && !wasAlreadyRejected) {
      if (row.request_type === 'claim') {
        /* A pending claim's listing is still unowned, so the owner-targeted
           notifier would skip the applicant — email them directly instead. */
        await notifyApplicantOnClaimRejected({
          applicantId: row.user_id,
          companyName: row.company_name || 'your listing',
          adminNotes,
        })
      } else {
        await notifyOwnerOnVerificationRejected({
          listingId: row.listing_id,
          applicantId: row.user_id,
          adminNotes,
        })
      }
    }

    return Response.json({ ok: true, id: requestId, status: 'rejected' })
  } catch (err) {
    console.error('POST /api/admin/verifications/[id]/reject error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
