'use client'

import { useState, useEffect, useRef } from 'react'

const PAYPAL_CLIENT_ID = 'ARGXO-MMxMj9R4KyB4dxQNN2X5Nkb4d1ziv-9srFlUN5g-SnoJ18Dp5ER_nj9V0aFZihZf533bfGIPTd'

export default function PaymentTestPage() {
  const [paypalReady, setPaypalReady] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'cancelled'>('idle')
  const [orderId, setOrderId] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const paypalRef = useRef<HTMLDivElement>(null)
  const rendered = useRef(false)

  useEffect(() => {
    if (document.getElementById('paypal-sdk')) { setPaypalReady(true); return }
    const s = document.createElement('script')
    s.id = 'paypal-sdk'
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`
    s.onload = () => setPaypalReady(true)
    s.onerror = () => { setStatus('error'); setErrorMsg('Failed to load PayPal SDK') }
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    if (!paypalReady || !paypalRef.current || rendered.current) return
    rendered.current = true

    // @ts-expect-error PayPal SDK loaded globally
    const paypal = window.paypal
    if (!paypal) return

    paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay', height: 48 },
      createOrder: (_d: unknown, actions: { order: { create: (o: unknown) => Promise<string> } }) =>
        actions.order.create({
          purchase_units: [{
            description: 'InfoWebWorld — Payment Test ($0.10)',
            amount: { currency_code: 'USD', value: '0.10' },
          }],
        }),
      onApprove: async (_d: { orderID: string }, actions: { order: { capture: () => Promise<{ id: string; status: string }> } }) => {
        setStatus('loading')
        try {
          const details = await actions.order.capture()
          setOrderId(details.id)
          setStatus('success')
        } catch {
          setStatus('error')
          setErrorMsg('Payment capture failed.')
        }
      },
      onError: () => { setStatus('error'); setErrorMsg('Payment failed. Please try again.') },
      onCancel: () => setStatus('cancelled'),
    }).render(paypalRef.current)
  }, [paypalReady])

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
          background: '#FEF3C7', border: '1px solid #F59E0B', color: '#92400E',
          fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.06em',
          marginBottom: '1rem',
        }}>
          Sandbox Test
        </div>

        <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 800, color: '#1A1A1A', marginBottom: '.5rem' }}>
          Payment Test
        </h1>
        <p style={{ fontSize: '.9rem', color: '#5C5C5C', marginBottom: '1.5rem' }}>
          Pay <strong style={{ color: '#E8553D', fontSize: '1.1em' }}>$0.10</strong> via PayPal Sandbox
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
              Payment Successful!
            </h2>
            <p style={{ fontSize: '.85rem', color: '#15803D', marginBottom: '.25rem' }}>
              <strong>$0.10</strong> captured successfully.
            </p>
            <p style={{ fontSize: '.7rem', color: '#15803D', opacity: .6 }}>
              Order ID: {orderId}
            </p>
            <button
              onClick={() => { setStatus('idle'); rendered.current = false }}
              style={{
                marginTop: '1rem', padding: '.5rem 1.5rem', borderRadius: 999,
                border: '1.5px solid #1A1A1A', background: '#fff', color: '#1A1A1A',
                fontSize: '.8rem', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Test Again
            </button>
          </div>
        ) : status === 'loading' ? (
          <div style={{ padding: '2rem', color: '#5C5C5C', fontSize: '.85rem' }}>
            Processing payment...
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
                Payment cancelled. Try again below.
              </p>
            )}
            <div ref={paypalRef} style={{ maxWidth: 380, margin: '0 auto' }}>
              {!paypalReady && (
                <p style={{ padding: '1rem', color: '#9A9590', fontSize: '.8rem' }}>Loading PayPal...</p>
              )}
            </div>
          </>
        )}

        <p style={{ marginTop: '1.25rem', fontSize: '.65rem', color: '#9A9590' }}>
          This is a sandbox test. No real money is charged.
        </p>
      </div>
    </main>
  )
}
