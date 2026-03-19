import DashboardCard from '../../dashboard/shared/DashboardCard'
import AdminDonutChart from '../shared/AdminDonutChart'
import { newsCategoryBreakdown } from '../../../data/admin/newsData'

export default function NewsCategoryBreakdown() {
  return (
    <DashboardCard
      title="Articles by Category"
      icon={<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></>}
    >
      <AdminDonutChart
        segments={newsCategoryBreakdown}
        centerValue="12"
        centerLabel="Total"
      />
    </DashboardCard>
  )
}
