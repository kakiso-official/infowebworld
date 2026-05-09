import Link from 'next/link'
import { query } from '@/lib/db'
import { requireDashboardUser } from '@/lib/user-auth'
import DashboardHeader from '../DashboardHeader'

export const dynamic = 'force-dynamic'

interface SubmissionRow {
  uuid: string; slug: string
  company_name: string; tagline: string; logo_url: string | null
  status: string; created_at: string
  plan_name: string | null; category_name: string | null
  /* Engagement aggregates — scalar subqueries below.
     N+1 isn't a concern here because user.listings is small (1–3 rows in
     practice; even a power user has <20). Each subquery is one indexed
     COUNT against the (listing_id, ...) index defined on each table. */
  reviews_count: number
  avg_rating: number | null
  likes_count: number
  dislikes_count: number
  followers_count: number
  bookmarks_count: number
  leads_count: number
  /* Verification — resolved flag on submissions + most recent request
     status (pending/approved/rejected/null). Drives the verify pill. */
  verified: number
  verification_status: 'pending' | 'approved' | 'rejected' | null
  /** 'product' | 'company' — splits the page into two sections. */
  listing_mode: 'product' | 'company'
}

type VerifyState = 'verified' | 'pending' | 'rejected' | 'none'
function deriveVerifyState(verified: number, latestStatus: SubmissionRow['verification_status']): VerifyState {
  if (Number(verified) === 1) return 'verified'
  if (latestStatus === 'pending') return 'pending'
  if (latestStatus === 'rejected') return 'rejected'
  return 'none'
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Live', paid: 'Paid · Live',
  pending: 'Pending review',
  rejected: 'Needs attention',
}

export default async function ListingsPage({
  params,
}: {
  params: Promise<Record<string, never>>
}) {
  await params
  const user = await requireDashboardUser()

  /* Verification adds a new column on submissions plus a new table. The
     migration ships in this same change-set, but the moment the code is
     deployed users may hit the page before phpMyAdmin runs it. Try the
     full query first; on the specific "missing table/column" errors fall
     back to the legacy shape so the rest of the dashboard still works.

     listing_mode is also new (added by migration-listings-company-mode.sql).
     We try to select it but fall back to 'product' for every row so the
     page works pre-migration too. */
  const BASE_SELECT = `s.uuid, s.slug, s.company_name, s.tagline, s.logo_url, s.status, s.created_at,
            p.name AS plan_name, c.name AS category_name,
            (SELECT COUNT(*)   FROM reviews            r WHERE r.listing_id = s.id AND r.status = 'approved') AS reviews_count,
            (SELECT AVG(rating) FROM reviews           r WHERE r.listing_id = s.id AND r.status = 'approved') AS avg_rating,
            (SELECT COUNT(*)   FROM listing_reactions lr WHERE lr.listing_id = s.id AND lr.kind = 'like')     AS likes_count,
            (SELECT COUNT(*)   FROM listing_reactions lr WHERE lr.listing_id = s.id AND lr.kind = 'dislike')  AS dislikes_count,
            (SELECT COUNT(*)   FROM listing_follows   lf WHERE lf.listing_id = s.id) AS followers_count,
            (SELECT COUNT(*)   FROM listing_bookmarks lb WHERE lb.listing_id = s.id) AS bookmarks_count,
            (SELECT COUNT(*)   FROM listing_inbox_emails ie WHERE ie.listing_id = s.id) AS leads_count,
            COALESCE(s.listing_mode, 'product') AS listing_mode`
  /* Three try levels for graceful degradation across two pending
     migrations: full → no-verification → no-listing-mode. */
  let listings: SubmissionRow[]
  const LEGACY_BASE = BASE_SELECT.replace(
    "COALESCE(s.listing_mode, 'product') AS listing_mode",
    "'product' AS listing_mode"
  )
  try {
    listings = await query<SubmissionRow>(
      `SELECT ${BASE_SELECT},
              COALESCE(s.verified, 0) AS verified,
              (SELECT vr.status FROM listing_verification_requests vr
                WHERE vr.listing_id = s.id
                ORDER BY vr.created_at DESC LIMIT 1) AS verification_status
       FROM submissions s
       LEFT JOIN plans p ON p.id = s.plan_id
       LEFT JOIN categories c ON c.id = s.category_id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC`,
      [user.id]
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    const verifyMissing =
      /listing_verification_requests/.test(msg) ||
      /Unknown column.*verified/.test(msg)
    const modeMissing = /Unknown column.*listing_mode/.test(msg)

    if (verifyMissing || modeMissing) {
      console.warn(
        '[dashboard/listings] migration(s) not yet applied — falling back',
        { verifyMissing, modeMissing }
      )
      /* MySQL only reports the FIRST missing column, so even if the error
         names `verified` we may still be missing `listing_mode` too. Always
         drop down to LEGACY_BASE (which references neither new column) to
         survive any combination of pending migrations. */
      const fallbackRows = await query<Omit<SubmissionRow, 'verified' | 'verification_status'>>(
        `SELECT ${LEGACY_BASE}
         FROM submissions s
         LEFT JOIN plans p ON p.id = s.plan_id
         LEFT JOIN categories c ON c.id = s.category_id
         WHERE s.user_id = ?
         ORDER BY s.created_at DESC`,
        [user.id]
      )
      listings = fallbackRows.map(l => ({
        ...l,
        verified: 0,
        verification_status: null,
        listing_mode: l.listing_mode || 'product',
      }))
    } else {
      throw err
    }
  }

  /* Split: at most one company row (one-company-per-user), the rest are
     products. The company gets its own card section above the products
     grid so it's clearly separate. */
  const companyListing = listings.find(l => l.listing_mode === 'company') || null
  const productListings = listings.filter(l => l.listing_mode !== 'company')

  return (
    <div className="dash">
      <DashboardHeader
        title="My listings"
        subtitle={`${listings.length} total`}
      />
      <div className="dash-toolbar">
        <Link href="/dashboard/new" className="dash-cta-primary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New listing
        </Link>
      </div>

      {/* ── Company section — at most one row per user. ── */}
      {companyListing && (
        <section className="dash-co-section">
          <header className="dash-co-section-head">
            <h2 className="dash-co-section-title">Your company profile</h2>
            <p className="dash-co-section-sub">One per account. Lives at /profile/{companyListing.slug}.</p>
          </header>
          <article className="dash-co-card">
            <div className="dash-co-card-logo">
              {companyListing.logo_url
                ? <img src={companyListing.logo_url} alt={companyListing.company_name} />
                : <span>{companyListing.company_name.slice(0, 2).toUpperCase()}</span>}
            </div>
            <div className="dash-co-card-body">
              <div className="dash-co-card-top">
                <h3 className="dash-co-card-name">{companyListing.company_name}</h3>
                <span className={`dash-status dash-status--${companyListing.status}`}>
                  {STATUS_LABEL[companyListing.status] || companyListing.status}
                </span>
              </div>
              <p className="dash-co-card-tag">{companyListing.tagline}</p>
              <div className="dash-co-card-foot">
                <Link
                  href={`/dashboard/listings/${companyListing.uuid}/edit`}
                  className="dash-list-btn dash-list-btn--ghost"
                >
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                  Edit profile
                </Link>
                {(companyListing.status === 'active' || companyListing.status === 'paid') ? (
                  <Link href={`/profile/${companyListing.slug}`} className="dash-list-btn">
                    View profile
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </Link>
                ) : (
                  <span className="dash-list-muted">Awaiting review</span>
                )}
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Section heading for products only when a company exists too — gives
          the eye an obvious split. Otherwise the products section reads as
          the page itself. */}
      {companyListing && productListings.length > 0 && (
        <header className="dash-co-section-head">
          <h2 className="dash-co-section-title">Your products</h2>
          <p className="dash-co-section-sub">
            {productListings.length === 1 ? '1 listing' : `${productListings.length} listings`}
            {' · '}auto-linked to your company profile.
          </p>
        </header>
      )}

      {listings.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="2.5" />
              <path d="M9 9h6M9 13h6M9 17h4" />
            </svg>
          </div>
          <h3>No listings yet</h3>
          <p>Create your first listing to show up on InfoWebWorld.</p>
          <Link href="/dashboard/new" className="dash-empty-cta">
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="dash-list-grid">
          {productListings.map(l => {
            const isLive = l.status === 'active' || l.status === 'paid'
            const verifyState = deriveVerifyState(l.verified, l.verification_status)
            return (
              <article key={l.uuid} className="dash-list-card">
                <div className="dash-list-top">
                  <div className="dash-list-logo">
                    {l.logo_url
                      ? <img src={l.logo_url} alt={l.company_name} />
                      : <span>{l.company_name.slice(0, 2).toUpperCase()}</span>}
                  </div>
                  <span className={`dash-status dash-status--${l.status}`}>
                    {STATUS_LABEL[l.status] || l.status}
                  </span>
                </div>
                <h3 className="dash-list-name">
                  {l.company_name}
                  {verifyState === 'verified' && (
                    <span className="dash-verify-inline" aria-label="Verified by InfoWebWorld" title="Verified by InfoWebWorld">
                      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                        <path fill="#0E8F6E" d="M12 2 4 5.5v5c0 5.2 3.4 9.6 8 10.5 4.6-.9 8-5.3 8-10.5v-5L12 2Zm-1.2 13.7-3.5-3.5 1.5-1.5 2 2 5-5 1.5 1.5-6.5 6.5Z"/>
                      </svg>
                    </span>
                  )}
                </h3>
                <p className="dash-list-tag">{l.tagline}</p>
                <div className="dash-list-meta">
                  {l.plan_name && <span className="dash-chip">{l.plan_name}</span>}
                  {l.category_name && <span className="dash-chip dash-chip--muted">{l.category_name}</span>}
                  {verifyState === 'verified' && (
                    <span className="dash-verify-pill dash-verify-pill--ok">
                      <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" aria-hidden="true">
                        <path d="M12 2 4 5.5v5c0 5.2 3.4 9.6 8 10.5 4.6-.9 8-5.3 8-10.5v-5L12 2Zm-1.2 13.7-3.5-3.5 1.5-1.5 2 2 5-5 1.5 1.5-6.5 6.5Z"/>
                      </svg>
                      Verified
                    </span>
                  )}
                  {verifyState === 'pending' && (
                    <span className="dash-verify-pill dash-verify-pill--pending">
                      <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                      Under review
                    </span>
                  )}
                  {verifyState === 'rejected' && (
                    <span className="dash-verify-pill dash-verify-pill--reject">
                      Not verified
                    </span>
                  )}
                </div>

                {/* Engagement strip — at-a-glance counts so users can see
                    activity without opening every listing. Click jumps to
                    the full Engagement page for that listing. */}
                <Link
                  href={`/dashboard/listings/${l.uuid}/engagement`}
                  className="dash-list-eng"
                  aria-label={`See engagement for ${l.company_name}`}
                >
                  <span className="dash-list-eng-cell">
                    <span className="dash-list-eng-num">{Number(l.reviews_count) || 0}</span>
                    <span className="dash-list-eng-lbl">
                      {l.avg_rating != null && Number(l.reviews_count) > 0 ? (
                        <>★ {Number(l.avg_rating).toFixed(1)}</>
                      ) : 'reviews'}
                    </span>
                  </span>
                  <span className="dash-list-eng-cell">
                    <span className="dash-list-eng-num dash-list-eng-num--leads">{Number(l.leads_count) || 0}</span>
                    <span className="dash-list-eng-lbl">leads</span>
                  </span>
                  <span className="dash-list-eng-cell">
                    <span className="dash-list-eng-num dash-list-eng-num--like">{Number(l.likes_count) || 0}</span>
                    <span className="dash-list-eng-lbl">likes</span>
                  </span>
                  <span className="dash-list-eng-cell">
                    <span className="dash-list-eng-num">{Number(l.followers_count) || 0}</span>
                    <span className="dash-list-eng-lbl">followers</span>
                  </span>
                  <span className="dash-list-eng-cell">
                    <span className="dash-list-eng-num dash-list-eng-num--save">{Number(l.bookmarks_count) || 0}</span>
                    <span className="dash-list-eng-lbl">saves</span>
                  </span>
                </Link>

                <div className="dash-list-foot">
                  <Link href={`/dashboard/listings/${l.uuid}/edit`} className="dash-list-btn dash-list-btn--ghost">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                    Edit
                  </Link>
                  <Link href={`/dashboard/listings/${l.uuid}/engagement`} className="dash-list-btn dash-list-btn--ghost">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3v18h18" />
                      <path d="M7 14l4-4 4 4 5-5" />
                    </svg>
                    Engagement
                  </Link>
                  {(verifyState === 'none' || verifyState === 'rejected') && (
                    <Link
                      href={`/dashboard/listings/${l.uuid}/verify`}
                      className="dash-list-btn dash-list-btn--verify"
                    >
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2 4 5.5v5c0 5.2 3.4 9.6 8 10.5 4.6-.9 8-5.3 8-10.5v-5L12 2Z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                      {verifyState === 'rejected' ? 'Re-apply' : 'Get Verified'}
                    </Link>
                  )}
                  {verifyState === 'pending' && (
                    <Link
                      href={`/dashboard/listings/${l.uuid}/verify`}
                      className="dash-list-btn dash-list-btn--ghost"
                    >
                      View application
                    </Link>
                  )}
                  {isLive ? (
                    <Link href={`/company/${l.slug}`} className="dash-list-btn">
                      View listing
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </Link>
                  ) : (
                    <span className="dash-list-muted">Awaiting review</span>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
