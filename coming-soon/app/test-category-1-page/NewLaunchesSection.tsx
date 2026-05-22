import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   "Just launched on InfoWebWorld" — chronological 2×4 grid of the most
   recently approved AI/ML listings. Server component, real data only
   (returns null if there are zero AI/ML listings yet).

   Card layout — horizontal, info-dense:
     ┌──────────────────────────────────────────────────────────┐
     │  [LOGO]  Tool Name              [AI Image Generation]    │
     │          One-line tagline describing it.                 │
     │          🕒 3 days ago   ★ 4.5 (123)                     │
     └──────────────────────────────────────────────────────────┘
   ═══════════════════════════════════════════════════════════════════════ */

export interface LaunchRow {
  slug: string
  companyName: string
  tagline: string | null
  logoUrl: string | null
  listingMode: 'product' | 'company'
  approvedAt: string                 // ISO date string from DB
  categoryName: string | null
  categorySlug: string | null
  rating: number                     // 0 when no reviews
  reviews: number                    // 0 when no reviews
}

function publicHref(r: LaunchRow): string {
  return (r.listingMode === 'company' ? '/profile/' : '/company/') + r.slug
}

/** Compress a date into a short relative-time label.
 *  Computed at SERVER render time so the value is correct for the
 *  visitor's "now", not the build-time "now". */
function relativeTime(iso: string): string {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return ''
  const diffMs = Date.now() - then
  if (diffMs < 0) return 'Just now'
  const days = Math.floor(diffMs / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) {
    const w = Math.floor(days / 7)
    return `${w} week${w === 1 ? '' : 's'} ago`
  }
  if (days < 365) {
    const m = Math.floor(days / 30)
    return `${m} month${m === 1 ? '' : 's'} ago`
  }
  const y = Math.floor(days / 365)
  return `${y} year${y === 1 ? '' : 's'} ago`
}

function initialsOf(name: string): string {
  const cleaned = name.replace(/[.·_-]/g, ' ').trim()
  const words = cleaned.split(/\s+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return cleaned.slice(0, 2).toUpperCase()
}

export default function NewLaunchesSection({ launches }: { launches: LaunchRow[] }) {
  if (!launches.length) return null

  return (
    <section className="tcat-new" aria-labelledby="tcat-new-h">
      <div className="tcat-new-inner">
        <header className="tcat-new-head">
          <h2 id="tcat-new-h" className="tcat-new-title">Just launched on InfoWebWorld</h2>
          <p className="tcat-new-sub">
            The newest AI tools, agents, and models added to the directory — moderated and verified before they appear.
          </p>
        </header>

        <div className="tcat-new-grid">
          {launches.map(l => (
            <Link
              key={l.slug}
              href={publicHref(l)}
              className="tcat-new-card"
              aria-label={`${l.companyName} — added ${relativeTime(l.approvedAt)}`}
            >
              <div className="tcat-new-card-logo" aria-hidden="true">
                {l.logoUrl
                  ? <img src={l.logoUrl} alt="" loading="lazy" decoding="async" />
                  : <span className="tcat-new-card-mark">{initialsOf(l.companyName)}</span>}
              </div>

              <div className="tcat-new-card-main">
                <div className="tcat-new-card-top">
                  <h3 className="tcat-new-card-name">{l.companyName}</h3>
                  {l.categoryName && (
                    <span className="tcat-new-card-cat">{l.categoryName}</span>
                  )}
                </div>

                {l.tagline && (
                  <p className="tcat-new-card-tag">{l.tagline}</p>
                )}

                <div className="tcat-new-card-meta">
                  <span className="tcat-new-card-time">
                    <FontAwesomeIcon icon={faClock} className="tcat-new-card-time-ico" />
                    {relativeTime(l.approvedAt)}
                  </span>
                  {l.reviews > 0 && (
                    <span className="tcat-new-card-rate">
                      <FontAwesomeIcon icon={faStar} className="tcat-new-card-star" />
                      <span className="tcat-new-card-rate-num">{l.rating.toFixed(1)}</span>
                      <span className="tcat-new-card-rate-count">({l.reviews.toLocaleString()})</span>
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="tcat-new-cta">
          <Link href="/ai-ml" className="tcat-new-cta-btn">
            Browse all AI tools
            <FontAwesomeIcon icon={faArrowRight} className="tcat-new-cta-ico" />
          </Link>
        </div>
      </div>
    </section>
  )
}
