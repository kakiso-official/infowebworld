'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchConfig } from '../../../config/site-config'
import PaymentModal from './PaymentModal'
import FlexibleModal from './FlexibleModal'
import SignupModal from '../../../components/auth/SignupModal'
import { useAuth } from '@/lib/use-auth'

const features = ['Leads', 'Reviews', 'GEO', 'AEO', 'SEO Backlinks']
const starterFeatures = ['Backlink', 'Reviews', 'Custom URL', 'FAQ', 'Analytics']
const freeFeatures = ['Listing', 'Search', 'Website Link', 'Visiblity','Social','1 Category']

type PlanKey = 'lifetime' | 'yearly'
type FlexibleKey = 'free' | 'starter'

type AnyPlan = 'free' | 'starter' | 'yearly' | 'lifetime'

export default function FoundingCTA() {
  const [cfg, setCfg] = useState({ lifetimeSlotsTotal: 199, lifetimeSlotsClaimed: 0, yearlySlotsTotal: 999, yearlySlotsClaimed: 0 })
  const [modalPlan, setModalPlan] = useState<PlanKey | null>(null)
  const [flexiblePlan, setFlexiblePlan] = useState<FlexibleKey | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [authPlan, setAuthPlan] = useState<AnyPlan>('free')
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    fetchConfig().then(c => setCfg({ lifetimeSlotsTotal: c.lifetimeSlotsTotal, lifetimeSlotsClaimed: c.lifetimeSlotsClaimed, yearlySlotsTotal: c.yearlySlotsTotal, yearlySlotsClaimed: c.yearlySlotsClaimed }))
  }, [])

  /**
   * Gate a plan CTA:
   * - Not logged in → open signup modal with a plan-aware nextUrl so after
   *   auth the user lands directly on the listing form for that plan.
   * - Logged in → run the provided action (payment modal for paid plans,
   *   direct navigation for the free plan).
   */
  const gate = useCallback((plan: AnyPlan, action: () => void) => {
    if (authLoading) return
    if (!user) {
      setAuthPlan(plan)
      setAuthOpen(true)
      return
    }
    action()
  }, [user, authLoading])

  /** Free plan skips any payment — authed users go straight to the form. */
  const goToForm = (plan: AnyPlan) => {
    window.location.href = `/dashboard/new?plan=${plan}`
  }

  const lifetimeRemaining = cfg.lifetimeSlotsTotal - cfg.lifetimeSlotsClaimed
  const yearlyRemaining = cfg.yearlySlotsTotal - cfg.yearlySlotsClaimed
  const lifetimeExhausted = cfg.lifetimeSlotsClaimed >= cfg.lifetimeSlotsTotal
  const yearlyExhausted = cfg.yearlySlotsClaimed >= cfg.yearlySlotsTotal

  return (
    <section className="fc-section" id="founding">
      <div className="container">
        {/* Section header */}
        <div className="fc-header">
          <div className="fc-section-tag">Limited Pioneer Pre-Launch Spots</div>
          <h2 className="fc-section-heading">
            Choose Your <em>Founding</em> Plan
          </h2><p>The earlier you join, the less you pay — forever. Only for Pioneer spots. Not Satisfied, we got you covered with Refund or Free Renewal.</p>
        </div>

        <div className="fc-grid">
          {/* ════════════ LIFETIME CARD ════════════ */}
          <div className="fc-card fc-card--lifetime">
            <div className="fc-badge">Best Value</div>
            <div className="fc-ribbon">Only {lifetimeRemaining} Left</div>

            <h3 className="fc-heading">
              <em>Elite</em> Lifetime<br />
              Founding Business
            </h3>

            <div className="fc-price-block">
              <span className="fc-price">${lifetimeExhausted ? '999' : '239'}</span>
              <span className="fc-price-label fc-price-label--highlight">lifetime</span>
            </div>
            {!lifetimeExhausted && (
              <div className="fc-price-after">
                <span className="fc-strikethrough">$999 / lifetime</span> after Pioneer pre-launch window
              </div>
            )}

            <div className="fc-pills">
              <span className="fc-pill fc-pill--slots">
                <svg viewBox="0 0 24 24" className="fc-pill-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                Only {cfg.lifetimeSlotsTotal} Spots
              </span>
              <span className="fc-pill-divider" />
              <span className="fc-pill fc-pill--lifetime">
                <svg viewBox="0 0 24 24" className="fc-pill-icon"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" /></svg>
                Pay Once, Yours Forever
              </span>
            </div>

            <div className="fc-features">
              <span className="fc-features-label">Get</span>
              {features.map(f => (
                <span key={f} className="fc-tag">{f}</span>
              ))}
            </div>

            <button type="button" className="fc-btn" onClick={() => gate('lifetime', () => setModalPlan('lifetime'))}>
              Claim Lifetime Spot
              <svg viewBox="0 0 24 24" className="fc-btn-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>

            <div className="fc-guarantee">
              <svg viewBox="0 0 24 24" className="fc-guarantee-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
              <span>6 Months — <strong>Money Back Guarantee</strong></span>
            </div>
          </div>

          {/* ════════════ YEARLY CARD ════════════ */}
          <div className="fc-card fc-card--yearly">
            <div className="fc-ribbon fc-ribbon--yearly">Only {yearlyRemaining} Left</div>

            <h3 className="fc-heading">
              Early Adopter<br />
              Plan
            </h3>

            <div className="fc-price-block">
              <span className="fc-price">${yearlyExhausted ? '239' : '99'}</span>
              <span className="fc-price-label">/year Locked Forever</span>
            </div>
            {!yearlyExhausted && (
              <div className="fc-price-after">
                <span className="fc-strikethrough">$239/yr</span> after Pioneer pre-launch window
              </div>
            )}

            <div className="fc-pills">
              <span className="fc-pill fc-pill--slots">
                <svg viewBox="0 0 24 24" className="fc-pill-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                Only {cfg.yearlySlotsTotal} Spots
              </span>
              <span className="fc-pill-divider" />
              <span className="fc-pill fc-pill--renew">
                <svg viewBox="0 0 24 24" className="fc-pill-icon"><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
                Renew Annually
              </span>
            </div>

            <div className="fc-features">
              <span className="fc-features-label">Get</span>
              {features.map(f => (
                <span key={f} className="fc-tag">{f}</span>
              ))}
            </div>

            <button type="button" className="fc-btn fc-btn--yearly" onClick={() => gate('yearly', () => setModalPlan('yearly'))}>
              Get Started
              <svg viewBox="0 0 24 24" className="fc-btn-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>

            <div className="fc-guarantee">
              <svg viewBox="0 0 24 24" className="fc-guarantee-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
              <span>Lead , CTA&apos;s — <strong>Less , Renewal is Free</strong></span>
            </div>
          </div>

          {/* ════════════ STARTER CARD (new) ════════════ */}
          <div className="fc-card fc-card--starter">
            <div className="fc-ribbon fc-ribbon--starter">Most Flexible</div>

            <h3 className="fc-heading">
              Starter<br />
              Plan
            </h3>

            <div className="fc-price-block">
              <span className="fc-price">$49</span>
              <span className="fc-price-label">one-time</span>
            </div>
            <div className="fc-price-after">
              Pay once. Yours forever. No renewals.
            </div>

            <div className="fc-pills">
              <span className="fc-pill fc-pill--slots">
                <svg viewBox="0 0 24 24" className="fc-pill-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                Unlimited Spots
              </span>
              <span className="fc-pill-divider" />
              <span className="fc-pill fc-pill--renew">
                <svg viewBox="0 0 24 24" className="fc-pill-icon"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" /></svg>
                Pay Once, Yours Forever
              </span>
            </div>

            <div className="fc-features">
              <span className="fc-features-label">Get</span>
              {starterFeatures.map(f => (
                <span key={f} className="fc-tag">{f}</span>
              ))}
            </div>

            <button type="button" className="fc-btn fc-btn--starter" onClick={() => gate('starter', () => setFlexiblePlan('starter'))}>
              Get Started
              <svg viewBox="0 0 24 24" className="fc-btn-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>

            <div className="fc-guarantee">
              <svg viewBox="0 0 24 24" className="fc-guarantee-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
              <span>14-Day — <strong>Money Back Guarantee</strong></span>
            </div>
          </div>

          {/* ════════════ FREE CARD (new) ════════════ */}
          <div className="fc-card fc-card--free">
            <div className="fc-ribbon fc-ribbon--free">Free Forever</div>

            <h3 className="fc-heading">
              Free<br />
              Plan
            </h3>

            <div className="fc-price-block">
              <span className="fc-price">$0</span>
              <span className="fc-price-label">forever</span>
            </div>
            <div className="fc-price-after">
              No card required. List instantly.
            </div>

            <div className="fc-pills">
              <span className="fc-pill fc-pill--slots">
                <svg viewBox="0 0 24 24" className="fc-pill-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                Unlimited
              </span>
              <span className="fc-pill-divider" />
              <span className="fc-pill fc-pill--renew">
                <svg viewBox="0 0 24 24" className="fc-pill-icon"><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
                Upgrade Anytime
              </span>
            </div>

            <div className="fc-features">
              <span className="fc-features-label">Get</span>
              {freeFeatures.map(f => (
                <span key={f} className="fc-tag">{f}</span>
              ))}
            </div>

            <button type="button" className="fc-btn fc-btn--free" onClick={() => gate('free', () => goToForm('free'))}>
              Get Started Free
              <svg viewBox="0 0 24 24" className="fc-btn-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>

            <div className="fc-guarantee">
              <svg viewBox="0 0 24 24" className="fc-guarantee-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
              <span>No Credit Card — <strong>Upgrade Later</strong></span>
            </div>
          </div>
        </div>

        <a href="https://infowebworld.com" className="fc-brand" target="_blank" rel="noopener noreferrer">
          InfoWebWorld.com
          <svg viewBox="0 0 24 24" className="fc-brand-arrow"><path d="M7 17L17 7M7 7h10v10" /></svg>
        </a>
      </div>

      {/* Payment Modal — Lifetime + Early Adopter (unchanged) */}
      {modalPlan && (
        <PaymentModal
          isOpen={!!modalPlan}
          onClose={() => setModalPlan(null)}
          plan={modalPlan}
        />
      )}

      {/* Flexible Modal — Free + Starter */}
      {flexiblePlan && (
        <FlexibleModal
          isOpen={!!flexiblePlan}
          onClose={() => setFlexiblePlan(null)}
          plan={flexiblePlan}
        />
      )}

      {/* Signup gate — opens when a not-yet-signed-in user clicks any plan.
          Lands them directly on the listing form for their chosen plan. */}
      <SignupModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        nextUrl={`/dashboard/new?plan=${authPlan}`}
      />
    </section>
  )
}
