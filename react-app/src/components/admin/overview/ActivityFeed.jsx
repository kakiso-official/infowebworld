import DashboardCard from '../../dashboard/shared/DashboardCard'
import { activityFeed } from '../../../data/admin/overviewData'

export default function ActivityFeed() {
  return (
    <DashboardCard
      title="Live Activity"
      icon={<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>}
      maxHeight="340px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {activityFeed.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: item.color,
              marginTop: 6, flexShrink: 0,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text)' }}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
              <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
