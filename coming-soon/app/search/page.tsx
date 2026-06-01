import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SearchBar from './SearchBar'
import {
  searchAll, MIN_QUERY_LEN,
  type SearchCompanyHit, type SearchCategoryHit, type SearchArticleHit,
} from '@/lib/search'

/* Search results are request-dependent and out of the index — render
   dynamically (consistent with the rest of the post-quota-crisis app). */
export const dynamic = 'force-dynamic'

const DOMAIN = 'https://infowebworld.com'

type SP = { [key: string]: string | string[] | undefined }
type PageProps = { searchParams: Promise<SP> }

function strParam(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v || '').trim()
}

const VALID_TYPES = ['all', 'companies', 'categories', 'articles'] as const
type ResultType = (typeof VALID_TYPES)[number]

/* 6 L1 sectors — used for the no-query prompt + the sector-scope chip label. */
const PROMPT_SECTORS = [
  { slug: 'ai-ml',                  name: 'AI & ML',                desc: 'AI tools, agents, models & copilots',            color: '#7C6DD4' },
  { slug: 'software-saas',          name: 'Software & SaaS',        desc: 'CRM, marketing, analytics & security',           color: '#3F8FD4' },
  { slug: 'it-services-agencies',   name: 'IT Services & Agencies', desc: 'Web, mobile, design & marketing agencies',       color: '#1D9E75' },
  { slug: 'startups-innovation',    name: 'Startups & Innovation',  desc: 'FinTech, HealthTech, ClimateTech & Web3',        color: '#D98236' },
  { slug: 'local-businesses',       name: 'Local Businesses',       desc: 'Restaurants, home services, health & retail',    color: '#659A22' },
  { slug: 'professional-services',  name: 'Professional Services',  desc: 'Accountants, lawyers, advisors & consultants',   color: '#C85580' },
]
const SECTOR_NAMES: Record<string, string> = Object.fromEntries(PROMPT_SECTORS.map(s => [s.slug, s.name]))
const TRENDING = ['AI chatbot', 'CRM', 'Project management', 'SEO', 'Web design agency', 'Accounting', 'Cybersecurity', 'Logo maker']
const LEVEL_LABELS: Record<number, string> = { 1: 'Sector', 2: 'Category', 3: 'Subcategory', 4: 'Subcategory', 5: 'Subcategory' }

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams
  const q = strParam(sp.q)
  const title = q
    ? `Search results for "${q}" - InfoWebWorld`
    : 'Search - InfoWebWorld'
  const description = q
    ? `Companies, categories and articles matching "${q}" across InfoWebWorld's verified business directory.`
    : 'Search InfoWebWorld - find verified companies, categories, and articles across 14,000+ business categories.'
  return {
    title,
    description,
    /* Search pages are noindex (infinite query space, thin/duplicate) but
       follow so the links to real listings + categories pass PageRank.
       middleware.ts sets a matching X-Robots-Tag: noindex, follow header. */
    robots: { index: false, follow: true },
    alternates: { canonical: `${DOMAIN}/search` },
  }
}

/* ── Server render helpers ── */
function initials(name: string) { return (name || '?').trim().slice(0, 2).toUpperCase() }

function hl(text: string, q: string) {
  const term = (q || '').trim()
  if (!term) return text
  const i = text.toLowerCase().indexOf(term.toLowerCase())
  if (i === -1) return text
  return <>{text.slice(0, i)}<mark className="srch-hl">{text.slice(i, i + term.length)}</mark>{text.slice(i + term.length)}</>
}

function StarRow({ value }: { value: number }) {
  const r = Math.round(value)
  return (
    <span className="srch-stars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={'srch-star' + (i <= r ? ' is-on' : '')} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

function CompanyCard({ c, q }: { c: SearchCompanyHit; q: string }) {
  const href = (c.listingMode === 'company' ? '/profile/' : '/listing/') + c.slug
  return (
    <Link href={href} className="srch-co">
      <span className="srch-co-logo">
        {c.logoUrl ? <img src={c.logoUrl} alt="" /> : <span>{initials(c.companyName)}</span>}
      </span>
      <span className="srch-co-main">
        <span className="srch-co-top">
          <span className="srch-co-name">{hl(c.companyName, q)}</span>
          {c.listingMode === 'company' && <span className="srch-co-badge">Company</span>}
        </span>
        {c.ratingCount > 0 ? (
          <span className="srch-co-rating">
            <StarRow value={c.ratingAvg} />
            <b>{c.ratingAvg.toFixed(1)}</b> <i>({c.ratingCount})</i>
          </span>
        ) : (
          <span className="srch-co-rating srch-co-rating--new">New · No reviews yet</span>
        )}
        {c.tagline && <span className="srch-co-sub">{c.tagline}</span>}
        {(c.category?.name || c.location) && (
          <span className="srch-co-metarow">
            {c.category?.name && (
              <span
                className="srch-co-tag"
                style={c.category.color ? { background: `${c.category.color}1a`, color: c.category.color } : undefined}
              >
                {c.category.name}
              </span>
            )}
            {c.location && (
              <span className="srch-co-loc">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {c.location}
              </span>
            )}
          </span>
        )}
      </span>
    </Link>
  )
}

function CategoryCard({ c, q }: { c: SearchCategoryHit; q: string }) {
  const href = c.sectorSlug ? `/${c.sectorSlug}/${c.slug}` : `/${c.slug}`
  const lvl = LEVEL_LABELS[c.level] || `Level ${c.level}`
  return (
    <Link href={href} className="srch-cat">
      <span className="srch-cat-dot" style={{ background: c.color }} />
      <span className="srch-cat-body">
        <span className="srch-cat-name">{hl(c.name, q)}</span>
        <span className="srch-cat-crumb">{c.parentName ? `in ${c.parentName}` : 'Top-level sector'}</span>
      </span>
      <span className="srch-cat-pill">{lvl}{c.listingCount > 0 ? ` · ${c.listingCount}` : ''}</span>
    </Link>
  )
}

function ArticleCard({ a, q }: { a: SearchArticleHit; q: string }) {
  return (
    <Link href={`/blog/${a.slug}`} className="srch-art">
      {a.coverImage
        ? <img className="srch-art-cover" src={a.coverImage} alt="" />
        : <span className="srch-art-cover srch-art-cover--ph" />}
      <span className="srch-art-body">
        <span className="srch-art-title">{hl(a.title, q)}</span>
        {a.excerpt && <span className="srch-art-excerpt">{a.excerpt}</span>}
        <span className="srch-art-meta">{a.author ? `By ${a.author}` : 'Article'}{a.category ? ` · ${a.category}` : ''}</span>
      </span>
    </Link>
  )
}

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const q = strParam(sp.q)
  const sectorRaw = strParam(sp.sector)
  const sector = sectorRaw && SECTOR_NAMES[sectorRaw] ? sectorRaw : null
  const typeRaw = strParam(sp.type) as ResultType
  const type: ResultType = VALID_TYPES.includes(typeRaw) ? typeRaw : 'all'

  const hasQuery = q.length >= MIN_QUERY_LEN
  const results = hasQuery ? await searchAll(q, { sector }) : null

  /* URL builders preserving q + sector. */
  const tabHref = (t: ResultType) => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (sector) p.set('sector', sector)
    if (t !== 'all') p.set('type', t)
    return `/search?${p.toString()}`
  }
  const removeSectorHref = () => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (type !== 'all') p.set('type', type)
    return `/search?${p.toString()}`
  }

  const counts = results?.counts
  const capped = results?.capped
  const countLabel = (n: number, isCapped: boolean) => `${n}${isCapped ? '+' : ''}`

  const TABS: { key: ResultType; label: string; count: number; capped: boolean }[] = results
    ? [
        { key: 'all',        label: 'All',        count: counts!.total,      capped: false },
        { key: 'companies',  label: 'Companies',  count: counts!.companies,  capped: capped!.companies },
        { key: 'categories', label: 'Categories', count: counts!.categories, capped: capped!.categories },
        { key: 'articles',   label: 'Articles',   count: counts!.articles,   capped: capped!.articles },
      ]
    : []

  return (
    <>
      <Navbar />
      <main className="srch">
        {/* ── Hero ── */}
        <section className="srch-hero" aria-label="Search InfoWebWorld">
          <div className="tlp-hero-bg" aria-hidden="true">
            <div className="tlp-hero-glow" />
            <div className="tlp-hero-grid" />
          </div>
          <div className="srch-hero-inner">
            <span className="srch-eyebrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
              </svg>
              Search
            </span>
            <h1 className="srch-h1">
              {hasQuery ? <>Results for <em>&ldquo;{q}&rdquo;</em></> : 'Search InfoWebWorld'}
            </h1>
            {!hasQuery && (
              <p className="srch-hero-sub">
                Find verified companies, browse categories, and read articles across 14,000+ business categories.
              </p>
            )}

            <SearchBar initialQuery={q} initialSector={sector} autoFocus={!hasQuery} />

            {results && (
              <div className="srch-meta">
                <span><strong>{countLabel(counts!.total, false)}</strong> result{counts!.total === 1 ? '' : 's'}</span>
                {sector && (
                  <Link href={removeSectorHref()} className="srch-scope" title="Remove sector filter">
                    in <b>{SECTOR_NAMES[sector]}</b>
                    <span className="srch-scope-x" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── Body ── */}
        <div className="srch-body">
          {/* No query yet → prompt */}
          {!hasQuery && (
            <div className="srch-prompt">
              <p className="srch-prompt-label">Browse by sector</p>
              <div className="srch-sector-grid">
                {PROMPT_SECTORS.map(s => (
                  <Link key={s.slug} href={`/${s.slug}`} className="srch-sector" style={{ ['--srch-sec' as string]: s.color }}>
                    <span className="srch-sector-name">{s.name}</span>
                    <span className="srch-sector-desc">{s.desc}</span>
                  </Link>
                ))}
              </div>
              <div className="srch-chips">
                <span className="srch-chips-label">Trending:</span>
                {TRENDING.map(t => (
                  <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="srch-chip">{t}</Link>
                ))}
              </div>
            </div>
          )}

          {/* Query, zero results */}
          {results && counts!.total === 0 && (
            <div className="srch-empty">
              <span className="srch-empty-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /><line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </span>
              <h2 className="srch-empty-title">No results for <strong>&ldquo;{q}&rdquo;</strong>{sector ? ` in ${SECTOR_NAMES[sector]}` : ''}</h2>
              <p className="srch-empty-sub">
                Try a shorter or more general term{sector ? <>, or <Link href={removeSectorHref()} style={{ color: '#003B2A', fontWeight: 700 }}>search all sectors</Link></> : ''}. You can also browse by sector below.
              </p>
              <div className="srch-chips" style={{ marginTop: 8 }}>
                {PROMPT_SECTORS.map(s => (
                  <Link key={s.slug} href={`/${s.slug}`} className="srch-chip">{s.name}</Link>
                ))}
              </div>
            </div>
          )}

          {/* Query with results */}
          {results && counts!.total > 0 && (
            <>
              <nav className="srch-tabs" aria-label="Filter results by type">
                {TABS.map(t => (
                  <Link key={t.key} href={tabHref(t.key)} className={'srch-tab' + (type === t.key ? ' is-on' : '')} aria-current={type === t.key ? 'page' : undefined}>
                    {t.label}
                    <span className="srch-tab-count">{countLabel(t.count, t.capped)}</span>
                  </Link>
                ))}
              </nav>

              {/* All — grouped preview of each non-empty group */}
              {type === 'all' && (
                <>
                  {results.companies.length > 0 && (
                    <section className="srch-section">
                      <div className="srch-section-head">
                        <h2 className="srch-section-title">Companies <span>{countLabel(counts!.companies, capped!.companies)}</span></h2>
                        {(results.companies.length > 6 || capped!.companies) && (
                          <Link href={tabHref('companies')} className="srch-seeall">See all<ArrowRight /></Link>
                        )}
                      </div>
                      <div className="srch-co-grid">
                        {results.companies.slice(0, 6).map(c => <CompanyCard key={c.id} c={c} q={q} />)}
                      </div>
                    </section>
                  )}

                  {results.categories.length > 0 && (
                    <section className="srch-section">
                      <div className="srch-section-head">
                        <h2 className="srch-section-title">Categories <span>{countLabel(counts!.categories, capped!.categories)}</span></h2>
                        {(results.categories.length > 8 || capped!.categories) && (
                          <Link href={tabHref('categories')} className="srch-seeall">See all<ArrowRight /></Link>
                        )}
                      </div>
                      <div className="srch-cat-grid">
                        {results.categories.slice(0, 8).map(c => <CategoryCard key={c.id} c={c} q={q} />)}
                      </div>
                    </section>
                  )}

                  {results.articles.length > 0 && (
                    <section className="srch-section">
                      <div className="srch-section-head">
                        <h2 className="srch-section-title">Articles <span>{countLabel(counts!.articles, capped!.articles)}</span></h2>
                        {(results.articles.length > 4 || capped!.articles) && (
                          <Link href={tabHref('articles')} className="srch-seeall">See all<ArrowRight /></Link>
                        )}
                      </div>
                      <div className="srch-art-grid">
                        {results.articles.slice(0, 4).map(a => <ArticleCard key={a.id} a={a} q={q} />)}
                      </div>
                    </section>
                  )}
                </>
              )}

              {/* Single-type full lists */}
              {type === 'companies' && (
                <section className="srch-section">
                  {results.companies.length > 0 ? (
                    <div className="srch-co-grid">
                      {results.companies.map(c => <CompanyCard key={c.id} c={c} q={q} />)}
                    </div>
                  ) : <p className="srch-empty-sub" style={{ textAlign: 'center' }}>No companies match &ldquo;{q}&rdquo;.</p>}
                </section>
              )}
              {type === 'categories' && (
                <section className="srch-section">
                  {results.categories.length > 0 ? (
                    <div className="srch-cat-grid">
                      {results.categories.map(c => <CategoryCard key={c.id} c={c} q={q} />)}
                    </div>
                  ) : <p className="srch-empty-sub" style={{ textAlign: 'center' }}>No categories match &ldquo;{q}&rdquo;.</p>}
                </section>
              )}
              {type === 'articles' && (
                <section className="srch-section">
                  {results.articles.length > 0 ? (
                    <div className="srch-art-grid">
                      {results.articles.map(a => <ArticleCard key={a.id} a={a} q={q} />)}
                    </div>
                  ) : <p className="srch-empty-sub" style={{ textAlign: 'center' }}>No articles match &ldquo;{q}&rdquo;.</p>}
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
