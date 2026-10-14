/* ─── Reviews kept out of the public review strips ────────────────────
   The scrolling "latest reviews" strips (homepage, the six sector
   directories, the country pages) show buyers' reviews, so reviews
   written from the team's own accounts are left out of them (Oct 14 2026
   SEO request: every card in the homepage strip read "Aadil Parmar").
   Those reviews are not hidden anywhere else - they still show on the
   listing and profile pages they were written for.

   business_users.id of the founder's accounts: 7, 8 and 10 hold the
   reviews; 1 is the "Aadil Test" account. Add an id here to keep another
   team account out of the strips.
   ──────────────────────────────────────────────────────────────────── */

const STRIP_EXCLUDED_REVIEWER_IDS: readonly number[] = [1, 7, 8, 10]

/** SQL condition for a query over `reviews r` that drops those accounts'
 *  reviews. The ids are compile-time integers, so inlining them is safe. */
export const STRIP_REVIEWER_FILTER = STRIP_EXCLUDED_REVIEWER_IDS.length
  ? `AND r.user_id NOT IN (${STRIP_EXCLUDED_REVIEWER_IDS.filter(Number.isInteger).join(', ')})`
  : ''
