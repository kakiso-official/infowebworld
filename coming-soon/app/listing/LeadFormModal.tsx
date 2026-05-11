'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  listingSlug: string
  companyName: string
  companyLogo?: string
  /** Pre-fills name/email when the visitor is logged in. Both optional — anon visitors see empty fields. */
  prefillName?: string | null
  prefillEmail?: string | null
  /** Preview mode (test-listing-page) skips the API call so the form can be demoed without a real listing row. */
  isPreview?: boolean
  /** Fired after a successful submit so the parent can roll up its own counters. */
  onSuccess?: () => void
  /** Auth gate. When true and isAuthed=false, the modal renders a sign-in prompt
   *  instead of the form and calls onRequireAuth on click. Parent opens SignupModal. */
  requireAuth?: boolean
  isAuthed?: boolean
  onRequireAuth?: () => void
  /** Listing's contact info (email, phone). When provided, the success state shows
   *  the requested contact details inline as proof the platform sourced the lead.
   *  This is the swap for the previously-public mailto/tel links — visitors must
   *  identify themselves first, then the platform reveals the contact info to
   *  them while logging the request as an attributable lead. */
  listingContact?: { email?: string; phone?: string; phoneCode?: string } | null
}

const NAME_MAX = 120
const PHONE_MAX = 40
const MESSAGE_MAX = 4000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * "Get a Quote" lead capture modal — name, email, phone, message.
 * On submit POSTs to /api/listings/[slug]/inbox-email with source='quote_request'.
 * The same endpoint handles the simpler email-only "Send me info" form, distinguished
 * by the `source` field. Owner gets a branded "Lead via InfoWebWorld" email.
 *
 * Reuses the .wrm-* style block from test-listing-page.css so the modal matches
 * the WriteReviewModal visually (same listing page, same look).
 */
export default function LeadFormModal({
  isOpen, onClose, listingSlug, companyName, companyLogo,
  prefillName, prefillEmail, isPreview, onSuccess,
  requireAuth, isAuthed, onRequireAuth, listingContact,
}: Props) {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)
  const nameRef = useRef<HTMLInputElement | null>(null)

  /* Reset every time the modal opens. Pre-fills run after reset. */
  useEffect(() => {
    if (!isOpen) return
    setName(prefillName?.trim() || '')
    setEmail(prefillEmail?.trim() || '')
    setPhone('')
    setMessage('')
    setSubmitting(false)
    setError('')
    setSuccess(false)
  }, [isOpen, prefillName, prefillEmail])

  /* Body scroll lock while open. */
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* Esc to close — but not while a request is in flight. */
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, submitting])

  /* Autofocus the first empty field after open. */
  useEffect(() => {
    if (!isOpen || success) return
    const t = setTimeout(() => nameRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [isOpen, success])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanName    = name.trim()
    const cleanEmail   = email.trim().toLowerCase()
    const cleanPhone   = phone.trim()
    const cleanMessage = message.trim()

    if (!cleanName)               { setError('Please enter your name.'); return }
    if (!cleanEmail)              { setError('Please enter your email.'); return }
    if (!EMAIL_RE.test(cleanEmail)) { setError('That email looks off — double-check it.'); return }

    if (isPreview) {
      setSuccess(true)
      onSuccess?.()
      return
    }

    setSubmitting(true); setError('')
    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(listingSlug)}/inbox-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'quote_request',
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone || undefined,
          message: cleanMessage || undefined,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        setError(json.error || 'Could not send your request. Please try again.')
      } else {
        setSuccess(true)
        onSuccess?.()
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="wrm-overlay" onClick={() => !submitting && onClose()}>
      <div className="wrm-card" role="dialog" aria-modal="true" aria-labelledby="lfm-title-h"
        onClick={e => e.stopPropagation()}>

        <header className="wrm-head">
          <div className="wrm-head-id">
            {companyLogo
              ? <img className="wrm-head-logo" src={companyLogo} alt="" />
              : <span className="wrm-head-logo wrm-head-logo--ph">{(companyName || 'IW').slice(0, 2).toUpperCase()}</span>}
            <div className="wrm-head-text">
              <div className="wrm-head-eyebrow">{success ? 'Lead sent' : 'Get a Quote · via InfoWebWorld'}</div>
              <div className="wrm-head-name">{companyName}</div>
            </div>
          </div>
          <button type="button" className="wrm-close" onClick={onClose}
            aria-label="Close" disabled={submitting}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {success ? (
          <div className="wrm-success">
            <div className="wrm-success-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28">
                <path d="M5 12l5 5 9-11" fill="none" stroke="currentColor" strokeWidth="2.4"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="wrm-success-title">Lead sent to {companyName}</h3>
            <p className="wrm-success-desc">
              We&apos;ve forwarded your details — they&apos;ll reach out via email shortly.
              You&apos;ll also get a copy at <strong>{email}</strong>.
            </p>
            {listingContact && (listingContact.email || listingContact.phone) && (
              <div className="lfm-reveal">
                <div className="lfm-reveal-title">You can also reach {companyName} directly:</div>
                {listingContact.email && (
                  <a href={`mailto:${listingContact.email}`} className="lfm-reveal-row">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6"/></svg>
                    <span>{listingContact.email}</span>
                  </a>
                )}
                {listingContact.phone && (
                  <a href={`tel:${listingContact.phone}`} className="lfm-reveal-row">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                    <span>{listingContact.phoneCode ? `${listingContact.phoneCode} ` : ''}{listingContact.phone}</span>
                  </a>
                )}
                <p className="lfm-reveal-foot">
                  This lead is attributed to InfoWebWorld so {companyName} knows where the inquiry came from.
                </p>
              </div>
            )}
            <button type="button" className="wrm-btn wrm-btn--primary" onClick={onClose}>Done</button>
          </div>
        ) : requireAuth && !isAuthed ? (
          /* Auth-gate view — same modal chrome, simpler body. Parent listens to
             onRequireAuth to open the site-wide SignupModal. */
          <div className="wrm-success" style={{ paddingBottom: 24 }}>
            <div className="wrm-success-icon" aria-hidden="true" style={{ background: '#FFF7ED', color: '#EA580C' }}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 018 0v3" />
              </svg>
            </div>
            <h3 className="wrm-success-title">Sign in to request {companyName}&rsquo;s contact</h3>
            <p className="wrm-success-desc">
              We attribute every contact request to a real account so {companyName} knows
              the lead is genuine. It only takes 30 seconds — Google sign-in or email + password.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button type="button" className="wrm-btn wrm-btn--ghost" onClick={onClose}>Cancel</button>
              <button type="button" className="wrm-btn wrm-btn--primary" onClick={() => { onClose(); onRequireAuth?.() }}>
                Sign in to continue →
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="wrm-sub" id="lfm-title-h" style={{ margin: '14px 20px 12px' }}>
              We&apos;ll forward your details to <strong>{companyName}</strong> and confirm receipt
              by email. Lead source recorded as <strong>InfoWebWorld</strong>.
            </p>

            <form className="lfm-form" onSubmit={handleSubmit} noValidate>
              {/* Two-column row keeps the form short — fits without scroll on a 1366×768 laptop. */}
              <div className="wrm-row">
                <label className="wrm-field">
                  <span className="wrm-label">Your name *</span>
                  <input
                    ref={nameRef}
                    className="wrm-input"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value.slice(0, NAME_MAX))}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    required
                    disabled={submitting}
                  />
                </label>
                <label className="wrm-field">
                  <span className="wrm-label">Email *</span>
                  <input
                    className="wrm-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                    disabled={submitting}
                  />
                </label>
              </div>

              <label className="wrm-field">
                <span className="wrm-label">Phone <span className="lfm-opt">— optional</span></span>
                <input
                  className="wrm-input"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value.slice(0, PHONE_MAX))}
                  placeholder="+1 555 123 4567"
                  autoComplete="tel"
                  disabled={submitting}
                />
              </label>

              <label className="wrm-field">
                <span className="wrm-label">Message <span className="lfm-opt">— optional</span></span>
                <textarea
                  className="wrm-textarea"
                  value={message}
                  onChange={e => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
                  placeholder={`What would you like to know about ${companyName}?`}
                  rows={3}
                  disabled={submitting}
                />
                <span className="wrm-counter">{message.length} / {MESSAGE_MAX}</span>
              </label>

              {error && <p className="wrm-error" role="alert">{error}</p>}

              <p className="lfm-legal">
                By submitting, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.
              </p>

              <div className="wrm-foot">
                <span />
                <div className="wrm-foot-end">
                  <button type="button" className="wrm-btn wrm-btn--ghost"
                    onClick={onClose} disabled={submitting}>Cancel</button>
                  <button type="submit" className="wrm-btn wrm-btn--primary"
                    disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send Request'}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Lead-form-only adjustments — the rest of the layout uses the
          shared .wrm-* block from test-listing-page.css. */}
      <style>{`
        .lfm-form { display: flex; flex-direction: column; gap: 11px; padding: 0 20px 16px }
        .lfm-opt { color: #9CA3AF; font-weight: 600; text-transform: none; letter-spacing: 0 }
        .lfm-legal {
          margin: 4px 0 0;
          font-size: 11.5px; color: #6B7280; line-height: 1.5;
        }
        .lfm-legal a { color: #E8553D; text-decoration: underline; text-underline-offset: 2px; font-weight: 600 }
        .lfm-legal a:hover { color: #B33820 }
        .lfm-reveal {
          margin: 4px 0 18px;
          padding: 12px 14px;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: 8px;
          text-align: left;
        }
        .lfm-reveal-title {
          font-size: 12px;
          font-weight: 700;
          color: #166534;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: .03em;
        }
        .lfm-reveal-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
          font-size: 14px;
          font-weight: 600;
          color: #14532D;
          text-decoration: none;
        }
        .lfm-reveal-row:hover { text-decoration: underline; }
        .lfm-reveal-row svg { color: #14532D; flex-shrink: 0; }
        .lfm-reveal-foot {
          margin: 8px 0 0;
          font-size: 11.5px;
          color: #166534;
          line-height: 1.45;
        }
      `}</style>
    </div>
  )
}
