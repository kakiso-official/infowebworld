'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

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

/* Auto-link category names in body copy that weren't already wrapped in
   [LINK:...] markers. Pass once over each paragraph: longest-name-first
   so "Mobile App Development" doesn't lose to "Development". Only the
   first occurrence per category is linked (avoid over-linking the same
   term repeatedly — Google penalises that). */
function autoLinkCategories(
  text: string,
  sectorSlug: string,
  allCategories: Array<{ name: string; slug: string; level: number; sectorSlug?: string; sector_slug?: string }>,
  skipName: string,
): React.ReactNode[] {
  if (!text) return [text]
  const cats = (allCategories || [])
    .filter(c => c.name && c.name.toLowerCase() !== skipName.toLowerCase() && c.name.length >= 4)
    .sort((a, b) => b.name.length - a.name.length)
  if (cats.length === 0) return [text]

  let remaining = text
  const out: React.ReactNode[] = []
  let key = 0
  const linkedNames = new Set<string>()

  while (remaining.length > 0) {
    let bestIdx = -1
    let bestCat: typeof cats[number] | null = null
    let bestLen = 0
    for (const c of cats) {
      if (linkedNames.has(c.name.toLowerCase())) continue
      const re = new RegExp(`\\b${c.name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'i')
      const m = remaining.match(re)
      if (m && m.index !== undefined) {
        if (bestIdx === -1 || m.index < bestIdx || (m.index === bestIdx && c.name.length > bestLen)) {
          bestIdx = m.index
          bestCat = c
          bestLen = c.name.length
        }
      }
    }
    if (bestCat == null || bestIdx === -1) {
      out.push(remaining)
      break
    }
    if (bestIdx > 0) out.push(remaining.slice(0, bestIdx))
    const matched = remaining.substr(bestIdx, bestCat.name.length)
    const href = `/${bestCat.sectorSlug || bestCat.sector_slug || sectorSlug}/${bestCat.slug}`
    out.push(
      <Link key={`autolink-${key++}`} href={href} className="seo-inline-link">{matched}</Link>
    )
    linkedNames.add(bestCat.name.toLowerCase())
    remaining = remaining.slice(bestIdx + bestCat.name.length)
  }
  return out
}

function jp(val: unknown) {
  if (!val) return null
  if (typeof val === 'object') return val
  if (typeof val === 'string') { try { return JSON.parse(val) } catch { return null } }
  return null
}

export default function SeoSections({ seoContent: sc, categoryName, categorySlug, sectorSlug, allCategories }: Props) {
  /* TOC scroll-spy — observe every section and highlight the one whose top
     is nearest the viewport top. Active id drives the left rail style. */
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Hooks must run unconditionally; we'll early-return below.
  useEffect(() => {
    if (!sc) return
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.seo-sections [data-seo-section]'))
    if (sections.length === 0) return
    const firstId = sections[0].dataset.seoSection || ''
    if (firstId && !activeId) setActiveId(firstId)

    const obs = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const first = visible[0]?.target as HTMLElement | undefined
        if (first?.dataset.seoSection) setActiveId(first.dataset.seoSection)
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: [0, 0.1, 0.5] }
    )
    sections.forEach(s => obs.observe(s))
    observerRef.current = obs
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sc])

  if (!sc) return null

  const bg = jp(sc.buyers_guide) as any
  const useCases = jp(sc.use_cases) as any[]
  const comps = jp(sc.comparisons) as any[]
  const kw = jp(sc.long_tail_keywords) as any
  const faq = jp(sc.extended_faq) as any[]
  const compCats = jp(sc.complementary_categories) as string[]

  /* Find a real category page for a free-text name. Tries exact → slug →
     fuzzy contains. Falls back across sectors if not found in current
     sector. Returns the slug + sectorSlug needed to build the URL. */
  const findCatSlug = (name: string) => {
    if (!name) return null
    const n = name.trim().toLowerCase()
    const slugified = n.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const candidates = allCategories || []
    /* Pass 1 — exact name match (case-insensitive) */
    let match = candidates.find(c => c.name.toLowerCase() === n)
    /* Pass 2 — exact slug match */
    if (!match) match = candidates.find(c => c.slug === slugified)
    /* Pass 3 — name contains the query (or vice versa) */
    if (!match) match = candidates.find(c => {
      const cn = c.name.toLowerCase()
      return cn.includes(n) || n.includes(cn)
    })
    /* Pass 4 — slug contains query */
    if (!match) match = candidates.find(c => c.slug.includes(slugified) || slugified.includes(c.slug))
    if (!match) return null
    return { slug: match.slug, sector: match.sectorSlug || match.sector_slug || sectorSlug }
  }

  /* TOC entries — id matches the section's id attribute. Built from what
     data actually exists so we never render an empty link. */
  const toc: { id: string; label: string }[] = []
  if (sc.rich_description) toc.push({ id: 'seo-about', label: `What is ${categoryName}?` })
  if (bg && bg.features) toc.push({ id: 'seo-guide', label: `${categoryName} Buyer's Guide` })
  if (useCases && useCases.length > 0) toc.push({ id: 'seo-usecases', label: `${categoryName} Use Cases` })
  if (comps && comps.length > 0) toc.push({ id: 'seo-compare', label: `${categoryName} vs Alternatives` })
  if (kw && (kw.by_industry || kw.by_size || kw.by_need)) toc.push({ id: 'seo-find', label: `Find the Best ${categoryName}` })
  if (compCats && compCats.length > 0) toc.push({ id: 'seo-explore', label: `Related Categories` })
  if (faq && faq.length > 0) toc.push({ id: 'seo-faq', label: `Frequently Asked Questions` })

  /* ── FAQ JSON-LD is rendered server-side in page.tsx — no duplicate here ── */

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

      {/* ── FAQ JSON-LD rendered server-side in page.tsx ── */}

      {/* ── JSON-LD: Use Cases as ItemList ── */}
      {useCaseJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(useCaseJsonLd) }}
        />
      )}

      <div className="seo-layout">
        {/* ── Left rail: sticky TOC. Active entry is the section nearest the
            viewport top (scroll-spy via IntersectionObserver above). ── */}
        {toc.length > 0 && (
          <aside className="seo-toc" aria-label="Section navigation">
            <ul className="seo-toc-list">
              {toc.map(t => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className={'seo-toc-item' + (activeId === t.id ? ' seo-toc-item--active' : '')}
                    onClick={e => {
                      e.preventDefault()
                      const el = document.getElementById(t.id)
                      if (el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - 80
                        window.scrollTo({ top: y, behavior: 'smooth' })
                        setActiveId(t.id)
                      }
                    }}
                  >
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* ── Right: actual content sections ── */}
        <div className="seo-content">

      {/* ── Rich Description — editorial layout ── */}
      {sc.rich_description && (() => {
        const paragraphs = sc.rich_description.split('\n\n').filter(Boolean)
        return (
          <section className="seo-section seo-description" aria-labelledby="seo-about" data-seo-section="seo-about">
            <h2 className="seo-h2" id="seo-about">What is {categoryName}?</h2>
            <div className="seo-about-body" itemProp="articleBody">
              {paragraphs.map((para, i) => {
                /* Two-pass linking: explicit [LINK:slug:label] markers first
                   (Gemini-emitted), then auto-link any remaining category
                   name mentions for cross-category internal linking SEO. */
                const explicit = parseInternalLinks(para, sectorSlug)
                if (typeof explicit !== 'string') {
                  return <p key={i} className="seo-para">{explicit}</p>
                }
                return (
                  <p key={i} className="seo-para">
                    {autoLinkCategories(explicit, sectorSlug, allCategories, categoryName)}
                  </p>
                )
              })}
            </div>
          </section>
        )
      })()}

      {/* ── Buyer's Guide ── */}
      {bg && bg.features && (
        <section className="seo-section seo-guide" aria-labelledby="seo-guide" data-seo-section="seo-guide">
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
                {bg.pitfalls.map((p: any, i: number) => {
                  if (typeof p === 'string') return <li key={i}>{p}</li>
                  const label = p.mistake || p.title || p.name || ''
                  const detail = p.consequence || p.description || ''
                  if (label && detail) return <li key={i}><strong>{label}</strong> — {detail}</li>
                  return <li key={i}>{label || detail}</li>
                })}
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
        <section className="seo-section seo-usecases" aria-labelledby="seo-usecases" data-seo-section="seo-usecases">
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
        <section className="seo-section seo-comparisons" aria-labelledby="seo-compare" data-seo-section="seo-compare">
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
        <section className="seo-section seo-keywords" aria-labelledby="seo-find" data-seo-section="seo-find">
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
        <section className="seo-section seo-explore" aria-labelledby="seo-explore" data-seo-section="seo-explore">
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
        <section className="seo-section seo-faq" aria-labelledby="seo-faq" data-seo-section="seo-faq">
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
        </div>
      </div>
    </article>
  )
}
