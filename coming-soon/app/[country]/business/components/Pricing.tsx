'use client'
import { useState, useEffect, Fragment } from 'react'
import Link from '../../../components/CountryLink'
import { fetchConfig } from '../../../config/site-config'
import PaymentModal from './PaymentModal'
import FlexibleModal from './FlexibleModal'
import { STARTER_ROWS, FREE_ROWS } from './planGating'

type PlanKey = 'lifetime' | 'yearly'
type FlexibleKey = 'free' | 'starter'

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
  const [modalPlan, setModalPlan] = useState<PlanKey | null>(null)
  const [flexiblePlan, setFlexiblePlan] = useState<FlexibleKey | null>(null)
  const [slots, setSlots] = useState({ ltEx: false, yrEx: false })
  useEffect(() => {
    fetchConfig().then(c => setSlots({
      ltEx: c.lifetimeSlotsClaimed >= c.lifetimeSlotsTotal,
      yrEx: c.yearlySlotsClaimed >= c.yearlySlotsTotal,
    }))
  }, [])

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
            {!slots.ltEx && <div className="pr-col-slash"><span className="fc-strikethrough">$999</span> after Pioneer pre-launch window</div>}
            <button type="button" className="pr-col-btn pr-col-btn--primary" onClick={() => setModalPlan('lifetime')}>Claim Lifetime Spot</button>
          </div>

          <div className="pr-col-head pr-col-head--yr">
            <div className="pr-col-name">Early Adopter Plan</div>
            <div className="pr-col-desc">Flexible Membership</div>
            <div className="pr-col-price"><span>$</span>{slots.yrEx ? '239' : '99'}</div>
            <div className="pr-col-period">per year Locked Forever</div>
            {!slots.yrEx && <div className="pr-col-slash"><span className="fc-strikethrough">$239/yr</span> after Pioneer pre-launch window</div>}
            <button type="button" className="pr-col-btn pr-col-btn--secondary" onClick={() => setModalPlan('yearly')}>Get Started</button>
          </div>

          <div className="pr-col-head pr-col-head--st">
            <div className="pr-col-name">Starter Plan</div>
            <div className="pr-col-desc">Pay Once, Yours Forever</div>
            <div className="pr-col-price"><span>$</span>49</div>
            <div className="pr-col-period">one-time</div>
            <div className="pr-col-slash">no renewals · 14-day refund</div>
            <button type="button" className="pr-col-btn pr-col-btn--starter" onClick={() => setFlexiblePlan('starter')}>Get Starter</button>
          </div>

          <div className="pr-col-head pr-col-head--fr">
            <div className="pr-col-name">Free Plan</div>
            <div className="pr-col-desc">Basic Listing</div>
            <div className="pr-col-price"><span>$</span>0</div>
            <div className="pr-col-period">forever</div>
            <div className="pr-col-slash">no card required</div>
            <button type="button" className="pr-col-btn pr-col-btn--free" onClick={() => setFlexiblePlan('free')}>Get Started</button>
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

        {/* ── Fade + CTA ── */}
        <div className="pr-preview-fade">
          <div className="pr-preview-fade-inner">
            <span className="pr-preview-count">
              +{hiddenCount} more features across {sections.length} categories
            </span>
            <Link href="/plans" className="pr-view-all-link">
              View All {totalFeatures}+ Features
              <svg viewBox="0 0 24 24" className="pr-view-all-arrow"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Payment Modal — Lifetime + Early Adopter */}
      {modalPlan && (
        <PaymentModal
          isOpen={!!modalPlan}
          onClose={() => setModalPlan(null)}
          plan={modalPlan}
        />
      )}

      {/* Flexible Modal — Free + Starter */}
      {flexiblePlan && (
        <FlexibleModal
          isOpen={!!flexiblePlan}
          onClose={() => setFlexiblePlan(null)}
          plan={flexiblePlan}
        />
      )}
    </section>
  )
}
