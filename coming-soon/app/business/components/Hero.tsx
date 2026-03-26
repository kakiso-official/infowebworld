'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import CurvedLoop from './CurvedLoop'

const categories = ['AI & ML', 'Software & SaaS', 'IT Services & Agencies', 'Startups & Innovations', 'Local Services', 'Industry Software']

export default function Hero() {
  const [displayed, setDisplayed] = useState('')
  const [jsReady, setJsReady] = useState(false)

  useEffect(() => {
    setJsReady(true)
    let wordIdx = 0
    let charIdx = 0
    let deleting = false
    let timeout: ReturnType<typeof setTimeout>

    function tick() {
      const word = categories[wordIdx]
      if (!deleting) {
        charIdx++
        setDisplayed(word.slice(0, charIdx))
        if (charIdx === word.length) {
          timeout = setTimeout(() => { deleting = true; tick() }, 1200)
          return
        }
        timeout = setTimeout(tick, 100)
      } else {
        charIdx--
        setDisplayed(word.slice(0, charIdx))
        if (charIdx === 0) {
          deleting = false
          wordIdx = (wordIdx + 1) % categories.length
          timeout = setTimeout(tick, 300)
          return
        }
        timeout = setTimeout(tick, 60)
      }
    }
    tick()
    return () => clearTimeout(timeout)
  }, [])

  return (
    <section className="gcs-hero" id="hero">
      <div className="gcs-bg-text" aria-hidden="true">#Get<br className="gcs-bg-text-br" /> Discovered</div>
      <div className="gcs-content">

        <h1 className="gcs-h1">
          Global Growth Platform where <br />
          <span className="gcs-h1-line2">
            <span className={`gcs-type-wrap${jsReady ? ' js-active' : ''}`}>
              <span className="gcs-type-text">{displayed}</span>
              <span className="gcs-type-cursor" />
            </span>{' '}
            get's Discovered
          </span>
        </h1>

        <h4 className="gcs-subtitle">
          Limited Early Listing Access
        </h4>
        <div className="gcs-actions">
          <div className="gcs-btn-arrow-wrap">
            <svg className="gcs-curvy-arrow" viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <path className="gcs-arrow-line" d="M10 8 C30 2, 42 74, 84 50" stroke="var(--h-accent)" strokeWidth="2.6" strokeLinecap="round" />
              <path className="gcs-arrow-head-1" d="M84 50 L70 42" stroke="var(--h-accent)" strokeWidth="3" strokeLinecap="round" />
              <path className="gcs-arrow-head-2" d="M84 50 L72 60" stroke="var(--h-accent)" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <Link href="/business" className="gcs-listing-btn">
              Make Your First Listing
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
        <p className="gcs-desc">
          Get more than just traffic—get high-intent Leads. By leveraging AI visibility, SEO, and Reviews, we put your business in front of the right buyers and build the trust needed to close the deal.
        </p>
        {/* <div className="gcs-highlights">
          <div className="gcs-hl-card gcs-hl--coral gcs-hl--wide">
            <span className="gcs-hl-num">DA 72+</span>
            <span className="gcs-hl-label">Dofollow Backlinks</span>
          </div>
          <div className="gcs-hl-card gcs-hl--emerald">
            <span className="gcs-hl-num">98%</span>
            <span className="gcs-hl-label">Verified Reviews</span>
          </div>
          <div className="gcs-hl-card gcs-hl--azure">
            <span className="gcs-hl-num">40+</span>
            <span className="gcs-hl-label">Leads/mo</span>
          </div>
          <div className="gcs-hl-card gcs-hl--amber gcs-hl--wide">
            <span className="gcs-hl-num">2,500+</span>
            <span className="gcs-hl-label">Businesses Listed</span>
          </div>
          <div className="gcs-hl-card gcs-hl--teal gcs-hl--wide">
            <span className="gcs-hl-num">Daily</span>
            <span className="gcs-hl-label">Industry Insights</span>
          </div>
          <div className="gcs-hl-card gcs-hl--plum">
            <span className="gcs-hl-num">12</span>
            <span className="gcs-hl-label">Countries</span>
          </div>
        </div> */}
      </div>
      <div className="gcs-marquee-mobile" aria-hidden="true">
        <div className="gcs-marquee-track">
          <span>launching soon — infowebworld — discover & list the best businesses — verified reviews — dofollow backlinks — 80+ industries — 12 countries — real leads —&nbsp;</span>
          <span>launching soon — infowebworld — discover & list the best businesses — verified reviews — dofollow backlinks — 80+ industries — 12 countries — real leads —&nbsp;</span>
        </div>
      </div>
    </section>
  )
}
