'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { I, ic } from './icons'

/** Render the keyboard shortcut hint with the correct modifier for the user's
 *  platform — ⌘K on macOS, Ctrl K everywhere else. Set on mount so SSR markup
 *  stays platform-agnostic. */
function useShortcutLabel() {
  const [label, setLabel] = useState<'Ctrl K' | '\u2318 K'>('Ctrl K')
  useEffect(() => {
    if (typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)) {
      setLabel('\u2318 K')
    }
  }, [])
  return label
}

type CategoryResult = {
  id: number; name: string; slug: string; level: number;
  color: string; icon: string; parent_name: string | null;
  listing_count: number; sector_slug: string | null
}
type ListingResult = {
  id: number; slug: string; company_name: string; tagline: string;
  logo_url: string; category_name: string; category_slug: string; category_color: string
  /** S37: present when the search API includes it; absent on legacy responses
   *  → falls back to /company prefix (the original behaviour). */
  listing_mode?: 'product' | 'company' | string
}
type BlogResult = {
  id: number; slug: string; title: string; excerpt: string;
  cover_image: string; author: string; category: string
}
type Results = { categories: CategoryResult[]; listings: ListingResult[]; blog: BlogResult[] }

const LEVEL_LABELS: Record<number, string> = { 1: 'Sector', 2: 'Category', 3: 'Subcategory' }

export default function GlobalSearch({ placeholder = 'Search businesses, tools, categories' }: { placeholder?: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined)
  const shortcut = useShortcutLabel()

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* Close on Escape, focus on Ctrl+K / Cmd+K */
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  /* Clear debounce timer on unmount */
  useEffect(() => {
    return () => clearTimeout(debounce.current)
  }, [])

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); setOpen(false); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (data.ok) {
        setResults(data.results)
        setOpen(true)
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  const handleChange = (val: string) => {
    setQuery(val)
    clearTimeout(debounce.current)
    if (val.trim().length < 2) { setResults(null); setOpen(false); return }
    debounce.current = setTimeout(() => search(val.trim()), 250)
  }

  const clear = () => { setQuery(''); setResults(null); setOpen(false) }
  const close = () => setOpen(false)

  const hasResults = results && (results.categories.length || results.listings.length || results.blog.length)
  const noResults = results && !hasResults

  /* Highlight matching text */
  const hl = (text: string) => {
    if (!query.trim()) return text
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return text
    return <>{text.slice(0, idx)}<mark className="gs-hl">{text.slice(idx, idx + query.length)}</mark>{text.slice(idx + query.length)}</>
  }

  return (
    <div className="gs-wrap" ref={ref}>
      <div className={`pn-search${open ? ' pn-search--active' : ''}`}>
        <span className="pn-search-icon">
          {loading
            ? <span className="gs-spinner" />
            : <I d={ic.search} size={22} color="#1A1A1A" sw={2} />
          }
        </span>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => { setFocused(true); if (results) setOpen(true) }}
          onBlur={() => setFocused(false)}
        />
        {query && (
          <button className="gs-clear" onClick={clear} aria-label="Clear" type="button">
            <I d={ic.x} size={14} color="currentColor" sw={2} />
          </button>
        )}
        {!query && !focused && (
          <kbd className="pn-search-kbd" aria-hidden="true">{shortcut}</kbd>
        )}
      </div>

      {/* Dropdown */}
      {open && (hasResults || noResults) && (
        <div className="gs-dropdown">
          {/* Categories */}
          {results!.categories.length > 0 && (
            <div className="gs-section">
              <div className="gs-section-label">Categories</div>
              {results!.categories.map(cat => (
                <Link key={cat.id} href={cat.sector_slug ? `/${cat.sector_slug}/${cat.slug}` : `/${cat.slug}`} className="gs-row" onClick={close}>
                  <span className="gs-row-dot" style={{ background: cat.color || '#E8553D' }} />
                  <span className="gs-row-name">{hl(cat.name)}</span>
                  {cat.parent_name && <span className="gs-row-trail">{cat.parent_name}</span>}
                  <span className="gs-row-badge">{LEVEL_LABELS[cat.level] || `L${cat.level}`}</span>
                  {cat.listing_count > 0 && (
                    <span className="gs-row-count">{cat.listing_count}</span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Listings */}
          {results!.listings.length > 0 && (
            <div className="gs-section">
              <div className="gs-section-label">Companies</div>
              {results!.listings.map(l => (
                <Link key={l.id} href={(l.listing_mode === 'company' ? '/profile/' : '/company/') + l.slug} className="gs-row" onClick={close}>
                  {l.logo_url ? (
                    <img src={l.logo_url} alt="" className="gs-row-logo" />
                  ) : (
                    <span className="gs-row-initial" style={{ background: l.category_color || '#E8553D' }}>
                      {l.company_name[0]}
                    </span>
                  )}
                  <span className="gs-row-info">
                    <span className="gs-row-name">{hl(l.company_name)}</span>
                    {l.tagline && <span className="gs-row-sub">{l.tagline}</span>}
                  </span>
                  {l.category_name && <span className="gs-row-trail">{l.category_name}</span>}
                  <span className="gs-row-arrow">
                    <I d={ic.arrow} size={14} color="currentColor" sw={2} />
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Blog */}
          {results!.blog.length > 0 && (
            <div className="gs-section">
              <div className="gs-section-label">Blog</div>
              {results!.blog.map(b => (
                <Link key={b.id} href={`/blog/${b.slug}`} className="gs-row" onClick={close}>
                  <span className="gs-row-dot" style={{ background: '#3B82F6' }} />
                  <span className="gs-row-info">
                    <span className="gs-row-name">{hl(b.title)}</span>
                    {b.author && <span className="gs-row-sub">by {b.author}</span>}
                  </span>
                  <span className="gs-row-badge" style={{ color: '#3B82F6', background: '#EFF6FF' }}>Article</span>
                </Link>
              ))}
            </div>
          )}

          {/* No results */}
          {noResults && (
            <div className="gs-empty">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  )
}
