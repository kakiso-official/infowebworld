import { requireDashboardUser } from '@/lib/user-auth'
import { getUserPlan } from '@/lib/user-plan'
import { SECTIONS, unlockedBySection } from './features'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  params,
}: {
  params: Promise<Record<string, never>>
}) {
  await params
  const user = await requireDashboardUser()

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
    <DashboardClient plan={plan} sectionCards={sectionCards} />
  )
}
