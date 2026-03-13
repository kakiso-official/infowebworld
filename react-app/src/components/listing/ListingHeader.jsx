import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

const STAR_PATH = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'features', label: 'Features' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'reviews', label: 'Reviews (312)' },
  { key: 'alternatives', label: 'Alternatives' },
]

export default function ListingHeader({ activeTab, onTabChange }) {
  const [saveActive, setSaveActive] = useState(false)
  const [shareActive, setShareActive] = useState(false)

  return (
    <>
      {/* Breadcrumb */}
      <div className="container">
        <div className="ls-breadcrumb">
          <Link to="/">Home</Link>
          <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          <Link to="/category?cat=technology">Technology</Link>
          <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          <Link to="/category?cat=technology">Cloud Infrastructure</Link>
          <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          <span>CloudSync Pro</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="ls-hero">
        <div className="container">
          <div className="ls-hero-top">
            {/* Logo */}
            <div className="ls-hero-logo" style={{background:'linear-gradient(135deg,#3B82F6,#6366F1)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-10A7 7 0 105.5 15H7"/></svg>
            </div>

            {/* Info */}
            <div className="ls-hero-info">
              <div className="ls-hero-row1">
                <span className="ls-hero-name">CloudSync Pro</span>
                <div className="ls-hero-badges">
                  <span className="ls-badge ls-badge-leader">
                    <svg viewBox="0 0 24 24"><path d={STAR_PATH}/></svg>
                    Leader 2026
                  </span>
                  <span className="ls-badge ls-badge-verified">
                    <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    Verified
                  </span>
                </div>
              </div>
              <div className="ls-hero-tagline">Enterprise cloud infrastructure platform for seamless data synchronization, backup automation, and multi-cloud management.</div>

              {/* Metrics Row */}
              <div className="ls-hero-metrics">
                <div className="ls-metric">
                  <div className="ls-metric-stars">
                    <svg viewBox="0 0 24 24" fill="#E5A100" stroke="none"><path d={STAR_PATH}/></svg>
                    <svg viewBox="0 0 24 24" fill="#E5A100" stroke="none"><path d={STAR_PATH}/></svg>
                    <svg viewBox="0 0 24 24" fill="#E5A100" stroke="none"><path d={STAR_PATH}/></svg>
                    <svg viewBox="0 0 24 24" fill="#E5A100" stroke="none"><path d={STAR_PATH}/></svg>
                    <svg viewBox="0 0 24 24" fill="#E2E8F0" stroke="none"><path d={STAR_PATH}/></svg>
                  </div>
                  <span className="ls-metric-label">4.6 rating</span>
                </div>

                <div className="ls-metric-div"></div>

                <div className="ls-sat-ring">
                  <svg viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--gray-100)" strokeWidth="2.8"/>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--emerald)" strokeWidth="2.8" strokeDasharray="89 100" strokeLinecap="round"/>
                  </svg>
                  <span>89%</span>
                </div>

                <div className="ls-metric-div"></div>

                <div className="ls-metric">
                  <span className="ls-metric-val">312</span>
                  <span className="ls-metric-label">Reviews</span>
                </div>

                <div className="ls-metric-div"></div>

                <div className="ls-metric">
                  <span className="ls-metric-val">94%</span>
                  <span className="ls-metric-label">Recommend</span>
                </div>

                <div className="ls-metric-div"></div>

                <div className="ls-metric">
                  <span className="ls-metric-val">8.9</span>
                  <span className="ls-metric-label">Ease of Use</span>
                </div>
              </div>

              {/* Actions */}
              <div className="ls-hero-actions">
                <a href="#" className="ls-btn ls-btn-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Visit Website
                </a>
                <Link to="/write-review" className="ls-btn ls-btn-outline">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  Write Review
                </Link>
                <Link to="/comparison" className="ls-btn ls-btn-outline">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M21 3l-7 7"/><path d="M3 3l7 7"/><path d="M16 21h5v-5"/><path d="M8 21H3v-5"/><path d="M21 21l-7-7"/><path d="M3 21l7-7"/></svg>
                  Compare
                </Link>
                <button
                  className="ls-btn ls-btn-outline"
                  style={saveActive ? {borderColor:'var(--accent)',color:'var(--accent)'} : {}}
                  onClick={() => setSaveActive(!saveActive)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                  Save
                </button>
                <button
                  className="ls-btn ls-btn-outline"
                  style={shareActive ? {borderColor:'var(--accent)',color:'var(--accent)'} : {}}
                  onClick={() => setShareActive(!shareActive)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div className="ls-tabs-wrap">
        <div className="container">
          <div className="ls-tabs">
            {TABS.map(tab => (
              <div
                key={tab.key}
                className={`ls-tab${activeTab === tab.key ? ' active' : ''}`}
                data-tab={tab.key}
                onClick={() => onTabChange(tab.key)}
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
