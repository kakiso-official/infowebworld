'use client'

import { useEffect, useMemo, useState } from 'react'
import LeadFormModal from '../listing/LeadFormModal'
import SignupModal from '../components/auth/SignupModal'
import { withInfoWebWorldUtm } from '../lib/utm'
import { trackWebsiteClick } from '../lib/track-website-click'

/* ═══════════════════════════════════════════════════════════════════════════
   /profile/[slug] — Clutch.co-style company profile.

   Layout (top-to-bottom):
     1. Sticky head — logo + name + Verified pill + ★ rating + reviews
                      + award icons + Network count + 3 CTAs + Shortlist
     2. Two-column main — left: tagline + description + Watch Video + stats
                          right: tabbed widget (Services / Focus / Industries
                                 / Clients) with SVG pie chart
     3. Pricing snapshot — three colored stat cards + What Clients Have Said
                           + Most Common Project Size range bar + service pills
     4. Products by us  — rich card grid (kept from previous design)
     5. Get in touch    — single block, no card chrome (kept)

   Per-user state (follow / bookmark) hydrates on mount via
   GET /api/listings/[slug]/me — same endpoint used by /company/[slug].
   The page itself is statically cached and identical for every visitor.

   Sector accent color drives the Visit-Website pill, primary CTAs, and
   the soft hero backdrop. Set on the root via --cmp-accent so descendants
   pick it up via var() without prop drilling.

   CSS namespace: cmp-* (defined in app/styles/profile-page.css).
   ═══════════════════════════════════════════════════════════════════════════ */

interface ServiceShare { name: string; percentage: number }
interface ClientLogo { name: string; logoUrl?: string; url?: string }
interface Award { name: string; year?: string }
interface ReviewRow {
  id: number
  rating: number
  title: string | null
  body: string | null
  created_at: string
  user_name: string | null
  user_avatar_url: string | null
}

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
  /* Listings V3 shared with profile */
  industries_served: string | null
  target_company_sizes: string | null
  languages: string | null
  awards: string | null
  /* Clutch-style fields */
  min_project_size: string | null
  hourly_rate: string | null
  common_project_size: string | null
  intro_video_url: string | null
  timezones: string | null
  service_lines: string | null
  focus_breakdown: string | null
  client_logos: string | null
  clients_summary: string | null
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
  similarCompanies?: Record<string, unknown>[]
  popularTools?: Record<string, unknown>[]
  relatedCategories?: Record<string, unknown>[]
  engagement?: { followers: number; bookmarks: number }
  reviews?: { avgRating: number; reviewCount: number; recent: Record<string, unknown>[] }
}

interface RelatedCategoryRow {
  id: number; name: string; slug: string; color: string | null
}

/* Cross-marketing row shapes — match the server fetch in /profile/[slug]/page.tsx. */
interface SimilarCompanyRow {
  id: number; slug: string
  company_name: string; tagline: string | null; logo_url: string | null
  min_project_size: string | null; hourly_rate: string | null
  team_size: string | null; founded_year: string | null
  city: string | null; state: string | null
  category_name: string | null; category_color: string | null
  country_name: string | null
}
interface PopularToolRow {
  id: number; slug: string
  company_name: string; tagline: string | null; logo_url: string | null
  starting_price: string | number | null
  starting_price_period: string | null
  category_name: string | null; category_color: string | null
  parent_company_name: string | null; parent_company_slug: string | null
}

interface MeState {
  isAuthed: boolean
  isFollowing: boolean
  isBookmarked: boolean
  hasReviewed: boolean
}
const ANON_ME: MeState = { isAuthed: false, isFollowing: false, isBookmarked: false, hasReviewed: false }

/* ── Helpers ───────────────────────────────────────────────────────── */

function parseJsonArr(val: unknown): unknown[] {
  if (!val) return []
  if (typeof val === 'string') { try { return JSON.parse(val) } catch { return [] } }
  if (Array.isArray(val)) return val
  return []
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

function hexA(hex: string, alpha: number): string {
  const m = (hex || '').replace('#', '').trim()
  const full = m.length === 3 ? m.split('').map(c => c + c).join('') : m
  if (full.length !== 6) return `rgba(232, 85, 61, ${alpha})`
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** 2-character initial for a logo fallback (e.g. "Sketch Development" → "SD",
 *  "Acme" → "AC"). Beats single-letter fallbacks which look ambiguous. */
function initialsOf(name: string | null | undefined): string {
  const words = (name || '?').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
}

/* Stable color palette for pie/bar slices — Clutch-ish blue-teal-green
   ramp. Indexed so a given service position gets the same color every
   render. */
const PIE_PALETTE = [
  '#1F4F8C', '#2E6BB0', '#3A86C9', '#4FA3D9', '#62C0E0',
  '#82CFA0', '#A6D86E', '#C8DC52', '#5BB39A', '#8BCBC1',
]

const STAR_FULL = '★'
const STAR_EMPTY = '☆'

/* ── Inline icon set ─────────────────────────────────────────────── */
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
const Plus    = () => <SI d="M12 5v14M5 12h14" />
const Check   = () => <SI d="M5 12l5 5 9-11" />
const Trophy  = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" opacity=".18" d="M6 4h12v3a6 6 0 0 1-12 0V4Z"/>
    <path fill="currentColor" d="M8 4h8v3a4 4 0 0 1-8 0V4Z"/>
    <path fill="currentColor" d="M10 12h4l1 4H9l1-4Zm-3 5h10v2H7v-2Z"/>
  </svg>
)
const PeopleSm= () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm7 .13a4 4 0 0 1 0 7.75"/>
  </svg>
)
/* SVGs ported verbatim from ListingDetailPage.tsx — using the SAME
   tlp-* class names so visually the cross-marketing sections match the
   product page pixel-for-pixel. */
function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5M12 7.5v.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function FolderIcon() {
  return (
    <svg viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
      <path fill="none" stroke="#0C9A9A" strokeWidth="1.8" strokeLinejoin="round"
        d="M6 14h12l3 4h21v22H6z" />
      <path fill="none" stroke="#0C9A9A" strokeWidth="1.8" strokeLinejoin="round" opacity=".55"
        d="M6 14l3 4h12l3 4h18" />
    </svg>
  )
}
function BracketIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="none" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        d="M9 5H6v14h3M15 5h3v14h-3" />
    </svg>
  )
}
const Spark   = () => <SI d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4" sw={1.6} />
const Play    = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
    <path fill="currentColor" d="M8 5v14l11-7L8 5Z" />
  </svg>
)
const ChevDown= () => <SI d="M6 9l6 6 6-6" />
const Bookmark= ({ filled }: { filled?: boolean }) => filled ? (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1Z" /></svg>
) : <SI d="M19 21l-7-4-7 4V4a1 1 0 011-1h12a1 1 0 011 1v17z" />
const VerifiedShield = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <path fill="#0E8F6E" d="M12 2 4 5.5v5c0 5.2 3.4 9.6 8 10.5 4.6-.9 8-5.3 8-10.5v-5L12 2Zm-1.2 13.7-3.5-3.5 1.5-1.5 2 2 5-5 1.5 1.5-6.5 6.5Z"/>
  </svg>
)

/* ── Pie chart (pure SVG) ────────────────────────────────────────── */
function PieChart({ slices, size = 220 }: { slices: ServiceShare[]; size?: number }) {
  const total = slices.reduce((s, x) => s + (Number(x.percentage) || 0), 0)
  if (total <= 0) return null
  const cx = size / 2, cy = size / 2, r = size / 2 - 2
  let acc = 0
  const TAU = Math.PI * 2
  const pieces = slices.map((s, i) => {
    const start = acc
    const sweep = (Number(s.percentage) || 0) / Math.max(total, 1) * TAU
    acc += sweep
    const startAngle = -Math.PI / 2 + start
    const endAngle = -Math.PI / 2 + start + sweep
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle),   y2 = cy + r * Math.sin(endAngle)
    const large = sweep > Math.PI ? 1 : 0
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
    return { path, color: PIE_PALETTE[i % PIE_PALETTE.length], name: s.name, percentage: s.percentage }
  })
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Service breakdown">
      {pieces.map((p, i) => <path key={i} d={p.path} fill={p.color} stroke="#fff" strokeWidth={1.2}><title>{p.name}: {p.percentage}%</title></path>)}
    </svg>
  )
}

/* ── Range bar for "Most Common Project Size" ──────────────────── */
const PROJECT_SIZE_BUCKETS = [
  { label: '< $10,000',         match: /(under|<).*10[,.]?000|<\s*\$?10/i },
  { label: '$10,000 - $49,999', match: /10[,.]?000.*49[,.]?999/i },
  { label: '$50,000 - $199,999', match: /50[,.]?000.*199[,.]?999/i },
  { label: '> $200,000',        match: /200[,.]?000\+|>\s*\$?200/i },
]
function ProjectSizeBar({ value }: { value: string | null }) {
  const idx = useMemo(() => {
    if (!value) return -1
    for (let i = 0; i < PROJECT_SIZE_BUCKETS.length; i++) {
      if (PROJECT_SIZE_BUCKETS[i].match.test(value)) return i
    }
    return -1
  }, [value])
  /* "Custom" fallback — when the company's stated project size doesn't fit
     any of the four standard buckets (e.g. "Contact us", "₹15,000",
     "Enterprise"), show a single full-width custom cell instead of a row
     of empty buckets that read as "no data". */
  if (idx === -1 && value) {
    return (
      <div className="cmp-range cmp-range--custom">
        <div className="cmp-range-cell is-on">
          <span>Custom — {value}</span>
        </div>
      </div>
    )
  }
  return (
    <div className="cmp-range">
      {PROJECT_SIZE_BUCKETS.map((b, i) => (
        <div key={b.label} className={'cmp-range-cell' + (i === idx ? ' is-on' : '')} title={b.label}>
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Stars row ──────────────────────────────────────────────────── */
function Stars({ value, max = 5 }: { value: number; max?: number }) {
  const rounded = Math.max(0, Math.min(max, Math.round(value || 0)))
  return (
    <span className="cmp-stars" aria-label={`${value.toFixed(1)} out of ${max}`}>
      {Array.from({ length: max }, (_, i) =>
        <span key={i} className={i < rounded ? 'cmp-star is-on' : 'cmp-star'}>{i < rounded ? STAR_FULL : STAR_EMPTY}</span>
      )}
    </span>
  )
}

/* ── Component ──────────────────────────────────────────────────── */
interface Props {
  slug?: string
  initialData?: InitialData
}

export default function CompanyDetailPage({ slug: propSlug, initialData }: Props) {
  if (!initialData) return null
  const c = initialData.company as unknown as CompanyData
  const products = (initialData.products as unknown as ProductRow[]) || []
  const similarCompanies = (initialData.similarCompanies as unknown as SimilarCompanyRow[]) || []
  const popularTools = (initialData.popularTools as unknown as PopularToolRow[]) || []
  const relatedCategories = (initialData.relatedCategories as unknown as RelatedCategoryRow[]) || []
  const initialEngagement = initialData.engagement || { followers: 0, bookmarks: 0 }
  const reviewsData = initialData.reviews || { avgRating: 0, reviewCount: 0, recent: [] }

  const slug = c.slug || propSlug || ''
  const headerTags = useMemo(() => parseJsonArr(c.header_tags) as string[], [c.header_tags])
  const awards     = useMemo(() => (parseJsonArr(c.awards) as Award[]).filter(a => a && a.name), [c.awards])
  const industries = useMemo(() => parseJsonArr(c.industries_served) as string[], [c.industries_served])
  const sizes      = useMemo(() => parseJsonArr(c.target_company_sizes) as string[], [c.target_company_sizes])
  const languages  = useMemo(() => parseJsonArr(c.languages) as string[], [c.languages])
  const timezones  = useMemo(() => parseJsonArr(c.timezones) as string[], [c.timezones])
  const services   = useMemo(() => (parseJsonArr(c.service_lines) as ServiceShare[]).filter(s => s && s.name), [c.service_lines])
  const focus      = useMemo(() => (parseJsonArr(c.focus_breakdown) as ServiceShare[]).filter(s => s && s.name), [c.focus_breakdown])
  const clients    = useMemo(() => (parseJsonArr(c.client_logos) as ClientLogo[]).filter(cl => cl && cl.name), [c.client_logos])

  const isVerified = Boolean(Number(c.verified ?? 0))
  const accent = c.category_color || '#E8553D'
  const accentSoft = hexA(accent, 0.06)
  const accentBorder = hexA(accent, 0.22)
  const websiteHost = websiteHostOf(c.website)
  const fallbackLogo = clearbitFavicon(c.website, 256)

  /* Description: split paragraphs + Read more toggle for long bodies. */
  const paragraphs = useMemo(
    () => (c.description || '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean),
    [c.description]
  )
  const isLongDescription = (c.description || '').length > 320
  const [expandedDesc, setExpandedDesc] = useState(false)

  /* Tab state for the right-side widget. Hide tabs with no data entirely
     so the user never sees a row of greyed-out clickable nothing. The
     widget itself hides when zero tabs have content. */
  type TabKey = 'services' | 'focus' | 'industries' | 'clients'
  const allTabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'services',   label: 'Services',   count: services.length },
    { key: 'focus',      label: 'Focus',      count: focus.length },
    { key: 'industries', label: 'Industries', count: industries.length },
    { key: 'clients',    label: 'Clients',    count: clients.length },
  ]
  const visibleTabs = allTabs.filter(t => t.count > 0)
  const [activeTab, setActiveTab] = useState<TabKey>(visibleTabs[0]?.key || 'services')

  /* Pricing-snapshot service filter pills. "All" → show stat cards as-is.
     Selecting a service narrows the displayed copy below the cards. */
  const [activeServicePill, setActiveServicePill] = useState<string>('All')

  /* Engagement state — hydrated from /api/listings/[slug]/me on mount. */
  const [me, setMe] = useState<MeState>(ANON_ME)
  const [followerCount, setFollowerCount] = useState(initialEngagement.followers)
  const [bookmarkCount, setBookmarkCount] = useState(initialEngagement.bookmarks)
  const [contactOpen, setContactOpen] = useState(false)
  const [leadOpen, setLeadOpen] = useState(false)
  /* Auth gate — when an anon user clicks Follow / Bookmark we open the
     site-wide SignupModal with nextUrl pointing back at this page so they
     land here after signing in. We also remember which action was
     pending so we can re-fire it on the user's behalf right after the
     /me re-fetch resolves authed state — no need for them to click twice. */
  const [signupOpen, setSignupOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<null | 'follow' | 'bookmark' | 'contact'>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    fetch(`/api/listings/${slug}/me`, { credentials: 'same-origin' })
      .then(r => r.ok ? r.json() : null)
      .then((j) => {
        if (cancelled || !j) return
        setMe({
          isAuthed: !!j.isAuthed,
          isFollowing: !!j.isFollowing,
          isBookmarked: !!j.isBookmarked,
          hasReviewed: !!j.hasReviewed,
        })
      })
      .catch(() => { /* anon — leave defaults */ })
    return () => { cancelled = true }
  }, [slug])

  const cssVars: React.CSSProperties = {
    ['--cmp-accent' as string]: accent,
    ['--cmp-accent-soft' as string]: accentSoft,
    ['--cmp-accent-border' as string]: accentBorder,
  }

  /* ── Engagement actions: optimistic toggle + rollback on failure.
        Anon → opens SignupModal (auth gate) + remembers the action so it
        re-fires right after auth completes. Authed → mutates the row. ── */
  async function toggleFollow() {
    if (!me.isAuthed) { setPendingAction('follow'); setSignupOpen(true); return }
    const next = !me.isFollowing
    setMe(p => ({ ...p, isFollowing: next }))
    setFollowerCount(c => c + (next ? 1 : -1))
    try {
      const r = await fetch(`/api/listings/${slug}/follow`, {
        method: next ? 'POST' : 'DELETE', credentials: 'same-origin',
      })
      if (!r.ok) throw new Error('failed')
    } catch {
      setMe(p => ({ ...p, isFollowing: !next }))
      setFollowerCount(c => c + (next ? -1 : 1))
    }
  }
  async function toggleBookmark() {
    if (!me.isAuthed) { setPendingAction('bookmark'); setSignupOpen(true); return }
    const next = !me.isBookmarked
    setMe(p => ({ ...p, isBookmarked: next }))
    setBookmarkCount(c => c + (next ? 1 : -1))
    try {
      const r = await fetch(`/api/listings/${slug}/bookmark`, {
        method: next ? 'POST' : 'DELETE', credentials: 'same-origin',
      })
      if (!r.ok) throw new Error('failed')
    } catch {
      setMe(p => ({ ...p, isBookmarked: !next }))
      setBookmarkCount(c => c + (next ? -1 : 1))
    }
  }

  /* Outside click + Escape closes the Contact menu. Without these the
     menu sits open until a second click on the trigger — common UX
     complaint for stand-alone dropdowns. */
  useEffect(() => {
    if (!contactOpen) return
    const onDoc = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target && !target.closest?.('.cmp-contact-wrap')) setContactOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setContactOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [contactOpen])

  /* "Rating for cost" — derived from review aggregate when present, else
     a quiet placeholder. We don't fake a number when there's no data. */
  const ratingForCost = reviewsData.reviewCount > 0 ? reviewsData.avgRating : null

  /* ── RENDER ──────────────────────────────────────────────────────── */
  return (
    <main className="cmp-root" style={cssVars}>

      {/* ════════════════════════════════════════════════════════════
          1. STICKY HEAD
          ════════════════════════════════════════════════════════════ */}
      <section className="cmp-head">
        <div className="cmp-head-inner">

          <button
            type="button"
            className={'cmp-shortlist' + (me.isBookmarked ? ' is-on' : '')}
            onClick={toggleBookmark}
            aria-label={me.isBookmarked ? 'Remove from shortlist' : 'Add to shortlist'}
            title={me.isBookmarked ? 'Saved to your shortlist' : 'Save to shortlist'}
          >
            <Bookmark filled={me.isBookmarked} />
            <span>{me.isBookmarked ? 'Saved' : 'Add to Shortlist'}</span>
          </button>

          <div className="cmp-head-grid">
            {/* Logo */}
            <div className="cmp-head-logo">
              {(c.logo_url || fallbackLogo) ? (
                <img src={c.logo_url || fallbackLogo} alt={`${c.company_name} logo`} />
              ) : (
                <span>{initialsOf(c.company_name)}</span>
              )}
            </div>

            {/* Identity column */}
            <div className="cmp-head-body">
              <h1 className="cmp-head-name">
                {c.company_name}
                {isVerified && (
                  <span className="cmp-head-verified" title="Premier Verified by InfoWebWorld">
                    <VerifiedShield size={14} />
                    Premier Verified
                  </span>
                )}
              </h1>

              <div className="cmp-head-meta">
                {reviewsData.reviewCount > 0 ? (
                  <span className="cmp-head-rating">
                    <Stars value={reviewsData.avgRating} />
                    <a href="#reviews" className="cmp-head-rating-count">
                      {reviewsData.reviewCount} {reviewsData.reviewCount === 1 ? 'review' : 'reviews'}
                    </a>
                  </span>
                ) : (
                  /* No-review state — single muted link instead of 5 dead
                     outline stars (which read as "broken / unrated"). */
                  <a href="#reviews" className="cmp-head-rating-empty">
                    Be the first to review →
                  </a>
                )}

                {awards.length > 0 && (
                  <span className="cmp-head-awards">
                    {awards.slice(0, 4).map((a, i) => (
                      <span
                        key={i}
                        className="cmp-head-award"
                        title={a.year ? `${a.name} (${a.year})` : a.name}
                        aria-label={a.year ? `${a.name} ${a.year}` : a.name}
                      >
                        <Trophy />
                      </span>
                    ))}
                    {awards.length > 4 && (
                      <span className="cmp-head-award-more">+{awards.length - 4}</span>
                    )}
                  </span>
                )}

                {followerCount > 0 && (
                  <span className="cmp-head-network">
                    <PeopleSm />
                    <strong>{followerCount}</strong> {followerCount === 1 ? 'connection' : 'connections'} joined
                  </span>
                )}
              </div>

              {headerTags.length > 0 && (
                <div className="cmp-head-tags">
                  {headerTags.slice(0, 5).map(t => (
                    <span key={t} className="cmp-head-tag">{t}</span>
                  ))}
                  {headerTags.length > 5 && (
                    <span className="cmp-head-tag cmp-head-tag--more" title={headerTags.slice(5).join(', ')}>
                      +{headerTags.length - 5}
                    </span>
                  )}
                </div>
              )}

              {/* CTAs */}
              <div className="cmp-head-cta">
                {c.website && (
                  <a
                    href={withInfoWebWorldUtm(c.website, slug, 'profile')}
                    target="_blank" rel="noopener noreferrer"
                    className="cmp-btn cmp-btn--primary"
                    onClick={() => trackWebsiteClick(slug, 'profile')}
                  >
                    Visit Website
                  </a>
                )}

                {/* Contact CTA — single button. Opens LeadFormModal which
                    requires login (anon → SignupModal first via the modal's
                    requireAuth gate). The previous mailto/tel links exposed
                    raw contact info to anyone; gating it captures the lead
                    request as an attributable record before revealing the
                    contact details. */}
                <button
                  type="button"
                  className="cmp-btn cmp-btn--outline"
                  onClick={() => setLeadOpen(true)}
                >
                  <Mail /> Contact
                </button>

                <button
                  type="button"
                  className={'cmp-btn cmp-btn--outline cmp-network-btn' + (me.isFollowing ? ' is-on' : '')}
                  onClick={toggleFollow}
                >
                  {me.isFollowing ? <Check /> : <Plus />}
                  {me.isFollowing ? 'Following' : 'Join their Network'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          2. MAIN — left: tagline + about + stats; right: tabbed widget
          ════════════════════════════════════════════════════════════ */}
      <section className="cmp-main">
        <div className="cmp-main-inner">
          <div className="cmp-main-grid">

            {/* LEFT: tagline + description + Watch Video + stats */}
            <div className="cmp-main-left">
              {c.tagline && (
                <h2 className="cmp-tagline">{c.tagline}</h2>
              )}

              {paragraphs.length > 0 && (
                <div className={'cmp-desc' + (isLongDescription && !expandedDesc ? ' is-collapsed' : '')}>
                  {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                  {isLongDescription && (
                    <button type="button" className="cmp-readmore" onClick={() => setExpandedDesc(e => !e)}>
                      {expandedDesc ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}

              {c.intro_video_url && (
                <a
                  href={c.intro_video_url}
                  target="_blank" rel="noopener noreferrer"
                  className="cmp-watch"
                >
                  <span className="cmp-watch-ico"><Play /></span>
                  Watch our Video
                </a>
              )}

              {/* Stats grid — 2 columns of compact rows */}
              <div className="cmp-stats">
                {c.min_project_size && (
                  <div className="cmp-stat">
                    <span className="cmp-stat-lbl">Min project size</span>
                    <span className="cmp-stat-val">{c.min_project_size}</span>
                  </div>
                )}
                {c.hourly_rate && (
                  <div className="cmp-stat">
                    <span className="cmp-stat-lbl">Hourly rate</span>
                    <span className="cmp-stat-val">{c.hourly_rate}</span>
                  </div>
                )}
                {c.team_size && (
                  <div className="cmp-stat">
                    <span className="cmp-stat-lbl">Employees</span>
                    <span className="cmp-stat-val"><Users /> {c.team_size}</span>
                  </div>
                )}
                {(c.city || c.state || c.country_name || c.hq_location) && (
                  <div className="cmp-stat">
                    <span className="cmp-stat-lbl">Locations</span>
                    <span className="cmp-stat-val"><MapPin /> {[c.city, c.state, c.country_name].filter(Boolean).join(', ') || c.hq_location}</span>
                  </div>
                )}
                {c.founded_year && (
                  <div className="cmp-stat">
                    <span className="cmp-stat-lbl">Year founded</span>
                    <span className="cmp-stat-val"><Calendar /> Founded {c.founded_year}</span>
                  </div>
                )}
                {languages.length > 0 && (
                  <div className="cmp-stat" title={languages.join(', ')}>
                    <span className="cmp-stat-lbl">Languages</span>
                    <span className="cmp-stat-val"><Globe /> {languages.length} {languages.length === 1 ? 'Language' : 'Languages'}</span>
                  </div>
                )}
                {timezones.length > 0 && (
                  <div className="cmp-stat" title={timezones.join(', ')}>
                    <span className="cmp-stat-lbl">Timezones</span>
                    <span className="cmp-stat-val"><Calendar /> {timezones.length} {timezones.length === 1 ? 'Timezone' : 'Timezones'}</span>
                  </div>
                )}
                {Number(c.is_hiring) === 1 && (
                  <div className="cmp-stat cmp-stat--hiring">
                    <span className="cmp-stat-lbl">Status</span>
                    <span className="cmp-stat-val"><Spark /> We&rsquo;re hiring</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: tabbed widget — only renders when at least one tab
                has data; otherwise the right column collapses entirely
                and the left column gets the full width on the next render
                via CSS (cmp-main-grid:has(:only-child)). */}
            {visibleTabs.length > 0 && (
            <aside className="cmp-tabwidget">
              <div
                className="cmp-tabs"
                role="tablist"
                style={{ gridTemplateColumns: `repeat(${visibleTabs.length}, 1fr)` }}
              >
                {visibleTabs.map(t => (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={activeTab === t.key}
                    aria-controls={`cmp-panel-${t.key}`}
                    className={'cmp-tab' + (activeTab === t.key ? ' is-on' : '')}
                    onClick={() => setActiveTab(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="cmp-tabpanel" role="tabpanel" id={`cmp-panel-${activeTab}`}>
                {activeTab === 'services' && (
                  services.length > 0 ? (
                    <div className="cmp-pie-row">
                      <PieChart slices={services} />
                      <div className="cmp-pie-legend">
                        <div className="cmp-pie-legend-title">Service Lines</div>
                        {services.map((s, i) => (
                          <div key={i} className="cmp-pie-legend-row">
                            <span className="cmp-pie-dot" style={{ background: PIE_PALETTE[i % PIE_PALETTE.length] }} />
                            <span className="cmp-pie-legend-name">{s.name}</span>
                            <span className="cmp-pie-legend-pct">{s.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : <EmptyTab label="services" />
                )}
                {activeTab === 'focus' && (
                  focus.length > 0 ? (
                    <div className="cmp-pie-row">
                      <PieChart slices={focus} />
                      <div className="cmp-pie-legend">
                        <div className="cmp-pie-legend-title">Client Focus</div>
                        {focus.map((s, i) => (
                          <div key={i} className="cmp-pie-legend-row">
                            <span className="cmp-pie-dot" style={{ background: PIE_PALETTE[i % PIE_PALETTE.length] }} />
                            <span className="cmp-pie-legend-name">{s.name}</span>
                            <span className="cmp-pie-legend-pct">{s.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : <EmptyTab label="focus areas" />
                )}
                {activeTab === 'industries' && (
                  industries.length > 0 ? (
                    <div className="cmp-tab-list">
                      <div className="cmp-tab-list-title">Industries Served</div>
                      <div className="cmp-tab-chips">
                        {industries.map((ind, i) => (
                          <span key={ind + i} className="cmp-tab-chip">{ind}</span>
                        ))}
                      </div>
                    </div>
                  ) : <EmptyTab label="industries" />
                )}
                {activeTab === 'clients' && (
                  clients.length > 0 ? (
                    <div className="cmp-clients-grid">
                      {clients.map((cl, i) => {
                        const logo = cl.logoUrl || (cl.url ? clearbitFavicon(cl.url, 128) : '')
                        const inner = (
                          <>
                            {logo ? <img src={logo} alt={`${cl.name} logo`} /> : <span>{initialsOf(cl.name)}</span>}
                            <span className="cmp-client-name">{cl.name}</span>
                          </>
                        )
                        return cl.url ? (
                          <a key={cl.name + i} href={cl.url} target="_blank" rel="noopener noreferrer" className="cmp-client">{inner}</a>
                        ) : <div key={cl.name + i} className="cmp-client">{inner}</div>
                      })}
                    </div>
                  ) : <EmptyTab label="clients" />
                )}
              </div>
            </aside>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          3. PRICING SNAPSHOT — three colored cards + clients say + range bar
          ════════════════════════════════════════════════════════════ */}
      {(c.min_project_size || c.hourly_rate || ratingForCost != null || c.common_project_size || c.clients_summary) && (
        <section className="cmp-snap">
          <div className="cmp-snap-inner">
            <div className="cmp-snap-card">
              <header className="cmp-snap-head">
                <h2 className="cmp-snap-title">Pricing Snapshot</h2>
              </header>

              <div className="cmp-snap-grid">
                {/* LEFT column: stat cards + clients say */}
                <div className="cmp-snap-left">
                  <div className="cmp-snap-stats">
                    {c.min_project_size && (
                      <div className="cmp-snap-stat cmp-snap-stat--min">
                        <span className="cmp-snap-stat-lbl">Min. project size</span>
                        <span className="cmp-snap-stat-val">{c.min_project_size}</span>
                      </div>
                    )}
                    {c.hourly_rate && (
                      <div className="cmp-snap-stat cmp-snap-stat--rate">
                        <span className="cmp-snap-stat-lbl">Avg. hourly rate</span>
                        <span className="cmp-snap-stat-val">{c.hourly_rate}</span>
                      </div>
                    )}
                    {ratingForCost != null && (
                      <div className="cmp-snap-stat cmp-snap-stat--rating">
                        <span className="cmp-snap-stat-lbl">Rating for cost</span>
                        <span className="cmp-snap-stat-val">{ratingForCost.toFixed(1)} <small>/ 5</small></span>
                      </div>
                    )}
                  </div>

                  {c.clients_summary && (
                    <div className="cmp-snap-says">
                      <h3 className="cmp-snap-says-title">What Clients Have Said</h3>
                      <p className="cmp-snap-says-body">{c.clients_summary}</p>
                      {reviewsData.reviewCount > 0 && (
                        <p className="cmp-snap-says-foot">This summary is based on {reviewsData.reviewCount} verified InfoWebWorld {reviewsData.reviewCount === 1 ? 'review' : 'reviews'}.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* RIGHT column: most common project size + service pills */}
                <div className="cmp-snap-right">
                  {c.common_project_size && (
                    <div className="cmp-snap-common">
                      <h3 className="cmp-snap-common-title">
                        <span className="cmp-snap-common-ico" aria-hidden="true">●</span>
                        Most Common Project Size
                      </h3>
                      <div className="cmp-snap-common-val">
                        {c.common_project_size}
                        {reviewsData.reviewCount > 0 && (
                          <span className="cmp-snap-common-meta"> based on {reviewsData.reviewCount} {reviewsData.reviewCount === 1 ? 'review' : 'reviews'}</span>
                        )}
                      </div>
                      <ProjectSizeBar value={c.common_project_size} />
                    </div>
                  )}

                  {services.length > 0 && (
                    <div className="cmp-snap-pills">
                      <div className="cmp-snap-pills-title">Select a service to see pricing information <span className="cmp-snap-pills-hint" title="Pricing varies by service">ⓘ</span></div>
                      <div className="cmp-snap-pills-row">
                        <button type="button" className={'cmp-snap-pill' + (activeServicePill === 'All' ? ' is-on' : '')} onClick={() => setActiveServicePill('All')}>All</button>
                        {services.map((s, i) => (
                          <button
                            key={s.name + i}
                            type="button"
                            className={'cmp-snap-pill' + (activeServicePill === s.name ? ' is-on' : '')}
                            onClick={() => setActiveServicePill(s.name)}
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          4. PORTFOLIO — Products by us. Carry-over from previous design.
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
                const pLogo = p.logo_url || ''
                return (
                  <a
                    key={p.id}
                    href={`/listing/${p.slug}`}
                    className="cmp-portfolio-card"
                  >
                    <div className="cmp-pf-card-top">
                      <div className="cmp-pf-card-logo">
                        {pLogo
                          ? <img src={pLogo} alt={`${p.company_name} logo`} />
                          : <span>{initialsOf(p.company_name)}</span>}
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
                      ) : <span />}
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
          5-8. CROSS-MARKETING — wrapped in .tlp-main so the tlp-* CSS
          (scoped under .tlp-main in test-listing-page.css) applies
          and the four sections render identical to /company/[slug].
          ════════════════════════════════════════════════════════════ */}
      {(similarCompanies.length > 0 || popularTools.length > 0 || relatedCategories.length > 0) && (
        <div className="cmp-tlp-bridge tlp-main">
          <div className="tlp-wrap">

            {/* ── ALTERNATIVES — same as "Gemini AI alternatives" on the
                product page (tlp-alt-grid 4-up rich cards). ── */}
            {similarCompanies.length > 0 && (
              <section id="alternatives" className="tlp-sec">
                <h2 className="tlp-sec-title">{c.company_name} alternatives</h2>
                <div className="tlp-alt-grid">
                  {similarCompanies.slice(0, 4).map(s => {
                    const sLogo = s.logo_url || ''
                    const priceNum = s.min_project_size
                      ? String(s.min_project_size).replace(/[^\d.]/g, '')
                      : ''
                    return (
                      <div key={s.id} className="tlp-alt">
                        <div className="tlp-alt-head">
                          {sLogo
                            ? <img src={sLogo} alt={`${s.company_name} logo`} className="tlp-alt-logo" />
                            : <span className="tlp-alt-logo tlp-alt-logo--letter" aria-hidden="true">{initialsOf(s.company_name)}</span>}
                          <div className="tlp-alt-head-right">
                            <div className="tlp-alt-name">{s.company_name}</div>
                            {s.category_name && <div className="tlp-alt-sub">{s.category_name}</div>}
                          </div>
                        </div>

                        <a href={`/profile/${s.slug}`} className="tlp-alt-cta">Learn More</a>

                        <div className="tlp-alt-price-block">
                          <div className="tlp-alt-price-head">
                            <span>Starting from</span>
                            <span className="tlp-info-ico"><InfoIcon /></span>
                          </div>
                          {priceNum ? (
                            <div className="tlp-alt-price">
                              <span className="tlp-alt-price-sym">$</span>
                              <span className="tlp-alt-price-num">{priceNum}</span>
                            </div>
                          ) : (
                            <div className="tlp-alt-price tlp-alt-price--none">
                              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                                <circle cx="12" cy="12" r="9" fill="none" stroke="#D1D5DB" strokeWidth="1.8" />
                                <path d="M12 7v5l3 3" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
                              </svg>
                            </div>
                          )}
                          <div className="tlp-alt-period">
                            {s.hourly_rate || (priceNum ? 'min project' : 'Pricing not shared')}
                          </div>
                        </div>

                        {s.tagline && <p className="tlp-alt-tagline">{s.tagline}</p>}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* ── POPULAR COMPARISONS — same as the product page (logo
                bracket logo + name vs name pairings, 3×3 grid). ── */}
            {similarCompanies.length > 0 && (
              <section id="compare" className="tlp-sec">
                <h2 className="tlp-sec-title">Popular comparisons with {c.company_name}</h2>
                <div className="tlp-cmp-grid">
                  {similarCompanies.slice(0, 9).map(s => {
                    const sLogo = s.logo_url || ''
                    return (
                      <a key={s.id} href={`/profile/${s.slug}`} className="tlp-cmp">
                        <div className="tlp-cmp-row">
                          {c.logo_url
                            ? <img src={c.logo_url} alt={c.company_name} className="tlp-cmp-logo" />
                            : <span className="tlp-cmp-logo tlp-cmp-letter">{initialsOf(c.company_name)}</span>}
                          <span className="tlp-cmp-bracket"><BracketIcon /></span>
                          {sLogo
                            ? <img src={sLogo} alt={s.company_name} className="tlp-cmp-logo" />
                            : <span className="tlp-cmp-logo tlp-cmp-letter">{initialsOf(s.company_name)}</span>}
                        </div>
                        <div className="tlp-cmp-row tlp-cmp-names">
                          <span className="tlp-cmp-name tlp-cmp-name--muted">{c.company_name}</span>
                          <span className="tlp-cmp-vs">vs</span>
                          <span className="tlp-cmp-name">{s.company_name}</span>
                        </div>
                      </a>
                    )
                  })}
                </div>
                <div className="tlp-cmp-more-wrap">
                  <a href="#alternatives" className="tlp-cmp-browse">Browse Alternatives</a>
                </div>
              </section>
            )}

            {/* ── CUSTOMERS ALSO VIEWED — products from other companies
                in the same sector. Mirrors the product page section
                (tlp-cav-sec / tlp-sib-grid real-mode card layout). ── */}
            {popularTools.length > 0 && (
              <section className="tlp-sec tlp-cav-sec">
                <div className="tlp-cav-head">
                  <h2 className="tlp-sec-title">Customers also viewed</h2>
                  <p className="tlp-cav-sub">Popular tools that businesses choose alongside {c.company_name}</p>
                </div>
                <div className="tlp-sib-grid">
                  {popularTools.slice(0, 8).map(t => {
                    const tLogo = t.logo_url || ''
                    return (
                      <a key={t.id} href={`/listing/${t.slug}`} className="tlp-sib-card">
                        <div className="tlp-sib-head">
                          {tLogo
                            ? <img src={tLogo} alt={`${t.company_name} logo`} className="tlp-sib-logo" />
                            : <span className="tlp-sib-letter">{initialsOf(t.company_name)}</span>}
                          <div className="tlp-sib-id">
                            <div className="tlp-sib-name">{t.company_name}</div>
                            {t.category_name && <div className="tlp-sib-cat">{t.category_name}</div>}
                          </div>
                        </div>
                        {t.tagline && <p className="tlp-sib-tagline">{t.tagline}</p>}
                        <div className="tlp-sib-foot">
                          {t.starting_price ? (
                            <span className="tlp-sib-price">From ${t.starting_price}{t.starting_price_period ? ` ${t.starting_price_period}` : ''}</span>
                          ) : <span />}
                          <span className="tlp-sib-cta">View →</span>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </section>
            )}

            {/* ── RELATED CATEGORIES — folder-icon grid, exactly like
                the product page bottom section. ── */}
            {relatedCategories.length > 0 && (
              <section className="tlp-sec tlp-rc-sec">
                <h2 className="tlp-sec-title tlp-rc-title">
                  <span className="tlp-rc-accent" aria-hidden="true" />
                  Related categories
                </h2>
                <div className="tlp-rc-grid">
                  {relatedCategories.map(rc => (
                    <a key={rc.id} href={`/${rc.slug}`} className="tlp-rc">
                      <span className="tlp-rc-icon"><FolderIcon /></span>
                      <span className="tlp-rc-lbl">{rc.name}</span>
                    </a>
                  ))}
                </div>
              </section>
            )}

          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          8. CONNECT — single block, no card chrome
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
                href={withInfoWebWorldUtm(c.website, slug, 'profile')}
                target="_blank" rel="noopener noreferrer"
                className="cmp-btn cmp-btn--outline"
                onClick={() => trackWebsiteClick(slug, 'profile')}
              >
                <Globe /> {websiteHost || 'Visit website'}
              </a>
            )}
          </div>
          <div className="cmp-connect-meta">
            {/* Direct mailto/tel removed — contact info is gated behind the
                lead form which requires login. Visitors get the email and
                phone after submitting a request, attributed to InfoWebWorld
                as the lead source. Socials stay public — they're already
                public on the company's own site. */}
            {(c.email || c.phone) && (
              <button type="button" className="cmp-connect-meta-link" onClick={() => setLeadOpen(true)} style={{ background: 'transparent', border: 0, cursor: 'pointer' }}>
                <Mail /> Request email &amp; phone
              </button>
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
        requireAuth
        isAuthed={me.isAuthed}
        onRequireAuth={() => { setPendingAction('contact'); setSignupOpen(true) }}
        listingContact={{
          email: c.email || undefined,
          phone: c.phone || undefined,
          phoneCode: c.phone_code || undefined,
        }}
      />

      {/* Auth gate when an anon user clicks Follow / Bookmark — site-wide
          SignupModal w/ nextUrl pointing back at this page so they land
          here after signing in. onSuccess re-hydrates /me state in-place
          (no full page reload) so engagement counts and follow/bookmark
          state update instantly without losing scroll position. */}
      <SignupModal
        open={signupOpen}
        onClose={() => { setSignupOpen(false); setPendingAction(null) }}
        nextUrl={`/profile/${slug}`}
        initialMode="signup"
        onSuccess={async () => {
          setSignupOpen(false)
          /* Re-hydrate /me state in-place (no full reload), then auto-fire
             the original Follow / Bookmark action the user clicked before
             the gate. Saves them a second click after signing in. */
          try {
            const r = await fetch(`/api/listings/${slug}/me`, { credentials: 'same-origin' })
            if (r.ok) {
              const j = await r.json()
              const nextMe: MeState = {
                isAuthed: !!j.isAuthed,
                isFollowing: !!j.isFollowing,
                isBookmarked: !!j.isBookmarked,
                hasReviewed: !!j.hasReviewed,
              }
              setMe(nextMe)
              if (nextMe.isAuthed && pendingAction === 'follow' && !nextMe.isFollowing) {
                setMe(p => ({ ...p, isFollowing: true }))
                setFollowerCount(c => c + 1)
                fetch(`/api/listings/${slug}/follow`, { method: 'POST', credentials: 'same-origin' })
                  .catch(() => { setMe(p => ({ ...p, isFollowing: false })); setFollowerCount(c => c - 1) })
              } else if (nextMe.isAuthed && pendingAction === 'bookmark' && !nextMe.isBookmarked) {
                setMe(p => ({ ...p, isBookmarked: true }))
                setBookmarkCount(c => c + 1)
                fetch(`/api/listings/${slug}/bookmark`, { method: 'POST', credentials: 'same-origin' })
                  .catch(() => { setMe(p => ({ ...p, isBookmarked: false })); setBookmarkCount(c => c - 1) })
              } else if (nextMe.isAuthed && pendingAction === 'contact') {
                /* Re-open the lead form now that the user is authed —
                   they came in via the auth gate and we don't want them
                   to re-find the Contact button. */
                setLeadOpen(true)
              }
            }
          } catch { /* ignore — modal already closed */ }
          setPendingAction(null)
        }}
      />
    </main>
  )
}

/* ── Empty-state for tab panels with no data ─────────────────────── */
function EmptyTab({ label }: { label: string }) {
  return (
    <div className="cmp-tab-empty">
      <span>No {label} listed yet.</span>
    </div>
  )
}
