#!/usr/bin/env -S npx tsx
/* ═══════════════════════════════════════════════════════════════════════
   build-oss-snapshot.ts - InfoWebWorld for Developers (WP2-oss)

   Produces the committed open-source snapshot:
     data/developers/oss/meta.json       OssMeta
     data/developers/oss/companies.json  OssCompany[] (+ iwwMode, iwwName)
     data/developers/oss/repos.json      OssRepo[]
     data/developers/oss/issues.json     OssIssue[]

   Inputs (scripts/developers/sources/, re-runnable):
     oss-companies.json       587 merged companies with candidate orgs
     iww-github-matches.json  proof of InfoWebWorld <-> GitHub org matches

   Company-to-org check (deterministic, no manual research) - an org is
   published for a company when ANY holds:
     (a) GitHub isVerified is true
     (b) the org websiteUrl's registrable domain equals the company
         website's (www-insensitive, eTLD+1)
     (c) an InfoWebWorld match proven by domain or exact name
         (scripts/developers/sources/iww-github-matches.json)
     (d) the company homepage links to github.com/<org> (live fetch,
         normal browser UA, 12s timeout, concurrency 12)
   Anything else is rejected and written to
   scripts/developers/sources/oss-org-review.json as a pending manual-
   review row; a company left with no published org is dropped and logged.

   GitHub pull: GraphQL with aliases (~5 orgs per query for org/repo data,
   ~10 per query for the good-first-issue search), batched, raw responses
   cached (resumable) under the scratch workspace so a re-run only fetches
   what is missing. Retries with backoff; pauses when the shared rate
   limit budget runs low.

   Usage: npx tsx scripts/developers/build-oss-snapshot.ts [--force]
     --force   ignore the raw GraphQL cache and re-fetch everything
   ═══════════════════════════════════════════════════════════════════════ */

import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import {
  countryNameFromIso2, countryFacetSlug, industrySlug, safeCompanySlug,
  assignRepoSlugs, absoluteUrl,
} from '../../lib/developers/paths'
import type { OssMeta, OssCompany, OssOrg, OssRepo, OssIssue } from '../../lib/developers/types'

/* ── Paths ───────────────────────────────────────────────────────────── */
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '../..')
const SOURCES_DIR = path.join(__dirname, 'sources')
const OUT_DIR = path.join(REPO_ROOT, 'data/developers/oss')
/* Scratch workspace (not committed): raw GraphQL responses, resumable. */
const RAW_CACHE_DIR = 'C:/Users/AADIL PARMAR/AppData/Local/Temp/claude/F--infoWebWorld-launching-coming-soon/c4f80252-7fec-429c-8b95-1285fe8331e8/scratchpad/devhub/data/oss-raw'

const FORCE = process.argv.includes('--force')
const ORG_BATCH_SIZE = 5
const GFI_BATCH_SIZE = 10
const HOMEPAGE_CONCURRENCY = 12
const REPOS_PER_ORG = 30
const REPOS_PER_COMPANY = 30
const GFI_LABELS = ['good first issue', 'good-first-issue', 'Good First Issue', 'good first issues']
const SNAPSHOT_AT = new Date().toISOString()
const GFI_CUTOFF = new Date(Date.now() - 180 * 86400000).toISOString().slice(0, 10)
const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.mkdirSync(RAW_CACHE_DIR, { recursive: true })

/* ── Small helpers ───────────────────────────────────────────────────── */
function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}
function writeJsonMin(p: string, data: unknown): void {
  fs.writeFileSync(p, JSON.stringify(data))
}
function sleepSync(ms: number): void {
  const view = new Int32Array(new SharedArrayBuffer(4))
  Atomics.wait(view, 0, 0, Math.max(0, ms))
}

/** Replace em/en dashes used as a dash with " - " (data rule: no em dashes
 *  in any published text field). */
function sanitizeDashes(s: string): string {
  return s.replace(/[\u2012\u2013\u2014\u2015]/g, ' - ').replace(/[ \t]{2,}/g, ' ').trim()
}
/** Remove :shortcode: emoji (GitHub renders these in repo descriptions). */
function stripEmojiShortcodes(s: string): string {
  return s.replace(/:[a-z0-9_+-]+:/gi, '').replace(/[ \t]{2,}/g, ' ').trim()
}
/** Truncate at a word boundary, never mid-word when a nearby space exists. */
function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  const cut = s.slice(0, max)
  const idx = cut.lastIndexOf(' ')
  return (idx > max * 0.6 ? cut.slice(0, idx) : cut).trim()
}
/** Nullable free text (descriptions, one-liners): emoji-shortcodes
 *  stripped, dashes sanitized, optionally truncated; '' -> null. */
function cleanText(raw: string | null | undefined, max?: number): string | null {
  if (!raw) return null
  let s = stripEmojiShortcodes(raw)
  s = sanitizeDashes(s)
  if (max) s = truncate(s, max)
  return s || null
}
/** Required display text (names, industries): dash-sanitized only - never
 *  stripped to null, never truncated (these are identifiers, not prose). */
function cleanRequired(raw: string): string {
  return sanitizeDashes(raw)
}

/** GitHub's own `websiteUrl` field is sometimes scheme-less ('www.gradio.app',
 *  'obsidian.md'); we render it as a real link (3.6 "Website" button), so it
 *  must be an absolute URL. Default to https when no scheme is present. */
function ensureHttps(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

const TWO_PART_TLDS = new Set(['co.uk', 'com.au', 'co.jp', 'co.nz', 'co.in', 'com.br', 'co.kr', 'co.za', 'co.id'])
/** Registrable domain (eTLD+1, www-insensitive): best-effort, covers the
 *  handful of common two-part TLDs seen in this dataset. */
function registrableDomain(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`)
    const host = u.hostname.toLowerCase().replace(/^www\./, '')
    const parts = host.split('.')
    if (parts.length <= 2) return host
    const lastTwo = parts.slice(-2).join('.')
    if (TWO_PART_TLDS.has(lastTwo) && parts.length >= 3) return parts.slice(-3).join('.')
    return lastTwo
  } catch {
    return null
  }
}

/** Bounded-concurrency runner: at most `limit` workers in flight. */
async function runWithConcurrency<T>(items: T[], limit: number, worker: (item: T) => Promise<void>): Promise<void> {
  let idx = 0
  const lanes = Math.max(1, Math.min(limit, items.length))
  async function lane(): Promise<void> {
    for (;;) {
      const i = idx++
      if (i >= items.length) return
      await worker(items[i])
    }
  }
  await Promise.all(Array.from({ length: lanes }, lane))
}

/* ── Criterion (d): live homepage -> github.com/<org> link check ───────── */
const HOMEPAGE_FETCH_TIMEOUT_MS = 12000

async function fetchHomepageHtml(website: string): Promise<string | null> {
  const url = /^https?:\/\//i.test(website) ? website : `https://${website}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), HOMEPAGE_FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': BROWSER_UA, Accept: 'text/html,*/*' },
    })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

function htmlLinksToOrg(html: string, orgLogin: string): boolean {
  const escaped = orgLogin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`github\\.com/${escaped}(?![\\w-])`, 'i')
  return re.test(html)
}

/* One fetch per distinct company website, however many orgs need it. */
const homepageHtmlCache = new Map<string, Promise<string | null>>()
function getHomepageHtml(website: string): Promise<string | null> {
  let p = homepageHtmlCache.get(website)
  if (!p) {
    p = fetchHomepageHtml(website)
    homepageHtmlCache.set(website, p)
  }
  return p
}

/* ── gh api graphql runner: cached, retried with backoff, rate-limit aware ──
   GitHub returns exit code 1 whenever ANY aliased field in the batch errors
   (e.g. a renamed/deleted org -> NOT_FOUND for that one alias), even though
   every OTHER alias in the same response is populated correctly. Parsing
   stdout regardless of the process exit code (and treating "has a data
   object" as success) is what makes a single bad login in a batch not
   destroy the other 4-9 good ones. */
function ghGraphql(queryText: string, cacheFile: string): any {
  if (!FORCE && fs.existsSync(cacheFile)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
      if (cached && cached.data) return cached
    } catch { /* corrupt cache, re-fetch */ }
  }
  let attempt = 0
  for (;;) {
    attempt++
    const res = spawnSync('gh', ['api', 'graphql', '-f', `query=${queryText}`], {
      encoding: 'utf8', maxBuffer: 1024 * 1024 * 64,
    })
    let json: any = null
    if (res.stdout) {
      try { json = JSON.parse(res.stdout) } catch { json = null }
    }
    if (json && json.data) {
      if (Array.isArray(json.errors) && json.errors.length) {
        console.log(`  [graphql] ${json.errors.length} field error(s): ${json.errors.slice(0, 3).map((e: any) => e.message).join(' | ')}`)
      }
      fs.writeFileSync(cacheFile, JSON.stringify(json))
      const rl = json.data.rateLimit
      if (rl && typeof rl.remaining === 'number' && rl.remaining < 300) {
        const waitMs = Math.max(0, new Date(rl.resetAt).getTime() - Date.now()) + 2000
        console.log(`  rate limit low (${rl.remaining} left) - pausing ${Math.round(waitMs / 1000)}s until ${rl.resetAt}`)
        sleepSync(waitMs)
      }
      return json
    }
    const stderrText = res.stderr || ''
    const isRateLimited = /rate limit|RATE_LIMITED|secondary rate limit/i.test(stderrText) || /rate limit/i.test(String(res.stdout || ''))
    if (attempt >= 5) {
      console.error('  gh graphql failed after retries:', stderrText.slice(0, 500) || res.stdout?.slice(0, 500))
      return null
    }
    const backoff = isRateLimited ? 60000 : Math.min(30000, 2000 * Math.pow(2, attempt - 1))
    console.log(`  gh graphql attempt ${attempt} failed, retrying in ${Math.round(backoff / 1000)}s`)
    sleepSync(backoff)
  }
}

/* ── Load sources ────────────────────────────────────────────────────── */
type SourceOrg = { login: string; type?: string; isVerified?: boolean; websiteUrl?: string | null }
type SourceCompany = {
  slug: string; name: string; website: string | null; hqCountry: string | null
  industry: string; oneLiner: string | null; orgs: SourceOrg[]
  listedOnIww?: boolean; iwwUrl?: string | null; listingId?: number | null; mode?: 'company' | 'product' | null
}
type IwwMatch = {
  listingId: number; slug: string; mode: 'company' | 'product'; iwwUrl: string; name: string
  website: string | null; sector: string; matchReason: 'domain' | 'name'; github?: { login?: string }
}

const ossSource = readJson<{ generatedAt: string; companies: SourceCompany[] }>(path.join(SOURCES_DIR, 'oss-companies.json'))
const iwwMatches = readJson<IwwMatch[]>(path.join(SOURCES_DIR, 'iww-github-matches.json'))

const matchByLogin = new Map<string, IwwMatch>()
const matchByListingId = new Map<number, IwwMatch>()
for (const m of iwwMatches) {
  if (m.github?.login) {
    const lk = m.github.login.toLowerCase()
    if (!matchByLogin.has(lk)) matchByLogin.set(lk, m)
  }
  if (typeof m.listingId === 'number' && !matchByListingId.has(m.listingId)) matchByListingId.set(m.listingId, m)
}

/* ── Step 1: deterministic company-to-org check ─────────────────────── */
type PlannedOrg = { login: string; reason: string }
type PlannedCompany = SourceCompany & { plannedOrgs: PlannedOrg[] }
type PendingReviewRow = { login: string; company: string; companySlug: string; websiteUrl: string | null; reason: string; status: 'pending' }
type DCheck = 'linked' | 'not-linked' | 'fetch-failed' | 'no-website'

function buildPendingReason(c: SourceCompany, org: SourceOrg, d: DCheck): string {
  const companyDomain = registrableDomain(c.website) ?? 'none'
  const orgDomain = registrableDomain(org.websiteUrl) ?? 'none'
  const dPhrase = d === 'not-linked' ? `The company homepage (${c.website}) does not link to github.com/${org.login}`
    : d === 'fetch-failed' ? 'The company homepage could not be fetched to check for a GitHub link'
      : 'The company has no website on file to check for a GitHub link'
  return `Not GitHub-verified. Org website domain (${orgDomain}) does not match company website domain (${companyDomain}). `
    + `No InfoWebWorld match proven by domain or name for this org. ${dPhrase}.`
}

async function planCompanies(): Promise<{ planned: PlannedCompany[]; droppedCompanies: string[]; pendingReview: PendingReviewRow[] }> {
  const resolved = new Map<string, string>() // `${companySlug}::${login}` -> reason
  const needsD: Array<{ company: SourceCompany; org: SourceOrg }> = []

  for (const c of ossSource.companies) {
    const companyDomain = registrableDomain(c.website)
    for (const org of c.orgs) {
      const key = `${c.slug}::${org.login}`
      if (org.isVerified) { resolved.set(key, 'isVerified'); continue }
      const orgDomain = registrableDomain(org.websiteUrl)
      if (orgDomain && companyDomain && orgDomain === companyDomain) { resolved.set(key, 'domain-match'); continue }
      const m = matchByLogin.get(org.login.toLowerCase())
      if (m && (m.matchReason === 'domain' || m.matchReason === 'name')) { resolved.set(key, `iww-${m.matchReason}`); continue }
      needsD.push({ company: c, org })
    }
  }

  console.log(`[plan] ${needsD.length} org(s) need the live homepage-link check (criterion d), concurrency ${HOMEPAGE_CONCURRENCY}`)
  const dResult = new Map<string, DCheck>()
  await runWithConcurrency(needsD, HOMEPAGE_CONCURRENCY, async ({ company: c, org }) => {
    const key = `${c.slug}::${org.login}`
    if (!c.website) { dResult.set(key, 'no-website'); return }
    const html = await getHomepageHtml(c.website)
    if (html == null) { dResult.set(key, 'fetch-failed'); return }
    dResult.set(key, htmlLinksToOrg(html, org.login) ? 'linked' : 'not-linked')
  })
  for (const { company: c, org } of needsD) {
    const key = `${c.slug}::${org.login}`
    if (dResult.get(key) === 'linked') resolved.set(key, 'homepage-link')
  }

  const pendingReview: PendingReviewRow[] = []
  const droppedCompanies: string[] = []
  const planned: PlannedCompany[] = []

  for (const c of ossSource.companies) {
    const plannedOrgs: PlannedOrg[] = []
    for (const org of c.orgs) {
      const key = `${c.slug}::${org.login}`
      const reason = resolved.get(key)
      if (reason) { plannedOrgs.push({ login: org.login, reason }); continue }
      pendingReview.push({
        login: org.login,
        company: c.name,
        companySlug: c.slug,
        websiteUrl: org.websiteUrl ?? null,
        reason: buildPendingReason(c, org, dResult.get(key) ?? 'no-website'),
        status: 'pending',
      })
    }
    if (plannedOrgs.length === 0) { droppedCompanies.push(c.slug); continue }
    planned.push({ ...c, plannedOrgs })
  }

  return { planned, droppedCompanies, pendingReview }
}

/* ── Step 2: GitHub pull ─────────────────────────────────────────────── */
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function orgFieldsQuery(alias: string, login: string): string {
  const safeLogin = login.replace(/"/g, '')
  const repoFields = `name nameWithOwner description url homepageUrl stargazerCount forkCount
        primaryLanguage { name color }
        languages(first: 6, orderBy: {field: SIZE, direction: DESC}) { edges { size node { name color } } }
        repositoryTopics(first: 10) { nodes { topic { name } } }
        licenseInfo { spdxId }
        pushedAt createdAt isArchived
        issues(states: OPEN) { totalCount }
        gfi: issues(states: OPEN, labels: ${JSON.stringify(GFI_LABELS)}) { totalCount }
        latestRelease { tagName publishedAt }`
  return `${alias}: organization(login: "${safeLogin}") {
    login name description websiteUrl location avatarUrl isVerified
    repositories(privacy: PUBLIC) { totalCount }
    repos: repositories(first: ${REPOS_PER_ORG}, isFork: false, privacy: PUBLIC, orderBy: {field: STARGAZERS, direction: DESC}) {
      nodes { ${repoFields} }
    }
  }`
}

function gfiQuery(alias: string, login: string): string {
  const safeLogin = login.replace(/"/g, '')
  const q = `org:${safeLogin} is:issue is:open label:\\"good first issue\\" created:>=${GFI_CUTOFF}`
  return `${alias}: search(type: ISSUE, query: "${q}", first: 10) {
    nodes {
      ... on Issue {
        title url createdAt
        comments { totalCount }
        labels(first: 6) { nodes { name } }
        repository { nameWithOwner }
      }
    }
  }`
}

const orgDataByLogin = new Map<string, any>()
const gfiByLogin = new Map<string, any[]>()

/** Alias names a GraphQL response's field-level errors touched (e.g.
 *  'org_3'). GitHub answers a batch of several large orgs (each with 30
 *  repos and multiple nested connections) with RESOURCE_LIMITS_EXCEEDED on
 *  individual fields deep inside specific aliases - even plain scalars
 *  like nameWithOwner - while still returning `data` for the rest of the
 *  batch. Any alias an error path touches is untrustworthy and must be
 *  re-fetched alone rather than accepted partially. */
function taintedAliases(json: any): Set<string> {
  const out = new Set<string>()
  if (Array.isArray(json?.errors)) {
    for (const e of json.errors) {
      if (Array.isArray(e?.path) && typeof e.path[0] === 'string') out.add(e.path[0])
    }
  }
  return out
}

function safeLoginCacheKey(login: string): string {
  return login.toLowerCase().replace(/[^a-z0-9_-]/g, '_')
}

function pullOrgBatches(allLogins: string[]): void {
  const batches = chunk(allLogins, ORG_BATCH_SIZE)
  console.log(`[orgs] ${allLogins.length} orgs in ${batches.length} batches of ${ORG_BATCH_SIZE}`)
  const needsSolo: string[] = []
  batches.forEach((batchLogins, i) => {
    const cacheFile = path.join(RAW_CACHE_DIR, `org-batch-${i}.json`)
    const query = `query {\n  rateLimit { cost remaining resetAt }\n` +
      batchLogins.map((login, j) => orgFieldsQuery(`org_${j}`, login)).join('\n') + '\n}'
    const json = ghGraphql(query, cacheFile)
    if (!json) { console.error(`  [orgs] batch ${i} failed permanently, skipping`); needsSolo.push(...batchLogins); return }
    const tainted = taintedAliases(json)
    batchLogins.forEach((login, j) => {
      const alias = `org_${j}`
      if (tainted.has(alias)) { needsSolo.push(login); return }
      const data = json.data?.[alias]
      if (data && data.login) orgDataByLogin.set(login.toLowerCase(), data)
    })
    if (i % 20 === 0 || i === batches.length - 1) console.log(`  [orgs] batch ${i + 1}/${batches.length} done (rateLimit remaining: ${json.data?.rateLimit?.remaining})`)
  })

  if (needsSolo.length) {
    console.log(`[orgs] ${needsSolo.length} org(s) hit a batch-level resource limit or failure - re-fetching individually`)
    needsSolo.forEach((login, i) => {
      const cacheFile = path.join(RAW_CACHE_DIR, `org-solo-${safeLoginCacheKey(login)}.json`)
      const query = `query {\n  rateLimit { cost remaining resetAt }\n${orgFieldsQuery('org_0', login)}\n}`
      const json = ghGraphql(query, cacheFile)
      if (!json) { console.error(`  [orgs] solo fetch failed permanently for ${login}`); return }
      if (taintedAliases(json).has('org_0')) { console.error(`  [orgs] solo fetch for ${login} still hit a resource limit, dropping`); return }
      const data = json.data?.org_0
      if (data && data.login) orgDataByLogin.set(login.toLowerCase(), data)
      if ((i + 1) % 25 === 0 || i === needsSolo.length - 1) console.log(`  [orgs] solo ${i + 1}/${needsSolo.length} done`)
    })
  }
}

function pullGfiBatches(allLogins: string[]): void {
  const batches = chunk(allLogins, GFI_BATCH_SIZE)
  console.log(`[gfi] ${allLogins.length} orgs in ${batches.length} batches of ${GFI_BATCH_SIZE}`)
  const needsSolo: string[] = []
  batches.forEach((batchLogins, i) => {
    const cacheFile = path.join(RAW_CACHE_DIR, `gfi-batch-${i}.json`)
    const query = `query {\n  rateLimit { cost remaining resetAt }\n` +
      batchLogins.map((login, j) => gfiQuery(`gfi_${j}`, login)).join('\n') + '\n}'
    const json = ghGraphql(query, cacheFile)
    if (!json) { console.error(`  [gfi] batch ${i} failed permanently, skipping`); needsSolo.push(...batchLogins); return }
    const tainted = taintedAliases(json)
    batchLogins.forEach((login, j) => {
      const alias = `gfi_${j}`
      if (tainted.has(alias)) { needsSolo.push(login); return }
      const data = json.data?.[alias]
      if (data && Array.isArray(data.nodes)) gfiByLogin.set(login.toLowerCase(), data.nodes)
    })
    if (i % 20 === 0 || i === batches.length - 1) console.log(`  [gfi] batch ${i + 1}/${batches.length} done (rateLimit remaining: ${json.data?.rateLimit?.remaining})`)
  })

  if (needsSolo.length) {
    console.log(`[gfi] ${needsSolo.length} org(s) hit a batch-level resource limit or failure - re-fetching individually`)
    needsSolo.forEach((login, i) => {
      const cacheFile = path.join(RAW_CACHE_DIR, `gfi-solo-${safeLoginCacheKey(login)}.json`)
      const query = `query {\n  rateLimit { cost remaining resetAt }\n${gfiQuery('gfi_0', login)}\n}`
      const json = ghGraphql(query, cacheFile)
      if (!json) { console.error(`  [gfi] solo fetch failed permanently for ${login}`); return }
      if (taintedAliases(json).has('gfi_0')) { console.error(`  [gfi] solo fetch for ${login} still hit a resource limit, dropping`); return }
      const data = json.data?.gfi_0
      if (data && Array.isArray(data.nodes)) gfiByLogin.set(login.toLowerCase(), data.nodes)
      if ((i + 1) % 25 === 0 || i === needsSolo.length - 1) console.log(`  [gfi] solo ${i + 1}/${needsSolo.length} done`)
    })
  }
}

/* ── Step 3: transform ───────────────────────────────────────────────── */
type RepoCandidate = { owner: string; name: string; stars: number; nameWithOwner: string; node: any }
type OssCompanyOut = OssCompany & { iwwMode: 'company' | 'product' | null; iwwName: string | null }

function loadFrozenRepoSlugs(): Map<string, string> {
  const frozen = new Map<string, string>()
  const p = path.join(OUT_DIR, 'repos.json')
  if (fs.existsSync(p)) {
    try {
      const prev: OssRepo[] = JSON.parse(fs.readFileSync(p, 'utf8'))
      for (const r of prev) frozen.set(r.id, r.slug)
    } catch { /* no usable previous snapshot */ }
  }
  return frozen
}

function licenseFromSpdx(spdx: string | null | undefined): string | null {
  if (!spdx) return null
  if (spdx === 'NOASSERTION' || spdx.toLowerCase() === 'other') return null
  return spdx
}

async function main(): Promise<void> {
  console.log('[plan] applying the deterministic company-to-org check...')
  const { planned, droppedCompanies, pendingReview } = await planCompanies()
  console.log(`[plan] companies kept: ${planned.length}, dropped (no qualifying org): ${droppedCompanies.length}, orgs pending review: ${pendingReview.length}`)
  if (droppedCompanies.length) console.log('[plan] dropped companies (no qualifying org):', droppedCompanies.join(', '))

  fs.writeFileSync(path.join(SOURCES_DIR, 'oss-org-review.json'), JSON.stringify(pendingReview, null, 2))
  console.log(`[plan] wrote ${pendingReview.length} pending row(s) to oss-org-review.json`)

  let allLogins: string[] = []
  for (const c of planned) for (const o of c.plannedOrgs) allLogins.push(o.login)
  if (process.env.DEVHUB_LIMIT) allLogins = allLogins.slice(0, Number(process.env.DEVHUB_LIMIT))

  pullOrgBatches(allLogins)
  pullGfiBatches(allLogins)

  const frozenRepoSlugs = loadFrozenRepoSlugs()

  const companiesOut: OssCompanyOut[] = []
  const reposOut: OssRepo[] = []
  const issuesOut: OssIssue[] = []
  const usedCompanySlugs = new Set<string>()
  const renamedSlugs: Array<{ from: string; to: string }> = []
  const ownerToCompanySlug = new Map<string, string>()
  const nameWithOwnerToSlug = new Map<string, string>()
  const orgsFailedFetch: Array<{ companySlug: string; org: string }> = []
  const droppedAtFetch: string[] = []

  for (const c of planned) {
    const orgsOut: OssOrg[] = []
    const repoCandidates: RepoCandidate[] = []

    for (const plannedOrg of c.plannedOrgs) {
      const data = orgDataByLogin.get(plannedOrg.login.toLowerCase())
      if (!data) { orgsFailedFetch.push({ companySlug: c.slug, org: plannedOrg.login }); continue }
      orgsOut.push({
        login: data.login,
        url: `https://github.com/${data.login}`,
        name: data.name ? cleanRequired(data.name) : null,
        description: cleanText(data.description, 280),
        websiteUrl: data.websiteUrl ? ensureHttps(data.websiteUrl) : null,
        location: data.location ? cleanRequired(data.location) : null,
        avatarUrl: data.avatarUrl ?? '',
        isVerified: Boolean(data.isVerified),
        publicRepos: data.repositories?.totalCount ?? 0,
      })
      ownerToCompanySlug.set(data.login.toLowerCase(), c.slug)
      const nodes = data.repos?.nodes ?? []
      for (const node of nodes) {
        repoCandidates.push({
          owner: data.login, name: node.name, stars: node.stargazerCount ?? 0,
          nameWithOwner: node.nameWithOwner, node,
        })
      }
    }

    if (orgsOut.length === 0) { droppedAtFetch.push(c.slug); continue }

    /* Reserved-slug + global-uniqueness guard (2.1/2.2). */
    let slug = safeCompanySlug(c.slug)
    if (slug !== c.slug) renamedSlugs.push({ from: c.slug, to: slug })
    let n = 2
    while (usedCompanySlugs.has(slug)) { slug = `${safeCompanySlug(c.slug)}-${n++}` }
    usedCompanySlugs.add(slug)

    /* Per company: 30 most-starred non-fork repos across its orgs. */
    repoCandidates.sort((a, b) => b.stars - a.stars || a.nameWithOwner.localeCompare(b.nameWithOwner, 'en'))
    const kept = repoCandidates.slice(0, REPOS_PER_COMPANY)
    const slugMap = assignRepoSlugs(
      kept.map(r => ({ owner: r.owner, name: r.name, stars: r.stars })),
      frozenRepoSlugs,
    )

    for (const r of kept) {
      const repoSlug = slugMap.get(`${r.owner}/${r.name}`)!
      nameWithOwnerToSlug.set(r.nameWithOwner, repoSlug)
      const node = r.node
      const languages = (node.languages?.edges ?? []).map((e: any) => ({
        name: e.node.name, color: e.node.color ?? null, size: e.size,
      }))
      reposOut.push({
        id: r.nameWithOwner,
        slug: repoSlug,
        companySlug: slug,
        owner: r.owner,
        name: node.name,
        nameWithOwner: r.nameWithOwner,
        description: cleanText(node.description, 280),
        url: node.url,
        homepageUrl: node.homepageUrl ? ensureHttps(node.homepageUrl) : null,
        stars: node.stargazerCount ?? 0,
        forks: node.forkCount ?? 0,
        primaryLanguage: node.primaryLanguage ? { name: node.primaryLanguage.name, color: node.primaryLanguage.color ?? null } : null,
        languages,
        topics: (node.repositoryTopics?.nodes ?? []).map((t: any) => t.topic.name).slice(0, 10),
        license: licenseFromSpdx(node.licenseInfo?.spdxId),
        pushedAt: node.pushedAt,
        createdAt: node.createdAt,
        isArchived: Boolean(node.isArchived),
        openIssues: node.issues?.totalCount ?? 0,
        goodFirstIssues: node.gfi?.totalCount ?? 0,
        latestRelease: node.latestRelease ? { tag: node.latestRelease.tagName, publishedAt: node.latestRelease.publishedAt } : null,
      })
    }

    const countrySlugVal = c.hqCountry ? countryFacetSlug(c.hqCountry) : null
    const countryNameVal = c.hqCountry ? countryNameFromIso2(c.hqCountry) : null
    /* c.iwwUrl (source field, oddly named) is already a site-relative path
       ('/profile/x' | '/listing/x'), not an absolute URL. */
    const iwwPathVal = c.listedOnIww && c.iwwUrl ? c.iwwUrl : null
    const iwwMatch = c.listingId != null ? matchByListingId.get(c.listingId) : undefined
    const iwwModeVal: 'company' | 'product' | null = iwwPathVal ? (c.mode === 'product' || c.mode === 'company' ? c.mode : null) : null
    /* types.ts: "null = the company name" - only carry a listing name that
       actually differs (e.g. company 'Hugging Face' listed as product
       'Gradio AI'); when the listing title equals the company name,
       leave it null so consumers fall back to `name`. */
    const companyNameClean = cleanRequired(c.name)
    const iwwListingName = iwwPathVal && iwwMatch?.name ? cleanRequired(iwwMatch.name) : null
    const iwwNameVal = iwwListingName && iwwListingName !== companyNameClean ? iwwListingName : null

    companiesOut.push({
      slug,
      name: cleanRequired(c.name),
      website: c.website ? ensureHttps(c.website) : null,
      hqCountry: c.hqCountry || null,
      countrySlug: countrySlugVal,
      countryName: countryNameVal,
      industry: cleanRequired(c.industry),
      industrySlug: industrySlug(c.industry),
      oneLiner: cleanText(c.oneLiner, undefined),
      listedOnIww: Boolean(iwwPathVal),
      iwwUrl: iwwPathVal ? absoluteUrl(iwwPathVal) : null,
      iwwPath: iwwPathVal,
      iwwMode: iwwModeVal,
      iwwName: iwwNameVal,
      orgs: orgsOut,
    })
  }

  /* Good-first issues: only for repos that survived the per-company cut,
     and only within the 180-day window (defensive re-check of the search
     query's own date filter). */
  let issuesDroppedNoRepo = 0
  let issuesDroppedOld = 0
  const cutoffMs = new Date(GFI_CUTOFF).getTime()
  for (const [loginLower, nodes] of gfiByLogin) {
    const companySlug = ownerToCompanySlug.get(loginLower)
    if (!companySlug) continue
    for (const node of nodes) {
      if (new Date(node.createdAt).getTime() < cutoffMs) { issuesDroppedOld++; continue }
      const repoSlug = nameWithOwnerToSlug.get(node.repository?.nameWithOwner)
      if (!repoSlug) { issuesDroppedNoRepo++; continue }
      issuesOut.push({
        title: cleanText(node.title) ?? node.title,
        url: node.url,
        repo: node.repository.nameWithOwner,
        repoSlug,
        companySlug,
        labels: (node.labels?.nodes ?? []).map((l: any) => l.name),
        createdAt: node.createdAt,
        comments: node.comments?.totalCount ?? 0,
      })
    }
  }

  const languageSet = new Set<string>()
  const topicSet = new Set<string>()
  const countrySet = new Set<string>()
  for (const r of reposOut) {
    if (r.primaryLanguage) languageSet.add(r.primaryLanguage.name)
    for (const l of r.languages) languageSet.add(l.name)
    for (const t of r.topics) topicSet.add(t)
  }
  for (const c of companiesOut) if (c.countrySlug) countrySet.add(c.countrySlug)

  const meta: OssMeta = {
    schemaVersion: 1,
    generatedAt: SNAPSHOT_AT,
    source: 'github-graphql',
    reposPerOrgLimit: 30,
    counts: {
      companies: companiesOut.length,
      orgs: companiesOut.reduce((n, c) => n + c.orgs.length, 0),
      repos: reposOut.length,
      issues: issuesOut.length,
      languages: languageSet.size,
      topics: topicSet.size,
      countries: countrySet.size,
    },
  }

  writeJsonMin(path.join(OUT_DIR, 'meta.json'), meta)
  writeJsonMin(path.join(OUT_DIR, 'companies.json'), companiesOut)
  writeJsonMin(path.join(OUT_DIR, 'repos.json'), reposOut)
  writeJsonMin(path.join(OUT_DIR, 'issues.json'), issuesOut)

  console.log('\n── build-oss-snapshot summary ──────────────────────────')
  console.log('companies:', companiesOut.length, ' dropped (no org after check):', droppedCompanies.length, droppedAtFetch.length ? `+${droppedAtFetch.length} (fetch failed)` : '')
  if (droppedAtFetch.length) console.log('  dropped at fetch:', droppedAtFetch.join(', '))
  console.log('orgs:', meta.counts.orgs, ' pending review:', pendingReview.length, ' failed to fetch:', orgsFailedFetch.length)
  if (orgsFailedFetch.length) console.log('  failed to fetch:', JSON.stringify(orgsFailedFetch))
  console.log('repos:', reposOut.length, ' issues:', issuesOut.length, ' (dropped: no kept repo', issuesDroppedNoRepo, ', older than 180d', issuesDroppedOld, ')')
  console.log('languages:', languageSet.size, ' topics:', topicSet.size, ' countries:', countrySet.size)
  console.log('listed on InfoWebWorld:', companiesOut.filter(c => c.listedOnIww).length)
  if (renamedSlugs.length) console.log('reserved-slug renames:', JSON.stringify(renamedSlugs))
  for (const f of ['meta.json', 'companies.json', 'repos.json', 'issues.json']) {
    const stat = fs.statSync(path.join(OUT_DIR, f))
    console.log(`  ${f}: ${(stat.size / 1024 / 1024).toFixed(2)} MB`)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
