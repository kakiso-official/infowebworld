export default function LeadsPipelineBanner({ totalValue, newCount, contactedCount, convRate }) {
  return (
    <div className="db-welcome">
      <div className="db-welcome-bg" style={{ background: 'linear-gradient(135deg, #059669 0%, #0d9488 40%, #0891b2 70%, #0284c7 100%)' }} />
      <div className="db-welcome-content">
        <div className="db-welcome-text">
          <div className="db-welcome-title">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span className="an-pulse" style={{ background: '#fbbf24' }} />
              Lead Pipeline — ${ (totalValue / 1000).toFixed(0) }K in progress
            </span>
          </div>
          <div className="db-welcome-desc">
            You have <strong>{newCount} new leads</strong> waiting for response. Average response time is <strong>2.4 hours</strong>.
            Your conversion rate this month is <strong>{convRate}%</strong> — up 8% from last month. Keep the momentum going!
          </div>
          <div className="db-welcome-actions">
            <button className="db-btn" style={{ background: '#fff', color: '#059669' }}>Export All Leads</button>
            <button className="db-btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '1px solid rgba(255,255,255,.25)' }}>Import CSV</button>
          </div>
        </div>
        <div className="db-welcome-stats-mini">
          <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#4ade80' }} /> {newCount} new leads</div>
          <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#facc15' }} /> {contactedCount} in progress</div>
          <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#38bdf8' }} /> ${(totalValue / 1000).toFixed(0)}K pipeline</div>
        </div>
      </div>
    </div>
  )
}
