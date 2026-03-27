'use client'
import { useState, Fragment } from 'react'
import Link from 'next/link'
import PaymentModal from '../business/components/PaymentModal'
import FoundingCTA from '../business/components/FoundingCTA'

type PlanKey = 'lifetime' | 'yearly'

/* ── Icons ── */
const Ck = () => (
  <svg viewBox="0 0 24 24" className="pr-ck"><path d="M20 6 9 17l-5-5" /></svg>
)
const ChevronDown = () => (
  <svg viewBox="0 0 24 24" className="pln-faq-chevron">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

/* ── Feature sections — same data as /business Pricing ── */
const sections = [
  {
    title: 'Business Listing Features',
    rows: [
      'Business Information Profile & Listing',
      'Live within 48 hours — Human Edited',
      'Build Your Brand',
      'Detailed Business Information: Logo, Description, etc.',
      'Information Page Customisation',
      'Product / Tool Name Title & Tagline',
      'Products / Tools Description',
      'Product Links (Web, App Store, etc.)',
      'Pricing Info / Plans Display',
      'Photo / Media Gallery',
      'Video Embed',
      'Launch Multiple Tools, Releases, Sections',
      'Custom URLs on Directory Pages',
      'Use Cases / Case Studies',
      'Pros & Cons / SWOT Display',
      'Quick Actions — Custom CTA Buttons (RFQ, Demo, Visit, Review, Message)',
      'Social Links (Twitter/X)',
      'Personal Profiles / Bio — Founders, Team',
      'Alternatives Section — Select up to 5',
      'Target Keywords',
      'Keyword Tags',
      'Multi Category Listing',
      'Listing by Location — Global and Local',
      'Multi Location Listing — Country & City Level',
      'Promote Seasonal & Special Offers',
      'Business Dashboard — Manage Everything',
    ],
  },
  {
    title: 'Discovery & Visibility',
    rows: [
      'Category Listings — Prime Spots',
      'Featured Category Ranking / Top Spots',
      'Search Result Priority / Above Non-Verified',
      'Home Page Visibility (Just Landed Section)',
      'Featured in Comparison (Side-by-Side)',
      'Alternatives Section',
      'Search Engine Visibility Increased',
      'Schema-marked Business Profiles',
      'Promote Your InfoWebWorld Pages',
      'Premium Placement',
      'Desired Sections Placement',
      'Permanent Dofollow Backlink — Google SEO',
    ],
  },
  {
    title: 'GEO, AEO — Citations',
    rows: [
      'Listing by Location — Global and Local',
      'Local Business Listings — NAPs',
      'All Sub-level Countries Listing (Optional)',
      'News Spotlight Article',
      'Newsletter Mentions & Feature',
      'Social Proofs — Shared on Our Social Networks',
    ],
  },
  {
    title: 'Lead Management',
    rows: [
      'Performance Overview',
      'Respond to Messages',
      'Connect to High-Intent Visitors',
      'Request Quote (RFQ)',
      'No Competitors on Your Profile',
      'No Third-Party Ads on Your Profile',
      'Featured in Alternatives — Competition Removed',
      'View Profiles of Visitors / Active Buyers',
      'Local NAP Optimisation for Quality Leads',
      'Get Leads — Easy Direct Connect',
    ],
  },
  {
    title: 'Reviews & Reputation',
    rows: [
      'Get Verified Reviews — Build Confidence',
      'AI-Powered Reviews Summary',
      'Respond to Reviews',
      'AI-Powered Reply to Reviews',
      'Suspicious Reviews — Flag It',
      'InfoWebWorld Verification Badge',
      'Marketing Assets',
      'Website Widgets',
      'GEO, AEO — Citation for Trust',
      'Featured in AI-Powered Recommendation Engine',
      'Pros & Cons Generated in Business Page',
      'Social Assets — Share on Your Social Networks',
      'Product of the Day / Week / Month Badge',
      'Leaderboard Badges: Top Rated / Visited / Bookmarked',
    ],
  },
  {
    title: 'Community & Engagement',
    rows: [
      'Follower System',
      'Direct Messaging',
      'Community Bookmark Collections',
      'Votes',
      'Comments',
      'Q&A',
      'Badges & Awards',
    ],
  },
  {
    title: 'Analytics & Insights',
    rows: [
      'Real-Time Analytics Dashboard',
      'AI-Powered Summary',
      'Traffic Analytics',
      'Visitor Source Tracking',
      '365 Days Data',
      'Competitor Analysis',
      'KPI Metrics — Leads, Views, Reviews',
      'View Visitor Profiles',
      'Search Engagement Reports',
      'View Profiles of Bookmarked Intent Visitors',
      'Detailed Analytics — Assured ROI',
    ],
  },
  {
    title: 'Support & Admin',
    rows: [
      'Email Support & Help Center',
      'Live Chat',
      'Dedicated Support Rep',
      'Expert Implementation & Strategic Support',
      'User Logins',
      'Single Sign-On (SSO)',
      'Additional Business Domains for Purchase',
    ],
  },
]

/* ── FAQ data ── */
const faqs = [
  {
    q: 'What is the difference between the Lifetime and Yearly plans?',
    a: 'The Lifetime plan is a one-time payment of $239 that gives you permanent access to all features forever — no renewals, no price increases. The Yearly plan costs $99 per year with the same feature set, renewed annually. Both plans include every feature in our comparison table.',
  },
  {
    q: 'Can I upgrade from Yearly to Lifetime later?',
    a: 'Absolutely. You can upgrade from the Yearly plan to the Lifetime plan at any time. Your existing listing, reviews, and analytics data will carry over seamlessly. Contact our support team and we will handle the transition for you.',
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
  const [billingTab, setBillingTab] = useState<'lifetime' | 'yearly'>('lifetime')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [modalPlan, setModalPlan] = useState<PlanKey | null>(null)

  return (
    <main className="pln-page">
      {/* ════════════════════════════════════════════
          HERO
         ════════════════════════════════════════════ */}
      <section className="pln-hero">
        <div className="container">
          <h1 className="pln-hero-heading">
            Simple <em>&amp;</em> transparent<br />
            pricing for every business
          </h1>
          <p className="pln-hero-desc">
            Whether you are a startup or an established brand, our plans give you
            full access to every feature. Pick the billing that works for you.
          </p>

          {/* Toggle */}
          <div className="pln-toggle-wrap">
            <button
              type="button"
              className={`pln-toggle-btn${billingTab === 'lifetime' ? ' pln-toggle-btn--active' : ''}`}
              onClick={() => setBillingTab('lifetime')}
            >
              Lifetime
            </button>
            <button
              type="button"
              className={`pln-toggle-btn${billingTab === 'yearly' ? ' pln-toggle-btn--active' : ''}`}
              onClick={() => setBillingTab('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOUNDING CTA — plan cards
         ════════════════════════════════════════════ */}
      <FoundingCTA />

      {/* ════════════════════════════════════════════
          FEATURE COMPARISON — grid layout
         ════════════════════════════════════════════ */}
      <section className="pr-section">
        <div className="container">
          <h2 className="pln-table-heading">Full Feature Comparison</h2>

          <div className="pr-cols">
            {/* Card headers */}
            <div className="pr-col-spacer" />
            <div className={`pr-col-head pr-col-head--lt${billingTab === 'lifetime' ? ' pr-col-head--active' : ''}`}>
              <div className="pr-col-badge">Most Popular</div>
              <div className="pr-col-name">Lifetime Plan</div>
              <div className="pr-col-desc">Elite Founding Business</div>
              <div className="pr-col-price"><span>$</span>239</div>
              <div className="pr-col-period">one-time, forever</div>
              <div className="pr-col-slash"><span className="fc-strikethrough">$999</span> after</div>
              <button type="button" className="pr-col-btn pr-col-btn--primary" onClick={() => setModalPlan('lifetime')}>Claim Lifetime Spot</button>
            </div>
            <div className={`pr-col-head pr-col-head--yr${billingTab === 'yearly' ? ' pr-col-head--active' : ''}`}>
              <div className="pr-col-name">Yearly Plan</div>
              <div className="pr-col-desc">Flexible Membership</div>
              <div className="pr-col-price"><span>$</span>99</div>
              <div className="pr-col-period">per year</div>
              <div className="pr-col-slash"><span className="fc-strikethrough">$239/yr</span> after</div>
              <button type="button" className="pr-col-btn pr-col-btn--secondary" onClick={() => setModalPlan('yearly')}>Get Started</button>
            </div>

            {/* Feature rows */}
            {sections.map((sec, si) => (
              <Fragment key={sec.title}>
                <div className="pr-col-cat">{sec.title}</div>
                <div className="pr-col-cat-cell pr-col-cat-cell--lt" />
                <div className="pr-col-cat-cell pr-col-cat-cell--yr" />

                {sec.rows.map((row, ri) => {
                  const isLast = si === sections.length - 1 && ri === sec.rows.length - 1
                  return (
                    <Fragment key={row}>
                      <div className="pr-col-row">{row}</div>
                      <div className={`pr-col-check pr-col-check--lt${isLast ? ' pr-col-check--last' : ''}`}><Ck /></div>
                      <div className={`pr-col-check pr-col-check--yr${isLast ? ' pr-col-check--last' : ''}`}><Ck /></div>
                    </Fragment>
                  )
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

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
            <button type="button" className="pr-plan-btn pr-plan-btn--primary" onClick={() => setModalPlan('lifetime')}>Claim Lifetime Spot</button>
            <Link href="/contact" className="pr-plan-btn pr-plan-btn--secondary">Talk to Us</Link>
          </div>
        </div>
      </section>
      {/* Payment Modal */}
      {modalPlan && (
        <PaymentModal
          isOpen={!!modalPlan}
          onClose={() => setModalPlan(null)}
          plan={modalPlan}
        />
      )}
    </main>
  )
}
