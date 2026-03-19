import DashboardCard from '../../dashboard/shared/DashboardCard'
import MiniLineChart from '../shared/MiniLineChart'
import { userGrowth } from '../../../data/admin/usersData'

export default function UserGrowthChart() {
  return (
    <DashboardCard
      full
      title="User Growth (12 Months)"
      icon={<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>}
    >
      <MiniLineChart
        series={[{ data: userGrowth.data, color: 'var(--accent)', label: 'Total Users' }]}
        labels={userGrowth.labels}
        height={180}
      />
    </DashboardCard>
  )
}
