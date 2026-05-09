'use client'

import { useMemo, useState } from 'react'
import LeadFormModal from '../listing/LeadFormModal'

/* ───────────────────────────────────────────────────────────────────────
   /profile/[slug] — public company profile.

   Editorial portfolio approach — distinct from the product detail page
   at /company/[slug]. Four sections, generous whitespace, sector
   accent color as a quiet through-line. Products are the centerpiece;
   stats and contact info are supporting detail.

     1. Hero          — soft sector-tinted band, big logo, name +
                        tagline, inline verified badge, single-line
                        meta strip (founded · team · HQ · hiring),
                        primary CTA (Visit website) + outline (Quote)
     2. About         — 65/35 split: long description left, supporting
                        details (website + socials + verification)
                        right
     3. Portfolio     — "Products by {Company}" — large rich cards in
                        a 2-col grid, sector-tinted hover, no chevron
                        clutter. THE main event of the page.
     4. Connect       — single block: Get-a-Quote launcher + socials +
                        email/phone, no card chrome around it

   No sticky header, no FAQ section, no "Where we are" section, no
   "Team & culture" placeholder — everything that was filler in the
   first cut is gone. The Hero meta strip carries founded / team /
   location, and "Hiring" gets a small chip when applicable.
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

const websiteHostOf = (url: string | null) => {
  if (!url) return ''
  try {
    const u = new URL(/^https?:\/\//.test(url) ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, '')
  } catch { return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] }
}

const clearbitFavicon = (url: string | null, size = 128) => {
  const host = websiteHostOf(url)
  return host ? `https://www.google.com/s2/favicons?domain=${host}&sz=${size}` : ''
}

/** Hex → rgba helper for the soft accent backdrops. */
function hexA(hex: string, alpha: number): string {
  const m = (hex || '').replace('#', '').trim()
  const full = m.length === 3 ? m.split('').map(c => c + c).join('') : m
  if (full.length !== 6) return `rgba(232, 85, 61, ${alpha})`
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/* Inline icon set — one place, currentColor everywhere. */
const SI = (props: { d: string; size?: number; sw?: number }) => (
  <svg viewBox="0 0 24 24" width={props.size || 16} height={props.size || 16}
       fill="none" stroke="currentColor" strokeWidth={props.sw || 2}
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={props.d} />
  </svg>
)
const Globe   = () => <SI d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />
const MapPin  = () => <SI d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
const Users   = () => <SI d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
const Calendar= () => <SI d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM3 10h18M16 2v4M8 2v4" />
const Mail    = () => <SI d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6" />
const Phone   = () => <SI d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
const Linkedin= () => <SI d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 100 4 2 2 0 000-4z" />
const Twitter = () => <SI d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
const Facebook= () => <SI d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
const Arrow   = () => <SI d="M7 17L17 7M7 7h10v10" />
const Spark   = () => <SI d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4" sw={1.6} />
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
  const verifiedDate = useMemo(() => {
    if (!c.verified_at) return ''
    const d = new Date(c.verified_at)
    return Number.isNaN(d.getTime()) ? ''
      : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }, [c.verified_at])
  const lastUpdated = useMemo(() => {
    const iso = c.updated_at || c.created_at
    if (!iso) return ''
    const d = new Date(iso)
    return Number.isNaN(d.getTime()) ? ''
      : d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }, [c.updated_at, c.created_at])

  const accent = c.category_color || '#E8553D'
  const accentSoft = hexA(accent, 0.06)
  const accentBorder = hexA(accent, 0.22)

  const websiteHost = websiteHostOf(c.website)
  const fallbackLogo = clearbitFavicon(c.website, 256)

  /* Description paragraphs — split on blank lines for readable typography. */
  const aboutParas = useMemo(
    () => (c.description || '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean),
    [c.description]
  )

  const location = [c.city, c.state, c.country_name].filter(Boolean).join(', ')
  const [leadOpen, setLeadOpen] = useState(false)

  const cssVars: React.CSSProperties = {
    /* Sector color drives the soft hero band, primary CTA fill, hover
       borders on portfolio cards. Set on the root so any descendant
       can pick it up via var(--cmp-accent) without prop-drilling. */
    ['--cmp-accent' as string]: accent,
    ['--cmp-accent-soft' as string]: accentSoft,
    ['--cmp-accent-border' as string]: accentBorder,
  }

  return (
    <main className="cmp-root tp-root" style={cssVars}>

      {/* ════════════════════════════════════════════════════════════
          1. HERO — soft sector backdrop, asymmetric layout
          ════════════════════════════════════════════════════════════ */}
      <section className="cmp-hero">
        <div className="cmp-hero-bg" aria-hidden="true" />
        <div className="cmp-hero-inner">
          <div className="cmp-hero-logo">
            {(c.logo_url || fallbackLogo)
              ? <img src={c.logo_url || fallbackLogo} alt={`${c.company_name} logo`} />
              : <span>{(c.company_name?.charAt(0) || '?').toUpperCase()}</span>}
          </div>

          <div className="cmp-hero-body">
            {c.category_name && (
              <span className="cmp-hero-eyebrow">{c.category_name}</span>
            )}

            <h1 className="cmp-hero-name">
              {c.company_name}
              {isVerified && (
                <span className="cmp-hero-verified" aria-label={`Verified by InfoWebWorld${verifiedDate ? ` on ${verifiedDate}` : ''}`} title={`Verified by InfoWebWorld${verifiedDate ? ` on ${verifiedDate}` : ''}`}>
                  <Shield />
                </span>
              )}
            </h1>

            {c.tagline && <p className="cmp-hero-tagline">{c.tagline}</p>}

            {headerTags.length > 0 && (
              <div className="cmp-hero-chips">
                {headerTags.map(t => <span key={t} className="cmp-hero-chip">{t}</span>)}
              </div>
            )}

            {/* Meta strip — single line of stats, dot-separated. Replaces
                the old stat-tile-soup of the previous design. */}
            <div className="cmp-hero-meta">
              {c.founded_year && (
                <span className="cmp-hero-meta-item"><Calendar /> Founded {c.founded_year}</span>
              )}
              {c.team_size && (
                <span className="cmp-hero-meta-item"><Users /> {c.team_size}</span>
              )}
              {(c.city || c.country_name) && (
                <span className="cmp-hero-meta-item"><MapPin /> {location}</span>
              )}
              {Number(c.is_hiring) === 1 && (
                <span className="cmp-hero-meta-item cmp-hiring"><Spark /> We&rsquo;re hiring</span>
              )}
            </div>

            <div className="cmp-hero-cta">
              {c.website && (
                <a
                  href={withInfoWebWorldUtm(c.website, slug)}
                  target="_blank" rel="noopener noreferrer"
                  className="cmp-btn cmp-btn--primary"
                >
                  Visit website <Arrow />
                </a>
              )}
              <button type="button" className="cmp-btn cmp-btn--outline" onClick={() => setLeadOpen(true)}>
                Get a quote <Mail />
              </button>
              {!isVerified && (
                <span className="cmp-hero-unverified">Unverified by InfoWebWorld</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          2. ABOUT — 65/35 split: longform left, supporting right
          ════════════════════════════════════════════════════════════ */}
      <section className="cmp-section cmp-about">
        <div className="cmp-section-inner">
          <header className="cmp-section-head">
            <h2 className="cmp-section-title">About {c.company_name}</h2>
            {lastUpdated && <span className="cmp-section-meta">Updated {lastUpdated}</span>}
          </header>

          <div className="cmp-about-grid">
            <article className="cmp-about-prose">
              {aboutParas.length > 0
                ? aboutParas.map((p, i) => <p key={i}>{p}</p>)
                : <p className="cmp-about-empty">{c.company_name} hasn&rsquo;t added a long-form description yet.</p>}
            </article>

            <aside className="cmp-about-aside">
              {c.website && (
                <a
                  href={withInfoWebWorldUtm(c.website, slug)}
                  target="_blank" rel="noopener noreferrer"
                  className="cmp-aside-link cmp-aside-link--primary"
                >
                  <Globe />
                  <span>
                    <span className="cmp-aside-link-lbl">Website</span>
                    <span className="cmp-aside-link-val">{websiteHost || c.website}</span>
                  </span>
                </a>
              )}

              {(c.linkedin || c.twitter || c.facebook) && (
                <div className="cmp-aside-socials">
                  {c.linkedin && (
                    <a href={c.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin /></a>
                  )}
                  {c.twitter && (
                    <a href={c.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X"><Twitter /></a>
                  )}
                  {c.facebook && (
                    <a href={c.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook /></a>
                  )}
                </div>
              )}

              {/* Verification block — supporting detail here, not crowding the hero */}
              <div className={`cmp-aside-verify ${isVerified ? 'is-on' : 'is-off'}`}>
                {isVerified ? (
                  <>
                    <span className="cmp-aside-verify-shield" aria-hidden="true"><Shield /></span>
                    <div>
                      <strong>Verified by InfoWebWorld</strong>
                      <span>
                        Identity confirmed by our review team
                        {verifiedDate ? ` on ${verifiedDate}.` : '.'}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="cmp-aside-verify-shield cmp-aside-verify-shield--muted" aria-hidden="true">
                      <SI d="M12 2 4 5.5v5c0 5.2 3.4 9.6 8 10.5 4.6-.9 8-5.3 8-10.5v-5L12 2Z" sw={1.7} />
                    </span>
                    <div>
                      <strong>Unverified by InfoWebWorld</strong>
                      <span>{c.company_name} hasn&rsquo;t completed identity verification yet.</span>
                    </div>
                  </>
                )}
              </div>

              {c.funding && (
                <div className="cmp-aside-fact">
                  <span className="cmp-aside-fact-lbl">Funding</span>
                  <span className="cmp-aside-fact-val">{c.funding}</span>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          3. PORTFOLIO — Products by us. The centerpiece.
          ════════════════════════════════════════════════════════════ */}
      <section className="cmp-section cmp-portfolio">
        <div className="cmp-section-inner">
          <header className="cmp-section-head cmp-section-head--portfolio">
            <div>
              <h2 className="cmp-section-title">
                Products by {c.company_name}
                {products.length > 0 && (
                  <span className="cmp-section-count">{products.length}</span>
                )}
              </h2>
              <p className="cmp-section-sub">
                Each one made by {c.company_name}, listed on InfoWebWorld with full details.
              </p>
            </div>
          </header>

          {products.length > 0 ? (
            <div className="cmp-portfolio-grid">
              {products.map(p => {
                const pHost = websiteHostOf(p.logo_url ? null : null)
                const pLogo = p.logo_url || (pHost ? clearbitFavicon(p.logo_url || '', 128) : '')
                return (
                  <a
                    key={p.id}
                    href={`/company/${p.slug}`}
                    className="cmp-portfolio-card"
                  >
                    <div className="cmp-pf-card-top">
                      <div className="cmp-pf-card-logo">
                        {pLogo
                          ? <img src={pLogo} alt={`${p.company_name} logo`} />
                          : <span>{(p.company_name?.charAt(0) || '?').toUpperCase()}</span>}
                      </div>
                      {p.category_name && (
                        <span className="cmp-pf-card-cat">{p.category_name}</span>
                      )}
                    </div>
                    <div className="cmp-pf-card-body">
                      <h3 className="cmp-pf-card-name">{p.company_name}</h3>
                      <p className="cmp-pf-card-tag">{p.tagline}</p>
                    </div>
                    <div className="cmp-pf-card-foot">
                      {p.starting_price ? (
                        <span className="cmp-pf-card-price">
                          From ${p.starting_price}
                          {p.starting_price_period ? <span> {p.starting_price_period}</span> : null}
                        </span>
                      ) : <span /> /* spacer for justify-between */}
                      <span className="cmp-pf-card-cta">
                        View product <Arrow />
                      </span>
                    </div>
                  </a>
                )
              })}
            </div>
          ) : (
            <div className="cmp-portfolio-empty">
              <h3>No products listed yet</h3>
              <p>{c.company_name} hasn&rsquo;t put any products on InfoWebWorld yet. When they do, you&rsquo;ll see them here.</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          4. CONNECT — single block, no card chrome
          ════════════════════════════════════════════════════════════ */}
      <section className="cmp-section cmp-connect">
        <div className="cmp-section-inner cmp-connect-inner">
          <div className="cmp-connect-copy">
            <h2 className="cmp-section-title">Get in touch with {c.company_name}</h2>
            <p className="cmp-section-sub">
              Send a quote request, visit their website, or follow them around the web.
            </p>
          </div>
          <div className="cmp-connect-actions">
            <button type="button" className="cmp-btn cmp-btn--primary" onClick={() => setLeadOpen(true)}>
              Get a quote <Mail />
            </button>
            {c.website && (
              <a
                href={withInfoWebWorldUtm(c.website, slug)}
                target="_blank" rel="noopener noreferrer"
                className="cmp-btn cmp-btn--outline"
              >
                <Globe /> {websiteHost || 'Visit website'}
              </a>
            )}
          </div>
          <div className="cmp-connect-meta">
            {c.email && (
              <a href={`mailto:${c.email}`} className="cmp-connect-meta-link">
                <Mail /> {c.email}
              </a>
            )}
            {c.phone && (
              <a href={`tel:${c.phone}`} className="cmp-connect-meta-link">
                <Phone /> {c.phone_code || ''} {c.phone}
              </a>
            )}
            <div className="cmp-connect-socials">
              {c.linkedin && <a href={c.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin /></a>}
              {c.twitter  && <a href={c.twitter}  target="_blank" rel="noopener noreferrer" aria-label="Twitter / X"><Twitter /></a>}
              {c.facebook && <a href={c.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook /></a>}
            </div>
          </div>
        </div>
      </section>

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
