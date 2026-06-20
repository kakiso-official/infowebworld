'use client'

import '../styles/compare.css'

/* ─────────────────────────────────────────────────────────────
   /compare — client orchestrator (heavy redesign to match the
   GetApp-style reference Aadil shared).

   Headline changes vs v1:
     • SmartLogo waterfall — col.logoUrl → Google Favicon for the
       website domain → letter tile. Fixes the "no logo coming"
       complaint when a listing has logoUrl null/broken.
     • Section icons + premium section headers.
     • ReviewsCell completely rebuilt — overall rating, vertical
       distribution bars, sub-attribute ratings, would-recommend %,
       pros/cons as quote cards.
     • Pricing cell with "APP INFO" pill button.
     • Screenshots cell with multiple thumbs + count badge overlay.
     • Empty-section auto-skip: when none of the columns have data
       for a section the whole section block is hidden (no more dead
       "No screenshots shared yet" placeholder rows).
     • Disclosure banner at top, "Good recommendations?" feedback
       row in the right rail, alternatives nicer.
     • Single-column state polished — feels like a mini /company
       page with a strong "Pick a 2nd product" CTA in the rail.
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
  type CompareCol,
  type CompareAlternative,
  type AlternativesBySlug,
  type CompareReview,
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
  iconScreens: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
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
  iconFeatures: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  iconIntegrations: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 16h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2M8 6H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M8 12h8" />
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
  iconKF: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 11l3 3 8-8M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  iconIndustry: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  iconUse: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 5 12c-.6.7-1 1.5-1 2.4V18H8v-1.6c0-.9-.4-1.7-1-2.4A7 7 0 0 1 12 2z" />
    </svg>
  ),
  iconSupport: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-7h3v5zM3 19a2 2 0 0 0 2 2h1v-7H3v5z" />
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
  iconFaq: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
}

/* ── Helpers ──────────────────────────────────────────────── */

const truncate = (s: string, n: number) => s.length > n ? s.slice(0, n).trimEnd() + '…' : s
const uniq = <T extends string>(arr: T[]) => Array.from(new Set(arr))

/** Domain extraction tolerant of http/https/no-scheme/path/query. */
function domainOf(website: string | null): string | null {
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

/** Lowest-tier price derivation (used when starting_price is null). */
function effectiveStartingPrice(col: CompareCol): { amount: string; period: string } | null {
  if (col.startingPrice && Number(col.startingPrice) > 0) {
    return { amount: Number(col.startingPrice).toFixed(0), period: col.startingPricePeriod || '/ month' }
  }
  if (col.pricingTiers.length > 0) {
    const sortable = col.pricingTiers
      .map(t => ({ tier: t, num: Number(String(t.price).replace(/[^\d.]/g, '')) }))
      .filter(p => p.num > 0)
      .sort((a, b) => a.num - b.num)
    if (sortable.length > 0) {
      const first = sortable[0]
      return { amount: first.num.toFixed(0), period: first.tier.period || '/ month' }
    }
  }
  return null
}

/* ── Search picker ───────────────────────────────────────── */

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
  /** Optional L1 sector slug — when set, the search API restricts
      results to products in this sector (same first-level category). */
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
        const url = `/api/search/companies?q=${encodeURIComponent(q.trim())}&exclude=${encodeURIComponent(excludeKey)}${sectorPart}`
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
        placeholder={placeholder || 'Type a product name'}
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
            ? <div className="cpr-srch-empty">No products match &ldquo;{q}&rdquo;.</div>
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
        <h1 className="cpr-land-h1">Which product would you like to compare?</h1>
        <p className="cpr-land-p">
          Search a product to start — you&rsquo;ll pick a second one in the next step.
        </p>
      </div>
      <div className="cpr-land-search-only">
        <CompareSearchInput
          placeholder="Search a product by name"
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
   The comparison view doesn't unlock until at least 2 products
   are picked. This intermediate view shows the chosen company,
   prompts the user for a second pick, and surfaces same-category
   alternatives as one-click "Compare with" shortcuts. */

function PickSecondView({
  col,
  onAdd,
  onRemove,
}: {
  col: CompareCol
  onAdd: (slug: string) => void
  onRemove: () => void
}) {
  return (
    <div className="cpr-pick2">
      <h1 className="cpr-pick2-title">
        Pick a 2nd product to compare with <em>{col.companyName}</em>
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
              <Link href={`/listing/${col.slug}`} className="cpr-pick2-name">{col.companyName}</Link>
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

        {/* Search slot for second — restricted to the picked product's
            L1 sector so the comparison is always apples-to-apples. */}
        <div className="cpr-pick2-add">
          <div className="cpr-pick2-add-label">Search a product to compare with</div>
          <CompareSearchInput
            placeholder="Type a product name"
            excludeSlugs={[col.slug]}
            onPick={h => onAdd(h.slug)}
            variant="hero"
            autoFocus
            sectorFilter={col.sectorSlug}
          />
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
  col: CompareCol
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
        <Link href={`/listing/${col.slug}`} className="cpr-col-logo-link">
          <SmartLogo col={col} className="cpr-col-logo" />
        </Link>
        <div className="cpr-col-name-row">
          <Link href={`/listing/${col.slug}`} className="cpr-col-name">
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
          <Link href={`/listing/${col.slug}`} className="cpr-col-visit">
            Learn More {Ico.arrowRight}
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
  { id: 'overview',     label: 'Overview',          icon: Ico.iconOverview },
  { id: 'company-info', label: 'Company Info',      icon: Ico.iconCompany },
  { id: 'screenshots',  label: 'Screenshots',       icon: Ico.iconScreens },
  { id: 'pricing',      label: 'Pricing',           icon: Ico.iconPricing },
  { id: 'reviews',      label: 'User Reviews',      icon: Ico.iconReviews },
  { id: 'industries',   label: 'Industries Served', icon: Ico.iconIndustry },
  { id: 'use-cases',    label: 'Use Cases',         icon: Ico.iconUse },
  { id: 'support',      label: 'Support & Training', icon: Ico.iconSupport },
  { id: 'languages',    label: 'Languages',         icon: Ico.iconGlobe },
  { id: 'compliance',   label: 'Compliance',        icon: Ico.shield },
  { id: 'awards',       label: 'Awards',            icon: Ico.iconAward },
  { id: 'features',     label: 'Key features',      icon: Ico.iconKF },
  { id: 'integrations', label: 'Integrations',      icon: Ico.iconIntegrations },
  { id: 'faqs',         label: 'FAQs',              icon: Ico.iconFaq },
  { id: 'alternatives', label: 'Alternatives',      icon: Ico.iconAlts },
]

/** Crown icon — premium indicator on the leader column header.
    Used in the Total features / Total integrations headers. */
const CrownIco = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-1.5 9h-15zM3 19h18v2H3z" />
  </svg>
)

/** Larger × for the alphabetical union "missing" indicator. */
const MissIco = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

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

function CheckList({ items }: { items: { label: string; on: boolean }[] }) {
  return (
    <ul className="cpr-checklist">
      {items.map((it, i) => (
        <li key={i} className={it.on ? '' : 'is-off'}>
          <span className={`cpr-cb${it.on ? ' is-on' : ''}`}>
            {it.on ? Ico.check : Ico.dash}
          </span>
          <span>{it.label}</span>
        </li>
      ))}
    </ul>
  )
}

function OverviewCell({ col }: { col: CompareCol }) {
  const [expanded, setExpanded] = useState(false)
  const desc = col.description || ''
  const isLong = desc.length > 240

  // Platforms — always show all 4 rows like the GetApp reference, with
  // a positive check or a dim dash. Web is assumed present (every
  // company has a website).
  const platformItems = [
    { label: 'Web-based', on: true },
    { label: 'iPhone app', on: col.hasIosApp },
    { label: 'Android app', on: col.hasAndroidApp },
  ]

  // Typical customers — derive from target_company_sizes JSON. If empty
  // we still render a single mute hint.
  const COMPANY_BUCKETS = ['Freelancers', 'Small businesses', 'Mid size businesses', 'Large enterprises']
  const lowerSizes = col.targetCompanySizes.filter((s): s is string => typeof s === 'string').map(s => s.toLowerCase())
  const customerItems = COMPANY_BUCKETS.map(b => ({
    label: b,
    on: lowerSizes.some(s => s.startsWith(b.toLowerCase().split(' ')[0])),
  }))
  const showCustomers = col.targetCompanySizes.length > 0

  // Customer support — same shape as platforms
  const SUPPORT_BUCKETS = ['Phone', 'Email/Online', 'Knowledge base', 'Video tutorials', '24/7 live rep']
  const supportLower = col.supportChannels.filter((s): s is string => typeof s === 'string').map(s => s.toLowerCase())
  const supportItems = SUPPORT_BUCKETS.map(b => ({
    label: b,
    on: supportLower.some(s => s.includes(b.toLowerCase().split('/')[0])),
  }))
  const showSupport = col.supportChannels.length > 0

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

      <div className="cpr-kv">
        <div className="cpr-kv-label">Platforms supported</div>
        <CheckList items={platformItems} />
      </div>

      {showCustomers && (
        <div className="cpr-kv">
          <div className="cpr-kv-label">Typical customers</div>
          <CheckList items={customerItems} />
        </div>
      )}

      {showSupport && (
        <div className="cpr-kv">
          <div className="cpr-kv-label">Customer support</div>
          <CheckList items={supportItems} />
        </div>
      )}

      <Link href={`/listing/${col.slug}`} className="cpr-pill-link">
        View more details {Ico.arrowRight}
      </Link>
    </div>
  )
}

/** Mirrors the UI_IMAGES_FALLBACK array in app/listing/ListingDetailPage.tsx
    so a compare column shows the same screenshot set the visitor would
    see if they clicked through to /listing/<slug>. When the listing has
    uploaded real screenshots, those win; when it doesn't, this Unsplash
    set is the same fallback the public listing page uses — keeping the
    two surfaces visually consistent. Rotated per-listing via the row id
    so adjacent compare columns don't show identical images. */
const UI_FALLBACK_PHOTOS = [
  '1611162617474-5b21e879e113',
  '1488998427799-e3362cec87c3',
  '1551288049-bebda4e38f71',
  '1460925895917-afdab827c52f',
  '1611926653458-09294b3142bf',
  '1542744173-8e7e53415bb0',
  '1556761175-b413da4baf72',
  '1554224155-8d04cb21cd6c',
]
const ux = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=520&q=70`
function fallbackScreenshots(seed: number): string[] {
  const start = ((seed % UI_FALLBACK_PHOTOS.length) + UI_FALLBACK_PHOTOS.length) % UI_FALLBACK_PHOTOS.length
  return [...UI_FALLBACK_PHOTOS.slice(start), ...UI_FALLBACK_PHOTOS.slice(0, start)].map(ux)
}

/** <img> with onError → marks itself broken so the parent can swap to a
    placeholder. Used for screenshots that may 404. */
function SmartImg({
  src, alt, className,
}: { src: string; alt: string; className?: string }) {
  const [broken, setBroken] = useState(false)
  if (broken) {
    return (
      <div className={`cpr-shot-broken ${className || ''}`} aria-hidden="true">
        {Ico.iconScreens}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setBroken(true)}
      loading="lazy"
    />
  )
}

function ScreenshotsCell({ col }: { col: CompareCol }) {
  // Same priority as the public listing page: real screenshots first,
  // Unsplash placeholder set otherwise. The section always renders so
  // every column shows something — matching what the visitor would see
  // if they clicked the View profile pill.
  const real = col.screenshots
  const shots = real.length > 0 ? real : fallbackScreenshots(col.id)
  const isFallback = real.length === 0

  const hero = shots[0]
  const rest = shots.slice(1, 4)
  return (
    <div className="cpr-cell cpr-cell--shots">
      <Link href={`/listing/${col.slug}#screenshots`} className="cpr-shot-hero">
        <SmartImg src={hero} alt={`${col.companyName} screenshot`} />
        <span className="cpr-shot-badge">
          {isFallback
            ? `${shots.length} preview${shots.length !== 1 ? 's' : ''}`
            : `${real.length} screenshot${real.length !== 1 ? 's' : ''}`}
        </span>
      </Link>
      {rest.length > 0 && (
        <div className="cpr-shot-thumbs">
          {rest.map((s, i) => (
            <Link key={i} href={`/listing/${col.slug}#screenshots`} className="cpr-shot-thumb">
              <SmartImg src={s} alt="" />
            </Link>
          ))}
        </div>
      )}
      <Link href={`/listing/${col.slug}#screenshots`} className="cpr-pill-link cpr-pill-link--ghost">
        View all media {Ico.arrowRight}
      </Link>
    </div>
  )
}

/** Inline calendar icon for the "Per month" line in Pricing cells. */
const CalIco = (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

function PricingCell({ col }: { col: CompareCol }) {
  const effective = effectiveStartingPrice(col)

  // Surface the period unit ("user", "month", "yr") from the form input
  // so the inline "/user" tag is accurate. Fall back to "user" since
  // SaaS-per-seat is the most common case in the directory.
  const periodStr = (effective?.period || '').toLowerCase()
  const unit = /\bper\s+user|\/user|\buser\b/.test(periodStr) ? 'user'
             : /\bper\s+seat|\/seat|\bseat\b/.test(periodStr) ? 'seat'
             : 'user'
  const recurMonth = /month|mo/.test(periodStr)
  const recurYear  = /year|yr|annu/.test(periodStr)
  const periodLabel = recurMonth ? 'Per month'
                    : recurYear ? 'Per year'
                    : effective ? 'Per month'
                    : 'Contact for pricing'

  // Subscription flag — true when there's a recurring period OR multiple tiers
  const isSubscription = recurMonth || recurYear || col.pricingTiers.length > 0

  return (
    <div className="cpr-cell cpr-cell--pricing">
      <div className="cpr-pricing-head">
        <div className="cpr-pricing-from">Starting from</div>
        {effective ? (
          <div className="cpr-pricing-amount">
            <span className="cpr-pricing-cur">$</span>
            <span className="cpr-pricing-num">{effective.amount}</span>
            <span className="cpr-pricing-unit">/{unit}</span>
          </div>
        ) : (
          <div className="cpr-pricing-amount cpr-pricing-amount--custom">
            <span className="cpr-pricing-num">Custom</span>
          </div>
        )}
        <div className="cpr-pricing-period">
          <span className="cpr-pricing-period-ico" aria-hidden="true">{CalIco}</span>
          <span>{periodLabel}</span>
        </div>
      </div>

      <ul className="cpr-pricing-rows">
        <li className={col.hasFreeTrial ? '' : 'is-off'}>
          <span>Free trial available</span>
          <span className={`cpr-pricing-mark${col.hasFreeTrial ? ' is-on' : ' is-off'}`}>
            {col.hasFreeTrial ? Ico.check : MissIco}
          </span>
        </li>
        <li className={col.hasFreeVersion ? '' : 'is-off'}>
          <span>Free account</span>
          <span className={`cpr-pricing-mark${col.hasFreeVersion ? ' is-on' : ' is-off'}`}>
            {col.hasFreeVersion ? Ico.check : MissIco}
          </span>
        </li>
        <li className={isSubscription ? '' : 'is-off'}>
          <span>Subscription based</span>
          <span className={`cpr-pricing-mark${isSubscription ? ' is-on' : ' is-off'}`}>
            {isSubscription ? Ico.check : MissIco}
          </span>
        </li>
      </ul>

      <Link href={`/listing/${col.slug}#pricing`} className="cpr-app-info">
        App info
      </Link>
    </div>
  )
}

/** Up-arrow icon (Pros) and down-arrow icon (Cons) — coloured dots with
    an arrow inside, matching the GetApp review-quote affordance. */
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

/** Render a single review quote card — used for both Pros (green
    up-arrow + green tint) and Cons (red down-arrow + red tint). */
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

function ReviewsCell({ col }: { col: CompareCol }) {
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
          <Link href={`/listing/${col.slug}`} className="cpr-pill-link cpr-pill-link--accent">
            Write the first review {Ico.arrowRight}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cpr-cell cpr-cell--reviews">
      {/* Top: 2-column layout — left has big rating + count, right has bars */}
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

      {/* Recommend % */}
      <div className="cpr-rev-rec">
        <span className="cpr-rev-rec-num">{recommendPct}<small>%</small></span>
        <span className="cpr-rev-rec-text">would recommend this app</span>
      </div>

      {/* Pros — real reviewer quotes from reviews with rating ≥ 4 */}
      {col.topPros.length > 0 && (
        <div className="cpr-rev-pc">
          <h3 className="cpr-rev-pc-title">Pros</h3>
          {col.topPros.map(r => <QuoteCard key={r.id} review={r} kind="pro" />)}
        </div>
      )}

      {/* Cons — real reviewer quotes from reviews with rating ≤ 3 */}
      {col.topCons.length > 0 && (
        <div className="cpr-rev-pc">
          <h3 className="cpr-rev-pc-title">Cons</h3>
          {col.topCons.map(r => <QuoteCard key={r.id} review={r} kind="con" />)}
        </div>
      )}

      {/* Footer: last review timestamp */}
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

/** Shared body for the alphabetical union sections (Key Features +
    Integrations). The column with the highest total gets a crown in
    the header and a subtle teal-tinted band — matching the GetApp
    "winner" treatment from the reference. */
function UnionListCell({
  label,
  total,
  isLeader,
  union,
  colIndex,
  expanded,
  onToggle,
}: {
  label: string
  total: number
  isLeader: boolean
  union: { name: string; present: boolean[] }[]
  colIndex: number
  expanded: boolean
  onToggle: () => void
}) {
  const shown = expanded ? union : union.slice(0, 10)
  return (
    <div className="cpr-cell cpr-cell--union">
      <div className={`cpr-total-row${isLeader ? ' is-leader' : ''}`}>
        <span className="cpr-total-label">{label}</span>
        <span className="cpr-total-num">
          {isLeader && <span className="cpr-crown" aria-label="Most" title="Most">{CrownIco}</span>}
          <span>{total}</span>
        </span>
      </div>
      <ul className="cpr-union-list">
        {shown.map(f => {
          const has = f.present[colIndex]
          return (
            <li key={f.name} className={has ? '' : 'is-off'}>
              <span className="cpr-union-name">{f.name}</span>
              <span className={`cpr-union-mark${has ? ' is-on' : ' is-off'}`} aria-hidden="true">
                {has ? Ico.check : MissIco}
              </span>
            </li>
          )
        })}
      </ul>
      {union.length > 10 && (
        <button type="button" className="cpr-expand" onClick={onToggle}>
          <span>{expanded ? 'Collapse list' : 'Expand list'}</span>
          <span className="cpr-expand-chev" data-open={expanded ? 'true' : 'false'}>{Ico.chevDown}</span>
        </button>
      )}
    </div>
  )
}

/** Per-cell empty placeholder used by all the lightweight detail
    sections (Languages, Industries, Awards, etc.) when a column has
    no data. Keeps the side-by-side grid aligned. */
function EmptyCell({ text }: { text: string }) {
  return (
    <div className="cpr-cell cpr-cell--empty">
      <div className="cpr-empty-mute">{text}</div>
    </div>
  )
}

function CompanyInfoCell({ col }: { col: CompareCol }) {
  const domain = domainOf(col.website)
  const rows = [
    { label: 'Founded', value: col.founded ? String(col.founded) : null },
    { label: 'Team size', value: col.employees },
    { label: 'Headquarters', value: col.hqLocation },
    { label: 'Category', value: col.category?.name },
    { label: 'Website', value: domain, href: col.website },
    { label: 'Verified', value: col.verified ? 'Yes — by InfoWebWorld' : null },
    { label: 'Plan', value: col.plan ? col.plan.replace(/^[a-z]/, c => c.toUpperCase()) : null },
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
      <Link href={`/listing/${col.slug}`} className="cpr-pill-link">
        Full profile {Ico.arrowRight}
      </Link>
    </div>
  )
}

function KeyFeaturesCell({ col }: { col: CompareCol }) {
  if (col.keyFeatures.length === 0) {
    // Soft fallback: derive top features from flat features list
    if (col.features.length > 0) {
      return (
        <div className="cpr-cell">
          <ul className="cpr-kf-bare">
            {col.features.slice(0, 6).map((f, i) => (
              <li key={i}>
                <span className="cpr-cb is-on">{Ico.check}</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          {col.features.length > 6 && (
            <div className="cpr-empty-mute">+ {col.features.length - 6} more in the full features list below</div>
          )}
        </div>
      )
    }
    return <EmptyCell text="No key features highlighted yet." />
  }

  return (
    <div className="cpr-cell">
      {col.keyFeatures.slice(0, 5).map((f, i) => {
        /* tolerate plain-string key_features (older seeds) + { name, description } */
        const raw = f as unknown as string | { name?: string; description?: string }
        const kf = typeof raw === 'string' ? { name: raw, description: '' } : raw
        return (
          <div key={i} className="cpr-kf">
            <div className="cpr-kf-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="cpr-kf-body">
              <div className="cpr-kf-name">{kf.name}</div>
              {kf.description && <div className="cpr-kf-desc">{kf.description}</div>}
            </div>
          </div>
        )
      })}
      {col.keyFeatures.length > 5 && (
        <Link href={`/listing/${col.slug}#features`} className="cpr-pill-link cpr-pill-link--ghost">
          See all {col.keyFeatures.length} key features {Ico.arrowRight}
        </Link>
      )}
    </div>
  )
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

function AwardsCell({ col }: { col: CompareCol }) {
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

function SupportTrainingCell({ col }: { col: CompareCol }) {
  const showSupport = col.supportChannels.length > 0
  const showTraining = col.trainingOptions.length > 0
  if (!showSupport && !showTraining) return <EmptyCell text="Support & training channels not shared." />
  return (
    <div className="cpr-cell">
      {showSupport && (
        <div className="cpr-st-block">
          <div className="cpr-kv-label">Support channels</div>
          <ul className="cpr-checklist cpr-checklist--inline">
            {col.supportChannels.map((s, i) => (
              <li key={`${s}-${i}`}>
                <span className="cpr-cb is-on">{Ico.check}</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {showTraining && (
        <div className="cpr-st-block">
          <div className="cpr-kv-label">Training options</div>
          <ul className="cpr-checklist cpr-checklist--inline">
            {col.trainingOptions.map((s, i) => (
              <li key={`${s}-${i}`}>
                <span className="cpr-cb is-on">{Ico.check}</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/** Plus icon that visually morphs into an × via 45° CSS rotation when
    the parent FAQ row is open. Keeps the same SVG geometry so the
    transition is purely transform-based (cheap, smooth). */
const FaqPlus = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

function FaqsCell({ col }: { col: CompareCol }) {
  // First FAQ open by default — gives visitors immediate content instead
  // of forcing a click before they see any answer.
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

/** Compare icon — two outlined columns side by side with a dashed
    vertical separator between them. Clean, readable, matches the
    GetApp button graphic. */
const CompareIco = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="6.5" height="16" rx="1.2" />
    <rect x="14.5" y="4" width="6.5" height="16" rx="1.2" />
    <line x1="12" y1="6" x2="12" y2="18" strokeDasharray="1.5 2.2" />
  </svg>
)

/** Per-column Alternatives card stack. Mirrors the GetApp pattern: each
    column's "Alternatives" cell shows the 3 nearest siblings of THAT
    column's product (not a union). Click COMPARE on any alt → it's
    appended to the URL slug list and the page re-fetches — full
    real-time swap, no client-side state. */
function AlternativesCell({
  alternatives,
  currentSlugs,
  thisCol,
  maxCap,
}: {
  alternatives: CompareAlternative[]
  currentSlugs: string[]
  thisCol: CompareCol
  maxCap: number
}) {
  const show = alternatives.slice(0, 3)
  const moreHref = thisCol.category?.slug ? `/${thisCol.category.slug}` : '/categories'

  if (show.length === 0) {
    return (
      <div className="cpr-cell cpr-cell--alts">
        <div className="cpr-alt-empty">
          <div className="cpr-empty-mute">No alternatives indexed in this category yet.</div>
          <Link href={moreHref} className="cpr-alt-more">See more apps</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cpr-cell cpr-cell--alts">
      {show.map(a => {
        const isFull = currentSlugs.length >= maxCap
        // Build the new URL: if the alt is already in compare, navigate
        // to its company page; otherwise append (and drop the oldest if full).
        const alreadyComparing = currentSlugs.includes(a.slug)
        const newSlugs = alreadyComparing
          ? currentSlugs
          : (isFull
              ? [...currentSlugs.slice(0, maxCap - 1), a.slug]
              : [...currentSlugs, a.slug])
        const compareHref = alreadyComparing
          ? `/listing/${a.slug}`
          : buildCompareUrl(newSlugs)
        return (
          <div key={a.slug} className="cpr-alt2">
            <div className="cpr-alt2-head">
              <SmartLogo
                col={{ logoUrl: a.logoUrl, website: a.website, companyName: a.companyName }}
                className="cpr-alt2-logo"
              />
              <div className="cpr-alt2-id">
                <Link href={`/listing/${a.slug}`} className="cpr-alt2-name">
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
      <Link href={moreHref} className="cpr-alt-more">See more apps</Link>
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
        body: JSON.stringify({ email, slugs }),
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
  alternatives,        // shared union list for the rail widget
  onAdd,
  maxCap,              // mobile=2, desktop=4
}: {
  cols: CompareCol[]
  alternatives: CompareAlternative[]
  onAdd: (slug: string) => void
  maxCap: number
}) {
  const excludeSlugs = cols.map(c => c.slug)
  const canAdd = cols.length < maxCap
  // Lock the rail search to the L1 sector of the first column so users
  // can only add same-sector products (matches the rule applied on the
  // pick-second view).
  const sectorFilter = cols[0]?.sectorSlug || null
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  return (
    <aside className="cpr-rail">
      <div className="cpr-rail-card">
        <div className="cpr-rail-label">ADD TO COMPARE</div>
        {canAdd ? (
          <CompareSearchInput
            placeholder="Type an app name"
            excludeSlugs={excludeSlugs}
            onPick={h => onAdd(h.slug)}
            variant="panel"
            sectorFilter={sectorFilter}
          />
        ) : (
          <div className="cpr-rail-full">
            <strong>{maxCap} products</strong> is the maximum. Remove one to add another.
          </div>
        )}
        <div className="cpr-rail-counter">
          {cols.length} of {maxCap} added
        </div>
      </div>

      {alternatives.length > 0 && (
        <div className="cpr-rail-card">
          <div className="cpr-rail-label">COMPARE SIMILAR APPS</div>
          <div className="cpr-rail-list">
            {alternatives.slice(0, 4).map(a => (
              <button
                key={a.slug}
                type="button"
                className="cpr-rail-alt"
                onClick={() => canAdd && onAdd(a.slug)}
                disabled={!canAdd}
              >
                <SmartLogo col={{ logoUrl: a.logoUrl, website: null, companyName: a.companyName }} className="cpr-rail-alt-logo" />
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

/** Track viewport width — capped at 2 columns on mobile per Aadil's
    spec ("only two comparisons that is it no other thing only two"). */
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

export default function ComparePage({
  initialCols,
  initialAlts,
  requestedSlugs,
  maxCompare = MAX_COMPARE,
}: {
  initialCols: CompareCol[]
  initialAlts: AlternativesBySlug
  requestedSlugs: string[]
  maxCompare?: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile(768)

  // Mobile cap: max 2 columns. Anything beyond is trimmed both at render
  // time AND in the URL (replace, so the back button isn't polluted).
  const mobileMax = 2
  const effectiveMax = isMobile ? mobileMax : maxCompare
  const cols = useMemo(
    () => (isMobile ? initialCols.slice(0, mobileMax) : initialCols),
    [isMobile, initialCols]
  )
  const altsBySlug = initialAlts
  const sharedAlts = altsBySlug._shared || []
  const currentSlugs = useMemo(() => cols.map(c => c.slug), [cols])

  // If the URL has more slugs than mobile allows, normalize it once on
  // mount so reload state is clean.
  useEffect(() => {
    if (isMobile && initialCols.length > mobileMax) {
      const trimmed = initialCols.slice(0, mobileMax).map(c => c.slug)
      router.replace(buildCompareUrl(trimmed))
    }
  }, [isMobile, initialCols, router])

  const [activeSection, setActiveSection] = useState('overview')
  const [expandFeats, setExpandFeats] = useState(false)
  const [expandInteg, setExpandInteg] = useState(false)
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set())

  // Scroll-spy — deterministic scroll-position handler. After clicking a
  // TOC link the anchor lands ~140px below the viewport top (matches
  // scroll-margin-top on .cpr-sec-head). We pick the LAST section header
  // whose top has scrolled past the trigger line — that's the section
  // currently at the top of the reading area.
  //
  // Click-lock: when the user clicks a TOC link, the click handler sets
  // the active section IMMEDIATELY and blocks the spy for 700ms so the
  // smooth-scroll transit (during which intermediate sections cross the
  // trigger line) cannot fight the user's intent.
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

  // useTransition wraps navigations so React marks them as low-priority
  // updates AND exposes `isPending` — the brief gap between click and
  // the new server data arriving used to feel like nothing happened.
  // Now we render a top progress bar + dim overlay while isPending is
  // true so the click has immediate visual feedback.
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

  /* ── 1-product state — comparison locked until 2nd pick ── */
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
  const titleText = cols.length === 1
    ? `Compare ${cols[0].companyName}`
    : `${titleNames} Comparison (${new Date().getFullYear()})`

  // Feature & integration union (computed once). Each column's TOTAL is
  // the number of unique items it has; the column with the highest total
  // is flagged as `isLeader` so it gets the crown + tinted header row.
  const featData = useMemo(() => {
    const lists = cols.map(c => uniq([
      ...c.features,
      /* Older seeds store key_features as plain strings, not { name } objects —
         tolerate both so the union never hits undefined.trim(). */
      ...(c.keyFeatures as Array<string | { name?: string }>).map(k => typeof k === 'string' ? k : k?.name),
    ].filter((s): s is string => typeof s === 'string')))
    const totals = lists.map(l => l.length)
    const max = Math.max(0, ...totals)
    const all = uniq(lists.flat().map(s => s.trim()).filter(Boolean)).sort((a, b) => a.localeCompare(b))
    const union = all.map(name => ({
      name,
      present: lists.map(list => list.some(item => item.toLowerCase() === name.toLowerCase())),
    }))
    return { union, totals, max }
  }, [cols])
  const intData = useMemo(() => {
    const lists = cols.map(c => uniq(
      (c.integrations as Array<string | { name?: string }>).map(i => typeof i === 'string' ? i : i?.name)
        .filter((s): s is string => typeof s === 'string')
    ))
    const totals = lists.map(l => l.length)
    const max = Math.max(0, ...totals)
    const all = uniq(lists.flat().map(s => s.trim()).filter(Boolean)).sort((a, b) => a.localeCompare(b))
    const union = all.map(name => ({
      name,
      present: lists.map(list => list.some(item => item.toLowerCase() === name.toLowerCase())),
    }))
    return { union, totals, max }
  }, [cols])

  // Empty-section auto-skip predicates — auto-show Screenshots
  // unconditionally because the cell falls back to a thum.io live
  // preview when the listing has no uploaded shots.
  const anyHasReviews    = cols.some(c => c.ratingCount > 0 || c.pros.length > 0 || c.cons.length > 0)
  const anyHasFeats      = featData.union.length > 0
  const anyHasIntegs     = intData.union.length > 0
  const anyHasAlts       = cols.some(c => (altsBySlug[c.slug] || []).length > 0)
  const anyHasCompanyInfo = cols.some(c => c.founded || c.employees || c.hqLocation || c.website || c.category)
  const anyHasKF         = cols.some(c => c.keyFeatures.length > 0 || c.features.length > 0)
  const anyHasIndustries = cols.some(c => c.industriesServed.length > 0)
  const anyHasUseCases   = cols.some(c => c.useCases.length > 0)
  const anyHasSupport    = cols.some(c => c.supportChannels.length > 0 || c.trainingOptions.length > 0)
  const anyHasLanguages  = cols.some(c => c.languages.length > 0)
  const anyHasCompliance = cols.some(c => c.compliance.length > 0)
  const anyHasAwards     = cols.some(c => c.awards.length > 0)
  const anyHasFaqs       = cols.some(c => c.faqs.length > 0)

  // Build the visible sections list based on data presence
  const visibleSections = useMemo(() => SECTIONS.filter(s => {
    switch (s.id) {
      case 'overview':     return true
      case 'company-info': return anyHasCompanyInfo
      case 'screenshots':  return true  // always — Unsplash fallback
      case 'pricing':      return true
      case 'reviews':      return anyHasReviews
      case 'industries':   return anyHasIndustries
      case 'use-cases':    return anyHasUseCases
      case 'support':      return anyHasSupport
      case 'languages':    return anyHasLanguages
      case 'compliance':   return anyHasCompliance
      case 'awards':       return anyHasAwards
      case 'features':     return anyHasFeats
      case 'integrations': return anyHasIntegs
      case 'faqs':         return anyHasFaqs
      case 'alternatives': return anyHasAlts
      default: return true
    }
  }), [anyHasCompanyInfo, anyHasReviews, anyHasIndustries, anyHasUseCases, anyHasSupport, anyHasLanguages, anyHasCompliance, anyHasAwards, anyHasFeats, anyHasIntegs, anyHasFaqs, anyHasAlts])

  const breadCat = cols[0].category
  const gridStyle = { ['--cpr-n' as string]: cols.length } as React.CSSProperties

  return (
    <>
      {isPending && <div className="cpr-nav-bar" aria-hidden="true" />}
      <main className="cpr-page" key={pathname} data-loading={isPending ? 'true' : 'false'}>
      <DisclosureBanner />

      <div className="cpr-titlebar">
        <div className="cpr-titlebar-inner">
          {breadCat && (
            <nav className="cpr-crumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/categories">Categories</Link>
              <span aria-hidden="true">/</span>
              <Link href={`/${breadCat.slug}`} style={{ color: breadCat.color }}>{breadCat.name}</Link>
            </nav>
          )}
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

          {cols.length === 1 && (
            <div className="cpr-encourage">
              <div className="cpr-encourage-ico">{Ico.add}</div>
              <div className="cpr-encourage-body">
                <strong>Add a second product</strong>
                <span>to put {cols[0].companyName} side-by-side and see how they stack up.</span>
              </div>
            </div>
          )}

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

          {/* Screenshots — always rendered with thum.io fallback */}
          <section className="cpr-sec">
            <SectionHead {...SECTIONS.find(s => s.id === 'screenshots')!} />
            <div className="cpr-cols" style={gridStyle}>
              {cols.map(col => <ScreenshotsCell key={col.id} col={col} />)}
            </div>
          </section>

          {/* Pricing */}
          <section className="cpr-sec">
            <SectionHead {...SECTIONS.find(s => s.id === 'pricing')!} />
            <div className="cpr-cols" style={gridStyle}>
              {cols.map(col => <PricingCell key={col.id} col={col} />)}
            </div>
          </section>

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

          {/* Use Cases */}
          {anyHasUseCases && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'use-cases')!} />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map(col => (
                  <PillListCell
                    key={col.id}
                    items={col.useCases}
                    emptyText="No use cases listed yet."
                    accent="neutral"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Support & Training */}
          {anyHasSupport && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'support')!} />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map(col => <SupportTrainingCell key={col.id} col={col} />)}
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

          {/* Compliance */}
          {anyHasCompliance && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'compliance')!} />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map(col => (
                  <PillListCell
                    key={col.id}
                    items={col.compliance}
                    emptyText="No compliance certifications listed yet."
                    accent="green"
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

          {/* Key features (alphabetical union with crown on winner) */}
          {anyHasFeats && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'features')!} />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map((col, i) => (
                  <UnionListCell
                    key={col.id}
                    label="Total features"
                    total={featData.totals[i]}
                    isLeader={featData.totals[i] === featData.max && featData.max > 0}
                    union={featData.union}
                    colIndex={i}
                    expanded={expandFeats}
                    onToggle={() => setExpandFeats(v => !v)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Integrations (alphabetical union with crown on winner) */}
          {anyHasIntegs && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'integrations')!} />
              <div className="cpr-cols" style={gridStyle}>
                {cols.map((col, i) => (
                  <UnionListCell
                    key={col.id}
                    label="Total integrations"
                    total={intData.totals[i]}
                    isLeader={intData.totals[i] === intData.max && intData.max > 0}
                    union={intData.union}
                    colIndex={i}
                    expanded={expandInteg}
                    onToggle={() => setExpandInteg(v => !v)}
                  />
                ))}
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

          {/* Alternatives — each column gets its own siblings list */}
          {anyHasAlts && (
            <section className="cpr-sec">
              <SectionHead {...SECTIONS.find(s => s.id === 'alternatives')!} sub="Explore similar apps" />
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
