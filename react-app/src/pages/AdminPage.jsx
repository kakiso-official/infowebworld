import AdminLayout from '../components/admin/AdminLayout'
import PlatformPulseBanner from '../components/admin/overview/PlatformPulseBanner'
import PlatformKPIs from '../components/admin/overview/PlatformKPIs'
import QuickActionsGrid from '../components/admin/overview/QuickActionsGrid'
import RevenueMiniChart from '../components/admin/overview/RevenueMiniChart'
import PlatformGrowthChart from '../components/admin/overview/PlatformGrowthChart'
import TopListingsTable from '../components/admin/overview/TopListingsTable'
import ActivityFeed from '../components/admin/overview/ActivityFeed'
import FlaggedContentAlerts from '../components/admin/overview/FlaggedContentAlerts'
import SystemNotifications from '../components/admin/overview/SystemNotifications'

export default function AdminPage() {
  return (
    <AdminLayout title="Command Center" subtitle="Platform overview">
      <PlatformPulseBanner />
      <PlatformKPIs />
      <QuickActionsGrid />
      <div className="db-grid-2">
        <RevenueMiniChart />
        <PlatformGrowthChart />
      </div>
      <TopListingsTable />
      <div className="db-grid-2">
        <ActivityFeed />
        <FlaggedContentAlerts />
      </div>
      <SystemNotifications />
    </AdminLayout>
  )
}
