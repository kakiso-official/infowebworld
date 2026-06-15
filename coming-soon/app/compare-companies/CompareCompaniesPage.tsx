'use client'

import '../styles/compare.css'
import '../styles/compare-companies.css'

/* ─────────────────────────────────────────────────────────────
   /compare-companies — client orchestrator for COMPANY comparison.

   A faithful sibling of /compare (the product comparison) reusing the
   same .cpr-* design language and component shapes, but driven by the
   CompanyCol shape and company-relevant sections:
     Overview · Company Info · Pricing & Engagement · Services ·
     Focus areas · User Reviews · Industries · Languages · Awards ·
     Clients · FAQs · Alternatives.

   Rules enforced (Aadil's spec):
     • Company-to-company ONLY — the search is locked to mode=company
       and (after the first pick) to the SAME L1 sector, so a product
       can never enter a company comparison and no mixed URL is built.
     • Up to 4 columns (mobile capped at 2).
     • Profile links go to /profile/<slug> (the Clutch-style company page),
       never /listing/.
   The product comparison (/compare) is untouched.
   ───────────────────────────────────────────────────────────── */

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { withInfoWebWorldUtm } from '../lib/utm'
import { trackWebsiteClick } from '../lib/track-website-click'
import { listingOutboundRel } from '@/lib/user-plan-types'
import {
  buildCompareUrl,
  MAX_COMPARE,
  type CompanyCol,
  type CompareAlternative,
  type AlternativesBySlug,
  type CompareReview,
  type ServiceShare,
} from './lib'

/* ── Icons ────────────────────────────────────────────────── */

const Ico = {
  search: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  dash: (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <path d="M6 12h12" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
    </svg>
  ),
  external: (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h6v6M10 14L21 3M21 14v7H3V3h7" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  add: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l8 4v6c0 5-3.5 9.4-8 10-4.5-.6-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  inbox: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  ),
  spinner: (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="42 30" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
  chevDown: (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  thumbsUp: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 22V10M2 12a3 3 0 0 1 3-3h2l3-8a4 4 0 0 1 4 4v3h6l-2 11a3 3 0 0 1-3 2H7" />
    </svg>
  ),
  thumbsDown: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 2v12M22 12a3 3 0 0 0-3 3h-2l-3 8a4 4 0 0 1-4-4v-3H4l2-11a3 3 0 0 1 3-2h8" />
    </svg>
  ),
  // Section icons
  iconOverview: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  iconPricing: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  iconReviews: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11.5 1.8l3 6.1 6.7 1 -4.9 4.7 1.2 6.7L11.5 17 5.5 20.3l1.2-6.7L1.8 8.9l6.7-1 3-6.1z" />
    </svg>
  ),
  iconAlts: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  iconCompany: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
    </svg>
  ),
  iconServices: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 11l3 3 8-8M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  iconFocus: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  ),
  iconIndustry: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  iconGlobe: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </svg>
  ),
  iconAward: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="7" />
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </svg>
  ),
  iconClients: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  iconFaq: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  ),
}

/* ── Helpers ──────────────────────────────────────────────── */

const truncate = (s: string, n: number) => s.length > n ? s.slice(0, n).trimEnd() + '…' : s

/** Domain extraction tolerant of http/https/no-scheme/path/query. */
function domainOf(website: string | null | undefined): string | null {
  if (!website) return null
  try {
    const url = new URL(website.startsWith('http') ? website : `https://${website}`)
    return url.hostname.replace(/^www\./, '')
  } catch { return null }
}

/** Logo waterfall: explicit URL → Google Favicon → null (letter tile). */
function logoCandidates(col: { logoUrl: string | null; website: string | null }): string[] {
  const out: string[] = []
  if (col.logoUrl && col.logoUrl.trim()) out.push(col.logoUrl)
  const dom = domainOf(col.website)
  if (dom) out.push(`https://www.google.com/s2/favicons?domain=${dom}&sz=128`)
  return out
}

/** Smart <img> with onError waterfall. Falls back to a letter tile when
    every candidate URL fails. */
function SmartLogo({
  col,
  className,
  size,
}: {
  col: { logoUrl: string | null; website: string | null; companyName: string }
  className?: string
  size?: number
}) {
  const candidates = useMemo(() => logoCandidates(col), [col.logoUrl, col.website])
  const [idx, setIdx] = useState(0)
  const letter = col.companyName.trim().charAt(0).toUpperCase() || '?'
  const sizeStyle = size ? { width: size, height: size } : undefined

  if (candidates.length === 0 || idx >= candidates.length) {
    return (
      <span className={`cpr-letter ${className || ''}`} style={sizeStyle} aria-hidden="true">
        {letter}
      </span>
    )
  }
  return (
    <img
      src={candidates[idx]}
      alt={`${col.companyName} logo`}
      className={className}
      style={sizeStyle}
      onError={() => setIdx(i => i + 1)}
      loading="lazy"
    />
  )
}

/** Stars row. */
function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const rounded = Math.round(value * 2) / 2
  return (
    <span className="cpr-stars" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map(n => {
        const filled = rounded >= n
        const half = !filled && rounded >= n - 0.5
        return (
          <span key={n} className="cpr-star" style={{ width: size, height: size, color: filled || half ? '#FFB400' : '#E5E1DC' }}>
            {Ico.star}
          </span>
        )
      })}
    </span>
  )
}

/* ── Search picker ───────────────────────────────────────────
   Locked to mode=company so only companies surface — a product can
   never be added to a company comparison. After the first pick the
   caller also passes sectorFilter (the L1 sector slug) so the next
   results are same-sector only. */

type SearchHit = {
  id: number
  slug: string
  companyName: string
  tagline: string | null
  logoUrl: string | null
  category: { name: string | null; slug: string; color: string | null } | null
  ratingAvg: number
  ratingCount: number
}

function CompareSearchInput({
  placeholder,
  excludeSlugs,
  onPick,
  variant = 'panel',
  autoFocus = false,
  sectorFilter,
}: {
  placeholder?: string
  excludeSlugs: string[]
  onPick: (hit: SearchHit) => void
  variant?: 'hero' | 'panel'
  autoFocus?: boolean
  sectorFilter?: string | null
}) {
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<SearchHit[]>([])
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [active, setActive] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | null>(null)
  const excludeKey = excludeSlugs.join(',')
  const sectorKey = sectorFilter || ''

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    if (q.trim().length < 1) {
      setHits([])
      setBusy(false)
      return
    }
    setBusy(true)
    timerRef.current = window.setTimeout(async () => {
      try {
        const sectorPart = sectorKey ? `&sector=${encodeURIComponent(sectorKey)}` : ''
        const url = `/api/search/companies?q=${encodeURIComponent(q.trim())}&exclude=${encodeURIComponent(excludeKey)}&mode=company${sectorPart}`
        const res = await fetch(url, { credentials: 'same-origin' })
        const json = await res.json()
        setHits(json.ok ? (json.results || []) : [])
      } catch { setHits([]) }
      finally { setBusy(false) }
    }, 220)
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current) }
  }, [q, excludeKey, sectorKey])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { setOpen(false); return }
    if (!open || hits.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, hits.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault()
      onPick(hits[active])
      setQ('')
      setOpen(false)
      setActive(-1)
    }
  }

  const showResults = open && q.trim().length > 0 && (hits.length > 0 || !busy)

  return (
    <div ref={wrapRef} className={`cpr-srch cpr-srch--${variant}`}>
      <span className="cpr-srch-ico">{busy ? Ico.spinner : Ico.search}</span>
      <input
        ref={inputRef}
        type="text"
        value={q}
        onChange={e => { setQ(e.target.value); setOpen(true); setActive(-1) }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        placeholder={placeholder || 'Type a company name'}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        autoFocus={autoFocus}
        className="cpr-srch-input"
      />
      {q && (
        <button type="button" className="cpr-srch-clear" onClick={() => { setQ(''); inputRef.current?.focus() }} aria-label="Clear">
          {Ico.close}
        </button>
      )}
      <button
        type="button"
        className="cpr-srch-btn"
        onClick={() => {
          if (hits.length > 0) { onPick(hits[0]); setQ(''); setOpen(false); setActive(-1) }
          else inputRef.current?.focus()
        }}
        aria-label="Search"
      >
        {Ico.search}
      </button>
      {showResults && (
        <div className="cpr-srch-drop" role="listbox">
          {hits.length === 0
            ? <div className="cpr-srch-empty">No companies match &ldquo;{q}&rdquo;.</div>
            : hits.map((h, i) => (
              <button
                key={h.id}
                type="button"
                role="option"
                aria-selected={i === active}
                className={`cpr-srch-row${i === active ? ' is-active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => { onPick(h); setQ(''); setOpen(false); setActive(-1) }}
              >
                <span className="cpr-srch-logo">
                  <SmartLogo col={{ logoUrl: h.logoUrl, website: null, companyName: h.companyName }} />
                </span>
                <span className="cpr-srch-meta">
                  <span className="cpr-srch-name">{h.companyName}</span>
                  {h.category?.name && <span className="cpr-srch-cat">{h.category.name}</span>}
                </span>
                {h.ratingCount > 0 && (
                  <span className="cpr-srch-rate">
                    <Stars value={h.ratingAvg} size={12} />
                    <span>{h.ratingAvg.toFixed(1)}</span>
                  </span>
                )}
              </button>
            ))
          }
        </div>
      )}
    </div>
  )
}

/* ── Empty state — centered search bar only ──────────────── */

function EmptyLanding({ onPick }: { onPick: (hit: SearchHit) => void }) {
  return (
    <div className="cpr-land">
      <div className="cpr-land-copy">
        <h1 className="cpr-land-h1">Which company would you like to compare?</h1>
        <p className="cpr-land-p">
          Search a company to start — you&rsquo;ll pick a second one from the same sector in the next step.
        </p>
      </div>
      <div className="cpr-land-search-only">
        <CompareSearchInput
          placeholder="Search a company by name"
          excludeSlugs={[]}
          onPick={onPick}
          variant="hero"
          autoFocus
        />
      </div>
      <img
        src="/illustrations/builder-back.png"
        alt=""
        aria-hidden="true"
        className="cpr-land-mascot"
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />
    </div>
  )
}

/* ── Pick-second state (cols.length === 1) ──────────────────
   The comparison view doesn't unlock until at least 2 companies are
   picked. The second search is restricted to the chosen company's L1
   sector — so the comparison is always company-to-company AND
   apples-to-apples (same sector). */

function PickSecondView({
  col,
  onAdd,
  onRemove,
}: {
  col: CompanyCol
  onAdd: (slug: string) => void
  onRemove: () => void
}) {
  return (
    <div className="cpr-pick2">
      <h1 className="cpr-pick2-title">
        Pick a 2nd company to compare with <em>{col.companyName}</em>
      </h1>

      <div className="cpr-pick2-grid">
        {/* Picked card */}
        <div className="cpr-pick2-picked">
          <div className="cpr-pick2-badge">Your pick</div>
          <button
            type="button"
            className="cpr-pick2-remove"
            onClick={onRemove}
            aria-label={`Remove ${col.companyName}`}
          >{Ico.close}</button>
          <div className="cpr-pick2-id">
            <SmartLogo col={col} className="cpr-pick2-logo" />
            <div className="cpr-pick2-info">
              <Link href={`/profile/${col.slug}`} className="cpr-pick2-name">{col.companyName}</Link>
              {col.category && (
                <Link href={`/${col.category.slug}`} className="cpr-pick2-cat" style={{ color: col.category.color }}>
                  {col.category.name}
                </Link>
              )}
              {col.ratingCount > 0 && (
                <div className="cpr-pick2-rate">
                  <span className="cpr-pick2-rate-star" aria-hidden="true">{Ico.star}</span>
                  <span className="cpr-pick2-rate-num">{col.ratingAvg.toFixed(1)}</span>
                  <span className="cpr-pick2-rate-count">({col.ratingCount.toLocaleString()} reviews)</span>
                </div>
              )}
            </div>
          </div>
          {col.tagline && <p className="cpr-pick2-tag">{col.tagline}</p>}
        </div>

        {/* Search slot for second — restricted to the picked company's
            L1 sector so the comparison is always same-sector. */}
        <div className="cpr-pick2-add">
          <div className="cpr-pick2-add-label">Search a company to compare with</div>
          <CompareSearchInput
            placeholder="Type a company name"
            excludeSlugs={[col.slug]}
            onPick={h => onAdd(h.slug)}
            variant="hero"
            autoFocus
            sectorFilter={col.sectorSlug}
          />
          <p className="cpr-pick2-hint">Only companies in the same sector are shown.</p>
        </div>
      </div>
    </div>
  )
}

/* ── Column header ────────────────────────────────────────── */

function ColumnHead({
  col,
  onRemove,
  saved,
  onToggleSave,
}: {
  col: CompanyCol
  onRemove: () => void
  saved: boolean
  onToggleSave: () => void
}) {
  return (
    <div className="cpr-col-head">
      <button type="button" className="cpr-col-x" onClick={onRemove} aria-label={`Remove ${col.companyName} from comparison`}>
        {Ico.close}
      </button>
      <div className="cpr-col-id">
        <Link href={`/profile/${col.slug}`} className="cpr-col-logo-link">
          <SmartLogo col={col} className="cpr-col-logo" />
        </Link>
        <div className="cpr-col-name-row">
          <Link href={`/profile/${col.slug}`} className="cpr-col-name">
            {col.companyName}
            {col.verified && <span className="cpr-col-verified" title="Verified by InfoWebWorld">{Ico.shield}</span>}
          </Link>
          <span className="cpr-col-chev" aria-hidden="true">{Ico.chevDown}</span>
        </div>
        {col.ratingCount > 0 ? (
          <div className="cpr-col-rate">
            <span className="cpr-col-rate-num">{col.ratingAvg.toFixed(1)}</span>
            <Stars value={col.ratingAvg} size={13} />
            <span className="cpr-col-rate-count">({col.ratingCount >= 1000 ? `${(col.ratingCount / 1000).toFixed(1)}K` : col.ratingCount})</span>
          </div>
        ) : (
          <div className="cpr-col-rate cpr-col-rate--none">
            <span>No reviews yet</span>
          </div>
        )}
      </div>
      <div className="cpr-col-cta-row">
        {col.website ? (
          <a
            href={withInfoWebWorldUtm(col.website, col.slug, 'compare')}
            target="_blank"
            rel={listingOutboundRel(col.planSlug)}
            className="cpr-col-visit"
            onClick={() => trackWebsiteClick(col.slug, 'compare')}
          >
            Visit Website {Ico.external}
          </a>
        ) : (
          <Link href={`/profile/${col.slug}`} className="cpr-col-visit">
            View Profile {Ico.arrowRight}
          </Link>
        )}
        <button
          type="button"
          className={`cpr-col-save${saved ? ' is-saved' : ''}`}
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={saved ? 'Unsave' : 'Save'}
        >
          {Ico.heart}
        </button>
      </div>
    </div>
  )
}

/* ── Sections registry ───────────────────────────────────── */

type SectionDef = { id: string; label: string; icon: React.ReactNode }
const SECTIONS: SectionDef[] = [
  { id: 'overview',     label: 'Overview',           icon: Ico.iconOverview },
  { id: 'company-info', label: 'Company Info',       icon: Ico.iconCompany },
  { id: 'pricing',      label: 'Pricing & Engagement', icon: Ico.iconPricing },
  { id: 'services',     label: 'Services',           icon: Ico.iconServices },
  { id: 'focus',        label: 'Focus Areas',        icon: Ico.iconFocus },
  { id: 'reviews',      label: 'User Reviews',       icon: Ico.iconReviews },
  { id: 'industries',   label: 'Industries Served',  icon: Ico.iconIndustry },
  { id: 'languages',    label: 'Languages',          icon: Ico.iconGlobe },
  { id: 'awards',       label: 'Awards',             icon: Ico.iconAward },
  { id: 'clients',      label: 'Clients',            icon: Ico.iconClients },
  { id: 'faqs',         label: 'FAQs',               icon: Ico.iconFaq },
  { id: 'alternatives', label: 'Alternatives',       icon: Ico.iconAlts },
]

function SectionHead({ id, label, icon, sub }: SectionDef & { sub?: string }) {
  return (
    <header className="cpr-sec-head" id={id}>
      <div className="cpr-sec-head-row">
        <span className="cpr-sec-icon">{icon}</span>
        <h2 className="cpr-sec-title">{label}</h2>
      </div>
      {sub && <p className="cpr-sec-sub">{sub}</p>}
    </header>
  )
}

/* ── Cells ────────────────────────────────────────────────── */

/** Per-cell empty placeholder — keeps the side-by-side grid aligned. */
function EmptyCell({ text }: { text: string }) {
  return (
    <div className="cpr-cell cpr-cell--empty">
      <div className="cpr-empty-mute">{text}</div>
    </div>
  )
}

function OverviewCell({ col }: { col: CompanyCol }) {
  const [expanded, setExpanded] = useState(false)
  const desc = col.description || ''
  const isLong = desc.length > 240

  return (
    <div className="cpr-cell">
      <div className="cpr-desc">
        {desc ? (
          <>
            {expanded || !isLong ? desc : truncate(desc, 240)}
            {isLong && (
              <button type="button" className="cpr-readmore" onClick={() => setExpanded(v => !v)}>
                {expanded ? ' Read less' : ' Read more'}
              </button>
            )}
          </>
        ) : (
          <span className="cpr-mute-line">No description shared yet.</span>
        )}
      </div>

      {col.headerTags.length > 0 && (
        <div className="cpr-kv">
          <div className="cpr-kv-label">Specialties</div>
          <div className="cpr-pills cpr-pills--neutral">
            {col.headerTags.slice(0, 8).map((t, i) => <span key={`${t}-${i}`} className="cpr-pill">{t}</span>)}
          </div>
        </div>
      )}

      {col.isHiring && (
        <div className="cpr-kv">
          <ul className="cpr-checklist cpr-checklist--inline">
            <li><span className="cpr-cb is-on">{Ico.check}</span><span>Actively hiring</span></li>
          </ul>
        </div>
      )}

      <Link href={`/profile/${col.slug}`} className="cpr-pill-link">
        View full profile {Ico.arrowRight}
      </Link>
    </div>
  )
}

function CompanyInfoCell({ col }: { col: CompanyCol }) {
  const domain = domainOf(col.website)
  const hq = col.hqLocation || [col.city, col.state, col.country].filter(Boolean).join(', ') || null
  const rows = [
    { label: 'Founded', value: col.founded ? String(col.founded) : null },
    { label: 'Team size', value: col.employees },
    { label: 'Headquarters', value: hq },
    { label: 'Sector', value: col.category?.name },
    { label: 'Website', value: domain, href: col.website },
    { label: 'Verified', value: col.verified ? 'Yes — by InfoWebWorld' : null },
    { label: 'Hiring', value: col.isHiring ? 'Actively hiring' : null },
  ].filter(r => r.value)

  if (rows.length === 0) return <EmptyCell text="Company details not shared yet." />

  return (
    <div className="cpr-cell">
      <div className="cpr-info-list">
        {rows.map(r => (
          <div key={r.label} className="cpr-info-row">
            <span className="cpr-info-label">{r.label}</span>
            <span className="cpr-info-value">
              {r.href
                ? <a
                    href={withInfoWebWorldUtm(r.href, col.slug, 'compare')}
                    target="_blank"
                    rel={listingOutboundRel(col.planSlug)}
                    onClick={() => trackWebsiteClick(col.slug, 'compare')}
                  >{r.value} {Ico.external}</a>
                : r.value}
            </span>
          </div>
        ))}
      </div>
      <Link href={`/profile/${col.slug}`} className="cpr-pill-link">
        Full profile {Ico.arrowRight}
      </Link>
    </div>
  )
}

function PricingCell({ col }: { col: CompanyCol }) {
  const rows = [
    { label: 'Min project size', value: col.minProjectSize },
    { label: 'Hourly rate', value: col.hourlyRate },
    { label: 'Avg project size', value: col.commonProjectSize },
  ].filter(r => r.value)

  if (rows.length === 0) return <EmptyCell text="Pricing & engagement details not shared yet." />

  return (
    <div className="cpr-cell">
      <div className="cpr-info-list">
        {rows.map(r => (
          <div key={r.label} className="cpr-info-row">
            <span className="cpr-info-label">{r.label}</span>
            <span className="cpr-info-value">{r.value}</span>
          </div>
        ))}
      </div>
      <Link href={`/profile/${col.slug}`} className="cpr-pill-link cpr-pill-link--ghost">
        Request a quote {Ico.arrowRight}
      </Link>
    </div>
  )
}

/** Service mix / focus breakdown — labelled percentage bars. */
function SharesCell({ items, emptyText }: { items: ServiceShare[]; emptyText: string }) {
  if (items.length === 0) return <EmptyCell text={emptyText} />
  const sorted = [...items].sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
  return (
    <div className="cpr-cell">
      <div className="ccc-bars">
        {sorted.map((s, i) => {
          const pct = Math.max(0, Math.min(100, Number(s.percentage) || 0))
          return (
            <div key={`${s.name}-${i}`} className="ccc-bar-row">
              <div className="ccc-bar-top">
                <span className="ccc-bar-name">{s.name}</span>
                <span className="ccc-bar-pct">{pct}%</span>
              </div>
              <span className="ccc-track"><span className="ccc-fill" style={{ width: `${pct}%` }} /></span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* Review quote affordances (identical to the product compare). */
const ArrowUpDot = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M7 14l5-5 5 5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ArrowDownDot = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M7 10l5 5 5-5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const PersonIco = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const InfoIco = (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const fmtK = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
const initials = (name: string) => name.trim().split(/\s+/).map(p => p[0] || '').slice(0, 2).join('').toUpperCase()

function QuoteCard({ review, kind }: { review: CompareReview; kind: 'pro' | 'con' }) {
  return (
    <div className={`cpr-quote cpr-quote--${kind}`}>
      <div className="cpr-quote-head">
        <span className={`cpr-quote-arrow cpr-quote-arrow--${kind}`} aria-hidden="true">
          {kind === 'pro' ? ArrowUpDot : ArrowDownDot}
        </span>
        <span className="cpr-quote-pill">Highly Relevant</span>
      </div>
      <p className="cpr-quote-text">&ldquo;{review.body}&rdquo;</p>
      <div className="cpr-quote-author">
        {review.userAvatar
          ? <img src={review.userAvatar} alt="" className="cpr-quote-av" />
          : <span className="cpr-quote-av cpr-quote-av--letter" aria-hidden="true">
              {initials(review.userName || review.title || 'A') || 'A'}
            </span>}
        <span className="cpr-quote-name">{review.userName || 'Verified user'}</span>
      </div>
    </div>
  )
}

function ReviewsCell({ col }: { col: CompanyCol }) {
  const total = col.ratingDist.reduce((a, b) => a + b, 0)
  const recommendPct = total > 0
    ? Math.round(((col.ratingDist[0] + col.ratingDist[1]) / total) * 100)
    : 0

  if (col.ratingCount === 0) {
    return (
      <div className="cpr-cell cpr-cell--reviews">
        <div className="cpr-rev-empty">
          <div className="cpr-rev-empty-rate">—</div>
          <Stars value={0} size={16} />
          <div className="cpr-rev-empty-msg">No reviews yet for {col.companyName}.</div>
          <Link href={`/profile/${col.slug}`} className="cpr-pill-link cpr-pill-link--accent">
            Write the first review {Ico.arrowRight}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cpr-cell cpr-cell--reviews">
      <div className="cpr-rev-top">
        <div className="cpr-rev-top-left">
          <div className="cpr-rev-rate">
            <span className="cpr-rev-rate-star" aria-hidden="true">{Ico.star}</span>
            <span className="cpr-rev-rate-num">{col.ratingAvg.toFixed(1)}</span>
          </div>
          <div className="cpr-rev-count-row">
            <span className="cpr-rev-count-ico" aria-hidden="true">{PersonIco}</span>
            <span className="cpr-rev-count-num">{fmtK(col.ratingCount)}</span>
            <span className="cpr-rev-count-info" aria-hidden="true">{InfoIco}</span>
          </div>
        </div>
        <div className="cpr-rev-top-right">
          {[5, 4, 3, 2, 1].map((stars, i) => {
            const count = col.ratingDist[i]
            const pct = total > 0 ? (count / total) * 100 : 0
            return (
              <div key={stars} className="cpr-rev-bar">
                <span className="cpr-rev-bar-label">{stars}</span>
                <span className="cpr-rev-bar-track"><span className="cpr-rev-bar-fill" style={{ width: `${pct}%` }} /></span>
                <span className="cpr-rev-bar-count">{fmtK(count)}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="cpr-rev-rec">
        <span className="cpr-rev-rec-num">{recommendPct}<small>%</small></span>
        <span className="cpr-rev-rec-text">would recommend this company</span>
      </div>

      {col.topPros.length > 0 && (
        <div className="cpr-rev-pc">
          <h3 className="cpr-rev-pc-title">Pros</h3>
          {col.topPros.map(r => <QuoteCard key={r.id} review={r} kind="pro" />)}
        </div>
      )}

      {col.topCons.length > 0 && (
        <div className="cpr-rev-pc">
          <h3 className="cpr-rev-pc-title">Cons</h3>
          {col.topCons.map(r => <QuoteCard key={r.id} review={r} kind="con" />)}
        </div>
      )}

      {col.lastReviewAt && (
        <div className="cpr-rev-foot">
          <span>Last review</span>
          <span className="cpr-rev-foot-time">{timeAgo(col.lastReviewAt)}</span>
        </div>
      )}
    </div>
  )
}

function timeAgo(iso: string): string {
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const day = 1000 * 60 * 60 * 24
  const days = Math.floor(diff / day)
  if (days < 1) return 'today'
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`
  const years = Math.floor(days / 365)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

function PillListCell({
  items, emptyText, accent = 'neutral',
}: {
  items: string[]
  emptyText: string
  accent?: 'neutral' | 'green' | 'coral'
}) {
  if (items.length === 0) return <EmptyCell text={emptyText} />
  return (
    <div className="cpr-cell">
      <div className={`cpr-pills cpr-pills--${accent}`}>
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="cpr-pill">{item}</span>
        ))}
      </div>
    </div>
  )
}

function AwardsCell({ col }: { col: CompanyCol }) {
  if (col.awards.length === 0) return <EmptyCell text="No awards or recognition listed yet." />
  return (
    <div className="cpr-cell">
      <div className="cpr-awards">
        {col.awards.slice(0, 6).map((a, i) => (
          <div key={i} className="cpr-award">
            <span className="cpr-award-ico">{Ico.iconAward}</span>
            <div className="cpr-award-body">
              <div className="cpr-award-name">{a.name}</div>
              {a.year && <div className="cpr-award-year">{a.year}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ClientsCell({ col }: { col: CompanyCol }) {
  const hasSummary = !!(col.clientsSummary && col.clientsSummary.trim())
  if (col.clientLogos.length === 0 && !hasSummary) {
    return <EmptyCell text="No client list shared yet." />
  }
  return (
    <div className="cpr-cell">
      {hasSummary && <p className="cpr-desc">{col.clientsSummary}</p>}
      {col.clientLogos.length > 0 && (
        <div className="ccc-clients">
          {col.clientLogos.slice(0, 12).map((cl, i) => {
            const dom = cl.url ? domainOf(cl.url) : null
            const fav = cl.logoUrl || (dom ? `https://www.google.com/s2/favicons?domain=${dom}&sz=64` : '')
            return (
              <span key={`${cl.name}-${i}`} className="ccc-client" title={cl.name}>
                {fav
                  ? <img src={fav} alt="" className="ccc-client-logo" loading="lazy" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                  : <span className="ccc-client-logo ccc-client-logo--ltr" aria-hidden="true">{(cl.name.trim()[0] || '?').toUpperCase()}</span>}
                <span className="ccc-client-name">{cl.name}</span>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** Plus icon that morphs into × via CSS rotation when the FAQ is open. */
const FaqPlus = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

function FaqsCell({ col }: { col: CompanyCol }) {
  const [open, setOpen] = useState<number | null>(0)
  if (col.faqs.length === 0) return <EmptyCell text="No FAQs added yet." />
  return (
    <div className="cpr-cell cpr-cell--faqs">
      {col.faqs.slice(0, 6).map((f, i) => {
        const isOpen = open === i
        return (
          <div key={i} className={`cpr-faq${isOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              className="cpr-faq-q"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="cpr-faq-num">{i + 1}.</span>
              <span className="cpr-faq-text">{f.q}</span>
              <span className="cpr-faq-toggle" aria-hidden="true">{FaqPlus}</span>
            </button>
            <div className="cpr-faq-a-wrap" data-open={isOpen ? 'true' : 'false'}>
              <div className="cpr-faq-a">{f.a}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Compare icon — two columns with a dashed separator. */
const CompareIco = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="6.5" height="16" rx="1.2" />
    <rect x="14.5" y="4" width="6.5" height="16" rx="1.2" />
    <line x1="12" y1="6" x2="12" y2="18" strokeDasharray="1.5 2.2" />
  </svg>
)

/** Per-column Alternatives — same-sector siblings of THAT company.
    Click COMPARE → it's appended to the URL slug list and the page
    re-fetches (full real-time swap). All alternatives are same-sector
    companies, so no product↔company URL can ever be built here. */
function AlternativesCell({
  alternatives,
  currentSlugs,
  thisCol,
  maxCap,
}: {
  alternatives: CompareAlternative[]
  currentSlugs: string[]
  thisCol: CompanyCol
  maxCap: number
}) {
  const show = alternatives.slice(0, 3)
  const moreHref = thisCol.category?.slug ? `/${thisCol.category.slug}` : '/categories'

  if (show.length === 0) {
    return (
      <div className="cpr-cell cpr-cell--alts">
        <div className="cpr-alt-empty">
          <div className="cpr-empty-mute">No alternatives indexed in this sector yet.</div>
          <Link href={moreHref} className="cpr-alt-more">See more companies</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cpr-cell cpr-cell--alts">
      {show.map(a => {
        const isFull = currentSlugs.length >= maxCap
        const alreadyComparing = currentSlugs.includes(a.slug)
        const newSlugs = alreadyComparing
          ? currentSlugs
          : (isFull
              ? [...currentSlugs.slice(0, maxCap - 1), a.slug]
              : [...currentSlugs, a.slug])
        const compareHref = alreadyComparing
          ? `/profile/${a.slug}`
          : buildCompareUrl(newSlugs)
        return (
          <div key={a.slug} className="cpr-alt2">
            <div className="cpr-alt2-head">
              <SmartLogo
                col={{ logoUrl: a.logoUrl, website: a.website, companyName: a.companyName }}
                className="cpr-alt2-logo"
              />
              <div className="cpr-alt2-id">
                <Link href={`/profile/${a.slug}`} className="cpr-alt2-name">
                  {a.companyName}
                </Link>
                <div className="cpr-alt2-rate">
                  <span className="cpr-alt2-star" aria-hidden="true">{Ico.star}</span>
                  {a.ratingCount > 0 ? (
                    <>
                      <span className="cpr-alt2-rate-num">{a.ratingAvg.toFixed(1)}</span>
                      <span className="cpr-alt2-rate-count">({a.ratingCount >= 1000 ? `${(a.ratingCount / 1000).toFixed(1)}K` : a.ratingCount})</span>
                    </>
                  ) : (
                    <span className="cpr-alt2-rate-count">No reviews yet</span>
                  )}
                </div>
              </div>
            </div>
            <Link
              href={compareHref}
              className="cpr-alt2-cmp"
              aria-label={alreadyComparing
                ? `${a.companyName} — open profile`
                : `Compare ${thisCol.companyName} with ${a.companyName}`}
            >
              {CompareIco}
              <span>{alreadyComparing ? 'View' : 'Compare'}</span>
            </Link>
          </div>
        )
      })}
      <Link href={moreHref} className="cpr-alt-more">See more companies</Link>
    </div>
  )
}

/* ── Email capture card ───────────────────────────────────── */

function EmailCapture({ slugs }: { slugs: string[] }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle')
  const [msg, setMsg] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (state === 'busy') return
    setState('busy')
    setMsg('')
    try {
      const res = await fetch('/api/compare/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, slugs, mode: 'company' }),
        credentials: 'same-origin',
      })
      const json = await res.json()
      if (json.ok) { setState('ok'); setMsg('Check your inbox — comparison summary on the way.') }
      else { setState('err'); setMsg(json.error || 'Could not send right now.') }
    } catch { setState('err'); setMsg('Network error. Try again.') }
  }

  return (
    <aside className="cpr-mail" aria-label="Email this comparison">
      <div className="cpr-mail-ico" aria-hidden="true">{Ico.inbox}</div>
      <div className="cpr-mail-body">
        <h3 className="cpr-mail-title">Send this comparison chart to my inbox</h3>
        <form onSubmit={submit} className="cpr-mail-form" noValidate>
          <label className="cpr-mail-fld">
            <span className="cpr-mail-fld-label">Email Address <em>*</em></span>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="cpr-mail-input"
              disabled={state === 'busy' || state === 'ok'}
            />
          </label>
          <div className="cpr-mail-actions">
            <p className="cpr-mail-legal">
              By proceeding, you agree to our <Link href="/business/terms">Terms Of Use</Link> and <Link href="/privacy">Privacy Policy</Link>.
            </p>
            <button
              type="submit" className="cpr-mail-submit"
              disabled={state === 'busy' || state === 'ok' || !email}
              data-state={state}
            >
              {state === 'busy' ? 'Sending…' : state === 'ok' ? 'Sent ✓' : 'Submit'}
            </button>
          </div>
        </form>
        {msg && <div className={`cpr-mail-msg cpr-mail-msg--${state}`}>{msg}</div>}
      </div>
    </aside>
  )
}

/* ── Right rail ───────────────────────────────────────────── */

function AddRail({
  cols,
  alternatives,
  onAdd,
  maxCap,
}: {
  cols: CompanyCol[]
  alternatives: CompareAlternative[]
  onAdd: (slug: string) => void
  maxCap: number
}) {
  const excludeSlugs = cols.map(c => c.slug)
  const canAdd = cols.length < maxCap
  // Lock the rail search to the L1 sector of the first column so users
  // can only add same-sector companies (matches the pick-second rule).
  const sectorFilter = cols[0]?.sectorSlug || null
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  return (
    <aside className="cpr-rail">
      <div className="cpr-rail-card">
        <div className="cpr-rail-label">ADD TO COMPARE</div>
        {canAdd ? (
          <CompareSearchInput
            placeholder="Type a company name"
            excludeSlugs={excludeSlugs}
            onPick={h => onAdd(h.slug)}
            variant="panel"
            sectorFilter={sectorFilter}
          />
        ) : (
          <div className="cpr-rail-full">
            <strong>{maxCap} companies</strong> is the maximum. Remove one to add another.
          </div>
        )}
        <div className="cpr-rail-counter">
          {cols.length} of {maxCap} added
        </div>
      </div>

      {alternatives.length > 0 && (
        <div className="cpr-rail-card">
          <div className="cpr-rail-label">COMPARE SIMILAR COMPANIES</div>
          <div className="cpr-rail-list">
            {alternatives.slice(0, 4).map(a => (
              <button
                key={a.slug}
                type="button"
                className="cpr-rail-alt"
                onClick={() => canAdd && onAdd(a.slug)}
                disabled={!canAdd}
              >
                <SmartLogo col={{ logoUrl: a.logoUrl, website: a.website, companyName: a.companyName }} className="cpr-rail-alt-logo" />
                <span className="cpr-rail-alt-meta">
                  <span className="cpr-rail-alt-name">{a.companyName}</span>
                  {a.ratingCount > 0 && (
                    <span className="cpr-rail-alt-rate">
                      <span>{a.ratingAvg.toFixed(1)}</span>
                      <Stars value={a.ratingAvg} size={10} />
                    </span>
                  )}
                </span>
                {canAdd && <span className="cpr-rail-alt-add" aria-hidden="true">{Ico.add}</span>}
              </button>
            ))}
          </div>
          <div className="cpr-rail-feedback">
            <span>Good recommendations?</span>
            <div className="cpr-rail-fb-btns">
              <button
                type="button"
                className={`cpr-rail-fb${feedback === 'up' ? ' is-active' : ''}`}
                onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                aria-label="Yes, good recommendations"
              >
                {Ico.thumbsUp}
              </button>
              <button
                type="button"
                className={`cpr-rail-fb${feedback === 'down' ? ' is-active' : ''}`}
                onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                aria-label="No, not relevant"
              >
                {Ico.thumbsDown}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

/* ── Section nav ──────────────────────────────────────────── */

function SectionNav({
  activeId,
  items,
  onPick,
}: {
  activeId: string
  items: SectionDef[]
  onPick: (id: string) => void
}) {
  return (
    <nav className="cpr-nav" aria-label="Comparison sections">
      <ul>
        {items.map(s => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`cpr-nav-item${activeId === s.id ? ' is-active' : ''}`}
              onClick={() => onPick(s.id)}
            >
              <span className="cpr-nav-ico" aria-hidden="true">{s.icon}</span>
              <span>{s.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ── Disclosure banner ────────────────────────────────────── */

function DisclosureBanner() {
  return (
    <div className="cpr-disclose">
      <span>
        InfoWebWorld offers objective, independent research and verified user reviews.
      </span>
      <Link href="/about" className="cpr-disclose-link">Learn more</Link>
    </div>
  )
}

/* ── Main component ──────────────────────────────────────── */

/** Track viewport width — capped at 2 columns on mobile. */
function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [breakpoint])
  return isMobile
}

export default function CompareCompaniesPage({
  initialCols,
  initialAlts,
  requestedSlugs,
  maxCompare = MAX_COMPARE,
}: {
  initialCols: CompanyCol[]
  initialAlts: AlternativesBySlug
  requestedSlugs: string[]
  maxCompare?: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile(768)

  const mobileMax = 2
  const effectiveMax = isMobile ? mobileMax : maxCompare
  const cols = useMemo(
    () => (isMobile ? initialCols.slice(0, mobileMax) : initialCols),
    [isMobile, initialCols]
  )
  const altsBySlug = initialAlts
  const sharedAlts = altsBySlug._shared || []
  const currentSlugs = useMemo(() => cols.map(c => c.slug), [cols])

  useEffect(() => {
    if (isMobile && initialCols.length > mobileMax) {
      const trimmed = initialCols.slice(0, mobileMax).map(c => c.slug)
      router.replace(buildCompareUrl(trimmed))
    }
  }, [isMobile, initialCols, router])

  const [activeSection, setActiveSection] = useState('overview')
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set())

  const tocLockRef = useRef(0)
  const handleTocClick = useCallback((id: string) => {
    tocLockRef.current = Date.now() + 700
    setActiveSection(id)
  }, [])

  useEffect(() => {
    if (cols.length < 1) return
    const headers = SECTIONS
      .map(s => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el)
    if (headers.length === 0) return

    const TRIGGER_Y = 200
    let raf = 0
    const handler = () => {
      if (Date.now() < tocLockRef.current) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (Date.now() < tocLockRef.current) return
        let currentId = headers[0].id
        for (const h of headers) {
          const top = h.getBoundingClientRect().top
          if (top <= TRIGGER_Y) currentId = h.id
          else break
        }
        setActiveSection(prev => (prev === currentId ? prev : currentId))
      })
    }

    handler()
    window.addEventListener('scroll', handler, { passive: true })
    window.addEventListener('resize', handler, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', handler)
      window.removeEventListener('resize', handler)
    }
  }, [cols.length])

  const [isPending, startTransition] = useTransition()

  const addSlug = useCallback((slug: string) => {
    if (currentSlugs.includes(slug)) return
    const cap = effectiveMax
    const next = currentSlugs.length >= cap
      ? [...currentSlugs.slice(0, cap - 1), slug]
      : [...currentSlugs, slug]
    startTransition(() => { router.push(buildCompareUrl(next)) })
  }, [currentSlugs, effectiveMax, router])

  const removeSlug = useCallback((slug: string) => {
    const next = currentSlugs.filter(s => s !== slug)
    startTransition(() => { router.push(buildCompareUrl(next)) })
  }, [currentSlugs, router])

  const toggleSave = useCallback((slug: string) => {
    setSavedSet(prev => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug); else next.add(slug)
      return next
    })
  }, [])

  const droppedSlugs = useMemo(() => {
    const have = new Set(currentSlugs)
    return requestedSlugs.filter(s => !have.has(s))
  }, [requestedSlugs, currentSlugs])

  /* ── Empty state ── */
  if (cols.length === 0) {
    return (
      <>
        {isPending && <div className="cpr-nav-bar" aria-hidden="true" />}
        <main className="cpr-page cpr-page--landing">
          {droppedSlugs.length > 0 && (
            <div className="cpr-warn-row">
              We couldn&rsquo;t find: <strong>{droppedSlugs.join(', ')}</strong>. Please pick from the dropdown.
            </div>
          )}
          <EmptyLanding onPick={h => addSlug(h.slug)} />
        </main>
      </>
    )
  }

  /* ── 1-company state — comparison locked until 2nd pick ── */
  if (cols.length === 1) {
    return (
      <>
        {isPending && <div className="cpr-nav-bar" aria-hidden="true" />}
        <main className="cpr-page cpr-page--single" key={pathname}>
          {droppedSlugs.length > 0 && (
            <div className="cpr-warn-row">
              We couldn&rsquo;t find: <strong>{droppedSlugs.join(', ')}</strong>. They were skipped.
            </div>
          )}
          <PickSecondView
            col={cols[0]}
            onAdd={addSlug}
            onRemove={() => removeSlug(cols[0].slug)}
          />
        </main>
      </>
    )
  }

  // Title
  const titleNames = cols.map(c => c.companyName).join(' vs ')
  const titleText = `${titleNames} Comparison (${new Date().getFullYear()})`

  // Empty-section auto-skip predicates
  const anyHasCompanyInfo = cols.some(c => c.founded || c.employees || c.hqLocation || c.city || c.website || c.category)
  const anyHasPricing    = cols.some(c => c.minProjectSize || c.hourlyRate || c.commonProjectSize)
  const anyHasServices   = cols.some(c => c.serviceLines.length > 0)
  const anyHasFocus      = cols.some(c => c.focusBreakdown.length > 0)
  const anyHasReviews    = cols.some(c => c.ratingCount > 0)
  const anyHasIndustries = cols.some(c => c.industriesServed.length > 0)
  const anyHasLanguages  = cols.some(c => c.languages.length > 0)
  const anyHasAwards     = cols.some(c => c.awards.length > 0)
  const anyHasClients    = cols.some(c => c.clientLogos.length > 0 || (c.clientsSummary && c.clientsSummary.trim()))
  const anyHasFaqs       = cols.some(c => c.faqs.length > 0)
  const anyHasAlts       = cols.some(c => (altsBySlug[c.slug] || []).length > 0)

  // Plain computation (not a hook) so the hook count is identical across the
  // empty / single / full render paths — no rules-of-hooks variance. Filtering
  // a 12-item list every render is free.
  const visibleSections = SECTIONS.filter(s => {
    switch (s.id) {
      case 'overview':     return true
      case 'company-info': return anyHasCompanyInfo
      case 'pricing':      return anyHasPricing
      case 'services':     return anyHasServices
      case 'focus':        return anyHasFocus
      case 'reviews':      return anyHasReviews
      case 'industries':   return anyHasIndustries
      case 'languages':    return anyHasLanguages
      case 'awards':       return anyHasAwards
      case 'clients':      return anyHasClients
      case 'faqs':         return anyHasFaqs
      case 'alternatives': return anyHasAlts
      default: return true
    }
  })

  const breadCat = cols[0].category
  const gridStyle = { ['--cpr-n' as string]: cols.length } as React.CSSProperties

  return (
    <>
      {isPending && <div className="cpr-nav-bar" aria-hidden="true" />}
      <main className="cpr-page" key={pathname} data-loading={isPending ? 'true' : 'false'}>
      <DisclosureBanner />

      <div className="cpr-titlebar">
        <div className="cpr-titlebar-inner">
          <nav className="cpr-crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/categories">Companies</Link>
            {breadCat && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/${breadCat.slug}`} style={{ color: breadCat.color }}>{breadCat.name}</Link>
              </>
            )}
          </nav>
          <h1 className="cpr-title">{titleText}</h1>
        </div>
      </div>

      {droppedSlugs.length > 0 && (
        <div className="cpr-warn-row">
          We couldn&rsquo;t find: <strong>{droppedSlugs.join(', ')}</strong>. They were skipped.
        </div>
      )}

      <div className="cpr-body" data-single={cols.length === 1 ? 'true' : 'false'}>
        <div className="cpr-nav-wrap">
          <SectionNav activeId={activeSection} items={visibleSections} onPick={handleTocClick} />
        </div>

        <div className="cpr-main">
          {/* Column headers */}
          <div className="cpr-cols cpr-cols--head" style={gridStyle}>
            {cols.map(col => (
              <ColumnHead
                key={col.id}
                col={col}
                onRemove={() => removeSlug(col.slug)}
                saved={savedSet.has(col.slug)}
                onToggleSave={() => toggleSave(col.slug)}
              />
            ))}
          </div>

          {/* Overview */}
          <section className="cpr-sec">
            <SectionHead {...SECTIONS.find(s => s.id === 'overview')!} />
            <div className="cpr-cols" style={gridStyle}>
              {cols.map(col => <OverviewCell key={col.id} col={col} />)}
            </div>
          </section>

          {/* Company Info */}
          {anyHasCompanyInfo && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'company-info')!} />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map(col => <CompanyInfoCell key={col.id} col={col} />)}
              </div>
            </section>
          )}

          {/* Pricing & Engagement */}
          {anyHasPricing && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'pricing')!} />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map(col => <PricingCell key={col.id} col={col} />)}
              </div>
            </section>
          )}

          {/* Services */}
          {anyHasServices && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'services')!} sub="Share of work by service line" />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map(col => (
                  <SharesCell key={col.id} items={col.serviceLines} emptyText="No service breakdown shared yet." />
                ))}
              </div>
            </section>
          )}

          {/* Focus Areas */}
          {anyHasFocus && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'focus')!} sub="Where this company spends its time" />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map(col => (
                  <SharesCell key={col.id} items={col.focusBreakdown} emptyText="No focus breakdown shared yet." />
                ))}
              </div>
            </section>
          )}

          {/* Email capture mid-page (only when 2+ cols) */}
          {cols.length >= 2 && <EmailCapture slugs={currentSlugs} />}

          {/* Reviews */}
          {anyHasReviews && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'reviews')!} />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map(col => <ReviewsCell key={col.id} col={col} />)}
              </div>
            </section>
          )}

          {/* Industries Served */}
          {anyHasIndustries && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'industries')!} />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map(col => (
                  <PillListCell
                    key={col.id}
                    items={col.industriesServed}
                    emptyText="No industries listed yet."
                    accent="coral"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {anyHasLanguages && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'languages')!} />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map(col => (
                  <PillListCell
                    key={col.id}
                    items={col.languages}
                    emptyText="No languages listed yet."
                    accent="neutral"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Awards */}
          {anyHasAwards && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'awards')!} />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map(col => <AwardsCell key={col.id} col={col} />)}
              </div>
            </section>
          )}

          {/* Clients */}
          {anyHasClients && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'clients')!} sub="Notable clients & engagements" />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map(col => <ClientsCell key={col.id} col={col} />)}
              </div>
            </section>
          )}

          {/* FAQs */}
          {anyHasFaqs && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'faqs')!} />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map(col => <FaqsCell key={col.id} col={col} />)}
              </div>
            </section>
          )}

          {/* Alternatives — each column gets its own same-sector siblings */}
          {anyHasAlts && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'alternatives')!} sub="Explore similar companies" />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map(col => (
                  <AlternativesCell
                    key={col.id}
                    alternatives={altsBySlug[col.slug] || []}
                    currentSlugs={currentSlugs}
                    thisCol={col}
                    maxCap={effectiveMax}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <AddRail cols={cols} alternatives={sharedAlts} onAdd={addSlug} maxCap={effectiveMax} />
      </div>
    </main>
    </>
  )
}
