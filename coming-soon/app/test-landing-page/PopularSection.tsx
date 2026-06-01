import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   Popular AI tools block — dark section under the reviews marquee.

   Reference: GoodFirms "Most popular software solutions" — dark backdrop
   with a 3×2 grid of cards. Each card has:
     · top row: logo + name + stars/rating + reviews link
     · divider hairline
     · bottom row: 2-column meta (Free Trial · Entry Level Price)

   For now this is scoped to the AI & ML sector only (per Aadil); when
   ready we can clone the data fetch + tabbed component for other sectors.
   ═══════════════════════════════════════════════════════════════════════ */

export interface PopFirmRow {
  slug: string
  company_name: string
  logo_url: string | null
  rating_avg: number
  rating_count: number
  listing_mode: 'product' | 'company'
  starting_price: string
  starting_price_period: string
  has_free_trial: boolean
  has_free_version: boolean
}

interface Props {
  firms: PopFirmRow[]
  /** L1 sector slug — used by the "Browse all" CTA. Defaults to ai-ml for
   *  the legacy /test-landing-page demo. */
  sectorSlug?: string
  /** Section H2 (sector-specific). */
  title?: string
  /** Sub-paragraph when there are firms (sector-specific). */
  sub?: string
  /** Sub-paragraph for the empty state. */
  emptySub?: string
  /** Empty-state line above the CTA. */
  emptyLine?: string
  /** "Browse all <noun>" CTA label. */
  cta?: string
}

function listingHref(f: PopFirmRow): string {
  return (f.listing_mode === 'company' ? '/profile/' : '/listing/') + f.slug
}

/** Format the entry-level-price field for the meta row.
 *  - 0 / null / "" → "Contact vendor"
 *  - "0" with has_free_version → "Free"
 *  - otherwise → "$X / period" */
function formatPrice(p: PopFirmRow): string {
  const raw = (p.starting_price || '').trim()
  if (!raw) return 'Contact vendor'
  const cleaned = raw.replace(/[^\d.]/g, '')
  const num = parseFloat(cleaned)
  if (isNaN(num)) return 'Contact vendor'
  if (num === 0) return p.has_free_version ? 'Free' : 'Contact vendor'
  const period = (p.starting_price_period || '').trim() || '/ month'
  return `$${num} ${period}`
}

/** Free-trial badge text. */
function formatTrial(p: PopFirmRow): string {
  if (p.has_free_version) return 'Free version'
  if (p.has_free_trial)   return 'Available'
  return 'N/A'
}

function Stars({ value, max = 5 }: { value: number; max?: number }) {
  const rounded = Math.max(0, Math.min(max, Math.round(value || 0)))
  return (
    <span className="tlp-pop-stars" aria-label={`${value.toFixed(1)} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={'tlp-pop-star' + (i < rounded ? ' is-on' : '')}
        />
      ))}
    </span>
  )
}

export default function PopularSection({
  firms,
  sectorSlug = 'ai-ml',
  title = 'Most popular AI tools',
  sub = 'Hand-picked AI tools backed by real buyer reviews. Find the perfect fit for your business without the guesswork.',
  emptySub = 'Hand-picked AI tools vetted by real buyers. Find the perfect fit without the guesswork.',
  emptyLine = 'No AI tools to feature yet — check back soon.',
  cta = 'Browse all AI tools',
}: Props) {
  const browseHref = `/${sectorSlug}/view-all-sub-categories-${sectorSlug}`

  if (firms.length === 0) {
    return (
      <section className="tlp-pop" aria-labelledby="tlp-pop-h">
        <div className="tlp-pop-inner">
          <header className="tlp-pop-head">
            <h2 id="tlp-pop-h" className="tlp-pop-title">{title}</h2>
            <p className="tlp-pop-sub">{emptySub}</p>
          </header>
          <div className="tlp-pop-empty">
            <p>{emptyLine}</p>
            <Link href={browseHref} className="tlp-pop-cta-btn">{cta}</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="tlp-pop" aria-labelledby="tlp-pop-h">
      <div className="tlp-pop-inner">
        <header className="tlp-pop-head">
          <h2 id="tlp-pop-h" className="tlp-pop-title">{title}</h2>
          <p className="tlp-pop-sub">{sub}</p>
        </header>

        <div className="tlp-pop-grid">
          {firms.map(f => {
            const hasReviews = f.rating_count > 0
            return (
              <article key={f.slug} className="tlp-pop-card">
                <header className="tlp-pop-card-head">
                  <Link href={listingHref(f)} className="tlp-pop-card-logo">
                    {f.logo_url
                      ? <img src={f.logo_url} alt="" loading="lazy" decoding="async" />
                      : <span>{f.company_name.slice(0, 2).toUpperCase()}</span>}
                  </Link>
                  <div className="tlp-pop-card-id">
                    <Link href={listingHref(f)} className="tlp-pop-card-name">{f.company_name}</Link>
                    {hasReviews ? (
                      <div className="tlp-pop-card-meta">
                        <Stars value={f.rating_avg} />
                        <span className="tlp-pop-card-rating">{f.rating_avg.toFixed(1)}</span>
                      </div>
                    ) : (
                      <div className="tlp-pop-card-meta">
                        <span className="tlp-pop-card-new">Awaiting buyer reviews</span>
                      </div>
                    )}
                  </div>
                  {hasReviews ? (
                    <Link href={listingHref(f)} className="tlp-pop-card-rev">
                      {f.rating_count} Review{f.rating_count === 1 ? '' : 's'}
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"
                           strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </Link>
                  ) : (
                    <Link
                      href={`/write-review?company=${encodeURIComponent(f.slug)}`}
                      className="tlp-pop-card-rev tlp-pop-card-rev--new"
                    >
                      Be the first to review
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"
                           strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </Link>
                  )}
                </header>

                <div className="tlp-pop-card-body">
                  <div className="tlp-pop-card-col">
                    <span className="tlp-pop-card-lbl">Free Trial</span>
                    <span className="tlp-pop-card-val">{formatTrial(f)}</span>
                  </div>
                  <div className="tlp-pop-card-col">
                    <span className="tlp-pop-card-lbl">Entry Level Price</span>
                    <span className="tlp-pop-card-val">{formatPrice(f)}</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="tlp-pop-cta">
          <Link href={browseHref} className="tlp-pop-cta-btn">{cta}</Link>
        </div>
      </div>
    </section>
  )
}
