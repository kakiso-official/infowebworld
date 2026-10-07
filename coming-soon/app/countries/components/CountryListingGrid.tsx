'use client'

import { useMemo } from 'react'
import { RealListingCard } from '../../components-category/ListingCard'
import LocalBusinessCard from '../../components-category/LocalBusinessCard'
import { mapRow } from '../../iww-hq/data/submissions-storage'
import type { ListingRow } from '../country-data'

/* ═══════════════════════════════════════════════════════════════════════
   The full category-page listing card for country pages. Rows come from
   the server already JSON-safe (explicit, PII-free column list); mapRow()
   turns them into RealSubmission exactly as the category page does.

   Each card sits in a .tcat-<sector> scope so its accents follow the
   listing's own sector palette - on the mixed country hub too. Local
   businesses use the Yelp-style card unless an admin flipped the listing
   to the classic design (lb_design_mode = 'classic'), same rule as
   app/CategoryPage.tsx.
   ═══════════════════════════════════════════════════════════════════════ */

export default function CountryListingGrid({
  rows, sector, emptyText = 'No listings yet.',
}: {
  rows: ListingRow[]
  /** The page's sector, when every row belongs to it. */
  sector?: string
  emptyText?: string
}) {
  const items = useMemo(
    () => rows.map(r => ({
      item: mapRow(r),
      sector: String(r.sector_slug || sector || ''),
    })),
    [rows, sector],
  )

  if (items.length === 0) {
    return <p className="cdir-empty">{emptyText}</p>
  }

  return (
    <div className="cd-page cdir-cards">
      {items.map(({ item, sector: s }) => (
        <div key={item.id} className={'cdir-card-scope' + (s ? ` tcat-${s}` : '')}>
          {s === 'local-businesses' && item.lbDesignMode !== 'classic'
            ? <LocalBusinessCard item={item} />
            : <RealListingCard item={item} sectorSlug={s} />}
        </div>
      ))}
    </div>
  )
}
