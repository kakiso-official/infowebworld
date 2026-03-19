import DashboardLayout from '../components/dashboard/DashboardLayout'
import AccountInfo from '../components/dashboard/settings/AccountInfo'
import NotificationPreferences from '../components/dashboard/settings/NotificationPreferences'
import SecuritySection from '../components/dashboard/settings/SecuritySection'
import DangerZone from '../components/dashboard/settings/DangerZone'

export default function DashboardSettingsPage() {
  return (
    <DashboardLayout title="Settings" subtitle="Account preferences">
      <AccountInfo />
      <NotificationPreferences />
      <SecuritySection />
      <DangerZone />
    </DashboardLayout>
  )
}
