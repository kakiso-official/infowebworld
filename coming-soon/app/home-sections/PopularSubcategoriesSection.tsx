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

/* ═══════════════════════════════════════════════════════════════════════
   Homepage section: "Every Business Need, One Directory"

   Showcases the 12 most-listed sub-categories (2 per L1 sector) as a grid
   of single-link cards. Pure Server Component - `items` is pre-fetched by
   the page via getPopularSubcategories(). See popular-subcategories-data.ts
   for the exported data API.
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

export default function PopularSubcategoriesSection({ items }: { items: PopularSubcategory[] }) {
  return (
    <section className="hm-needs" aria-labelledby="hm-needs-h">
      <div className="hm-needs-inner">
        <header className="hm-needs-head">
          <h2 id="hm-needs-h" className="hm-needs-title">
            Every Business Need, One Directory
          </h2>
          <p className="hm-needs-sub">
            InfoWebWorld sorts companies into clear sub-categories, so you can compare verified providers for the exact service or software you&apos;re looking for.
          </p>
        </header>

        {items.length > 0 && (
          <ul className="hm-needs-grid">
            {items.map(item => {
              const accent = SECTOR_ACCENTS[item.sectorSlug] ?? DEFAULT_ACCENT
              const icon = SECTOR_ICONS[item.sectorSlug]
              const cardStyle = { '--hm-accent': accent } as CSSProperties
              const countLabel = item.listings !== null
                ? `${item.listings.toLocaleString('en-US')} ${item.listings === 1 ? 'listing' : 'listings'}`
                : null

              return (
                <li key={`${item.sectorSlug}/${item.slug}`} className="hm-needs-item">
                  <Link
                    href={`/${item.sectorSlug}/${item.slug}`}
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
          <Link href="/categories" className="hm-needs-btn">
            Explore all categories
          </Link>
        </div>
      </div>
    </section>
  )
}
