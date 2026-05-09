import { queryOne } from './db'
import { sendEmail } from './email'
import {
  reviewReceivedEmail, reactionReceivedEmail,
  followReceivedEmail, bookmarkReceivedEmail,
  inboxLeadReceivedEmail,
  verificationApprovedEmail, verificationRejectedEmail,
} from './email-templates'

/**
 * Owner notification dispatchers — fire one of the email-templates functions
 * after a successful engagement event on the listing. Every function in this
 * file:
 *
 *   - returns void Promise (callers `await` for sequencing but never branch)
 *   - never throws (all errors swallowed + console.error'd)
 *   - skips silently when there's no recipient (anonymous listing, missing
 *     business_users.email) or when the actor IS the owner (self-action)
 *
 * The originating API request must remain successful even if the notify
 * email fails — buying a couple hundred ms of latency on a low-volume event
 * is the right tradeoff for "can never break the user request".
 */

interface OwnerLookup {
  id: number
  user_id: number | null
  uuid: string
  slug: string
  company_name: string
  logo_url: string | null
  owner_email: string | null
  owner_name: string | null
}

interface ActorLookup {
  id: number
  email: string | null
  name: string | null
  avatar_url: string | null
}

async function loadOwner(listingId: number): Promise<OwnerLookup | null> {
  try {
    return await queryOne<OwnerLookup>(
      `SELECT s.id, s.user_id, s.uuid, s.slug, s.company_name, s.logo_url,
              u.email AS owner_email, u.name AS owner_name
         FROM submissions s
         LEFT JOIN business_users u ON u.id = s.user_id
        WHERE s.id = ?
        LIMIT 1`,
      [listingId]
    )
  } catch (err) {
    console.error('[notify] loadOwner failed:', err instanceof Error ? err.message : err)
    return null
  }
}

async function loadActor(actorId: number): Promise<ActorLookup | null> {
  try {
    return await queryOne<ActorLookup>(
      `SELECT id, email, name, avatar_url
         FROM business_users
        WHERE id = ?
        LIMIT 1`,
      [actorId]
    )
  } catch (err) {
    console.error('[notify] loadActor failed:', err instanceof Error ? err.message : err)
    return null
  }
}

/** Returns false when we should skip notifying (no email, anonymous owner,
 *  self-action, etc.) and the caller should bail out cleanly. */
function shouldSkip(owner: OwnerLookup | null, actorId: number | null): boolean {
  if (!owner) return true
  if (!owner.owner_email) return true       // listing has no logged-in owner
  if (owner.user_id == null) return true    // anonymous submission
  if (actorId != null && owner.user_id === actorId) return true // self-action
  return false
}

function actorDisplayName(actor: ActorLookup | null): string {
  if (!actor) return 'Someone'
  if (actor.name && actor.name.trim()) return actor.name.trim()
  if (actor.email) return actor.email.split('@')[0]
  return 'Someone'
}

/* ─────────────────────────── Reviews ─────────────────────────── */

export async function notifyOwnerOnReview(args: {
  listingId: number
  reviewerId: number
  rating: number
  title: string
  body: string
}): Promise<void> {
  try {
    const [owner, actor] = await Promise.all([
      loadOwner(args.listingId),
      loadActor(args.reviewerId),
    ])
    if (shouldSkip(owner, args.reviewerId)) return
    const o = owner!

    const tpl = reviewReceivedEmail({
      ownerName: o.owner_name,
      companyName: o.company_name,
      listingSlug: o.slug,
      listingUuid: o.uuid,
      listingLogoUrl: o.logo_url,
      reviewerName: actorDisplayName(actor),
      reviewerAvatarUrl: actor?.avatar_url || null,
      rating: args.rating,
      reviewTitle: args.title,
      reviewBody: args.body,
    })
    await sendEmail({ to: o.owner_email!, subject: tpl.subject, html: tpl.html, text: tpl.text })
  } catch (err) {
    console.error('[notify] notifyOwnerOnReview failed:', err instanceof Error ? err.message : err)
  }
}

/* ─────────────────────────── Reactions ─────────────────────────── */

export async function notifyOwnerOnReaction(args: {
  listingId: number
  actorId: number
  kind: 'like' | 'dislike'
}): Promise<void> {
  try {
    const [owner, actor, totals] = await Promise.all([
      loadOwner(args.listingId),
      loadActor(args.actorId),
      queryOne<{ likes: number; dislikes: number }>(
        `SELECT
           SUM(CASE WHEN kind='like' THEN 1 ELSE 0 END) AS likes,
           SUM(CASE WHEN kind='dislike' THEN 1 ELSE 0 END) AS dislikes
         FROM listing_reactions WHERE listing_id = ?`,
        [args.listingId]
      ).catch(() => null),
    ])
    if (shouldSkip(owner, args.actorId)) return
    const o = owner!

    const tpl = reactionReceivedEmail({
      ownerName: o.owner_name,
      companyName: o.company_name,
      listingSlug: o.slug,
      listingUuid: o.uuid,
      listingLogoUrl: o.logo_url,
      kind: args.kind,
      actorName: actorDisplayName(actor),
      actorAvatarUrl: actor?.avatar_url || null,
      totalLikes: Number(totals?.likes ?? 0),
      totalDislikes: Number(totals?.dislikes ?? 0),
    })
    await sendEmail({ to: o.owner_email!, subject: tpl.subject, html: tpl.html, text: tpl.text })
  } catch (err) {
    console.error('[notify] notifyOwnerOnReaction failed:', err instanceof Error ? err.message : err)
  }
}

/* ─────────────────────────── Follow ─────────────────────────── */

export async function notifyOwnerOnFollow(args: {
  listingId: number
  actorId: number
}): Promise<void> {
  try {
    const [owner, actor, totalRow] = await Promise.all([
      loadOwner(args.listingId),
      loadActor(args.actorId),
      queryOne<{ c: number }>(
        'SELECT COUNT(*) AS c FROM listing_follows WHERE listing_id = ?',
        [args.listingId]
      ).catch(() => null),
    ])
    if (shouldSkip(owner, args.actorId)) return
    const o = owner!

    const tpl = followReceivedEmail({
      ownerName: o.owner_name,
      companyName: o.company_name,
      listingSlug: o.slug,
      listingUuid: o.uuid,
      listingLogoUrl: o.logo_url,
      actorName: actorDisplayName(actor),
      actorAvatarUrl: actor?.avatar_url || null,
      totalFollowers: Number(totalRow?.c ?? 0),
    })
    await sendEmail({ to: o.owner_email!, subject: tpl.subject, html: tpl.html, text: tpl.text })
  } catch (err) {
    console.error('[notify] notifyOwnerOnFollow failed:', err instanceof Error ? err.message : err)
  }
}

/* ─────────────────────────── Bookmark ─────────────────────────── */

export async function notifyOwnerOnBookmark(args: {
  listingId: number
  actorId: number
}): Promise<void> {
  try {
    const [owner, actor, totalRow] = await Promise.all([
      loadOwner(args.listingId),
      loadActor(args.actorId),
      queryOne<{ c: number }>(
        'SELECT COUNT(*) AS c FROM listing_bookmarks WHERE listing_id = ?',
        [args.listingId]
      ).catch(() => null),
    ])
    if (shouldSkip(owner, args.actorId)) return
    const o = owner!

    const tpl = bookmarkReceivedEmail({
      ownerName: o.owner_name,
      companyName: o.company_name,
      listingSlug: o.slug,
      listingUuid: o.uuid,
      listingLogoUrl: o.logo_url,
      actorName: actorDisplayName(actor),
      actorAvatarUrl: actor?.avatar_url || null,
      totalBookmarks: Number(totalRow?.c ?? 0),
    })
    await sendEmail({ to: o.owner_email!, subject: tpl.subject, html: tpl.html, text: tpl.text })
  } catch (err) {
    console.error('[notify] notifyOwnerOnBookmark failed:', err instanceof Error ? err.message : err)
  }
}

/* ─────────────────────────── Inbox lead ─────────────────────────── */

export async function notifyOwnerOnInboxLead(args: {
  listingId: number
  leadEmail: string
  /** Visitor's name from the "Get a Quote" form. NULL for the email-only "Send me info" form. */
  leadName?: string | null
  leadPhone?: string | null
  leadMessage?: string | null
  /** Form variant — drives the email subject + body wording. */
  source?: 'send_info' | 'quote_request' | string | null
}): Promise<void> {
  try {
    const owner = await loadOwner(args.listingId)
    /* No actorId here — the visitor is usually anonymous. We still skip when
       there is no owner email to notify, but no self-action concern. */
    if (!owner || !owner.owner_email) return

    const tpl = inboxLeadReceivedEmail({
      ownerName: owner.owner_name,
      companyName: owner.company_name,
      listingSlug: owner.slug,
      listingUuid: owner.uuid,
      listingLogoUrl: owner.logo_url,
      leadEmail: args.leadEmail,
      leadName: args.leadName ?? null,
      leadPhone: args.leadPhone ?? null,
      leadMessage: args.leadMessage ?? null,
      source: args.source === 'quote_request' ? 'quote_request' : 'send_info',
    })
    await sendEmail({
      to: owner.owner_email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
      replyTo: args.leadEmail,
    })
  } catch (err) {
    console.error('[notify] notifyOwnerOnInboxLead failed:', err instanceof Error ? err.message : err)
  }
}

/* ─────────────────── Verification approved / rejected ─────────────────── */
/**
 * Sent when an admin moderates a listing_verification_requests row. The
 * applicantId is used purely for logging consistency — these emails always
 * go to the listing OWNER (submissions.user_id), not the applicant, since
 * the listing owner is the one whose public badge changes. In practice the
 * two are the same id (only the owner can apply via the dashboard), but
 * this keeps the code honest if we ever add admin-applies-on-behalf-of.
 */

export async function notifyOwnerOnVerificationApproved(args: {
  listingId: number
  applicantId: number
  adminNotes: string | null
}): Promise<void> {
  try {
    const owner = await loadOwner(args.listingId)
    /* No self-action skip here — verification approval IS for the owner;
       suppressing because the actor is the owner would just lose the email. */
    if (!owner || !owner.owner_email) return

    const tpl = verificationApprovedEmail({
      ownerName: owner.owner_name,
      companyName: owner.company_name,
      listingSlug: owner.slug,
      listingUuid: owner.uuid,
      listingLogoUrl: owner.logo_url,
      adminNotes: args.adminNotes,
    })
    await sendEmail({ to: owner.owner_email, subject: tpl.subject, html: tpl.html, text: tpl.text })
  } catch (err) {
    console.error('[notify] notifyOwnerOnVerificationApproved failed:', err instanceof Error ? err.message : err)
  }
}

export async function notifyOwnerOnVerificationRejected(args: {
  listingId: number
  applicantId: number
  adminNotes: string | null
}): Promise<void> {
  try {
    const owner = await loadOwner(args.listingId)
    if (!owner || !owner.owner_email) return

    const tpl = verificationRejectedEmail({
      ownerName: owner.owner_name,
      companyName: owner.company_name,
      listingSlug: owner.slug,
      listingUuid: owner.uuid,
      listingLogoUrl: owner.logo_url,
      adminNotes: args.adminNotes,
    })
    await sendEmail({ to: owner.owner_email, subject: tpl.subject, html: tpl.html, text: tpl.text })
  } catch (err) {
    console.error('[notify] notifyOwnerOnVerificationRejected failed:', err instanceof Error ? err.message : err)
  }
}
