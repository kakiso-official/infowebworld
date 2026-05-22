import Link from 'next/link'
import { CATEGORIES as STATIC_CATEGORIES } from '../config/categories-data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faRobot, faImage, faVideo, faCode, faPenNib, faGears,
} from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   AI/ML "Find verified AI tools across every category" — same layout
   as /test-landing-page's CategoriesSection (6 cards in a 3×2 grid),
   but the cards are the 6 hero L2 categories under AI/ML instead of
   the 6 L1 sectors. Icons → Font Awesome Solid (faRobot, faImage, …).
   All `.tlp-cats-*` and `.tlp-cat-card-*` classes are reused so the
   layout/typography stay 1:1 — colour overrides happen via .tcat1
   selectors in test-category-1-page.css.

   Each card:
     · sector icon (currentColor, lavender via .tcat1 override)
     · L2 name → /ai-ml/<l2-slug>
     · "Services" pill + top 5 L3 children of that L2 (real, from the
        generated taxonomy in app/config/categories-data.ts)
     · "Locations" pill + the same 5 default markets used on
        /test-landing-page (kept by request — "other things same to same")
   Below the grid: "Explore all AI categories" CTA → /ai-ml.
   ═══════════════════════════════════════════════════════════════════════ */

interface CatDef {
  slug: string
  label: string
  icon: IconDefinition
}

const CATEGORIES: CatDef[] = [
  { slug: 'ai-assistants-chatbots',           label: 'AI Assistants & Chatbots',     icon: faRobot  },
  { slug: 'ai-image-generation',              label: 'AI Image Generation',          icon: faImage  },
  { slug: 'ai-video-generation',              label: 'AI Video Generation',          icon: faVideo  },
  { slug: 'ai-code-developer-tools',          label: 'AI Code & Developer Tools',    icon: faCode   },
  { slug: 'ai-writing-long-form-text',        label: 'AI Writing & Long-Form Text',  icon: faPenNib },
  { slug: 'ai-agent-frameworks-infrastructure', label: 'AI Agents & Frameworks',     icon: faGears  },
]

const LOCATIONS = ['USA', 'India', 'UK', 'Canada', 'Australia']

/** Pull the top N L3 children of an L2 category, in taxonomy sort
 *  order. Returns the slug + name so each chip can deep-link to
 *  /ai-ml/<l2-slug>/<l3-slug>. */
function topL3sOfL2(l2Slug: string, limit = 5): { name: string; slug: string }[] {
  const l2 = STATIC_CATEGORIES.find(c => c.slug === l2Slug && c.level === 2)
  if (!l2) return []
  return STATIC_CATEGORIES
    .filter(c => c.parent_id === l2.id && c.level === 3)
    .slice(0, limit)
    .map(c => ({ name: c.name, slug: c.slug }))
}

export default function CategoriesSection() {
  return (
    <section className="tlp-cats" aria-labelledby="tcat-cats-h">
      <div className="tlp-cats-inner">
        <header className="tlp-cats-head">
          <h2 id="tcat-cats-h" className="tlp-cats-title">
            Find verified AI tools across every category
          </h2>
          <p className="tlp-cats-sub">
            Discover trusted AI assistants, image and video generators, copilots, agents, and frameworks — all verified, moderated, and never paid for.
          </p>
        </header>

        <div className="tlp-cats-grid">
          {CATEGORIES.map(c => {
            const services = topL3sOfL2(c.slug, 5)
            return (
              <article key={c.slug} className="tlp-cat-card">
                <div className="tlp-cat-card-ico">
                  <FontAwesomeIcon icon={c.icon} style={{ width: 36, height: 36 }} />
                </div>
                <Link href={`/ai-ml/${c.slug}`} className="tlp-cat-card-name">{c.label}</Link>

                <span className="tlp-cat-card-pill">Services</span>
                <ul className="tlp-cat-card-tags">
                  {services.map((sub, i) => (
                    <li key={sub.slug}>
                      <Link href={`/ai-ml/${c.slug}/${sub.slug}`} className="tlp-cat-card-tag">
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
          <Link href="/ai-ml" className="tlp-cats-cta-btn">Explore all AI categories</Link>
        </div>
      </div>
    </section>
  )
}
