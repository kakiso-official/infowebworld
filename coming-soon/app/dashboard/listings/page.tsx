import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { query, queryOne } from '@/lib/db'
import { USER_COOKIE_NAME } from '@/lib/user-auth'
import { countryHref } from '@/app/config/countries'

export const dynamic = 'force-dynamic'

interface SubmissionRow {
  uuid: string; slug: string
  company_name: string; tagline: string; logo_url: string | null
  status: string; created_at: string
  plan_name: string | null; category_name: string | null
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
  await params; const country = ""
  const store = await cookies()
  const token = store.get(USER_COOKIE_NAME)?.value
  if (!token) redirect(countryHref(country, '/business'))

  const user = await queryOne<{ id: number }>(
    `SELECT u.id FROM business_sessions s JOIN business_users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > NOW() LIMIT 1`,
    [token]
  )
  if (!user) redirect(countryHref(country, '/business'))

  const listings = await query<SubmissionRow>(
    `SELECT s.uuid, s.slug, s.company_name, s.tagline, s.logo_url, s.status, s.created_at,
            p.name AS plan_name, c.name AS category_name
     FROM submissions s
     LEFT JOIN plans p ON p.id = s.plan_id
     LEFT JOIN categories c ON c.id = s.category_id
     WHERE s.user_id = ?
     ORDER BY s.created_at DESC`,
    [user.id]
  )

  return (
    <div className="dash">
      <header className="ds-page-head">
        <div>
          <h1 className="ds-page-title">My listings</h1>
          <p className="ds-page-sub">{listings.length} total</p>
        </div>
        <div className="ds-page-actions">
          <Link href={countryHref(country, '/dashboard/new')} className="dash-cta-primary">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New listing
          </Link>
        </div>
      </header>

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
          <Link href={countryHref(country, '/dashboard/new')} className="dash-empty-cta">
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
                <div className="dash-list-foot">
                  {isLive ? (
                    <Link href={countryHref(country, `/company/${l.slug}`)} className="dash-list-btn">
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
