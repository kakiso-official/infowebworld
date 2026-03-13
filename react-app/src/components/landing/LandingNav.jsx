import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function LandingNav() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setDrawerOpen(false); document.body.style.overflow = '' }, [location])

  const open = () => { setDrawerOpen(true); document.body.style.overflow = 'hidden' }
  const close = () => { setDrawerOpen(false); document.body.style.overflow = '' }

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="container nav-inner">
          <Link to="/" className="nav-logo">
            <img src="/logo/infowebworld-logo.png" alt="InfoWebWorld" style={{height:'180px',width:'auto'}} />
          </Link>
          <div className="nav-links">
            <div className="mega-menu-wrapper">
              <Link to="/category" className="nav-link nav-link--has-menu">
                Categories <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
              </Link>
              <div className="mega-menu">
                <Link to="/category?cat=technology-saas" className="mega-item"><span className="mega-item-icon" style={{background:'rgba(108,114,241,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--accent)"><path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" /></svg></span><div><div className="mega-item-text">Technology &amp; SaaS</div><div className="mega-item-count">520+ listings</div></div></Link>
                <Link to="/category?cat=restaurants-food" className="mega-item"><span className="mega-item-icon" style={{background:'rgba(239,107,74,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--coral)"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></svg></span><div><div className="mega-item-text">Restaurants &amp; Food</div><div className="mega-item-count">480+ listings</div></div></Link>
                <Link to="/category?cat=healthcare-wellness" className="mega-item"><span className="mega-item-icon" style={{background:'rgba(47,174,106,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--emerald)"><path d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" /><path d="M12 6v4" /><path d="M10 8h4" /></svg></span><div><div className="mega-item-text">Healthcare &amp; Wellness</div><div className="mega-item-count">390+ listings</div></div></Link>
                <Link to="/category?cat=real-estate" className="mega-item"><span className="mega-item-icon" style={{background:'rgba(59,130,246,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--azure)"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg></span><div><div className="mega-item-text">Real Estate &amp; Property</div><div className="mega-item-count">350+ listings</div></div></Link>
                <Link to="/category?cat=legal-financial" className="mega-item"><span className="mega-item-icon" style={{background:'rgba(139,92,246,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--plum)"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /><path d="M12 12v2" /></svg></span><div><div className="mega-item-text">Legal &amp; Financial</div><div className="mega-item-count">310+ listings</div></div></Link>
                <Link to="/category?cat=education-training" className="mega-item"><span className="mega-item-icon" style={{background:'rgba(20,184,166,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--teal)"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" /></svg></span><div><div className="mega-item-text">Education &amp; Training</div><div className="mega-item-count">280+ listings</div></div></Link>
                <Link to="/category?cat=marketing-creative" className="mega-item"><span className="mega-item-icon" style={{background:'rgba(236,72,153,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--rose)"><path d="M3 11l18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg></span><div><div className="mega-item-text">Marketing &amp; Creative</div><div className="mega-item-count">420+ listings</div></div></Link>
                <Link to="/category?cat=home-services" className="mega-item"><span className="mega-item-icon" style={{background:'rgba(245,158,11,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--amber)"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg></span><div><div className="mega-item-text">Home Services &amp; Trades</div><div className="mega-item-count">360+ listings</div></div></Link>
              </div>
            </div>
            <Link to="/best-of" className="nav-link">Featured</Link>
            <Link to="/news" className="nav-link">News</Link>
            <Link to="/pricing" className="nav-link">Pricing</Link>
          </div>
          <div className="nav-right">
            <Link to="/search" className="nav-search-btn" aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg></Link>
            <Link to="/signin" className="nav-signin">Sign in</Link>
            <Link to="/submit-listing" className="nav-cta">Get Listed</Link>
            <button className="nav-mobile-toggle" aria-label="Menu" onClick={open}><svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg></button>
          </div>
        </div>
      </nav>
      <div className={`nav-mobile-overlay${drawerOpen ? ' open' : ''}`} id="nav-overlay" onClick={close}></div>
      <div className={`nav-mobile-drawer${drawerOpen ? ' open' : ''}`} id="nav-drawer">
        <div className="nav-mobile-header">
          <Link to="/" className="nav-logo"><img src="/logo/infowebworld-logo.png" alt="InfoWebWorld" style={{height:'140px',width:'auto'}} /></Link>
          <button className="nav-mobile-close" aria-label="Close menu" onClick={close}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
        </div>
        <div className="nav-mobile-body">
          <Link to="/search" className="nav-mobile-link">Search</Link>
          <Link to="/best-of" className="nav-mobile-link">Featured</Link>
          <Link to="/news" className="nav-mobile-link">News</Link>
          <Link to="/pricing" className="nav-mobile-link">Pricing</Link>
          <div className="nav-mobile-label">Browse Categories</div>
          <Link to="/category?cat=technology-saas" className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(108,114,241,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--accent)"><path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" /></svg></span>Technology &amp; SaaS</Link>
          <Link to="/category?cat=restaurants-food" className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(239,107,74,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--coral)"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></svg></span>Restaurants &amp; Food</Link>
          <Link to="/category?cat=healthcare-wellness" className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(47,174,106,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--emerald)"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></span>Healthcare &amp; Wellness</Link>
          <Link to="/category?cat=real-estate" className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(59,130,246,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--azure)"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg></span>Real Estate &amp; Property</Link>
          <Link to="/category?cat=legal-financial" className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(139,92,246,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--plum)"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></svg></span>Legal &amp; Financial</Link>
          <Link to="/category?cat=marketing-creative" className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(236,72,153,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--rose)"><path d="M3 11l18-5v12L3 13v-2z" /></svg></span>Marketing &amp; Creative</Link>
          <Link to="/category?cat=home-services" className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(245,158,11,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--amber)"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg></span>Home Services &amp; Trades</Link>
          <Link to="/category?cat=education-training" className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(20,184,166,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--teal)"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg></span>Education &amp; Training</Link>
        </div>
        <div className="nav-mobile-footer">
          <Link to="/signin" className="nav-signin">Sign in</Link>
          <Link to="/submit-listing" className="nav-cta">Get Listed</Link>
        </div>
      </div>
    </>
  )
}
