'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from '../../../components/CountryLink'
import { BASE } from '../../../config/base-path'
import CountrySwitcher from '../../../components/CountrySwitcher'
import GlobalSearch from '../../../components/GlobalSearch'

/* ═══════════════════════════════════════════
   Header for /business — anchor links to page sections
   Matches main header design (nh-* classes)
   ═══════════════════════════════════════════ */

type NavItem = { label: string; href: string; cta?: boolean; anchor?: boolean }

const NAV_ITEMS: NavItem[] = [
  { label: 'Why List', href: '#benefits', anchor: true },
  { label: 'Plans',    href: '#founding', anchor: true },
  { label: 'Features', href: '#pricing', anchor: true },
  { label: 'Compare',  href: '#compare', anchor: true },
  { label: 'Get Listed', href: '/business/plans', cta: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY
      setScrolled(y > 10)
      setHidden(y > lastY.current && y > 80)
      lastY.current = y
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const toggleMenu = () => {
    setMenuOpen(m => !m)
  }

  /* Smooth scroll for anchor links */
  const handleAnchor = (e: React.MouseEvent, href: string, isAnchor?: boolean) => {
    if (!isAnchor) return
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (menuOpen) setMenuOpen(false)
  }

  const cls = [
    'nh',
    scrolled && 'nh--glass',
    hidden && !menuOpen && 'nh--hidden',
  ].filter(Boolean).join(' ')

  return (
    <>
      <header className={cls}>
        {/* Row 1 — Logo | Search (center) | Actions */}
        <div className="nh-row-top">
          <Link href="/" className="nh-logo">
            <img src={`${BASE}/logo/infowebworldlogo-logoforlightbackgrounds.png`} alt="InfoWebWorld" />
          </Link>

          <div className="nh-search-inline">
            <GlobalSearch placeholder="Search tools, services, listings" />
          </div>

          <div className="nh-actions">
            <CountrySwitcher />
            <Link href="/business/plans" className="nh-cta">
              <span>Get Listed</span>
              <svg className="nh-cta-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <button className="nh-burger" onClick={toggleMenu}
              aria-label="Menu" aria-expanded={menuOpen} type="button">
              <span className={`nh-burger-bars${menuOpen ? ' nh-burger-bars--x' : ''}`}>
                <span /><span />
              </span>
            </button>
          </div>
        </div>

        {/* Row 2 — Anchor nav links */}
        <nav className="nh-row-sub" aria-label="Main">
          {NAV_ITEMS.filter(i => !i.cta).map(item => (
            <a key={item.label} href={item.href} className="nh-link"
              onClick={e => handleAnchor(e, item.href, item.anchor)}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      {/* Spacer */}
      <div className="nh-spacer" />

      {/* ═══ Mobile menu ═══ */}
      <div className={`nh-mob-bg${menuOpen ? ' nh-mob-bg--on' : ''}`} onClick={closeMenu} />
      <nav className={`nh-mob${menuOpen ? ' nh-mob--open' : ''}`} aria-label="Mobile">
        <div className="nh-mob-head">
          <Link href="/" className="nh-logo" onClick={closeMenu}>
            <img src={`${BASE}/logo/infowebworldlogo-logoforlightbackgrounds.png`} alt="InfoWebWorld" />
          </Link>
          <button className="nh-mob-close" onClick={closeMenu} aria-label="Close" type="button">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="nh-mob-body">
          {NAV_ITEMS.filter(i => !i.cta).map((item, i) => (
            <a key={item.label} href={item.href}
              className="nh-mob-link"
              onClick={e => handleAnchor(e, item.href, item.anchor)}
              style={menuOpen ? { animationDelay: `${i * 60}ms` } : undefined}>
              {item.label}
            </a>
          ))}
          <Link href="/business/plans" className="nh-mob-link nh-mob-link--cta" onClick={closeMenu}
            style={menuOpen ? { animationDelay: `${4 * 60}ms` } : undefined}>
            Get Listed
          </Link>
        </div>
        <div className="nh-mob-foot">
          <Link href="/business" className="nh-mob-biz" onClick={closeMenu}>
            iWW for Business
          </Link>
          <div className="nh-mob-country"><CountrySwitcher /></div>
        </div>
      </nav>
    </>
  )
}
