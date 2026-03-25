'use client'
import { useRef, useEffect, useState } from 'react'
import { fetchConfig } from '../../config/site-config'

const Ck = () => (
  <svg viewBox="0 0 24 24" className="pr-ck"><path d="M20 6 9 17l-5-5" /></svg>
)

const plans = [
  {
    name: 'Founding Company',
    badge: 'First 200 Only',
    price: 240,
    period: 'one-time',
    note: 'Lifetime listing — pay once, listed forever',
    save: 'Save $720+ over 4 years',
    pastel: 'pr--coral',
    cta: 'Claim Founding Spot',
    locked: false,
    lockNote: '',
    features: [
      'Permanent lifetime listing',
      'Founding Member badge',
      'Dofollow backlink (DA 72+)',
      'Priority search placement',
      'Verified business profile',
      'Analytics dashboard',
      'Unlimited photos & media',
    ],
  },
  {
    name: 'Early Adopter',
    badge: 'First 1,000',
    price: 99,
    period: '/year',
    note: '59% off standard yearly price',
    save: '',
    pastel: 'pr--azure',
    cta: '',
    locked: true,
    lockNote: 'Unlocks after 200 Founding spots fill',
    features: [
      'Full business listing',
      'Dofollow backlink (DA 72+)',
      'Verified profile badge',
      'Review management',
      'Analytics dashboard',
      'Lead generation tools',
      'Priority support',
      'Social media integration',
    ],
  },
  {
    name: 'Standard',
    badge: 'Post-Launch',
    price: 240,
    period: '/year',
    note: 'Regular launch pricing',
    save: '',
    pastel: 'pr--emerald',
    cta: '',
    locked: true,
    lockNote: 'Unlocks after Early Adopter tier fills',
    features: [
      'Full business listing',
      'Dofollow backlink (DA 72+)',
      'Verified profile badge',
      'Review management',
      'Analytics dashboard',
      'Lead generation tools',
    ],
  },
]

export default function Pricing() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [cfg, setCfg] = useState({ pioneerJoined: 15, pioneerTotal: 200 })
  useEffect(() => { fetchConfig().then(c => setCfg({ pioneerJoined: c.pioneerJoined, pioneerTotal: c.pioneerTotal })) }, [])
  const JOINED = cfg.pioneerJoined, TOTAL = cfg.pioneerTotal, LEFT = TOTAL - JOINED

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)

    /* Fallback: show cards even if observer never fires (mobile network) */
    const timer = setTimeout(() => setVisible(true), 4000)

    return () => { obs.disconnect(); clearTimeout(timer) }
  }, [])

  return (
    <section className="pr-section" id="pricing">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Pricing</div>
          <h2 className="pr-heading">
            Listing Plans for <em>Every Business</em>
          </h2>
          <p className="section-desc">
            Price rises as spots fill. Lock in the lowest rate now — it will never be this low again.
          </p>
        </div>

        <div
          ref={gridRef}
          className={`pr-grid${visible ? ' pr-grid--visible' : ''}`}
        >
          {plans.map((p, i) => (
            <div
              key={p.name}
              className={`pr-card ${p.pastel}${!p.locked ? ' pr-card--active' : ' pr-card--locked'}`}
              style={{ '--card-i': i } as React.CSSProperties}
            >
              {!p.locked && <div className="pr-popular">Now Open</div>}

              <div className="pr-card-body">
                <div className="pr-badge">{p.badge}</div>
                <div className="pr-name">{p.name}</div>

                <div className="pr-price-row">
                  <span className="pr-currency">$</span>
                  <span className="pr-amount">{p.price}</span>
                </div>
                <div className="pr-period">{p.period}</div>
                <div className="pr-note">{p.note}</div>

                {p.save && <div className="pr-save">{p.save}</div>}

                {!p.locked && p.name === 'Founding Company' && (
                  <div className="pr-spots">
                    <div className="pr-spots-bar">
                      <div
                        className="pr-spots-fill"
                        style={{ width: `${(JOINED / TOTAL) * 100}%` }}
                      />
                    </div>
                    <div className="pr-spots-text">
                      <span className="pr-spots-left">{LEFT} spots remaining</span>
                      <span className="pr-spots-total">{JOINED}/{TOTAL} claimed</span>
                    </div>
                  </div>
                )}

                <ul className="pr-features">
                  {p.features.map(f => (
                    <li key={f}><Ck />{f}</li>
                  ))}
                </ul>

                {p.locked ? (
                  <div className="pr-lock-note">{p.lockNote}</div>
                ) : (
                  <a href="#hero" className="pr-cta pr-cta--primary">{p.cta}</a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pr-bottom">
          <div className="pr-bottom-item">
            <span className="pr-bottom-num pr-bottom-num--coral">30</span>
            <div>
              <div className="pr-bottom-title">Day Money-Back Guarantee</div>
              <div className="pr-bottom-desc">Not satisfied? Full refund, no questions asked.</div>
            </div>
          </div>

          <div className="pr-bottom-sep" />

          <div className="pr-bottom-item">
            <span className="pr-bottom-num pr-bottom-num--azure">5+</span>
            <div>
              <div className="pr-bottom-title">Free Portfolio Listings</div>
              <div className="pr-bottom-desc">Companies with 5+ products get every one listed free.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
