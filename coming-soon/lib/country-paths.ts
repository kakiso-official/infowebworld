/* ═══════════════════════════════════════════════════════════════════════
   Country directory pages (Oct 2026) - paths, names and SEO copy rules.
   Pure module (no DB, no React), safe in server, client and route code.

     /countries                            every country with live listings
     /countries/{country}                  the country hub - all six sectors
     /countries/{country}/{sector path}    one sector in one country, e.g.
                                           /countries/india/it-directory

   The sector segment is the sector's directory URL segment from
   lib/sector-paths.ts ('it-directory' = it-services-agencies), so the
   sector naming is the same everywhere on the site. A country gets pages
   only while it holds live listings (COUNTRY_PAGE_MIN_LISTINGS); they are
   indexed and listed in the sitemap from COUNTRY_INDEX_MIN_LISTINGS - the
   same bar the ?country= category variants use.
   ═══════════════════════════════════════════════════════════════════════ */

import { sectorLandingPath, sectorFromUrlSegment } from './sector-paths'

export const COUNTRIES_INDEX_PATH = '/countries'

/** A country (or country + sector) page exists from this many live listings. */
export const COUNTRY_PAGE_MIN_LISTINGS = 1

/** ...and may be indexed + submitted in the sitemap from this many. */
export const COUNTRY_INDEX_MIN_LISTINGS = 3

/** Listings per page on a country + sector page. */
export const COUNTRY_LISTINGS_PER_PAGE = 24

/** The six L1 sectors in the order the site presents them. */
export const SECTOR_ORDER = [
  'ai-ml',
  'software-saas',
  'it-services-agencies',
  'startups-innovation',
  'local-businesses',
  'professional-services',
] as const

/* A few countries are stored with a shorthand name; the site always shows
   full country names (MEMORY seo_country_chip_serp_title). */
const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  UAE: 'United Arab Emirates',
}

/** Full display name for a `countries.name` value ('UAE' → 'United Arab Emirates'). */
export function countryDisplayName(dbName: string): string {
  return DISPLAY_NAME_OVERRIDES[dbName] ?? dbName
}

/** URL slug for a country, from its stored or display name:
 *  'India' → 'india', 'UAE' → 'united-arab-emirates'. Same slug the
 *  ?country= filter on category pages accepts. */
export function countrySlug(name: string): string {
  return countryDisplayName(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const NEEDS_THE = new Set([
  'United States', 'United Kingdom', 'United Arab Emirates', 'Netherlands',
  'Philippines', 'Czech Republic', 'Dominican Republic', 'Bahamas', 'Maldives',
])

/** The country as it reads mid-sentence: 'India', 'the United States'. */
export function countryInPhrase(displayName: string): string {
  return NEEDS_THE.has(displayName) ? `the ${displayName}` : displayName
}

export function countryHubPath(slug: string): string {
  return `${COUNTRIES_INDEX_PATH}/${slug}`
}

/** '/countries/india/it-directory' for ('india', 'it-services-agencies'). */
export function countrySectorPath(slug: string, sectorSlug: string): string {
  return `${countryHubPath(slug)}${sectorLandingPath(sectorSlug)}`
}

/** The sector a /countries/{country}/{segment} URL opens, or null. */
export function sectorFromCountrySegment(segment: string): string | null {
  return sectorFromUrlSegment(segment)
}

/** flagcdn.com image for an ISO 3166-1 alpha-2 code (next.config allows it). */
export function flagUrl(code: string, width: 40 | 80 | 160 | 320 = 80): string {
  return `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`
}

/* ── Sector wording for country pages ───────────────────────────────── */

export type SectorCountryCopy = {
  /** Official sector name, e.g. 'IT Services & Agencies'. */
  name: string
  /** Plural noun for H1s and cards: 'IT Companies & Digital Agencies'. */
  noun: string
  /** Lower-case noun for running text: 'IT companies and digital agencies'. */
  nounLower: string
  /** The sector landing's directory name: 'IT & Digital Agency Directory'. */
  directoryName: string
  /** SERP title candidates, best first; {C} = countryInPhrase(), {Y} = year.
   *  The first that fits TITLE_BUDGET (lib/seo.ts) wins. */
  titles: string[]
}

export const SECTOR_COUNTRY_COPY: Record<string, SectorCountryCopy> = {
  'ai-ml': {
    name: 'AI & ML',
    noun: 'AI Companies & Tools',
    nounLower: 'AI companies and tools',
    directoryName: 'AI Tools Directory',
    titles: [
      'Top AI Companies & Tools in {C} ({Y}) - Directory',
      'Top AI Companies & Tools in {C} ({Y})',
      'Top AI Companies in {C} ({Y})',
      'AI Companies in {C}',
    ],
  },
  'software-saas': {
    name: 'Software & SaaS',
    noun: 'SaaS & Software Companies',
    nounLower: 'SaaS and software companies',
    directoryName: 'SaaS Directory',
    titles: [
      'Top SaaS Companies in {C} ({Y}) - Software Directory',
      'Top SaaS & Software Companies in {C} ({Y})',
      'Top SaaS Companies in {C} ({Y})',
      'SaaS Companies in {C}',
    ],
  },
  'it-services-agencies': {
    name: 'IT Services & Agencies',
    noun: 'IT Companies & Digital Agencies',
    nounLower: 'IT companies and digital agencies',
    directoryName: 'IT & Digital Agency Directory',
    titles: [
      'Top IT Companies & Digital Agencies in {C} ({Y})',
      'Top IT Companies & Agencies in {C} ({Y})',
      'Top IT Companies in {C} ({Y})',
      'IT Companies in {C}',
    ],
  },
  'startups-innovation': {
    name: 'Startups & Innovation',
    noun: 'Startups',
    nounLower: 'startups',
    directoryName: 'Startup Directory',
    titles: [
      'Top Startups in {C} ({Y}) - Startup Directory',
      'Top Startups in {C} ({Y})',
      'Startups in {C}',
    ],
  },
  'local-businesses': {
    name: 'Local Businesses',
    noun: 'Local Businesses',
    nounLower: 'local businesses',
    directoryName: 'Local Business Directory',
    titles: [
      'Local Businesses in {C} ({Y}) - Business Directory',
      'Best Local Businesses in {C} ({Y})',
      'Local Businesses in {C} ({Y})',
      'Local Businesses in {C}',
    ],
  },
  'professional-services': {
    name: 'Professional Services',
    noun: 'Professional Services Firms',
    nounLower: 'professional services firms',
    directoryName: 'Professional Services Directory',
    titles: [
      'Top Professional Services Firms in {C} ({Y}) - Reviews',
      'Top Professional Services Firms in {C} ({Y})',
      'Professional Services Firms in {C} ({Y})',
      'Professional Services Firms in {C}',
    ],
  },
}

/** SERP title candidates for a country hub, best first. */
export const COUNTRY_HUB_TITLES = [
  '{N} Business Directory ({Y}) - Verified Companies & Reviews',
  '{N} Business Directory ({Y}) - Top Verified Companies',
  '{N} Business Directory ({Y}) - Companies & Reviews',
  '{N} Business Directory ({Y})',
]

/** Fill a title template and return the first candidate within `budget`
 *  characters (falls back to the shortest). {N} = display name,
 *  {C} = countryInPhrase(name), {Y} = year. */
export function pickTitle(
  candidates: string[],
  vars: { name: string; year: number | string },
  budget = 60,
): string {
  const filled = candidates.map(t =>
    t.replace(/\{N\}/g, vars.name)
      .replace(/\{C\}/g, countryInPhrase(vars.name))
      .replace(/\{Y\}/g, String(vars.year)),
  )
  return filled.find(t => t.length <= budget) ?? filled[filled.length - 1]
}
