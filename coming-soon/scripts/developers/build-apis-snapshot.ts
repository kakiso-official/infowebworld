#!/usr/bin/env npx tsx
/**
 * WP2 - Build the committed Free APIs & SDKs snapshot:
 *   data/developers/apis/meta.json  (ApisMeta)
 *   data/developers/apis/apis.json  (FreeApi[])
 *
 * Exactly per DESIGN-SPEC section 5 (data contracts) and 6.4 (snapshot pipeline).
 *
 * Inputs (read-only, scratchpad unless noted):
 *   <scratch>/data/free-apis-base.json       public-apis base list + liveness (MIT)
 *   <scratch>/data/free-apis-verified.json   base+enrichment merged, SDKs/links checked,
 *                                             reviewed patches already applied
 *                                             (scripts/developers/verify-free-apis.mjs)
 *   <scratch>/data/enrich/out-*.json         raw Haiku enrichment (for auth.howToGet,
 *                                             which verify-free-apis.mjs does not carry
 *                                             forward - see "auth recovery" below)
 *   <scratch>/data/free-apis-patches.json    reviewed patches (provenance copy only)
 *   <scratch>/data/sdk-discovery.json        official SDK discovery + re-verification
 *                                             (scripts/developers/discover-official-sdks.ts)
 *   <scratch>/data/iww-listings-with-website.json  live InfoWebWorld listings
 *   scripts/developers/sources/oss-companies.json  OSS companies + their GitHub orgs
 *
 * Outputs:
 *   data/developers/apis/meta.json, data/developers/apis/apis.json
 *   scripts/developers/sources/{free-apis-verified.json (augmented copy),
 *     free-apis-base-meta.json, free-apis-patches.json, sdk-discovery.json}
 *     - copies of the inputs this build actually used, so it can be re-run later
 *       without the scratchpad (per the task brief).
 *
 * auth recovery: verify-free-apis.mjs flattens each enriched record's nested
 * `auth: {type, howToGet}` into a single top-level string (`auth = baseRec.auth
 * ?? enrichment.auth.type`, used for FreeApi.auth/authRaw), which drops
 * `howToGet` entirely - nothing downstream of that script ever sees it again.
 * This script independently re-reads the raw enrichment's `auth.howToGet` by id
 * so `ApiDetails.auth.howToGet` is not silently empty for every enriched API.
 *
 * Usage: npx --yes tsx scripts/developers/build-apis-snapshot.ts
 */

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { languageSlug, slugify, isReservedApiCategorySlug, RESERVED_API_SEGMENTS, RESERVED_DEV_SEGMENTS } from '../../lib/developers/paths'
import type { ApisMeta, ApiDetails, ApiSdk, AuthType, FreeApi, SdkRegistry, Tri } from '../../lib/developers/types'

/* ── Paths ────────────────────────────────────────────────────────────── */

const SCRATCH =
  'C:/Users/AADIL PARMAR/AppData/Local/Temp/claude/F--infoWebWorld-launching-coming-soon/c4f80252-7fec-429c-8b95-1285fe8331e8/scratchpad/devhub'
const REPO_ROOT = path.resolve(__dirname, '..', '..')
const SOURCES_DIR = path.join(REPO_ROOT, 'scripts/developers/sources')
const OUT_DIR = path.join(REPO_ROOT, 'data/developers/apis')

const IN_BASE = path.join(SCRATCH, 'data/free-apis-base.json')
const IN_VERIFIED = path.join(SCRATCH, 'data/free-apis-verified.json')
const IN_ENRICH_DIR = path.join(SCRATCH, 'data/enrich')
const IN_PATCHES = path.join(SCRATCH, 'data/free-apis-patches.json')
const IN_SDK_DISCOVERY = path.join(SCRATCH, 'data/sdk-discovery.json')
const IN_IWW_LISTINGS = path.join(SCRATCH, 'data/iww-listings-with-website.json')
const IN_OSS_COMPANIES = path.join(SOURCES_DIR, 'oss-companies.json')

const OUT_SOURCES_VERIFIED = path.join(SOURCES_DIR, 'free-apis-verified.json')
const OUT_SOURCES_BASE_META = path.join(SOURCES_DIR, 'free-apis-base-meta.json')
const OUT_SOURCES_PATCHES = path.join(SOURCES_DIR, 'free-apis-patches.json')
const OUT_SOURCES_SDK_DISCOVERY = path.join(SOURCES_DIR, 'sdk-discovery.json')

const OUT_META = path.join(OUT_DIR, 'meta.json')
const OUT_APIS = path.join(OUT_DIR, 'apis.json')
const OUT_REPORT = path.join(SCRATCH, 'data/build-apis-snapshot-report.md')

const NOW: string = new Date().toISOString()
const SITE_ORIGIN = 'https://www.infowebworld.com'
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
const IWW_BOT_UA = 'Mozilla/5.0 (compatible; InfoWebWorldBot/1.0; +https://www.infowebworld.com/developers/methodology)'

const CONCURRENCY = 8
const TIMEOUT_MS = 10_000
const SAMPLE_CAP_BYTES = 64 * 1024

/* ── Small generic helpers ───────────────────────────────────────────── */

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, 'utf8')) as T
}
function writeJson(p: string, data: unknown) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2))
}
/* "No em dashes in any published text" (task rule) - the re-researched enrichment
   is already clean, but 9 of the public-apis base one-liners use "—"/"–" as a
   dash. Applied once, deeply, to the final output right before it's written so
   every string field is covered regardless of which source it came from. */
function stripDashes(s: string): string {
  return s.replace(/[–—]/g, ' - ').replace(/ {2,}/g, ' ').trim()
}
function sanitizeDeep<T>(value: T): T {
  if (typeof value === 'string') return stripDashes(value) as unknown as T
  if (Array.isArray(value)) return value.map((v) => sanitizeDeep(v)) as unknown as T
  if (value && typeof value === 'object') {
    const out: any = {}
    for (const [k, v] of Object.entries(value as any)) out[k] = sanitizeDeep(v)
    return out
  }
  return value
}

function getPath(obj: any, dotted: string): any {
  return dotted.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)
}

async function runPool<T, R>(items: T[], concurrency: number, worker: (item: T, i: number) => Promise<R>, label?: string): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0
  let done = 0
  async function runOne() {
    for (;;) {
      const i = next++
      if (i >= items.length) return
      results[i] = await worker(items[i], i)
      done++
      if (label && (done % 50 === 0 || done === items.length)) console.log(`  ${label}: ${done}/${items.length}`)
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, Math.max(items.length, 1)) }, runOne))
  return results
}

async function fetchWithTimeout(url: string, opts: RequestInit, timeoutMs = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { redirect: 'follow', signal: controller.signal, ...opts })
  } finally {
    clearTimeout(timer)
  }
}

/* ── Liveness classification for links we check fresh ourselves
   (curated APIs with no base liveness, and basic rows flagged 'unknown') ── */

async function classifyLink(url: string): Promise<{ status: 'alive' | 'blocked' | 'dead'; httpStatus: number | null }> {
  try {
    const res = await fetchWithTimeout(url, { method: 'GET', headers: { 'User-Agent': BROWSER_UA, Accept: 'text/html,application/json,*/*;q=0.8' } })
    if (res.status >= 200 && res.status < 400) return { status: 'alive', httpStatus: res.status }
    if (res.status === 401 || res.status === 403 || res.status === 429) return { status: 'blocked', httpStatus: res.status }
    return { status: 'dead', httpStatus: res.status }
  } catch {
    return { status: 'dead', httpStatus: null }
  }
}

/* ── Fresh "try it" sample check (Origin header, 64 KB cap, GET only - spec 3.18
   never fires a non-GET sample live). Supersedes anything verify-free-apis.mjs
   stored, since that script checks samples BEFORE patches are applied (a patch
   that corrects a sample's URL, like hail-history's, would otherwise ship with
   a check that ran against the old, wrong URL - or none at all). ── */

async function checkSampleLive(url: string): Promise<NonNullable<ApiDetails['check']>> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    let res: Response
    try {
      res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': BROWSER_UA, Origin: SITE_ORIGIN, Accept: 'application/json, text/plain, */*' },
      })
    } finally {
      clearTimeout(timer)
    }
    if (res.body) {
      const reader = res.body.getReader()
      let bytes = 0
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        bytes += value.length
        if (bytes >= SAMPLE_CAP_BYTES) {
          try {
            await reader.cancel()
          } catch {
            /* ignore */
          }
          break
        }
      }
    }
    const ok = res.status >= 200 && res.status < 300 // strict 2xx (tightened from verify-free-apis.mjs's 2xx/3xx)
    const acao = res.headers.get('access-control-allow-origin')
    const tryable = ok && (acao === '*' || acao === SITE_ORIGIN)
    return { ok, tryable, contentType: res.headers.get('content-type') || null, httpStatus: res.status, checkedAt: NOW }
  } catch {
    return { ok: false, tryable: false, contentType: null, httpStatus: null, checkedAt: NOW }
  }
}

/* ── Own-site HTTP 200 check for provider.iwwPath (mandated UA string) ──── */

async function checkOwnSite200(pathname: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${SITE_ORIGIN}${pathname}`, { method: 'GET', headers: { 'User-Agent': IWW_BOT_UA } })
    return res.status === 200
  } catch {
    return false
  }
}

/* ── Generic URL liveness for the handful of ApiDetails URL fields we did not
   get a check for upstream (none, currently - verify-free-apis.mjs already
   resolved docsUrl/pricingUrl/freeTier.sourceUrl/statusUrl/openapiUrl). Kept
   here only for registryUrl 200-checks on SDKs that came from the OLD sdks[]
   path with no discovery entry at all (none expected, but defensive). ──── */

async function urlIs200(url: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(url, { method: 'GET', headers: { 'User-Agent': BROWSER_UA } })
    return res.status === 200
  } catch {
    return false
  }
}

/* ── Host / domain matching for provider.iwwPath (www-insensitive registrable
   domain, per 6.4's convention for OSS org matching) - plus a denylist of
   shared hosting platforms that must never count as "the same company". ──── */

const MULTI_PART_TLDS = new Set([
  'co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'com.au', 'net.au', 'org.au',
  'co.nz', 'co.jp', 'co.in', 'com.br', 'co.za', 'co.kr',
])
const GENERIC_HOST_DENYLIST = new Set([
  'github.com', 'githubusercontent.com', 'herokuapp.com', 'vercel.app', 'netlify.app', 'netlify.com',
  'pages.dev', 'workers.dev', 'pipedream.com', 'firebaseapp.com', 'web.app', 'glitch.me', 'repl.co',
  'onrender.com', 'railway.app', 'fly.dev', 'surge.sh', '000webhostapp.com', 'google.com', 'googleapis.com',
  'medium.com', 'notion.site', 'gitbook.io', 'readme.io', 'vercel-insights.com',
])

function hostOf(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return null
  }
}
function registrableDomain(host: string): string {
  const labels = host.split('.')
  if (labels.length <= 2) return host
  const lastTwo = labels.slice(-2).join('.')
  if (MULTI_PART_TLDS.has(lastTwo)) return labels.slice(-3).join('.')
  return lastTwo
}

/* ── authRaw convention observed in free-apis-base.json: identical to the
   normalised enum except 'none' -> 'No' ── */
const AUTH_RAW_BY_TYPE: Record<AuthType, string> = {
  none: 'No',
  apiKey: 'apiKey',
  OAuth: 'OAuth',
  'X-Mashape-Key': 'X-Mashape-Key',
  'User-Agent': 'User-Agent',
  other: 'Other',
}
function normalizeAuthType(raw: unknown): AuthType {
  const s = typeof raw === 'string' ? raw : 'other'
  if (s === 'none' || s === 'apiKey' || s === 'OAuth' || s === 'X-Mashape-Key' || s === 'User-Agent') return s
  return 'other'
}

/* ── Types for the raw/intermediate inputs (looser than the final contracts -
   these are what the upstream scripts actually emit) ──────────────────── */

interface BaseApi {
  id: string
  slug: string
  name: string
  description: string
  auth: string
  authRaw: string
  https: boolean
  cors: Tri
  link: string
  category: { name: string; slug: string }
  liveness: { url: string; status: 'alive' | 'blocked' | 'unknown' | 'dead'; httpStatus: number | null; checkedAt: string }
}
interface BaseFile {
  source: { repo: string; license: string; copyright: string; fetchedAt: string }
  apis: BaseApi[]
}

interface VerifiedApi {
  id: string
  name: string
  provider?: { name: string; website: string | null; githubOrg: string | null }
  summary?: string
  freeTier?: { available: boolean | null; summary: string | null; requiresCard: boolean | null; sourceUrl: string | null }
  docsUrl?: string | null
  docsUrlBlocked?: boolean
  pricingUrl?: string | null
  pricingUrlBlocked?: boolean
  baseUrl?: string | null
  sample?: { method: string; url: string; description: string | null; needsKey: boolean; check?: unknown } | null
  sdks?: any[]
  rateLimits?: string | null
  openapiUrl?: string | null
  openapiUrlBlocked?: boolean
  statusUrl?: string | null
  statusUrlBlocked?: boolean
  useCases?: string[]
  tags?: string[]
  sources?: string[]
  confidence?: 'high' | 'medium' | 'low'
  notes?: string | null
  slug: string
  description: string | null
  auth: string
  https: boolean
  category: { name: string; slug: string } | null
  link: string | null
  discoverySource: 'public-apis' | 'added'
  enriched: boolean
  lastVerified?: string
  liveness?: { status: string; httpStatus: number | null }
  flagged?: string
  exclude?: boolean
  authRaw?: string
}
interface VerifiedFile {
  source: { base: { repo: string; license: string; copyright: string; fetchedAt: string }; verifiedAgainst: string[] }
  generatedAt: string
  categories: Array<{ name: string; slug: string; count: number; enrichedCount: number }>
  apis: VerifiedApi[]
}

interface SdkDiscoveryEntry {
  sdks: Array<{
    language: string
    registry: SdkRegistry
    package: string
    official: boolean
    repoUrl: string | null
    version: string | null
    lastPublished: string | null
    registryUrl: string | null
    evidence: string
  }>
  checkedAt: string
}

interface OssOrgRef { login: string }
interface OssCompanyRef { slug: string; orgs: OssOrgRef[] }
interface OssCompaniesFile { generatedAt: string; companies: OssCompanyRef[] }

interface IwwListing { id: number; slug: string; mode: 'product' | 'company'; iwwUrl: string; name: string; website: string; sector: string }

/* ── Main ─────────────────────────────────────────────────────────────── */

async function main() {
  console.log('Loading inputs...')
  const base = readJson<BaseFile>(IN_BASE)
  const verified = readJson<VerifiedFile>(IN_VERIFIED)
  const patchesRaw = fs.existsSync(IN_PATCHES) ? readJson<unknown[]>(IN_PATCHES) : []
  const sdkDiscovery = fs.existsSync(IN_SDK_DISCOVERY) ? readJson<Record<string, SdkDiscoveryEntry>>(IN_SDK_DISCOVERY) : {}
  const ossCompanies = readJson<OssCompaniesFile>(IN_OSS_COMPANIES)
  const iwwListings = readJson<IwwListing[]>(IN_IWW_LISTINGS)

  const baseById = new Map(base.apis.map((a) => [a.id, a]))

  /* Raw enrichment, merged by id - only used to recover auth.howToGet, which
     verify-free-apis.mjs's flattening step discards (see file header). */
  const enrichRawById = new Map<string, any>()
  if (fs.existsSync(IN_ENRICH_DIR)) {
    for (const f of fs.readdirSync(IN_ENRICH_DIR).filter((f) => /^out-.*\.json$/.test(f))) {
      const records = readJson<any[]>(path.join(IN_ENRICH_DIR, f))
      for (const r of records) enrichRawById.set(r.id, r)
    }
  }

  /* org login (lowercased) -> OSS company slug (6.4: one org belongs to exactly one company) */
  const ossCompanyByOrgLogin = new Map<string, string>()
  for (const c of ossCompanies.companies) {
    for (const org of c.orgs || []) ossCompanyByOrgLogin.set(org.login.toLowerCase(), c.slug)
  }

  /* registrable domain -> iwwUrl, skipping shared-hosting domains entirely so
     e.g. a provider on vercel.app/herokuapp.com never cross-links to an
     unrelated listing that happens to share that platform host. */
  const iwwByDomain = new Map<string, string>()
  for (const entry of iwwListings) {
    const host = hostOf(entry.website)
    if (!host) continue
    const domain = registrableDomain(host)
    if (GENERIC_HOST_DENYLIST.has(domain) || GENERIC_HOST_DENYLIST.has(host)) continue
    if (!iwwByDomain.has(domain)) iwwByDomain.set(domain, entry.iwwUrl)
  }

  /* ── Step 1: augment every verified record (authRaw/cors/howToGet recovery),
     drop excluded (citysdk), write the committed sources/ copies. ──────── */

  console.log('Augmenting records and writing scripts/developers/sources/ copies...')
  type Augmented = VerifiedApi & { authRaw: string; cors: Tri; authHowToGet: string | null; livenessOverride: BaseApi['liveness'] | null }
  const augmented: Augmented[] = []
  let excludedCount = 0
  for (const rec of verified.apis) {
    if (rec.exclude === true) {
      excludedCount++
      continue
    }
    const authType = normalizeAuthType(rec.auth)
    const baseRow = baseById.get(rec.id) ?? null
    const authRaw = rec.enriched ? AUTH_RAW_BY_TYPE[authType] : baseRow?.authRaw ?? AUTH_RAW_BY_TYPE[authType]
    const cors: Tri = baseRow?.cors ?? 'unknown'
    const authHowToGet: string | null = rec.enriched ? enrichRawById.get(rec.id)?.auth?.howToGet ?? null : null
    augmented.push({
      ...rec,
      authRaw,
      cors,
      authHowToGet,
      livenessOverride: baseRow?.liveness ?? null,
    })
  }

  /* Committed sources/ copies, so this build is re-runnable without the scratchpad. */
  writeJson(OUT_SOURCES_VERIFIED, {
    generatedAt: NOW,
    note: 'Augmented copy of <scratch>/data/free-apis-verified.json used by build-apis-snapshot.ts: authRaw/cors recovered from free-apis-base.json for enriched rows, auth.howToGet recovered from the raw enrich/out-*.json, citysdk excluded per free-apis-patches.json.',
    categories: verified.categories,
    apis: augmented,
  })
  const allBaseCategories = new Map<string, string>()
  for (const a of base.apis) allBaseCategories.set(a.category.slug, a.category.name)
  writeJson(OUT_SOURCES_BASE_META, {
    repo: 'public-apis/public-apis',
    license: 'MIT',
    copyright: 'Copyright (c) 2022 public-apis',
    fetchedAt: base.source.fetchedAt,
    totalBaseApis: base.apis.length,
    categories: [...allBaseCategories.entries()].map(([slug, name]) => ({ slug, name })).sort((a, b) => a.name.localeCompare(b.name)),
  })
  if (fs.existsSync(IN_PATCHES)) writeJson(OUT_SOURCES_PATCHES, patchesRaw)
  if (fs.existsSync(IN_SDK_DISCOVERY)) writeJson(OUT_SOURCES_SDK_DISCOVERY, sdkDiscovery)

  /* ── Step 2: liveness -> status (alive|blocked), dropping dead/still-unknown. ── */

  console.log('Classifying link status (re-checking curated + unknown-liveness rows live)...')
  const needsFreshCheck = augmented.filter((a) => {
    if (a.enriched) return a.livenessOverride === null // curated: no base liveness at all
    return a.liveness?.status === 'unknown' // basic rows flagged unknown-liveness by verify-free-apis.mjs
  })
  const freshResults = await runPool(
    needsFreshCheck,
    CONCURRENCY,
    async (a) => ({ id: a.id, result: await classifyLink(a.link || '') }),
    'link re-checks',
  )
  const freshById = new Map(freshResults.map((r) => [r.id, r.result]))

  interface Resolved extends Augmented {
    finalStatus: 'alive' | 'blocked'
    finalHttpStatus: number | null
    finalCheckedAt: string
  }
  const resolved: Resolved[] = []
  let droppedDead = 0
  let droppedStillUnknown = 0
  for (const a of augmented) {
    let status: 'alive' | 'blocked' | 'dead' | 'unknown'
    let httpStatus: number | null
    let checkedAt: string
    if (a.enriched) {
      if (a.livenessOverride) {
        status = a.livenessOverride.status
        httpStatus = a.livenessOverride.httpStatus
        checkedAt = a.livenessOverride.checkedAt
      } else {
        const fresh = freshById.get(a.id)!
        status = fresh.status
        httpStatus = fresh.httpStatus
        checkedAt = NOW
      }
    } else {
      status = (a.liveness?.status as any) ?? 'unknown'
      httpStatus = a.liveness?.httpStatus ?? null
      checkedAt = NOW
      if (status === 'unknown') {
        const fresh = freshById.get(a.id)!
        status = fresh.status
        httpStatus = fresh.httpStatus
        checkedAt = NOW
      } else {
        // basic, already-known alive/blocked: keep the base scrape's own checkedAt if we have it
        checkedAt = baseById.get(a.id)?.liveness?.checkedAt ?? NOW
      }
    }
    if (status === 'dead') {
      if (a.liveness?.status === 'unknown' || (a.enriched && !a.livenessOverride)) droppedStillUnknown++
      else droppedDead++
      continue
    }
    resolved.push({ ...a, finalStatus: status as 'alive' | 'blocked', finalHttpStatus: httpStatus, finalCheckedAt: checkedAt })
  }

  /* ── Step 3: per-enriched-record fresh sample check + SDK merge + cross-links. ── */

  console.log('Checking enriched samples live (GET only) and resolving SDKs / cross-links...')
  const enrichedResolved = resolved.filter((a) => a.enriched)
  const sampleChecks = await runPool(
    enrichedResolved,
    CONCURRENCY,
    async (a) => {
      if (a.sample && a.sample.method === 'GET' && a.sample.url) {
        return { id: a.id, check: await checkSampleLive(a.sample.url) }
      }
      return { id: a.id, check: null }
    },
    'sample checks',
  )
  const sampleCheckById = new Map(sampleChecks.map((r) => [r.id, r.check]))

  const iwwPathChecks = await runPool(
    enrichedResolved.filter((a) => {
      const host = hostOf(a.provider?.website)
      return host && iwwByDomain.has(registrableDomain(host))
    }),
    CONCURRENCY,
    async (a) => {
      const host = hostOf(a.provider!.website)!
      const candidate = iwwByDomain.get(registrableDomain(host))!
      const ok = await checkOwnSite200(candidate)
      return { id: a.id, iwwPath: ok ? candidate : null }
    },
    'iwwPath checks',
  )
  const iwwPathById = new Map(iwwPathChecks.map((r) => [r.id, r.iwwPath]))

  /* ── Step 4: build final FreeApi[] + slug/category safety passes. ──────── */

  console.log('Assembling FreeApi records...')
  const usedSlugs = new Set<string>()
  const renamedSlugs: Array<{ id: string; from: string; to: string }> = []
  function safeApiSlug(id: string, candidate: string): string {
    const reserved = RESERVED_API_SEGMENTS.includes(candidate) || RESERVED_DEV_SEGMENTS.includes(candidate)
    let slug = reserved ? `${candidate}-api` : candidate
    let n = 2
    while (usedSlugs.has(slug)) {
      slug = reserved ? `${candidate}-api-${n}` : `${candidate}-${n}`
      n++
    }
    if (slug !== candidate) renamedSlugs.push({ id, from: candidate, to: slug })
    usedSlugs.add(slug)
    return slug
  }

  /* Category slug safety is precomputed once for the full, authoritative 51-category
     list (from free-apis-base.json), independent of which categories happen to have
     a surviving API after liveness drops - this is also what meta.categories is
     built from below, so the nav never loses a category to a prune. */
  const categorySlugRenames: Array<{ from: string; to: string }> = []
  const categorySafeSlugByRaw = new Map<string, string>()
  const categoryNameBySafeSlug = new Map<string, string>()
  for (const [rawSlug, name] of allBaseCategories) {
    let slug = rawSlug
    if (isReservedApiCategorySlug(slug)) {
      slug = `${rawSlug}-category`
      categorySlugRenames.push({ from: rawSlug, to: slug })
    }
    categorySafeSlugByRaw.set(rawSlug, slug)
    categoryNameBySafeSlug.set(slug, name)
  }
  function safeCategory(cat: { name: string; slug: string } | null): { name: string; slug: string } {
    const name = cat?.name ?? 'Uncategorized'
    const rawSlug = cat?.slug ?? 'uncategorized'
    let slug = categorySafeSlugByRaw.get(rawSlug)
    if (!slug) {
      // Defensive only: every real category comes from the 51 precomputed above.
      slug = isReservedApiCategorySlug(rawSlug) ? `${rawSlug}-category` : rawSlug
      categorySafeSlugByRaw.set(rawSlug, slug)
      categoryNameBySafeSlug.set(slug, name)
    }
    return { name, slug }
  }

  let officialSdkTotal = 0
  let sdkTotal = 0
  let noAuthTotal = 0
  let corsTotal = 0
  let tryableTotal = 0

  const finalApis: FreeApi[] = []
  for (const a of resolved) {
    const category = safeCategory(a.category)
    const slug = safeApiSlug(a.id, a.slug || slugify(a.name))
    const authType = normalizeAuthType(a.auth)
    if (authType === 'none') noAuthTotal++
    if (a.cors === 'yes') corsTotal++

    let details: ApiDetails | null = null
    if (a.enriched) {
      const discovery = sdkDiscovery[a.id]
      const sdks: ApiSdk[] = (discovery?.sdks ?? []).map((s) => ({
        language: s.language,
        languageSlug: languageSlug(s.language || 'other'),
        registry: s.registry,
        package: s.package,
        registryUrl: s.registryUrl ?? null,
        official: !!s.official,
        repoUrl: s.repoUrl ?? null,
        version: s.version ?? null,
        lastPublished: s.lastPublished ?? null,
      }))
      sdkTotal += sdks.length
      officialSdkTotal += sdks.filter((s) => s.official).length

      const check = sampleCheckById.get(a.id) ?? null
      if (check?.tryable) tryableTotal++

      const host = hostOf(a.provider?.website)
      const ossCompanySlug = a.provider?.githubOrg ? ossCompanyByOrgLogin.get(a.provider.githubOrg.toLowerCase()) ?? null : null
      const iwwPath = host ? iwwPathById.get(a.id) ?? null : null

      details = {
        provider: {
          name: a.provider?.name ?? a.name,
          website: a.provider?.website ?? null,
          githubOrg: a.provider?.githubOrg ?? null,
          iwwPath,
          ossCompanySlug,
        },
        summary: a.summary ?? a.description ?? '',
        auth: { type: authType, howToGet: a.authHowToGet },
        freeTier: {
          available: a.freeTier?.available ?? null,
          summary: a.freeTier?.summary ?? null,
          requiresCard: a.freeTier?.requiresCard ?? null,
          sourceUrl: a.freeTier?.sourceUrl ?? null,
        },
        docsUrl: a.docsUrl ?? null,
        pricingUrl: a.pricingUrl ?? null,
        baseUrl: a.baseUrl ?? null,
        sample: a.sample
          ? {
              method: a.sample.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
              url: a.sample.url,
              description: a.sample.description ?? null,
              needsKey: a.sample.needsKey,
            }
          : null,
        check,
        sdks,
        rateLimits: a.rateLimits ?? null,
        openapiUrl: a.openapiUrl ?? null,
        statusUrl: a.statusUrl ?? null,
        useCases: a.useCases ?? [],
        tags: a.tags ?? [],
        sources: a.sources ?? [],
        confidence: a.confidence ?? 'low',
        lastVerified: NOW,
      }
    }

    finalApis.push({
      id: a.id,
      slug,
      name: a.name,
      category,
      description: a.description ?? a.summary ?? '',
      auth: authType,
      authRaw: a.authRaw,
      https: a.https,
      cors: a.cors,
      link: a.link ?? '',
      status: a.finalStatus,
      linkCheckedAt: a.finalCheckedAt,
      source: a.discoverySource === 'added' ? 'curated' : 'public-apis',
      enriched: a.enriched,
      details,
    })
  }

  /* ── Step 5: meta. ───────────────────────────────────────────────────── */

  const categories = [...categoryNameBySafeSlug.entries()]
    .map(([slug, name]) => ({ slug, name }))
    .sort((x, y) => x.name.localeCompare(y.name))

  const meta: ApisMeta = {
    schemaVersion: 1,
    generatedAt: NOW,
    linksCheckedAt: NOW,
    baseSource: { repo: 'public-apis/public-apis', license: 'MIT', copyright: 'Copyright (c) 2022 public-apis', fetchedAt: base.source.fetchedAt },
    counts: {
      apis: finalApis.length,
      categories: categories.length,
      enriched: finalApis.filter((a) => a.enriched).length,
      sdks: sdkTotal,
      officialSdks: officialSdkTotal,
      noAuth: noAuthTotal,
      cors: corsTotal,
      tryable: tryableTotal,
    },
    categories,
  }

  const cleanMeta = sanitizeDeep(meta)
  const cleanApis = sanitizeDeep(finalApis)

  console.log(`Writing ${OUT_META}`)
  writeJson(OUT_META, cleanMeta)
  console.log(`Writing ${OUT_APIS}`)
  writeJson(OUT_APIS, cleanApis)

  const report = `# build-apis-snapshot report

Generated: ${NOW}

- Input: ${verified.apis.length} rows in free-apis-verified.json (${excludedCount} excluded by patch: citysdk).
- Dropped as dead (already dead at base-scrape time, enriched curated check, or basic re-check): ${droppedDead}
- Dropped as still-unknown after a fresh re-check: ${droppedStillUnknown}
- Final kept APIs: ${finalApis.length} (${meta.counts.enriched} enriched, ${finalApis.length - meta.counts.enriched} basic)
- Categories: ${categories.length}
- Slug renames (collision/reserved safety): ${renamedSlugs.length}
${renamedSlugs.map((r) => `  - ${r.id}: ${r.from} -> ${r.to}`).join('\n')}
- Category slug renames (reserved safety): ${categorySlugRenames.length}
${categorySlugRenames.map((r) => `  - ${r.from} -> ${r.to}`).join('\n')}
- SDKs: ${sdkTotal} total, ${officialSdkTotal} official
- No-auth APIs: ${noAuthTotal}
- CORS-enabled APIs: ${corsTotal}
- Tryable (live, GET, CORS-open) enriched samples: ${tryableTotal}
`
  fs.writeFileSync(OUT_REPORT, report)
  console.log(report)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
