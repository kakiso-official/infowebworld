'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from '../../../components/CountryLink'
import { BASE } from '../../../config/base-path'
import CountrySwitcher from '../../../components/CountrySwitcher'
import { gsap } from 'gsap'
import GlobalSearch from '../../../components/GlobalSearch'

const bp = BASE

/* ═══════════════════════════════════════════
   PillNav for /business — anchor links to sections
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
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([])
  const tlRefs = useRef<gsap.core.Timeline[]>([])
  const tweenRefs = useRef<gsap.core.Tween[]>([])
  const navRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)

  const layout = useCallback(() => {
    circleRefs.current.forEach((circle, i) => {
      if (!circle?.parentElement) return
      const pill = circle.parentElement
      const { width: w, height: h } = pill.getBoundingClientRect()
      const R = ((w * w) / 4 + h * h) / (2 * h)
      const D = Math.ceil(2 * R) + 2
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
      const originY = D - delta

      circle.style.width = `${D}px`
      circle.style.height = `${D}px`
      circle.style.bottom = `-${delta}px`

      gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` })

      const label = pill.querySelector<HTMLElement>('.pn-label')
      const hover = pill.querySelector<HTMLElement>('.pn-label-hover')
      if (label) gsap.set(label, { y: 0 })
      if (hover) gsap.set(hover, { y: h + 12, opacity: 0 })

      tlRefs.current[i]?.kill()
      const tl = gsap.timeline({ paused: true })
      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: 'power3.out', overwrite: 'auto' }, 0)
      if (label) tl.to(label, { y: -(h + 8), duration: 2, ease: 'power3.out', overwrite: 'auto' }, 0)
      if (hover) {
        gsap.set(hover, { y: Math.ceil(h + 100), opacity: 0 })
        tl.to(hover, { y: 0, opacity: 1, duration: 2, ease: 'power3.out', overwrite: 'auto' }, 0)
      }
      tlRefs.current[i] = tl
    })
  }, [])

  useEffect(() => {
    layout()
    window.addEventListener('resize', layout)
    document.fonts?.ready?.then(layout).catch(() => {})

    if (navRef.current) {
      gsap.set(navRef.current, { width: 0, overflow: 'hidden' })
      gsap.to(navRef.current, { width: 'auto', duration: 0.6, ease: 'power3.out' })
    }

    return () => window.removeEventListener('resize', layout)
  }, [layout])

  const enter = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    tweenRefs.current[i]?.kill()
    tweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease: 'power3.out', overwrite: 'auto' })
  }
  const leave = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    tweenRefs.current[i]?.kill()
    tweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease: 'power3.out', overwrite: 'auto' })
  }


  const openDrawer = () => { setDrawerOpen(true); document.body.style.overflow = 'hidden' }
  const closeDrawer = () => { setDrawerOpen(false); document.body.style.overflow = '' }

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
            <img ref={logoRef} src={`${bp}/logo/infowebworldlogo-logoforlightbackgrounds.png`} alt="InfoWebWorld" />
          </Link>

          <div ref={navRef} className="pn-nav">
            <ul className="pn-list">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.label} className="pn-item">
                  {item.cta ? (
                    <Link
                      href={item.href}
                      className="pn-pill pn-pill--cta"
                      onMouseEnter={() => enter(i)}
                      onMouseLeave={() => leave(i)}
                    >
                      <span className="pn-circle" ref={el => { circleRefs.current[i] = el }} aria-hidden="true" />
                      <span className="pn-label-stack">
                        <span className="pn-label">{item.label}</span>
                        <span className="pn-label-hover" aria-hidden="true">{item.label}</span>
                      </span>
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="pn-pill"
                      onClick={e => handleClick(e, item.href, item.anchor)}
                      onMouseEnter={() => enter(i)}
                      onMouseLeave={() => leave(i)}
                    >
                      <span className="pn-circle" ref={el => { circleRefs.current[i] = el }} aria-hidden="true" />
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

        {/* Search row */}
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
            <a
              key={item.label}
              href={item.href}
              className="pn-drawer-link"
              onClick={e => handleClick(e, item.href, item.anchor)}
            >
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
