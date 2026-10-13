import { toSqlUtc } from './db'
import {
  FILTER_KEYS, MAX_RANGE_DAYS,
  type Bucket, type CompareMode, type Filters, type ResolvedRange,
} from './types'

/* ═══════════════════════════════════════════════════════════════════════════
   Shared report plumbing: request params -> range (in the viewer's timezone,
   DST-aware), chart buckets, and parameterized filter SQL.

   Every report module receives a ReportParams from parseReportParams() and
   builds its SQL with the helpers below, so all reports agree on what a
   range, a bucket and a filter mean.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface ReportParams {
  report: string
  range: ResolvedRange
  filters: Filters
  /** Raw query string for report-specific options (group, name, steps...). */
  sp: URLSearchParams
  limit: number
  offset: number
  sort: string | null
  dir: 'asc' | 'desc'
  /** Free-text table search (e.g. path contains). */
  q: string | null
}

export interface SqlPart { sql: string; params: unknown[] }

/* ── Timezone math (no libraries; Intl does the work) ───────────────────── */

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz })
    return true
  } catch {
    return false
  }
}

const dtfCache = new Map<string, Intl.DateTimeFormat>()
function partsIn(ms: number, tz: string): Record<string, number> {
  let f = dtfCache.get(tz)
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    })
    dtfCache.set(tz, f)
  }
  const out: Record<string, number> = {}
  for (const p of f.formatToParts(new Date(ms))) if (p.type !== 'literal') out[p.type] = Number(p.value)
  return out
}

/** Minutes to ADD to UTC to get the local wall-clock time in `tz` at instant `ms`. */
export function tzOffsetMinutes(ms: number, tz: string): number {
  const p = partsIn(ms, tz)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000)
}

/** Local calendar date 'YYYY-MM-DD' in `tz` at instant `ms`. */
export function localDate(ms: number, tz: string): string {
  const p = partsIn(ms, tz)
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`
}

/** UTC epoch ms of the local midnight that starts `date` ('YYYY-MM-DD') in `tz`. */
export function localMidnightUtcMs(date: string, tz: string): number {
  const [y, m, d] = date.split('-').map(Number)
  const guess = Date.UTC(y, m - 1, d)
  const off1 = tzOffsetMinutes(guess, tz)
  let utc = guess - off1 * 60000
  const off2 = tzOffsetMinutes(utc, tz)
  if (off2 !== off1) utc = guess - off2 * 60000
  return utc
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function isValidDate(s: string | null | undefined): s is string {
  if (!s || !DATE_RE.test(s)) return false
  const [y, m, d] = s.split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1, d))
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d
}

export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10)
}

/** Inclusive number of days from a to b. */
export function daysInclusive(a: string, b: string): number {
  const [y1, m1, d1] = a.split('-').map(Number)
  const [y2, m2, d2] = b.split('-').map(Number)
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000) + 1
}

function shiftYears(date: string, years: number): string {
  const [y, m, d] = date.split('-').map(Number)
  const ny = y + years
  const last = new Date(Date.UTC(ny, m, 0)).getUTCDate()
  return `${ny}-${String(m).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`
}

/* ── Range resolution ───────────────────────────────────────────────────── */

export const RANGE_PRESETS = ['today', 'yesterday', '7d', '28d', '30d', '90d', '12m', 'mtd', 'lastmonth', 'all'] as const
export type RangePreset = (typeof RANGE_PRESETS)[number]

function presetDates(preset: string, today: string): { from: string; to: string } | null {
  switch (preset) {
    case 'today': return { from: today, to: today }
    case 'yesterday': { const y = addDays(today, -1); return { from: y, to: y } }
    case '7d': return { from: addDays(today, -6), to: today }
    case '28d': return { from: addDays(today, -27), to: today }
    case '30d': return { from: addDays(today, -29), to: today }
    case '90d': return { from: addDays(today, -89), to: today }
    case '12m': return { from: addDays(today, -364), to: today }
    case 'mtd': return { from: today.slice(0, 8) + '01', to: today }
    case 'lastmonth': {
      const firstThis = today.slice(0, 8) + '01'
      const lastPrev = addDays(firstThis, -1)
      return { from: lastPrev.slice(0, 8) + '01', to: lastPrev }
    }
    case 'all': return { from: addDays(today, -(MAX_RANGE_DAYS - 1)), to: today }
    default: return null
  }
}

export function pickBucket(days: number): Bucket {
  if (days <= 2) return 'hour'
  if (days <= 92) return 'day'
  if (days <= MAX_RANGE_DAYS) return 'week'
  return 'month'
}

/**
 * Params: tz, range (preset) or from/to (YYYY-MM-DD, inclusive), compare.
 * Defaults: last 28 days, compare to the previous period, UTC.
 */
export function resolveRange(sp: URLSearchParams, nowMs: number = Date.now()): ResolvedRange {
  const tzRaw = sp.get('tz') || 'UTC'
  const tz = isValidTimeZone(tzRaw) ? tzRaw : 'UTC'
  const today = localDate(nowMs, tz)

  let from: string
  let to: string
  const fromP = sp.get('from')
  const toP = sp.get('to')
  if (isValidDate(fromP) && isValidDate(toP)) {
    from = fromP <= toP ? fromP : toP
    to = fromP <= toP ? toP : fromP
  } else {
    const p = presetDates(sp.get('range') || '28d', today) || presetDates('28d', today)!
    from = p.from
    to = p.to
  }
  if (to > today) to = today
  if (from > to) from = to
  if (daysInclusive(from, to) > MAX_RANGE_DAYS) from = addDays(to, -(MAX_RANGE_DAYS - 1))

  const days = daysInclusive(from, to)
  const startUtc = toSqlUtc(localMidnightUtcMs(from, tz))
  const endUtc = toSqlUtc(localMidnightUtcMs(addDays(to, 1), tz))

  const cmpRaw = sp.get('compare')
  const compare: CompareMode = cmpRaw === 'none' || cmpRaw === 'year' ? cmpRaw : 'previous'
  let prev: ResolvedRange['prev'] = null
  if (compare === 'previous') {
    const pTo = addDays(from, -1)
    const pFrom = addDays(pTo, -(days - 1))
    prev = { from: pFrom, to: pTo, startUtc: toSqlUtc(localMidnightUtcMs(pFrom, tz)), endUtc: toSqlUtc(localMidnightUtcMs(addDays(pTo, 1), tz)) }
  } else if (compare === 'year') {
    const pFrom = shiftYears(from, -1)
    const pTo = shiftYears(to, -1)
    prev = { from: pFrom, to: pTo, startUtc: toSqlUtc(localMidnightUtcMs(pFrom, tz)), endUtc: toSqlUtc(localMidnightUtcMs(addDays(pTo, 1), tz)) }
  }

  return { from, to, tz, days, bucket: pickBucket(days), startUtc, endUtc, compare, prev }
}

/** The current or comparison window of a range as SQL-ready UTC bounds. */
export function windowOf(range: ResolvedRange, which: 'cur' | 'prev'): { startUtc: string; endUtc: string; from: string; to: string } | null {
  if (which === 'cur') return { startUtc: range.startUtc, endUtc: range.endUtc, from: range.from, to: range.to }
  return range.prev
}

/* ── Chart buckets ──────────────────────────────────────────────────────── */

const MS_MIN = 60000

function utcSqlToMs(s: string): number {
  return Date.parse(s.replace(' ', 'T') + 'Z')
}

/** UTC-offset segments covering [startMs, endMs): `offset` applies to instants before `untilMs`. */
export function offsetSegments(startMs: number, endMs: number, tz: string): { untilMs: number | null; offset: number }[] {
  const segs: { untilMs: number | null; offset: number }[] = []
  let cur = tzOffsetMinutes(startMs, tz)
  let t = startMs
  while (t < endMs) {
    const next = Math.min(t + 86400000, endMs)
    const off = tzOffsetMinutes(next - 1, tz)
    if (off !== cur) {
      let lo = Math.floor(t / MS_MIN) * MS_MIN
      let hi = Math.ceil(next / MS_MIN) * MS_MIN
      while (hi - lo > MS_MIN) {
        const mid = Math.floor((lo + hi) / 2 / MS_MIN) * MS_MIN
        if (tzOffsetMinutes(mid, tz) === cur) lo = mid
        else hi = mid
      }
      segs.push({ untilMs: hi, offset: cur })
      cur = off
    }
    t = next
  }
  segs.push({ untilMs: null, offset: cur })
  return segs
}

/** SQL for "this UTC column, as local wall-clock time in range.tz" (DST-aware within the window). */
export function localTimeExpr(column: string, range: ResolvedRange, which: 'cur' | 'prev' = 'cur'): SqlPart {
  const w = windowOf(range, which) ?? windowOf(range, 'cur')!
  const segs = offsetSegments(utcSqlToMs(w.startUtc), utcSqlToMs(w.endUtc), range.tz)
  if (segs.length === 1) return { sql: `DATE_ADD(${column}, INTERVAL ? MINUTE)`, params: [segs[0].offset] }
  const parts: string[] = []
  const params: unknown[] = []
  for (const s of segs) {
    if (s.untilMs == null) {
      parts.push('ELSE ?')
      params.push(s.offset)
    } else {
      parts.push(`WHEN ${column} < ? THEN ?`)
      params.push(toSqlUtc(s.untilMs), s.offset)
    }
  }
  return { sql: `DATE_ADD(${column}, INTERVAL (CASE ${parts.join(' ')} END) MINUTE)`, params }
}

/**
 * SQL expression giving the bucket key for a UTC column, matching bucketKeys().
 * Use it once per query as `<expr> AS b ... GROUP BY b`.
 */
export function bucketExpr(column: string, range: ResolvedRange, which: 'cur' | 'prev' = 'cur'): SqlPart {
  const lt = localTimeExpr(column, range, which)
  switch (range.bucket) {
    case 'hour':
      return { sql: `DATE_FORMAT(${lt.sql}, '%Y-%m-%d %H:00')`, params: lt.params }
    case 'day':
      return { sql: `DATE_FORMAT(${lt.sql}, '%Y-%m-%d')`, params: lt.params }
    case 'week':
      return {
        sql: `DATE_FORMAT(DATE_SUB(DATE(${lt.sql}), INTERVAL WEEKDAY(${lt.sql}) DAY), '%Y-%m-%d')`,
        params: [...lt.params, ...lt.params],
      }
    case 'month':
      return { sql: `DATE_FORMAT(${lt.sql}, '%Y-%m-01')`, params: lt.params }
  }
}

const fmtDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
const fmtMonth = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
function dayLabel(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return fmtDay.format(new Date(Date.UTC(y, m - 1, d)))
}

/** Every bucket key in the window (oldest first) with a short axis label - use it to zero-fill series. */
export function bucketKeys(range: ResolvedRange, which: 'cur' | 'prev' = 'cur'): { t: string; label: string }[] {
  const w = windowOf(range, which) ?? windowOf(range, 'cur')!
  const out: { t: string; label: string }[] = []
  const seen = new Set<string>()
  const push = (t: string, label: string) => { if (!seen.has(t)) { seen.add(t); out.push({ t, label }) } }
  for (let d = w.from; d <= w.to; d = addDays(d, 1)) {
    switch (range.bucket) {
      case 'hour':
        for (let h = 0; h < 24; h++) {
          const hh = String(h).padStart(2, '0')
          push(`${d} ${hh}:00`, range.days === 1 ? `${hh}:00` : `${dayLabel(d)}, ${hh}:00`)
        }
        break
      case 'day':
        push(d, dayLabel(d))
        break
      case 'week': {
        const [y, m, dd] = d.split('-').map(Number)
        const wd = (new Date(Date.UTC(y, m - 1, dd)).getUTCDay() + 6) % 7 // 0 = Monday
        const monday = addDays(d, -wd)
        push(monday, dayLabel(monday))
        break
      }
      case 'month': {
        const [y, m] = d.split('-').map(Number)
        push(`${d.slice(0, 7)}-01`, fmtMonth.format(new Date(Date.UTC(y, m - 1, 1))))
        break
      }
    }
  }
  return out
}

/* ── Filters ────────────────────────────────────────────────────────────── */

export function parseFilters(sp: URLSearchParams): Filters {
  const f: Record<string, string> = {}
  for (const k of FILTER_KEYS) {
    const v = sp.get(`f.${k}`)
    if (v != null && v !== '') f[k] = v.slice(0, 500)
  }
  const out = f as Filters
  if (out.visitor && out.visitor !== 'new' && out.visitor !== 'returning') delete out.visitor
  if (out.user && out.user !== 'linked') delete out.user
  if (out.converted && !['any', 'signup', 'listing', 'lead', 'outbound'].includes(out.converted)) delete out.converted
  return out
}

/** Filter value meaning "no value recorded". */
export const NONE_VALUE = '(none)'

const SESSION_COLUMN: Partial<Record<keyof Filters, string>> = {
  channel: 'channel', source: 'source', medium: 'medium', campaign: 'campaign',
  referrer: 'referrer_host', country: 'country', region: 'region', city: 'city',
  device: 'device_type', browser: 'browser', os: 'os', entry: 'entry_path', exit: 'exit_path',
}

const CONVERTED_SQL: Record<string, string> = {
  any: 'key_events > 0', signup: 'did_signup = 1', listing: 'did_listing = 1',
  lead: 'did_lead = 1', outbound: 'did_outbound = 1',
}

/** True when any filter other than page/pageType is set (needs an_sessions). */
export function hasSessionFilters(f: Filters): boolean {
  return Object.keys(f).some(k => k !== 'page' && k !== 'pageType')
}

function sessionOnlyConditions(f: Filters, s: string): SqlPart {
  const conds: string[] = []
  const params: unknown[] = []
  for (const [key, col] of Object.entries(SESSION_COLUMN) as [keyof Filters, string][]) {
    const v = f[key]
    if (v == null) continue
    // Same rule as the report group keys (NULL / '' / a stored '(none)', e.g. medium of direct visits).
    if (v === NONE_VALUE) conds.push(`COALESCE(NULLIF(${s}.${col}, ''), '${NONE_VALUE}') = '${NONE_VALUE}'`)
    else { conds.push(`${s}.${col} = ?`); params.push(v) }
  }
  if (f.visitor === 'new') conds.push(`${s}.is_new = 1`)
  if (f.visitor === 'returning') conds.push(`${s}.is_new = 0`)
  if (f.user === 'linked') conds.push(`${s}.user_id IS NOT NULL`)
  if (f.converted) conds.push(`${s}.${CONVERTED_SQL[f.converted]}`)
  return { sql: conds.join(' AND '), params }
}

function join(parts: SqlPart[]): SqlPart {
  const kept = parts.filter(p => p.sql)
  return { sql: kept.map(p => p.sql).join(' AND ') || '1=1', params: kept.flatMap(p => p.params) }
}

/**
 * Conditions on an_sessions (alias `s`): the visit started inside the window,
 * plus every filter. page/pageType mean "the visit viewed that page / a page
 * of that type". Returns SQL without a leading WHERE.
 */
export function sessionConditions(
  f: Filters,
  win: { startUtc: string; endUtc: string } | null,
  s = 's',
): SqlPart {
  const parts: SqlPart[] = []
  if (win) parts.push({ sql: `${s}.started_at >= ? AND ${s}.started_at < ?`, params: [win.startUtc, win.endUtc] })
  parts.push(sessionOnlyConditions(f, s))
  if (f.page) parts.push({ sql: `EXISTS (SELECT 1 FROM an_pageviews fpv WHERE fpv.session_id = ${s}.id AND fpv.path = ?)`, params: [f.page] })
  if (f.pageType) parts.push({ sql: `EXISTS (SELECT 1 FROM an_pageviews fpt WHERE fpt.session_id = ${s}.id AND fpt.page_type = ?)`, params: [f.pageType] })
  return join(parts)
}

/**
 * Conditions on an_pageviews (alias `p`) viewed inside the window. page and
 * pageType filter the pageviews themselves; every other filter applies to the
 * visit, so when needsSessionJoin is true the caller must
 * `JOIN an_sessions s ON s.id = p.session_id`.
 */
export function pageviewConditions(
  f: Filters,
  win: { startUtc: string; endUtc: string } | null,
  p = 'p',
  s = 's',
): SqlPart & { needsSessionJoin: boolean } {
  const parts: SqlPart[] = []
  if (win) parts.push({ sql: `${p}.ts >= ? AND ${p}.ts < ?`, params: [win.startUtc, win.endUtc] })
  if (f.page) parts.push({ sql: `${p}.path = ?`, params: [f.page] })
  if (f.pageType) parts.push({ sql: `${p}.page_type = ?`, params: [f.pageType] })
  const needsSessionJoin = hasSessionFilters(f)
  if (needsSessionJoin) parts.push(sessionOnlyConditions(f, s))
  return { ...join(parts), needsSessionJoin }
}

/**
 * Conditions on an_events (alias `e`) inside the window. page = event fired on
 * that path; pageType = the visit viewed a page of that type; everything else
 * applies to the visit (needsSessionJoin -> `JOIN an_sessions s ON s.id = e.session_id`).
 */
export function eventConditions(
  f: Filters,
  win: { startUtc: string; endUtc: string } | null,
  e = 'e',
  s = 's',
): SqlPart & { needsSessionJoin: boolean } {
  const parts: SqlPart[] = []
  if (win) parts.push({ sql: `${e}.ts >= ? AND ${e}.ts < ?`, params: [win.startUtc, win.endUtc] })
  if (f.page) parts.push({ sql: `${e}.path = ?`, params: [f.page] })
  const needsSessionJoin = hasSessionFilters(f) || !!f.pageType
  if (hasSessionFilters(f)) parts.push(sessionOnlyConditions(f, s))
  if (f.pageType) parts.push({ sql: `EXISTS (SELECT 1 FROM an_pageviews fpt WHERE fpt.session_id = ${s}.id AND fpt.page_type = ?)`, params: [f.pageType] })
  return { ...join(parts), needsSessionJoin }
}

/* ── Params ─────────────────────────────────────────────────────────────── */

function clampInt(v: string | null, min: number, max: number, dflt: number): number {
  const n = Number.parseInt(v ?? '', 10)
  if (!Number.isFinite(n)) return dflt
  return Math.max(min, Math.min(max, n))
}

export function parseReportParams(report: string, sp: URLSearchParams): ReportParams {
  return {
    report,
    range: resolveRange(sp),
    filters: parseFilters(sp),
    sp,
    limit: clampInt(sp.get('limit'), 1, 1000, 10),
    offset: clampInt(sp.get('offset'), 0, 1_000_000, 0),
    sort: sp.get('sort') || null,
    dir: sp.get('dir') === 'asc' ? 'asc' : 'desc',
    q: (sp.get('q') || '').trim().slice(0, 200) || null,
  }
}

/* ── Small numeric helpers used by every report ─────────────────────────── */

export const num = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : 0
}

export const safeDiv = (a: number, b: number): number => (b > 0 ? a / b : 0)

/** Escape LIKE wildcards in user text (use with `LIKE ? ESCAPE '\\\\'`). */
export function likeEscape(s: string): string {
  return s.replace(/[\\%_]/g, m => '\\' + m)
}
