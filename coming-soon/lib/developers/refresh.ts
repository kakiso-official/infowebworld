/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - optional runtime refresh (spec 6.5).
   Server only. Zero manual steps; neither job is needed for the section
   to work.

   GitHub (GITHUB_TOKEN set, fine-grained, public read only):
     When the data is older than 24 hours, the first request after that
     stamps the attempt and schedules the work with after() (which does not
     make the route dynamic). It updates ONLY volatile fields of repos that
     are already in the snapshot (stars, forks, pushedAt, open issues, good
     first issues, archived, latest release, description, topics), each
     org's public repo count and the open good-first-issues list. GraphQL
     aliases, 25 per query, one query at a time with a 250 ms gap, 15 s
     timeout each; the run stops cleanly on the first 401/403/rate limit
     and every failed batch keeps its old values. New repos and companies
     only arrive through the reviewed snapshot script.

   API checks (DEVHUB_API_CHECKS=1):
     Weekly, reviewed APIs only: their link and their no-key sample, 4 at a
     time, 8 s timeout, our bot user agent. A status only changes after two
     consecutive results agree, and failures are counted in memory
     (FreeApi.failedChecks) for the "Failed last 2 checks" badge.

   Never during `next build` (NEXT_PHASE). Nothing is written to disk: a
   restart serves the committed snapshot and refreshes after its first
   request. meta.refresh = { lastOkAt, live } (in memory) drives the data
   line and the "how often" copy, so freshness claims are always true.
   ═══════════════════════════════════════════════════════════════════════ */

import 'server-only'
import { after } from 'next/server'
import { BASE_URL } from '../../app/components/seo-schema'
import { trimToBudget } from '../seo'
import type { ApisStore } from './apis'
import type { OssStore } from './oss'
import type { ApisMeta, FreeApi, OssCompany, OssIssue, OssMeta, OssRepo } from './types'

export type OssCommit = (meta: OssMeta, companies: OssCompany[], repos: OssRepo[], issues: OssIssue[]) => void
export type ApisCommit = (meta: ApisMeta, apis: FreeApi[]) => void | Promise<void>

const HOUR = 3600000
const DAY = 24 * HOUR
const OSS_MAX_AGE = DAY
const API_CHECK_MAX_AGE = 7 * DAY
/* A failed or partial run is retried after this pause, not on every request. */
const RETRY_AFTER = HOUR
/* A run that never reported back (process paused, callback dropped) stops
   blocking new runs after this long. */
const STUCK_AFTER = 30 * 60000

const GITHUB_GRAPHQL = 'https://api.github.com/graphql'
const USER_AGENT = 'InfoWebWorldBot/1.0 (+https://www.infowebworld.com/developers/methodology)'
const GFI_LABELS = ['good first issue', 'good-first-issue', 'Good First Issue', 'good first issues']
const GFI_WINDOW_DAYS = 180
const GFI_PER_ORG = 10
const BATCH = 25
const ORG_SEARCH_BATCH = 10
const GAP_MS = 250
const GQL_TIMEOUT = 15000
const CHECK_TIMEOUT = 8000
const CHECK_CONCURRENCY = 4
const MAX_BODY = 65536

interface ApiOverlay { fails: number; blocks: number; sampleFails: number }

interface RefreshMemo {
  ossRunningSince: number
  ossLastAttempt: number
  apisRunningSince: number
  apisLastAttempt: number
  apiOverlay: Map<string, ApiOverlay>
}

const holder = globalThis as typeof globalThis & { __dvRefresh?: RefreshMemo }

function memo(): RefreshMemo {
  if (!holder.__dvRefresh) {
    holder.__dvRefresh = { ossRunningSince: 0, ossLastAttempt: 0, apisRunningSince: 0, apisLastAttempt: 0, apiOverlay: new Map() }
  }
  return holder.__dvRefresh
}

/** Which refresh jobs this process may run. */
export function refreshEnabled(): { github: boolean; apiChecks: boolean } {
  const building = process.env.NEXT_PHASE === 'phase-production-build'
  return {
    github: !building && !!process.env.GITHUB_TOKEN,
    apiChecks: !building && process.env.DEVHUB_API_CHECKS === '1',
  }
}

function nowIso(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
}

function ageMs(iso: string | null | undefined): number {
  const t = iso ? Date.parse(iso) : NaN
  return Number.isNaN(t) ? Infinity : Date.now() - t
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/* Schedule work after the response; false when after() is unavailable
   (no request scope), in which case nothing runs. */
function schedule(work: () => Promise<void>): boolean {
  try {
    after(work)
    return true
  } catch {
    return false
  }
}

/* ── GitHub ──────────────────────────────────────────────────────────── */

/** Stop the whole run: bad token, forbidden or rate limited. */
class RefreshAbort extends Error {}

interface GqlResult { data: Record<string, unknown> | null }

/* One GraphQL request. Null = this batch failed (keep old values);
   throws RefreshAbort when the run must stop. */
async function gql(query: string, token: string): Promise<GqlResult | null> {
  let res: Response
  try {
    res = await fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
      signal: AbortSignal.timeout(GQL_TIMEOUT),
    })
  } catch {
    return null
  }
  if (res.status === 401 || res.status === 403 || res.status === 429) throw new RefreshAbort(`GitHub answered ${res.status}`)
  if (res.headers.get('x-ratelimit-remaining') === '0') throw new RefreshAbort('GitHub rate limit reached')
  if (!res.ok) return null
  let body: { data?: Record<string, unknown> | null; errors?: Array<{ type?: string }> }
  try {
    body = await res.json()
  } catch {
    return null
  }
  if (body.errors?.some(e => e.type === 'RATE_LIMITED')) throw new RefreshAbort('GitHub rate limit reached')
  return { data: body.data ?? null }
}

/* GraphQL string literal (JSON string syntax is valid GraphQL). */
function lit(value: string): string {
  return JSON.stringify(value)
}

/* Same cleaning as the snapshot script: emoji shortcodes out, no long
   dashes, at most 300 chars. */
const LONG_DASH_RE = new RegExp(`\\s*[${String.fromCharCode(0x2013, 0x2014)}]\\s*`, 'g')
function cleanDescription(text: unknown): string | null {
  if (typeof text !== 'string') return null
  const t = text.replace(/:[a-z0-9_+-]+:/gi, ' ').replace(LONG_DASH_RE, ' - ').replace(/\s+/g, ' ').trim()
  return t ? trimToBudget(t, 300) : null
}

interface RepoNode {
  description: string | null
  stargazerCount: number
  forkCount: number
  pushedAt: string | null
  isArchived: boolean
  repositoryTopics: { nodes: Array<{ topic: { name: string } }> }
  issues: { totalCount: number }
  gfi: { totalCount: number }
  latestRelease: { tagName: string; publishedAt: string | null } | null
}

const REPO_FIELDS = `description stargazerCount forkCount pushedAt isArchived
  repositoryTopics(first: 12) { nodes { topic { name } } }
  issues(states: OPEN) { totalCount }
  gfi: issues(states: OPEN, labels: ${JSON.stringify(GFI_LABELS)}) { totalCount }
  latestRelease { tagName publishedAt }`

function applyRepo(repo: OssRepo, node: RepoNode): OssRepo {
  return {
    ...repo,
    description: cleanDescription(node.description),
    stars: node.stargazerCount,
    forks: node.forkCount,
    pushedAt: node.pushedAt ?? repo.pushedAt,
    isArchived: node.isArchived,
    topics: node.repositoryTopics.nodes.map(n => n.topic.name),
    openIssues: node.issues.totalCount,
    goodFirstIssues: node.gfi.totalCount,
    latestRelease: node.latestRelease && node.latestRelease.publishedAt
      ? { tag: node.latestRelease.tagName, publishedAt: node.latestRelease.publishedAt }
      : null,
  }
}

interface IssueNode {
  title?: string
  url?: string
  createdAt?: string
  repository?: { nameWithOwner: string }
  labels?: { nodes: Array<{ name: string }> }
  comments?: { totalCount: number }
}

async function runOssRefresh(base: OssStore, token: string, commit: OssCommit): Promise<void> {
  let complete = true
  let changed = false
  const repoUpdates = new Map<string, OssRepo>()
  const orgCounts = new Map<string, number>()
  const issuesByOrg = new Map<string, OssIssue[]>()

  try {
    /* 1. Volatile repo fields, 25 repos per query. */
    const repos = base.reposAll
    for (let i = 0; i < repos.length; i += BATCH) {
      const chunk = repos.slice(i, i + BATCH)
      const query = `query {\n${chunk.map((r, j) => `r${j}: repository(owner: ${lit(r.owner)}, name: ${lit(r.name)}) { ${REPO_FIELDS} }`).join('\n')}\n}`
      const result = await gql(query, token)
      if (!result?.data) {
        complete = false
      } else {
        chunk.forEach((r, j) => {
          const node = result.data![`r${j}`] as RepoNode | null | undefined
          if (node) repoUpdates.set(r.id, applyRepo(r, node))
          else complete = false
        })
      }
      await sleep(GAP_MS)
    }

    /* 2. Public repo count of each org. */
    const orgs = base.companies.flatMap(c => c.orgs.map(o => o.login))
    for (let i = 0; i < orgs.length; i += BATCH) {
      const chunk = orgs.slice(i, i + BATCH)
      const query = `query {\n${chunk.map((login, j) => `o${j}: organization(login: ${lit(login)}) { repositories(privacy: PUBLIC) { totalCount } }`).join('\n')}\n}`
      const result = await gql(query, token)
      if (!result?.data) {
        complete = false
      } else {
        chunk.forEach((login, j) => {
          const node = result.data![`o${j}`] as { repositories: { totalCount: number } } | null | undefined
          if (node) orgCounts.set(login.toLowerCase(), node.repositories.totalCount)
          else complete = false
        })
      }
      await sleep(GAP_MS)
    }

    /* 3. Open good first issues opened within the window, per org. */
    const since = new Date(Date.now() - GFI_WINDOW_DAYS * DAY).toISOString().slice(0, 10)
    for (let i = 0; i < orgs.length; i += ORG_SEARCH_BATCH) {
      const chunk = orgs.slice(i, i + ORG_SEARCH_BATCH)
      const query = `query {\n${chunk.map((login, j) => {
        const q = `org:${login} is:issue is:open label:"good first issue" created:>${since}`
        return `s${j}: search(type: ISSUE, query: ${lit(q)}, first: ${GFI_PER_ORG}) { nodes { ... on Issue { title url createdAt repository { nameWithOwner } labels(first: 10) { nodes { name } } comments { totalCount } } } }`
      }).join('\n')}\n}`
      const result = await gql(query, token)
      if (!result?.data) {
        complete = false
      } else {
        chunk.forEach((login, j) => {
          const node = result.data![`s${j}`] as { nodes: IssueNode[] } | null | undefined
          if (!node) {
            complete = false
            return
          }
          const list: OssIssue[] = []
          for (const n of node.nodes) {
            if (!n.url || !n.title || !n.createdAt || !n.repository) continue
            const repo = base.repoByNameWithOwner.get(n.repository.nameWithOwner.toLowerCase())
            if (!repo) continue
            list.push({
              title: n.title.replace(LONG_DASH_RE, ' - ').trim(),
              url: n.url,
              repo: repo.nameWithOwner,
              repoSlug: repo.slug,
              companySlug: repo.companySlug,
              labels: n.labels?.nodes.map(l => l.name) ?? [],
              createdAt: n.createdAt,
              comments: n.comments?.totalCount ?? 0,
            })
          }
          issuesByOrg.set(login.toLowerCase(), list)
        })
      }
      await sleep(GAP_MS)
    }
  } catch (err) {
    if (!(err instanceof RefreshAbort)) throw err
    complete = false
    console.warn(`[developers] GitHub refresh stopped: ${err.message}`)
  }

  if (repoUpdates.size || orgCounts.size || issuesByOrg.size) changed = true
  if (!changed) {
    if (base.meta.refresh?.live) {
      commit({ ...base.meta, refresh: { lastOkAt: base.meta.refresh.lastOkAt, live: false } },
        [...base.companies], [...base.reposAll], [...base.issues])
    }
    return
  }

  const repos = base.reposAll.map(r => repoUpdates.get(r.id) ?? r)
  const companies = base.companies.map(c => ({
    ...c,
    orgs: c.orgs.map(o => {
      const count = orgCounts.get(o.login.toLowerCase())
      return count === undefined ? o : { ...o, publicRepos: count }
    }),
  }))
  /* Orgs whose search failed keep their old issues. */
  const issues: OssIssue[] = []
  const seen = new Set<string>()
  const ownerOf = (i: OssIssue) => i.repo.split('/')[0].toLowerCase()
  for (const i of base.issues) {
    if (issuesByOrg.has(ownerOf(i)) || seen.has(i.url)) continue
    seen.add(i.url)
    issues.push(i)
  }
  for (const list of issuesByOrg.values()) {
    for (const i of list) {
      if (seen.has(i.url)) continue
      seen.add(i.url)
      issues.push(i)
    }
  }

  const at = nowIso()
  /* refreshedAt only moves when every batch succeeded, so "updated {date}"
     is true of every number on the page. */
  const meta: OssMeta = complete
    ? { ...base.meta, refreshedAt: at, refresh: { lastOkAt: at, live: true } }
    : { ...base.meta, refresh: { lastOkAt: base.meta.refresh?.lastOkAt ?? null, live: false } }
  commit(meta, companies, repos, issues)
}

/** Schedule the GitHub refresh when it is enabled and due (6.5). Cheap
 *  to call on every getOss(). */
export function maybeRefreshOss(store: OssStore, commit: OssCommit): void {
  const token = process.env.GITHUB_TOKEN
  if (!refreshEnabled().github || !token) return
  const m = memo()
  const now = Date.now()
  if (m.ossRunningSince && now - m.ossRunningSince < STUCK_AFTER) return
  if (now - m.ossLastAttempt < RETRY_AFTER) return
  if (ageMs(store.meta.refreshedAt ?? store.meta.generatedAt) < OSS_MAX_AGE) return

  m.ossLastAttempt = now
  m.ossRunningSince = now
  const scheduled = schedule(async () => {
    try {
      await runOssRefresh(store, token, commit)
    } catch (err) {
      console.error('[developers] GitHub refresh failed', err)
    } finally {
      memo().ossRunningSince = 0
    }
  })
  if (!scheduled) {
    m.ossRunningSince = 0
    m.ossLastAttempt = 0
  }
}

/* ── API checks ──────────────────────────────────────────────────────── */

type LinkOutcome = 'ok' | 'blocked' | 'fail'

async function checkLink(url: string): Promise<LinkOutcome> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/json;q=0.9,*/*;q=0.8' },
      cache: 'no-store',
      signal: AbortSignal.timeout(CHECK_TIMEOUT),
    })
    await res.body?.cancel().catch(() => undefined)
    if (res.status < 400) return 'ok'
    if (res.status === 401 || res.status === 403 || res.status === 429) return 'blocked'
    return 'fail'
  } catch {
    return 'fail'
  }
}

type Check = NonNullable<NonNullable<FreeApi['details']>['check']>

/* Run a no-key GET sample like a browser on our site would (Origin
   header), reading at most 64 KB. Null on a network error or timeout. */
async function checkSample(url: string): Promise<Check | null> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': USER_AGENT, Origin: BASE_URL, Accept: 'application/json, */*;q=0.8' },
      cache: 'no-store',
      signal: AbortSignal.timeout(CHECK_TIMEOUT),
    })
    const reader = res.body?.getReader()
    let read = 0
    if (reader) {
      while (read < MAX_BODY) {
        const { done, value } = await reader.read()
        if (done) break
        read += value?.byteLength ?? 0
      }
      await reader.cancel().catch(() => undefined)
    }
    const allow = res.headers.get('access-control-allow-origin')
    const ok = res.status >= 200 && res.status < 300
    return {
      ok,
      tryable: ok && url.startsWith('https://') && (allow === '*' || allow === BASE_URL),
      contentType: res.headers.get('content-type'),
      httpStatus: res.status,
      checkedAt: nowIso(),
    }
  } catch {
    return null
  }
}

async function checkApi(api: FreeApi, overlay: Map<string, ApiOverlay>): Promise<FreeApi> {
  const d = api.details
  if (!d) return api
  const o = overlay.get(api.slug) ?? { fails: 0, blocks: 0, sampleFails: 0 }
  const link = await checkLink(api.link)
  const at = nowIso()
  let status = api.status
  if (link === 'ok') {
    o.fails = 0
    o.blocks = 0
    status = 'alive'
  } else if (link === 'blocked') {
    o.blocks++
    o.fails = 0
    if (o.blocks >= 2) status = 'blocked'
  } else {
    o.fails++
  }

  let check = d.check
  const s = d.sample
  if (s && s.method === 'GET' && !s.needsKey && s.url.startsWith('https://')) {
    const result = await checkSample(s.url)
    if (result && result.ok) {
      o.sampleFails = 0
      check = result
    } else {
      o.sampleFails++
      /* One bad answer is noise; two in a row replace the recorded check. */
      if (o.sampleFails >= 2) {
        check = result ?? { ok: false, tryable: false, contentType: null, httpStatus: null, checkedAt: at }
      }
    }
  }
  overlay.set(api.slug, o)
  return {
    ...api,
    status,
    linkCheckedAt: at,
    failedChecks: o.fails,
    details: { ...d, check },
  }
}

async function runApiChecks(base: ApisStore, commit: ApisCommit): Promise<void> {
  const overlay = memo().apiOverlay
  const targets = base.apis.filter(a => a.enriched && a.details)
  const updated = new Map<string, FreeApi>()
  let next = 0
  const worker = async () => {
    while (next < targets.length) {
      const api = targets[next++]
      updated.set(api.slug, await checkApi(api, overlay))
    }
  }
  await Promise.all(Array.from({ length: CHECK_CONCURRENCY }, worker))
  const at = nowIso()
  commit({ ...base.meta, refresh: { lastOkAt: at, live: true } }, base.apis.map(a => updated.get(a.slug) ?? a))
}

/** Schedule the weekly checks of reviewed APIs when DEVHUB_API_CHECKS=1
 *  and they are due (6.5). Cheap to call on every getApis(). */
export function maybeRefreshApiChecks(store: ApisStore, commit: ApisCommit): void {
  if (!refreshEnabled().apiChecks) return
  const m = memo()
  const now = Date.now()
  if (m.apisRunningSince && now - m.apisRunningSince < STUCK_AFTER) return
  if (now - m.apisLastAttempt < RETRY_AFTER) return
  if (ageMs(store.meta.refresh?.lastOkAt ?? store.meta.linksCheckedAt) < API_CHECK_MAX_AGE) return

  m.apisLastAttempt = now
  m.apisRunningSince = now
  const scheduled = schedule(async () => {
    try {
      await runApiChecks(store, commit)
    } catch (err) {
      console.error('[developers] API checks failed', err)
    } finally {
      memo().apisRunningSince = 0
    }
  })
  if (!scheduled) {
    m.apisRunningSince = 0
    m.apisLastAttempt = 0
  }
}
