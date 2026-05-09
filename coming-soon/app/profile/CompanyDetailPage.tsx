'use client'

import { useMemo, useState } from 'react'
import LeadFormModal from '../listing/LeadFormModal'

/* ───────────────────────────────────────────────────────────────────────
   Public company profile page rendered at /profile/[slug].

   Eight sections, all with white-card / hairline-border / Inter / coral
   visual language matching /company/[slug]:

     1. Sticky header   — logo + name + verified shield + CTAs
     2. Title block     — H1 + tagline + verified-by-IWW badge / unverified
     3. About           — long-form description + stat tiles
     4. Products by us  — grid of product cards (parent_company_id link)
     5. Where we are    — HQ + cities + country
     6. Team & culture  — team size, hiring badge, LinkedIn link
     7. Get in touch    — Get-a-Quote modal launcher + socials + email
     8. FAQs            — collapsible (preview-only — no real data yet)

   Server fetches the `company` row + the products list and hands them
   down via `initialData`. No per-user state in v1.
   ───────────────────────────────────────────────────────────────────── */

interface CompanyData {
  id: number; slug: string; uuid: string
  company_name: string; tagline: string; description: string | null
  logo_url: string | null; website: string | null
  email: string | null; phone: string | null; phone_code: string | null
  founded_year: string | null; team_size: string | null
  hq_location: string | null; city: string | null; state: string | null
  country_name: string | null
  linkedin: string | null; twitter: string | null; facebook: string | null
  funding: string | null
  is_hiring: number
  header_tags: string | null
  faqs: string | null
  status: string; created_at: string; updated_at: string
  verified?: number; verified_at?: string | null
  category_name: string | null; category_slug: string | null; category_color: string | null
  plan_name: string | null; plan_slug: string | null
}

interface ProductRow {
  id: number; slug: string
  company_name: string; tagline: string; logo_url: string | null
  starting_price: string | number | null
  starting_price_period: string | null
  category_name: string | null; category_slug: string | null; category_color: string | null
}

interface InitialData {
  company: Record<string, unknown>
  products: Record<string, unknown>[]
}

function parseJsonArr(val: unknown): unknown[] {
  if (!val) return []
  if (typeof val === 'string') { try { return JSON.parse(val) } catch { return [] } }
  if (Array.isArray(val)) return val
  return []
}

function withInfoWebWorldUtm(url: string, slug: string): string {
  if (!url) return url
  try {
    const u = new URL(url)
    if (!u.searchParams.has('utm_source'))   u.searchParams.set('utm_source', 'infowebworld')
    if (!u.searchParams.has('utm_medium'))   u.searchParams.set('utm_medium', 'referral')
    if (!u.searchParams.has('utm_campaign')) u.searchParams.set('utm_campaign', 'profile')
    if (slug && !u.searchParams.has('utm_content')) u.searchParams.set('utm_content', slug)
    return u.toString()
  } catch { return url }
}

const clearbitFavicon = (url: string | null, size = 128) => {
  if (!url) return ''
  try {
    const u = new URL(/^https?:\/\//.test(url) ? url : `https://${url}`)
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=${size}`
  } catch { return '' }
}

/* ── icon set (monoline, currentColor) ───────────────────────────── */
const Icon = (props: { d: string; size?: number; sw?: number }) => (
  <svg viewBox="0 0 24 24" width={props.size || 16} height={props.size || 16}
       fill="none" stroke="currentColor" strokeWidth={props.sw || 2}
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={props.d} />
  </svg>
)
const Globe   = () => <Icon d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20M3 8h18M3 16h18" />
const MapPin  = () => <Icon d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
const Users   = () => <Icon d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
const Calendar= () => <Icon d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM3 10h18M16 2v4M8 2v4" />
const Phone   = () => <Icon d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
const Mail    = () => <Icon d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6" />
const Linkedin= () => <Icon d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 100 4 2 2 0 000-4z" />
const Twitter = () => <Icon d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
const Facebook= () => <Icon d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
const Arrow   = () => <Icon d="M7 17L17 7M7 7h10v10" />
const Bell    = () => <Icon d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
const Shield  = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path fill="#0E8F6E" d="M12 2 4 5.5v5c0 5.2 3.4 9.6 8 10.5 4.6-.9 8-5.3 8-10.5v-5L12 2Zm-1.2 13.7-3.5-3.5 1.5-1.5 2 2 5-5 1.5 1.5-6.5 6.5Z"/>
  </svg>
)

interface Props {
  slug?: string
  initialData?: InitialData
}

export default function CompanyDetailPage({ slug: propSlug, initialData }: Props) {
  if (!initialData) return null
  const c = initialData.company as unknown as CompanyData
  const products = (initialData.products as unknown as ProductRow[]) || []

  const slug = c.slug || propSlug || ''
  const headerTags = useMemo(() => parseJsonArr(c.header_tags) as string[], [c.header_tags])
  const isVerified = Boolean(Number(c.verified ?? 0))
  const lastUpdated = useMemo(() => {
    const iso = c.updated_at || c.created_at
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }, [c.updated_at, c.created_at])
  const verifiedDate = useMemo(() => {
    if (!c.verified_at) return ''
    const d = new Date(c.verified_at)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }, [c.verified_at])

  const location = [c.city, c.state, c.country_name].filter(Boolean).join(', ')
  const websiteHost = (c.website || '').replace(/^https?:\/\//, '').split('/')[0]
  const fallbackLogo = websiteHost ? clearbitFavicon(c.website, 256) : ''

  const [leadOpen, setLeadOpen] = useState(false)

  return (
    <main className="cmp-root tp-root">
      {/* ─── Sticky head — identity + actions ─── */}
      <header className="cmp-head">
        <div className="cmp-head-inner">
          <div className="cmp-id-logo">
            {(c.logo_url || fallbackLogo)
              ? <img src={c.logo_url || fallbackLogo} alt={`${c.company_name} logo`} />
              : <span className="cmp-id-logo-fallback" aria-hidden="true">
                  {(c.company_name?.charAt(0) || '?').toUpperCase()}
                </span>}
          </div>

          <div className="cmp-id-body">
            <h1 className="cmp-id-name">
              {c.company_name}
              {isVerified && (
                <span className="cmp-id-verified" title="Verified by InfoWebWorld" aria-label="Verified by InfoWebWorld">
                  <Shield />
                </span>
              )}
            </h1>
            {headerTags.length > 0 && (
              <div className="cmp-id-tags">
                {headerTags.map(t => <span key={t} className="cmp-id-tag">{t}</span>)}
              </div>
            )}
            <div className="cmp-id-meta">
              {c.founded_year && <span><Calendar /> Founded {c.founded_year}</span>}
              {c.team_size && <span><Users /> {c.team_size}</span>}
              {(c.city || c.country_name) && <span><MapPin /> {location}</span>}
              {Number(c.is_hiring) === 1 && <span className="cmp-hiring"><Bell /> We&rsquo;re hiring</span>}
            </div>
          </div>

          <div className="cmp-id-actions">
            {c.website && (
              <a href={withInfoWebWorldUtm(c.website, slug)} target="_blank" rel="noopener noreferrer" className="cmp-btn cmp-btn--primary">
                Visit website <Arrow />
              </a>
            )}
            <button type="button" className="cmp-btn cmp-btn--outline" onClick={() => setLeadOpen(true)}>
              Get a Quote <Mail />
            </button>
          </div>
        </div>
      </header>

      <div className="cmp-wrap">

        {/* ─── Title block ─── */}
        <section className="cmp-title-block">
          <h2 className="cmp-page-title">{c.company_name}</h2>
          {c.tagline && <p className="cmp-page-tagline">{c.tagline}</p>}

          {isVerified ? (
            <div className="tlp-vbadge tlp-vbadge--ok" role="status">
              <span className="tlp-vbadge-shield" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path fill="#0E8F6E" d="M12 2 4 5.5v5c0 5.2 3.4 9.6 8 10.5 4.6-.9 8-5.3 8-10.5v-5L12 2Zm-1.2 13.7-3.5-3.5 1.5-1.5 2 2 5-5 1.5 1.5-6.5 6.5Z"/>
                </svg>
              </span>
              <span className="tlp-vbadge-body">
                <span className="tlp-vbadge-eyebrow">Authenticated</span>
                <span className="tlp-vbadge-title">Verified by InfoWebWorld</span>
                <span className="tlp-vbadge-sub">
                  {c.company_name}&rsquo;s identity has been confirmed by our review team{verifiedDate ? ` on ${verifiedDate}.` : '.'}
                </span>
              </span>
            </div>
          ) : (
            <div className="tlp-vbadge tlp-vbadge--no" role="note">
              <span className="tlp-vbadge-shield tlp-vbadge-shield--muted" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 4 5.5v5c0 5.2 3.4 9.6 8 10.5 4.6-.9 8-5.3 8-10.5v-5L12 2Z" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </span>
              <span className="tlp-vbadge-body">
                <span className="tlp-vbadge-title tlp-vbadge-title--muted">Unverified by InfoWebWorld</span>
                <span className="tlp-vbadge-sub">
                  {c.company_name} hasn&rsquo;t completed identity verification yet. Treat the
                  details below as self-reported.
                </span>
              </span>
            </div>
          )}

          {lastUpdated && <div className="cmp-updated">Last updated: {lastUpdated}</div>}
        </section>

        {/* ─── About ─── */}
        <section id="about" className="cmp-card">
          <header className="cmp-card-head">
            <h3 className="cmp-card-title">About {c.company_name}</h3>
          </header>
          <div className="cmp-about-grid">
            <div className="cmp-about-body">
              {c.description ? (
                c.description.split(/\n{2,}/).map((p, i) => <p key={i} className="cmp-about-p">{p}</p>)
              ) : (
                <p className="cmp-about-p cmp-empty">{c.company_name} hasn&rsquo;t added a long-form description yet.</p>
              )}
            </div>
            <aside className="cmp-stat-card">
              <ul className="cmp-stat-list">
                {c.founded_year && <li><span className="cmp-stat-lbl">Founded</span><span className="cmp-stat-val">{c.founded_year}</span></li>}
                {c.team_size   && <li><span className="cmp-stat-lbl">Team size</span><span className="cmp-stat-val">{c.team_size}</span></li>}
                {(c.hq_location || location) && (
                  <li><span className="cmp-stat-lbl">Headquarters</span><span className="cmp-stat-val">{c.hq_location || location}</span></li>
                )}
                {c.website && (
                  <li><span className="cmp-stat-lbl">Website</span>
                    <span className="cmp-stat-val">
                      <a href={withInfoWebWorldUtm(c.website, slug)} target="_blank" rel="noopener noreferrer">
                        {websiteHost} ↗
                      </a>
                    </span>
                  </li>
                )}
                {c.funding && <li><span className="cmp-stat-lbl">Funding</span><span className="cmp-stat-val">{c.funding}</span></li>}
                {c.category_name && (
                  <li><span className="cmp-stat-lbl">Sector</span><span className="cmp-stat-val">{c.category_name}</span></li>
                )}
              </ul>
            </aside>
          </div>
        </section>

        {/* ─── Products by us ─── */}
        <section id="products" className="cmp-card">
          <header className="cmp-card-head">
            <h3 className="cmp-card-title">Products by {c.company_name}</h3>
            <p className="cmp-card-sub">Listings made by this company on InfoWebWorld.</p>
          </header>
          {products.length > 0 ? (
            <div className="cmp-prod-grid">
              {products.map(p => {
                const phost = (clearbitFavicon(p.logo_url ? null : null) || '')
                const logo = p.logo_url || phost
                return (
                  <a key={p.id} href={`/company/${p.slug}`} className="cmp-prod-card">
                    <div className="cmp-prod-logo">
                      {logo
                        ? <img src={logo} alt={`${p.company_name} logo`} />
                        : <span>{(p.company_name?.charAt(0) || '?').toUpperCase()}</span>}
                    </div>
                    <div className="cmp-prod-body">
                      <h4 className="cmp-prod-name">{p.company_name}</h4>
                      <p className="cmp-prod-tag">{p.tagline}</p>
                      <div className="cmp-prod-meta">
                        {p.category_name && <span>{p.category_name}</span>}
                        {p.starting_price && <span>From ${p.starting_price}{p.starting_price_period ? ` ${p.starting_price_period}` : ''}</span>}
                      </div>
                    </div>
                    <span className="cmp-prod-arrow"><Arrow /></span>
                  </a>
                )
              })}
            </div>
          ) : (
            <div className="cmp-empty-card">
              {c.company_name} hasn&rsquo;t listed any products on InfoWebWorld yet.
              {' '}When they do, you&rsquo;ll see them here.
            </div>
          )}
        </section>

        {/* ─── Where we operate ─── */}
        <section id="where" className="cmp-card">
          <header className="cmp-card-head">
            <h3 className="cmp-card-title">Where we are</h3>
          </header>
          <div className="cmp-where-grid">
            <div className="cmp-where-item">
              <span className="cmp-where-lbl">Headquarters</span>
              <span className="cmp-where-val">
                {c.hq_location || location || <em className="cmp-empty">Not shared</em>}
              </span>
            </div>
            {c.country_name && (
              <div className="cmp-where-item">
                <span className="cmp-where-lbl">Country</span>
                <span className="cmp-where-val">{c.country_name}</span>
              </div>
            )}
            {c.city && (
              <div className="cmp-where-item">
                <span className="cmp-where-lbl">City</span>
                <span className="cmp-where-val">{c.city}</span>
              </div>
            )}
          </div>
        </section>

        {/* ─── Team & culture ─── */}
        <section id="team" className="cmp-card">
          <header className="cmp-card-head">
            <h3 className="cmp-card-title">Team &amp; culture</h3>
          </header>
          <div className="cmp-team-row">
            {c.team_size && (
              <div className="cmp-team-stat">
                <span className="cmp-team-num">{c.team_size}</span>
                <span className="cmp-team-lbl">Team size</span>
              </div>
            )}
            {Number(c.is_hiring) === 1 && (
              <div className="cmp-team-stat cmp-team-stat--hiring">
                <span className="cmp-team-num">Hiring</span>
                <span className="cmp-team-lbl">Open roles</span>
              </div>
            )}
            {c.linkedin && (
              <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className="cmp-team-link">
                <Linkedin /> View on LinkedIn
              </a>
            )}
          </div>
        </section>

        {/* ─── Get in touch ─── */}
        <section id="contact" className="cmp-card">
          <header className="cmp-card-head">
            <h3 className="cmp-card-title">Get in touch</h3>
            <p className="cmp-card-sub">Reach out, or follow them around the web.</p>
          </header>
          <div className="cmp-contact-row">
            <button type="button" className="cmp-btn cmp-btn--primary" onClick={() => setLeadOpen(true)}>
              Get a Quote <Mail />
            </button>
            {c.website && (
              <a href={withInfoWebWorldUtm(c.website, slug)} target="_blank" rel="noopener noreferrer" className="cmp-btn cmp-btn--outline">
                <Globe /> Visit website
              </a>
            )}
            {c.linkedin && (
              <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className="cmp-btn cmp-btn--ghost"><Linkedin /></a>
            )}
            {c.twitter && (
              <a href={c.twitter} target="_blank" rel="noopener noreferrer" className="cmp-btn cmp-btn--ghost"><Twitter /></a>
            )}
            {c.facebook && (
              <a href={c.facebook} target="_blank" rel="noopener noreferrer" className="cmp-btn cmp-btn--ghost"><Facebook /></a>
            )}
            {c.email && (
              <a href={`mailto:${c.email}`} className="cmp-btn cmp-btn--ghost"><Mail /></a>
            )}
            {c.phone && (
              <a href={`tel:${c.phone}`} className="cmp-btn cmp-btn--ghost"><Phone /></a>
            )}
          </div>
        </section>
      </div>

      <LeadFormModal
        isOpen={leadOpen}
        onClose={() => setLeadOpen(false)}
        listingSlug={slug}
        companyName={c.company_name}
        companyLogo={c.logo_url || ''}
        prefillName={null}
        prefillEmail={null}
      />
    </main>
  )
}
