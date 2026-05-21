import Link from 'next/link'
import { CATEGORIES as STATIC_CATEGORIES } from '../config/categories-data'
import { I, ic, type IconKey } from '../components/icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { AiBrain01Icon, StartUp02Icon, DashboardSquare01Icon, BalanceScaleIcon } from '@hugeicons/core-free-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrochip, faLocationArrow } from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   Sectors block — second hero section under the search.

   Reference: GoodFirms "Choose the right development partner …" grid
   (2-row × 4-card layout). We adapt to our 6 L1 sectors in a 3×2 grid.

   Per card:
     · sector icon (from the project's Hugeicons-derived `ic` registry —
       app/components/icons.tsx — so it's consistent with the rest of
       the site, not a one-off hand-drawn SVG)
     · sector name → links to /[sector]
     · "Services" pill + top L2 categories (linked, | separated)
     · "Locations" pill + 5 common markets (static labels)
   Below the grid: "Explore all categories" CTA → /categories
   ═══════════════════════════════════════════════════════════════════════ */

interface SectorDef {
  slug: string
  label: string
  iconKey: IconKey
}

const SECTORS: SectorDef[] = [
  { slug: 'software-saas',         label: 'Software & SaaS',       iconKey: 'code' },
  { slug: 'ai-ml',                 label: 'AI & ML',               iconKey: 'sparkles' },
  { slug: 'it-services-agencies',  label: 'IT Services & Agencies', iconKey: 'building' },
  { slug: 'startups-innovation',   label: 'Startups & Innovation', iconKey: 'rocket' },
  { slug: 'local-businesses',      label: 'Local Businesses',      iconKey: 'mapPin' },
  { slug: 'professional-services', label: 'Professional Services', iconKey: 'briefcase' },
]

const LOCATIONS = ['USA', 'India', 'UK', 'Canada', 'Australia']

/** Pull the top N L2 children of an L1 sector, in taxonomy sort order. */
function topL2sOfSector(slug: string, limit = 5): { name: string; slug: string }[] {
  const l1 = STATIC_CATEGORIES.find(c => c.slug === slug && c.level === 1)
  if (!l1) return []
  return STATIC_CATEGORIES
    .filter(c => c.parent_id === l1.id && c.level === 2)
    .slice(0, limit)
    .map(c => ({ name: c.name, slug: c.slug }))
}

export default function CategoriesSection() {
  return (
    <section className="tlp-cats" aria-labelledby="tlp-cats-h">
      <div className="tlp-cats-inner">
        <header className="tlp-cats-head">
          <h2 id="tlp-cats-h" className="tlp-cats-title">
            Find verified businesses across every category
          </h2>
          <p className="tlp-cats-sub">
            Discover trusted vendors in software, services, agencies, startups, local services, and professional firms.
          </p>
        </header>

        <div className="tlp-cats-grid">
          {SECTORS.map(s => {
            const services = topL2sOfSector(s.slug, 5)
            return (
              <article key={s.slug} className="tlp-cat-card">
                <div className="tlp-cat-card-ico">
                  {s.slug === 'ai-ml' ? (
                    <HugeiconsIcon icon={AiBrain01Icon} size={38} strokeWidth={2} color="currentColor" />
                  ) : s.slug === 'startups-innovation' ? (
                    <HugeiconsIcon icon={StartUp02Icon} size={38} strokeWidth={2} color="currentColor" />
                  ) : s.slug === 'software-saas' ? (
                    <HugeiconsIcon icon={DashboardSquare01Icon} size={38} strokeWidth={2} color="currentColor" />
                  ) : s.slug === 'it-services-agencies' ? (
                    <FontAwesomeIcon icon={faMicrochip} style={{ width: 36, height: 36 }} />
                  ) : s.slug === 'local-businesses' ? (
                    <FontAwesomeIcon icon={faLocationArrow} style={{ width: 36, height: 36 }} />
                  ) : s.slug === 'professional-services' ? (
                    <HugeiconsIcon icon={BalanceScaleIcon} size={38} strokeWidth={2} color="currentColor" />
                  ) : (
                    <I d={ic[s.iconKey]} size={38} sw={2} />
                  )}
                </div>
                <Link href={`/${s.slug}`} className="tlp-cat-card-name">{s.label}</Link>

                <span className="tlp-cat-card-pill">Services</span>
                <ul className="tlp-cat-card-tags">
                  {services.map((c, i) => (
                    <li key={c.slug}>
                      <Link href={`/${s.slug}/${c.slug}`} className="tlp-cat-card-tag">{c.name}</Link>
                      {i < services.length - 1 && <span className="tlp-cat-card-bar" aria-hidden="true">|</span>}
                    </li>
                  ))}
                </ul>

                <span className="tlp-cat-card-pill">Locations</span>
                <ul className="tlp-cat-card-tags">
                  {LOCATIONS.map((loc, i) => (
                    <li key={loc}>
                      <span className="tlp-cat-card-tag tlp-cat-card-tag--static">{loc}</span>
                      {i < LOCATIONS.length - 1 && <span className="tlp-cat-card-bar" aria-hidden="true">|</span>}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>

        <div className="tlp-cats-cta">
          <Link href="/categories" className="tlp-cats-cta-btn">Explore all categories</Link>
        </div>
      </div>
    </section>
  )
}
