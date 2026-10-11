import type { CSSProperties } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { countLabel } from '@/lib/developers/format'
import { apiCategoryPath } from '@/lib/developers/paths'
import { apiCategoryIcon } from '@/lib/developers/taxonomy'

/* ═══════════════════════════════════════════════════════════════════════
   DvCategoryGrid / DvCategoryTile (spec 4.5) - "Browse free APIs by
   category" on the Free APIs hub. Also imported by the /developers
   section hub for its own category preview, so the item shape is the
   plain fields of lib/developers/apis.ts ApiCategoryStats (slug, name,
   apis, withSdks) rather than the whole stats object.

   4 columns >= 1180, 3 >= 980, 2 >= 620, 1 below (the shared .dv-grid--4
   breakpoints). Each tile is a stretched-link card: the whole tile is
   clickable through the name link.
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvCategoryGridItem {
  slug: string
  name: string
  /** Published APIs in the category. */
  apis: number
  /** Enriched APIs with >= 1 official SDK; omitted or 0 hides the line. */
  withSdks?: number
}

export interface DvCategoryGridProps {
  items: readonly DvCategoryGridItem[]
  /** Accessible name of the grid when it has no visible heading above it. */
  label?: string
  className?: string
}

const ICON_TILE_STYLE = { '--dv-tile': '52px' } as CSSProperties

export default function DvCategoryGrid({ items, label, className }: DvCategoryGridProps) {
  if (!items.length) return null
  return (
    <ul
      className={`dv-grid dv-grid--4${className ? ` ${className}` : ''}`}
      aria-label={label}
      style={{ listStyle: 'none', margin: 0, padding: 0 }}
    >
      {items.map(item => (
        <li key={item.slug}>
          <article className="dv-card dv-card--link dv-cat-tile">
            <span className="dv-icon-tile" style={ICON_TILE_STYLE} aria-hidden="true">
              <FontAwesomeIcon icon={apiCategoryIcon(item.slug)} />
            </span>
            <div className="dv-cat-tile-body">
              <span className="dv-cat-tile-name">
                <a className="dv-card-stretch" href={apiCategoryPath(item.slug)}>{item.name}</a>
              </span>
              <span className="dv-cat-tile-meta">
                <strong>{countLabel(item.apis, 'API')}</strong>
                {!!item.withSdks && <> &middot; {countLabel(item.withSdks, 'with SDK', 'with SDKs')}</>}
              </span>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="dv-cat-tile-arrow" aria-hidden="true" />
          </article>
        </li>
      ))}
    </ul>
  )
}
