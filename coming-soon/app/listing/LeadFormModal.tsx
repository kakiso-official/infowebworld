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
            <button type="button" className="wrm-btn wrm-btn--primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <h3 id="lfm-title-h" className="wrm-title">Request a quote from {companyName}</h3>
            <p className="wrm-sub">
              We&apos;ll forward your details to {companyName} and confirm receipt by email.
              Lead source recorded as <strong>InfoWebWorld</strong>.
            </p>

            <form className="lfm-form" onSubmit={handleSubmit} noValidate>
              <label className="lfm-field">
                <span className="lfm-label">Your name <span className="lfm-req">*</span></span>
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

              <label className="lfm-field">
                <span className="lfm-label">Email address <span className="lfm-req">*</span></span>
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

              <label className="lfm-field">
                <span className="lfm-label">Phone <span className="lfm-opt">(optional)</span></span>
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

              <label className="lfm-field">
                <span className="lfm-label">Message <span className="lfm-opt">(optional)</span></span>
                <textarea
                  className="wrm-textarea"
                  value={message}
                  onChange={e => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
                  placeholder={`What would you like to know about ${companyName}?`}
                  rows={4}
                  disabled={submitting}
                />
                <span className="lfm-counter">{message.length} / {MESSAGE_MAX}</span>
              </label>

              {error && <p className="wrm-error" role="alert">{error}</p>}

              <p className="lfm-legal">
                By submitting, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.
                Your details are sent to {companyName} via InfoWebWorld.
              </p>

              <div className="wrm-foot">
                <span />
                <div className="wrm-foot-end">
                  <button type="button" className="wrm-btn wrm-btn--ghost"
                    onClick={onClose} disabled={submitting}>Cancel</button>
                  <button type="submit" className="wrm-btn wrm-btn--primary"
                    disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send to ' + companyName}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Scoped form-only styles — modal shell uses the global .wrm-* block. */}
      <style>{`
        .lfm-form { display: flex; flex-direction: column; gap: 14px; padding: 0 24px 8px }
        .lfm-field { display: flex; flex-direction: column; gap: 6px; position: relative }
        .lfm-label {
          font-family: var(--font-inter, Inter, system-ui), sans-serif;
          font-size: 12.5px; font-weight: 600; color: #11181C; letter-spacing: -.005em;
        }
        .lfm-req { color: #E8553D; font-weight: 700; margin-left: 2px }
        .lfm-opt { color: #6B7280; font-weight: 500 }
        .lfm-counter {
          position: absolute; right: 4px; bottom: -18px;
          font-family: var(--font-inter, Inter, system-ui), sans-serif;
          font-size: 11px; color: #9CA3AF; font-weight: 500;
        }
        .lfm-legal {
          margin: 4px 0 0;
          font-family: var(--font-inter, Inter, system-ui), sans-serif;
          font-size: 11.5px; color: #6B7280; line-height: 1.55;
        }
        .lfm-legal a { color: #0C9A9A; text-decoration: none; font-weight: 600 }
        .lfm-legal a:hover { text-decoration: underline }
      `}</style>
    </div>
  )
}
