export default function RealtimeBanner() {
  return (
    <div className="db-welcome">
      <div className="db-welcome-bg" />
      <div className="db-welcome-content">
        <div className="db-welcome-text">
          <div className="db-welcome-title">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span className="an-pulse" />
              Real-Time Analytics
            </span>
          </div>
          <div className="db-welcome-desc">
            <strong>23 active visitors</strong> on your listing right now. Peak hour today was <strong>2:00 PM</strong> with 67 concurrent visitors. Your listing is trending <strong>22% higher</strong> than the same day last week.
          </div>
          <div className="db-welcome-actions">
            <button className="db-btn" style={{ background: '#fff', color: 'var(--accent)' }}>Export Report</button>
            <button className="db-btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '1px solid rgba(255,255,255,.25)' }}>Schedule Email</button>
          </div>
        </div>
        <div className="db-welcome-stats-mini">
          <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#4ade80' }} /> 23 live visitors</div>
          <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#facc15' }} /> 847 today's views</div>
          <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#38bdf8' }} /> 12 conversions today</div>
        </div>
      </div>
    </div>
  )
}
