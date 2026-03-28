'use client'
import { useState, useEffect } from 'react'
import { fetchConfig } from '../../config/site-config'

export default function EarlyBirdTiers() {
  const [cfg, setCfg] = useState({ lifetimeSlotsTotal: 199, lifetimeSlotsClaimed: 0, yearlySlotsTotal: 999, yearlySlotsClaimed: 0 })
  useEffect(() => { fetchConfig().then(c => setCfg({ lifetimeSlotsTotal: c.lifetimeSlotsTotal, lifetimeSlotsClaimed: c.lifetimeSlotsClaimed, yearlySlotsTotal: c.yearlySlotsTotal, yearlySlotsClaimed: c.yearlySlotsClaimed })) }, [])

  const lifetimeRemaining = cfg.lifetimeSlotsTotal - cfg.lifetimeSlotsClaimed
  const lifetimeExhausted = cfg.lifetimeSlotsClaimed >= cfg.lifetimeSlotsTotal
  const yearlyExhausted = cfg.yearlySlotsClaimed >= cfg.yearlySlotsTotal
  const ltMarkerPct = (cfg.lifetimeSlotsClaimed / cfg.lifetimeSlotsTotal) * 100
  const yrMarkerPct = (cfg.yearlySlotsClaimed / cfg.yearlySlotsTotal) * 100

  const tiers1 = [
    { price: '$239', sub: 'lifetime', label: `first ${cfg.lifetimeSlotsTotal}`, active: !lifetimeExhausted },
    { price: '$999', sub: 'lifetime', label: `after ${cfg.lifetimeSlotsTotal}`, active: lifetimeExhausted },
  ]
  const tiers2 = [
    { price: '$99', sub: '/yr', label: `first ${cfg.yearlySlotsTotal}`, active: !yearlyExhausted },
    { price: '$239', sub: '/yr', label: `after ${cfg.yearlySlotsTotal}`, active: yearlyExhausted },
  ]

  return (
    <section className="tiers-section" id="tiers">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Limited Spots</div>
          <h2 className="tiers-heading">LifeTime Founding <em>Business Pricing </em></h2>
          <p className="section-desc">
            The earlier you join, the less you pay — forever. Only <strong>{lifetimeRemaining} Pioneer spots</strong> left.
          </p>
        </div>

        {/* ── Timeline 1 ── */}
        <div className="tier-track-label">Life Time Plan</div>
        <div className="tier-track">
          <div className="tier-line">
            <div className="tier-line-fill" style={{ width: `${ltMarkerPct}%` }} />
            <div className="tier-marker" style={{ left: `${ltMarkerPct}%` }}>
              <div className="tier-marker-pin">
                <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
              </div>
              <div className="tier-marker-label">{cfg.lifetimeSlotsClaimed} joined</div>
            </div>
          </div>
          {tiers1.map((t, i) => (
            <div key={i} className={`tier-step${t.active ? ' tier-step--active' : ''}`}>
              <div className="tier-price">{t.price}<span className="tier-price-sub">{t.sub}</span></div>
              <div className="tier-dot" />
              <div className="tier-label">{t.label}</div>
            </div>
          ))}
        </div>

        {/* ── Timeline 2 ── */}
        <div className="tier-track-label tier-track-label--2">Yearly Plans</div>
        <div className="tier-track tier-track--2">
          <div className="tier-line">
            <div className="tier-line-fill" style={{ width: `${yrMarkerPct}%` }} />
            <div className="tier-marker" style={{ left: `${yrMarkerPct}%` }}>
              <div className="tier-marker-pin">
                <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
              </div>
              <div className="tier-marker-label">{cfg.yearlySlotsClaimed} joined</div>
            </div>
          </div>
          {tiers2.map((t, i) => (
            <div key={i} className={`tier-step${t.active ? ' tier-step--active' : ''}`}>
              <div className="tier-price">{t.price}<span className="tier-price-sub">{t.sub}</span></div>
              <div className="tier-dot" />
              <div className="tier-label">{t.label}</div>
            </div>
          ))}
        </div>

        <p className="tier-note">
          You&apos;re in the <strong>Pioneer</strong> window — lock in $239 lifetime before the price jumps to $999.
        </p>
      </div>
    </section>
  )
}
