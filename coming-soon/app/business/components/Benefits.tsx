'use client'

const Ck = () => (
  <svg viewBox="0 0 24 24" className="bn-ck"><path d="M20 6 9 17l-5-5" /></svg>
)

const benefits = [
  {
    title: 'Leads Generation',
    desc: 'Turn your listing into a lead machine. RFQ forms, demo scheduling, and a messaging inbox connect you directly with high-intent buyers — with real-time alerts and CRM export to HubSpot or Salesforce.',
    num: '40+/mo',
    pastel: 'bn--coral',
    highlights: ['RFQ forms & Book a Demo widget', 'Real-time lead alerts (email & in-app)', 'CRM integration (HubSpot, Salesforce)'],
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  },
  {
    title: 'Search & AI Visibility',
    desc: 'SEO-optimized profiles with schema markup, a permanent dofollow backlink from a DA 72+ domain, and GEO & AEO citations. Your listing is AI-search ready — surfaced in ChatGPT, Perplexity, and Gemini. Indexed within 48 hours.',
    num: 'DA 72+',
    pastel: 'bn--emerald',
    highlights: ['Permanent dofollow backlink', 'AI search ready (ChatGPT, Perplexity, Gemini)', 'Indexed within 48 hours'],
    icon: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  },
  {
    title: 'Verified Reviews',
    desc: 'Collect verified photo & video reviews, flag fakes with AI-powered anti-fraud detection, and aggregate reviews from Google & Trustpilot. Invite reviews via email or link — AI drafts your replies.',
    num: '98% Trust',
    pastel: 'bn--azure',
    highlights: ['AI sentiment analysis & reply drafts', 'Review invitation tool (email & link)', 'Aggregate from Google & Trustpilot'],
    icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>,
  },
  {
    title: 'Money Back Guarantee',
    desc: 'Zero risk, all reward. Your listing is a one-time investment with compounding returns — leads, backlinks, and reviews that grow over time. Not satisfied within 6 months? Full refund, no questions asked.',
    num: '6 Months',
    pastel: 'bn--plum',
    highlights: ['Full refund within 6 months', 'Zero risk — compounding returns', 'Free renewal if leads are low'],
    icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>,
  },
  {
    title: 'Daily Business News',
    desc: 'Get featured in quarterly news spotlight articles, newsletter mentions, and shared across iWW social channels. Promote webinars, events, and product launches to a high-intent audience.',
    num: 'Daily',
    pastel: 'bn--teal',
    highlights: ['News spotlight article each quarter', 'Newsletter mentions & features', 'Webinar & event listing section'],
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
