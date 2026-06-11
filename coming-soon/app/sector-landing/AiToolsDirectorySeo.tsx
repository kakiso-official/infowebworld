import type { CSSProperties } from 'react'
import { AI_TOOLS_FIELDS, AI_TOOLS_FAQ } from './ai-tools-content'

/* ═══════════════════════════════════════════════════════════════════════
   Visible SEO / AEO / GEO content surface - AI & ML landing ONLY.

   Rendered by SectorLandingPage exclusively when cfg.slug === 'ai-ml'
   (every other sector renders nothing extra, so their output is unchanged).
   Targets the head term "AI tools directory":
     · answer-first TL;DR card  -> featured snippets + LLM citation
     · category link grid       -> topical depth + crawl paths to L2 pages
     · how-to ordered list      -> "how do I use the directory" intent
     · FAQ (mirrors AI_TOOLS_FAQ) -> People-Also-Ask + voice/Speakable
     · self-contained DefinedTerm JSON-LD ("AI tools directory") - additive,
       not present in the generic sector @graph, so no duplication.

   Styling reuses the .cat-seo* / .va-cards classes from
   app/styles/categories.css, which the /[...segments] route already imports -
   so no new CSS ships and the block matches the view-all pages visually.
   ═══════════════════════════════════════════════════════════════════════ */
const AI_ACCENT = '#7C6FF0' // lavender (AI & ML palette)

export default function AiToolsDirectorySeo({ firmCount = 0 }: { firmCount?: number }) {
  const today = new Date()
  const isoDate = today.toISOString().split('T')[0]
  const humanDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const definedTerm = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'AI tools directory',
    description:
      'An AI tools directory is a searchable catalog of AI tools, agents, and models organized by category and use case, with reviews so users can discover and compare them. InfoWebWorld is an AI tools directory covering 1,000+ categories of verified AI tools.',
    inDefinedTermSet: 'https://www.infowebworld.com/ai-ml',
  }

  return (
    <section className="cat-seo" aria-label="About the InfoWebWorld AI tools directory">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTerm) }} />

      {/* TL;DR - answer-first paragraph for AI engines + featured snippets.
          Leads with the exact target phrase in the first sentence. */}
      <div className="cat-seo-wrap cat-seo-tldr">
        <div className="cat-seo-tldr-card">
          <span className="cat-seo-tldr-label">What is this</span>
          <p className="cat-seo-tldr-body">
            <strong>InfoWebWorld is an AI tools directory</strong> - a free, curated place to find
            and compare {firmCount > 0 ? `${firmCount.toLocaleString()} ` : ''}verified AI tools,
            agents, and models across 1,000+ categories, from chatbots and copilots to image, video,
            and autonomous agents. Every tool is human-verified, every review is identity-checked, and
            rankings are merit-based, never pay-to-play. Building an AI tool?{' '}
            <a href="/business">Submit it free</a> for a dofollow listing.
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

      {/* The AI categories - internal links to each L2 page. ItemList microdata
          so the DOM agrees with the ItemList @graph node, and gives crawlers +
          buyers a path into every category. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">What you&rsquo;ll find in the AI tools directory</h2>
          <p className="cat-seo-section-desc">
            Every AI category on InfoWebWorld, each with verified tools, real user reviews,
            and side-by-side comparison.
          </p>
        </header>
        <nav
          className="va-cards"
          aria-label="AI tool categories"
          itemScope
          itemType="https://schema.org/ItemList"
          style={{ '--sec': AI_ACCENT } as CSSProperties}
        >
          <meta itemProp="numberOfItems" content={String(AI_TOOLS_FIELDS.length)} />
          {AI_TOOLS_FIELDS.map((v, i) => (
            <a
              key={v.slug}
              href={`/ai-ml/${v.slug}`}
              className="va-card"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(i + 1)} />
              <link itemProp="url" href={`https://www.infowebworld.com/ai-ml/${v.slug}`} />
              <span className="va-card-ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 1 3 3 3 3 0 0 1 3 3 3 3 0 0 1 0 6 3 3 0 0 1-3 3 3 3 0 0 1-6 0 3 3 0 0 1-3-3 3 3 0 0 1 0-6 3 3 0 0 1 3-3 3 3 0 0 1 3-3z" />
                  <path d="M9 12h6M12 9v6" />
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
          <h2 className="cat-seo-h2">How to use the AI tools directory</h2>
        </header>
        <ol className="cat-seo-steps">
          <li>
            <strong>Pick a category.</strong> Choose one of the AI categories above, or use the
            search bar to jump straight to a use case (AI writing, coding, video, support).
          </li>
          <li>
            <strong>Compare verified tools.</strong> Browse AI tools in that category with real user
            reviews, pricing, and features side by side.
          </li>
          <li>
            <strong>Filter to your fit.</strong> Narrow by use case, pricing, and rating until you
            have a shortlist that matches your workflow and budget.
          </li>
          <li>
            <strong>Try it or list yours.</strong> Visit a tool directly - free, no middleman - or{' '}
            <a href="/business">submit your own AI tool</a> for a verified listing and dofollow backlink.
          </li>
        </ol>
      </div>

      {/* FAQ - mirrors AI_TOOLS_FAQ. Microdata on each item so Google parses
          Q + A; the .cat-seo-tldr-body + .cat-seo-faq-item selectors back the
          FAQPage speakable spec. */}
      <div className="cat-seo-wrap">
        <header className="cat-seo-head">
          <h2 className="cat-seo-h2">AI tools directory - FAQ</h2>
          <p className="cat-seo-section-desc">
            Everything people ask about finding and listing AI tools on InfoWebWorld.
          </p>
        </header>
        <div className="cat-seo-faq">
          {AI_TOOLS_FAQ.map(({ q, a }) => (
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
