import { NextRequest } from 'next/server'
import { randomInt } from 'node:crypto'
import { hash, compare } from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { queryOne, execute } from '@/lib/db'
import { getUserFromRequest } from '@/lib/user-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/tracking'
import { sendEmail, buildEmailShell, escapeHtml, EMAIL_FONTS } from '@/lib/email'

/**
 * Listing claim endpoint — public-facing, one route, three modes.
 *
 *   POST /api/listings/[slug]/claim   body: { mode, ... }
 *
 *   mode='otp-send'   { email }          → send a 6-digit code to a business
 *                                          email on the listing's website domain.
 *   mode='otp-verify' { email, code }    → verify the code → INSTANT claim:
 *                                          assign ownership + verified=1.
 *   mode='manual'     { legalName, ... } → submit a pending claim for human
 *                                          review (fallback when no domain email).
 *
 * Auth: a logged-in business user. Only UNOWNED listings (user_id NULL/0) are
 * claimable; an owned listing returns 409.
 */

const OTP_TTL_MINUTES = 10
const MAX_ATTEMPTS = 5
const RESEND_COOLDOWN_SECONDS = 60
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type SessionUser = { id: number; email?: string | null; name?: string | null }

function domainOf(url: string): string {
  if (!url) return ''
  try {
    const u = new URL(/^https?:\/\//.test(url) ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, '').toLowerCase()
  } catch { return '' }
}
function emailDomainOf(email: string): string {
  const m = email.match(/@([^@\s]+)$/)
  return m ? m[1].toLowerCase() : ''
}
/** Match if the email domain equals the website domain, or is a subdomain of
 *  it (or vice-versa) — same rule the dashboard verify form uses. */
function domainMatches(email: string, website: string): boolean {
  const wd = domainOf(website)
  const ed = emailDomainOf(email)
  if (!wd || !ed) return false
  return ed === wd || ed.endsWith('.' + wd) || wd.endsWith('.' + ed)
}

interface ListingRow {
  id: number
  slug: string
  uuid: string
  user_id: number | null
  company_name: string
  website: string
  verified: number
  listing_mode: string
}

async function loadListing(slug: string): Promise<ListingRow | null> {
  return await queryOne<ListingRow>(
    `SELECT id, slug, uuid, user_id, company_name,
            COALESCE(website, '') AS website,
            COALESCE(verified, 0) AS verified,
            COALESCE(listing_mode, 'product') AS listing_mode
       FROM submissions
      WHERE slug = ? AND status IN ('active','paid')
      LIMIT 1`,
    [slug]
  )
}

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await ctx.params
    const user = (await getUserFromRequest(request)) as SessionUser | null
    if (!user) {
      return Response.json({ ok: false, error: 'Please sign in to claim this listing.' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({} as Record<string, unknown>))
    const mode = String((body as { mode?: unknown }).mode || '')

    const listing = await loadListing(slug)
    if (!listing) return Response.json({ ok: false, error: 'Listing not found.' }, { status: 404 })
    if (listing.user_id && Number(listing.user_id) > 0) {
      return Response.json({ ok: false, error: 'This listing has already been claimed.' }, { status: 409 })
    }

    if (mode === 'otp-send')   return otpSend(user, listing, body as Record<string, unknown>)
    if (mode === 'otp-verify') return otpVerify(user, listing, body as Record<string, unknown>)
    if (mode === 'manual')     return manualClaim(user, listing, body as Record<string, unknown>)
    return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  } catch (err) {
    console.error('POST /api/listings/[slug]/claim error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

/* ── Mode 1: send the domain-email OTP ─────────────────────────────────── */
async function otpSend(user: SessionUser, listing: ListingRow, body: Record<string, unknown>) {
  const ip = await getClientIp()
  if (!(await checkRateLimit(ip, 'claim-otp', 6, 600))) {
    return Response.json({ ok: false, error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 })
  }

  const email = String(body.email || '').trim().toLowerCase()
  if (!EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: 'Enter a valid business email.' }, { status: 400 })
  }
  if (!listing.website) {
    return Response.json(
      { ok: false, error: 'This listing has no website on file — use manual review instead.', code: 'NO_WEBSITE' },
      { status: 400 }
    )
  }
  if (!domainMatches(email, listing.website)) {
    return Response.json(
      { ok: false, error: `That email isn't on the ${domainOf(listing.website)} domain. Use a matching email, or switch to manual review.`, code: 'DOMAIN_MISMATCH' },
      { status: 400 }
    )
  }

  /* Resend cooldown — elapsed computed in MySQL to avoid clock drift. */
  const pending = await queryOne<{ s: number }>(
    `SELECT TIMESTAMPDIFF(SECOND, last_sent_at, NOW()) AS s
       FROM listing_claim_otps WHERE listing_id = ? AND user_id = ? LIMIT 1`,
    [listing.id, user.id]
  )
  if (pending) {
    const elapsed = Number(pending.s)
    if (elapsed < RESEND_COOLDOWN_SECONDS) {
      const wait = Math.ceil(RESEND_COOLDOWN_SECONDS - elapsed)
      return Response.json({ ok: false, error: `Please wait ${wait}s before requesting a new code.` }, { status: 429 })
    }
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
  const codeHash = await hash(code, 10)

  /* Dev convenience: surface the code in the server log when running locally so
     you can test the flow without SMTP configured. Never logs in production. */
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[claim][dev] OTP for ${email} on "${listing.company_name}" = ${code}`)
  }

  await execute(
    `INSERT INTO listing_claim_otps
       (listing_id, user_id, email, code_hash, expires_at, attempts, resends, last_sent_at)
     VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ${OTP_TTL_MINUTES} MINUTE), 0, 0, NOW())
     ON DUPLICATE KEY UPDATE
       email = VALUES(email), code_hash = VALUES(code_hash),
       expires_at = VALUES(expires_at), attempts = 0,
       resends = resends + 1, last_sent_at = NOW()`,
    [listing.id, user.id, email, codeHash]
  )

  await sendEmail({
    to: email,
    subject: `Your code to claim ${listing.company_name}: ${code}`,
    text: `Your InfoWebWorld claim code is ${code}. It expires in ${OTP_TTL_MINUTES} minutes. If you didn't request this, ignore this email.`,
    html: buildEmailShell({
      preheader: `Your claim code is ${code}`,
      eyebrow: 'Claim your listing',
      title: `Confirm you manage ${escapeHtml(listing.company_name)}`,
      bodyHtml: `
        <p style="margin:0 0 14px;padding:0 48px;font-family:${EMAIL_FONTS.F_BODY};font-size:15px;line-height:1.6;color:#5C5C5C;">
          Enter this code on InfoWebWorld to claim and verify
          <strong>${escapeHtml(listing.company_name)}</strong>. It expires in ${OTP_TTL_MINUTES} minutes.
        </p>
        <div style="text-align:center;margin:22px 0;">
          <span style="display:inline-block;background:#FAF5F0;border:1.5px solid #E8E3DE;border-radius:14px;padding:16px 26px;font-family:${EMAIL_FONTS.F_HEAD};font-size:32px;font-weight:800;letter-spacing:.26em;color:#1A1A1A;">${code}</span>
        </div>`,
      footerNote: 'If you did not request this, you can safely ignore this email.',
    }),
  })

  return Response.json({ ok: true, sentTo: email, expiresInMinutes: OTP_TTL_MINUTES })
}

/* ── Mode 2: verify the OTP → INSTANT claim ────────────────────────────── */
async function otpVerify(user: SessionUser, listing: ListingRow, body: Record<string, unknown>) {
  const email = String(body.email || '').trim().toLowerCase()
  const code = String(body.code || '').trim()
  if (!/^\d{6}$/.test(code)) {
    return Response.json({ ok: false, error: 'Enter the 6-digit code.' }, { status: 400 })
  }

  const row = await queryOne<{ id: number; email: string; code_hash: string; attempts: number; expired: number }>(
    `SELECT id, email, code_hash, attempts, (expires_at < NOW()) AS expired
       FROM listing_claim_otps WHERE listing_id = ? AND user_id = ? LIMIT 1`,
    [listing.id, user.id]
  )
  if (!row) return Response.json({ ok: false, error: 'No code found. Request a new one.' }, { status: 400 })
  if (Number(row.expired) === 1) return Response.json({ ok: false, error: 'That code expired. Request a new one.' }, { status: 400 })
  if (Number(row.attempts) >= MAX_ATTEMPTS) return Response.json({ ok: false, error: 'Too many attempts. Request a new code.' }, { status: 429 })
  if (row.email.toLowerCase() !== email) return Response.json({ ok: false, error: 'Email mismatch — start over.' }, { status: 400 })

  const match = await compare(code, row.code_hash)
  if (!match) {
    await execute(`UPDATE listing_claim_otps SET attempts = attempts + 1 WHERE id = ?`, [row.id]).catch(() => {})
    return Response.json({ ok: false, error: 'Incorrect code. Try again.' }, { status: 400 })
  }

  /* Audit row: an auto-approved claim. */
  const ins = await execute(
    `INSERT INTO listing_verification_requests
       (listing_id, user_id, status, request_type, legal_name, business_email, owner_role, applicant_notes, reviewed_at)
     VALUES (?, ?, 'approved', 'claim', ?, ?, ?, ?, NOW())`,
    [listing.id, user.id, listing.company_name, email, 'Self-claimed (domain email)', `Auto-approved: proved control of ${email}.`]
  )
  const reqId = ins.insertId || null

  /* Assign ownership + verify — guarded so two simultaneous claims can't both win. */
  const upd = await execute(
    `UPDATE submissions
        SET user_id = ?, verified = 1, verified_at = NOW(), verification_request_id = ?
      WHERE id = ? AND (user_id IS NULL OR user_id = 0)`,
    [user.id, reqId, listing.id]
  )
  if (upd.affectedRows !== 1) {
    if (reqId) await execute(`DELETE FROM listing_verification_requests WHERE id = ?`, [reqId]).catch(() => {})
    return Response.json({ ok: false, error: 'This listing was just claimed by someone else.' }, { status: 409 })
  }

  await execute(`DELETE FROM listing_claim_otps WHERE listing_id = ? AND user_id = ?`, [listing.id, user.id]).catch(() => {})

  /* Rebuild the public page so the Verified badge appears now, not in 48h. */
  const path = listing.listing_mode === 'company' ? `/profile/${listing.slug}` : `/listing/${listing.slug}`
  try { revalidatePath(path) } catch (e) { console.error('[claim] revalidate failed:', e) }

  /* Best-effort confirmation to the verified business email. Never blocks. */
  sendEmail({
    to: email,
    subject: `You've claimed ${listing.company_name} on InfoWebWorld`,
    text: `You're now the verified owner of ${listing.company_name}. Manage it from your dashboard: https://www.infowebworld.com/dashboard/listings`,
    html: buildEmailShell({
      preheader: `${listing.company_name} is now yours to manage`,
      eyebrow: 'Listing claimed',
      title: `${escapeHtml(listing.company_name)} is verified & yours`,
      bodyHtml: `<p style="margin:0;padding:0 48px;font-family:${EMAIL_FONTS.F_BODY};font-size:15px;line-height:1.6;color:#5C5C5C;">You're now the verified owner. Edit details, respond to reviews, and track engagement from your dashboard.</p>`,
      ctaUrl: 'https://www.infowebworld.com/dashboard/listings',
      ctaText: 'Go to your dashboard',
    }),
  }).catch(() => {})

  return Response.json({
    ok: true,
    claimed: true,
    slug: listing.slug,
    listingMode: listing.listing_mode,
    dashboardUrl: '/dashboard/listings',
  })
}

/* ── Mode 3: manual claim (no domain email) → pending admin review ──────── */
async function manualClaim(user: SessionUser, listing: ListingRow, body: Record<string, unknown>) {
  /* Block a second pending claim by the same user on the same listing. */
  const existing = await queryOne<{ id: number }>(
    `SELECT id FROM listing_verification_requests
      WHERE listing_id = ? AND user_id = ? AND request_type = 'claim' AND status = 'pending'
      LIMIT 1`,
    [listing.id, user.id]
  )
  if (existing) {
    return Response.json({ ok: false, error: 'You already have a claim pending review for this listing.' }, { status: 409 })
  }

  const trim = (v: unknown, max: number): string | null =>
    typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null

  const legalName          = trim(body.legalName, 255)
  const businessEmail      = trim(body.businessEmail, 255)
  const registrationNumber = trim(body.registrationNumber, 120)
  const ownerRole          = trim(body.ownerRole, 120)
  const applicantNotes     = trim(body.applicantNotes, 2000)

  let socialProofJson: string | null = null
  const sp = body.socialProof
  if (sp && typeof sp === 'object' && !Array.isArray(sp)) {
    const out: Record<string, string> = {}
    for (const k of ['linkedin', 'twitter', 'github', 'facebook', 'other']) {
      const raw = (sp as Record<string, unknown>)[k]
      if (typeof raw === 'string' && raw.trim()) out[k] = raw.trim().slice(0, 300)
    }
    if (Object.keys(out).length > 0) socialProofJson = JSON.stringify(out)
  }

  if (!legalName && !businessEmail && !registrationNumber && !applicantNotes && !socialProofJson) {
    return Response.json({ ok: false, error: 'Please add at least one piece of evidence.' }, { status: 400 })
  }
  if (businessEmail && !EMAIL_RE.test(businessEmail)) {
    return Response.json({ ok: false, error: 'Business email looks invalid.' }, { status: 400 })
  }

  const ins = await execute(
    `INSERT INTO listing_verification_requests
       (listing_id, user_id, status, request_type, legal_name, business_email,
        registration_number, owner_role, social_proof, applicant_notes)
     VALUES (?, ?, 'pending', 'claim', ?, ?, ?, ?, ?, ?)`,
    [listing.id, user.id, legalName, businessEmail, registrationNumber, ownerRole, socialProofJson, applicantNotes]
  )

  return Response.json({ ok: true, pending: true, requestId: ins.insertId })
}
