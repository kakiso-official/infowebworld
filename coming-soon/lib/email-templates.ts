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
  /** Email the visitor submitted asking to be contacted. */
  leadEmail: string
  /** Optional richer fields — only present from the "Get a Quote" form. */
  leadName?: string | null
  leadPhone?: string | null
  leadMessage?: string | null
  /** Form source — drives subject + body wording. Defaults to 'send_info'. */
  source?: 'send_info' | 'quote_request'
}
export function inboxLeadReceivedEmail(a: InboxLeadArgs) {
  const greet = greeting(a.ownerName)
  const safeLeadEmail = escapeHtml(a.leadEmail)
  const isQuote = a.source === 'quote_request'

  const leadName    = a.leadName?.trim() || null
  const leadPhone   = a.leadPhone?.trim() || null
  const leadMessage = a.leadMessage?.trim() || null

  /* Display name in the lead card — falls back to the local-part of the
     email when the visitor didn't fill the form's name field. */
  const displayName = leadName || a.leadEmail.split('@')[0]
  const safeDisplayName = escapeHtml(displayName)

  /* "Field row" helper — only renders when value is non-empty so the email
     stays clean for the email-only "Send me info" submissions. */
  const row = (label: string, value: string | null, opts?: { mono?: boolean; pre?: boolean }) => {
    if (!value) return ''
    const safe = escapeHtml(value)
    const valStyle = opts?.mono
      ? `font-family:${F_BODY};font-size:14px;color:#1A1A1A;font-weight:600;word-break:break-word`
      : `font-family:${F_BODY};font-size:14.5px;color:#1A1A1A;font-weight:600;line-height:1.55;word-break:break-word`
    const valHtml = opts?.pre ? `<div style="white-space:pre-wrap">${safe}</div>` : safe
    return `
      <tr>
        <td style="padding:10px 0;border-top:1px solid #F0E8E2">
          <div style="font-family:${F_BODY};font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#9A9590;margin-bottom:4px">${label}</div>
          <div style="${valStyle}">${valHtml}</div>
        </td>
      </tr>`
  }

  const replySubject = encodeURIComponent(
    isQuote ? `Re: Your quote request for ${a.companyName}` : `Re: ${a.companyName}`
  )
  const replyBody = encodeURIComponent(
    `Hi ${leadName || 'there'},\n\nThanks for reaching out about ${a.companyName}.\n\n`
  )

  const headerCopy = isQuote
    ? `Hey ${escapeHtml(greet)} — <strong style="color:#1A1A1A">${escapeHtml(displayName)}</strong> just submitted a quote request for <strong style="color:#1A1A1A">${escapeHtml(a.companyName)}</strong> via <strong style="color:#E8553D">InfoWebWorld</strong>. This is a high-intent lead — reach out fast.`
    : `Hey ${escapeHtml(greet)} — a visitor on <strong style="color:#1A1A1A">${escapeHtml(a.companyName)}</strong> just left their email via <strong style="color:#E8553D">InfoWebWorld</strong> asking to be contacted. This is a warm lead — reach out fast.`

  const bodyHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:0 48px 16px">
          <p style="margin:0;font-family:${F_BODY};font-size:15px;color:#5C5852;line-height:1.7">
            ${headerCopy}
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 48px">
      <tr>
        <td style="background:linear-gradient(180deg,#FFF5F3 0%,#FFEEE9 100%);border:1px solid #F8D5CD;border-radius:14px;padding:18px 22px 22px">

          <!-- Source pill -->
          <div style="margin-bottom:14px">
            <span style="display:inline-block;font-family:${F_BODY};font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#fff;background:#E8553D;padding:5px 12px;border-radius:999px">
              Lead via InfoWebWorld
            </span>
          </div>

          <!-- Headline: name + email -->
          <div style="font-family:${F_HEAD};font-size:22px;font-weight:800;color:#1A1A1A;letter-spacing:-.1px;line-height:1.25;margin-bottom:2px">${safeDisplayName}</div>
          <a href="mailto:${a.leadEmail}" style="font-family:${F_BODY};font-size:14px;color:#5C5852;text-decoration:none;word-break:break-all">${safeLeadEmail}</a>

          <!-- Field rows -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:14px">
            ${row('Phone', leadPhone, { mono: true })}
            ${row('Message', leadMessage, { pre: true })}
          </table>

          <!-- Actions -->
          <div style="margin-top:16px">
            <a href="mailto:${a.leadEmail}?subject=${replySubject}&body=${replyBody}" style="display:inline-block;background:#1A1A1A;color:#fff;text-decoration:none;font-family:${F_BODY};font-weight:700;font-size:13.5px;padding:11px 20px;border-radius:10px;margin-right:8px">Reply now &nbsp;&#8594;</a>
            ${leadPhone ? `<a href="tel:${escapeHtml(leadPhone)}" style="display:inline-block;background:#fff;color:#1A1A1A;text-decoration:none;font-family:${F_BODY};font-weight:700;font-size:13.5px;padding:11px 20px;border-radius:10px;border:1px solid #E8E3DE">Call &nbsp;&#9742;</a>` : ''}
          </div>
        </td>
      </tr>
    </table>

    <!-- Proof-of-source footer note -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:14px 48px 0">
      <tr>
        <td style="font-family:${F_BODY};font-size:12px;color:#9A9590;line-height:1.6">
          This lead was captured on <a href="${publicUrl(a.listingSlug)}" style="color:#E8553D;text-decoration:none;font-weight:700">infowebworld.com/company/${escapeHtml(a.listingSlug)}</a> and forwarded to you immediately. Your full lead history lives on the engagement dashboard.
        </td>
      </tr>
    </table>
  `

  const subject = isQuote
    ? `🎯 New lead via InfoWebWorld — ${displayName} wants a quote on ${a.companyName}`
    : `📬 New lead via InfoWebWorld — ${displayName} on ${a.companyName}`

  const textParts: string[] = []
  textParts.push(isQuote
    ? `New quote request via InfoWebWorld for ${a.companyName}.`
    : `New lead via InfoWebWorld on ${a.companyName}.`)
  textParts.push('')
  if (leadName)    textParts.push(`Name:    ${leadName}`)
  textParts.push(`Email:   ${a.leadEmail}`)
  if (leadPhone)   textParts.push(`Phone:   ${leadPhone}`)
  if (leadMessage) {
    textParts.push('')
    textParts.push('Message:')
    textParts.push(leadMessage)
  }
  textParts.push('')
  textParts.push(`Reply: mailto:${a.leadEmail}`)
  textParts.push(`Source listing: ${publicUrl(a.listingSlug)}`)
  textParts.push(`Lead dashboard: ${dashUrl(a.listingUuid)}`)

  return {
    subject,
    html: buildEmailShell({
      preheader: isQuote
        ? `${displayName} just requested a quote for ${a.companyName} via InfoWebWorld.`
        : `${displayName} just asked to be contacted about ${a.companyName} via InfoWebWorld.`,
      eyebrow: isQuote ? 'New quote request · via InfoWebWorld' : 'New lead · via InfoWebWorld',
      title: isQuote
        ? `${a.companyName} just got a new quote request`
        : `${a.companyName} just got a new lead`,
      bodyHtml,
      ctaUrl: dashUrl(a.listingUuid),
      ctaText: 'See all leads',
      ctaSecondaryUrl: publicUrl(a.listingSlug),
      ctaSecondaryText: 'View the public listing →',
      footerNote: 'Lead captured and forwarded to you by InfoWebWorld.',
    }),
    text: textParts.join('\n'),
    replyTo: a.leadEmail,
  }
}

/* ──────────────────────────── Verification approved ──────────────────────────── */

export interface VerificationApprovedArgs extends BaseArgs {
  /** Free-form note from the admin who approved — typically empty. */
  adminNotes: string | null
}
export function verificationApprovedEmail(a: VerificationApprovedArgs) {
  const greet = greeting(a.ownerName)
  const adminNote = a.adminNotes?.trim() || ''

  const bodyHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:0 48px 16px">
          <p style="margin:0;font-family:${F_BODY};font-size:15px;color:#5C5852;line-height:1.7">
            Hey ${escapeHtml(greet)} — congratulations. <strong style="color:#1A1A1A">${escapeHtml(a.companyName)}</strong> is now <strong style="color:#0E8F6E">Verified by InfoWebWorld</strong>. The verified badge is live on your listing page now and visitors will see your business as an authenticated source.
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 48px">
      <tr>
        <td style="background:linear-gradient(180deg,#ECFDF5 0%,#D1FAE5 100%);border:1px solid #A7F3D0;border-radius:14px;padding:22px 22px 20px;text-align:center">
          <div style="display:inline-block;width:64px;height:64px;border-radius:999px;background:#0E8F6E;line-height:64px;text-align:center;margin-bottom:10px">
            <span style="display:inline-block;font-family:${F_HEAD};font-size:36px;color:#fff;font-weight:800;line-height:64px">&#10003;</span>
          </div>
          <div style="font-family:${F_HEAD};font-size:22px;font-weight:800;color:#0E5547;letter-spacing:-.1px">Verified by InfoWebWorld</div>
          <div style="font-family:${F_BODY};font-size:13.5px;color:#0E8F6E;font-weight:700;margin-top:4px;letter-spacing:.04em;text-transform:uppercase">Authenticated business · Approved</div>
        </td>
      </tr>
    </table>

    ${adminNote ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:18px 48px 0">
      <tr>
        <td style="background:#FAFAF8;border:1px solid #F0EDEA;border-radius:12px;padding:16px 18px">
          <div style="font-family:${F_BODY};font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#7A756F;margin-bottom:6px">Note from our review team</div>
          <p style="margin:0;font-family:${F_BODY};font-size:14px;color:#1A1A1A;line-height:1.55;white-space:pre-wrap">${escapeHtml(adminNote)}</p>
        </td>
      </tr>
    </table>` : ''}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:18px 48px 0">
      <tr>
        <td style="font-family:${F_BODY};font-size:13px;color:#5C5852;line-height:1.6">
          What this means for you:
          <ul style="margin:8px 0 0;padding-left:20px;color:#5C5852">
            <li style="margin-bottom:4px">A prominent <strong>Verified by InfoWebWorld</strong> badge appears on your public listing.</li>
            <li style="margin-bottom:4px">Higher trust signal in search results and category pages.</li>
            <li style="margin-bottom:0">Better conversion on outbound links and lead capture.</li>
          </ul>
        </td>
      </tr>
    </table>
  `

  return {
    subject: `✓ ${a.companyName} is now Verified by InfoWebWorld`,
    html: buildEmailShell({
      preheader: `Your verification request was approved. The verified badge is live on ${a.companyName} now.`,
      eyebrow: 'Verification approved',
      title: `${a.companyName} is now Verified`,
      bodyHtml,
      ctaUrl: publicUrl(a.listingSlug),
      ctaText: 'See the badge on your listing',
      ctaSecondaryUrl: dashUrl(a.listingUuid),
      ctaSecondaryText: 'Open your dashboard →',
      footerNote: 'Sent because your verification request was approved.',
    }),
    text:
`Congrats — ${a.companyName} is now Verified by InfoWebWorld.

The verified badge is live on your listing now.${adminNote ? `

Note from our review team:
${adminNote}` : ''}

Listing: ${publicUrl(a.listingSlug)}
Dashboard: ${dashUrl(a.listingUuid)}`,
  }
}

/* ──────────────────────────── Verification rejected ──────────────────────────── */

export interface VerificationRejectedArgs extends BaseArgs {
  /** Reason / feedback from the admin. May be empty if admin didn't write one. */
  adminNotes: string | null
}
export function verificationRejectedEmail(a: VerificationRejectedArgs) {
  const greet = greeting(a.ownerName)
  const adminNote = a.adminNotes?.trim() || ''
  const verifyUrl = `${SITE}/dashboard/listings/${a.listingUuid}/verify`

  const bodyHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:0 48px 16px">
          <p style="margin:0;font-family:${F_BODY};font-size:15px;color:#5C5852;line-height:1.7">
            Hey ${escapeHtml(greet)} — we couldn't verify <strong style="color:#1A1A1A">${escapeHtml(a.companyName)}</strong> with what you submitted. This isn't final — you can re-apply any time once you've addressed the issue below.
          </p>
        </td>
      </tr>
    </table>

    ${adminNote ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 48px">
      <tr>
        <td style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:14px;padding:18px 20px">
          <div style="font-family:${F_BODY};font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#9A3412;margin-bottom:8px">What we need</div>
          <p style="margin:0;font-family:${F_BODY};font-size:14.5px;color:#1A1A1A;line-height:1.6;white-space:pre-wrap">${escapeHtml(adminNote)}</p>
        </td>
      </tr>
    </table>` : `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 48px">
      <tr>
        <td style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:14px;padding:18px 20px">
          <p style="margin:0;font-family:${F_BODY};font-size:14.5px;color:#1A1A1A;line-height:1.6">
            We weren't able to confirm ownership from the evidence provided. Common fixes: use a business email matching your website's domain, add your company registration number, or attach a document showing your role.
          </p>
        </td>
      </tr>
    </table>`}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:18px 48px 0">
      <tr>
        <td style="font-family:${F_BODY};font-size:13px;color:#5C5852;line-height:1.6">
          Strong applications usually include all of:
          <ul style="margin:8px 0 0;padding-left:20px;color:#5C5852">
            <li style="margin-bottom:4px">A business email matching your website domain.</li>
            <li style="margin-bottom:4px">Company registration / EIN / VAT number.</li>
            <li style="margin-bottom:4px">Your role at the company (founder, marketing lead, etc.).</li>
            <li style="margin-bottom:0">Owner LinkedIn profile or a public document linking you to the company.</li>
          </ul>
        </td>
      </tr>
    </table>
  `

  return {
    subject: `Action needed — verification update for ${a.companyName}`,
    html: buildEmailShell({
      preheader: `We couldn't verify ${a.companyName} this round. Re-apply once the issue is resolved.`,
      eyebrow: 'Verification update',
      title: `${a.companyName} — verification needs more info`,
      bodyHtml,
      ctaUrl: verifyUrl,
      ctaText: 'Update and re-apply',
      ctaSecondaryUrl: dashUrl(a.listingUuid),
      ctaSecondaryText: 'Open your dashboard →',
      footerNote: 'Sent because your verification request needs updates before approval.',
    }),
    text:
`We couldn't verify ${a.companyName} this round.${adminNote ? `

Note from our review team:
${adminNote}` : ''}

You can re-apply at any time:
${verifyUrl}

Dashboard: ${dashUrl(a.listingUuid)}`,
  }
}

/* ════════════════════════════════════════════════════════════════════════
   Submission & claim lifecycle emails (the listing email flow). These events
   don't all have a uuid/owner yet, so they take lightweight args.
   ════════════════════════════════════════════════════════════════════════ */

function txPara(html: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="padding:0 48px 16px"><p style="margin:0;font-family:${F_BODY};font-size:15px;color:#5C5852;line-height:1.7">${html}</p></td></tr></table>`
}
function txNote(label: string, text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 48px"><tr><td style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:14px;padding:16px 18px"><div style="font-family:${F_BODY};font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#9A3412;margin-bottom:6px">${escapeHtml(label)}</div><p style="margin:0;font-family:${F_BODY};font-size:14.5px;color:#1A1A1A;line-height:1.6;white-space:pre-wrap">${escapeHtml(text)}</p></td></tr></table>`
}
function txKv(rows: Array<[string, string]>): string {
  const trs = rows.filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:4px 0;font-family:${F_BODY};font-size:13px;color:#7A756F;width:120px;vertical-align:top">${escapeHtml(k)}</td><td style="padding:4px 0;font-family:${F_BODY};font-size:13.5px;color:#1A1A1A;font-weight:600;word-break:break-word">${escapeHtml(v)}</td></tr>`).join('')
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 48px"><tr><td style="background:#FAFAF8;border:1px solid #F0EDEA;border-radius:14px;padding:16px 20px"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${trs}</table></td></tr></table>`
}
function txListingUrl(slug: string, mode: 'product' | 'company'): string {
  return `${SITE}/${mode === 'company' ? 'profile' : 'listing'}/${slug}`
}

export interface SubmissionReceivedArgs { recipientName: string | null; companyName: string; listingMode: 'product' | 'company' }
export function submissionReceivedEmail(a: SubmissionReceivedArgs) {
  const greet = greeting(a.recipientName)
  const noun = a.listingMode === 'company' ? 'company profile' : 'listing'
  const bodyHtml =
    txPara(`Hi ${escapeHtml(greet)} — thanks for submitting <strong style="color:#1A1A1A">${escapeHtml(a.companyName)}</strong>. It's in our review queue now.`) +
    txPara(`Our team checks new ${noun}s for quality and authenticity — usually within <strong>1–2 business days</strong>. We'll email you the moment it goes live. Nothing else needed from you right now.`)
  return {
    subject: `We received your ${noun}: ${a.companyName}`,
    html: buildEmailShell({
      preheader: `${a.companyName} is in the review queue — we'll email you when it's live.`,
      eyebrow: 'Submission received',
      title: `Thanks — ${a.companyName} is in the queue`,
      bodyHtml,
      ctaUrl: `${SITE}/dashboard/listings`,
      ctaText: 'Track it in your dashboard',
      footerNote: 'Sent because you submitted a listing on InfoWebWorld.',
    }),
    text: `Hi ${greet} — thanks for submitting ${a.companyName}. It's in our review queue and usually goes live within 1-2 business days. We'll email you when it's approved.\n\nDashboard: ${SITE}/dashboard/listings`,
  }
}

export interface SubmissionApprovedArgs { recipientName: string | null; companyName: string; listingSlug: string; listingMode: 'product' | 'company' }
export function submissionApprovedEmail(a: SubmissionApprovedArgs) {
  const greet = greeting(a.recipientName)
  const url = txListingUrl(a.listingSlug, a.listingMode)
  const bodyHtml =
    txPara(`Hi ${escapeHtml(greet)} — great news. <strong style="color:#1A1A1A">${escapeHtml(a.companyName)}</strong> has been approved and is <strong style="color:#0E8F6E">live on InfoWebWorld</strong>.`) +
    txPara(`It's now discoverable in search and its category, and your dofollow backlink is active. Collect reviews, respond to leads, and track engagement from your dashboard.`)
  return {
    subject: `${a.companyName} is live on InfoWebWorld`,
    html: buildEmailShell({
      preheader: `${a.companyName} is approved and live.`,
      eyebrow: 'Listing approved',
      title: `${a.companyName} is approved & live`,
      bodyHtml,
      ctaUrl: url,
      ctaText: 'View your live listing',
      ctaSecondaryUrl: `${SITE}/dashboard/listings`,
      ctaSecondaryText: 'Manage it in your dashboard →',
      footerNote: 'Sent because your listing was approved on InfoWebWorld.',
    }),
    text: `Hi ${greet} — ${a.companyName} is approved and live on InfoWebWorld.\n\nView it: ${url}\nDashboard: ${SITE}/dashboard/listings`,
  }
}

export interface SubmissionRejectedArgs { recipientName: string | null; companyName: string; reason: string | null }
export function submissionRejectedEmail(a: SubmissionRejectedArgs) {
  const greet = greeting(a.recipientName)
  const reason = a.reason?.trim() || ''
  const bodyHtml =
    txPara(`Hi ${escapeHtml(greet)} — thanks for submitting <strong style="color:#1A1A1A">${escapeHtml(a.companyName)}</strong>. We couldn't approve it as-is. This isn't final — fix the point below and resubmit.`) +
    (reason ? txNote('What to fix', reason) : txPara(`Common reasons: incomplete details, a name/category mismatch, or content that needs cleanup. Resubmit with the fixes and we'll take another look.`))
  return {
    subject: `Update on your ${a.companyName} listing`,
    html: buildEmailShell({
      preheader: `${a.companyName} needs a change before it can go live.`,
      eyebrow: 'Listing update',
      title: `${a.companyName} — a change is needed`,
      bodyHtml,
      ctaUrl: `${SITE}/business`,
      ctaText: 'Resubmit your listing',
      footerNote: 'Sent because you submitted a listing on InfoWebWorld.',
    }),
    text: `Hi ${greet} — we couldn't approve ${a.companyName} as-is.${reason ? `\n\nWhat to fix:\n${reason}` : ''}\n\nResubmit: ${SITE}/business`,
  }
}

export interface ClaimReceivedArgs { recipientName: string | null; companyName: string }
export function claimReceivedEmail(a: ClaimReceivedArgs) {
  const greet = greeting(a.recipientName)
  const bodyHtml =
    txPara(`Hi ${escapeHtml(greet)} — we've received your request to claim <strong style="color:#1A1A1A">${escapeHtml(a.companyName)}</strong>.`) +
    txPara(`Our team will review your evidence, usually within <strong>1–2 business days</strong>. If approved, the listing becomes yours to manage — edit details, respond to reviews, and capture leads.`)
  return {
    subject: `We received your claim for ${a.companyName}`,
    html: buildEmailShell({
      preheader: `Your claim for ${a.companyName} is under review.`,
      eyebrow: 'Claim received',
      title: `Your claim for ${a.companyName} is under review`,
      bodyHtml,
      ctaUrl: `${SITE}/dashboard/listings`,
      ctaText: 'Go to your dashboard',
      footerNote: 'Sent because you requested to claim a listing on InfoWebWorld.',
    }),
    text: `Hi ${greet} — we've received your request to claim ${a.companyName} and will review it within 1-2 business days.\n\nDashboard: ${SITE}/dashboard/listings`,
  }
}

export interface ClaimRejectedArgs { recipientName: string | null; companyName: string; reason: string | null }
export function claimRejectedEmail(a: ClaimRejectedArgs) {
  const greet = greeting(a.recipientName)
  const reason = a.reason?.trim() || ''
  const bodyHtml =
    txPara(`Hi ${escapeHtml(greet)} — we reviewed your request to claim <strong style="color:#1A1A1A">${escapeHtml(a.companyName)}</strong> but couldn't approve it with the evidence provided.`) +
    (reason ? txNote('What we need', reason) : txPara(`The fastest path is a business email on the company's own domain — that verifies you instantly. You can also add a registration number or a document showing your role, then try again.`))
  return {
    subject: `Update on your claim for ${a.companyName}`,
    html: buildEmailShell({
      preheader: `We couldn't approve your claim for ${a.companyName} this round.`,
      eyebrow: 'Claim update',
      title: `We couldn't approve your claim for ${a.companyName}`,
      bodyHtml,
      ctaUrl: `${SITE}/dashboard/listings`,
      ctaText: 'Try claiming again',
      footerNote: 'Sent because you requested to claim a listing on InfoWebWorld.',
    }),
    text: `Hi ${greet} — we couldn't approve your claim for ${a.companyName}.${reason ? `\n\nWhat we need:\n${reason}` : ''}\n\nTry again: ${SITE}/dashboard/listings`,
  }
}

export interface AdminNewSubmissionArgs { companyName: string; contactName: string | null; contactEmail: string; category: string | null; listingMode: 'product' | 'company' }
export function adminNewSubmissionEmail(a: AdminNewSubmissionArgs) {
  const bodyHtml =
    txPara(`A new ${a.listingMode === 'company' ? 'company profile' : 'product listing'} was just submitted and is awaiting review.`) +
    txKv([
      ['Company', a.companyName],
      ['Type', a.listingMode === 'company' ? 'Company profile' : 'Product listing'],
      ['Category', a.category || '—'],
      ['Contact', a.contactName || '—'],
      ['Email', a.contactEmail],
    ])
  return {
    subject: `New ${a.listingMode === 'company' ? 'profile' : 'listing'} to review: ${a.companyName}`,
    html: buildEmailShell({
      preheader: `${a.companyName} is awaiting review.`,
      eyebrow: 'Admin · new submission',
      title: `Review: ${a.companyName}`,
      bodyHtml,
      ctaUrl: `${SITE}/iww-hq/submissions`,
      ctaText: 'Open the review queue',
      footerNote: 'Internal admin notification from InfoWebWorld.',
    }),
    text: `New submission awaiting review.\n\nCompany: ${a.companyName}\nType: ${a.listingMode}\nCategory: ${a.category || '—'}\nContact: ${a.contactName || '—'} <${a.contactEmail}>\n\nQueue: ${SITE}/iww-hq/submissions`,
  }
}

export interface AdminNewClaimArgs { companyName: string; claimantName: string | null; claimantEmail: string | null; evidence: string | null }
export function adminNewClaimEmail(a: AdminNewClaimArgs) {
  const bodyHtml =
    txPara(`A new ownership claim was submitted for manual review.`) +
    txKv([
      ['Listing', a.companyName],
      ['Claimant', a.claimantName || '—'],
      ['Email', a.claimantEmail || '—'],
      ['Evidence', a.evidence || '—'],
    ])
  return {
    subject: `New claim to review: ${a.companyName}`,
    html: buildEmailShell({
      preheader: `${a.companyName} has a pending ownership claim.`,
      eyebrow: 'Admin · new claim',
      title: `Claim review: ${a.companyName}`,
      bodyHtml,
      ctaUrl: `${SITE}/iww-hq/verifications`,
      ctaText: 'Open the claims queue',
      footerNote: 'Internal admin notification from InfoWebWorld.',
    }),
    text: `New ownership claim for manual review.\n\nListing: ${a.companyName}\nClaimant: ${a.claimantName || '—'} <${a.claimantEmail || '—'}>\nEvidence: ${a.evidence || '—'}\n\nQueue: ${SITE}/iww-hq/verifications`,
  }
}
