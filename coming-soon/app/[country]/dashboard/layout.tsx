import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { queryOne } from '@/lib/db'
import { USER_COOKIE_NAME } from '@/lib/user-auth'
import { getUserPlan } from '@/lib/user-plan'
import DashboardShell from './DashboardShell'

export const dynamic = 'force-dynamic'

interface UserRow {
  id: number
  uuid: string
  email: string
  name: string | null
  avatar_url: string | null
  provider: string
}

async function getCurrentUser() {
  const store = await cookies()
  const token = store.get(USER_COOKIE_NAME)?.value
  if (!token) return null
  return await queryOne<UserRow>(
    `SELECT u.id, u.uuid, u.email, u.name, u.avatar_url, u.provider
     FROM business_sessions s JOIN business_users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > NOW() LIMIT 1`,
    [token]
  )
}

/**
 * Dashboard shell layout — sidebar + main. Intentionally skips the site
 * Navbar/Footer to give the app-like full-screen feel.
 */
export default async function DashboardLayout({
  children, params,
}: {
  children: React.ReactNode
  params: Promise<{ country: string }>
}) {
  const { country } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/${country}/business`)

  const plan = await getUserPlan(user.id)

  return (
    <DashboardShell
      country={country}
      user={{
        uuid: user.uuid,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
        provider: user.provider,
      }}
      plan={plan}
    >
      {children}
    </DashboardShell>
  )
}
