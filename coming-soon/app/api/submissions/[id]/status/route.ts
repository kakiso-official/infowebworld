import { NextRequest } from 'next/server'
import { queryOne, execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { isPaidListingPlan } from '@/lib/user-plan-types'
import { notifySubmissionApproved, notifySubmissionRejected } from '@/lib/notify-submission'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  /* Admin-only: approving, rejecting or suspending a listing - and the email
     that tells its submitter - is a moderation action. The /iww-hq UI calls
     this same-origin, so its admin cookie comes along. */
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const { id } = await params
    const body = await request.json()
    const { status, reason } = body

    if (!status) {
      return Response.json({ error: 'status is required' }, { status: 400 })
    }

    const validStatuses = ['pending', 'active', 'rejected', 'suspended', 'paid']
    if (!validStatuses.includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Get current submission
    const submission = await queryOne<{
      id: number; status: string; category_id: number | null; company_name: string; slug: string | null
      email: string | null; contact_name: string | null; listing_mode: string | null
      user_id: number | null; ip_address: string | null; plan_slug: string | null
    }>(
      `SELECT s.id, s.status, s.category_id, s.company_name, s.slug, s.email, s.contact_name,
              s.user_id, s.ip_address, pl.slug AS plan_slug,
              COALESCE(s.listing_mode, 'product') AS listing_mode
         FROM submissions s
         LEFT JOIN plans pl ON pl.id = s.plan_id
        WHERE s.id = ?`,
      [id]
    )

    if (!submission) {
      return Response.json({ error: 'Submission not found' }, { status: 404 })
    }

    const oldStatus = submission.status
    const categoryId = submission.category_id
    let finalSlug = submission.slug || ''

    // If becoming active, set approved_at and generate slug if missing
    if (status === 'active' && oldStatus !== 'active') {
      if (!finalSlug && submission.company_name) {
        finalSlug = slugify(submission.company_name) + '-' + crypto.randomUUID().slice(0, 8)
      }

      await execute(
        'UPDATE submissions SET status = ?, approved_at = NOW(), slug = ? WHERE id = ?',
        [status, finalSlug, id]
      )

      // Increment listing_count for the category
      if (categoryId) {
        await execute(
          'UPDATE categories SET listing_count = listing_count + 1 WHERE id = ?',
          [categoryId]
        )
      }
    } else {
      await execute(
        'UPDATE submissions SET status = ? WHERE id = ?',
        [status, id]
      )

      // If was active and now not active, decrement listing_count
      if (oldStatus === 'active' && status !== 'active' && categoryId) {
        await execute(
          'UPDATE categories SET listing_count = GREATEST(listing_count - 1, 0) WHERE id = ?',
          [categoryId]
        )
      }
    }

    /* Tell the submitter when their listing goes live or is rejected - only
       for listings someone actually submitted through the form (an owner
       account or a recorded submit IP). The bulk-seeded directory rows have
       neither, and their contact address belongs to a company that never
       asked to be listed. Best-effort; sendEmail never throws. The optional
       `reason` in the PATCH body is shown in the rejection email. */
    const submittedViaForm = submission.user_id != null || !!submission.ip_address
    if (submittedViaForm && submission.email) {
      if (status === 'active' && oldStatus !== 'active') {
        await notifySubmissionApproved({
          contactEmail: submission.email,
          recipientName: submission.contact_name,
          companyName: submission.company_name,
          listingSlug: finalSlug || submission.slug || '',
          listingMode: submission.listing_mode === 'company' ? 'company' : 'product',
          paidPlan: isPaidListingPlan(submission.plan_slug),
        })
      } else if (status === 'rejected' && oldStatus !== 'rejected') {
        await notifySubmissionRejected({
          contactEmail: submission.email,
          recipientName: submission.contact_name,
          companyName: submission.company_name,
          reason: typeof reason === 'string' ? reason : null,
        })
      }
    }

    return Response.json({ ok: true, message: `Status updated to ${status}` })
  } catch (err) {
    console.error('PATCH /api/submissions/[id]/status error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
