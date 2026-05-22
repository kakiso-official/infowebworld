'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { BASE } from '../config/base-path'
import GlobalSearch from './GlobalSearch'
import UserMenu from './auth/UserMenu'
import { useAuth } from '@/lib/use-auth'
import SignupModal from './auth/SignupModal'
import { CATEGORIES as STATIC_CATEGORIES } from '../config/categories-data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faCode, faCube, faPalette, faBullhorn, faChartColumn, faShield, faBolt,
  faCartShopping, faDollarSign, faUsers, faHeart, faBrain, faBook,
  faBriefcase, faBuilding, faMessage, faHeadphones, faCloud, faGlobe,
  faMagnifyingGlass, faLayerGroup, faImage, faVideo, faMicrophone,
  faRocket, faLeaf, faScaleBalanced, faKey, faCamera, faCalendar,
  faMap, faTerminal, faHammer, faWrench, faCar, faMugHot, faUtensils,
  faBed, faPen, faGraduationCap, faGamepad, faPaw, faScissors,
  faWandMagicSparkles, faTableCellsLarge, faFlask, faBagShopping,
} from '@fortawesome/free-solid-svg-icons'

/* ════════════════════════════════════════════════════════════════════
   InfoWebWorld site header — dark utility strip + single-row main bar.

   Layout (desktop):
     ┌────────────────────────────────────────────────────────────────────┐
     │                       Blog · Insights · News · Help · About         │  ← utility strip (#0F1419)
     ├────────────────────────────────────────────────────────────────────┤
     │ Logo · Categories ▾ · Write a Review · Compare Tools ── 🔍 [Get]   │  ← main row
     └────────────────────────────────────────────────────────────────────┘

   The utility strip is right-aligned, small uppercase white, hidden on
   mobile. Its items resurface inside the mobile sheet as a flat "More"
   list below the Categories accordion + primary direct-link rows.

   The Categories mega is the only mega remaining:
     full-width — left list of 6 sectors (with "All Categories" pinned
     above) + right 2-col tile grid of L2 categories for the active sector.

   Search icon expands inline (replacing the nav cluster) when clicked.

   Props (kept for back-compat with existing pages):
     sectorSlug — accepted but unused in this redesign
     hideSearch — when true, the search icon is removed
   ════════════════════════════════════════════════════════════════════ */

/* ── L1 sectors with their per-sector palette + human header.
   Slugs match app/config/categories-data.ts. Each palette has 4
   shades from lightest (c1) to darkest (c4):
     c1  light tint   — active-row background, tile hover background
     c2  mid-light    — soft borders / surfaces
     c3  mid-dark     — hover accents
     c4  brand accent — tile-icon background, sector CTA
   Used by the Categories mega to retint the right panel and the
   active row in the left rail as the user hovers sectors. */
type SectorPalette = { c1: string; c2: string; c3: string; c4: string; name: string }
const SECTORS: { slug: string; label: string; palette: SectorPalette }[] = [
  { slug: 'software-saas',            label: 'Software & SaaS',        palette: { c1: '#DDF0FB', c2: '#B5D9F4', c3: '#7DBDE9', c4: '#3F8FD4', name: 'Sky Interface' } },
  { slug: 'ai-ml',                    label: 'AI & ML',                palette: { c1: '#E8E4F8', c2: '#CBBFF2', c3: '#A899E8', c4: '#7C6DD4', name: 'Lavender Neural' } },
  { slug: 'it-services-agencies',     label: 'IT Services & Agencies', palette: { c1: '#D8F5EE', c2: '#9EE1CF', c3: '#5DC9AB', c4: '#1D9E75', name: 'Mint Circuit' } },
  { slug: 'startups-innovation',      label: 'Startups & Innovation',  palette: { c1: '#FAEEE3', c2: '#F5C4A8', c3: '#F09A72', c4: '#D98236', name: 'Peach Ignite' } },
  { slug: 'local-businesses',         label: 'Local Businesses',       palette: { c1: '#EEF7DE', c2: '#C9E49A', c3: '#9ACE5D', c4: '#659A22', name: 'Sage Community' } },
  { slug: 'professional-services',    label: 'Professional Services',  palette: { c1: '#FAEEF4', c2: '#F2C1D3', c3: '#E694B4', c4: '#C85580', name: 'Blush Authority' } },
]

/* Utility-strip links — the dark bar above the main header.
   Curated high-signal picks from the old Resources dropdown.
   "Write a Review" and "Compare Tools" (originally in Find-by-Solutions)
   live as direct items in the main nav beside Categories — see PRIMARY_*
   below. "Industry News" merged into "News". FAQs / Glossary stay
   reachable from the footer and direct URL but are too long-tail
   for the header chrome. */
const UTILITY_LINKS: { label: string; href: string }[] = [
  { label: 'Blog',     href: '/blog'     },
  { label: 'Insights', href: '/insights' },
  { label: 'News',     href: '/news'     },
  { label: 'Help',     href: '/help'     },
  { label: 'About',    href: '/about'    },
]

/* Primary nav direct links — sit beside Categories in the main row.
   Sub-text feeds the `title` attribute (tooltip + a11y description). */
const PRIMARY_LINKS: { label: string; href: string; sub: string }[] = [
  { label: 'Write a Review', href: '/write-review', sub: 'Share your experience with a company' },
  { label: 'Compare Tools',  href: '/compare',      sub: 'Side-by-side product comparisons'      },
]

/* ── L2 children of a sector, drawn synchronously from the static taxonomy.
   Returns the top N L2 categories so the tile grid stays focused. ── */
function l2sOfSector(slug: string, limit = 10): { name: string; slug: string; color: string }[] {
  const l1 = STATIC_CATEGORIES.find(c => c.slug === slug && c.level === 1)
  if (!l1) return []
  return STATIC_CATEGORIES
    .filter(c => c.parent_id === l1.id && c.level === 2)
    .slice(0, limit)
    .map(c => ({ name: c.name, slug: c.slug, color: c.color || '#6B7280' }))
}

/* ── Chevrons + arrows ──────────────────────────────────────────────── */
const ChevDown = () => (
  <svg className="iw-chev-d" width="11" height="11" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth="2.5"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
const ChevRight = () => (
  <svg className="iw-chev-r" width="11" height="11" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth="2.5"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 6 15 12 9 18" />
  </svg>
)
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
  </svg>
)
const IconX = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const IconHamburger = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="3" y1="6"  x2="21" y2="6"  />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

/* ── Category icon set — semantic mapping from L2 category names to
   Font Awesome Solid glyphs. Keyword-driven so the taxonomy can grow
   without rewiring every entry. Rendered via <FontAwesomeIcon> in
   the L2 tile; the icon inherits its colour from CSS (no background,
   pure black via .iw-tile-ico { color: var(--iw-text) }). ── */
type CatIconKey =
  | 'code' | 'cube' | 'palette' | 'megaphone' | 'chart' | 'shield' | 'lightning' | 'cart'
  | 'dollar' | 'users' | 'heart' | 'brain' | 'book' | 'briefcase' | 'building' | 'message'
  | 'headphones' | 'cloud' | 'globe' | 'search' | 'layers' | 'image' | 'video' | 'mic'
  | 'rocket' | 'leaf' | 'scale' | 'key' | 'camera' | 'calendar' | 'map' | 'terminal'
  | 'hammer' | 'wrench' | 'car' | 'coffee' | 'utensils' | 'bed' | 'pen' | 'graduation'
  | 'gamepad' | 'paw' | 'scissors' | 'spark' | 'grid' | 'flask' | 'shopping-bag'

const CAT_FA: Record<CatIconKey, IconDefinition> = {
  code:           faCode,
  cube:           faCube,
  palette:        faPalette,
  megaphone:      faBullhorn,
  chart:          faChartColumn,
  shield:         faShield,
  lightning:      faBolt,
  cart:           faCartShopping,
  dollar:         faDollarSign,
  users:          faUsers,
  heart:          faHeart,
  brain:          faBrain,
  book:           faBook,
  briefcase:      faBriefcase,
  building:       faBuilding,
  message:        faMessage,
  headphones:     faHeadphones,
  cloud:          faCloud,
  globe:          faGlobe,
  search:         faMagnifyingGlass,
  layers:         faLayerGroup,
  image:          faImage,
  video:          faVideo,
  mic:            faMicrophone,
  rocket:         faRocket,
  leaf:           faLeaf,
  scale:          faScaleBalanced,
  key:            faKey,
  camera:         faCamera,
  calendar:       faCalendar,
  map:            faMap,
  terminal:       faTerminal,
  hammer:         faHammer,
  wrench:         faWrench,
  car:            faCar,
  coffee:         faMugHot,
  utensils:       faUtensils,
  bed:            faBed,
  pen:            faPen,
  graduation:     faGraduationCap,
  gamepad:        faGamepad,
  paw:            faPaw,
  scissors:       faScissors,
  spark:          faWandMagicSparkles,
  grid:           faTableCellsLarge,
  flask:          faFlask,
  'shopping-bag': faBagShopping,
}

function CatIcon({ k }: { k: CatIconKey }) {
  return <FontAwesomeIcon icon={CAT_FA[k]} />
}

/* Map an L2 category name → icon key. Keyword-driven, ordered by
   specificity (first match wins). Falls back to a sector-appropriate
   default so unmatched names still get a sensible glyph. */
function iconForCategory(name: string, sectorSlug: string): CatIconKey {
  const n = name.toLowerCase()

  /* Specific keyword maps — ordered by priority. */
  if (/\bcrm\b|sales\b/.test(n))                            return 'users'
  if (/marketing|growth|advertis|pr\b|communications/.test(n)) return 'megaphone'
  if (/ecommerce|e-commerce|retail|shop|boutique/.test(n))  return 'cart'
  if (/hr\b|workforce|people|talent|recruit|staffing/.test(n)) return 'users'
  if (/financ|account|tax|payment|wealth|invest|funding|venture|capital|angel|fintech/.test(n)) return 'dollar'
  if (/developer|engineering tool|devops|code|software development|web design|web app|mobile app|api/.test(n)) return 'code'
  if (/project|task management|work management/.test(n))    return 'briefcase'
  if (/customer service|support/.test(n))                   return 'headphones'
  if (/communication|collab|chat|messaging/.test(n))        return 'message'
  if (/health|medical|medtech|doctor|specialist|mental/.test(n)) return 'heart'
  if (/security|cyber|privacy|risk|compliance|audit/.test(n)) return 'shield'
  if (/data\b|analytic|bi\b|business intelligence/.test(n))   return 'chart'
  if (/design|creative|brand|asset|ux|ui\b|architecture|architect/.test(n)) return 'palette'
  if (/education|academic|learning|tutor|test prep|school|edtech|coaching|training|l&d/.test(n)) return 'graduation'
  if (/legal|law/.test(n))                                  return 'scale'
  if (/erp|business operations/.test(n))                    return 'building'
  if (/ai\b|machine learning|generative|ml\b/.test(n))      return 'spark'
  if (/writing|text|content|editing|translation|research/.test(n)) return 'pen'
  if (/image|photo|graphic/.test(n))                        return 'image'
  if (/video|film/.test(n))                                 return 'video'
  if (/audio|music|sound|podcast/.test(n))                  return 'mic'
  if (/no.code|builder|app builder/.test(n))                return 'grid'
  if (/agent|framework|infrastructure|cloud|hosting/.test(n)) return 'cloud'
  if (/seo|search optim/.test(n))                           return 'search'
  if (/social media/.test(n))                               return 'megaphone'
  if (/it staffing|managed it|msp/.test(n))                 return 'terminal'
  if (/photography/.test(n))                                return 'camera'
  if (/web3|crypto|blockchain|nft/.test(n))                 return 'cube'
  if (/robotics|hardware|deeptech/.test(n))                 return 'cube'
  if (/climate|energy|sustainability|esg|environment/.test(n)) return 'leaf'
  if (/gaming|esports/.test(n))                             return 'gamepad'
  if (/restaurant|cuisine|food/.test(n))                    return 'utensils'
  if (/beauty|spa|hair|salon/.test(n))                      return 'scissors'
  if (/home.*(repair|improve)|repair|construction/.test(n)) return 'hammer'
  if (/automotive|auto|car/.test(n))                        return 'car'
  if (/active life|recreation|sport|fitness/.test(n))       return 'lightning'
  if (/pet/.test(n))                                        return 'paw'
  if (/wedding|event/.test(n))                              return 'calendar'
  if (/coffee|tea|beverage|bar|nightlife/.test(n))          return 'coffee'
  if (/cleaning|restoration|pest/.test(n))                  return 'flask'
  if (/hotel|lodging|travel/.test(n))                       return 'bed'
  if (/religious|community|civic|center/.test(n))           return 'building'
  if (/real estate|property/.test(n))                       return 'key'
  if (/strategy|management consult|puzzle/.test(n))         return 'briefcase'
  if (/engineering firm|wrench/.test(n))                    return 'wrench'
  if (/accelerator|incubator|program/.test(n))              return 'rocket'
  if (/ecosystem|city|region|map/.test(n))                  return 'map'
  if (/vertical|industries|sector/.test(n))                 return 'layers'
  if (/business model/.test(n))                             return 'grid'
  if (/professional development|coaching/.test(n))          return 'briefcase'

  /* Sector fallbacks — every sector has a sensible default glyph. */
  switch (sectorSlug) {
    case 'ai-ml':                 return 'spark'
    case 'software-saas':         return 'code'
    case 'it-services-agencies':  return 'briefcase'
    case 'startups-innovation':   return 'rocket'
    case 'local-businesses':      return 'shopping-bag'
    case 'professional-services': return 'briefcase'
    default:                      return 'grid'
  }
}

type ActiveDD = 'services' | null

export default function Navbar(
  // Accept (and ignore) prior props for back-compat.
  { hideSearch }: { sectorSlug?: string; hideSearch?: boolean } = {}
) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [activeDD, setActiveDD] = useState<ActiveDD>(null)
  const [activeSector, setActiveSector] = useState<string>(SECTORS[0].slug)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobOpen, setMobOpen] = useState<'services' | null>(null)
  const [mobAuthOpen, setMobAuthOpen] = useState(false)

  const lastY = useRef(0)
  const headerRef = useRef<HTMLElement>(null)
  const { user, logout } = useAuth()

  /* Scroll behaviour — RAF-throttled. */
  useEffect(() => {
    let ticking = false
    const fn = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 4)
        setHidden(y > lastY.current && y > 80)
        lastY.current = y
        ticking = false
      })
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* Body scroll lock for mobile sheet. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* Esc closes anything open. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (searchOpen) setSearchOpen(false)
      else if (activeDD) setActiveDD(null)
      else if (menuOpen) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [searchOpen, activeDD, menuOpen])

  /* Click-outside the header closes any open dropdown. */
  useEffect(() => {
    if (!activeDD) return
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveDD(null)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [activeDD])

  const toggleDD = useCallback((key: NonNullable<ActiveDD>) => {
    setActiveDD(prev => prev === key ? null : key)
  }, [])
  const closeDD = useCallback(() => setActiveDD(null), [])

  const headerCls = [
    'iw-head',
    scrolled && 'iw-head--scrolled',
    hidden && !menuOpen && !activeDD && !searchOpen && 'iw-head--hidden',
  ].filter(Boolean).join(' ')

  const activeL2s = l2sOfSector(activeSector, 10)
  /* Resolve the active sector's palette so the Categories mega can
     paint its right panel + active row in that sector's brand colors.
     Falls back to the first sector if the slug is somehow stale. */
  const activePalette = (SECTORS.find(s => s.slug === activeSector) || SECTORS[0]).palette
  const megaPaletteStyle = {
    ['--sector-c1' as string]: activePalette.c1,
    ['--sector-c2' as string]: activePalette.c2,
    ['--sector-c3' as string]: activePalette.c3,
    ['--sector-c4' as string]: activePalette.c4,
  } as React.CSSProperties

  return (
    <>
      <header className={headerCls} ref={headerRef}>
        {/* ═══ Brand utility strip — desktop-only.
              Left:  tagline + hashtag verbs ("Discover/Compare/Review Companies")
              Right: utility links (Blog · Insights · News · Help · About)
              Hidden under 980px (items resurface inside the mobile sheet). */}
        <div className="iw-util" aria-label="Secondary navigation">
          <div className="iw-util-inner">
            <span className="iw-util-tag">
              Best Global Growth Platform
              <span className="iw-util-tag-sep" aria-hidden="true">·</span>
              <span className="iw-util-hash">#Discover</span>
              <span className="iw-util-hash">#Compare</span>
              <span className="iw-util-hash">#Review</span>
              <span className="iw-util-tag-obj">Companies</span>
            </span>
            <div className="iw-util-links">
              {UTILITY_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="iw-util-link">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="iw-head-inner">
          {/* ── Mobile burger / X toggle — sits before the logo on
                 mobile (per the GoodFirms reference). Hidden via CSS on
                 desktop. Toggles between hamburger and X when the
                 sheet is open. */}
          <button
            type="button"
            className="iw-burger"
            onClick={() => { setMenuOpen(o => !o); setActiveDD(null); setSearchOpen(false) }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <IconX /> : <IconHamburger />}
          </button>

          {/* ── Logo ── */}
          <Link href="/" className="iw-logo" onClick={() => { closeDD(); setMenuOpen(false) }}>
            <img src={`${BASE}/logo/infowebworldlogo-logoforlightbackgrounds.png`} alt="InfoWebWorld" />
          </Link>

          {/* ── Center nav (hidden while search is expanded).
                  Categories opens a mega; Write a Review and Compare Tools
                  are direct links. Resources/Solutions moved to the utility
                  strip above. */}
          {!searchOpen && (
            <nav className="iw-nav" aria-label="Primary">
              <div className="iw-nav-item">
                <button type="button"
                  className={'iw-nav-link' + (activeDD === 'services' ? ' iw-nav-link--active' : '')}
                  onClick={() => toggleDD('services')}
                  aria-expanded={activeDD === 'services'}>
                  Categories <ChevDown />
                </button>
              </div>
              {PRIMARY_LINKS.map(l => (
                <div key={l.href} className="iw-nav-item">
                  <Link
                    href={l.href}
                    className="iw-nav-link"
                    title={l.sub}
                    onClick={closeDD}
                  >
                    {l.label}
                  </Link>
                </div>
              ))}
            </nav>
          )}

          {/* ── Expanded search — direct child of .iw-head-inner so its
                 flex:1 actually wins the row (sibling of .iw-right, not
                 buried inside it). Hidden by default; replaces .iw-nav. */}
          {!hideSearch && searchOpen && (
            <div className="iw-search-expanded">
              <GlobalSearch placeholder="Search businesses, tools, categories" autoFocus />
              <button type="button" className="iw-search-close"
                onClick={() => setSearchOpen(false)} aria-label="Close search">
                <IconX />
              </button>
            </div>
          )}

          {/* ── Right cluster ──
              Desktop order: Search · UserMenu · Get Listed
              Mobile order:  Search · Get Listed
                (UserMenu hidden on mobile, surfaces in the sheet's bottom dock.)
              DOM order = visual order — no flex `order` overrides.
              Write a Review moved into the main nav beside Categories. */}
          <div className="iw-right">
            {!hideSearch && !searchOpen && (
              <button
                type="button"
                className="iw-search-btn"
                onClick={() => { setSearchOpen(true); setActiveDD(null); setMenuOpen(false) }}
                aria-label="Open search"
              >
                <IconSearch />
              </button>
            )}
            <UserMenu />
            <Link href="/business" className="iw-cta">Get Listed</Link>
          </div>
        </div>

        {/* ═══ Categories mega-menu — the only mega surface. ═══ */}
        <div className={'iw-mega' + (activeDD === 'services' ? ' iw-mega--open' : '')}>
          {activeDD === 'services' && (
            <div className="iw-mega-inner iw-mega-inner--svc" style={megaPaletteStyle}>
              <div className="iw-svc-left">
                {/* "All Categories" sits above the sector list as the global
                    escape hatch. Doesn't update activeSector — hovering it
                    leaves the right panel showing the last-active sector. */}
                <Link
                  href="/categories"
                  className="iw-svc-row iw-svc-row--all"
                  onClick={closeDD}
                >
                  <span>All Categories</span>
                  <ChevRight />
                </Link>
                {SECTORS.map(s => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    className={'iw-svc-row' + (activeSector === s.slug ? ' iw-svc-row--on' : '')}
                    onMouseEnter={() => setActiveSector(s.slug)}
                    onClick={closeDD}
                    style={{
                      ['--row-c1' as string]: s.palette.c1,
                      ['--row-c2' as string]: s.palette.c2,
                      ['--row-c4' as string]: s.palette.c4,
                    } as React.CSSProperties}
                  >
                    <span>{s.label}</span>
                    <ChevRight />
                  </Link>
                ))}
              </div>
              <div className="iw-svc-right">
                <div className="iw-svc-grid">
                  {activeL2s.map(c => (
                    <Link
                      key={c.slug}
                      href={`/${activeSector}/${c.slug}`}
                      className="iw-tile"
                      onClick={closeDD}
                    >
                      <span className="iw-tile-ico"><CatIcon k={iconForCategory(c.name, activeSector)} /></span>
                      <span className="iw-tile-name">{c.name}</span>
                    </Link>
                  ))}
                </div>
                <div className="iw-svc-foot">
                  <Link
                    href={`/${activeSector}/view-all-sub-categories-${activeSector}`}
                    className="iw-cta iw-cta--mega"
                    onClick={closeDD}
                  >
                    Explore all categories
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Spacer to offset fixed header — height matches .iw-head */}
      <div className="iw-head-spacer" />

      {/* ═══════ Mobile sheet — drops below the header. ═══════
          Layout:
            - No own top bar (the main header stays put; burger toggles to X).
            - One Categories accordion + a flat "More" list of utility links
              (the same items shown in the desktop dark strip).
            - Bottom dock: "Write a Review" link + "Sign in" outlined button
              (or "Open dashboard" + "Sign out" when authed). */}
      <div className={'iw-mob' + (menuOpen ? ' iw-mob--open' : '')} aria-hidden={!menuOpen}>
        <nav className="iw-mob-nav" aria-label="Mobile navigation">
          {/* ── Services accordion ── */}
          <div className="iw-mob-row">
            <button
              type="button"
              className={'iw-mob-acc' + (mobOpen === 'services' ? ' iw-mob-acc--on' : '')}
              onClick={() => setMobOpen(o => o === 'services' ? null : 'services')}
              aria-expanded={mobOpen === 'services'}
            >
              <span>Categories</span>
              <ChevDown />
            </button>
            <div className={'iw-mob-sub-wrap' + (mobOpen === 'services' ? ' iw-mob-sub-wrap--on' : '')}>
              <ul className="iw-mob-sub">
                <li className="iw-mob-sub-all">
                  <Link href="/categories" onClick={() => setMenuOpen(false)}>
                    All Categories
                  </Link>
                </li>
                {SECTORS.map(s => (
                  <li key={s.slug}>
                    <Link href={`/${s.slug}`} onClick={() => setMenuOpen(false)}>
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Primary direct-link rows — mirror the desktop main nav.
                Same heavy weight as the Categories accordion button so
                they read as siblings, not utility links. */}
          {PRIMARY_LINKS.map(l => (
            <div key={l.href} className="iw-mob-row">
              <Link
                href={l.href}
                className="iw-mob-link"
                onClick={() => setMenuOpen(false)}
              >
                <span>{l.label}</span>
              </Link>
            </div>
          ))}

          {/* ── Flat "More" list — utility links from the desktop strip.
                Plain rows, no accordion (these are direct destinations). */}
          <ul className="iw-mob-util">
            {UTILITY_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setMenuOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Bottom dock — auth actions only. Write a Review moved up
              into the primary nav rows. ── */}
        <div className="iw-mob-foot">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="iw-mob-foot-btn"
                onClick={() => setMenuOpen(false)}
              >
                Open dashboard
              </Link>
              <button
                type="button"
                className="iw-mob-foot-signout"
                onClick={async () => {
                  await logout()
                  setMenuOpen(false)
                  window.location.href = '/'
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              className="iw-mob-foot-btn"
              onClick={() => { setMenuOpen(false); setMobAuthOpen(true) }}
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      <SignupModal
        open={mobAuthOpen}
        onClose={() => setMobAuthOpen(false)}
        initialMode="login"
      />

    </>
  )
}
