import DashboardCard from '../../dashboard/shared/DashboardCard'
import AdminDonutChart from '../shared/AdminDonutChart'
import { sentimentBreakdown } from '../../../data/admin/reviewsData'

export default function SentimentBreakdown() {
  return (
    <DashboardCard
      title="Sentiment Analysis"
      icon={<><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></>}
    >
      <AdminDonutChart
        segments={sentimentBreakdown}
        centerValue="65%"
        centerLabel="Positive"
      />
    </DashboardCard>
  )
}
