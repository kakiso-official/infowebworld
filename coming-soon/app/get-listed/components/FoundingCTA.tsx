'use client'

import Link from 'next/link'

const features = ['Leads', 'Reviews', 'GEO', 'AEO', 'SEO Backlinks']

export default function FoundingCTA() {
  return (
    <section className="fc-section">
      {/* Decorative floating shapes */}
      <div className="fc-shape fc-shape--1" />
      <div className="fc-shape fc-shape--2" />
      <div className="fc-shape fc-shape--3" />

      <div className="container">
        <div className="fc-card">
          {/* Scarcity ribbon */}
          <div className="fc-ribbon">Only 200 Slots</div>

          {/* Heading */}
          <h2 className="fc-heading">
            Be the <em>Elite</em> Lifetime<br />
            Founding Business
          </h2>

          {/* Value pills row */}
          <div className="fc-pills">
            <span className="fc-pill fc-pill--slots">
              <svg viewBox="0 0 24 24" className="fc-pill-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              Only 200 Slots
            </span>
            <span className="fc-pill-divider" />
            <span className="fc-pill fc-pill--lifetime">
              <svg viewBox="0 0 24 24" className="fc-pill-icon"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" /></svg>
              Lifetime Value
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
          <Link href="/get-listed" className="fc-btn">
            Get Listed
            <svg viewBox="0 0 24 24" className="fc-btn-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>

          {/* Guarantee */}
          <div className="fc-guarantee">
            <svg viewBox="0 0 24 24" className="fc-guarantee-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
            <span>6 Months — <strong>Money Back Guarantee</strong></span>
          </div>

          {/* Brand link */}
          <a href="https://infowebworld.com" className="fc-brand" target="_blank" rel="noopener noreferrer">
            InfoWebWorld.com
            <svg viewBox="0 0 24 24" className="fc-brand-arrow"><path d="M7 17L17 7M7 7h10v10" /></svg>
          </a>
        </div>
      </div>
    </section>
  )
}
