'use client'
import { useState, useEffect, useRef } from 'react'
import Link from '../../components/CountryLink'
import { fetchListingBySlug } from '../../iww-hq/data/submissions-storage'
import type { RealSubmission, PricingTier, FaqItem } from '../../iww-hq/data/submissions-storage'

const I = ({ d, size = 18, color = 'currentColor', sw = 1.5 }: { d: string; size?: number; color?: string; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d.split('|').map((p, i) => <path key={i} d={p} />)}</svg>
)

const ic = {
  home: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10',
  search: 'M11 3a8 8 0 100 16 8 8 0 000-16z|M21 21l-4.35-4.35',
  check: 'M20 6L9 17l-5-5',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  globe: 'M12 2a10 10 0 100 20 10 10 0 000-20z|M2 12h20|M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10A15 15 0 0112 2z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z|M22 6l-10 7L2 6',
  link: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71|M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  externalLink: 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6|M15 3h6v6|M10 14L21 3',
  calendar: 'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z|M16 2v4|M8 2v4|M3 10h18',
  mapPin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z|M12 7a3 3 0 100 6 3 3 0 000-6z',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2|M9 3a4 4 0 100 8 4 4 0 000-8z|M23 21v-2a4 4 0 00-3-3.87|M16 3.13a4 4 0 010 7.75',
  dollarSign: 'M12 1v22|M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  building: 'M4 2h16a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z|M9 22v-4h6v4|M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z|M7 7h.01',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  image: 'M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z|M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z|M21 15l-5-5L5 21',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  arrowLeft: 'M19 12H5|M12 19l-7-7 7-7',
  grid: 'M3 3h7v7H3z|M14 3h7v7h-7z|M3 14h7v7H3z|M14 14h7v7h-7z',
  layers: 'M12 2L2 7l10 5 10-5-10-5z|M2 17l10 5 10-5|M2 12l10 5 10-5',
  x: 'M18 6L6 18|M6 6l12 12',
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  linkedin: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z|M2 9h4v12H2z|M4 2a2 2 0 100 4 2 2 0 000-4z',
  twitter: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
  facebook: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  arrow: 'M5 12h14|M12 5l7 7-7 7',
  helpCircle: 'M12 2a10 10 0 100 20 10 10 0 000-20z|M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3|M12 17h.01',
  chevronDown: 'M6 9l6 6 6-6',
}

/* ── FAQ Accordion ── */
function FaqSection({ faqs, color }: { faqs: FaqItem[]; color: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  if (!faqs || faqs.length === 0) return null

  return (
    <div className="ld-card ld-section">
      <h2 className="ld-h3"><I d={ic.helpCircle} size={16} color={color} sw={2} /> Frequently Asked Questions</h2>
      <div className="ld-faq-list">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i
          return (
            <div key={i} className={`ld-faq-item${isOpen ? ' ld-faq-item--open' : ''}`}>
              <button
                className="ld-faq-q"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <span className={`ld-faq-chevron${isOpen ? ' ld-faq-chevron--open' : ''}`}>
                  <I d={ic.chevronDown} size={14} sw={2.5} />
                </span>
              </button>
              <div className={`ld-faq-a${isOpen ? ' ld-faq-a--open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Map a raw DB row (from server) to RealSubmission (same logic as submissions-storage mapRow) ── */
function mapServerRow(r: Record<string, unknown>): RealSubmission {
  const parseJson = (val: unknown): unknown[] => {
    if (!val) return []
    if (typeof val === 'string') { try { return JSON.parse(val) } catch { return [] } }
    if (Array.isArray(val)) return val
    return []
  }
  return {
    id: String(r.id ?? ''),
    companyName: String(r.company_name ?? ''),
    contactName: String(r.contact_name ?? ''),
    email: String(r.email ?? ''),
    phoneCode: String(r.phone_code ?? '+1'),
    phone: String(r.phone ?? ''),
    website: String(r.website ?? ''),
    category: String(r.category_name ?? r.category ?? ''),
    categorySlug: String(r.category_slug ?? ''),
    categoryColor: String(r.category_color ?? '#E8553D'),
    categoryIcon: String(r.category_icon ?? 'grid'),
    country: String(r.country_name ?? r.country ?? ''),
    city: String(r.city ?? ''),
    state: String(r.state ?? ''),
    tagline: String(r.tagline ?? ''),
    description: String(r.description ?? ''),
    slug: String(r.slug ?? ''),
    logoUrl: String(r.logo_url ?? ''),
    screenshots: parseJson(r.screenshots) as string[],
    demoVideo: String(r.demo_video ?? ''),
    features: parseJson(r.features) as string[],
    integrations: parseJson(r.integrations) as string[],
    pricingModel: String(r.pricing_model ?? 'contact'),
    pricingTiers: parseJson(r.pricing_tiers) as PricingTier[],
    founded: String(r.founded_year ?? ''),
    employees: String(r.team_size ?? ''),
    funding: String(r.funding ?? ''),
    hqLocation: String(r.hq_location ?? ''),
    linkedin: String(r.linkedin ?? ''),
    twitter: String(r.twitter ?? ''),
    facebook: String(r.facebook ?? ''),
    faqs: parseJson(r.faqs) as FaqItem[],
    listingType: String(r.listing_type_name ?? ''),
    listingTypeSlug: String(r.listing_type_slug ?? ''),
    plan: String(r.plan_slug ?? r.plan ?? ''),
    planName: String(r.plan_name ?? ''),
    status: (r.status as RealSubmission['status']) || 'pending',
    submittedAt: String(r.created_at ?? ''),
    approvedAt: String(r.approved_at ?? ''),
  }
}

interface InitialData {
  listing: Record<string, unknown>
  breadcrumb: { name: string; slug: string }[]
  related: Record<string, unknown>[]
}

export default function ListingDetailPage({ slug: slugProp, initialData }: { slug?: string; initialData?: InitialData }) {
  /* If server passed data, use it immediately — no loading flash */
  const hasInitial = !!initialData
  const [listing, setListing] = useState<RealSubmission | null>(
    hasInitial ? mapServerRow(initialData.listing) : null
  )
  const [breadcrumb, setBreadcrumb] = useState<{ name: string; slug: string }[]>(
    hasInitial ? initialData.breadcrumb : []
  )
  const [related, setRelated] = useState<RealSubmission[]>(
    hasInitial ? initialData.related.map(r => mapServerRow(r)) : []
  )
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(!hasInitial)
  const [expandedImage, setExpandedImage] = useState<string | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  /* Client-side fetch only when no initialData (e.g. direct /listing/ route) */
  useEffect(() => {
    if (hasInitial) return
    const match = slugProp || (typeof window !== 'undefined' ? window.location.pathname.match(/\/listing\/(.+?)(?:\/|$)/)?.[1] : null)
    if (!match) { setNotFound(true); setLoading(false); return }
    fetchListingBySlug(match).then(r => {
      if (r) { setListing(r.listing); setBreadcrumb(r.breadcrumb); setRelated(r.related) }
      else setNotFound(true)
      setLoading(false)
    })
  }, [hasInitial, slugProp])

  /* SEO meta + JSON-LD now handled server-side in app/company/[slug]/page.tsx */

  if (loading) return null

  if (notFound) return (
    <section className="ld" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '3rem 1rem' }}>
      <div className="ld-card" style={{ textAlign: 'center', maxWidth: 420, padding: 'clamp(2rem, 5vw, 3rem)' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: '#E8553D0A', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <I d={ic.search} size={24} color="#E8553D" />
        </div>
        <h1 className="ld-h2">Listing Not Found</h1>
        <p className="ld-body" style={{ maxWidth: 340, margin: '0 auto .85rem' }}>This listing doesn&apos;t exist or hasn&apos;t been published yet.</p>
        <Link href="/categories" className="ld-btn-primary">Browse Categories</Link>
      </div>
    </section>
  )

  if (!listing) return null

  const L = listing
  const color = L.categoryColor || '#E8553D'
  const verified = L.status === 'active' || L.plan === 'founding'
  const initial = L.companyName.charAt(0).toUpperCase()

  return (
    <section className="ld">
      <div className="ld-wrap">

        {/* ═══ HERO CARD ═══ */}
        <div className="ld-card ld-hero-card">
          {/* Rich banner */}
          <div className="ld-banner" style={{ background: `linear-gradient(135deg, ${color}20, ${color}0D 40%, #FAF5F0CC 70%, #FAF5F0)` }}>
            <div className="ld-banner-mesh" style={{ background: `radial-gradient(ellipse 80% 60% at 15% 20%, ${color}18, transparent 60%), radial-gradient(ellipse 60% 80% at 85% 70%, ${color}10, transparent 50%)` }} />
            <div className="ld-banner-dots" style={{ backgroundImage: `radial-gradient(${color}88 0.8px, transparent 0.8px)` }} />
            <div className="ld-banner-lines" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${color}, ${color} 1px, transparent 1px, transparent 16px)` }} />
            <div className="ld-banner-shape ld-banner-shape--1" style={{ background: color }} />
            <div className="ld-banner-shape ld-banner-shape--2" style={{ background: color }} />
            <div className="ld-banner-shape ld-banner-shape--3" style={{ background: color }} />

            {/* Breadcrumb */}
            <nav className="ld-crumbs">
              <Link href="/" className="ld-crumb"><I d={ic.home} size={10} sw={2} /> Home</Link>
              <span className="ld-crumb-sep">/</span>
              <Link href="/categories" className="ld-crumb">Categories</Link>
              {breadcrumb.map((bc, i) => (
                <span key={i} style={{ display: 'contents' }}>
                  <span className="ld-crumb-sep">/</span>
                  <Link href={`/category/${bc.slug}`} className="ld-crumb ld-crumb--cat" style={{ color, background: `${color}14` }}>{bc.name}</Link>
                </span>
              ))}
              <span className="ld-crumb-sep">/</span>
              <span className="ld-crumb ld-crumb--current">{L.companyName}</span>
            </nav>
          </div>

          {/* Hero content */}
          <div className="ld-hero-body">
            {/* Logo */}
            <div className="ld-logo" style={{ background: L.logoUrl ? '#fff' : `linear-gradient(135deg, ${color}22, ${color}44)`, borderColor: L.logoUrl ? '#E8E3DE' : `${color}20` }}>
              {L.logoUrl ? (
                <img src={L.logoUrl} alt={L.companyName} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; const el = (e.target as HTMLImageElement).nextElementSibling as HTMLElement; if (el) el.style.display = 'flex' }} />
              ) : null}
              <span className="ld-logo-fallback" style={{ color, display: L.logoUrl ? 'none' : 'flex' }}>{initial}</span>
            </div>

            <div className="ld-hero-info">
              <h1 className="ld-title">{L.companyName}</h1>
              {L.tagline && <p className="ld-tagline">{L.tagline}</p>}

              {/* Badges */}
              <div className="ld-badges">
                <span className="ld-badge" style={{ color, background: `${color}10` }}>
                  <I d={ic.tag} size={10} color={color} sw={2} /> {L.category}
                </span>
                {verified && (
                  <span className="ld-badge" style={{ color: '#2FAE6A', background: '#2FAE6A12' }}>
                    <I d={ic.shield} size={10} color="#2FAE6A" sw={2} /> Verified
                  </span>
                )}
                {L.planName && (
                  <span className="ld-badge" style={{ color: '#C89200', background: '#E5A10012' }}>
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="#E5A100" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    {L.planName}
                  </span>
                )}
              </div>

              {/* Location + Founded inline */}
              {(L.hqLocation || L.founded || L.employees) && (
                <div className="ld-meta-row">
                  {L.hqLocation && <span className="ld-meta"><I d={ic.mapPin} size={11} color="#9A9590" sw={2} /> {L.hqLocation}</span>}
                  {L.founded && <span className="ld-meta"><I d={ic.calendar} size={11} color="#9A9590" sw={2} /> Founded {L.founded}</span>}
                  {L.employees && <span className="ld-meta"><I d={ic.users} size={11} color="#9A9590" sw={2} /> {L.employees}</span>}
                </div>
              )}

              {/* Actions */}
              <div className="ld-actions">
                {L.website && (
                  <a href={L.website} target="_blank" rel="noopener noreferrer" className="ld-btn-primary" style={{ background: color, borderColor: color }}>
                    <I d={ic.externalLink} size={13} color="#fff" sw={2} /> Visit Website
                  </a>
                )}
                <a href={`mailto:${L.email}`} className="ld-btn-outline">
                  <I d={ic.mail} size={13} sw={2} /> Contact
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ 2-COLUMN LAYOUT ═══ */}
        <div className="ld-grid">

          {/* ── LEFT: Main content ── */}
          <div className="ld-main">

            {/* Overview + Features + Integrations */}
            {(L.description || (L.features?.length > 0) || (L.integrations?.length > 0)) && (
              <div className="ld-card ld-section">
                {L.description && (
                  <div className="ld-block">
                    <h2 className="ld-h3"><I d={ic.layers} size={16} color={color} sw={2} /> Overview</h2>
                    <p className="ld-body" style={{ whiteSpace: 'pre-line' }}>{L.description}</p>
                  </div>
                )}
                {L.features?.length > 0 && (
                  <div className="ld-block">
                    <h3 className="ld-h3"><I d={ic.check} size={15} color="#2FAE6A" sw={2.5} /> Key Features</h3>
                    <div className="ld-features">
                      {L.features.map((f, i) => (
                        <div key={i} className="ld-feature">
                          <span className="ld-feature-dot"><I d={ic.check} size={11} color="#2FAE6A" sw={2.5} /></span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {L.integrations?.length > 0 && (
                  <div className="ld-block">
                    <h3 className="ld-h3"><I d={ic.zap} size={15} color={color} sw={2} /> Integrations</h3>
                    <div className="ld-tags">
                      {L.integrations.map((t, i) => <span key={i} className="ld-tag"><I d={ic.zap} size={10} color={color} sw={2} /> {t}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Screenshots */}
            {L.screenshots?.length > 0 && (
              <div className="ld-card ld-section">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h2 className="ld-h3" style={{ margin: 0 }}><I d={ic.image} size={16} color={color} sw={2} /> Screenshots</h2>
                  {L.screenshots.length > 1 && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => galleryRef.current?.scrollBy({ left: -280, behavior: 'smooth' })} className="ld-gallery-btn"><I d={ic.chevronLeft} size={13} sw={2} /></button>
                      <button onClick={() => galleryRef.current?.scrollBy({ left: 280, behavior: 'smooth' })} className="ld-gallery-btn"><I d={ic.chevronRight} size={13} sw={2} /></button>
                    </div>
                  )}
                </div>
                <div ref={galleryRef} className="ld-gallery">
                  {L.screenshots.map((src, i) => (
                    <div key={i} className="ld-gallery-item" onClick={() => setExpandedImage(src)}>
                      <img src={src} alt={`Screenshot ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing */}
            {L.pricingTiers?.length > 0 && (
              <div className="ld-card ld-section">
                <h2 className="ld-h3"><I d={ic.dollarSign} size={16} color={color} sw={2} /> Pricing</h2>
                <div className="ld-pricing">
                  {L.pricingTiers.map((t: PricingTier, i: number) => (
                    <div key={i} className="ld-price-card">
                      <div className="ld-price-bar" style={{ background: `linear-gradient(90deg, ${color}40, ${color}10)` }} />
                      <p className="ld-price-name">{t.name}</p>
                      <p className="ld-price-amount">{t.price ? `$${t.price}` : 'Custom'}</p>
                      {t.period && <p className="ld-price-period">{t.period}</p>}
                    </div>
                  ))}
                </div>
                {L.pricingModel && <p className="ld-body-sm" style={{ marginTop: 10 }}><I d={ic.tag} size={11} color="#9A9590" sw={2} /> Model: {L.pricingModel}</p>}
              </div>
            )}

            {/* FAQ Section */}
            <FaqSection faqs={L.faqs} color={color} />
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <aside className="ld-sidebar">
            {/* Quick Facts */}
            {(L.founded || L.hqLocation || L.employees || L.funding || L.website) && (
              <div className="ld-card ld-side-card">
                <h3 className="ld-side-title"><I d={ic.building} size={14} color={color} sw={2} /> Quick Facts</h3>
                <div className="ld-facts">
                  {[
                    L.founded && { icon: ic.calendar, label: 'Founded', val: L.founded },
                    L.hqLocation && { icon: ic.mapPin, label: 'HQ', val: L.hqLocation },
                    L.employees && { icon: ic.users, label: 'Team', val: L.employees },
                    L.funding && { icon: ic.dollarSign, label: 'Funding', val: L.funding },
                  ].filter(Boolean).map((f, i) => f && (
                    <div key={i} className="ld-fact">
                      <div className="ld-fact-icon" style={{ background: `${color}08` }}><I d={f.icon} size={13} color={color} sw={2} /></div>
                      <div><p className="ld-fact-label">{f.label}</p><p className="ld-fact-val">{f.val}</p></div>
                    </div>
                  ))}
                  {L.website && (
                    <div className="ld-fact">
                      <div className="ld-fact-icon" style={{ background: `${color}08` }}><I d={ic.globe} size={13} color={color} sw={2} /></div>
                      <div style={{ minWidth: 0 }}>
                        <p className="ld-fact-label">Website</p>
                        <a href={L.website} target="_blank" rel="noopener noreferrer" className="ld-fact-link">{L.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social */}
            {(L.linkedin || L.twitter || L.facebook) && (
              <div className="ld-card ld-side-card">
                <h3 className="ld-side-title"><I d={ic.globe} size={14} color={color} sw={2} /> Social</h3>
                <div className="ld-socials">
                  {L.linkedin && <a href={L.linkedin} target="_blank" rel="noopener noreferrer" className="ld-social"><span className="ld-social-icon" style={{ background: '#0077B514' }}><I d={ic.linkedin} size={13} color="#0077B5" sw={2} /></span> LinkedIn <I d={ic.externalLink} size={10} color="#9A9590" sw={2} /></a>}
                  {L.twitter && <a href={L.twitter} target="_blank" rel="noopener noreferrer" className="ld-social"><span className="ld-social-icon" style={{ background: '#1DA1F214' }}><I d={ic.twitter} size={13} color="#1DA1F2" sw={2} /></span> Twitter <I d={ic.externalLink} size={10} color="#9A9590" sw={2} /></a>}
                  {L.facebook && <a href={L.facebook} target="_blank" rel="noopener noreferrer" className="ld-social"><span className="ld-social-icon" style={{ background: '#1877F214' }}><I d={ic.facebook} size={13} color="#1877F2" sw={2} /></span> Facebook <I d={ic.externalLink} size={10} color="#9A9590" sw={2} /></a>}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="ld-side-cta" style={{ background: `linear-gradient(135deg, ${color}12, ${color}06)`, borderColor: `${color}20` }}>
              <div className="ld-side-cta-icon" style={{ background: `${color}14` }}><I d={ic.mail} size={18} color={color} sw={2} /></div>
              <h3 className="ld-side-cta-title">Interested?</h3>
              <p className="ld-body-sm">Get in touch with {L.companyName} to learn more.</p>
              <a href={`mailto:${L.email}`} className="ld-btn-primary ld-btn-full" style={{ background: color, borderColor: color }}>
                <I d={ic.mail} size={13} color="#fff" sw={2} /> Send Inquiry
              </a>
            </div>
          </aside>
        </div>

        {/* ═══ RELATED ═══ */}
        {related.length > 0 && (
          <div className="ld-card ld-section" style={{ marginTop: 16 }}>
            <h2 className="ld-h3"><I d={ic.grid} size={16} color={color} sw={2} /> Related Listings</h2>
            <div className="ld-related">
              {related.map(r => {
                const rc = r.categoryColor || '#E8553D'
                return (
                  <Link key={r.id} href={`/company/${r.slug}`} className="ld-related-card">
                    <div className="ld-related-logo" style={{ background: r.logoUrl ? '#fff' : `linear-gradient(135deg, ${rc}22, ${rc}44)`, borderColor: r.logoUrl ? '#E8E3DE' : `${rc}20` }}>
                      {r.logoUrl ? <img src={r.logoUrl} alt={r.companyName} /> : <span style={{ color: rc, fontFamily: 'var(--font-bricolage)', fontWeight: 800, fontSize: '1rem' }}>{r.companyName.charAt(0)}</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="ld-related-name">{r.companyName}</p>
                      {r.tagline && <p className="ld-related-tagline">{r.tagline}</p>}
                      <span className="ld-badge" style={{ color: rc, background: `${rc}10`, fontSize: '.6rem', padding: '2px 8px' }}>
                        <I d={ic.tag} size={8} color={rc} sw={2} /> {r.category}
                      </span>
                    </div>
                    <span className="ld-related-arrow"><I d={ic.arrow} size={13} /></span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Back */}
        <Link href="/categories" className="ld-back"><I d={ic.arrowLeft} size={13} sw={2} /> Back to Categories</Link>
      </div>

      {/* Expanded image */}
      {expandedImage && (
        <div className="ld-lightbox" onClick={() => setExpandedImage(null)}>
          <button onClick={e => { e.stopPropagation(); setExpandedImage(null) }} className="ld-lightbox-close"><I d={ic.x} size={18} color="#fff" sw={2} /></button>
          <img src={expandedImage} alt="Screenshot" />
        </div>
      )}

      <style>{`
        /* ══════════════════════════════════════════
           LISTING DETAIL — Compact, Responsive
           ══════════════════════════════════════════ */
        .ld { background: var(--h-bg); padding: clamp(1rem, 3vw, 2rem) 0 clamp(2rem, 4vw, 3rem); overflow-x: hidden }
        .ld-wrap { max-width: 1100px; margin: 0 auto; padding: 0 clamp(.75rem, 2.5vw, 1.5rem); overflow: hidden }
        .ld-card { background: #fff; border-radius: 20px; border: 1.5px solid var(--h-border); overflow: hidden; max-width: 100% }
        .ld-section { padding: clamp(1rem, 2.5vw, 1.5rem) }
        .ld-h2 { font-family: var(--font-bricolage); font-weight: 800; font-size: clamp(1.2rem, 3vw, 1.6rem); color: var(--h-heading); margin: 0 0 .4rem; line-height: 1.15 }
        .ld-h3 { font-family: var(--font-bricolage); font-weight: 800; font-size: clamp(.9rem, 2vw, 1.05rem); color: var(--h-heading); margin: 0 0 .75rem; display: flex; align-items: center; gap: 7px }
        .ld-body { font-family: var(--font-nunito); font-size: clamp(.82rem, 1.8vw, .9rem); color: var(--h-body); line-height: 1.65; margin: 0 }
        .ld-body-sm { font-family: var(--font-nunito); font-size: .75rem; color: var(--h-muted); line-height: 1.5; margin: 0 }
        .ld-block { margin-bottom: clamp(1rem, 2.5vw, 1.5rem) }
        .ld-block:last-child { margin-bottom: 0 }

        /* ── Banner ── */
        .ld-hero-card { margin-bottom: 16px }
        .ld-banner {
          position: relative; overflow: hidden;
          padding: clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 2.5vw, 1.5rem) clamp(1rem, 2.5vw, 1.5rem);
          min-height: clamp(80px, 14vw, 130px);
          display: flex; align-items: flex-end;
        }
        .ld-banner-mesh, .ld-banner-dots, .ld-banner-lines { position: absolute; inset: 0 }
        .ld-banner-mesh { opacity: 1 }
        .ld-banner-dots { opacity: .2; background-size: 18px 18px }
        .ld-banner-lines { opacity: .04 }
        .ld-banner-shape { position: absolute; border-radius: 50%; opacity: .04 }
        .ld-banner-shape--1 { width: 160px; height: 160px; top: -60px; right: 10% }
        .ld-banner-shape--2 { width: 100px; height: 100px; bottom: -40px; left: 5% }
        .ld-banner-shape--3 { width: 50px; height: 50px; border-radius: 14px; top: 25%; left: 55%; transform: rotate(25deg); opacity: .05 }

        /* ── Breadcrumb ── */
        .ld-crumbs { position: relative; z-index: 2; display: flex; flex-wrap: wrap; align-items: center; gap: 5px; font-family: var(--font-nunito); font-size: .68rem }
        .ld-crumb { display: inline-flex; align-items: center; gap: 3px; color: var(--h-muted); text-decoration: none; padding: 2px 8px; border-radius: 999px; background: rgba(255,255,255,.7); backdrop-filter: blur(6px); font-weight: 600; transition: color .2s }
        .ld-crumb:hover { color: var(--h-accent) }
        .ld-crumb--cat { font-weight: 700 }
        .ld-crumb--current { color: var(--h-heading); font-weight: 700; background: rgba(255,255,255,.85) }
        .ld-crumb-sep { color: var(--h-border); font-size: .55rem }

        /* ── Hero body ── */
        .ld-hero-body { padding: clamp(1rem, 2.5vw, 1.5rem); display: flex; gap: clamp(.75rem, 2vw, 1.25rem); align-items: flex-start; overflow: hidden }
        .ld-logo {
          width: clamp(56px, 10vw, 72px); height: clamp(56px, 10vw, 72px);
          border-radius: 18px; flex-shrink: 0; overflow: hidden;
          border: 1.5px solid; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,.05);
        }
        .ld-logo img { width: 100%; height: 100%; object-fit: contain; padding: 3px }
        .ld-logo-fallback { font-family: var(--font-bricolage); font-weight: 800; font-size: clamp(1.4rem, 4vw, 1.8rem); align-items: center; justify-content: center }
        .ld-hero-info { flex: 1; min-width: 0; overflow: hidden }
        .ld-title { font-family: var(--font-bricolage); font-weight: 800; font-size: clamp(1.2rem, 3.5vw, 1.8rem); color: var(--h-heading); margin: 0 0 4px; line-height: 1.15; letter-spacing: -.02em }
        .ld-tagline { font-family: var(--font-nunito); font-size: clamp(.8rem, 1.8vw, .9rem); color: var(--h-body); line-height: 1.5; margin: 0 0 8px; max-width: 100% }

        /* ── Badges ── */
        .ld-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px }
        .ld-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 999px; font-family: var(--font-nunito); font-size: .68rem; font-weight: 700 }

        /* ── Meta row ── */
        .ld-meta-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px }
        .ld-meta { display: inline-flex; align-items: center; gap: 4px; font-family: var(--font-nunito); font-size: .7rem; color: var(--h-muted); font-weight: 600 }

        /* ── Actions ── */
        .ld-actions { display: flex; flex-wrap: wrap; gap: 8px }
        .ld-btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 18px; border-radius: 999px; color: #fff;
          font-family: var(--font-nunito); font-weight: 700; font-size: .8rem;
          text-decoration: none; border: 1.5px solid; transition: all .3s cubic-bezier(.16,1,.3,1);
        }
        .ld-btn-primary:hover { transform: translateY(-1px); opacity: .9 }
        .ld-btn-outline {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 18px; border-radius: 999px; background: #fff;
          color: var(--h-heading); font-family: var(--font-nunito); font-weight: 700; font-size: .8rem;
          text-decoration: none; border: 1.5px solid var(--h-border); transition: all .3s cubic-bezier(.16,1,.3,1);
        }
        .ld-btn-outline:hover { border-color: var(--h-accent); color: var(--h-accent); transform: translateY(-1px) }
        .ld-btn-full { width: 100%; justify-content: center }

        /* ── 2-column grid ── */
        .ld-grid { display: grid; grid-template-columns: minmax(0, 1fr) 250px; gap: 16px; align-items: start }
        .ld-main { display: flex; flex-direction: column; gap: 16px; min-width: 0; overflow: hidden }
        .ld-sidebar { display: flex; flex-direction: column; gap: 12px; position: sticky; top: 16px }

        /* ── Features ── */
        .ld-features { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 6px }
        .ld-feature { display: flex; align-items: flex-start; gap: 8px; padding: 8px 10px; border-radius: 10px; background: var(--h-bg); font-family: var(--font-nunito); font-size: .8rem; color: var(--h-heading); font-weight: 600; line-height: 1.35 }
        .ld-feature-dot { width: 20px; height: 20px; border-radius: 6px; flex-shrink: 0; background: #2FAE6A14; display: flex; align-items: center; justify-content: center; margin-top: 1px }

        /* ── Tags ── */
        .ld-tags { display: flex; flex-wrap: wrap; gap: 6px }
        .ld-tag { display: inline-flex; align-items: center; gap: 4px; padding: 5px 12px; border-radius: 999px; background: var(--h-bg); border: 1px solid var(--h-border-light); font-family: var(--font-nunito); font-size: .75rem; font-weight: 600; color: var(--h-body) }

        /* ── Gallery ── */
        .ld-gallery { display: flex; gap: 10px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; -ms-overflow-style: none }
        .ld-gallery::-webkit-scrollbar { display: none }
        .ld-gallery-item { flex-shrink: 0; width: clamp(220px, 40vw, 280px); height: clamp(140px, 25vw, 180px); border-radius: 14px; overflow: hidden; border: 1px solid var(--h-border-light); cursor: pointer; scroll-snap-align: start; transition: transform .3s cubic-bezier(.16,1,.3,1) }
        .ld-gallery-item:hover { transform: scale(1.02) }
        .ld-gallery-item img { width: 100%; height: 100%; object-fit: cover }
        .ld-gallery-btn { width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--h-border); background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--h-body); transition: all .2s }
        .ld-gallery-btn:hover { border-color: var(--h-accent); color: var(--h-accent) }

        /* ── Pricing ── */
        .ld-pricing { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px }
        .ld-price-card { background: var(--h-bg); border-radius: 16px; border: 1px solid var(--h-border-light); padding: 16px; text-align: center; position: relative; overflow: hidden }
        .ld-price-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 16px 16px 0 0 }
        .ld-price-name { font-family: var(--font-nunito); font-weight: 700; font-size: .72rem; color: var(--h-muted); text-transform: uppercase; letter-spacing: .04em; margin: 0 0 4px }
        .ld-price-amount { font-family: var(--font-bricolage); font-weight: 800; font-size: clamp(1.1rem, 2.5vw, 1.35rem); color: var(--h-heading); margin: 0 }
        .ld-price-period { font-family: var(--font-nunito); font-size: .72rem; color: var(--h-muted); font-weight: 600; margin: 2px 0 0 }

        /* ── Sidebar ── */
        .ld-side-card { padding: clamp(.75rem, 2vw, 1rem) }
        .ld-side-title { font-family: var(--font-bricolage); font-weight: 800; font-size: .82rem; color: var(--h-heading); margin: 0 0 .75rem; display: flex; align-items: center; gap: 7px }
        .ld-facts { display: flex; flex-direction: column; gap: 10px }
        .ld-fact { display: flex; align-items: center; gap: 8px }
        .ld-fact-icon { width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center }
        .ld-fact-label { font-family: var(--font-nunito); font-size: .64rem; color: var(--h-muted); margin: 0; font-weight: 600 }
        .ld-fact-val { font-family: var(--font-nunito); font-size: .78rem; color: var(--h-heading); margin: 0; font-weight: 700 }
        .ld-fact-link { font-family: var(--font-nunito); font-size: .75rem; color: var(--h-accent); font-weight: 700; text-decoration: none; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap }
        .ld-socials { display: flex; flex-direction: column; gap: 6px }
        .ld-social { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 10px; background: var(--h-bg); text-decoration: none; font-family: var(--font-nunito); font-size: .78rem; color: var(--h-heading); font-weight: 600; transition: all .2s }
        .ld-social:hover { background: var(--h-border-light) }
        .ld-social-icon { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0 }
        .ld-side-cta { border-radius: 20px; border: 1.5px solid; padding: clamp(.85rem, 2vw, 1.15rem); text-align: center }
        .ld-side-cta-icon { width: 36px; height: 36px; border-radius: 11px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 8px }
        .ld-side-cta-title { font-family: var(--font-bricolage); font-weight: 800; font-size: .88rem; color: var(--h-heading); margin: 0 0 4px }

        /* ── Related ── */
        .ld-related { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px }
        .ld-related-card { display: flex; gap: 10px; padding: 12px; border-radius: 14px; background: var(--h-bg); border: 1px solid var(--h-border-light); text-decoration: none; align-items: center; transition: all .3s cubic-bezier(.16,1,.3,1) }
        .ld-related-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.05) }
        .ld-related-logo { width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0; overflow: hidden; border: 1px solid; display: flex; align-items: center; justify-content: center }
        .ld-related-logo img { width: 100%; height: 100%; object-fit: contain }
        .ld-related-name { font-family: var(--font-bricolage); font-weight: 800; font-size: .8rem; color: var(--h-heading); margin: 0 0 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap }
        .ld-related-tagline { font-family: var(--font-nunito); font-size: .7rem; color: var(--h-body); margin: 0 0 5px; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden }
        .ld-related-arrow { color: var(--h-muted); flex-shrink: 0; transition: transform .2s }
        .ld-related-card:hover .ld-related-arrow { transform: translateX(3px); color: var(--h-accent) }

        /* ── Back link ── */
        .ld-back { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-nunito); font-size: .72rem; font-weight: 700; color: var(--h-accent); margin-top: 1.25rem; text-decoration: none }

        /* ── FAQ Accordion ── */
        .ld-faq-list { display: flex; flex-direction: column; gap: 0 }
        .ld-faq-item { border-bottom: 1px solid var(--h-border-light) }
        .ld-faq-item:last-child { border-bottom: none }
        .ld-faq-q {
          width: 100%; display: flex; justify-content: space-between; align-items: center;
          gap: 10px; padding: .75rem 0; background: none; border: none; cursor: pointer;
          font-family: var(--font-nunito); font-size: clamp(.82rem, 1.8vw, .9rem);
          font-weight: 700; color: var(--h-heading); text-align: left; line-height: 1.4;
          transition: color .2s;
        }
        .ld-faq-q:hover { color: var(--h-accent) }
        .ld-faq-chevron { display: flex; flex-shrink: 0; transition: transform .25s ease }
        .ld-faq-chevron--open { transform: rotate(180deg) }
        .ld-faq-a {
          max-height: 0; overflow: hidden; transition: max-height .3s ease, padding .3s ease;
          padding: 0 0 0 0;
        }
        .ld-faq-a--open { max-height: 300px; padding: 0 0 .75rem 0 }
        .ld-faq-a p {
          font-family: var(--font-nunito); font-size: clamp(.78rem, 1.6vw, .85rem);
          color: var(--h-body); line-height: 1.65; margin: 0;
        }

        /* ── Lightbox ── */
        .ld-lightbox { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,.8); display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 1rem }
        .ld-lightbox img { max-width: 92vw; max-height: 88vh; border-radius: 14px; object-fit: contain; box-shadow: 0 8px 40px rgba(0,0,0,.4) }
        .ld-lightbox-close { position: absolute; top: 14px; right: 14px; width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,.15); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center }

        /* ═══ RESPONSIVE ═══ */
        @media (max-width: 900px) {
          .ld-grid { grid-template-columns: 1fr }
          .ld-sidebar { position: static; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px }
          .ld-side-cta { grid-column: 1 / -1 }
        }
        @media (max-width: 600px) {
          .ld-hero-body { flex-direction: column; align-items: flex-start; gap: .65rem }
          .ld-logo { width: 52px; height: 52px; border-radius: 14px }
          .ld-logo-fallback { font-size: 1.3rem !important }
          .ld-title { font-size: 1.15rem }
          .ld-actions { width: 100% }
          .ld-btn-primary, .ld-btn-outline { flex: 1; justify-content: center; font-size: .75rem; padding: 8px 12px }
          .ld-features { grid-template-columns: 1fr }
          .ld-pricing { grid-template-columns: 1fr }
          .ld-gallery-item { width: 200px; height: 130px }
          .ld-related { grid-template-columns: 1fr }
          .ld-sidebar { grid-template-columns: 1fr }
          .ld-banner { padding: 1.25rem .85rem .85rem; min-height: 70px }
          .ld-section { padding: .85rem }
          .ld-meta-row { gap: 6px }
          .ld-meta { font-size: .64rem }
          .ld-crumbs { gap: 3px; font-size: .6rem }
          .ld-crumb { padding: 2px 6px; font-size: .58rem }
        }
        @media (max-width: 380px) {
          .ld-wrap { padding: 0 .5rem }
          .ld-card { border-radius: 14px }
          .ld-section { padding: .75rem }
          .ld-hero-body { padding: .75rem }
          .ld-logo { width: 44px; height: 44px; border-radius: 12px }
        }
      `}</style>
    </section>
  )
}
