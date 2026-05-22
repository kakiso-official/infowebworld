'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import type { PopL2, PopProduct } from './PopularSection'

/* ═══════════════════════════════════════════════════════════════════════
   AI/ML "Find the top-rated companies in every category" — same dark
   tabbed section pattern as /test-landing-page's TopFirmsSection, but:
     · Tabs = AI/ML L2 categories (not L1 sectors).
     · Background gradient is lavender-themed (override via .tcat1).
     · Card data comes from the SAME `cats: PopL2[]` that PopularSection
       receives — a single DB query in page.tsx feeds both sections.
   All `.tlp-firms-*` / `.tlp-firm-*` classes are reused; colour shifts
   live in test-category-1-page.css under .tcat1 .tlp-firms…
   ═══════════════════════════════════════════════════════════════════════ */

function publicHref(p: PopProduct): string {
  return (p.listingMode === 'company' ? '/profile/' : '/company/') + p.slug
}

function Stars({ value, max = 5 }: { value: number; max?: number }) {
  const rounded = Math.max(0, Math.min(max, Math.round(value || 0)))
  return (
    <span className="tlp-firm-stars" aria-label={`${value.toFixed(1)} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={'tlp-firm-star' + (i < rounded ? ' is-on' : '')}
        />
      ))}
    </span>
  )
}

export default function TopFirmsSection({ cats }: { cats: PopL2[] }) {
  /* Default the active tab to the first category that actually has
     listings, falling back to the first category if nothing populated. */
  const firstWithFirms = cats.find(c => c.products.length > 0)
  const [active, setActive] = useState<string>(firstWithFirms?.slug || cats[0]?.slug || '')

  if (!cats.length) return null

  const activeCat = cats.find(c => c.slug === active) || cats[0]
  const firms = activeCat?.products || []
  const activeLabel = activeCat?.name || ''

  return (
    <section className="tlp-firms" aria-labelledby="tcat-firms-h">
      <div className="tlp-firms-inner">
        <header className="tlp-firms-head">
          <h2 id="tcat-firms-h" className="tlp-firms-title">
            Find the top-rated companies in every category
          </h2>
          <p className="tlp-firms-sub">
            InfoWebWorld helps you connect with top-ranked AI companies backed by trusted research and verified reviews.
          </p>
        </header>

        <div className="tlp-firms-tabs" role="tablist" aria-label="AI categories">
          {cats.map(c => (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={active === c.slug}
              className={'tlp-firms-tab' + (active === c.slug ? ' is-on' : '')}
              onClick={() => setActive(c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {firms.length === 0 ? (
          <div className="tlp-firms-empty">
            More top-rated AI tools are coming soon in <strong>{activeLabel}</strong>.
            <Link
              href={`/business?category=${encodeURIComponent(active)}`}
              className="tlp-firms-empty-cta"
            >
              Be the first to list →
            </Link>
          </div>
        ) : (
          <div className="tlp-firms-grid">
            {firms.map(f => {
              const hasReviews = f.reviews > 0
              return (
                <div key={f.slug} className="tlp-firm">
                  {/* Logo + name + (stars if any) — main click target → listing page */}
                  <Link href={publicHref(f)} className="tlp-firm-main">
                    <div className="tlp-firm-logo">
                      {f.logoUrl
                        ? <img src={f.logoUrl} alt="" />
                        : <span>{f.name.slice(0, 2).toUpperCase()}</span>}
                    </div>
                    <div className="tlp-firm-mid">
                      <div className="tlp-firm-name">{f.name}</div>
                      {hasReviews && (
                        <div className="tlp-firm-meta">
                          <Stars value={f.rating} />
                          <span className="tlp-firm-rating">{f.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Right-aligned link — reviews count when present, otherwise
                      "Be the first to review" deep-link to the voice-review
                      flow with this company pre-selected. */}
                  {hasReviews ? (
                    <Link href={publicHref(f)} className="tlp-firm-rev">
                      {f.reviews} Review{f.reviews === 1 ? '' : 's'}
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"
                           strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </Link>
                  ) : (
                    <Link
                      href={`/write-review?company=${encodeURIComponent(f.slug)}`}
                      className="tlp-firm-rev tlp-firm-rev--new"
                    >
                      Be the first to review
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"
                           strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="tlp-firms-cta">
          <Link href={`/ai-ml/${active}`} className="tlp-firms-cta-btn">
            View all {activeLabel} companies
          </Link>
        </div>
      </div>
    </section>
  )
}
