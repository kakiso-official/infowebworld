import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  LaptopProgrammingIcon,
  Robot01Icon,
  ToolboxIcon,
  Rocket01Icon,
  Store04Icon,
  Briefcase05Icon,
} from '@hugeicons/core-free-icons'

/* ═══════════════════════════════════════════════════════════════════════
   "Compare the top-rated tools & services" block — soft-tint banner
   under the trust grid. Big bold heading, supporting copy, then a 3×2
   grid of large square cards — one per L1 sector, each linking to
   that sector's listing page.

   Reference: GoodFirms "Compare the Top-Rated Products & Services"
   section. Icons are deliberately different from the ones used in the
   earlier CategoriesSection so the page has visual variety while still
   reading as the same brand.
   ═══════════════════════════════════════════════════════════════════════ */

const CARDS: { slug: string; label: string; icon: typeof Robot01Icon }[] = [
  { slug: 'software-saas',         label: 'Software & SaaS',        icon: LaptopProgrammingIcon },
  { slug: 'ai-ml',                 label: 'AI & ML',                icon: Robot01Icon },
  { slug: 'it-services-agencies',  label: 'IT Services & Agencies', icon: ToolboxIcon },
  { slug: 'startups-innovation',   label: 'Startups & Innovation',  icon: Rocket01Icon },
  { slug: 'local-businesses',      label: 'Local Businesses',       icon: Store04Icon },
  { slug: 'professional-services', label: 'Professional Services',  icon: Briefcase05Icon },
]

export default function CompareSection() {
  return (
    <section className="tlp-comp" aria-labelledby="tlp-comp-h">
      <div className="tlp-comp-inner">
        <header className="tlp-comp-head">
          <h2 id="tlp-comp-h" className="tlp-comp-title">
            Compare the Top-Rated Tools &amp; Services
          </h2>
          <p className="tlp-comp-sub">
            Our experts vet, rank, and review the best solutions across every category, so you don&apos;t have to.
          </p>
        </header>

        <div className="tlp-comp-grid">
          {CARDS.map(c => (
            <Link key={c.slug} href={`/${c.slug}`} className="tlp-comp-card">
              <span className="tlp-comp-card-ico">
                <HugeiconsIcon icon={c.icon} size={42} strokeWidth={1.8} color="currentColor" />
              </span>
              <span className="tlp-comp-card-name">{c.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
