import { Link } from 'react-router-dom'
import { HEALTH_ITEMS, ACTIVITY, PERFORMANCE_DATA } from '../../../data/dashboard/listingData'

export default function OverviewTab({ onNavigateToEdit }) {
  const healthScore = Math.round((HEALTH_ITEMS.filter(h => h.done).length / HEALTH_ITEMS.length) * 100)

  return (
    <>
      <div className="db-grid-2">
        {/* Listing Health */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              Listing Health
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: healthScore >= 80 ? 'var(--emerald)' : 'var(--amber)' }}>{healthScore}%</span>
          </div>
          <div className="db-card-body">
            <div className="dbl-health-bar">
              <div className="dbl-health-fill" style={{ width: `${healthScore}%`, background: healthScore >= 80 ? 'var(--emerald)' : 'var(--amber)' }} />
            </div>
            <div className="dbl-health-items">
              {HEALTH_ITEMS.map((h, i) => (
                <div key={i} className={`dbl-health-item${h.done ? ' done' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {h.done ? <polyline points="20 6 9 17 4 12"/> : <circle cx="12" cy="12" r="10"/>}
                  </svg>
                  {h.label}
                </div>
              ))}
            </div>
            {healthScore < 100 && (
              <button className="db-btn db-btn--primary" style={{ width: '100%', marginTop: 12 }} onClick={onNavigateToEdit}>
                Complete Your Listing
              </button>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Recent Activity
            </div>
            <Link to="/dashboard/analytics" className="db-card-action">View All</Link>
          </div>
          <div className="db-card-body">
            <div className="dbl-activity">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="dbl-activity-item">
                  <div className="dbl-activity-dot" style={{ background: `${a.color}18`, borderColor: a.color }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={a.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      {a.icon === 'search' && <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>}
                      {a.icon === 'star' && <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>}
                      {a.icon === 'lead' && <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></>}
                      {a.icon === 'eye' && <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                      {a.icon === 'badge' && <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>}
                    </svg>
                  </div>
                  <div className="dbl-activity-text">
                    <div>{a.text}</div>
                    <div className="dbl-activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary Table */}
      <div className="db-card db-full" style={{ marginTop: 20 }}>
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Performance Summary
          </div>
          <Link to="/dashboard/analytics" className="db-card-action">Full Analytics →</Link>
        </div>
        <div className="db-card-body">
          <table className="db-table">
            <thead>
              <tr><th>Metric</th><th>This Week</th><th>Last Week</th><th>Change</th><th>Trend</th></tr>
            </thead>
            <tbody>
              {PERFORMANCE_DATA.map((r, i) => (
                <tr key={i}>
                  <td className="db-table-name">{r.m}</td>
                  <td>{r.tw}</td>
                  <td style={{ color: 'var(--gray-400)' }}>{r.lw}</td>
                  <td><span className={`db-badge-pill db-badge--${r.up ? 'active' : 'danger'}`}>{r.ch}</span></td>
                  <td>
                    <svg viewBox="0 0 60 20" style={{ width: 60, height: 20 }}>
                      <polyline points={r.up ? '0,18 10,14 20,16 30,10 40,12 50,6 60,2' : '0,2 10,6 20,4 30,10 40,8 50,14 60,18'} fill="none" stroke={r.up ? 'var(--emerald)' : 'var(--coral)'} strokeWidth="1.5"/>
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
