'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════════════
   /search page search bar.

   Reuses the .tlp-hsr-* field + dropdown from the landing/sector hero
   searches so the bar reads identically to the ones that navigate here.

   Differences:
     - Pre-filled from the current ?q= (kept in sync on RSC navigation).
     - Submit (Enter / Search button) pushes /search?q=… preserving the
       active sector scope, rather than the hero's one-shot /search jump.
     - Arrow-key navigation across the flat list of dropdown rows; Enter on a
       highlighted row opens it, Enter otherwise runs the full search.
     - A "See all results" footer button inside the dropdown.
   ═══════════════════════════════════════════════════════════════════════ */

type CategoryHit = {
  id: number; name: string; slug: string; level: number
  color: string; sector_slug: string | null; parent_name: string | null
  listing_count: number
}
type ListingHit = {
  id: number; slug: string; company_name: string; tagline: string
  logo_url: string; category_name: string; category_color: string
  listing_mode?: 'product' | 'company' | string
}
type BlogHit = { id: number; slug: string; title: string; author: string }
type Results = { categories: CategoryHit[]; listings: ListingHit[]; blog: BlogHit[] }

type Props = {
  initialQuery?: string
  /** Active L1 sector slug — scopes both the live dropdown and submit. */
  initialSector?: string | null
  autoFocus?: boolean
}

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
  </svg>
)

export default function SearchBar({ initialQuery = '', initialSector = null, autoFocus = false }: Props) {
  const router = useRouter()
  const [q, setQ] = useState(initialQuery)
  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined)

  const sectorQS = initialSector ? `&sector=${encodeURIComponent(initialSector)}` : ''

  /* Keep the field in sync when an RSC navigation lands on a new ?q=. */
  useEffect(() => { setQ(initialQuery) }, [initialQuery])

  useEffect(() => () => clearTimeout(debounce.current), [])

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

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
      const r = await fetch(`/api/search?q=${encodeURIComponent(term)}${sectorQS}`)
      const j = await r.json()
      if (j.ok) { setResults(j.results); setOpen(true) }
    } catch { /* ignore */ }
    setLoading(false)
  }, [sectorQS])

  const onChange = (v: string) => {
    setQ(v)
    setActiveIdx(-1)
    clearTimeout(debounce.current)
    if (v.trim().length < 2) { setResults(null); setOpen(false); return }
    debounce.current = setTimeout(() => fetchResults(v.trim()), 200)
  }

  /* Flat, ordered list of every dropdown row's href — backs arrow-key nav. */
  const flat = useMemo<string[]>(() => {
    if (!results) return []
    return [
      ...results.listings.map(l => (l.listing_mode === 'company' ? '/profile/' : '/listing/') + l.slug),
      ...results.categories.map(c => (c.sector_slug ? `/${c.sector_slug}/${c.slug}` : `/${c.slug}`)),
      ...results.blog.map(b => `/blog/${b.slug}`),
    ]
  }, [results])

  const submit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault()
    const term = q.trim()
    if (!term) { inputRef.current?.focus(); return }
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(term)}${sectorQS}`)
  }, [q, sectorQS, router])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || flat.length === 0) {
      if (e.key === 'Enter') submit()
      return
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(p => (p + 1) % flat.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(p => (p - 1 + flat.length) % flat.length) }
    else if (e.key === 'Enter') {
      if (activeIdx >= 0 && activeIdx < flat.length) { e.preventDefault(); setOpen(false); router.push(flat[activeIdx]) }
      else submit()
    }
  }

  const clear = () => { setQ(''); setResults(null); setOpen(false); setActiveIdx(-1); inputRef.current?.focus() }

  const hl = (text: string) => {
    const term = q.trim()
    if (!term) return text
    const i = text.toLowerCase().indexOf(term.toLowerCase())
    if (i === -1) return text
    return <>{text.slice(0, i)}<mark className="tlp-hl">{text.slice(i, i + term.length)}</mark>{text.slice(i + term.length)}</>
  }

  const hasResults = results && (results.categories.length || results.listings.length || results.blog.length)
  const noResults = results && !hasResults
  let idx = -1

  return (
    <div className="tlp-hero-search srch-hero-search" ref={wrapRef}>
      <form className={'tlp-hsr' + ((focused || open) ? ' tlp-hsr--on' : '')} onSubmit={submit} role="search">
        <span className="tlp-hsr-ico" aria-hidden="true">
          {loading ? <span className="tlp-hsr-spin" /> : <SearchIcon />}
        </span>
        <input
          ref={inputRef}
          type="text"
          className="tlp-hsr-input"
          placeholder={initialSector ? 'Search within this sector…' : 'Search companies, categories, articles…'}
          value={q}
          onChange={e => onChange(e.target.value)}
          onFocus={() => { setFocused(true); if (results && q.trim().length >= 2) setOpen(true) }}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
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
              {results!.listings.map(l => {
                idx++; const i = idx
                return (
                  <Link
                    key={l.id}
                    href={(l.listing_mode === 'company' ? '/profile/' : '/listing/') + l.slug}
                    className={'tlp-hsr-row' + (i === activeIdx ? ' tlp-hsr-row--active' : '')}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setActiveIdx(i)}
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
                )
              })}
            </div>
          )}

          {results!.categories.length > 0 && (
            <div className="tlp-hsr-sec">
              <div className="tlp-hsr-sec-lbl">Categories</div>
              {results!.categories.map(c => {
                idx++; const i = idx
                return (
                  <Link
                    key={c.id}
                    href={c.sector_slug ? `/${c.sector_slug}/${c.slug}` : `/${c.slug}`}
                    className={'tlp-hsr-row' + (i === activeIdx ? ' tlp-hsr-row--active' : '')}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setActiveIdx(i)}
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
                )
              })}
            </div>
          )}

          {results!.blog.length > 0 && (
            <div className="tlp-hsr-sec">
              <div className="tlp-hsr-sec-lbl">Articles</div>
              {results!.blog.map(b => {
                idx++; const i = idx
                return (
                  <Link
                    key={b.id}
                    href={`/blog/${b.slug}`}
                    className={'tlp-hsr-row' + (i === activeIdx ? ' tlp-hsr-row--active' : '')}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setActiveIdx(i)}
                  >
                    <span className="tlp-hsr-row-dot tlp-hsr-row-dot--article" />
                    <span className="tlp-hsr-row-text">
                      <span className="tlp-hsr-row-name">{hl(b.title)}</span>
                      {b.author && <span className="tlp-hsr-row-sub">by {b.author}</span>}
                    </span>
                    <span className="tlp-hsr-row-tag tlp-hsr-row-tag--soft">Article</span>
                  </Link>
                )
              })}
            </div>
          )}

          {hasResults && (
            <button type="button" className="srch-pop-all" onClick={() => submit()}>
              See all results for &ldquo;{q.trim()}&rdquo;
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"
                   strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          )}

          {noResults && (
            <div className="tlp-hsr-empty">
              No results for <strong>&ldquo;{q}&rdquo;</strong>
              <span>Press Enter to search the full directory.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
