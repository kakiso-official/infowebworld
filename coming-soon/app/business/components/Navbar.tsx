'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { BASE } from '../../config/base-path'

/* ═══════════════════════════════════════════
   Compact single-row business header — used identically on /business and
   /business/plans. No search bar; the four section anchors sit inline next
   to the logo, with the "Get Listed" CTA pinned to the right.
   ═══════════════════════════════════════════ */

type NavItem = { label: string; href: string; anchor?: boolean }

const NAV_ITEMS: NavItem[] = [
  { label: 'Why List', href: '#benefits',  anchor: true },
  { label: 'Plans',    href: '#founding',  anchor: true },
  { label: 'Features', href: '#pricing',   anchor: true },
  { label: 'Compare',  href: '#compare',   anchor: true },
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

  /* Smooth scroll for anchor links. Anchors only live on /business — on
     /business/plans they're rendered as ordinary links to /business#section. */
  const handleAnchor = (e: React.MouseEvent, href: string, isAnchor?: boolean) => {
    if (!isAnchor) return
    const el = typeof document !== 'undefined' ? document.querySelector(href) : null
    if (el) {
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (menuOpen) setMenuOpen(false)
    }
    // No matching anchor on the current page → let the browser navigate
    // (e.g. from /business/plans → /business#founding). We rewrite the href
    // below in renderLink so this works.
  }

  /** On /business/plans the section anchors don't exist on this page — point
   *  them at /business#anchor instead so the browser navigates back to the
   *  landing page and scrolls. */
  const linkHref = (item: NavItem) => {
    if (typeof window === 'undefined') return item.href
    if (window.location.pathname.startsWith('/business/plans') && item.anchor) {
      return `/business${item.href}`
    }
    return item.href
  }

  const cls = [
    'nh',
    'nh--biz',
    scrolled && 'nh--glass',
    hidden && !menuOpen && 'nh--hidden',
  ].filter(Boolean).join(' ')

  return (
    <>
      <header className={cls}>
        {/* Single row — Logo | Inline nav links | Get Listed CTA */}
        <div className="nh-biz-row">
          <Link href="/" className="nh-logo">
            <img src={`${BASE}/logo/infowebworldlogo-logoforlightbackgrounds.png`} alt="InfoWebWorld" />
          </Link>

          <nav className="nh-biz-nav" aria-label="Main">
            {NAV_ITEMS.map(item => (
              <a key={item.label} href={linkHref(item)} className="nh-link"
                onClick={e => handleAnchor(e, item.href, item.anchor)}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nh-actions">
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
      </header>

      {/* Spacer — single-row business header is shorter than the default. */}
      <div className="nh-spacer nh-spacer--biz" />

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
          {NAV_ITEMS.map((item, i) => (
            <a key={item.label} href={linkHref(item)}
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
        </div>
      </nav>
    </>
  )
}
