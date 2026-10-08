/* ═══════════════════════════════════════════════════════════════════════
   Country directory pages (Oct 2026) - paths, names and SEO copy rules.
   Pure module (no DB, no React), safe in server, client, route and proxy
   (middleware.ts) code.

     /countries                                  every country with live listings
     /{country}-business-directory               the country hub - all six sectors,
                                                 e.g. /us-business-directory
     /{country}-business-directory/{sector path} one sector in one country, e.g.
                                                 /india-business-directory/it-directory

   {country} is the country's URL slug ('india', 'new-zealand'), or the short
   name people search for where there is one ('us', 'uk', 'uae' - see
   SHORT_COUNTRY). The pages themselves live at app/countries/[country] and
   app/countries/[country]/[sector]: middleware.ts rewrites the URLs above to
   them (routeCountryDirectoryPath) and 308s the first URLs these pages had
   (Oct 7 2026: /countries/{country-slug}[/{sector path}]) to the current
   ones, so internal links must always come from countryHubPath /
   countrySectorPath below.

   The sector segment is the sector's directory URL segment from
   lib/sector-paths.ts ('it-directory' = it-services-agencies), so the
   sector naming is the same everywhere on the site. A country gets pages
   only while it holds live listings (COUNTRY_PAGE_MIN_LISTINGS); they are
   indexed and listed in the sitemap from COUNTRY_INDEX_MIN_LISTINGS - the
   same bar the ?country= category variants use.
   ═══════════════════════════════════════════════════════════════════════ */

import { sectorLandingPath, sectorFromUrlSegment } from './sector-paths'

export const COUNTRIES_INDEX_PATH = '/countries'

/** Every country hub URL ends with this: /us-business-directory. */
export const COUNTRY_DIRECTORY_SUFFIX = '-business-directory'

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

/* Countries whose directory URL and heading use the short name people
   search for ("US business directory"), keyed by canonical country slug.
   Every other country uses its slug and display name. */
const SHORT_COUNTRY: Record<string, { prefix: string; name: string }> = {
  'united-states': { prefix: 'us', name: 'US' },
  'united-kingdom': { prefix: 'uk', name: 'UK' },
  'united-arab-emirates': { prefix: 'uae', name: 'UAE' },
}

/* URL prefix → canonical country slug for the short forms, plus 'usa',
   which only ever 308s to /us-business-directory. */
const SLUG_BY_PREFIX: Record<string, string> = {
  ...Object.fromEntries(Object.entries(SHORT_COUNTRY).map(([slug, s]) => [s.prefix, slug])),
  usa: 'united-states',
}

/** The {country} part of a country's directory URLs: 'us' for
 *  'united-states', otherwise the slug itself ('india'). */
export function countryUrlPrefix(slug: string): string {
  return SHORT_COUNTRY[slug]?.prefix ?? slug
}

/** The country as a directory hub names it: 'US', 'UK', 'UAE', otherwise
 *  the display name ('India'). */
export function countryDirectoryName(displayName: string): string {
  return SHORT_COUNTRY[countrySlug(displayName)]?.name ?? displayName
}

/** Hub H1, and its SERP title before the brand: one format for every
 *  country - '#1 Rated US Business Directory'. */
export function countryHubHeading(displayName: string): string {
  return `#1 Rated ${countryDirectoryName(displayName)} Business Directory`
}

/** '/us-business-directory' for 'united-states', '/india-business-directory'
 *  for 'india'. */
export function countryHubPath(slug: string): string {
  return `/${countryUrlPrefix(slug)}${COUNTRY_DIRECTORY_SUFFIX}`
}

/** '/india-business-directory/it-directory' for ('india', 'it-services-agencies'). */
export function countrySectorPath(slug: string, sectorSlug: string): string {
  return `${countryHubPath(slug)}${sectorLandingPath(sectorSlug)}`
}

/** The sector a /{country}-business-directory/{segment} URL opens, or null. */
export function sectorFromCountrySegment(segment: string): string | null {
  return sectorFromUrlSegment(segment)
}

/* ── Routing (middleware.ts) ────────────────────────────────────────── */

/* /{country}-business-directory[/{segment}], any case. */
const DIRECTORY_URL_RE = /^\/([^/]+)-business-directory(?:\/([^/]+))?\/?$/i
/* The first URLs of these pages (Oct 7 2026): /countries/{slug}[/{segment}]. */
const LEGACY_URL_RE = /^\/countries\/([^/]+)(?:\/([^/]+))?\/?$/
const URL_PART_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function decodePart(raw: string): string {
  try { return decodeURIComponent(raw) } catch { return raw }
}

/** What middleware does with a request path in the country directory URL
 *  space, or null when the path is not in it:
 *   · redirect - 308 to `path`: the canonical URL of an old /countries/...
 *     URL, a short-name alias (/united-states-business-directory), or a
 *     wrong-case / trailing-slash variant
 *   · rewrite  - serve `path` (the app/countries/[country] route) under the
 *     requested URL
 *   · gone     - nothing can live here (characters no slug has): a real 404
 *  A well-formed {country} that is not a country with listings is rewritten
 *  like any other; the page sends it to /url-removed. */
export function routeCountryDirectoryPath(
  pathname: string,
): { kind: 'redirect' | 'rewrite'; path: string } | { kind: 'gone' } | null {
  const legacy = pathname.match(LEGACY_URL_RE)
  const current = legacy ? null : pathname.match(DIRECTORY_URL_RE)
  const m = legacy ?? current
  if (!m) return null

  const first = decodePart(m[1]).toLowerCase()
  const segment = m[2] === undefined ? null : decodePart(m[2]).toLowerCase()
  if (!URL_PART_RE.test(first) || (segment !== null && !URL_PART_RE.test(segment))) {
    /* An old /countries/... URL like that never had a page either; the
       countries route turns it away the same way. */
    return legacy ? null : { kind: 'gone' }
  }

  /* first = the old URL's country slug, or the new URL's {country} part. */
  const slug = SLUG_BY_PREFIX[first] ?? first
  const canonical = `${countryHubPath(slug)}${segment ? `/${segment}` : ''}`
  if (legacy || pathname !== canonical) return { kind: 'redirect', path: canonical }
  return { kind: 'rewrite', path: `${COUNTRIES_INDEX_PATH}/${slug}${segment ? `/${segment}` : ''}` }
}

/** True for /{country}-business-directory and /{country}-business-directory/{segment}. */
export function isCountryDirectoryPath(pathname: string): boolean {
  return DIRECTORY_URL_RE.test(pathname)
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
