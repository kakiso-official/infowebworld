import { queryOne } from './db'
import { sendEmail } from './email'
import {
  submissionReceivedEmail, submissionApprovedEmail, submissionRejectedEmail,
  claimReceivedEmail, claimRejectedEmail,
  adminNewSubmissionEmail, adminNewClaimEmail,
} from './email-templates'

/**
 * Submission & claim lifecycle email dispatchers.
 *
 * Same contract as lib/notify-owner.ts: every function returns void, NEVER
 * throws (failures are logged + swallowed), and the originating API request
 * must succeed even if mail delivery doesn't. Admin alerts go to
 * ADMIN_NOTIFY_EMAIL, falling back to team@infowebworld.com.
 */

function adminEmail(): string {
  return process.env.ADMIN_NOTIFY_EMAIL || 'team@infowebworld.com'
}

/** New listing submitted → "received" to the submitter + alert to admin. */
export async function notifyOnNewSubmission(a: {
  companyName: string
  contactName: string | null
  contactEmail: string
  category: string | null
  listingMode: 'product' | 'company'
}): Promise<void> {
  try {
    const sends: Array<Promise<boolean>> = []
    if (a.contactEmail) {
      const t = submissionReceivedEmail({
        recipientName: a.contactName, companyName: a.companyName, listingMode: a.listingMode,
      })
      sends.push(sendEmail({ to: a.contactEmail, subject: t.subject, html: t.html, text: t.text }))
    }
    const adm = adminNewSubmissionEmail(a)
    sends.push(sendEmail({ to: adminEmail(), subject: adm.subject, html: adm.html, text: adm.text, replyTo: a.contactEmail || undefined }))
    await Promise.all(sends)
  } catch (err) {
    console.error('[notify] notifyOnNewSubmission failed:', err instanceof Error ? err.message : err)
  }
}

/** Listing approved (status → active) → "you're live" to the submitter. */
export async function notifySubmissionApproved(a: {
  contactEmail: string
  recipientName: string | null
  companyName: string
  listingSlug: string
  listingMode: 'product' | 'company'
}): Promise<void> {
  try {
    if (!a.contactEmail) return
    const t = submissionApprovedEmail(a)
    await sendEmail({ to: a.contactEmail, subject: t.subject, html: t.html, text: t.text })
  } catch (err) {
    console.error('[notify] notifySubmissionApproved failed:', err instanceof Error ? err.message : err)
  }
}

/** Listing rejected → "needs a change" to the submitter. */
export async function notifySubmissionRejected(a: {
  contactEmail: string
  recipientName: string | null
  companyName: string
  reason: string | null
}): Promise<void> {
  try {
    if (!a.contactEmail) return
    const t = submissionRejectedEmail(a)
    await sendEmail({ to: a.contactEmail, subject: t.subject, html: t.html, text: t.text })
  } catch (err) {
    console.error('[notify] notifySubmissionRejected failed:', err instanceof Error ? err.message : err)
  }
}

/** Manual claim submitted → "received" to the claimant + alert to admin. */
export async function notifyOnNewClaim(a: {
  companyName: string
  claimantName: string | null
  claimantEmail: string | null
  evidence: string | null
}): Promise<void> {
  try {
    const sends: Array<Promise<boolean>> = []
    const adm = adminNewClaimEmail(a)
    sends.push(sendEmail({ to: adminEmail(), subject: adm.subject, html: adm.html, text: adm.text, replyTo: a.claimantEmail || undefined }))
    if (a.claimantEmail) {
      const t = claimReceivedEmail({ recipientName: a.claimantName, companyName: a.companyName })
      sends.push(sendEmail({ to: a.claimantEmail, subject: t.subject, html: t.html, text: t.text }))
    }
    await Promise.all(sends)
  } catch (err) {
    console.error('[notify] notifyOnNewClaim failed:', err instanceof Error ? err.message : err)
  }
}

/** Claim rejected → the APPLICANT directly. (A pending claim's listing is
 *  still unowned, so the owner-targeted rejecter would skip them.) */
export async function notifyApplicantOnClaimRejected(a: {
  applicantId: number
  companyName: string
  adminNotes: string | null
}): Promise<void> {
  try {
    const u = await queryOne<{ email: string | null; name: string | null }>(
      'SELECT email, name FROM business_users WHERE id = ? LIMIT 1',
      [a.applicantId]
    )
    if (!u?.email) return
    const t = claimRejectedEmail({ recipientName: u.name, companyName: a.companyName, reason: a.adminNotes })
    await sendEmail({ to: u.email, subject: t.subject, html: t.html, text: t.text })
  } catch (err) {
    console.error('[notify] notifyApplicantOnClaimRejected failed:', err instanceof Error ? err.message : err)
  }
}
