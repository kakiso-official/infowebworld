import Link from 'next/link'
import { CATEGORIES as STATIC_CATEGORIES } from '../config/categories-data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { CardDef } from '@/lib/sector-landings'

/* ═══════════════════════════════════════════════════════════════════════
   Sector-landing "Find verified X across every category" grid.

   Same .tlp-cats / .tlp-cat-card-* classes as the test-landing-page
   version, scoped by the parent's .tcat-<slug> palette class. Each card:
     · sector-themed icon (currentColor → palette c4 via the .tcat-X scope)
     · L2 name → /<sector>/<l2-slug>
     · "Services" pill + top 5 L3 children pulled live from the
        generated taxonomy in app/config/categories-data.ts
     · "Locations" pill + default-market chips (USA / India / UK /
        Canada / Australia)

   Cards come in via the per-sector config in lib/sector-landings.ts.
   ═══════════════════════════════════════════════════════════════════════ */

const LOCATIONS = ['USA', 'India', 'UK', 'Canada', 'Australia']

/** Top N L3 children of an L2, in taxonomy sort order. */
function topL3sOfL2(l2Slug: string, sectorSlug: string, limit = 5): { name: string; slug: string }[] {
  const l2 = STATIC_CATEGORIES.find(c => c.slug === l2Slug && c.level === 2 && c.sector_slug === sectorSlug)
  if (!l2) return []
  return STATIC_CATEGORIES
    .filter(c => c.parent_id === l2.id && c.level === 3)
    .slice(0, limit)
    .map(c => ({ name: c.name, slug: c.slug }))
}

type Props = {
  sectorSlug: string
  heading: string
  sub: string
  cards: CardDef[]
}

export default function SectorCategoriesSection({ sectorSlug, heading, sub, cards }: Props) {
  return (
    <section className="tlp-cats" aria-labelledby="tcat-cats-h">
      <div className="tlp-cats-inner">
        <header className="tlp-cats-head">
          <h2 id="tcat-cats-h" className="tlp-cats-title">{heading}</h2>
          <p className="tlp-cats-sub">{sub}</p>
        </header>

        <div className="tlp-cats-grid">
          {cards.map(c => {
            const services = topL3sOfL2(c.slug, sectorSlug, 5)
            return (
              <article key={c.slug} className="tlp-cat-card">
                <div className="tlp-cat-card-ico">
                  <FontAwesomeIcon icon={c.icon} style={{ width: 36, height: 36 }} />
                </div>
                <Link href={`/${sectorSlug}/${c.slug}`} className="tlp-cat-card-name">{c.label}</Link>

                <span className="tlp-cat-card-pill">Services</span>
                <ul className="tlp-cat-card-tags">
                  {services.map((sub, i) => (
                    <li key={sub.slug}>
                      <Link href={`/${sectorSlug}/${c.slug}/${sub.slug}`} className="tlp-cat-card-tag">
                        {sub.name}
                      </Link>
                      {i < services.length - 1 && (
                        <span className="tlp-cat-card-bar" aria-hidden="true">|</span>
                      )}
                    </li>
                  ))}
                </ul>

                <span className="tlp-cat-card-pill">Locations</span>
                <ul className="tlp-cat-card-tags">
                  {LOCATIONS.map((loc, i) => (
                    <li key={loc}>
                      <span className="tlp-cat-card-tag tlp-cat-card-tag--static">{loc}</span>
                      {i < LOCATIONS.length - 1 && (
                        <span className="tlp-cat-card-bar" aria-hidden="true">|</span>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>

        <div className="tlp-cats-cta">
          <Link href={`/${sectorSlug}`} className="tlp-cats-cta-btn">Explore all categories</Link>
        </div>
      </div>
    </section>
  )
}
