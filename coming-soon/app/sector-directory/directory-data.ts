import { unstable_cache } from 'next/cache'
import {
  getPopularByL2, getRecentSectorLaunches, getSectorListingTotal, getSectorReviewsWithTopUp,
} from '../sector-landing/queries'

/* ═══════════════════════════════════════════════════════════════════════
   Live data for the sector directory pages. Server-only.

   Every fetcher is unstable_cache'd for 10 minutes (the pages are ISR at
   the same interval), keyed by its arguments, and degrades to an empty
   result on a DB failure, so a flaky connection hides a section instead
   of 500ing. Same queries as the AI tools directory.
   ═══════════════════════════════════════════════════════════════════════ */

export const getDirectoryListingTotal = unstable_cache(
  (sector: string) => getSectorListingTotal(sector),
  ['sector-dir-total-v1'],
  { revalidate: 600 }
)

/* The sector's own reviews first, topped up from the rest of the directory. */
export const getDirectoryReviews = unstable_cache(
  (sector: string, limit: number) => getSectorReviewsWithTopUp(sector, limit),
  ['sector-dir-reviews-v1'],
  { revalidate: 600 }
)

/* "Featured ..." section: L2 tabs, listings on a paid (featured) plan first
   within each tab, and the tabs holding them first. */
export const getDirectoryFeatured = unstable_cache(
  (sector: string) => getPopularByL2(sector, 10, 9, { featuredFirst: true }),
  ['sector-dir-featured-v1'],
  { revalidate: 600 }
)

export const getDirectoryLaunches = unstable_cache(
  (sector: string) => getRecentSectorLaunches(sector, 8),
  ['sector-dir-launches-v1'],
  { revalidate: 600 }
)
