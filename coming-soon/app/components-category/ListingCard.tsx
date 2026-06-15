'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar, faStarHalfStroke,
  faCircleInfo, faArrowRight, faRightLeft,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons'
import SignupModal from '../components/auth/SignupModal'
import CompareSearchBar from './CompareSearchBar'
import { useAuth } from '@/lib/use-auth'
import { withInfoWebWorldUtm } from '../lib/utm'
import { trackWebsiteClick } from '../lib/track-website-click'
import { listingOutboundRel } from '@/lib/user-plan-types'
import type { RealSubmission } from '../iww-hq/data/submissions-storage'

/* ════════════════════════════════════════════════════════════════════════
   Magneto-style category listing card.

   Top strip:
     • Logo tile · Company name (with city/country) · rating row + Verified pill
     • Bookmark · SF Score ring · View Profile (outline) · Visit Website (solid)

   Body (3 columns):
     • Left   → Services Provided — multi-hue stacked bar + percentage list
     • Center → Tagline · description · See all N+ Portfolios · info icons
     • Right  → Verified Client Review aside

   All accent colors come from the parent .tcat-<sector-slug> scope via
   --c1 / --c4 / --c4-dark. The card itself is pure white.
   ════════════════════════════════════════════════════════════════════════ */

/* Color palette for the service stacked bar — tuned to match the Magneto
   reference exactly (mustard, vivid purple, peach, red, lime, grass green,
   dark navy, blue, lavender, gray). Same color paints the bar segment and
   the matching list dot. */
const SVC_PALETTE = [
  '#FCC419', // mustard yellow
  '#845EF7', // vivid purple
  '#FBB7A3', // peach
  '#FF5B5B', // red
  '#8FD14F', // lime green
  '#5DBA3A', // grass green
  '#1F1F2E', // near-black navy
  '#3B82F6', // blue
  '#A78BFA', // lavender
  '#6B7280', // gray
]

function svcColor(i: number): string {
  return SVC_PALETTE[i % SVC_PALETTE.length]
}

/* Outline bookmark — only solid pack is installed, so we keep the bookmark
   outline as a tiny inline SVG (FA solid would always render filled). */
function BookmarkIcon({ filled = false, size = 18 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  )
}

/* Verified pill icon — teal filled circle + white check.
   Matches Magneto/Clutch's verified pill exactly. Fixed teal (verification is
   a brand-level signal, not a sector-themed accent). */
function VerifiedCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1AAFAB" />
      <path d="M8 12.2l3 3 5-5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* Info-row icons — stroke-outline style matching the Magneto reference
   exactly. FA solid pack renders filled glyphs which read too heavy here. */
function ClockOutlineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  )
}
function FileOutlineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}
function PeopleOutlineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
function PinOutlineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

/* Standalone shield badge — blue shield with white check + soft halo ring.
   Sits next to the Verified pill (the "InfoWebWorld secured" indicator).
   Fixed blue for the same brand-signal reason. */
function ShieldCheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#E2F1F7" />
      <path
        d="M12 4l6.5 2.4v5c0 3.9-2.7 7.2-6.5 8.2-3.8-1-6.5-4.3-6.5-8.2v-5L12 4z"
        fill="#5BB3D4"
      />
      <path
        d="M9 12.2l2 2 4-4.2"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* Rating stars — FA solid faStar / faStarHalfStroke. */
function Stars({ value }: { value: number }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <span className="cd-lc-stars" aria-label={`${value.toFixed(1)} out of 5`}>
      {[0, 1, 2, 3, 4].map(i => {
        if (i < full) {
          return <FontAwesomeIcon key={i} icon={faStar} className="cd-lc-star cd-lc-star--on" />
        }
        if (i === full && half) {
          return <FontAwesomeIcon key={i} icon={faStarHalfStroke} className="cd-lc-star cd-lc-star--on" />
        }
        return <FontAwesomeIcon key={i} icon={faStar} className="cd-lc-star cd-lc-star--off" />
      })}
    </span>
  )
}

/* ── Bookmark — auth-gated; opens signup modal for anon users ────────── */
function BookmarkButton({ slug }: { slug: string }) {
  const { user, refresh } = useAuth()
  const [saved, setSaved] = useState(false)
  const [pending, setPending] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  const persist = async (next: boolean) => {
    if (!slug) return
    setPending(true)
    try {
      const res = await fetch(`/api/listings/${slug}/bookmark`, { method: next ? 'POST' : 'DELETE' })
      if (res.ok) setSaved(next)
    } finally {
      setPending(false)
    }
  }

  const handle = () => {
    if (!user) { setAuthOpen(true); return }
    persist(!saved)
  }

  return (
    <>
      <button
        type="button"
        className={'cd-lc-bookmark' + (saved ? ' cd-lc-bookmark--on' : '')}
        onClick={handle}
        disabled={pending}
        aria-pressed={saved}
        aria-label={saved ? 'Remove bookmark' : 'Save listing'}
      >
        <BookmarkIcon filled={saved} size={18} />
      </button>
      <SignupModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => { setAuthOpen(false); refresh(); persist(true) }}
      />
    </>
  )
}

/* ── Real card (Magneto layout) ───────────────────────────────────────── */
export function RealListingCard({
  item,
  sectorSlug = '',
}: {
  item: RealSubmission
  /** Per-card color override (not used; palette comes from .tcat-<slug> scope). */
  color?: string
  sectorSlug?: string
}) {
  const initial = item.companyName.charAt(0).toUpperCase()
  const desc = item.description || item.tagline || ''
  const profileHref = (item.listingMode === 'company' ? '/profile/' : '/listing/') + item.slug
  const rating = item.reviewAvg > 0 ? item.reviewAvg : 0
  const reviewCount = item.reviewCount
  const services = item.serviceLines
  const portfolioCount = item.screenshots.length + item.clientLogos.length
  const locationParts = [item.city, item.state, item.country].filter(Boolean)
  /* Compare flow: click the gradient button → actions cluster collapses into
     a sector-scoped search bar. Picking a result navigates to /compare/
     {thisSlug}-vs-{picked}. CompareSearchBar handles the search + nav. */
  const [comparing, setComparing] = useState(false)

  /* Unified left-column data. Real serviceLines (agencies) come with real
     percentages. Products fall back to keyFeatures / features / industries /
     pros / compliance — and we synthesize equal-share percentages on those
     (same approach used by /listing's "Who Uses" donut chart). One render
     path: stacked bar + list with %, always. */
  const leftCol: { title: string; items: { name: string; percentage: number }[] } | null = (() => {
    if (services.length > 0) {
      return { title: 'Services Provided', items: services }
    }
    const equalShare = (names: string[]): { name: string; percentage: number }[] => {
      const trimmed = names.filter(Boolean).slice(0, 7)
      if (trimmed.length === 0) return []
      const base = Math.floor(100 / trimmed.length)
      const remainder = 100 - base * trimmed.length
      return trimmed.map((name, i) => ({
        name,
        percentage: base + (i === 0 ? remainder : 0),
      }))
    }
    const features = item.keyFeatures.length > 0
      ? item.keyFeatures.map(f => f.name)
      : item.features
    if (features.filter(Boolean).length > 0) {
      return { title: 'Key Features', items: equalShare(features) }
    }
    if (item.industriesServed.length > 0) {
      return { title: 'Industries Served', items: equalShare(item.industriesServed) }
    }
    if (item.pros.length > 0) {
      return { title: 'Highlights', items: equalShare(item.pros) }
    }
    if (item.compliance.length > 0) {
      return { title: 'Compliance', items: equalShare(item.compliance) }
    }
    return null
  })()
  const hasLeftCol = leftCol !== null
  const leftColTotal = leftCol ? leftCol.items.reduce((a, s) => a + s.percentage, 0) : 0

  return (
    <article className="cd-lc">
      {/* ── Top strip ── */}
      <header className="cd-lc-top">
        <div className="cd-lc-id">
          {item.logoUrl ? (
            <div className="cd-lc-logo">
              <img
                src={item.logoUrl}
                alt={`${item.companyName} — ${item.category || 'company'} listed on InfoWebWorld`}
                loading="lazy"
                width="64"
                height="64"
              />
            </div>
          ) : (
            <div className="cd-lc-logo cd-lc-logo--ph">
              <span>{initial}</span>
            </div>
          )}
          <div className="cd-lc-meta">
            <h3 className="cd-lc-name">
              <Link href={profileHref}>{item.companyName}</Link>
            </h3>
            {/* Rating row — ALWAYS rendered. Shows "0.0 (0 Reviews)" + empty stars
                when no reviews yet. Verified pill + secured shield ALWAYS shown:
                every displayed listing is status='active' so it's been vetted. */}
            <div className="cd-lc-rate">
              <span className="cd-lc-rate-num">{rating.toFixed(1)}</span>
              <Link href={`${profileHref}#insights`} className="cd-lc-rate-count">
                ({reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'})
              </Link>
              <Stars value={rating} />
              <span className="cd-lc-verified" title="Verified by InfoWebWorld">
                <VerifiedCheckIcon />
                Verified
              </span>
              <span className="cd-lc-shield" title="Secured by InfoWebWorld">
                <ShieldCheckIcon />
              </span>
            </div>
          </div>
        </div>

        {/* Actions strip — [Bookmark] [Compare (gradient)] [View Profile] [Visit Website].
            When the Compare button is clicked, the cluster morphs into an inline
            search bar (sector-scoped) that routes to /compare on selection. */}
        <div className={'cd-lc-actions' + (comparing ? ' cd-lc-actions--cmp' : '')}>
          <BookmarkButton slug={item.slug} />
          {comparing ? (
            <CompareSearchBar
              fromSlug={item.slug}
              sectorSlug={sectorSlug}
              onClose={() => setComparing(false)}
            />
          ) : (
            <>
              <button
                type="button"
                className="cd-lc-compare-btn"
                onClick={() => setComparing(true)}
                disabled={!sectorSlug}
                title={sectorSlug ? `Compare ${item.companyName} with another` : 'Sector unknown — compare unavailable'}
              >
                <FontAwesomeIcon icon={faRightLeft} className="cd-lc-compare-btn-ico" />
                Compare
              </button>
              <Link href={profileHref} className="cd-lc-btn cd-lc-btn--outline">View Profile</Link>
              {item.website ? (
                <a
                  href={withInfoWebWorldUtm(item.website, item.slug, 'category-card')}
                  target="_blank"
                  rel={listingOutboundRel(item.plan)}
                  className="cd-lc-btn cd-lc-btn--solid"
                  onClick={() => trackWebsiteClick(item.slug, 'category-card')}
                >
                  Visit Website
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="cd-lc-btn-ico" />
                </a>
              ) : (
                <Link href={profileHref} className="cd-lc-btn cd-lc-btn--solid">View Profile</Link>
              )}
            </>
          )}
        </div>
      </header>

      {/* ── Body — 3 columns when left-col data exists, 2 when it doesn't ──
          Single render path: stacked bar + percentage list, whether the data
          comes from real serviceLines or equal-share-synthesized fallback. */}
      <div className={'cd-lc-body' + (!hasLeftCol ? ' cd-lc-body--no-svcs' : '')}>
        {leftCol && (
          <div className="cd-lc-svcs">
            <div className="cd-lc-svcs-head">
              <span className="cd-lc-svcs-title">{leftCol.title}</span>
              <FontAwesomeIcon icon={faCircleInfo} className="cd-lc-svcs-info" title={leftCol.title} />
            </div>
            {leftColTotal > 0 && (
              <div className="cd-lc-svcs-bar" role="presentation">
                {leftCol.items.map((s, i) => (
                  <span
                    key={s.name + i}
                    className="cd-lc-svcs-bar-seg"
                    style={{ width: `${(s.percentage / leftColTotal) * 100}%`, background: svcColor(i) }}
                    title={`${s.percentage}% ${s.name}`}
                  />
                ))}
              </div>
            )}
            <ul className="cd-lc-svcs-list">
              {leftCol.items.map((s, i) => (
                <li
                  key={s.name + i}
                  className={'cd-lc-svcs-row' + (i === 0 ? ' cd-lc-svcs-row--primary' : '')}
                >
                  <span className="cd-lc-svcs-dot" style={{ background: svcColor(i) }} aria-hidden="true" />
                  <span className="cd-lc-svcs-pct">{s.percentage}%</span>
                  <span className="cd-lc-svcs-name">{s.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Center: Tagline · description · portfolios · info icons */}
        <div className="cd-lc-main">
          {item.tagline && <p className="cd-lc-tag">{item.tagline}</p>}
          {desc && <p className="cd-lc-desc">{desc}</p>}
          <Link href={profileHref} className="cd-lc-portfolio">
            See full details
          </Link>
          <div className="cd-lc-info-row">
            {item.hourlyRate && (
              <span className="cd-lc-info"><span className="cd-lc-info-ico"><ClockOutlineIcon /></span>{item.hourlyRate}</span>
            )}
            {item.minProjectSize && (
              <span className="cd-lc-info"><span className="cd-lc-info-ico"><FileOutlineIcon /></span>{item.minProjectSize}</span>
            )}
            {item.employees && (
              <span className="cd-lc-info"><span className="cd-lc-info-ico"><PeopleOutlineIcon /></span>{item.employees}</span>
            )}
            {locationParts.length > 0 && (
              <span className="cd-lc-info"><span className="cd-lc-info-ico"><PinOutlineIcon /></span>{locationParts.join(', ')}</span>
            )}
          </div>
        </div>

        {/* Right: Verified Client Review aside */}
        {item.latestReviewTitle ? (
          <aside className="cd-lc-review">
            <div className="cd-lc-review-head">
              <FontAwesomeIcon icon={faStar} className="cd-lc-review-star" aria-hidden="true" />
              <span className="cd-lc-review-lbl">Verified Client Review</span>
            </div>
            <p className="cd-lc-review-title">{item.latestReviewTitle}</p>
            {item.latestReviewAuthor && (
              <p className="cd-lc-review-by">Reviewed by: {item.latestReviewAuthor}</p>
            )}
            {reviewCount > 0 && (
              <Link href={`${profileHref}#insights`} className="cd-lc-review-all">
                View all {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
                <FontAwesomeIcon icon={faArrowRight} className="cd-lc-review-all-ico" />
              </Link>
            )}
          </aside>
        ) : (
          <aside className="cd-lc-review cd-lc-review--empty">
            <div className="cd-lc-review-head">
              <FontAwesomeIcon icon={faStar} className="cd-lc-review-star cd-lc-review-star--off" aria-hidden="true" />
              <span className="cd-lc-review-lbl">No reviews yet</span>
            </div>
            <p className="cd-lc-review-empty-txt">
              Be the first to share your experience working with {item.companyName}.
            </p>
            <Link href={`${profileHref}#insights`} className="cd-lc-review-all">
              Write a review <FontAwesomeIcon icon={faArrowRight} className="cd-lc-review-all-ico" />
            </Link>
          </aside>
        )}
      </div>
    </article>
  )
}
