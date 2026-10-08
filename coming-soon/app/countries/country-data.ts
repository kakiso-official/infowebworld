/* ═══════════════════════════════════════════════════════════════════════
   Server-only data module for the country directory pages:

     /countries                                    getCountriesWithListings
     /{country}-business-directory                 getCountryBySlug + sector mix
     /{country}-business-directory/{sectorSegment} getCountryListings (paginated)

   Mirrors the SQL patterns in app/sector-landing/queries.ts (ancestor
   walk c/p1../p4 to attribute an L4/L5 listing back to its L1 sector) and
   the catch-all's listing SELECT (app/[...segments]/page.tsx ~432-560),
   but scoped by country_id instead of category. Never imported from a
   Client Component.

   PII: submissions holds contact_name/email/phone/phone_code/ip_address/
   user_agent/notes/paypal_order_id/user_id — none of those are selected
   below. ListingRow only carries the explicit safe column list the task
   spec names; mapRow() (app/iww-hq/data/submissions-storage.ts) defaults
   every field it doesn't find to '' / [], so rows shaped this way still
   map cleanly for RealListingCard.
   ═══════════════════════════════════════════════════════════════════════ */

import { query, queryOne } from '@/lib/db'
import { unstable_cache } from 'next/cache'
import { countryDisplayName, countrySlug, COUNTRY_PAGE_MIN_LISTINGS, SECTOR_ORDER } from '@/lib/country-paths'
import type { ReviewRow } from '../test-landing-page/NewReviewsSection'

export type CountryInfo = {
  id: number
  /** Display name — full name, never a DB shorthand ('UAE' -> 'United Arab Emirates'). */
  name: string
  /** Name exactly as stored in `countries.name`. */
  dbName: string
  code: string
  /** Canonical URL slug. */
  slug: string
  listings: number
}

export type SectorCount = { sector: string; listings: number }

export type CategoryCount = {
  id: number
  name: string
  slug: string
  level: number
  sector: string
  listings: number
}

export type CityCount = { city: string; listings: number }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ListingRow = Record<string, any>

export type CountryReviewStats = { avg: number; count: number }

/** Re-export under the country-module's own name (same shape the sector
 *  landing's NewReviewsSection already renders — see its `reviews` prop). */
export type CountryReview = ReviewRow

/* ── Shared descendant-walk SQL fragments ───────────────────────────────
   A listing's sector is the L1 ancestor of its category (c -> p1 -> p2 ->
   p3 -> p4 via parent_id). These joins + CASE are reused by every fetcher
   below that needs to know a listing's sector or roll counts up to it. */
const SECTOR_JOINS = `
         LEFT JOIN categories c   ON c.id  = s.category_id
         LEFT JOIN categories p1  ON p1.id = c.parent_id
         LEFT JOIN categories p2  ON p2.id = p1.parent_id
         LEFT JOIN categories p3  ON p3.id = p2.parent_id
         LEFT JOIN categories p4  ON p4.id = p3.parent_id`

const SECTOR_SLUG_EXPR = `CASE
          WHEN c.level  = 1 THEN c.slug
          WHEN p1.level = 1 THEN p1.slug
          WHEN p2.level = 1 THEN p2.slug
          WHEN p3.level = 1 THEN p3.slug
          WHEN p4.level = 1 THEN p4.slug
        END`

/** WHERE fragment matching a listing to one sector slug (bind the slug 5x). */
const SECTOR_MATCH = `(c.slug = ? OR p1.slug = ? OR p2.slug = ? OR p3.slug = ? OR p4.slug = ?)`

function sectorBinds(sectorSlug: string): string[] {
  return [sectorSlug, sectorSlug, sectorSlug, sectorSlug, sectorSlug]
}

/* ── Country list (shared by the index page + slug lookups) ─────────────
   One cached query backs both getCountriesWithListings and
   getCountryBySlug so they can never drift out of sync. */
async function fetchCountriesWithListings(): Promise<CountryInfo[]> {
  const rows = await query<{ id: number; name: string; code: string; n: number | string }>(
    `SELECT co.id, co.name, co.code, COUNT(s.id) AS n
       FROM countries co
       JOIN submissions s ON s.country_id = co.id AND s.status IN ('active', 'paid')
      WHERE co.code <> 'XX' AND co.name <> 'Other'
      GROUP BY co.id, co.name, co.code
     HAVING n >= ?
      ORDER BY n DESC, co.name`,
    [COUNTRY_PAGE_MIN_LISTINGS]
  )
  return rows.map(r => {
    const name = countryDisplayName(r.name)
    return {
      id: Number(r.id),
      name,
      dbName: r.name,
      code: r.code,
      slug: countrySlug(r.name),
      listings: Number(r.n),
    }
  })
}

const getCountriesWithListingsCached = unstable_cache(
  fetchCountriesWithListings,
  ['country-dir-v1-countries-with-listings'],
  { revalidate: 600 }
)

/** Every country with live listings, desc by listings then name. Throws
 *  on DB failure — country pages must 500 (and get retried), never
 *  manufacture a soft-404 from a transient blip. */
export async function getCountriesWithListings(): Promise<CountryInfo[]> {
  return getCountriesWithListingsCached()
}

/** A country by its canonical slug, or the alias slug of its stored name
 *  ('uae' matches the row stored as 'UAE'). null = no such country with
 *  listings. Throws on DB failure. */
export async function getCountryBySlug(slug: string): Promise<CountryInfo | null> {
  const countries = await getCountriesWithListingsCached()
  const direct = countries.find(c => c.slug === slug)
  if (direct) return direct
  /* countrySlug() applies the display-name override ('UAE' → 'united-arab-emirates'),
     so slugify the stored name itself to recognise the short alias. */
  const alias = countries.find(
    c => c.dbName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === slug,
  )
  return alias ?? null
}

/* ── Sector mix for one country ─────────────────────────────────────── */

async function fetchCountrySectorCounts(countryId: number): Promise<SectorCount[]> {
  const rows = await query<{ sector: string | null; n: number | string }>(
    `SELECT ${SECTOR_SLUG_EXPR} AS sector, COUNT(*) AS n
       FROM submissions s
       ${SECTOR_JOINS}
      WHERE s.status IN ('active', 'paid') AND s.country_id = ?
      GROUP BY sector`,
    [countryId]
  )
  const counts = new Map<string, number>()
  for (const r of rows) {
    if (r.sector) counts.set(r.sector, Number(r.n))
  }
  return SECTOR_ORDER.map(sector => ({ sector, listings: counts.get(sector) ?? 0 }))
}

export const getCountrySectorCounts = unstable_cache(
  fetchCountrySectorCounts,
  ['country-dir-v1-sector-counts'],
  { revalidate: 600 }
)

/* ── Every country x sector pair with listings (sitemap) ────────────── */

async function fetchCountrySectorPairs(): Promise<{ countryId: number; sector: string; listings: number }[]> {
  const rows = await query<{ country_id: number; sector: string | null; n: number | string }>(
    `SELECT s.country_id, ${SECTOR_SLUG_EXPR} AS sector, COUNT(*) AS n
       FROM submissions s
       JOIN countries co ON co.id = s.country_id AND co.code <> 'XX' AND co.name <> 'Other'
       ${SECTOR_JOINS}
      WHERE s.status IN ('active', 'paid')
      GROUP BY s.country_id, sector
     HAVING sector IS NOT NULL AND n >= 1`
  )
  return rows.map(r => ({ countryId: Number(r.country_id), sector: String(r.sector), listings: Number(r.n) }))
}

export const getCountrySectorPairs = unstable_cache(
  fetchCountrySectorPairs,
  ['country-dir-v1-sector-pairs'],
  { revalidate: 600 }
)

/* ── Top categories in a country (whole-subtree rollup) ─────────────── */

async function fetchCountryTopCategories(
  countryId: number,
  sector: string | null,
  level: 2 | 3,
  limit: number
): Promise<CategoryCount[]> {
  try {
    /* Roll a listing's count up to its level-2 or level-3 ancestor: find
       the ancestor at the target level by walking up from the listing's
       own category (which may itself be L2-L5), then group by that
       ancestor. The "ancestor at level N" is whichever of c/p1..p4 has
       c.level/p*.level === level AND the whole chain still bottoms out in
       the right sector when `sector` is given. */
    const ancestorAtLevel = `CASE
          WHEN c.level  = ${level} THEN c.id
          WHEN p1.level = ${level} THEN p1.id
          WHEN p2.level = ${level} THEN p2.id
          WHEN p3.level = ${level} THEN p3.id
          WHEN p4.level = ${level} THEN p4.id
        END`
    const sectorFilter = sector ? `AND ${SECTOR_MATCH}` : ''
    const binds: (string | number)[] = [countryId]
    if (sector) binds.push(...sectorBinds(sector))

    const rows = await query<{ cat_id: number; n: number | string }>(
      `SELECT ${ancestorAtLevel} AS cat_id, COUNT(*) AS n
         FROM submissions s
         ${SECTOR_JOINS}
        WHERE s.status IN ('active', 'paid') AND s.country_id = ?
          ${sectorFilter}
        GROUP BY cat_id
       HAVING cat_id IS NOT NULL
        ORDER BY n DESC
        LIMIT ?`,
      [...binds, limit]
    )
    if (!rows.length) return []

    const ids = rows.map(r => Number(r.cat_id))
    const placeholders = ids.map(() => '?').join(',')
    const cats = await query<{
      id: number; name: string; slug: string; level: number
      sector_slug: string | null
    }>(
      `SELECT cc.id, cc.name, cc.slug, cc.level,
              CASE
                WHEN cc.level = 1 THEN cc.slug
                WHEN pp1.level = 1 THEN pp1.slug
                WHEN pp2.level = 1 THEN pp2.slug
                WHEN pp3.level = 1 THEN pp3.slug
                WHEN pp4.level = 1 THEN pp4.slug
              END AS sector_slug
         FROM categories cc
         LEFT JOIN categories pp1 ON pp1.id = cc.parent_id
         LEFT JOIN categories pp2 ON pp2.id = pp1.parent_id
         LEFT JOIN categories pp3 ON pp3.id = pp2.parent_id
         LEFT JOIN categories pp4 ON pp4.id = pp3.parent_id
        WHERE cc.id IN (${placeholders})`,
      ids
    )
    const byId = new Map(cats.map(c => [Number(c.id), c]))
    const countById = new Map(rows.map(r => [Number(r.cat_id), Number(r.n)]))

    return ids
      .map(id => {
        const cat = byId.get(id)
        if (!cat) return null
        return {
          id,
          name: cat.name,
          slug: cat.slug,
          level: Number(cat.level),
          sector: cat.sector_slug || sector || '',
          listings: countById.get(id) ?? 0,
        }
      })
      .filter((c): c is CategoryCount => c != null && c.listings > 0)
      .sort((a, b) => b.listings - a.listings)
  } catch (err) {
    console.warn('[countries] getCountryTopCategories failed:', err)
    return []
  }
}

export const getCountryTopCategories = unstable_cache(
  fetchCountryTopCategories,
  ['country-dir-v1-top-categories'],
  { revalidate: 600 }
)

/* ── Cities in a country ─────────────────────────────────────────────
   City is free text (e.g. 'Bangalore' / 'Bengaluru' both exist) — group
   by trimmed, case-insensitive value but display the most common casing
   actually stored for that group. */

/* Old or alternative city names → the name used in display. */
const CITY_ALIASES: Record<string, string> = {
  bangalore: 'Bengaluru',
  bombay: 'Mumbai',
  calcutta: 'Kolkata',
  madras: 'Chennai',
  gurgaon: 'Gurugram',
  'new york city': 'New York',
  nyc: 'New York',
}

async function fetchCountryCities(countryId: number, sector: string | null, limit: number): Promise<CityCount[]> {
  try {
    const sectorFilter = sector ? `AND ${SECTOR_MATCH}` : ''
    const binds: (string | number)[] = [countryId]
    if (sector) binds.push(...sectorBinds(sector))

    const rows = await query<{ city: string; n: number | string }>(
      `SELECT TRIM(s.city) AS city, COUNT(*) AS n
         FROM submissions s
         ${SECTOR_JOINS}
        WHERE s.status IN ('active', 'paid') AND s.country_id = ?
          AND TRIM(COALESCE(s.city, '')) <> ''
          ${sectorFilter}
        GROUP BY LOWER(TRIM(s.city))
        ORDER BY n DESC
        LIMIT ?`,
      [...binds, limit * 3 + 10]
    )
    /* City is free text, so one city can arrive under two names
       ('Bangalore' / 'Bengaluru'); merge the common ones before ranking. */
    const merged = new Map<string, CityCount>()
    for (const r of rows) {
      const city = CITY_ALIASES[r.city.toLowerCase()] ?? r.city
      const key = city.toLowerCase()
      const prev = merged.get(key)
      merged.set(key, { city: prev?.city ?? city, listings: (prev?.listings ?? 0) + Number(r.n) })
    }
    return [...merged.values()]
      .sort((a, b) => b.listings - a.listings || a.city.localeCompare(b.city))
      .slice(0, limit)
  } catch (err) {
    console.warn('[countries] getCountryCities failed:', err)
    return []
  }
}

export const getCountryCities = unstable_cache(
  fetchCountryCities,
  ['country-dir-v2-cities'],
  { revalidate: 600 }
)

/* ── Listing SELECT (shared shape) ───────────────────────────────────
   Explicit safe column list — NEVER s.* — matching the task's PII rule
   (no contact_name/email/phone/phone_code/ip_address/user_agent/notes/
   paypal_order_id/user_id) and the catch-all's own listing SELECT. */
const LISTING_COLUMNS = `
    s.id, s.slug, s.company_name, s.website, s.category_id, s.city, s.state,
    s.tagline, s.description, s.logo_url, s.screenshots, s.features,
    s.pricing_model, s.founded_year, s.team_size, s.hq_location,
    s.header_tags, s.pros, s.industries_served, s.key_features,
    s.starting_price, s.starting_price_period, s.has_free_trial, s.has_free_version,
    s.compliance, s.awards, s.status, s.created_at, s.approved_at, s.verified,
    s.listing_mode, s.is_hiring, s.min_project_size, s.hourly_rate,
    s.common_project_size, s.service_lines, s.client_logos,
    s.lb_price_range, s.lb_photos, s.lb_hours, s.lb_design_mode`

function listingSelectSql(extraWhere: string): string {
  return `
    SELECT ${LISTING_COLUMNS},
           co.name AS country_name,
           c.name AS category_name, c.slug AS category_slug,
           c.color AS category_color, c.icon AS category_icon,
           p.slug AS plan_slug,
           ${SECTOR_SLUG_EXPR} AS sector_slug,
           (SELECT COUNT(*) FROM reviews r WHERE r.listing_id = s.id AND r.status = 'approved') AS review_count,
           (SELECT AVG(r.rating) FROM reviews r WHERE r.listing_id = s.id AND r.status = 'approved') AS review_avg,
           (SELECT r.title FROM reviews r WHERE r.listing_id = s.id AND r.status = 'approved' ORDER BY r.created_at DESC LIMIT 1) AS latest_review_title,
           (SELECT u.name FROM reviews r JOIN business_users u ON u.id = r.user_id WHERE r.listing_id = s.id AND r.status = 'approved' ORDER BY r.created_at DESC LIMIT 1) AS latest_review_author
      FROM submissions s
      ${SECTOR_JOINS}
      LEFT JOIN countries co ON co.id = s.country_id
      LEFT JOIN plans p ON p.id = s.plan_id
     WHERE s.status IN ('active', 'paid')
       ${extraWhere}`
}

/** JSON.parse(JSON.stringify(...)) makes Dates -> ISO strings and
 *  DECIMAL-as-string columns stay strings (already JSON-safe); every
 *  value here is already a plain string/number/null so this is just the
 *  same serialization guarantee the catch-all's fetchCategoryPageData
 *  gives its payload. */
function serializeRows(rows: Record<string, unknown>[]): ListingRow[] {
  return JSON.parse(JSON.stringify(rows))
}

const ORDER_BY = `ORDER BY (COALESCE(p.price, 0) > 0) DESC, s.verified DESC, review_count DESC, s.approved_at DESC, s.id DESC`

/** One page of listings in a sector, in a country. Throws on DB failure —
 *  a sector page's listing total gates indexing, so a failed count must
 *  not silently render as "0 listings, noindex". */
async function fetchCountryListings(
  countryId: number,
  sector: string,
  page: number,
  perPage: number
): Promise<{ rows: ListingRow[]; total: number }> {
  const offset = Math.max(0, (page - 1) * perPage)
  const binds = [countryId, ...sectorBinds(sector)]

  const [rows, countRow] = await Promise.all([
    query<Record<string, unknown>>(
      `${listingSelectSql(`AND s.country_id = ? AND ${SECTOR_MATCH}`)}
        ${ORDER_BY}
        LIMIT ? OFFSET ?`,
      [...binds, perPage, offset]
    ),
    queryOne<{ cnt: number | string }>(
      `SELECT COUNT(*) AS cnt
         FROM submissions s
         ${SECTOR_JOINS}
        WHERE s.status IN ('active', 'paid') AND s.country_id = ? AND ${SECTOR_MATCH}`,
      binds
    ),
  ])

  return { rows: serializeRows(rows), total: Number(countRow?.cnt ?? 0) }
}

export const getCountryListings = unstable_cache(
  fetchCountryListings,
  ['country-dir-v1-listings'],
  { revalidate: 600 }
)

/** Featured listings across all sectors in a country (hub page). [] on failure. */
async function fetchCountryFeatured(countryId: number, limit: number): Promise<ListingRow[]> {
  try {
    const rows = await query<Record<string, unknown>>(
      `${listingSelectSql('AND s.country_id = ?')}
        ${ORDER_BY}
        LIMIT ?`,
      [countryId, limit]
    )
    return serializeRows(rows)
  } catch (err) {
    console.warn('[countries] getCountryFeatured failed:', err)
    return []
  }
}

export const getCountryFeatured = unstable_cache(
  fetchCountryFeatured,
  ['country-dir-v1-featured'],
  { revalidate: 600 }
)

/** Newest-approved listings in a country, optionally scoped to one sector.
 *  [] on failure. */
async function fetchCountryRecent(countryId: number, sector: string | null, limit: number): Promise<ListingRow[]> {
  try {
    const sectorFilter = sector ? `AND ${SECTOR_MATCH}` : ''
    const binds: (string | number)[] = [countryId]
    if (sector) binds.push(...sectorBinds(sector))

    const rows = await query<Record<string, unknown>>(
      `${listingSelectSql(`AND s.country_id = ? ${sectorFilter}`)}
        ORDER BY COALESCE(s.approved_at, s.created_at) DESC, s.id DESC
        LIMIT ?`,
      [...binds, limit]
    )
    return serializeRows(rows)
  } catch (err) {
    console.warn('[countries] getCountryRecent failed:', err)
    return []
  }
}

export const getCountryRecent = unstable_cache(
  fetchCountryRecent,
  ['country-dir-v1-recent'],
  { revalidate: 600 }
)

/* ── Reviews + review stats in a country ─────────────────────────────
   No sitewide top-up (unlike getSectorReviewsWithTopUp) — a thin country
   page is meant to show only what's real for that country. */

async function fetchCountryReviews(countryId: number, sector: string | null, limit: number): Promise<CountryReview[]> {
  try {
    const sectorFilter = sector ? `AND ${SECTOR_MATCH}` : ''
    const binds: (string | number)[] = [countryId]
    if (sector) binds.push(...sectorBinds(sector))

    const rows = await query<{
      id: number; rating: number; title: string; body: string; created_at: string
      user_name: string | null; user_avatar: string | null
      listing_slug: string; listing_name: string; listing_logo: string | null
      listing_mode: 'product' | 'company' | string | null
    }>(
      /* The reviewer's email is never selected: the section doesn't render it. */
      `SELECT r.id, r.rating, r.title, r.body, r.created_at,
              u.name AS user_name, u.avatar_url AS user_avatar,
              s.slug AS listing_slug, s.company_name AS listing_name,
              s.logo_url AS listing_logo,
              COALESCE(s.listing_mode, 'product') AS listing_mode
         FROM reviews r
         JOIN business_users u ON u.id = r.user_id
         JOIN submissions    s ON s.id = r.listing_id
         ${SECTOR_JOINS}
        WHERE r.status = 'approved'
          AND s.status IN ('active', 'paid')
          AND s.country_id = ?
          ${sectorFilter}
        ORDER BY r.created_at DESC
        LIMIT ?`,
      [...binds, limit]
    )
    return rows.map(r => ({
      id: r.id,
      rating: Number(r.rating),
      title: r.title || '',
      body: r.body || '',
      created_at: r.created_at,
      user_name: r.user_name,
      user_avatar: r.user_avatar,
      user_email: null,
      listing_slug: r.listing_slug,
      listing_name: r.listing_name,
      listing_logo: r.listing_logo,
      listing_mode: (r.listing_mode === 'company' ? 'company' : 'product') as 'product' | 'company',
    }))
  } catch (err) {
    console.warn('[countries] getCountryReviews failed:', err)
    return []
  }
}

export const getCountryReviews = unstable_cache(
  fetchCountryReviews,
  ['country-dir-v1-reviews'],
  { revalidate: 600 }
)

async function fetchCountryReviewStats(countryId: number, sector: string | null): Promise<CountryReviewStats> {
  try {
    const sectorFilter = sector ? `AND ${SECTOR_MATCH}` : ''
    const binds: (string | number)[] = [countryId]
    if (sector) binds.push(...sectorBinds(sector))

    const row = await queryOne<{ avg_rating: number | string | null; n: number | string }>(
      `SELECT AVG(r.rating) AS avg_rating, COUNT(*) AS n
         FROM reviews r
         JOIN submissions s ON s.id = r.listing_id
         ${SECTOR_JOINS}
        WHERE r.status = 'approved'
          AND s.status IN ('active', 'paid')
          AND s.country_id = ?
          ${sectorFilter}`,
      binds
    )
    return { avg: row?.avg_rating != null ? Number(row.avg_rating) : 0, count: Number(row?.n ?? 0) }
  } catch (err) {
    console.warn('[countries] getCountryReviewStats failed:', err)
    return { avg: 0, count: 0 }
  }
}

export const getCountryReviewStats = unstable_cache(
  fetchCountryReviewStats,
  ['country-dir-v1-review-stats'],
  { revalidate: 600 }
)
