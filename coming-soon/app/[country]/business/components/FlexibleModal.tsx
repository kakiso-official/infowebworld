'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AcVEK9s17rxgOj1JTpZ0Cp94PIA_ghK8nGnPcWXdL7wpH-cfdw5-5jETY84-Tib3QKCZbzPU1xYLH7Fx'

interface Props {
  isOpen: boolean
  onClose: () => void
  plan: 'free' | 'starter'
}

/**
 * Modal for the two flexible plans. Separate from PaymentModal which
 * carries the Founding Lifetime + Early Adopter offers.
 *
 * - Free: no PayPal. Success confirmation → open listing form.
 * - Starter: PayPal one-time payment ($49 lifetime). Real money, same
 *   order flow as Elite Lifetime, just a different amount.
 */
export default function FlexibleModal({ isOpen, onClose, plan }: Props) {
  const [paypalReady, setPaypalReady] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<string | null>(null)
  const paypalRef = useRef<HTMLDivElement>(null)
  const renderedRef = useRef<string>('')

  const isFree = plan === 'free'
  const isStarter = plan === 'starter'

  const displayPrice = isFree ? '0' : '49'
  const amount = isFree ? '0.00' : '49.00'
  const period = isFree ? 'forever' : 'one-time'
  const title = isFree ? 'Free Plan' : 'Starter Plan'
  const tagText = isFree ? 'Free — Basic Listing' : 'Pay Once — Yours Forever'
  const features = isFree
    ? ['Basic Listing', 'Public Profile', 'Social Links', '1 Category']
    : ['DoFollow Backlink', 'Verified Reviews', 'Custom URL', 'FAQ Section', 'Basic Analytics']

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

  /* ── Load PayPal one-time SDK (Starter only). Shares the script id with
        PaymentModal so we don't double-load the same SDK. ── */
  useEffect(() => {
    if (!isOpen || isFree) return
    if (document.getElementById('paypal-sdk')) { setPaypalReady(true); return }
    const s = document.createElement('script')
    s.id = 'paypal-sdk'
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`
    s.onload = () => setPaypalReady(true)
    s.onerror = () => setError('Failed to load payment system. Please refresh.')
    document.head.appendChild(s)
  }, [isOpen, isFree])

  /* ── Render PayPal buttons (Starter one-time) ── */
  useEffect(() => {
    if (!isOpen || !isStarter || !paypalReady || !paypalRef.current || success) return
    if (renderedRef.current === plan) return

    // @ts-expect-error PayPal SDK loaded globally
    const paypal = window.paypal
    if (!paypal) return

    paypalRef.current.innerHTML = ''
    renderedRef.current = plan

    paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay', height: 48 },
      createOrder: (_d: unknown, actions: { order: { create: (o: unknown) => Promise<string> } }) =>
        actions.order.create({
          purchase_units: [{
            description: 'InfoWebWorld — Starter Plan (Lifetime)',
            amount: { currency_code: 'USD', value: amount },
          }],
        }),
      onApprove: async (_d: { orderID: string }, actions: { order: { capture: () => Promise<{ id: string }> } }) => {
        setPaying(true)
        setError('')
        try {
          const details = await actions.order.capture()
          setSuccess(details.id)
        } catch {
          setError('Payment capture failed. Please try again.')
        }
        setPaying(false)
      },
      onError: () => setError('Payment failed. Please try again.'),
      onCancel: () => setError('Payment was cancelled.'),
    }).render(paypalRef.current)
  }, [isOpen, isStarter, paypalReady, plan, success, amount])

  /* ── Continue (Free: skip payment, Starter: after successful order) ── */
  const handleContinue = useCallback(() => {
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
        <button className="pm-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        {success || isFree ? (
          /* ════════ SUCCESS / FREE STATE ════════ */
          <div className="pm-success">
            <div className="pm-success-icon">
              <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
            <h3 className="pm-success-title">
              {isFree ? 'Ready to list for free' : 'Payment Successful!'}
            </h3>
            <p className="pm-success-desc">
              {isFree
                ? 'Your free basic listing is one form away. No payment required.'
                : <>Your <strong>Starter Plan ($49 lifetime)</strong> is confirmed.</>}
            </p>
            {success && <p className="pm-success-order">Order ID: {success}</p>}
            <button type="button" className="pm-submit-btn" onClick={handleContinue}>
              {isFree ? 'Continue to Listing Form' : 'Submit Your Listing'}
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        ) : (
          /* ════════ STARTER PAYMENT STATE ════════ */
          <>
            <div className="pm-tag pm-tag--yr">{tagText}</div>

            <h3 className="pm-title">{title}</h3>

            <div className="pm-price-row">
              <span className="pm-price">${displayPrice}</span>
              <span className="pm-period">{period}</span>
            </div>

            <div className="pm-divider" />

            <div className="pm-features">
              {features.map(f => (
                <span key={f} className="pm-feature">
                  <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
                  {f}
                </span>
              ))}
            </div>

            <div className="pm-divider" />

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

            <div className="pm-guarantee">
              <svg viewBox="0 0 24 24" className="pm-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
              <span>14-Day — <strong>Money Back Guarantee</strong></span>
            </div>

            <p className="pm-secure">
              <svg viewBox="0 0 24 24" className="pm-lock-icon"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              Secure one-time payment powered by PayPal. No renewals.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
