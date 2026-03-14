import { Link } from 'react-router-dom'

export default function BestOfHeader() {
  return (
    <div className="container">
      <nav className="bo-breadcrumb">
        <Link to="/">Home</Link>
        <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
        <span>Best Of 2026</span>
      </nav>
      <div className="bo-header">
        <div className="bo-header-badge">
          <svg viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          Annual Awards
        </div>
        <h1 className="bo-header-title">Best of 2026</h1>
        <p className="bo-header-sub">The top-rated businesses across every industry — ranked by verified reviews, customer satisfaction, and community votes.</p>
        <div className="bo-header-stats">
          <div className="bo-hstat">
            <svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            <strong>2,500+</strong><span>businesses ranked</span>
          </div>
          <div className="bo-hstat-div"></div>
          <div className="bo-hstat">
            <svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <strong>25,400+</strong><span>verified reviews</span>
          </div>
          <div className="bo-hstat-div"></div>
          <div className="bo-hstat">
            <svg viewBox="0 0 24 24" stroke="var(--azure)" fill="none" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <strong>80+</strong><span>industries</span>
          </div>
          <div className="bo-hstat-div"></div>
          <div className="bo-hstat">
            <svg viewBox="0 0 24 24" stroke="var(--gold)" fill="none" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <strong>4.8</strong><span>avg rating</span>
          </div>
        </div>
      </div>
    </div>
  )
}
