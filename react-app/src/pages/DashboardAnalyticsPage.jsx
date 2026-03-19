import DashboardLayout from '../components/dashboard/DashboardLayout'
import RealtimeBanner from '../components/dashboard/analytics/RealtimeBanner'
import StatCards from '../components/dashboard/analytics/StatCards'
import AudienceInsights from '../components/dashboard/analytics/AudienceInsights'
import TrafficChart from '../components/dashboard/analytics/TrafficChart'
import TrafficSources from '../components/dashboard/analytics/TrafficSources'
import ConversionGoals from '../components/dashboard/analytics/ConversionGoals'
import ActivityHeatmap from '../components/dashboard/analytics/ActivityHeatmap'
import TopSearchTerms from '../components/dashboard/analytics/TopSearchTerms'
import TopPages from '../components/dashboard/analytics/TopPages'
import DevicesAndBrowsers from '../components/dashboard/analytics/DevicesAndBrowsers'
import GeoBreakdown from '../components/dashboard/analytics/GeoBreakdown'
import TopReferrers from '../components/dashboard/analytics/TopReferrers'
import EngagementDeepDive from '../components/dashboard/analytics/EngagementDeepDive'
import PeriodComparison from '../components/dashboard/analytics/PeriodComparison'

export default function DashboardAnalyticsPage() {
  return (
    <DashboardLayout title="Analytics" subtitle="Deep performance insights">
      <RealtimeBanner />
      <StatCards />
      <AudienceInsights />
      <TrafficChart />

      <div className="db-grid-2">
        <TrafficSources />
        <ConversionGoals />
      </div>

      <ActivityHeatmap />

      <div className="db-grid-2">
        <TopSearchTerms />
        <TopPages />
      </div>

      <div className="db-grid-2">
        <DevicesAndBrowsers />
        <GeoBreakdown />
      </div>

      <div className="db-grid-2">
        <TopReferrers />
        <EngagementDeepDive />
      </div>

      <PeriodComparison />
    </DashboardLayout>
  )
}
