'use client'
import { useState, useEffect, useCallback, Fragment } from 'react'
import Link from 'next/link'
import { fetchConfig } from '../../config/site-config'
import PaymentModal from '../components/PaymentModal'
import FoundingCTA from '../components/FoundingCTA'
import FlexibleModal from '../components/FlexibleModal'
import { STARTER_ROWS, FREE_ROWS } from '../components/planGating'
import SignupModal from '../../components/auth/SignupModal'
import { useAuth } from '@/lib/use-auth'

type PlanKey = 'lifetime' | 'yearly'
type FlexibleKey = 'free' | 'starter'
type AnyPlan = 'free' | 'starter' | 'yearly' | 'lifetime'

/* ── Icons ── */
const Ck = () => (
  <svg viewBox="0 0 24 24" className="pr-ck"><path d="M20 6 9 17l-5-5" /></svg>
)
const ChevronDown = () => (
  <svg viewBox="0 0 24 24" className="pln-faq-chevron">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

/* ── Feature sections — word-for-word from Growth Platform Excel ── */
const sections = [
  {
    title: 'Business Listing Features',
    rows: [
      'Business Information Profile & Listing',
      'Human curation for business listing',
      'Detailed Business Information: Logo, Description, Founding Year, etc',
      'Profile Page Customisation (Colours, Layout)',
      'Product / Service / Tool Name Title & Tagline',
      'Product / Service / Tool Description',
      'Product Links (Website, App Store, Play Store)',
      'Pricing Info / Plans display',
      'Photo / Media Gallery',
      'Video Embed (YouTube, Vimeo, Loom)',
      'Multiple Product / Tool Launches - Releases Section',
      'Custom / Vanity URL on Directory Pages',
      'Use Cases / Case Studies',
      'Pros & Cons / SWOT - Display',
      'Quick-Action CTA Buttons (RFQ, Demo, Visit Website, Review, Testimonial, Message, Call)',
      'Social Media Links (X, Facebook, LinkedIn, Instagram, Reddit)',
      'Team & Founder Profiles / Bios',
      'Alternatives Comparison Section - Select upto 3',
      'Target Keywords & Keyword Tags',
      'Multi Category listing',
      'Listing by Location - Global and Local / Country and City/Area',
      'Promote Seasonal & Special offers',
      'Business Dashboard - Manage everything at one place',
      'API Access for Listing Management',
      'Multilingual Listing Support',
      'FAQ Section on Listing Page',
      'Integration / Tech Stack Display',
    ],
  },
  {
    title: 'Discovery & Visibility',
    rows: [
      'Listing Indexed faster',
      'Category Listings — Prime Placement',
      'Featured Ranking / Top Spots in Category Pages',
      'Search Result Priority / Above Non-Verified Providers',
      'Homepage Visibility (Just Landed / Featured Section)',
      'Featured in Side-by-Side Comparisons',
      'Alternatives Comparison Section',
      'Enhanced Search Engine Visibility (SEO Optimised Profile)',
      'Schema Markup (Structured Data) on Business Profiles',
      'Promotional Tools for Your InfoWebWorld Listing',
      'Premium Placement on Directory Pages',
      'Permanent DoFollow Backlink to Your Website - Google SEO Juice',
      'GEO & AEO Citation (AI Engine Optimisation)',
      'Listing by Location - Global and Local',
      'Local Business Listings — NAP (Name, Address, Phone)',
      'News Spotlight Article',
      'Newsletter Mentions & Feature Inclusion',
      'Social Proof — Listing Shared on iWW Social Channels',
    ],
  },
  {
    title: 'Lead Management',
    rows: [
      'Performance overview (Leads Dashboard)',
      'Ai Lead Insights',
      'Respond to visitor messages',
      'Manage RFQ, Demo, Visit Website, Review, Testimonial, Message, Call',
      'Competitor Ads/ listings Removed from Your Profile',
      'Third-Party Ads Removed from Your Profile',
      'View Visitor / Active Buyer Profiles',
      'View users comparing competition alternatives',
      'Lead Notification Alerts (Email & In-App)',
    ],
  },
  {
    title: 'Reviews & Reputation — Credibility & Trust',
    rows: [
      'Collect Verified Reviews — Build Brand Confidence',
      'Photo & Video Reviews from Users',
      'AI-Powered Review Summary & Sentiment Analysis',
      'Respond to Reviews (Owner Replies)',
      'AI-Assisted Reply Drafts for Reviews',
      'Flag Suspicious / Fake Reviews',
      'InfoWebWorld Verified Badge',
      'Marketing Assets (Badges, Banners, Email Signatures)',
      'Embeddable Review Widgets for Your Website',
      'Review Invitation Tool (Email / Link to Request Reviews)',
      'Featured in AI-powered recommendation infoWebWorld engine',
      'Auto-Generated Pros & Cons on Listing Page',
      'Social Sharing Assets (Share Reviews on Social Media)',
      'Product of the Day / Week / Month Badge',
      'Leaderboard Badges (Top Rated, Most Visited, Most Bookmarked)',
    ],
  },
  {
    title: 'Community & Engagement',
    rows: [
      'Follower system',
      'Community Bookmark Collections',
      'Upvotes / Likes on Listings',
      'User Comments on Listing Pages',
      'Q&A Section',
      'Badges & Awards for users',
      'User-Generated Content (Tips, Tutorials, Guides)',
    ],
  },
  {
    title: 'Analytics & Insights',
    rows: [
      'Real-Time Analytics Dashboard',
      'AI-Powered Analytics Summary & Recommendations',
      'Traffic Analytics (Page Views, Unique Visitors)',
      'Visitor Source Tracking (Organic, Social, Direct, Referral)',
      'Historical Data Retention — Up to 365 Days',
      'Competitor Benchmarking & Analysis',
      'KPI Metrics Dashboard (Leads, Views, Reviews, CTR)',
      'Search Engagement Reports (Impressions, Click-Through)',
      'View Profiles of Users Who Bookmarked Your Listing',
      'Monthly Analytics Report (Email PDF)',
      'Conversion Tracking (CTA Clicks, RFQ Submissions)',
      'Heatmap / Engagement Map on Profile Page',
    ],
  },
  {
    title: 'Support & Admin',
    rows: [
      'Email Support & Help Centre Access',
      'AI Chatbot Support (24/7)',
      'Dedicated Account Contact',
      'Expert Onboarding & Strategic Profile Setup',
      'Team User Logins (Multi-User Access)',
      'Additional Business Listings - Separate Domains (Paid Add-On)',
      'Priority Bug Fixes & Feature Requests',
    ],
  },
]

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
  const [modalPlan, setModalPlan] = useState<PlanKey | null>(null)
  const [flexiblePlan, setFlexiblePlan] = useState<FlexibleKey | null>(null)
  const [slots, setSlots] = useState({ ltEx: false, yrEx: false })
  const [authOpen, setAuthOpen] = useState(false)
  const [authPlan, setAuthPlan] = useState<AnyPlan>('free')
  const [mobileTab, setMobileTab] = useState<AnyPlan>('lifetime')
  const { user, loading: authLoading } = useAuth()

  /** True when `plan` includes feature `row`. Premium plans include everything;
      Starter / Free are gated by the planGating sets. */
  const planHas = (plan: AnyPlan, row: string): boolean => {
    if (plan === 'lifetime' || plan === 'yearly') return true
    if (plan === 'starter') return STARTER_ROWS.has(row)
    return FREE_ROWS.has(row)
  }

  useEffect(() => {
    fetchConfig().then(c => setSlots({
      ltEx: c.lifetimeSlotsClaimed >= c.lifetimeSlotsTotal,
      yrEx: c.yearlySlotsClaimed >= c.yearlySlotsTotal,
    }))
  }, [])

  /** Anon → open signup modal with plan-aware nextUrl; authed → run action. */
  const gate = useCallback((plan: AnyPlan, action: () => void) => {
    if (authLoading) return
    if (!user) {
      setAuthPlan(plan)
      setAuthOpen(true)
      return
    }
    action()
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
      <section className="pr-section">
        <div className="container">
          <h2 className="pln-table-heading">Full Feature Comparison</h2>

          {/* ── Mobile-only: tabs + filtered checklist (replaces the wide desktop table on phones) ── */}
          <div className="pln-mcompare">
            {(() => {
              const META = {
                lifetime: { cls: 'lt' as const, label: 'Lifetime',  short: 'LT', name: 'Elite Lifetime Founding', desc: 'Recommended For Businesses', price: slots.ltEx ? '999' : '239', period: 'one-time, forever',  badge: 'Recommend',
                  slash: !slots.ltEx ? <><span className="fc-strikethrough">$999</span> after Pioneer pre-launch window</> : null,
                  btnLabel: 'Claim Lifetime Spot', btnCls: 'pr-col-btn--primary', onClick: () => gate('lifetime', () => setModalPlan('lifetime')) },
                yearly:   { cls: 'yr' as const, label: 'Yearly',    short: 'YR', name: 'Early Adopter',           desc: 'Flexible Membership',         price: slots.yrEx ? '239' : '99',  period: 'per year Locked Forever', badge: null,
                  slash: !slots.yrEx ? <><span className="fc-strikethrough">$239/yr</span> after Pioneer pre-launch window</> : null,
                  btnLabel: 'Get Started',          btnCls: 'pr-col-btn--secondary', onClick: () => gate('yearly', () => setModalPlan('yearly')) },
                starter:  { cls: 'st' as const, label: 'Starter',   short: 'ST', name: 'Starter Plan',            desc: 'Pay Once, Yours Forever',     price: '49',                       period: 'one-time',                badge: null,
                  slash: 'no renewals · 14-day refund' as React.ReactNode,
                  btnLabel: 'Get Starter',          btnCls: 'pr-col-btn--starter',   onClick: () => gate('starter', () => setFlexiblePlan('starter')) },
                free:     { cls: 'fr' as const, label: 'Free',      short: 'FR', name: 'Free Plan',               desc: 'Basic Listing',               price: '0',                        period: 'forever',                 badge: null,
                  slash: 'no card required' as React.ReactNode,
                  btnLabel: 'Get Started',          btnCls: 'pr-col-btn--free',      onClick: () => gate('free', () => setFlexiblePlan('free')) },
              }
              const m = META[mobileTab]
              const isGated = mobileTab === 'starter' || mobileTab === 'free'
              const includedCount = sections.reduce((n, s) => n + s.rows.filter(r => planHas(mobileTab, r)).length, 0)
              const totalCount = sections.reduce((n, s) => n + s.rows.length, 0)
              const missingCount = totalCount - includedCount

              return (
                <>
                  {/* Sticky plan tabs */}
                  <div className="pln-mtabs" role="tablist" aria-label="Choose a plan">
                    {(['lifetime', 'yearly', 'starter', 'free'] as const).map(k => {
                      const t = META[k]
                      const active = mobileTab === k
                      return (
                        <button
                          key={k}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          className={`pln-mtab pln-mtab--${t.cls} ${active ? 'is-active' : ''}`}
                          onClick={() => setMobileTab(k)}
                        >
                          <span className="pln-mtab-label">{t.label}</span>
                          <span className="pln-mtab-price">${t.price}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Selected plan summary */}
                  <article className={`pln-msel pln-msel--${m.cls}`}>
                    {m.badge && <span className="pln-msel-badge">{m.badge}</span>}
                    <h3 className="pln-msel-name">{m.name}</h3>
                    <p className="pln-msel-desc">{m.desc}</p>
                    <div className="pln-msel-price"><span>$</span>{m.price}</div>
                    <div className="pln-msel-period">{m.period}</div>
                    {m.slash && <div className="pln-msel-slash">{m.slash}</div>}
                    <button type="button" className={`pr-col-btn ${m.btnCls} pln-msel-btn`} onClick={m.onClick}>
                      {m.btnLabel}
                    </button>
                    <div className="pln-msel-meta">
                      <span className="pln-msel-meta-yes">{includedCount} features included</span>
                      {missingCount > 0 && <span className="pln-msel-meta-no">+{missingCount} more in higher plans</span>}
                    </div>
                  </article>

                  {/* Included features, grouped by section */}
                  <div className="pln-mlist">
                    {sections.map(sec => {
                      const visibleRows = sec.rows.filter(r => planHas(mobileTab, r))
                      if (visibleRows.length === 0) return null
                      return (
                        <section key={sec.title} className="pln-msec">
                          <h4 className="pln-msec-title">{sec.title}</h4>
                          <ul className="pln-msec-list">
                            {visibleRows.map(r => (
                              <li key={r} className="pln-msec-row">
                                <span className={`pln-msec-mark pln-msec-mark--${m.cls}`}><Ck /></span>
                                <span className="pln-msec-name">{r}</span>
                              </li>
                            ))}
                          </ul>
                        </section>
                      )
                    })}
                  </div>

                  {/* For gated plans, show what they'd unlock by upgrading */}
                  {isGated && missingCount > 0 && (
                    <div className="pln-mexcl">
                      <header className="pln-mexcl-head">
                        <h4 className="pln-mexcl-title">Not in {m.label} — unlock with Lifetime / Yearly</h4>
                        <p className="pln-mexcl-sub">{missingCount} more features available on premium plans.</p>
                      </header>
                      <div className="pln-mlist pln-mlist--dim">
                        {sections.map(sec => {
                          const missingRows = sec.rows.filter(r => !planHas(mobileTab, r))
                          if (missingRows.length === 0) return null
                          return (
                            <section key={sec.title} className="pln-msec pln-msec--dim">
                              <h5 className="pln-msec-title pln-msec-title--dim">{sec.title}</h5>
                              <ul className="pln-msec-list">
                                {missingRows.map(r => (
                                  <li key={r} className="pln-msec-row pln-msec-row--locked">
                                    <span className="pln-msec-lock">
                                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="5" y="11" width="14" height="9" rx="2" />
                                        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                                      </svg>
                                    </span>
                                    <span className="pln-msec-name">{r}</span>
                                  </li>
                                ))}
                              </ul>
                            </section>
                          )
                        })}
                      </div>
                      <button
                        type="button"
                        className="pr-col-btn pr-col-btn--primary pln-mexcl-cta"
                        onClick={() => { setMobileTab('lifetime') }}
                      >
                        See full Lifetime plan
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )
            })()}
          </div>

          <div className="pr-cols-scroll">
          <div className="pr-cols pr-cols--4plans">
            {/* Card headers */}
            <div className="pr-col-spacer" />
            <div className="pr-col-head pr-col-head--lt">
              <div className="pr-col-badge">Recommend</div>
              <div className="pr-col-name">Elite Lifetime Founding Business Plan</div>
              <div className="pr-col-desc">Recommended For Businesses</div>
              <div className="pr-col-price"><span>$</span>{slots.ltEx ? '999' : '239'}</div>
              <div className="pr-col-period">one-time, forever</div>
              {!slots.ltEx && <div className="pr-col-slash"><span className="fc-strikethrough">$999</span> after Pioneer pre-launch window</div>}
              <button type="button" className="pr-col-btn pr-col-btn--primary" onClick={() => gate('lifetime', () => setModalPlan('lifetime'))}>Claim Lifetime Spot</button>
            </div>
            <div className="pr-col-head pr-col-head--yr">
              <div className="pr-col-name">Early Adopter Plan</div>
              <div className="pr-col-desc">Flexible Membership</div>
              <div className="pr-col-price"><span>$</span>{slots.yrEx ? '239' : '99'}</div>
              <div className="pr-col-period">per year Locked forever</div>
              {!slots.yrEx && <div className="pr-col-slash"><span className="fc-strikethrough">$239/yr</span> after Pioneer pre-launch window</div>}
              <button type="button" className="pr-col-btn pr-col-btn--secondary" onClick={() => gate('yearly', () => setModalPlan('yearly'))}>Get Started</button>
            </div>
            <div className="pr-col-head pr-col-head--st">
              <div className="pr-col-name">Starter Plan</div>
              <div className="pr-col-desc">Pay Once, Yours Forever</div>
              <div className="pr-col-price"><span>$</span>49</div>
              <div className="pr-col-period">one-time</div>
              <div className="pr-col-slash">no renewals · 14-day refund</div>
              <button type="button" className="pr-col-btn pr-col-btn--starter" onClick={() => gate('starter', () => setFlexiblePlan('starter'))}>Get Starter</button>
            </div>
            <div className="pr-col-head pr-col-head--fr">
              <div className="pr-col-name">Free Plan</div>
              <div className="pr-col-desc">Basic Listing</div>
              <div className="pr-col-price"><span>$</span>0</div>
              <div className="pr-col-period">forever</div>
              <div className="pr-col-slash">no card required</div>
              <button type="button" className="pr-col-btn pr-col-btn--free" onClick={() => gate('free', () => setFlexiblePlan('free'))}>Get Started</button>
            </div>

            {/* Feature rows */}
            {sections.map((sec, si) => (
              <Fragment key={sec.title}>
                <div className="pr-col-cat">{sec.title}</div>
                <div className="pr-col-cat-cell pr-col-cat-cell--lt" />
                <div className="pr-col-cat-cell pr-col-cat-cell--yr" />
                <div className="pr-col-cat-cell pr-col-cat-cell--st" />
                <div className="pr-col-cat-cell pr-col-cat-cell--fr" />

                {sec.rows.map((row, ri) => {
                  const isLast = si === sections.length - 1 && ri === sec.rows.length - 1
                  const hasStarter = STARTER_ROWS.has(row)
                  const hasFree = FREE_ROWS.has(row)
                  return (
                    <Fragment key={row}>
                      <div className="pr-col-row">{row}</div>
                      <div className={`pr-col-check pr-col-check--lt${isLast ? ' pr-col-check--last' : ''}`}><Ck /></div>
                      <div className={`pr-col-check pr-col-check--yr${isLast ? ' pr-col-check--last' : ''}`}><Ck /></div>
                      <div className={`pr-col-check pr-col-check--st${isLast ? ' pr-col-check--last' : ''}`}>
                        {hasStarter ? <Ck /> : <span className="pr-col-dash">—</span>}
                      </div>
                      <div className={`pr-col-check pr-col-check--fr${isLast ? ' pr-col-check--last' : ''}`}>
                        {hasFree ? <Ck /> : <span className="pr-col-dash">—</span>}
                      </div>
                    </Fragment>
                  )
                })}
              </Fragment>
            ))}
          </div>
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
            <button type="button" className="pr-plan-btn pr-plan-btn--primary" onClick={() => gate('lifetime', () => setModalPlan('lifetime'))}>Claim Lifetime Spot</button>
            <Link href="/contact" className="pr-plan-btn pr-plan-btn--secondary">Talk to Us</Link>
          </div>
        </div>
      </section>
      {/* Payment Modal (Lifetime + Early Adopter) — unchanged */}
      {modalPlan && (
        <PaymentModal
          isOpen={!!modalPlan}
          onClose={() => setModalPlan(null)}
          plan={modalPlan}
        />
      )}

      {/* Flexible Modal (Free + Starter) */}
      {flexiblePlan && (
        <FlexibleModal
          isOpen={!!flexiblePlan}
          onClose={() => setFlexiblePlan(null)}
          plan={flexiblePlan}
        />
      )}

      {/* Signup gate — opens when an anon user clicks any plan button.
          Lands them on /dashboard/new?plan=X after signup/login. */}
      <SignupModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        nextUrl={`/dashboard/new?plan=${authPlan}`}
      />
    </main>
  )
}
