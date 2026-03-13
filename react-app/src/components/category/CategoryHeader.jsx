import { useState } from 'react'
import { Link } from 'react-router-dom'

const chips = ['All', 'SaaS', 'Cloud Infrastructure', 'AI / ML', 'Cybersecurity', 'DevOps', 'Data Analytics', 'CRM', 'Project Management', 'eCommerce', 'ERP']

export default function CategoryHeader() {
  const [activeChip, setActiveChip] = useState('All')

  return (
    <div className="container">
      <div className="cat-breadcrumb">
        <Link to="/">Home</Link>
        <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
        <Link to="/category">Categories</Link>
        <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
        <span>Technology</span>
      </div>

      <div className="cat-header">
        <div className="cat-header-top">
          <div className="cat-header-icon" style={{background:'rgba(108,114,241,.08)'}}>
            <svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
          </div>
          <div className="cat-header-info">
            <div className="cat-header-title-row">
              <h1>Technology Companies</h1>
              <div className="cat-award-badge">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--gold)" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Best of 2026
              </div>
            </div>
            <p>Discover top-rated software, SaaS platforms, IT services, and tech companies. Compare features, read verified reviews, and find the right solution for your needs.</p>
            <div className="cat-header-stats">
              <div className="cat-stat">
                <svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                <strong>284</strong> listings
              </div>
              <div className="cat-stat-div"></div>
              <div className="cat-stat">
                <svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <strong>8,432</strong> reviews
              </div>
              <div className="cat-stat-div"></div>
              <div className="cat-stat">
                <svg viewBox="0 0 24 24" stroke="var(--azure)" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
                <strong>96%</strong> verified
              </div>
              <div className="cat-stat-div"></div>
              <div className="cat-stat cat-stat-satisfaction">
                <div className="cat-sat-ring" style={{'--pct':87}}>
                  <svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--gray-200)" strokeWidth="2.5"/><circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--emerald)" strokeWidth="2.5" strokeDasharray="87 100" strokeDashoffset="25" strokeLinecap="round"/></svg>
                </div>
                <strong>87%</strong> avg satisfaction
              </div>
              <div className="cat-stat-div"></div>
              <div className="cat-stat">
                <svg viewBox="0 0 24 24" stroke="var(--gray-400)" fill="none"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Updated 2h ago
              </div>
            </div>
          </div>
        </div>

        <div className="cat-chips">
          {chips.map(chip => (
            <button
              key={chip}
              className={`cat-chip${activeChip === chip ? ' active' : ''}`}
              onClick={() => setActiveChip(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
