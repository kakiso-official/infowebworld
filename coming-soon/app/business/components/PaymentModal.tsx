'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchConfig } from '../../config/site-config'

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AcVEK9s17rxgOj1JTpZ0Cp94PIA_ghK8nGnPcWXdL7wpH-cfdw5-5jETY84-Tib3QKCZbzPU1xYLH7Fx'
const features = ['Leads', 'Reviews', 'GEO', 'AEO', 'SEO Backlinks']

interface Props {
  isOpen: boolean
  onClose: () => void
  plan: 'lifetime' | 'yearly'
}

export default function PaymentModal({ isOpen, onClose, plan }: Props) {
  const [paypalReady, setPaypalReady] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<string | null>(null)
  const paypalRef = useRef<HTMLDivElement>(null)
  const renderedRef = useRef<string>('')

  const isLifetime = plan === 'lifetime'

  /* ── Slot-aware pricing ── */
  const [slotsLoaded, setSlotsLoaded] = useState(false)
  const [ltExhausted, setLtExhausted] = useState(false)
  const [yrExhausted, setYrExhausted] = useState(false)

  useEffect(() => {
    fetchConfig().then(c => {
      setLtExhausted(c.lifetimeSlotsClaimed >= c.lifetimeSlotsTotal)
      setYrExhausted(c.yearlySlotsClaimed >= c.yearlySlotsTotal)
      setSlotsLoaded(true)
    })
  }, [])

  const amount = isLifetime ? (ltExhausted ? '999.00' : '239.00') : (yrExhausted ? '239.00' : '99.00')
  const displayPrice = isLifetime ? (ltExhausted ? '999' : '239') : (yrExhausted ? '239' : '99')
  const afterPrice = isLifetime ? (ltExhausted ? null : '$999') : (yrExhausted ? null : '$239/yr')

  /* ── Reset when modal opens ── */
  useEffect(() => {
    if (isOpen) {
      setError('')
      setSuccess(null)
      renderedRef.current = ''
    }
  }, [isOpen, plan])

  /* ── Lock body scroll ── */
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* ── Close on Escape ── */
  useEffect(() => {
    if (!isOpen) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [isOpen, onClose])

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

  /* ── Render PayPal buttons ── */
  useEffect(() => {
    if (!isOpen || !paypalReady || !paypalRef.current || success || !slotsLoaded) return
    if (renderedRef.current === plan) return

    // @ts-expect-error PayPal SDK loaded globally
    const paypal = window.paypal
    if (!paypal) return

    paypalRef.current.innerHTML = ''
    renderedRef.current = plan

    const desc = isLifetime
      ? 'InfoWebWorld — Elite Lifetime Founding Plan'
      : 'InfoWebWorld — Early Adopter Plan'

    paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay', height: 48 },
      createOrder: (_d: unknown, actions: { order: { create: (o: unknown) => Promise<string> } }) =>
        actions.order.create({
          purchase_units: [{ description: desc, amount: { currency_code: 'USD', value: amount } }],
        }),
      onApprove: async (_d: { orderID: string }, actions: { order: { capture: () => Promise<{ id: string }> } }) => {
        setPaying(true)
        setError('')
        try {
          const details = await actions.order.capture()
          const planSlug = isLifetime ? 'lifetime' : 'yearly'
          // Claim the founding slot
          try {
            await fetch('/api/slots/claim', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ plan: planSlug }),
            })
          } catch {}
          /* Record the purchase against the authed user (if any) so the
             dashboard's paid-plan gate clears. Silently no-ops for anon. */
          try {
            await fetch('/api/paypal/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ plan: planSlug, orderId: details.id, amount: Number(amount) }),
            })
          } catch {}
          setSuccess(details.id)
        } catch {
          setError('Payment capture failed. Please try again.')
        }
        setPaying(false)
      },
      onError: () => setError('Payment failed. Please try again.'),
      onCancel: () => setError('Payment was cancelled.'),
    }).render(paypalRef.current)
  }, [isOpen, paypalReady, plan, success, isLifetime, slotsLoaded, amount])

  /* ── After payment, open the listing form panel ── */
  const handleSubmitListing = useCallback(() => {
    onClose()
    setTimeout(() => {
      const a = document.createElement('a')
      a.href = `/business?plan=${plan}`
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }, 150)
  }, [onClose, plan])

  if (!isOpen) return null

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-card" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button className="pm-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        {success ? (
          /* ════════ SUCCESS STATE ════════ */
          <div className="pm-success">
            <div className="pm-success-icon">
              <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
            <h3 className="pm-success-title">Payment Successful!</h3>
            <p className="pm-success-desc">
              Your <strong>{isLifetime ? `Lifetime ($${displayPrice})` : `Yearly ($${displayPrice}/yr)`}</strong> plan has been confirmed.
            </p>
            <p className="pm-success-order">Order ID: {success}</p>
            <button type="button" className="pm-submit-btn" onClick={handleSubmitListing}>
              Submit Your Listing
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        ) : (
          /* ════════ PAYMENT STATE ════════ */
          <>
            {/* Plan tag */}
            <div className={`pm-tag${isLifetime ? '' : ' pm-tag--yr'}`}>
              {isLifetime ? 'Best Value — Lifetime' : 'Flexible — Yearly'}
            </div>

            {/* Plan heading */}
            <h3 className="pm-title">
              {isLifetime ? 'Elite Lifetime Founding Business Plan' : 'Early Adopter Plan'}
            </h3>

            {/* Price */}
            <div className="pm-price-row">
              <span className="pm-price">${displayPrice}</span>
              <span className="pm-period">{isLifetime ? 'one-time' : '/year Locked Forever'}</span>
            </div>
            {afterPrice && (
              <div className="pm-strike">
                <span className="pm-strike-price">{afterPrice}</span> after Pioneer window
              </div>
            )}

            <div className="pm-divider" />

            {/* Features */}
            <div className="pm-features">
              {features.map(f => (
                <span key={f} className="pm-feature">
                  <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
                  {f}
                </span>
              ))}
            </div>

            <div className="pm-divider" />

            {/* PayPal */}
            <div className="pm-paypal">
              {paying ? (
                <div className="pm-loading">
                  <svg viewBox="0 0 24 24" className="pm-spinner"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                  Processing payment...
                </div>
              ) : (
                <div ref={paypalRef}>
                  {!paypalReady && <div className="pm-loading">Loading payment options...</div>}
                </div>
              )}
            </div>

            {error && <p className="pm-error">{error}</p>}

            {/* Guarantee */}
            <div className="pm-guarantee">
              <svg viewBox="0 0 24 24" className="pm-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
              <span>{isLifetime ? '6 Months — ' : 'Lead , CTA\'s — '}<strong>{isLifetime ? 'Money Back Guarantee' : 'Less , Renewal is Free'}</strong></span>
            </div>

            <p className="pm-secure">
              <svg viewBox="0 0 24 24" className="pm-lock-icon"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              Secure checkout powered by PayPal
            </p>
          </>
        )}
      </div>
    </div>
  )
}
