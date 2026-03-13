import { useState } from 'react'
import { Link } from 'react-router-dom'

const trendingArticles = [
  {
    id: 'ai-review-tools',
    title: 'AI-Powered Review Tools See 200% Adoption Surge Across SMBs',
    date: '2h ago',
    readTime: '4 min',
    hot: true
  },
  {
    id: 'saas-consolidation-trend',
    title: 'The Great SaaS Consolidation: Why Vendors Are Merging at Record Pace',
    date: '5h ago',
    readTime: '7 min',
    hot: true
  },
  {
    id: 'cloud-migration',
    title: 'Enterprise Cloud Migration Spending Hits $180B Globally in Q1 2026',
    date: '8h ago',
    readTime: '5 min',
    hot: false
  },
  {
    id: 'remote-work-rankings',
    title: 'Remote Work Platforms Dominate Q1 2026 Business Software Rankings',
    date: '12h ago',
    readTime: '6 min',
    hot: false
  },
  {
    id: 'review-authenticity-standards',
    title: 'New Industry Standards for Review Authenticity Set to Transform Trust Online',
    date: '1d ago',
    readTime: '6 min',
    hot: false
  }
]

const sidebarCategories = [
  { name: 'Technology & SaaS', count: 128, color: 'rgba(108,114,241,.1)', stroke: 'var(--accent)', paths: [<path key="a" d="M16 18l6-6-6-6" />, <path key="b" d="M8 6l-6 6 6 6" />] },
  { name: 'Healthcare', count: 84, color: 'rgba(47,174,106,.1)', stroke: 'var(--emerald)', paths: [<path key="a" d="M22 12h-4l-3 9L9 3l-3 9H2" />] },
  { name: 'Real Estate', count: 67, color: 'rgba(59,130,246,.1)', stroke: 'var(--azure)', paths: [<path key="a" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />, <path key="b" d="M9 22V12h6v10" />] },
  { name: 'Finance & Legal', count: 56, color: 'rgba(139,92,246,.1)', stroke: 'var(--plum)', paths: [<line key="a" x1="12" y1="1" x2="12" y2="23" />, <path key="b" d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />] },
  { name: 'Education', count: 43, color: 'rgba(20,184,166,.1)', stroke: 'var(--teal)', paths: [<path key="a" d="M22 10v6M2 10l10-5 10 5-10 5z" />, <path key="b" d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />] },
  { name: 'Marketing', count: 38, color: 'rgba(236,72,153,.1)', stroke: 'var(--rose)', paths: [<path key="a" d="M3 11l18-5v12L3 13v-2z" />] },
]

export default function NewsSidebar() {
  const [email, setEmail] = useState('')

  return (
    <div className="nws-sidebar">
      {/* Stats */}
      <div className="nws-side-card">
        <div className="nws-side-card-header">
          <div className="nws-side-card-title">
            <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            This Week's Pulse
          </div>
        </div>
        <div className="nws-stats-grid">
          <div className="nws-stats-item">
            <div className="nws-stats-num">24</div>
            <div className="nws-stats-label">Articles</div>
            <div className="nws-stats-change up">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
              +12%
            </div>
          </div>
          <div className="nws-stats-item">
            <div className="nws-stats-num">8.4K</div>
            <div className="nws-stats-label">Readers</div>
            <div className="nws-stats-change up">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
              +28%
            </div>
          </div>
          <div className="nws-stats-item">
            <div className="nws-stats-num">4.2</div>
            <div className="nws-stats-label">Avg. Read (min)</div>
            <div className="nws-stats-change down">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              -5%
            </div>
          </div>
          <div className="nws-stats-item">
            <div className="nws-stats-num">156</div>
            <div className="nws-stats-label">Shares</div>
            <div className="nws-stats-change up">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
              +44%
            </div>
          </div>
        </div>
      </div>

      {/* Trending */}
      <div className="nws-side-card">
        <div className="nws-side-card-header">
          <div className="nws-side-card-title">
            <svg viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>
            Trending Now
          </div>
          <Link to="/news" className="nws-side-card-link">
            See all
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
        <div className="nws-trending-list">
          {trendingArticles.map((a, i) => (
            <Link to={`/news-article?id=${a.id}`} className="nws-trending-item" key={a.id}>
              <span className="nws-trending-rank">{i + 1}</span>
              <div className="nws-trending-info">
                <div className="nws-trending-title">{a.title}</div>
                <div className="nws-trending-meta">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  {a.readTime} &middot; {a.date}
                  {a.hot && (
                    <span className="nws-trending-fire">
                      <svg viewBox="0 0 24 24"><path d="M12 22c-4.97 0-9-2.69-9-6v-.01C3 11.68 8 7 9 4c.38 4 3.5 5.5 5 4 .5 3 3.5 5 5 7 .5-1 1-2 1-3 1 1 2 3.5 2 5v.01c0 3.31-4.03 6-10 6z" /></svg>
                      Hot
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="nws-newsletter">
        <div className="nws-newsletter-title">Stay ahead of the curve</div>
        <div className="nws-newsletter-desc">Get the top business and tech news delivered to your inbox every morning. Join 12,000+ professionals.</div>
        <div className="nws-newsletter-form">
          <input
            className="nws-newsletter-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button className="nws-newsletter-btn">Subscribe</button>
        </div>
        <div className="nws-newsletter-privacy">No spam, ever. Unsubscribe anytime.</div>
      </div>

      {/* Categories */}
      <div className="nws-side-card">
        <div className="nws-side-card-header">
          <div className="nws-side-card-title">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            Browse by Category
          </div>
        </div>
        <div className="nws-categories-list">
          {sidebarCategories.map(cat => (
            <Link to={`/news?cat=${cat.name.toLowerCase().replace(/\s+/g, '-')}`} className="nws-cat-item" key={cat.name}>
              <div className="nws-cat-icon" style={{ background: cat.color }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={cat.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                  {cat.paths}
                </svg>
              </div>
              <div className="nws-cat-info">
                <div className="nws-cat-name">{cat.name}</div>
                <div className="nws-cat-count">{cat.count} articles</div>
              </div>
              <div className="nws-cat-arrow">
                <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
