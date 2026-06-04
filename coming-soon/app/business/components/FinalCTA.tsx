'use client'
import { useState, useEffect, useCallback } from 'react'
import { fetchConfig } from '../../config/site-config'
import SignupModal from '../../components/auth/SignupModal'
import { useAuth } from '@/lib/use-auth'

const features = ['Leads', 'Reviews', 'GEO', 'AEO', 'SEO Backlinks']

type PlanKey = 'lifetime' | 'yearly'

const checkoutUrl = (plan: PlanKey) => `/dashboard/new/checkout?plan=${plan}`

export default function FinalCTA() {
  const [cfg, setCfg] = useState({ lifetimeSlotsTotal: 199, lifetimeSlotsClaimed: 0, yearlySlotsTotal: 999, yearlySlotsClaimed: 0 })
  const [authOpen, setAuthOpen] = useState(false)
  const [authPlan, setAuthPlan] = useState<PlanKey>('lifetime')
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    fetchConfig().then(c => setCfg({ lifetimeSlotsTotal: c.lifetimeSlotsTotal, lifetimeSlotsClaimed: c.lifetimeSlotsClaimed, yearlySlotsTotal: c.yearlySlotsTotal, yearlySlotsClaimed: c.yearlySlotsClaimed }))
  }, [])

  /** Anon → signup modal (lands on checkout after auth). Authed → straight to checkout. */
  const choosePlan = useCallback((plan: PlanKey) => {
    if (authLoading) return
    if (!user) {
      setAuthPlan(plan)
      setAuthOpen(true)
      return
    }
    window.location.href = checkoutUrl(plan)
  }, [user, authLoading])

  const lifetimeRemaining = cfg.lifetimeSlotsTotal - cfg.lifetimeSlotsClaimed
  const yearlyRemaining = cfg.yearlySlotsTotal - cfg.yearlySlotsClaimed
  const lifetimeExhausted = cfg.lifetimeSlotsClaimed >= cfg.lifetimeSlotsTotal
  const yearlyExhausted = cfg.yearlySlotsClaimed >= cfg.yearlySlotsTotal
  const ltPct = (cfg.lifetimeSlotsClaimed / cfg.lifetimeSlotsTotal) * 100
  const yrPct = (cfg.yearlySlotsClaimed / cfg.yearlySlotsTotal) * 100
  const R = 52
  const C = 2 * Math.PI * R

  return (
    <section className="f2-section">
      <div className="container">
        {/* ── Section header ── */}
        <div className="f2-header">
          <div className="f2-tag">Don&apos;t Miss Out</div>
          <h2 className="f2-heading">
           Pioneer Pre-Launch Spots
          </h2>
        </div>

        <div className="f2-grid">
          {/* ════════════ LIFETIME CARD ════════════ */}
          <div className="f2-card f2-card--lifetime">
            {/* ── Colored top zone ── */}
            <div className="f2-card-top f2-card-top--lt">
              <div className="f2-ribbon">Only {lifetimeRemaining} Left</div>

              <div className="f2-ring-wrap">
                <svg viewBox="0 0 120 120" className="f2-ring">
                  <circle cx="60" cy="60" r={R} className="f2-ring-bg" />
                  <circle cx="60" cy="60" r={R} className="f2-ring-fill f2-ring-fill--lt"
                    strokeDasharray={C}
                    strokeDashoffset={C * (1 - ltPct / 100)}
                  />
                </svg>
                <div className="f2-ring-text">
                  <span className="f2-ring-pct">{Math.round(ltPct)}%</span>
                  <span className="f2-ring-label">filled</span>
                </div>
              </div>
              <div className="f2-claimed">{cfg.lifetimeSlotsClaimed} / {cfg.lifetimeSlotsTotal} claimed</div>

              <h3 className="f2-plan-name">
                <em>Elite</em> Lifetime<br />
                Founding Business
              </h3>
            </div>

            {/* ── White body zone ── */}
            <div className="f2-card-body">
              <div className="f2-price-block">
                <span className="f2-price">${lifetimeExhausted ? '999' : '239'}</span>
                <span className="f2-price-label f2-price-label--coral">lifetime</span>
              </div>
              {!lifetimeExhausted && (
                <div className="f2-price-after">
                  <span className="f2-strike">$999 / lifetime</span> after Pioneer pre-launch window
                </div>
              )}

              <div className="f2-pills">
                <span className="f2-pill f2-pill--coral">
                  <svg viewBox="0 0 24 24" className="f2-pill-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  Only {cfg.lifetimeSlotsTotal} Spots
                </span>
                <span className="f2-pill-dot" />
                <span className="f2-pill f2-pill--green">
                  <svg viewBox="0 0 24 24" className="f2-pill-icon"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" /></svg>
                  Pay Once, Yours Forever
                </span>
              </div>

              <div className="f2-features">
                <span className="f2-features-label">Get</span>
                {features.map(f => (
                  <span key={f} className="f2-feat">{f}</span>
                ))}
              </div>

              <button type="button" className="f2-btn f2-btn--coral" onClick={() => choosePlan('lifetime')}>
                Claim Lifetime Spot
                <svg viewBox="0 0 24 24" className="f2-btn-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>

              <div className="f2-guarantee">
                <svg viewBox="0 0 24 24" className="f2-guarantee-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
                <span>6 Months — <strong>Money Back Guarantee</strong></span>
              </div>
            </div>
          </div>

          {/* ════════════ YEARLY CARD ════════════ */}
          <div className="f2-card f2-card--yearly">
            {/* ── Colored top zone ── */}
            <div className="f2-card-top f2-card-top--yr">
              <div className="f2-ribbon f2-ribbon--blue">Only {yearlyRemaining} Left</div>

              <div className="f2-ring-wrap">
                <svg viewBox="0 0 120 120" className="f2-ring">
                  <circle cx="60" cy="60" r={R} className="f2-ring-bg" />
                  <circle cx="60" cy="60" r={R} className="f2-ring-fill f2-ring-fill--yr"
                    strokeDasharray={C}
                    strokeDashoffset={C * (1 - yrPct / 100)}
                  />
                </svg>
                <div className="f2-ring-text">
                  <span className="f2-ring-pct">{Math.round(yrPct)}%</span>
                  <span className="f2-ring-label">filled</span>
                </div>
              </div>
              <div className="f2-claimed">{cfg.yearlySlotsClaimed} / {cfg.yearlySlotsTotal} claimed</div>

              <h3 className="f2-plan-name">
                Early Adopter<br />
                Plan
              </h3>
            </div>

            {/* ── White body zone ── */}
            <div className="f2-card-body">
              <div className="f2-price-block">
                <span className="f2-price">${yearlyExhausted ? '239' : '99'}</span>
                <span className="f2-price-label">/year Locked Forever</span>
              </div>
              {!yearlyExhausted && (
                <div className="f2-price-after">
                  <span className="f2-strike f2-strike--blue">$239/yr</span> after Pioneer pre-launch window
                </div>
              )}

              <div className="f2-pills">
                <span className="f2-pill f2-pill--blue">
                  <svg viewBox="0 0 24 24" className="f2-pill-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  Only {cfg.yearlySlotsTotal} Spots
                </span>
                <span className="f2-pill-dot" />
                <span className="f2-pill f2-pill--cyan">
                  <svg viewBox="0 0 24 24" className="f2-pill-icon"><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
                  Renew Annually
                </span>
              </div>

              <div className="f2-features">
                <span className="f2-features-label">Get</span>
                {features.map(f => (
                  <span key={f} className="f2-feat">{f}</span>
                ))}
              </div>

              <button type="button" className="f2-btn f2-btn--dark" onClick={() => choosePlan('yearly')}>
                Get Started
                <svg viewBox="0 0 24 24" className="f2-btn-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>

              <div className="f2-guarantee">
                <svg viewBox="0 0 24 24" className="f2-guarantee-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
                <span>Lead , CTA&apos;s — <strong>Less , Renewal is Free</strong></span>
              </div>
            </div>
          </div>
        </div>

        <a href="https://www.infowebworld.com" className="f2-brand" target="_blank" rel="noopener noreferrer">
          InfoWebWorld.com
          <svg viewBox="0 0 24 24" className="f2-brand-arrow"><path d="M7 17L17 7M7 7h10v10" /></svg>
        </a>
      </div>

      {/* Signup gate — anon users sign in then land on /dashboard/new/checkout. */}
      <SignupModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        nextUrl={checkoutUrl(authPlan)}
      />
    </section>
  )
}
