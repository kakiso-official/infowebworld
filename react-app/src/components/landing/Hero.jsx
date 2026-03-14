import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const words = ['restaurant', 'agency', 'consultant', 'contractor', 'software', 'clinic']

const categories = [
  { name: 'Technology', slug: 'technology', color: 'var(--accent)', bg: 'rgba(108,114,241,.1)', icon: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></> },
  { name: 'Restaurants', slug: 'restaurants', color: 'var(--coral)', bg: 'rgba(239,107,74,.1)', icon: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></> },
  { name: 'Healthcare', slug: 'healthcare', color: 'var(--emerald)', bg: 'rgba(47,174,106,.1)', icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" /> },
  { name: 'Real Estate', slug: 'real-estate', color: 'var(--azure)', bg: 'rgba(59,130,246,.1)', icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></> },
  { name: 'Legal', slug: 'legal', color: 'var(--plum)', bg: 'rgba(139,92,246,.1)', icon: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></> },
  { name: 'Education', slug: 'education', color: 'var(--teal)', bg: 'rgba(20,184,166,.1)', icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></> },
]

const stats = [
  { num: '2,500+', label: 'Businesses' },
  { num: '25K+', label: 'Reviews' },
  { num: '80+', label: 'Industries' },
  { num: '12', label: 'Countries' },
]

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
  { name: 'Evergreen Fitness Co', cat: 'Healthcare', rating: '4.8', color: 'var(--emerald)', icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" /> },
  { name: 'SparkClean Pro', cat: 'Home Services', rating: '4.7', color: 'var(--amber)', icon: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /> },
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

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [query, setQuery] = useState('')
  const [locationVal, setLocationVal] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const searchWrapRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % words.length)
    }, 2400)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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

  const showDropdown = focused && q.length > 0
  const totalResults = filtered.length + matchedCats.length

  const handleSearch = (e) => {
    e.preventDefault()
    setFocused(false)
    navigate(`/search?q=${encodeURIComponent(query)}&location=${encodeURIComponent(locationVal)}`)
  }

  const goToResult = (name) => {
    setFocused(false)
    navigate(`/search?q=${encodeURIComponent(name)}&location=${encodeURIComponent(locationVal)}`)
  }

  const goToCategory = (slug) => {
    setFocused(false)
    navigate(`/category?cat=${slug}`)
  }

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(prev => Math.min(prev + 1, totalResults - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      if (activeIdx < filtered.length) {
        goToResult(filtered[activeIdx].name)
      } else {
        goToCategory(matchedCats[activeIdx - filtered.length].slug)
      }
    } else if (e.key === 'Escape') {
      setFocused(false)
    }
  }

  // Mouse tracking for liquid glow
  const handleItemMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    e.currentTarget.style.setProperty('--mx', `${x}%`)
    e.currentTarget.style.setProperty('--my', `${y}%`)
  }

  useEffect(() => { setActiveIdx(-1) }, [query])

  return (
    <section className="hero">
      <div className="hero-grid-bg" aria-hidden="true"></div>
      <div className="hero-orb hero-orb--1"></div>
      <div className="hero-orb hero-orb--2"></div>

      <div className="container hero-split">
        {/* ── LEFT: Content ── */}
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></svg>
            2,500+ businesses listed this month
          </div>
          <h1 className="hero-h1">Find the right
            <span className="hero-rotate-wrap">
              {words.map((word, i) => (
                <span key={word} className={`hero-rotate-word${i === current ? ' active' : ''}`}>{word}</span>
              ))}
            </span>
            <br />for <em>your needs</em></h1>
          <p className="hero-sub">Search, compare, and review businesses across 80+ industries in 12 countries. Verified reviews. Real results.</p>

          {/* ── Search with liquid glass dropdown ── */}
          <div className={`search-wrap${showDropdown ? ' search-wrap--active' : ''}`} ref={searchWrapRef}>
            <form className={`search-bar${showDropdown ? ' search-bar--open' : ''}`} onSubmit={handleSearch}>
              <div className="search-field search-field--what">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="What are you looking for?"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                />
                {query && (
                  <button type="button" className="search-clear" onClick={() => { setQuery(''); setFocused(false) }}>
                    <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                )}
              </div>
              <div className="search-divider"></div>
              <div className="search-field search-field--where">
                <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <input type="text" className="search-input" placeholder="City or zip code" value={locationVal} onChange={e => setLocationVal(e.target.value)} />
              </div>
              <button type="submit" className="search-btn">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                Search
              </button>
            </form>

            {/* ── Liquid Glass Dropdown ── */}
            {showDropdown && (
              <div className="search-dropdown" ref={dropdownRef}>
                <div className="search-dropdown-glass"></div>
                <div className="search-dropdown-content">
                  {/* Searching indicator */}
                  <div className="search-dd-searching">
                    <div className="search-dd-ripple">
                      <span></span><span></span><span></span>
                    </div>
                    <span className="search-dd-searching-text">
                      {totalResults > 0 ? `${totalResults} results found` : 'Searching...'}
                    </span>
                  </div>

                  {/* Business results */}
                  {filtered.length > 0 && (
                    <div className="search-dd-section">
                      <div className="search-dd-label">
                        <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></svg>
                        Businesses
                      </div>
                      {filtered.map((s, i) => (
                        <div
                          key={i}
                          className={`search-dd-item${activeIdx === i ? ' search-dd-item--active' : ''}`}
                          onClick={() => goToResult(s.name)}
                          onMouseEnter={() => setActiveIdx(i)}
                          onMouseMove={handleItemMouse}
                          style={{ '--delay': `${i * 50}ms` }}
                        >
                          <div className="search-dd-item-icon" style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)` }}>
                            <svg viewBox="0 0 24 24" stroke={s.color} fill="none" strokeWidth="1.5">{s.icon}</svg>
                          </div>
                          <div className="search-dd-item-info">
                            <div className="search-dd-item-name">{highlightMatch(s.name, q)}</div>
                            <div className="search-dd-item-cat">{s.cat}</div>
                          </div>
                          <div className="search-dd-item-rating">
                            <svg viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <span>{s.rating}</span>
                          </div>
                          <svg className="search-dd-item-arrow" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Category results */}
                  {matchedCats.length > 0 && (
                    <div className="search-dd-section">
                      <div className="search-dd-label">
                        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                        Categories
                      </div>
                      {matchedCats.map((c, i) => (
                        <div
                          key={i}
                          className={`search-dd-item search-dd-item--cat${activeIdx === filtered.length + i ? ' search-dd-item--active' : ''}`}
                          onClick={() => goToCategory(c.slug)}
                          onMouseEnter={() => setActiveIdx(filtered.length + i)}
                          onMouseMove={handleItemMouse}
                          style={{ '--delay': `${(filtered.length + i) * 50}ms` }}
                        >
                          <div className="search-dd-cat-dot" style={{ background: c.color }}></div>
                          <span className="search-dd-cat-name">{highlightMatch(c.name, q)}</span>
                          <svg className="search-dd-item-arrow" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No results */}
                  {totalResults === 0 && q.length > 1 && (
                    <div className="search-dd-empty">
                      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                      <span>No results for "{query}"</span>
                    </div>
                  )}

                  {/* View all */}
                  {totalResults > 0 && (
                    <div className="search-dd-footer" onClick={handleSearch}>
                      <span>View all results for "{query}"</span>
                      <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="quick-tags">
            <span className="quick-tags-label">Popular:</span>
            <Link to="/search?q=Restaurants" className="quick-tag">Restaurants</Link>
            <Link to="/search?q=Software" className="quick-tag">Software</Link>
            <Link to="/search?q=Dentists" className="quick-tag">Dentists</Link>
            <Link to="/search?q=Real+Estate" className="quick-tag">Real Estate</Link>
            <Link to="/search?q=Marketing" className="quick-tag">Marketing</Link>
          </div>
          <div className="hero-trust-bar">
            <div className="hero-trust-item"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>Verified Reviews</div>
            <span className="hero-trust-sep"></span>
            <div className="hero-trust-item"><svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>Dofollow Backlinks</div>
            <span className="hero-trust-sep"></span>
            <div className="hero-trust-item"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>Updated Daily</div>
          </div>
        </div>

        {/* ── RIGHT: Visual side ── */}
        <div className="hero-right">
          <div className="hero-float-cats">
            {categories.map(c => (
              <Link to={`/category?cat=${c.slug}`} className="hero-float-cat" key={c.slug}>
                <span className="hero-float-cat-icon" style={{ background: c.bg }}>
                  <svg viewBox="0 0 24 24" stroke={c.color}>{c.icon}</svg>
                </span>
                <span className="hero-float-cat-name">{c.name}</span>
              </Link>
            ))}
          </div>
          <div className="hero-stats-card">
            {stats.map((s, i) => (
              <div className="hero-stat" key={i}>
                <div className="hero-stat-num">{s.num}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="hero-float-review">
            <div className="hero-float-review-stars">
              {[...Array(5)].map((_, i) => (
                <svg key={i} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              ))}
            </div>
            <p className="hero-float-review-text">"Found the perfect agency in minutes. Incredible platform!"</p>
            <div className="hero-float-review-author">
              <div className="hero-float-review-avatar">J</div>
              <div>
                <div className="hero-float-review-name">James R.</div>
                <div className="hero-float-review-role">Marketing Director</div>
              </div>
            </div>
          </div>
          <div className="hero-float-live">
            <span className="hero-float-live-dot"></span>
            <span>42 people searching now</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Highlight matching text */
function highlightMatch(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="search-dd-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}
