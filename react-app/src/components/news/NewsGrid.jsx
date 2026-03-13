import { useState } from 'react'
import { Link } from 'react-router-dom'

/* Category icon map for card visuals */
const catIcons = {
  technology: { paths: [<path key="a" d="M16 18l6-6-6-6" />, <path key="b" d="M8 6l-6 6 6 6" />], gradient: 'linear-gradient(135deg,var(--coral),var(--amber))' },
  food: { paths: [<path key="a" d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />, <path key="b" d="M7 2v20" />], gradient: 'linear-gradient(135deg,var(--amber),var(--coral))' },
  legal: { paths: [<path key="a" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />], gradient: 'linear-gradient(135deg,var(--plum),var(--rose))' },
  education: { paths: [<path key="a" d="M22 10v6M2 10l10-5 10 5-10 5z" />, <path key="b" d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />], gradient: 'linear-gradient(135deg,var(--azure),var(--accent))' },
  realestate: { paths: [<path key="a" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />, <path key="b" d="M9 22V12h6v10" />], gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))' },
  home: { paths: [<path key="a" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />], gradient: 'linear-gradient(135deg,var(--teal),var(--emerald))' },
  marketing: { paths: [<path key="a" d="M3 11l18-5v12L3 13v-2z" />], gradient: 'linear-gradient(135deg,var(--rose),var(--plum))' },
  healthcare: { paths: [<path key="a" d="M22 12h-4l-3 9L9 3l-3 9H2" />], gradient: 'linear-gradient(135deg,var(--emerald),var(--azure))' },
  finance: { paths: [<line key="a" x1="12" y1="1" x2="12" y2="23" />, <path key="b" d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />], gradient: 'linear-gradient(135deg,var(--accent),var(--plum))' },
  business: { paths: [<path key="a" d="M23 6l-9.5 9.5-5-5L1 18" />, <path key="b" d="M17 6h6v6" />], gradient: 'linear-gradient(135deg,var(--teal),var(--emerald))' },
}

const allArticles = [
  {
    id: 'cloud-security-trends',
    tag: 'Technology', tagClass: 'nws-tag--coral', color: 'var(--coral)',
    title: 'Cloud Security Spending Surges 35% as Enterprises Prioritize Zero-Trust Architecture',
    excerpt: 'Organizations worldwide are doubling down on cloud security investments, with zero-trust frameworks becoming the gold standard for enterprise protection strategies.',
    author: 'James Wu', initials: 'JW', avatarBg: 'linear-gradient(135deg,var(--coral),var(--amber))',
    date: 'Mar 10, 2026', readTime: '5 min', category: 'technology'
  },
  {
    id: 'restaurant-ai-ordering',
    tag: 'Food & Dining', tagClass: 'nws-tag--amber', color: 'var(--amber)',
    title: 'AI-Powered Ordering Systems Increase Restaurant Revenue by 25%, Study Finds',
    excerpt: 'New research from the National Restaurant Association shows that AI-driven ordering platforms are transforming the dining experience and boosting bottom lines.',
    author: 'Maria Santos', initials: 'MS', avatarBg: 'linear-gradient(135deg,var(--amber),var(--coral))',
    date: 'Mar 9, 2026', readTime: '4 min', category: 'food'
  },
  {
    id: 'legal-tech-automation',
    tag: 'Legal', tagClass: 'nws-tag--plum', color: 'var(--plum)',
    title: 'Legal Tech Automation Reduces Contract Review Time by 80% for Mid-Size Firms',
    excerpt: 'AI-powered contract analysis tools are enabling mid-size law firms to compete with larger practices, processing thousands of documents in hours instead of weeks.',
    author: 'David Mitchell', initials: 'DM', avatarBg: 'linear-gradient(135deg,var(--plum),var(--rose))',
    date: 'Mar 9, 2026', readTime: '6 min', category: 'legal'
  },
  {
    id: 'edtech-corporate-training',
    tag: 'Education', tagClass: 'nws-tag--azure', color: 'var(--azure)',
    title: 'Corporate Training Platforms See Record Enrollment as Upskilling Becomes Priority',
    excerpt: 'Fortune 500 companies are investing heavily in digital learning platforms, with employee enrollment in professional development courses rising 150% year-over-year.',
    author: 'Nina Kapoor', initials: 'NK', avatarBg: 'linear-gradient(135deg,var(--azure),var(--accent))',
    date: 'Mar 8, 2026', readTime: '4 min', category: 'education'
  },
  {
    id: 'real-estate-proptech',
    tag: 'Real Estate', tagClass: 'nws-tag--emerald', color: 'var(--emerald)',
    title: 'PropTech Startups Raise $12B in Q1 2026, Signaling Market Confidence',
    excerpt: 'Venture capital flows into property technology continue to accelerate, with AI-powered valuation tools and virtual staging platforms leading the charge.',
    author: 'Sarah Chen', initials: 'SC', avatarBg: 'linear-gradient(135deg,var(--emerald),var(--teal))',
    date: 'Mar 8, 2026', readTime: '5 min', category: 'realestate'
  },
  {
    id: 'home-services-marketplace',
    tag: 'Home Services', tagClass: 'nws-tag--teal', color: 'var(--teal)',
    title: 'Home Services Marketplaces Disrupt Traditional Contractor Referral Networks',
    excerpt: 'Digital platforms connecting homeowners with verified contractors are growing 60% annually, reshaping how consumers find and hire service professionals.',
    author: 'Alex Rivera', initials: 'AR', avatarBg: 'linear-gradient(135deg,var(--teal),var(--emerald))',
    date: 'Mar 7, 2026', readTime: '4 min', category: 'home'
  },
  {
    id: 'marketing-attribution-ai',
    tag: 'Marketing', tagClass: 'nws-tag--rose', color: 'var(--rose)',
    title: 'AI Attribution Models Finally Solve the Multi-Touch Marketing Puzzle',
    excerpt: 'New machine learning approaches to marketing attribution are giving CMOs unprecedented clarity on which channels actually drive conversions and revenue.',
    author: 'Lisa Tran', initials: 'LT', avatarBg: 'linear-gradient(135deg,var(--rose),var(--plum))',
    date: 'Mar 7, 2026', readTime: '7 min', category: 'marketing'
  },
  {
    id: 'healthcare-wearables-data',
    tag: 'Healthcare', tagClass: 'nws-tag--emerald', color: 'var(--emerald)',
    title: 'Wearable Health Data Integration Creates New Opportunities for Clinics',
    excerpt: 'Healthcare providers that integrate wearable device data into patient records report 40% better outcomes for chronic disease management programs.',
    author: 'Sara Lopez', initials: 'SL', avatarBg: 'linear-gradient(135deg,var(--emerald),var(--azure))',
    date: 'Mar 6, 2026', readTime: '5 min', category: 'healthcare'
  },
  {
    id: 'fintech-embedded-finance',
    tag: 'Finance', tagClass: 'nws-tag--accent', color: 'var(--accent)',
    title: 'Embedded Finance Revolution: Every SaaS Company Is Becoming a Fintech',
    excerpt: 'From invoicing tools to project management platforms, software companies are embedding financial services to unlock new revenue streams and customer stickiness.',
    author: 'Michael Torres', initials: 'MT', avatarBg: 'linear-gradient(135deg,var(--accent),var(--plum))',
    date: 'Mar 6, 2026', readTime: '6 min', category: 'finance'
  },
  {
    id: 'sustainability-business-directories',
    tag: 'Business', tagClass: 'nws-tag--teal', color: 'var(--teal)',
    title: 'Green Business Directories See 300% Traffic Growth as Consumers Prioritize Sustainability',
    excerpt: 'Eco-conscious consumers are increasingly using sustainability-focused business directories to find environmentally responsible service providers.',
    author: 'Emma Collins', initials: 'EC', avatarBg: 'linear-gradient(135deg,var(--teal),var(--emerald))',
    date: 'Mar 5, 2026', readTime: '4 min', category: 'business'
  },
  {
    id: 'cybersecurity-smb-threats',
    tag: 'Technology', tagClass: 'nws-tag--coral', color: 'var(--coral)',
    title: 'Cyberattacks on Small Businesses Spike 70%: What Directory Listings Can Do to Help',
    excerpt: 'Security experts recommend verified business directories as a trust signal that helps customers distinguish legitimate businesses from fraudulent ones.',
    author: 'James Wu', initials: 'JW', avatarBg: 'linear-gradient(135deg,var(--coral),var(--amber))',
    date: 'Mar 5, 2026', readTime: '5 min', category: 'technology'
  },
  {
    id: 'remote-work-tools-ranking',
    tag: 'Workplace', tagClass: 'nws-tag--azure', color: 'var(--azure)',
    title: 'The Definitive Ranking: Top 20 Remote Work Tools for 2026',
    excerpt: 'Our annual analysis of remote work platforms reveals the tools that are actually making distributed teams more productive, based on user reviews and satisfaction data.',
    author: 'Nina Kapoor', initials: 'NK', avatarBg: 'linear-gradient(135deg,var(--azure),var(--accent))',
    date: 'Mar 4, 2026', readTime: '10 min', category: 'technology'
  },
]

const categories = [
  { key: 'all', label: 'All News', count: allArticles.length },
  { key: 'technology', label: 'Technology', count: allArticles.filter(a => a.category === 'technology').length },
  { key: 'business', label: 'Business', count: allArticles.filter(a => a.category === 'business').length },
  { key: 'healthcare', label: 'Healthcare', count: allArticles.filter(a => a.category === 'healthcare').length },
  { key: 'realestate', label: 'Real Estate', count: allArticles.filter(a => a.category === 'realestate').length },
  { key: 'education', label: 'Education', count: allArticles.filter(a => a.category === 'education').length },
  { key: 'finance', label: 'Finance', count: allArticles.filter(a => a.category === 'finance').length },
  { key: 'food', label: 'Food & Dining', count: allArticles.filter(a => a.category === 'food').length },
  { key: 'legal', label: 'Legal', count: allArticles.filter(a => a.category === 'legal').length },
]

export default function NewsGrid() {
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [search, setSearch] = useState('')
  const [savedIds, setSavedIds] = useState([])
  const [visibleCount, setVisibleCount] = useState(8)

  const filtered = allArticles.filter(a => {
    const matchCat = activeTab === 'all' || a.category === activeTab
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const toggleSave = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const getCatIcon = (category) => catIcons[category] || catIcons.technology

  return (
    <>
      {/* Filter Bar */}
      <div className="nws-filter-bar">
        <div className="nws-tabs">
          {categories.map(c => (
            <button
              key={c.key}
              className={`nws-tab${activeTab === c.key ? ' active' : ''}`}
              onClick={() => { setActiveTab(c.key); setVisibleCount(8) }}
            >
              {c.label}
              {c.count > 0 && <span className="nws-tab-count">{c.count}</span>}
            </button>
          ))}
        </div>
        <div className="nws-filter-right">
          <div className="nws-search">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="nws-view-toggle">
            <button className={`nws-view-btn${viewMode === 'grid' ? ' active' : ''}`} onClick={() => setViewMode('grid')} aria-label="Grid view">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
            </button>
            <button className={`nws-view-btn${viewMode === 'list' ? ' active' : ''}`} onClick={() => setViewMode('list')} aria-label="List view">
              <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className={`nws-grid${viewMode === 'list' ? ' list-view' : ''}`}>
        {visible.map(article => {
          const icon = getCatIcon(article.category)
          return (
            <Link to={`/news-article?id=${article.id}`} className="nws-card" key={article.id} style={{ '--card-accent': article.color }}>
              {/* Visual header with gradient */}
              <div className="nws-card-visual">
                <div className="nws-card-visual-bg" style={{ background: article.color, opacity: .08 }} />
                <div className="nws-card-visual-content">
                  <div className="nws-card-visual-top">
                    <span className={`nws-tag ${article.tagClass}`}>{article.tag}</span>
                    <span className="nws-card-read">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      {article.readTime}
                    </span>
                  </div>
                  <h3>{article.title}</h3>
                </div>
                <div className="nws-card-visual-icon" style={{ background: icon.gradient }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {icon.paths}
                  </svg>
                </div>
              </div>

              {/* Body */}
              <div className="nws-card-body">
                <p>{article.excerpt}</p>
                <div className="nws-card-footer">
                  <div className="nws-card-author">
                    <div className="nws-card-avatar" style={{ background: article.avatarBg }}>{article.initials}</div>
                    <div>
                      <div className="nws-card-author-name">{article.author}</div>
                      <div className="nws-card-author-date">{article.date}</div>
                    </div>
                  </div>
                  <div className="nws-card-arrow">
                    <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </div>
                </div>
              </div>

              {/* Bookmark */}
              <button
                className={`nws-card-bookmark${savedIds.includes(article.id) ? ' saved' : ''}`}
                onClick={e => toggleSave(e, article.id)}
                aria-label="Save article"
              >
                <svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
              </button>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-400)', fontSize: 13, fontWeight: 300 }}>
          No articles found matching your criteria.
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="nws-load-more">
          <button className="nws-load-btn" onClick={() => setVisibleCount(prev => prev + 8)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
            Load More Articles
          </button>
          <div className="nws-results-text">Showing {visible.length} of {filtered.length} articles</div>
        </div>
      )}
    </>
  )
}
