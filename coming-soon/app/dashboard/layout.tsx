import { requireDashboardUser } from '@/lib/user-auth'
import { getUserPlan } from '@/lib/user-plan'
import DashboardShell from './DashboardShell'

export const dynamic = 'force-dynamic'

/**
 * Dashboard shell layout — sidebar + main. Intentionally skips the site
 * Navbar/Footer to give the app-like full-screen feel. Auth is enforced
 * here AND on every child page (defense in depth) — if either guard ever
 * drifts the other still keeps anonymous traffic out.
 */
export default async function DashboardLayout({
  children, params,
}: {
  children: React.ReactNode
  params: Promise<Record<string, never>>
}) {
  await params
  const user = await requireDashboardUser()
  const plan = await getUserPlan(user.id)

  return (
    <DashboardShell
      user={{
        uuid: user.uuid,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        provider: user.provider,
      }}
      plan={plan}
    >
      {children}
    </DashboardShell>
  )
}
