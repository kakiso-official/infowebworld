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

  const listings = await query<SubmissionRow>(
    `SELECT s.uuid, s.slug, s.company_name, s.tagline, s.logo_url, s.status, s.created_at,
            p.name AS plan_name, c.name AS category_name,
            (SELECT COUNT(*)   FROM reviews            r WHERE r.listing_id = s.id AND r.status = 'approved') AS reviews_count,
            (SELECT AVG(rating) FROM reviews           r WHERE r.listing_id = s.id AND r.status = 'approved') AS avg_rating,
            (SELECT COUNT(*)   FROM listing_reactions lr WHERE lr.listing_id = s.id AND lr.kind = 'like')     AS likes_count,
            (SELECT COUNT(*)   FROM listing_reactions lr WHERE lr.listing_id = s.id AND lr.kind = 'dislike')  AS dislikes_count,
            (SELECT COUNT(*)   FROM listing_follows   lf WHERE lf.listing_id = s.id) AS followers_count,
            (SELECT COUNT(*)   FROM listing_bookmarks lb WHERE lb.listing_id = s.id) AS bookmarks_count,
            (SELECT COUNT(*)   FROM listing_inbox_emails ie WHERE ie.listing_id = s.id) AS leads_count
     FROM submissions s
     LEFT JOIN plans p ON p.id = s.plan_id
     LEFT JOIN categories c ON c.id = s.category_id
     WHERE s.user_id = ?
     ORDER BY s.created_at DESC`,
    [user.id]
  )

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
          {listings.map(l => {
            const isLive = l.status === 'active' || l.status === 'paid'
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
                <h3 className="dash-list-name">{l.company_name}</h3>
                <p className="dash-list-tag">{l.tagline}</p>
                <div className="dash-list-meta">
                  {l.plan_name && <span className="dash-chip">{l.plan_name}</span>}
                  {l.category_name && <span className="dash-chip dash-chip--muted">{l.category_name}</span>}
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
