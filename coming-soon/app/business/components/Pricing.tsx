'use client'
import { useState, useEffect, useCallback, Fragment } from 'react'
import Link from 'next/link'
import { fetchConfig } from '../../config/site-config'
import SignupModal from '../../components/auth/SignupModal'
import { useAuth } from '@/lib/use-auth'
import { STARTER_ROWS, FREE_ROWS } from './planGating'

type AnyPlan = 'free' | 'starter' | 'yearly' | 'lifetime'

const checkoutUrl = (plan: AnyPlan) => `/dashboard/new/checkout?plan=${plan}`

const Ck = () => (
  <svg viewBox="0 0 24 24" className="pr-ck"><path d="M20 6 9 17l-5-5" /></svg>
)

const sections = [
  {
    title: 'Business Listing Features',
    rows: [
      'Business Information Profile & Listing',
      'human curation for business listing',
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

const totalFeatures = sections.reduce((n, s) => n + s.rows.length, 0)
const previewRows = sections[0].rows.slice(0, 10)
const hiddenCount = totalFeatures - 10

export default function Pricing() {
  const [slots, setSlots] = useState({ ltEx: false, yrEx: false })
  const [authOpen, setAuthOpen] = useState(false)
  const [authPlan, setAuthPlan] = useState<AnyPlan>('free')
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    fetchConfig().then(c => setSlots({
      ltEx: c.lifetimeSlotsClaimed >= c.lifetimeSlotsTotal,
      yrEx: c.yearlySlotsClaimed >= c.yearlySlotsTotal,
    }))
  }, [])

  /** Anon → open signup modal with checkout-aware nextUrl. Authed → hard nav
   *  straight to the checkout page for the chosen plan. */
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
    <section className="pr-section" id="pricing">
      <div className="container">
        <h2 className="pr-heading">
          Simple <em>&</em> transparent<br />
          pricing for every business
        </h2>

        <div className="pr-cols-scroll">
        <div className="pr-cols pr-cols--4plans">
          {/* ── Card headers row ── */}
          <div className="pr-col-spacer" />

          <div className="pr-col-head pr-col-head--lt">
            <div className="pr-col-badge">Recommend</div>
            <div className="pr-col-name">Elite Founding Business Plan</div>
            <div className="pr-col-desc">Recommended For Businesses</div>
            <div className="pr-col-price"><span>$</span>{slots.ltEx ? '999' : '239'}</div>
            <div className="pr-col-period">one-time, forever</div>
            {!slots.ltEx && <div className="pr-col-slash"><span className="fc-strikethrough">$999</span> after the launch offer</div>}
            <button type="button" className="pr-col-btn pr-col-btn--primary" onClick={() => choosePlan('lifetime')}>Claim Lifetime Spot</button>
          </div>

          <div className="pr-col-head pr-col-head--yr">
            <div className="pr-col-name">Early Adopter Plan</div>
            <div className="pr-col-desc">Flexible Membership</div>
            <div className="pr-col-price"><span>$</span>{slots.yrEx ? '239' : '99'}</div>
            <div className="pr-col-period">per year Locked Forever</div>
            {!slots.yrEx && <div className="pr-col-slash"><span className="fc-strikethrough">$239/yr</span> after the launch offer</div>}
            <button type="button" className="pr-col-btn pr-col-btn--secondary" onClick={() => choosePlan('yearly')}>Get Started</button>
          </div>

          <div className="pr-col-head pr-col-head--st">
            <div className="pr-col-name">Starter Plan</div>
            <div className="pr-col-desc">Pay Once, Yours Forever</div>
            <div className="pr-col-price"><span>$</span>49</div>
            <div className="pr-col-period">one-time</div>
            <div className="pr-col-slash">no renewals · 14-day refund</div>
            <button type="button" className="pr-col-btn pr-col-btn--starter" onClick={() => choosePlan('starter')}>Get Starter</button>
          </div>

          <div className="pr-col-head pr-col-head--fr">
            <div className="pr-col-name">Free Plan</div>
            <div className="pr-col-desc">Basic Listing</div>
            <div className="pr-col-price"><span>$</span>0</div>
            <div className="pr-col-period">forever</div>
            <div className="pr-col-slash">no card required</div>
            <button type="button" className="pr-col-btn pr-col-btn--free" onClick={() => choosePlan('free')}>Get Started</button>
          </div>

          {/* ── Feature rows — first 10 only ── */}
          <div className="pr-col-cat">{sections[0].title}</div>
          <div className="pr-col-cat-cell pr-col-cat-cell--lt" />
          <div className="pr-col-cat-cell pr-col-cat-cell--yr" />
          <div className="pr-col-cat-cell pr-col-cat-cell--st" />
          <div className="pr-col-cat-cell pr-col-cat-cell--fr" />

          {previewRows.map((row, ri) => {
            const isLast = ri === previewRows.length - 1
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
        </div>
        </div>

        {/* ── Mobile-only stacked cards (replaces the horizontal-scroll table on phones) ── */}
        <div className="pr-mstack" aria-label="Pricing plans">
          {([
            { key: 'lt', badge: 'Recommend', name: 'Elite Founding Business Plan',
              desc: 'Recommended For Businesses',
              price: slots.ltEx ? '999' : '239', period: 'one-time, forever',
              slash: !slots.ltEx ? <><span className="fc-strikethrough">$999</span> after the launch offer</> : null,
              btnLabel: 'Claim Lifetime Spot', btnCls: 'pr-col-btn--primary',
              onClick: () => choosePlan('lifetime'), has: () => true },
            { key: 'yr', badge: null, name: 'Early Adopter Plan',
              desc: 'Flexible Membership',
              price: slots.yrEx ? '239' : '99', period: 'per year Locked Forever',
              slash: !slots.yrEx ? <><span className="fc-strikethrough">$239/yr</span> after the launch offer</> : null,
              btnLabel: 'Get Started', btnCls: 'pr-col-btn--secondary',
              onClick: () => choosePlan('yearly'), has: () => true },
            { key: 'st', badge: null, name: 'Starter Plan',
              desc: 'Pay Once, Yours Forever',
              price: '49', period: 'one-time',
              slash: 'no renewals · 14-day refund',
              btnLabel: 'Get Starter', btnCls: 'pr-col-btn--starter',
              onClick: () => choosePlan('starter'), has: (r: string) => STARTER_ROWS.has(r) },
            { key: 'fr', badge: null, name: 'Free Plan',
              desc: 'Basic Listing',
              price: '0', period: 'forever',
              slash: 'no card required',
              btnLabel: 'Get Started', btnCls: 'pr-col-btn--free',
              onClick: () => choosePlan('free'), has: (r: string) => FREE_ROWS.has(r) },
          ] as const).map(p => (
            <article key={p.key} className={`pr-mcard pr-mcard--${p.key}`}>
              <header className="pr-mcard-head">
                {p.badge && <span className="pr-mcard-badge">{p.badge}</span>}
                <h3 className="pr-mcard-name">{p.name}</h3>
                <p className="pr-mcard-desc">{p.desc}</p>
                <div className="pr-mcard-price"><span>$</span>{p.price}</div>
                <div className="pr-mcard-period">{p.period}</div>
                {p.slash && <div className="pr-mcard-slash">{p.slash}</div>}
                <button type="button" className={`pr-col-btn ${p.btnCls} pr-mcard-btn`} onClick={p.onClick}>
                  {p.btnLabel}
                </button>
              </header>
              <div className="pr-mcard-feats">
                <div className="pr-mcard-feats-title">{sections[0].title}</div>
                <ul className="pr-mcard-feats-list">
                  {previewRows.map(row => {
                    const yes = p.has(row)
                    return (
                      <li key={row} className={`pr-mcard-feat ${yes ? 'is-yes' : 'is-no'}`}>
                        <span className="pr-mcard-feat-mark">
                          {yes ? <Ck /> : <span className="pr-mcard-feat-dash">—</span>}
                        </span>
                        <span className="pr-mcard-feat-name">{row}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* ── Fade + CTA ── */}
        <div className="pr-preview-fade">
          <div className="pr-preview-fade-inner">
            <span className="pr-preview-count">
              +{hiddenCount} more features across {sections.length} categories
            </span>
            <Link href="/business/plans" className="pr-view-all-link">
              View All {totalFeatures}+ Features
              <svg viewBox="0 0 24 24" className="pr-view-all-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Signup gate — opens for anon users. After auth, lands them directly
          on the checkout page for their chosen plan. */}
      <SignupModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        nextUrl={checkoutUrl(authPlan)}
      />
    </section>
  )
}
