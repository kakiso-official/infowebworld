'use client'
import { useState, useEffect, useRef, Fragment } from 'react'

const PAYPAL_CLIENT_ID = 'ARGXO-MMxMj9R4KyB4dxQNN2X5Nkb4d1ziv-9srFlUN5g-SnoJ18Dp5ER_nj9V0aFZihZf533bfGIPTd'

type PlanKey = 'lifetime' | 'yearly'

const Ck = () => (
  <svg viewBox="0 0 24 24" className="pr-ck"><path d="M20 6 9 17l-5-5" /></svg>
)

const sections = [
  {
    title: 'Business Listing Features',
    rows: [
      'Business Information Profile & Listing', 'Live within 48 hours — Human Edited',
      'Build Your Brand', 'Detailed Business Information: Logo, Description, etc.',
      'Information Page Customisation', 'Product / Tool Name Title & Tagline',
      'Products / Tools Description', 'Product Links (Web, App Store, etc.)',
      'Pricing Info / Plans Display', 'Photo / Media Gallery', 'Video Embed',
      'Launch Multiple Tools, Releases, Sections', 'Custom URLs on Directory Pages',
      'Use Cases / Case Studies', 'Pros & Cons / SWOT Display',
      'Quick Actions — Custom CTA Buttons', 'Social Links (Twitter/X)',
      'Personal Profiles / Bio — Founders, Team', 'Alternatives Section — Select up to 5',
      'Target Keywords', 'Keyword Tags', 'Multi Category Listing',
      'Listing by Location — Global and Local', 'Multi Location Listing — Country & City Level',
      'Promote Seasonal & Special Offers', 'Business Dashboard — Manage Everything',
    ],
  },
  {
    title: 'Discovery & Visibility',
    rows: [
      'Category Listings — Prime Spots', 'Featured Category Ranking / Top Spots',
      'Search Result Priority / Above Non-Verified', 'Home Page Visibility (Just Landed Section)',
      'Featured in Comparison (Side-by-Side)', 'Alternatives Section',
      'Search Engine Visibility Increased', 'Schema-marked Business Profiles',
      'Promote Your InfoWebWorld Pages', 'Premium Placement',
      'Desired Sections Placement', 'Permanent Dofollow Backlink — Google SEO',
    ],
  },
  {
    title: 'GEO, AEO — Citations',
    rows: [
      'Listing by Location — Global and Local', 'Local Business Listings — NAPs',
      'All Sub-level Countries Listing (Optional)', 'News Spotlight Article',
      'Newsletter Mentions & Feature', 'Social Proofs — Shared on Our Social Networks',
    ],
  },
  { title: 'Lead Management', rows: [
    'Performance Overview', 'Respond to Messages', 'Connect to High-Intent Visitors',
    'Request Quote (RFQ)', 'No Competitors on Your Profile', 'No Third-Party Ads on Your Profile',
    'Featured in Alternatives — Competition Removed', 'View Profiles of Visitors / Active Buyers',
    'Local NAP Optimisation for Quality Leads', 'Get Leads — Easy Direct Connect',
  ]},
  { title: 'Reviews & Reputation', rows: [
    'Get Verified Reviews — Build Confidence', 'AI-Powered Reviews Summary',
    'Respond to Reviews', 'AI-Powered Reply to Reviews', 'Suspicious Reviews — Flag It',
    'InfoWebWorld Verification Badge', 'Marketing Assets', 'Website Widgets',
    'GEO, AEO — Citation for Trust', 'Featured in AI-Powered Recommendation Engine',
    'Pros & Cons Generated in Business Page', 'Social Assets — Share on Your Social Networks',
    'Product of the Day / Week / Month Badge', 'Leaderboard Badges: Top Rated / Visited / Bookmarked',
  ]},
  { title: 'Community & Engagement', rows: [
    'Follower System', 'Direct Messaging', 'Community Bookmark Collections',
    'Votes', 'Comments', 'Q&A', 'Badges & Awards',
  ]},
  { title: 'Analytics & Insights', rows: [
    'Real-Time Analytics Dashboard', 'AI-Powered Summary', 'Traffic Analytics',
    'Visitor Source Tracking', '365 Days Data', 'Competitor Analysis',
    'KPI Metrics — Leads, Views, Reviews', 'View Visitor Profiles',
    'Search Engagement Reports', 'View Profiles of Bookmarked Intent Visitors',
    'Detailed Analytics — Assured ROI',
  ]},
  { title: 'Support & Admin', rows: [
    'Email Support & Help Center', 'Live Chat', 'Dedicated Support Rep',
    'Expert Implementation & Strategic Support', 'User Logins',
    'Single Sign-On (SSO)', 'Additional Business Domains for Purchase',
  ]},
]

const totalFeatures = sections.reduce((n, s) => n + s.rows.length, 0)
const previewRows = sections[0].rows.slice(0, 10)
const hiddenCount = totalFeatures - 10

export default function Pricing() {
  const [activePlan, setActivePlan] = useState<PlanKey | null>(null)
  const [paypalReady, setPaypalReady] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ plan: PlanKey; orderId: string } | null>(null)

  const lifetimeRef = useRef<HTMLDivElement>(null)
  const yearlyRef = useRef<HTMLDivElement>(null)
  const renderedRef = useRef<string>('')

  /* ── Load PayPal SDK ── */
  useEffect(() => {
    if (document.getElementById('paypal-sdk')) { setPaypalReady(true); return }
    const s = document.createElement('script')
    s.id = 'paypal-sdk'
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`
    s.onload = () => setPaypalReady(true)
    s.onerror = () => setError('Failed to load payment system.')
    document.head.appendChild(s)
  }, [])

  /* ── Render PayPal buttons ── */
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
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay', height: 40 },
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
    <section className="pr-section" id="pricing">
      <div className="container">
        <h2 className="pr-heading">
          Simple <em>&</em> transparent<br />
          pricing for every business
        </h2>

        <div className="pr-cols">
          {/* ── Card headers row ── */}
          <div className="pr-col-spacer" />

          <div className="pr-col-head pr-col-head--lt">
            <div className="pr-col-badge">Most Popular</div>
            <div className="pr-col-name">Lifetime Plan</div>
            <div className="pr-col-desc">Elite Founding Business</div>
            <div className="pr-col-price"><span>$</span>240</div>
            <div className="pr-col-period">one-time, forever</div>
            <div className="pr-col-slash"><span className="fc-strikethrough">$999</span> after</div>

            {success?.plan === 'lifetime' ? (
              <div className="pr-paid-badge">
                <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
                Paid
              </div>
            ) : (
              <button type="button" className="pr-col-btn pr-col-btn--primary" onClick={() => togglePlan('lifetime')}>
                Claim Lifetime Spot
              </button>
            )}

            {activePlan === 'lifetime' && (
              <div className="pr-paypal">
                {paying ? (
                  <div className="pr-paypal-msg">Processing...</div>
                ) : (
                  <div ref={lifetimeRef}>
                    {!paypalReady && <div className="pr-paypal-msg">Loading...</div>}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pr-col-head pr-col-head--yr">
            <div className="pr-col-name">Yearly Plan</div>
            <div className="pr-col-desc">Flexible Membership</div>
            <div className="pr-col-price"><span>$</span>99</div>
            <div className="pr-col-period">per year</div>
            <div className="pr-col-slash"><span className="fc-strikethrough">$240/yr</span> after</div>

            {success?.plan === 'yearly' ? (
              <div className="pr-paid-badge pr-paid-badge--yr">
                <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
                Paid
              </div>
            ) : (
              <button type="button" className="pr-col-btn pr-col-btn--secondary" onClick={() => togglePlan('yearly')}>
                Get Started
              </button>
            )}

            {activePlan === 'yearly' && (
              <div className="pr-paypal">
                {paying ? (
                  <div className="pr-paypal-msg">Processing...</div>
                ) : (
                  <div ref={yearlyRef}>
                    {!paypalReady && <div className="pr-paypal-msg">Loading...</div>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Feature rows — first 10 only ── */}
          <div className="pr-col-cat">{sections[0].title}</div>
          <div className="pr-col-cat-cell pr-col-cat-cell--lt" />
          <div className="pr-col-cat-cell pr-col-cat-cell--yr" />

          {previewRows.map((row, ri) => (
            <Fragment key={row}>
              <div className="pr-col-row">{row}</div>
              <div className={`pr-col-check pr-col-check--lt${ri === previewRows.length - 1 ? ' pr-col-check--last' : ''}`}><Ck /></div>
              <div className={`pr-col-check pr-col-check--yr${ri === previewRows.length - 1 ? ' pr-col-check--last' : ''}`}><Ck /></div>
            </Fragment>
          ))}
        </div>

        {/* Error message */}
        {error && <p className="pr-pay-error">{error}</p>}

        {/* Success banner */}
        {success && (
          <div className="pr-pay-success">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            <span>Payment confirmed — <strong>{success.plan === 'lifetime' ? 'Lifetime ($240)' : 'Yearly ($99/yr)'}</strong></span>
            <span className="pr-pay-order">Order: {success.orderId}</span>
          </div>
        )}

        {/* ── Fade + CTA ── */}
        <div className="pr-preview-fade">
          <div className="pr-preview-fade-inner">
            <span className="pr-preview-count">
              +{hiddenCount} more features across {sections.length} categories
            </span>
            <a href="/plans" className="pr-view-all-link">
              View All {totalFeatures}+ Features
              <svg viewBox="0 0 24 24" className="pr-view-all-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
