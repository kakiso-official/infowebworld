import type { CSSProperties } from 'react'
import { LOCAL_FIELDS, LOCAL_FAQ } from './local-content'

/* ═══════════════════════════════════════════════════════════════════════
   Visible SEO / AEO / GEO content surface - Local Businesses landing ONLY.

   Rendered by SectorLandingPage exclusively when cfg.slug === 'local-businesses'
   (every other sector renders nothing extra). Targets the head keyword
   "local business directory" - steered toward "best [niche] in [city]" intent,
   away from the unwinnable "[x] near me" map pack:
     · answer-first TL;DR card  -> featured snippets + LLM citation
     · category link grid       -> topical depth + crawl paths to L2 pages
     · how-to ordered list      -> discover + "list your business" intent
     · FAQ (mirrors LOCAL_FAQ, incl. a vs-Yelp/Google answer) -> PAA + voice
     · self-contained DefinedTerm JSON-LD ("local business directory")

   Reuses the .cat-seo* / .va-cards classes from app/styles/categories.css,
   already imported by the /[...segments] route - no new CSS ships.
   ═══════════════════════════════════════════════════════════════════════ */
const LOCAL_ACCENT = '#5E9E7B' // sage green (Local "Sage Community" palette)

export default function LocalDirectorySeo({ firmCount = 0 }: { firmCount?: number }) {
  const today = new Date()
  const isoDate = today.toISOString().split('T')[0]
  const humanDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const definedTerm = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Local business directory',
    description:
      'A local business directory is an online listing of local businesses organized by category and location, with profiles, contact details, and reviews so people can find trusted businesses in their area. InfoWebWorld is a local business directory covering restaurants, home services, health, automotive, beauty, retail and more.',
    inDefinedTermSet: 'https://www.infowebworld.com/local-businesses',
  }

  return (
    <section className="cat-seo" aria-label="About the InfoWebWorld local business directory">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTerm) }} />

      {/* TL;DR - answer-first paragraph for AI engines + featured snippets.
          Leads with the exact target phrase in the first sentence. */}
      <div className="cat-seo-wrap cat-seo-tldr">
        <div className="cat-seo-tldr-card">
          <span className="cat-seo-tldr-label">What is this</span>
          <p className="cat-seo-tldr-body">
            <strong>InfoWebWorld is a local business directory</strong> - a free, curated place to
            find, compare and review {firmCount > 0 ? `${firmCount.toLocaleString()} ` : ''}verified
            local businesses by category and city, from restaurants and home services to health,
            automotive, beauty, and retail. Every business is human-verified, every review is
            identity-checked, and rankings are merit-based, never pay-to-play. Own a local business?{' '}
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

      {/* The local categories - internal links to each L2 page. ItemList
          microdata so the DOM agrees with the ItemList @graph node, and gives
          crawlers + customers a path into every category. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">What you&rsquo;ll find in the local business directory</h2>
          <p className="cat-seo-section-desc">
            Every local category on InfoWebWorld, each with verified businesses, real customer
            reviews, and side-by-side comparison by city.
          </p>
        </header>
        <nav
          className="va-cards"
          aria-label="Local business categories"
          itemScope
          itemType="https://schema.org/ItemList"
          style={{ '--sec': LOCAL_ACCENT } as CSSProperties}
        >
          <meta itemProp="numberOfItems" content={String(LOCAL_FIELDS.length)} />
          {LOCAL_FIELDS.map((v, i) => (
            <a
              key={v.slug}
              href={`/local-businesses/${v.slug}`}
              className="va-card"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(i + 1)} />
              <link itemProp="url" href={`https://www.infowebworld.com/local-businesses/${v.slug}`} />
              <span className="va-card-ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
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
          <h2 className="cat-seo-h2">How to use the local business directory</h2>
        </header>
        <ol className="cat-seo-steps">
          <li>
            <strong>Pick a category.</strong> Choose one of the local categories above, or search a
            service plus your city (for example, &ldquo;best plumbers in Austin&rdquo;).
          </li>
          <li>
            <strong>Compare verified businesses.</strong> Browse businesses in that category with
            real customer reviews, hours, and contact details side by side.
          </li>
          <li>
            <strong>Filter by city &amp; rating.</strong> Narrow to your city and top ratings until
            you have a shortlist of the best in your area.
          </li>
          <li>
            <strong>Contact or list yours.</strong> Reach a business directly - free, no referral fee -
            or <a href="/business">list your own local business</a> for a verified listing and dofollow backlink.
          </li>
        </ol>
      </div>

      {/* FAQ - mirrors LOCAL_FAQ. Microdata on each item so Google parses
          Q + A; the .cat-seo-tldr-body + .cat-seo-faq-item selectors back the
          FAQPage speakable spec. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">Local business directory - FAQ</h2>
          <p className="cat-seo-section-desc">
            Everything customers and local business owners ask about finding and listing businesses on InfoWebWorld.
          </p>
        </header>
        <div className="cat-seo-faq">
          {LOCAL_FAQ.map(({ q, a }) => (
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
