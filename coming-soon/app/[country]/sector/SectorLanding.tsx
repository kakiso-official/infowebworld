'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import Link from '../../components/CountryLink'
import { useCountry } from '../../config/country-context'
import { COUNTRY_LABELS } from '../../config/countries'
import type { CountryCode } from '../../config/countries'
import { I, ic } from '../../components/icons'
import type { Category } from '../../iww-hq/data/category-storage'
import { getSectorMeta } from './sector-demo-data'

/* eslint-disable @typescript-eslint/no-explicit-any */
function jp(v: unknown) { if (!v) return null; if (typeof v === 'string') { try { return JSON.parse(v) } catch { return null } } return v }

function resolveLinks(text: string, allCats: Category[], sectorSlug: string) {
  return text.replace(/\[LINK:([^:]+):([^\]]+)\]/g, (_, slug, label) => {
    const cat = allCats.find(c => c.slug === slug)
    if (cat) { const href = `/${sectorSlug}/${slug}`; return `<a href="${href}">${label}</a>` }
    return label
  })
}

type SeoContent = { ai_summary?: string; rich_description?: string; buyers_guide?: any; use_cases?: any; comparisons?: any; long_tail_keywords?: any; complementary_categories?: any; extended_faq?: any }

export default function SectorLanding({ category, allCategories, seoContent }: { category: Category; allCategories: Category[]; seoContent?: SeoContent | null }) {
  const country = useCountry()
  const countryName = COUNTRY_LABELS[country as CountryCode] || 'Worldwide'
  const meta = getSectorMeta(category.slug)
  const [expandedFaq, setExpandedFaq] = useState<Set<number>>(new Set())
  const [visible, setVisible] = useState(false)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => { requestAnimationFrame(() => setVisible(true)) }, [])

  const l2Cats = useMemo(() => allCategories.filter(c => c.parentId === category.id && c.level === 2).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)), [allCategories, category.id])
  const l3Cats = useMemo(() => { const ids = new Set(l2Cats.map(c => c.id)); return allCategories.filter(c => c.parentId && ids.has(c.parentId) && c.level === 3).sort((a, b) => a.name.localeCompare(b.name)) }, [allCategories, l2Cats])
  const l2WithCounts = useMemo(() => l2Cats.map(c => ({ ...c, childCount: allCategories.filter(x => x.parentId === c.id && x.level === 3).length })), [l2Cats, allCategories])

  const sc = seoContent || null
  const richDesc = sc?.rich_description ? String(sc.rich_description) : ''
  const buyersGuide = jp(sc?.buyers_guide) as { features?: { title: string; description: string }[]; questions?: string[]; pitfalls?: { mistake: string; consequence: string }[]; pricing_info?: string } | null
  const useCases = jp(sc?.use_cases) as { title: string; description: string; icon?: string }[] | null
  const comparisons = jp(sc?.comparisons) as { title: string; summary: string; differences?: string[] }[] | null
  const ltKeywords = jp(sc?.long_tail_keywords) as Record<string, string[]> | null
  const complementary = jp(sc?.complementary_categories) as { name: string; slug?: string; description: string }[] | null
  const extFaq = jp(sc?.extended_faq) as { question: string; answer: string }[] | null

  const sectorName = category.name
  const shortName = sectorName.split('&')[0].trim()
  const color = meta.color
  const year = new Date().getFullYear()
  const monthYear = new Date().toLocaleString('en-US', { month: 'long' }) + ' ' + year
  const wordCount = richDesc ? richDesc.split(/\s+/).length : 0
  const readTime = Math.max(1, Math.ceil(wordCount / 250))
  const totalListings = l2WithCounts.reduce((s, c) => s + (c.listingCount || 0), 0)

  const faqItems = extFaq && extFaq.length > 0 ? extFaq : [
    { question: `What is ${sectorName}?`, answer: meta.description },
    { question: `How to find the best ${sectorName} companies?`, answer: `Browse verified ${sectorName} companies on InfoWebWorld. Compare services, read reviews and connect directly.` },
    { question: `Is it free to list my ${shortName} business?`, answer: 'Yes, InfoWebWorld offers free business listing with premium plans for enhanced visibility, verified badges and SEO backlinks.' },
    { question: `How are ${sectorName} companies ranked?`, answer: 'Rankings are based on verified reviews, user satisfaction scores, market presence and listing completeness.' },
    { question: `Can I compare ${shortName} solutions?`, answer: `Yes! Compare ${shortName} solutions side by side across features, pricing, reviews and satisfaction scores.` },
  ]

  const toggleFaq = (i: number) => setExpandedFaq(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n })

  return (
    <div ref={pageRef} className={`slp${visible ? ' slp--in' : ''}`} style={{ '--slp-c': color, '--slp-p': meta.pastel, '--slp-pl': meta.pastelLight } as React.CSSProperties}>

      {/* ═══ Background shapes ═══ */}
      <div className="slp-shapes" aria-hidden="true">
        <div className="slp-shape slp-shape--1" style={{ background: color }} />
        <div className="slp-shape slp-shape--2" style={{ background: '#3B82F6' }} />
        <div className="slp-shape slp-shape--3" style={{ background: color }} />
        <div className="slp-shape slp-shape--4" style={{ background: '#8B5CF6' }} />
        <div className="slp-shape slp-shape--5" style={{ background: '#14B8A6' }} />
      </div>

      {/* ═══ HERO ═══ */}
      <section className="slp-hero">
        <nav className="slp-breadcrumb" aria-label="Breadcrumb">
          <Link href="/"><I d={ic.home} size={13} color="rgba(0,0,0,.4)" sw={2} /></Link>
          <span className="slp-bc-sep">/</span>
          <Link href="/categories">Categories</Link>
          <span className="slp-bc-sep">/</span>
          <span className="slp-bc-current">{sectorName}</span>
        </nav>

        <h1 className="slp-h1">
          Best <em style={{ color }}>{sectorName}</em> in {countryName} {year}
        </h1>

        <p className="slp-tagline">{meta.tagline}</p>

        {/* Stats */}
        <div className="slp-hero-stats">
          {[
            { v: l2Cats.length, l: 'Categories' },
            { v: l3Cats.length.toLocaleString(), l: 'Subcategories' },
            { v: totalListings, l: 'Companies Listed' },
          ].map((s, i) => (
            <div key={i} className="slp-hero-stat">
              <strong style={{ color }}>{s.v}</strong> {s.l}
            </div>
          ))}
        </div>

        <div className="slp-hero-updated">Updated {monthYear}</div>
      </section>

      {/* ═══ AI SUMMARY ═══ */}
      {sc?.ai_summary && (
        <section className="slp-sec">
          <div className="slp-inner">
            <div className="slp-ai-card">
              <div className="slp-ai-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z" fill={color} /></svg>
                AI Summary
              </div>
              <p className="slp-ai-text">{sc.ai_summary}</p>
            </div>
          </div>
        </section>
      )}

      {/* ═══ BROWSE CATEGORIES ═══ */}
      <section className="slp-sec slp-sec--white" id="categories">
        <div className="slp-inner">
          <h2 className="slp-h2">Browse <em>{sectorName}</em> Categories</h2>
          <p className="slp-sub">{l2Cats.length} categories with {l3Cats.length.toLocaleString()} subcategories to explore</p>
          <div className="slp-cat-grid">
            {l2WithCounts.map((c, i) => (
              <Link key={c.id} href={`/${category.slug}/${c.slug}`} className="slp-cat-card" style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}>
                <div className="slp-cat-head" style={{ background: `${color}0A` }}>
                  <I d={ic[c.icon as keyof typeof ic] || ic.grid} size={20} color={color} sw={2} />
                  <span className="slp-cat-count" style={{ background: `${color}15`, color }}>{c.childCount}</span>
                </div>
                <h3 className="slp-cat-name">{c.name}</h3>
                <span className="slp-cat-meta">{c.childCount} subcategories</span>
                <span className="slp-cat-arrow" style={{ color }}>&rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT / RICH DESCRIPTION ═══ */}
      <section className="slp-sec" id="about">
        <div className="slp-inner">
          <div className="slp-about-top">
            <h2 className="slp-h2">About <em>{sectorName}</em></h2>
            {wordCount > 0 && <span className="slp-read-badge">{readTime} min read</span>}
          </div>
          {richDesc ? (
            <article className="slp-article" itemScope itemType="https://schema.org/Article">
              <div className="slp-article-accent" style={{ background: color }} />
              <div className="slp-article-body" itemProp="articleBody" dangerouslySetInnerHTML={{
                __html: resolveLinks(richDesc, allCategories, category.slug)
                  .split('\n').filter(Boolean).map((p, i) => `<p${i === 0 ? ' class="slp-lead"' : ''}>${p}</p>`).join('')
              }} />
            </article>
          ) : (
            <article className="slp-article">
              <div className="slp-article-accent" style={{ background: color }} />
              <div className="slp-article-body">
                <p className="slp-lead">{meta.description}</p>
                <p>Browse and compare the best {sectorName} providers on InfoWebWorld. Find verified companies, read real reviews, and connect directly. Updated {monthYear}.</p>
              </div>
            </article>
          )}
        </div>
      </section>

      {/* ═══ BUYER'S GUIDE ═══ */}
      {buyersGuide && (
        <section className="slp-sec slp-sec--white" id="guide">
          <div className="slp-inner">
            <h2 className="slp-h2">How to Choose <em>{shortName}</em> Solutions</h2>
            <p className="slp-sub">A practical guide for buyers evaluating {sectorName.toLowerCase()} vendors</p>
            {buyersGuide.features && (
              <div className="slp-guide-grid">
                {buyersGuide.features.map((f, i) => (
                  <div key={i} className="slp-guide-card">
                    <div className="slp-guide-num" style={{ color }}>{String(i + 1).padStart(2, '0')}</div>
                    <h3>{f.title}</h3>
                    <p>{f.description}</p>
                  </div>
                ))}
              </div>
            )}
            {buyersGuide.questions && (
              <div className="slp-guide-block">
                <h3><I d={ic.helpCircle} size={16} color={color} sw={2} /> Questions to Ask</h3>
                <ol>{buyersGuide.questions.map((q, i) => <li key={i}>{q}</li>)}</ol>
              </div>
            )}
            {buyersGuide.pitfalls && (
              <div className="slp-guide-block slp-guide-block--warn">
                <h3><I d={ic.shield} size={16} color="#E8553D" sw={2} /> Mistakes to Avoid</h3>
                <ul>{buyersGuide.pitfalls.map((p, i) => <li key={i}><strong>{p.mistake}</strong> &mdash; {p.consequence}</li>)}</ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══ USE CASES ═══ */}
      {useCases && useCases.length > 0 && (
        <section className="slp-sec" id="usecases">
          <div className="slp-inner">
            <h2 className="slp-h2">Who Uses <em>{shortName}</em>?</h2>
            <p className="slp-sub">{useCases.length} real-world applications across industries</p>
            <div className="slp-uc-grid">
              {useCases.map((uc, i) => (
                <div key={i} className="slp-uc-card">
                  <div className="slp-uc-icon" style={{ background: `${color}10` }}>
                    <I d={ic[uc.icon as keyof typeof ic] || ic.briefcase} size={22} color={color} sw={2} />
                  </div>
                  <h3>{uc.title}</h3>
                  <p>{uc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ COMPARISONS ═══ */}
      {comparisons && comparisons.length > 0 && (
        <section className="slp-sec slp-sec--white" id="compare">
          <div className="slp-inner">
            <h2 className="slp-h2"><em>{shortName}</em> vs Alternatives</h2>
            <p className="slp-sub">Understanding when to choose {sectorName.toLowerCase()} over other approaches</p>
            <div className="slp-cmp-grid">
              {comparisons.map((cmp, i) => (
                <div key={i} className="slp-cmp-card">
                  <h3>{cmp.title}</h3>
                  <p>{cmp.summary}</p>
                  {cmp.differences && <ul>{cmp.differences.map((d, j) => <li key={j}>{d}</li>)}</ul>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ SUBCATEGORY CHIPS (max 200, then View All link) ═══ */}
      {l3Cats.length > 0 && (
        <section className="slp-sec" id="subcategories">
          <div className="slp-inner">
            <h2 className="slp-h2">Explore All <em>Subcategories</em></h2>
            <p className="slp-sub">{l3Cats.length.toLocaleString()} specialized areas within {sectorName}</p>
            <nav className="slp-chips" aria-label={`${sectorName} subcategories`}>
              {l3Cats.slice(0, 200).map(c => <Link key={c.id} href={`/${category.slug}/${c.slug}`} className="slp-chip">{c.name}</Link>)}
            </nav>
            {l3Cats.length > 200 && (
              <Link href={`/view-all-sub-categories-${category.slug}`} className="slp-view-all" style={{ color }}>
                View all {l3Cats.length.toLocaleString()} subcategories &rarr;
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ═══ KEYWORDS ═══ */}
      {ltKeywords && Object.keys(ltKeywords).length > 0 && (
        <section className="slp-sec slp-sec--white" id="keywords">
          <div className="slp-inner">
            <h2 className="slp-h2">Find the Best <em>{shortName}</em></h2>
            <p className="slp-sub">Search by industry, company size, or need</p>
            <nav className="slp-kw-wrap" aria-label="Related searches">
              {Object.entries(ltKeywords).map(([group, terms]) => (
                <div key={group} className="slp-kw-group">
                  <span className="slp-kw-label" style={{ color }}>{group}</span>
                  <div className="slp-kw-pills">{(terms as string[]).map((t, i) => <span key={i} className="slp-kw-pill">{t}</span>)}</div>
                </div>
              ))}
            </nav>
          </div>
        </section>
      )}

      {/* ═══ ALSO EXPLORE ═══ */}
      {complementary && complementary.length > 0 && (
        <section className="slp-sec" id="explore">
          <div className="slp-inner">
            <h2 className="slp-h2">Also <em>Explore</em></h2>
            <p className="slp-sub">Categories that work alongside {sectorName.toLowerCase()}</p>
            <div className="slp-explore-grid">
              {complementary.map((cc, i) => (
                <div key={i} className="slp-explore-card">
                  <h3>{cc.slug ? <Link href={`/${cc.slug}`}>{cc.name}</Link> : cc.name}</h3>
                  <p>{cc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FAQ ═══ */}
      <section className="slp-sec slp-sec--white" id="faq">
        <div className="slp-inner">
          <h2 className="slp-h2">Frequently Asked <em>Questions</em></h2>
          <p className="slp-sub">{faqItems.length} questions about {sectorName.toLowerCase()}</p>
          <div className="slp-faq-list">
            {faqItems.map((f, i) => {
              const open = expandedFaq.has(i)
              return (
                <div key={i} className={`slp-faq${open ? ' slp-faq--open' : ''}`}>
                  <button className="slp-faq-q" onClick={() => toggleFaq(i)} aria-expanded={open}>
                    <span>{f.question}</span>
                    <span className="slp-faq-toggle" style={open ? { background: `${color}12`, color } : undefined}>{open ? '\u2212' : '+'}</span>
                  </button>
                  <div className="slp-faq-a" style={{ maxHeight: open ? '500px' : '0' }}><p>{f.answer}</p></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="slp-sec slp-sec--cta">
        <div className="slp-inner">
          <div className="slp-cta">
            <div className="slp-cta-badge" style={{ background: `${color}12`, color }}>
              <I d={ic.star} size={13} color={color} sw={2} /> Founding Spots Available
            </div>
            <h2 className="slp-cta-h">List Your <em style={{ color }}>{shortName}</em> Business</h2>
            <p className="slp-cta-p">Get discovered by buyers, earn dofollow backlinks, and grow your online presence.</p>
            <div className="slp-cta-perks">
              {['Dofollow Backlinks', 'Verified Badge', 'Lead Generation', 'SEO Boost'].map(p => (
                <span key={p} className="slp-cta-perk"><I d={ic.check} size={13} color={color} sw={2.5} /> {p}</span>
              ))}
            </div>
            <Link href="/business" className="slp-cta-btn" style={{ background: color }}>Get Listed Now &rarr;</Link>
          </div>
        </div>
      </section>

      <div className="slp-back"><Link href="/categories" className="slp-back-link" style={{ color }}><I d={ic.arrowLeft} size={13} color={color} sw={2} /> All Categories</Link></div>
    </div>
  )
}
