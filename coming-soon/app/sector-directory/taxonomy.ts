import { CATEGORIES } from '../config/categories-data'
import type { CategoryCardItem } from '../test-landing-page/CategoriesSection'
import type { SectorDirectorySpec } from './types'
import { sectorCategoryPath } from '@/lib/sector-paths'

/* ═══════════════════════════════════════════════════════════════════════
   Taxonomy numbers for the sector directory pages, from the static
   taxonomy (app/config/categories-data.ts) - no DB, and they stay real as
   the taxonomy export grows.
   ═══════════════════════════════════════════════════════════════════════ */

/** Every sub-category (L3-L5) under the sector. */
export function subcategoryTotal(sector: string): number {
  return CATEGORIES.filter(c => c.sector_slug === sector && c.level >= 3).length
}

/** "800+" style floor to `step`: never claims more than the real number. */
export function floorLabel(n: number, step: number): string {
  return `${(Math.floor(n / step) * step).toLocaleString('en-US')}+`
}

/** One card per L2 the spec lists, in its order. Name and count come from
 *  the taxonomy: `count` = direct sub-categories (L3), the number the specs
 *  show next to each name, e.g. "Automotive (6)". A slug that is not an L2
 *  of the sector is dropped rather than rendered as a dead link. */
export function directoryCategoryItems(spec: SectorDirectorySpec): CategoryCardItem[] {
  const root = CATEGORIES.find(c => c.level === 1 && c.slug === spec.sector)
  if (!root) return []
  return spec.categories.l2.flatMap(({ slug, icon }) => {
    const l2 = CATEGORIES.find(c => c.level === 2 && c.parent_id === root.id && c.slug === slug)
    if (!l2) return []
    return [{
      key: l2.slug,
      href: sectorCategoryPath(spec.sector, l2.slug),
      label: l2.name,
      icon,
      accent: spec.accent,
      count: CATEGORIES.filter(c => c.parent_id === l2.id && c.level === 3).length,
    }]
  })
}
