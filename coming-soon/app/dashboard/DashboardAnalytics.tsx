import Link from 'next/link'
import { query } from '@/lib/db'
import { publicListingUrl } from '../lib/listing-url'

/* ══════════════════════════════════════════════════════════════
   Dashboard home — analytics view (server component).

   Shown when the user has ≥1 listing. Replaces the 3-card hero.

   Layout:
     1. Greeting + 4 hero KPIs (views, clicks, leads, CTR) with
        ↑↓ deltas vs. prior 30 days.
     2. 2-up secondary KPIs (followers, reviews) + headline
        Reach-vs-Conversion big card with a dual-axis bar+line chart.
     3. 2-up: Top 5 listings (with mini 30-day sparklines) | Recent
        activity feed.
     4. 2-up: Top countries | Top referrers (last 30 days).
     5. Full per-listing table at the bottom.

   All data is pre-fetched server-side; the page is force-dynamic so
   numbers refresh on every nav. Defensive try/catch on every query
   so missing migrations zero-out gracefully.
   ══════════════════════════════════════════════════════════════ */

type ListingRow = {
  id: number
  uuid: string
  slug: string
  company_name: string
  logo_url: string | null
  status: string
  listing_mode: 'product' | 'company'
  reviews_count: number
  avg_rating: number | null
  followers_count: number
  bookmarks_count: number
  likes_count: number
  leads_count: number
}
type ListingWithTraffic = ListingRow & {
  views_30d: number
  unique_views_30d: number
  clicks_30d: number
  unique_clicks_30d: number
  sparkline: number[]   // last 7 days of views, equal length 7
}
type DailyPoint = { date: string; views: number; clicks: number }

interface Props {
  userId: number
  userName: string | null
}

/* ── Helpers ──────────────────────────────────────────────────── */

function pct(curr: number, prev: number): { value: number; dir: 'up' | 'down' | 'flat' } {
  if (prev <= 0 && curr <= 0) return { value: 0, dir: 'flat' }
  if (prev <= 0) return { value: 100, dir: 'up' }
  const delta = ((curr - prev) / prev) * 100
  if (Math.abs(delta) < 0.5) return { value: 0, dir: 'flat' }
  return { value: Math.abs(delta), dir: delta > 0 ? 'up' : 'down' }
}

function shortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z')
  if (Number.isNaN(d.getTime())) return iso.slice(5)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

function relativeTime(input: string): string {
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return ''
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60)         return 'just now'
  if (diff < 3600)       return `${Math.floor(diff / 60)}m`
  if (diff < 86400)      return `${Math.floor(diff / 3600)}h`
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)}d`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function hostOf(url: string): string {
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, '')
  } catch { return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] || '(direct)' }
}

/* Minimal country-code → English-name lookup. Covers the top ~30
   markets we expect to see in the next 12 months. Falls back to the
   raw 2-letter code (still readable). No flag emoji — the dashboard
   uses a neutral CC badge instead so it renders identically across
   Windows / macOS / iOS. */
const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', IN: 'India', GB: 'United Kingdom', CA: 'Canada',
  AU: 'Australia', DE: 'Germany', FR: 'France', JP: 'Japan', BR: 'Brazil',
  MX: 'Mexico', ES: 'Spain', IT: 'Italy', NL: 'Netherlands', SG: 'Singapore',
  AE: 'UAE', ID: 'Indonesia', PH: 'Philippines', PK: 'Pakistan', BD: 'Bangladesh',
  NG: 'Nigeria', ZA: 'South Africa', KR: 'South Korea', CN: 'China', RU: 'Russia',
  TR: 'Turkey', SA: 'Saudi Arabia', PL: 'Poland', SE: 'Sweden', CH: 'Switzerland',
  IE: 'Ireland', NZ: 'New Zealand', MY: 'Malaysia', TH: 'Thailand', VN: 'Vietnam',
  AR: 'Argentina', CL: 'Chile', CO: 'Colombia', EG: 'Egypt', IL: 'Israel',
}
function countryName(cc: string): string {
  if (cc === 'XX' || !cc) return 'Unknown'
  return COUNTRY_NAMES[cc] || cc
}

/* ── Inline icon set — single SVG component keyed by name so each
   call stays one element instead of an inline blob. All icons use
   stroke=currentColor so they inherit from the surrounding text. */
const IK = {
  trendUp:   <path d="M3 17l6-6 4 4 8-8M14 7h7v7" />,
  external: <><path d="M14 3h7v7" /><path d="M21 3l-9 9" /><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /></>,
  pencil:   <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></>,
  chart:    <><path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-5" /></>,
  globe:    <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  star:     <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7z" />,
}
function Icon({ name, size = 14 }: { name: keyof typeof IK; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}
         fill="none" stroke="currentColor" strokeWidth="1.9"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {IK[name]}
    </svg>
  )
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return n.toLocaleString()
}

/* ── KPI tile ─────────────────────────────────────────────────── */
function KpiTile({
  label, value, suffix, hint, prev, primary,
}: {
  label: string
  value: number | string
  suffix?: string
  hint?: string
  /** Prior-period number for delta. Omit on tiles where a delta would mislead (e.g. CTR). */
  prev?: number
  primary?: boolean
}) {
  const showDelta = typeof prev === 'number' && typeof value === 'number'
  const delta = showDelta ? pct(value as number, prev) : null
  return (
    <div className={'dash-an-kpi' + (primary ? ' dash-an-kpi--primary' : '')}>
      <span className="dash-an-kpi-lbl">{label}</span>
      <span className="dash-an-kpi-val">
        {typeof value === 'number' ? fmtNum(value) : value}
        {suffix && <span className="dash-an-kpi-suffix">{suffix}</span>}
      </span>
      <span className="dash-an-kpi-foot">
        {delta && delta.dir !== 'flat' && (
          <span className={'dash-an-delta dash-an-delta--' + delta.dir}>
            {delta.dir === 'up' ? '↑' : '↓'} {delta.value.toFixed(0)}%
          </span>
        )}
        {delta && delta.dir === 'flat' && <span className="dash-an-delta dash-an-delta--flat">No change</span>}
        <span className="dash-an-kpi-hint">{hint}</span>
      </span>
    </div>
  )
}

/* ── Dual-axis chart: views bars + clicks line ─────────────────── */
function TrafficChart({ data }: { data: DailyPoint[] }) {
  if (data.length === 0 || data.every(d => d.views === 0 && d.clicks === 0)) {
    return (
      <div className="dash-an-chart-empty">
        <span aria-hidden="true">📈</span>
        <h3>No traffic yet</h3>
        <p>Once visitors land on your listings, daily views and click-throughs appear here.</p>
      </div>
    )
  }
  const W = 760, H = 240
  const PAD_L = 36, PAD_R = 36, PAD_T = 16, PAD_B = 32
  const innerW = W - PAD_L - PAD_R
  const innerH = H - PAD_T - PAD_B
  const maxV = Math.max(1, ...data.map(d => d.views))
  const maxC = Math.max(1, ...data.map(d => d.clicks))
  /* Round both axes up to a "nice" number so the gridlines read as
     round counts (5, 10, 25, 50, 100 …) rather than 7s and 13s. */
  const nice = (n: number): number => {
    const pow = Math.pow(10, Math.floor(Math.log10(n)))
    const norm = n / pow
    const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10
    return step * pow
  }
  const yMaxV = nice(maxV)
  const yMaxC = nice(maxC)
  const yTicks = 4

  const barW = (innerW / data.length) * 0.62
  const slot = innerW / data.length
  const x = (i: number): number => PAD_L + slot * i + (slot - barW) / 2
  const yV = (v: number): number => PAD_T + innerH - (v / yMaxV) * innerH
  const yC = (v: number): number => PAD_T + innerH - (v / yMaxC) * innerH

  const linePts = data.map((d, i) => `${(x(i) + barW / 2).toFixed(1)},${yC(d.clicks).toFixed(1)}`).join(' ')

  return (
    <svg
      className="dash-an-chart-svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Daily views and website clicks for the last 30 days"
    >
      <defs>
        <linearGradient id="dashBarFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor="#0E8F6E" stopOpacity=".92" />
          <stop offset="100%" stopColor="#0E8F6E" stopOpacity=".55" />
        </linearGradient>
      </defs>

      {/* Gridlines + left axis (views) */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const v = (yMaxV / yTicks) * (yTicks - i)
        const y = PAD_T + (innerH / yTicks) * i
        return (
          <g key={'g' + i}>
            <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#EEF0F2" strokeWidth="1" />
            <text x={PAD_L - 8} y={y + 3.5} fontSize="10" fill="#6B7280" textAnchor="end">
              {v >= 1 ? fmtNum(Math.round(v)) : ''}
            </text>
          </g>
        )
      })}

      {/* Right axis (clicks) */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const v = (yMaxC / yTicks) * (yTicks - i)
        const y = PAD_T + (innerH / yTicks) * i
        return (
          <text key={'r' + i} x={W - PAD_R + 8} y={y + 3.5} fontSize="10" fill="#0E8F6E" textAnchor="start">
            {v >= 1 ? fmtNum(Math.round(v)) : ''}
          </text>
        )
      })}

      {/* Views bars */}
      {data.map((d, i) => {
        const y = yV(d.views)
        const h = Math.max(0, PAD_T + innerH - y)
        return (
          <rect
            key={'b' + i}
            x={x(i)} y={y}
            width={barW} height={h}
            fill="url(#dashBarFill)"
            rx={2}
          >
            <title>{shortDate(d.date)} · {d.views} views · {d.clicks} clicks</title>
          </rect>
        )
      })}

      {/* Clicks line */}
      <polyline
        points={linePts}
        fill="none" stroke="#003B2A" strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round"
      />
      {data.map((d, i) => (
        <circle
          key={'c' + i}
          cx={x(i) + barW / 2} cy={yC(d.clicks)}
          r={2.4} fill="#FFFFFF" stroke="#003B2A" strokeWidth="1.6"
        />
      ))}

      {/* X-axis labels — every 5 days */}
      {data.map((d, i) => (i % 5 === 0 || i === data.length - 1) && (
        <text
          key={'x' + i}
          x={x(i) + barW / 2} y={H - 12}
          fontSize="10" fill="#6B7280" textAnchor="middle"
        >
          {shortDate(d.date)}
        </text>
      ))}
    </svg>
  )
}

/* ── Per-row mini sparkline (7 days) ──────────────────────────── */
function MiniSpark({ data }: { data: number[] }) {
  if (data.every(v => v === 0)) {
    return <span className="dash-an-mini-empty" aria-hidden="true">—</span>
  }
  const W = 84, H = 24
  const max = Math.max(1, ...data)
  const step = W / Math.max(1, data.length - 1)
  const pts = data.map((v, i) => `${(i * step).toFixed(1)},${(H - (v / max) * H + 2).toFixed(1)}`).join(' ')
  return (
    <svg className="dash-an-mini" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts} fill="none" stroke="#0E8F6E" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default async function DashboardAnalytics({ userId, userName }: Props) {
  /* ── Listings + engagement aggregates ── */
  let listings: ListingRow[] = []
  try {
    listings = await query<ListingRow>(
      `SELECT s.id, s.uuid, s.slug, s.company_name, s.logo_url, s.status,
              COALESCE(s.listing_mode, 'product') AS listing_mode,
              (SELECT COUNT(*) FROM reviews r WHERE r.listing_id = s.id AND r.status = 'approved') AS reviews_count,
              (SELECT AVG(rating) FROM reviews r WHERE r.listing_id = s.id AND r.status = 'approved') AS avg_rating,
              (SELECT COUNT(*) FROM listing_follows lf WHERE lf.listing_id = s.id) AS followers_count,
              (SELECT COUNT(*) FROM listing_bookmarks lb WHERE lb.listing_id = s.id) AS bookmarks_count,
              (SELECT COUNT(*) FROM listing_reactions lr WHERE lr.listing_id = s.id AND lr.kind = 'like') AS likes_count,
              (SELECT COUNT(*) FROM listing_inbox_emails ie WHERE ie.listing_id = s.id) AS leads_count
         FROM submissions s
        WHERE s.user_id = ?
          AND s.status IN ('active','paid','pending','rejected')
        ORDER BY s.created_at DESC`,
      [userId]
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) throw err
    listings = []
  }

  const paths = listings.map(l => publicListingUrl(l.slug, l.listing_mode)).filter(Boolean)
  const ids = listings.map(l => l.id)

  /* ── Views per listing (last 30d) ── */
  const viewsByPath = new Map<string, { views: number; unique: number }>()
  if (paths.length > 0) {
    try {
      const ph = paths.map(() => '?').join(',')
      const rows = await query<{ page: string; views: number; unique_views: number }>(
        `SELECT page, COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS unique_views
           FROM page_views
          WHERE page IN (${ph}) AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          GROUP BY page`,
        paths
      )
      for (const r of rows) viewsByPath.set(r.page, { views: Number(r.views), unique: Number(r.unique_views) })
    } catch (err) { console.warn('[analytics] views query failed:', err) }
  }

  /* ── Clicks per listing (last 30d) ── */
  const clicksByListingId = new Map<number, { clicks: number; unique: number }>()
  if (ids.length > 0) {
    try {
      const ph = ids.map(() => '?').join(',')
      const rows = await query<{ listing_id: number; clicks: number; unique_clicks: number }>(
        `SELECT listing_id, COUNT(*) AS clicks, COUNT(DISTINCT visitor_hash) AS unique_clicks
           FROM listing_outbound_clicks
          WHERE listing_id IN (${ph}) AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          GROUP BY listing_id`,
        ids
      )
      for (const r of rows) clicksByListingId.set(Number(r.listing_id), { clicks: Number(r.clicks), unique: Number(r.unique_clicks) })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (!/Table.*doesn't exist|Unknown table/.test(msg)) console.warn('[analytics] clicks query failed:', err)
    }
  }

  /* ── Prior-period (30-59 days ago) totals for delta tiles ── */
  let prevViews = 0, prevClicks = 0, prevLeads = 0
  if (paths.length > 0) {
    try {
      const ph = paths.map(() => '?').join(',')
      const [row] = await query<{ n: number }>(
        `SELECT COUNT(*) AS n FROM page_views
          WHERE page IN (${ph})
            AND created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY)
            AND created_at <  DATE_SUB(NOW(), INTERVAL 30 DAY)`,
        paths
      )
      prevViews = Number(row?.n ?? 0)
    } catch {}
  }
  if (ids.length > 0) {
    try {
      const ph = ids.map(() => '?').join(',')
      const [row] = await query<{ n: number }>(
        `SELECT COUNT(*) AS n FROM listing_outbound_clicks
          WHERE listing_id IN (${ph})
            AND created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY)
            AND created_at <  DATE_SUB(NOW(), INTERVAL 30 DAY)`,
        ids
      )
      prevClicks = Number(row?.n ?? 0)
      const [leadRow] = await query<{ n: number }>(
        `SELECT COUNT(*) AS n FROM listing_inbox_emails
          WHERE listing_id IN (${ph})
            AND created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY)
            AND created_at <  DATE_SUB(NOW(), INTERVAL 30 DAY)`,
        ids
      )
      prevLeads = Number(leadRow?.n ?? 0)
    } catch {}
  }

  /* ── 30-day daily series for the main chart ── */
  const daily = new Map<string, DailyPoint>()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    daily.set(iso, { date: iso, views: 0, clicks: 0 })
  }
  if (paths.length > 0) {
    try {
      const ph = paths.map(() => '?').join(',')
      const rows = await query<{ d: string; v: number }>(
        `SELECT DATE(created_at) AS d, COUNT(*) AS v
           FROM page_views
          WHERE page IN (${ph}) AND created_at >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)
          GROUP BY DATE(created_at)`,
        paths
      )
      for (const r of rows) {
        const slot = daily.get(String(r.d).slice(0, 10))
        if (slot) slot.views = Number(r.v)
      }
    } catch {}
  }
  if (ids.length > 0) {
    try {
      const ph = ids.map(() => '?').join(',')
      const rows = await query<{ d: string; v: number }>(
        `SELECT DATE(created_at) AS d, COUNT(*) AS v
           FROM listing_outbound_clicks
          WHERE listing_id IN (${ph}) AND created_at >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)
          GROUP BY DATE(created_at)`,
        ids
      )
      for (const r of rows) {
        const slot = daily.get(String(r.d).slice(0, 10))
        if (slot) slot.clicks = Number(r.v)
      }
    } catch {}
  }
  const dailySeries = Array.from(daily.values())

  /* ── Per-listing 7-day sparkline data ── */
  const sparkByPath = new Map<string, number[]>()
  const SPARK_DAYS = 7
  for (const p of paths) sparkByPath.set(p, Array(SPARK_DAYS).fill(0))
  if (paths.length > 0) {
    try {
      const ph = paths.map(() => '?').join(',')
      const rows = await query<{ page: string; d: string; v: number }>(
        `SELECT page, DATE(created_at) AS d, COUNT(*) AS v
           FROM page_views
          WHERE page IN (${ph}) AND created_at >= DATE_SUB(CURDATE(), INTERVAL ${SPARK_DAYS - 1} DAY)
          GROUP BY page, DATE(created_at)`,
        paths
      )
      const startKey = new Date(today)
      startKey.setDate(startKey.getDate() - (SPARK_DAYS - 1))
      for (const r of rows) {
        const arr = sparkByPath.get(r.page)
        if (!arr) continue
        const date = new Date(String(r.d).slice(0, 10) + 'T00:00:00Z')
        const idx = Math.round((date.getTime() - Date.UTC(startKey.getFullYear(), startKey.getMonth(), startKey.getDate())) / 86400000)
        if (idx >= 0 && idx < SPARK_DAYS) arr[idx] = Number(r.v)
      }
    } catch {}
  }

  /* ── Top countries (last 30d, this user's listings) ── */
  let topCountries: { country: string; count: number }[] = []
  if (paths.length > 0) {
    try {
      const ph = paths.map(() => '?').join(',')
      topCountries = await query<{ country: string; count: number }>(
        `SELECT COALESCE(country, 'XX') AS country, COUNT(*) AS count
           FROM page_views
          WHERE page IN (${ph}) AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          GROUP BY country
          ORDER BY count DESC LIMIT 6`,
        paths
      )
    } catch {}
  }

  /* ── Top referrers (aggregate by host) ── */
  let topReferrers: { host: string; count: number }[] = []
  if (paths.length > 0) {
    try {
      const ph = paths.map(() => '?').join(',')
      const raw = await query<{ referrer: string; count: number }>(
        `SELECT referrer, COUNT(*) AS count
           FROM page_views
          WHERE page IN (${ph})
            AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            AND referrer IS NOT NULL AND referrer != ''
          GROUP BY referrer
          ORDER BY count DESC LIMIT 100`,
        paths
      )
      const agg = new Map<string, number>()
      for (const r of raw) {
        const h = hostOf(r.referrer)
        agg.set(h, (agg.get(h) || 0) + Number(r.count))
      }
      topReferrers = [...agg.entries()]
        .map(([host, count]) => ({ host, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)
    } catch {}
  }

  /* ── Wire everything per listing ── */
  const listingsWithTraffic: ListingWithTraffic[] = listings.map(l => {
    const path = publicListingUrl(l.slug, l.listing_mode)
    const v = viewsByPath.get(path) || { views: 0, unique: 0 }
    const c = clicksByListingId.get(l.id) || { clicks: 0, unique: 0 }
    return {
      ...l,
      views_30d: v.views,
      unique_views_30d: v.unique,
      clicks_30d: c.clicks,
      unique_clicks_30d: c.unique,
      sparkline: sparkByPath.get(path) || Array(SPARK_DAYS).fill(0),
    }
  })

  const totals = listingsWithTraffic.reduce(
    (a, l) => {
      a.views += l.views_30d
      a.clicks += l.clicks_30d
      a.followers += Number(l.followers_count) || 0
      a.bookmarks += Number(l.bookmarks_count) || 0
      a.reviews += Number(l.reviews_count) || 0
      a.leads += Number(l.leads_count) || 0
      return a
    },
    { views: 0, clicks: 0, followers: 0, bookmarks: 0, reviews: 0, leads: 0 }
  )
  const ctr = totals.views > 0 ? `${((totals.clicks / totals.views) * 100).toFixed(1)}%` : '—'

  /* ── Top 5 performing listings by views ── */
  const topListings = [...listingsWithTraffic]
    .sort((a, b) => (b.views_30d - a.views_30d) || (b.clicks_30d - a.clicks_30d))
    .slice(0, 5)

  /* ── Recent activity feed ── */
  type ActivityRow = {
    kind: 'review' | 'follow' | 'bookmark' | 'lead'
    created_at: string
    listing_id: number
    actor: string | null
    detail: string | null
  }
  let activity: ActivityRow[] = []
  if (ids.length > 0) {
    try {
      const ph = ids.map(() => '?').join(',')
      const params: (number | string)[] = [...ids, ...ids, ...ids, ...ids]
      activity = await query<ActivityRow>(
        `(SELECT 'review' AS kind, r.created_at, r.listing_id,
                 COALESCE(u.name, u.email) AS actor,
                 CONCAT(r.rating, '★ · ', LEFT(r.title, 60)) AS detail
            FROM reviews r
            LEFT JOIN business_users u ON u.id = r.user_id
           WHERE r.listing_id IN (${ph}) AND r.status = 'approved')
         UNION ALL
         (SELECT 'follow' AS kind, lf.created_at, lf.listing_id,
                 COALESCE(u.name, u.email) AS actor, NULL AS detail
            FROM listing_follows lf
            LEFT JOIN business_users u ON u.id = lf.user_id
           WHERE lf.listing_id IN (${ph}))
         UNION ALL
         (SELECT 'bookmark' AS kind, lb.created_at, lb.listing_id,
                 COALESCE(u.name, u.email) AS actor, NULL AS detail
            FROM listing_bookmarks lb
            LEFT JOIN business_users u ON u.id = lb.user_id
           WHERE lb.listing_id IN (${ph}))
         UNION ALL
         (SELECT 'lead' AS kind, ie.created_at, ie.listing_id,
                 ie.email AS actor, NULL AS detail
            FROM listing_inbox_emails ie
           WHERE ie.listing_id IN (${ph}))
         ORDER BY created_at DESC
         LIMIT 8`,
        params
      )
    } catch (err) { console.warn('[analytics] activity query failed:', err) }
  }
  const listingById = new Map(listings.map(l => [l.id, l]))

  const firstName = (userName || '').trim().split(/\s+/)[0] || 'there'
  const totalCountries = topCountries.reduce((s, c) => s + Number(c.count), 0)
  const totalReferrers = topReferrers.reduce((s, c) => s + Number(c.count), 0)
  const maxListingViews = topListings.length ? Math.max(...topListings.map(l => l.views_30d), 1) : 1

  return (
    <div className="dash-an">
      <header className="dash-an-head">
        <div>
          <span className="dash-an-eyebrow">Dashboard · Last 30 days</span>
          <h1 className="dash-an-title">Good to see you, {firstName}.</h1>
          <p className="dash-an-sub">
            {listingsWithTraffic.length === 1 ? '1 listing' : `${listingsWithTraffic.length} listings`}
            {totals.views > 0 && ' · '}
            {totals.views > 0 && (
              <>{fmtNum(totals.views)} views and <strong>{fmtNum(totals.clicks)} clicks</strong> sent to your websites this period.</>
            )}
            {totals.views === 0 && 'No traffic recorded yet — your numbers will fill in here.'}
          </p>
        </div>
        <div className="dash-an-actions">
          <Link href="/dashboard/listings" className="dash-an-btn dash-an-btn--ghost">All listings</Link>
          <Link href="/dashboard/new" className="dash-an-btn dash-an-btn--primary">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New listing
          </Link>
        </div>
      </header>

      {/* ── Hero KPIs (4-up) ── */}
      <div className="dash-an-kpis">
        <KpiTile label="Page views"     value={totals.views}  prev={prevViews}  hint="last 30 days" />
        <KpiTile label="Website clicks" value={totals.clicks} prev={prevClicks} hint="we sent to your site" primary />
        <KpiTile label="Click-through rate" value={ctr}       hint="clicks ÷ views" />
        <KpiTile label="Leads"          value={totals.leads}  prev={prevLeads}  hint="contact form submissions" />
      </div>

      {/* ── Secondary KPIs + traffic chart side-by-side at desktop ── */}
      <div className="dash-an-row dash-an-row--chart">
        <section className="dash-an-card dash-an-chart-card">
          <header className="dash-an-card-head">
            <div>
              <h2 className="dash-an-card-title">Reach &amp; conversion</h2>
              <p className="dash-an-card-sub">Daily page views vs. outbound website clicks.</p>
            </div>
            <div className="dash-an-legend">
              <span className="dash-an-legend-item">
                <span className="dash-an-legend-swatch dash-an-legend-swatch--bar" /> Views
              </span>
              <span className="dash-an-legend-item">
                <span className="dash-an-legend-swatch dash-an-legend-swatch--line" /> Website clicks
              </span>
            </div>
          </header>
          <div className="dash-an-chart">
            <TrafficChart data={dailySeries} />
          </div>
        </section>

        <aside className="dash-an-side-stack">
          <div className="dash-an-kpi dash-an-kpi--side">
            <span className="dash-an-kpi-lbl">Followers</span>
            <span className="dash-an-kpi-val">{fmtNum(totals.followers)}</span>
            <span className="dash-an-kpi-foot"><span className="dash-an-kpi-hint">across listings</span></span>
          </div>
          <div className="dash-an-kpi dash-an-kpi--side">
            <span className="dash-an-kpi-lbl">Reviews</span>
            <span className="dash-an-kpi-val">{fmtNum(totals.reviews)}</span>
            <span className="dash-an-kpi-foot"><span className="dash-an-kpi-hint">approved</span></span>
          </div>
          <div className="dash-an-kpi dash-an-kpi--side">
            <span className="dash-an-kpi-lbl">Bookmarks</span>
            <span className="dash-an-kpi-val">{fmtNum(totals.bookmarks)}</span>
            <span className="dash-an-kpi-foot"><span className="dash-an-kpi-hint">visitor saves</span></span>
          </div>
        </aside>
      </div>

      {/* ── Top 5 listings | Activity feed ── */}
      <div className="dash-an-row dash-an-row--split">
        <section className="dash-an-card">
          <header className="dash-an-card-head">
            <div>
              <h2 className="dash-an-card-title">Top performing</h2>
              <p className="dash-an-card-sub">Your highest-traffic listings — last 30 days.</p>
            </div>
          </header>
          <ol className="dash-an-top">
            {topListings.length === 0 && <li className="dash-an-empty">No listings to rank yet.</li>}
            {topListings.map((l, i) => {
              const widthPct = Math.max(4, (l.views_30d / maxListingViews) * 100)
              return (
                <li key={l.uuid} className="dash-an-top-row">
                  <span className="dash-an-top-rank">{i + 1}</span>
                  <div className="dash-an-top-main">
                    <div className="dash-an-top-meta">
                      <Link href={`/dashboard/listings/${l.uuid}/engagement`} className="dash-an-top-name">
                        {l.company_name}
                      </Link>
                      <span className="dash-an-top-stats">
                        <strong>{fmtNum(l.views_30d)}</strong> views ·{' '}
                        <strong>{fmtNum(l.clicks_30d)}</strong> clicks
                        {l.views_30d > 0 && <> · {((l.clicks_30d / l.views_30d) * 100).toFixed(1)}% CTR</>}
                      </span>
                    </div>
                    <div className="dash-an-top-bar">
                      <div className="dash-an-top-bar-fill" style={{ width: widthPct + '%' }} />
                    </div>
                  </div>
                  <div className="dash-an-top-spark"><MiniSpark data={l.sparkline} /></div>
                </li>
              )
            })}
          </ol>
        </section>

        <section className="dash-an-card">
          <header className="dash-an-card-head">
            <div>
              <h2 className="dash-an-card-title">Recent activity</h2>
              <p className="dash-an-card-sub">Reviews · follows · bookmarks · leads.</p>
            </div>
          </header>
          {activity.length === 0 ? (
            <p className="dash-an-empty dash-an-empty--card">
              No activity yet. Reviews, follows and contact-form leads land here as visitors interact.
            </p>
          ) : (
            <ul className="dash-an-activity">
              {activity.map((a, i) => {
                const l = listingById.get(Number(a.listing_id))
                const actor = (a.actor || 'Someone').split('@')[0]
                const verb = a.kind === 'review' ? 'reviewed' : a.kind === 'follow' ? 'followed' : a.kind === 'bookmark' ? 'bookmarked' : 'contacted'
                return (
                  <li key={`${a.kind}-${i}`} className={'dash-an-activity-row dash-an-activity-row--' + a.kind}>
                    <span className="dash-an-activity-dot" aria-hidden="true" />
                    <span className="dash-an-activity-body">
                      <strong>{actor}</strong> {verb}{' '}
                      {l ? (
                        <Link href={publicListingUrl(l.slug, l.listing_mode)} className="dash-an-activity-link">
                          {l.company_name}
                        </Link>
                      ) : <strong>a listing</strong>}
                      {a.detail && <span className="dash-an-activity-detail"> · {a.detail}</span>}
                    </span>
                    <span className="dash-an-activity-time">{relativeTime(a.created_at)}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>

      {/* ── Top countries | Top referrers ── */}
      <div className="dash-an-row dash-an-row--split">
        <section className="dash-an-card">
          <header className="dash-an-card-head">
            <div>
              <h2 className="dash-an-card-title">Top countries</h2>
              <p className="dash-an-card-sub">Where your audience reads from.</p>
            </div>
          </header>
          {topCountries.length === 0 ? (
            <p className="dash-an-empty dash-an-empty--card">No location data yet.</p>
          ) : (
            <ul className="dash-an-rank">
              {topCountries.map(c => {
                const pctW = totalCountries > 0 ? (Number(c.count) / totalCountries) * 100 : 0
                const isUnknown = c.country === 'XX'
                return (
                  <li key={c.country} className="dash-an-rank-row">
                    <span className="dash-an-rank-label">
                      <span className={'dash-an-cc' + (isUnknown ? ' dash-an-cc--unk' : '')} aria-hidden="true">
                        {isUnknown ? <Icon name="globe" size={12} /> : c.country}
                      </span>
                      <span className="dash-an-rank-text">{countryName(c.country)}</span>
                    </span>
                    <span className="dash-an-rank-bar"><span style={{ width: pctW + '%' }} /></span>
                    <span className="dash-an-rank-val">{fmtNum(Number(c.count))}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="dash-an-card">
          <header className="dash-an-card-head">
            <div>
              <h2 className="dash-an-card-title">Top referrers</h2>
              <p className="dash-an-card-sub">Sites sending visitors to your listings.</p>
            </div>
          </header>
          {topReferrers.length === 0 ? (
            <p className="dash-an-empty dash-an-empty--card">No external referrers yet — most traffic is direct or from search.</p>
          ) : (
            <ul className="dash-an-rank">
              {topReferrers.map(r => {
                const pctW = totalReferrers > 0 ? (Number(r.count) / totalReferrers) * 100 : 0
                return (
                  <li key={r.host} className="dash-an-rank-row">
                    <span className="dash-an-rank-label">
                      <img
                        className="dash-an-rank-fav"
                        src={`https://www.google.com/s2/favicons?domain=${r.host}&sz=32`}
                        alt=""
                      />
                      <span className="dash-an-rank-text">{r.host}</span>
                    </span>
                    <span className="dash-an-rank-bar"><span style={{ width: pctW + '%' }} /></span>
                    <span className="dash-an-rank-val">{fmtNum(Number(r.count))}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>

      {/* ── Full table ── */}
      <section className="dash-an-card">
        <header className="dash-an-card-head">
          <div>
            <h2 className="dash-an-card-title">All listings</h2>
            <p className="dash-an-card-sub">Per-listing breakdown — click a row for the full engagement page.</p>
          </div>
        </header>
        <div className="dash-an-table-wrap">
          <table className="dash-an-tbl">
            <colgroup>
              <col className="dash-an-tbl-col-listing" />
              <col className="dash-an-tbl-col-spark" />
              <col className="dash-an-tbl-col-num" />
              <col className="dash-an-tbl-col-num" />
              <col className="dash-an-tbl-col-num" />
              <col className="dash-an-tbl-col-num" />
              <col className="dash-an-tbl-col-num" />
              <col className="dash-an-tbl-col-num" />
              <col className="dash-an-tbl-col-actions" />
            </colgroup>
            <thead>
              <tr>
                <th>Listing</th>
                <th className="dash-an-tbl-h-spark">7-day</th>
                <th className="dash-an-tbl-h-num">Views</th>
                <th className="dash-an-tbl-h-num">Clicks</th>
                <th className="dash-an-tbl-h-num">CTR</th>
                <th className="dash-an-tbl-h-num">Leads</th>
                <th className="dash-an-tbl-h-num">Followers</th>
                <th className="dash-an-tbl-h-num">Reviews</th>
                <th className="dash-an-tbl-h-actions"><span className="dash-an-sr">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {listingsWithTraffic.map(l => {
                const isLive = l.status === 'active' || l.status === 'paid'
                const isPending = l.status === 'pending'
                const statusKey = isLive ? 'live' : isPending ? 'pending' : 'rejected'
                const statusLabel = isLive ? 'Live' : isPending ? 'Pending review' : 'Needs attention'
                const ctrRow = l.views_30d > 0
                  ? ((l.clicks_30d / l.views_30d) * 100).toFixed(1) + '%'
                  : '—'
                return (
                  <tr key={l.uuid}>
                    <td>
                      <Link href={`/dashboard/listings/${l.uuid}/engagement`} className="dash-an-tbl-listing">
                        {l.logo_url
                          ? <img src={l.logo_url} alt="" className="dash-an-tbl-logo" />
                          : <span className="dash-an-tbl-logo dash-an-tbl-logo--initial">{l.company_name.slice(0, 2).toUpperCase()}</span>}
                        <span className="dash-an-tbl-listing-meta">
                          <span className="dash-an-tbl-listing-name">{l.company_name}</span>
                          <span className="dash-an-tbl-listing-sub">
                            <span className={'dash-an-tbl-dot dash-an-tbl-dot--' + statusKey} title={statusLabel} aria-label={statusLabel} />
                            <span>{l.listing_mode === 'company' ? 'Company' : 'Product'}</span>
                            <span className="dash-an-tbl-sep" aria-hidden="true">·</span>
                            <span className="dash-an-tbl-status">{statusLabel}</span>
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="dash-an-tbl-c-spark"><MiniSpark data={l.sparkline} /></td>
                    <td className="dash-an-tbl-c-num">
                      <span className="dash-an-tbl-n">{fmtNum(l.views_30d)}</span>
                    </td>
                    <td className="dash-an-tbl-c-num">
                      <span className="dash-an-tbl-n dash-an-tbl-n--accent">{fmtNum(l.clicks_30d)}</span>
                    </td>
                    <td className="dash-an-tbl-c-num">
                      <span className="dash-an-tbl-n dash-an-tbl-n--muted">{ctrRow}</span>
                    </td>
                    <td className="dash-an-tbl-c-num">
                      <span className="dash-an-tbl-n">{fmtNum(Number(l.leads_count))}</span>
                    </td>
                    <td className="dash-an-tbl-c-num">
                      <span className="dash-an-tbl-n">{fmtNum(Number(l.followers_count))}</span>
                    </td>
                    <td className="dash-an-tbl-c-num">
                      <span className="dash-an-tbl-n">
                        {fmtNum(Number(l.reviews_count))}
                        {l.avg_rating != null && Number(l.reviews_count) > 0 && (
                          <span className="dash-an-tbl-rating"><Icon name="star" size={11} />{Number(l.avg_rating).toFixed(1)}</span>
                        )}
                      </span>
                    </td>
                    <td className="dash-an-tbl-c-actions">
                      <Link
                        href={`/dashboard/listings/${l.uuid}/engagement`}
                        className="dash-an-ibtn"
                        title="View engagement"
                        aria-label="View engagement"
                      >
                        <Icon name="chart" />
                      </Link>
                      <Link
                        href={`/dashboard/listings/${l.uuid}/edit`}
                        className="dash-an-ibtn"
                        title="Edit listing"
                        aria-label="Edit listing"
                      >
                        <Icon name="pencil" />
                      </Link>
                      {isLive && (
                        <Link
                          href={publicListingUrl(l.slug, l.listing_mode)}
                          target="_blank" rel="noopener noreferrer"
                          className="dash-an-ibtn"
                          title="Open public page"
                          aria-label="Open public page"
                        >
                          <Icon name="external" />
                        </Link>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
