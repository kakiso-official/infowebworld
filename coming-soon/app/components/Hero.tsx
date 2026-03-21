'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import CurvedLoop from './CurvedLoop'

const words = ['Restaurants', 'Agencies', 'SaaS Tools', 'Clinics', 'Startups', 'Consultants', 'Studios', 'Law Firms']

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setCurrent(prev => (prev + 1) % words.length), 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="cs-hero" id="hero">
      <div className="cs-bg-text" aria-hidden="true">Launching<br className="cs-bg-text-br" /> Soon</div>
      <div className="cs-content">

        <h1 className="cs-h1">
          The Platform Where<br />
          <span className="cs-h1-line2">
            <span className="cs-rotate-wrap">
              {words.map((word, i) => (
                <span key={word} className={`cs-rotate-word${i === current ? ' active' : ''}`}>{word}</span>
              ))}
            </span>{' '}
            Get <em>Discovered</em>
          </span>
        </h1>

        <p className="cs-desc">
          Search, compare, and review businesses across 80+ industries in 12 countries.
          Verified reviews. Dofollow backlinks. Real leads. Be the first on the platform.
        </p>

        <div className="cs-actions">
          <Link href="/get-listed" className="cs-primary-btn">
            Get Listed Now
            <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
          <form className="cs-form" onSubmit={e => e.preventDefault()}>
            <input type="email" className="cs-input" placeholder="or join waitlist with email" required />
            <button type="submit" className="cs-submit">Join</button>
          </form>
        </div>

        {/* <div className="cs-highlights">
          <div className="cs-hl-card cs-hl--coral cs-hl--wide">
            <span className="cs-hl-num">DA 72+</span>
            <span className="cs-hl-label">Dofollow Backlinks</span>
          </div>
          <div className="cs-hl-card cs-hl--emerald">
            <span className="cs-hl-num">98%</span>
            <span className="cs-hl-label">Verified Reviews</span>
          </div>
          <div className="cs-hl-card cs-hl--azure">
            <span className="cs-hl-num">40+</span>
            <span className="cs-hl-label">Leads/mo</span>
          </div>
          <div className="cs-hl-card cs-hl--amber cs-hl--wide">
            <span className="cs-hl-num">2,500+</span>
            <span className="cs-hl-label">Businesses Listed</span>
          </div>
          <div className="cs-hl-card cs-hl--teal cs-hl--wide">
            <span className="cs-hl-num">Daily</span>
            <span className="cs-hl-label">Industry Insights</span>
          </div>
          <div className="cs-hl-card cs-hl--plum">
            <span className="cs-hl-num">12</span>
            <span className="cs-hl-label">Countries</span>
          </div>
        </div> */}
      </div>
      <div className="cs-marquee-mobile" aria-hidden="true">
        <div className="cs-marquee-track">
          <span>launching soon — infowebworld — discover & list the best businesses — verified reviews — dofollow backlinks — 80+ industries — 12 countries — real leads —&nbsp;</span>
          <span>launching soon — infowebworld — discover & list the best businesses — verified reviews — dofollow backlinks — 80+ industries — 12 countries — real leads —&nbsp;</span>
        </div>
      </div>
    </section>
  )
}
