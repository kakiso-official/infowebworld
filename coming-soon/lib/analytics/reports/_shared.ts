import { anQuery, anQueryOne } from '../db'
import {
  NONE_VALUE, bucketExpr, bucketKeys, eventConditions, likeEscape, num, pageviewConditions, safeDiv,
  sessionConditions, type SqlPart,
} from '../query'
import {
  CHANNEL_META, EVENTS, PAGE_TYPE_META,
  type BreakdownRow, type Channel, type EventCategory, type EventMeta, type EventSummaryRow,
  type Filters, type KpiSet, type PageRow, type PageType, type ResolvedRange, type SeriesPoint,
  type TimeSeries, type VitalStat, type VitalsSummary, VITAL_THRESHOLDS,
} from '../types'
import { sourceLabel } from '../sources'

/* ═══════════════════════════════════════════════════════════════════════════
   Shared building blocks for the report modules (overview, acquisition,
   pages, audience, performance, errors, events, realtime).

   Why one place:
   - Every "breakdown by X" list must compute visitors / visits / bounce /
     share the same way, or two screens would disagree about one number.
   - Totals for share % come from the SAME query as the rows (GROUP BY ...
     WITH ROLLUP: the super-aggregate row recomputes COUNT(DISTINCT) over the
     whole set), so a share is exact and costs no extra round-trip.
   - Metric definitions follow SPEC section 7 / METRICS in ../types.ts.

   All SQL is parameterized. Identifiers interpolated into SQL (dimension
   expressions, sort columns) are code constants, never request input.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Windows ────────────────────────────────────────────────────────────── */

/** UTC bounds of a period: [startUtc, endUtc). */
export interface Win { startUtc: string; endUtc: string }

export function curWin(range: ResolvedRange): Win {
  return { startUtc: range.startUtc, endUtc: range.endUtc }
}

export function prevWin(range: ResolvedRange): Win | null {
  return range.prev ? { startUtc: range.prev.startUtc, endUtc: range.prev.endUtc } : null
}

/* ── Tracking coverage ──────────────────────────────────────────────────── */

let sinceCache: { at: number; value: string | null } | null = null

/**
 * When tracking started: MIN(an_sessions.started_at), UTC SQL string, null
 * when nothing was recorded yet. An index lookup; cached 10 minutes because
 * it only moves when retention deletes old visits.
 */
export async function trackingSince(): Promise<string | null> {
  if (sinceCache && Date.now() - sinceCache.at < 600_000) return sinceCache.value
  const row = await anQueryOne<{ t: string | null }>('SELECT MIN(started_at) AS t FROM an_sessions')
  const value = row?.t ? String(row.t) : null
  // Don't cache "no data yet": the first visit should show up right away.
  if (value) sinceCache = { at: Date.now(), value }
  return value
}

/**
 * The range used for SQL: the comparison window is dropped when tracking
 * started after it ended (every "previous" number would be a fake 0 and
 * every change a fake +100%). `prevPartial` = tracking started inside the
 * comparison window, so its numbers are incomplete.
 */
export function effectiveRange(range: ResolvedRange, since: string | null): {
  range: ResolvedRange; prevDropped: boolean; prevPartial: boolean
} {
  if (!range.prev) return { range, prevDropped: false, prevPartial: false }
  if (!since || since >= range.prev.endUtc) return { range: { ...range, prev: null }, prevDropped: true, prevPartial: false }
  return { range, prevDropped: false, prevPartial: since > range.prev.startUtc }
}

/* ── SQL helpers ────────────────────────────────────────────────────────── */

/** AND together condition parts (empty / '1=1' parts are dropped). */
export function and(...parts: (SqlPart | null | undefined | false)[]): SqlPart {
  const kept = parts.filter((x): x is SqlPart => !!x && !!x.sql && x.sql !== '1=1')
  return { sql: kept.map(x => `(${x.sql})`).join(' AND ') || '1=1', params: kept.flatMap(x => x.params) }
}

export function cond(sql: string, ...params: unknown[]): SqlPart {
  return { sql, params }
}

/** Filters without page/pageType (page-scoped reports set the page themselves). */
export function withoutPageFilters(f: Filters): Filters {
  const out: Filters = { ...f }
  delete out.page
  delete out.pageType
  return out
}

/** Separator for composite group keys (country + city...). Never appears in our values. */
const SEP = '|~|'

/**
 * SQL for a group key: NULL / '' become NONE_VALUE ('(none)') so the row can
 * be clicked into a `(none)` filter (query.ts turns that into IS NULL).
 * Several expressions make one composite key, split again in JS.
 */
function keyExpr(dims: string[], none: string = NONE_VALUE): string {
  const parts = dims.map(d => `COALESCE(NULLIF(${d}, ''), '${none}')`)
  return parts.length === 1 ? parts[0] : `CONCAT_WS('${SEP}', ${parts.join(', ')})`
}

/**
 * Aggregate SQL: the value of `valueExpr` on the row with the latest
 * `tsExpr` in the group. One pass, no sort: MAX over "timestamp + value"
 * (DATE_FORMAT with %f is a fixed 20 characters).
 */
export function latestSql(valueExpr: string, tsExpr: string): string {
  return `SUBSTRING(MAX(CONCAT(DATE_FORMAT(${tsExpr}, '%Y%m%d%H%i%s%f'), ${valueExpr})), 21)`
}

/* ── Numbers ────────────────────────────────────────────────────────────── */

/** a / b rounded to 4 decimals (0 when b = 0). */
export function ratio(a: number, b: number): number {
  return Math.round(safeDiv(a, b) * 10000) / 10000
}

export function avgMs(totalMs: number, n: number): number {
  return Math.round(safeDiv(totalMs, n))
}

export function str(v: unknown): string | null {
  if (v == null) return null
  const s = String(v)
  return s === '' ? null : s
}

/* ── Labels ─────────────────────────────────────────────────────────────── */

function displayNames(type: 'region' | 'language'): Intl.DisplayNames | null {
  try {
    return new Intl.DisplayNames(['en'], { type })
  } catch {
    return null
  }
}
const REGION_NAMES = displayNames('region')
const LANGUAGE_NAMES = displayNames('language')

export function countryName(cc: string | null | undefined): string {
  if (!cc || cc === NONE_VALUE) return 'Unknown'
  try {
    return REGION_NAMES?.of(cc.toUpperCase()) ?? cc
  } catch {
    return cc
  }
}

export function languageName(code: string | null | undefined): string {
  if (!code || code === NONE_VALUE) return 'Unknown'
  try {
    return LANGUAGE_NAMES?.of(code) ?? code
  } catch {
    return code
  }
}

export function isChannel(v: unknown): v is Channel {
  return typeof v === 'string' && v in CHANNEL_META
}

export function asChannel(v: unknown): Channel {
  return isChannel(v) ? v : 'direct'
}

export function channelLabel(key: string): string {
  if (key === NONE_VALUE) return '(not set)'
  return isChannel(key) ? CHANNEL_META[key].label : key
}

export function isPageType(v: unknown): v is PageType {
  return typeof v === 'string' && v in PAGE_TYPE_META
}

export function asPageType(v: unknown): PageType {
  return isPageType(v) ? v : 'other'
}

export function pageTypeLabel(key: string): string {
  return isPageType(key) ? PAGE_TYPE_META[key].label : key
}

const DEVICE_LABELS: Record<string, string> = { desktop: 'Desktop', mobile: 'Mobile', tablet: 'Tablet' }
export function deviceLabel(key: string): string {
  if (key === NONE_VALUE) return 'Unknown'
  return DEVICE_LABELS[key] ?? key
}

export function sourceName(key: string): string {
  return key === NONE_VALUE ? '(not set)' : sourceLabel(key)
}

/** NULL dimension -> fallback label, else the value itself. */
export function plainLabel(fallback: string): (key: string) => string {
  return key => (key === NONE_VALUE ? fallback : key)
}

/** "my_custom_event" -> "My custom event". */
export function humanize(name: string): string {
  const s = name.replace(/[_-]+/g, ' ').trim()
  return s ? s[0].toUpperCase() + s.slice(1) : name
}

const EVENT_META = EVENTS as Record<string, EventMeta | undefined>
const EVENT_CATEGORIES: EventCategory[] = ['conversion', 'engagement', 'navigation', 'error']

/** Label / category / key flag of an event name (custom names: stored values, humanized label). */
export function eventInfo(name: string, storedCategory?: unknown, storedKey?: unknown): { label: string; category: EventCategory; isKey: boolean } {
  const meta = EVENT_META[name]
  if (meta) return { label: meta.label, category: meta.category, isKey: meta.isKey }
  const category = EVENT_CATEGORIES.includes(storedCategory as EventCategory) ? storedCategory as EventCategory : 'engagement'
  return { label: humanize(name), category, isKey: num(storedKey) === 1 }
}

/** Lead events (METRICS.leads). */
export const LEAD_EVENT_NAMES = ['lead_sent', 'email_click', 'phone_click']

/* ── Session breakdowns ("by channel", "by country"...) ─────────────────── */

const SESSION_AGG = `
  COUNT(DISTINCT s.visitor_id) AS visitors,
  COUNT(*) AS sessions,
  SUM(s.pageviews) AS pageviews,
  SUM(s.is_engaged) AS engaged,
  SUM(s.engaged_ms) AS engaged_ms,
  SUM(s.key_events) AS key_events,
  SUM(s.key_events > 0) AS converted`

interface SessionAggRaw {
  k: string | null
  visitors: number
  sessions: number
  pageviews: number
  engaged: number
  engaged_ms: number
  key_events: number
  converted: number
  [extra: string]: unknown
}

export interface SessionBreakdownOpts {
  /** SQL on alias `s` (NULL allowed); several = composite key, the row key is the LAST part. */
  dims: string[]
  /** Extra conditions on `s`, AND-ed with the filters. */
  where?: SqlPart
  limit: number
  /** Previous-period visitors/sessions for the returned rows. */
  prevWin?: Win | null
  /** extra[name] = the most common value of this SQL expression among the row's visits. */
  dominant?: Record<string, string>
  /** extra[name] = this aggregate SQL expression (computed in the main query). */
  extraAgg?: Record<string, string>
  label: (key: string, parts: string[]) => string
  extra?: (parts: string[]) => Record<string, string | number | null>
}

/**
 * Visits started in `win` (or any visits when win is null - the caller
 * supplies its own time condition in `where`) grouped by a dimension, top
 * `limit` by visitors. share = visitors / distinct visitors of the whole set.
 */
export async function sessionBreakdown(f: Filters, win: Win | null, o: SessionBreakdownOpts): Promise<BreakdownRow[]> {
  const k = keyExpr(o.dims)
  const c = and(sessionConditions(f, win), o.where)
  const extraAgg = Object.entries(o.extraAgg ?? {}).map(([name, sql]) => `, ${sql} AS x_${name}`).join('')
  const raw = await anQuery<SessionAggRaw>(
    `SELECT x.* FROM (
       SELECT ${k} AS k, ${SESSION_AGG}${extraAgg}
         FROM an_sessions s
        WHERE ${c.sql}
        GROUP BY k WITH ROLLUP
     ) x
     ORDER BY x.k IS NULL DESC, x.visitors DESC, x.sessions DESC, x.k
     LIMIT ?`,
    [...c.params, o.limit + 1],
  )
  const totalRow = raw.find(r => r.k == null)
  const data = raw.filter(r => r.k != null).slice(0, o.limit)
  if (!data.length) return []
  const keys = data.map(r => String(r.k))

  const [prev, dom] = await Promise.all([
    o.prevWin ? prevSessionCounts(f, o.prevWin, k, o.where, keys) : null,
    o.dominant ? dominantValues(f, win, k, o.where, keys, o.dominant) : null,
  ])

  const totalVisitors = num(totalRow?.visitors)
  return data.map(r => {
    const full = String(r.k)
    const parts = o.dims.length > 1 ? full.split(SEP) : [full]
    const key = parts[parts.length - 1]
    const extra: Record<string, string | number | null> = { ...(o.extra?.(parts) ?? {}) }
    for (const name of Object.keys(o.extraAgg ?? {})) extra[name] = str(r[`x_${name}`])
    if (dom) Object.assign(extra, dom.get(full) ?? {})
    const row: BreakdownRow = {
      key,
      label: o.label(key, parts),
      ...sessionMetrics(r),
      share: ratio(num(r.visitors), totalVisitors),
    }
    if (o.prevWin !== undefined) row.previous = prev ? prev.get(full) ?? { visitors: 0, sessions: 0 } : null
    if (Object.keys(extra).length) row.extra = extra
    return row
  })
}

/** Visit metrics of one aggregate row (same formulas as the KPIs). */
function sessionMetrics(r: SessionAggRaw): Omit<BreakdownRow, 'key' | 'label' | 'share'> {
  const sessions = num(r.sessions)
  const engagementRate = ratio(num(r.engaged), sessions)
  return {
    visitors: num(r.visitors),
    sessions,
    pageviews: num(r.pageviews),
    engagementRate,
    bounceRate: sessions > 0 ? Math.round((1 - engagementRate) * 10000) / 10000 : 0,
    avgEngagedMs: avgMs(num(r.engaged_ms), sessions),
    keyEvents: num(r.key_events),
    conversionRate: ratio(num(r.converted), sessions),
  }
}

async function prevSessionCounts(
  f: Filters, win: Win, k: string, where: SqlPart | undefined, keys: string[],
): Promise<Map<string, { visitors: number; sessions: number }>> {
  const c = and(sessionConditions(f, win), where, cond(`${k} IN (?)`, keys))
  const rows = await anQuery<{ k: string; visitors: number; sessions: number }>(
    `SELECT ${k} AS k, COUNT(DISTINCT s.visitor_id) AS visitors, COUNT(*) AS sessions
       FROM an_sessions s WHERE ${c.sql} GROUP BY k`,
    c.params,
  )
  return new Map(rows.map(r => [String(r.k), { visitors: num(r.visitors), sessions: num(r.sessions) }]))
}

/** For each key: the most common value of every `exprs` entry among its visits. */
async function dominantValues(
  f: Filters, win: Win | null, k: string, where: SqlPart | undefined, keys: string[], exprs: Record<string, string>,
): Promise<Map<string, Record<string, string | null>>> {
  const names = Object.keys(exprs)
  const cols = names.map((n, i) => `${exprs[n]} AS d${i}`).join(', ')
  const group = names.map((_, i) => `d${i}`).join(', ')
  const c = and(sessionConditions(f, win), where, cond(`${k} IN (?)`, keys))
  const rows = await anQuery<Record<string, unknown>>(
    `SELECT ${k} AS k, ${cols}, COUNT(*) AS c FROM an_sessions s WHERE ${c.sql} GROUP BY k, ${group}`,
    c.params,
  )
  // counts[key][name][value] -> visits; summed across the other columns
  const counts = new Map<string, Map<string, Map<string, number>>>()
  for (const r of rows) {
    const key = String(r.k)
    let byName = counts.get(key)
    if (!byName) counts.set(key, (byName = new Map()))
    names.forEach((n, i) => {
      const v = r[`d${i}`] == null ? '' : String(r[`d${i}`])
      let byVal = byName!.get(n)
      if (!byVal) byName!.set(n, (byVal = new Map()))
      byVal.set(v, (byVal.get(v) ?? 0) + num(r.c))
    })
  }
  const out = new Map<string, Record<string, string | null>>()
  for (const [key, byName] of counts) {
    const rec: Record<string, string | null> = {}
    for (const n of names) {
      let best: string | null = null
      let bestN = -1
      for (const [v, cnt] of byName.get(n) ?? []) if (cnt > bestN) { best = v; bestN = cnt }
      rec[n] = best === '' ? null : best
    }
    out.set(key, rec)
  }
  return out
}

/* ── Pageview breakdowns (previous / next pages, countries of a page) ───── */

export interface PvBreakdownOpts {
  /** SQL on alias `p` (pageview) or `s` (its visit; set joinSessions). */
  dims: string[]
  where?: SqlPart
  joinSessions?: boolean
  limit: number
  /** Key used for NULL values (default '(none)'). */
  noneKey?: string
  label: (key: string, parts: string[]) => string
  extra?: (parts: string[]) => Record<string, string | number | null>
}

/** Pageviews grouped by a dimension, top `limit` by views. share = views / all views of the set. */
export async function pageviewBreakdown(f: Filters, win: Win, o: PvBreakdownOpts): Promise<BreakdownRow[]> {
  return (await pageviewBreakdownWithTotal(f, win, o)).rows
}

/** Same, plus the number of views of the whole set (before the limit). */
export async function pageviewBreakdownWithTotal(f: Filters, win: Win, o: PvBreakdownOpts): Promise<{ rows: BreakdownRow[]; total: number }> {
  const pc = pageviewConditions(f, win)
  const join = pc.needsSessionJoin || o.joinSessions ? 'JOIN an_sessions s ON s.id = p.session_id' : ''
  const k = keyExpr(o.dims, o.noneKey)
  const c = and(pc, o.where)
  const raw = await anQuery<{ k: string | null; visitors: number; sessions: number; views: number }>(
    `SELECT x.* FROM (
       SELECT ${k} AS k,
              COUNT(DISTINCT p.visitor_id) AS visitors,
              COUNT(DISTINCT p.session_id) AS sessions,
              COUNT(*) AS views
         FROM an_pageviews p ${join}
        WHERE ${c.sql}
        GROUP BY k WITH ROLLUP
     ) x
     ORDER BY x.k IS NULL DESC, x.views DESC, x.visitors DESC, x.k
     LIMIT ?`,
    [...c.params, o.limit + 1],
  )
  const total = num(raw.find(r => r.k == null)?.views)
  const rows = raw.filter(r => r.k != null).slice(0, o.limit).map(r => {
    const full = String(r.k)
    const parts = o.dims.length > 1 ? full.split(SEP) : [full]
    const key = parts[parts.length - 1]
    const row: BreakdownRow = {
      key,
      label: o.label(key, parts),
      visitors: num(r.visitors),
      sessions: num(r.sessions),
      pageviews: num(r.views),
      share: ratio(num(r.views), total),
    }
    const extra = o.extra?.(parts)
    if (extra) row.extra = extra
    return row
  })
  return { rows, total }
}

/* ── Event breakdowns (targets, labels, pages of an event) ──────────────── */

export interface EventBreakdownOpts {
  /** SQL on alias `e` (or `s` with joinSessions). */
  dims: string[]
  where?: SqlPart
  joinSessions?: boolean
  limit: number
  label: (key: string, parts: string[]) => string
  /** Extra aggregate columns: extra[name] = SQL aggregate. */
  extraAgg?: Record<string, string>
}

/**
 * Events grouped by a dimension, top `limit` by count. The event count is in
 * extra.count; share = count / all matching events. visitors/sessions are
 * distinct people / visits that fired the event.
 */
export async function eventBreakdown(f: Filters, win: Win, o: EventBreakdownOpts): Promise<BreakdownRow[]> {
  const ec = eventConditions(f, win)
  const join = ec.needsSessionJoin || o.joinSessions ? 'JOIN an_sessions s ON s.id = e.session_id' : ''
  const k = keyExpr(o.dims)
  const c = and(ec, o.where)
  const extraAgg = Object.entries(o.extraAgg ?? {}).map(([name, sql]) => `, ${sql} AS x_${name}`).join('')
  const raw = await anQuery<{ k: string | null; visitors: number; sessions: number; cnt: number; [x: string]: unknown }>(
    `SELECT x.* FROM (
       SELECT ${k} AS k,
              COUNT(DISTINCT e.visitor_id) AS visitors,
              COUNT(DISTINCT e.session_id) AS sessions,
              COUNT(*) AS cnt${extraAgg}
         FROM an_events e ${join}
        WHERE ${c.sql}
        GROUP BY k WITH ROLLUP
     ) x
     ORDER BY x.k IS NULL DESC, x.cnt DESC, x.visitors DESC, x.k
     LIMIT ?`,
    [...c.params, o.limit + 1],
  )
  const total = num(raw.find(r => r.k == null)?.cnt)
  return raw.filter(r => r.k != null).slice(0, o.limit).map(r => {
    const full = String(r.k)
    const parts = o.dims.length > 1 ? full.split(SEP) : [full]
    const key = parts[parts.length - 1]
    const extra: Record<string, string | number | null> = { count: num(r.cnt) }
    for (const name of Object.keys(o.extraAgg ?? {})) {
      const v = r[`x_${name}`]
      extra[name] = typeof v === 'number' ? v : str(v)
    }
    return {
      key,
      label: o.label(key, parts),
      visitors: num(r.visitors),
      sessions: num(r.sessions),
      share: ratio(num(r.cnt), total),
      extra,
    }
  })
}

/* ── Event summaries (EventSummaryRow) ──────────────────────────────────── */

interface EventAggRaw { k: string; cnt: number; visitors: number; sess: number; cat: string | null; isk: number }

async function eventCounts(f: Filters, win: Win, where?: SqlPart): Promise<EventAggRaw[]> {
  const ec = eventConditions(f, win)
  const join = ec.needsSessionJoin ? 'JOIN an_sessions s ON s.id = e.session_id' : ''
  const c = and(ec, where)
  return anQuery<EventAggRaw>(
    `SELECT e.name AS k, COUNT(*) AS cnt,
            COUNT(DISTINCT e.visitor_id) AS visitors,
            COUNT(DISTINCT e.session_id) AS sess,
            MAX(e.category) AS cat, MAX(e.is_key) AS isk
       FROM an_events e ${join}
      WHERE ${c.sql}
      GROUP BY e.name
      ORDER BY cnt DESC
      LIMIT 500`,
    c.params,
  )
}

/**
 * Events grouped by name for the period, with the previous period's count.
 * Names that only happened in the previous period are kept (count 0) so a
 * drop to zero is visible.
 */
export async function eventSummary(f: Filters, cur: Win, prev: Win | null, where?: SqlPart): Promise<EventSummaryRow[]> {
  const [c, pr] = await Promise.all([eventCounts(f, cur, where), prev ? eventCounts(f, prev, where) : null])
  const prevMap = new Map((pr ?? []).map(r => [String(r.k), num(r.cnt)]))
  const rows: EventSummaryRow[] = c.map(r => {
    const name = String(r.k)
    const info = eventInfo(name, r.cat, r.isk)
    return {
      name, label: info.label, category: info.category, isKey: info.isKey,
      count: num(r.cnt), visitors: num(r.visitors), sessions: num(r.sess),
      previousCount: pr ? prevMap.get(name) ?? 0 : null,
    }
  })
  const seen = new Set(rows.map(r => r.name))
  for (const r of pr ?? []) {
    const name = String(r.k)
    if (seen.has(name)) continue
    const info = eventInfo(name, r.cat, r.isk)
    rows.push({
      name, label: info.label, category: info.category, isKey: info.isKey,
      count: 0, visitors: 0, sessions: 0, previousCount: num(r.cnt),
    })
  }
  return rows.sort((a, b) => b.count - a.count || (b.previousCount ?? 0) - (a.previousCount ?? 0) || a.name.localeCompare(b.name))
}

/* ── Page rows (PageRow) ────────────────────────────────────────────────── */

/**
 * Page metrics over pageviews in the window (SPEC 7 "Page metrics").
 * bounce needs the visit's is_engaged only for entrance views, so without
 * visit filters the visit is LEFT JOINed for seq = 1 rows only.
 */
export const PAGE_AGG = `
  COUNT(*) AS views,
  COUNT(DISTINCT p.visitor_id) AS visitors,
  SUM(p.seq = 1) AS entries,
  SUM(p.is_exit) AS exits,
  SUM(p.seq = 1 AND s.is_engaged = 0) AS bounced,
  SUM(p.is_exit) / COUNT(*) AS exit_rate,
  SUM(p.seq = 1 AND s.is_engaged = 0) / NULLIF(SUM(p.seq = 1), 0) AS bounce_rate,
  AVG(p.engaged_ms) AS avg_eng,
  AVG(p.scroll_pct) AS avg_scroll`

export function pageJoin(needsSessionJoin: boolean): string {
  return needsSessionJoin
    ? 'JOIN an_sessions s ON s.id = p.session_id'
    : 'LEFT JOIN an_sessions s ON s.id = p.session_id AND p.seq = 1'
}

export interface PageAggRaw {
  k: string
  views: number
  visitors: number
  entries: number
  exits: number
  bounced: number
  avg_eng: number | null
  avg_scroll: number | null
  title?: string | null
  ptype?: string | null
}

export function toPageRow(r: PageAggRaw, totalViews: number, previousViews?: number | null): PageRow {
  const views = num(r.views)
  const entries = num(r.entries)
  const exits = num(r.exits)
  const row: PageRow = {
    path: String(r.k),
    title: str(r.title),
    pageType: asPageType(r.ptype),
    views,
    visitors: num(r.visitors),
    entries,
    exits,
    exitRate: ratio(exits, views),
    bounceRate: entries > 0 ? ratio(num(r.bounced), entries) : null,
    avgEngagedMs: Math.round(num(r.avg_eng)),
    avgScrollPct: Math.round(num(r.avg_scroll) * 10) / 10,
    share: ratio(views, totalViews),
  }
  if (previousViews !== undefined) row.previousViews = previousViews
  return row
}

/** Sort keys accepted from the UI -> SQL (select aliases only). */
const PAGE_SORT: Record<string, string> = {
  views: 'views', visitors: 'visitors', entries: 'entries', exits: 'exits',
  exitRate: 'exit_rate', bounceRate: 'bounce_rate', avgEngagedMs: 'avg_eng',
  avgScrollPct: 'avg_scroll', path: 'k', title: 'title',
}

export type PageGroup = 'path' | 'entry' | 'exit'

export interface PageRowsOpts {
  group: PageGroup
  /** Path contains (case-insensitive). */
  q?: string | null
  sort?: string | null
  dir?: 'asc' | 'desc'
  limit: number
  offset?: number
  where?: SqlPart
}

/**
 * Page rows grouped by path. group=entry keeps pages that were landing pages
 * (sorted by entrances), group=exit pages where visits ended (by exits).
 */
export async function pageRowsRaw(f: Filters, win: Win, o: PageRowsOpts): Promise<PageAggRaw[]> {
  const pc = pageviewConditions(f, win)
  const c = and(pc, o.where, o.q ? cond(`p.path LIKE ? ESCAPE '\\\\'`, `%${likeEscape(o.q)}%`) : null)
  const dflt = o.group === 'entry' ? 'entries' : o.group === 'exit' ? 'exits' : 'views'
  const sortCol = PAGE_SORT[o.sort ?? ''] ?? dflt
  const dir = o.dir === 'asc' ? 'ASC' : 'DESC'
  // Rows without entrances have no bounce rate: keep them last in both directions.
  const nullsLast = sortCol === 'bounce_rate' ? 'bounce_rate IS NULL, ' : ''
  const having = o.group === 'entry' ? 'HAVING entries > 0' : o.group === 'exit' ? 'HAVING exits > 0' : ''
  return anQuery<PageAggRaw>(
    `SELECT p.path AS k, ${PAGE_AGG},
            ${latestSql(`NULLIF(p.title, '')`, 'p.ts')} AS title,
            ${latestSql('p.page_type', 'p.ts')} AS ptype
       FROM an_pageviews p ${pageJoin(pc.needsSessionJoin)}
      WHERE ${c.sql}
      GROUP BY p.path
      ${having}
      ORDER BY ${nullsLast}${sortCol} ${dir}${sortCol === 'views' ? '' : ', views DESC'}, k ASC
      LIMIT ? OFFSET ?`,
    [...c.params, o.limit, o.offset ?? 0],
  )
}

/** Views per path in a window, for the "previous period" column. */
export async function viewsByPath(f: Filters, win: Win, paths: string[]): Promise<Map<string, number>> {
  if (!paths.length) return new Map()
  const pc = pageviewConditions(f, win)
  const c = and(pc, cond('p.path IN (?)', paths))
  const rows = await anQuery<{ k: string; v: number }>(
    `SELECT p.path AS k, COUNT(*) AS v
       FROM an_pageviews p ${pc.needsSessionJoin ? 'JOIN an_sessions s ON s.id = p.session_id' : ''}
      WHERE ${c.sql}
      GROUP BY p.path`,
    c.params,
  )
  return new Map(rows.map(r => [String(r.k), num(r.v)]))
}

/* ── KPIs + main series ─────────────────────────────────────────────────── */

/** Raw period totals (also used by the overview insights). */
export interface PeriodTotals {
  visitors: number
  newVisitors: number
  sessions: number
  sessionPageviews: number
  engaged: number
  engagedMs: number
  durationMs: number
  /** key events counted on visits (an_sessions.key_events) */
  sessionKeyEvents: number
  converted: number
  pageviews: number
  keyEvents: number
  signups: number
  listings: number
  leads: number
  websiteClicks: number
}

const EMPTY_TOTALS: PeriodTotals = {
  visitors: 0, newVisitors: 0, sessions: 0, sessionPageviews: 0, engaged: 0, engagedMs: 0,
  durationMs: 0, sessionKeyEvents: 0, converted: 0, pageviews: 0, keyEvents: 0, signups: 0,
  listings: 0, leads: 0, websiteClicks: 0,
}

interface SessBucketRaw {
  b: string | null; visitors: number; new_visitors: number; sessions: number; pageviews: number
  engaged: number; engaged_ms: number; duration_ms: number; key_events: number; converted: number
}

/**
 * Totals + per-bucket points for one period, in three queries:
 *  - visits per bucket WITH ROLLUP (the rollup row gives exact distinct
 *    visitor totals - distinct counts can't be summed across buckets),
 *  - pageviews per bucket, key events per bucket (plain sums add up).
 */
export async function periodHeadline(f: Filters, range: ResolvedRange, which: 'cur' | 'prev'): Promise<{ totals: PeriodTotals; points: SeriesPoint[] }> {
  const win = which === 'cur' ? curWin(range) : prevWin(range)
  if (!win) return { totals: { ...EMPTY_TOTALS }, points: [] }

  const sb = bucketExpr('s.started_at', range, which)
  const sc = sessionConditions(f, win)
  const pb = bucketExpr('p.ts', range, which)
  const pc = pageviewConditions(f, win)
  const eb = bucketExpr('e.ts', range, which)
  const ecBase = eventConditions(f, win)
  const ec = and(ecBase, cond('e.is_key = 1'))

  const [sRows, pRows, eRows] = await Promise.all([
    anQuery<SessBucketRaw>(
      `SELECT ${sb.sql} AS b,
              COUNT(DISTINCT s.visitor_id) AS visitors,
              COUNT(DISTINCT IF(s.is_new = 1, s.visitor_id, NULL)) AS new_visitors,
              COUNT(*) AS sessions,
              SUM(s.pageviews) AS pageviews,
              SUM(s.is_engaged) AS engaged,
              SUM(s.engaged_ms) AS engaged_ms,
              SUM(s.duration_ms) AS duration_ms,
              SUM(s.key_events) AS key_events,
              SUM(s.key_events > 0) AS converted
         FROM an_sessions s
        WHERE ${sc.sql}
        GROUP BY b WITH ROLLUP`,
      [...sb.params, ...sc.params],
    ),
    anQuery<{ b: string; views: number }>(
      `SELECT ${pb.sql} AS b, COUNT(*) AS views
         FROM an_pageviews p ${pc.needsSessionJoin ? 'JOIN an_sessions s ON s.id = p.session_id' : ''}
        WHERE ${pc.sql}
        GROUP BY b`,
      [...pb.params, ...pc.params],
    ),
    // Every event counted below is a key event, so is_key = 1 narrows the scan.
    anQuery<{ b: string; key_events: number; signups: number; listings: number; leads: number; website: number }>(
      `SELECT ${eb.sql} AS b,
              COUNT(*) AS key_events,
              SUM(e.name = 'signup_completed') AS signups,
              SUM(e.name = 'listing_submitted') AS listings,
              SUM(e.name IN (?)) AS leads,
              SUM(e.name = 'website_click') AS website
         FROM an_events e ${ecBase.needsSessionJoin ? 'JOIN an_sessions s ON s.id = e.session_id' : ''}
        WHERE ${ec.sql}
        GROUP BY b`,
      [...eb.params, LEAD_EVENT_NAMES, ...ec.params],
    ),
  ])

  const totals: PeriodTotals = { ...EMPTY_TOTALS }
  const roll = sRows.find(r => r.b == null)
  if (roll) {
    totals.visitors = num(roll.visitors)
    totals.newVisitors = num(roll.new_visitors)
    totals.sessions = num(roll.sessions)
    totals.sessionPageviews = num(roll.pageviews)
    totals.engaged = num(roll.engaged)
    totals.engagedMs = num(roll.engaged_ms)
    totals.durationMs = num(roll.duration_ms)
    totals.sessionKeyEvents = num(roll.key_events)
    totals.converted = num(roll.converted)
  }
  for (const r of pRows) totals.pageviews += num(r.views)
  for (const r of eRows) {
    totals.keyEvents += num(r.key_events)
    totals.signups += num(r.signups)
    totals.listings += num(r.listings)
    totals.leads += num(r.leads)
    totals.websiteClicks += num(r.website)
  }

  const sMap = new Map(sRows.filter(r => r.b != null).map(r => [String(r.b), r]))
  const pMap = new Map(pRows.map(r => [String(r.b), num(r.views)]))
  const eMap = new Map(eRows.map(r => [String(r.b), r]))
  const points = bucketKeys(range, which).map(({ t, label }): SeriesPoint => {
    const s = sMap.get(t)
    const e = eMap.get(t)
    const sessions = num(s?.sessions)
    return {
      t,
      label,
      visitors: num(s?.visitors),
      sessions,
      pageviews: pMap.get(t) ?? 0,
      bounceRate: sessions > 0 ? Math.round((1 - num(s?.engaged) / sessions) * 10000) / 10000 : 0,
      avgEngagedMs: avgMs(num(s?.engaged_ms), sessions),
      keyEvents: num(e?.key_events),
      signups: num(e?.signups),
    }
  })
  return { totals, points }
}

/** The KPI numbers of one period (SPEC 7 metric definitions). */
export function kpiValues(t: PeriodTotals): Record<keyof KpiSet, number> {
  const engagementRate = ratio(t.engaged, t.sessions)
  return {
    visitors: t.visitors,
    newVisitors: t.newVisitors,
    sessions: t.sessions,
    pageviews: t.pageviews,
    pagesPerSession: Math.round(safeDiv(t.sessionPageviews, t.sessions) * 100) / 100,
    engagementRate,
    bounceRate: t.sessions > 0 ? Math.round((1 - engagementRate) * 10000) / 10000 : 0,
    avgEngagedMs: avgMs(t.engagedMs, t.sessions),
    avgDurationMs: avgMs(t.durationMs, t.sessions),
    keyEvents: t.keyEvents,
    conversionRate: ratio(t.converted, t.sessions),
    signups: t.signups,
    listingsSubmitted: t.listings,
    leads: t.leads,
    websiteClicks: t.websiteClicks,
  }
}

export function buildKpis(cur: PeriodTotals, prev: PeriodTotals | null): KpiSet {
  const c = kpiValues(cur)
  const p = prev ? kpiValues(prev) : null
  const out = {} as KpiSet
  for (const k of Object.keys(c) as (keyof KpiSet)[]) out[k] = { value: c[k], previous: p ? p[k] : null }
  return out
}

/**
 * KPIs + main chart for the range. The previous series is aligned to the
 * current one by index (same length; padded with empty points when the
 * comparison period has fewer buckets, e.g. a shorter month).
 */
export async function headline(f: Filters, range: ResolvedRange): Promise<{
  kpis: KpiSet; series: TimeSeries; cur: PeriodTotals; prev: PeriodTotals | null
}> {
  const [cur, prev] = await Promise.all([
    periodHeadline(f, range, 'cur'),
    range.prev ? periodHeadline(f, range, 'prev') : null,
  ])
  let prevPoints: SeriesPoint[] | null = null
  if (prev) {
    prevPoints = cur.points.map((_, i) => prev.points[i] ?? {
      t: '', label: '', visitors: 0, sessions: 0, pageviews: 0, bounceRate: 0, avgEngagedMs: 0, keyEvents: 0, signups: 0,
    })
  }
  return {
    kpis: buildKpis(cur.totals, prev?.totals ?? null),
    series: { bucket: range.bucket, points: cur.points, previous: prevPoints },
    cur: cur.totals,
    prev: prev?.totals ?? null,
  }
}

/* ── Web Vitals ─────────────────────────────────────────────────────────── */

/** Newest pageviews with any vital, per query (SPEC: cap 50 000 per metric). */
export const VITALS_ROW_CAP = 50_000

export const VITALS_ANY_SQL =
  '(p.lcp_ms IS NOT NULL OR p.inp_ms IS NOT NULL OR p.cls IS NOT NULL OR p.fcp_ms IS NOT NULL OR p.ttfb_ms IS NOT NULL)'

export interface VitalSample {
  lcp_ms: number | null
  inp_ms: number | null
  cls: number | null
  fcp_ms: number | null
  ttfb_ms: number | null
}

export type VitalKey = 'lcp' | 'inp' | 'cls' | 'fcp' | 'ttfb'
const VITAL_COL: Record<VitalKey, keyof VitalSample> = { lcp: 'lcp_ms', inp: 'inp_ms', cls: 'cls', fcp: 'fcp_ms', ttfb: 'ttfb_ms' }

/** 75th percentile, nearest-rank (what CrUX / PageSpeed report). */
export function p75(values: number[]): number | null {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.max(0, Math.ceil(sorted.length * 0.75) - 1)]
}

export function vitalValues(rows: VitalSample[], key: VitalKey): number[] {
  const col = VITAL_COL[key]
  const out: number[] = []
  for (const r of rows) {
    const v = r[col]
    if (v != null && Number.isFinite(Number(v))) out.push(Number(v))
  }
  return out
}

/**
 * p75 + the share (0..1) of samples rated good / needs improvement / poor,
 * using Google's thresholds (good <= good line, poor > poor line).
 */
export function vitalStat(values: number[], key: VitalKey): VitalStat | null {
  if (!values.length) return null
  const th = VITAL_THRESHOLDS[key]
  let good = 0
  let poor = 0
  for (const v of values) {
    if (v <= th.good) good++
    else if (v > th.poor) poor++
  }
  const n = values.length
  const p = p75(values) ?? 0
  return {
    p75: key === 'cls' ? Math.round(p * 1000) / 1000 : Math.round(p),
    good: ratio(good, n),
    needsImprovement: ratio(n - good - poor, n),
    poor: ratio(poor, n),
  }
}

export function summarizeVitals(rows: VitalSample[]): VitalsSummary {
  return {
    samples: rows.length,
    lcp: vitalStat(vitalValues(rows, 'lcp'), 'lcp'),
    inp: vitalStat(vitalValues(rows, 'inp'), 'inp'),
    cls: vitalStat(vitalValues(rows, 'cls'), 'cls'),
    fcp: vitalStat(vitalValues(rows, 'fcp'), 'fcp'),
    ttfb: vitalStat(vitalValues(rows, 'ttfb'), 'ttfb'),
  }
}
