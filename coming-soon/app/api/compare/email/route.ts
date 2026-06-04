import { NextResponse } from 'next/server'
import { query, execute } from '../../../../lib/db'
import { checkRateLimit } from '../../../../lib/rate-limit'
import { sendEmail, buildEmailShell, escapeHtml } from '../../../../lib/email'

/* ─────────────────────────────────────────────────────────────
   POST /api/compare/email
   {
     email: string,
     slugs: string[]        // 1–4 product slugs being compared
   }

   Sends a branded HTML summary of the comparison to the visitor's
   inbox AND records the capture against each listing's inbox-email
   stream so owners get the "buyers comparing me" signal in their
   dashboard inbox.

   Rate-limited 3 / 5 min per IP. Same SMTP pipe as the rest of the
   site (lib/email.ts wraps nodemailer with shared shell + escape).
   ───────────────────────────────────────────────────────────── */

export const dynamic = 'force-dynamic'

const MAX_COMPARE = 4
const SITE = 'https://www.infowebworld.com'

type Row = {
  id: number
  slug: string
  company_name: string
  tagline: string | null
  logo_url: string | null
  website: string | null
  starting_price: string | null
  starting_price_period: string | null
  category_name: string | null
}

function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254
}

export async function POST(req: Request) {
  let body: { email?: unknown; slugs?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const slugsIn = Array.isArray(body.slugs)
    ? body.slugs.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
        .map(s => s.trim().toLowerCase())
    : []

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'Enter a valid email address.' }, { status: 400 })
  }
  if (slugsIn.length < 1) {
    return NextResponse.json({ ok: false, error: 'Pick at least one product to compare first.' }, { status: 400 })
  }
  const slugs = Array.from(new Set(slugsIn)).slice(0, MAX_COMPARE)

  // Rate limit
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown'
  const ok = await checkRateLimit(ip, 'compare-email', 3, 300)
  if (!ok) {
    return NextResponse.json({ ok: false, error: 'Too many requests. Try again in a few minutes.' }, { status: 429 })
  }

  // Look up the listings — drop any that don't resolve (typos, deleted)
  const placeholders = slugs.map(() => '?').join(',')
  const rows = await query<Row>(
    `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url, s.website,
            s.starting_price, s.starting_price_period,
            c.name AS category_name
     FROM submissions s
     LEFT JOIN categories c ON c.id = s.category_id
     WHERE s.slug IN (${placeholders})
       AND s.status IN ('active', 'paid')
       AND COALESCE(s.listing_mode, 'product') = 'product'`,
    slugs
  )

  if (rows.length === 0) {
    return NextResponse.json({ ok: false, error: 'None of the selected products were found.' }, { status: 404 })
  }

  // Re-order to match the user's input order, dropping unresolved
  const bySlug = new Map(rows.map(r => [r.slug, r]))
  const ordered = slugs.map(s => bySlug.get(s)).filter((r): r is Row => !!r)

  // Build the email body — one card per listing
  const headline = ordered.length === 1
    ? `Your saved comparison: ${ordered[0].company_name}`
    : `${ordered.map(r => r.company_name).join(' vs ')} — comparison`

  const compareUrl = `${SITE}/compare/${ordered.map(r => r.slug).join('-vs-')}`

  const cardsHtml = ordered.map(r => {
    const priceLine = r.starting_price
      ? `Starting from $${escapeHtml(String(r.starting_price))}${r.starting_price_period ? ` ${escapeHtml(r.starting_price_period)}` : ''}`
      : 'Pricing not shared'
    return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 12px">
        <tr>
          <td style="padding:14px 16px;background:#FBFAF8;border:1px solid #E8E4DF;border-radius:12px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="width:48px;vertical-align:top">
                  ${r.logo_url
                    ? `<img src="${escapeHtml(r.logo_url)}" width="40" height="40" alt="" style="display:block;border-radius:8px;border:1px solid #E8E4DF;background:#fff">`
                    : `<div style="width:40px;height:40px;border-radius:8px;background:#E8553D;color:#fff;font-family:Nunito,sans-serif;font-size:16px;font-weight:800;text-align:center;line-height:40px">${escapeHtml(r.company_name.charAt(0).toUpperCase())}</div>`
                  }
                </td>
                <td style="vertical-align:top;padding-left:12px">
                  <div style="font-family:'Bricolage Grotesque',Georgia,serif;font-size:17px;font-weight:800;color:#1A1A1A;line-height:1.25;margin-bottom:3px">
                    <a href="${SITE}/listing/${escapeHtml(r.slug)}" target="_blank" style="color:#1A1A1A;text-decoration:none">${escapeHtml(r.company_name)}</a>
                  </div>
                  ${r.category_name ? `<div style="font-family:Nunito,sans-serif;font-size:12px;color:#8B847C;margin-bottom:6px">${escapeHtml(r.category_name)}</div>` : ''}
                  ${r.tagline ? `<div style="font-family:Nunito,sans-serif;font-size:13.5px;color:#5C5852;line-height:1.5;margin-bottom:8px">${escapeHtml(r.tagline)}</div>` : ''}
                  <div style="font-family:Nunito,sans-serif;font-size:12px;font-weight:700;color:#E8553D">${priceLine}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
  }).join('')

  const html = buildEmailShell({
    preheader: `Your side-by-side comparison of ${ordered.map(r => r.company_name).join(', ')} — saved to your inbox.`,
    eyebrow: 'COMPARISON SAVED',
    title: headline,
    bodyHtml: `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding:0 48px 8px">
            <p style="margin:0 0 18px;font-family:Nunito,sans-serif;font-size:14.5px;line-height:1.65;color:#5C5852">
              Here's the comparison you saved. Tap any product to open its full profile, or jump back into the side-by-side view anytime — your selection stays in the URL so you can share it with teammates.
            </p>
            ${cardsHtml}
          </td>
        </tr>
      </table>
    `,
    ctaUrl: compareUrl,
    ctaText: 'Open comparison',
    ctaSecondaryUrl: `${SITE}/compare`,
    ctaSecondaryText: 'Compare more products',
    footerNote: 'Sent because you requested this comparison summary.',
  })

  const sent = await sendEmail({
    to: email,
    subject: `Your comparison: ${ordered.map(r => r.company_name).join(' vs ')}`,
    html,
    text: `${headline}\n\nOpen the comparison: ${compareUrl}`,
    replyTo: 'iww@brainstream.com.au',
  })

  // Record the capture against each listing's inbox stream (best-effort)
  // so owners can see which products are being compared and by whom.
  void Promise.allSettled(ordered.map(r =>
    execute(
      `INSERT INTO listing_inbox_emails (listing_id, email, ip_address) VALUES (?, ?, ?)`,
      [r.id, email, ip]
    ).catch(() => null)
  ))

  if (!sent) {
    return NextResponse.json({
      ok: false,
      error: 'Could not send the email right now. Please try again in a moment.',
    }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
