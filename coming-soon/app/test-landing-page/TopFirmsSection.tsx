'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   Top-rated companies block — dark section under the categories grid.

   Reference: GoodFirms "Find the top-rated companies in every service
   category" — tabbed dark section with pill-shaped white cards.

   We adapt the 7-tab GoodFirms version to OUR 6 L1 sectors. Tabs switch
   the visible cards client-side; data is fetched once at the server level
   and passed in as props.
   ═══════════════════════════════════════════════════════════════════════ */

export interface FirmRow {
  slug: string
  company_name: string
  logo_url: string | null
  rating_avg: number
  rating_count: number
  /** product → /company/[slug]; company → /profile/[slug] */
  listing_mode: 'product' | 'company'
}

interface Props {
  sectors: { slug: string; label: string }[]
  firmsBySector: Record<string, FirmRow[]>
}

function publicHref(f: FirmRow): string {
  return (f.listing_mode === 'company' ? '/profile/' : '/listing/') + f.slug
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

export default function TopFirmsSection({ sectors, firmsBySector }: Props) {
  /* Default the active tab to the first sector that actually has listings,
     falling back to the first sector if nothing is populated yet. */
  const firstWithFirms = sectors.find(s => (firmsBySector[s.slug] || []).length > 0)
  const [active, setActive] = useState<string>(firstWithFirms?.slug || sectors[0].slug)

  const firms = firmsBySector[active] || []
  const activeLabel = sectors.find(s => s.slug === active)?.label || ''

  return (
    <section className="tlp-firms" aria-labelledby="tlp-firms-h">
      <div className="tlp-firms-inner">
        <header className="tlp-firms-head">
          <h2 id="tlp-firms-h" className="tlp-firms-title">
            Find the top-rated companies in every category
          </h2>
          <p className="tlp-firms-sub">
            InfoWebWorld helps you connect with top-ranked companies backed by trusted research and verified reviews.
          </p>
        </header>

        <div className="tlp-firms-tabs" role="tablist" aria-label="Sectors">
          {sectors.map(s => (
            <button
              key={s.slug}
              type="button"
              role="tab"
              aria-selected={active === s.slug}
              className={'tlp-firms-tab' + (active === s.slug ? ' is-on' : '')}
              onClick={() => setActive(s.slug)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {firms.length === 0 ? (
          <div className="tlp-firms-empty">
            More top-rated companies are coming soon in <strong>{activeLabel}</strong>.
            <Link href="/business" className="tlp-firms-empty-cta">Be the first to list →</Link>
          </div>
        ) : (
          <div className="tlp-firms-grid">
            {firms.map(f => {
              const hasReviews = f.rating_count > 0
              return (
                <div key={f.slug} className="tlp-firm">
                  {/* Logo + name + (stars if any) — main click target → listing page */}
                  <Link href={publicHref(f)} className="tlp-firm-main">
                    <div className="tlp-firm-logo">
                      {f.logo_url
                        ? <img src={f.logo_url} alt="" />
                        : <span>{f.company_name.slice(0, 2).toUpperCase()}</span>}
                    </div>
                    <div className="tlp-firm-mid">
                      <div className="tlp-firm-name">{f.company_name}</div>
                      {hasReviews && (
                        <div className="tlp-firm-meta">
                          <Stars value={f.rating_avg} />
                          <span className="tlp-firm-rating">{f.rating_avg.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Right-aligned link — reviews count when present, otherwise
                      a "Be the first to review" CTA that deep-links to the
                      voice-review flow with this company pre-selected. */}
                  {hasReviews ? (
                    <Link href={publicHref(f)} className="tlp-firm-rev">
                      {f.rating_count} Review{f.rating_count === 1 ? '' : 's'}
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
          <Link href={`/${active}`} className="tlp-firms-cta-btn">
            View all {activeLabel} companies
          </Link>
        </div>
      </div>
    </section>
  )
}
