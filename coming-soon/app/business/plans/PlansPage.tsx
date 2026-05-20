'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import FoundingCTA from '../components/FoundingCTA'
import FeatureComparison, { type AnyPlan } from '../components/FeatureComparison'
import SignupModal from '../../components/auth/SignupModal'
import { useAuth } from '@/lib/use-auth'

const checkoutUrl = (plan: AnyPlan) => `/dashboard/new/checkout?plan=${plan}`

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" className="pln-faq-chevron">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

/* ── FAQ data ── */
const faqs = [
  {
    q: 'What is the difference between the Lifetime and Yearly plans?',
    a: 'The Business plan is a one-time payment of $239 that gives you permanent access to all features forever — no renewals, no price increases. The Pro plan costs $99 per year with the same feature set, renewed annually. Both plans include every feature in our comparison table.',
  },
  {
    q: 'Can I upgrade from Pro to Business later?',
    a: 'Absolutely. You can upgrade from the Pro plan to the Business plan at any time. Your existing listing, reviews, and analytics data will carry over seamlessly. Contact our support team and we will handle the transition for you.',
  },
  {
    q: 'Is there a free plan or trial available?',
    a: 'We offer a free basic listing that includes a company profile, category placement, and a permanent dofollow backlink. Premium plans unlock advanced features like analytics, lead generation, priority placement, and verified badges. You can start free and upgrade whenever you are ready.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual or lifetime payments. All transactions are processed securely through our payment partners.',
  },
  {
    q: 'Do I get a refund if I am not satisfied?',
    a: 'Yes. We offer a 30-day money-back guarantee on both plans. If you are not completely satisfied with the value InfoWebWorld provides, contact our support team within 30 days of purchase for a full refund — no questions asked.',
  },
]

export default function PlansPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [authPlan, setAuthPlan] = useState<AnyPlan>('free')
  const { user, loading: authLoading } = useAuth()

  /** Anon → open signup modal (lands on checkout post-auth). Authed → hard
   *  navigate straight to the checkout page for the chosen plan. */
  const choosePlan = useCallback((plan: AnyPlan) => {
    if (authLoading) return
    if (!user) {
      setAuthPlan(plan)
      setAuthOpen(true)
      return
    }
    window.location.href = checkoutUrl(plan)
  }, [user, authLoading])

  return (
    <main className="pln-page">
      {/* ════════════════════════════════════════════
          PAGE TITLE
         ════════════════════════════════════════════ */}
      <section className="pln-title">
        <div className="container">
          <div className="pln-title-tag">Plans & Pricing for Business Listings</div>
          <h1 className="pln-title-heading">
            One Platform<em>.</em> Four Plans<em>.</em><br />
            List Your Business for <em>Global Growth</em>
          </h1>
          <p className="pln-title-desc">
            Pick your plan and get the full power of InfoWebWorld.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOUNDING CTA — plan cards
         ════════════════════════════════════════════ */}
      <div className="pln-founding-wrap">
        <FoundingCTA />
      </div>

      {/* ════════════════════════════════════════════
          HERO
         ════════════════════════════════════════════ */}
      <section className="pln-hero">
        <div className="container">
          <h2 className="pln-hero-heading">
            Simple <em>&amp;</em> transparent<br />
            pricing for every business
          </h2>
          <p className="pln-hero-desc">
            Whether you are a startup or an established brand, our plans give you
             access to every feature. Pick the billing that works for you.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURE COMPARISON — grid layout
         ════════════════════════════════════════════ */}
      <FeatureComparison onChoosePlan={choosePlan} />

      {/* ════════════════════════════════════════════
          FAQ
         ════════════════════════════════════════════ */}
      <section className="pln-faq">
        <div className="container">
          <h2 className="pln-faq-heading">Frequently Asked Questions</h2>
          <div className="pln-faq-list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`pln-faq-item${openFaq === i ? ' pln-faq-item--open' : ''}`}
              >
                <button
                  type="button"
                  className="pln-faq-trigger"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="pln-faq-q">{faq.q}</span>
                  <ChevronDown />
                </button>
                <div className="pln-faq-body">
                  <p className="pln-faq-a">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FINAL CTA BANNER
         ════════════════════════════════════════════ */}
      <section className="pln-cta-banner">
        <div className="container pln-cta-inner">
          <h2 className="pln-cta-heading">Ready to grow your business?</h2>
          <p className="pln-cta-desc">
            Join thousands of businesses on InfoWebWorld. Lock in your founding
            member spot before prices increase.
          </p>
          <div className="pln-cta-btns">
            <button type="button" className="pr-plan-btn pr-plan-btn--primary" onClick={() => choosePlan('lifetime')}>Claim Lifetime Spot</button>
            <Link href="/contact" className="pr-plan-btn pr-plan-btn--secondary">Talk to Us</Link>
          </div>
        </div>
      </section>
      {/* Signup gate — opens for anon users. Lands them on the checkout page
          for their chosen plan after signup/login. */}
      <SignupModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        nextUrl={checkoutUrl(authPlan)}
      />
    </main>
  )
}
