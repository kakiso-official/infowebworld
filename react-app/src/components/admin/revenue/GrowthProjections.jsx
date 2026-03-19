import DashboardCard from '../../dashboard/shared/DashboardCard'
import MiniLineChart from '../shared/MiniLineChart'
import { growthProjections } from '../../../data/admin/revenueData'

export default function GrowthProjections() {
  const series = [
    { label: 'Projected', color: 'var(--emerald)', data: growthProjections.projected },
    { label: 'Conservative', color: 'var(--amber)', data: growthProjections.conservative },
  ]

  return (
    <DashboardCard
      title="6-Month Revenue Forecast"
      icon={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>}
    >
      <MiniLineChart series={series} labels={growthProjections.labels} height={180} />
    </DashboardCard>
  )
}
