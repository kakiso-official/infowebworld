import type { CSSProperties } from 'react'
import { IT_FIELDS, IT_FAQ } from './it-content'

/* ═══════════════════════════════════════════════════════════════════════
   Visible SEO / AEO / GEO content surface - IT Services & Agencies landing ONLY.

   Rendered by SectorLandingPage exclusively when cfg.slug ===
   'it-services-agencies' (every other sector renders nothing extra). Targets a
   disambiguated "IT & digital agency directory" head (plain "find an agency"
   pulls government results; "agency directory" head is the Clutch/DesignRush
   wall - win on the "[service] agencies in [city]" long-tail):
     · answer-first TL;DR card  -> featured snippets + LLM citation
     · service link grid        -> topical depth + crawl paths to L2 pages
     · how-to ordered list      -> hire + "list your agency" intent
     · FAQ (mirrors IT_FAQ, incl. a vs-Clutch/DesignRush answer) -> PAA + voice
     · self-contained DefinedTerm JSON-LD ("agency directory")

   Reuses the .cat-seo* / .va-cards classes from app/styles/categories.css,
   already imported by the /[...segments] route - no new CSS ships.
   ═══════════════════════════════════════════════════════════════════════ */
const IT_ACCENT = '#16B8A6' // mint/teal (IT "Mint Circuit" palette)

export default function ItAgencyDirectorySeo({ firmCount = 0 }: { firmCount?: number }) {
  const today = new Date()
  const isoDate = today.toISOString().split('T')[0]
  const humanDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const definedTerm = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Agency directory',
    description:
      'An agency directory is a curated listing of service agencies organized by service and location, with portfolios, reviews, and details so businesses can find and hire the right partner. InfoWebWorld is an agency directory for IT, web, software, design, and digital marketing agencies.',
    inDefinedTermSet: 'https://www.infowebworld.com/it-services-agencies',
  }

  return (
    <section className="cat-seo" aria-label="About the InfoWebWorld IT and digital agency directory">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTerm) }} />

      {/* TL;DR - answer-first paragraph for AI engines + featured snippets.
          Leads with the exact target phrase in the first sentence. */}
      <div className="cat-seo-wrap cat-seo-tldr">
        <div className="cat-seo-tldr-card">
          <span className="cat-seo-tldr-label">What is this</span>
          <p className="cat-seo-tldr-body">
            <strong>InfoWebWorld is an IT &amp; digital agency directory</strong> - a free, curated
            place to find, compare and hire {firmCount > 0 ? `${firmCount.toLocaleString()} ` : ''}verified
            agencies by service and city, from web, mobile, and software development to design, UX, and
            digital marketing. Every agency is human-verified, every review is identity-checked, and
            rankings are merit-based, never pay-to-play. Run an agency?{' '}
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

      {/* The service categories - internal links to each L2 page. ItemList
          microdata so the DOM agrees with the ItemList @graph node, and gives
          crawlers + buyers a path into every service. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">What you&rsquo;ll find in the agency directory</h2>
          <p className="cat-seo-section-desc">
            Every IT & digital service on InfoWebWorld, each with verified agencies, real client
            reviews, and side-by-side comparison by city.
          </p>
        </header>
        <nav
          className="va-cards"
          aria-label="Agency service categories"
          itemScope
          itemType="https://schema.org/ItemList"
          style={{ '--sec': IT_ACCENT } as CSSProperties}
        >
          <meta itemProp="numberOfItems" content={String(IT_FIELDS.length)} />
          {IT_FIELDS.map((v, i) => (
            <a
              key={v.slug}
              href={`/it-services-agencies/${v.slug}`}
              className="va-card"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(i + 1)} />
              <link itemProp="url" href={`https://www.infowebworld.com/it-services-agencies/${v.slug}`} />
              <span className="va-card-ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
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
          <h2 className="cat-seo-h2">How to use the agency directory</h2>
        </header>
        <ol className="cat-seo-steps">
          <li>
            <strong>Pick a service.</strong> Choose one of the service categories above, or search a
            service plus your city (for example, &ldquo;web development companies in London&rdquo;).
          </li>
          <li>
            <strong>Compare verified agencies.</strong> Browse agencies in that service with real
            client reviews, portfolios, and details side by side.
          </li>
          <li>
            <strong>Filter by city &amp; rating.</strong> Narrow by location and top ratings until you
            have a shortlist that matches your project and budget.
          </li>
          <li>
            <strong>Contact or list yours.</strong> Reach an agency directly - free, no referral fee -
            or <a href="/business">list your own agency</a> for a verified listing and dofollow backlink.
          </li>
        </ol>
      </div>

      {/* FAQ - mirrors IT_FAQ. Microdata on each item so Google parses Q + A;
          the .cat-seo-tldr-body + .cat-seo-faq-item selectors back the FAQPage
          speakable spec. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">Agency directory - FAQ</h2>
          <p className="cat-seo-section-desc">
            Everything buyers and agency owners ask about finding and listing agencies on InfoWebWorld.
          </p>
        </header>
        <div className="cat-seo-faq">
          {IT_FAQ.map(({ q, a }) => (
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
