'use client'

import { useState } from 'react'
import Link from 'next/link'

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

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 6000)
  }

  return (
    <section className="ct-section">
      <div className="container">
        {/* Header */}
        <div className="ct-header">
          <div className="section-tag">Get in Touch</div>
          <h1 className="ct-heading">
            We&apos;d Love to <em>Hear</em> From You
          </h1>
          <p className="ct-subtitle">
            Questions, Collobrations, partnerships, feedback — whatever it is, we&apos;re here to help/attend.
          </p>
        </div>

        <div className="ct-grid">
          {/* Form */}
          <form className="ct-form" onSubmit={handleSubmit}>
            <div className="ct-row">
              <div className="ct-field">
                <label className="ct-label">Name</label>
                <input
                  type="text"
                  className="ct-input"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </div>
              <div className="ct-field">
                <label className="ct-label">Email</label>
                <input
                  type="email"
                  className="ct-input"
                  placeholder="you@company.com"
                  required
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                />
              </div>
            </div>

            <div className="ct-field">
              <label className="ct-label">Subject</label>
              <select
                className="ct-input ct-select"
                required
                value={form.subject}
                onChange={e => set('subject', e.target.value)}
              >
                <option value="" disabled>Select a topic</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="ct-field">
              <label className="ct-label">Message</label>
              <textarea
                className="ct-input ct-textarea"
                placeholder="Tell us what's on your mind..."
                required
                rows={5}
                value={form.message}
                onChange={e => set('message', e.target.value)}
              />
            </div>

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

          {/* Info cards */}
          <div className="ct-info">
            <div className="ct-card">
              <div className="ct-card-icon">
                <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </div>
              <h3 className="ct-card-title">Email Us</h3>
              <a href="mailto:team@infowebworld.com" className="ct-card-value">Team@infoWebWorld.com</a>
              <p className="ct-card-note">We reply within 24 hours</p>
            </div>

            <div className="ct-card">
              <div className="ct-card-icon">
                <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <h3 className="ct-card-title">Headquarters</h3>
              <p className="ct-card-value">Brain Stream Australia Pty Ltd</p>
              <p className="ct-card-note">Parramatta, NSW 2150, Australia</p>
            </div>

            <div className="ct-card">
              <div className="ct-card-icon">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
              </div>
              <h3 className="ct-card-title">Follow Us</h3>
              <div className="ct-social-row">
                <a href="https://x.com/infowebworld_x" target="_blank" className="ct-social-link">Twitter / X</a>
                <a href="https://www.linkedin.com/company/infowebworld/" target="_blank" className="ct-social-link">LinkedIn</a>
                <a href="https://www.instagram.com/infowebworld" target="_blank" className="ct-social-link">Instagram</a>
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
