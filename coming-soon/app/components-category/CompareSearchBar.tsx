'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface CompanyHit {
  id: number
  slug: string
  companyName: string
  tagline: string | null
  logoUrl: string | null
  category: { name: string | null; slug: string | null; color: string | null } | null
  ratingAvg: number
  ratingCount: number
}

interface Props {
  /** Slug of the listing initiating the compare flow — excluded from results
   *  and used as the first slug in the resulting compare URL. */
  fromSlug: string
  /** L1 sector slug — restricts results so a SaaS listing never shows local
   *  businesses in its compare search. Required by product spec. */
  sectorSlug: string
  /** Listing mode of the initiating card. 'product' (default) keeps the
   *  original product behaviour exactly — searches products and routes to
   *  /compare. 'company' searches companies (mode=company) and routes to
   *  /compare-companies, so a product is never paired with a company. */
  mode?: 'product' | 'company'
  /** Called when the user closes the search (clicks the X). */
  onClose: () => void
}

/**
 * Inline search bar that replaces the Compare/Save buttons on a listing card
 * when the user clicks Compare. Type a company name → see matches in the
 * same L1 sector → pick one → navigate to /compare/{fromSlug}-vs-{pickedSlug}.
 *
 * Debounced ~180ms, hits /api/search/companies?q=…&sector=…&exclude=…
 * (the endpoint already supports both filters). Up to 8 matches in the
 * dropdown; arrow-key navigation + Enter to pick the highlighted row.
 */
export default function CompareSearchBar({ fromSlug, sectorSlug, mode = 'product', onClose }: Props) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [results, setResults] = useState<CompanyHit[]>([])
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  /* Autofocus the input the moment the bar mounts so the user starts typing
     immediately after clicking Compare — no extra click required. */
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  /* Outside-click → close. */
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [onClose])

  /* Debounced fetch — 180ms after last keystroke. Min 1 char so first letter
     immediately surfaces the most popular match in that sector. */
  useEffect(() => {
    const trimmed = q.trim()
    if (trimmed.length === 0) { setResults([]); setLoading(false); return }
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: trimmed, sector: sectorSlug, exclude: fromSlug, mode })
        const res = await fetch(`/api/search/companies?${params.toString()}`)
        const data = await res.json()
        const list: CompanyHit[] = Array.isArray(data?.results) ? data.results : []
        setResults(list)
        setActive(0)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 180)
    return () => clearTimeout(t)
  }, [q, sectorSlug, fromSlug])

  const pick = (hit: CompanyHit) => {
    if (!hit?.slug) return
    const base = mode === 'company' ? '/compare-companies' : '/compare'
    router.push(`${base}/${fromSlug}-vs-${hit.slug}`)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
    if (results.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); return }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); return }
    if (e.key === 'Enter')     { e.preventDefault(); pick(results[active]); return }
  }

  return (
    <div className="cd-lc-cmp" ref={wrapRef}>
      <div className="cd-lc-cmp-bar">
        <svg className="cd-lc-cmp-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="cd-lc-cmp-input"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search a company to compare…"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          className="cd-lc-cmp-close"
          onClick={onClose}
          aria-label="Cancel compare"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {q.trim().length > 0 && (
        <div className="cd-lc-cmp-drop" role="listbox">
          {loading && results.length === 0 && (
            <div className="cd-lc-cmp-empty">Searching…</div>
          )}
          {!loading && results.length === 0 && (
            <div className="cd-lc-cmp-empty">No matches in this sector.</div>
          )}
          {results.map((r, i) => (
            <button
              key={r.id}
              type="button"
              role="option"
              aria-selected={i === active}
              className={'cd-lc-cmp-hit' + (i === active ? ' cd-lc-cmp-hit--active' : '')}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(r)}
            >
              <span className="cd-lc-cmp-hit-logo">
                {r.logoUrl
                  ? <img src={r.logoUrl} alt="" />
                  : <span>{r.companyName.charAt(0).toUpperCase()}</span>}
              </span>
              <span className="cd-lc-cmp-hit-body">
                <span className="cd-lc-cmp-hit-name">{r.companyName}</span>
                {r.tagline && <span className="cd-lc-cmp-hit-tag">{r.tagline}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
