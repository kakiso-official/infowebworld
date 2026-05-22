'use client'

import { useEffect, useRef, useState } from 'react'

export type CompanyHit = {
  id: number
  slug: string
  companyName: string
  tagline: string | null
  logoUrl: string | null
  category: { name: string | null; slug: string | null; color: string | null } | null
  ratingAvg: number
  ratingCount: number
}

/* Debounced search box + result list. Hits /api/search/companies which
   restricts to active/paid PRODUCT submissions and returns ≤8 hits. */
export default function CompanyPicker({ onPick }: { onPick: (c: CompanyHit) => void }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<CompanyHit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    clearTimeout(debounce.current)
    const trimmed = q.trim()
    if (trimmed.length < 1) { setResults([]); setLoading(false); return }
    setLoading(true)
    debounce.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search/companies?q=${encodeURIComponent(trimmed)}`)
        const j = await r.json()
        if (j.ok) setResults(j.results || [])
        else setError(j.error || 'Search failed')
      } catch {
        setError('Network error')
      } finally { setLoading(false) }
    }, 220)
    return () => clearTimeout(debounce.current)
  }, [q])

  return (
    <div className="wr-cp">
      <label className="wr-cp-label">Which company are you reviewing?</label>
      <div className="wr-cp-field">
        <svg className="wr-cp-icon" viewBox="0 0 24 24" width="18" height="18" fill="none"
             stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          className="wr-cp-input"
          placeholder="Type a company name…"
          value={q}
          onChange={e => setQ(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="words"
          spellCheck={false}
          inputMode="search"
          enterKeyHint="search"
        />
        {q && (
          <button type="button" className="wr-cp-clear" onClick={() => setQ('')} aria-label="Clear">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {error && <p className="wr-cp-error">{error}</p>}

      {q.trim() && (
        <div className="wr-cp-results">
          {loading && results.length === 0 && (
            <div className="wr-cp-empty">Searching…</div>
          )}
          {!loading && results.length === 0 && (
            <div className="wr-cp-empty">No companies match &quot;{q.trim()}&quot;.</div>
          )}
          {results.map(c => (
            <button
              key={c.slug}
              type="button"
              className="wr-cp-result"
              onClick={() => onPick(c)}
            >
              {c.logoUrl
                ? <img className="wr-cp-result-logo" src={c.logoUrl} alt="" />
                : <span className="wr-cp-result-logo wr-cp-result-logo--ph">{c.companyName.slice(0, 2).toUpperCase()}</span>}
              <span className="wr-cp-result-text">
                <span className="wr-cp-result-name">{c.companyName}</span>
                {c.tagline && <span className="wr-cp-result-tag">{c.tagline}</span>}
              </span>
              {c.category?.name && (
                <span className="wr-cp-result-cat" style={{ color: c.category.color || '#4B5563' }}>
                  {c.category.name}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {!q.trim() && (
        <p className="wr-cp-hint">
          Start typing to find a company. Only listed companies can be reviewed —
          if the company you want is missing, you can{' '}
          <a href="/business" className="wr-cp-link">list it for them</a>.
        </p>
      )}
    </div>
  )
}
