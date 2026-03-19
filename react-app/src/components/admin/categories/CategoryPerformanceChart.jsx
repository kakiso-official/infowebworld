import DashboardCard from '../../dashboard/shared/DashboardCard'
import MiniBarChart from '../shared/MiniBarChart'
import { categoryPerformance } from '../../../data/admin/categoriesData'

export default function CategoryPerformanceChart() {
  const top10 = [...categoryPerformance]
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)

  return (
    <DashboardCard
      title="Top Categories by Views"
      icon={<><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></>}
    >
      <MiniBarChart data={top10} height={200} labelKey="label" valueKey="value" />
    </DashboardCard>
  )
}
