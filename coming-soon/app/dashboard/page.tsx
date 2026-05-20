import { requireDashboardUser } from '@/lib/user-auth'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  params,
}: {
  params: Promise<Record<string, never>>
}) {
  await params
  await requireDashboardUser()
  return <DashboardClient />
}
