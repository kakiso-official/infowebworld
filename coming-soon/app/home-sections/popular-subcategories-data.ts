import { unstable_cache } from 'next/cache'
import { query } from '@/lib/db'
import { CATEGORIES, type StaticCategoryRow } from '../config/categories-data'

/* ═══════════════════════════════════════════════════════════════════════
   Data for the homepage "Every Business Need, One Directory" section.

   Picks the 12 most-listed LEVEL-3 categories (the site's "sub-categories"),
   2 per L1 sector, falling back to the next-highest ranked sub-categories
   (regardless of sector) if fewer than 12 sectors qualify.

   Live path:  one GROUP BY query on submissions, counts rolled UP the
               static parent chain so an L3 category's rank reflects its
               whole subtree (its own direct listings + every L4/L5 child).
   Fallback:   same selection algorithm, ranked by the STALE static
               `listing_count` field baked into categories-data.ts - but the
               stale number is never shown to users, so `listings` is null
               for every item in that path (the UI hides the count line).
   ═══════════════════════════════════════════════════════════════════════ */

export type PopularSubcategory = {
  name: string
  slug: string
  sectorSlug: string
  sectorLabel: string
  parentName: string
  listings: number | null
}

const SECTOR_LABELS: Record<string, string> = {
  'ai-ml': 'AI & ML',
  'software-saas': 'Software & SaaS',
  'it-services-agencies': 'IT Services & Agencies',
  'startups-innovation': 'Startups & Innovation',
  'local-businesses': 'Local Businesses',
  'professional-services': 'Professional Services',
}

/* The 6 L1 sectors, in a fixed order so selection is deterministic
   regardless of query/array ordering. */
const SECTOR_SLUGS = Object.keys(SECTOR_LABELS)

const TARGET_COUNT = 12
const PER_SECTOR = 2

/* Built once at module scope: id -> category row, for walking parent_id
   chains during the subtree rollup. */
const CATEGORY_BY_ID = new Map<number, StaticCategoryRow>(CATEGORIES.map(c => [c.id, c]))

const LEVEL_3_CATEGORIES = CATEGORIES.filter(c => c.level === 3 && !/^other\b/i.test(c.name.trim()))

/** Roll each raw per-category count UP the parent chain, so every ancestor
 *  (including the category itself) accumulates its full subtree total. */
function rollUpCounts(rawCounts: Map<number, number>): Map<number, number> {
  const subtree = new Map<number, number>()
  for (const [startId, n] of rawCounts) {
    if (!(n > 0)) continue
    const seen = new Set<number>()
    let currentId: number | null = startId
    while (currentId != null && !seen.has(currentId)) {
      seen.add(currentId)
      subtree.set(currentId, (subtree.get(currentId) ?? 0) + n)
      const current = CATEGORY_BY_ID.get(currentId)
      currentId = current?.parent_id ?? null
    }
  }
  return subtree
}

type RankedCategory = { cat: StaticCategoryRow; rank: number }

function sortRanked(a: RankedCategory, b: RankedCategory): number {
  return b.rank - a.rank || a.cat.name.localeCompare(b.cat.name)
}

/** Shared selection algorithm: top 2 L3 categories per sector (by `rankFor`),
 *  filled with the next-highest L3 categories from any sector if fewer than
 *  12 qualify, deduped, final order by rank desc then name. */
function selectTopSubcategories(rankFor: (categoryId: number) => number): RankedCategory[] {
  const ranked: RankedCategory[] = LEVEL_3_CATEGORIES
    .map(cat => ({ cat, rank: rankFor(cat.id) }))
    .filter(item => item.rank >= 1 && !!item.cat.sector_slug)

  const bySector = new Map<string, RankedCategory[]>()
  for (const item of ranked) {
    const sector = item.cat.sector_slug as string
    const list = bySector.get(sector)
    if (list) list.push(item)
    else bySector.set(sector, [item])
  }

  const pickedIds = new Set<number>()
  const picked: RankedCategory[] = []

  for (const sectorSlug of SECTOR_SLUGS) {
    const items = (bySector.get(sectorSlug) ?? []).slice().sort(sortRanked)
    for (const item of items.slice(0, PER_SECTOR)) {
      picked.push(item)
      pickedIds.add(item.cat.id)
    }
  }

  if (picked.length < TARGET_COUNT) {
    const remaining = ranked
      .filter(item => !pickedIds.has(item.cat.id))
      .sort(sortRanked)
    for (const item of remaining) {
      if (picked.length >= TARGET_COUNT) break
      picked.push(item)
      pickedIds.add(item.cat.id)
    }
  }

  return picked.sort(sortRanked).slice(0, TARGET_COUNT)
}

function toPopularSubcategory(cat: StaticCategoryRow, listings: number | null): PopularSubcategory {
  const sectorSlug = cat.sector_slug ?? ''
  return {
    name: cat.name,
    slug: cat.slug,
    sectorSlug,
    sectorLabel: SECTOR_LABELS[sectorSlug] ?? sectorSlug,
    parentName: cat.parent_name ?? '',
    listings,
  }
}

async function fetchPopularSubcategoriesUncached(): Promise<PopularSubcategory[]> {
  try {
    const rows = await query<{ category_id: number | string; n: number | string }>(
      `SELECT category_id, COUNT(*) AS n
         FROM submissions
        WHERE status IN ('active','paid')
          AND category_id IS NOT NULL
        GROUP BY category_id`
    )

    const rawCounts = new Map<number, number>()
    for (const row of rows) {
      const id = Number(row.category_id)
      const n = Number(row.n)
      if (Number.isFinite(id) && Number.isFinite(n)) {
        rawCounts.set(id, (rawCounts.get(id) ?? 0) + n)
      }
    }

    const subtreeCounts = rollUpCounts(rawCounts)
    const picked = selectTopSubcategories(id => subtreeCounts.get(id) ?? 0)
    return picked.map(({ cat, rank }) => toPopularSubcategory(cat, rank))
  } catch (err) {
    console.warn('[home] popular subcategories fetch failed, using static fallback', err)
    const picked = selectTopSubcategories(id => CATEGORY_BY_ID.get(id)?.listing_count ?? 0)
    return picked.map(({ cat }) => toPopularSubcategory(cat, null))
  }
}

export const getPopularSubcategories = unstable_cache(
  fetchPopularSubcategoriesUncached,
  ['home-popular-subcats-v2'],
  { revalidate: 600 }
)

/* ── Curated picks (AI tools directory) ─────────────────────────────────
   A hand-picked, ordered list of sub-categories instead of the top-N by
   listing count. Same live subtree counts as above; on DB failure every
   `listings` is null (the UI hides the count line), never a stale number.
   Unknown slugs are dropped rather than rendered as dead links. */

export type CuratedSubcategoryPick = {
  slug: string
  /** Display name override (e.g. title-casing "Workout planning"). */
  name?: string
}

async function fetchCuratedSubcategoriesUncached(
  sectorSlug: string,
  picks: CuratedSubcategoryPick[],
): Promise<PopularSubcategory[]> {
  const resolved = picks
    .map(p => ({ pick: p, cat: CATEGORIES.find(c => c.slug === p.slug && c.sector_slug === sectorSlug && c.level >= 2) }))
    .filter((x): x is { pick: CuratedSubcategoryPick; cat: StaticCategoryRow } => !!x.cat)

  let subtreeCounts: Map<number, number> | null = null
  try {
    const rows = await query<{ category_id: number | string; n: number | string }>(
      `SELECT category_id, COUNT(*) AS n
         FROM submissions
        WHERE status IN ('active','paid')
          AND category_id IS NOT NULL
        GROUP BY category_id`
    )
    const rawCounts = new Map<number, number>()
    for (const row of rows) {
      const id = Number(row.category_id)
      const n = Number(row.n)
      if (Number.isFinite(id) && Number.isFinite(n)) {
        rawCounts.set(id, (rawCounts.get(id) ?? 0) + n)
      }
    }
    subtreeCounts = rollUpCounts(rawCounts)
  } catch (err) {
    console.warn('[popular-subcats] curated counts fetch failed, hiding counts', err)
  }

  return resolved.map(({ pick, cat }) => ({
    ...toPopularSubcategory(cat, subtreeCounts ? (subtreeCounts.get(cat.id) ?? 0) : null),
    name: pick.name ?? cat.name,
  }))
}

export const getCuratedSubcategories = unstable_cache(
  fetchCuratedSubcategoriesUncached,
  ['curated-subcats-v1'],
  { revalidate: 600 }
)
