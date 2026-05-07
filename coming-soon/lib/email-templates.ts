import { buildEmailShell, escapeHtml, avatarBlock, EMAIL_FONTS, EMAIL_SITE } from './email'

const { F_BODY, F_HEAD } = EMAIL_FONTS
const SITE = EMAIL_SITE

/**
 * Per-event email templates. Each function returns { subject, html, text }
 * so callers can hand the result straight to sendEmail(). Plain-text bodies
 * are used as fallback by clients that strip HTML and as the snippet shown
 * in inbox previews.
 */

interface BaseArgs {
  /** Owner's display name from business_users.name. Used for greeting. */
  ownerName: string | null
  /** The listing's company/product name from submissions.company_name. */
  companyName: string
  /** The listing slug — used for /company/[slug] and /dashboard/listings/[uuid] links. */
  listingSlug: string
  /** The listing uuid — used for /dashboard/listings/[uuid] link. */
  listingUuid: string
  listingLogoUrl?: string | null
}

function greeting(name: string | null | undefined): string {
  const first = (name || '').trim().split(/\s+/)[0]
  return first || 'there'
}

function dashUrl(uuid: string): string {
  return `${SITE}/dashboard/listings/${uuid}/engagement`
}
function publicUrl(slug: string): string {
  return `${SITE}/company/${slug}`
}

/* ──────────────────────────── Review received ──────────────────────────── */

export interface ReviewArgs extends BaseArgs {
  reviewerName: string
  reviewerAvatarUrl: string | null
  rating: number
  reviewTitle: string
  reviewBody: string
}
export function reviewReceivedEmail(a: ReviewArgs) {
  const stars = '★'.repeat(a.rating) + '☆'.repeat(5 - a.rating)
  const greet = greeting(a.ownerName)
  const reviewerFirst = a.reviewerName.split(/\s+/)[0] || a.reviewerName
  const previewBody = a.reviewBody.length > 90 ? `${a.reviewBody.slice(0, 87)}…` : a.reviewBody

  const bodyHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:0 48px 16px">
          <p style="margin:0;font-family:${F_BODY};font-size:15px;color:#5C5852;line-height:1.7">
            Hey ${escapeHtml(greet)} — <strong style="color:#1A1A1A">${escapeHtml(a.reviewerName)}</strong> just left a review on <strong style="color:#1A1A1A">${escapeHtml(a.companyName)}</strong>.
          </p>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 48px">
      <tr>
        <td style="background:#FAFAF8;border:1px solid #F0EDEA;border-radius:14px;padding:22px 22px 20px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="46" style="vertical-align:top">
                ${avatarBlock(a.reviewerName, a.reviewerAvatarUrl, '#0C9A9A')}
              </td>
              <td style="vertical-align:top;padding-left:14px">
                <div style="font-family:${F_BODY};font-size:14px;font-weight:800;color:#1A1A1A">${escapeHtml(a.reviewerName)}</div>
                <div style="font-family:${F_BODY};font-size:14.5px;font-weight:700;color:#FFA91C;margin-top:3px;letter-spacing:.06em">${stars} <span style="color:#7A756F;font-weight:600">${a.rating}/5</span></div>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding-top:18px">
                <div style="font-family:${F_HEAD};font-size:18px;font-weight:800;color:#1A1A1A;line-height:1.3;letter-spacing:-.1px">${escapeHtml(a.reviewTitle)}</div>
                <p style="margin:10px 0 0;font-family:${F_BODY};font-size:14px;color:#5C5852;line-height:1.7;white-space:pre-wrap">${escapeHtml(a.reviewBody)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `

  return {
    subject: `${a.rating}★ review from ${a.reviewerName} on ${a.companyName}`,
    html: buildEmailShell({
      preheader: `${reviewerFirst}: "${a.reviewTitle.slice(0, 70)}" — ${previewBody}`,
      eyebrow: 'New review',
      title: `${reviewerFirst} just reviewed ${a.companyName}`,
      bodyHtml,
      ctaUrl: dashUrl(a.listingUuid),
      ctaText: 'Open engagement dashboard',
      ctaSecondaryUrl: `${publicUrl(a.listingSlug)}#insights`,
      ctaSecondaryText: 'See it on the public listing →',
      footerNote: 'Sent because someone reviewed your listing.',
    }),
    text:
`${a.reviewerName} left a ${a.rating}-star review on ${a.companyName}.

"${a.reviewTitle}"

${a.reviewBody}

See all engagement: ${dashUrl(a.listingUuid)}
Public listing: ${publicUrl(a.listingSlug)}`,
  }
}

/* ──────────────────────────── Reaction received ──────────────────────────── */

export interface ReactionArgs extends BaseArgs {
  kind: 'like' | 'dislike'
  actorName: string
  actorAvatarUrl: string | null
  totalLikes: number
  totalDislikes: number
}
export function reactionReceivedEmail(a: ReactionArgs) {
  const greet = greeting(a.ownerName)
  const actorFirst = a.actorName.split(/\s+/)[0] || a.actorName
  const isLike = a.kind === 'like'
  const verb = isLike ? 'liked' : 'gave feedback on'
  const eyebrow = isLike ? 'New like' : 'Critical feedback'
  const headline = isLike
    ? `${actorFirst} liked ${a.companyName}`
    : `${actorFirst} flagged ${a.companyName}`
  const accent = isLike ? '#16A34A' : '#DC2626'
  const intro = isLike
    ? `Hey ${escapeHtml(greet)} — <strong style="color:#1A1A1A">${escapeHtml(a.actorName)}</strong> just liked your <strong style="color:#1A1A1A">${escapeHtml(a.companyName)}</strong> listing.`
    : `Hey ${escapeHtml(greet)} — <strong style="color:#1A1A1A">${escapeHtml(a.actorName)}</strong> left a thumbs-down on <strong style="color:#1A1A1A">${escapeHtml(a.companyName)}</strong>. It might be worth checking what's missing or unclear on the page.`

  const bodyHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:0 48px 16px">
          <p style="margin:0;font-family:${F_BODY};font-size:15px;color:#5C5852;line-height:1.7">${intro}</p>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 48px">
      <tr>
        <td style="background:#FAFAF8;border:1px solid #F0EDEA;border-radius:14px;padding:18px 20px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="46" style="vertical-align:middle">
                ${avatarBlock(a.actorName, a.actorAvatarUrl, accent)}
              </td>
              <td style="vertical-align:middle;padding-left:14px">
                <div style="font-family:${F_BODY};font-size:14px;font-weight:800;color:#1A1A1A">${escapeHtml(a.actorName)}</div>
                <div style="font-family:${F_BODY};font-size:13px;font-weight:600;color:${accent};margin-top:2px">${isLike ? '👍 Liked' : '👎 Disliked'} your listing</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:18px 48px 0">
      <tr>
        <td>
          <div style="font-family:${F_BODY};font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#7A756F;margin-bottom:10px">Running totals</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:12px 14px;width:50%">
                <div style="font-family:${F_BODY};font-size:11px;font-weight:700;color:#15803D;text-transform:uppercase;letter-spacing:.08em">👍 Likes</div>
                <div style="font-family:${F_HEAD};font-size:22px;font-weight:800;color:#15803D;margin-top:2px">${a.totalLikes.toLocaleString()}</div>
              </td>
              <td style="width:8px"></td>
              <td style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:12px 14px;width:50%">
                <div style="font-family:${F_BODY};font-size:11px;font-weight:700;color:#B91C1C;text-transform:uppercase;letter-spacing:.08em">👎 Dislikes</div>
                <div style="font-family:${F_HEAD};font-size:22px;font-weight:800;color:#B91C1C;margin-top:2px">${a.totalDislikes.toLocaleString()}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `

  return {
    subject: isLike
      ? `👍 ${actorFirst} liked ${a.companyName}`
      : `👎 Heads-up: ${actorFirst} disliked ${a.companyName}`,
    html: buildEmailShell({
      preheader: isLike
        ? `Likes are now ${a.totalLikes}. ${actorFirst} just ${verb} your listing.`
        : `${actorFirst} left a thumbs-down. Total dislikes: ${a.totalDislikes}.`,
      eyebrow,
      title: headline,
      bodyHtml,
      ctaUrl: dashUrl(a.listingUuid),
      ctaText: 'Open engagement dashboard',
      ctaSecondaryUrl: publicUrl(a.listingSlug),
      ctaSecondaryText: 'View the public listing →',
      footerNote: 'Sent on the FIRST reaction from each user — re-toggles do not re-email.',
    }),
    text:
`${a.actorName} ${verb} ${a.companyName}.

Running totals — Likes: ${a.totalLikes} · Dislikes: ${a.totalDislikes}

Engagement dashboard: ${dashUrl(a.listingUuid)}
Public listing: ${publicUrl(a.listingSlug)}`,
  }
}

/* ──────────────────────────── Follow received ──────────────────────────── */

export interface FollowArgs extends BaseArgs {
  actorName: string
  actorAvatarUrl: string | null
  totalFollowers: number
}
export function followReceivedEmail(a: FollowArgs) {
  const greet = greeting(a.ownerName)
  const actorFirst = a.actorName.split(/\s+/)[0] || a.actorName

  const bodyHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:0 48px 16px">
          <p style="margin:0;font-family:${F_BODY};font-size:15px;color:#5C5852;line-height:1.7">
            Hey ${escapeHtml(greet)} — <strong style="color:#1A1A1A">${escapeHtml(a.actorName)}</strong> just started following <strong style="color:#1A1A1A">${escapeHtml(a.companyName)}</strong>. They'll see your updates first.
          </p>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 48px">
      <tr>
        <td style="background:#FAFAF8;border:1px solid #F0EDEA;border-radius:14px;padding:18px 20px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="46" style="vertical-align:middle">${avatarBlock(a.actorName, a.actorAvatarUrl, '#0C9A9A')}</td>
              <td style="vertical-align:middle;padding-left:14px">
                <div style="font-family:${F_BODY};font-size:14px;font-weight:800;color:#1A1A1A">${escapeHtml(a.actorName)}</div>
                <div style="font-family:${F_BODY};font-size:13px;font-weight:600;color:#0C9A9A;margin-top:2px">Started following you</div>
              </td>
              <td style="vertical-align:middle;text-align:right">
                <div style="font-family:${F_HEAD};font-size:22px;font-weight:800;color:#1A1A1A">${a.totalFollowers.toLocaleString()}</div>
                <div style="font-family:${F_BODY};font-size:11px;font-weight:600;color:#7A756F;letter-spacing:.05em;text-transform:uppercase">Total followers</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `

  return {
    subject: `${actorFirst} is now following ${a.companyName}`,
    html: buildEmailShell({
      preheader: `Total followers: ${a.totalFollowers}. ${actorFirst} just followed your listing.`,
      eyebrow: 'New follower',
      title: `${actorFirst} is following ${a.companyName}`,
      bodyHtml,
      ctaUrl: dashUrl(a.listingUuid),
      ctaText: 'Open engagement dashboard',
      ctaSecondaryUrl: publicUrl(a.listingSlug),
      ctaSecondaryText: 'View the public listing →',
      footerNote: 'Sent on the first follow from each user.',
    }),
    text:
`${a.actorName} is now following ${a.companyName}. Total followers: ${a.totalFollowers}.

Engagement dashboard: ${dashUrl(a.listingUuid)}`,
  }
}

/* ──────────────────────────── Bookmark received ──────────────────────────── */

export interface BookmarkArgs extends BaseArgs {
  actorName: string
  actorAvatarUrl: string | null
  totalBookmarks: number
}
export function bookmarkReceivedEmail(a: BookmarkArgs) {
  const greet = greeting(a.ownerName)
  const actorFirst = a.actorName.split(/\s+/)[0] || a.actorName

  const bodyHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:0 48px 16px">
          <p style="margin:0;font-family:${F_BODY};font-size:15px;color:#5C5852;line-height:1.7">
            Hey ${escapeHtml(greet)} — <strong style="color:#1A1A1A">${escapeHtml(a.actorName)}</strong> just saved <strong style="color:#1A1A1A">${escapeHtml(a.companyName)}</strong> to their collection. Bookmarks are a strong "I'll be back" signal.
          </p>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 48px">
      <tr>
        <td style="background:#FAFAF8;border:1px solid #F0EDEA;border-radius:14px;padding:18px 20px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="46" style="vertical-align:middle">${avatarBlock(a.actorName, a.actorAvatarUrl, '#8B5CF6')}</td>
              <td style="vertical-align:middle;padding-left:14px">
                <div style="font-family:${F_BODY};font-size:14px;font-weight:800;color:#1A1A1A">${escapeHtml(a.actorName)}</div>
                <div style="font-family:${F_BODY};font-size:13px;font-weight:600;color:#8B5CF6;margin-top:2px">🔖 Saved your listing</div>
              </td>
              <td style="vertical-align:middle;text-align:right">
                <div style="font-family:${F_HEAD};font-size:22px;font-weight:800;color:#1A1A1A">${a.totalBookmarks.toLocaleString()}</div>
                <div style="font-family:${F_BODY};font-size:11px;font-weight:600;color:#7A756F;letter-spacing:.05em;text-transform:uppercase">Total saves</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `

  return {
    subject: `🔖 ${actorFirst} bookmarked ${a.companyName}`,
    html: buildEmailShell({
      preheader: `${actorFirst} saved your listing. Total bookmarks: ${a.totalBookmarks}.`,
      eyebrow: 'New bookmark',
      title: `${actorFirst} saved ${a.companyName}`,
      bodyHtml,
      ctaUrl: dashUrl(a.listingUuid),
      ctaText: 'Open engagement dashboard',
      ctaSecondaryUrl: publicUrl(a.listingSlug),
      ctaSecondaryText: 'View the public listing →',
      footerNote: 'Sent on the first bookmark from each user.',
    }),
    text:
`${a.actorName} bookmarked ${a.companyName}. Total saves: ${a.totalBookmarks}.

Engagement dashboard: ${dashUrl(a.listingUuid)}`,
  }
}

/* ──────────────────────────── Inbox lead received ──────────────────────────── */

export interface InboxLeadArgs extends BaseArgs {
  /** The email the visitor submitted asking to be contacted. */
  leadEmail: string
}
export function inboxLeadReceivedEmail(a: InboxLeadArgs) {
  const greet = greeting(a.ownerName)
  const safeLeadEmail = escapeHtml(a.leadEmail)

  const bodyHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:0 48px 16px">
          <p style="margin:0;font-family:${F_BODY};font-size:15px;color:#5C5852;line-height:1.7">
            Hey ${escapeHtml(greet)} — a visitor on <strong style="color:#1A1A1A">${escapeHtml(a.companyName)}</strong> just left their email asking to be contacted. This is a warm lead — reach out fast.
          </p>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 48px">
      <tr>
        <td style="background:linear-gradient(180deg,#FFF5F3 0%,#FFEEE9 100%);border:1px solid #F8D5CD;border-radius:14px;padding:22px 22px">
          <div style="font-family:${F_BODY};font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2.5px;color:#E8553D;margin-bottom:8px">Lead email</div>
          <a href="mailto:${a.leadEmail}" style="font-family:${F_HEAD};font-size:22px;font-weight:800;color:#1A1A1A;text-decoration:none;letter-spacing:-.1px;word-break:break-all">${safeLeadEmail}</a>
          <div style="margin-top:14px">
            <a href="mailto:${a.leadEmail}?subject=Re%3A%20${encodeURIComponent(a.companyName)}&body=${encodeURIComponent(`Hi there,\n\nThanks for reaching out about ${a.companyName}.\n\n`)}" style="display:inline-block;background:#1A1A1A;color:#fff;text-decoration:none;font-family:${F_BODY};font-weight:700;font-size:13.5px;padding:11px 20px;border-radius:10px">Reply now &nbsp;&#8594;</a>
          </div>
        </td>
      </tr>
    </table>
  `

  return {
    subject: `📬 New lead on ${a.companyName} — ${a.leadEmail}`,
    html: buildEmailShell({
      preheader: `New lead: ${a.leadEmail} asked to be contacted about ${a.companyName}.`,
      eyebrow: 'New lead',
      title: `${a.companyName} just got a new lead`,
      bodyHtml,
      ctaUrl: dashUrl(a.listingUuid),
      ctaText: 'See all leads',
      ctaSecondaryUrl: publicUrl(a.listingSlug),
      ctaSecondaryText: 'View the public listing →',
      footerNote: 'A visitor submitted their email on your listing.',
    }),
    text:
`New lead on ${a.companyName}.

Visitor email: ${a.leadEmail}

Reply directly: mailto:${a.leadEmail}
All leads: ${dashUrl(a.listingUuid)}`,
    replyTo: a.leadEmail,
  }
}
