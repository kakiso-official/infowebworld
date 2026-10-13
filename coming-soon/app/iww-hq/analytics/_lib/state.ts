'use client'
import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { FILTER_KEYS, type CompareMode, type FilterKey, type Filters } from '@/lib/analytics/types'
import { fmtRange } from './format'

/* ═══════════════════════════════════════════════════════════════════════════
   The URL is the state. Range, comparison and filters live in the query
   string of every analytics page, so a view can be bookmarked, shared, and
   survives reloads and back/forward.

     ?range=28d | ?from=2026-09-01&to=2026-09-30
     &compare=previous|year|none
     &f.channel=organic_search&f.country=US ...
     + page-specific params (group, tab, name, path, mode, ...)

   Same-page changes use history.pushState (Next.js syncs useSearchParams
   with it) so switching a tab or a filter never re-requests the route.

   The timezone is NOT in the URL: it's the viewer's browser zone unless
   overridden in Settings (localStorage 'iww_an_tz'); useReport appends it.
   ═══════════════════════════════════════════════════════════════════════════ */

export const ANALYTICS_BASE = '/iww-hq/analytics'

export const RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '7d', label: 'Last 7 days' },
  { value: '28d', label: 'Last 28 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'mtd', label: 'This month' },
  { value: 'lastmonth', label: 'Last month' },
  { value: '12m', label: 'Last 12 months' },
  { value: 'all', label: 'All time' },
] as const
export type RangePreset = (typeof RANGE_OPTIONS)[number]['value']
export const DEFAULT_RANGE: RangePreset = '28d'

export const COMPARE_OPTIONS: { value: CompareMode; label: string; short: string }[] = [
  { value: 'previous', label: 'Compare to previous period', short: 'vs previous period' },
  { value: 'year', label: 'Compare to same period last year', short: 'vs last year' },
  { value: 'none', label: 'No comparison', short: 'No comparison' },
]

/** Query keys that travel with every analytics link (range, comparison, filters). */
const RANGE_KEYS = ['range', 'from', 'to', 'compare'] as const
const isCarryKey = (k: string) => (RANGE_KEYS as readonly string[]).includes(k) || k.startsWith('f.')

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/* ── Timezone (localStorage override, else the browser's) ──────────────── */

/** localStorage key for the Settings timezone override. */
export const ANALYTICS_TZ_KEY = 'iww_an_tz'
const TZ_EVENT = 'iww-an-tz'

export function browserTimeZone(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' } catch { return 'UTC' }
}

export function isValidTimeZone(tz: string): boolean {
  try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); return true } catch { return false }
}

function readTz(): string {
  try {
    const v = window.localStorage.getItem(ANALYTICS_TZ_KEY)
    if (v && isValidTimeZone(v)) return v
  } catch { /* storage blocked */ }
  return browserTimeZone()
}

function subscribeTz(cb: () => void): () => void {
  window.addEventListener('storage', cb)
  window.addEventListener(TZ_EVENT, cb)
  return () => {
    window.removeEventListener('storage', cb)
    window.removeEventListener(TZ_EVENT, cb)
  }
}

/** The timezone every report and every timestamp in the UI uses. */
export function useViewerTimeZone(): string {
  return useSyncExternalStore(subscribeTz, readTz, () => 'UTC')
}

/** The Settings override (null when following the browser). */
export function getTimeZoneOverride(): string | null {
  try {
    const v = window.localStorage.getItem(ANALYTICS_TZ_KEY)
    return v && isValidTimeZone(v) ? v : null
  } catch {
    return null
  }
}

/** Set (or clear with null) the analytics timezone override; every open report re-fetches. */
export function setAnalyticsTimeZone(tz: string | null): void {
  try {
    if (tz && isValidTimeZone(tz)) window.localStorage.setItem(ANALYTICS_TZ_KEY, tz)
    else window.localStorage.removeItem(ANALYTICS_TZ_KEY)
  } catch { /* storage blocked - nothing to persist */ }
  window.dispatchEvent(new Event(TZ_EVENT))
}

/* ── Links ──────────────────────────────────────────────────────────────── */

type ParamValue = string | number | boolean | null | undefined

/**
 * Build an analytics link that keeps the current range, comparison and
 * filters. `path` may carry its own query (an insight href such as
 * '/iww-hq/analytics/pages?f.entry=/saas-directory'); its params and then
 * `extra` win over the carried ones. A null/undefined/'' value removes a key.
 * Relative paths ('pages', 'sessions/12') resolve under /iww-hq/analytics.
 */
export function analyticsHref(path: string, extra?: Record<string, ParamValue>, current?: URLSearchParams | string): string {
  const [rawPath, rawQuery = ''] = path.split('?', 2)
  const base = rawPath.startsWith('/') ? rawPath : `${ANALYTICS_BASE}/${rawPath}`.replace(/\/$/, '')
  const cur = typeof current === 'string' ? new URLSearchParams(current) : current
    ?? (typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams())

  const out = new URLSearchParams()
  for (const [k, v] of cur) if (isCarryKey(k)) out.set(k, v)
  const own = new URLSearchParams(rawQuery)
  // A link that sets its own range must not inherit a custom from/to (or vice versa).
  if (own.has('range')) { out.delete('from'); out.delete('to') }
  if (own.has('from') || own.has('to')) out.delete('range')
  for (const [k, v] of own) out.set(k, v)
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v == null || v === '' || v === false) out.delete(k)
      else out.set(k, String(v))
    }
  }
  const qs = out.toString()
  return qs ? `${base}?${qs}` : base
}

/* ── The hook ───────────────────────────────────────────────────────────── */

export interface AnalyticsQuery {
  /** Selected preset, or 'custom' when from/to are set. */
  range: RangePreset | 'custom'
  /** "Last 28 days" / "1 Sep – 30 Sep 2026". */
  rangeLabel: string
  from: string | null
  to: string | null
  compare: CompareMode
  filters: Filters
  /** Active filters in URL order, ready to render as chips. */
  filterList: { key: FilterKey; value: string }[]
  tz: string
  /** Current query string without the leading '?'. */
  search: string
  /** Read any query param (page-specific: group, tab, name, path...). */
  param(name: string): string | null
  /**
   * Merge params into the URL (null/''/false removes). Changing the range,
   * comparison or a filter also resets `offset` (paging) so tables restart.
   * Pushes a history entry by default; pass { replace: true } for typing.
   */
  set(params: Record<string, ParamValue>, opts?: { replace?: boolean }): void
  setFilter(key: FilterKey, value: string): void
  removeFilter(key: FilterKey): void
  clearFilters(): void
  /** analyticsHref() bound to the current URL. */
  href(path: string, extra?: Record<string, ParamValue>): string
}

/** Read and update the analytics URL state. Must render under <Suspense> (useSearchParams). */
export function useAnalyticsQuery(): AnalyticsQuery {
  const sp = useSearchParams()
  const tz = useViewerTimeZone()
  const search = sp.toString()

  const set = useCallback((params: Record<string, ParamValue>, opts: { replace?: boolean } = {}) => {
    const next = new URLSearchParams(window.location.search)
    let resetsPaging = false
    for (const [k, v] of Object.entries(params)) {
      if (isCarryKey(k)) resetsPaging = true
      if (v == null || v === '' || v === false) next.delete(k)
      else next.set(k, String(v))
    }
    if ('range' in params && params.range) { next.delete('from'); next.delete('to') }
    if (('from' in params && params.from) || ('to' in params && params.to)) next.delete('range')
    if (resetsPaging && !('offset' in params)) next.delete('offset')
    const qs = next.toString()
    const url = `${window.location.pathname}${qs ? `?${qs}` : ''}`
    if (opts.replace) window.history.replaceState(null, '', url)
    else window.history.pushState(null, '', url)
  }, [])

  return useMemo<AnalyticsQuery>(() => {
    const p = new URLSearchParams(search)
    const fromP = p.get('from')
    const toP = p.get('to')
    const custom = !!(fromP && toP && DATE_RE.test(fromP) && DATE_RE.test(toP))
    const rawRange = p.get('range')
    const preset = (RANGE_OPTIONS.find(o => o.value === rawRange)?.value ?? DEFAULT_RANGE) as RangePreset
    const range: RangePreset | 'custom' = custom ? 'custom' : preset
    const from = custom ? (fromP! <= toP! ? fromP! : toP!) : null
    const to = custom ? (fromP! <= toP! ? toP! : fromP!) : null
    const cmpRaw = p.get('compare')
    const compare: CompareMode = cmpRaw === 'none' || cmpRaw === 'year' ? cmpRaw : 'previous'

    const filters: Filters = {}
    const filterList: { key: FilterKey; value: string }[] = []
    for (const [k, v] of p) {
      if (!k.startsWith('f.') || !v) continue
      const key = k.slice(2) as FilterKey
      if (!(FILTER_KEYS as readonly string[]).includes(key)) continue
      ;(filters as Record<string, string>)[key] = v
      filterList.push({ key, value: v })
    }

    return {
      range,
      rangeLabel: custom ? fmtRange(from!, to!) : RANGE_OPTIONS.find(o => o.value === preset)!.label,
      from,
      to,
      compare,
      filters,
      filterList,
      tz,
      search,
      param: (name: string) => p.get(name),
      set,
      setFilter: (key, value) => set({ [`f.${key}`]: value }),
      removeFilter: key => set({ [`f.${key}`]: null }),
      clearFilters: () => {
        const clear: Record<string, null> = {}
        for (const k of FILTER_KEYS) clear[`f.${k}`] = null
        set(clear)
      },
      href: (path, extra) => analyticsHref(path, extra, p),
    }
  }, [search, tz, set])
}

/** True when `pathname` is (or is under) the analytics route `route` ('' = Overview). */
export function isActiveRoute(pathname: string, route: string): boolean {
  const target = route ? `${ANALYTICS_BASE}/${route}` : ANALYTICS_BASE
  if (!route) return pathname === ANALYTICS_BASE || pathname === `${ANALYTICS_BASE}/`
  return pathname === target || pathname.startsWith(target + '/')
}

/** Used by the layout to know the current analytics route segment. */
export function useAnalyticsRoute(): string {
  const pathname = usePathname() || ANALYTICS_BASE
  return pathname.startsWith(ANALYTICS_BASE + '/') ? pathname.slice(ANALYTICS_BASE.length + 1).split('/')[0] : ''
}
