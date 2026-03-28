'use client'

const Ck = () => (
  <svg viewBox="0 0 24 24" className="bn-ck"><path d="M20 6 9 17l-5-5" /></svg>
)

const benefits = [
  {
    title: 'Leads Generation',
    desc: 'Direct access to high-intent buyers actively searching for your solution. Get qualified contact forms, quote requests, and demo bookings straight from your listing.',
    num: '40+/mo',
    pastel: 'bn--coral',
    highlights: ['Direct contact forms on listing', 'Instant quote request alerts', 'Lead quality scoring & filtering'],
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  },
  {
    title: 'Search & AI Visibility',
    desc: 'Get found everywhere — search engines, AI assistants, and directory feeds. Schema-marked profiles, permanent dofollow backlinks from a DA 72+ domain, and AI recommendation engine placement.',
    num: 'DA 72+',
    pastel: 'bn--emerald',
    highlights: ['Permanent dofollow backlinks', 'Schema-marked business profiles', 'Featured in AI recommendation engine'],
    icon: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  },
  {
    title: 'Verified Reviews',
    desc: 'Build unshakeable trust with authentic, verified customer reviews. AI-powered anti-fraud detection ensures only genuine feedback — the kind that converts visitors into buyers.',
    num: '98% Trust',
    pastel: 'bn--azure',
    highlights: ['AI-powered anti-fake detection', 'Photo, video & text reviews', 'Verified purchase badges'],
    icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>,
  },
  {
    title: 'Money Back Guarantee',
    desc: 'Zero risk, all reward. If your listing doesn\'t deliver value within the first 6 months, get a full refund — no questions asked, no fine print, no hassle.',
    num: '6 Months',
    pastel: 'bn--plum',
    highlights: ['Full refund within 6 months', 'Zero risk — try with confidence', 'Free renewal if leads are low'],
    icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>,
  },
  {
    title: 'Daily Business News',
    desc: 'Stay ahead with curated daily industry digests. Get featured in category-specific news feeds and position your brand as the go-to expert in your space.',
    num: 'Daily',
    pastel: 'bn--teal',
    highlights: ['Personalized industry digests', 'Get featured as an expert', 'Morning digest to your inbox'],
    icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
  },
  {
    title: 'High Intent Global Reach',
    desc: 'Get discovered across 100+ countries by buyers actively searching for solutions like yours. One listing, global exposure — with local SEO boost in every region.',
    num: '100+ Countries',
    pastel: 'bn--amber',
    highlights: ['Live in 100+ countries from day one', 'Multi-language support', 'Local SEO boost per region'],
    icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
  },
  {
    title: 'Business Analytics',
    desc: 'Track views, clicks, leads, and review sentiment with a real-time dashboard built for business owners. Competitor benchmarks, KPI metrics, and weekly performance reports included.',
    num: 'Real-time',
    pastel: 'bn--sunset',
    highlights: ['Real-time view & click tracking', 'Competitor benchmark insights', 'Weekly performance reports'],
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
              <p className="bn-card-desc">{b.desc}</p>
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
