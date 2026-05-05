'use client'

import { useEffect, useRef } from 'react'

const ArrowExt = () => (
  <svg viewBox="0 0 24 24" className="bn-ax" aria-hidden="true">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
)

/* Tile icon for each "row" — matches the reference's brand-color square icons.
   Initial letter on a flat colored tile, white text. Index drives colour via
   the card's pastel theme so each row has visual presence. */
const Tile = ({ ch }: { ch: string }) => (
  <span className="bn-tile" aria-hidden="true">{ch}</span>
)

/* ── Same content as before (unchanged copy) ── */
const benefits = [
  {
    title: 'Leads Generation',
    desc: <>Turn Your Listing into a Lead Generation Engine. Capture and convert high-intent buyers effortlessly with powerful lead tools built into your listing. From <strong>RFQ forms and demo requests to direct call / messaging</strong>, connect with prospects at the exact moment they&apos;re ready to engage &mdash; backed by <strong>real-time alerts and actionable insights</strong>.</>,
    num: '#0+/mo',
    pastel: 'bn--coral',
    highlights: ['Unified Lead Dashboard', 'Direct Messaging Inbox', 'Buyer Intent Visibility'],
  },
  {
    title: 'Search & AI Visibility',
    desc: <>Powerful SEO-optimized asset that ranks across <strong> search engines and AI platforms.</strong>With <strong>schema-optimized profiles, permanent high-authority backlinks from a DA / DR, and AI-ready citations, </strong> your business gets maximum visibility where modern buyers are searching — from Google to ChatGPT, Perplexity, and beyond.</>,
    num: 'High DA/DR',
    pastel: 'bn--emerald',
    highlights: ['Fast Indexing', 'Priority Placement & Rankings across platform', 'Local + Global Visibility'],
  },
  {
    title: 'Verified Reviews - Build Trust That Converts',
    desc: <>Turn customer feedback into your strongest growth asset.<strong> Collect verified text, photo, and video reviews, </strong> eliminate fake reviews with AI Anti-Fake detection, and showcase real social proof that drives conversions.</>,
    num: '98% Trust',
    pastel: 'bn--azure',
    highlights: ['AI Reply Drafts', 'Review Invitation Tool', 'Embeddable Review Widgets'],
  },
  {
    title: 'Lifetime Founding Spots',
    desc: <>Lock in lifetime <strong>founding member</strong> pricing. <strong>Pay once, get listed forever</strong> with all premium features included. Limited to first 199 businesses globally — your spot is a long-term asset that compounds value over time.</>,
    num: 'Only 199',
    pastel: 'bn--plum',
    highlights: ['Full refund within 6 months', 'Zero risk — compounding returns', 'Only 199 spots — Pay Once, Yours Forever'],
  },
  {
    title: 'Community Power to Influence',
    desc: <>Your listing doesn&apos;t just get seen — it gets discussed, saved, recommended, and trusted. Build lasting credibility through real user engagement,<strong> social proof signals, and community-driven discovery that influence buying decisions. </strong></>,
    num: '#CommunityDrivenGrowth',
    pastel: 'bn--teal',
    highlights: ['Follower System & Community Bookmark Collections', 'Upvotes, Likes & Popularity Signals', 'Question & Answer Section'],
  },
  {
    title: 'High Intent Global Reach',
    desc: 'Unlimited multi-location listings at country and city level with multilingual support. Local NAP optimization and sub-country regional listings — one profile, truly global presence.',
    num: '100+ Countries',
    pastel: 'bn--amber',
    highlights: ['Unlimited multi-location listings', 'Multilingual listing support', 'Local NAP (Name, Address, Phone)'],
  },
  {
    title: 'Free Renewal Guarantee-Early Adopter',
    desc: <>Not getting the results you expected? We&apos;ve got you covered. If your listing doesn&apos;t generate enough <strong>leads, CTAs, or engagement</strong> during your yearly plan, your <strong>next year&apos;s renewal is completely free</strong>. We don&apos;t win unless you do &mdash; that&apos;s our promise.</>,
    num: '100% Free',
    pastel: 'bn--rose',
    highlights: ['Free renewal if leads & CTAs are low', 'No fine print — we measure, you grow', 'Only 999 spots — Price per Year, Locked Forever'],
  },
  {
    title: 'Business Analytics',
    desc: 'Real-time dashboard with AI-powered insights, visitor source tracking, competitor benchmarking, and conversion tracking. Up to 365 days of historical data with monthly PDF reports delivered to your inbox.',
    num: 'Real-time',
    pastel: 'bn--sunset',
    highlights: ['AI-powered insights & recommendations', 'Conversion tracking (CTA clicks, RFQ)', 'Monthly analytics report (email PDF)'],
  },
] as const

/* Stylised mock UI for the hero card right panels — pure CSS visuals so we
   don't depend on screenshots / external images. Each kind picks its own
   composition that hints at the feature on the LEFT. */
function HeroVisual({ kind }: { kind: 'leads' | 'analytics' }) {
  if (kind === 'leads') {
    return (
      <div className="bn-vis bn-vis--leads" aria-hidden="true">
        <div className="bn-vis-search">
          <svg viewBox="0 0 24 24" className="bn-vis-mag"><circle cx="11" cy="11" r="6" /><path d="m20 20-4-4" /></svg>
          <span>Inbox · 24 new leads</span>
          <span className="bn-vis-dot" />
        </div>
        {[
          { i: 'AC', n: 'Acme Corp',          p: 'Requested a demo for the AI tier…',  d: '2m' },
          { i: 'KS', n: 'Kakiso Studio',      p: 'RFQ submitted: enterprise plan',     d: '14m' },
          { i: 'NV', n: 'Novabyte Analytics', p: 'Replied to your message',            d: '1h' },
        ].map(r => (
          <div key={r.n} className="bn-vis-row">
            <span className="bn-vis-av">{r.i}</span>
            <div className="bn-vis-meta">
              <strong>{r.n}</strong>
              <span>{r.p}</span>
            </div>
            <span className="bn-vis-time">{r.d}</span>
          </div>
        ))}
      </div>
    )
  }
  // analytics
  const bars = [38, 56, 44, 72, 60, 88, 76]
  return (
    <div className="bn-vis bn-vis--analytics" aria-hidden="true">
      <div className="bn-vis-stat">
        <span className="bn-vis-stat-label">Profile views · 30d</span>
        <span className="bn-vis-stat-value">12,486</span>
        <span className="bn-vis-stat-trend">↑ 24%</span>
      </div>
      <div className="bn-vis-chart">
        {bars.map((h, i) => (
          <span key={i} className="bn-vis-bar" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="bn-vis-axis">
        {['M','T','W','T','F','S','S'].map((d, i) => <span key={i}>{d}</span>)}
      </div>
    </div>
  )
}

/* Layout: wide hero (Leads) + 2x3 grid + wide hero (Analytics) */
const HERO_TOP = 0
const HERO_BOT = 7
const MIDDLE = [1, 2, 3, 4, 5, 6] as const

export default function Benefits() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const cards = grid.querySelectorAll<HTMLElement>('.bn-card')
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('bn-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    cards.forEach(c => io.observe(c))
    return () => io.disconnect()
  }, [])

  /** A single "install row": coloured tile + label + bordered chip on the right.
      The chip text intentionally reads "Included" instead of "Install" because
      these are listing features, not apps. Visual affordance is identical. */
  const Rows = ({ items }: { items: readonly string[] }) => (
    <ul className="bn-rows">
      {items.map(name => (
        <li key={name} className="bn-row">
          <Tile ch={name.replace(/[^A-Za-z0-9]/g, '').charAt(0).toUpperCase() || '•'} />
          <span className="bn-row-name">{name}</span>
          <span className="bn-row-chip">Included <ArrowExt /></span>
        </li>
      ))}
    </ul>
  )

  const renderHero = (idx: number, kind: 'leads' | 'analytics') => {
    const ben = benefits[idx]
    return (
      <article
        key={ben.title}
        className={`bn-card bn-card--hero ${ben.pastel}`}
        style={{ '--bn-i': `${idx * 60}ms` } as React.CSSProperties}
      >
        <div className="bn-card-left">
          <h3 className="bn-card-title">{ben.title}</h3>
          <p className="bn-card-desc">{ben.desc as React.ReactNode}</p>
          <Rows items={ben.highlights} />
        </div>
        <div className="bn-card-right">
          <HeroVisual kind={kind} />
        </div>
      </article>
    )
  }

  const renderStd = (idx: number) => {
    const ben = benefits[idx]
    return (
      <article
        key={ben.title}
        className={`bn-card bn-card--std ${ben.pastel}`}
        style={{ '--bn-i': `${idx * 60}ms` } as React.CSSProperties}
      >
        <h3 className="bn-card-title">{ben.title}</h3>
        <p className="bn-card-desc">{ben.desc as React.ReactNode}</p>
        <Rows items={ben.highlights} />
      </article>
    )
  }

  return (
    <section className="bn-section" id="benefits">
      <div className="container">
        <div className="bn-head">
          <h2 className="bn-heading">Everything Your Business Needs</h2>
        </div>

        <div className="bn-grid" ref={gridRef}>
          {renderHero(HERO_TOP, 'leads')}
          {MIDDLE.map(renderStd)}
          {renderHero(HERO_BOT, 'analytics')}
        </div>
      </div>
    </section>
  )
}
