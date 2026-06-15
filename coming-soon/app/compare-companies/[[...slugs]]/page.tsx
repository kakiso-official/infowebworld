import type { Metadata } from 'next'
import Script from 'next/script'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { query } from '../../../lib/db'
import {
  parseCompareSlugs,
  buildCompareUrl,
  MAX_COMPARE,
  type CompanyCol,
  type CompareAlternative,
  type AlternativesBySlug,
  type CompareReview,
} from '../lib'
import CompareCompaniesPage from '../CompareCompaniesPage'

/* ─────────────────────────────────────────────────────────────
   /compare-companies/[[...slugs]] — server entry for COMPANY
   comparison. Mirrors the /compare (product) data flow but filters
   strictly to listing_mode='company' and selects same-L1-sector
   alternatives. Fully isolated from the product comparison.

   Indexing: genuine 2-4 company comparisons (every slug resolves to a
   real active company) are index+follow; empty/invalid/single stay
   noindex (thin or duplicates the /profile page).
   ───────────────────────────────────────────────────────────── */

export const dynamic = 'force-dynamic'

const SITE = 'https://www.infowebworld.com'
const YEAR = new Date().getFullYear()

type Params = { slugs?: string[] }

/* ── Metadata ─────────────────────────────────────────────── */
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slugs: rawSegments } = await params
  const slugs = parseCompareSlugs(rawSegments)

  const empty: Metadata = {
    title: 'Compare IT Companies Side-by-Side | InfoWebWorld',
    description: 'Compare up to 4 IT-services companies & agencies head-to-head — services, pricing, team size, industries, reviews. Pick from thousands of verified firms.',
    alternates: { canonical: `${SITE}/compare-companies` },
    robots: { index: false, follow: false },
  }
  if (slugs.length === 0) return empty

  const placeholders = slugs.map(() => '?').join(',')
  let names: { slug: string; company_name: string }[] = []
  try {
    names = await query<{ slug: string; company_name: string }>(
      `SELECT slug, company_name FROM submissions
        WHERE slug IN (${placeholders})
          AND status IN ('active','paid')
          AND COALESCE(listing_mode,'product') = 'company'`,
      slugs,
    )
  } catch { /* tolerate */ }

  const bySlug = new Map(names.map((r) => [r.slug, r.company_name]))
  const resolved = slugs.map((s) => bySlug.get(s)).filter((n): n is string => !!n)
  if (resolved.length === 0) return empty

  const titleNames = resolved.length === 1 ? resolved[0] : resolved.join(' vs ')
  const title = resolved.length === 1
    ? `${resolved[0]} — Compare Services, Pricing & Reviews | InfoWebWorld`
    : `${titleNames} Comparison (${YEAR}) | InfoWebWorld`
  const description = resolved.length === 1
    ? `Compare ${resolved[0]} against similar companies — services, pricing, team size, industries, clients & reviews. Add up to 4 firms to your side-by-side view.`
    : `${titleNames} compared head-to-head — services, pricing, team size, industries, clients & reviews. Updated ${YEAR}.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE}${buildCompareUrl(slugs)}` },
    robots: resolved.length >= 2
      ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 } }
      : { index: false, follow: false },
    openGraph: { title, description, url: `${SITE}${buildCompareUrl(slugs)}`, siteName: 'InfoWebWorld', type: 'website' },
  }
}

/* ── parse helpers (tolerate string or already-parsed JSON columns) ── */
function parseJsonArray<T = unknown>(raw: unknown): T[] {
  if (raw == null) return []
  if (Array.isArray(raw)) return raw as T[]
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (!t) return []
    try { const p = JSON.parse(t); return Array.isArray(p) ? (p as T[]) : [] } catch { return [] }
  }
  return []
}
function tinyToBool(v: unknown): boolean { return v === 1 || v === '1' || v === true }
function normalizeFaqs(raw: unknown): { q: string; a: string }[] {
  return parseJsonArray<unknown>(raw).map((item) => {
    if (!item || typeof item !== 'object') return null
    const o = item as { q?: unknown; a?: unknown; question?: unknown; answer?: unknown }
    const q = typeof o.q === 'string' ? o.q : (typeof o.question === 'string' ? o.question : '')
    const a = typeof o.a === 'string' ? o.a : (typeof o.answer === 'string' ? o.answer : '')
    if (!q.trim() || !a.trim()) return null
    return { q: q.trim(), a: a.trim() }
  }).filter((x): x is { q: string; a: string } => !!x)
}
function normalizeShares(raw: unknown): { name: string; percentage: number }[] {
  return parseJsonArray<unknown>(raw).map((item) => {
    if (!item || typeof item !== 'object') return null
    const o = item as { name?: unknown; percentage?: unknown }
    const name = typeof o.name === 'string' ? o.name.trim() : ''
    if (!name) return null
    return { name, percentage: Number(o.percentage) || 0 }
  }).filter((x): x is { name: string; percentage: number } => !!x)
}
function normalizeClients(raw: unknown): { name: string; logoUrl?: string; url?: string }[] {
  return parseJsonArray<unknown>(raw).map((item) => {
    if (typeof item === 'string') return item.trim() ? { name: item.trim() } : null
    if (item && typeof item === 'object') {
      const o = item as { name?: unknown; logoUrl?: unknown; url?: unknown }
      const name = typeof o.name === 'string' ? o.name.trim() : ''
      if (!name) return null
      return { name, logoUrl: typeof o.logoUrl === 'string' ? o.logoUrl : undefined, url: typeof o.url === 'string' ? o.url : undefined }
    }
    return null
  }).filter((x): x is { name: string; logoUrl?: string; url?: string } => !!x)
}
function normalizeAwards(raw: unknown): { name: string; year?: number | null }[] {
  return parseJsonArray<unknown>(raw).map((item) => {
    if (typeof item === 'string') return item.trim() ? { name: item.trim(), year: null } : null
    if (item && typeof item === 'object') {
      const o = item as { name?: unknown; year?: unknown }
      const name = typeof o.name === 'string' ? o.name.trim() : ''
      if (!name) return null
      return { name, year: o.year == null ? null : Number(o.year) || null }
    }
    return null
  }).filter((x): x is { name: string; year?: number | null } => !!x)
}

type SubRow = {
  id: number; slug: string; company_name: string; logo_url: string | null
  tagline: string | null; description: string | null; website: string | null
  founded: string | null; employees: string | null; hq_location: string | null
  city: string | null; state: string | null; country_name: string | null
  verified: number | null; is_hiring: number | null; plan_slug: string | null
  header_tags?: unknown; industries_served?: unknown; languages?: unknown; timezones?: unknown
  awards?: unknown; service_lines?: unknown; focus_breakdown?: unknown; client_logos?: unknown; faqs?: unknown
  min_project_size?: string | null; hourly_rate?: string | null; common_project_size?: string | null
  clients_summary?: string | null; intro_video_url?: string | null
  category_id: number | null; category_name: string | null; category_slug: string | null; category_color: string | null
  sector_slug: string | null
}
type ReviewAggRow = { listing_id: number; avg_rating: number | string | null; review_count: number; r5: number; r4: number; r3: number; r2: number; r1: number }
type RecentReviewRow = { listing_id: number; id: number; rating: number; title: string; body: string; created_at: string; user_name: string | null; user_avatar: string | null }
type AltRow = { slug: string; company_name: string; logo_url: string | null; website: string | null; tagline: string | null; category_name: string | null; category_slug: string | null; category_color: string | null; avg_rating: number | string | null; review_count: number }

function mapAltRow(r: AltRow): CompareAlternative {
  return {
    slug: r.slug, companyName: r.company_name, logoUrl: r.logo_url, website: r.website, tagline: r.tagline,
    categoryName: r.category_name, categorySlug: r.category_slug, categoryColor: r.category_color,
    ratingAvg: r.avg_rating != null ? Number(r.avg_rating) : 0, ratingCount: Number(r.review_count ?? 0),
  }
}

/* The category-tree walk that resolves a row's L1 sector slug (1:1 with /compare). */
const SECTOR_CASE = `CASE WHEN c.level = 1 THEN c.slug
       WHEN c.level = 2 THEN cp.slug
       WHEN c.level = 3 THEN cgp.slug
       WHEN c.level = 4 THEN cggp.slug
       WHEN c.level = 5 THEN cgggp.slug
       ELSE NULL END`
const CAT_JOINS = `LEFT JOIN categories c     ON c.id     = s.category_id
     LEFT JOIN categories cp    ON cp.id    = c.parent_id
     LEFT JOIN categories cgp   ON cgp.id   = cp.parent_id
     LEFT JOIN categories cggp  ON cggp.id  = cgp.parent_id
     LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id`

async function fetchCompareData(slugs: string[]): Promise<{ cols: CompanyCol[]; altsBySlug: AlternativesBySlug }> {
  if (slugs.length === 0) return { cols: [], altsBySlug: {} as AlternativesBySlug }
  const placeholders = slugs.map(() => '?').join(',')

  let rows: SubRow[] = []
  try {
    rows = await query<SubRow>(
      `SELECT s.id, s.slug, s.company_name, s.logo_url, s.tagline, s.description, s.website,
              s.founded_year AS founded, s.team_size AS employees, s.hq_location, s.city, s.state,
              COALESCE(s.verified, 0) AS verified, COALESCE(s.is_hiring, 0) AS is_hiring,
              p.slug AS plan_slug,
              s.header_tags, s.industries_served, s.languages, s.timezones, s.awards,
              s.service_lines, s.focus_breakdown, s.client_logos, s.clients_summary,
              s.min_project_size, s.hourly_rate, s.common_project_size, s.intro_video_url, s.faqs,
              co.name AS country_name,
              c.id AS category_id, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
              ${SECTOR_CASE} AS sector_slug
       FROM submissions s
       ${CAT_JOINS}
       LEFT JOIN plans p ON p.id = s.plan_id
       LEFT JOIN countries co ON co.id = s.country_id
       WHERE s.slug IN (${placeholders})
         AND s.status IN ('active','paid')
         AND COALESCE(s.listing_mode,'product') = 'company'`,
      slugs,
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : ''
    if (!msg.includes('Unknown column')) throw err
    // Pre-Clutch-migration fallback: drop the v3/clutch columns.
    const legacy = await query<Partial<SubRow>>(
      `SELECT s.id, s.slug, s.company_name, s.logo_url, s.tagline, s.description, s.website,
              s.founded_year AS founded, s.team_size AS employees, s.hq_location, s.city, s.state,
              COALESCE(s.verified, 0) AS verified,
              co.name AS country_name,
              c.id AS category_id, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
              ${SECTOR_CASE} AS sector_slug
       FROM submissions s
       ${CAT_JOINS}
       LEFT JOIN countries co ON co.id = s.country_id
       WHERE s.slug IN (${placeholders})
         AND s.status IN ('active','paid')
         AND COALESCE(s.listing_mode,'product') = 'company'`,
      slugs,
    )
    rows = legacy as SubRow[]
  }

  if (rows.length === 0) return { cols: [], altsBySlug: {} as AlternativesBySlug }

  const ids = rows.map((r) => r.id)
  const idPlaceholders = ids.map(() => '?').join(',')

  let aggRows: ReviewAggRow[] = [], recentRows: RecentReviewRow[] = [], proRows: RecentReviewRow[] = [], conRows: RecentReviewRow[] = []
  try {
    const [agg, recent, pros, cons] = await Promise.all([
      query<ReviewAggRow>(
        `SELECT listing_id, AVG(rating) AS avg_rating, COUNT(*) AS review_count,
                SUM(CASE WHEN rating=5 THEN 1 ELSE 0 END) AS r5, SUM(CASE WHEN rating=4 THEN 1 ELSE 0 END) AS r4,
                SUM(CASE WHEN rating=3 THEN 1 ELSE 0 END) AS r3, SUM(CASE WHEN rating=2 THEN 1 ELSE 0 END) AS r2,
                SUM(CASE WHEN rating=1 THEN 1 ELSE 0 END) AS r1
         FROM reviews WHERE listing_id IN (${idPlaceholders}) AND status='approved' GROUP BY listing_id`, ids),
      query<RecentReviewRow>(
        `SELECT r.listing_id, r.id, r.rating, r.title, r.body, r.created_at, u.name AS user_name, u.avatar_url AS user_avatar
         FROM reviews r LEFT JOIN business_users u ON u.id = r.user_id
         WHERE r.listing_id IN (${idPlaceholders}) AND r.status='approved' ORDER BY r.created_at DESC LIMIT 20`, ids),
      query<RecentReviewRow>(
        `SELECT r.listing_id, r.id, r.rating, r.title, r.body, r.created_at, u.name AS user_name, u.avatar_url AS user_avatar
         FROM reviews r LEFT JOIN business_users u ON u.id = r.user_id
         WHERE r.listing_id IN (${idPlaceholders}) AND r.status='approved' AND r.rating>=4
         ORDER BY r.rating DESC, r.created_at DESC LIMIT ${Math.max(12, ids.length * 4)}`, ids),
      query<RecentReviewRow>(
        `SELECT r.listing_id, r.id, r.rating, r.title, r.body, r.created_at, u.name AS user_name, u.avatar_url AS user_avatar
         FROM reviews r LEFT JOIN business_users u ON u.id = r.user_id
         WHERE r.listing_id IN (${idPlaceholders}) AND r.status='approved' AND r.rating<=3
         ORDER BY r.rating ASC, r.created_at DESC LIMIT ${Math.max(12, ids.length * 4)}`, ids),
    ])
    aggRows = agg; recentRows = recent; proRows = pros; conRows = cons
  } catch { /* reviews table missing — no aggregate */ }

  const aggByListing = new Map(aggRows.map((r) => [r.listing_id, r]))
  const toQuote = (r: RecentReviewRow): CompareReview => ({ id: r.id, rating: r.rating, title: r.title, body: r.body, createdAt: r.created_at, userName: r.user_name, userAvatar: r.user_avatar })
  const partition = (rs: RecentReviewRow[], cap: number) => {
    const m = new Map<number, CompareReview[]>()
    for (const r of rs) { const l = m.get(r.listing_id) || []; if (l.length < cap) l.push(toQuote(r)); m.set(r.listing_id, l) }
    return m
  }
  const recentBy = partition(recentRows, 3), proBy = partition(proRows, 3), conBy = partition(conRows, 3)

  const bySlug = new Map(rows.map((r) => [r.slug, r]))
  const cols: CompanyCol[] = slugs
    .map((s) => bySlug.get(s))
    .filter((r): r is SubRow => !!r)
    .map((r) => {
      const agg = aggByListing.get(r.id)
      return {
        id: r.id, slug: r.slug, companyName: r.company_name, logoUrl: r.logo_url, tagline: r.tagline,
        description: r.description, website: r.website, founded: r.founded, employees: r.employees,
        hqLocation: r.hq_location, city: r.city, state: r.state, country: r.country_name,
        verified: tinyToBool(r.verified), isHiring: tinyToBool(r.is_hiring), planSlug: r.plan_slug || 'free',
        category: r.category_id ? { id: r.category_id, name: r.category_name || '', slug: r.category_slug || '', color: r.category_color || '#14B8A6' } : null,
        sectorSlug: r.sector_slug || null,
        ratingAvg: agg?.avg_rating != null ? Number(agg.avg_rating) : 0,
        ratingCount: Number(agg?.review_count ?? 0),
        ratingDist: agg ? [Number(agg.r5), Number(agg.r4), Number(agg.r3), Number(agg.r2), Number(agg.r1)] : [0, 0, 0, 0, 0],
        recentReviews: recentBy.get(r.id) || [], topPros: proBy.get(r.id) || [], topCons: conBy.get(r.id) || [],
        lastReviewAt: (recentBy.get(r.id) || [])[0]?.createdAt ?? null,
        headerTags: parseJsonArray<string>(r.header_tags),
        industriesServed: parseJsonArray<string>(r.industries_served),
        languages: parseJsonArray<string>(r.languages),
        timezones: parseJsonArray<string>(r.timezones),
        awards: normalizeAwards(r.awards),
        serviceLines: normalizeShares(r.service_lines),
        focusBreakdown: normalizeShares(r.focus_breakdown),
        clientLogos: normalizeClients(r.client_logos),
        faqs: normalizeFaqs(r.faqs),
        minProjectSize: r.min_project_size ?? null, hourlyRate: r.hourly_rate ?? null,
        commonProjectSize: r.common_project_size ?? null, clientsSummary: r.clients_summary ?? null,
        introVideoUrl: r.intro_video_url ?? null,
      }
    })

  /* Alternatives — same L1 SECTOR companies per column (company-mode only). */
  const altsBySlug: AlternativesBySlug = {} as AlternativesBySlug
  const excludeIds = ids.map(() => '?').join(',')
  const altSql = (withReviews: boolean) => `
    SELECT s.slug, s.company_name, s.logo_url, s.website, s.tagline,
           c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
           ${withReviews
             ? `(SELECT AVG(rating) FROM reviews WHERE listing_id = s.id AND status='approved') AS avg_rating,
                (SELECT COUNT(*) FROM reviews WHERE listing_id = s.id AND status='approved') AS review_count`
             : `NULL AS avg_rating, 0 AS review_count`}
    FROM submissions s
    ${CAT_JOINS}
    WHERE (${SECTOR_CASE}) = ?
      AND s.id NOT IN (${excludeIds})
      AND s.status IN ('active','paid')
      AND COALESCE(s.listing_mode,'product') = 'company'
    ORDER BY ${withReviews ? 'review_count DESC, ' : ''}s.approved_at DESC
    LIMIT 4`

  const altQueries = cols.map(async (col) => {
    if (!col.sectorSlug) return { slug: col.slug, rows: [] as CompareAlternative[] }
    try {
      const altRows = await query<AltRow>(altSql(true), [col.sectorSlug, ...ids])
      return { slug: col.slug, rows: altRows.map(mapAltRow) }
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('reviews')) {
        try {
          const altRows = await query<AltRow>(altSql(false), [col.sectorSlug, ...ids])
          return { slug: col.slug, rows: altRows.map(mapAltRow) }
        } catch { return { slug: col.slug, rows: [] as CompareAlternative[] } }
      }
      return { slug: col.slug, rows: [] as CompareAlternative[] }
    }
  })
  for (const { slug, rows: altRows } of await Promise.all(altQueries)) altsBySlug[slug] = altRows

  const seen = new Set<string>()
  const shared: CompareAlternative[] = []
  for (const list of Object.values(altsBySlug)) {
    for (const a of list) { if (!seen.has(a.slug)) { seen.add(a.slug); shared.push(a); if (shared.length >= 6) break } }
    if (shared.length >= 6) break
  }
  altsBySlug._shared = shared

  return { cols, altsBySlug }
}

/* ── Page ─────────────────────────────────────────────────── */
export default async function CompareCompaniesRoute({ params }: { params: Promise<Params> }) {
  const { slugs: rawSegments } = await params
  const slugs = parseCompareSlugs(rawSegments)
  const { cols, altsBySlug } = await fetchCompareData(slugs)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Compare Companies', item: `${SITE}/compare-companies` },
      ...(cols.length >= 2
        ? [{ '@type': 'ListItem', position: 3, name: cols.map((c) => c.companyName).join(' vs '), item: `${SITE}${buildCompareUrl(cols.map((c) => c.slug))}` }]
        : []),
    ],
  }

  return (
    <>
      <Navbar />
      <Script id="ld-compare-companies-breadcrumb" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <CompareCompaniesPage initialCols={cols} initialAlts={altsBySlug} requestedSlugs={slugs} maxCompare={MAX_COMPARE} />
      <Footer />
    </>
  )
}
