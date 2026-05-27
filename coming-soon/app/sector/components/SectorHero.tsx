'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Category } from '../../iww-hq/data/category-storage'
import type { RealSubmission } from '../../iww-hq/data/submissions-storage'
import type { SectorMeta, SectorDemo } from '../sector-demo-data'

/* ── Category pill colors (vibrant solids, same palette as homepage) ── */
const PILL_COLORS = [
  '#2B4C8C', '#E8644A', '#5CB8A2', '#F2C85A', '#F4B4C0',
  '#4361EE', '#E85D9A', '#F09C4A', '#7C5CFC', '#3DBBAE',
  '#2A7B5B', '#FF6B8A', '#4A9BDE', '#6B7280',
]

function pillText(bg: string) {
  const r = parseInt(bg.slice(1, 3), 16), g = parseInt(bg.slice(3, 5), 16), b = parseInt(bg.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 160 ? '#1A1A1A' : '#fff'
}

/* ── Home offsets for organic pill scatter ── */
const catHomes = [
  { x: 0, y: -8 }, { x: 8, y: 6 }, { x: -5, y: -4 }, { x: 6, y: 10 },
  { x: -4, y: -2 }, { x: 5, y: 7 }, { x: -6, y: 8 }, { x: 4, y: -6 },
  { x: -3, y: 5 }, { x: 7, y: -3 }, { x: -5, y: 9 }, { x: 3, y: -7 },
  { x: -7, y: 4 }, { x: 6, y: -5 },
]

type Props = {
  category: Category; meta: SectorMeta; sectorName: string; shortName: string
  l2Cats: Category[]; l3Cats: Category[]; demos: SectorDemo[]; listings: RealSubmission[]
  sectorSlug: string
}

export default function SectorHero({ category, meta, sectorName, shortName, l2Cats, l3Cats, demos, listings, sectorSlug }: Props) {
  const router = useRouter()

  /* ── Typewriter animation from L2 category names ── */
  const words = l2Cats.slice(0, 6).map(c => c.name)
  const [displayed, setDisplayed] = useState('')
  const [jsReady, setJsReady] = useState(false)
  useEffect(() => {
    setJsReady(true)
    if (!words.length) return
    let wordIdx = 0, charIdx = 0, deleting = false
    let timeout: ReturnType<typeof setTimeout>
    function tick() {
      const word = words[wordIdx]
      if (!deleting) {
        charIdx++
        setDisplayed(word.slice(0, charIdx))
        if (charIdx === word.length) { timeout = setTimeout(() => { deleting = true; tick() }, 1200); return }
        timeout = setTimeout(tick, 100)
      } else {
        charIdx--
        setDisplayed(word.slice(0, charIdx))
        if (charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; timeout = setTimeout(tick, 300); return }
        timeout = setTimeout(tick, 60)
      }
    }
    tick()
    return () => clearTimeout(timeout)
  }, [words.length])

  /* ── Category pills from L2 cats ── */
  const heroCats = l2Cats.slice(0, 14).map((c, i) => ({
    name: c.name, slug: c.slug,
    color: PILL_COLORS[i % PILL_COLORS.length],
    text: pillText(PILL_COLORS[i % PILL_COLORS.length]),
  }))

  /* ── Review cards: real listings first, fill remaining with demos ── */
  const realCards = listings.slice(0, 5).map(l => ({
    business: l.companyName, category: l.category || shortName, tagline: l.tagline || l.description?.slice(0, 80) || '',
    color: l.categoryColor || meta.color, score: '4.5', reviews: 0,
    votes: 0, badge: 'Verified' as const,
    img: (l.screenshots && l.screenshots.length > 0) ? l.screenshots[0] : meta.heroImage,
    bgImg: (l.screenshots && l.screenshots.length > 0) ? l.screenshots[0] : meta.heroImage,
    text: `Verified ${shortName} business on InfoWebWorld.`,
    author: l.contactName?.[0] || l.companyName[0], role: l.category || shortName,
    avatar: l.companyName[0], slug: l.slug,
  }))
  const demoCards = demos.slice(0, Math.max(0, 5 - realCards.length)).map(d => ({
    business: d.name, category: d.category, tagline: d.tagline,
    color: d.color, score: d.score.toFixed(1), reviews: d.reviews,
    votes: Math.round(d.reviews * 2.1), badge: d.badges.includes('featured') ? 'Featured' : 'Verified',
    img: meta.heroImage, bgImg: meta.heroImage,
    text: `Outstanding ${shortName} directory. Found exactly what we needed.`,
    author: d.name.split(' ')[0][0] + '.', role: d.category, avatar: d.name[0], slug: '',
  }))
  const heroReviews = [...realCards, ...demoCards]

  /* ── Search state ── */
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const searchWrapRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(-1)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) setFocused(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const q = query.trim().toLowerCase()
  /* Real listings first — deep search across ALL fields */
  const filteredReal = q.length > 0
    ? listings.filter(l => {
        const haystack = [
          l.companyName, l.tagline, l.description, l.category,
          l.listingType, l.pricingModel, l.city, l.state, l.country,
          l.hqLocation, l.website, l.founded, l.employees, l.funding,
          ...(l.features || []), ...(l.integrations || []).map(i => i.name),
          ...(l.faqs || []).map(f => f.question + ' ' + f.answer),
          ...(l.pricingTiers || []).map(t => t.name + ' ' + t.price),
        ].filter(Boolean).join(' ').toLowerCase()
        return haystack.includes(q)
      }).slice(0, 5)
    : []
  const filteredDemo = q.length > 0
    ? demos.filter(d => d.name.toLowerCase().includes(q) || d.tagline.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)).slice(0, Math.max(0, 5 - filteredReal.length))
    : []
  const filtered = [
    ...filteredReal.map(l => ({ name: l.companyName, tagline: l.tagline || l.description?.slice(0, 80) || '', category: l.category || shortName, color: l.categoryColor || meta.color, score: '4.5', slug: l.slug, isReal: true, logoUrl: l.logoUrl || '', listingMode: l.listingMode || 'product' })),
    ...filteredDemo.map(d => ({ name: d.name, tagline: d.tagline, category: d.category, color: d.color, score: d.score.toFixed(1), slug: '', isReal: false, logoUrl: '', listingMode: 'product' as const })),
  ]
  const matchedCats = q.length > 0
    ? l2Cats.filter(c => c.name.toLowerCase().includes(q)).slice(0, 3)
    : []
  const totalResults = filtered.length + matchedCats.length
  const showDropdown = focused

  useEffect(() => { setActiveIdx(-1) }, [query])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setFocused(true) }
  /* Branch href on listing_mode so company-mode rows route to /profile and
     product-mode rows to /company. Falls back to product for legacy data. */
  const goToResult = (slug: string, mode: string = 'product') => {
    setFocused(false)
    if (!slug) { router.push('/business'); return }
    router.push((mode === 'company' ? '/profile/' : '/listing/') + slug)
  }
  const goToCategory = (slug: string) => { setFocused(false); router.push(`/${sectorSlug}/${slug}`) }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(p => Math.min(p + 1, totalResults - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(p => Math.max(p - 1, -1)) }
    else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      if (activeIdx < filtered.length) goToResult(filtered[activeIdx].slug, filtered[activeIdx].listingMode)
      else goToCategory(matchedCats[activeIdx - filtered.length].slug)
    } else if (e.key === 'Escape') setFocused(false)
  }

  const handleItemMouse = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    ;(e.currentTarget as HTMLElement).style.setProperty('--mx', `${x}%`)
    ;(e.currentTarget as HTMLElement).style.setProperty('--my', `${y}%`)
  }

  /* ── Draggable pills: physics engine ── */
  const catEls = useRef<(HTMLDivElement | null)[]>([])
  const catP = useRef<{ x: number; y: number; hx: number; hy: number; vx: number; vy: number; rot: number; drag: boolean; moved: boolean; lx: number; ly: number; sx: number; sy: number }[]>([])

  /* Re-init physics whenever heroCats changes (L2 data arrives async) */
  useEffect(() => {
    catP.current = heroCats.map((_, i) => ({
      x: (catHomes[i] || { x: 0 }).x + (Math.random() - 0.5) * 60,
      y: (catHomes[i] || { y: 0 }).y - 50 - Math.random() * 30,
      hx: (catHomes[i] || { x: 0 }).x, hy: (catHomes[i] || { y: 0 }).y,
      vx: 0, vy: 0, rot: 0, drag: false, moved: false, lx: 0, ly: 0, sx: 0, sy: 0,
    }))
    catEls.current = []
  }, [heroCats.length])

  useEffect(() => {
    if (!heroCats.length) return
    let raf: number
    const step = () => {
      catP.current.forEach((p, i) => {
        const el = catEls.current[i]
        if (!el) return
        if (!p.drag) {
          p.vx *= 0.92; p.vy *= 0.92
          p.vx += (p.hx - p.x) * 0.025; p.vy += (p.hy - p.y) * 0.025
          p.x += p.vx; p.y += p.vy
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
  }, [heroCats.length])

  const catDown = (e: React.PointerEvent, i: number) => {
    const p = catP.current[i]; p.drag = true; p.moved = false; p.vx = 0; p.vy = 0
    p.lx = e.clientX; p.ly = e.clientY; p.sx = e.clientX; p.sy = e.clientY
    catEls.current[i]?.classList.add('hero-cat--grab')
    e.currentTarget.setPointerCapture(e.pointerId); e.preventDefault()
  }
  const catMove = (e: React.PointerEvent, i: number) => {
    const p = catP.current[i]; if (!p.drag) return
    const dx = e.clientX - p.lx, dy = e.clientY - p.ly
    p.x += dx; p.y += dy; p.vx = dx * 0.7; p.vy = dy * 0.7
    p.lx = e.clientX; p.ly = e.clientY
    if (Math.abs(e.clientX - p.sx) + Math.abs(e.clientY - p.sy) > 5) p.moved = true
  }
  const catUp = (_e: React.PointerEvent, i: number) => {
    const p = catP.current[i]; p.drag = false
    catEls.current[i]?.classList.remove('hero-cat--grab')
    if (!p.moved) router.push(`/${sectorSlug}/${heroCats[i].slug}`)
  }

  /* ── 3D swipeable card stack ── */
  const [topCard, setTopCard] = useState(0)
  const topRef = useRef(0)
  const stackRefs = useRef<(HTMLDivElement | null)[]>([])
  const swipeRef = useRef({ active: false, x: 0, y: 0, vx: 0, vy: 0, lx: 0, ly: 0, sx: 0, moved: false, history: [] as number[] })
  const dismissingRef = useRef(false)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { topRef.current = topCard }, [topCard])

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => dismissCard(-1), 4500)
  }

  const dismissCard = (dir: number) => {
    if (dismissingRef.current || !heroReviews.length) return
    dismissingRef.current = true
    const idx = topRef.current
    const el = stackRefs.current[idx]
    if (!el) { dismissingRef.current = false; return }
    const speed = Math.min(Math.max(Math.abs(swipeRef.current.vx) * 30, 350), 550)
    el.style.transition = `transform ${speed}ms cubic-bezier(.32,.94,.6,1), opacity ${speed * 0.8}ms ease-out`
    el.style.transform = `translateX(${dir * 120}%) rotate(${dir * 12}deg)`
    el.style.opacity = '0'
    setTimeout(() => {
      el.style.transition = 'none'
      el.style.transform = 'translateY(48px) scale(.85)'; el.style.opacity = '0'
      setTopCard(p => (p + 1) % heroReviews.length)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = ''; el.style.transform = ''; el.style.opacity = ''
          dismissingRef.current = false
        })
      })
    }, speed + 30)
  }

  useEffect(() => {
    resetAuto()
    const onVis = () => { if (document.hidden && autoRef.current) clearInterval(autoRef.current); else resetAuto() }
    document.addEventListener('visibilitychange', onVis)
    return () => { if (autoRef.current) clearInterval(autoRef.current); document.removeEventListener('visibilitychange', onVis) }
  }, [])

  const swStart = (e: React.PointerEvent) => {
    if (dismissingRef.current) return
    if (autoRef.current) clearInterval(autoRef.current)
    const s = swipeRef.current
    s.active = true; s.moved = false; s.x = 0; s.y = 0; s.vx = 0; s.vy = 0
    s.lx = e.clientX; s.ly = e.clientY; s.sx = e.clientX; s.history = []
    const el = stackRefs.current[topRef.current]
    if (el) el.style.transition = 'none'
    e.currentTarget.setPointerCapture(e.pointerId); e.preventDefault()
  }
  const swMove = (e: React.PointerEvent) => {
    const s = swipeRef.current; if (!s.active) return
    const dx = e.clientX - s.lx, dy = e.clientY - s.ly
    s.x += dx; s.y += dy * 0.25; s.lx = e.clientX; s.ly = e.clientY
    s.history.push(dx); if (s.history.length > 4) s.history.shift()
    s.vx = s.history.reduce((a, b) => a + b, 0) / s.history.length
    if (Math.abs(e.clientX - s.sx) > 5) s.moved = true
    const el = stackRefs.current[topRef.current]; if (!el) return
    const progress = Math.min(Math.abs(s.x) / 250, 1)
    el.style.transform = `translate3d(${s.x}px,${s.y}px,0) rotate(${s.x * 0.05}deg)`
    el.style.opacity = `${1 - progress * 0.4}`
  }
  const swEnd = () => {
    const s = swipeRef.current; if (!s.active) return; s.active = false
    const el = stackRefs.current[topRef.current]; if (!el) return
    if (Math.abs(s.x) > 80 || Math.abs(s.vx) > 4) dismissCard(s.x > 0 ? 1 : -1)
    else { el.style.transition = 'transform .45s cubic-bezier(.34,1.56,.64,1), opacity .3s ease-out'; el.style.transform = ''; el.style.opacity = '' }
    s.x = 0; s.y = 0; s.vx = 0; s.history = []; resetAuto()
  }
  const swCancel = () => {
    const s = swipeRef.current; if (!s.active) return; s.active = false
    const el = stackRefs.current[topRef.current]
    if (el) { el.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1), opacity .3s'; el.style.transform = ''; el.style.opacity = '' }
    s.x = 0; s.y = 0; s.vx = 0; s.history = []; resetAuto()
  }

  return (
    <section className="hero" aria-label={`${sectorName} directory`}>
      <div className="container hero-split">
        {/* ── LEFT ── */}
        <div className="hero-left">
          <nav className="sl-hero-breadcrumb" aria-label="Breadcrumb">
            <Link href="/" aria-label="Home">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </Link>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
            <span aria-current="page">{sectorName}</span>
          </nav>
          <h1 className="hero-h1"><span className="hero-h1-label">Find the Best </span><span className={`hero-type-wrap${jsReady ? ' hero-type-js' : ''}`}>
              <span className="hero-type-text">{displayed}</span>
              <span className="hero-type-cursor" />
            </span><span className="hero-h1-ctx"> in <em>{shortName}</em></span></h1>
          <p className="hero-sub">{meta.description}</p>

          {/* Search */}
          <div className={`search-wrap${showDropdown ? ' search-wrap--active' : ''}`} ref={searchWrapRef}>
            <form className={`search-bar${showDropdown ? ' search-bar--open' : ''}`} onSubmit={handleSearch}>
              <div className="search-field search-field--what">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                <input type="text" className="search-input" placeholder={`Search ${shortName} tools...`} value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setFocused(true)} onKeyDown={handleKeyDown} autoComplete="off" />
                {query && <button type="button" className="search-clear" onClick={() => { setQuery(''); setFocused(false) }}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>}
              </div>
              <button type="submit" className="search-btn">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                Search
              </button>
            </form>

            {showDropdown && (
              <div className="search-dropdown">
                <div className="search-dropdown-content">
                  {q.length === 0 && (
                    <>
                      <div className="search-dd-section">
                        <div className="search-dd-label"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg> Trending in {shortName}</div>
                        <div className="search-dd-trending">
                          {l2Cats.slice(0, 5).map((c, i) => (
                            <button key={c.id} className="search-dd-trend-tag" onClick={() => setQuery(c.name)} onMouseMove={handleItemMouse} style={{ '--delay': `${i * 40}ms` } as React.CSSProperties}>
                              <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="search-dd-section">
                        <div className="search-dd-label"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> Subcategories</div>
                        {l3Cats.slice(0, 5).map((c, i) => (
                          <div key={c.id} className="search-dd-item search-dd-item--cat" onClick={() => goToCategory(c.slug)} onMouseMove={handleItemMouse} style={{ '--delay': `${i * 50}ms` } as React.CSSProperties}>
                            <div className="search-dd-cat-dot" style={{ background: meta.color }} />
                            <span className="search-dd-cat-name">{c.name}</span>
                            <svg className="search-dd-item-arrow" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {q.length > 0 && (
                    <>
                      <div className="search-dd-searching">
                        <div className="search-dd-ripple"><span /><span /><span /></div>
                        <span className="search-dd-searching-text">{totalResults > 0 ? `${totalResults} results found` : 'Searching...'}</span>
                      </div>
                      {filtered.length > 0 && (
                        <div className="search-dd-section">
                          <div className="search-dd-label"><svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></svg> Listings</div>
                          {filtered.map((d, i) => (
                            <div key={i} className={`search-dd-item${activeIdx === i ? ' search-dd-item--active' : ''}`} onClick={() => goToResult(d.slug, d.listingMode)} onMouseEnter={() => setActiveIdx(i)} onMouseMove={handleItemMouse} style={{ '--delay': `${i * 50}ms` } as React.CSSProperties}>
                              <div className="search-dd-item-icon" style={{ background: d.logoUrl ? 'transparent' : `${d.color}1a` }}>
                                {d.logoUrl ? (
                                  <img src={d.logoUrl} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }} />
                                ) : (
                                  <svg viewBox="0 0 24 24" stroke={d.color} fill="none" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                                )}
                              </div>
                              <div className="search-dd-item-info">
                                <div className="search-dd-item-name">{highlightMatch(d.name, q)}{d.isReal && <span style={{ marginLeft: 6, fontSize: '.55rem', fontWeight: 600, color: '#2FAE6A', verticalAlign: 'middle' }}>LIVE</span>}</div>
                                <div className="search-dd-item-cat">{d.category}</div>
                              </div>
                              <div className="search-dd-item-rating">
                                <svg viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                <span>{d.score}</span>
                              </div>
                              <svg className="search-dd-item-arrow" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </div>
                          ))}
                        </div>
                      )}
                      {matchedCats.length > 0 && (
                        <div className="search-dd-section">
                          <div className="search-dd-label"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> Categories</div>
                          {matchedCats.map((c, i) => (
                            <div key={c.id} className={`search-dd-item search-dd-item--cat${activeIdx === filtered.length + i ? ' search-dd-item--active' : ''}`} onClick={() => goToCategory(c.slug)} onMouseEnter={() => setActiveIdx(filtered.length + i)} onMouseMove={handleItemMouse} style={{ '--delay': `${(filtered.length + i) * 50}ms` } as React.CSSProperties}>
                              <div className="search-dd-cat-dot" style={{ background: meta.color }} />
                              <span className="search-dd-cat-name">{highlightMatch(c.name, q)}</span>
                              <svg className="search-dd-item-arrow" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </div>
                          ))}
                        </div>
                      )}
                      {totalResults === 0 && q.length > 1 && (
                        <div className="search-dd-empty">
                          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                          <span>No results for &ldquo;{query}&rdquo;</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Colorful pills */}
          <div className="hero-cats">
            {heroCats.map((cat, i) => (
              <div key={cat.slug + i} ref={el => { catEls.current[i] = el }} className="hero-cat" style={{ background: cat.color, color: cat.text }} onPointerDown={e => catDown(e, i)} onPointerMove={e => catMove(e, i)} onPointerUp={e => catUp(e, i)}>
                {cat.name}
              </div>
            ))}
          </div>

          {/* Trust bar */}
          <div className="hero-trust-bar">
            <div className="hero-trust-item" style={{ '--ti': '0' } as React.CSSProperties}>
              <span className="hero-trust-icon" style={{ background: '#2FAE6A' }}><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></svg></span>
              <span className="hero-trust-text">Verified Reviews</span>
            </div>
            <div className="hero-trust-item" style={{ '--ti': '1' } as React.CSSProperties}>
              <span className="hero-trust-icon" style={{ background: '#4361EE' }}><svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg></span>
              <span className="hero-trust-text">Dofollow Backlinks</span>
            </div>
            <div className="hero-trust-item" style={{ '--ti': '2' } as React.CSSProperties}>
              <span className="hero-trust-icon" style={{ background: '#E8553D' }}><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg></span>
              <span className="hero-trust-text">Updated Daily</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: 3D card stack ── */}
        <div className="hero-right">
          <div className="hr-bg" aria-hidden="true">
            {heroReviews.map((r, i) => (
              <img key={i} src={r.img} alt="" className={`hr-bg-img${(i - topCard + heroReviews.length) % heroReviews.length === 0 ? ' hr-bg-img--active' : ''}`} draggable={false} />
            ))}
          </div>
          <div className="hr-stack">
            {heroReviews.map((r, i) => {
              const pos = (i - topCard + heroReviews.length) % heroReviews.length
              return (
                <div key={i} ref={el => { stackRefs.current[i] = el }} className="hr-scard" style={{ zIndex: heroReviews.length - pos, transform: pos < 3 ? `translateY(${pos * 16}px) scale(${1 - pos * 0.05})` : 'translateY(48px) scale(.85)', opacity: pos < 3 ? 1 - pos * 0.15 : 0, pointerEvents: pos === 0 ? 'auto' : 'none' }} onPointerDown={pos === 0 ? swStart : undefined} onPointerMove={pos === 0 ? swMove : undefined} onPointerUp={pos === 0 ? swEnd : undefined} onPointerCancel={pos === 0 ? swCancel : undefined}>
                  <div className="hr-sc-top"><img src={r.img} alt={r.business} draggable={false} /><span className="hr-sc-badge" style={{ background: r.badge === 'Featured' ? 'var(--h-accent)' : 'var(--emerald)' }}>{r.badge}</span></div>
                  <div className="hr-sc-body">
                    <div className="hr-sc-meta"><span className="hr-sc-cat" style={{ background: `${r.color}12`, color: r.color }}>{r.category}</span></div>
                    <div className="hr-sc-title">{r.business}</div>
                    <div className="hr-sc-tagline">{r.tagline}</div>
                    <div className="hr-sc-rating">
                      <div className="hr-sc-stars">{[...Array(5)].map((_, j) => <svg key={j} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}</div>
                      <span className="hr-sc-score">{r.score}</span>
                      <span className="hr-sc-revcount">({r.reviews})</span>
                    </div>
                  </div>
                  <div className="hr-sc-actions">
                    <div className="hr-sc-act"><svg viewBox="0 0 24 24"><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg><span>{r.votes}</span></div>
                    <div className="hr-sc-act"><svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg></div>
                    <div className="hr-sc-act"><svg viewBox="0 0 24 24"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" /><path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" /></svg></div>
                    <div className="hr-sc-act"><svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg></div>
                    <div className="hr-sc-act hr-sc-act--end"><svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg></div>
                  </div>
                  <div className="hr-sc-review">
                    <div className="hr-sc-quote">&ldquo;{r.text}&rdquo;</div>
                    <div className="hr-sc-author"><div className="hr-sc-avatar" style={{ background: r.color }}>{r.avatar}</div><div className="hr-sc-ainfo"><span className="hr-sc-aname">{r.author}</span><span className="hr-sc-arole">{r.role}</span></div></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function highlightMatch(text: string, query: string) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return <>{text.slice(0, idx)}<mark className="search-dd-highlight">{text.slice(idx, idx + query.length)}</mark>{text.slice(idx + query.length)}</>
}
