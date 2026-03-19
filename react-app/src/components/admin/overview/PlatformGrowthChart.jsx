import DashboardCard from '../../dashboard/shared/DashboardCard'
import MiniLineChart from '../shared/MiniLineChart'
import { platformGrowth } from '../../../data/admin/overviewData'

export default function PlatformGrowthChart() {
  return (
    <DashboardCard
      title="Platform Growth"
      icon={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>}
    >
      <MiniLineChart
        series={[
          { data: platformGrowth.users, color: 'var(--accent)', label: 'Users' },
          { data: platformGrowth.listings, color: 'var(--emerald)', label: 'Listings' },
        ]}
        labels={platformGrowth.labels}
        height={180}
      />
    </DashboardCard>
  )
}
