import DashboardCard from '../../dashboard/shared/DashboardCard'
import { revenueTrend } from '../../../data/admin/revenueData'

const colors = {
  basic: 'var(--amber)',
  pro: 'var(--emerald)',
  enterprise: 'var(--accent)',
}

export default function RevenueTrendChart() {
  const maxTotal = Math.max(...revenueTrend.map(d => d.basic + d.pro + d.enterprise))

  return (
    <DashboardCard
      full
      title="Revenue Trend (12 Months)"
      icon={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 200, padding: '0 4px' }}>
        {revenueTrend.map((d, i) => {
          const total = d.basic + d.pro + d.enterprise
          const chartH = 170
          const bH = (d.basic / maxTotal) * chartH
          const pH = (d.pro / maxTotal) * chartH
          const eH = (d.enterprise / maxTotal) * chartH
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 9, color: 'var(--text-light)', fontWeight: 500 }}>
                ${Math.round(total / 1000)}K
              </span>
              <div style={{ width: '100%', maxWidth: 36, display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: eH, background: colors.enterprise, borderRadius: '4px 4px 0 0', minHeight: 1 }} />
                <div style={{ height: pH, background: colors.pro, minHeight: 1 }} />
                <div style={{ height: bH, background: colors.basic, borderRadius: '0 0 4px 4px', minHeight: 1 }} />
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-light)' }}>{d.month}</span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12 }}>
        {[
          { label: 'Enterprise', color: colors.enterprise },
          { label: 'Pro', color: colors.pro },
          { label: 'Basic', color: colors.basic },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-light)' }}>
            <div style={{ width: 12, height: 8, borderRadius: 2, background: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
