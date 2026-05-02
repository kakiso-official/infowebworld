import { Suspense } from 'react'
import NewListingClient from './NewListingClient'

export const dynamic = 'force-dynamic'

/**
 * New listing page — rendered inside DashboardShell, so no navbar/footer.
 * The plan can be preset via ?plan=free|starter|yearly|lifetime; defaults
 * to 'free' when omitted.
 */
export default function NewListingPage() {
  return (
    <Suspense>
      <NewListingClient />
    </Suspense>
  )
}
