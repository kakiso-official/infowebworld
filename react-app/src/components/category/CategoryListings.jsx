import { useState } from 'react'
import { Link } from 'react-router-dom'

const StarPath = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'

const VerifiedSvg = () => (
  <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
)

const CompareSvg = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>
)

const listings = [
  {
    id: 'cloudsync-pro',
    name: 'CloudSync Pro',
    tagline: 'Enterprise cloud storage and real-time sync platform for distributed teams',
    logoColor: 'rgba(59,130,246,.08)',
    logoSvg: <svg viewBox="0 0 24 24" stroke="var(--azure)" fill="none" strokeWidth="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
    sat: 92,
    satColor: 'var(--emerald)',
    award: 'leader',
    awardLabel: 'Leader 2026',
    awardSvg: <svg viewBox="0 0 24 24" width="12" height="12"><path d={StarPath}/></svg>,
    score: '4.6',
    filledStars: 4,
    reviews: '(234)',
    rec: '92% recommend',
    bars: [
      { label: 'Ease of Use', width: '88%', color: 'var(--emerald)', val: '8.8' },
      { label: 'Setup', width: '82%', color: 'var(--azure)', val: '8.2' },
      { label: 'Support', width: '90%', color: 'var(--accent)', val: '9.0' },
    ],
    quote: 'Seamless sync across all devices. The team collaboration features are a game-changer for remote work.',
    category: 'Cloud Storage',
    verified: true,
    price: 'From $29/mo',
    sponsored: false,
  },
  {
    id: 'novabyte-analytics',
    name: 'NovaByte Analytics',
    tagline: 'AI-powered business intelligence and data visualization platform',
    logoColor: 'rgba(139,92,246,.08)',
    logoSvg: <svg viewBox="0 0 24 24" stroke="var(--plum)" fill="none" strokeWidth="1.5"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
    sat: 95,
    satColor: 'var(--emerald)',
    award: 'leader',
    awardLabel: 'Leader 2026',
    awardSvg: <svg viewBox="0 0 24 24" width="12" height="12"><path d={StarPath}/></svg>,
    score: '4.8',
    filledStars: 5,
    reviews: '(189)',
    rec: '95% recommend',
    bars: [
      { label: 'Ease of Use', width: '91%', color: 'var(--emerald)', val: '9.1' },
      { label: 'Setup', width: '85%', color: 'var(--azure)', val: '8.5' },
      { label: 'Support', width: '93%', color: 'var(--accent)', val: '9.3' },
    ],
    quote: 'The AI insights saved our team 20+ hours a week. Dashboards are beautiful and intuitive.',
    category: 'Data Analytics',
    verified: true,
    price: 'From $79/mo',
    sponsored: false,
  },
  {
    id: 'shieldvault',
    name: 'ShieldVault Security',
    tagline: 'Enterprise-grade cybersecurity with zero-trust architecture',
    logoColor: 'rgba(47,174,106,.08)',
    logoSvg: <svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    sat: 89,
    satColor: 'var(--emerald)',
    award: 'highperf',
    awardLabel: 'High Performer',
    awardSvg: <svg viewBox="0 0 24 24" width="12" height="12"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    score: '4.5',
    filledStars: 4,
    reviews: '(312)',
    rec: '89% recommend',
    bars: [
      { label: 'Ease of Use', width: '78%', color: 'var(--emerald)', val: '7.8' },
      { label: 'Setup', width: '72%', color: 'var(--azure)', val: '7.2' },
      { label: 'Support', width: '91%', color: 'var(--accent)', val: '9.1' },
    ],
    quote: 'Best-in-class security posture. Zero-trust was seamless to deploy across our org.',
    category: 'Cybersecurity',
    verified: true,
    price: 'Custom',
    sponsored: false,
  },
  {
    id: 'pipelinehq',
    name: 'PipelineHQ',
    tagline: 'All-in-one CRM with AI-powered sales automation and forecasting',
    logoColor: 'rgba(245,158,11,.08)',
    logoSvg: <svg viewBox="0 0 24 24" stroke="var(--amber)" fill="none" strokeWidth="1.5"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>,
    sat: 85,
    satColor: 'var(--amber)',
    award: null,
    awardLabel: null,
    awardSvg: null,
    score: '4.3',
    filledStars: 4,
    reviews: '(156)',
    rec: '85% recommend',
    bars: [
      { label: 'Ease of Use', width: '84%', color: 'var(--emerald)', val: '8.4' },
      { label: 'Setup', width: '79%', color: 'var(--azure)', val: '7.9' },
      { label: 'Support', width: '86%', color: 'var(--accent)', val: '8.6' },
    ],
    quote: 'Pipeline automation saved our sales team 15 hours/week. AI forecasting is incredibly accurate.',
    category: 'CRM',
    verified: false,
    price: 'From $49/mo',
    sponsored: true,
  },
  {
    id: 'codeforge',
    name: 'CodeForge IDE',
    tagline: 'Cloud-based IDE with AI code completion and team collaboration',
    logoColor: 'rgba(20,184,166,.08)',
    logoSvg: <svg viewBox="0 0 24 24" stroke="var(--teal)" fill="none" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    sat: 96,
    satColor: 'var(--emerald)',
    award: 'leader',
    awardLabel: 'Leader 2026',
    awardSvg: <svg viewBox="0 0 24 24" width="12" height="12"><path d={StarPath}/></svg>,
    score: '4.9',
    filledStars: 5,
    reviews: '(421)',
    rec: '96% recommend',
    bars: [
      { label: 'Ease of Use', width: '94%', color: 'var(--emerald)', val: '9.4' },
      { label: 'Setup', width: '92%', color: 'var(--azure)', val: '9.2' },
      { label: 'Support', width: '95%', color: 'var(--accent)', val: '9.5' },
    ],
    quote: "Best IDE I've ever used. AI copilot feels like having a senior dev pair-programming with me.",
    category: 'DevOps',
    verified: true,
    price: 'Free tier',
    sponsored: false,
  },
  {
    id: 'metrik-pm',
    name: 'Metrik PM',
    tagline: 'Modern project management with real-time resource tracking',
    logoColor: 'rgba(236,72,153,.08)',
    logoSvg: <svg viewBox="0 0 24 24" stroke="var(--rose)" fill="none" strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    sat: 88,
    satColor: 'var(--emerald)',
    award: 'momentum',
    awardLabel: 'Momentum Leader',
    awardSvg: <svg viewBox="0 0 24 24" width="12" height="12"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    score: '4.4',
    filledStars: 4,
    reviews: '(267)',
    rec: '88% recommend',
    bars: [
      { label: 'Ease of Use', width: '90%', color: 'var(--emerald)', val: '9.0' },
      { label: 'Setup', width: '88%', color: 'var(--azure)', val: '8.8' },
      { label: 'Support', width: '84%', color: 'var(--accent)', val: '8.4' },
    ],
    quote: 'Replaced Jira and Asana for us. Kanban + Gantt in one tool with gorgeous UI.',
    category: 'Project Mgmt',
    verified: false,
    price: 'From $12/mo',
    sponsored: false,
  },
  {
    id: 'flowstack',
    name: 'FlowStack',
    tagline: 'No-code workflow automation connecting 500+ apps and services',
    logoColor: 'rgba(108,114,241,.08)',
    logoSvg: <svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7M11 18H8a2 2 0 0 1-2-2V9"/></svg>,
    sat: 93,
    satColor: 'var(--emerald)',
    award: 'highperf',
    awardLabel: 'High Performer',
    awardSvg: <svg viewBox="0 0 24 24" width="12" height="12"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    score: '4.7',
    filledStars: 4,
    reviews: '(523)',
    rec: '93% recommend',
    bars: [
      { label: 'Ease of Use', width: '95%', color: 'var(--emerald)', val: '9.5' },
      { label: 'Setup', width: '93%', color: 'var(--azure)', val: '9.3' },
      { label: 'Support', width: '88%', color: 'var(--accent)', val: '8.8' },
    ],
    quote: 'Replaced Zapier for us at 1/3 the cost. The visual builder is incredibly intuitive.',
    category: 'Automation',
    verified: true,
    price: 'Free tier',
    sponsored: false,
  },
  {
    id: 'sentry-monitor',
    name: 'Sentry Monitor',
    tagline: 'Application performance monitoring and error tracking at scale',
    logoColor: 'rgba(239,107,74,.08)',
    logoSvg: <svg viewBox="0 0 24 24" stroke="var(--coral)" fill="none" strokeWidth="1.5"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>,
    sat: 86,
    satColor: 'var(--emerald)',
    award: null,
    awardLabel: null,
    awardSvg: null,
    score: '4.3',
    filledStars: 4,
    reviews: '(198)',
    rec: '86% recommend',
    bars: [
      { label: 'Ease of Use', width: '83%', color: 'var(--emerald)', val: '8.3' },
      { label: 'Setup', width: '80%', color: 'var(--azure)', val: '8.0' },
      { label: 'Support', width: '82%', color: 'var(--accent)', val: '8.2' },
    ],
    quote: 'Catches issues before our users do. The Slack integration is perfect for our workflow.',
    category: 'DevOps',
    verified: true,
    price: 'Free tier',
    sponsored: false,
  },
]

function renderStars(filled) {
  const stars = []
  for (let i = 0; i < 5; i++) {
    stars.push(
      <svg key={i} viewBox="0 0 24 24" fill={i < filled ? 'var(--gold)' : 'var(--gray-200)'} stroke="none">
        <path d={StarPath}/>
      </svg>
    )
  }
  return stars
}

export default function CategoryListings({ onToggleFilters }) {
  const [viewMode, setViewMode] = useState('grid')
  const [compareSet, setCompareSet] = useState(new Set())
  const [activePage, setActivePage] = useState(1)

  const toggleCompare = (id) => {
    setCompareSet(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearCompare = () => setCompareSet(new Set())

  const pages = [1, 2, 3, 4, '...', 24]

  return (
    <>
      {/* Toolbar */}
      <div className="cat-toolbar">
        <div className="cat-toolbar-left">
          <button className="cat-filter-toggle" onClick={onToggleFilters}>
            <svg viewBox="0 0 24 24"><path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>
            Filters
          </button>
          <span className="cat-result-count">Showing <strong>1-12</strong> of <strong>284</strong> results</span>
        </div>
        <div className="cat-toolbar-right">
          <select className="cat-sort">
            <option>Relevance</option>
            <option>Highest Rated</option>
            <option>Most Reviews</option>
            <option>Satisfaction Score</option>
            <option>Newest</option>
            <option>Name A-Z</option>
          </select>
          <button
            className={`view-btn${viewMode === 'grid' ? ' active' : ''}`}
            title="Grid view"
            onClick={() => setViewMode('grid')}
          >
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </button>
          <button
            className={`view-btn${viewMode === 'list' ? ' active' : ''}`}
            title="List view"
            onClick={() => setViewMode('list')}
          >
            <svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className={`cat-grid${viewMode === 'list' ? ' list-view' : ''}`} id="cat-grid">
        {listings.map(item => (
          <Link
            to={`/listing?biz=${item.id}`}
            className={`cat-card fade-in${item.sponsored ? ' sponsored' : ''}`}
            key={item.id}
          >
            <div className="cat-card-top">
              <div className="cat-card-logo" style={{background: item.logoColor}}>
                {item.logoSvg}
              </div>
              <div className="cat-card-info">
                <div className="cat-card-name">{item.name}</div>
                <div className="cat-card-tagline">{item.tagline}</div>
              </div>
              <div className="cat-card-sat" data-pct={item.sat}>
                <svg viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--gray-100)" strokeWidth="2.8"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={item.satColor} strokeWidth="2.8" strokeDasharray={`${item.sat} 100`} strokeDashoffset="25" strokeLinecap="round"/>
                </svg>
                <span>{item.sat}</span>
              </div>
            </div>

            {item.award && (
              <div className={`cat-card-award ${item.award}`}>
                {item.awardSvg}
                {item.awardLabel}
              </div>
            )}

            <div className="cat-card-rating">
              <div className="cat-card-stars">{renderStars(item.filledStars)}</div>
              <span className="cat-card-score">{item.score}</span>
              <span className="cat-card-reviews">{item.reviews}</span>
              <span className="cat-card-rec">{item.rec}</span>
            </div>

            <div className="cat-card-bars">
              {item.bars.map(bar => (
                <div className="cat-bar" key={bar.label}>
                  <span className="cat-bar-label">{bar.label}</span>
                  <div className="cat-bar-track">
                    <div className="cat-bar-fill" style={{width: bar.width, background: bar.color}}></div>
                  </div>
                  <span className="cat-bar-val">{bar.val}</span>
                </div>
              ))}
            </div>

            <div className="cat-card-quote">{item.quote}</div>

            <div className="cat-card-meta">
              <span className="cat-badge cat-badge-cat">{item.category}</span>
              {item.verified && (
                <span className="cat-badge cat-badge-verified"><VerifiedSvg />Verified</span>
              )}
              <span className="cat-badge cat-badge-price">{item.price}</span>
            </div>

            <div className="cat-card-actions">
              <label
                className={`cat-card-cmp${compareSet.has(item.id) ? ' active' : ''}`}
                onClick={(e) => { e.preventDefault(); toggleCompare(item.id) }}
              >
                <input type="checkbox" checked={compareSet.has(item.id)} readOnly />
                <CompareSvg />
                Compare
              </label>
              <span className="cat-card-btn">View Details</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="cat-pagination">
        <button className="cat-page" onClick={() => setActivePage(p => Math.max(1, p - 1))}>
          <svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        {pages.map((page, i) => (
          <button
            key={i}
            className={`cat-page${activePage === page ? ' active' : ''}`}
            onClick={() => typeof page === 'number' && setActivePage(page)}
          >
            {page}
          </button>
        ))}
        <button className="cat-page" onClick={() => setActivePage(p => Math.min(24, p + 1))}>
          <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      {/* Floating Compare Bar */}
      <div className={`compare-bar${compareSet.size > 0 ? ' visible' : ''}`}>
        <div className="compare-bar-inner">
          <span className="compare-bar-count"><strong>{compareSet.size}</strong> selected</span>
          <button className="compare-bar-btn" onClick={() => window.location = '/comparison'}>
            Compare Now
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button className="compare-bar-clear" onClick={clearCompare}>Clear</button>
        </div>
      </div>
    </>
  )
}
