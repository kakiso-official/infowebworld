import DashboardLayout from '../components/dashboard/DashboardLayout'
import WelcomeBanner from '../components/dashboard/overview/WelcomeBanner'
import QuickActionsGrid from '../components/dashboard/overview/QuickActionsGrid'
import StatsRow from '../components/dashboard/overview/StatsRow'
import PerformanceChart from '../components/dashboard/overview/PerformanceChart'
import ConversionFunnel from '../components/dashboard/overview/ConversionFunnel'
import ListingHealth from '../components/dashboard/overview/ListingHealth'
import VisitorDevices from '../components/dashboard/overview/VisitorDevices'
import CompetitorSnapshot from '../components/dashboard/overview/CompetitorSnapshot'
import GrowthTips from '../components/dashboard/overview/GrowthTips'
import RecentActivity from '../components/dashboard/overview/RecentActivity'
import LatestReviews from '../components/dashboard/overview/LatestReviews'

export default function DashboardPage() {
  return (
    <DashboardLayout title="Overview" subtitle="Welcome back, Aadil">
      <WelcomeBanner />
      <QuickActionsGrid />
      <StatsRow />

      {/* Row: Performance Chart + Conversion Funnel */}
      <div className="db-grid-2">
        <PerformanceChart />
        <ConversionFunnel />
      </div>

      {/* Row: Listing Health + Visitor Breakdown + Competitor */}
      <div className="db-grid-3">
        <ListingHealth />
        <VisitorDevices />
        <CompetitorSnapshot />
      </div>

      <GrowthTips />

      {/* Row: Activity + Reviews */}
      <div className="db-grid-2">
        <RecentActivity />
        <LatestReviews />
      </div>
    </DashboardLayout>
  )
}
