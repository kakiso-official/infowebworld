'use client'

/* Company-profile styles — split per page section under styles/company/.
   THE IMPORT ORDER BELOW IS THE CASCADE ORDER — keep it. The reused
   .tlp-* listing-card styles load last (unchanged from before). */
import '../styles/company/tokens.css'
import '../styles/company/buttons.css'
import '../styles/company/head.css'
import '../styles/company/main.css'
import '../styles/company/tab-widget.css'
import '../styles/company/pricing-snapshot.css'
import '../styles/company/section.css'
import '../styles/company/portfolio.css'
import '../styles/company/connect.css'
import '../styles/company/tlp-bridge.css'
import '../styles/company/similar-companies.css'
import '../styles/company/popular-tools.css'
import '../styles/company/versus.css'
import '../styles/company/video.css'
import '../styles/company/awards.css'
import '../styles/company/reviews.css'
import '../styles/company/responsive-mobile.css'
import '../styles/company/breadcrumb.css'
import '../styles/company/pricing-snapshot-hero.css'
import '../styles/test-listing-page.css'
import '../styles/claim-modal.css'

import { useEffect, useMemo, useRef, useState } from 'react'
import LeadFormModal from '../listing/LeadFormModal'
import SignupModal from '../components/auth/SignupModal'
import ClaimListingModal from '../listing/ClaimListingModal'
import { withInfoWebWorldUtm } from '../lib/utm'
import { trackWebsiteClick } from '../lib/track-website-click'
import { listingOutboundRel } from '@/lib/user-plan-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGlobe, faLocationDot, faUsers, faUserGroup, faCalendarDays, faEnvelope,
  faArrowRight, faPlus, faCheck, faTrophy, faCircleInfo, faFolderOpen,
  faRightLeft, faUserPlus, faClock, faSackDollar, faScaleBalanced, faPlay, faBookmark,
  faCircleCheck, faMedal, faTags, faStar, faHouse, faChevronRight, faChevronDown, faPenToSquare,
  faComments, faBoxOpen, faPaperPlane, faCodeCompare, faEye, faLayerGroup, faQuoteLeft, faMoneyBillWave, faBriefcase,
} from '@fortawesome/free-solid-svg-icons'
import { faLinkedinIn, faXTwitter, faFacebookF } from '@fortawesome/free-brands-svg-icons'

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

   CSS namespace: cmp-* (split per section in app/styles/company/*.css,
   imported in cascade order at the top of this file).
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
  user_id?: number | null
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
  backlink_status?: string | null
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
  breadcrumb?: { name: string; slug: string }[]
  products: Record<string, unknown>[]
  similarCompanies?: Record<string, unknown>[]
  popularTools?: Record<string, unknown>[]
  relatedCategories?: Record<string, unknown>[]
  engagement?: { followers: number; bookmarks: number }
  reviews?: { avgRating: number; reviewCount: number; distribution?: number[]; recent: Record<string, unknown>[] }
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

/* Awards: show this many up front; the rest sit behind "View all". */
const AWARDS_VISIBLE = 8

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

/* Stars render Font Awesome faStar — see the <Stars> component. */

/* ── Icon set — Font Awesome only (solid + brands). Thin wrappers keep the
   original call sites (<Globe/>, <MapPin/>, …) unchanged. ──────────── */
const Globe       = () => <FontAwesomeIcon icon={faGlobe} />
const MapPin      = () => <FontAwesomeIcon icon={faLocationDot} />
const Users       = () => <FontAwesomeIcon icon={faUsers} />
const Calendar    = () => <FontAwesomeIcon icon={faCalendarDays} />
const Mail        = () => <FontAwesomeIcon icon={faEnvelope} />
const Linkedin    = () => <FontAwesomeIcon icon={faLinkedinIn} />
const Twitter     = () => <FontAwesomeIcon icon={faXTwitter} />
const Facebook    = () => <FontAwesomeIcon icon={faFacebookF} />
const Arrow       = () => <FontAwesomeIcon icon={faArrowRight} />
const Plus        = () => <FontAwesomeIcon icon={faPlus} />
const Check       = () => <FontAwesomeIcon icon={faCheck} />
const Trophy      = () => <FontAwesomeIcon icon={faTrophy} />
const PeopleSm    = () => <FontAwesomeIcon icon={faUserGroup} />
const InfoIcon    = () => <FontAwesomeIcon icon={faCircleInfo} />
const FolderIcon  = () => <FontAwesomeIcon icon={faFolderOpen} />
const BracketIcon = () => <FontAwesomeIcon icon={faRightLeft} />
const Spark       = () => <FontAwesomeIcon icon={faUserPlus} />
const Play        = () => <FontAwesomeIcon icon={faPlay} />
const Bookmark       = () => <FontAwesomeIcon icon={faBookmark} />
const VerifiedShield = () => <FontAwesomeIcon icon={faCircleCheck} />
const AwardMedal     = () => <FontAwesomeIcon icon={faMedal} />
const PriceTag       = () => <FontAwesomeIcon icon={faTags} />

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

/* ── Stars row ──────────────────────────────────────────────────── */
function Stars({ value, max = 5 }: { value: number; max?: number }) {
  const rounded = Math.max(0, Math.min(max, Math.round(value || 0)))
  return (
    <span className="cmp-stars" aria-label={`${value.toFixed(1)} out of ${max}`}>
      {Array.from({ length: max }, (_, i) =>
        <FontAwesomeIcon key={i} icon={faStar} className={i < rounded ? 'cmp-star is-on' : 'cmp-star'} />
      )}
    </span>
  )
}

/* Fractional star meter — gray track + an accent fill clipped to value/max.
   Drives the reviews summary: the big average AND each histogram row. */
function StarMeter({ value, max = 5 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <span className="cmp-starmeter" role="img" aria-label={`${value.toFixed(1)} out of ${max} stars`}>
      <span className="cmp-starmeter-track" aria-hidden="true">
        {Array.from({ length: max }, (_, i) => <FontAwesomeIcon key={i} icon={faStar} />)}
      </span>
      <span className="cmp-starmeter-fill" aria-hidden="true" style={{ width: `${pct}%` }}>
        {Array.from({ length: max }, (_, i) => <FontAwesomeIcon key={i} icon={faStar} />)}
      </span>
    </span>
  )
}

/* ── Pricing Snapshot helpers — derive a short qualitative tag from the
   free-text pricing values. Each returns '' (caption hidden) when a value
   can't be parsed, so nothing odd ever renders. ──────────────────────── */
function prettyRange(s: string): string {
  return String(s).replace(/\s*[-–—]\s*/g, '–') // "$20 - $50" → "$20–$50"
}
function parseMoney(s: string): number | null {
  const m = String(s).match(/(\d[\d,.]*)\s*([kKmM])?/)
  if (!m) return null
  const n = parseFloat(m[1].replace(/,/g, ''))
  if (isNaN(n)) return null
  const u = (m[2] || '').toLowerCase()
  return u === 'k' ? n * 1_000 : u === 'm' ? n * 1_000_000 : n
}
function minSizeCaption(s: string): string {
  const n = parseMoney(s) // a "minimum" — the first number is the right anchor
  if (n == null) return ''
  if (n < 1_000) return 'Small projects OK'
  if (n < 10_000) return 'SMB-friendly'
  if (n < 50_000) return 'Mid-size projects'
  return 'Enterprise scale'
}
function hourlyCaption(s: string): string {
  const nums = (String(s).match(/\d[\d,.]*/g) || [])
    .map(x => parseFloat(x.replace(/,/g, ''))).filter(n => !isNaN(n))
  if (!nums.length) return ''
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length // midpoint of the range
  if (avg < 25) return 'Budget rates'
  if (avg < 50) return 'Affordable'
  if (avg < 100) return 'Mid-market'
  if (avg < 200) return 'Senior rate'
  return 'Premium'
}
function costRatingCaption(v: number): string {
  if (v >= 4.8) return 'Top-rated value'
  if (v >= 4.5) return 'Excellent value'
  if (v >= 4.0) return 'Great value'
  if (v >= 3.5) return 'Good value'
  if (v >= 2.5) return 'Fair value'
  return ''
}

/* ── Review date — "Mar 2026" compact label ──────────────────────── */
function fmtReviewDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/* ── YouTube id extractor — handles watch / youtu.be / embed / shorts /
      live URL shapes plus a bare ?v= fallback. Returns null for anything
      that isn't a recognisable YouTube link so the caller can fall back to
      a plain outbound link (Vimeo, Loom, self-hosted, …). ───────────── */
function youTubeId(url: string): string | null {
  if (!url) return null
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  )
  if (m) return m[1]
  try {
    const u = new URL(/^https?:\/\//.test(url) ? url : `https://${url}`)
    const v = u.searchParams.get('v')
    if (v && /^[\w-]{11}$/.test(v)) return v
  } catch { /* not a URL */ }
  return null
}

/* ── Inline video — YouTube facade (poster + play, swaps to an iframe on
      click so the heavy YT player never loads until the visitor asks).
      Non-YouTube links degrade to the original outbound "Watch" link. ── */
function VideoEmbed({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false)
  const id = youTubeId(url)

  if (!id) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="cmp-watch">
        <span className="cmp-watch-ico"><Play /></span>
        Watch our Video
      </a>
    )
  }

  return (
    <div className="cmp-video">
      <div className="cmp-video-head">
        <span className="cmp-video-head-ico"><Play /></span>
        Watch our Video
      </div>
      <div className="cmp-video-frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title="Company video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            className="cmp-video-poster"
            onClick={() => setPlaying(true)}
            aria-label="Play video"
            style={{ backgroundImage: `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)` }}
          >
            <span className="cmp-video-play" aria-hidden="true"><FontAwesomeIcon icon={faPlay} /></span>
          </button>
        )}
      </div>
    </div>
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
  const breadcrumb = (initialData.breadcrumb as { name: string; slug: string }[] | undefined) || []
  const initialEngagement = initialData.engagement || { followers: 0, bookmarks: 0 }
  const reviewsData = initialData.reviews || { avgRating: 0, reviewCount: 0, distribution: [0, 0, 0, 0, 0], recent: [] }
  const reviews = (reviewsData.recent as unknown as ReviewRow[]) || []
  const reviewHref = `/write-review?company=${encodeURIComponent(c.slug || propSlug || '')}&mode=company`
  const reviewDist = reviewsData.distribution || [0, 0, 0, 0, 0] // [1★…5★] approved counts
  const reviewMax = Math.max(1, ...reviewDist)                   // longest bar = the biggest bucket

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
  /* Claimable = an unowned (no user_id), unverified company — the seeded
     majority. Drives the "Claim Now" CTA so a real owner can take over the
     profile (instant domain-email OTP, or manual review). */
  const isClaimable = !isVerified && !Number(c.user_id ?? 0)
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
  /* Awards "View all" — extras mount on open and animate in; on close they
     play the exit animation first, then unmount after it finishes. */
  const [awardsOpen, setAwardsOpen] = useState(false)
  const [awardsClosing, setAwardsClosing] = useState(false)
  const awardsTimer = useRef<number | null>(null)
  /* Auth gate — when an anon user clicks Follow / Bookmark we open the
     site-wide SignupModal with nextUrl pointing back at this page so they
     land here after signing in. We also remember which action was
     pending so we can re-fire it on the user's behalf right after the
     /me re-fetch resolves authed state — no need for them to click twice. */
  const [signupOpen, setSignupOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<null | 'follow' | 'bookmark' | 'contact'>(null)
  const [claimOpen, setClaimOpen] = useState(false)

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

  /* Toggle the awards "View all": open mounts the extras (they animate in);
     close flips the closing flag (extras animate out) then unmounts them. */
  function toggleAwards() {
    if (awardsTimer.current) { clearTimeout(awardsTimer.current); awardsTimer.current = null }
    if (awardsOpen) {
      setAwardsClosing(true)
      setAwardsOpen(false)
      awardsTimer.current = window.setTimeout(() => { setAwardsClosing(false); awardsTimer.current = null }, 900)
    } else {
      setAwardsClosing(false)
      setAwardsOpen(true)
    }
  }

  /* One award card. extraIdx (set for cards beyond the first 8) tags it as
     an animated "extra" and seeds its staggered reveal delay. */
  const renderAwardCard = (a: Award, key: number, extraIdx?: number) => (
    <article
      key={key}
      className={'cmp-award' + (extraIdx != null ? ' cmp-award--extra' : '')}
      style={extraIdx != null ? ({ ['--d' as string]: `${Math.min(extraIdx, 10) * 0.05}s` } as React.CSSProperties) : undefined}
      title={a.year ? `${a.name} (${a.year})` : a.name}
    >
      <div className="cmp-award-card">
        <img src="/illustrations/award-trophy.png" alt="" className="cmp-award-trophy" />
        <span className="cmp-award-logo">
          {(c.logo_url || fallbackLogo)
            ? <img src={c.logo_url || fallbackLogo} alt={`${c.company_name} logo`} />
            : <span>{initialsOf(c.company_name)}</span>}
        </span>
        <h3 className="cmp-award-name">{a.name}</h3>
        {a.year && <span className="cmp-award-year" aria-hidden="true">{a.year}</span>}
      </div>
    </article>
  )

  /* ── RENDER ──────────────────────────────────────────────────────── */
  return (
    <main className="cmp-root" style={cssVars}>

      {/* ════════════════════════════════════════════════════════════
          0. BREADCRUMB — L1 → … → leaf category → company name
          ════════════════════════════════════════════════════════════ */}
      {breadcrumb.length > 0 && (
        <div className="cmp-crumb-bar">
          <div className="cmp-crumb-inner">
            <nav className="cmp-crumb" aria-label="Breadcrumb">
              <a href="/" aria-label="Home"><FontAwesomeIcon icon={faHouse} /></a>
              {breadcrumb.map((bc, i) => {
                const sectorSlug = breadcrumb[0]?.slug
                const href = i === 0 ? `/${bc.slug}` : `/${sectorSlug}/${bc.slug}`
                return (
                  <span key={bc.slug} style={{ display: 'contents' }}>
                    <span className="cmp-crumb-sep"><FontAwesomeIcon icon={faChevronRight} /></span>
                    <a href={href}>{bc.name}</a>
                  </span>
                )
              })}
              <span className="cmp-crumb-sep"><FontAwesomeIcon icon={faChevronRight} /></span>
              <span className="cmp-crumb-current">{c.company_name}</span>
            </nav>
          </div>
        </div>
      )}

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
            <Bookmark />
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
                    <VerifiedShield />
                    Premier Verified
                  </span>
                )}
                {c.backlink_status === 'verified' && (
                  <span
                    className="cmp-head-verified"
                    title="InfoWebWorld Partner — displays our badge"
                    style={{ background: '#FFF3D9', color: '#8A6D1F' }}
                  >
                    &#9733; Partner
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
                  /* No-review state — a clean accent pill linking straight to
                     the write-review flow (one click). */
                  <a href={reviewHref} className="cmp-head-rating-cta">
                    <FontAwesomeIcon icon={faPenToSquare} />
                    Be the first to review
                  </a>
                )}

                {awards.length > 0 && (
                  <a
                    href="#awards"
                    className="cmp-head-awards"
                    title={awards.map(a => a.year ? `${a.name} (${a.year})` : a.name).join(' · ')}
                  >
                    <Trophy />
                    <span>{awards.length === 1 ? 'Award-winning' : `${awards.length} Awards`}</span>
                  </a>
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
                    target="_blank" rel={listingOutboundRel(c.plan_slug)}
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
                  {me.isFollowing ? 'Following' : 'Follow'}
                </button>

                {/* Claim CTA — only on unowned, unverified company profiles
                    (the seeded majority). Opens ClaimListingModal: instant
                    domain-email OTP for owners, or manual review otherwise. */}
                {isClaimable && (
                  <button
                    type="button"
                    className="cmp-btn cmp-btn--outline cmp-btn--claim"
                    style={{ background: 'var(--cmp-accent, #E8553D)', borderColor: 'var(--cmp-accent, #E8553D)', color: '#fff' }}
                    onClick={() => setClaimOpen(true)}
                    aria-label={`Claim ${c.company_name}`}
                  >
                    <FontAwesomeIcon icon={faCircleCheck} /> Claim Now
                  </button>
                )}
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
                <div className="cmp-desc">
                  {/* Clamp lives on the inner body only — keeping the Read more
                      button a SIBLING (not a child) so the line-clamp's
                      overflow:hidden never clips the toggle. */}
                  <div className={'cmp-desc-body' + (isLongDescription && !expandedDesc ? ' is-collapsed' : '')}>
                    {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                  {isLongDescription && (
                    <button type="button" className="cmp-readmore" onClick={() => setExpandedDesc(e => !e)}>
                      {expandedDesc ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}

              {c.intro_video_url && <VideoEmbed url={c.intro_video_url} />}

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

          {/* Awards + key facts live OUTSIDE the two-column grid so they span
              the full content width — previously trapped in the 60% left
              column, which left the right half of the desktop view empty. */}
          {awards.length > 0 && (
            <div className="cmp-awards" id="awards">
              <div className="cmp-awards-head">
                <span className="cmp-awards-head-ico"><AwardMedal /></span>
                <span className="cmp-awards-head-title">Award &amp; Recognitions</span>
                <span className="cmp-awards-head-count">{awards.length}</span>
              </div>
              <div className={'cmp-awards-grid' + (awardsClosing ? ' is-closing' : '')}>
                {awards.slice(0, AWARDS_VISIBLE).map((a, i) => renderAwardCard(a, i))}
                {(awardsOpen || awardsClosing) &&
                  awards.slice(AWARDS_VISIBLE).map((a, i) => renderAwardCard(a, i + AWARDS_VISIBLE, i))}
              </div>

              {awards.length > AWARDS_VISIBLE && (
                <div className="cmp-awards-viewall">
                  <button
                    type="button"
                    className="cmp-viewall-btn"
                    onClick={toggleAwards}
                    aria-expanded={awardsOpen}
                  >
                    <span>{awardsOpen ? 'Show less' : `View all ${awards.length} awards`}</span>
                    <FontAwesomeIcon icon={faChevronDown} className="cmp-viewall-chev" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Key facts render in the left column as the original cmp-stats list. */}
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
                <span className="cmp-snap-head-ico"><PriceTag /></span>
                <h2 className="cmp-snap-title">Pricing Snapshot</h2>
              </header>

              <div className="cmp-snap-grid">
                {/* LEFT column: stat cards + clients say */}
                <div className="cmp-snap-left">
                  <div className="cmp-snap-stats">
                    {c.min_project_size && (
                      <div className="cmp-snap-stat cmp-snap-stat--min">
                        <span className="cmp-snap-stat-ico" aria-hidden="true"><FontAwesomeIcon icon={faSackDollar} /></span>
                        <span className="cmp-snap-stat-lbl">Min. project size</span>
                        <span className="cmp-snap-stat-val">{prettyRange(c.min_project_size)}</span>
                        {minSizeCaption(c.min_project_size) && (
                          <span className="cmp-snap-stat-cap">{minSizeCaption(c.min_project_size)}</span>
                        )}
                      </div>
                    )}
                    {c.hourly_rate && (
                      <div className="cmp-snap-stat cmp-snap-stat--rate">
                        <span className="cmp-snap-stat-ico" aria-hidden="true"><FontAwesomeIcon icon={faClock} /></span>
                        <span className="cmp-snap-stat-lbl">Avg. hourly rate</span>
                        <span className="cmp-snap-stat-val">
                          {prettyRange(c.hourly_rate)}
                          {!/h(ou)?r/i.test(c.hourly_rate) && <small>/hr</small>}
                        </span>
                        {hourlyCaption(c.hourly_rate) && (
                          <span className="cmp-snap-stat-cap">{hourlyCaption(c.hourly_rate)}</span>
                        )}
                      </div>
                    )}
                    {ratingForCost != null && (
                      <div className="cmp-snap-stat cmp-snap-stat--rating">
                        <span className="cmp-snap-stat-ico" aria-hidden="true"><FontAwesomeIcon icon={faScaleBalanced} /></span>
                        <span className="cmp-snap-stat-lbl">Rating for cost</span>
                        <span className="cmp-snap-stat-val">
                          {ratingForCost.toFixed(1)}
                          <Stars value={ratingForCost} />
                        </span>
                        {costRatingCaption(ratingForCost) && (
                          <span className="cmp-snap-stat-cap">{costRatingCaption(ratingForCost)}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {c.clients_summary && (
                    <div className="cmp-snap-says">
                      <h3 className="cmp-snap-says-title cmp-h3"><span className="cmp-h2-ico"><FontAwesomeIcon icon={faQuoteLeft} /></span>What Clients Have Said</h3>
                      <p className="cmp-snap-says-body">{c.clients_summary}</p>
                      {reviewsData.reviewCount > 0 && (
                        <p className="cmp-snap-says-foot">This summary is based on {reviewsData.reviewCount} verified InfoWebWorld {reviewsData.reviewCount === 1 ? 'review' : 'reviews'}.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* RIGHT column: most common project size + range bar */}
                <div className="cmp-snap-right">
                  {c.common_project_size && (
                    <div className="cmp-snap-common">
                      <h3 className="cmp-snap-common-title cmp-h3">
                        <span className="cmp-h2-ico"><FontAwesomeIcon icon={faMoneyBillWave} /></span>
                        Most Common Project Size
                      </h3>
                      <div className="cmp-snap-common-val">{c.common_project_size}</div>
                    </div>
                  )}

                  {services.length > 0 && (
                    <div className="cmp-snap-pills">
                      <div className="cmp-snap-pills-title cmp-h3"><span className="cmp-h2-ico"><FontAwesomeIcon icon={faBriefcase} /></span>What {c.company_name} works on</div>
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

                      {/* Payload for the pill selection — the owner's service-line
                          share (the lines sum to 100% across all services), shown as
                          a bar. There is no per-service pricing in the data. */}
                      {(() => {
                        const sel = activeServicePill === 'All' ? null : services.find(s => s.name === activeServicePill)
                        const pct = sel ? Math.round(Number(sel.percentage) || 0) : 0
                        return (
                          <div className="cmp-snap-svc" role="status" aria-live="polite">
                            <div className="cmp-snap-svc-name">{sel ? sel.name : 'All services'}</div>
                            {sel && pct > 0 && (
                              <div className="cmp-snap-svc-bar"><span style={{ width: `${Math.min(100, pct)}%` }} /></div>
                            )}
                            <p className="cmp-snap-svc-foot">
                              {sel
                                ? <>Share of work: <strong>{pct}%</strong></>
                                : `A breakdown of the ${services.length} ${services.length === 1 ? 'service' : 'services'} ${c.company_name} delivers. Select one to see its share of work.`}
                            </p>
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          REVIEWS — rating summary + recent review cards + write CTA.
          Anchored #reviews so the head's rating / "Be the first to
          review" links actually resolve (they previously pointed at a
          target that didn't exist). Always renders so the empty state
          gives anon visitors a clear way to leave the first review.
          ════════════════════════════════════════════════════════════ */}
      <section className="cmp-section cmp-reviews" id="reviews">
        <div className="cmp-section-inner">
          <header className="cmp-reviews-head">
            <h2 className="cmp-section-title cmp-h2"><span className="cmp-h2-ico"><FontAwesomeIcon icon={faComments} /></span>Reviews</h2>
          </header>

          {reviewsData.reviewCount > 0 && (
            <div className="cmp-rsum">
              <div className="cmp-rsum-card">
                <div className="cmp-rsum-score">{reviewsData.avgRating.toFixed(1)}</div>
                <StarMeter value={reviewsData.avgRating} />
                <div className="cmp-rsum-total">
                  {reviewsData.reviewCount.toLocaleString()} {reviewsData.reviewCount === 1 ? 'review' : 'reviews'}
                </div>
                <a href={reviewHref} className="cmp-btn cmp-btn--primary cmp-rsum-cta">Leave a Review</a>
              </div>
              <div className="cmp-rsum-bars">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = reviewDist[star - 1] || 0
                  const pct = (count / reviewMax) * 100
                  return (
                    <div
                      className="cmp-rsum-row"
                      key={star}
                      role="img"
                      aria-label={`${star} stars: ${count.toLocaleString()} ${count === 1 ? 'review' : 'reviews'}`}
                    >
                      <span className="cmp-rsum-row-stars"><StarMeter value={star} /></span>
                      <span className="cmp-rsum-bar">
                        <span className="cmp-rsum-bar-fill" style={{ width: count > 0 ? `max(${pct.toFixed(1)}%, 8px)` : '0%' }} />
                      </span>
                      <span className="cmp-rsum-row-count">{count.toLocaleString()}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {reviews.length > 0 ? (
            <div className="cmp-reviews-list">
              {reviews.map(r => (
                <article key={r.id} className="cmp-review">
                  <div className="cmp-review-top">
                    <span className="cmp-review-avatar">
                      {r.user_avatar_url
                        ? <img src={r.user_avatar_url} alt="" />
                        : <span>{initialsOf(r.user_name)}</span>}
                    </span>
                    <div className="cmp-review-who">
                      <span className="cmp-review-author">{r.user_name || 'Verified reviewer'}</span>
                      {r.created_at && <span className="cmp-review-date">{fmtReviewDate(r.created_at)}</span>}
                    </div>
                    <span className="cmp-review-stars"><Stars value={r.rating} /></span>
                  </div>
                  {r.title && <h3 className="cmp-review-title">{r.title}</h3>}
                  {r.body && <p className="cmp-review-body">{r.body}</p>}
                </article>
              ))}
            </div>
          ) : (
            <div className="cmp-reviews-empty">
              <span className="cmp-reviews-empty-ico"><FontAwesomeIcon icon={faStar} /></span>
              <h3 className="cmp-reviews-empty-title">No reviews yet</h3>
              <p className="cmp-reviews-empty-sub">
                Worked with {c.company_name}? Share your experience and help others choose with confidence.
              </p>
              <a href={reviewHref} className="cmp-btn cmp-btn--primary cmp-reviews-empty-cta">
                <FontAwesomeIcon icon={faPenToSquare} /> Write the first review
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          4. PORTFOLIO — Products by us. Only rendered once the company has
          at least one product listed; hidden entirely while empty (no
          "No products listed yet" placeholder). Reappears automatically on
          the next profile rebuild after a product is added.
          ════════════════════════════════════════════════════════════ */}
      {products.length > 0 && (
      <section className="cmp-section cmp-portfolio">
        <div className="cmp-section-inner">
          <header className="cmp-section-head cmp-section-head--portfolio">
            <div>
              <h2 className="cmp-section-title cmp-h2">
                <span className="cmp-h2-ico"><FontAwesomeIcon icon={faBoxOpen} /></span>
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
        </div>
      </section>
      )}

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
                <h2 className="tlp-sec-title cmp-h2"><span className="cmp-h2-ico"><FontAwesomeIcon icon={faRightLeft} /></span>{c.company_name} alternatives</h2>
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
                              <FontAwesomeIcon icon={faClock} style={{ fontSize: 20, color: '#9CA3AF' }} />
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
                <h2 className="tlp-sec-title cmp-h2"><span className="cmp-h2-ico"><FontAwesomeIcon icon={faCodeCompare} /></span>Popular comparisons with {c.company_name}</h2>
                <div className="tlp-cmp-grid">
                  {similarCompanies.slice(0, 9).map(s => {
                    const sLogo = s.logo_url || ''
                    return (
                      <a key={s.id} href={`/compare-companies/${slug}-vs-${s.slug}`} className="tlp-cmp">
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
                  <h2 className="tlp-sec-title cmp-h2"><span className="cmp-h2-ico"><FontAwesomeIcon icon={faEye} /></span>Customers also viewed</h2>
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
                <h2 className="tlp-sec-title tlp-rc-title cmp-h2">
                  <span className="cmp-h2-ico"><FontAwesomeIcon icon={faLayerGroup} /></span>
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
            <h2 className="cmp-section-title cmp-h2"><span className="cmp-h2-ico"><FontAwesomeIcon icon={faPaperPlane} /></span>Get in touch with {c.company_name}</h2>
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
                target="_blank" rel={listingOutboundRel(c.plan_slug)}
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

      {/* Claim flow — unowned company profiles. Instant domain-email OTP for
          owners (@company.com), or manual review for everyone else. Anon users
          route through SignupModal first, then re-click Claim once authed. */}
      <ClaimListingModal
        open={claimOpen}
        onClose={() => setClaimOpen(false)}
        listingSlug={slug}
        companyName={c.company_name}
        website={c.website || ''}
        isAuthed={me.isAuthed}
        onRequireAuth={() => { setClaimOpen(false); setSignupOpen(true) }}
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
