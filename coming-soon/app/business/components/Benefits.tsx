'use client'

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
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  },
  {
    title: 'Search & AI Visibility',
     desc: <>Powerful SEO-optimized asset that ranks across <strong> search engines and AI platforms.</strong>With <strong>schema-optimized profiles, permanent high-authority backlinks from a DA / DR, and AI-ready citations, </strong> your business gets maximum visibility where modern buyers are searching — from Google to ChatGPT, Perplexity, and beyond.</>,
    num: 'High DA/DR',
    pastel: 'bn--emerald',
    highlights: ['Fast Indexing', 'Priority Placement & Rankings across platform', 'Local + Global Visibility'],
    icon: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  },
  {
    title: 'Verified Reviews - Build Trust That Converts',
    desc: <>Turn customer feedback into your strongest growth asset.<strong> Collect verified text, photo, and video reviews, </strong> eliminate fake reviews with AI Anti-Fake detection, and showcase real social proof that drives conversions.</>,
    num: '98% Trust',
    pastel: 'bn--azure',
    highlights: ['AI Reply Drafts', 'Review Invitation Tool', 'Embeddable Review Widgets'],
    icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>,
  },
  {
    title: 'Money Back Guarantee - Elite Founding Buisness',
    desc: 'Zero risk, all reward. Your listing is a one-time investment with compounding returns — leads, backlinks, and reviews that grow over time. Not satisfied within 6 months? Full refund, no questions asked.',
    num: '6 Months',
    pastel: 'bn--plum',
    highlights: ['Full refund within 6 months', 'Zero risk — compounding returns','Only 199 spots — Pay Once, Yours Forever'],
    icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>,
  },
  {
    title: 'Community Power to Influence',
    desc: <>Your listing doesn’t just get seen — it gets discussed, saved, recommended, and trusted. Build lasting credibility through real user engagement,<strong> social proof signals, and community-driven discovery that influence buying decisions. </strong></>,
    pastel: 'bn--teal',
    highlights: ['Follower System & Community Bookmark Collections', 'Upvotes, Likes & Popularity Signals', 'Question & Answer Section'],
    icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
  },
  {
    title: 'High Intent Global Reach',
    desc: 'Unlimited multi-location listings at country and city level with multilingual support. Local NAP optimization and sub-country regional listings — one profile, truly global presence.',
    num: '100+ Countries',
    pastel: 'bn--amber',
    highlights: ['Unlimited multi-location listings', 'Multilingual listing support', 'Local NAP (Name, Address, Phone)'],
    icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
  },
  {
    title: 'Free Renewal Guarantee-Early Adopter',
    desc: <>Not getting the results you expected? We&apos;ve got you covered. If your listing doesn&apos;t generate enough <strong>leads, CTAs, or engagement</strong> during your yearly plan, your <strong>next year&apos;s renewal is completely free</strong>. We don&apos;t win unless you do &mdash; that&apos;s our promise.</>,
    num: '100% Free',
    pastel: 'bn--rose',
    highlights: ['Free renewal if leads & CTAs are low', 'No fine print — we measure, you grow', 'Only 999 spots — Price per Year, Locked Forever'],
    icon: <><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></>,
  },
  {
    title: 'Business Analytics',
    desc: 'Real-time dashboard with AI-powered insights, visitor source tracking, competitor benchmarking, and conversion tracking. Up to 365 days of historical data with monthly PDF reports delivered to your inbox.',
    num: 'Real-time',
    pastel: 'bn--sunset',
    highlights: ['AI-powered insights & recommendations', 'Conversion tracking (CTA clicks, RFQ)', 'Monthly analytics report (email PDF)'],
    icon: <><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></>,
  },
]

export default function Benefits() {
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

        <div className="bn-grid">
          {benefits.map((b, i) => (
            <div key={b.title} className={`bn-card bn-card--${i + 1} ${b.pastel}`}>
              <div className="bn-card-top">
                <div className="bn-card-icon">
                  <svg viewBox="0 0 24 24">{b.icon}</svg>
                </div>
                <span className="bn-card-num">{b.num}</span>
              </div>
              <h3 className="bn-card-title">{b.title}</h3>
              <p className="bn-card-desc">{b.desc as React.ReactNode}</p>
              <ul className="bn-card-list">
                {b.highlights.map(h => (
                  <li key={h}><Ck /><span>{h}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
