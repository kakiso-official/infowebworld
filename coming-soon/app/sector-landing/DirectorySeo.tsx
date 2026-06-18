import type { CSSProperties } from 'react'
import { DIRECTORY_SEO } from './directory-seo-content'

/* ═══════════════════════════════════════════════════════════════════════
   Visible SEO / AEO / GEO content surface for a sector landing.

   ONE shared component for all six sector landings. The per-sector copy,
   FAQ, accent, icon, and DefinedTerm live in ./directory-seo-content.tsx
   (which pulls its field + FAQ data from the same *-content modules the
   JSON-LD graph uses, so on-page content and schema never drift).

   Renders the block only for a sector that has a descriptor; any other
   slug returns null, so non-landing output is unchanged. Replaces the six
   former {Sector}DirectorySeo.tsx clones — identical scaffolding, data-only
   differences.

   Styling reuses the .cat-seo* / .va-cards classes from
   app/styles/categories.css, which the /[...segments] route already imports
   — so no new CSS ships and the block matches the view-all pages visually.
   The .cat-seo-tldr-body + .cat-seo-faq-item selectors are the ones the
   FAQPage `speakable` schema points at.
   ═══════════════════════════════════════════════════════════════════════ */
export default function DirectorySeo({ sectorSlug, firmCount = 0 }: { sectorSlug: string; firmCount?: number }) {
  const d = DIRECTORY_SEO[sectorSlug]
  if (!d) return null

  const today = new Date()
  const isoDate = today.toISOString().split('T')[0]
  const humanDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const definedTerm = d.definedTerm
    ? {
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        name: d.definedTerm.name,
        description: d.definedTerm.description,
        inDefinedTermSet: `https://www.infowebworld.com/${sectorSlug}`,
      }
    : null

  return (
    <section className="cat-seo" aria-label={d.ariaLabel}>
      {definedTerm && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTerm) }} />
      )}

      {/* TL;DR — answer-first paragraph for AI engines + featured snippets.
          Leads with the exact target phrase in the first sentence. */}
      <div className="cat-seo-wrap cat-seo-tldr">
        <div className="cat-seo-tldr-card">
          <span className="cat-seo-tldr-label">What is this</span>
          <p className="cat-seo-tldr-body">{d.tldr(firmCount)}</p>
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

      {/* The categories / fields — internal links to each L2 page. ItemList
          microdata so the DOM agrees with the ItemList @graph node, and gives
          crawlers + buyers a path into every category. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">{d.gridHeading}</h2>
          <p className="cat-seo-section-desc">{d.gridDesc}</p>
        </header>
        <nav
          className="va-cards"
          aria-label={d.navLabel}
          itemScope
          itemType="https://schema.org/ItemList"
          style={{ '--sec': d.accent } as CSSProperties}
        >
          <meta itemProp="numberOfItems" content={String(d.fields.length)} />
          {d.fields.map((v, i) => (
            <a
              key={v.slug}
              href={`/${sectorSlug}/${v.slug}`}
              className="va-card"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(i + 1)} />
              <link itemProp="url" href={`https://www.infowebworld.com/${sectorSlug}/${v.slug}`} />
              <span className="va-card-ico" aria-hidden="true">
                {d.icon}
              </span>
              <span className="va-card-name" itemProp="name">{v.name}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* How to use the directory — ordered, answer-style steps. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">{d.howToHeading}</h2>
        </header>
        <ol className="cat-seo-steps">
          {d.steps}
        </ol>
      </div>

      {/* FAQ — mirrors the sector's *_FAQ data. Microdata on each item so
          Google parses Q + A; the .cat-seo-tldr-body + .cat-seo-faq-item
          selectors back the FAQPage speakable spec. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">{d.faqHeading}</h2>
          <p className="cat-seo-section-desc">{d.faqDesc}</p>
        </header>
        <div className="cat-seo-faq">
          {d.faq.map(({ q, a }) => (
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
