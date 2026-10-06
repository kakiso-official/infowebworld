import type { CSSProperties } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faBrain,
  faLaptopCode,
  faServer,
  faRocket,
  faStore,
  faScaleBalanced,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons'
import type { PopularSubcategory } from './popular-subcategories-data'
import { sectorCategoryPath } from '@/lib/sector-paths'

/* ═══════════════════════════════════════════════════════════════════════
   Homepage section: "Every Business Need, One Directory"

   Showcases the 12 most-listed sub-categories (2 per L1 sector) as a grid
   of single-link cards. Pure Server Component - `items` is pre-fetched by
   the page via getPopularSubcategories(). See popular-subcategories-data.ts
   for the exported data API.

   The sector directories (/ai-si-directory, /saas-directory, ...) reuse
   it for their curated sub-categories via the optional copy/CTA/icon
   props; with only `items` passed the homepage renders exactly as before.
   ═══════════════════════════════════════════════════════════════════════ */

const SECTOR_ACCENTS: Record<string, string> = {
  'ai-ml': '#8B5CF6',
  'software-saas': '#3B82F6',
  'it-services-agencies': '#14B8A6',
  'startups-innovation': '#E8553D',
  'local-businesses': '#F59E0B',
  'professional-services': '#2FAE6A',
}

const SECTOR_ICONS: Record<string, IconDefinition> = {
  'ai-ml': faBrain,
  'software-saas': faLaptopCode,
  'it-services-agencies': faServer,
  'startups-innovation': faRocket,
  'local-businesses': faStore,
  'professional-services': faScaleBalanced,
}

const DEFAULT_ACCENT = '#0E8F6E'

export interface PopularSubcategoriesSectionProps {
  items: PopularSubcategory[]
  heading?: string
  sub?: string
  /** Optional count pill under the sub-heading (e.g. "1,381 sub-categories"). */
  pill?: string
  ctaLabel?: string
  ctaHref?: string
  /** Per-item icon, keyed by category slug (falls back to the sector icon). */
  icons?: Record<string, IconDefinition>
  /** One accent for every card (falls back to the per-sector accent). */
  accent?: string
  /** Extra class on the grid (e.g. "hm-needs-grid--center" to centre a
   *  short last row). */
  gridClassName?: string
}

export default function PopularSubcategoriesSection({
  items,
  heading = 'Every Business Need, One Directory',
  sub = "InfoWebWorld sorts companies into clear sub-categories, so you can compare verified providers for the exact service or software you're looking for.",
  pill,
  ctaLabel = 'Explore all categories',
  ctaHref = '/categories',
  icons,
  accent,
  gridClassName,
}: PopularSubcategoriesSectionProps) {
  return (
    <section className="hm-needs" aria-labelledby="hm-needs-h">
      <div className="hm-needs-inner">
        <header className="hm-needs-head">
          <h2 id="hm-needs-h" className="hm-needs-title">
            {heading}
          </h2>
          <p className="hm-needs-sub">
            {sub}
          </p>
          {pill && (
            <p className="hm-needs-pill">
              <span>{pill}</span>
            </p>
          )}
        </header>

        {items.length > 0 && (
          <ul className={'hm-needs-grid' + (gridClassName ? ` ${gridClassName}` : '')}>
            {items.map(item => {
              const cardAccent = accent ?? SECTOR_ACCENTS[item.sectorSlug] ?? DEFAULT_ACCENT
              const icon = icons?.[item.slug] ?? SECTOR_ICONS[item.sectorSlug]
              const cardStyle = { '--hm-accent': cardAccent } as CSSProperties
              /* A curated pick can legitimately hold no listings yet - show
                 the count line only when there is something to count. */
              const countLabel = item.listings
                ? `${item.listings.toLocaleString('en-US')} ${item.listings === 1 ? 'listing' : 'listings'}`
                : null

              return (
                <li key={`${item.sectorSlug}/${item.slug}`} className="hm-needs-item">
                  <Link
                    href={sectorCategoryPath(item.sectorSlug, item.slug)}
                    className="hm-needs-card"
                    style={cardStyle}
                  >
                    {icon && (
                      <span className="hm-needs-card-icon" aria-hidden="true">
                        <FontAwesomeIcon icon={icon} />
                      </span>
                    )}
                    <h3 className="hm-needs-card-name">{item.name}</h3>
                    <p className="hm-needs-card-meta">
                      <span className="hm-needs-dot" aria-hidden="true" />
                      in {item.parentName}
                    </p>
                    {countLabel && (
                      <p className="hm-needs-card-count">{countLabel}</p>
                    )}
                    <span className="hm-needs-card-arrow" aria-hidden="true">
                      <FontAwesomeIcon icon={faArrowRight} />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}

        <div className="hm-needs-cta">
          <Link href={ctaHref} className="hm-needs-btn">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
