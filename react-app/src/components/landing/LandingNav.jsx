import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

/* ── Search suggestions database ── */
const allSuggestions = [
  { name: 'CloudSync Pro', cat: 'Technology', rating: '4.9', color: 'var(--accent)', icon: <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /> },
  { name: 'The Garden Table', cat: 'Restaurant', rating: '4.9', color: 'var(--coral)', icon: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /></> },
  { name: 'MindBridge Wellness', cat: 'Healthcare', rating: '4.8', color: 'var(--emerald)', icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" /> },
  { name: 'BrightPath Academy', cat: 'Education', rating: '4.8', color: 'var(--teal)', icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></> },
  { name: 'UrbanNest Realty', cat: 'Real Estate', rating: '4.7', color: 'var(--azure)', icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></> },
  { name: 'PrecisionFix Plumbing', cat: 'Home Services', rating: '4.9', color: 'var(--amber)', icon: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /> },
  { name: 'Summit Legal Group', cat: 'Legal', rating: '4.7', color: 'var(--plum)', icon: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></> },
  { name: 'CreativeForge Studio', cat: 'Marketing', rating: '4.7', color: 'var(--rose)', icon: <><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /></> },
  { name: 'NovaByte Analytics', cat: 'Technology', rating: '4.8', color: 'var(--accent)', icon: <><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></> },
  { name: 'FreshBite Catering', cat: 'Restaurant', rating: '4.8', color: 'var(--coral)', icon: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /></> },
]

const categorySuggestions = [
  { name: 'Technology & SaaS', slug: 'technology', color: 'var(--accent)' },
  { name: 'Restaurants & Food', slug: 'restaurants', color: 'var(--coral)' },
  { name: 'Healthcare & Wellness', slug: 'healthcare', color: 'var(--emerald)' },
  { name: 'Real Estate', slug: 'real-estate', color: 'var(--azure)' },
  { name: 'Home Services', slug: 'home-services', color: 'var(--amber)' },
  { name: 'Education & Training', slug: 'education', color: 'var(--teal)' },
  { name: 'Legal & Financial', slug: 'legal', color: 'var(--plum)' },
  { name: 'Marketing & Creative', slug: 'marketing', color: 'var(--rose)' },
]

const trendingSearches = ['Restaurants', 'SaaS Tools', 'Marketing Agency', 'Real Estate', 'Healthcare']

function highlightMatch(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="ns-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export default function LandingNav() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(-1)
  const location = useLocation()
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setDrawerOpen(false)
    setSearchOpen(false)
    setQuery('')
    document.body.style.overflow = ''
  }, [location])

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [searchOpen])

  const open = () => { setDrawerOpen(true); document.body.style.overflow = 'hidden' }
  const close = () => { setDrawerOpen(false); document.body.style.overflow = '' }

  const toggleSearch = (e) => {
    e.preventDefault()
    setSearchOpen(prev => !prev)
    setQuery('')
    setActiveIdx(-1)
  }

  // Filter suggestions
  const q = query.trim().toLowerCase()
  const filtered = q.length > 0
    ? allSuggestions.filter(s =>
        s.name.toLowerCase().includes(q) || s.cat.toLowerCase().includes(q)
      ).slice(0, 5)
    : []
  const matchedCats = q.length > 0
    ? categorySuggestions.filter(c => c.name.toLowerCase().includes(q)).slice(0, 3)
    : []
  const showDropdown = searchOpen
  const totalResults = filtered.length + matchedCats.length

  const handleSearch = (e) => {
    e?.preventDefault()
    if (query.trim()) {
      setSearchOpen(false)
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const goToResult = (name) => {
    setSearchOpen(false)
    navigate(`/search?q=${encodeURIComponent(name)}`)
  }

  const goToCategory = (slug) => {
    setSearchOpen(false)
    navigate(`/search?q=${encodeURIComponent(slug)}`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(prev => Math.min(prev + 1, totalResults - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0 && activeIdx < filtered.length) {
        goToResult(filtered[activeIdx].name)
      } else if (activeIdx >= filtered.length && activeIdx < totalResults) {
        goToCategory(matchedCats[activeIdx - filtered.length].slug)
      } else {
        handleSearch()
      }
    }
  }

  const handleItemMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    e.currentTarget.style.setProperty('--mx', `${x}%`)
    e.currentTarget.style.setProperty('--my', `${y}%`)
  }

  useEffect(() => { setActiveIdx(-1) }, [query])

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="container nav-inner">
          <Link to="/" className="nav-logo">
            <img src="/logo/infowebworld-logo.png" alt="InfoWebWorld" />
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
            <button className="nav-search-btn" aria-label="Search" onClick={toggleSearch}>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </button>
            <Link to="/signin" className="nav-signin">Sign in</Link>
            <Link to="/submit-listing" className="nav-cta">Get Listed</Link>
            <button className="nav-mobile-toggle" aria-label="Menu" onClick={open}><svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg></button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════
          LIQUID GLASS SEARCH OVERLAY (reuses ns-* CSS from shared.css)
          ══════════════════════════════════════════════════════ */}
      <div className={`ns-overlay${searchOpen ? ' ns-overlay--open' : ''}`} />
      <div className={`ns-container${searchOpen ? ' ns-container--open' : ''}`} ref={searchRef}>
        <div className="ns-glass">
          <div className="ns-glass-refraction"></div>
          <div className="ns-glass-caustics"></div>
        </div>
        <div className="ns-inner">
          <form className="ns-input-row" onSubmit={handleSearch}>
            <div className="ns-input-icon">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <div className="ns-icon-ripple"><span></span><span></span></div>
            </div>
            <input
              ref={inputRef}
              type="text"
              className="ns-input"
              placeholder="Search businesses, categories, services..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            {query && (
              <button type="button" className="ns-clear" onClick={() => { setQuery(''); inputRef.current?.focus() }}>
                <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            )}
            <button type="submit" className="ns-submit">
              <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </button>
            <button type="button" className="ns-close" onClick={() => setSearchOpen(false)}>
              <span>ESC</span>
            </button>
          </form>
          <div className="ns-dropdown">
            {q.length === 0 && (
              <>
                <div className="ns-section">
                  <div className="ns-label">
                    <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    Trending Searches
                  </div>
                  <div className="ns-trending">
                    {trendingSearches.map((t, i) => (
                      <button key={i} className="ns-trending-tag" onClick={() => setQuery(t)} onMouseMove={handleItemMouse} style={{ '--delay': `${i * 40}ms` }}>
                        <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ns-section">
                  <div className="ns-label">
                    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                    Popular Categories
                  </div>
                  <div className="ns-cats-grid">
                    {categorySuggestions.slice(0, 6).map((c, i) => (
                      <div key={i} className="ns-cat-pill" onClick={() => goToCategory(c.slug)} onMouseMove={handleItemMouse} style={{ '--delay': `${i * 50}ms` }}>
                        <span className="ns-cat-dot" style={{ background: c.color }}></span>
                        <span className="ns-cat-name">{c.name}</span>
                        <svg className="ns-cat-arrow" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {q.length > 0 && (
              <>
                <div className="ns-status">
                  <div className="ns-status-ripple"><span></span><span></span><span></span></div>
                  <span>{totalResults > 0 ? `${totalResults} results found` : 'Searching...'}</span>
                </div>
                {filtered.length > 0 && (
                  <div className="ns-section">
                    <div className="ns-label">
                      <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></svg>
                      Businesses
                    </div>
                    {filtered.map((s, i) => (
                      <div key={i} className={`ns-item${activeIdx === i ? ' ns-item--active' : ''}`} onClick={() => goToResult(s.name)} onMouseEnter={() => setActiveIdx(i)} onMouseMove={handleItemMouse} style={{ '--delay': `${i * 50}ms` }}>
                        <div className="ns-item-icon" style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)` }}>
                          <svg viewBox="0 0 24 24" stroke={s.color} fill="none" strokeWidth="1.5">{s.icon}</svg>
                        </div>
                        <div className="ns-item-info">
                          <div className="ns-item-name">{highlightMatch(s.name, q)}</div>
                          <div className="ns-item-cat">{s.cat}</div>
                        </div>
                        <div className="ns-item-rating">
                          <svg viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          <span>{s.rating}</span>
                        </div>
                        <svg className="ns-item-arrow" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                      </div>
                    ))}
                  </div>
                )}
                {matchedCats.length > 0 && (
                  <div className="ns-section">
                    <div className="ns-label">
                      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                      Categories
                    </div>
                    {matchedCats.map((c, i) => (
                      <div key={i} className={`ns-item ns-item--cat${activeIdx === filtered.length + i ? ' ns-item--active' : ''}`} onClick={() => goToCategory(c.slug)} onMouseEnter={() => setActiveIdx(filtered.length + i)} onMouseMove={handleItemMouse} style={{ '--delay': `${(filtered.length + i) * 50}ms` }}>
                        <span className="ns-cat-dot" style={{ background: c.color }}></span>
                        <span className="ns-item-name">{highlightMatch(c.name, q)}</span>
                        <svg className="ns-item-arrow" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                      </div>
                    ))}
                  </div>
                )}
                {totalResults === 0 && q.length > 1 && (
                  <div className="ns-empty">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                    <span>No results for "<strong>{query}</strong>"</span>
                    <span className="ns-empty-hint">Try searching for a business name or category</span>
                  </div>
                )}
                {totalResults > 0 && (
                  <div className="ns-footer" onClick={handleSearch}>
                    <span>View all results for "<strong>{query}</strong>"</span>
                    <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`nav-mobile-overlay${drawerOpen ? ' open' : ''}`} id="nav-overlay" onClick={close}></div>
      <div className={`nav-mobile-drawer${drawerOpen ? ' open' : ''}`} id="nav-drawer">
        <div className="nav-mobile-header">
          <Link to="/" className="nav-logo"><img src="/logo/infowebworld-logo.png" alt="InfoWebWorld" /></Link>
          <button className="nav-mobile-close" aria-label="Close menu" onClick={close}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
        </div>
        <div className="nav-mobile-body">
          <button className="nav-mobile-link" onClick={toggleSearch} style={{width:'100%',textAlign:'left',background:'none',border:'none',cursor:'pointer'}}>Search</button>
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
