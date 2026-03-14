import { Link } from 'react-router-dom'

const StarSvg = () => <svg viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>

const overallTop5 = [
  { biz: 'cloudsync-pro', name: 'CloudSync Pro', cat: 'Technology', rating: '4.9', reviews: 412, color: 'var(--accent)', bg: 'rgba(108,114,241,.08)', icon: <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/> },
  { biz: 'the-garden-table', name: 'The Garden Table', cat: 'Restaurant', rating: '4.9', reviews: 287, color: 'var(--coral)', bg: 'rgba(239,107,74,.08)', icon: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/></> },
  { biz: 'precisionfix-plumbing', name: 'PrecisionFix Plumbing', cat: 'Home Services', rating: '4.9', reviews: 178, color: 'var(--amber)', bg: 'rgba(245,158,11,.08)', icon: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/> },
  { biz: 'brightpath-academy', name: 'BrightPath Academy', cat: 'Education', rating: '4.8', reviews: 523, color: 'var(--teal)', bg: 'rgba(20,184,166,.08)', icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></> },
  { biz: 'mindbridge-wellness', name: 'MindBridge Wellness', cat: 'Healthcare', rating: '4.8', reviews: 198, color: 'var(--emerald)', bg: 'rgba(47,174,106,.08)', icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/> },
]

const methodology = [
  { label: 'Verified Reviews', pct: 40, color: 'var(--accent)' },
  { label: 'Customer Satisfaction', pct: 25, color: 'var(--emerald)' },
  { label: 'Community Votes', pct: 20, color: 'var(--azure)' },
  { label: 'Response Quality', pct: 15, color: 'var(--plum)' },
]

const recentReviews = [
  { biz: 'CloudSync Pro', user: 'Sarah M.', text: '"Absolutely transformed our workflow. Best SaaS tool we\'ve used."', rating: 5, time: '2h ago', color: 'var(--accent)' },
  { biz: 'The Garden Table', user: 'James R.', text: '"The farm-to-table experience was unforgettable. 10/10."', rating: 5, time: '4h ago', color: 'var(--coral)' },
  { biz: 'BrightPath Academy', user: 'Priya K.', text: '"My daughter\'s grades improved within the first month!"', rating: 5, time: '6h ago', color: 'var(--teal)' },
]

const risingStars = [
  { biz: 'nova-design-lab', name: 'Nova Design Lab', cat: 'Marketing', change: '+142%', rating: '4.6', color: 'var(--rose)', bg: 'rgba(236,72,153,.08)', icon: <><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></> },
  { biz: 'zenith-fitness', name: 'Zenith Fitness Co', cat: 'Healthcare', change: '+98%', rating: '4.5', color: 'var(--emerald)', bg: 'rgba(47,174,106,.08)', icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/> },
  { biz: 'atlas-cowork', name: 'Atlas Cowork', cat: 'Real Estate', change: '+87%', rating: '4.4', color: 'var(--azure)', bg: 'rgba(59,130,246,.08)', icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></> },
]

const quickStats = [
  { label: 'New Reviews Today', value: '347', icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>, color: 'var(--accent)' },
  { label: 'Businesses Claimed', value: '1,842', icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>, color: 'var(--emerald)' },
  { label: 'Categories Covered', value: '80+', icon: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>, color: 'var(--azure)' },
  { label: 'Avg Response Time', value: '< 2h', icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>, color: 'var(--plum)' },
]

export default function BestOfSidebar() {
  return (
    <aside className="bo-sidebar">
      {/* Overall Top 5 */}
      <div className="bo-side-card fade-in">
        <h4 className="bo-side-title">
          <svg viewBox="0 0 24 24" stroke="var(--gold)" fill="none" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          Overall Top 5
        </h4>
        <div className="bo-side-list">
          {overallTop5.map((t, i) => (
            <Link to={`/listing?biz=${t.biz}`} className="bo-side-item" key={i}>
              <span className="bo-side-rank">{i + 1}</span>
              <div className="bo-side-icon" style={{ background: t.bg }}>
                <svg viewBox="0 0 24 24" stroke={t.color} fill="none" strokeWidth="1.5">{t.icon}</svg>
              </div>
              <div className="bo-side-info">
                <div className="bo-side-name">{t.name}</div>
                <div className="bo-side-cat">{t.cat}</div>
              </div>
              <div className="bo-side-rating"><StarSvg /><span>{t.rating}</span></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div className="bo-side-card fade-in">
        <h4 className="bo-side-title">
          <svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          How We Rank
        </h4>
        <div className="bo-method-list">
          {methodology.map((m, i) => (
            <div className="bo-method-item" key={i}>
              <div className="bo-method-top">
                <span className="bo-method-label">{m.label}</span>
                <span className="bo-method-pct" style={{ color: m.color }}>{m.pct}%</span>
              </div>
              <div className="bo-method-bar">
                <div className="bo-method-fill" style={{ width: `${m.pct * 2.5}%`, background: m.color }}></div>
              </div>
            </div>
          ))}
        </div>
        <p className="bo-method-note">Rankings are updated monthly based on new reviews and community feedback.</p>
      </div>

      {/* CTA */}
      <div className="bo-side-card bo-side-cta fade-in">
        <svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <h4 className="bo-cta-title">Get Your Business Ranked</h4>
        <p className="bo-cta-text">Join 2,500+ businesses and get discovered by thousands of customers.</p>
        <Link to="/submit-listing" className="bo-cta-btn">List Your Business <svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></Link>
      </div>

      {/* Quick categories */}
      <div className="bo-side-card fade-in">
        <h4 className="bo-side-title">
          <svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Browse by Category
        </h4>
        <div className="bo-side-cats">
          {['Technology','Restaurants','Healthcare','Real Estate','Education','Home Services','Legal','Marketing'].map(c => (
            <Link to={`/category?cat=${c.toLowerCase()}`} className="bo-side-cat-pill" key={c}>{c}</Link>
          ))}
        </div>
      </div>

      {/* Rising Stars */}
      <div className="bo-side-card fade-in">
        <h4 className="bo-side-title">
          <svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="1.5"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>
          Rising Stars
        </h4>
        <div className="bo-rising-list">
          {risingStars.map((s, i) => (
            <Link to={`/listing?biz=${s.biz}`} className="bo-rising-item" key={i}>
              <div className="bo-rising-icon" style={{ background: s.bg }}>
                <svg viewBox="0 0 24 24" stroke={s.color} fill="none" strokeWidth="1.5">{s.icon}</svg>
              </div>
              <div className="bo-rising-info">
                <div className="bo-rising-name">{s.name}</div>
                <div className="bo-rising-cat">{s.cat}</div>
              </div>
              <div className="bo-rising-change">{s.change}</div>
            </Link>
          ))}
        </div>
        <p className="bo-method-note">Fastest-growing businesses by review volume this month.</p>
      </div>

      {/* Recent Reviews */}
      <div className="bo-side-card fade-in">
        <h4 className="bo-side-title">
          <svg viewBox="0 0 24 24" stroke="var(--coral)" fill="none" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Latest Reviews
        </h4>
        <div className="bo-reviews-list">
          {recentReviews.map((r, i) => (
            <div className="bo-review-item" key={i}>
              <div className="bo-review-head">
                <div className="bo-review-avatar" style={{ background: r.color }}>{r.user[0]}</div>
                <div className="bo-review-meta">
                  <span className="bo-review-user">{r.user}</span>
                  <span className="bo-review-time">{r.time}</span>
                </div>
                <div className="bo-review-stars">
                  {[...Array(r.rating)].map((_, j) => <StarSvg key={j} />)}
                </div>
              </div>
              <p className="bo-review-text">{r.text}</p>
              <span className="bo-review-biz">on {r.biz}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bo-side-card fade-in">
        <h4 className="bo-side-title">
          <svg viewBox="0 0 24 24" stroke="var(--azure)" fill="none" strokeWidth="1.5"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
          Platform Stats
        </h4>
        <div className="bo-qstats-grid">
          {quickStats.map((s, i) => (
            <div className="bo-qstat" key={i}>
              <div className="bo-qstat-icon" style={{ color: s.color }}>
                <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5">{s.icon}</svg>
              </div>
              <div className="bo-qstat-value">{s.value}</div>
              <div className="bo-qstat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Awards Timeline */}
      <div className="bo-side-card bo-side-timeline fade-in">
        <h4 className="bo-side-title">
          <svg viewBox="0 0 24 24" stroke="var(--plum)" fill="none" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Awards Timeline
        </h4>
        <div className="bo-timeline">
          <div className="bo-timeline-item bo-timeline-item--active">
            <div className="bo-timeline-dot"></div>
            <div className="bo-timeline-content">
              <span className="bo-timeline-date">Mar 2026</span>
              <span className="bo-timeline-label">Best of 2026 — Live Now</span>
            </div>
          </div>
          <div className="bo-timeline-item">
            <div className="bo-timeline-dot"></div>
            <div className="bo-timeline-content">
              <span className="bo-timeline-date">Jan 2026</span>
              <span className="bo-timeline-label">Nominations opened</span>
            </div>
          </div>
          <div className="bo-timeline-item">
            <div className="bo-timeline-dot"></div>
            <div className="bo-timeline-content">
              <span className="bo-timeline-date">Dec 2025</span>
              <span className="bo-timeline-label">Best of 2025 archived</span>
            </div>
          </div>
          <div className="bo-timeline-item">
            <div className="bo-timeline-dot"></div>
            <div className="bo-timeline-content">
              <span className="bo-timeline-date">Oct 2025</span>
              <span className="bo-timeline-label">Community voting began</span>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bo-side-card bo-side-newsletter fade-in">
        <div className="bo-news-icon">
          <svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <h4 className="bo-news-title">Stay Updated</h4>
        <p className="bo-news-text">Get notified when new rankings drop and when businesses near you win awards.</p>
        <div className="bo-news-input-wrap">
          <input type="email" placeholder="your@email.com" className="bo-news-input" />
          <button className="bo-news-btn">
            <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
        <span className="bo-news-privacy">No spam, ever. Unsubscribe anytime.</span>
      </div>
    </aside>
  )
}
