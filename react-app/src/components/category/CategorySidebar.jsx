import { Link } from 'react-router-dom'

const StarPath = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'

const topRated = [
  { rank: 1, name: 'CodeForge IDE', score: '4.9' },
  { rank: 2, name: 'NovaByte Analytics', score: '4.8' },
  { rank: 3, name: 'FlowStack', score: '4.7' },
  { rank: 4, name: 'CloudSync Pro', score: '4.6' },
  { rank: 5, name: 'ShieldVault Security', score: '4.5' },
]

const relatedCategories = [
  { slug: 'marketing', name: 'Marketing & Advertising', count: 156 },
  { slug: 'education', name: 'Education & E-Learning', count: 89 },
  { slug: 'healthcare', name: 'Healthcare & Wellness', count: 124 },
  { slug: 'legal', name: 'Legal Services', count: 67 },
  { slug: 'restaurants', name: 'Restaurants & Food', count: 203 },
]

const satOverview = [
  { label: 'Ease of Use', width: '87%', color: 'var(--emerald)', val: '8.7' },
  { label: 'Ease of Setup', width: '83%', color: 'var(--azure)', val: '8.3' },
  { label: 'Quality of Support', width: '89%', color: 'var(--accent)', val: '8.9' },
  { label: 'Meets Requirements', width: '91%', color: 'var(--plum)', val: '9.1' },
  { label: 'Product Direction', width: '85%', color: 'var(--teal)', val: '8.5' },
]

const gridDots = [
  { style: { left: '78%', bottom: '85%' }, title: 'CodeForge IDE', letter: 'C' },
  { style: { left: '72%', bottom: '80%' }, title: 'NovaByte Analytics', letter: 'N' },
  { style: { left: '68%', bottom: '72%' }, title: 'CloudSync Pro', letter: 'S' },
  { style: { left: '35%', bottom: '78%' }, title: 'FlowStack', letter: 'F' },
  { style: { left: '30%', bottom: '68%' }, title: 'ShieldVault', letter: 'V' },
  { style: { left: '60%', bottom: '60%' }, title: 'PipelineHQ', letter: 'P' },
  { style: { left: '25%', bottom: '55%' }, title: 'Metrik PM', letter: 'M' },
]

export default function CategorySidebar() {
  return (
    <>
      {/* Grid Report Mini */}
      <div className="side-card">
        <div className="side-card-title">Grid Report - Technology</div>
        <div className="side-grid-report">
          <div className="grid-axis-y">
            <span>Satisfaction</span>
          </div>
          <div className="grid-chart">
            <div className="grid-quadrant grid-q-leader"><span className="grid-q-label">Leaders</span></div>
            <div className="grid-quadrant grid-q-highperf"><span className="grid-q-label">High Performers</span></div>
            <div className="grid-quadrant grid-q-contender"><span className="grid-q-label">Contenders</span></div>
            <div className="grid-quadrant grid-q-niche"><span className="grid-q-label">Niche</span></div>
            {gridDots.map(dot => (
              <div className="grid-dot" key={dot.letter} style={dot.style} title={dot.title}>{dot.letter}</div>
            ))}
          </div>
          <div className="grid-axis-x">
            <span>Market Presence</span>
          </div>
        </div>
        <Link to="/best-of" className="side-grid-link">
          View full report
          <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>

      {/* Satisfaction Overview */}
      <div className="side-card">
        <div className="side-card-title">Satisfaction Overview</div>
        <div className="side-sat-overview">
          {satOverview.map(row => (
            <div className="side-sat-row" key={row.label}>
              <span className="side-sat-label">{row.label}</span>
              <div className="side-sat-track">
                <div className="side-sat-fill" style={{ width: row.width, background: row.color }}></div>
              </div>
              <span className="side-sat-val">{row.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Rated */}
      <div className="side-card">
        <div className="side-card-title">Top Rated</div>
        {topRated.map(item => (
          <div className="side-top-item" key={item.rank}>
            <span className="side-top-rank">{item.rank}</span>
            <span className="side-top-name">{item.name}</span>
            <span className="side-top-score">
              <svg viewBox="0 0 24 24"><path d={StarPath}/></svg>
              {item.score}
            </span>
          </div>
        ))}
      </div>

      {/* Related Categories */}
      <div className="side-card">
        <div className="side-card-title">Related Categories</div>
        <div className="side-related">
          {relatedCategories.map(cat => (
            <Link to={`/category?cat=${cat.slug}`} className="side-related-item" key={cat.slug}>
              {cat.name}
              <span className="side-related-count">{cat.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="side-card side-cta">
        <div className="side-cta-title">List Your Business</div>
        <div className="side-cta-desc">Join 12,000+ companies already on InfoWebWorld. Get discovered by millions of buyers.</div>
        <Link to="/submit-listing" className="side-cta-btn">
          Get Started
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>
    </>
  )
}
