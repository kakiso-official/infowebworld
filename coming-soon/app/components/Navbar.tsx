'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const bp = ''

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
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="container nav-inner">
          <a href="#" className="nav-logo">
            <img src={`${bp}/logo/infowebworld-logo.png`} alt="InfoWebWorld" />
          </a>
          <div className="nav-links">
            <a href="#benefits" className="nav-link">Benefits</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#compare" className="nav-link">Compare</a>
          </div>
          <div className="nav-right">
            <Link href="/get-listed" className="nav-cta">Get Listed</Link>
            <button className="nav-mobile-toggle" aria-label="Menu" onClick={open}>
              <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-mobile-overlay${drawerOpen ? ' open' : ''}`} onClick={close} />
      <div className={`nav-mobile-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="nav-mobile-header">
          <a href="#" className="nav-logo">
            <img src={`${bp}/logo/infowebworld-logo.png`} alt="InfoWebWorld" />
          </a>
          <button className="nav-mobile-close" aria-label="Close menu" onClick={close}>
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="nav-mobile-body">
          <a href="#benefits" className="nav-mobile-link" onClick={close}>Benefits</a>
          <a href="#pricing" className="nav-mobile-link" onClick={close}>Pricing</a>
          <a href="#how-it-works" className="nav-mobile-link" onClick={close}>How It Works</a>
          <a href="#compare" className="nav-mobile-link" onClick={close}>Compare</a>
        </div>
        <div className="nav-mobile-footer">
          <a href="#hero" className="nav-cta" onClick={close}>Join Waitlist</a>
        </div>
      </div>
    </>
  )
}
