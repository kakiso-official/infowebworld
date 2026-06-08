'use client'

import { useEffect, useState, useCallback } from 'react'
import '../styles/claim-modal.css'

/**
 * Claim-your-listing modal. Opened from the "Claim this listing" CTA that
 * replaces the Unverified pill on unowned listings.
 *
 * Flow:
 *   not signed in            → "Sign in to claim" → onRequireAuth()
 *   signed in + has website  → email (domain-matched OTP) → code → done
 *   signed in + no website   → manual evidence form → pending review
 *   any email step           → "Use manual review instead" escape hatch
 */

interface Props {
  open: boolean
  onClose: () => void
  listingSlug: string
  companyName: string
  website: string
  isAuthed: boolean
  onRequireAuth: () => void
}

type Step = 'auth' | 'email' | 'code' | 'manual' | 'done-otp' | 'done-manual'

function websiteDomain(url: string): string {
  if (!url) return ''
  try {
    const u = new URL(/^https?:\/\//.test(url) ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, '').toLowerCase()
  } catch { return '' }
}

const CheckCircle = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m22 4-10 10.01-3-3" />
  </svg>
)
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>
)

export default function ClaimListingModal({
  open, onClose, listingSlug, companyName, website, isAuthed, onRequireAuth,
}: Props) {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sentTo, setSentTo] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [m, setM] = useState({
    legalName: '', businessEmail: '', registrationNumber: '', ownerRole: '', linkedin: '', applicantNotes: '',
  })

  const domain = websiteDomain(website)

  /* Pick the entry step each time the modal opens. */
  useEffect(() => {
    if (!open) return
    setErr(''); setCode('')
    if (!isAuthed) setStep('auth')
    else if (!domain) setStep('manual')
    else setStep('email')
  }, [open, isAuthed, domain])

  /* Esc closes. */
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  const post = useCallback(async (payload: Record<string, unknown>) => {
    const res = await fetch(`/api/listings/${encodeURIComponent(listingSlug)}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    })
    const j = await res.json().catch(() => ({} as Record<string, unknown>))
    return { ok: res.ok && Boolean((j as { ok?: boolean }).ok), j: j as Record<string, unknown> }
  }, [listingSlug])

  if (!open) return null

  const sendCode = async () => {
    if (busy) return
    setErr(''); setBusy(true)
    try {
      const { ok, j } = await post({ mode: 'otp-send', email: email.trim() })
      if (!ok) { setErr(String(j.error || 'Could not send the code.')); return }
      setSentTo(String(j.sentTo || email.trim())); setCode(''); setStep('code')
    } catch { setErr('Network error. Please try again.') } finally { setBusy(false) }
  }

  const verifyCode = async () => {
    if (busy) return
    setErr(''); setBusy(true)
    try {
      const { ok, j } = await post({ mode: 'otp-verify', email: sentTo, code: code.trim() })
      if (!ok) { setErr(String(j.error || 'Could not verify the code.')); return }
      setStep('done-otp')
    } catch { setErr('Network error. Please try again.') } finally { setBusy(false) }
  }

  const submitManual = async () => {
    if (busy) return
    setErr(''); setBusy(true)
    try {
      const social: Record<string, string> = {}
      if (m.linkedin.trim()) social.linkedin = m.linkedin.trim()
      const { ok, j } = await post({
        mode: 'manual',
        legalName: m.legalName, businessEmail: m.businessEmail,
        registrationNumber: m.registrationNumber, ownerRole: m.ownerRole,
        applicantNotes: m.applicantNotes, socialProof: social,
      })
      if (!ok) { setErr(String(j.error || 'Could not submit your claim.')); return }
      setStep('done-manual')
    } catch { setErr('Network error. Please try again.') } finally { setBusy(false) }
  }

  const setMf = (k: keyof typeof m, v: string) => setM(prev => ({ ...prev, [k]: v }))

  return (
    <div className="claim-ov" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="claim-modal" role="dialog" aria-modal="true" aria-label={`Claim ${companyName}`}>
        <button className="claim-x" onClick={onClose} aria-label="Close">×</button>

        {/* ── Not signed in ── */}
        {step === 'auth' && (
          <>
            <p className="claim-eyebrow">Claim your listing</p>
            <h2 className="claim-title">Sign in to claim {companyName}</h2>
            <p className="claim-text">
              Claiming proves you represent <strong>{companyName}</strong> so you can manage its
              details, respond to reviews, and get the Verified badge. Sign in or create a free
              account to continue.
            </p>
            <button className="claim-btn claim-btn--primary" onClick={() => { onRequireAuth() }}>
              Sign in / Create account
            </button>
            <button className="claim-btn claim-btn--ghost" onClick={onClose}>Maybe later</button>
          </>
        )}

        {/* ── Domain-email OTP: enter email ── */}
        {step === 'email' && (
          <>
            <p className="claim-eyebrow">Claim your listing</p>
            <h2 className="claim-title">Verify you manage {companyName}</h2>
            <p className="claim-text">
              Enter a work email on your company domain{domain ? <> (<code>@{domain}</code>)</> : null}.
              We'll send a 6-digit code to confirm — claim is <strong>instant</strong> and you get the
              Verified badge right away.
            </p>
            {err && <div className="claim-err" role="alert">{err}</div>}
            <label className="claim-field">
              <span className="claim-lbl">Business email {domain && <>on <code>{domain}</code></>}</span>
              <input
                className="claim-input" type="email" inputMode="email" autoFocus
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder={domain ? `you@${domain}` : 'you@yourcompany.com'}
                onKeyDown={e => { if (e.key === 'Enter') sendCode() }}
              />
            </label>
            <button className="claim-btn claim-btn--primary" disabled={busy || !email.trim()} onClick={sendCode}>
              {busy ? 'Sending…' : 'Send verification code'}
            </button>
            <button className="claim-link" onClick={() => { setErr(''); setStep('manual') }}>
              No email on that domain? Request manual review
            </button>
          </>
        )}

        {/* ── Domain-email OTP: enter code ── */}
        {step === 'code' && (
          <>
            <p className="claim-eyebrow">Claim your listing</p>
            <h2 className="claim-title">Enter your code</h2>
            <p className="claim-sent">Sent to <strong>{sentTo}</strong>. It expires in 10 minutes.</p>
            {err && <div className="claim-err" role="alert">{err}</div>}
            <label className="claim-field">
              <span className="claim-lbl">6-digit code</span>
              <input
                className="claim-input claim-input--code" type="text" inputMode="numeric" autoFocus
                maxLength={6} value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                onKeyDown={e => { if (e.key === 'Enter' && code.length === 6) verifyCode() }}
              />
            </label>
            <button className="claim-btn claim-btn--primary" disabled={busy || code.length !== 6} onClick={verifyCode}>
              {busy ? 'Verifying…' : 'Verify & claim'}
            </button>
            <button className="claim-link" onClick={() => { setErr(''); setStep('email') }}>
              Use a different email
            </button>
          </>
        )}

        {/* ── Manual review form ── */}
        {step === 'manual' && (
          <>
            <p className="claim-eyebrow">Claim your listing</p>
            <h2 className="claim-title">Request a manual review</h2>
            <p className="claim-text">
              Can't use a company-domain email? Share a little proof and our team will review your
              claim to <strong>{companyName}</strong> within 1–3 business days.
            </p>
            {err && <div className="claim-err" role="alert">{err}</div>}
            <label className="claim-field">
              <span className="claim-lbl">Legal company name</span>
              <input className="claim-input" value={m.legalName} maxLength={255}
                onChange={e => setMf('legalName', e.target.value)} placeholder={companyName} />
            </label>
            <div className="claim-row2">
              <label className="claim-field">
                <span className="claim-lbl">Business email</span>
                <input className="claim-input" type="email" value={m.businessEmail} maxLength={255}
                  onChange={e => setMf('businessEmail', e.target.value)} placeholder="you@company.com" />
              </label>
              <label className="claim-field">
                <span className="claim-lbl">Your role</span>
                <input className="claim-input" value={m.ownerRole} maxLength={120}
                  onChange={e => setMf('ownerRole', e.target.value)} placeholder="Founder, CEO…" />
              </label>
            </div>
            <div className="claim-row2">
              <label className="claim-field">
                <span className="claim-lbl">Registration no.</span>
                <input className="claim-input" value={m.registrationNumber} maxLength={120}
                  onChange={e => setMf('registrationNumber', e.target.value)} placeholder="EIN / VAT / company no." />
              </label>
              <label className="claim-field">
                <span className="claim-lbl">LinkedIn</span>
                <input className="claim-input" type="url" value={m.linkedin} maxLength={300}
                  onChange={e => setMf('linkedin', e.target.value)} placeholder="linkedin.com/in/…" />
              </label>
            </div>
            <label className="claim-field">
              <span className="claim-lbl">Anything else?</span>
              <textarea className="claim-input claim-textarea" value={m.applicantNotes} maxLength={2000}
                onChange={e => setMf('applicantNotes', e.target.value)}
                placeholder="Briefly explain your relationship to the business." />
            </label>
            <button className="claim-btn claim-btn--primary" disabled={busy} onClick={submitManual}>
              {busy ? 'Submitting…' : 'Submit claim for review'}
            </button>
            {domain && (
              <button className="claim-link" onClick={() => { setErr(''); setStep('email') }}>
                ← Back to instant {domain} email verification
              </button>
            )}
          </>
        )}

        {/* ── Success: instant claim ── */}
        {step === 'done-otp' && (
          <div className="claim-done">
            <div className="claim-done-badge"><CheckCircle /></div>
            <h2 className="claim-done-title">{companyName} is yours 🎉</h2>
            <p className="claim-done-text">
              You're now the <strong>verified owner</strong>. Manage details, respond to reviews,
              and track engagement from your dashboard.
            </p>
            <a className="claim-btn claim-btn--primary" href="/dashboard/listings" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
              Go to your dashboard
            </a>
            <button className="claim-btn claim-btn--ghost" onClick={() => window.location.reload()}>
              View the verified badge on this page
            </button>
          </div>
        )}

        {/* ── Success: manual claim submitted ── */}
        {step === 'done-manual' && (
          <div className="claim-done">
            <div className="claim-done-badge claim-done-badge--pending"><ClockIcon /></div>
            <h2 className="claim-done-title">Claim submitted</h2>
            <p className="claim-done-text">
              Thanks — our team will review your claim to <strong>{companyName}</strong> within
              1–3 business days. We'll email you the decision.
            </p>
            <button className="claim-btn claim-btn--primary" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  )
}
