import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { query, queryOne } from '@/lib/db'
import { requireDashboardUser } from '@/lib/user-auth'
import DashboardHeader from '../DashboardHeader'

export const dynamic = 'force-dynamic'

interface CompanyRow {
  id: number; uuid: string; slug: string
  company_name: string; tagline: string; description: string | null
  logo_url: string | null
  contact_name: string; email: string
  phone_code: string | null; phone: string | null
  country_id: number | null; country_name: string | null
  city: string | null; state: string | null; hq_location: string | null
  linkedin: string | null; twitter: string | null; facebook: string | null
  founded_year: string | null; team_size: string | null; funding: string | null
  is_hiring: number
  status: string; created_at: string; updated_at: string
  verified: number; verified_at: string | null
  category_id: number | null; category_name: string | null; category_color: string | null
  plan_name: string | null
}

interface ProductRow {
  id: number; uuid: string; slug: string
  company_name: string; tagline: string; logo_url: string | null
  status: string; category_name: string | null
}

interface VerificationRow {
  status: 'pending' | 'approved' | 'rejected'
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Live · Public',
  paid:   'Paid · Live',
  pending: 'Pending review',
  rejected: 'Needs attention',
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' :
    d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function MyCompanyPage() {
  const user = await requireDashboardUser()

  /* Three-level fallback for any combination of pending migrations:
       1) Full query with listing_mode + verified + verified_at
       2) Drop verified columns when 'Unknown column verified' fires
       3) Redirect to /dashboard/listings when listing_mode is missing
          (the page is meaningless before the company-mode migration). */
  const SELECT_BASE = `s.id, s.uuid, s.slug, s.company_name, s.tagline, s.description,
              s.logo_url, s.contact_name, s.email, s.phone_code, s.phone,
              s.country_id, s.city, s.state, s.hq_location,
              s.linkedin, s.twitter, s.facebook,
              s.founded_year, s.team_size, s.funding, s.is_hiring,
              s.status, s.created_at, s.updated_at,
              s.category_id,
              c.name AS category_name, c.color AS category_color,
              co.name AS country_name,
              p.name AS plan_name`
  const FROM = `FROM submissions s
                LEFT JOIN categories c  ON c.id  = s.category_id
                LEFT JOIN countries co  ON co.id = s.country_id
                LEFT JOIN plans p       ON p.id  = s.plan_id
                WHERE s.user_id = ? AND s.listing_mode = 'company'
                LIMIT 1`

  let row: CompanyRow | null = null
  try {
    row = await queryOne<CompanyRow>(
      `SELECT ${SELECT_BASE},
              COALESCE(s.verified, 0) AS verified, s.verified_at
         ${FROM}`,
      [user.id]
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (/Unknown column.*listing_mode/.test(msg)) {
      redirect('/dashboard/listings')
    }
    if (/Unknown column.*verified/.test(msg)) {
      /* Verification migration not yet run — drop those columns. The
         company page renders, just no verified state. */
      const partial = await queryOne<Omit<CompanyRow, 'verified' | 'verified_at'>>(
        `SELECT ${SELECT_BASE} ${FROM}`,
        [user.id]
      )
      row = partial ? { ...partial, verified: 0, verified_at: null } : null
    } else {
      throw err
    }
  }

  /* If the user lands here without a company yet, push them to the
     creation flow — the sidebar entry only shows when they have one,
     but a deep link is still possible. */
  if (!row) {
    redirect('/dashboard/new')
  }

  /* Products under this company — small grid with status pills. */
  const products = await query<ProductRow>(
    `SELECT s.id, s.uuid, s.slug, s.company_name, s.tagline, s.logo_url,
            s.status, c.name AS category_name
       FROM submissions s
       LEFT JOIN categories c ON c.id = s.category_id
      WHERE s.parent_company_id = ? AND s.listing_mode = 'product'
      ORDER BY s.created_at DESC`,
    [row.id]
  )

  /* Latest verification request (any status) — drives the "Get Verified"
     CTA labeling on this page. */
  let latestVerify: VerificationRow | null = null
  try {
    latestVerify = await queryOne<VerificationRow>(
      `SELECT status FROM listing_verification_requests
        WHERE listing_id = ? ORDER BY created_at DESC LIMIT 1`,
      [row.id]
    )
  } catch { /* table missing — pre-migration on verification, fine */ }

  const isLive   = row.status === 'active' || row.status === 'paid'
  const isVerified = Number(row.verified) === 1
  const verifyState =
    isVerified ? 'verified' :
    latestVerify?.status === 'pending' ? 'pending' :
    latestVerify?.status === 'rejected' ? 'rejected' : 'none'

  const liveProducts    = products.filter(p => p.status === 'active' || p.status === 'paid').length
  const pendingProducts = products.filter(p => p.status === 'pending').length

  const location = [row.city, row.state, row.country_name].filter(Boolean).join(', ')

  return (
    <div className="dash dco-root">
      <DashboardHeader
        title="My company"
        subtitle={`Your company profile · ${row.company_name}`}
      />

      {/* ─── Identity strip ─── */}
      <section className="dco-id">
        <div className="dco-id-logo">
          {row.logo_url
            ? <img src={row.logo_url} alt={`${row.company_name} logo`} />
            : <span>{row.company_name.slice(0, 2).toUpperCase()}</span>}
        </div>
        <div className="dco-id-body">
          <h2 className="dco-id-name">{row.company_name}</h2>
          <p className="dco-id-tag">{row.tagline}</p>
          <div className="dco-id-flags">
            <span className={`dash-status dash-status--${row.status}`}>
              {STATUS_LABEL[row.status] || row.status}
            </span>
            {isVerified && (
              <span className="dco-flag dco-flag--ok">
                <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                  <path fill="currentColor" d="M12 2 4 5.5v5c0 5.2 3.4 9.6 8 10.5 4.6-.9 8-5.3 8-10.5v-5L12 2Zm-1.2 13.7-3.5-3.5 1.5-1.5 2 2 5-5 1.5 1.5-6.5 6.5Z"/>
                </svg>
                Verified by InfoWebWorld
              </span>
            )}
            {!isVerified && verifyState === 'pending' && (
              <span className="dco-flag dco-flag--pending">Verification under review</span>
            )}
            {!isVerified && verifyState !== 'pending' && (
              <span className="dco-flag dco-flag--muted">Not verified yet</span>
            )}
            {Number(row.is_hiring) === 1 && (
              <span className="dco-flag dco-flag--hire">We&rsquo;re hiring</span>
            )}
          </div>
        </div>
        <div className="dco-id-actions">
          <Link href={`/dashboard/listings/${row.uuid}/edit`} className="dco-btn dco-btn--ghost">
            Edit profile
          </Link>
          {isLive && (
            <Link href={`/profile/${row.slug}`} className="dco-btn dco-btn--primary" target="_blank" rel="noopener noreferrer">
              View public profile
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </Link>
          )}
        </div>
      </section>

      {/* ─── Stats strip ─── */}
      <section className="dco-stats">
        <div className="dco-stat">
          <span className="dco-stat-num">{products.length}</span>
          <span className="dco-stat-lbl">Products linked</span>
          <span className="dco-stat-sub">{liveProducts} live · {pendingProducts} pending</span>
        </div>
        <div className="dco-stat">
          <span className="dco-stat-num">{row.team_size || '—'}</span>
          <span className="dco-stat-lbl">Team size</span>
          {row.founded_year && <span className="dco-stat-sub">Founded {row.founded_year}</span>}
        </div>
        <div className="dco-stat">
          <span className="dco-stat-num">{row.plan_name || 'Free'}</span>
          <span className="dco-stat-lbl">Plan</span>
          <span className="dco-stat-sub">{formatDate(row.created_at)}</span>
        </div>
        <div className={`dco-stat dco-stat--verify dco-stat--verify-${verifyState}`}>
          <span className="dco-stat-num">
            {verifyState === 'verified' ? 'Yes' :
             verifyState === 'pending'  ? 'Pending' :
             verifyState === 'rejected' ? 'Re-apply' : 'No'}
          </span>
          <span className="dco-stat-lbl">Verified by IWW</span>
          {!isVerified && verifyState !== 'pending' && (
            <Link href={`/dashboard/listings/${row.uuid}/verify`} className="dco-stat-cta">
              {verifyState === 'rejected' ? 'Re-apply →' : 'Get verified →'}
            </Link>
          )}
        </div>
      </section>

      {/* ─── Profile readout — the captured company info, displayed
              as readable blocks (not editable inputs). ─── */}
      <section className="dco-info">
        <header className="dco-info-head">
          <h3>Company information</h3>
          <Link href={`/dashboard/listings/${row.uuid}/edit`} className="dco-info-edit">Edit</Link>
        </header>

        <div className="dco-info-grid">
          <Field label="Description" value={row.description} pre wide />
          <Field label="Sector"      value={row.category_name} />
          <Field label="Founded"     value={row.founded_year} />
          <Field label="Team size"   value={row.team_size} />
          <Field label="Funding"     value={row.funding} />
          <Field label="Hiring"      value={Number(row.is_hiring) === 1 ? 'Actively hiring' : null} />

          <Field
            label="Headquarters"
            value={[row.hq_location, location].filter(Boolean).join(' · ') || null}
            wide
          />
          <Field label="Country"     value={row.country_name} />
          <Field label="State"       value={row.state} />
          <Field label="City"        value={row.city} />

          <Field label="Contact name" value={row.contact_name} />
          <Field label="Contact email" value={row.email} />
          <Field
            label="Phone"
            value={row.phone ? `${row.phone_code || ''} ${row.phone}`.trim() : null}
          />

          <Field label="LinkedIn"    value={row.linkedin} link />
          <Field label="Twitter / X" value={row.twitter} link />
          <Field label="Facebook"    value={row.facebook} link />
        </div>
      </section>

      {/* ─── Products linked to this company ─── */}
      <section className="dco-products">
        <header className="dco-info-head">
          <h3>Products under {row.company_name}</h3>
          <Link href="/dashboard/new" className="dco-info-edit">+ New product</Link>
        </header>
        {products.length === 0 ? (
          <div className="dco-empty">
            No products yet under your company. Create your first product listing —
            we&rsquo;ll auto-fill your contact and location info from this profile.
          </div>
        ) : (
          <div className="dco-prod-grid">
            {products.map(p => (
              <article key={p.uuid} className="dco-prod-card">
                <div className="dco-prod-logo">
                  {p.logo_url
                    ? <img src={p.logo_url} alt={p.company_name} />
                    : <span>{p.company_name.slice(0, 2).toUpperCase()}</span>}
                </div>
                <div className="dco-prod-body">
                  <h4 className="dco-prod-name">{p.company_name}</h4>
                  <p className="dco-prod-tag">{p.tagline}</p>
                  <div className="dco-prod-meta">
                    <span className={`dash-status dash-status--${p.status}`}>
                      {STATUS_LABEL[p.status] || p.status}
                    </span>
                    {p.category_name && <span className="dco-prod-cat">{p.category_name}</span>}
                  </div>
                </div>
                <div className="dco-prod-actions">
                  <Link href={`/dashboard/listings/${p.uuid}/edit`} className="dco-prod-link">Edit</Link>
                  {(p.status === 'active' || p.status === 'paid') && (
                    <Link href={`/listing/${p.slug}`} className="dco-prod-link" target="_blank" rel="noopener noreferrer">
                      View ↗
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

/* Tiny field renderer — keeps the markup tight in the page above. */
function Field({ label, value, link, pre, wide }: {
  label: string
  value: string | null | undefined
  link?: boolean
  pre?: boolean
  wide?: boolean
}) {
  const empty = !value || (typeof value === 'string' && !value.trim())
  return (
    <div className={'dco-field' + (wide ? ' dco-field--wide' : '') + (empty ? ' dco-field--empty' : '')}>
      <span className="dco-field-lbl">{label}</span>
      {empty ? (
        <span className="dco-field-val dco-field-val--empty">Not provided</span>
      ) : link ? (
        <a href={value!} target="_blank" rel="noopener noreferrer" className="dco-field-val dco-field-val--link">
          {value}
        </a>
      ) : (
        <span className={'dco-field-val' + (pre ? ' dco-field-val--pre' : '')}>{value}</span>
      )}
    </div>
  )
}
