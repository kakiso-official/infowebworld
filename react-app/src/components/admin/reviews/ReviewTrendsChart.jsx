import DashboardCard from '../../dashboard/shared/DashboardCard'
import MiniLineChart from '../shared/MiniLineChart'
import { reviewTrends } from '../../../data/admin/reviewsData'

const series = [
  { label: 'Total Reviews', data: reviewTrends.total, color: 'var(--accent)' },
  { label: 'Flagged (x50)', data: reviewTrends.flagged.map(v => v * 50), color: 'var(--coral)' },
]

export default function ReviewTrendsChart() {
  return (
    <DashboardCard
      full
      title="Review Trends (12 Months)"
      icon={<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>}
    >
      <MiniLineChart series={series} labels={reviewTrends.labels} height={180} />
    </DashboardCard>
  )
}
