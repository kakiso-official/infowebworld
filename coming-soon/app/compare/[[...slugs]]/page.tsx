import type { Metadata } from 'next'
import Script from 'next/script'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { query } from '../../../lib/db'
import {
  parseCompareSlugs,
  buildCompareUrl,
  MAX_COMPARE,
  type CompareCol,
  type CompareAlternative,
  type AlternativesBySlug,
  type CompareReview,
} from '../lib'
import ComparePage from '../ComparePage'

/* ─────────────────────────────────────────────────────────────
   /compare/[[...slugs]] — server entry for the comparison flow.

   Single optional catch-all so /compare AND /compare/<slug>-vs-<slug>
   render the same component with different initialData. All data is
   fetched server-side (zero client API waterfall) and passed to the
   client component as initialCols + initialAlts.

   Indexing policy: genuine 2-4 product comparisons (every slug resolves to a
   real active listing) are index + follow; the empty /compare, invalid-slug,
   and single-product variants stay noindex (thin, or they duplicate the
   /listing page). Quota stays safe because only link-discovered comparisons
   get crawled - arbitrary user-built combos aren't linked anywhere.
   ───────────────────────────────────────────────────────────── */

export const dynamic = 'force-dynamic'

const SITE = 'https://infowebworld.com'
const YEAR = new Date().getFullYear()

type Params = { slugs?: string[] }

/* ── Metadata ─────────────────────────────────────────────── */

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slugs: rawSegments } = await params
  const slugs = parseCompareSlugs(rawSegments)

  if (slugs.length === 0) {
    return {
      title: 'Compare Products Side-by-Side | InfoWebWorld',
      description: 'Compare up to 4 products head-to-head — features, pricing, reviews, integrations, alternatives. Pick from thousands of verified listings.',
      alternates: { canonical: `${SITE}/compare` },
      robots: { index: false, follow: false },
    }
  }

  // Look up display names for the title (slim query)
  const placeholders = slugs.map(() => '?').join(',')
  let names: { slug: string; company_name: string }[] = []
  try {
    names = await query<{ slug: string; company_name: string }>(
      `SELECT slug, company_name FROM submissions
       WHERE slug IN (${placeholders})
         AND status IN ('active','paid')
         AND COALESCE(listing_mode,'product') = 'product'`,
      slugs
    )
  } catch { /* tolerate */ }

  const bySlug = new Map(names.map(r => [r.slug, r.company_name]))
  const resolved = slugs.map(s => bySlug.get(s)).filter((n): n is string => !!n)

  if (resolved.length === 0) {
    return {
      title: 'Compare Products Side-by-Side | InfoWebWorld',
      description: 'Compare up to 4 products head-to-head — features, pricing, reviews, integrations.',
      alternates: { canonical: `${SITE}/compare` },
      robots: { index: false, follow: false },
    }
  }

  const titleNames = resolved.length === 1
    ? resolved[0]
    : resolved.join(' vs ')
  const title = resolved.length === 1
    ? `${resolved[0]} — Compare Pricing, Features & Reviews | InfoWebWorld`
    : `${titleNames} Comparison (${YEAR}) | InfoWebWorld`
  const description = resolved.length === 1
    ? `Compare ${resolved[0]} against alternatives — features, pricing, reviews, integrations. Add up to 4 products to your side-by-side view.`
    : `${titleNames} compared head-to-head — features, pricing, reviews, integrations. Updated ${YEAR}.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE}${buildCompareUrl(slugs)}` },
    /* Real multi-product comparisons (2-4 resolved listings) are indexable;
       a single resolved product isn't a comparison, so it stays noindex. */
    robots: resolved.length >= 2
      ? {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
        }
      : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: `${SITE}${buildCompareUrl(slugs)}`,
      siteName: 'InfoWebWorld',
      type: 'website',
    },
  }
}

/* ── Data layer ───────────────────────────────────────────── */

/* Coerces a mysql2 JSON column (returned as a string in some configs,
   parsed object in others) into a typed array. Empty / null / malformed
   inputs all collapse to []. */
function parseJsonArray<T = unknown>(raw: unknown): T[] {
  if (raw == null) return []
  if (Array.isArray(raw)) return raw as T[]
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return []
    try {
      const parsed = JSON.parse(trimmed)
      return Array.isArray(parsed) ? (parsed as T[]) : []
    } catch { return [] }
  }
  return []
}

function tinyToBool(v: unknown): boolean {
  return v === 1 || v === '1' || v === true
}

/** Tolerate FAQ entries stored as either `{q, a}` (Gemini / new form) or
    `{question, answer}` (legacy form input). Same normalisation the
    listing page does internally — keeps both surfaces consistent. */
function normalizeFaqs(raw: unknown): { q: string; a: string }[] {
  const arr = parseJsonArray<unknown>(raw)
  return arr.map(item => {
    if (!item || typeof item !== 'object') return null
    const o = item as { q?: unknown; a?: unknown; question?: unknown; answer?: unknown }
    const q = typeof o.q === 'string' ? o.q : (typeof o.question === 'string' ? o.question : '')
    const a = typeof o.a === 'string' ? o.a : (typeof o.answer === 'string' ? o.answer : '')
    if (!q.trim() || !a.trim()) return null
    return { q: q.trim(), a: a.trim() }
  }).filter((x): x is { q: string; a: string } => !!x)
}

/* normalize integrations — tolerate legacy string[] payloads */
function normalizeIntegrations(raw: unknown): { name: string; website?: string; description?: string }[] {
  const arr = parseJsonArray<unknown>(raw)
  return arr.map(item => {
    if (typeof item === 'string') {
      const t = item.trim()
      return t ? { name: t } : null
    }
    if (item && typeof item === 'object') {
      const o = item as { name?: unknown; website?: unknown; description?: unknown }
      const name = typeof o.name === 'string' ? o.name.trim() : ''
      if (!name) return null
      return {
        name,
        website: typeof o.website === 'string' ? o.website.trim() : undefined,
        description: typeof o.description === 'string' ? o.description.trim() : undefined,
      }
    }
    return null
  }).filter((x): x is { name: string; website?: string; description?: string } => !!x)
}

type SubRow = {
  id: number
  slug: string
  company_name: string
  logo_url: string | null
  tagline: string | null
  description: string | null
  website: string | null
  founded: number | null                    // mapped from founded_year
  employees: string | null                  // mapped from team_size
  hq_location: string | null
  plan: string | null                       // joined from plans.name
  verified: number | null
  header_tags?: unknown
  pros?: unknown
  cons?: unknown
  features?: unknown
  key_features?: unknown
  integrations?: unknown
  pricing_tiers?: unknown
  screenshots?: unknown
  faqs?: unknown
  support_channels?: unknown
  training_options?: unknown
  industries_served?: unknown
  use_cases?: unknown
  target_company_sizes?: unknown
  languages?: unknown
  compliance?: unknown
  awards?: unknown
  starting_price?: string | null
  starting_price_period?: string | null
  has_free_trial?: number | null
  has_free_version?: number | null
  has_ios_app?: number | null
  has_android_app?: number | null
  category_id: number | null
  category_name: string | null
  category_slug: string | null
  category_color: string | null
  sector_slug: string | null
}

type ReviewAggRow = {
  listing_id: number
  avg_rating: number | string | null
  review_count: number
  r5: number; r4: number; r3: number; r2: number; r1: number
}

type RecentReviewRow = {
  listing_id: number
  id: number
  rating: number
  title: string
  body: string
  created_at: string
  user_name: string | null
  user_avatar: string | null
}

type AltRow = {
  slug: string
  company_name: string
  logo_url: string | null
  website: string | null
  tagline: string | null
  category_name: string | null
  category_slug: string | null
  category_color: string | null
  avg_rating: number | string | null
  review_count: number
}

function mapAltRow(r: AltRow): CompareAlternative {
  return {
    slug: r.slug,
    companyName: r.company_name,
    logoUrl: r.logo_url,
    website: r.website,
    tagline: r.tagline,
    categoryName: r.category_name,
    categorySlug: r.category_slug,
    categoryColor: r.category_color,
    ratingAvg: r.avg_rating != null ? Number(r.avg_rating) : 0,
    ratingCount: Number(r.review_count ?? 0),
  }
}

async function fetchCompareData(slugs: string[]): Promise<{
  cols: CompareCol[]
  altsBySlug: AlternativesBySlug
}> {
  if (slugs.length === 0) return { cols: [], altsBySlug: {} as AlternativesBySlug }

  const placeholders = slugs.map(() => '?').join(',')

  // Main row fetch — column-aliased so my code names stay clean even though
  // the DB columns are founded_year / team_size.
  // Defensive try/catch: any "Unknown column" error (pre-migration installs
  // missing v3 / fix-all-columns migrations) falls back to a minimal SELECT
  // that only references columns guaranteed by schema.sql.
  let rows: SubRow[] = []
  try {
    rows = await query<SubRow>(
      `SELECT s.id, s.slug, s.company_name, s.logo_url, s.tagline, s.description, s.website,
              s.founded_year AS founded,
              s.team_size AS employees,
              s.hq_location,
              p.name AS plan,
              COALESCE(s.verified, 0) AS verified,
              s.header_tags, s.pros, s.cons, s.features, s.key_features, s.integrations,
              s.pricing_tiers, s.screenshots, s.faqs,
              s.support_channels, s.training_options, s.industries_served, s.use_cases,
              s.target_company_sizes, s.languages, s.compliance, s.awards,
              s.starting_price, s.starting_price_period,
              COALESCE(s.has_free_trial, 0) AS has_free_trial,
              COALESCE(s.has_free_version, 0) AS has_free_version,
              COALESCE(s.has_ios_app, 0) AS has_ios_app,
              COALESCE(s.has_android_app, 0) AS has_android_app,
              c.id AS category_id, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
              CASE WHEN c.level = 1 THEN c.slug
                   WHEN c.level = 2 THEN cp.slug
                   WHEN c.level = 3 THEN cgp.slug
                   WHEN c.level = 4 THEN cggp.slug
                   WHEN c.level = 5 THEN cgggp.slug
                   ELSE NULL END AS sector_slug
       FROM submissions s
       LEFT JOIN categories c     ON c.id     = s.category_id
       LEFT JOIN categories cp    ON cp.id    = c.parent_id
       LEFT JOIN categories cgp   ON cgp.id   = cp.parent_id
       LEFT JOIN categories cggp  ON cggp.id  = cgp.parent_id
       LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id
       LEFT JOIN plans p ON p.id = s.plan_id
       WHERE s.slug IN (${placeholders})
         AND s.status IN ('active','paid')
         AND COALESCE(s.listing_mode,'product') = 'product'`,
      slugs
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('Unknown column')) {
      // Pre-migration fallback (v3 / S36 columns missing). Still includes
      // every v2-era column (logo_url, screenshots, features, integrations,
      // pricing_tiers, faqs, hq_location) so the page renders almost
      // everything except the v3-specific richness. Critical: screenshots
      // MUST be in this SELECT — the user's complaint was real screenshots
      // not showing, which happens when this fallback strips them.
      const legacy = await query<Partial<SubRow>>(
        `SELECT s.id, s.slug, s.company_name, s.logo_url, s.tagline, s.description, s.website,
                s.founded_year AS founded,
                s.team_size AS employees,
                s.hq_location,
                s.screenshots, s.features, s.integrations, s.pricing_tiers, s.faqs,
                p.name AS plan,
                c.id AS category_id, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
                CASE WHEN c.level = 1 THEN c.slug
                     WHEN c.level = 2 THEN cp.slug
                     WHEN c.level = 3 THEN cgp.slug
                     WHEN c.level = 4 THEN cggp.slug
                     WHEN c.level = 5 THEN cgggp.slug
                     ELSE NULL END AS sector_slug
         FROM submissions s
         LEFT JOIN categories c     ON c.id     = s.category_id
         LEFT JOIN categories cp    ON cp.id    = c.parent_id
         LEFT JOIN categories cgp   ON cgp.id   = cp.parent_id
         LEFT JOIN categories cggp  ON cggp.id  = cgp.parent_id
         LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id
         LEFT JOIN plans p ON p.id = s.plan_id
         WHERE s.slug IN (${placeholders})
           AND s.status IN ('active','paid')`,
        slugs
      )
      rows = legacy as SubRow[]
    } else {
      throw err
    }
  }

  if (rows.length === 0) return { cols: [], altsBySlug: {} as AlternativesBySlug }

  const ids = rows.map(r => r.id)
  const idPlaceholders = ids.map(() => '?').join(',')

  // Reviews aggregate + recent reviews + pros/cons quote pools — all in parallel
  let aggRows: ReviewAggRow[] = []
  let recentRows: RecentReviewRow[] = []
  let proRows: RecentReviewRow[] = []
  let conRows: RecentReviewRow[] = []
  try {
    const [agg, recent, pros, cons] = await Promise.all([
      query<ReviewAggRow>(
        `SELECT listing_id,
                AVG(rating) AS avg_rating,
                COUNT(*) AS review_count,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS r5,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS r4,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS r3,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS r2,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS r1
         FROM reviews
         WHERE listing_id IN (${idPlaceholders}) AND status = 'approved'
         GROUP BY listing_id`,
        ids
      ),
      query<RecentReviewRow>(
        `SELECT r.listing_id, r.id, r.rating, r.title, r.body, r.created_at,
                u.name AS user_name, u.avatar_url AS user_avatar
         FROM reviews r
         LEFT JOIN business_users u ON u.id = r.user_id
         WHERE r.listing_id IN (${idPlaceholders}) AND r.status = 'approved'
         ORDER BY r.created_at DESC
         LIMIT 20`,
        ids
      ),
      // High-rated reviews → Pros pool
      query<RecentReviewRow>(
        `SELECT r.listing_id, r.id, r.rating, r.title, r.body, r.created_at,
                u.name AS user_name, u.avatar_url AS user_avatar
         FROM reviews r
         LEFT JOIN business_users u ON u.id = r.user_id
         WHERE r.listing_id IN (${idPlaceholders})
           AND r.status = 'approved' AND r.rating >= 4
         ORDER BY r.rating DESC, r.created_at DESC
         LIMIT ${Math.max(12, ids.length * 4)}`,
        ids
      ),
      // Low-rated reviews → Cons pool
      query<RecentReviewRow>(
        `SELECT r.listing_id, r.id, r.rating, r.title, r.body, r.created_at,
                u.name AS user_name, u.avatar_url AS user_avatar
         FROM reviews r
         LEFT JOIN business_users u ON u.id = r.user_id
         WHERE r.listing_id IN (${idPlaceholders})
           AND r.status = 'approved' AND r.rating <= 3
         ORDER BY r.rating ASC, r.created_at DESC
         LIMIT ${Math.max(12, ids.length * 4)}`,
        ids
      ),
    ])
    aggRows = agg
    recentRows = recent
    proRows = pros
    conRows = cons
  } catch {
    // reviews table missing on older installs — no aggregate
  }

  const aggByListing = new Map(aggRows.map(r => [r.listing_id, r]))
  const toQuote = (r: RecentReviewRow): CompareReview => ({
    id: r.id, rating: r.rating, title: r.title, body: r.body,
    createdAt: r.created_at, userName: r.user_name, userAvatar: r.user_avatar,
  })

  const partition = (rows: RecentReviewRow[], cap: number) => {
    const map = new Map<number, CompareReview[]>()
    for (const r of rows) {
      const list = map.get(r.listing_id) || []
      if (list.length < cap) list.push(toQuote(r))
      map.set(r.listing_id, list)
    }
    return map
  }
  const recentByListing = partition(recentRows, 3)
  const proByListing    = partition(proRows, 3)
  const conByListing    = partition(conRows, 3)

  // Build CompareCol[] in the order requested
  const bySlug = new Map(rows.map(r => [r.slug, r]))
  const cols: CompareCol[] = slugs
    .map(s => bySlug.get(s))
    .filter((r): r is SubRow => !!r)
    .map(r => {
      const agg = aggByListing.get(r.id)
      return {
        id: r.id,
        slug: r.slug,
        companyName: r.company_name,
        logoUrl: r.logo_url,
        tagline: r.tagline,
        description: r.description,
        website: r.website,
        founded: r.founded,
        employees: r.employees,
        hqLocation: r.hq_location,
        plan: r.plan || 'free',
        verified: tinyToBool(r.verified),
        category: r.category_id ? {
          id: r.category_id,
          name: r.category_name || '',
          slug: r.category_slug || '',
          color: r.category_color || '#E8553D',
        } : null,
        sectorSlug: r.sector_slug || null,
        ratingAvg: agg?.avg_rating != null ? Number(agg.avg_rating) : 0,
        ratingCount: Number(agg?.review_count ?? 0),
        ratingDist: agg
          ? [Number(agg.r5), Number(agg.r4), Number(agg.r3), Number(agg.r2), Number(agg.r1)]
          : [0, 0, 0, 0, 0],
        recentReviews: recentByListing.get(r.id) || [],
        topPros: proByListing.get(r.id) || [],
        topCons: conByListing.get(r.id) || [],
        lastReviewAt: (recentByListing.get(r.id) || [])[0]?.createdAt ?? null,
        headerTags: parseJsonArray<string>(r.header_tags),
        pros: parseJsonArray<string>(r.pros),
        cons: parseJsonArray<string>(r.cons),
        features: parseJsonArray<string>(r.features),
        keyFeatures: parseJsonArray<{ name: string; description: string }>(r.key_features),
        integrations: normalizeIntegrations(r.integrations),
        pricingTiers: parseJsonArray<{ name: string; price: string; period: string; features?: string[] }>(r.pricing_tiers),
        screenshots: parseJsonArray<string>(r.screenshots),
        faqs: normalizeFaqs(r.faqs),
        supportChannels: parseJsonArray<string>(r.support_channels),
        trainingOptions: parseJsonArray<string>(r.training_options),
        industriesServed: parseJsonArray<string>(r.industries_served),
        useCases: parseJsonArray<string>(r.use_cases),
        targetCompanySizes: parseJsonArray<string>(r.target_company_sizes),
        languages: parseJsonArray<string>(r.languages),
        compliance: parseJsonArray<string>(r.compliance),
        awards: parseJsonArray<{ name: string; year?: number }>(r.awards),
        startingPrice: r.starting_price != null ? String(r.starting_price) : null,
        startingPricePeriod: r.starting_price_period ?? null,
        hasFreeTrial: tinyToBool(r.has_free_trial),
        hasFreeVersion: tinyToBool(r.has_free_version),
        hasIosApp: tinyToBool(r.has_ios_app),
        hasAndroidApp: tinyToBool(r.has_android_app),
      }
    })

  // Alternatives — fetch per-column siblings in parallel. Each column
  // gets up to 3 alternatives IN ITS OWN CATEGORY (GetApp pattern: the
  // Alternatives column for "Zoho CRM" shows CRM siblings; the column
  // for "HubSpot CRM" shows the same CRM space siblings minus HubSpot).
  // A union list is built as `_shared` for the right-rail widget.
  const altsBySlug: AlternativesBySlug = {} as AlternativesBySlug
  const excludeIds = ids.map(() => '?').join(',')
  const buildAltSql = () => `
    SELECT s.slug, s.company_name, s.logo_url, s.website, s.tagline,
           c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
           (SELECT AVG(rating) FROM reviews WHERE listing_id = s.id AND status = 'approved') AS avg_rating,
           (SELECT COUNT(*) FROM reviews WHERE listing_id = s.id AND status = 'approved') AS review_count
    FROM submissions s
    LEFT JOIN categories c ON c.id = s.category_id
    WHERE s.category_id = ?
      AND s.id NOT IN (${excludeIds})
      AND s.status IN ('active','paid')
      AND COALESCE(s.listing_mode,'product') = 'product'
    ORDER BY review_count DESC, s.approved_at DESC
    LIMIT 4`
  const buildAltSqlNoReviews = () => `
    SELECT s.slug, s.company_name, s.logo_url, s.website, s.tagline,
           c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
           NULL AS avg_rating, 0 AS review_count
    FROM submissions s
    LEFT JOIN categories c ON c.id = s.category_id
    WHERE s.category_id = ?
      AND s.id NOT IN (${excludeIds})
      AND s.status IN ('active','paid')
    ORDER BY s.id DESC
    LIMIT 4`

  const altQueries = cols.map(async col => {
    if (!col.category) return { slug: col.slug, rows: [] as CompareAlternative[] }
    try {
      const altRows = await query<AltRow>(buildAltSql(), [col.category.id, ...ids])
      return { slug: col.slug, rows: altRows.map(mapAltRow) }
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('reviews')) {
        try {
          const altRows = await query<AltRow>(buildAltSqlNoReviews(), [col.category.id, ...ids])
          return { slug: col.slug, rows: altRows.map(mapAltRow) }
        } catch { return { slug: col.slug, rows: [] as CompareAlternative[] } }
      }
      return { slug: col.slug, rows: [] as CompareAlternative[] }
    }
  })
  const altResults = await Promise.all(altQueries)
  for (const { slug, rows: altRows } of altResults) {
    altsBySlug[slug] = altRows
  }

  // Shared union list for the right rail (dedup by slug)
  const seen = new Set<string>()
  const shared: CompareAlternative[] = []
  for (const list of Object.values(altsBySlug)) {
    for (const a of list) {
      if (!seen.has(a.slug)) {
        seen.add(a.slug)
        shared.push(a)
        if (shared.length >= 6) break
      }
    }
    if (shared.length >= 6) break
  }
  altsBySlug._shared = shared

  return { cols, altsBySlug }
}

/* ── Page ─────────────────────────────────────────────────── */

export default async function CompareRoute({ params }: { params: Promise<Params> }) {
  const { slugs: rawSegments } = await params
  const slugs = parseCompareSlugs(rawSegments)
  const { cols, altsBySlug } = await fetchCompareData(slugs)

  // BreadcrumbList JSON-LD (always; helps when noindex is flipped later)
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: `${SITE}/compare` },
      ...(cols.length >= 2
        ? [{ '@type': 'ListItem', position: 3, name: cols.map(c => c.companyName).join(' vs '), item: `${SITE}${buildCompareUrl(cols.map(c => c.slug))}` }]
        : []),
    ],
  }

  return (
    <>
      <Navbar />
      <Script id="ld-compare-breadcrumb" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ComparePage
        initialCols={cols}
        initialAlts={altsBySlug}
        requestedSlugs={slugs}
        maxCompare={MAX_COMPARE}
      />
      <Footer />
    </>
  )
}
