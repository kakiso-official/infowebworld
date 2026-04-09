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
    header: 'AI & ML', slug: 'ai-ml',
    items: [
      { name: 'AI Assistants & Chatbots', slug: 'ai-assistants-chatbots', color: '#8B5CF6' },
      { name: 'AI Writing & Long-Form Text', slug: 'ai-writing-long-form-text', color: '#8B5CF6' },
      { name: 'AI Image Generation', slug: 'ai-image-generation', color: '#8B5CF6' },
      { name: 'AI Video Generation', slug: 'ai-video-generation', color: '#8B5CF6' },
      { name: 'AI Audio Generation & Music', slug: 'ai-audio-generation-music', color: '#8B5CF6' },
      { name: 'AI Code & Developer Tools', slug: 'ai-code-developer-tools', color: '#8B5CF6' },
      { name: 'AI No-Code & App Builders', slug: 'ai-no-code-app-builders', color: '#8B5CF6' },
      { name: 'AI Marketing & Growth', slug: 'ai-marketing-growth', color: '#8B5CF6' },
      { name: 'AI Data Analysis & BI', slug: 'ai-data-analysis-bi', color: '#8B5CF6' },
      { name: 'AI Education & Tutoring', slug: 'ai-education-tutoring', color: '#8B5CF6' },
      { name: 'AI Healthcare & Medical', slug: 'ai-healthcare-medical', color: '#8B5CF6' },
      { name: 'AI Design, Branding & Creative', slug: 'ai-design-branding-creative', color: '#8B5CF6' },
      { name: 'AI eCommerce & Retail', slug: 'ai-ecommerce-retail', color: '#8B5CF6' },
      { name: 'AI Cybersecurity & Privacy', slug: 'ai-cybersecurity-privacy', color: '#8B5CF6' },
      { name: 'AI Agent Frameworks & Infrastructure', slug: 'ai-agent-frameworks-infrastructure', color: '#8B5CF6' },
      { name: 'AI for Vertical Industries', slug: 'ai-for-vertical-industries', color: '#8B5CF6' },
    ],
  },
  {
    header: 'Software & SaaS', slug: 'software-saas',
    items: [
      { name: 'Sales & CRM Software', slug: 'sales-crm-software', color: '#3B82F6' },
      { name: 'Marketing Software', slug: 'marketing-software', color: '#3B82F6' },
      { name: 'E-Commerce & Retail Software', slug: 'e-commerce-retail-software', color: '#3B82F6' },
      { name: 'HR, Workforce & People Software', slug: 'hr-workforce-people-software', color: '#3B82F6' },
      { name: 'Finance, Accounting & Tax Software', slug: 'finance-accounting-tax-software', color: '#3B82F6' },
      { name: 'Developer & Engineering Tools', slug: 'developer-engineering-tools', color: '#3B82F6' },
      { name: 'Project, Task & Work Management', slug: 'project-task-work-management-software', color: '#3B82F6' },
      { name: 'Customer Service & Support', slug: 'customer-service-support-software', color: '#3B82F6' },
      { name: 'Communication & Collaboration', slug: 'communication-collaboration-software', color: '#3B82F6' },
      { name: 'Healthcare & Medical Software', slug: 'healthcare-medical-software', color: '#3B82F6' },
      { name: 'Cybersecurity & Identity Software', slug: 'cybersecurity-identity-software', color: '#3B82F6' },
      { name: 'Data, Analytics & BI Software', slug: 'data-analytics-bi-software', color: '#3B82F6' },
      { name: 'Design, Creative & Digital Asset', slug: 'design-creative-digital-asset-software', color: '#3B82F6' },
      { name: 'Education & Academic Software', slug: 'education-academic-software', color: '#3B82F6' },
      { name: 'Legal & Professional Services', slug: 'legal-professional-services-software', color: '#3B82F6' },
      { name: 'ERP & Business Operations', slug: 'erp-business-operations-software', color: '#3B82F6' },
    ],
  },
  {
    header: 'IT Services & Agencies', slug: 'it-services-agencies',
    items: [
      { name: 'Custom Software Development', slug: 'custom-software-development-companies', color: '#14B8A6' },
      { name: 'Web Design & Development', slug: 'web-design-development-services', color: '#14B8A6' },
      { name: 'Mobile App Development', slug: 'mobile-app-development-companies', color: '#14B8A6' },
      { name: 'SEO Agencies', slug: 'seo-agencies-search-optimization-services', color: '#14B8A6' },
      { name: 'Cybersecurity Services', slug: 'cybersecurity-services-consulting', color: '#14B8A6' },
      { name: 'Managed IT Services (MSPs)', slug: 'managed-it-services-providers-msps', color: '#14B8A6' },
      { name: 'Cloud Migration & Infrastructure', slug: 'cloud-migration-hosting-infrastructure-services', color: '#14B8A6' },
      { name: 'UX & UI Design Agencies', slug: 'ux-ui-design-agencies', color: '#14B8A6' },
      { name: 'eCommerce Development', slug: 'ecommerce-development-agencies', color: '#14B8A6' },
      { name: 'Video Production Companies', slug: 'video-production-companies', color: '#14B8A6' },
      { name: 'Social Media Marketing', slug: 'social-media-marketing-agencies', color: '#14B8A6' },
      { name: 'CRM & ERP Implementation', slug: 'crm-erp-implementation-partners', color: '#14B8A6' },
      { name: 'Data, Analytics & BI Consulting', slug: 'data-analytics-bi-consulting', color: '#14B8A6' },
      { name: 'AI & ML Development', slug: 'ai-machine-learning-development', color: '#14B8A6' },
      { name: 'IT Staffing & Talent', slug: 'it-staffing-talent-agencies', color: '#14B8A6' },
      { name: 'Photography Services', slug: 'photography-services', color: '#14B8A6' },
    ],
  },
  {
    header: 'Startups & Innovation', slug: 'startups-innovation',
    items: [
      { name: 'FinTech & Financial Services', slug: 'fintech-financial-services-startups', color: '#E8553D' },
      { name: 'HealthTech & MedTech', slug: 'healthtech-medtech-startups', color: '#E8553D' },
      { name: 'EdTech & Learning', slug: 'edtech-learning-startups', color: '#E8553D' },
      { name: 'Climate, Energy & Sustainability', slug: 'climate-energy-sustainability-startups', color: '#E8553D' },
      { name: 'AI, ML & Generative AI', slug: 'ai-ml-generative-ai-startups', color: '#E8553D' },
      { name: 'Web3, Crypto & Blockchain', slug: 'web3-crypto-blockchain-startups', color: '#E8553D' },
      { name: 'Developer Tools & DevOps', slug: 'developer-tools-devops-startups', color: '#E8553D' },
      { name: 'Cybersecurity Startups', slug: 'cybersecurity-startups', color: '#E8553D' },
      { name: 'E-Commerce & Retail', slug: 'e-commerce-retail-startups', color: '#E8553D' },
      { name: 'Robotics, Hardware & DeepTech', slug: 'robotics-hardware-deeptech-startups', color: '#E8553D' },
      { name: 'Startups by Business Model', slug: 'startups-by-business-model', color: '#E8553D' },
      { name: 'Startups by Funding Stage', slug: 'startups-by-funding-stage', color: '#E8553D' },
      { name: 'Venture Capital & Investors', slug: 'venture-capital-angels-investors', color: '#E8553D' },
      { name: 'Accelerators & Incubators', slug: 'startup-programs-accelerators-incubators', color: '#E8553D' },
      { name: 'Startup Ecosystems by City', slug: 'startup-ecosystems-by-city-region', color: '#E8553D' },
      { name: 'Gaming & Esports', slug: 'gaming-esports-startups', color: '#E8553D' },
    ],
  },
  {
    header: 'Local Business', slug: 'local-business',
    items: [
      { name: 'Restaurants & Cuisines', slug: 'restaurants-cuisines', color: '#F59E0B' },
      { name: 'Beauty, Hair & Spa Services', slug: 'beauty-hair-spa-services', color: '#F59E0B' },
      { name: 'Home Repair & Improvement', slug: 'home-repair-improvement-services', color: '#F59E0B' },
      { name: 'Automotive Sales & Repair', slug: 'automotive-sales-repair-customization', color: '#F59E0B' },
      { name: 'Doctors & Medical Specialists', slug: 'doctors-medical-specialists', color: '#F59E0B' },
      { name: 'Active Life & Recreation', slug: 'active-life-recreation', color: '#F59E0B' },
      { name: 'Pet Services & Pet Care', slug: 'pet-services-pet-care', color: '#F59E0B' },
      { name: 'Specialty Retail & Boutiques', slug: 'specialty-retail-boutiques', color: '#F59E0B' },
      { name: 'Wedding & Event Vendors', slug: 'wedding-event-vendors', color: '#F59E0B' },
      { name: 'Coffee, Tea & Beverage Spots', slug: 'coffee-tea-beverage-spots', color: '#F59E0B' },
      { name: 'Bars & Nightlife Venues', slug: 'bars-nightlife-venues', color: '#F59E0B' },
      { name: 'Schools, Tutoring & Test Prep', slug: 'schools-tutoring-test-prep', color: '#F59E0B' },
      { name: 'Cleaning & Restoration', slug: 'cleaning-restoration-pest-services', color: '#F59E0B' },
      { name: 'Hotels, Lodging & Travel', slug: 'hotels-lodging-local-travel', color: '#F59E0B' },
      { name: 'Mental Health & Counseling', slug: 'mental-health-counseling', color: '#F59E0B' },
      { name: 'Religious & Community Centers', slug: 'religious-civic-community-centers', color: '#F59E0B' },
    ],
  },
  {
    header: 'Professional Services', slug: 'professional-services',
    items: [
      { name: 'Lawyers & Law Firms', slug: 'lawyers-law-firms-by-specialty', color: '#2FAE6A' },
      { name: 'Accountants, CPAs & Tax', slug: 'accountants-cpas-tax-advisors', color: '#2FAE6A' },
      { name: 'Financial Advisors & Wealth', slug: 'financial-advisors-wealth-management', color: '#2FAE6A' },
      { name: 'Strategy & Management Consulting', slug: 'strategy-management-consulting-firms', color: '#2FAE6A' },
      { name: 'Engineering Firms', slug: 'engineering-firms-by-discipline', color: '#2FAE6A' },
      { name: 'Architects & Architecture', slug: 'licensed-architects-specialty-architecture-firms', color: '#2FAE6A' },
      { name: 'Real Estate Professionals', slug: 'real-estate-professionals-property-services', color: '#2FAE6A' },
      { name: 'HR Consulting & Recruiting', slug: 'hr-consulting-recruiting-talent-services', color: '#2FAE6A' },
      { name: 'Coaching & Professional Dev', slug: 'coaching-professional-development', color: '#2FAE6A' },
      { name: 'Writing, Editing & Research', slug: 'writing-editing-research-services', color: '#2FAE6A' },
      { name: 'Translation & Language', slug: 'translation-interpretation-language-services', color: '#2FAE6A' },
      { name: 'PR & Communications', slug: 'pr-marketing-communications-firms', color: '#2FAE6A' },
      { name: 'Corporate Event Planning', slug: 'corporate-event-planning-production', color: '#2FAE6A' },
      { name: 'Sustainability & ESG', slug: 'sustainability-esg-environmental-consulting', color: '#2FAE6A' },
      { name: 'Risk, Compliance & Audit', slug: 'risk-management-compliance-audit-services', color: '#2FAE6A' },
      { name: 'Corporate Training & L&D', slug: 'corporate-training-ld-providers', color: '#2FAE6A' },
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
          <Link href="/business" className="nh-cta">Get Listed</Link>
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
                      <Link href={`/view-all-sub-categories-${sector.slug}`} className="nh-dd-more"
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
