'use client'
import { useState } from 'react'
import Link from 'next/link'
import { I, ic, type IconKey } from './icons'
import Stars from './Stars'
import CompareSearchBar from './CompareSearchBar'
import SignupModal from '../components/auth/SignupModal'
import { useAuth } from '@/lib/use-auth'
import type { RealSubmission } from '../iww-hq/data/submissions-storage'

/* ── Demo listing type ── */
export type DemoListing = {
  name: string; tagline: string; description?: string
  logoIcon: string; logoColor: string
  score: string; stars: number; reviews: string
  cat: string; listingType: string; verified: boolean
  features: string[]
  website: string
  tags: string[]
  slug?: string
}

/* The Goodfirms-style teal that drives every accent on the card. Single
   source so a future rebrand only touches this file. */
const ACCENT = '#0E8F6E'

/* External-link glyph used in two spots (next to the name and inside the
   "VISIT WEBSITE" button). Kept inline so the component stays single-file. */
function ExtIcon({ size = 12, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
    </svg>
  )
}

/* Same crossing-arrows compare glyph used in the listing page's "Popular
   comparisons" cards (ListingDetailPage.tsx → TrendIcon). Red up-arrow
   plus dark down-arrow visually signals "stack X against Y". Kept inline
   so the listing card stays self-contained. */
function CompareIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M5 31 L20 18 L30 26 L43 14" fill="none" stroke="#FF5A5F" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34 12 L46 12 L46 24" fill="none" stroke="#FF5A5F" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M59 33 L44 46 L34 38 L21 50" fill="none" stroke="#1F2937" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 52 L18 52 L18 40" fill="none" stroke="#1F2937" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Right-hand action cluster — Visit Website (teal solid) plus a swap-target
 * row that holds either the [Compare] [Save] buttons or, once the user
 * clicks Compare, an inline search bar that lets them pick a same-sector
 * company to compare against. The swap is purely visual; the listing card
 * itself doesn't re-render around it.
 */
function CardActions({
  website,
  fromSlug,
  sectorSlug,
}: {
  website: string
  fromSlug: string
  sectorSlug: string
}) {
  const { user, refresh } = useAuth()
  const [saved, setSaved] = useState(false)
  const [savedPending, setSavedPending] = useState(false)
  const [comparing, setComparing] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  /* When an anon user clicks Save or Compare we open the signup modal and
     remember which action to resume after they authenticate. */
  const [pendingAction, setPendingAction] = useState<'save' | 'compare' | null>(null)

  /* Network call to bookmark / unbookmark. Optimistic UI: flip the local
     `saved` flag before the request; roll back on failure. */
  const persistSave = async (next: boolean) => {
    if (!fromSlug) return
    setSavedPending(true)
    try {
      const res = await fetch(`/api/listings/${fromSlug}/bookmark`, {
        method: next ? 'POST' : 'DELETE',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSaved(next)
    } catch {
      /* leave `saved` as it was — caller will see no flip and can retry */
    } finally {
      setSavedPending(false)
    }
  }

  const handleSave = () => {
    if (!user) {
      setPendingAction('save')
      setAuthOpen(true)
      return
    }
    persistSave(!saved)
  }

  const handleCompare = () => {
    if (!sectorSlug) return
    if (!user) {
      setPendingAction('compare')
      setAuthOpen(true)
      return
    }
    setComparing(true)
  }

  /* SignupModal onSuccess fires when the user successfully signs up OR
     logs in. Resume the action they originally clicked. */
  const handleAuthSuccess = () => {
    setAuthOpen(false)
    refresh()
    const action = pendingAction
    setPendingAction(null)
    if (action === 'save') {
      /* `user` from useAuth refreshes asynchronously; persistSave needs no
         user prop (the API knows from the cookie set by the modal), so we
         can fire it immediately. */
      persistSave(true)
    } else if (action === 'compare') {
      setComparing(true)
    }
  }

  return (
    <div className="cd-lc-actions">
      <a
        href={website || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="cd-lc-visit"
      >
        Visit website
        <ExtIcon size={12} color="#fff" />
      </a>
      <div className={'cd-lc-swap' + (comparing ? ' cd-lc-swap--cmp' : '')}>
        {!comparing && (
          <>
            <button
              className="cd-lc-btn"
              type="button"
              onClick={handleCompare}
              disabled={!sectorSlug}
              title={sectorSlug ? 'Compare with another company' : 'Sector unknown — compare unavailable'}
            >
              <CompareIcon size={15} />
              Compare
            </button>
            <button
              className={'cd-lc-btn cd-lc-btn-save' + (saved ? ' cd-lc-btn-save--on' : '')}
              type="button"
              onClick={handleSave}
              disabled={savedPending}
              aria-pressed={saved}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? ACCENT : 'none'} stroke={saved ? ACCENT : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {saved ? 'Saved' : 'Save'}
            </button>
          </>
        )}
        {comparing && (
          <CompareSearchBar
            fromSlug={fromSlug}
            sectorSlug={sectorSlug}
            onClose={() => setComparing(false)}
          />
        )}
      </div>

      <SignupModal
        open={authOpen}
        onClose={() => { setAuthOpen(false); setPendingAction(null) }}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}

/* ── Mini related card (inside "Users also considered") ── */
function MiniCard({ item }: { item: DemoListing }) {
  return (
    <div className="cd-lc-mini">
      <div className="cd-lc-mini-logo" style={{ background: `${item.logoColor}14` }}>
        <I d={ic[item.logoIcon as IconKey] || ic.grid} size={20} color={item.logoColor} />
      </div>
      <h4 className="cd-lc-mini-name">{item.name}</h4>
      <div className="cd-lc-mini-rating">
        <span className="cd-lc-mini-score">{item.score}</span>
        <Stars rating={item.stars} size={12} />
        <span className="cd-lc-mini-reviews">({item.reviews})</span>
      </div>
      <p className="cd-lc-mini-desc">{item.tagline}</p>
      <a href="#" className="cd-lc-mini-link">Learn more</a>
    </div>
  )
}

/* ── "Users also considered" expandable footer ── */
function AlsoConsidered({ current, allItems }: { current: string; allItems: DemoListing[] }) {
  const [open, setOpen] = useState(false)
  const related = allItems.filter(i => i.name !== current).slice(0, 3)
  if (related.length === 0) return null

  return (
    <div className="cd-lc-also">
      <button className="cd-lc-also-toggle" onClick={() => setOpen(o => !o)} type="button" aria-expanded={open}>
        <span className="cd-lc-also-left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
          <span className="cd-lc-also-label">Users also considered</span>
        </span>
        <span className={'cd-lc-also-chev' + (open ? ' cd-lc-also-chev--on' : '')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="cd-lc-also-panel">
          <div className="cd-lc-also-grid">
            {related.map((item, i) => <MiniCard key={i} item={item} />)}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Demo card ── */
export function DemoListingCard({ item, isPreview, allItems }: { item: DemoListing; isPreview: boolean; allItems?: DemoListing[] }) {
  const desc = item.description || item.tagline

  return (
    <div className="cd-lc">
      <div className="cd-lc-header">
        <div className="cd-lc-logo" style={{ background: `${item.logoColor}12` }}>
          <I d={ic[item.logoIcon as IconKey] || ic.grid} size={28} color={item.logoColor} />
        </div>

        <div className="cd-lc-info">
          <div className="cd-lc-name-row">
            <h3 className="cd-lc-name">
              {item.name}
              <ExtIcon size={12} color={ACCENT} />
            </h3>
            {isPreview && <span className="cd-lc-preview">Preview</span>}
          </div>

          <div className="cd-lc-rating-row">
            <span className="cd-lc-score">{item.score}</span>
            <Stars rating={item.stars} size={14} />
            <span className="cd-lc-reviews">({item.reviews})</span>
          </div>

          <p className="cd-lc-subtitle">{item.tagline}</p>
        </div>

        <CardActions
          website={item.website}
          fromSlug={item.slug || ''}
          sectorSlug=""
        />
      </div>

      <div className="cd-lc-desc-section">
        <p className="cd-lc-desc">{desc}</p>
        <a href="#" className="cd-lc-readmore">Read more about {item.name}</a>
      </div>

      {allItems && <AlsoConsidered current={item.name} allItems={allItems} />}
    </div>
  )
}

/* ── Real card ── */
export function RealListingCard({
  item,
  color,
  sectorSlug = '',
}: {
  item: RealSubmission
  color: string
  sectorSlug?: string
}) {
  const initial = item.companyName.charAt(0).toUpperCase()
  const itemColor = item.categoryColor || color
  const desc = item.description || item.tagline || ''

  return (
    <div className="cd-lc">
      <div className="cd-lc-header">
        {item.logoUrl ? (
          <div className="cd-lc-logo">
            <img src={item.logoUrl} alt={item.companyName} />
          </div>
        ) : (
          <div className="cd-lc-logo" style={{ background: `${itemColor}14` }}>
            <span className="cd-lc-logo-initial" style={{ color: itemColor }}>{initial}</span>
          </div>
        )}

        <div className="cd-lc-info">
          <div className="cd-lc-name-row">
            <h3 className="cd-lc-name">
              <Link href={`/company/${item.slug}`}>{item.companyName}</Link>
              <ExtIcon size={12} color={ACCENT} />
            </h3>
            {(item.city || item.country) && (
              <span className="cd-lc-location">
                {[item.city, item.state, item.country].filter(Boolean).join(', ')}
              </span>
            )}
          </div>

          <div className="cd-lc-rating-row">
            <span className="cd-lc-score">4.5</span>
            <Stars rating={4} size={14} />
            <span className="cd-lc-reviews">(0)</span>
          </div>

          <p className="cd-lc-subtitle">{item.tagline}</p>
        </div>

        <CardActions
          website={item.website || '#'}
          fromSlug={item.slug}
          sectorSlug={sectorSlug}
        />
      </div>

      {desc && (
        <div className="cd-lc-desc-section">
          <p className="cd-lc-desc">{desc}</p>
          <Link href={`/company/${item.slug}`} className="cd-lc-readmore">
            Read more about {item.companyName}
          </Link>
        </div>
      )}
    </div>
  )
}
