'use client'

import { useState } from 'react'
import FlexibleModal from './FlexibleModal'

type PlanKey = 'free' | 'starter'

const freeFeatures = [
  'Basic Listing',
  'Public Profile Page',
  'Logo + Description + Website',
  'Social Links',
  '1 Category Placement',
]

const starterFeatures = [
  'Everything in Free',
  'DoFollow Backlink',
  'Verified Reviews Display',
  'Custom Vanity URL',
  'FAQ Section',
  'Human Curation',
  'Basic Analytics',
  'Up to 3 Categories',
]

export default function FlexiblePlans() {
  const [modalPlan, setModalPlan] = useState<PlanKey | null>(null)

  return (
    <section className="fp-section" id="flexible-plans">
      <div className="container">
        <div className="fp-header">
          <div className="fp-section-tag">Also Available</div>
          <h2 className="fp-section-heading">
            Start smaller. <em>Grow</em> when ready.
          </h2>
          <p className="fp-section-desc">
            Not ready for a founding spot? Get listed for free or lock in our Starter plan once for $49.
          </p>
        </div>

        <div className="fp-grid">
          {/* ════════════ FREE CARD ════════════ */}
          <div className="fp-card fp-card--free">
            <div className="fp-badge fp-badge--free">Free Forever</div>

            <h3 className="fp-heading">Free Plan</h3>

            <div className="fp-price-block">
              <span className="fp-price">$0</span>
              <span className="fp-price-label">forever</span>
            </div>
            <div className="fp-price-after">
              Get listed instantly. No payment, no card.
            </div>

            <ul className="fp-features">
              {freeFeatures.map(f => (
                <li key={f} className="fp-feature">
                  <svg viewBox="0 0 24 24" className="fp-check"><path d="M20 6 9 17l-5-5" /></svg>
                  {f}
                </li>
              ))}
            </ul>

            <button type="button" className="fp-btn fp-btn--free" onClick={() => setModalPlan('free')}>
              Get Started Free
              <svg viewBox="0 0 24 24" className="fp-btn-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>

            <div className="fp-note">
              <svg viewBox="0 0 24 24" className="fp-note-icon"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
              <span>Nofollow backlink. Upgrade anytime for SEO juice.</span>
            </div>
          </div>

          {/* ════════════ STARTER CARD ════════════ */}
          <div className="fp-card fp-card--starter">
            <div className="fp-badge fp-badge--starter">Most Flexible</div>

            <h3 className="fp-heading">Starter Plan</h3>

            <div className="fp-price-block">
              <span className="fp-price">$49</span>
              <span className="fp-price-label">one-time</span>
            </div>
            <div className="fp-price-after">
              Pay once. No renewals. Yours to keep.
            </div>

            <ul className="fp-features">
              {starterFeatures.map(f => (
                <li key={f} className="fp-feature">
                  <svg viewBox="0 0 24 24" className="fp-check"><path d="M20 6 9 17l-5-5" /></svg>
                  {f}
                </li>
              ))}
            </ul>

            <button type="button" className="fp-btn fp-btn--starter" onClick={() => setModalPlan('starter')}>
              Get Starter — $49
              <svg viewBox="0 0 24 24" className="fp-btn-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>

            <div className="fp-guarantee">
              <svg viewBox="0 0 24 24" className="fp-guarantee-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
              <span>14-Day <strong>Money Back Guarantee</strong></span>
            </div>
          </div>
        </div>
      </div>

      {modalPlan && (
        <FlexibleModal
          isOpen={!!modalPlan}
          onClose={() => setModalPlan(null)}
          plan={modalPlan}
        />
      )}
    </section>
  )
}
