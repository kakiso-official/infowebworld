'use client'

import { useState, useEffect, useRef } from 'react'
import { fetchConfig } from '../../config/site-config'

const PAYPAL_CLIENT_ID = 'ARGXO-MMxMj9R4KyB4dxQNN2X5Nkb4d1ziv-9srFlUN5g-SnoJ18Dp5ER_nj9V0aFZihZf533bfGIPTd'
const features = ['Leads', 'Reviews', 'GEO', 'AEO', 'SEO Backlinks']

type PlanKey = 'lifetime' | 'yearly'

export default function FoundingCTA() {
  const [cfg, setCfg] = useState({ pioneerJoined: 15, pioneerTotal: 200 })
  const [activePlan, setActivePlan] = useState<PlanKey | null>(null)
  const [paypalReady, setPaypalReady] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ plan: PlanKey; orderId: string } | null>(null)

  const lifetimeRef = useRef<HTMLDivElement>(null)
  const yearlyRef = useRef<HTMLDivElement>(null)
  const renderedRef = useRef<string>('')

  useEffect(() => {
    fetchConfig().then(c => setCfg({ pioneerJoined: c.pioneerJoined, pioneerTotal: c.pioneerTotal }))
  }, [])

  const spotsLeft = cfg.pioneerTotal - cfg.pioneerJoined

  /* ── Load PayPal SDK ── */
  useEffect(() => {
    if (document.getElementById('paypal-sdk')) { setPaypalReady(true); return }
    const s = document.createElement('script')
    s.id = 'paypal-sdk'
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`
    s.onload = () => setPaypalReady(true)
    s.onerror = () => setError('Failed to load payment system. Please refresh.')
    document.head.appendChild(s)
  }, [])

  /* ── Render PayPal buttons when a plan is selected ── */
  useEffect(() => {
    if (!activePlan || !paypalReady) return
    const container = activePlan === 'lifetime' ? lifetimeRef.current : yearlyRef.current
    if (!container) return
    if (renderedRef.current === activePlan) return

    // @ts-expect-error PayPal SDK loaded globally
    const paypal = window.paypal
    if (!paypal) return

    container.innerHTML = ''
    renderedRef.current = activePlan

    const isLifetime = activePlan === 'lifetime'
    const amount = isLifetime ? '240.00' : '99.00'
    const desc = isLifetime
      ? 'InfoWebWorld — Elite Lifetime Founding Plan'
      : 'InfoWebWorld — Yearly Business Plan'

    paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay', height: 45 },
      createOrder: (_d: unknown, actions: { order: { create: (o: unknown) => Promise<string> } }) =>
        actions.order.create({
          purchase_units: [{ description: desc, amount: { currency_code: 'USD', value: amount } }],
        }),
      onApprove: async (_d: { orderID: string }, actions: { order: { capture: () => Promise<{ id: string }> } }) => {
        setPaying(true)
        setError('')
        try {
          const details = await actions.order.capture()
          setSuccess({ plan: activePlan, orderId: details.id })
          setActivePlan(null)
          renderedRef.current = ''
        } catch {
          setError('Payment capture failed. Please try again.')
        }
        setPaying(false)
      },
      onError: () => setError('Payment failed. Please try again.'),
      onCancel: () => setError('Payment was cancelled.'),
    }).render(container)
  }, [activePlan, paypalReady])

  const togglePlan = (plan: PlanKey) => {
    setError('')
    setActivePlan(prev => prev === plan ? null : plan)
    renderedRef.current = ''
  }

  return (
    <section className="fc-section" id="founding">
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
            <div className="fc-badge">Best Value</div>
            <div className="fc-ribbon">Only {spotsLeft} Left</div>

            <h3 className="fc-heading">
              <em>Elite</em> Lifetime<br />
              Founding Business
            </h3>

            <div className="fc-price-block">
              <span className="fc-price">$240</span>
              <span className="fc-price-label fc-price-label--highlight">lifetime</span>
            </div>
            <div className="fc-price-after">
              <span className="fc-strikethrough">$999</span> after Pioneer window
            </div>

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

            <div className="fc-features">
              <span className="fc-features-label">Get</span>
              {features.map(f => (
                <span key={f} className="fc-tag">{f}</span>
              ))}
            </div>

            {/* CTA / Paid badge */}
            {success?.plan === 'lifetime' ? (
              <div className="fc-paid-badge">
                <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
                Paid
              </div>
            ) : (
              <button type="button" className={`fc-btn${activePlan === 'lifetime' ? ' fc-btn--open' : ''}`} onClick={() => togglePlan('lifetime')}>
                Claim Lifetime Spot
                <svg viewBox="0 0 24 24" className="fc-btn-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            )}

            {/* PayPal buttons */}
            {activePlan === 'lifetime' && (
              <div className="fc-paypal">
                {paying ? (
                  <div className="fc-paypal-loading">Processing payment...</div>
                ) : (
                  <div ref={lifetimeRef}>
                    {!paypalReady && <div className="fc-paypal-loading">Loading payment options...</div>}
                  </div>
                )}
              </div>
            )}

            <div className="fc-guarantee">
              <svg viewBox="0 0 24 24" className="fc-guarantee-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
              <span>6 Months — <strong>Money Back Guarantee</strong></span>
            </div>
          </div>

          {/* ════════════ YEARLY CARD ════════════ */}
          <div className="fc-card fc-card--yearly">
            <div className="fc-ribbon fc-ribbon--yearly">Flexible Plan</div>

            <h3 className="fc-heading">
              Yearly Business<br />
              Membership
            </h3>

            <div className="fc-price-block">
              <span className="fc-price">$99</span>
              <span className="fc-price-label">/year</span>
            </div>
            <div className="fc-price-after">
              <span className="fc-strikethrough">$240/yr</span> after Pioneer window
            </div>

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

            <div className="fc-features">
              <span className="fc-features-label">Get</span>
              {features.map(f => (
                <span key={f} className="fc-tag">{f}</span>
              ))}
            </div>

            {/* CTA / Paid badge */}
            {success?.plan === 'yearly' ? (
              <div className="fc-paid-badge fc-paid-badge--yearly">
                <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
                Paid
              </div>
            ) : (
              <button type="button" className={`fc-btn fc-btn--yearly${activePlan === 'yearly' ? ' fc-btn--open' : ''}`} onClick={() => togglePlan('yearly')}>
                Get Started
                <svg viewBox="0 0 24 24" className="fc-btn-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            )}

            {/* PayPal buttons */}
            {activePlan === 'yearly' && (
              <div className="fc-paypal">
                {paying ? (
                  <div className="fc-paypal-loading">Processing payment...</div>
                ) : (
                  <div ref={yearlyRef}>
                    {!paypalReady && <div className="fc-paypal-loading">Loading payment options...</div>}
                  </div>
                )}
              </div>
            )}

            <div className="fc-guarantee">
              <svg viewBox="0 0 24 24" className="fc-guarantee-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
              <span>6 Months — <strong>Money Back Guarantee</strong></span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && <p className="fc-error">{error}</p>}

        {/* Success banner */}
        {success && (
          <div className="fc-success">
            <div className="fc-success-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 className="fc-success-title">Payment Successful!</h3>
            <p className="fc-success-desc">
              Your <strong>{success.plan === 'lifetime' ? 'Lifetime ($240)' : 'Yearly ($99/yr)'}</strong> plan payment has been confirmed.
            </p>
            <p className="fc-success-order">Order ID: {success.orderId}</p>
            <a href="/business" className="fc-btn" style={{ marginTop: '1rem' }}>
              Submit Your Listing
              <svg viewBox="0 0 24 24" className="fc-btn-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        )}

        <a href="https://infowebworld.com" className="fc-brand" target="_blank" rel="noopener noreferrer">
          InfoWebWorld.com
          <svg viewBox="0 0 24 24" className="fc-brand-arrow"><path d="M7 17L17 7M7 7h10v10" /></svg>
        </a>
      </div>
    </section>
  )
}
