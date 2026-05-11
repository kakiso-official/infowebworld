import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { execute, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { notifyOwnerOnVerificationApproved } from '@/lib/notify-owner'

/**
 * POST /api/admin/verifications/[id]/approve
 *
 * Flips the request to 'approved', sets submissions.verified = 1 + verified_at,
 * stores the request id on submissions.verification_request_id for audit, then
 * fires the owner email + revalidates the public listing page so the badge
 * appears without waiting for the 48h auto-rebuild.
 *
 * Idempotent — re-approving an already-approved request is a no-op (no second
 * email, no revalidation cost).
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
    listing_slug: string
    listing_verified: number
    listing_mode: 'product' | 'company' | string
  }>(
    `SELECT r.id, r.listing_id, r.user_id, r.status,
            s.slug AS listing_slug,
            COALESCE(s.verified, 0) AS listing_verified,
            COALESCE(s.listing_mode, 'product') AS listing_mode
       FROM listing_verification_requests r
       LEFT JOIN submissions s ON s.id = r.listing_id
      WHERE r.id = ? LIMIT 1`,
    [requestId]
  )
  if (!row) {
    return Response.json({ ok: false, error: 'Request not found' }, { status: 404 })
  }

  const wasAlreadyApproved =
    row.status === 'approved' && Number(row.listing_verified) === 1

  try {
    await execute(
      `UPDATE listing_verification_requests
          SET status = 'approved',
              admin_notes = ?,
              reviewed_by_admin_id = ?,
              reviewed_at = NOW()
        WHERE id = ?`,
      [adminNotes, admin.adminId, requestId]
    )
    await execute(
      `UPDATE submissions
          SET verified = 1,
              verified_at = NOW(),
              verification_request_id = ?
        WHERE id = ?`,
      [requestId, row.listing_id]
    )

    if (!wasAlreadyApproved) {
      /* Fire-and-forget owner email — wrapped in its own try inside the
         helper so a mail failure can't roll back the DB state. */
      await notifyOwnerOnVerificationApproved({
        listingId: row.listing_id,
        applicantId: row.user_id,
        adminNotes,
      })
      /* On-demand rebuild of the public listing so the badge appears now,
         not 48h from now. Best-effort — log + continue if it throws. */
      if (row.listing_slug) {
        const path = row.listing_mode === 'company'
          ? `/profile/${row.listing_slug}`
          : `/company/${row.listing_slug}`
        try { revalidatePath(path) }
        catch (e) { console.error('[verify-approve] revalidate failed:', e) }
      }
    }

    return Response.json({ ok: true, id: requestId, status: 'approved' })
  } catch (err) {
    console.error('POST /api/admin/verifications/[id]/approve error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
