'use client'
import { useState, useEffect } from 'react'
import { getConfig } from '../config/site-config'

const tiers = [
  { price: '$240', sub: 'lifetime', label: 'first 200', active: true },
  { price: '$99', sub: '/yr', label: 'first 1k', active: false },
  { price: '$140', sub: '/yr', label: 'first 2k', active: false },
  { price: '$240', sub: '/yr', label: 'first 5k', active: false },
]

export default function EarlyBirdTiers() {
  const [cfg, setCfg] = useState({ pioneerJoined: 15, pioneerTotal: 200 })
  useEffect(() => { const c = getConfig(); setCfg({ pioneerJoined: c.pioneerJoined, pioneerTotal: c.pioneerTotal }) }, [])
  const JOINED = cfg.pioneerJoined
  const PIONEER_TOTAL = cfg.pioneerTotal
  const spotsLeft = PIONEER_TOTAL - JOINED
  const markerPct = (JOINED / PIONEER_TOTAL) * 25

  return (
    <section className="tiers-section" id="tiers">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Limited Spots</div>
          <h2 className="tiers-heading">Early Bird <em>Pricing</em></h2>
          <p className="section-desc">
            The earlier you join, the less you pay — forever. Only <strong>{spotsLeft} Pioneer spots</strong> left.
          </p>
        </div>

        <div className="tier-track">
          {/* The line */}
          <div className="tier-line">
            <div className="tier-line-fill" style={{ width: `${markerPct}%` }} />
            {/* Marker pin */}
            <div className="tier-marker" style={{ left: `${markerPct}%` }}>
              <div className="tier-marker-pin">
                <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
              </div>
              <div className="tier-marker-label">{JOINED} joined</div>
            </div>
          </div>

          {/* Steps */}
          {tiers.map((t, i) => (
            <div key={i} className={`tier-step${t.active ? ' tier-step--active' : ''}`}>
              <div className="tier-price">{t.price}<span className="tier-price-sub">{t.sub}</span></div>
              <div className="tier-dot" />
              <div className="tier-label">{t.label}</div>
            </div>
          ))}
        </div>

        <p className="tier-note">
          You&apos;re in the <strong>Pioneer</strong> window — lock in $240 lifetime before the price jumps to $99/yr.
        </p>
      </div>
    </section>
  )
}
