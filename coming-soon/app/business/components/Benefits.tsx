'use client'

import { useRef, useEffect, useCallback } from 'react'

const Ck = () => (
  <svg viewBox="0 0 24 24" className="bn-ck"><path d="M20 6 9 17l-5-5" /></svg>
)

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
    title: 'Money Back Guarantee - Elite Founding Buisness',
    desc: 'Zero risk, all reward. Your listing is a one-time investment with compounding returns — leads, backlinks, and reviews that grow over time. Not satisfied within 6 months? Full refund, no questions asked.',
    num: '6 Months',
    pastel: 'bn--plum',
    highlights: ['Full refund within 6 months', 'Zero risk — compounding returns','Only 199 spots — Pay Once, Yours Forever'],
  },
  {
    title: 'Community Power to Influence',
    desc: <>Your listing doesn't just get seen — it gets discussed, saved, recommended, and trusted. Build lasting credibility through real user engagement,<strong> social proof signals, and community-driven discovery that influence buying decisions. </strong></>,
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
]

const rows: [number, number][] = [[0, 1], [2, 3], [4, 5], [6, 7]]
const smalls = new Set([0, 3, 4, 7])

export default function Benefits() {
  const gridRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)


  /* ── Pure DOM: no React state, no re-renders, zero lag ── */
  const swapOn = useCallback(() => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null }
    gridRef.current?.classList.add('bn-swap')
  }, [])

  const swapOff = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => gridRef.current?.classList.remove('bn-swap'), 150)
  }, [])

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  /* ── Scroll-in observer ── */
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const cards = grid.querySelectorAll('.bn-card')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('bn-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])

  return (
    <section className="bn-section" id="benefits">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Why List With Us</div>
          <h2 className="bn-heading">
            Everything Your Business <em>Needs</em>
          </h2>
          <p className="section-desc">
            More than a directory — a complete business growth platform with
            tools that actually drive results.
          </p>
        </div>

        <div className="bn-grid" ref={gridRef} onMouseLeave={swapOff}>
          {rows.map(([a, b], ri) => (
            <div key={ri} className="bn-row">
              {[a, b].map((idx) => {
                const ben = benefits[idx]
                const isSm = smalls.has(idx)
                return (
                  <div
                    key={ben.title}
                    className={`bn-card bn-card--${idx + 1} ${ben.pastel} ${isSm ? 'bn-sm' : 'bn-lg'}`}
                    style={{ '--bn-i': `${idx * 90}ms` } as React.CSSProperties}
                    onMouseEnter={isSm ? swapOn : undefined}
                  >
                    <svg className="bn-border" aria-hidden="true"><rect rx="10" pathLength="1" /></svg>

                    <div className="bn-card-head">
                      {ben.num && <span className="bn-card-num">{ben.num}</span>}
                    </div>
                    <h3 className="bn-card-title">{ben.title}</h3>
                    <p className="bn-card-desc">{ben.desc as React.ReactNode}</p>
                    <ul className="bn-card-list">
                      {ben.highlights.map(h => (
                        <li key={h}><Ck /><span>{h}</span></li>
                      ))}
                    </ul>

                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
