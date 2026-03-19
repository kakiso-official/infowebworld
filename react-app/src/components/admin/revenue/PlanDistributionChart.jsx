import DashboardCard from '../../dashboard/shared/DashboardCard'
import AdminDonutChart from '../shared/AdminDonutChart'
import { planDistribution } from '../../../data/admin/revenueData'

export default function PlanDistributionChart() {
  return (
    <DashboardCard
      title="Revenue by Plan"
      icon={<><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></>}
    >
      <AdminDonutChart
        segments={planDistribution}
        centerValue="$147K"
        centerLabel="MRR"
      />
    </DashboardCard>
  )
}
