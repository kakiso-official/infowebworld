import { requireDashboardUser } from '@/lib/user-auth'
import { queryOne } from '@/lib/db'
import DashboardClient from './DashboardClient'
import DashboardAnalytics from './DashboardAnalytics'

export const dynamic = 'force-dynamic'

/**
 * Dashboard home.
 *
 * Branch:
 *   - User has 0 listings → render <DashboardClient /> (the 3-card "Grow Your
 *     Business" hero — List a Company / List a Product / Write a Review).
 *   - User has ≥1 listing → render <DashboardAnalytics /> (per-listing views,
 *     website-click count, leads, followers, reviews, 30-day sparkline,
 *     recent activity feed).
 *
 * The flip is permanent: once they've submitted a listing they always see the
 * analytics view here. The 3 entry CTAs are still reachable via the sidebar's
 * "New listing" item, so we don't lose discovery.
 */
export default async function DashboardPage({
  params,
}: {
  params: Promise<Record<string, never>>
}) {
  await params
  const user = await requireDashboardUser()

  let hasListing = false
  try {
    const row = await queryOne<{ id: number }>(
      `SELECT id FROM submissions WHERE user_id = ? LIMIT 1`,
      [user.id]
    )
    hasListing = !!row
  } catch (err) {
    /* DB hiccup — fall back to the welcome hero rather than failing the
       whole page. Worst case the user briefly sees the 3-card grid until
       their next refresh. */
    console.warn('[dashboard] listing-count probe failed:', err)
  }

  return hasListing
    ? <DashboardAnalytics userId={user.id} userName={user.name} />
    : <DashboardClient />
}
