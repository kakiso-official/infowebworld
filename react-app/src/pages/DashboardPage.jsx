import { Link } from 'react-router-dom'
import DashboardLayout from '../components/dashboard/DashboardLayout'

const stats = [
  { label: 'Profile Views', value: '12,847', change: '+18%', up: true, gradient: 'linear-gradient(135deg,var(--accent),var(--plum))', icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></> },
  { label: 'Total Leads', value: '384', change: '+24%', up: true, gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></> },
  { label: 'Avg Rating', value: '4.8', change: '+0.2', up: true, gradient: 'linear-gradient(135deg,var(--amber),var(--coral))', icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></> },
  { label: 'Click-throughs', value: '2,156', change: '-3%', up: false, gradient: 'linear-gradient(135deg,var(--azure),var(--accent))', icon: <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></> },
]

const recentActivity = [
  { color: 'var(--emerald)', text: '<strong>Sarah M.</strong> left a 5-star review on your listing', time: '2 hours ago' },
  { color: 'var(--azure)', text: '<strong>John D.</strong> requested a quote through your profile', time: '4 hours ago' },
  { color: 'var(--accent)', text: 'Your listing appeared in <strong>42 search results</strong> today', time: '6 hours ago' },
  { color: 'var(--amber)', text: '<strong>Emma W.</strong> saved your business to favorites', time: '8 hours ago' },
  { color: 'var(--coral)', text: 'Monthly analytics report is ready to <strong>download</strong>', time: '1 day ago' },
  { color: 'var(--plum)', text: '<strong>Mike R.</strong> left a 4-star review on your listing', time: '1 day ago' },
]

const chartBars = [35, 52, 48, 65, 58, 72, 68, 80, 75, 88, 82, 95, 90, 78, 85, 92, 88, 96, 92, 85]

export default function DashboardPage() {
  return (
    <DashboardLayout title="Overview" subtitle="Welcome back, Aadil">
      {/* Quick Actions */}
      <div className="db-quick-actions">
        <Link to="/dashboard/profile" className="db-quick-action">
          <div className="db-quick-action-icon" style={{ background: 'linear-gradient(135deg,var(--accent),var(--plum))' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          </div>
          <span>Edit Profile</span>
        </Link>
        <Link to="/dashboard/analytics" className="db-quick-action">
          <div className="db-quick-action-icon" style={{ background: 'linear-gradient(135deg,var(--emerald),var(--teal))' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
          </div>
          <span>View Analytics</span>
        </Link>
        <Link to="/dashboard/reviews" className="db-quick-action">
          <div className="db-quick-action-icon" style={{ background: 'linear-gradient(135deg,var(--amber),var(--coral))' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <span>Reply Reviews</span>
        </Link>
        <Link to="/dashboard/leads" className="db-quick-action">
          <div className="db-quick-action-icon" style={{ background: 'linear-gradient(135deg,var(--azure),var(--accent))' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          </div>
          <span>View Leads</span>
        </Link>
        <Link to="/submit-listing" className="db-quick-action">
          <div className="db-quick-action-icon" style={{ background: 'linear-gradient(135deg,var(--rose),var(--plum))' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </div>
          <span>Add Listing</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="db-stats">
        {stats.map(s => (
          <div className="db-stat" key={s.label}>
            <div className="db-stat-icon" style={{ background: s.gradient }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
            </div>
            <div className="db-stat-value">{s.value}</div>
            <div className="db-stat-label">{s.label}</div>
            <div className={`db-stat-change ${s.up ? 'db-stat-change--up' : 'db-stat-change--down'}`}>
              <svg viewBox="0 0 24 24">{s.up ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}</svg>
              {s.change} this month
            </div>
          </div>
        ))}
      </div>

      <div className="db-grid-2">
        {/* Performance Chart */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              Profile Performance
            </div>
            <Link to="/dashboard/analytics" className="db-card-action">View Details</Link>
          </div>
          <div className="db-card-body">
            <div className="db-mini-chart">
              {chartBars.map((h, i) => (
                <div key={i} className="db-mini-bar" style={{ height: `${h}%`, opacity: 0.25 + (h / 100) * 0.65 }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>Mar 1</span>
              <span style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>Mar 14</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              Recent Activity
            </div>
          </div>
          <div className="db-card-body" style={{ padding: '8px 20px' }}>
            {recentActivity.map((a, i) => (
              <div className="db-activity-item" key={i}>
                <div className="db-activity-dot" style={{ background: a.color }} />
                <div>
                  <div className="db-activity-text" dangerouslySetInnerHTML={{ __html: a.text }} />
                  <div className="db-activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="db-card db-full">
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            Latest Reviews
          </div>
          <Link to="/dashboard/reviews" className="db-card-action">See All Reviews</Link>
        </div>
        <div className="db-card-body" style={{ padding: '4px 20px' }}>
          {[
            { name: 'Sarah Mitchell', initials: 'SM', bg: 'var(--emerald)', rating: 5, text: 'Absolutely fantastic service! The team was professional, responsive, and delivered beyond expectations. Highly recommend to anyone looking for quality.', date: '2 hours ago' },
            { name: 'Mike Rodriguez', initials: 'MR', bg: 'var(--azure)', rating: 4, text: 'Great experience overall. Communication was excellent and the end result was impressive. Minor delays but nothing significant.', date: '1 day ago' },
            { name: 'Emily Chen', initials: 'EC', bg: 'var(--plum)', rating: 5, text: 'Best in the business! I\'ve used several similar services but this one stands head and shoulders above the rest.', date: '3 days ago' },
          ].map((r, i) => (
            <div className="db-review" key={i}>
              <div className="db-review-top">
                <div className="db-review-author">
                  <div className="db-review-avatar" style={{ background: r.bg }}>{r.initials}</div>
                  <div>
                    <div className="db-review-name">{r.name}</div>
                    <div className="db-review-date">{r.date}</div>
                  </div>
                </div>
                <div className="db-stars">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} viewBox="0 0 24 24" className={s > r.rating ? 'empty' : ''}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  ))}
                </div>
              </div>
              <div className="db-review-text">{r.text}</div>
              <div className="db-review-actions">
                <button className="db-review-action">
                  <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  Reply
                </button>
                <button className="db-review-action">
                  <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                  Thank
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
