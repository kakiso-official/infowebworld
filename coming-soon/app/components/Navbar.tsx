'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from './CountryLink'
import { BASE } from '../config/base-path'
import CountrySwitcher from './CountrySwitcher'
import GlobalSearch from './GlobalSearch'

/* ═══════════════════════════════════════════
   Header — Stripe-style mega-menu dropdowns
   Glass on scroll · smart hide/show · search overlay
   ═══════════════════════════════════════════ */

type NavItem = { label: string; href: string; cta?: boolean; comingSoon?: boolean; dropdown?: boolean }

const NAV_ITEMS: NavItem[] = [
  { label: 'Categories', href: '/categories', dropdown: true },
  { label: 'Reviews',    href: '#', comingSoon: true, dropdown: true },
  { label: 'Compare',    href: '#', comingSoon: true, dropdown: true },
  { label: 'News',       href: '#', comingSoon: true, dropdown: true },
  { label: 'Get Listed', href: '/business', cta: true },
]

/* ── Categories mega-menu data — all 6 L1 sectors with ALL real L2 categories ── */
type DDItem = { name: string; slug: string; color: string; desc?: string }
type DDSector = { header: string; slug: string; items: DDItem[] }

const DD_SECTORS: DDSector[] = [
  {
    header: 'AI & ML', slug: 'artificial-intelligence-ml',
    items: [
      { name: 'AI Assistants & Chatbots', desc: 'Virtual agents & conversational AI', slug: 'ai-assistants-chatbots', color: '#4361EE' },
      { name: 'AI Content Creation', desc: 'Text, image & video generation', slug: 'ai-content-creation', color: '#4361EE' },
      { name: 'AI Data & Analytics', desc: 'Predictive models & data tools', slug: 'ai-data-analytics', color: '#4361EE' },
      { name: 'AI Developer Tools', desc: 'APIs, frameworks & ML ops', slug: 'ai-developer-tools', color: '#4361EE' },
      { name: 'AI for Business', desc: 'Enterprise AI solutions', slug: 'ai-for-business', color: '#4361EE' },
      { name: 'AI Document & File Tools', desc: 'Extraction, parsing & automation', slug: 'ai-document-file-tools', color: '#4361EE' },
      { name: 'AI Browser & Desktop', slug: 'ai-browser-desktop', color: '#4361EE' },
      { name: 'AI Career & Professional', slug: 'ai-career-professional', color: '#4361EE' },
      { name: 'AI Characters & Companions', slug: 'ai-characters-companions', color: '#4361EE' },
      { name: 'AI Creative Specialty', slug: 'ai-creative-specialty', color: '#4361EE' },
      { name: 'AI for Industry', slug: 'ai-for-industry', color: '#4361EE' },
      { name: 'AI Lifestyle & Personal', slug: 'ai-lifestyle-personal', color: '#4361EE' },
      { name: 'AI Safety & Ethics', slug: 'ai-safety-ethics', color: '#4361EE' },
    ],
  },
  {
    header: 'Software & SaaS', slug: 'software-saas',
    items: [
      { name: 'CRM & Sales', desc: 'Pipeline & customer management', slug: 'crm-sales', color: '#3B82F6' },
      { name: 'Project Management', desc: 'Tasks, teams & workflows', slug: 'project-management', color: '#3B82F6' },
      { name: 'Marketing', desc: 'Campaigns, SEO & automation', slug: 'marketing', color: '#3B82F6' },
      { name: 'Communication & Collaboration', desc: 'Chat, video & teamwork', slug: 'communication-collaboration', color: '#3B82F6' },
      { name: 'E-Commerce', desc: 'Online stores & payments', slug: 'e-commerce', color: '#3B82F6' },
      { name: 'HR & People', desc: 'Hiring, payroll & culture', slug: 'hr-people', color: '#3B82F6' },
      { name: 'Customer Support', slug: 'customer-support', color: '#3B82F6' },
      { name: 'Design & Creative', slug: 'design-creative', color: '#3B82F6' },
      { name: 'Development & IT', slug: 'development-it', color: '#3B82F6' },
      { name: 'Finance & Accounting', slug: 'finance-accounting', color: '#3B82F6' },
      { name: 'Legal & Compliance', slug: 'legal-compliance', color: '#3B82F6' },
      { name: 'Operations & ERP', slug: 'operations-erp', color: '#3B82F6' },
    ],
  },
  {
    header: 'IT Services & Agencies', slug: 'it-services-agencies',
    items: [
      { name: 'Software Development', desc: 'Custom apps & engineering', slug: 'software-development', color: '#14B8A6' },
      { name: 'Digital Marketing Agencies', desc: 'SEO, PPC & social media', slug: 'digital-marketing-agencies', color: '#14B8A6' },
      { name: 'IT Consulting', desc: 'Strategy & infrastructure', slug: 'it-consulting', color: '#14B8A6' },
      { name: 'Design Agencies', desc: 'UX, branding & creative', slug: 'design-agencies', color: '#14B8A6' },
      { name: 'Managed Services', desc: 'Outsourced IT & support', slug: 'managed-services', color: '#14B8A6' },
    ],
  },
  {
    header: 'Startups & Innovation', slug: 'startups-innovation',
    items: [
      { name: 'By Sector', desc: 'Fintech, EdTech, HealthTech & more', slug: 'by-sector', color: '#8B5CF6' },
      { name: 'By Stage', desc: 'Pre-seed to Series C+', slug: 'by-stage', color: '#8B5CF6' },
      { name: 'By Model', desc: 'SaaS, marketplace, hardware', slug: 'by-model', color: '#8B5CF6' },
      { name: 'By Region', desc: 'US, Europe, Asia & global', slug: 'by-region', color: '#8B5CF6' },
    ],
  },
  {
    header: 'Local Business', slug: 'local-business',
    items: [
      { name: 'Food & Dining', desc: 'Restaurants, cafes & delivery', slug: 'food-dining', color: '#F59E0B' },
      { name: 'Health & Wellness', desc: 'Fitness, spas & clinics', slug: 'health-wellness', color: '#F59E0B' },
      { name: 'Home Services', desc: 'Repair, cleaning & maintenance', slug: 'home-services', color: '#F59E0B' },
      { name: 'Retail & Shopping', desc: 'Stores, boutiques & e-tail', slug: 'retail-shopping', color: '#F59E0B' },
      { name: 'Education & Childcare', desc: 'Schools, tutoring & daycare', slug: 'education-childcare', color: '#F59E0B' },
      { name: 'Events & Entertainment', desc: 'Venues, planning & media', slug: 'events-entertainment', color: '#F59E0B' },
      { name: 'Auto Services', slug: 'auto-services', color: '#F59E0B' },
      { name: 'Community & Religious', slug: 'community-religious', color: '#F59E0B' },
    ],
  },
  {
    header: 'Professional Services', slug: 'professional-services',
    items: [
      { name: 'Legal', desc: 'Law firms & legal counsel', slug: 'legal', color: '#E8553D' },
      { name: 'Accounting & Finance', desc: 'Bookkeeping, tax & audit', slug: 'accounting-finance', color: '#E8553D' },
      { name: 'Consulting', desc: 'Strategy & management advisory', slug: 'consulting', color: '#E8553D' },
      { name: 'Staffing & Recruitment', desc: 'Hiring, talent & HR', slug: 'staffing-recruitment', color: '#E8553D' },
      { name: 'Real Estate', desc: 'Commercial & residential', slug: 'real-estate', color: '#E8553D' },
      { name: 'Marketing & Creative', desc: 'Branding, content & PR', slug: 'marketing-creative', color: '#E8553D' },
      { name: 'Architecture', slug: 'architecture', color: '#E8553D' },
      { name: 'Business Services', slug: 'business-services', color: '#E8553D' },
      { name: 'Cleaning & Maintenance', slug: 'cleaning-maintenance', color: '#E8553D' },
      { name: 'Engineering', slug: 'engineering', color: '#E8553D' },
      { name: 'Environmental Services', slug: 'environmental-services', color: '#E8553D' },
      { name: 'Financial Planning', slug: 'financial-planning', color: '#E8553D' },
      { name: 'Insurance', slug: 'insurance', color: '#E8553D' },
      { name: 'Security', slug: 'security', color: '#E8553D' },
      { name: 'Translation & Language', slug: 'translation-language', color: '#E8553D' },
    ],
  },
]

/* How many L2 items to show per sector in the 6-column overview */
const DD_PREVIEW_COUNT = 5

/* ── Coming soon content with feature preview cards ── */
type SoonCard = { text: string; sub: string; icon: React.ReactNode }
type SoonData = { title: string; desc: string; cards: SoonCard[] }

const soonIcon = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
)

const SOON: Record<string, SoonData> = {
  Reviews: {
    title: 'Company Reviews',
    desc: 'Verified reviews from real users. Compare ratings, read detailed feedback, and make smarter decisions.',
    cards: [
      { text: 'Verified Ratings', sub: '5-star scoring system', icon: soonIcon('M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z') },
      { text: 'User Testimonials', sub: 'Real buyer experiences', icon: soonIcon('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z') },
      { text: 'Trust Scores', sub: 'Transparency metrics', icon: soonIcon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z') },
    ],
  },
  Compare: {
    title: 'Side-by-Side Comparisons',
    desc: 'Compare tools head-to-head. Features, pricing, pros & cons — everything in one clean view.',
    cards: [
      { text: 'Feature Matrix', sub: 'Detailed breakdowns', icon: soonIcon('M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z') },
      { text: 'Price Comparison', sub: 'Plan-by-plan pricing', icon: soonIcon('M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6') },
      { text: 'Pros & Cons', sub: 'Honest trade-offs', icon: soonIcon('M12 20V10M18 20V4M6 20v-4') },
    ],
  },
  News: {
    title: 'Industry News & Insights',
    desc: 'Curated business news, product launches, funding rounds, and expert analysis — updated daily.',
    cards: [
      { text: 'Daily Digest', sub: 'Top stories curated', icon: soonIcon('M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z') },
      { text: 'Funding Tracker', sub: 'Rounds & valuations', icon: soonIcon('M22 12h-4l-3 9L9 3l-3 9H2') },
      { text: 'Product Launches', sub: 'New tools & updates', icon: soonIcon('M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z') },
    ],
  },
}

/* ── Chevron ── */
const Chev = () => (
  <svg className="nh-link-chev" width="10" height="10" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

type CatRow = { id: number; name: string; slug: string; level: number; parent_id: number | null; color: string }

/* ── Global category cache — fetched once, shared across all Navbar instances ── */
let _catCache: CatRow[] | null = null
let _catPromise: Promise<CatRow[]> | null = null

function fetchCategories(): Promise<CatRow[]> {
  if (_catCache) return Promise.resolve(_catCache)
  if (_catPromise) return _catPromise
  _catPromise = fetch('/api/categories')
    .then(r => r.json())
    .then(res => {
      if (res.ok) { _catCache = res.data; return _catCache! }
      return []
    })
    .catch(() => [])
  return _catPromise
}

function buildSectorCols(cats: CatRow[], slug: string): DDSector[] {
  const l1 = cats.find(c => c.slug === slug && c.level === 1)
  if (!l1) return []
  const l2s = cats.filter(c => c.parent_id === l1.id && c.level === 2)
  return l2s.map(l2 => ({
    header: l2.name,
    slug: l2.slug,
    items: cats
      .filter(c => c.parent_id === l2.id && c.level === 3)
      .map(l3 => ({ name: l3.name, slug: l3.slug, color: l2.color || '#4361EE' }))
  }))
}

export default function Navbar({ sectorSlug, hideSearch }: { sectorSlug?: string; hideSearch?: boolean } = {}) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDD, setActiveDD] = useState<string | null>(null)
  const [mobCatOpen, setMobCatOpen] = useState(false)
  const [sectorCols, setSectorCols] = useState<DDSector[] | null>(() => {
    /* Instant render if cache already warm */
    if (sectorSlug && _catCache) return buildSectorCols(_catCache, sectorSlug)
    return null
  })
  const lastY = useRef(0)
  const ddTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  /* Prefetch categories immediately — warm cache for dropdown */
  useEffect(() => {
    fetchCategories().then(cats => {
      if (sectorSlug && cats.length) setSectorCols(buildSectorCols(cats, sectorSlug))
    })
  }, [sectorSlug])

  /* Scroll — RAF-throttled for zero jank */
  useEffect(() => {
    let ticking = false
    const fn = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 10)
        setHidden(y > lastY.current && y > 80)
        lastY.current = y
        ticking = false
      })
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setActiveDD(null) }
    }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [])

  useEffect(() => () => clearTimeout(ddTimer.current), [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const toggleMenu = () => {
    const next = !menuOpen
    setMenuOpen(next)
    if (next) setActiveDD(null)
  }

  const openDD = (label: string) => { clearTimeout(ddTimer.current); setActiveDD(label) }
  const scheduleCloseDD = () => { ddTimer.current = setTimeout(() => setActiveDD(null), 150) }
  const keepDD = () => clearTimeout(ddTimer.current)
  const closeDD = () => setActiveDD(null)

  const cls = [
    'nh',
    scrolled && 'nh--glass',
    hidden && !menuOpen && !activeDD && 'nh--hidden',
  ].filter(Boolean).join(' ')

  return (
    <>
      <header className={cls}>
        {/* Row 1 — Logo | Search (center) | Actions */}
        <div className="nh-row-top">
          <Link href="/" className="nh-logo">
            <img src={`${BASE}/logo/infowebworldlogo-logoforlightbackgrounds.png`} alt="InfoWebWorld" />
          </Link>

          {!hideSearch && (
            <div className="nh-search-inline">
              <GlobalSearch placeholder="Search categories, companies, articles..." />
            </div>
          )}

          <div className="nh-actions">
            <CountrySwitcher />
            <Link href="/business" className="nh-biz">iWW Business</Link>
            <button className="nh-burger" onClick={toggleMenu}
              aria-label="Menu" aria-expanded={menuOpen} type="button">
              <span className={`nh-burger-bars${menuOpen ? ' nh-burger-bars--x' : ''}`}>
                <span /><span />
              </span>
            </button>
          </div>
        </div>

        {/* Row 2 — Nav links */}
        <nav className="nh-row-sub" aria-label="Main">
          {NAV_ITEMS.filter(i => !i.cta).map(item => {
            const el = (
              <div key={item.label} className="nh-link-wrap"
                onMouseEnter={() => item.dropdown ? openDD(item.label) : undefined}
                onMouseLeave={item.dropdown ? scheduleCloseDD : undefined}>
                <Link href={item.href}
                  className={[
                    'nh-link',
                    item.comingSoon && 'nh-link--dim',
                    activeDD === item.label && 'nh-link--active',
                  ].filter(Boolean).join(' ')}>
                  {item.label}
                  {item.dropdown && <Chev />}
                </Link>
              </div>
            )

            /* Insert sector link right after Categories */
            if (item.label === 'Categories' && sectorSlug && sectorCols && sectorCols.length > 0) {
              const sectorName = DD_SECTORS.find(s => s.slug === sectorSlug)?.header || sectorSlug
              return [
                el,
                <div key="__sector__" className="nh-link-wrap"
                  onMouseEnter={() => openDD('__sector__')}
                  onMouseLeave={scheduleCloseDD}>
                  <span className={`nh-link nh-link--sector${activeDD === '__sector__' ? ' nh-link--active' : ''}`}>
                    {sectorName}
                    <Chev />
                  </span>
                </div>
              ]
            }
            return el
          })}
        </nav>

        {/* ═══ Mega-menu dropdown ═══ */}
        <div className={`nh-mega${activeDD ? ' nh-mega--open' : ''}`}
          onMouseEnter={keepDD} onMouseLeave={scheduleCloseDD}>
          <div className="nh-mega-inner">

            {/* ── Categories dropdown — always global (L1 → L2) ── */}
            {activeDD === 'Categories' && (
              <div className="nh-dd-cats" key="cats-all">
                <div className="nh-dd-grid">
                  {DD_SECTORS.map(sector => (
                    <div key={sector.slug} className="nh-dd-col">
                      <Link href={`/${sector.slug}`} className="nh-dd-col-head" onClick={closeDD}>
                        {sector.header}
                      </Link>
                      {sector.items.slice(0, DD_PREVIEW_COUNT).map(item => (
                        <Link key={item.slug} href={`/${sector.slug}/${item.slug}`}
                          className="nh-dd-item" onClick={closeDD}>
                          <span className="nh-dd-item-name" style={{ color: item.color }}>{item.name}</span>
                          {item.desc && <span className="nh-dd-item-desc">{item.desc}</span>}
                        </Link>
                      ))}
                      <Link href={`/${sector.slug}/all`} className="nh-dd-more"
                        style={{ color: sector.items[0]?.color }} onClick={closeDD}>
                        View all →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Sector-specific dropdown (L2 → L3) — only on L1 pages ── */}
            {activeDD === '__sector__' && sectorCols && sectorCols.length > 0 && (
              <div className="nh-dd-cats" key={`sector-${sectorSlug}`}>
                <div className="nh-dd-grid">
                  {sectorCols.slice(0, 12).map(col => (
                    <div key={col.slug} className="nh-dd-col">
                      <Link href={`/${sectorSlug}/${col.slug}`} className="nh-dd-col-head" onClick={closeDD}>
                        {col.header}
                      </Link>
                      {col.items.slice(0, 5).map(item => (
                        <Link key={item.slug} href={`/${sectorSlug}/${item.slug}`}
                          className="nh-dd-item" onClick={closeDD}>
                          <span className="nh-dd-item-name" style={{ color: item.color }}>{item.name}</span>
                        </Link>
                      ))}
                      <Link href={`/${sectorSlug}/${col.slug}`} className="nh-dd-more"
                        style={{ color: col.items[0]?.color }} onClick={closeDD}>
                        View all →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Coming Soon panels ── */}
            {activeDD && SOON[activeDD] && (
              <div className="nh-dd-soon" key={activeDD}
                data-theme={activeDD === 'Reviews' ? 'reviews' : activeDD === 'Compare' ? 'compare' : 'news'}>
                <div className="nh-dd-soon-left">
                  <div className="nh-dd-soon-badge">Coming Soon</div>
                  <div className="nh-dd-soon-title">{SOON[activeDD].title}</div>
                  <div className="nh-dd-soon-desc">{SOON[activeDD].desc}</div>
                  <div className="nh-dd-soon-action">
                    <span className="nh-dd-soon-dot" />
                    We&apos;ll notify you when it&apos;s ready
                  </div>
                </div>
                <div className="nh-dd-soon-right">
                  {SOON[activeDD].cards.map((card, i) => (
                    <div key={i} className="nh-dd-soon-card">
                      <div className="nh-dd-soon-card-icon">{card.icon}</div>
                      <div>
                        <div className="nh-dd-soon-card-text">{card.text}</div>
                        <div className="nh-dd-soon-card-sub">{card.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </header>

      <div className="nh-spacer" />

      {/* ═══ Mobile menu — full-screen overlay ═══ */}
      <div className={`nh-mob${menuOpen ? ' nh-mob--open' : ''}`}>
        {/* Top bar — logo + close */}
        <div className="nh-mob-head">
          <Link href="/" className="nh-logo" onClick={closeMenu}>
            <img src={`${BASE}/logo/infowebworldlogo-logoforlightbackgrounds.png`} alt="InfoWebWorld" />
          </Link>
          <button className="nh-mob-close" onClick={closeMenu} aria-label="Close" type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="nh-mob-search">
          <GlobalSearch placeholder="Search categories, companies..." />
        </div>

        {/* Scrollable nav body */}
        <div className="nh-mob-body">
          {/* Categories — accordion */}
          <div className="nh-mob-acc">
            <button className={`nh-mob-acc-trigger${mobCatOpen ? ' nh-mob-acc-trigger--open' : ''}`}
              onClick={() => setMobCatOpen(o => !o)} type="button">
              <span>Categories</span>
              <svg className="nh-mob-acc-chev" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className={`nh-mob-acc-body${mobCatOpen ? ' nh-mob-acc-body--open' : ''}`}>
              {DD_SECTORS.map(s => (
                <Link key={s.slug} href={`/${s.slug}`} className="nh-mob-acc-item" onClick={closeMenu}>
                  <span className="nh-mob-acc-dot" style={{ background: s.items[0]?.color }} />
                  {s.header}
                </Link>
              ))}
              <Link href="/categories" className="nh-mob-acc-all" onClick={closeMenu}>
                View all categories →
              </Link>
            </div>
          </div>

          {/* Other nav links */}
          {NAV_ITEMS.filter(i => !i.cta && i.label !== 'Categories').map((item, i) => (
            <Link key={item.label} href={item.href} className="nh-mob-link" onClick={closeMenu}
              style={menuOpen ? { animationDelay: `${(i + 1) * 50}ms` } : undefined}>
              <span>{item.label}</span>
              {item.comingSoon && <span className="nh-mob-badge">Coming Soon</span>}
            </Link>
          ))}

          {/* Divider */}
          <div className="nh-mob-divider" />

          {/* iWW Business */}
          <Link href="/business" className="nh-mob-link" onClick={closeMenu}
            style={menuOpen ? { animationDelay: '200ms' } : undefined}>
            <span>iWW Business</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>
        </div>

        {/* Fixed bottom — CTA + Country */}
        <div className="nh-mob-foot">
          <Link href="/business" className="nh-mob-cta" onClick={closeMenu}>
            Get Listed
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <div className="nh-mob-foot-row">
            <CountrySwitcher />
          </div>
        </div>
      </div>
    </>
  )
}
