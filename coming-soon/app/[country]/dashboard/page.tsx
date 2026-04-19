import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { queryOne } from '@/lib/db'
import { USER_COOKIE_NAME } from '@/lib/user-auth'
import { getUserPlan } from '@/lib/user-plan'
import { SECTIONS, unlockedBySection } from './features'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

async function getCurrentUser() {
  const store = await cookies()
  const token = store.get(USER_COOKIE_NAME)?.value
  if (!token) return null
  return await queryOne<{ id: number }>(
    `SELECT u.id FROM business_sessions s JOIN business_users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > NOW() LIMIT 1`,
    [token]
  )
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ country: string }>
}) {
  const { country } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/${country}/business`)

  const plan = await getUserPlan(user.id)
  const perSection = unlockedBySection(plan.tier)

  const sectionCards = SECTIONS.map(s => ({
    key: s.key,
    title: s.title,
    blurb: s.blurb,
    iconKey: s.iconKey,
    color: s.color,
    unlocked: perSection[s.key]?.unlocked || 0,
    total: perSection[s.key]?.total || 0,
  }))

  return (
    <DashboardClient country={country} plan={plan} sectionCards={sectionCards} />
  )
}
