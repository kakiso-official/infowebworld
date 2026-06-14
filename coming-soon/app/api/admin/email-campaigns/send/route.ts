import { NextRequest } from 'next/server'
import { query, queryOne, execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { sendEmail, escapeHtml } from '@/lib/email'
import { applyCompanyTokens, type CompanyEmailData } from '@/lib/company-email'

/**
 * POST /api/admin/email-campaigns/send
 *
 *   Test:   { subject, bodyHtml, testEmail }            → sends one [TEST] email
 *   Bulk:   { subject, bodyHtml, audience }             → sends to the audience,
 *                                                         logs an email_campaigns row
 *
 * Per-recipient personalization: {{name}} and {{email}} are substituted.
 * Sent via the shared SMTP transport (lib/email). Capped at 500/send (Gmail's
 * daily ceiling) and sent in small concurrent batches to fit the time budget.
 */
export const maxDuration = 60

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_RECIPIENTS = 500
const BATCH = 5

type Recipient = { email: string; name: string | null }

function personalize(html: string, name: string, email: string): string {
  return html
    .replace(/\{\{\s*name\s*\}\}/gi, escapeHtml(name))
    .replace(/\{\{\s*email\s*\}\}/gi, escapeHtml(email))
}

/** Subject / plain-text variant — same substitution, no HTML escaping. */
function personalizeText(text: string, name: string, email: string): string {
  return text
    .replace(/\{\{\s*name\s*\}\}/gi, name)
    .replace(/\{\{\s*email\s*\}\}/gi, email)
}

/** Resolve {{name}}: the stored name → a readable name derived from the email
 *  (john.doe@x.com → "John Doe") → "there". Matches the admin Users list so a
 *  recipient never sees a raw "{{name}}" or a blank greeting. */
function deriveName(rawName: string | null, email: string): string {
  if (rawName && rawName.trim()) return rawName.trim()
  const words = (email || '').split('@')[0]
    .replace(/[._\-+]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(w => w && !/^\d+$/.test(w))
    .map(w => w.replace(/\d+$/, ''))
    .filter(Boolean)
  if (!words.length) return 'there'
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

/** Naive HTML→text fallback for the plain-text part. */
function toText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000)
}

async function resolveRecipients(audience: string): Promise<Recipient[]> {
  if (audience === 'all_users') {
    return await query<Recipient>(
      `SELECT email, name FROM business_users WHERE email IS NOT NULL AND email <> ''`
    )
  }
  if (audience === 'verified_users') {
    return await query<Recipient>(
      `SELECT email, name FROM business_users
        WHERE email IS NOT NULL AND email <> '' AND COALESCE(email_verified, 0) = 1`
    )
  }
  if (audience === 'waitlist') {
    return await query<Recipient>(
      `SELECT email, NULL AS name FROM waitlist WHERE email IS NOT NULL AND email <> ''`
    )
  }
  return []
}

type CompanyRow = CompanyEmailData & { id: number; email: string | null }

async function loadCompany(id: number): Promise<CompanyRow | null> {
  if (!id) return null
  return await queryOne<CompanyRow>(
    `SELECT id, slug, company_name, email, tagline
       FROM submissions WHERE id = ? AND listing_mode = 'company' LIMIT 1`,
    [id]
  )
}

/** Subject token substitution for the company audience (raw, not HTML-escaped). */
function personalizeCompanySubject(subject: string, c: CompanyEmailData): string {
  return subject
    .replace(/\{\{\s*company_name\s*\}\}/gi, c.company_name)
    .replace(/\{\{\s*name\s*\}\}/gi, c.company_name)
    .replace(/\{\{\s*tagline\s*\}\}/gi, c.tagline || '')
}

/** Company outreach: per-company personalized send to the selected company
    listings' emails. Each email gets that company's /profile screenshot + links
    injected via applyCompanyTokens. Logs an email_campaigns row. */
async function sendCompanyCampaign(
  companyIds: unknown, subject: string, bodyHtml: string, adminId: number | null
): Promise<Response> {
  const ids = Array.isArray(companyIds) ? companyIds.map((x) => Number(x)).filter(Boolean) : []
  if (!ids.length) return Response.json({ ok: false, error: 'Select at least one company.' }, { status: 400 })

  const companies = await query<CompanyRow>(
    `SELECT id, slug, company_name, email, tagline
       FROM submissions
      WHERE listing_mode = 'company' AND email IS NOT NULL AND email <> ''
        AND id IN (${ids.map(() => '?').join(', ')})`,
    ids
  )
  const seen = new Set<string>()
  const unique = companies.filter((c) => {
    const e = (c.email || '').toLowerCase()
    if (!e || seen.has(e)) return false
    seen.add(e); return true
  })
  if (!unique.length) return Response.json({ ok: false, error: 'None of the selected companies have a contact email.' }, { status: 400 })

  const recipients = unique.slice(0, MAX_RECIPIENTS)
  let sent = 0, failed = 0
  for (let i = 0; i < recipients.length; i += BATCH) {
    const chunk = recipients.slice(i, i + BATCH)
    const results = await Promise.all(chunk.map((c) => {
      const html = applyCompanyTokens(bodyHtml, c)
      return sendEmail({ to: String(c.email), subject: personalizeCompanySubject(subject, c), html, text: toText(html) })
    }))
    for (const ok of results) ok ? sent++ : failed++
  }

  const status = failed === 0 ? 'sent' : (sent === 0 ? 'failed' : 'partial')
  await execute(
    `INSERT INTO email_campaigns
       (subject, body_html, audience, recipient_count, sent_count, failed_count, status, sent_by_admin_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [subject, bodyHtml, 'companies', recipients.length, sent, failed, status, adminId]
  )
  return Response.json({
    ok: true, recipientCount: recipients.length, sentCount: sent, failedCount: failed,
    truncated: unique.length > MAX_RECIPIENTS, totalAudience: unique.length,
  })
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  const admin = guard

  try {
    const b = await request.json().catch(() => ({} as Record<string, unknown>))
    const subject = String(b.subject || '').trim().slice(0, 255)
    const bodyHtml = String(b.bodyHtml || '')
    if (!subject || !bodyHtml) {
      return Response.json({ ok: false, error: 'Subject and body are required.' }, { status: 400 })
    }

    /* ── Test send — single email to the admin, no campaign logged. ── */
    const testEmail = String(b.testEmail || '').trim().toLowerCase()
    if (testEmail) {
      if (!EMAIL_RE.test(testEmail)) {
        return Response.json({ ok: false, error: 'Enter a valid test email.' }, { status: 400 })
      }
      /* Optional company context: when previewing the company-outreach email,
         the admin passes a companyId so the [TEST] is personalized with a real
         company (its profile screenshot, name and links). */
      const testCompany = await loadCompany(Number(b.companyId || 0))
      let testHtml: string
      let testSubjectCore: string
      if (testCompany) {
        testHtml = applyCompanyTokens(bodyHtml, testCompany)
        testSubjectCore = personalizeCompanySubject(subject, testCompany)
      } else {
        const testName = deriveName(null, testEmail)
        testHtml = personalize(bodyHtml, testName, testEmail)
        testSubjectCore = personalizeText(subject, testName, testEmail)
      }
      const ok = await sendEmail({
        to: testEmail,
        subject: `[TEST] ${testSubjectCore}`,
        html: testHtml,
        text: toText(testHtml),
      })
      return ok
        ? Response.json({ ok: true, test: true, sentTo: testEmail })
        : Response.json({ ok: false, error: 'Send failed — check SMTP config (SMTP_USER / SMTP_PASS).' }, { status: 502 })
    }

    /* ── Bulk send to an audience. ── */
    const audience = String(b.audience || '')

    /* Company outreach has its own recipient resolution + per-company
       personalization (profile screenshot, name, links). */
    if (audience === 'companies') {
      return await sendCompanyCampaign(b.companyIds, subject, bodyHtml, admin.adminId)
    }

    if (!['all_users', 'verified_users', 'waitlist'].includes(audience)) {
      return Response.json({ ok: false, error: 'Pick a valid audience.' }, { status: 400 })
    }

    const all = await resolveRecipients(audience)
    /* De-dupe emails (a user could be on the waitlist too). */
    const seen = new Set<string>()
    const unique = all.filter(r => {
      const e = (r.email || '').toLowerCase()
      if (!e || seen.has(e)) return false
      seen.add(e); return true
    })
    if (unique.length === 0) {
      return Response.json({ ok: false, error: 'No recipients for that audience.' }, { status: 400 })
    }

    const recipients = unique.slice(0, MAX_RECIPIENTS)
    let sent = 0, failed = 0
    for (let i = 0; i < recipients.length; i += BATCH) {
      const chunk = recipients.slice(i, i + BATCH)
      const results = await Promise.all(chunk.map(r => {
        const name = deriveName(r.name, r.email)
        const html = personalize(bodyHtml, name, r.email)
        return sendEmail({
          to: r.email,
          subject: personalizeText(subject, name, r.email),
          html,
          text: toText(html),
        })
      }))
      for (const ok of results) ok ? sent++ : failed++
    }

    const status = failed === 0 ? 'sent' : (sent === 0 ? 'failed' : 'partial')
    await execute(
      `INSERT INTO email_campaigns
         (subject, body_html, audience, recipient_count, sent_count, failed_count, status, sent_by_admin_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [subject, bodyHtml, audience, recipients.length, sent, failed, status, admin.adminId]
    )

    return Response.json({
      ok: true,
      recipientCount: recipients.length,
      sentCount: sent,
      failedCount: failed,
      truncated: unique.length > MAX_RECIPIENTS,
      totalAudience: unique.length,
    })
  } catch (err) {
    console.error('POST /api/admin/email-campaigns/send error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
