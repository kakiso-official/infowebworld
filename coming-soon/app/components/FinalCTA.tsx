'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchConfig } from '../config/site-config'
import { addToWaitlist } from '../iww-hq/data/waitlist-storage'

export default function FinalCTA() {
  const [cfg, setCfg] = useState({ pioneerJoined: 15, pioneerTotal: 200, foundingPrice: 239 })
  useEffect(() => { fetchConfig().then(c => setCfg({ pioneerJoined: c.pioneerJoined, pioneerTotal: c.pioneerTotal, foundingPrice: c.foundingPrice })) }, [])
  const JOINED = cfg.pioneerJoined, TOTAL = cfg.pioneerTotal, LEFT = TOTAL - JOINED
  const PCT = Math.round((JOINED / TOTAL) * 100)

  const trustPoints = [
    { num: String(TOTAL), label: 'Founding Spots' },
    { num: `$${cfg.foundingPrice}`, label: 'Lifetime Access' },
    { num: '30-Day', label: 'Money Back' },
  ]
  const [fctaEmail, setFctaEmail] = useState('')
  const [fctaMsg, setFctaMsg] = useState('')

  const handleFctaJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fctaEmail) return
    const result = await addToWaitlist(fctaEmail, 'cta')
    if (result === 'ok') {
      setFctaMsg("You're on the list!"); setFctaEmail('')
    } else if (result === 'duplicate') {
      setFctaMsg('Already on the waitlist!')
    } else {
      setFctaMsg('Something went wrong. Try again.')
    }
    setTimeout(() => setFctaMsg(''), 5000)
  }

  return (
    <section className="fcta-section">
      <div className="container">
        <div className="fcta-card">
          {/* Left — content */}
          <div className="fcta-content">
            <div className="section-tag">Don&apos;t Miss Out</div>
            <h2 className="fcta-heading">
              Only <em>{LEFT} Pioneer Spots</em> Remain
            </h2>
            <p className="fcta-desc">
              Lock in $239 lifetime access before the price jumps to $99/yr. Join now and never pay again.
            </p>

            <form className="fcta-form" onSubmit={handleFctaJoin}>
              <input type="email" className="fcta-input" placeholder="Enter your work email" required value={fctaEmail} onChange={e => setFctaEmail(e.target.value)} />
              <button type="submit" className="fcta-btn">{fctaMsg || 'Join Waitlist'}</button>
            </form>

            <div className="fcta-alt">
              <Link href="/business" className="fcta-alt-link">
                or <strong>Get Listed Now</strong>
              </Link>
            </div>
          </div>

          {/* Right — progress + trust */}
          <div className="fcta-sidebar">
            <div className="fcta-progress">
              <svg viewBox="0 0 120 120" className="fcta-ring">
                <circle cx="60" cy="60" r="52" className="fcta-ring-bg" />
                <circle cx="60" cy="60" r="52" className="fcta-ring-fill"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - PCT / 100)}`}
                />
              </svg>
              <div className="fcta-ring-text">
                <span className="fcta-ring-pct">{PCT}%</span>
                <span className="fcta-ring-label">filled</span>
              </div>
            </div>

            <div className="fcta-trust-row">
              {trustPoints.map(t => (
                <div key={t.label} className="fcta-trust">
                  <span className="fcta-trust-num">{t.num}</span>
                  <span className="fcta-trust-label">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
