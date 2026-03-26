'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchConfig } from '../../config/site-config'

const features = ['Leads', 'Reviews', 'GEO', 'AEO', 'SEO Backlinks']

export default function FoundingCTA() {
  const [cfg, setCfg] = useState({ pioneerJoined: 15, pioneerTotal: 200 })
  useEffect(() => {
    fetchConfig().then(c => setCfg({ pioneerJoined: c.pioneerJoined, pioneerTotal: c.pioneerTotal }))
  }, [])
  const spotsLeft = cfg.pioneerTotal - cfg.pioneerJoined
  const markerPct = (cfg.pioneerJoined / cfg.pioneerTotal) * 100

  return (
    <section className="fc-section">
      <div className="container">
        {/* Section header */}
        <div className="fc-header">
          <div className="fc-section-tag">Limited Spots</div>
          <h2 className="fc-section-heading">
            Choose Your <em>Founding</em> Plan
          </h2>
          <p className="fc-section-desc">
            Only <strong>{spotsLeft} Pioneer spots</strong> left. Lock in the lowest price — before it&apos;s gone.
          </p>
        </div>

        <div className="fc-grid">
          {/* ════════════ LIFETIME CARD ════════════ */}
          <div className="fc-card fc-card--lifetime">
            {/* Recommended badge */}
            <div className="fc-badge">Best Value</div>

            {/* Scarcity ribbon */}
            <div className="fc-ribbon">Only {spotsLeft} Left</div>

            {/* Heading */}
            <h3 className="fc-heading">
              <em>Elite</em> Lifetime<br />
              Founding Business
            </h3>

            {/* Price */}
            <div className="fc-price-block">
              <span className="fc-price">$240</span>
              <span className="fc-price-label fc-price-label--highlight">lifetime</span>
            </div>
            <div className="fc-price-after">
              <span className="fc-strikethrough">$999</span> after Pioneer window
            </div>

            {/* Value pills */}
            <div className="fc-pills">
              <span className="fc-pill fc-pill--slots">
                <svg viewBox="0 0 24 24" className="fc-pill-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                Only {cfg.pioneerTotal} Slots
              </span>
              <span className="fc-pill-divider" />
              <span className="fc-pill fc-pill--lifetime">
                <svg viewBox="0 0 24 24" className="fc-pill-icon"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" /></svg>
                Pay Once, Yours Forever
              </span>
            </div>

            {/* Feature tags */}
            <div className="fc-features">
              <span className="fc-features-label">Get</span>
              {features.map(f => (
                <span key={f} className="fc-tag">{f}</span>
              ))}
            </div>

            {/* CTA button */}
            <Link href="/business" className="fc-btn">
              Claim Lifetime Spot
              <svg viewBox="0 0 24 24" className="fc-btn-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>

            {/* Guarantee */}
            <div className="fc-guarantee">
              <svg viewBox="0 0 24 24" className="fc-guarantee-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
              <span>6 Months — <strong>Money Back Guarantee</strong></span>
            </div>
          </div>

          {/* ════════════ YEARLY CARD ════════════ */}
          <div className="fc-card fc-card--yearly">
            {/* Ribbon */}
            <div className="fc-ribbon fc-ribbon--yearly">Flexible Plan</div>

            {/* Heading */}
            <h3 className="fc-heading">
              Yearly Business<br />
              Membership
            </h3>

            {/* Price */}
            <div className="fc-price-block">
              <span className="fc-price">$99</span>
              <span className="fc-price-label">/year</span>
            </div>
            <div className="fc-price-after">
              <span className="fc-strikethrough">$240/yr</span> after Pioneer window
            </div>

            {/* Value pills */}
            <div className="fc-pills">
              <span className="fc-pill fc-pill--slots">
                <svg viewBox="0 0 24 24" className="fc-pill-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                Limited Spots
              </span>
              <span className="fc-pill-divider" />
              <span className="fc-pill fc-pill--renew">
                <svg viewBox="0 0 24 24" className="fc-pill-icon"><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
                Renew Annually
              </span>
            </div>

            {/* Feature tags */}
            <div className="fc-features">
              <span className="fc-features-label">Get</span>
              {features.map(f => (
                <span key={f} className="fc-tag">{f}</span>
              ))}
            </div>

            {/* CTA button */}
            <Link href="/business" className="fc-btn fc-btn--yearly">
              Get Started
              <svg viewBox="0 0 24 24" className="fc-btn-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>

            {/* Guarantee */}
            <div className="fc-guarantee">
              <svg viewBox="0 0 24 24" className="fc-guarantee-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
              <span>6 Months — <strong>Money Back Guarantee</strong></span>
            </div>
          </div>

        </div>

        {/* Timeline hidden for now */}

        {/* Brand link */}
        <a href="https://infowebworld.com" className="fc-brand" target="_blank" rel="noopener noreferrer">
          InfoWebWorld.com
          <svg viewBox="0 0 24 24" className="fc-brand-arrow"><path d="M7 17L17 7M7 7h10v10" /></svg>
        </a>
      </div>
    </section>
  )
}
