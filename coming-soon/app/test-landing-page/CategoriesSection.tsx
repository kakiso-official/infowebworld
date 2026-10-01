import Link from 'next/link'
import { CATEGORIES as STATIC_CATEGORIES } from '../config/categories-data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLaptopCode,
  faBrain,
  faServer,
  faRocket,
  faStore,
  faScaleBalanced,
  faArrowRight,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   "Browse the Global Business Directory by Category" — homepage section.

   Six sector cards, each showing only: icon, name, and a live count of
   sub-categories (L3-L5) under that sector in the static taxonomy. The
   whole card is a single link to the sector landing page.
   ═══════════════════════════════════════════════════════════════════════ */

interface SectorDef {
  slug: string
  label: string
  icon: IconDefinition
  accent: string
}

const SECTORS: SectorDef[] = [
  { slug: 'software-saas',         label: 'Software & SaaS',        icon: faLaptopCode,    accent: '#3B82F6' },
  { slug: 'ai-ml',                 label: 'AI & ML',                 icon: faBrain,         accent: '#8B5CF6' },
  { slug: 'it-services-agencies',  label: 'IT Services & Agencies',  icon: faServer,        accent: '#14B8A6' },
  { slug: 'startups-innovation',   label: 'Startups & Innovation',   icon: faRocket,        accent: '#E8553D' },
  { slug: 'local-businesses',      label: 'Local Businesses',        icon: faStore,         accent: '#F59E0B' },
  { slug: 'professional-services', label: 'Professional Services',   icon: faScaleBalanced, accent: '#2FAE6A' },
]

/** Sub-category count (levels 3-5) under an L1 sector, computed once at
 *  module scope from the static taxonomy - the same site-wide definition
 *  used by /categories and the sector view-all pages. */
const SUBCATEGORY_COUNTS: Record<string, number> = SECTORS.reduce((acc, s) => {
  acc[s.slug] = STATIC_CATEGORIES.filter(c => c.sector_slug === s.slug && c.level >= 3).length
  return acc
}, {} as Record<string, number>)

function formatSubcategoryLabel(count: number): string {
  const formatted = count.toLocaleString('en-US')
  return `${formatted} ${count === 1 ? 'subcategory' : 'subcategories'}`
}

export default function CategoriesSection() {
  return (
    <section className="hm-cats" aria-labelledby="hm-cats-h">
      <div className="hm-cats-inner">
        <header className="hm-cats-head">
          <h2 id="hm-cats-h" className="hm-cats-title">
            Browse the Global Business Directory by Category
          </h2>
          <p className="hm-cats-sub">
            Discover trusted vendors in software, services, agencies, startups, local services, and professional firms.
          </p>
        </header>

        <div className="hm-cats-grid">
          {SECTORS.map(s => {
            const count = SUBCATEGORY_COUNTS[s.slug] || 0
            return (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="hm-cat-card"
                aria-label={`Browse ${s.label} - ${formatSubcategoryLabel(count)}`}
              >
                <span
                  className="hm-cat-card-ico"
                  style={{ background: `${s.accent}1F`, color: s.accent }}
                  aria-hidden="true"
                >
                  <FontAwesomeIcon icon={s.icon} />
                </span>
                <span className="hm-cat-card-body">
                  <h3 className="hm-cat-card-name">{s.label}</h3>
                  <span className="hm-cat-card-count">{formatSubcategoryLabel(count)}</span>
                </span>
                <span className="hm-cat-card-arrow" aria-hidden="true">
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
