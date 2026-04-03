'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from './CountryLink'
import { HugeiconsIcon } from '@hugeicons/react'
import { SearchVisualIcon, Cancel01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'

type CategoryResult = {
  id: number; name: string; slug: string; level: number;
  color: string; icon: string; parent_name: string | null;
  listing_count: number
}
type ListingResult = {
  id: number; slug: string; company_name: string; tagline: string;
  logo_url: string; category_name: string; category_slug: string; category_color: string
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
  const ref = useRef<HTMLDivElement>(null)
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined)

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
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
            : <HugeiconsIcon icon={SearchVisualIcon} size={22} color="#1A1A1A" strokeWidth={2} />
          }
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => { if (results) setOpen(true) }}
        />
        {query && (
          <button className="gs-clear" onClick={clear} aria-label="Clear" type="button">
            <HugeiconsIcon icon={Cancel01Icon} size={14} color="currentColor" strokeWidth={2} />
          </button>
        )}
        <button className="pn-search-btn" type="button" onClick={() => search(query.trim())}>Search</button>
      </div>

      {/* Dropdown */}
      {open && (hasResults || noResults) && (
        <div className="gs-dropdown">
          {/* Categories */}
          {results!.categories.length > 0 && (
            <div className="gs-section">
              <div className="gs-section-label">Categories</div>
              {results!.categories.map(cat => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="gs-row" onClick={close}>
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
                <Link key={l.id} href={`/company/${l.slug}`} className="gs-row" onClick={close}>
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
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="currentColor" strokeWidth={2} />
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
