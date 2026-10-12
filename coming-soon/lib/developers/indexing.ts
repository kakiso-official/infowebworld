/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - when a page exists and when it is indexed
   (spec 3.19, with the per-page gates of 3.6, 3.7, 3.14 and 3.15).

   One definition, used by the pages (meta robots), the store (facet
   `indexable` flags) and the sitemap (indexableUrls), so nothing the
   sitemap lists can ever render noindex. Same policy as the rest of the
   site (lib/category-indexing.ts): a thin page stays live for visitors and
   crawl paths, but is `noindex, follow` until it has enough real data.

   Every date gate is measured against the dataset's snapshot date, never
   the server clock, so a cached page and the sitemap always agree.

   Pure and isomorphic (no React, no Node APIs).
   ═══════════════════════════════════════════════════════════════════════ */

import { isWithinDays, isoDate, parseIsoDate } from './format'
import {
  API_COLLECTIONS, PAGE_SIZE, apiCategoryPath, apiCollectionPath, apiPath, devHubPath, freeApisPath, gfiPath,
  lastPage, methodologyPath, ossCompaniesPath, ossCompanyPath, ossFacetIndexPath, ossFacetPath, ossHubPath,
  ossRepoPath, ossReposPath, sdkPath, type ApiCollectionSlug, type OssFacetKind,
} from './paths'
import type { FreeApi, IsoDateTime, OssRepo } from './types'
import type { OssStore } from './oss'
import type { ApisStore } from './apis'

/* ── Thresholds ──────────────────────────────────────────────────────── */

/** Every number the gates use, in one place. */
export const GATES = {
  /** Company: >= 3 live repos with a description, or one live repo with >= 100 stars. */
  companyDescribedRepos: 3,
  companyStarredRepoStars: 100,
  /** Repo (3.7). */
  repoArchivedMinStars: 1000,
  repoMinStars: 100,
  repoActiveMinStars: 20,
  repoActiveDays: 365,
  repoReleaseDays: 365,
  /** Repos ranking: pages 1-10 indexed. */
  reposIndexedPages: 10,
  /** Language and topic pages. */
  facetMinRepos: 8,
  facetMinCompanies: 3,
  topicExistsMinRepos: 3,
  /** Country and industry pages. */
  groupMinCompanies: 3,
  /** Good first issues: all languages / one language. */
  gfiAllMin: 20,
  gfiLanguageMin: 5,
  /** API category (3.14). */
  categoryMinApis: 5,
  categoryMinApisWithIndexableEnriched: 3,
  /** Collections (AI: enriched APIs). */
  collectionMinApis: 5,
  /** API detail (3.15). */
  apiVerifiedDays: 180,
  /** SDK language pages. */
  sdkLanguageMinOfficial: 5,
} as const

/** Content date of /developers/methodology (its sitemap lastmod). Bump it
 *  whenever the methodology copy changes. */
export const METHODOLOGY_UPDATED = '2026-10-12'

/* ── Open source ─────────────────────────────────────────────────────── */

/** A company page exists when the company has at least one tracked repo. */
export function companyExists(repos: readonly OssRepo[]): boolean {
  return repos.length >= 1
}

/** Company gate (3.6): >= 3 non-archived repos with a description, or
 *  >= 1 non-archived repo with >= 100 stars. All-archived is never indexed. */
export function isCompanyIndexable(repos: readonly Pick<OssRepo, 'isArchived' | 'description' | 'stars'>[]): boolean {
  let described = 0
  for (const r of repos) {
    if (r.isArchived) continue
    if (r.stars >= GATES.companyStarredRepoStars) return true
    if (r.description && r.description.trim()) described++
  }
  return described >= GATES.companyDescribedRepos
}

/** Repo gate (3.7): a description, AND (live OR >= 1,000 stars), AND real
 *  traction (>= 100 stars, a good first issue, >= 20 stars with a push in
 *  the last 365 days, or a release in the last 365 days). */
export function isRepoIndexable(
  repo: Pick<OssRepo, 'description' | 'isArchived' | 'stars' | 'goodFirstIssues' | 'pushedAt' | 'latestRelease'>,
  snapshotIso: IsoDateTime,
): boolean {
  if (!repo.description || !repo.description.trim()) return false
  if (repo.isArchived && repo.stars < GATES.repoArchivedMinStars) return false
  return (
    repo.stars >= GATES.repoMinStars ||
    repo.goodFirstIssues >= 1 ||
    (repo.stars >= GATES.repoActiveMinStars && isWithinDays(repo.pushedAt, snapshotIso, GATES.repoActiveDays)) ||
    (!!repo.latestRelease && isWithinDays(repo.latestRelease.publishedAt, snapshotIso, GATES.repoReleaseDays))
  )
}

/** Repos ranking page n is indexed for n <= 10 (deeper pages: noindex, follow). */
export function isReposPageIndexable(page: number): boolean {
  return page >= 1 && page <= GATES.reposIndexedPages
}

/** Every companies index page is indexed. */
export function isCompaniesPageIndexable(page: number): boolean {
  return page >= 1
}

/** A facet page exists: language >= 1 repo, topic >= 3 repos, country or
 *  industry >= 1 company. */
export function facetExists(kind: OssFacetKind, counts: { repos: number; companies: number }): boolean {
  switch (kind) {
    case 'language': return counts.repos >= 1
    case 'topic': return counts.repos >= GATES.topicExistsMinRepos
    default: return counts.companies >= 1
  }
}

/** A facet page is indexed: language/topic >= 8 repos from >= 3 companies;
 *  country/industry >= 3 companies. Its /page/{n} pages follow the same gate. */
export function isFacetIndexable(kind: OssFacetKind, counts: { repos: number; companies: number }): boolean {
  if (kind === 'language' || kind === 'topic') {
    return counts.repos >= GATES.facetMinRepos && counts.companies >= GATES.facetMinCompanies
  }
  return counts.companies >= GATES.groupMinCompanies
}

/** Good first issues: the all-languages page always exists; a language
 *  page exists with >= 1 issue at the snapshot. */
export function gfiLanguageExists(issues: number): boolean {
  return issues >= 1
}

/** Good first issues are indexed with >= 20 issues (all languages) or
 *  >= 5 (one language). */
export function isGfiIndexable(issues: number, perLanguage: boolean): boolean {
  return issues >= (perLanguage ? GATES.gfiLanguageMin : GATES.gfiAllMin)
}

/* ── Free APIs ───────────────────────────────────────────────────────── */

/** A category page exists with >= 1 published API. */
export function apiCategoryExists(apis: number): boolean {
  return apis >= 1
}

/** Category gate (3.14): >= 5 published APIs, or >= 3 with at least one
 *  indexable enriched API. */
export function isApiCategoryIndexable(counts: { apis: number; indexableEnriched: number }): boolean {
  return counts.apis >= GATES.categoryMinApis ||
    (counts.apis >= GATES.categoryMinApisWithIndexableEnriched && counts.indexableEnriched >= 1)
}

/** An API detail page exists only for reviewed (enriched) APIs. */
export function apiDetailExists(api: Pick<FreeApi, 'enriched' | 'details'>): boolean {
  return api.enriched && api.details !== null
}

/** API gate (3.15): enriched, published (alive or blocked), a summary,
 *  verified within 180 days of the APIs snapshot, and not a low-confidence
 *  review with no sample and no SDK. */
export function isApiIndexable(api: Pick<FreeApi, 'enriched' | 'details' | 'status'>, snapshotIso: IsoDateTime): boolean {
  const d = api.details
  if (!api.enriched || !d) return false
  if (api.status !== 'alive' && api.status !== 'blocked') return false
  if (!d.summary || !d.summary.trim()) return false
  if (!isWithinDays(d.lastVerified, snapshotIso, GATES.apiVerifiedDays)) return false
  return !(d.confidence === 'low' && !d.sample && d.sdks.length === 0)
}

/** Collections always exist; indexed with >= 5 APIs (AI and LLM: >= 5
 *  enriched APIs). */
export function isCollectionIndexable(slug: ApiCollectionSlug, apis: readonly Pick<FreeApi, 'enriched'>[]): boolean {
  const n = slug === 'ai-llm' ? apis.filter(a => a.enriched).length : apis.length
  return n >= GATES.collectionMinApis
}

/** An SDK language page exists with >= 1 SDK. */
export function sdkLanguageExists(sdks: number): boolean {
  return sdks >= 1
}

/** SDK language gate: >= 5 official SDKs. */
export function isSdkLanguageIndexable(officialSdks: number): boolean {
  return officialSdks >= GATES.sdkLanguageMinOfficial
}

/* ── Sitemap ─────────────────────────────────────────────────────────── */

export interface DevSitemapEntry {
  /** Site-relative path ('/developers/open-source/vercel'). */
  path: string
  /** 'YYYY-MM-DD'. */
  lastmod: string
}

/* The later of two ISO dates (either may be missing). */
function laterIso(a: string | null | undefined, b: string | null | undefined): string | null {
  const da = parseIsoDate(a)
  const db = parseIsoDate(b)
  if (!da) return db ? b ?? null : null
  if (!db) return a ?? null
  return da.getTime() >= db.getTime() ? a ?? null : b ?? null
}

/* A date never later than the snapshot it was read in. */
function capAt(iso: string | null | undefined, capIso: string): string {
  const d = parseIsoDate(iso)
  const cap = parseIsoDate(capIso)
  if (!d) return isoDate(capIso)
  return cap && d.getTime() > cap.getTime() ? isoDate(capIso) : isoDate(iso)
}

/** Every indexable /developers URL with its lastmod (7.3). Pass null for a
 *  dataset that failed to load: its pages are left out (and the hub, which
 *  needs both, is left out too) rather than listed with wrong gates. */
export function indexableUrls(oss: OssStore | null, apis: ApisStore | null): DevSitemapEntry[] {
  const out: DevSitemapEntry[] = []
  const seen = new Set<string>()
  const add = (path: string, lastmod: string) => {
    if (!lastmod || seen.has(path)) return
    seen.add(path)
    out.push({ path, lastmod })
  }

  if (oss && apis) add(devHubPath(), isoDate(laterIso(oss.dataAt, apis.dataAt)))
  add(methodologyPath(), METHODOLOGY_UPDATED)

  if (oss) {
    const day = isoDate(oss.dataAt)
    add(ossHubPath(), day)

    const repoPages = Math.min(lastPage(oss.reposAll.length, PAGE_SIZE.repos), GATES.reposIndexedPages)
    for (let p = 1; p <= repoPages; p++) if (isReposPageIndexable(p)) add(ossReposPath(p), day)

    const companyPages = lastPage(oss.companies.length, PAGE_SIZE.companies)
    for (let p = 1; p <= companyPages; p++) if (isCompaniesPageIndexable(p)) add(ossCompaniesPath(p), day)

    for (const kind of ['language', 'topic', 'country', 'industry'] as const) {
      add(ossFacetIndexPath(kind), day)
      for (const facet of oss.facets[kind]) {
        if (!facet.indexable) continue
        add(ossFacetPath(kind, facet.slug), day)
        /* Language and topic lists are paginated; pages 2+ share the gate. */
        if (kind === 'language' || kind === 'topic') {
          const last = lastPage(facet.repos, PAGE_SIZE.facetRepos)
          for (let p = 2; p <= last; p++) add(ossFacetPath(kind, facet.slug, p), day)
        }
      }
    }

    if (isGfiIndexable(oss.issues.length, false)) add(gfiPath(), day)
    for (const lang of oss.gfiLanguages) if (lang.indexable) add(gfiPath(lang.slug), day)

    for (const company of oss.companies) {
      const repos = oss.reposByCompany.get(company.slug) ?? []
      if (!companyExists(repos) || !isCompanyIndexable(repos)) continue
      let latest: string | null = null
      for (const r of repos) latest = laterIso(latest, r.pushedAt)
      add(ossCompanyPath(company.slug), capAt(latest, oss.dataAt))
    }
    for (const repo of oss.reposAll) {
      if (isRepoIndexable(repo, oss.dataAt)) add(ossRepoPath(repo.companySlug, repo.slug), capAt(repo.pushedAt, oss.dataAt))
    }
  }

  if (apis) {
    const day = isoDate(apis.dataAt)
    const checked = isoDate(apis.meta.linksCheckedAt) || day
    add(freeApisPath(), day)

    for (const slug of API_COLLECTIONS) {
      if (isCollectionIndexable(slug, apis.collections[COLLECTION_KEYS[slug]])) add(apiCollectionPath(slug), checked)
    }

    add(sdkPath(), day)
    for (const lang of apis.sdkLanguageStats) if (lang.indexable) add(sdkPath(lang.slug), day)

    for (const cat of apis.categories) {
      const stats = apis.categoryStats.get(cat.slug)
      if (stats?.indexable) add(apiCategoryPath(cat.slug), checked)
    }
    for (const api of apis.apis) {
      if (apiDetailExists(api) && isApiIndexable(api, apis.snapshotAt)) {
        add(apiPath(api.category.slug, api.slug), capAt(api.details?.lastVerified, apis.dataAt))
      }
    }
  }

  return out
}

/** Collection slug -> key in ApisStore.collections. */
export const COLLECTION_KEYS: Readonly<Record<ApiCollectionSlug, 'noAuth' | 'cors' | 'aiLlm'>> = {
  'no-auth': 'noAuth',
  'cors-enabled': 'cors',
  'ai-llm': 'aiLlm',
}
