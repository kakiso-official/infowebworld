import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const words = ['restaurant', 'agency', 'consultant', 'contractor', 'software', 'clinic']

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
      <div className="container hero-content">
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
        <div className="hero-categories">
          <Link to="/category?cat=technology" className="hero-cat-tile"><span className="hero-cat-icon" style={{background:'rgba(108,114,241,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--accent)"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg></span><span className="hero-cat-label">Technology</span></Link>
          <Link to="/category?cat=restaurants" className="hero-cat-tile"><span className="hero-cat-icon" style={{background:'rgba(239,107,74,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--coral)"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></svg></span><span className="hero-cat-label">Restaurants</span></Link>
          <Link to="/category?cat=healthcare" className="hero-cat-tile"><span className="hero-cat-icon" style={{background:'rgba(47,174,106,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--emerald)"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></span><span className="hero-cat-label">Healthcare</span></Link>
          <Link to="/category?cat=real-estate" className="hero-cat-tile"><span className="hero-cat-icon" style={{background:'rgba(59,130,246,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--azure)"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg></span><span className="hero-cat-label">Real Estate</span></Link>
          <Link to="/category?cat=legal" className="hero-cat-tile"><span className="hero-cat-icon" style={{background:'rgba(139,92,246,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--plum)"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg></span><span className="hero-cat-label">Legal</span></Link>
          <Link to="/category?cat=education" className="hero-cat-tile"><span className="hero-cat-icon" style={{background:'rgba(20,184,166,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--teal)"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg></span><span className="hero-cat-label">Education</span></Link>
          <Link to="/category?cat=marketing" className="hero-cat-tile"><span className="hero-cat-icon" style={{background:'rgba(236,72,153,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--rose)"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg></span><span className="hero-cat-label">Marketing</span></Link>
          <Link to="/category?cat=home-services" className="hero-cat-tile"><span className="hero-cat-icon" style={{background:'rgba(245,158,11,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--amber)"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg></span><span className="hero-cat-label">Home Services</span></Link>
        </div>
        <div className="hero-trust-bar">
          <div className="hero-trust-item"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>Verified Reviews</div>
          <span className="hero-trust-sep"></span>
          <div className="hero-trust-item"><svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>Dofollow Backlinks</div>
          <span className="hero-trust-sep"></span>
          <div className="hero-trust-item"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>Updated Daily</div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><div className="hero-stat-num">2,500+</div><div className="hero-stat-label">Businesses</div></div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat"><div className="hero-stat-num">25K+</div><div className="hero-stat-label">Reviews</div></div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat"><div className="hero-stat-num">80+</div><div className="hero-stat-label">Industries</div></div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat"><div className="hero-stat-num">12</div><div className="hero-stat-label">Countries</div></div>
        </div>
      </div>
    </section>
  )
}
