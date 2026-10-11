/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - the free-APIs store (spec 6.2).

   buildApisStore() turns apis/meta.json + apis/apis.json into every index
   the free-API pages need: per-category lists and stats, the three
   collections, flattened SDK rows per language, the hub's hero API and
   the API <-> open-source company bridge.

   PURE: no fs, no network, no clock (lib/developers/store.ts loads and
   memoises; refresh.ts rebuilds after a weekly check). Unit-testable with
   plain `tsx`.

   Category list order (3.14): reviewed (enriched) APIs first, then live
   APIs A-Z, then the ones our checker could not reach (blocked) A-Z.
   ═══════════════════════════════════════════════════════════════════════ */

import { isAiLlmApi, isCorsEnabledApi, isNoAuthApi } from './collections'
import { isWithinDays, parseIsoDate } from './format'
import { apiDetailExists, isApiCategoryIndexable, isApiIndexable, isSdkLanguageIndexable, sdkLanguageExists } from './indexing'
import { apiPath, type ApiCollectionSlug } from './paths'
import { isTryable } from './snippets'
import { apiInTabBucket, apiCategoryPhrase, compareSdkLanguages, languageNameFromSlug, type ApiTabBucket } from './taxonomy'
import type { ApiSdk, ApisMeta, AuthType, FreeApi, IsoDateTime, SdkRegistry } from './types'

/* ── Store shape ─────────────────────────────────────────────────────── */

export interface ApiCategoryStats {
  slug: string
  name: string
  /** 'Weather', 'Games and Comics' (for "Free {phrase} APIs"). */
  phrase: string
  apis: number
  alive: number
  blocked: number
  enriched: number
  /** Enriched APIs that pass the API detail gate. */
  indexableEnriched: number
  noAuth: number
  /** CORS-enabled (cors yes + https). */
  cors: number
  https: number
  /** Enriched APIs with at least one official SDK. */
  withSdks: number
  /** Enriched APIs whose sample can run in the browser. */
  tryable: number
  indexable: boolean
}

export interface SdkRow {
  sdk: ApiSdk
  apiSlug: string
  apiName: string
  categorySlug: string
  categoryName: string
  /** Our API detail page. */
  href: string
}

export interface SdkLanguageStat {
  slug: string
  name: string
  sdks: number
  official: number
  /** Distinct APIs with an official SDK in this language. */
  apis: number
  /** Registries, most used first. */
  registries: SdkRegistry[]
  latestPublished: IsoDateTime | null
  indexable: boolean
}

export interface AuthMix {
  none: number
  apiKey: number
  OAuth: number
  other: number
}

export interface ApisTotals {
  apis: number
  categories: number
  enriched: number
  /** Enriched APIs that pass the API detail gate. */
  indexableEnriched: number
  sdks: number
  officialSdks: number
  /** Enriched APIs with at least one official SDK. */
  apisWithOfficialSdks: number
  noAuth: number
  cors: number
  https: number
  tryable: number
  alive: number
  blocked: number
  authMix: AuthMix
}

export interface ApisStore {
  version: number
  meta: ApisMeta
  /** Snapshot time (meta.generatedAt): the API detail gate is measured here. */
  snapshotAt: IsoDateTime
  /** Freshest data time: the last successful runtime check, else the snapshot. */
  dataAt: IsoDateTime
  /** Every published API, dataset order. */
  apis: readonly FreeApi[]
  apiBySlug: ReadonlyMap<string, FreeApi>
  /** Categories with at least one API, in dataset order. */
  categories: ReadonlyArray<{ slug: string; name: string }>
  apisByCategory: ReadonlyMap<string, readonly FreeApi[]>
  categoryStats: ReadonlyMap<string, ApiCategoryStats>
  /** OSS company slug -> slugs of the enriched APIs it provides. */
  providerByCompany: ReadonlyMap<string, readonly string[]>
  /** API slug -> OSS company slug of its provider. */
  ossCompanyByApi: ReadonlyMap<string, string>
  /** Each collection grouped in category order (see collectionGroups). */
  collections: Readonly<{ noAuth: readonly FreeApi[]; cors: readonly FreeApi[]; aiLlm: readonly FreeApi[] }>
  /** Every SDK of every reviewed API, most recently published first. */
  sdkRows: readonly SdkRow[]
  sdksByLanguage: ReadonlyMap<string, readonly SdkRow[]>
  /** One entry per SDK language, in the fixed SDK language order. */
  sdkLanguageStats: readonly SdkLanguageStat[]
  /** The hub terminal card's API (3.1), or null when none is tryable. */
  heroApi: FreeApi | null
  totals: ApisTotals
}

let buildCount = 0

/* ── Per-API helpers ─────────────────────────────────────────────────── */

/** Official SDKs of an API ([] for an unreviewed API). */
export function officialSdks(api: Pick<FreeApi, 'details'>): ApiSdk[] {
  return api.details ? api.details.sdks.filter(s => s.official) : []
}

/** Community SDKs of an API. */
export function communitySdks(api: Pick<FreeApi, 'details'>): ApiSdk[] {
  return api.details ? api.details.sdks.filter(s => !s.official) : []
}

/** Verified tags of a reviewed API ([] otherwise). */
export function apiTags(api: Pick<FreeApi, 'details'>): string[] {
  return api.details?.tags ?? []
}

/** The reviewed auth type when there is one, else the listed one. */
export function apiAuthType(api: Pick<FreeApi, 'auth' | 'details'>): AuthType {
  return api.details?.auth.type ?? api.auth
}

/** True when the Try it panel can run this API's sample (4.11). */
export function isApiTryable(api: Pick<FreeApi, 'details'>): boolean {
  return !!api.details && isTryable(api.details.sample, api.details.check)
}

/** Where a row or card links: our detail page for a reviewed API, else the
 *  API's own link (opened in a new tab). */
export function apiHref(api: Pick<FreeApi, 'enriched' | 'details' | 'category' | 'slug' | 'link'>): { href: string; external: boolean } {
  return apiDetailExists(api) ? { href: apiPath(api.category.slug, api.slug), external: false } : { href: api.link, external: true }
}

/** VerifiedBadge rule (4.7): reviewed, the last sample check passed and the
 *  facts were verified within 30 days of the data date. */
export function isApiRecentlyVerified(api: Pick<FreeApi, 'enriched' | 'details'>, dataAtIso: IsoDateTime): boolean {
  const d = api.details
  return api.enriched && !!d && d.check?.ok === true && isWithinDays(d.lastVerified, dataAtIso, 30)
}

/* Auth bucket of the hub's auth-mix bar. */
function authBucket(auth: AuthType): keyof AuthMix {
  if (auth === 'none' || auth === 'apiKey' || auth === 'OAuth') return auth
  return 'other'
}

/* Category list order: enriched, then alive A-Z, then blocked A-Z. */
function categoryOrder(a: FreeApi, b: FreeApi): number {
  return Number(b.enriched) - Number(a.enriched) ||
    Number(a.status === 'blocked') - Number(b.status === 'blocked') ||
    a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) ||
    a.slug.localeCompare(b.slug, 'en')
}

function time(iso: string | null | undefined): number {
  return parseIsoDate(iso)?.getTime() ?? 0
}

/* ── Builder ─────────────────────────────────────────────────────────── */

/** Build the free-APIs store. `ossCompanyByOrgLogin` (lowercased GitHub
 *  org login -> OSS company slug) fills the API -> company bridge for
 *  reviewed APIs whose snapshot row has a githubOrg but no ossCompanySlug. */
export function buildApisStore(
  meta: ApisMeta,
  apisIn: readonly FreeApi[],
  ossCompanyByOrgLogin?: ReadonlyMap<string, string>,
): ApisStore {
  const snapshotAt = meta.generatedAt
  const dataAt = meta.refresh?.lastOkAt ?? meta.generatedAt

  /* First row wins on a duplicate slug (the validator rejects duplicates). */
  const apiBySlug = new Map<string, FreeApi>()
  for (const a of apisIn) if (!apiBySlug.has(a.slug)) apiBySlug.set(a.slug, a)
  const apis = [...apiBySlug.values()]

  /* Categories, in dataset order, with meta names when present. */
  const metaNames = new Map(meta.categories.map(c => [c.slug, c.name]))
  const apisByCategory = new Map<string, FreeApi[]>()
  for (const a of apis) {
    const list = apisByCategory.get(a.category.slug)
    if (list) list.push(a)
    else apisByCategory.set(a.category.slug, [a])
  }
  for (const list of apisByCategory.values()) list.sort(categoryOrder)
  const orderedSlugs = [
    ...meta.categories.map(c => c.slug).filter(s => apisByCategory.has(s)),
    ...[...apisByCategory.keys()].filter(s => !metaNames.has(s)).sort(),
  ]
  const categories = orderedSlugs.map(slug => ({
    slug,
    name: metaNames.get(slug) ?? apisByCategory.get(slug)![0].category.name,
  }))

  const categoryStats = new Map<string, ApiCategoryStats>()
  for (const cat of categories) {
    const list = apisByCategory.get(cat.slug)!
    const enriched = list.filter(a => apiDetailExists(a))
    const stats: ApiCategoryStats = {
      slug: cat.slug,
      name: cat.name,
      phrase: apiCategoryPhrase(cat.slug, cat.name),
      apis: list.length,
      alive: list.filter(a => a.status === 'alive').length,
      blocked: list.filter(a => a.status === 'blocked').length,
      enriched: enriched.length,
      indexableEnriched: enriched.filter(a => isApiIndexable(a, snapshotAt)).length,
      noAuth: list.filter(isNoAuthApi).length,
      cors: list.filter(isCorsEnabledApi).length,
      https: list.filter(a => a.https).length,
      withSdks: enriched.filter(a => officialSdks(a).length > 0).length,
      tryable: enriched.filter(isApiTryable).length,
      indexable: false,
    }
    stats.indexable = isApiCategoryIndexable(stats)
    categoryStats.set(cat.slug, stats)
  }

  /* API -> OSS company bridge (reviewed APIs only). */
  const ossCompanyByApi = new Map<string, string>()
  const providerByCompany = new Map<string, string[]>()
  for (const a of apis) {
    if (!apiDetailExists(a)) continue
    const p = a.details!.provider
    const slug = p.ossCompanySlug ?? (p.githubOrg ? ossCompanyByOrgLogin?.get(p.githubOrg.toLowerCase()) : undefined)
    if (!slug) continue
    ossCompanyByApi.set(a.slug, slug)
    const list = providerByCompany.get(slug)
    if (list) list.push(a.slug)
    else providerByCompany.set(slug, [a.slug])
  }

  /* Collections, grouped in category order. */
  const inCategoryOrder = (pred: (a: FreeApi) => boolean) =>
    categories.flatMap(c => apisByCategory.get(c.slug)!.filter(pred))
  const aiLlm = apis.filter(isAiLlmApi).sort((a, b) =>
    /* AI compare table (3.16): no card needed first, then name. */
    Number(a.details?.freeTier.requiresCard !== false) - Number(b.details?.freeTier.requiresCard !== false) ||
    a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
  const collections = {
    noAuth: inCategoryOrder(isNoAuthApi),
    cors: inCategoryOrder(isCorsEnabledApi),
    aiLlm,
  }

  /* SDK rows of reviewed APIs. */
  const sdkRows: SdkRow[] = []
  for (const a of apis) {
    if (!apiDetailExists(a)) continue
    for (const sdk of a.details!.sdks) {
      sdkRows.push({
        sdk,
        apiSlug: a.slug,
        apiName: a.name,
        categorySlug: a.category.slug,
        categoryName: a.category.name,
        href: apiPath(a.category.slug, a.slug),
      })
    }
  }
  sdkRows.sort((x, y) => time(y.sdk.lastPublished) - time(x.sdk.lastPublished) ||
    Number(y.sdk.official) - Number(x.sdk.official) ||
    x.apiName.localeCompare(y.apiName, 'en', { sensitivity: 'base' }) ||
    x.sdk.package.localeCompare(y.sdk.package, 'en'))
  const sdksByLanguage = new Map<string, SdkRow[]>()
  for (const row of sdkRows) {
    const list = sdksByLanguage.get(row.sdk.languageSlug)
    if (list) list.push(row)
    else sdksByLanguage.set(row.sdk.languageSlug, [row])
  }
  const sdkLanguageStats: SdkLanguageStat[] = [...sdksByLanguage.entries()]
    .filter(([, rows]) => sdkLanguageExists(rows.length))
    .map(([slug, rows]) => {
      const official = rows.filter(r => r.sdk.official)
      const registryCounts = new Map<SdkRegistry, number>()
      for (const r of rows) registryCounts.set(r.sdk.registry, (registryCounts.get(r.sdk.registry) ?? 0) + 1)
      let latest: string | null = null
      for (const r of rows) if (r.sdk.lastPublished && time(r.sdk.lastPublished) > time(latest)) latest = r.sdk.lastPublished
      return {
        slug,
        name: languageNameFromSlug(slug) ?? rows[0].sdk.language,
        sdks: rows.length,
        official: official.length,
        apis: new Set(official.map(r => r.apiSlug)).size,
        registries: [...registryCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([r]) => r),
        latestPublished: latest,
        indexable: isSdkLanguageIndexable(official.length),
      }
    })
    .sort((a, b) => compareSdkLanguages({ languageSlug: a.slug, language: a.name }, { languageSlug: b.slug, language: b.name }))

  /* Hero API (3.1): reviewed, tryable without a key, most official SDKs,
     then name; an indexable one when there is one. */
  const heroPool = apis.filter(a => apiDetailExists(a) && isApiTryable(a))
  const heroSorted = heroPool.slice().sort((a, b) =>
    Number(isApiIndexable(b, snapshotAt)) - Number(isApiIndexable(a, snapshotAt)) ||
    officialSdks(b).length - officialSdks(a).length ||
    a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
  const heroApi = heroSorted[0] ?? null

  const authMix: AuthMix = { none: 0, apiKey: 0, OAuth: 0, other: 0 }
  for (const a of apis) authMix[authBucket(a.auth)]++

  const enrichedApis = apis.filter(a => apiDetailExists(a))
  const totals: ApisTotals = {
    apis: apis.length,
    categories: categories.length,
    enriched: enrichedApis.length,
    indexableEnriched: enrichedApis.filter(a => isApiIndexable(a, snapshotAt)).length,
    sdks: sdkRows.length,
    officialSdks: sdkRows.filter(r => r.sdk.official).length,
    apisWithOfficialSdks: enrichedApis.filter(a => officialSdks(a).length > 0).length,
    noAuth: collections.noAuth.length,
    cors: collections.cors.length,
    https: apis.filter(a => a.https).length,
    tryable: enrichedApis.filter(isApiTryable).length,
    alive: apis.filter(a => a.status === 'alive').length,
    blocked: apis.filter(a => a.status === 'blocked').length,
    authMix,
  }

  buildCount++
  return Object.freeze({
    version: buildCount,
    meta,
    snapshotAt,
    dataAt,
    apis,
    apiBySlug,
    categories,
    apisByCategory,
    categoryStats,
    providerByCompany,
    ossCompanyByApi,
    collections,
    sdkRows,
    sdksByLanguage,
    sdkLanguageStats,
    heroApi,
    totals,
  })
}

/* ── Gates bound to the store ────────────────────────────────────────── */

/** API detail gate (3.15), measured against the APIs snapshot. */
export function isApiPageIndexable(store: ApisStore, api: FreeApi): boolean {
  return apiDetailExists(api) && isApiIndexable(api, store.snapshotAt)
}

/* ── Selectors ───────────────────────────────────────────────────────── */

/** APIs of a collection, as listed on its page. */
export function collectionApis(store: ApisStore, slug: ApiCollectionSlug): readonly FreeApi[] {
  return slug === 'no-auth' ? store.collections.noAuth : slug === 'cors-enabled' ? store.collections.cors : store.collections.aiLlm
}

/** A list grouped by category, in dataset category order (collection
 *  pages: sticky group headers + category anchor pills). */
export function collectionGroups(store: ApisStore, apis: readonly FreeApi[]):
  Array<{ category: { slug: string; name: string }; apis: FreeApi[] }> {
  const bySlug = new Map<string, FreeApi[]>()
  for (const a of apis) {
    const list = bySlug.get(a.category.slug)
    if (list) list.push(a)
    else bySlug.set(a.category.slug, [a])
  }
  return store.categories
    .filter(c => bySlug.has(c.slug))
    .map(c => ({ category: c, apis: bySlug.get(c.slug)!.slice().sort(categoryOrder) }))
}

/** Alternatives in the same category (3.15): reviewed first, same auth
 *  type first, then most official SDKs, then name. */
export function apiAlternatives(store: ApisStore, api: FreeApi, limit = 6): FreeApi[] {
  const auth = apiAuthType(api)
  return (store.apisByCategory.get(api.category.slug) ?? [])
    .filter(a => a.slug !== api.slug)
    .slice()
    .sort((a, b) =>
      Number(apiDetailExists(b)) - Number(apiDetailExists(a)) ||
      Number(apiAuthType(b) === auth) - Number(apiAuthType(a) === auth) ||
      officialSdks(b).length - officialSdks(a).length ||
      categoryOrder(a, b))
    .slice(0, limit)
}

/** Reviewed APIs with at least one official SDK in a hub tab bucket,
 *  ranked by official SDK count then name (3.13). */
export function popularSdkApis(store: ApisStore, bucket: ApiTabBucket, limit = 9): FreeApi[] {
  return store.apis
    .filter(a => apiDetailExists(a) && officialSdks(a).length > 0 &&
      apiInTabBucket(bucket, { categorySlug: a.category.slug, tags: apiTags(a) }))
    .sort((a, b) => officialSdks(b).length - officialSdks(a).length ||
      a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
    .slice(0, limit)
}

/** No-key APIs that can be tried in the browser (free APIs hub band). */
export function tryableNoKeyApis(store: ApisStore, limit = 6): FreeApi[] {
  return store.collections.noAuth
    .filter(a => apiDetailExists(a) && isApiTryable(a))
    .slice()
    .sort((a, b) => Number(isApiPageIndexable(store, b)) - Number(isApiPageIndexable(store, a)) ||
      officialSdks(b).length - officialSdks(a).length ||
      a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
    .slice(0, limit)
}

/** Categories with the most APIs (hub grid), ties by dataset order. */
export function topCategories(store: ApisStore, limit = 12): ApiCategoryStats[] {
  return store.categories
    .map((c, i) => ({ stats: store.categoryStats.get(c.slug)!, i }))
    .sort((a, b) => b.stats.apis - a.stats.apis || a.i - b.i)
    .slice(0, limit)
    .map(x => x.stats)
}

/** Reviewed APIs of an OSS company (the company page's ApiPromo card). */
export function apisForCompany(store: ApisStore, companySlug: string): FreeApi[] {
  return (store.providerByCompany.get(companySlug) ?? [])
    .map(slug => store.apiBySlug.get(slug))
    .filter((a): a is FreeApi => !!a)
}

/** The OSS company that publishes this API's provider org, or null. */
export function apiOssCompanySlug(store: ApisStore, api: FreeApi): string | null {
  return store.ossCompanyByApi.get(api.slug) ?? null
}
