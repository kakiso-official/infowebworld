'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '../../DashboardHeader'
import { PLAN_FEATURE_SECTIONS, planIncludesRow, type PaidPlanKey } from '../../../business/components/planFeatures'
import { STARTER_ROWS } from '../../../business/components/planGating'

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  || 'AcVEK9s17rxgOj1JTpZ0Cp94PIA_ghK8nGnPcWXdL7wpH-cfdw5-5jETY84-Tib3QKCZbzPU1xYLH7Fx'

type PaidPlan = PaidPlanKey

interface PlanInfo {
  label: string
  tagline: string
  amount: number
  amountDisplay: string
  period: string
  description: string
  paypalDescription: string
  guarantee: string
}

const PLAN_INFO: Record<PaidPlan, PlanInfo> = {
  starter: {
    label: 'Starter',
    tagline: 'SEO-ready listing with reviews + backlink',
    amount: 49,
    amountDisplay: '$49',
    period: 'one-time',
    description: 'Everything in Free, plus pricing tiers, FAQs, rich key features and reviews — paid once, listing is yours forever.',
    paypalDescription: 'InfoWebWorld — Starter Plan',
    guarantee: '14-day refund if your listing is not approved.',
  },
  yearly: {
    label: 'Early Adopter',
    tagline: 'Full listing — leads, analytics and premium tools',
    amount: 99,
    amountDisplay: '$99',
    period: '/ year',
    description: 'Complete platform access. Lead capture, analytics, compliance and awards — billed yearly, renewal locked at $99 for life.',
    paypalDescription: 'InfoWebWorld — Early Adopter Plan',
    guarantee: 'Cancel anytime. 30-day money-back guarantee.',
  },
  lifetime: {
    label: 'Lifetime Founding',
    tagline: 'Every premium feature unlocked, forever',
    amount: 239,
    amountDisplay: '$239',
    period: 'one-time',
    description: 'One payment, lifetime access. Every field, every section, every future premium feature included — no renewals, no price increases.',
    paypalDescription: 'InfoWebWorld — Lifetime Founding Plan',
    guarantee: '30-day money-back guarantee. No questions asked.',
  },
}

interface Props {
  plan: PaidPlan
  userEmail: string
  userName: string
}

/**
 * Two-column checkout: plan summary on the left, payment card with PayPal
 * Buttons on the right. Mobile collapses to a single stacked column.
 *
 * After PayPal capture succeeds, POSTs to /api/paypal/capture to record the
 * purchase, then redirects to /dashboard/new?plan=<plan>.
 */
export default function CheckoutClient({ plan, userEmail }: Props) {
  const info = PLAN_INFO[plan]
  const router = useRouter()

  const [paypalReady, setPaypalReady] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<string | null>(null)
  const paypalRef = useRef<HTMLDivElement>(null)
  const renderedRef = useRef<string>('')

  /* Load PayPal SDK once. */
  useEffect(() => {
    if (document.getElementById('paypal-sdk')) { setPaypalReady(true); return }
    const s = document.createElement('script')
    s.id = 'paypal-sdk'
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`
    s.onload = () => setPaypalReady(true)
    s.onerror = () => setError('Failed to load payment system. Please refresh.')
    document.head.appendChild(s)
  }, [])

  /* Render PayPal Buttons once SDK ready. Re-renders when plan changes. */
  useEffect(() => {
    if (!paypalReady || !paypalRef.current || success) return
    if (renderedRef.current === plan) return
    // @ts-expect-error PayPal SDK loaded globally
    const paypal = window.paypal
    if (!paypal) return

    paypalRef.current.innerHTML = ''
    renderedRef.current = plan

    paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay', height: 46 },
      createOrder: (_d: unknown, actions: { order: { create: (o: unknown) => Promise<string> } }) =>
        actions.order.create({
          purchase_units: [{
            description: info.paypalDescription,
            amount: { currency_code: 'USD', value: info.amount.toFixed(2) },
          }],
        }),
      onApprove: async (
        _d: { orderID: string },
        actions: { order: { capture: () => Promise<{ id: string }> } },
      ) => {
        setPaying(true); setError('')
        try {
          const details = await actions.order.capture()
          /* Persist purchase against the user's account so the gate clears. */
          const res = await fetch('/api/paypal/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan, orderId: details.id, amount: info.amount }),
          })
          if (!res.ok) {
            setError('Payment captured but could not be recorded. Contact support with order ' + details.id)
          } else {
            setSuccess(details.id)
          }
        } catch {
          setError('Payment capture failed. Please try again.')
        }
        setPaying(false)
      },
      onError: () => setError('Payment failed. Please try again.'),
      onCancel: () => setError('Payment was cancelled.'),
    }).render(paypalRef.current)
  }, [paypalReady, plan, success, info])

  const handleContinue = () => router.push(`/dashboard/new?plan=${plan}`)

  if (success) {
    return (
      <div className="dc">
        <DashboardHeader
          title="Payment successful"
          subtitle="Your plan is active. Continue to the listing form."
          breadcrumb={{
            trail: [
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'New listing', href: '/dashboard/new' },
            ],
            current: 'Checkout',
          }}
        />
        <div className="dc-success">
          <div className="dc-success-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="36" height="36">
              <path d="M5 12l5 5 9-11" fill="none" stroke="currentColor"
                strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="dc-success-title">You&apos;re in</h2>
          <p className="dc-success-desc">
            Your <strong>{info.label}</strong> plan is now active.
          </p>
          <div className="dc-success-meta">
            <div className="dc-success-row">
              <span className="dc-success-label">Plan</span>
              <span className="dc-success-val">{info.label} · {info.amountDisplay} {info.period}</span>
            </div>
            <div className="dc-success-row">
              <span className="dc-success-label">Order ID</span>
              <span className="dc-success-val">{success}</span>
            </div>
            <div className="dc-success-row">
              <span className="dc-success-label">Receipt sent to</span>
              <span className="dc-success-val">{userEmail}</span>
            </div>
          </div>
          <button type="button" className="dc-btn dc-btn--primary" onClick={handleContinue}>
            Continue to listing form
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dc">
      <DashboardHeader
        title={`Checkout — ${info.label}`}
        subtitle={info.tagline}
        breadcrumb={{
          trail: [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'New listing', href: '/dashboard/new' },
          ],
          current: 'Checkout',
        }}
      />

      <div className="dc-grid">
        {/* ───────── Plan summary card ───────── */}
        <section className="dc-card dc-summary">
          <div className="dc-summary-tag">{info.label}</div>
          <h2 className="dc-summary-title">{info.tagline}</h2>
          <p className="dc-summary-desc">{info.description}</p>

          <div className="dc-summary-divider" />

          <div className="dc-summary-section-label">Everything you get</div>
          {PLAN_FEATURE_SECTIONS.map(section => {
            const includedRows = section.rows.filter(r => planIncludesRow(plan, r, STARTER_ROWS))
            if (includedRows.length === 0) return null
            return (
              <div key={section.title} className="dc-feat-group">
                <h3 className="dc-feat-group-title">
                  {section.title}
                  <span className="dc-feat-group-count">{includedRows.length}</span>
                </h3>
                <ul className="dc-summary-bullets">
                  {includedRows.map(row => (
                    <li key={row}>
                      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                        <path d="M5 12l5 5 9-11" fill="none" stroke="currentColor"
                          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{row}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}

          <div className="dc-summary-divider" />

          <div className="dc-summary-guarantee">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none"
                stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor"
                strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{info.guarantee}</span>
          </div>
        </section>

        {/* ───────── Payment card ───────── */}
        <aside className="dc-card dc-pay">
          <div className="dc-pay-row">
            <span className="dc-pay-label">{info.label} plan</span>
            <span className="dc-pay-amount">{info.amountDisplay}</span>
          </div>
          <div className="dc-pay-row dc-pay-row--muted">
            <span>Billing</span>
            <span>{info.period}</span>
          </div>
          <div className="dc-pay-divider" />
          <div className="dc-pay-row dc-pay-row--total">
            <span className="dc-pay-total-label">Total due today</span>
            <span className="dc-pay-total-amount">{info.amountDisplay} <span className="dc-pay-currency">USD</span></span>
          </div>

          <div className="dc-pay-paypal">
            {paying ? (
              <div className="dc-pay-loading">
                <svg viewBox="0 0 24 24" width="18" height="18" className="dc-spinner" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" fill="none" stroke="currentColor"
                    strokeWidth="2.2" strokeLinecap="round" />
                </svg>
                Processing payment…
              </div>
            ) : (
              <div ref={paypalRef}>
                {!paypalReady && <div className="dc-pay-loading">Loading payment options…</div>}
              </div>
            )}
          </div>

          {error && <p className="dc-pay-error">{error}</p>}

          <div className="dc-pay-secure">
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="1.7" />
            </svg>
            Secure checkout powered by PayPal
          </div>
        </aside>
      </div>
    </div>
  )
}
