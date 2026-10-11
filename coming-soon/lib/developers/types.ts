/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers (/developers) - data contracts.

   The committed snapshots under data/developers/ match these types
   exactly (written by scripts/developers/*, checked by the validator):

     oss/meta.json        OssMeta
     oss/companies.json   OssCompany[]
     oss/repos.json       OssRepo[]
     oss/issues.json      OssIssue[]
     apis/meta.json       ApisMeta
     apis/apis.json       FreeApi[]
     iww-links.json       IwwLinks

   Types only: safe to import from server, client and script code.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Shared ───────────────────────────────────────────────── */
export type IsoDateTime = string            // '2026-10-11T15:31:00Z'
export type Iso2 = string                   // 'US'

export interface GhLanguage { name: string; color: string | null }

/* Freshness of the optional runtime refresh (lib/developers/refresh.ts).
   Lives in memory only, never in the JSON: it drives the data line and the
   "how often" copy so a freshness claim is only made while it is true. */
export interface RefreshState {
  lastOkAt: IsoDateTime | null
  live: boolean
}

/* ── Open source ──────────────────────────────────────────── */
export interface OssMeta {
  schemaVersion: 1
  generatedAt: IsoDateTime                  // snapshot time: drives month/year in titles, lastmod, data line
  source: 'github-graphql'
  reposPerOrgLimit: 30
  counts: { companies: number; orgs: number; repos: number; issues: number; languages: number; topics: number; countries: number }
  refreshedAt?: IsoDateTime                 // in memory only: last successful runtime refresh
  refresh?: RefreshState                    // in memory only
}

export interface OssOrg {
  login: string                             // exact GitHub case, e.g. 'Shopify'
  url: string                               // https://github.com/{login}
  name: string | null
  description: string | null
  websiteUrl: string | null
  location: string | null                   // GitHub free text, display only
  avatarUrl: string
  isVerified: boolean                       // GitHub verified-domain flag, shown as-is
  publicRepos: number
}

export interface OssCompany {
  slug: string                              // frozen, unique, not reserved
  name: string
  website: string | null
  hqCountry: Iso2 | null
  countrySlug: string | null                // 'us', 'uk', 'germany' (section 2.2)
  countryName: string | null                // 'United States'
  industry: string                          // 'Developer Tools'
  industrySlug: string                      // 'developer-tools'
  oneLiner: string | null
  listedOnIww: boolean
  iwwUrl: string | null                     // absolute URL as matched ('https://www.infowebworld.com/profile/x')
  iwwPath: string | null                    // site-relative path derived from iwwUrl ('/profile/x' | '/listing/x'); null when not listed
  /* What the InfoWebWorld match is: the company's own profile ('company',
     /profile/x) or one of its products ('product', /listing/x - e.g. Hugging
     Face -> the "Gradio AI" listing). Absent in older snapshots: derive it
     from iwwPath (see companyIwwLink in oss.ts). */
  iwwMode?: 'company' | 'product' | null
  iwwName?: string | null                   // name of the matched listing ('Gradio AI'); null = the company name
  orgs: OssOrg[]                            // 1-4
}

export interface OssLanguage extends GhLanguage { size: number }   // bytes

export interface OssRepo {
  id: string                                // nameWithOwner, e.g. 'stripe/stripe-node'
  slug: string                              // unique within company, frozen
  companySlug: string
  owner: string                             // org login
  name: string
  nameWithOwner: string
  description: string | null                // emoji shortcodes stripped, max 300 chars
  url: string
  homepageUrl: string | null
  stars: number
  forks: number
  primaryLanguage: GhLanguage | null
  languages: OssLanguage[]                  // top 8 by size
  topics: string[]
  license: string | null                    // SPDX id; 'NOASSERTION'/'other'/missing -> null
  pushedAt: IsoDateTime
  createdAt: IsoDateTime
  isArchived: boolean
  openIssues: number
  goodFirstIssues: number                   // open issues with any GFI label variant (6.4)
  latestRelease: { tag: string; publishedAt: IsoDateTime } | null
}

export interface OssIssue {
  title: string
  url: string
  repo: string                              // nameWithOwner
  repoSlug: string
  companySlug: string
  labels: string[]
  createdAt: IsoDateTime
  comments: number
}

/* Derived once per process by lib/developers/oss.ts (never stored) */
export interface OssCompanyStats {
  trackedRepos: number; publicRepos: number; archivedRepos: number
  stars: number; forks: number; goodFirstIssues: number
  lastPushedAt: IsoDateTime | null
  topLanguages: Array<GhLanguage & { pct: number }>   // by bytes, max 5
  topRepo: { slug: string; name: string; stars: number } | null
}
export interface FacetValue {
  kind: 'language' | 'topic' | 'country' | 'industry'
  slug: string; name: string
  color?: string | null; iso2?: Iso2
  repos: number; companies: number; stars: number; goodFirstIssues: number
  indexable: boolean
}

/* ── Free APIs ────────────────────────────────────────────── */
export type AuthType = 'none' | 'apiKey' | 'OAuth' | 'X-Mashape-Key' | 'User-Agent' | 'other'
export type Tri = 'yes' | 'no' | 'unknown'
export type SdkRegistry = 'npm' | 'pypi' | 'go' | 'maven' | 'nuget' | 'rubygems' | 'packagist' | 'crates' | 'pub' | 'cocoapods' | 'swiftpm' | 'other'

export interface ApisMeta {
  schemaVersion: 1
  generatedAt: IsoDateTime
  linksCheckedAt: IsoDateTime
  baseSource: { repo: 'public-apis/public-apis'; license: 'MIT'; copyright: 'Copyright (c) 2022 public-apis'; fetchedAt: IsoDateTime }
  counts: { apis: number; categories: number; enriched: number; sdks: number; officialSdks: number; noAuth: number; cors: number; tryable: number }
  categories: Array<{ slug: string; name: string }>   // ordered, ~51
  refresh?: RefreshState                    // in memory only
}

export interface ApiSdk {
  language: string                          // display: 'Python', 'JavaScript', 'C#'
  languageSlug: string                      // 'python', 'javascript', 'csharp'
  registry: SdkRegistry
  package: string
  registryUrl: string | null                // set only after an HTTP 200 check
  official: boolean
  repoUrl: string | null
  version: string | null
  lastPublished: IsoDateTime | null
}

export interface ApiDetails {
  provider: {
    name: string; website: string | null; githubOrg: string | null
    iwwPath: string | null                  // provider's live InfoWebWorld listing, when matched
    ossCompanySlug: string | null           // company in the OSS set owning githubOrg
  }
  summary: string
  auth: { type: AuthType; howToGet: string | null }
  freeTier: { available: boolean | null; summary: string | null; requiresCard: boolean | null; sourceUrl: string | null }
  docsUrl: string | null
  pricingUrl: string | null
  baseUrl: string | null
  sample: { method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; url: string; description: string | null; needsKey: boolean } | null
  check: { ok: boolean; tryable: boolean; contentType: string | null; httpStatus: number | null; checkedAt: IsoDateTime } | null
  sdks: ApiSdk[]                            // [] = checked, none found
  rateLimits: string | null
  openapiUrl: string | null
  statusUrl: string | null
  useCases: string[]
  tags: string[]
  sources: string[]                         // URLs used to verify the facts
  confidence: 'high' | 'medium' | 'low'     // from the enrichment review
  lastVerified: IsoDateTime
}

export interface FreeApi {
  id: string
  slug: string                              // globally unique, not reserved
  name: string
  category: { name: string; slug: string }
  description: string                       // public-apis one-liner (MIT, attributed) or curated
  auth: AuthType                            // normalised base auth
  authRaw: string                           // as listed ('apiKey', 'No', ...)
  https: boolean
  cors: Tri
  link: string
  status: 'alive' | 'blocked'               // dead + unresolved unknown rows are dropped at build
  linkCheckedAt: IsoDateTime
  source: 'public-apis' | 'curated'         // curated = the ~35 modern AI/LLM and developer-platform APIs
  enriched: boolean
  details: ApiDetails | null                // present iff enriched
  failedChecks?: number                     // in memory only: consecutive runtime check failures (6.5)
}

/* ── Cross-links (one read-only SELECT + HTTP checks at snapshot time) ── */
export interface IwwLinks {
  generatedAt: IsoDateTime
  countryHubs: string[]                     // verified 200: '/us-business-directory', ...
}

/* ── Search ───────────────────────────────────────────────── */
export type SearchKind = 'api' | 'company' | 'repo' | 'sdk' | 'category' | 'language' | 'topic'
export interface SearchHit {
  kind: SearchKind
  label: string                             // 'stripe/stripe-node', 'Open-Meteo'
  sub: string | null                        // 'Stripe - TypeScript', 'Weather - No key'
  href: string                              // always one of our pages, or the API link for unreviewed APIs
  external: boolean
  meta: string | null                       // '44.1k stars', 'PyPI'
  avatar?: string | null
  color?: string | null                     // language dot
  mono?: boolean                            // render label in <code>
}
export interface SearchResponse {
  q: string
  tookMs: number
  total: number
  groups: { apis: SearchHit[]; companies: SearchHit[]; repos: SearchHit[]; sdks: SearchHit[]; other: SearchHit[] }
}

/* ── Row payloads for client filter islands (server -> client props, kept small) ── */
export type RepoRow = Pick<OssRepo, 'id' | 'slug' | 'companySlug' | 'nameWithOwner' | 'description' | 'stars' | 'forks' |
  'primaryLanguage' | 'topics' | 'license' | 'pushedAt' | 'isArchived' | 'goodFirstIssues'> & { companyName: string; avatarUrl: string }
