import AdminLayout from '../components/admin/AdminLayout'
import RevenueKPIs from '../components/admin/revenue/RevenueKPIs'
import RevenueTrendChart from '../components/admin/revenue/RevenueTrendChart'
import PlanDistributionChart from '../components/admin/revenue/PlanDistributionChart'
import RevenueByCategory from '../components/admin/revenue/RevenueByCategory'
import TopPayingCustomers from '../components/admin/revenue/TopPayingCustomers'
import RecentTransactions from '../components/admin/revenue/RecentTransactions'
import PaymentFailures from '../components/admin/revenue/PaymentFailures'
import ChurnAnalysis from '../components/admin/revenue/ChurnAnalysis'
import GrowthProjections from '../components/admin/revenue/GrowthProjections'

export default function AdminRevenuePage() {
  return (
    <AdminLayout title="Revenue" subtitle="March 2026 financial overview">
      <RevenueKPIs />
      <RevenueTrendChart />
      <div className="db-grid-2">
        <PlanDistributionChart />
        <RevenueByCategory />
      </div>
      <TopPayingCustomers />
      <RecentTransactions />
      <div className="db-grid-2">
        <PaymentFailures />
        <ChurnAnalysis />
      </div>
      <GrowthProjections />
    </AdminLayout>
  )
}
