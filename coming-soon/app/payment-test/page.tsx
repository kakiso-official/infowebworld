'use client'

import { useState, useEffect, useRef } from 'react'

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AcVEK9s17rxgOj1JTpZ0Cp94PIA_ghK8nGnPcWXdL7wpH-cfdw5-5jETY84-Tib3QKCZbzPU1xYLH7Fx'

export default function PaymentTestPage() {
  const [planId, setPlanId] = useState<string | null>(null)
  const [sdkReady, setSdkReady] = useState(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'processing' | 'success' | 'error' | 'cancelled'>('loading')
  const [subscriptionId, setSubscriptionId] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const paypalRef = useRef<HTMLDivElement>(null)
  const rendered = useRef(false)

  /* ── Step 1: Fetch plan ID + load SDK in parallel ── */
  useEffect(() => {
    let cancelled = false

    // Fetch plan
    fetch('/api/paypal/subscription-plan')
      .then(r => r.json())
      .then(data => {
        if (!cancelled && data.planId) setPlanId(data.planId)
        else if (!cancelled) { setStatus('error'); setErrorMsg(data.error || 'Failed to get plan') }
      })
      .catch(() => { if (!cancelled) { setStatus('error'); setErrorMsg('Server unreachable') } })

    // Load PayPal SDK for subscriptions
    const scriptId = 'paypal-sdk-sub'
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null
    if (existing) { setSdkReady(true); return }

    // Remove regular SDK if loaded (different intent)
    document.getElementById('paypal-sdk')?.remove()

    const s = document.createElement('script')
    s.id = scriptId
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription&currency=USD`
    s.onload = () => { if (!cancelled) setSdkReady(true) }
    s.onerror = () => { if (!cancelled) { setStatus('error'); setErrorMsg('Failed to load PayPal') } }
    document.head.appendChild(s)

    return () => { cancelled = true }
  }, [])

  /* ── Step 2: Render buttons when both plan + SDK are ready ── */
  useEffect(() => {
    if (!planId || !sdkReady || !paypalRef.current || rendered.current) return

    // @ts-expect-error PayPal SDK loaded globally
    const paypal = window.paypal
    if (!paypal) { setStatus('error'); setErrorMsg('PayPal SDK not available'); return }

    rendered.current = true
    setStatus('ready')

    paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'subscribe', height: 48 },
      createSubscription: (_d: unknown, actions: { subscription: { create: (o: unknown) => Promise<string> } }) =>
        actions.subscription.create({ plan_id: planId }),
      onApprove: (data: { subscriptionID: string }) => {
        setSubscriptionId(data.subscriptionID)
        setStatus('success')
      },
      onError: () => { setStatus('error'); setErrorMsg('Payment failed. Please try again.') },
      onCancel: () => setStatus('cancelled'),
    }).render(paypalRef.current)
  }, [planId, sdkReady])

  const isLoading = status === 'loading' && (!planId || !sdkReady)

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#FAF5F0', fontFamily: 'system-ui, sans-serif', padding: '1rem',
    }}>
      <div style={{
        width: '100%', maxWidth: 440, background: '#fff', borderRadius: 22,
        padding: 'clamp(1.5rem, 5vw, 2.5rem)', boxShadow: '0 20px 60px rgba(0,0,0,.1)',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', padding: '.3rem .85rem', borderRadius: 999,
          background: '#ECFDF5', border: '1px solid #16A34A', color: '#166534',
          fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.06em',
          marginBottom: '1rem',
        }}>
          Live Subscription
        </div>

        <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 800, color: '#1A1A1A', marginBottom: '.5rem' }}>
          Daily Subscription Test
        </h1>
        <p style={{ fontSize: '.9rem', color: '#5C5C5C', marginBottom: '.25rem' }}>
          <strong style={{ color: '#E8553D', fontSize: '1.3em' }}>$0.10</strong> <span style={{ color: '#9A9590' }}>/day</span>
        </p>
        <p style={{ fontSize: '.75rem', color: '#9A9590', marginBottom: '1.5rem' }}>
          Recurring daily — cancel anytime from PayPal
        </p>

        {status === 'success' ? (
          <div style={{ padding: '1.5rem 0' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: '#16A34A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
            }}>
              <svg viewBox="0 0 24 24" width={32} height={32} fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#166534', marginBottom: '.4rem' }}>
              Subscription Active!
            </h2>
            <p style={{ fontSize: '.85rem', color: '#15803D', marginBottom: '.25rem' }}>
              <strong>$0.10/day</strong> will be charged daily.
            </p>
            <p style={{ fontSize: '.7rem', color: '#15803D', opacity: .6 }}>
              Subscription ID: {subscriptionId}
            </p>
            <p style={{ fontSize: '.72rem', color: '#9A9590', marginTop: '.75rem' }}>
              Cancel anytime: PayPal → Settings → Payments → Manage automatic payments
            </p>
          </div>
        ) : (
          <>
            {status === 'error' && (
              <p style={{ color: '#C0392B', fontSize: '.8rem', fontWeight: 600, marginBottom: '.75rem' }}>
                {errorMsg}
              </p>
            )}
            {status === 'cancelled' && (
              <p style={{ color: '#92400E', fontSize: '.8rem', fontWeight: 600, marginBottom: '.75rem' }}>
                Subscription cancelled. Try again below.
              </p>
            )}

            {/* PayPal buttons container — always visible so ref attaches */}
            <div ref={paypalRef} style={{ maxWidth: 380, margin: '0 auto', minHeight: 50 }}>
              {isLoading && (
                <p style={{ padding: '1rem', color: '#9A9590', fontSize: '.8rem' }}>
                  {!planId ? 'Loading plan...' : 'Loading PayPal...'}
                </p>
              )}
            </div>
          </>
        )}

        <p style={{ marginTop: '1.25rem', fontSize: '.65rem', color: '#9A9590' }}>
          Secure recurring payment powered by PayPal.
        </p>
      </div>
    </main>
  )
}
