import { useState, useEffect } from 'react'
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

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [query, setQuery] = useState('')
  const [locationVal, setLocationVal] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % words.length)
    }, 2400)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(query)}&location=${encodeURIComponent(locationVal)}`)
  }

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
          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-field search-field--what">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input type="text" className="search-input" placeholder="What are you looking for?" value={query} onChange={e => setQuery(e.target.value)} />
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
          {/* Floating category cards */}
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

          {/* Stats strip */}
          <div className="hero-stats-card">
            {stats.map((s, i) => (
              <div className="hero-stat" key={i}>
                <div className="hero-stat-num">{s.num}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Decorative floating review card */}
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

          {/* Floating live indicator */}
          <div className="hero-float-live">
            <span className="hero-float-live-dot"></span>
            <span>42 people searching now</span>
          </div>
        </div>
      </div>
    </section>
  )
}
