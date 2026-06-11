import type { CSSProperties } from 'react'
import { SOFTWARE_FIELDS, SOFTWARE_FAQ } from './software-content'

/* ═══════════════════════════════════════════════════════════════════════
   Visible SEO / AEO / GEO content surface - Software & SaaS landing ONLY.

   Rendered by SectorLandingPage exclusively when cfg.slug === 'software-saas'
   (every other sector renders nothing extra). Targets the head keyword
   "SaaS directory" (+ "business software directory" secondary):
     · answer-first TL;DR card  -> featured snippets + LLM citation
     · category link grid       -> topical depth + crawl paths to L2 pages
     · how-to ordered list      -> discover + "list your software" intent
     · FAQ (mirrors SOFTWARE_FAQ) -> People-Also-Ask + voice/Speakable
     · self-contained DefinedTerm JSON-LD ("SaaS directory") - additive,
       not in the generic sector @graph, so no duplication.

   Reuses the .cat-seo* / .va-cards classes from app/styles/categories.css,
   already imported by the /[...segments] route - no new CSS ships.
   ═══════════════════════════════════════════════════════════════════════ */
const SOFTWARE_ACCENT = '#2E90E5' // sky blue (Software & SaaS "Sky Interface" palette)

export default function SoftwareDirectorySeo({ firmCount = 0 }: { firmCount?: number }) {
  const today = new Date()
  const isoDate = today.toISOString().split('T')[0]
  const humanDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const definedTerm = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'SaaS directory',
    description:
      'A SaaS directory is an online catalog of software-as-a-service and business software products organized by category, with features, pricing, and reviews so buyers can discover and compare them. InfoWebWorld is a SaaS and business software directory covering 900+ categories.',
    inDefinedTermSet: 'https://www.infowebworld.com/software-saas',
  }

  return (
    <section className="cat-seo" aria-label="About the InfoWebWorld SaaS and business software directory">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTerm) }} />

      {/* TL;DR - answer-first paragraph for AI engines + featured snippets.
          Leads with the exact target phrase in the first sentence. */}
      <div className="cat-seo-wrap cat-seo-tldr">
        <div className="cat-seo-tldr-card">
          <span className="cat-seo-tldr-label">What is this</span>
          <p className="cat-seo-tldr-body">
            <strong>InfoWebWorld is a SaaS and business software directory</strong> - a free, curated
            place to find, compare and list {firmCount > 0 ? `${firmCount.toLocaleString()} ` : ''}verified
            software across 900+ categories, from CRM and marketing to analytics, cybersecurity, and
            project management. Every product is human-verified, every review is identity-checked, and
            rankings are merit-based, never pay-to-play. Building software?{' '}
            <a href="/business">List it free</a> for a dofollow listing.
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

      {/* The software categories - internal links to each L2 page. ItemList
          microdata so the DOM agrees with the ItemList @graph node, and gives
          crawlers + buyers a path into every category. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">What you&rsquo;ll find in the software directory</h2>
          <p className="cat-seo-section-desc">
            Every software & SaaS category on InfoWebWorld, each with verified products, real buyer
            reviews, and side-by-side comparison.
          </p>
        </header>
        <nav
          className="va-cards"
          aria-label="Software categories"
          itemScope
          itemType="https://schema.org/ItemList"
          style={{ '--sec': SOFTWARE_ACCENT } as CSSProperties}
        >
          <meta itemProp="numberOfItems" content={String(SOFTWARE_FIELDS.length)} />
          {SOFTWARE_FIELDS.map((v, i) => (
            <a
              key={v.slug}
              href={`/software-saas/${v.slug}`}
              className="va-card"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(i + 1)} />
              <link itemProp="url" href={`https://www.infowebworld.com/software-saas/${v.slug}`} />
              <span className="va-card-ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
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
          <h2 className="cat-seo-h2">How to use the software directory</h2>
        </header>
        <ol className="cat-seo-steps">
          <li>
            <strong>Pick a category.</strong> Choose one of the software categories above, or use the
            search bar to jump to a use case (CRM, marketing, analytics, security).
          </li>
          <li>
            <strong>Compare verified software.</strong> Browse products in that category with real
            buyer reviews, pricing, and features side by side.
          </li>
          <li>
            <strong>Filter to your fit.</strong> Narrow by use case, pricing, and rating until you
            have a shortlist that matches your team and budget.
          </li>
          <li>
            <strong>Try it or list yours.</strong> Visit a product directly - free, no middleman - or{' '}
            <a href="/business">list your own software</a> for a verified listing and dofollow backlink.
          </li>
        </ol>
      </div>

      {/* FAQ - mirrors SOFTWARE_FAQ. Microdata on each item so Google parses
          Q + A; the .cat-seo-tldr-body + .cat-seo-faq-item selectors back the
          FAQPage speakable spec. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">SaaS &amp; software directory - FAQ</h2>
          <p className="cat-seo-section-desc">
            Everything buyers and software makers ask about finding and listing software on InfoWebWorld.
          </p>
        </header>
        <div className="cat-seo-faq">
          {SOFTWARE_FAQ.map(({ q, a }) => (
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
