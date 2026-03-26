'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BASE } from '../../config/base-path'

const bp = BASE

/* ── Sparkle SVG icon (used in Coming Soon tooltips) ── */
const Sparkle = () => (
  <svg viewBox="0 0 24 24" className="ghd-cs-star">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
)

/* ── Wrapper that shows a "Coming Soon" tooltip on hover ── */
const CsWrap = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`ghd-cs-wrap${className ? ` ${className}` : ''}`}>
    {children}
    <div className="ghd-cs-tip">
      <div className="ghd-cs-pill">
        <Sparkle />
        <span>Coming Soon</span>
      </div>
    </div>
  </div>
)

/* ── Sub-nav item with Coming Soon tooltip ── */
const NavItem = ({ label }: { label: string }) => (
  <CsWrap>
    <button type="button" className="ghd-sub-link">{label}</button>
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
      <header className={`ghd${scrolled ? ' ghd--scrolled' : ''}`}>
        {/* ══ Row 1: Logo | Search | Login | IWW for Businesses ══ */}
        <div className="ghd-top">
          <div className="container ghd-top-inner">
            <Link href="/" className="ghd-logo">
              <img src={`${bp}/logo/infowebworld-logo.png`} alt="InfoWebWorld" />
            </Link>

            <div className="ghd-actions">
              <CsWrap>
                <button type="button" className="ghd-search-btn" aria-label="Search">
                  <svg viewBox="0 0 24 24" className="ghd-search-ic">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
              </CsWrap>
              <CsWrap>
                <button type="button" className="ghd-login">
                  <svg viewBox="0 0 24 24" className="ghd-login-ic">
                    <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                  Log in
                </button>
              </CsWrap>
              <CsWrap>
                <button type="button" className="ghd-biz">IWW for Businesses</button>
              </CsWrap>
            </div>

            <button className="ghd-burger" aria-label="Menu" onClick={open}>
              <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
          </div>
        </div>

        {/* ══ Row 2: Categories | Write a Review | Compare | Deals | News | Get Listed ══ */}
        <div className="ghd-sub">
          <div className="container ghd-sub-inner">
            <NavItem label="Categories" />
            <NavItem label="Write a Review" />
            <NavItem label="Compare" />
            <NavItem label="News" />
            <Link href="/business" className="ghd-sub-cta">
              Get Listed
              <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </header>

      {/* ══ Mobile overlay + drawer ══ */}
      <div className={`ghd-overlay${drawerOpen ? ' ghd-overlay--open' : ''}`} onClick={close} />
      <div className={`ghd-drawer${drawerOpen ? ' ghd-drawer--open' : ''}`}>
        <div className="ghd-drawer-head">
          <Link href="/" className="ghd-logo" onClick={close}>
            <img src={`${bp}/logo/infowebworld-logo.png`} alt="InfoWebWorld" />
          </Link>
          <button className="ghd-drawer-close" aria-label="Close" onClick={close}>
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="ghd-drawer-body">
          <div className="ghd-drawer-link">Search<span className="ghd-cs-badge">Coming Soon</span></div>
          <div className="ghd-drawer-link">Categories<span className="ghd-cs-badge">Coming Soon</span></div>
          <div className="ghd-drawer-link">Write a Review<span className="ghd-cs-badge">Coming Soon</span></div>
          <div className="ghd-drawer-link">Compare<span className="ghd-cs-badge">Coming Soon</span></div>
          <div className="ghd-drawer-link">News<span className="ghd-cs-badge">Coming Soon</span></div>
          <div className="ghd-drawer-sep" />
          <div className="ghd-drawer-link">Log in<span className="ghd-cs-badge">Coming Soon</span></div>
          <div className="ghd-drawer-link">iWW for Business<span className="ghd-cs-badge">Coming Soon</span></div>
        </div>

        <div className="ghd-drawer-foot">
          <Link href="/business" className="ghd-sub-cta ghd-sub-cta--full" onClick={close}>
            Get Listed
            <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </>
  )
}
