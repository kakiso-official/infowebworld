'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BASE } from '../config/base-path'

const bp = BASE

/* ── Sparkle SVG icon (used in Coming Soon tooltips) ── */
const Sparkle = () => (
  <svg viewBox="0 0 24 24" className="hd-cs-star">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
)

/* ── Wrapper that shows a "Coming Soon" tooltip on hover ── */
const CsWrap = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`hd-cs-wrap${className ? ` ${className}` : ''}`}>
    {children}
    <div className="hd-cs-tip">
      <div className="hd-cs-pill">
        <Sparkle />
        <span>Coming Soon</span>
      </div>
    </div>
  </div>
)

/* ── Sub-nav item with Coming Soon tooltip ── */
const NavItem = ({ label }: { label: string }) => (
  <CsWrap>
    <button type="button" className="hd-sub-link">{label}</button>
  </CsWrap>
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const open = () => { setDrawerOpen(true); document.body.style.overflow = 'hidden' }
  const close = () => { setDrawerOpen(false); document.body.style.overflow = '' }

  return (
    <>
      <header className={`hd${scrolled ? ' hd--scrolled' : ''}`}>
        {/* ══ Row 1: Logo | Search | Login | iWW for Business ══ */}
        <div className="hd-top">
          <div className="container hd-top-inner">
            <Link href="/" className="hd-logo">
              <img src={`${bp}/logo/infowebworld-logo.png`} alt="InfoWebWorld" />
            </Link>

            <div className="hd-actions">
              <CsWrap>
                <button type="button" className="hd-search-btn" aria-label="Search">
                  <svg viewBox="0 0 24 24" className="hd-search-ic">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
              </CsWrap>
              <CsWrap>
                <button type="button" className="hd-login">
                  <svg viewBox="0 0 24 24" className="hd-login-ic">
                    <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                  Log in
                </button>
              </CsWrap>
              <Link href="/business" className="hd-biz">iWW for Business</Link>
            </div>

            <button className="hd-burger" aria-label="Menu" onClick={open}>
              <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
          </div>
        </div>

        {/* ══ Row 2: Categories | Write a Review | Compare | Deals | News | Get Listed ══ */}
        <div className="hd-sub">
          <div className="container hd-sub-inner">
            <NavItem label="Categories" />
            <NavItem label="Write a Review" />
            <NavItem label="Compare" />
            <NavItem label="News" />
            <Link href="/business" className="hd-sub-cta">
              Get Listed
              <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </header>

      {/* ══ Mobile overlay + drawer ══ */}
      <div className={`hd-overlay${drawerOpen ? ' hd-overlay--open' : ''}`} onClick={close} />
      <div className={`hd-drawer${drawerOpen ? ' hd-drawer--open' : ''}`}>
        <div className="hd-drawer-head">
          <Link href="/" className="hd-logo" onClick={close}>
            <img src={`${bp}/logo/infowebworld-logo.png`} alt="InfoWebWorld" />
          </Link>
          <button className="hd-drawer-close" aria-label="Close" onClick={close}>
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="hd-drawer-body">
          <div className="hd-drawer-link">Search<span className="hd-cs-badge">Coming Soon</span></div>
          <div className="hd-drawer-link">Categories<span className="hd-cs-badge">Coming Soon</span></div>
          <div className="hd-drawer-link">Write a Review<span className="hd-cs-badge">Coming Soon</span></div>
          <div className="hd-drawer-link">Compare<span className="hd-cs-badge">Coming Soon</span></div>
          <div className="hd-drawer-link">News<span className="hd-cs-badge">Coming Soon</span></div>
          <div className="hd-drawer-sep" />
          <div className="hd-drawer-link">Log in<span className="hd-cs-badge">Coming Soon</span></div>
          
        </div>

        <div className="hd-drawer-foot">
          <Link href="/business" className="hd-sub-cta hd-sub-cta--full" onClick={close}>
            Get Listed
            <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </>
  )
}
