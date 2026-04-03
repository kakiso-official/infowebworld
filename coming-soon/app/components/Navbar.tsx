'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from './CountryLink'
import { BASE } from '../config/base-path'
import CountrySwitcher from './CountrySwitcher'
import { gsap } from 'gsap'
import GlobalSearch from './GlobalSearch'

const bp = BASE

/* ═══════════════════════════════════════════
   PillNav-style header — dark pill bar
   ═══════════════════════════════════════════ */

type NavItem = { label: string; href: string; cta?: boolean; comingSoon?: boolean }

const NAV_ITEMS: NavItem[] = [
  { label: 'Categories', href: '/categories' },
  { label: 'Reviews', href: '#', comingSoon: true },
  { label: 'Compare', href: '#', comingSoon: true },
  { label: 'News', href: '#', comingSoon: true },
  { label: 'Get Listed', href: '/business', cta: true },
]

type Sector = { label: string; slug: string; color: string }
const SECTORS_LEFT: Sector[] = [
  { label: 'Artificial Intelligence & ML', slug: 'artificial-intelligence-ml', color: '#8B5CF6' },
  { label: 'Software & SaaS', slug: 'software-saas', color: '#3B82F6' },
  { label: 'Startups & Innovation', slug: 'startups-innovation', color: '#E8553D' },
]
const SECTORS_RIGHT: Sector[] = [
  { label: 'IT Services & Agencies', slug: 'it-services-agencies', color: '#14B8A6' },
  { label: 'Local Business', slug: 'local-business', color: '#F59E0B' },
  { label: 'Professional Services', slug: 'professional-services', color: '#2FAE6A' },
]

export default function Navbar({ sectorSlug }: { sectorSlug?: string } = {}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([])
  const tlRefs = useRef<gsap.core.Timeline[]>([])
  const tweenRefs = useRef<gsap.core.Tween[]>([])
  const secCircleRefs = useRef<(HTMLSpanElement | null)[]>([])
  const secTlRefs = useRef<gsap.core.Timeline[]>([])
  const secTweenRefs = useRef<gsap.core.Tween[]>([])
  const navRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)

  /* ── Shared: build GSAP timeline for a circle pill ── */
  const buildPillTl = useCallback((circle: HTMLSpanElement, tls: gsap.core.Timeline[], i: number) => {
    const pill = circle.parentElement
    if (!pill) return
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

    tls[i]?.kill()
    const tl = gsap.timeline({ paused: true })
    tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: 'power3.out', overwrite: 'auto' }, 0)
    if (label) tl.to(label, { y: -(h + 8), duration: 2, ease: 'power3.out', overwrite: 'auto' }, 0)
    if (hover) {
      gsap.set(hover, { y: Math.ceil(h + 100), opacity: 0 })
      tl.to(hover, { y: 0, opacity: 1, duration: 2, ease: 'power3.out', overwrite: 'auto' }, 0)
    }
    tls[i] = tl
  }, [])

  /* ── Layout all circles on mount + resize ── */
  const layout = useCallback(() => {
    circleRefs.current.forEach((c, i) => c && buildPillTl(c, tlRefs.current, i))
    secCircleRefs.current.forEach((c, i) => c && buildPillTl(c, secTlRefs.current, i))
  }, [buildPillTl])

  useEffect(() => {
    layout()
    window.addEventListener('resize', layout)
    document.fonts?.ready?.then(layout).catch(() => {})

    /* Intro animation */
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
  const secEnter = (i: number) => {
    const tl = secTlRefs.current[i]
    if (!tl) return
    secTweenRefs.current[i]?.kill()
    secTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease: 'power3.out', overwrite: 'auto' })
  }
  const secLeave = (i: number) => {
    const tl = secTlRefs.current[i]
    if (!tl) return
    secTweenRefs.current[i]?.kill()
    secTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease: 'power3.out', overwrite: 'auto' })
  }


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
            <img ref={logoRef} src={`${bp}/logo/infowebworldlogo-logoforlightbackgrounds.png`} alt="InfoWebWorld" />
          </Link>

          {/* Nav pills */}
          <div ref={navRef} className="pn-nav">
            <ul className="pn-list">
              {NAV_ITEMS.map((item, i) => {
                const href = item.label === 'Categories' && sectorSlug
                  ? `/category/${sectorSlug}/all`
                  : item.href
                return (
                <li key={item.label} className="pn-item">
                  <Link
                    href={href}
                    className={`pn-pill${item.cta ? ' pn-pill--cta' : ''}`}
                    onMouseEnter={() => enter(i)}
                    onMouseLeave={() => leave(i)}
                  >
                    <span
                      className="pn-circle"
                      ref={el => { circleRefs.current[i] = el }}
                      aria-hidden="true"
                    />
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

        {/* Search row with sector pills — commented out for now
        <div className="pn-search-row">
          <div className="pn-sectors pn-sectors--left">
            {SECTORS_LEFT.map((s, i) => (
              <Link
                key={s.slug}
                href={`/category/${s.slug}`}
                className="pn-sec"
                style={{ '--sec-c': s.color } as React.CSSProperties}
                onMouseEnter={() => secEnter(i)}
                onMouseLeave={() => secLeave(i)}
              >
                <span
                  className="pn-circle pn-circle--sec"
                  ref={el => { secCircleRefs.current[i] = el }}
                  aria-hidden="true"
                />
                <span className="pn-label-stack">
                  <span className="pn-label">{s.label}</span>
                  <span className="pn-label-hover" aria-hidden="true">{s.label}</span>
                </span>
              </Link>
            ))}
          </div>
          <div className="pn-sectors pn-sectors--right">
            {SECTORS_RIGHT.map((s, i) => (
              <Link
                key={s.slug}
                href={`/category/${s.slug}`}
                className="pn-sec"
                style={{ '--sec-c': s.color } as React.CSSProperties}
                onMouseEnter={() => secEnter(i + 3)}
                onMouseLeave={() => secLeave(i + 3)}
              >
                <span
                  className="pn-circle pn-circle--sec"
                  ref={el => { secCircleRefs.current[i + 3] = el }}
                  aria-hidden="true"
                />
                <span className="pn-label-stack">
                  <span className="pn-label">{s.label}</span>
                  <span className="pn-label-hover" aria-hidden="true">{s.label}</span>
                </span>
              </Link>
            ))}
          </div>
        </div> */}
        <GlobalSearch placeholder="Search businesses, tools, categories" />
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
          {NAV_ITEMS.map(item => {
            const href = item.label === 'Categories' && sectorSlug
              ? `/category/${sectorSlug}/all`
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
