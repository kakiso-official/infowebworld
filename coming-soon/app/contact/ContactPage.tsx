'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Script from 'next/script'
import Link from 'next/link'

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

const subjects = [
  'General Inquiry',
  'Business Listing',
  'Partnership',
  'Bug Report',
  'Feedback',
  'Other',
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [captchaToken, setCaptchaToken] = useState('')
  const tsRef = useRef(Date.now())
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

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
              <select className="ct-input ct-select" required value={form.subject} onChange={e => set('subject', e.target.value)}>
                <option value="" disabled>Select a topic</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
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
