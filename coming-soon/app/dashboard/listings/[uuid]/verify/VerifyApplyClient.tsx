'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { InitialVerifyState } from './page'

/**
 * Client UI for /dashboard/listings/[uuid]/verify.
 *
 * State machine driven by `initial`:
 *   verified=true            → "Verified ✓" card, no form, link back to listing
 *   latest.status=pending    → "Under review" card showing what was submitted
 *   latest.status=rejected   → "Action needed" card with admin notes + form
 *                              prefilled with the previous values for quick fix
 *   latest=null              → fresh "Apply for verification" form
 *
 * Submission optimistically transitions to the pending view on success so the
 * user sees their request reflected immediately without a page round-trip.
 */

type FormValues = {
  legalName: string
  businessEmail: string
  businessPhone: string
  registrationNumber: string
  ownerRole: string
  documentUrl: string
  linkedin: string
  twitter: string
  github: string
  otherSocial: string
  applicantNotes: string
}

function emptyForm(): FormValues {
  return {
    legalName: '', businessEmail: '', businessPhone: '',
    registrationNumber: '', ownerRole: '', documentUrl: '',
    linkedin: '', twitter: '', github: '', otherSocial: '',
    applicantNotes: '',
  }
}

function fromLatest(latest: InitialVerifyState['latest']): FormValues {
  if (!latest) return emptyForm()
  const sp = latest.socialProof || {}
  return {
    legalName: latest.legalName, businessEmail: latest.businessEmail,
    businessPhone: latest.businessPhone, registrationNumber: latest.registrationNumber,
    ownerRole: latest.ownerRole, documentUrl: latest.documentUrl,
    linkedin: sp.linkedin || '', twitter: sp.twitter || '',
    github: sp.github || '', otherSocial: sp.other || '',
    applicantNotes: latest.applicantNotes,
  }
}

function fmtDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function domainOf(url: string): string {
  if (!url) return ''
  try {
    const u = new URL(/^https?:\/\//.test(url) ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, '')
  } catch { return '' }
}

const ShieldCheck = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2 4 5.5v5c0 5.2 3.4 9.6 8 10.5 4.6-.9 8-5.3 8-10.5v-5L12 2Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export default function VerifyApplyClient({ initial }: { initial: InitialVerifyState }) {
  const { listing } = initial
  const [latest, setLatest] = useState(initial.latest)
  const [form, setForm] = useState<FormValues>(() => fromLatest(initial.latest))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(
    !listing.verified && (!latest || latest.status === 'rejected')
  )

  const websiteDomain = useMemo(() => domainOf(listing.website), [listing.website])
  const businessEmailDomain = useMemo(() => {
    const m = form.businessEmail.match(/@([^@\s]+)$/)
    return m ? m[1].toLowerCase() : ''
  }, [form.businessEmail])
  const domainMatches =
    websiteDomain && businessEmailDomain &&
    (businessEmailDomain === websiteDomain || businessEmailDomain.endsWith('.' + websiteDomain))

  const set = <K extends keyof FormValues>(k: K, v: FormValues[K]) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setError(''); setSubmitting(true)
    try {
      const social: Record<string, string> = {}
      if (form.linkedin.trim())    social.linkedin    = form.linkedin.trim()
      if (form.twitter.trim())     social.twitter     = form.twitter.trim()
      if (form.github.trim())      social.github      = form.github.trim()
      if (form.otherSocial.trim()) social.other       = form.otherSocial.trim()

      const res = await fetch(`/api/dashboard/listings/${listing.uuid}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          legalName: form.legalName.trim() || null,
          businessEmail: form.businessEmail.trim() || null,
          businessPhone: form.businessPhone.trim() || null,
          registrationNumber: form.registrationNumber.trim() || null,
          ownerRole: form.ownerRole.trim() || null,
          documentUrl: form.documentUrl.trim() || null,
          socialProof: social,
          applicantNotes: form.applicantNotes.trim() || null,
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || !j?.ok) {
        setError(j?.error || 'Could not submit your application.')
        return
      }
      /* Server returns the freshly inserted request; transition to pending UI. */
      setLatest({
        id: j.request.id,
        status: j.request.status,
        legalName: j.request.legalName,
        businessEmail: j.request.businessEmail,
        businessPhone: j.request.businessPhone,
        registrationNumber: j.request.registrationNumber,
        ownerRole: j.request.ownerRole,
        documentUrl: j.request.documentUrl,
        socialProof: j.request.socialProof,
        applicantNotes: j.request.applicantNotes,
        adminNotes: j.request.adminNotes,
        reviewedAt: j.request.reviewedAt,
        createdAt: j.request.createdAt,
      })
      setShowForm(false)
    } catch {
      setError('Network error.')
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Verified state — final, no form, just celebrate. ───────────────── */
  if (listing.verified) {
    return (
      <div className="dash-verify-shell">
        <header className="dash-verify-card dash-verify-card--ok">
          <div className="dash-verify-card-icon dash-verify-card-icon--ok">
            <ShieldCheck />
          </div>
          <div>
            <h2 className="dash-verify-card-title">{listing.companyName} is Verified</h2>
            <p className="dash-verify-card-sub">
              Your business has been authenticated by our team.
              The Verified badge is live on your public listing.
              {listing.verifiedAt ? ` Approved ${fmtDate(listing.verifiedAt)}.` : ''}
            </p>
            <div className="dash-verify-card-actions">
              <Link href={listing.listingMode === 'company' ? `/profile/${listing.slug}` : `/company/${listing.slug}`} className="dash-verify-btn dash-verify-btn--primary">
                See it on your listing →
              </Link>
              <Link href="/dashboard/listings" className="dash-verify-btn dash-verify-btn--ghost">
                Back to listings
              </Link>
            </div>
          </div>
        </header>
        <p className="dash-verify-foot-note">
          The verified badge stays on as long as your business information remains accurate.
          We may ask you to re-verify in the future or contact support if anything looks off.
        </p>
      </div>
    )
  }

  /* ── Pending state — under review. Form hidden. ────────────────────── */
  if (latest && latest.status === 'pending' && !showForm) {
    return (
      <div className="dash-verify-shell">
        <header className="dash-verify-card dash-verify-card--pending">
          <div className="dash-verify-card-icon dash-verify-card-icon--pending">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </div>
          <div>
            <h2 className="dash-verify-card-title">Verification under review</h2>
            <p className="dash-verify-card-sub">
              Submitted {latest.createdAt ? fmtDate(latest.createdAt) : 'recently'}.
              We typically respond within 1–3 business days.
              You'll get an email the moment a decision is made.
            </p>
          </div>
        </header>

        <SubmittedSummary latest={latest} listing={listing} />

        <p className="dash-verify-foot-note">
          Need to send updated information?{' '}
          <a href="mailto:hello@infowebworld.com">Email us</a>{' '}
          and reference {listing.companyName}.
        </p>
      </div>
    )
  }

  /* ── Rejected — show reason + the form prefilled with last values. ── */
  /* ── None — show the apply form. ──────────────────────────────────── */
  return (
    <div className="dash-verify-shell">
      <header className="dash-verify-intro">
        <h2 className="dash-verify-intro-title">
          Get the <span className="dash-verify-intro-accent">Verified by InfoWebWorld</span> badge
        </h2>
        <p className="dash-verify-intro-body">
          A short application that proves you own or represent {listing.companyName}.
          Once approved, a prominent verified badge appears on your public listing —
          a strong trust signal for visitors comparing options.
        </p>
        <ul className="dash-verify-intro-bullets">
          <li>A business email matching your website domain is the strongest single signal.</li>
          <li>Company registration number, owner role, and a public LinkedIn round it out.</li>
          <li>Reviewed by humans within 1–3 business days. You'll be emailed the decision.</li>
        </ul>
      </header>

      {latest && latest.status === 'rejected' && (
        <div className="dash-verify-card dash-verify-card--reject">
          <div className="dash-verify-card-icon dash-verify-card-icon--reject">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </div>
          <div>
            <h3 className="dash-verify-card-title">Previous request needs more info</h3>
            {latest.adminNotes ? (
              <>
                <p className="dash-verify-card-sub">
                  Note from our review team{latest.reviewedAt ? ` (${fmtDate(latest.reviewedAt)})` : ''}:
                </p>
                <blockquote className="dash-verify-admin-note">{latest.adminNotes}</blockquote>
              </>
            ) : (
              <p className="dash-verify-card-sub">
                Your previous application couldn't be confirmed. Please update the
                details below and re-submit.
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="dash-verify-form">

        {/* ─── Group 1: identity ─── */}
        <fieldset className="dash-verify-fieldset">
          <legend className="dash-verify-legend">Business identity</legend>
          <p className="dash-verify-help">Required for the manual review. The more you share, the faster we can confirm.</p>

          <label className="dash-verify-row">
            <span className="dash-verify-lbl">Legal company name</span>
            <input
              type="text" value={form.legalName} maxLength={255}
              onChange={e => set('legalName', e.target.value)}
              placeholder={listing.companyName}
              className="dash-verify-input"
            />
          </label>

          <label className="dash-verify-row">
            <span className="dash-verify-lbl">
              Business email
              {websiteDomain && (
                <span className="dash-verify-lbl-hint"> (use one matching <code>{websiteDomain}</code>)</span>
              )}
            </span>
            <input
              type="email" value={form.businessEmail} maxLength={255}
              onChange={e => set('businessEmail', e.target.value)}
              placeholder={websiteDomain ? `you@${websiteDomain}` : 'you@yourcompany.com'}
              className={
                'dash-verify-input ' +
                (form.businessEmail
                  ? (domainMatches ? 'dash-verify-input--ok' : (websiteDomain ? 'dash-verify-input--warn' : ''))
                  : '')
              }
            />
            {form.businessEmail && websiteDomain && !domainMatches && (
              <span className="dash-verify-row-warn">
                This email doesn't match your website domain ({websiteDomain}).
                A matching email is the strongest single signal of ownership —
                using a generic email may slow down or block approval.
              </span>
            )}
          </label>

          <div className="dash-verify-grid">
            <label className="dash-verify-row">
              <span className="dash-verify-lbl">Business phone</span>
              <input
                type="tel" value={form.businessPhone} maxLength={40}
                onChange={e => set('businessPhone', e.target.value)}
                placeholder="+1 555 123 4567"
                className="dash-verify-input"
              />
            </label>
            <label className="dash-verify-row">
              <span className="dash-verify-lbl">Your role</span>
              <input
                type="text" value={form.ownerRole} maxLength={120}
                onChange={e => set('ownerRole', e.target.value)}
                placeholder="Founder, CEO, Marketing Lead…"
                className="dash-verify-input"
              />
            </label>
          </div>

          <label className="dash-verify-row">
            <span className="dash-verify-lbl">Company registration number <span className="dash-verify-lbl-hint">(EIN / VAT / company number)</span></span>
            <input
              type="text" value={form.registrationNumber} maxLength={120}
              onChange={e => set('registrationNumber', e.target.value)}
              placeholder="e.g. 12-3456789"
              className="dash-verify-input"
            />
          </label>
        </fieldset>

        {/* ─── Group 2: proof links ─── */}
        <fieldset className="dash-verify-fieldset">
          <legend className="dash-verify-legend">Proof of ownership</legend>
          <p className="dash-verify-help">
            Public profiles and documents that connect you to the company.
            All optional but at least one strong signal speeds up review.
          </p>

          <div className="dash-verify-grid">
            <label className="dash-verify-row">
              <span className="dash-verify-lbl">LinkedIn profile</span>
              <input
                type="url" value={form.linkedin} maxLength={300}
                onChange={e => set('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/…"
                className="dash-verify-input"
              />
            </label>
            <label className="dash-verify-row">
              <span className="dash-verify-lbl">Twitter / X profile</span>
              <input
                type="url" value={form.twitter} maxLength={300}
                onChange={e => set('twitter', e.target.value)}
                placeholder="https://twitter.com/…"
                className="dash-verify-input"
              />
            </label>
            <label className="dash-verify-row">
              <span className="dash-verify-lbl">GitHub (if relevant)</span>
              <input
                type="url" value={form.github} maxLength={300}
                onChange={e => set('github', e.target.value)}
                placeholder="https://github.com/…"
                className="dash-verify-input"
              />
            </label>
            <label className="dash-verify-row">
              <span className="dash-verify-lbl">Other public profile</span>
              <input
                type="url" value={form.otherSocial} maxLength={300}
                onChange={e => set('otherSocial', e.target.value)}
                placeholder="Crunchbase, About page, etc."
                className="dash-verify-input"
              />
            </label>
          </div>

          <label className="dash-verify-row">
            <span className="dash-verify-lbl">Supporting document URL <span className="dash-verify-lbl-hint">(optional — registration cert, business card scan, etc.)</span></span>
            <input
              type="url" value={form.documentUrl} maxLength={500}
              onChange={e => set('documentUrl', e.target.value)}
              placeholder="https://drive.google.com/… (or any public link)"
              className="dash-verify-input"
            />
          </label>
        </fieldset>

        {/* ─── Group 3: applicant notes ─── */}
        <fieldset className="dash-verify-fieldset">
          <legend className="dash-verify-legend">Anything else we should know?</legend>
          <textarea
            value={form.applicantNotes} maxLength={2000}
            onChange={e => set('applicantNotes', e.target.value)}
            placeholder="Briefly explain your relationship to the business and anything that might help us confirm ownership."
            rows={5}
            className="dash-verify-textarea"
          />
        </fieldset>

        {error && <div className="dash-verify-error" role="alert">{error}</div>}

        <div className="dash-verify-submit-row">
          <Link href="/dashboard/listings" className="dash-verify-btn dash-verify-btn--ghost">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="dash-verify-btn dash-verify-btn--primary"
          >
            {submitting
              ? 'Submitting…'
              : (latest?.status === 'rejected' ? 'Re-apply for verification' : 'Apply for verification')}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────── */
/* Helper: read-only render of what the applicant submitted, used in the
   pending state so they can sanity-check what's under review.            */
function SubmittedSummary({ latest, listing }: {
  latest: NonNullable<InitialVerifyState['latest']>
  listing: InitialVerifyState['listing']
}) {
  const sp = latest.socialProof || {}
  const Row = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => {
    if (!value) return null
    return (
      <div className="dash-verify-sum-row">
        <div className="dash-verify-sum-lbl">{label}</div>
        <div className={'dash-verify-sum-val' + (mono ? ' dash-verify-sum-val--mono' : '')}>{value}</div>
      </div>
    )
  }
  const Link2 = ({ label, value }: { label: string; value: string }) => {
    if (!value) return null
    return (
      <div className="dash-verify-sum-row">
        <div className="dash-verify-sum-lbl">{label}</div>
        <div className="dash-verify-sum-val">
          <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
        </div>
      </div>
    )
  }
  return (
    <section className="dash-verify-summary">
      <h3 className="dash-verify-summary-head">What you submitted for {listing.companyName}</h3>
      <Row label="Legal name"           value={latest.legalName} />
      <Row label="Business email"       value={latest.businessEmail} mono />
      <Row label="Business phone"       value={latest.businessPhone} mono />
      <Row label="Your role"            value={latest.ownerRole} />
      <Row label="Registration number"  value={latest.registrationNumber} mono />
      <Link2 label="LinkedIn" value={sp.linkedin || ''} />
      <Link2 label="Twitter / X" value={sp.twitter || ''} />
      <Link2 label="GitHub"   value={sp.github || ''} />
      <Link2 label="Other"    value={sp.other || ''} />
      <Link2 label="Document" value={latest.documentUrl} />
      {latest.applicantNotes && (
        <div className="dash-verify-sum-row">
          <div className="dash-verify-sum-lbl">Notes</div>
          <div className="dash-verify-sum-val dash-verify-sum-val--pre">{latest.applicantNotes}</div>
        </div>
      )}
    </section>
  )
}
