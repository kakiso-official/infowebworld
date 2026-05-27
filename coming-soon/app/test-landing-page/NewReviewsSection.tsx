import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faUser } from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   New reviews block — white section under the dark "top firms" grid.

   Reference: GoodFirms "New reviews from verified customers" — a
   horizontal scrollable strip of review cards with logo+name on top,
   review body in the middle, reviewer + stars at the bottom. Centered
   "Write a review" CTA below.

   Server component — receives latest approved reviews from page.tsx.
   ═══════════════════════════════════════════════════════════════════════ */

export interface ReviewRow {
  id: number
  rating: number
  title: string
  body: string
  created_at: string
  user_name: string | null
  user_avatar: string | null
  user_email: string | null
  listing_slug: string
  listing_name: string
  listing_logo: string | null
  listing_mode: 'product' | 'company'
}

interface Props {
  reviews: ReviewRow[]
}

function listingHref(r: ReviewRow): string {
  return (r.listing_mode === 'company' ? '/profile/' : '/listing/') + r.listing_slug
}

/** Normalise a stored name to Title Case so reviewers who typed their
 *  name in ALL CAPS or all lowercase still render consistently
 *  ("JOHN SMITH" → "John Smith", "jane doe" → "Jane Doe"). Brand-like
 *  tokens with an internal capital (e.g. "McDonald", "iPhone") are
 *  preserved if they look intentional — letters that are already
 *  uppercase after position 0 are left alone. */
function titleCase(input: string): string {
  return input
    .split(/(\s+|-)/)  // keep separators (spaces, hyphens)
    .map(part => {
      if (!part || /^(\s+|-)$/.test(part)) return part
      const isAllCaps = part === part.toUpperCase()
      const isAllLower = part === part.toLowerCase()
      if (!isAllCaps && !isAllLower) return part  // leave mixed case alone
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    })
    .join('')
}

function authorMeta(r: ReviewRow): string {
  const name = (r.user_name || '').trim()
  if (!name) return 'Verified buyer'
  return titleCase(name)
}

function Stars({ value, max = 5 }: { value: number; max?: number }) {
  const rounded = Math.max(0, Math.min(max, Math.round(value || 0)))
  return (
    <span className="tlp-rev-stars-row" aria-label={`${value.toFixed(1)} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={'tlp-rev-star' + (i < rounded ? ' is-on' : '')}
        />
      ))}
    </span>
  )
}

export default function NewReviewsSection({ reviews }: Props) {
  return (
    <section className="tlp-revs" aria-labelledby="tlp-revs-h">
      <div className="tlp-revs-inner">
        <h2 id="tlp-revs-h" className="tlp-revs-title">
          What verified buyers are saying
        </h2>

        {reviews.length === 0 ? (
          <div className="tlp-revs-empty">
            <p>No verified reviews yet — yours could be the first.</p>
            <Link href="/write-review" className="tlp-revs-cta-btn">Write a review</Link>
          </div>
        ) : (
          <>
            {/* Marquee strip — cards rendered TWICE so when the rail
                translates by -50% the second copy lands where the first
                started, creating a seamless infinite loop. Pause on
                hover so users can read a specific card. Each card has
                a fixed height for a uniform row regardless of body
                length. */}
            <div className="tlp-revs-track" aria-label="Latest verified reviews">
              <div className="tlp-revs-rail">
                {[...reviews, ...reviews].map((r, idx) => {
                  const isClone = idx >= reviews.length
                  return (
                    <article
                      key={`${r.id}-${idx}`}
                      className="tlp-rev"
                      aria-hidden={isClone ? 'true' : undefined}
                    >
                      <header className="tlp-rev-head">
                        {r.listing_logo
                          ? <img className="tlp-rev-logo" src={r.listing_logo} alt="" />
                          : <span className="tlp-rev-logo tlp-rev-logo--ph">
                              {(r.listing_name || '?').slice(0, 2).toUpperCase()}
                            </span>}
                        <Link
                          href={listingHref(r)}
                          className="tlp-rev-cname"
                          tabIndex={isClone ? -1 : undefined}
                        >
                          {r.listing_name}
                        </Link>
                      </header>

                      <p className="tlp-rev-body">
                        {r.body.length > 220 ? r.body.slice(0, 220).trim() + '…' : r.body}
                      </p>

                      <footer className="tlp-rev-foot">
                        <div className="tlp-rev-author">
                          {r.user_avatar
                            ? <img className="tlp-rev-avatar" src={r.user_avatar} alt="" />
                            : <span className="tlp-rev-avatar tlp-rev-avatar--ph">
                                <FontAwesomeIcon icon={faUser} style={{ width: 16, height: 16 }} />
                              </span>}
                          <span className="tlp-rev-author-name">{authorMeta(r)}</span>
                        </div>
                        <div className="tlp-rev-rating">
                          <Stars value={r.rating} />
                          <span className="tlp-rev-rating-n">{r.rating.toFixed(1)}</span>
                        </div>
                      </footer>
                    </article>
                  )
                })}
              </div>
            </div>

            <div className="tlp-revs-cta">
              <Link href="/write-review" className="tlp-revs-cta-btn">Write a review</Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
