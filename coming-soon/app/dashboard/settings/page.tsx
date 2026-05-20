import { requireDashboardUser } from '@/lib/user-auth'
import { getUserPlan } from '@/lib/user-plan'
import { queryOne } from '@/lib/db'
import DashboardHeader from '../DashboardHeader'
import SettingsClient from './SettingsClient'

export const dynamic = 'force-dynamic'

export default async function SettingsPage({
  params,
}: {
  params: Promise<Record<string, never>>
}) {
  await params
  const user = await requireDashboardUser()
  const plan = await getUserPlan(user.id)

  /* Count active sessions (this row + any other open browsers). The settings
     page shows "X devices" + a sign-out-everywhere button. */
  let sessionsCount = 1
  try {
    const row = await queryOne<{ cnt: number }>(
      `SELECT COUNT(*) AS cnt FROM business_sessions
        WHERE user_id = ? AND expires_at > NOW()`,
      [user.id]
    )
    sessionsCount = Number(row?.cnt ?? 1)
  } catch { /* fall back to 1 */ }

  return (
    <div className="dash">
      <DashboardHeader title="Settings" subtitle="Manage your account and preferences." />
      <SettingsClient
        user={{
          uuid: user.uuid,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          provider: user.provider,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
        }}
        plan={plan}
        sessionsCount={sessionsCount}
      />
    </div>
  )
}
