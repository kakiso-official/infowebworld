import DashboardCard from '../../dashboard/shared/DashboardCard'
import { flaggedContent } from '../../../data/admin/overviewData'

const severityColor = {
  high: 'var(--coral)',
  medium: 'var(--amber)',
  low: 'var(--text-light)',
}

export default function FlaggedContentAlerts() {
  return (
    <DashboardCard
      title="Flagged Content"
      icon={<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>}
      action="View All"
      actionLink="/admin/reviews"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {flaggedContent.map(item => (
          <div key={item.id} style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            padding: '10px 0', borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className={`db-badge db-badge--${item.type === 'Review' ? 'pending' : 'inactive'}`}>{item.type}</span>
              <span style={{ fontWeight: 500, fontSize: 13 }}>{item.target}</span>
              <span style={{
                marginLeft: 'auto', fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                color: severityColor[item.severity],
              }}>
                {item.severity}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{item.reason} &middot; {item.time}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="db-btn db-btn--outline" style={{ fontSize: 11, padding: '4px 10px' }}>Dismiss</button>
              <button className="db-btn" style={{ fontSize: 11, padding: '4px 10px' }}>Review</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
