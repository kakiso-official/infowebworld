const benefits = [
  {
    title: 'Dofollow Backlinks',
    desc: 'Every listing includes a permanent dofollow backlink — boost your SEO authority and domain ranking.',
    num: 'DA 72+',
    pastel: 'ben--coral',
    icon: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
  },
  {
    title: 'Verified Reviews',
    desc: 'Build trust with authentic, verified customer reviews. Zero fakes — only genuine feedback.',
    num: '98%',
    pastel: 'ben--emerald',
    icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></>,
  },
  {
    title: 'Lead Generation',
    desc: 'Receive qualified leads directly. Customers can contact you, request quotes, and book appointments.',
    num: '40+/mo',
    pastel: 'ben--azure',
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  },
  {
    title: 'Analytics Dashboard',
    desc: 'Track views, clicks, leads, and review sentiment with a real-time dashboard built for business owners.',
    num: 'Real-time',
    pastel: 'ben--plum',
    icon: <><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></>,
  },
  {
    title: 'Global Reach',
    desc: 'Get discovered by customers in 12 countries with multi-language support across 80+ industries.',
    num: '12 Countries',
    pastel: 'ben--teal',
    icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
  },
  {
    title: 'Daily Business News',
    desc: 'Inshorts-style daily news feed keeps your industry top-of-mind. Get featured in category-specific digests.',
    num: 'Daily',
    pastel: 'ben--amber',
    icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
  },
  {
    title: 'Comparison Engine',
    desc: 'Let customers compare you side-by-side with competitors. Highlight your strengths and win more business.',
    num: 'vs',
    pastel: 'ben--rose',
    icon: <><path d="M16 3h5v5" /><path d="M8 3H3v5" /><path d="M12 22V8" /><path d="m3 3 5 5" /><path d="m21 3-5 5" /></>,
  },
  {
    title: 'Verified Badge',
    desc: 'Stand out with a verified trust badge on your listing. Show customers you are legit and build instant credibility.',
    num: 'Trust',
    pastel: 'ben--gold',
    icon: <><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01z" /></>,
  },
]

export default function Benefits() {
  return (
    <section className="benefits-section" id="benefits">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Why List With Us</div>
          <h2 className="ben-heading">Everything Your Business <em>Needs</em></h2>
          <p className="section-desc">
            More than a directory — a complete business growth platform with tools that actually drive results.
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map(b => (
            <div key={b.title} className={`benefit-card ${b.pastel}`}>
              <div className="benefit-top">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24">{b.icon}</svg>
                </div>
                <span className="benefit-num">{b.num}</span>
              </div>
              <div className="benefit-title">{b.title}</div>
              <div className="benefit-desc">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
