import { Link } from 'react-router-dom'

export default function ComparisonHeader({ onPrint }) {
  return (
    <div className="container">
      {/* Breadcrumb */}
      <nav className="cmp-breadcrumb">
        <Link to="/">Home</Link>
        <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
        <Link to="/category">Categories</Link>
        <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
        <span>Compare Products</span>
      </nav>

      {/* Header */}
      <div className="cmp-header">
        <div className="cmp-header-top">
          <div className="cmp-header-info">
            <h1>Compare Products Side by Side</h1>
            <p>Make informed decisions with detailed feature-by-feature comparisons, satisfaction scores, and real user reviews.</p>
          </div>
          <div className="cmp-header-actions">
            <button className="cmp-btn cmp-btn-outline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add Product
            </button>
            <button className="cmp-btn cmp-btn-share">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
              Share
            </button>
            <button className="cmp-btn cmp-btn-print" onClick={onPrint}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
              Print
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="cmp-stats">
          <span className="cmp-badge-count">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:12,height:12}}>
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            3 products compared
          </span>
          <span className="cmp-stat-div" />
          <span className="cmp-stat">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            Updated <strong>live</strong>
          </span>
          <span className="cmp-stat-div" />
          <span className="cmp-stat">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            Based on <strong>844</strong> verified reviews
          </span>
          <span className="cmp-stat-div" />
          <span className="cmp-stat">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
            Avg. rating <strong>4.77</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
