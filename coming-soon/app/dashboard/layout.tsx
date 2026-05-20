import { requireDashboardUser } from '@/lib/user-auth'
import { getUserPlan } from '@/lib/user-plan'
import { queryOne } from '@/lib/db'
import DashboardShell from './DashboardShell'

export const dynamic = 'force-dynamic'

/**
 * Dashboard shell layout — sidebar + main. Intentionally skips the site
 * Navbar/Footer to give the app-like full-screen feel. Auth is enforced
 * here AND on every child page (defense in depth) — if either guard ever
 * drifts the other still keeps anonymous traffic out.
 *
 * Also reads the user's company-listing flag (any state) so the sidebar
 * can conditionally show the "My Company" entry. Wrapped in try/catch
 * because listing_mode is a recent column — pre-migration we treat the
 * user as having no company.
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

  let hasCompany = false
  let hasAnyListing = false
  try {
    const [coRow, anyRow] = await Promise.all([
      queryOne<{ id: number }>(
        `SELECT id FROM submissions
          WHERE user_id = ? AND listing_mode = 'company'
          LIMIT 1`,
        [user.id]
      ),
      queryOne<{ id: number }>(
        `SELECT id FROM submissions WHERE user_id = ? LIMIT 1`,
        [user.id]
      ),
    ])
    hasCompany = !!coRow
    hasAnyListing = !!anyRow
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column.*listing_mode/.test(msg)) throw err
    /* Pre-migration — fall back to the listing_mode-agnostic count so the
       "My Listings" sidebar entry can still appear for legacy rows. */
    const anyRow = await queryOne<{ id: number }>(
      `SELECT id FROM submissions WHERE user_id = ? LIMIT 1`,
      [user.id]
    )
    hasAnyListing = !!anyRow
  }

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
      hasCompany={hasCompany}
      hasAnyListing={hasAnyListing}
    >
      {children}
    </DashboardShell>
  )
}
