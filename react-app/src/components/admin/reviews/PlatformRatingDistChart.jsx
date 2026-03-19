import DashboardCard from '../../dashboard/shared/DashboardCard'
import { ratingDistribution } from '../../../data/admin/reviewsData'

export default function PlatformRatingDistChart() {
  return (
    <DashboardCard
      title="Rating Distribution"
      icon={<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ratingDistribution.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-light)', width: 50, flexShrink: 0, textAlign: 'right' }}>{item.label}</span>
            <div style={{ flex: 1, height: 20, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 4, transition: 'width 0.4s ease' }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', width: 28, textAlign: 'right', flexShrink: 0 }}>{item.value}</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
