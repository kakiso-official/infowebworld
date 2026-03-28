'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Script from 'next/script'
import Link from 'next/link'

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

const subjects = [
  { value: 'General Inquiry', label: 'General Inquiry', desc: 'Ask us anything about InfoWebWorld', color: '#6FBFFF' },
  { value: 'List My Business', label: 'List My Business', desc: 'Get your business discovered globally', color: '#85E89D' },
  { value: 'Upgrade / Pricing', label: 'Upgrade / Pricing', desc: 'Plans, pricing, or upgrade questions', color: '#FFD24D' },
  { value: 'Partnership', label: 'Partnership', desc: 'Collaborate or integrate with us', color: '#B49AFF' },
  { value: 'Advertising', label: 'Advertising & Sponsorship', desc: 'Promote your brand on our platform', color: '#FFB35C' },
  { value: 'Feature Request', label: 'Feature Request', desc: 'Suggest a new feature or improvement', color: '#5CD9C5' },
  { value: 'Bug Report', label: 'Bug Report', desc: 'Report a technical issue', color: '#FF8FAB' },
  { value: 'Billing', label: 'Billing & Payments', desc: 'Invoices, refunds, or payment questions', color: '#FF9A85' },
  { value: 'Press & Media', label: 'Press & Media', desc: 'Press inquiries and media coverage', color: '#A0D8EF' },
  { value: 'Feedback', label: 'Feedback', desc: 'Share your experience with us', color: '#85E89D' },
  { value: 'Careers', label: 'Careers', desc: 'Join our team and grow with us', color: '#B49AFF' },
  { value: 'Other', label: 'Other', desc: 'Anything else on your mind', color: '#D4C5B9' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [captchaToken, setCaptchaToken] = useState('')
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const tsRef = useRef(Date.now())
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  // Close dropdown on outside click or Escape
  useEffect(() => {
    if (!dropOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDropOpen(false) }
    const onClick = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick) }
  }, [dropOpen])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const renderTurnstile = useCallback(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current || widgetIdRef.current) return
    const w = window as unknown as { turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id: string) => void } }
    if (!w.turnstile) return
    widgetIdRef.current = w.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token: string) => setCaptchaToken(token),
      'expired-callback': () => setCaptchaToken(''),
      theme: 'light',
      size: 'normal',
    })
  }, [])

  useEffect(() => { renderTurnstile() }, [renderTurnstile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (TURNSTILE_SITE_KEY && !captchaToken) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          company: (document.getElementById('ct-hp') as HTMLInputElement)?.value || '',
          _ts: tsRef.current,
          captchaToken,
        }),
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', subject: '', message: '' })
        setCaptchaToken('')
        // Reset Turnstile widget
        const w = window as unknown as { turnstile?: { reset: (id: string) => void } }
        if (w.turnstile && widgetIdRef.current) w.turnstile.reset(widgetIdRef.current)
      } else {
        const data = await res.json().catch(() => ({}))
        setStatus('error')
        if (data.error) console.warn(data.error)
      }
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 6000)
  }

  return (
    <section className="ct-section">
      <div className="container">
        <div className="ct-layout">
          {/* ── Left: Form ── */}
          <form className="ct-form" onSubmit={handleSubmit}>
            <div className="ct-form-header">
              <div className="section-tag">Get in Touch</div>
              <h1 className="ct-heading">
                We&apos;d Love to <em>Hear</em> From You
              </h1>
            </div>

            <div className="ct-row">
              <div className="ct-field">
                <label className="ct-label">Name</label>
                <input type="text" className="ct-input" placeholder="Your name" required value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="ct-field">
                <label className="ct-label">Email</label>
                <input type="email" className="ct-input" placeholder="you@company.com" required value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
            </div>

            <div className="ct-field">
              <label className="ct-label">Subject</label>
              <div className="ct-drop" ref={dropRef}>
                <button type="button" className={`ct-input ct-drop-trigger${form.subject ? ' ct-drop-trigger--has' : ''}`} onClick={() => setDropOpen(o => !o)}>
                  {form.subject
                    ? <><span className="ct-drop-dot" style={{ background: subjects.find(s => s.value === form.subject)?.color }} />{subjects.find(s => s.value === form.subject)?.label}</>
                    : <span className="ct-drop-placeholder">Select a topic</span>}
                  <svg className={`ct-drop-chevron${dropOpen ? ' ct-drop-chevron--open' : ''}`} viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {dropOpen && (
                  <div className="ct-drop-menu">
                    {subjects.map(s => (
                      <button
                        type="button"
                        key={s.value}
                        className={`ct-drop-option${form.subject === s.value ? ' ct-drop-option--active' : ''}`}
                        onClick={() => { set('subject', s.value); setDropOpen(false) }}
                      >
                        <span className="ct-drop-dot" style={{ background: s.color }} />
                        <span className="ct-drop-option-text">
                          <span className="ct-drop-option-label">{s.label}</span>
                          <span className="ct-drop-option-desc">{s.desc}</span>
                        </span>
                        {form.subject === s.value && (
                          <svg className="ct-drop-check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Hidden input for native form validation */}
              <input type="text" required value={form.subject} tabIndex={-1} aria-hidden="true" onChange={() => {}} style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }} />
            </div>

            <div className="ct-field">
              <label className="ct-label">Message</label>
              <textarea className="ct-input ct-textarea" placeholder="Tell us what's on your mind..." required rows={3} value={form.message} onChange={e => set('message', e.target.value)} />
            </div>

            {/* Honeypot — hidden from humans, bots fill it */}
            <input type="text" id="ct-hp" name="company" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }} />

            {/* Cloudflare Turnstile captcha */}
            {TURNSTILE_SITE_KEY && (
              <>
                <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={renderTurnstile} />
                <div ref={turnstileRef} className="ct-captcha" />
              </>
            )}

            <button
              type="submit"
              className={`ct-btn${status === 'sent' ? ' ct-btn--sent' : status === 'error' ? ' ct-btn--error' : ''}`}
              disabled={status === 'sending'}
            >
              {status === 'idle' && <>Send Message <svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg></>}
              {status === 'sending' && 'Sending...'}
              {status === 'sent' && 'Message Sent!'}
              {status === 'error' && 'Failed — Try Again'}
            </button>
          </form>

          {/* ── Right: Info strip ── */}
          <div className="ct-info">
            <div className="ct-card">
              <div className="ct-card-icon">
                <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </div>
              <div>
                <h3 className="ct-card-title">Email Us</h3>
                <a href="mailto:team@infowebworld.com" className="ct-card-value">team@infowebworld.com</a>
                <p className="ct-card-note">We reply within 24 hours</p>
              </div>
            </div>

            <div className="ct-card">
              <div className="ct-card-icon">
                <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <div>
                <h3 className="ct-card-title">Headquarters</h3>
                <p className="ct-card-value">Brain Stream Australia Pty Ltd</p>
                <p className="ct-card-note">Parramatta, NSW 2150, Australia</p>
              </div>
            </div>

            <div className="ct-card">
              <div className="ct-card-icon">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
              </div>
              <div>
                <h3 className="ct-card-title">Follow Us</h3>
                <div className="ct-social-row">
                  <a href="https://x.com/infowebworld_x" target="_blank" rel="noopener noreferrer" className="ct-social-link">X</a>
                  <a href="https://www.linkedin.com/company/infowebworld/" target="_blank" rel="noopener noreferrer" className="ct-social-link">LinkedIn</a>
                  <a href="https://www.instagram.com/infowebworld" target="_blank" rel="noopener noreferrer" className="ct-social-link">Instagram</a>
                </div>
              </div>
            </div>

            <div className="ct-card ct-card--cta">
              <h3 className="ct-card-title">Looking to list your business?</h3>
              <Link href="/business" className="ct-card-btn">
                Get Listed
                <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
