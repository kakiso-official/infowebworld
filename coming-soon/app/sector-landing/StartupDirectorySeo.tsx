import type { CSSProperties } from 'react'
import { STARTUP_FIELDS, STARTUP_FAQ } from './startups-content'

/* ═══════════════════════════════════════════════════════════════════════
   Visible SEO / AEO / GEO content surface - Startups & Innovation landing ONLY.

   Rendered by SectorLandingPage exclusively when cfg.slug ===
   'startups-innovation' (every other sector renders nothing extra). Targets
   the head keyword "startup directory":
     · answer-first TL;DR card  -> featured snippets + LLM citation
     · sector link grid         -> topical depth + crawl paths to L2 pages
     · how-to ordered list      -> discover + "submit your startup" intent
     · FAQ (mirrors STARTUP_FAQ) -> People-Also-Ask + voice/Speakable
     · self-contained DefinedTerm JSON-LD ("startup directory") - additive,
       not in the generic sector @graph, so no duplication.

   Reuses the .cat-seo* / .va-cards classes from app/styles/categories.css,
   already imported by the /[...segments] route - no new CSS ships.
   ═══════════════════════════════════════════════════════════════════════ */
const STARTUP_ACCENT = '#F2693C' // peach/coral (Startups "Peach Ignite" palette)

export default function StartupDirectorySeo({ firmCount = 0 }: { firmCount?: number }) {
  const today = new Date()
  const isoDate = today.toISOString().split('T')[0]
  const humanDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const definedTerm = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Startup directory',
    description:
      'A startup directory is a curated catalog of startups organized by sector and stage, with profiles and reviews so founders, investors, buyers, and partners can discover and vet them. InfoWebWorld is a startup directory covering FinTech, HealthTech, EdTech, ClimateTech, AI, Web3, and more.',
    inDefinedTermSet: 'https://www.infowebworld.com/startups-innovation',
  }

  return (
    <section className="cat-seo" aria-label="About the InfoWebWorld startup directory">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTerm) }} />

      {/* TL;DR - answer-first paragraph for AI engines + featured snippets.
          Leads with the exact target phrase in the first sentence. */}
      <div className="cat-seo-wrap cat-seo-tldr">
        <div className="cat-seo-tldr-card">
          <span className="cat-seo-tldr-label">What is this</span>
          <p className="cat-seo-tldr-body">
            <strong>InfoWebWorld is a startup directory</strong> - a free, curated place to discover
            and submit {firmCount > 0 ? `${firmCount.toLocaleString()} ` : ''}verified startups across
            FinTech, HealthTech, EdTech, ClimateTech, AI, Web3, and beyond. Every startup is
            human-verified, every review is identity-checked, and rankings are merit-based, never
            pay-to-play. Building a startup? <a href="/business">Submit it free</a> for a dofollow listing.
          </p>
          <p className="cat-seo-tldr-meta">
            <span>
              Updated <time dateTime={isoDate}>{humanDate}</time>
            </span>
            <span aria-hidden="true">·</span>
            <span>Human-curated</span>
            <span aria-hidden="true">·</span>
            <span>Free to browse</span>
          </p>
        </div>
      </div>

      {/* The startup sectors - internal links to each L2 page. ItemList
          microdata so the DOM agrees with the ItemList @graph node, and gives
          crawlers + visitors a path into every sector. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">What you&rsquo;ll find in the startup directory</h2>
          <p className="cat-seo-section-desc">
            Every startup sector on InfoWebWorld, each with verified startups, real reviews,
            and side-by-side comparison.
          </p>
        </header>
        <nav
          className="va-cards"
          aria-label="Startup sectors"
          itemScope
          itemType="https://schema.org/ItemList"
          style={{ '--sec': STARTUP_ACCENT } as CSSProperties}
        >
          <meta itemProp="numberOfItems" content={String(STARTUP_FIELDS.length)} />
          {STARTUP_FIELDS.map((v, i) => (
            <a
              key={v.slug}
              href={`/startups-innovation/${v.slug}`}
              className="va-card"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(i + 1)} />
              <link itemProp="url" href={`https://www.infowebworld.com/startups-innovation/${v.slug}`} />
              <span className="va-card-ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
              </span>
              <span className="va-card-name" itemProp="name">{v.name}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* How to use the directory - ordered, answer-style steps. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">How to use the startup directory</h2>
        </header>
        <ol className="cat-seo-steps">
          <li>
            <strong>Pick a sector.</strong> Choose one of the startup sectors above, or use the
            search bar to jump to a specific category or stage.
          </li>
          <li>
            <strong>Compare verified startups.</strong> Browse startups in that sector with real
            reviews, links, and transparent details side by side.
          </li>
          <li>
            <strong>Filter to your fit.</strong> Narrow by sector, stage, and rating until you have
            a shortlist worth a closer look.
          </li>
          <li>
            <strong>Discover or list yours.</strong> Explore a startup directly - free, no middleman -
            or <a href="/business">submit your own startup</a> for a verified listing and dofollow backlink.
          </li>
        </ol>
      </div>

      {/* FAQ - mirrors STARTUP_FAQ. Microdata on each item so Google parses
          Q + A; the .cat-seo-tldr-body + .cat-seo-faq-item selectors back the
          FAQPage speakable spec. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">Startup directory - FAQ</h2>
          <p className="cat-seo-section-desc">
            Everything founders, investors, and buyers ask about discovering and listing startups on InfoWebWorld.
          </p>
        </header>
        <div className="cat-seo-faq">
          {STARTUP_FAQ.map(({ q, a }) => (
            <details key={q} className="cat-seo-faq-item" itemScope itemType="https://schema.org/Question">
              <summary itemProp="name">{q}</summary>
              <div className="cat-seo-faq-body" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p itemProp="text">{a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
