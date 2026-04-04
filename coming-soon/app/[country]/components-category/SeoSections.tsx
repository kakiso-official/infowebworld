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
  countryName: string
  allCategories: Array<{ name: string; slug: string; level: number; sectorSlug?: string; sector_slug?: string }>
  topCities?: string[]
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
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
}

function parseInternalLinks(text: string, sectorSlug: string) {
  // Replace [LINK:slug:Display Text] with actual links
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

export default function SeoSections({ seoContent: sc, categoryName, categorySlug, sectorSlug, countryName, allCategories, topCities }: Props) {
  if (!sc) return null

  const bg = jp(sc.buyers_guide) as any
  const useCases = jp(sc.use_cases) as any[]
  const comps = jp(sc.comparisons) as any[]
  const kw = jp(sc.long_tail_keywords) as any
  const faq = jp(sc.extended_faq) as any[]
  const compCats = jp(sc.complementary_categories) as string[]

  // Find matching categories for internal linking
  const findCatSlug = (name: string) => {
    const n = name.toLowerCase()
    const match = allCategories.find(c => c.name.toLowerCase() === n || c.name.toLowerCase().includes(n))
    return match ? { slug: match.slug, sector: match.sectorSlug || match.sector_slug || sectorSlug } : null
  }

  return (
    <div className="seo-sections">

      {/* ── Rich Description ── */}
      {sc.rich_description && (
        <section className="seo-section seo-description">
          <h2 className="seo-h2">About {categoryName}</h2>
          {sc.rich_description.split('\n\n').filter(Boolean).map((para, i) => (
            <p key={i} className="seo-para">{parseInternalLinks(para, sectorSlug)}</p>
          ))}
        </section>
      )}

      {/* ── Buyer's Guide ── */}
      {bg && bg.features && (
        <section className="seo-section seo-guide">
          <h2 className="seo-h2">What to Look for in {categoryName}</h2>
          <div className="seo-guide-grid">
            {bg.features.map((f: any, i: number) => (
              <div key={i} className="seo-guide-card">
                <h3 className="seo-h3">{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
          {bg.pricing_info && (
            <div className="seo-pricing-note">
              <strong>Pricing:</strong> {bg.pricing_info}
            </div>
          )}
        </section>
      )}

      {/* ── Use Cases ── */}
      {useCases && useCases.length > 0 && (
        <section className="seo-section seo-usecases">
          <h2 className="seo-h2">{categoryName} Use Cases</h2>
          <div className="seo-usecase-grid">
            {useCases.map((uc: any, i: number) => (
              <div key={i} className="seo-usecase-card">
                <div className="seo-usecase-icon"><Ico name={uc.icon || 'globe'} size={22} /></div>
                <h3 className="seo-h3">{uc.title}</h3>
                <p>{uc.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Comparisons ── */}
      {comps && comps.length > 0 && (
        <section className="seo-section seo-comparisons">
          <h2 className="seo-h2">{categoryName} vs Alternatives</h2>
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
                    <ul className="seo-comp-diffs">
                      {c.differences.map((d: string, j: number) => <li key={j}>{d}</li>)}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Long-Tail Keyword Grid ── */}
      {kw && (kw.by_industry || kw.by_size || kw.by_need) && (
        <section className="seo-section seo-keywords">
          <h2 className="seo-h2">Find the Best {categoryName}</h2>
          {kw.by_industry && (
            <div className="seo-kw-group">
              <h3 className="seo-h3">By Industry</h3>
              <div className="seo-kw-pills">
                {kw.by_industry.map((k: string, i: number) => (
                  <span key={i} className="seo-kw-pill">{k}</span>
                ))}
              </div>
            </div>
          )}
          {kw.by_size && (
            <div className="seo-kw-group">
              <h3 className="seo-h3">By Business Size</h3>
              <div className="seo-kw-pills">
                {kw.by_size.map((k: string, i: number) => (
                  <span key={i} className="seo-kw-pill">{k}</span>
                ))}
              </div>
            </div>
          )}
          {kw.by_need && (
            <div className="seo-kw-group">
              <h3 className="seo-h3">By Need</h3>
              <div className="seo-kw-pills">
                {kw.by_need.map((k: string, i: number) => (
                  <span key={i} className="seo-kw-pill">{k}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Location Links ── */}
      {topCities && topCities.length > 0 && (
        <section className="seo-section seo-locations">
          <h2 className="seo-h2">Top {categoryName} Companies by City</h2>
          <div className="seo-kw-pills">
            {topCities.map((city, i) => (
              <Link key={i} href={`/${sectorSlug}/${categorySlug}/${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="seo-kw-pill seo-kw-pill--link">
                {categoryName} in {city}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Also Explore (Complementary + Siblings) ── */}
      {compCats && compCats.length > 0 && (
        <section className="seo-section seo-explore">
          <h2 className="seo-h2">Also Explore</h2>
          <div className="seo-explore-grid">
            {compCats.map((name: string, i: number) => {
              const linked = findCatSlug(name)
              return linked ? (
                <Link key={i} href={`/${linked.sector}/${linked.slug}`} className="seo-explore-card">{name}</Link>
              ) : (
                <span key={i} className="seo-explore-card">{name}</span>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Extended FAQ ── */}
      {faq && faq.length > 0 && (
        <section className="seo-section seo-faq">
          <h2 className="seo-h2">Frequently Asked Questions about {categoryName}</h2>
          <div className="seo-faq-list">
            {faq.map((f: any, i: number) => (
              <details key={i} className="seo-faq-item">
                <summary className="seo-faq-q"><h3>{f.q}</h3></summary>
                <p className="seo-faq-a">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
