'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════════════
   /test-category-1-page hero — clone of /test-landing-page's hero.

   Same .tlp-* classes, same layout, same headline + sub copy. The ONLY
   functional difference is the search: every /api/search call passes
   `sector=ai-ml` so the dropdown surfaces only AI/ML categories, AI/ML
   listings (companies + products), and blog hits.

   The submit (Enter or Search button) navigates to /search?q=…&sector=ai-ml
   so the dedicated results page stays scoped to AI/ML (the dropdown is
   already sector-scoped via the same `sector` param on /api/search).
   ═══════════════════════════════════════════════════════════════════════ */

const SECTOR = 'ai-ml'

type CategoryHit = {
  id: number; name: string; slug: string; level: number;
  color: string; sector_slug: string | null; parent_name: string | null;
  listing_count: number
}
type ListingHit = {
  id: number; slug: string; company_name: string; tagline: string;
  logo_url: string; category_name: string; category_color: string;
  listing_mode?: 'product' | 'company' | string
}
type BlogHit = { id: number; slug: string; title: string; author: string }
type Results = { categories: CategoryHit[]; listings: ListingHit[]; blog: BlogHit[] }

export default function HeroSearchClient() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(debounce.current), [])

  /* Click outside closes the dropdown (but keeps the field focused). */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  /* Keyboard shortcuts:
       - Esc          → collapse the dropdown & blur the input
       - Ctrl/⌘ + K   → focus + select the hero search input from anywhere
                         on the page. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); return }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        const el = inputRef.current
        if (el) { el.focus(); el.select() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const fetchResults = useCallback(async (term: string) => {
    if (term.length < 2) { setResults(null); setOpen(false); return }
    setLoading(true)
    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(term)}&sector=${SECTOR}`)
      const j = await r.json()
      if (j.ok) { setResults(j.results); setOpen(true) }
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  const onChange = (v: string) => {
    setQ(v)
    clearTimeout(debounce.current)
    if (v.trim().length < 2) { setResults(null); setOpen(false); return }
    debounce.current = setTimeout(() => fetchResults(v.trim()), 220)
  }

  const clear = () => { setQ(''); setResults(null); setOpen(false); inputRef.current?.focus() }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    if (!term) { inputRef.current?.focus(); return }
    router.push(`/search?q=${encodeURIComponent(term)}&sector=${SECTOR}`)
  }

  const hl = (text: string) => {
    if (!q.trim()) return text
    const idx = text.toLowerCase().indexOf(q.toLowerCase())
    if (idx === -1) return text
    return <>{text.slice(0, idx)}<mark className="tlp-hl">{text.slice(idx, idx + q.length)}</mark>{text.slice(idx + q.length)}</>
  }

  const hasResults = results && (results.categories.length || results.listings.length || results.blog.length)
  const noResults = results && !hasResults

  return (
    <section className="tlp-hero" aria-label="Search InfoWebWorld">
      <div className="tlp-hero-bg" aria-hidden="true">
        <div className="tlp-hero-glow" />
        <div className="tlp-hero-grid" />
      </div>

      <div className="tlp-hero-inner">
        <h1 className="tlp-hero-title">
          Find and compare the best AI tools, agents, and models.
        </h1>
        <p className="tlp-hero-sub">
          Verified buyer reviews across 1,295+ AI &amp; ML categories — chatbots, copilots, image &amp; video generators, agents, and more. Honest, moderated, and never paid for.
        </p>

        <div className="tlp-hero-search" ref={wrapRef}>
          <form className={'tlp-hsr' + ((focused || open) ? ' tlp-hsr--on' : '')} onSubmit={onSubmit} role="search">
            <span className="tlp-hsr-ico" aria-hidden="true">
              {loading ? (
                <span className="tlp-hsr-spin" />
              ) : (
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
                </svg>
              )}
            </span>
            <input
              ref={inputRef}
              type="text"
              className="tlp-hsr-input"
              placeholder="Search AI tools, agents, models, categories…"
              value={q}
              onChange={e => onChange(e.target.value)}
              onFocus={() => { setFocused(true); if (results) setOpen(true) }}
              onBlur={() => setFocused(false)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Search"
            />
            {q && (
              <button type="button" className="tlp-hsr-clear" onClick={clear} aria-label="Clear">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <button type="submit" className="tlp-hsr-go" aria-label="Search">
              <span>Search</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
                   strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          {open && (hasResults || noResults) && (
            <div className="tlp-hsr-pop" role="listbox">
              {results!.listings.length > 0 && (
                <div className="tlp-hsr-sec">
                  <div className="tlp-hsr-sec-lbl">Companies</div>
                  {results!.listings.map(l => (
                    <Link
                      key={l.id}
                      href={(l.listing_mode === 'company' ? '/profile/' : '/listing/') + l.slug}
                      className="tlp-hsr-row"
                      onClick={() => setOpen(false)}
                    >
                      {l.logo_url
                        ? <img src={l.logo_url} alt="" className="tlp-hsr-row-logo" />
                        : <span className="tlp-hsr-row-logo tlp-hsr-row-logo--ph">{(l.company_name || '?').slice(0, 2).toUpperCase()}</span>}
                      <span className="tlp-hsr-row-text">
                        <span className="tlp-hsr-row-name">{hl(l.company_name)}</span>
                        {l.tagline && <span className="tlp-hsr-row-sub">{l.tagline}</span>}
                      </span>
                      {l.category_name && <span className="tlp-hsr-row-tag">{l.category_name}</span>}
                    </Link>
                  ))}
                </div>
              )}

              {results!.categories.length > 0 && (
                <div className="tlp-hsr-sec">
                  <div className="tlp-hsr-sec-lbl">Categories</div>
                  {results!.categories.map(c => (
                    <Link
                      key={c.id}
                      href={c.sector_slug ? `/${c.sector_slug}/${c.slug}` : `/${c.slug}`}
                      className="tlp-hsr-row"
                      onClick={() => setOpen(false)}
                    >
                      <span className="tlp-hsr-row-dot" style={{ background: c.color || '#003B2A' }} />
                      <span className="tlp-hsr-row-text">
                        <span className="tlp-hsr-row-name">{hl(c.name)}</span>
                        {c.parent_name && <span className="tlp-hsr-row-sub">in {c.parent_name}</span>}
                      </span>
                      <span className="tlp-hsr-row-tag tlp-hsr-row-tag--soft">
                        {c.listing_count > 0 ? `${c.listing_count} listings` : 'Browse'}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {results!.blog.length > 0 && (
                <div className="tlp-hsr-sec">
                  <div className="tlp-hsr-sec-lbl">Articles</div>
                  {results!.blog.map(b => (
                    <Link key={b.id} href={`/blog/${b.slug}`} className="tlp-hsr-row" onClick={() => setOpen(false)}>
                      <span className="tlp-hsr-row-dot tlp-hsr-row-dot--article" />
                      <span className="tlp-hsr-row-text">
                        <span className="tlp-hsr-row-name">{hl(b.title)}</span>
                        {b.author && <span className="tlp-hsr-row-sub">by {b.author}</span>}
                      </span>
                      <span className="tlp-hsr-row-tag tlp-hsr-row-tag--soft">Article</span>
                    </Link>
                  ))}
                </div>
              )}

              {noResults && (
                <div className="tlp-hsr-empty">
                  No results for <strong>&ldquo;{q}&rdquo;</strong>
                  <span>Press Enter to see all matches across the directory.</span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
