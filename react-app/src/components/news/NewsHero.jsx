import { Link } from 'react-router-dom'

const heroMain = {
  id: 'small-biz-directory-growth',
  tag: 'Business Spotlight',
  tagClass: 'nws-tag--accent',
  trending: true,
  title: 'Small Businesses See 40% Growth Through Digital Directory Listings in 2026',
  excerpt: 'A new industry report reveals that small and medium businesses listed on verified directories experienced significantly higher customer acquisition rates compared to traditional advertising channels.',
  author: 'Rachel Park',
  initials: 'RP',
  avatarBg: 'var(--accent-gradient)',
  role: 'Senior Editor',
  date: 'Mar 10, 2026',
  readTime: '6 min read',
  bg: 'linear-gradient(135deg,#1a1c2e 0%,#2d1b4e 50%,#1e293b 100%)'
}

const heroSide = [
  {
    id: 'suburban-real-estate-demand',
    tag: 'Real Estate',
    tagClass: 'nws-tag--white',
    title: 'Remote Work Drives Surge in Suburban Commercial Real Estate Demand',
    date: 'Mar 9, 2026',
    readTime: '4 min',
    bg: 'linear-gradient(135deg,#065f46 0%,#064e3b 100%)'
  },
  {
    id: 'telehealth-satisfaction',
    tag: 'Healthcare',
    tagClass: 'nws-tag--white',
    title: 'Telehealth Platforms Report Record Patient Satisfaction Scores',
    date: 'Mar 8, 2026',
    readTime: '3 min',
    bg: 'linear-gradient(135deg,#4c1d95 0%,#5b21b6 100%)'
  },
  {
    id: 'ai-customer-reviews',
    tag: 'Technology',
    tagClass: 'nws-tag--white',
    title: 'AI-Powered Tools Transform How Businesses Manage Customer Reviews',
    date: 'Mar 7, 2026',
    readTime: '5 min',
    bg: 'linear-gradient(135deg,#7c2d12 0%,#9a3412 100%)'
  }
]

export default function NewsHero() {
  return (
    <div className="nws-hero">
      <div className="container">
        <div className="nws-hero-grid">
          {/* Main hero */}
          <Link to={`/news-article?id=${heroMain.id}`} className="nws-hero-main">
            <div className="nws-hero-main-bg" style={{ background: heroMain.bg }} />
            <div className="nws-hero-main-content">
              <div className="nws-hero-main-tags">
                <span className={`nws-tag ${heroMain.tagClass}`}>{heroMain.tag}</span>
                {heroMain.trending && (
                  <span className="nws-tag nws-tag--trending">
                    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>
                    Trending
                  </span>
                )}
              </div>
              <h2>{heroMain.title}</h2>
              <p>{heroMain.excerpt}</p>
              <div className="nws-hero-main-footer">
                <div className="nws-hero-main-author">
                  <div className="nws-hero-main-avatar" style={{ background: heroMain.avatarBg }}>{heroMain.initials}</div>
                  <div>
                    <div className="nws-hero-main-author-name">{heroMain.author}</div>
                    <div className="nws-hero-main-author-date">{heroMain.role}</div>
                  </div>
                </div>
                <div className="nws-hero-main-meta">
                  <span className="nws-hero-main-pill">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    {heroMain.date}
                  </span>
                  <span className="nws-hero-main-pill">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    {heroMain.readTime}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Side cards */}
          <div className="nws-hero-side">
            {heroSide.map(card => (
              <Link to={`/news-article?id=${card.id}`} className="nws-hero-side-card" key={card.id}>
                <div className="nws-hero-side-card-bg" style={{ background: card.bg }} />
                <div className="nws-hero-side-card-content">
                  <span className={`nws-tag ${card.tagClass}`} style={{ marginBottom: 6, display: 'inline-flex' }}>{card.tag}</span>
                  <h3>{card.title}</h3>
                  <div className="nws-hero-side-card-meta">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    {card.readTime} &middot; {card.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
