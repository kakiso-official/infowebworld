/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - data loaders (spec 6.2). Server only.

     getOss()   oss/{meta,companies,repos,issues}.json  -> OssStore
     getApis()  apis/{meta,apis}.json                   -> ApisStore
     getIwwLinks()  iww-links.json                      -> IwwLinks

   No database and no network: the committed JSON snapshots under
   data/developers/ are the source of truth. Each domain is read on first
   use (API pages never parse the repos file and vice versa), validated
   (schemaVersion 1), indexed by the pure builders in oss.ts / apis.ts and
   memoised on globalThis, so it survives dev HMR and there is one copy
   per `next start` process. Concurrent first requests share one in-flight
   promise, so a snapshot is parsed once. After that one await, every
   lookup is a synchronous Map read.

   Memory: ~7 MB of JSON becomes roughly 40-60 MB of heap (rows + indexes),
   fine on the VPS.

   Deploy: Coolify runs `next start` from the full checkout, so
   data/developers/ is at process.cwd(). If the deploy moves to
   output: 'standalone', add data/developers/** to outputFileTracingIncludes.
   DEVHUB_DATA_DIR overrides the folder (local fixtures, tests).

   Failure: a missing or unparsable snapshot throws DevDataError. Pages
   catch it, show "This data is refreshing" with noindex, and never render
   zeros or a 404 for a real URL. A failed load is retried after a short
   pause instead of re-reading a broken file on every request.
   ═══════════════════════════════════════════════════════════════════════ */

import 'server-only'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { buildApisStore, type ApisStore } from './apis'
import { buildOssStore, type OssStore } from './oss'
import { maybeRefreshApiChecks, maybeRefreshOss } from './refresh'
import type { ApisMeta, FreeApi, IwwLinks, OssCompany, OssIssue, OssMeta, OssRepo } from './types'

export const DATA_DIR = process.env.DEVHUB_DATA_DIR || path.join(process.cwd(), 'data', 'developers')

export type DevDataDomain = 'oss' | 'apis' | 'links'

/** A snapshot could not be read, parsed or validated. */
export class DevDataError extends Error {
  readonly domain: DevDataDomain
  constructor(domain: DevDataDomain, message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'DevDataError'
    this.domain = domain
  }
}

export function isDevDataError(err: unknown): err is DevDataError {
  return err instanceof DevDataError || (err instanceof Error && err.name === 'DevDataError')
}

const OSS_FILES = ['oss/meta.json', 'oss/companies.json', 'oss/repos.json', 'oss/issues.json'] as const
const APIS_FILES = ['apis/meta.json', 'apis/apis.json'] as const
const LINKS_FILE = 'iww-links.json'

/* A failed load is retried after this pause. */
const RETRY_MS = 60000
/* In dev, snapshot files are re-stat'ed at most this often so a rebuilt
   snapshot shows up without restarting `next dev`. */
const DEV_STAT_MS = 2000
const IS_DEV = process.env.NODE_ENV !== 'production'

interface DomainMemo<T> {
  value: T | null
  loading: Promise<T> | null
  error: DevDataError | null
  failedAt: number
  logged: boolean
  /** Dev only: file mtimes the value was built from. */
  mtimes: string
  checkedAt: number
}

interface DvMemo {
  oss: DomainMemo<OssStore>
  apis: DomainMemo<ApisStore>
  links: DomainMemo<IwwLinks>
}

function emptyDomain<T>(): DomainMemo<T> {
  return { value: null, loading: null, error: null, failedAt: 0, logged: false, mtimes: '', checkedAt: 0 }
}

const holder = globalThis as typeof globalThis & { __dvStore?: DvMemo }

function memo(): DvMemo {
  if (!holder.__dvStore) holder.__dvStore = { oss: emptyDomain(), apis: emptyDomain(), links: emptyDomain() }
  return holder.__dvStore
}

/* ── File reading ────────────────────────────────────────────────────── */

async function readJson(domain: DevDataDomain, file: string): Promise<unknown> {
  const full = path.join(DATA_DIR, file)
  let text: string
  try {
    text = await readFile(full, 'utf8')
  } catch (cause) {
    throw new DevDataError(domain, `Cannot read ${file} in ${DATA_DIR}`, { cause })
  }
  try {
    return JSON.parse(text)
  } catch (cause) {
    throw new DevDataError(domain, `${file} is not valid JSON`, { cause })
  }
}

function expectArray<T>(domain: DevDataDomain, file: string, value: unknown): T[] {
  if (!Array.isArray(value)) throw new DevDataError(domain, `${file} must be a JSON array`)
  return value as T[]
}

function expectMeta<T extends { schemaVersion: number; generatedAt: string }>(domain: DevDataDomain, file: string, value: unknown): T {
  const meta = value as T | null
  if (!meta || typeof meta !== 'object') throw new DevDataError(domain, `${file} must be a JSON object`)
  if (meta.schemaVersion !== 1) throw new DevDataError(domain, `${file} has schemaVersion ${String(meta.schemaVersion)}, expected 1`)
  if (typeof meta.generatedAt !== 'string' || Number.isNaN(Date.parse(meta.generatedAt))) {
    throw new DevDataError(domain, `${file} has no valid generatedAt`)
  }
  return meta
}

/* Joined mtimes of a domain's files ('' when any is missing). */
async function mtimesOf(files: readonly string[]): Promise<string> {
  try {
    const stats = await Promise.all(files.map(f => stat(path.join(DATA_DIR, f))))
    return stats.map(s => s.mtimeMs).join(':')
  } catch {
    return ''
  }
}

/* ── Loaders ─────────────────────────────────────────────────────────── */

async function loadOss(): Promise<OssStore> {
  const [meta, companies, repos, issues] = await Promise.all(OSS_FILES.map(f => readJson('oss', f)))
  return buildOssStore(
    expectMeta<OssMeta>('oss', OSS_FILES[0], meta),
    expectArray<OssCompany>('oss', OSS_FILES[1], companies),
    expectArray<OssRepo>('oss', OSS_FILES[2], repos),
    expectArray<OssIssue>('oss', OSS_FILES[3], issues),
  )
}

/* Lowercased GitHub org login -> OSS company slug, for the API -> company
   bridge. Uses the loaded OSS store when there is one, else reads only the
   small companies file; without it the bridge falls back to the
   ossCompanySlug stored in the API snapshot. */
async function orgLoginMap(): Promise<Map<string, string> | undefined> {
  const oss = memo().oss.value
  if (oss) return new Map([...oss.companyByOrgLogin.entries()].map(([login, c]) => [login, c.slug]))
  try {
    const companies = await readJson('oss', OSS_FILES[1])
    if (!Array.isArray(companies)) return undefined
    const map = new Map<string, string>()
    for (const c of companies as OssCompany[]) for (const o of c.orgs ?? []) map.set(o.login.toLowerCase(), c.slug)
    return map
  } catch {
    return undefined
  }
}

async function loadApis(): Promise<ApisStore> {
  const [meta, apis] = await Promise.all(APIS_FILES.map(f => readJson('apis', f)))
  const checkedMeta = expectMeta<ApisMeta>('apis', APIS_FILES[0], meta)
  return buildApisStore(checkedMeta, expectArray<FreeApi>('apis', APIS_FILES[1], apis), await orgLoginMap())
}

async function loadLinks(): Promise<IwwLinks> {
  try {
    const raw = (await readJson('links', LINKS_FILE)) as Partial<IwwLinks> | null
    return {
      generatedAt: typeof raw?.generatedAt === 'string' ? raw.generatedAt : '',
      countryHubs: Array.isArray(raw?.countryHubs) ? raw.countryHubs.filter((p): p is string => typeof p === 'string') : [],
    }
  } catch {
    /* No verified country hubs means no hub links: the safe default. */
    return { generatedAt: '', countryHubs: [] }
  }
}

/* Shared memo + in-flight + retry + dev reload logic for one domain. */
async function getDomain<T>(
  domain: DevDataDomain,
  files: readonly string[],
  load: () => Promise<T>,
): Promise<T> {
  const m = memo()[domain] as DomainMemo<T>

  if (m.value && IS_DEV && Date.now() - m.checkedAt > DEV_STAT_MS && !m.loading) {
    m.checkedAt = Date.now()
    const now = await mtimesOf(files)
    if (now && now !== m.mtimes) m.value = null
  }
  if (m.value) return m.value
  if (m.error && Date.now() - m.failedAt < RETRY_MS) throw m.error

  if (!m.loading) {
    m.loading = (async () => {
      const mtimes = IS_DEV ? await mtimesOf(files) : ''
      const value = await load()
      m.value = value
      m.error = null
      m.logged = false
      m.mtimes = mtimes
      m.checkedAt = Date.now()
      return value
    })()
      .catch((err: unknown) => {
        const e = isDevDataError(err) ? err : new DevDataError(domain, `Could not load the ${domain} snapshot`, { cause: err })
        m.error = e
        m.failedAt = Date.now()
        if (!m.logged) {
          m.logged = true
          console.error(`[developers] ${e.message}`, (e as { cause?: unknown }).cause ?? '')
        }
        throw e
      })
      .finally(() => {
        m.loading = null
      })
  }
  return m.loading
}

/* ── Public API ──────────────────────────────────────────────────────── */

/** The open-source store. Throws DevDataError when the snapshot is
 *  missing or invalid. May schedule the optional GitHub refresh (6.5). */
export async function getOss(): Promise<OssStore> {
  const store = await getDomain('oss', OSS_FILES, loadOss)
  maybeRefreshOss(store, (meta, companies, repos, issues) => {
    const m = memo().oss
    /* Swap only if nothing replaced the store meanwhile (dev reload). */
    if (m.value === store) m.value = buildOssStore(meta, companies, repos, issues)
  })
  return memo().oss.value ?? store
}

/** The free-APIs store. Throws DevDataError when the snapshot is missing
 *  or invalid. May schedule the optional weekly API checks (6.5). */
export async function getApis(): Promise<ApisStore> {
  const store = await getDomain('apis', APIS_FILES, loadApis)
  maybeRefreshApiChecks(store, async (meta, apis) => {
    const m = memo().apis
    if (m.value !== store) return
    const next = buildApisStore(meta, apis, await orgLoginMap())
    if (m.value === store) m.value = next
  })
  return memo().apis.value ?? store
}

/** Verified cross-links to the main site (country hubs that return 200).
 *  Never throws: a missing file means no hub links. */
export async function getIwwLinks(): Promise<IwwLinks> {
  return getDomain('links', [LINKS_FILE], loadLinks)
}

/** getOss(), or null when the snapshot cannot be loaded (hub, sitemap). */
export async function tryGetOss(): Promise<OssStore | null> {
  try {
    return await getOss()
  } catch (err) {
    if (isDevDataError(err)) return null
    throw err
  }
}

/** getApis(), or null when the snapshot cannot be loaded (hub, sitemap). */
export async function tryGetApis(): Promise<ApisStore | null> {
  try {
    return await getApis()
  } catch (err) {
    if (isDevDataError(err)) return null
    throw err
  }
}
