import { anQuery, anQueryOne, sqlUtcToIso } from '../db'
import { likeEscape, num, sessionConditions, windowOf, type ReportParams } from '../query'
import type {
  BreakdownRow, SessionDetailReport, SessionsReport, TimelineItem, VisitorReport,
} from '../types'
import {
  EVENT_ITEM_COLS, SESSION_DETAIL_COLS, SESSION_SUMMARY_COLS, SESSION_USER_JOIN, VISITOR_COLS,
  ReportNotFoundError, asPageType, loadUsers, parseId, toEventItem, toSessionSummary,
  toVisitorSummary, visitorTotals,
} from './_people'

/* ═══════════════════════════════════════════════════════════════════════════
   Visits explorer (sessions), one visit's timeline (session) and one
   visitor's profile (visitor).

   The list honours the date range + filters; the two detail reports show a
   visit/visitor in full regardless of the range (a timeline cut at the
   range edge would be misleading).
   ═══════════════════════════════════════════════════════════════════════════ */

export { toSessionSummary } from './_people'

/** Whitelisted sort columns (never interpolate the raw ?sort= value). */
const SORT_COLUMNS: Record<string, string> = {
  started_at: 's.started_at',
  duration: 's.duration_ms',
  pageviews: 's.pageviews',
  engaged: 's.engaged_ms',
  key_events: 's.key_events',
}

/* ── Visits list ────────────────────────────────────────────────────────── */

export async function sessionsReport(p: ReportParams): Promise<SessionsReport> {
  const cond = sessionConditions(p.filters, windowOf(p.range, 'cur'))
  let where = cond.sql
  const params = [...cond.params]
  if (p.q) {
    const like = `%${likeEscape(p.q)}%`
    where += ` AND (s.entry_path LIKE ? ESCAPE '\\\\' OR s.exit_path LIKE ? ESCAPE '\\\\')`
    params.push(like, like)
  }
  const sortCol = SORT_COLUMNS[p.sort ?? ''] ?? SORT_COLUMNS.started_at
  const dir = p.dir === 'asc' ? 'ASC' : 'DESC'

  const [rows, count] = await Promise.all([
    anQuery(
      `SELECT ${SESSION_SUMMARY_COLS}
         FROM an_sessions s ${SESSION_USER_JOIN}
        WHERE ${where}
        ORDER BY ${sortCol} ${dir}, s.id ${dir}
        LIMIT ? OFFSET ?`,
      [...params, p.limit, p.offset],
    ),
    anQueryOne<{ n: number }>(`SELECT COUNT(*) AS n FROM an_sessions s WHERE ${where}`, params),
  ])

  const now = Date.now()
  return { range: p.range, total: num(count?.n), rows: rows.map(r => toSessionSummary(r, now)) }
}

/* ── One visit ──────────────────────────────────────────────────────────── */

type PageviewItem = Extract<TimelineItem, { kind: 'pageview' }>
type EventItem = Extract<TimelineItem, { kind: 'event' }>

/** Events of one visit are capped so a runaway page can't produce a huge timeline. */
const MAX_TIMELINE_EVENTS = 2000

export async function sessionReport(p: ReportParams): Promise<SessionDetailReport> {
  const id = parseId(p.sp.get('id'), 'Visit')
  const row = await anQueryOne(
    `SELECT ${SESSION_DETAIL_COLS} FROM an_sessions s ${SESSION_USER_JOIN} WHERE s.id = ?`,
    [id],
  )
  if (!row) throw new ReportNotFoundError('Visit')
  const visitorId = num(row.visitor_id)

  const [pvRows, evRows, visitor, totals, others] = await Promise.all([
    anQuery(
      `SELECT id, seq, ts, path, query, title, page_type, engaged_ms, scroll_pct, status, nav_type,
              lcp_ms, inp_ms, cls
         FROM an_pageviews WHERE session_id = ? ORDER BY seq, id`,
      [id],
    ),
    anQuery(
      `SELECT ${EVENT_ITEM_COLS} FROM an_events e WHERE e.session_id = ? ORDER BY e.ts, e.id LIMIT ?`,
      [id, MAX_TIMELINE_EVENTS],
    ),
    anQueryOne(`SELECT ${VISITOR_COLS} FROM an_visitors v WHERE v.id = ?`, [visitorId]),
    visitorTotals(visitorId),
    anQuery(
      `SELECT ${SESSION_SUMMARY_COLS}
         FROM an_sessions s ${SESSION_USER_JOIN}
        WHERE s.visitor_id = ? AND s.id <> ?
        ORDER BY s.started_at DESC, s.id DESC LIMIT 20`,
      [visitorId, id],
    ),
  ])

  const now = Date.now()
  const summary = toSessionSummary(row, now)
  const userId = (visitor?.user_id ?? row.user_id) as number | null
  const users = await loadUsers(userId == null ? [] : [num(userId)])

  const screen = row.screen_w != null && row.screen_h != null ? `${num(row.screen_w)}x${num(row.screen_h)}` : null
  const str = (v: unknown) => (v == null || v === '' ? null : String(v))

  /* A visitor row always exists for a session (sessions reference it), but
     fall back to a minimal one built from the session rather than failing. */
  const visitorRow = visitor ?? {
    id: visitorId, user_id: row.user_id, first_seen_at: row.started_at, last_seen_at: row.last_seen_at,
    sessions: totals.sessions, pageviews: totals.pageviews, events: totals.events, engaged_ms: totals.engagedMs,
    first_channel: null, first_source: null, first_medium: null, first_campaign: null,
    first_referrer: null, first_landing: null, country: row.country, device_type: row.device_type, signed_up_at: null,
  }

  return {
    session: {
      ...summary,
      referrerHost: str(row.referrer_host),
      medium: str(row.medium),
      term: str(row.term),
      content: str(row.content),
      clickId: str(row.click_id),
      screen,
      language: str(row.language),
      timezone: str(row.timezone),
      osVersion: str(row.os_version),
      browserVersion: str(row.browser_version),
    },
    items: mergeTimeline(pvRows.map(toPageviewItem), evRows),
    visitor: toVisitorSummary(visitorRow, totals, userId == null ? null : users.get(num(userId)) ?? null),
    otherSessions: others.map(r => toSessionSummary(r, now)),
  }
}

function toPageviewItem(r: Record<string, unknown>): PageviewItem {
  const lcp = r.lcp_ms == null ? null : num(r.lcp_ms)
  const inp = r.inp_ms == null ? null : num(r.inp_ms)
  const cls = r.cls == null ? null : num(r.cls)
  return {
    kind: 'pageview',
    id: num(r.id),
    ts: sqlUtcToIso(r.ts as string) ?? '',
    seq: num(r.seq),
    path: String(r.path ?? ''),
    query: r.query == null || r.query === '' ? null : String(r.query),
    title: r.title == null || r.title === '' ? null : String(r.title),
    pageType: asPageType(r.page_type),
    engagedMs: num(r.engaged_ms),
    scrollPct: num(r.scroll_pct),
    status: num(r.status) || 200,
    navType: r.nav_type == null ? null : String(r.nav_type),
    vitals: lcp == null && inp == null && cls == null ? null : { lcp, inp, cls },
  }
}

/**
 * Pageviews + events, oldest first. An event that names its pageview
 * (pageview_id) is placed right after that pageview, even when its
 * timestamp is a little earlier (client clocks drift). Events without one
 * (server-side signups, logins...) go after the latest pageview that
 * started at or before them; events before the first pageview lead.
 */
function mergeTimeline(pageviews: PageviewItem[], evRows: Record<string, unknown>[]): TimelineItem[] {
  const byPv = new Map<number, EventItem[]>()
  const leading: EventItem[] = []
  const pvIds = new Set(pageviews.map(pv => pv.id))
  const pvTimes = pageviews.map(pv => Date.parse(pv.ts))

  for (const r of evRows) {
    const ev = toEventItem(r)
    let owner: number | null = r.pageview_id != null && pvIds.has(num(r.pageview_id)) ? num(r.pageview_id) : null
    if (owner == null) {
      const t = Date.parse(ev.ts)
      for (let i = pageviews.length - 1; i >= 0; i--) {
        if (pvTimes[i] <= t) { owner = pageviews[i].id; break }
      }
    }
    if (owner == null) leading.push(ev)
    else {
      const list = byPv.get(owner)
      if (list) list.push(ev)
      else byPv.set(owner, [ev])
    }
  }

  const byTime = (a: EventItem, b: EventItem) => Date.parse(a.ts) - Date.parse(b.ts) || a.id - b.id
  const out: TimelineItem[] = leading.sort(byTime)
  for (const pv of pageviews) {
    out.push(pv)
    const evs = byPv.get(pv.id)
    if (evs) out.push(...evs.sort(byTime))
  }
  return out
}

/* ── One visitor ────────────────────────────────────────────────────────── */

export async function visitorReport(p: ReportParams): Promise<VisitorReport> {
  const id = parseId(p.sp.get('id'), 'Visitor')
  const v = await anQueryOne(`SELECT ${VISITOR_COLS} FROM an_visitors v WHERE v.id = ?`, [id])
  if (!v) throw new ReportNotFoundError('Visitor')

  const [totals, sessionRows, pageRows, eventRows, users] = await Promise.all([
    visitorTotals(id),
    anQuery(
      `SELECT ${SESSION_SUMMARY_COLS}
         FROM an_sessions s ${SESSION_USER_JOIN}
        WHERE s.visitor_id = ?
        ORDER BY s.started_at DESC, s.id DESC LIMIT 100`,
      [id],
    ),
    /* an_pageviews has no visitor index; going through the visitor's
       sessions uses idx_an_sessions_visitor + idx_an_pv_session. */
    anQuery(
      `SELECT p.path, COUNT(*) AS views, COUNT(DISTINCT p.session_id) AS sessions,
              COALESCE(AVG(p.engaged_ms), 0) AS avg_engaged,
              MAX(p.ts) AS last_ts,
              SUBSTRING_INDEX(GROUP_CONCAT(NULLIF(p.title, '') ORDER BY p.ts DESC SEPARATOR '\\n'), '\\n', 1) AS title,
              MAX(p.page_type) AS page_type
         FROM an_sessions s
         JOIN an_pageviews p ON p.session_id = s.id
        WHERE s.visitor_id = ?
        GROUP BY p.path
        ORDER BY views DESC, last_ts DESC
        LIMIT 25`,
      [id],
    ),
    anQuery(
      `SELECT ${EVENT_ITEM_COLS} FROM an_events e
        WHERE e.visitor_id = ? AND e.is_key = 1
        ORDER BY e.ts DESC, e.id DESC LIMIT 100`,
      [id],
    ),
    loadUsers(v.user_id == null ? [] : [num(v.user_id)]),
  ])

  const totalViews = pageRows.reduce((acc, r) => acc + num(r.views), 0)
  const topPages: BreakdownRow[] = pageRows.map(r => {
    const path = String(r.path ?? '')
    const title = r.title == null || r.title === '' ? null : String(r.title)
    return {
      key: path,
      label: title ?? path,
      visitors: 1,
      sessions: num(r.sessions),
      pageviews: num(r.views),
      avgEngagedMs: Math.round(num(r.avg_engaged)),
      share: totalViews > 0 ? num(r.views) / totalViews : 0,
      extra: { title, pageType: asPageType(r.page_type), lastSeen: sqlUtcToIso(r.last_ts as string) },
    }
  })

  const now = Date.now()
  return {
    visitor: toVisitorSummary(v, totals, v.user_id == null ? null : users.get(num(v.user_id)) ?? null),
    sessions: sessionRows.map(r => toSessionSummary(r, now)),
    topPages,
    keyEvents: eventRows.map(toEventItem),
  }
}
