import { redirect } from 'next/navigation'
import { requireDashboardUser } from '@/lib/user-auth'
import { getUserHighestPaidPlan } from '@/lib/user-plan'
import { TIER_RANK, type PlanTier } from '@/lib/user-plan-types'
import CheckoutClient from './CheckoutClient'

export const dynamic = 'force-dynamic'

const PAID_PLANS = ['starter', 'yearly', 'lifetime'] as const
type PaidPlan = typeof PAID_PLANS[number]

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>
}) {
  const user = await requireDashboardUser()
  const params = await searchParams
  const plan = params.plan as PaidPlan | undefined

  if (!plan || !(PAID_PLANS as readonly string[]).includes(plan)) {
    redirect('/dashboard/new')
  }

  const paidTier: PlanTier = await getUserHighestPaidPlan(user.id)
  /* User already owns this tier or higher → skip checkout, drop them
     straight into the listing form for the requested plan. */
  if (TIER_RANK[paidTier] >= TIER_RANK[plan as PlanTier]) {
    redirect(`/dashboard/new?plan=${plan}`)
  }

  return (
    <CheckoutClient
      plan={plan as PaidPlan}
      userEmail={user.email}
      userName={user.name || ''}
    />
  )
}
