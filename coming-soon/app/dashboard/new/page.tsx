import { Suspense } from 'react'
import { requireDashboardUser } from '@/lib/user-auth'
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
 */
export default async function NewListingPage() {
  await requireDashboardUser()
  return (
    <Suspense>
      <NewListingClient />
    </Suspense>
  )
}
