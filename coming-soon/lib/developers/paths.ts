/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - every URL in the section, and the slug
   rules behind them (spec sections 2.1-2.3).

     /developers                                         hub
     /developers/methodology | /developers/search?q=
     /developers/open-source                             OSS hub
     /developers/open-source/repos[/page/{n}]            most-starred repos
     /developers/open-source/companies[/page/{n}]        companies index
     /developers/open-source/{languages|topics|countries|industries}[/{slug}[/page/{n}]]
     /developers/open-source/good-first-issues[/{language}]
     /developers/open-source/{company}[/{repo}]
     /developers/free-apis                               free APIs hub
     /developers/free-apis/{no-auth|cors-enabled|ai-llm} collections
     /developers/free-apis/sdks[/{language}]
     /developers/free-apis/{category}[/{api}]

   Pages, the sitemap, search and the snapshot scripts all build links and
   slugs here, so no internal link can point at a redirect and a slug is
   computed one way only. Pure and isomorphic (no React, no Node APIs).

   Light on purpose: client islands (sub-nav, search box, filter bars)
   import it, so it must not pull in taxonomy.ts and its icon set. The
   dependency runs taxonomy.ts -> paths.ts, never the other way.
   ═══════════════════════════════════════════════════════════════════════ */

import { BASE_URL } from '../../app/components/seo-schema'
import { countrySlug, countryUrlPrefix } from '../country-paths'
import type { FacetValue } from './types'

/** Own-property lookup: a key such as 'constructor' (from a URL or a
 *  GitHub topic) must never resolve to something on Object.prototype. */
export function own<T>(record: Readonly<Record<string, T>>, key: string): T | undefined {
  return Object.prototype.hasOwnProperty.call(record, key) ? record[key] : undefined
}

/** Slugs that the generic rule (lowercase, non [a-z0-9] runs -> '-') would
 *  get wrong or make unreadable. Section 2.2; also used for SDK languages.
 *  (Re-exported by taxonomy.ts.) */
export const LANGUAGE_SLUG_OVERRIDES: Readonly<Record<string, string>> = {
  'C++': 'cpp',
  'C#': 'csharp',
  'F#': 'fsharp',
  'Objective-C': 'objective-c',
  'Objective-C++': 'objective-cpp',
  'Visual Basic .NET': 'visual-basic-net',
  'Jupyter Notebook': 'jupyter-notebook',
  'Vim Script': 'vim-script',
}

export const DEV_ROOT = '/developers'
export const OSS_ROOT = `${DEV_ROOT}/open-source`
export const APIS_ROOT = `${DEV_ROOT}/free-apis`

/* ── Reserved segments (2.1) ─────────────────────────────────────────── */

/** Static segments directly under /developers/. */
export const RESERVED_DEV_SEGMENTS: readonly string[] = ['open-source', 'free-apis', 'search', 'methodology']

/** Static segments under /developers/open-source/ - no company slug may equal one. */
export const RESERVED_OSS_SEGMENTS: readonly string[] = [
  'repos', 'companies', 'languages', 'topics', 'countries', 'industries', 'good-first-issues',
  'page', 'search', 'compare', 'about',
]

/** Static segments under /developers/free-apis/ - no category slug may equal one. */
export const RESERVED_API_SEGMENTS: readonly string[] = [
  'no-auth', 'cors-enabled', 'ai-llm', 'sdks', 'page', 'search', 'categories', 'compare',
]

/** Static segments under /developers/open-source/{company}/ - no repo slug may equal one. */
export const RESERVED_REPO_SEGMENTS: readonly string[] = ['page']

export function isReservedCompanySlug(slug: string): boolean {
  return RESERVED_OSS_SEGMENTS.includes(slug)
}

export function isReservedApiCategorySlug(slug: string): boolean {
  return RESERVED_API_SEGMENTS.includes(slug)
}

export function isReservedRepoSlug(slug: string): boolean {
  return RESERVED_REPO_SEGMENTS.includes(slug)
}

/** A company slug that can never shadow a static OSS page: a reserved one
 *  gets '-oss' appended (the snapshot script logs every such rename). */
export function safeCompanySlug(slug: string): string {
  return isReservedCompanySlug(slug) ? `${slug}-oss` : slug
}

/* ── Slug rules (2.2) ────────────────────────────────────────────────── */

/** Lowercase, accents folded, every run of characters outside [a-z0-9]
 *  becomes '-', no leading or trailing '-'. 'next.js' -> 'next-js'. */
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Base slug of a repository name: 'next.js' -> 'next-js', '.github' ->
 *  'github'. A name with no letters or digits falls back to 'repo' (the
 *  collision rule in assignRepoSlugs then makes it unique). */
export function repoSlug(name: string): string {
  return slugify(name) || 'repo'
}

/** Assign every repository of ONE company its URL slug (2.2).
 *  - Slugs already published (`frozen`, keyed by nameWithOwner) never change.
 *  - The rest go most-starred first; a slug that is taken or reserved gets
 *    '-{org login}' appended, then '-2', '-3'... if it is still taken.
 *  Returns nameWithOwner -> slug. */
export function assignRepoSlugs(
  repos: ReadonlyArray<{ owner: string; name: string; stars: number }>,
  frozen?: ReadonlyMap<string, string>,
): Map<string, string> {
  const out = new Map<string, string>()
  const taken = new Set<string>()

  for (const r of repos) {
    const key = `${r.owner}/${r.name}`
    const slug = frozen?.get(key)
    if (slug && !taken.has(slug)) {
      out.set(key, slug)
      taken.add(slug)
    }
  }

  const rest = repos
    .filter(r => !out.has(`${r.owner}/${r.name}`))
    .sort((a, b) => b.stars - a.stars || `${a.owner}/${a.name}`.localeCompare(`${b.owner}/${b.name}`, 'en'))

  for (const r of rest) {
    const base = repoSlug(r.name)
    let slug = base
    if (taken.has(slug) || isReservedRepoSlug(slug)) slug = `${base}-${slugify(r.owner) || 'org'}`
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${slugify(r.owner) || 'org'}-${n}`
    out.set(`${r.owner}/${r.name}`, slug)
    taken.add(slug)
  }
  return out
}

/* Override keys matched without case too, so 'c#' or 'C#' both give 'csharp'. */
const LANGUAGE_OVERRIDE_BY_LOWER = new Map(
  Object.entries(LANGUAGE_SLUG_OVERRIDES).map(([name, slug]) => [name.toLowerCase(), slug]),
)

/** Language slug (programming languages and SDK languages): override map
 *  first ('C++' -> 'cpp', 'C#' -> 'csharp'), else slugify ('TypeScript'
 *  -> 'typescript'). */
export function languageSlug(name: string): string {
  const trimmed = name.trim()
  return own(LANGUAGE_SLUG_OVERRIDES, trimmed) ?? LANGUAGE_OVERRIDE_BY_LOWER.get(trimmed.toLowerCase()) ?? slugify(trimmed)
}

/** GitHub topics are already [a-z0-9-]; kept as-is (lowercased), anything
 *  else is slugified. */
export function topicSlug(topic: string): string {
  const t = topic.trim().toLowerCase()
  return /^[a-z0-9]+(?:-+[a-z0-9]+)*$/.test(t) ? t : slugify(t)
}

/** Industry slug: lowercase, '&' -> 'and', non [a-z0-9] runs -> '-'.
 *  'AI & Machine Learning' -> 'ai-and-machine-learning'. */
export function industrySlug(name: string): string {
  return slugify(name.replace(/&/g, ' and '))
}

/* Region names that differ from what InfoWebWorld shows (2.2), plus names
   whose CLDR form changes between ICU versions or reads oddly in a URL
   (TR is 'Turkiye' in newer ICU data and 'Turkey' in older, and the site
   says 'Turkey'). */
const COUNTRY_NAME_OVERRIDES: Readonly<Record<string, string>> = {
  US: 'United States',
  GB: 'United Kingdom',
  AE: 'United Arab Emirates',
  KR: 'South Korea',
  CZ: 'Czech Republic',
  TR: 'Turkey',
  HK: 'Hong Kong',
  MO: 'Macao',
  MM: 'Myanmar',
}

let regionNames: Intl.DisplayNames | null | undefined

/** Full English country name for an ISO 3166-1 alpha-2 code ('DE' ->
 *  'Germany', 'GB' -> 'United Kingdom'), or null for an unknown code. */
export function countryNameFromIso2(iso2: string): string | null {
  const code = iso2.trim().toUpperCase()
  if (!/^[A-Z]{2}$/.test(code)) return null
  const override = COUNTRY_NAME_OVERRIDES[code]
  if (override) return override
  if (regionNames === undefined) {
    try {
      regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
    } catch {
      regionNames = null
    }
  }
  if (!regionNames) return null
  try {
    const name = regionNames.of(code)
    /* ICU answers 'Unknown Region' (or echoes the code) for codes no
       country has, such as XX and ZZ. */
    return name && name !== code && !/unknown region/i.test(name) ? name : null
  } catch {
    return null
  }
}

/** Country facet slug in the site's own country URL style: 'us', 'uk',
 *  'uae', else the name slug ('germany', 'south-korea'). Takes an ISO-2
 *  code or a full country name. */
export function countryFacetSlug(iso2OrName: string): string | null {
  const value = iso2OrName.trim()
  const name = /^[A-Za-z]{2}$/.test(value) ? countryNameFromIso2(value) : value
  if (!name) return null
  const folded = name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  const slug = countrySlug(folded)
  return slug ? countryUrlPrefix(slug) : null
}

/** A request param as the canonical slug it should be, for 308 checks
 *  (2.3): URL-decoded, language overrides applied, then slugified.
 *  'Vercel' -> 'vercel', 'Next.js' -> 'next-js', 'C%2B%2B' -> 'cpp'. */
export function normalizeSlugParam(raw: string): string {
  let decoded = raw
  try { decoded = decodeURIComponent(raw) } catch { /* keep the raw value */ }
  return languageSlug(decoded)
}

/** True when a value is already in canonical slug form (lowercase
 *  [a-z0-9] words joined by single hyphens). */
export function isCanonicalSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

/* ── Pagination ──────────────────────────────────────────────────────── */

/** Rows per page on paginated lists (3.8, 3.9, 3.11). */
export const PAGE_SIZE = {
  repos: 48,
  companies: 60,
  facetRepos: 48,
} as const

/* Higher than any real page count; stops absurd numbers early. */
const MAX_PAGE = 100000

/** Number of pages for `total` rows (never less than 1). */
export function lastPage(total: number, perPage: number): number {
  return Math.max(1, Math.ceil(Math.max(0, total) / perPage))
}

/** The page number in a /page/{n} segment, or null unless it matches
 *  ^[1-9]\d*$ (so '0', '01', '-1', '2.5' and 'abc' are all null). */
export function parsePageParam(raw: string | undefined | null): number | null {
  if (typeof raw !== 'string' || !/^[1-9]\d*$/.test(raw)) return null
  const n = Number(raw)
  return n <= MAX_PAGE ? n : null
}

/** What a /page/{n} route does with its param (2.3): render page n,
 *  308 to the clean URL for page 1, or 404. */
export function resolvePageParam(
  raw: string | undefined | null,
  last: number,
): { kind: 'page'; page: number } | { kind: 'redirect-first' } | { kind: 'not-found' } {
  const page = parsePageParam(raw)
  if (page === null || page > last) return { kind: 'not-found' }
  if (page === 1) return { kind: 'redirect-first' }
  return { kind: 'page', page }
}

/* '' for page 1 or no page, '/page/{n}' otherwise: page 1 is always the
   clean URL. */
function pageSuffix(page?: number): string {
  return page && page > 1 ? `/page/${Math.floor(page)}` : ''
}

/* ── URL builders ────────────────────────────────────────────────────── */

export type OssFacetKind = FacetValue['kind']

/** URL segment of each facet's index page. */
export const OSS_FACET_SEGMENTS: Readonly<Record<OssFacetKind, string>> = {
  language: 'languages',
  topic: 'topics',
  country: 'countries',
  industry: 'industries',
}

export type ApiCollectionSlug = 'no-auth' | 'cors-enabled' | 'ai-llm'

export const API_COLLECTIONS: readonly ApiCollectionSlug[] = ['no-auth', 'cors-enabled', 'ai-llm']

/** '/developers' */
export function devHubPath(): string {
  return DEV_ROOT
}

/** '/developers/methodology' */
export function methodologyPath(): string {
  return `${DEV_ROOT}/methodology`
}

/** '/developers/search', or '/developers/search?q=...' for a non-empty query. */
export function devSearchPath(q?: string | null): string {
  const query = (q ?? '').trim()
  return query ? `${DEV_ROOT}/search?q=${encodeURIComponent(query)}` : `${DEV_ROOT}/search`
}

/** '/developers/open-source' */
export function ossHubPath(): string {
  return OSS_ROOT
}

/** '/developers/open-source/repos', '/developers/open-source/repos/page/2' */
export function ossReposPath(page?: number): string {
  return `${OSS_ROOT}/repos${pageSuffix(page)}`
}

/** '/developers/open-source/companies', '/developers/open-source/companies/page/2' */
export function ossCompaniesPath(page?: number): string {
  return `${OSS_ROOT}/companies${pageSuffix(page)}`
}

/** '/developers/open-source/languages' (topics, countries, industries) */
export function ossFacetIndexPath(kind: OssFacetKind): string {
  return `${OSS_ROOT}/${OSS_FACET_SEGMENTS[kind]}`
}

/** '/developers/open-source/languages/typescript[/page/{n}]' */
export function ossFacetPath(kind: OssFacetKind, slug: string, page?: number): string {
  return `${ossFacetIndexPath(kind)}/${slug}${pageSuffix(page)}`
}

/** '/developers/open-source/good-first-issues[/{language}]' */
export function gfiPath(lang?: string | null): string {
  return `${OSS_ROOT}/good-first-issues${lang ? `/${lang}` : ''}`
}

/** '/developers/open-source/{company}' */
export function ossCompanyPath(company: string): string {
  return `${OSS_ROOT}/${company}`
}

/** '/developers/open-source/{company}/{repo}' */
export function ossRepoPath(company: string, repo: string): string {
  return `${OSS_ROOT}/${company}/${repo}`
}

/** '/developers/free-apis' */
export function freeApisPath(): string {
  return APIS_ROOT
}

/** '/developers/free-apis/{category}' */
export function apiCategoryPath(category: string): string {
  return `${APIS_ROOT}/${category}`
}

/** '/developers/free-apis/{category}/{api}' */
export function apiPath(category: string, api: string): string {
  return `${APIS_ROOT}/${category}/${api}`
}

/** '/developers/free-apis/no-auth' (cors-enabled, ai-llm) */
export function apiCollectionPath(collection: ApiCollectionSlug): string {
  return `${APIS_ROOT}/${collection}`
}

/** '/developers/free-apis/sdks[/{language}]' */
export function sdkPath(lang?: string | null): string {
  return `${APIS_ROOT}/sdks${lang ? `/${lang}` : ''}`
}

/** Absolute URL on the live site for a site-relative path:
 *  '/developers' -> 'https://www.infowebworld.com/developers'.
 *  Absolute http(s) URLs come back unchanged. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
