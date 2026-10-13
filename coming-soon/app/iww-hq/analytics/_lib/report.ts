'use client'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { useSearchParams } from 'next/navigation'
import { useViewerTimeZone } from './state'

/* ═══════════════════════════════════════════════════════════════════════════
   Report fetching: GET /api/admin/analytics/{report}?<range+filters>&tz=...

   A tiny module-level store instead of per-component state, because:
   - two components asking for the same report (the live pill and the
     "Right now" panel) share one request and one cached answer;
   - answers are cached for 60 s, so flipping between tabs/pages is instant;
   - the control bar's "Updated 12:04 · ⟳" can invalidate every report at once.

   While a new answer loads, the hook keeps returning the previous answer
   (flagged `refreshing`) so charts dim instead of flashing a skeleton.
   An in-flight request nobody wants any more is aborted.
   ═══════════════════════════════════════════════════════════════════════════ */

const API = '/api/admin/analytics'
const CACHE_MS = 60_000
const MAX_ENTRIES = 80

type ParamValue = string | number | boolean | null | undefined
/** Report-specific params (group, name, path, limit, sort...). null/'' are dropped. */
export type ReportExtra = Record<string, ParamValue>

interface Entry {
  data?: unknown
  error?: string
  status?: number
  needsMigration?: boolean
  missingTables?: string[]
  loading: boolean
  fetchedAt: number      // ms of the last successful answer (0 = never)
  epoch: number          // invalidation epoch the answer belongs to
  ctrl?: AbortController
  refs: number           // mounted hooks that want this URL
}

const entries = new Map<string, Entry>()
const listeners = new Set<() => void>()
let version = 0
let epoch = 0
let lastFetchedAt = 0

function emit() {
  version++
  for (const l of listeners) l()
}
function subscribe(l: () => void): () => void {
  listeners.add(l)
  return () => { listeners.delete(l) }
}
const getVersion = () => version
const getEpoch = () => epoch
const getLastFetchedAt = () => lastFetchedAt
const getZero = () => 0

function entryOf(url: string): Entry {
  let e = entries.get(url)
  if (!e) {
    e = { loading: false, fetchedAt: 0, epoch: -1, refs: 0 }
    entries.set(url, e)
    evict()
  }
  return e
}

/** Drop the oldest idle entries so a long admin session can't grow memory forever. */
function evict() {
  if (entries.size <= MAX_ENTRIES) return
  const idle = [...entries.entries()]
    .filter(([, e]) => e.refs === 0 && !e.loading)
    .sort((a, b) => a[1].fetchedAt - b[1].fetchedAt)
  for (const [url] of idle.slice(0, entries.size - MAX_ENTRIES)) entries.delete(url)
}

function errorText(status: number, body: unknown): string {
  if (status === 401 || status === 403) return 'Your admin session has expired. Reload the page and sign in again.'
  if (status === 404 && body && typeof body === 'object' && (body as { notFound?: boolean }).notFound) {
    const what = String((body as { error?: unknown }).error || 'This item was not found')
    return `${what}. It may be older than the data we keep, or the link is wrong.`
  }
  if (status === 404) return 'This report does not exist on the server yet. Deploy the latest version and retry.'
  const msg = body && typeof body === 'object' && 'error' in body ? String((body as { error: unknown }).error) : ''
  return msg ? `${msg} (HTTP ${status}).` : `The server answered with an error (HTTP ${status}).`
}

/** Fetch `url` unless a fresh-enough answer is cached or a request is already running. */
function load(url: string, maxAgeMs = CACHE_MS) {
  const e = entryOf(url)
  if (e.loading) return
  if (e.data !== undefined && e.epoch === epoch && Date.now() - e.fetchedAt < maxAgeMs) return

  const ctrl = new AbortController()
  e.loading = true
  e.ctrl = ctrl
  const startEpoch = epoch
  emit()

  fetch(url, { signal: ctrl.signal, credentials: 'same-origin', cache: 'no-store' })
    .then(async res => {
      let body: unknown = null
      try { body = await res.json() } catch { /* empty or non-JSON body */ }
      if (res.status === 503 && body && typeof body === 'object' && (body as { needsMigration?: boolean }).needsMigration) {
        e.needsMigration = true
        e.missingTables = (body as { missingTables?: string[] }).missingTables ?? []
        e.data = undefined
        e.error = undefined
        e.status = 503
        return
      }
      if (!res.ok) {
        // Keep an older answer (a failed poll shouldn't blank a live page).
        e.error = errorText(res.status, body)
        e.status = res.status
        e.needsMigration = false
        return
      }
      e.data = body
      e.error = undefined
      e.status = res.status
      e.needsMigration = false
      e.fetchedAt = Date.now()
      e.epoch = startEpoch
      lastFetchedAt = e.fetchedAt
    })
    .catch((err: unknown) => {
      if (ctrl.signal.aborted) return // nobody needs it any more; keep what we had
      e.error = err instanceof Error && err.message && !/fetch/i.test(err.message)
        ? err.message
        : 'Could not reach the server. Check your connection and retry.'
    })
    .finally(() => {
      if (e.ctrl === ctrl) { e.loading = false; e.ctrl = undefined }
      emit()
    })
}

function retain(url: string) {
  entryOf(url).refs++
}

function release(url: string) {
  const e = entries.get(url)
  if (!e) return
  e.refs = Math.max(0, e.refs - 1)
  // Deferred so a remount in the same tick (StrictMode, a key change) keeps the request alive.
  setTimeout(() => {
    if (e.refs === 0 && e.loading && e.ctrl) {
      e.ctrl.abort()
      e.loading = false
      e.ctrl = undefined
      emit()
    }
  }, 0)
}

/** Mark every cached answer stale; every mounted useReport re-fetches. */
export function invalidateReports(): void {
  epoch++
  emit()
}

/** ms timestamp of the most recent successful report answer (0 = none yet). */
export function useReportsUpdatedAt(): number {
  return useSyncExternalStore(subscribe, getLastFetchedAt, getZero)
}

/** True while any report request is running (for the refresh spinner). */
export function useAnyReportLoading(): boolean {
  useSyncExternalStore(subscribe, getVersion, getZero)
  for (const e of entries.values()) if (e.loading && e.refs > 0) return true
  return false
}

/* ── URL building ───────────────────────────────────────────────────────── */

export interface ReportOptions {
  /** Skip the request (e.g. until a required param is chosen). Default true. */
  enabled?: boolean
  /** Re-fetch every N ms while the tab is visible (0/undefined = off). */
  poll?: number
  /** Don't send range/from/to/compare (realtime). */
  ignoreRange?: boolean
  /** Don't send the f.* filters (site-wide numbers such as the live pill). */
  ignoreFilters?: boolean
  /** Keep showing the previous answer while a new one loads. Default true. */
  keepPrevious?: boolean
}

/**
 * The API URL for a report given the page's query string. Carries the range,
 * comparison and filters (unless told not to), adds `extra`, then the tz.
 * Keys are sorted so equal requests share one cache entry.
 */
export function buildReportUrl(report: string, pageSearch: string, tz: string, extra?: ReportExtra, opts: ReportOptions = {}): string {
  const page = new URLSearchParams(pageSearch)
  const out: [string, string][] = []
  for (const [k, v] of page) {
    if (!v) continue
    const isRange = k === 'range' || k === 'from' || k === 'to' || k === 'compare'
    if (isRange && !opts.ignoreRange) out.push([k, v])
    else if (k.startsWith('f.') && !opts.ignoreFilters) out.push([k, v])
  }
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      const i = out.findIndex(([key]) => key === k)
      if (i >= 0) out.splice(i, 1)
      if (v == null || v === '' || v === false) continue
      out.push([k, String(v)])
    }
  }
  out.push(['tz', tz])
  out.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
  return `${API}/${encodeURIComponent(report)}?${new URLSearchParams(out).toString()}`
}

/* ── The hook ───────────────────────────────────────────────────────────── */

export interface ReportState<T> {
  /** The answer (possibly the previous one while `refreshing`). */
  data: T | undefined
  /** Plain-English error, when the last request failed. */
  error: string | null
  /** A request for the current params is running. */
  loading: boolean
  /** Loading while showing older data - dim, don't skeleton. */
  refreshing: boolean
  /** The analytics tables don't exist yet (API answered 503). */
  needsMigration: boolean
  missingTables: string[]
  /** ms timestamp of the shown answer. */
  updatedAt: number | null
  /** Force a fresh request now. */
  reload(): void
}

/**
 * Fetch a report for the current analytics URL state.
 *
 *   const r = useReport<OverviewReport>('overview')
 *   const r = useReport<PagesReport>('pages', { group: 'entry', limit: 50 })
 *   const r = useReport<RealtimeReport>('realtime', undefined, { ignoreRange: true, poll: 10_000 })
 *
 * Must render under <Suspense> (it reads useSearchParams); the analytics
 * layout already wraps every page in one.
 */
export function useReport<T>(report: string, extra?: ReportExtra, opts: ReportOptions = {}): ReportState<T> {
  const sp = useSearchParams()
  const tz = useViewerTimeZone()
  const enabled = opts.enabled !== false
  const url = buildReportUrl(report, sp.toString(), tz, extra, opts)

  useSyncExternalStore(subscribe, getVersion, getZero)
  const ep = useSyncExternalStore(subscribe, getEpoch, getZero)

  // The last URL whose answer we showed - lets the hook hold that answer
  // while the new one loads (adjusting state during render is React's
  // documented pattern for "derive from the previous render").
  const [shownUrl, setShownUrl] = useState(url)
  const entry = enabled ? entries.get(url) : undefined
  if (entry?.data !== undefined && shownUrl !== url) setShownUrl(url)

  useEffect(() => {
    if (!enabled) return
    retain(url)
    load(url)
    return () => release(url)
  }, [url, ep, enabled])

  const poll = opts.poll ?? 0
  useEffect(() => {
    if (!enabled || !poll) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') load(url, poll * 0.8)
    }, poll)
    // Catch up immediately when the tab becomes visible again.
    const onVis = () => { if (document.visibilityState === 'visible') load(url, poll) }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [url, enabled, poll])

  const failed = !!entry && !entry.loading && (!!entry.error || !!entry.needsMigration)
  const prev = opts.keepPrevious !== false && !failed && shownUrl !== url ? entries.get(shownUrl) : undefined
  const own = entry?.data !== undefined
  const data = (own ? entry!.data : prev?.data) as T | undefined
  const loading = enabled && (!entry || entry.loading || (entry.data === undefined && !entry.error && !entry.needsMigration))

  return {
    data,
    error: entry?.error ?? null,
    loading,
    refreshing: loading && data !== undefined,
    needsMigration: !!entry?.needsMigration,
    missingTables: entry?.missingTables ?? [],
    updatedAt: own ? entry!.fetchedAt || null : prev?.fetchedAt || null,
    reload: () => load(url, 0),
  }
}

/**
 * POST /api/admin/analytics/{action} (e.g. 'exclude'). Resolves with the JSON
 * body; throws an Error with a readable message on failure.
 */
export async function postAnalytics<T = unknown>(action: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}/${encodeURIComponent(action)}`, {
    method: 'POST',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  })
  let json: unknown = null
  try { json = await res.json() } catch { /* no body */ }
  if (!res.ok) throw new Error(errorText(res.status, json))
  return json as T
}
