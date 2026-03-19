import DashboardLayout from '../components/dashboard/DashboardLayout'
import CurrentPlan from '../components/dashboard/billing/CurrentPlan'
import PlanComparison from '../components/dashboard/billing/PlanComparison'
import PaymentMethod from '../components/dashboard/billing/PaymentMethod'
import BillingAddress from '../components/dashboard/billing/BillingAddress'
import InvoiceHistory from '../components/dashboard/billing/InvoiceHistory'

export default function DashboardBillingPage() {
  return (
    <DashboardLayout title="Billing & Plan" subtitle="Manage your subscription">
      <CurrentPlan />
      <PlanComparison />

      <div className="db-grid-2" style={{ marginBottom: 24 }}>
        <PaymentMethod />
        <BillingAddress />
      </div>

      <InvoiceHistory />
    </DashboardLayout>
  )
}
