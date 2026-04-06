'use client'
import React from 'react'
import Link from '../../components/CountryLink'

/* eslint-disable @typescript-eslint/no-explicit-any */
type SeoContent = {
  rich_description?: string
  buyers_guide?: any
  use_cases?: any[]
  comparisons?: any[]
  long_tail_keywords?: any
  complementary_categories?: string[]
  extended_faq?: any[]
}

type Props = {
  seoContent: SeoContent
  categoryName: string
  categorySlug: string
  sectorSlug: string
  countryName?: string
  allCategories: Array<{ name: string; slug: string; level: number; sectorSlug?: string; sector_slug?: string }>
}

const ICONS: Record<string, string> = {
  building: 'M3 21V7l9-4 9 4v14', heart: 'M12 21C12 21 3 13.5 3 8.5A4.5 4.5 0 0 1 12 5a4.5 4.5 0 0 1 9 3.5C21 13.5 12 21 12 21z',
  graduation: 'M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5', cart: 'M6 6h15l-1.5 9H7.5 M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  code: 'M16 18l6-6-6-6 M8 6l-6 6 6 6', briefcase: 'M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  chart: 'M18 20V10 M12 20V4 M6 20v-6', shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
}

function Ico({ name, size = 18, color = 'var(--h-accent)' }: { name: string; size?: number; color?: string }) {
  const d = ICONS[name] || ICONS.globe
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
}

function parseInternalLinks(text: string, sectorSlug: string) {
  const parts: (string | React.ReactElement)[] = []
  const regex = /\[LINK:([^:]+):([^\]]+)\]/g
  let last = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    parts.push(<Link key={match.index} href={`/${sectorSlug}/${match[1]}`} className="seo-inline-link">{match[2]}</Link>)
    last = regex.lastIndex
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length ? parts : text
}

function jp(val: unknown) {
  if (!val) return null
  if (typeof val === 'object') return val
  if (typeof val === 'string') { try { return JSON.parse(val) } catch { return null } }
  return null
}

export default function SeoSections({ seoContent: sc, categoryName, categorySlug, sectorSlug, allCategories }: Props) {
  if (!sc) return null

  const bg = jp(sc.buyers_guide) as any
  const useCases = jp(sc.use_cases) as any[]
  const comps = jp(sc.comparisons) as any[]
  const kw = jp(sc.long_tail_keywords) as any
  const faq = jp(sc.extended_faq) as any[]
  const compCats = jp(sc.complementary_categories) as string[]

  const findCatSlug = (name: string) => {
    const n = name.toLowerCase()
    const match = allCategories.find(c => c.name.toLowerCase() === n || c.name.toLowerCase().includes(n))
    return match ? { slug: match.slug, sector: match.sectorSlug || match.sector_slug || sectorSlug } : null
  }

  /* ── Build FAQ JSON-LD from extended FAQ (richer than the hardcoded 5) ── */
  const faqJsonLd = faq && faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f: any) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  /* ── Build ItemList JSON-LD for use cases ── */
  const useCaseJsonLd = useCases && useCases.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categoryName} Use Cases`,
    numberOfItems: useCases.length,
    itemListElement: useCases.map((uc: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: uc.title,
      description: uc.description,
    })),
  } : null

  return (
    <article className="seo-sections" itemScope itemType="https://schema.org/Article">
      <meta itemProp="name" content={`${categoryName} — Buyer's Guide, Use Cases & Comparisons`} />
      <meta itemProp="author" content="InfoWebWorld Editorial" />

      {/* ── JSON-LD: Extended FAQ (overrides basic 5-question FAQ from server) ── */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* ── JSON-LD: Use Cases as ItemList ── */}
      {useCaseJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(useCaseJsonLd) }}
        />
      )}

      {/* ── Rich Description ── */}
      {sc.rich_description && (
        <section className="seo-section seo-description" aria-labelledby="seo-about">
          <h2 className="seo-h2" id="seo-about">About {categoryName}</h2>
          <div itemProp="articleBody">
            {sc.rich_description.split('\n\n').filter(Boolean).map((para, i) => (
              <p key={i} className="seo-para">{parseInternalLinks(para, sectorSlug)}</p>
            ))}
          </div>
        </section>
      )}

      {/* ── Buyer's Guide ── */}
      {bg && bg.features && (
        <section className="seo-section seo-guide" aria-labelledby="seo-guide">
          <h2 className="seo-h2" id="seo-guide">{categoryName} Buyer&#39;s Guide: What to Look For</h2>

          <div className="seo-guide-grid" role="list">
            {bg.features.map((f: any, i: number) => (
              <div key={i} className="seo-guide-card" role="listitem">
                <h3 className="seo-h3">{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>

          {bg.questions && bg.questions.length > 0 && (
            <div className="seo-guide-questions">
              <h3 className="seo-h3">Questions to Ask {categoryName} Vendors</h3>
              <ol>
                {bg.questions.map((q: string, i: number) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </div>
          )}

          {bg.pitfalls && bg.pitfalls.length > 0 && (
            <div className="seo-guide-pitfalls">
              <h3 className="seo-h3">Common {categoryName} Buying Mistakes</h3>
              <ul>
                {bg.pitfalls.map((p: string, i: number) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {bg.pricing_info && (
            <div className="seo-pricing-note">
              <h3 className="seo-h3">How {categoryName} Is Typically Priced</h3>
              <p>{bg.pricing_info}</p>
            </div>
          )}
        </section>
      )}

      {/* ── Use Cases ── */}
      {useCases && useCases.length > 0 && (
        <section className="seo-section seo-usecases" aria-labelledby="seo-usecases">
          <h2 className="seo-h2" id="seo-usecases">{categoryName} Use Cases by Industry</h2>
          <div className="seo-usecase-grid">
            {useCases.map((uc: any, i: number) => (
              <div key={i} className="seo-usecase-card">
                <div className="seo-usecase-icon" aria-hidden="true"><Ico name={uc.icon || 'globe'} size={22} /></div>
                <h3 className="seo-h3">{uc.title}</h3>
                <p>{uc.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Comparisons ── */}
      {comps && comps.length > 0 && (
        <section className="seo-section seo-comparisons" aria-labelledby="seo-compare">
          <h2 className="seo-h2" id="seo-compare">{categoryName} vs Alternatives</h2>
          <div className="seo-comp-list">
            {comps.map((c: any, i: number) => {
              const linked = findCatSlug(c.vs_name)
              return (
                <div key={i} className="seo-comp-card">
                  <h3 className="seo-h3">
                    {categoryName} vs{' '}
                    {linked ? <Link href={`/${linked.sector}/${linked.slug}`} className="seo-inline-link">{c.vs_name}</Link> : c.vs_name}
                  </h3>
                  <p className="seo-comp-summary">{c.summary}</p>
                  {c.differences && (
                    <dl className="seo-comp-diffs">
                      {c.differences.map((d: string, j: number) => (
                        <React.Fragment key={j}>
                          <dt className="sr-only">Difference {j + 1}</dt>
                          <dd>{d}</dd>
                        </React.Fragment>
                      ))}
                    </dl>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Long-Tail Keyword Grid ── */}
      {kw && (kw.by_industry || kw.by_size || kw.by_need) && (
        <section className="seo-section seo-keywords" aria-labelledby="seo-find">
          <h2 className="seo-h2" id="seo-find">Find the Best {categoryName}</h2>
          {kw.by_industry && (
            <div className="seo-kw-group">
              <h3 className="seo-h3">By Industry</h3>
              <nav className="seo-kw-pills" aria-label={`${categoryName} by industry`}>
                {kw.by_industry.map((k: string, i: number) => (
                  <span key={i} className="seo-kw-pill">{k}</span>
                ))}
              </nav>
            </div>
          )}
          {kw.by_size && (
            <div className="seo-kw-group">
              <h3 className="seo-h3">By Business Size</h3>
              <nav className="seo-kw-pills" aria-label={`${categoryName} by business size`}>
                {kw.by_size.map((k: string, i: number) => (
                  <span key={i} className="seo-kw-pill">{k}</span>
                ))}
              </nav>
            </div>
          )}
          {kw.by_need && (
            <div className="seo-kw-group">
              <h3 className="seo-h3">By Need</h3>
              <nav className="seo-kw-pills" aria-label={`${categoryName} by need`}>
                {kw.by_need.map((k: string, i: number) => (
                  <span key={i} className="seo-kw-pill">{k}</span>
                ))}
              </nav>
            </div>
          )}
        </section>
      )}

      {/* ── Also Explore (Complementary + Siblings) ── */}
      {compCats && compCats.length > 0 && (
        <section className="seo-section seo-explore" aria-labelledby="seo-explore">
          <h2 className="seo-h2" id="seo-explore">Categories Related to {categoryName}</h2>
          <nav className="seo-explore-grid" aria-label="Related categories">
            {compCats.map((name: string, i: number) => {
              const linked = findCatSlug(name)
              return linked ? (
                <Link key={i} href={`/${linked.sector}/${linked.slug}`} className="seo-explore-card">{name}</Link>
              ) : (
                <span key={i} className="seo-explore-card">{name}</span>
              )
            })}
          </nav>
        </section>
      )}

      {/* ── Extended FAQ (with proper accessible markup) ── */}
      {faq && faq.length > 0 && (
        <section className="seo-section seo-faq" aria-labelledby="seo-faq">
          <h2 className="seo-h2" id="seo-faq">{categoryName}: Frequently Asked Questions</h2>
          <div className="seo-faq-list">
            {faq.map((f: any, i: number) => (
              <details key={i} className="seo-faq-item">
                <summary className="seo-faq-q">{f.q}</summary>
                <div className="seo-faq-a">
                  <p>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
