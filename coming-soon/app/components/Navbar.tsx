'use client'
import { useState, useEffect, useRef } from 'react'
import Link from './CountryLink'
import { BASE } from '../config/base-path'
import CountrySwitcher from './CountrySwitcher'
import GlobalSearch from './GlobalSearch'

const bp = BASE

/* ═══════════════════════════════════════════
   PillNav-style header — CSS-only animations
   (replaced GSAP to cut ~200KB from bundle)
   ═══════════════════════════════════════════ */

type NavItem = { label: string; href: string; cta?: boolean; comingSoon?: boolean }

const NAV_ITEMS: NavItem[] = [
  { label: 'Categories', href: '/categories' },
  { label: 'Reviews', href: '#', comingSoon: true },
  { label: 'Compare', href: '#', comingSoon: true },
  { label: 'News', href: '#', comingSoon: true },
  { label: 'Get Listed', href: '/business', cta: true },
]

export default function Navbar({ sectorSlug, hideSearch }: { sectorSlug?: string; hideSearch?: boolean } = {}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  /* Intro animation via CSS class */
  const [mounted, setMounted] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setMounted(true)) }, [])

  const openDrawer = () => { setDrawerOpen(true); document.body.style.overflow = 'hidden' }
  const closeDrawer = () => { setDrawerOpen(false); document.body.style.overflow = '' }

  /* Restore body scroll if unmounted while drawer is open */
  useEffect(() => {
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      <header className="pn-header">
        <div className="pn-bar">
          {/* Logo */}
          <Link href="/" className="pn-logo">
            <img src={`${bp}/logo/infowebworldlogo-logoforlightbackgrounds.png`} alt="InfoWebWorld" />
          </Link>

          {/* Nav pills */}
          <div ref={navRef} className={`pn-nav${mounted ? ' pn-nav--ready' : ''}`}>
            <ul className="pn-list">
              {NAV_ITEMS.map((item) => {
                const href = item.label === 'Categories' && sectorSlug
                  ? `/${sectorSlug}/all`
                  : item.href
                return (
                <li key={item.label} className="pn-item">
                  <Link
                    href={href}
                    className={`pn-pill${item.cta ? ' pn-pill--cta' : ''}`}
                  >
                    <span className="pn-circle" aria-hidden="true" />
                    <span className="pn-label-stack">
                      <span className="pn-label">{item.label}</span>
                      <span className="pn-label-hover" aria-hidden="true">{item.label}</span>
                    </span>
                  </Link>
                </li>
              )})}
            </ul>
          </div>

          {/* Right actions — desktop */}
          <div className="pn-actions">
            <Link href="/business" className="pn-biz">iWW for Business</Link>
          </div>

          {/* Country + burger — always visible */}
          <div className="pn-right">
            <CountrySwitcher />
            <button className="pn-burger" aria-label="Menu" onClick={openDrawer}>
              <span className="pn-burger-line" />
              <span className="pn-burger-line" />
            </button>
          </div>
        </div>

        {!hideSearch && <GlobalSearch placeholder="Search businesses, tools, categories" />}
      </header>
      <div className={`pn-spacer${hideSearch ? ' pn-spacer--compact' : ''}`} />

      {/* ══ Mobile drawer ══ */}
      <div className={`pn-overlay${drawerOpen ? ' pn-overlay--open' : ''}`} onClick={closeDrawer} />
      <div className={`pn-drawer${drawerOpen ? ' pn-drawer--open' : ''}`}>
        <div className="pn-drawer-head">
          <Link href="/" className="pn-logo" onClick={closeDrawer}>
            <img src={`${bp}/logo/infowebworldlogo-logoforlightbackgrounds.png`} alt="InfoWebWorld" />
          </Link>
          <button className="pn-drawer-close" aria-label="Close" onClick={closeDrawer}>
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="pn-drawer-body">
          {NAV_ITEMS.map(item => {
            const href = item.label === 'Categories' && sectorSlug
              ? `/${sectorSlug}/all`
              : item.href
            return (
              <Link key={item.label} href={href} className={`pn-drawer-link${item.cta ? ' pn-drawer-link--cta' : ''}`} onClick={closeDrawer}>
                {item.label}
                {item.comingSoon && <span className="pn-drawer-badge">Coming Soon</span>}
              </Link>
            )
          })}
        </div>
        <div className="pn-drawer-foot">
          <Link href="/business" className="pn-drawer-biz" onClick={closeDrawer}>
            iWW for Business
          </Link>
        </div>
      </div>
    </>
  )
}
