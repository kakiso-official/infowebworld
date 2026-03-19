import DashboardCard from '../../dashboard/shared/DashboardCard'
import MiniBarChart from '../shared/MiniBarChart'
import { qualityDistribution } from '../../../data/admin/listingsData'

export default function QualityScoresChart() {
  return (
    <DashboardCard
      title="Quality Score Distribution"
      icon={<><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></>}
    >
      <MiniBarChart
        data={qualityDistribution}
        labelKey="label"
        valueKey="value"
      />
    </DashboardCard>
  )
}
