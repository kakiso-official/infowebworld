import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCountry } from '../../context/CountryContext'

const defaultWords = ['restaurant', 'agency', 'consultant', 'contractor', 'software', 'clinic']

/* Category pills — vibrant pastel solids, draggable with physics */
const heroCats = [
  { name: 'Technology', slug: 'technology', color: '#2B4C8C', text: '#fff' },
  { name: 'Restaurants', slug: 'restaurants', color: '#E8644A', text: '#fff' },
  { name: 'Healthcare', slug: 'healthcare', color: '#5CB8A2', text: '#fff' },
  { name: 'Real Estate', slug: 'real-estate', color: '#F2C85A', text: '#1A1A1A' },
  { name: 'Legal', slug: 'legal', color: '#F4B4C0', text: '#1A1A1A' },
  { name: 'Education', slug: 'education', color: '#4361EE', text: '#fff' },
  { name: 'Marketing', slug: 'marketing', color: '#E85D9A', text: '#fff' },
  { name: 'Home Services', slug: 'home-services', color: '#F09C4A', text: '#1A1A1A' },
  { name: 'SaaS', slug: 'technology', color: '#7C5CFC', text: '#fff' },
  { name: 'Fitness', slug: 'healthcare', color: '#3DBBAE', text: '#fff' },
  { name: 'Finance', slug: 'legal', color: '#2A7B5B', text: '#fff' },
  { name: 'Design', slug: 'marketing', color: '#FF6B8A', text: '#fff' },
  { name: 'Travel', slug: 'restaurants', color: '#4A9BDE', text: '#fff' },
  { name: 'Automotive', slug: 'home-services', color: '#6B7280', text: '#fff' },
]

/* Home offsets for organic scattered layout */
const catHomes = [
  { x: 0, y: -8 }, { x: 8, y: 6 }, { x: -5, y: -4 },
  { x: 6, y: 10 }, { x: -4, y: -2 }, { x: 5, y: 7 },
  { x: -6, y: 8 }, { x: 4, y: -6 }, { x: -3, y: 5 },
  { x: 7, y: -3 }, { x: -5, y: 9 }, { x: 3, y: -7 },
  { x: -7, y: 4 }, { x: 6, y: -5 },
]

/* ── Cards for the swipeable 3D stack (listing + review) ── */
const heroReviews = [
  { business: 'CreativeForge Studio', category: 'Marketing', tagline: 'Full-service creative & digital marketing agency', color: '#E8553D', score: '4.9', reviews: 412, votes: 847, badge: 'Featured', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&q=80', text: 'Found the perfect marketing agency in minutes. The comparison tools are unmatched.', author: 'James R.', role: 'Marketing Director', avatar: 'J' },
  { business: 'CloudSync Pro', category: 'Technology', tagline: 'Enterprise cloud infrastructure & sync platform', color: '#4361EE', score: '4.8', reviews: 287, votes: 623, badge: 'Verified', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop&q=80', text: 'Best directory for finding tech partners. Saved our startup weeks of research.', author: 'Sarah K.', role: 'CTO, NovaByte', avatar: 'S' },
  { business: 'MindBridge Wellness', category: 'Healthcare', tagline: 'Holistic mental health & wellness clinic', color: '#5CB8A2', score: '4.8', reviews: 198, votes: 534, badge: 'Verified', img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop&q=80', text: 'The verified reviews gave us real confidence in our choice.', author: 'Michael T.', role: 'HR Manager', avatar: 'M' },
  { business: 'The Garden Table', category: 'Restaurant', tagline: 'Farm-to-table dining with seasonal menus', color: '#D4A028', score: '4.9', reviews: 523, votes: 1102, badge: 'Featured', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop&q=80', text: 'Outstanding restaurant listings with incredible detail.', author: 'Elena P.', role: 'Food Blogger', avatar: 'E' },
  { business: 'Summit Legal Group', category: 'Legal', tagline: 'Corporate law, IP, and startup advisory', color: '#6B7FBA', score: '4.7', reviews: 156, votes: 389, badge: 'Verified', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=800&fit=crop&q=80', text: 'Helped us find legal counsel fast. Verified listings made the difference.', author: 'David L.', role: 'Startup Founder', avatar: 'D' },
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
  const country = useCountry()
  const words = country?.hero?.words || defaultWords
  const locationPlaceholder = country?.hero?.locationPlaceholder || 'City or ZIP code'
  const locations = country?.locations || []

  const [current, setCurrent] = useState(0)
  const [query, setQuery] = useState('')
  const [locationVal, setLocationVal] = useState('')
  const [focused, setFocused] = useState(false)
  const [locFocused, setLocFocused] = useState(false)
  const [hoveredStateIdx, setHoveredStateIdx] = useState(null)
  const [activeIdx, setActiveIdx] = useState(-1)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const searchWrapRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % words.length)
    }, 2400)
    return () => clearInterval(interval)
  }, [words.length])

  // Filter locations based on typed value
  const locQ = locationVal.trim().toLowerCase()
  const filteredLocations = locQ.length > 0
    ? locations.map(loc => {
        const stateMatch = loc.state.toLowerCase().includes(locQ)
        const matchedCities = loc.cities.filter(c => c.toLowerCase().includes(locQ))
        if (stateMatch || matchedCities.length > 0) {
          return { ...loc, cities: stateMatch ? loc.cities : matchedCities }
        }
        return null
      }).filter(Boolean)
    : locations

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setFocused(false)
        setLocFocused(false)
        setHoveredStateIdx(null)
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

  const showDropdown = focused
  const totalResults = filtered.length + matchedCats.length

  const handleSearch = (e) => {
    e.preventDefault()
    setFocused(true)
  }

  const goToResult = (name) => {
    setFocused(false)
    navigate(`/search?q=${encodeURIComponent(name)}&location=${encodeURIComponent(locationVal)}`)
  }

  const goToCategory = (slug) => {
    setFocused(false)
    navigate(`/search?q=${encodeURIComponent(slug)}&location=${encodeURIComponent(locationVal)}`)
  }

  const viewAllResults = () => {
    setFocused(false)
    navigate(`/search?q=${encodeURIComponent(query)}&location=${encodeURIComponent(locationVal)}`)
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

  /* ── Draggable category pills: physics engine ── */
  const catEls = useRef([])
  const catP = useRef(
    heroCats.map((_, i) => ({
      x: catHomes[i].x + (Math.random() - 0.5) * 60,
      y: catHomes[i].y - 50 - Math.random() * 30,
      hx: catHomes[i].x, hy: catHomes[i].y,
      vx: 0, vy: 0, rot: 0,
      drag: false, moved: false,
      lx: 0, ly: 0, sx: 0, sy: 0
    }))
  )

  useEffect(() => {
    let raf
    const step = () => {
      catP.current.forEach((p, i) => {
        const el = catEls.current[i]
        if (!el) return
        if (!p.drag) {
          p.vx *= 0.92
          p.vy *= 0.92
          p.vx += (p.hx - p.x) * 0.025
          p.vy += (p.hy - p.y) * 0.025
          p.x += p.vx
          p.y += p.vy
          p.rot += (p.vx * 0.35 - p.rot) * 0.09
          if (Math.abs(p.x - p.hx) < 0.15 && Math.abs(p.y - p.hy) < 0.15 &&
              Math.abs(p.vx) < 0.02 && Math.abs(p.vy) < 0.02) {
            p.x = p.hx; p.y = p.hy; p.vx = 0; p.vy = 0; p.rot = 0
          }
        }
        const s = p.drag ? 1.1 : 1
        el.style.transform = `translate3d(${p.x}px,${p.y}px,0) rotate(${p.rot}deg) scale(${s})`
        el.style.opacity = '1'
      })
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  const catDown = (e, i) => {
    const p = catP.current[i]
    p.drag = true; p.moved = false
    p.vx = 0; p.vy = 0
    p.lx = e.clientX; p.ly = e.clientY
    p.sx = e.clientX; p.sy = e.clientY
    catEls.current[i]?.classList.add('hero-cat--grab')
    e.currentTarget.setPointerCapture(e.pointerId)
    e.preventDefault()
  }

  const catMove = (e, i) => {
    const p = catP.current[i]
    if (!p.drag) return
    const dx = e.clientX - p.lx, dy = e.clientY - p.ly
    p.x += dx; p.y += dy
    p.vx = dx * 0.7; p.vy = dy * 0.7
    p.lx = e.clientX; p.ly = e.clientY
    if (Math.abs(e.clientX - p.sx) + Math.abs(e.clientY - p.sy) > 5) p.moved = true
  }

  const catUp = (e, i) => {
    const p = catP.current[i]
    p.drag = false
    catEls.current[i]?.classList.remove('hero-cat--grab')
    if (!p.moved) navigate(`/category?cat=${heroCats[i].slug}`)
  }

  /* ── Right side: 3D swipeable review card stack ── */
  const [topCard, setTopCard] = useState(0)
  const topRef = useRef(0)
  const stackRefs = useRef([])
  const swipeRef = useRef({ active: false, x: 0, y: 0, vx: 0, vy: 0, lx: 0, ly: 0, sx: 0, moved: false, history: [] })
  const dismissingRef = useRef(false)
  const autoRef = useRef(null)

  useEffect(() => { topRef.current = topCard }, [topCard])

  const resetAuto = () => {
    clearInterval(autoRef.current)
    autoRef.current = setInterval(() => dismissCard(-1), 4500)
  }

  const dismissCard = (dir) => {
    if (dismissingRef.current) return
    dismissingRef.current = true
    const idx = topRef.current
    const el = stackRefs.current[idx]
    if (!el) { dismissingRef.current = false; return }

    // Velocity-aware dismiss speed
    const speed = Math.min(Math.max(Math.abs(swipeRef.current.vx) * 30, 350), 550)
    el.style.transition = `transform ${speed}ms cubic-bezier(.32,.94,.6,1), opacity ${speed * 0.8}ms ease-out`
    el.style.transform = `translateX(${dir * 120}%) rotate(${dir * 12}deg)`
    el.style.opacity = '0'

    setTimeout(() => {
      // 1. Kill transition so reset is instant
      el.style.transition = 'none'
      // 2. Park card at back-of-stack position
      el.style.transform = 'translateY(48px) scale(.85)'
      el.style.opacity = '0'
      // 3. Update React state
      setTopCard(prev => (prev + 1) % heroReviews.length)
      // 4. After paint, re-enable transitions
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = ''
          el.style.transform = ''
          el.style.opacity = ''
          dismissingRef.current = false
        })
      })
    }, speed + 30)
  }

  useEffect(() => {
    resetAuto()
    const onVis = () => {
      if (document.hidden) clearInterval(autoRef.current)
      else resetAuto()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => { clearInterval(autoRef.current); document.removeEventListener('visibilitychange', onVis) }
  }, [])

  const swStart = (e) => {
    if (dismissingRef.current) return
    clearInterval(autoRef.current)
    const s = swipeRef.current
    s.active = true; s.moved = false; s.x = 0; s.y = 0; s.vx = 0; s.vy = 0
    s.lx = e.clientX; s.ly = e.clientY; s.sx = e.clientX
    s.history = []
    const el = stackRefs.current[topRef.current]
    if (el) el.style.transition = 'none'
    e.currentTarget.setPointerCapture(e.pointerId)
    e.preventDefault()
  }

  const swMove = (e) => {
    const s = swipeRef.current
    if (!s.active) return
    const dx = e.clientX - s.lx
    const dy = e.clientY - s.ly
    s.x += dx; s.y += dy * 0.25
    s.lx = e.clientX; s.ly = e.clientY
    // Rolling velocity average (last 4 frames)
    s.history.push(dx)
    if (s.history.length > 4) s.history.shift()
    s.vx = s.history.reduce((a, b) => a + b, 0) / s.history.length
    if (Math.abs(e.clientX - s.sx) > 5) s.moved = true
    const el = stackRefs.current[topRef.current]
    if (!el) return
    // Progressive opacity: fades as card moves away
    const progress = Math.min(Math.abs(s.x) / 250, 1)
    const opacity = 1 - progress * 0.4
    el.style.transform = `translate3d(${s.x}px,${s.y}px,0) rotate(${s.x * 0.05}deg)`
    el.style.opacity = `${opacity}`
  }

  const swEnd = () => {
    const s = swipeRef.current
    if (!s.active) return
    s.active = false
    const el = stackRefs.current[topRef.current]
    if (!el) return
    if (Math.abs(s.x) > 80 || Math.abs(s.vx) > 4) {
      dismissCard(s.x > 0 ? 1 : -1)
    } else {
      // Spring back
      el.style.transition = 'transform .45s cubic-bezier(.34,1.56,.64,1), opacity .3s ease-out'
      el.style.transform = ''
      el.style.opacity = ''
    }
    s.x = 0; s.y = 0; s.vx = 0; s.history = []
    resetAuto()
  }

  const swCancel = () => {
    const s = swipeRef.current
    if (!s.active) return
    s.active = false
    const el = stackRefs.current[topRef.current]
    if (el) {
      el.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1), opacity .3s'
      el.style.transform = ''
      el.style.opacity = ''
    }
    s.x = 0; s.y = 0; s.vx = 0; s.history = []
    resetAuto()
  }

  return (
    <section className="hero">
      <div className="container hero-split">
        {/* ── LEFT: Content ── */}
        <div className="hero-left">
          <h1 className="hero-h1">Find the Best{' '}
            <span className="hero-rotate-wrap">
              {words.map((word, i) => (
                <span key={word} className={`hero-rotate-word${i === current ? ' active' : ''}`}>{word}</span>
              ))}
            </span>
            <br />Near <em>You</em></h1>
          <p className="hero-sub">Search, compare, and review businesses across 80+ industries in 12 countries. Verified reviews. Real results.</p>

          {/* ── Search with dropdown ── */}
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
                  onFocus={() => { setFocused(true); setLocFocused(false) }}
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
                <input
                  type="text"
                  className="search-input"
                  placeholder={locationPlaceholder}
                  value={locationVal}
                  onChange={e => { setLocationVal(e.target.value); setLocFocused(true); setHoveredStateIdx(null) }}
                  onFocus={() => { setLocFocused(true); setFocused(false); setHoveredStateIdx(null) }}
                  autoComplete="off"
                />
                {locationVal && (
                  <button type="button" className="search-clear" onClick={() => { setLocationVal(''); setLocFocused(false) }}>
                    <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                )}
              </div>
              <button type="submit" className="search-btn">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                Search
              </button>
            </form>

            {/* ── Location Dropdown: States + Cities ── */}
            {locFocused && filteredLocations.length > 0 && (
              <div className="loc-dropdown">
                <div className="loc-dropdown-inner">
                  <div className="loc-states">
                    <div className="search-dd-label">
                      <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      {country?.code === 'eu' ? 'Select Country' : 'Select State'}
                    </div>
                    {filteredLocations.map((loc, i) => (
                      <div
                        key={loc.state}
                        className={`loc-state-item${hoveredStateIdx === i ? ' loc-state-item--active' : ''}`}
                        onMouseEnter={() => setHoveredStateIdx(i)}
                        onClick={() => { setLocationVal(loc.state); setLocFocused(false); setHoveredStateIdx(null) }}
                      >
                        <svg viewBox="0 0 24 24" className="loc-state-icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        <span className="loc-state-name">{loc.state}</span>
                        <span className="loc-state-count">{loc.cities.length}</span>
                        <svg viewBox="0 0 24 24" className="loc-state-arrow"><path d="m9 18 6-6-6-6" /></svg>
                      </div>
                    ))}
                  </div>
                  {hoveredStateIdx !== null && filteredLocations[hoveredStateIdx] && (
                    <div className="loc-cities">
                      <div className="loc-cities-header">
                        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        <span>Cities in {filteredLocations[hoveredStateIdx].state}</span>
                      </div>
                      {filteredLocations[hoveredStateIdx].cities.map(city => (
                        <div
                          key={city}
                          className="loc-city-item"
                          onClick={() => { setLocationVal(`${city}, ${filteredLocations[hoveredStateIdx].state}`); setLocFocused(false); setHoveredStateIdx(null) }}
                        >
                          <svg viewBox="0 0 24 24" className="loc-city-icon"><circle cx="12" cy="12" r="3" /></svg>
                          <span>{city}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Search Dropdown ── */}
            {showDropdown && !locFocused && (
              <div className="search-dropdown" ref={dropdownRef}>
                <div className="search-dropdown-content">

                  {/* ── Empty query: show trending + categories ── */}
                  {q.length === 0 && (
                    <>
                      <div className="search-dd-section">
                        <div className="search-dd-label">
                          <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                          Trending Searches
                        </div>
                        <div className="search-dd-trending">
                          {['Restaurants', 'SaaS Tools', 'Marketing Agency', 'Real Estate', 'Healthcare'].map((t, i) => (
                            <button
                              key={i}
                              className="search-dd-trend-tag"
                              onClick={() => setQuery(t)}
                              onMouseMove={handleItemMouse}
                              style={{ '--delay': `${i * 40}ms` }}
                            >
                              <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="search-dd-section">
                        <div className="search-dd-label">
                          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                          Popular Categories
                        </div>
                        {categorySuggestions.slice(0, 5).map((c, i) => (
                          <div
                            key={i}
                            className="search-dd-item search-dd-item--cat"
                            onClick={() => goToCategory(c.slug)}
                            onMouseMove={handleItemMouse}
                            style={{ '--delay': `${i * 50}ms` }}
                          >
                            <div className="search-dd-cat-dot" style={{ background: c.color }}></div>
                            <span className="search-dd-cat-name">{c.name}</span>
                            <svg className="search-dd-item-arrow" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* ── Has query: show filtered results ── */}
                  {q.length > 0 && (
                    <>
                      <div className="search-dd-searching">
                        <div className="search-dd-ripple">
                          <span></span><span></span><span></span>
                        </div>
                        <span className="search-dd-searching-text">
                          {totalResults > 0 ? `${totalResults} results found` : 'Searching...'}
                        </span>
                      </div>

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

                      {totalResults === 0 && q.length > 1 && (
                        <div className="search-dd-empty">
                          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                          <span>No results for "{query}"</span>
                        </div>
                      )}

                      {totalResults > 0 && (
                        <div className="search-dd-footer" onClick={viewAllResults}>
                          <span>View all results for "{query}"</span>
                          <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Colorful category pills ── */}
          <div className="hero-cats">
            {heroCats.map((cat, i) => (
              <div
                key={cat.slug}
                ref={el => catEls.current[i] = el}
                className="hero-cat"
                style={{ background: cat.color, color: cat.text }}
                onPointerDown={e => catDown(e, i)}
                onPointerMove={e => catMove(e, i)}
                onPointerUp={e => catUp(e, i)}
              >
                {cat.name}
              </div>
            ))}
          </div>

          <div className="hero-trust-bar">
            <div className="hero-trust-item" style={{ '--ti': '0' }}>
              <span className="hero-trust-icon" style={{ background: '#2FAE6A' }}>
                <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></svg>
              </span>
              <span className="hero-trust-text">Verified Reviews</span>
            </div>
            <div className="hero-trust-item" style={{ '--ti': '1' }}>
              <span className="hero-trust-icon" style={{ background: '#4361EE' }}>
                <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              </span>
              <span className="hero-trust-text">Dofollow Backlinks</span>
            </div>
            <div className="hero-trust-item" style={{ '--ti': '2' }}>
              <span className="hero-trust-icon" style={{ background: '#E8553D' }}>
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              </span>
              <span className="hero-trust-text">Updated Daily</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: 3D swipeable review card stack ── */}
        <div className="hero-right">
          {/* Animated gradient blobs */}
          {/* Background image — syncs with current top card */}
          <div className="hr-bg" aria-hidden="true">
            {heroReviews.map((r, i) => (
              <img
                key={i}
                src={r.img}
                alt=""
                className={`hr-bg-img${(i - topCard + heroReviews.length) % heroReviews.length === 0 ? ' hr-bg-img--active' : ''}`}
                draggable="false"
              />
            ))}
          </div>

          {/* Card stack */}
          <div className="hr-stack">
            {heroReviews.map((r, i) => {
              const pos = (i - topCard + heroReviews.length) % heroReviews.length
              return (
                <div
                  key={i}
                  ref={el => stackRefs.current[i] = el}
                  className="hr-scard"
                  style={{
                    zIndex: heroReviews.length - pos,
                    transform: pos < 3
                      ? `translateY(${pos * 16}px) scale(${1 - pos * 0.05})`
                      : 'translateY(48px) scale(.85)',
                    opacity: pos < 3 ? 1 - pos * 0.15 : 0,
                    pointerEvents: pos === 0 ? 'auto' : 'none',
                  }}
                  onPointerDown={pos === 0 ? swStart : undefined}
                  onPointerMove={pos === 0 ? swMove : undefined}
                  onPointerUp={pos === 0 ? swEnd : undefined}
                  onPointerCancel={pos === 0 ? swCancel : undefined}
                >
                  {/* ── Image area ── */}
                  <div className="hr-sc-top">
                    <img src={r.img} alt={r.business} draggable="false" />
                    <span className="hr-sc-badge" style={{ background: r.badge === 'Featured' ? 'var(--h-accent)' : 'var(--emerald)' }}>{r.badge}</span>
                  </div>
                  {/* ── Listing body ── */}
                  <div className="hr-sc-body">
                    <div className="hr-sc-meta">
                      <span className="hr-sc-cat" style={{ background: `${r.color}12`, color: r.color }}>{r.category}</span>
                    </div>
                    <div className="hr-sc-title">{r.business}</div>
                    <div className="hr-sc-tagline">{r.tagline}</div>
                    <div className="hr-sc-rating">
                      <div className="hr-sc-stars">
                        {[...Array(5)].map((_, j) => (
                          <svg key={j} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        ))}
                      </div>
                      <span className="hr-sc-score">{r.score}</span>
                      <span className="hr-sc-revcount">({r.reviews})</span>
                    </div>
                  </div>
                  {/* ── Action bar ── */}
                  <div className="hr-sc-actions">
                    <div className="hr-sc-act">
                      <svg viewBox="0 0 24 24"><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg>
                      <span>{r.votes}</span>
                    </div>
                    <div className="hr-sc-act">
                      <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                    </div>
                    <div className="hr-sc-act">
                      <svg viewBox="0 0 24 24"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" /><path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" /></svg>
                    </div>
                    <div className="hr-sc-act">
                      <svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    <div className="hr-sc-act hr-sc-act--end">
                      <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                    </div>
                  </div>
                  {/* ── Review quote ── */}
                  <div className="hr-sc-review">
                    <div className="hr-sc-quote">"{r.text}"</div>
                    <div className="hr-sc-author">
                      <div className="hr-sc-avatar" style={{ background: r.color }}>{r.avatar}</div>
                      <div className="hr-sc-ainfo">
                        <span className="hr-sc-aname">{r.author}</span>
                        <span className="hr-sc-arole">{r.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Swipe hint */}
          <div className="hr-hint">
            <svg viewBox="0 0 24 24"><path d="M14 8l-4 4 4 4" /></svg>
            Swipe to explore
            <svg viewBox="0 0 24 24"><path d="M10 8l4 4-4 4" /></svg>
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
