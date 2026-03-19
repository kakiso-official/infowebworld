import { recentActivity } from '../../../data/dashboard/leadsData'

export default function LeadActivityFeed() {
  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          Recent Activity
        </div>
      </div>
      <div className="db-card-body" style={{ padding: '4px 20px' }}>
        {recentActivity.map((a, i) => (
          <div className="db-activity-item" key={i}>
            <div className="db-activity-dot" style={{ background: a.color }} />
            <div className="db-activity-text" dangerouslySetInnerHTML={{ __html: a.text.replace(/\$\d+K/g, '<strong>$&</strong>') }} />
            <div className="db-activity-time">{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
