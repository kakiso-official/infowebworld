'use client'

const Ck = () => (
  <svg viewBox="0 0 24 24" className="bn-ck"><path d="M20 6 9 17l-5-5" /></svg>
)

const benefits = [
  {
    title: 'Dofollow Backlinks',
    desc: 'Every listing includes a permanent dofollow backlink from a DA 72+ domain — the kind of link that moves the needle on your rankings.',
    num: 'DA 72+',
    pastel: 'bn--coral',
    highlights: ['Permanent link — never expires', 'Indexed by Google within 48 hours', 'Boosts domain authority & rankings'],
    icon: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
  },
  {
    title: 'Verified Reviews',
    desc: 'Build unshakeable trust with authentic, verified customer reviews. Our AI anti-fraud system ensures zero fakes — only genuine feedback that converts.',
    num: '98% Trust',
    pastel: 'bn--emerald',
    highlights: ['AI-powered anti-fake detection', 'Photo, video & text reviews', 'Verified purchase badges'],
    icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></>,
  },
  {
    title: 'Lead Generation',
    desc: 'Turn visitors into paying customers. Receive qualified leads directly — contact forms, quote requests, and appointment bookings on your listing.',
    num: '40+/mo',
    pastel: 'bn--azure',
    highlights: ['Direct contact forms on listing', 'Instant quote request alerts', 'Lead quality scoring & filtering'],
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  },
  {
    title: 'Analytics Dashboard',
    desc: 'Track views, clicks, leads, and review sentiment with a real-time dashboard built for business owners — not marketers.',
    num: 'Real-time',
    pastel: 'bn--plum',
    highlights: ['Real-time view & click tracking', 'Competitor benchmark insights', 'Weekly performance reports'],
    icon: <><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></>,
  },
  {
    title: 'Global Reach',
    desc: 'Get discovered across the world. Your listing is visible in 12 countries with multi-language support — one listing, global exposure.',
    num: '12 Countries',
    pastel: 'bn--teal',
    highlights: ['Live in 12 countries from day one', 'Auto-translated into 8 languages', 'Local SEO boost per region'],
    icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
  },
  {
    title: 'Daily Business News',
    desc: 'Stay ahead with Inshorts-style daily news digests. Get featured in category-specific feeds and position yourself as the go-to expert.',
    num: 'Daily',
    pastel: 'bn--amber',
    highlights: ['Personalized industry digests', 'Get featured as an expert', 'Morning digest to your inbox'],
    icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
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
