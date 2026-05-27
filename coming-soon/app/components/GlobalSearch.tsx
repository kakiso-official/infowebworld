'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'

/* ════════════════════════════════════════════════════════════════════
   Header search — clean rewrite matching the new .iw-* header design.

   Single input + dropdown card with three sections (Categories, Companies,
   Blog). Debounced, keyboard-navigable, click-outside / Esc to close.

   Sole consumer: app/components/Navbar.tsx. The old `.gs-*` / `.pn-search`
   class names from the previous design are gone — new `.iw-srch-*`
   namespace lives in app/styles/header.css.
   ════════════════════════════════════════════════════════════════════ */

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
  listing_mode?: 'product' | 'company' | string
}
type BlogResult = {
  id: number; slug: string; title: string; excerpt: string;
  cover_image: string; author: string; category: string
}
type Results = { categories: CategoryResult[]; listings: ListingResult[]; blog: BlogResult[] }

const LEVEL_LABELS: Record<number, string> = { 1: 'Sector', 2: 'Category', 3: 'Subcategory' }

interface Props {
  placeholder?: string
  /** When true, autofocus the input on mount (used by the header expand
   *  button and the mobile sheet). */
  autoFocus?: boolean
  /** Mobile sheet renders results inline (full width, no shadow). */
  inline?: boolean
}

export default function GlobalSearch({
  placeholder = 'Search businesses, tools, categories',
  autoFocus = false,
  inline = false,
}: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined)
  const shortcut = useShortcutLabel()

  useEffect(() => {
    if (autoFocus) {
      /* defer one frame so the parent transition doesn't steal focus */
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
  }, [autoFocus])

  /* Outside click closes dropdown (not the parent expand). */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  /* Esc closes, Ctrl/⌘+K focuses. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur() }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => () => clearTimeout(debounce.current), [])

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
    debounce.current = setTimeout(() => search(val.trim()), 220)
  }

  const clear = () => {
    setQuery('')
    setResults(null)
    setOpen(false)
    inputRef.current?.focus()
  }
  const close = () => setOpen(false)

  const hasResults = results && (results.categories.length || results.listings.length || results.blog.length)
  const noResults = results && !hasResults

  const hl = (text: string) => {
    if (!query.trim()) return text
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return text
    return <>{text.slice(0, idx)}<mark className="iw-srch-hl">{text.slice(idx, idx + query.length)}</mark>{text.slice(idx + query.length)}</>
  }

  return (
    <div className={'iw-srch' + (inline ? ' iw-srch--inline' : '')} ref={wrapRef}>
      <div className={'iw-srch-field' + (focused || open ? ' iw-srch-field--on' : '')}>
        <span className="iw-srch-leading" aria-hidden="true">
          {loading ? (
            <span className="iw-srch-spin" />
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
            </svg>
          )}
        </span>
        <input
          ref={inputRef}
          type="text"
          className="iw-srch-input"
          placeholder={placeholder}
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => { setFocused(true); if (results) setOpen(true) }}
          onBlur={() => setFocused(false)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {query ? (
          <button type="button" className="iw-srch-clear" onClick={clear} aria-label="Clear search">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : !focused && !inline && (
          <kbd className="iw-srch-kbd" aria-hidden="true">{shortcut}</kbd>
        )}
      </div>

      {open && (hasResults || noResults) && (
        <div className="iw-srch-pop" role="listbox">
          {results!.listings.length > 0 && (
            <div className="iw-srch-sec">
              <div className="iw-srch-sec-lbl">Companies</div>
              {results!.listings.map(l => (
                <Link
                  key={l.id}
                  href={(l.listing_mode === 'company' ? '/profile/' : '/listing/') + l.slug}
                  className="iw-srch-row"
                  onClick={close}
                  role="option"
                >
                  {l.logo_url ? (
                    <img src={l.logo_url} alt="" className="iw-srch-row-logo" />
                  ) : (
                    <span className="iw-srch-row-logo iw-srch-row-logo--ph">
                      {(l.company_name || '?').slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <span className="iw-srch-row-text">
                    <span className="iw-srch-row-name">{hl(l.company_name)}</span>
                    {l.tagline && <span className="iw-srch-row-sub">{l.tagline}</span>}
                  </span>
                  {l.category_name && (
                    <span className="iw-srch-row-tag">{l.category_name}</span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {results!.categories.length > 0 && (
            <div className="iw-srch-sec">
              <div className="iw-srch-sec-lbl">Categories</div>
              {results!.categories.map(cat => (
                <Link
                  key={cat.id}
                  href={cat.sector_slug ? `/${cat.sector_slug}/${cat.slug}` : `/${cat.slug}`}
                  className="iw-srch-row"
                  onClick={close}
                  role="option"
                >
                  <span className="iw-srch-row-dot" style={{ background: cat.color || '#003B2A' }} />
                  <span className="iw-srch-row-text">
                    <span className="iw-srch-row-name">{hl(cat.name)}</span>
                    {cat.parent_name && <span className="iw-srch-row-sub">in {cat.parent_name}</span>}
                  </span>
                  <span className="iw-srch-row-tag iw-srch-row-tag--soft">
                    {LEVEL_LABELS[cat.level] || `L${cat.level}`}
                    {cat.listing_count > 0 && <> · {cat.listing_count}</>}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {results!.blog.length > 0 && (
            <div className="iw-srch-sec">
              <div className="iw-srch-sec-lbl">Articles</div>
              {results!.blog.map(b => (
                <Link
                  key={b.id}
                  href={`/blog/${b.slug}`}
                  className="iw-srch-row"
                  onClick={close}
                  role="option"
                >
                  <span className="iw-srch-row-dot iw-srch-row-dot--article" />
                  <span className="iw-srch-row-text">
                    <span className="iw-srch-row-name">{hl(b.title)}</span>
                    {b.author && <span className="iw-srch-row-sub">by {b.author}</span>}
                  </span>
                  <span className="iw-srch-row-tag iw-srch-row-tag--soft">Article</span>
                </Link>
              ))}
            </div>
          )}

          {noResults && (
            <div className="iw-srch-empty">
              No results for <strong>&ldquo;{query}&rdquo;</strong>
              <span className="iw-srch-empty-sub">Try a shorter or more general term.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
