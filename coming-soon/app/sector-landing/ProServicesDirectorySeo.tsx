import type { CSSProperties } from 'react'
import { PRO_SERVICES_VERTICALS, PRO_SERVICES_FAQ } from './pro-services-content'

/* ═══════════════════════════════════════════════════════════════════════
   Visible SEO / AEO / GEO content surface - Professional Services landing ONLY.

   Rendered by SectorLandingPage exclusively when cfg.slug ===
   'professional-services' (every other sector renders nothing extra, so
   their output is unchanged). Targets the head term "professional services
   directory":
     · answer-first TL;DR card  -> featured snippets + LLM citation
     · 19-field link grid       -> topical depth + crawl paths to L2 pages
     · how-to ordered list      -> "how do I use the directory" intent
     · FAQ (matches FAQPage schema in buildSectorJsonLd via the shared
       pro-services-content module) -> People-Also-Ask + voice/Speakable

   Styling reuses the .cat-seo* / .va-cards classes from
   app/styles/categories.css, which the /[...segments] route already imports
   at the top of page.tsx - so no new CSS ships and the block matches the
   view-all pages visually. The .cat-seo-tldr-body + .cat-seo-faq-item
   selectors are the ones the FAQPage `speakable` schema points at.
   ═══════════════════════════════════════════════════════════════════════ */
export default function ProServicesDirectorySeo() {
  const today = new Date()
  const isoDate = today.toISOString().split('T')[0]
  const humanDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <section className="cat-seo" aria-label="About the InfoWebWorld professional services directory">
      {/* TL;DR - answer-first paragraph for AI engines + featured snippets.
          Leads with the exact target phrase in the first sentence. */}
      <div className="cat-seo-wrap cat-seo-tldr">
        <div className="cat-seo-tldr-card">
          <span className="cat-seo-tldr-label">What is this</span>
          <p className="cat-seo-tldr-body">
            <strong>InfoWebWorld is a professional services directory</strong> - a free, curated
            place to find and compare verified professional service firms across 19 fields and
            2,400+ specialties, from accounting and legal to consulting, financial advisory, HR,
            and marketing. Every firm is human-verified, every review is identity-checked, and
            rankings are merit-based, never pay-to-play.
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

      {/* The 19 fields - internal links to every L2 page. Carries ItemList
          microdata so the DOM agrees with the ItemList @graph node, and
          gives crawlers + buyers a path into every specialty. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">What you’ll find in the professional services directory</h2>
          <p className="cat-seo-section-desc">
            Every professional service field on InfoWebWorld, each with verified firms,
            real client reviews, and side-by-side comparison.
          </p>
        </header>
        <nav
          className="va-cards"
          aria-label="Professional service fields"
          itemScope
          itemType="https://schema.org/ItemList"
          style={{ '--sec': 'var(--c1, #003B2A)' } as CSSProperties}
        >
          <meta itemProp="numberOfItems" content={String(PRO_SERVICES_VERTICALS.length)} />
          {PRO_SERVICES_VERTICALS.map((v, i) => (
            <a
              key={v.slug}
              href={`/professional-services/${v.slug}`}
              className="va-card"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(i + 1)} />
              <link itemProp="url" href={`https://www.infowebworld.com/professional-services/${v.slug}`} />
              <span className="va-card-ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
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
          <h2 className="cat-seo-h2">How to use the directory</h2>
        </header>
        <ol className="cat-seo-steps">
          <li>
            <strong>Pick a field.</strong> Choose one of the 19 professional service fields above,
            or use the search bar to jump straight to a specialty.
          </li>
          <li>
            <strong>Compare verified firms.</strong> Browse firms in that field with verified
            credentials, real client reviews, and transparent details side by side.
          </li>
          <li>
            <strong>Filter to your fit.</strong> Narrow by location, specialty, and rating until
            you have a shortlist that matches your needs and budget.
          </li>
          <li>
            <strong>Contact directly.</strong> Reach your chosen firm through InfoWebWorld - free,
            with no middleman and no referral fee.
          </li>
        </ol>
      </div>

      {/* FAQ - mirrors the FAQPage @graph (shared PRO_SERVICES_FAQ). Microdata
          on each item so Google parses Q + A even without the schema script;
          the .cat-seo-tldr-body + .cat-seo-faq-item selectors back the
          FAQPage `speakable` spec. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">Professional services directory - FAQ</h2>
          <p className="cat-seo-section-desc">
            Everything buyers ask about finding a professional services firm on InfoWebWorld.
          </p>
        </header>
        <div className="cat-seo-faq">
          {PRO_SERVICES_FAQ.map(({ q, a }) => (
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
