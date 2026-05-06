import { Suspense } from 'react'
import { requireDashboardUser } from '@/lib/user-auth'
import { getUserHighestPaidPlan } from '@/lib/user-plan'
import type { PlanTier } from '@/lib/user-plan-types'
import NewListingClient from './NewListingClient'

export const dynamic = 'force-dynamic'

/**
 * New listing page — rendered inside DashboardShell, so no navbar/footer.
 * The plan can be preset via ?plan=free|starter|yearly|lifetime; defaults
 * to 'free' when omitted.
 *
 * Auth: enforced here AND in the parent layout (defense in depth).
 * Anonymous traffic gets redirected to /business; we do not return a
 * Suspense fallback that an anonymous user could see.
 *
 * paidTier: the highest plan tier the user has actually paid for. The
 * picker uses this to decide whether to gate a tile behind /checkout.
 */
export default async function NewListingPage() {
  const user = await requireDashboardUser()
  const paidTier: PlanTier = await getUserHighestPaidPlan(user.id)
  return (
    <Suspense>
      <NewListingClient paidTier={paidTier} />
    </Suspense>
  )
}
