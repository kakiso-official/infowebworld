'use client'
import { useState, useEffect, useRef } from 'react'
import Link from '../../../components/CountryLink'
import { BASE } from '../../../config/base-path'
import CountrySwitcher from '../../../components/CountrySwitcher'
import GlobalSearch from '../../../components/GlobalSearch'

const bp = BASE

/* ═══════════════════════════════════════════
   PillNav for /business — anchor links to sections
   CSS-only hover animations (replaced GSAP)
   ═══════════════════════════════════════════ */

type NavItem = { label: string; href: string; cta?: boolean; anchor?: boolean }

const NAV_ITEMS: NavItem[] = [
  { label: 'Why List', href: '#benefits', anchor: true },
  { label: 'Plans', href: '#founding', anchor: true },
  { label: 'Features', href: '#pricing', anchor: true },
  { label: 'Compare', href: '#compare', anchor: true },
  { label: 'Get Listed', href: '/plans', cta: true },
]

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  const [mounted, setMounted] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setMounted(true)) }, [])

  const openDrawer = () => { setDrawerOpen(true); document.body.style.overflow = 'hidden' }
  const closeDrawer = () => { setDrawerOpen(false); document.body.style.overflow = '' }

  useEffect(() => {
    return () => { document.body.style.overflow = '' }
  }, [])

  /* Smooth scroll for anchor links */
  const handleClick = (e: React.MouseEvent, href: string, isAnchor?: boolean) => {
    if (!isAnchor) return
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (drawerOpen) closeDrawer()
  }

  return (
    <>
      <header className="pn-header">
        <div className="pn-bar">
          <Link href="/" className="pn-logo">
            <img src={`${bp}/logo/infowebworldlogo-logoforlightbackgrounds.png`} alt="InfoWebWorld" />
          </Link>

          <div ref={navRef} className={`pn-nav${mounted ? ' pn-nav--ready' : ''}`}>
            <ul className="pn-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.label} className="pn-item">
                  {item.cta ? (
                    <Link href={item.href} className="pn-pill pn-pill--cta">
                      <span className="pn-circle" aria-hidden="true" />
                      <span className="pn-label-stack">
                        <span className="pn-label">{item.label}</span>
                        <span className="pn-label-hover" aria-hidden="true">{item.label}</span>
                      </span>
                    </Link>
                  ) : (
                    <a href={item.href} className="pn-pill" onClick={e => handleClick(e, item.href, item.anchor)}>
                      <span className="pn-circle" aria-hidden="true" />
                      <span className="pn-label-stack">
                        <span className="pn-label">{item.label}</span>
                        <span className="pn-label-hover" aria-hidden="true">{item.label}</span>
                      </span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="pn-actions">
            <Link href="/business" className="pn-biz">iWW for Business</Link>
          </div>

          <div className="pn-right">
            <CountrySwitcher />
            <button className="pn-burger" aria-label="Menu" onClick={openDrawer}>
              <span className="pn-burger-line" />
              <span className="pn-burger-line" />
            </button>
          </div>
        </div>

        <GlobalSearch placeholder="Search tools, services, listings" />
      </header>
      <div className="pn-spacer" />

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
          {NAV_ITEMS.filter(item => !item.cta).map(item => (
            <a key={item.label} href={item.href} className="pn-drawer-link" onClick={e => handleClick(e, item.href, item.anchor)}>
              {item.label}
            </a>
          ))}
          <Link href="/plans" className="pn-drawer-link pn-drawer-link--cta" onClick={closeDrawer}>
            Get Listed
          </Link>
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
