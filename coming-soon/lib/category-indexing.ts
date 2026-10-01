/* ─── Category indexing rule ──────────────────────────────────────────
   The ONE definition of "may a /{sector}/{category} page be indexed".
   Pure function, zero imports — shared by every surface that has to
   agree on it:
     · app/[...segments]/page.tsx        meta robots on the live page
     · app/sitemap-categories.xml        which category URLs get submitted
     · app/iww-hq/seo-content            the admin "indexable" flag
   A URL the sitemap lists must never render noindex, and a page that
   renders index should be in the sitemap — so all three call this
   instead of keeping their own copy of the rule.

   The rule (Oct 2026 — replaced "5+ listings at every level"):
     · L1 sectors and L2 + L3 categories are ALWAYS indexable.
     · L4 + L5 categories are indexable only when their subtree holds at
       least one active/paid listing. A deep category with nothing in it
       is an empty shell, so it stays noindex (follow) and out of the
       sitemap until its first listing lands.
     · An unlaunched category (categories.is_launched = 0 — new ones are
       created unlaunched) or one the admin flagged "noindex (hide from
       search engines)" (categories.seo_no_index = 1) is never indexable.
   ──────────────────────────────────────────────────────────────────── */

/** Deepest level that is indexable regardless of listings (L1-L3). */
export const ALWAYS_INDEXABLE_MAX_LEVEL = 3

/** Listings an L4/L5 subtree needs before the page is indexable. */
export const DEEP_CATEGORY_MIN_LISTINGS = 1

export type CategoryIndexInput = {
  /** Taxonomy depth: 1 = sector, 2-5 = categories. */
  level: number
  /** Active/paid listings anywhere in the category's subtree — the same
   *  number the page lists. null = unknown (the count query failed). */
  subtreeListings: number | null
  /** categories.is_launched. Defaults to launched. */
  launched?: boolean
  /** categories.seo_no_index — the admin's explicit opt-out. */
  noIndex?: boolean
}

/** True when the category page may carry `index` and be in the sitemap. */
export function isCategoryIndexable({
  level,
  subtreeListings,
  launched = true,
  noIndex = false,
}: CategoryIndexInput): boolean {
  if (!launched || noIndex) return false
  if (level <= ALWAYS_INDEXABLE_MAX_LEVEL) return true
  /* An unknown count never becomes a noindex. During the 2026-08-25 crawl
     the DB pool was exhausted, count queries failed, and 174 healthy pages
     emitted a wrong noindex — that de-indexes a good page and is slow to
     recover, whereas a briefly indexable empty page fixes itself on the
     next crawl. */
  if (subtreeListings == null) return true
  return subtreeListings >= DEEP_CATEGORY_MIN_LISTINGS
}
