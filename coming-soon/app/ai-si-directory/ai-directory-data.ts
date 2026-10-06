import { unstable_cache } from 'next/cache'
import {
  getPopularByL2, getRecentSectorLaunches, getPopularSectorTools,
  getSectorListingTotal, getSectorReviewsWithTopUp,
} from '../sector-landing/queries'

/* ═══════════════════════════════════════════════════════════════════════
   Live data for the AI tools directory (/ai-si-directory). Server-only.

   Every fetcher is unstable_cache'd for 10 minutes (the page itself is
   ISR at the same interval) and degrades to an empty result on a DB
   failure, so a flaky connection hides a section instead of 500ing.
   The queries are shared with the other five sector directories
   (../sector-landing/queries.ts).
   ═══════════════════════════════════════════════════════════════════════ */

const SECTOR = 'ai-ml'

/* Live AI listings over the listing's category AND its 4 ancestors (the
   old sector hero walked only 3 and missed every listing filed at L5). */
export const getAiListingTotal = unstable_cache(
  () => getSectorListingTotal(SECTOR),
  ['ai-dir-total-v2'],
  { revalidate: 600 }
)

/* "Trusted by Users, Reviewed by Buyers": approved reviews of AI listings
   first, topped up with the newest reviews from the rest of the directory. */
export const getAiReviews = unstable_cache(
  (limit: number = 8) => getSectorReviewsWithTopUp(SECTOR, limit),
  ['ai-dir-reviews-v2'],
  { revalidate: 600 }
)

/* "Featured AI Tool Listings": L2 tabs, listings on a paid (featured) plan
   first within each tab, and the tabs holding them first. */
export const getAiFeaturedByL2 = unstable_cache(
  () => getPopularByL2(SECTOR, 10, 9, { featuredFirst: true }),
  ['ai-dir-featured-v2'],
  { revalidate: 600 }
)

export const getAiLaunches = unstable_cache(
  () => getRecentSectorLaunches(SECTOR, 8),
  ['ai-dir-launches-v1'],
  { revalidate: 600 }
)

export const getAiPopularTools = unstable_cache(
  () => getPopularSectorTools(SECTOR, 6),
  ['ai-dir-popular-tools-v1'],
  { revalidate: 600 }
)
