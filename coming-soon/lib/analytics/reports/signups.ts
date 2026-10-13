import { anQuery, anQueryOne, mysqlServerOffsetMinutes, sqlUtcToMs, utcToServerLocal } from '../db'
import { addDays, bucketKeys, localDate, num, tzOffsetMinutes, type ReportParams } from '../query'
import type { BreakdownRow, ResolvedRange, SignupRow, SignupsReport } from '../types'
import {
  VISITOR_COLS, asChannel, channelLabel, firstTouchOf, parseProps, serverLocalToMs,
} from './_people'

/* ═══════════════════════════════════════════════════════════════════════════
   Signups report: business accounts created in the range and what we know
   about how each one found us.

   - total = every business_users row created in the range. created_at is on
     MySQL's own clock (NOW()), not UTC, so the UTC range is converted with
     utcToServerLocal() before comparing.
   - A signup is "attributed" when we can tie it to a tracked browser: the
     signup_completed event's visitor, or an an_visitors row linked to the
     account (user_id). Accounts created before tracking started, or by a
     browser that blocks the tracker, stay unattributed.
   - "Before signup" counts include the visit in which the account was made.
   - Date-range filters (channel, country...) describe visits, not accounts,
     so this report ignores them.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Accounts per report; far above today's volume, keeps one response bounded. */
const MAX_ROWS = 5000
const DAY_MS = 86_400_000

/** Bucket key (same format as bucketKeys/bucketExpr) for an instant, in range.tz. */
function bucketKeyOf(ms: number, range: ResolvedRange): string {
  const date = localDate(ms, range.tz)
  switch (range.bucket) {
    case 'hour': {
      const local = new Date(ms + tzOffsetMinutes(ms, range.tz) * 60_000)
      return `${date} ${String(local.getUTCHours()).padStart(2, '0')}:00`
    }
    case 'day': return date
    case 'week': {
      const [y, m, d] = date.split('-').map(Number)
      const wd = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7 // 0 = Monday
      return addDays(date, -wd)
    }
    case 'month': return `${date.slice(0, 7)}-01`
  }
}

interface Account { id: number; email: string; name: string | null; provider: string | null; createdMs: number; listings: number }
interface SignupEvent { visitorId: number | null; sessionId: number | null; ms: number; method: string | null }
interface VisitSlice { id: number; startedMs: number; lastMs: number; pageviews: number }

export async function signupsReport(p: ReportParams): Promise<SignupsReport> {
  const range = p.range
  const [startLocal, endLocal, offset] = await Promise.all([
    utcToServerLocal(range.startUtc),
    utcToServerLocal(range.endUtc),
    mysqlServerOffsetMinutes(),
  ])

  const [userRows, countRow] = await Promise.all([
    anQuery(
      `SELECT u.id, u.email, u.name, u.provider, u.created_at,
              (SELECT COUNT(*) FROM submissions sb WHERE sb.user_id = u.id) AS listings
         FROM business_users u
        WHERE u.created_at >= ? AND u.created_at < ?
        ORDER BY u.created_at DESC, u.id DESC
        LIMIT ?`,
      [startLocal, endLocal, MAX_ROWS],
    ),
    anQueryOne<{ n: number }>(
      'SELECT COUNT(*) AS n FROM business_users WHERE created_at >= ? AND created_at < ?',
      [startLocal, endLocal],
    ),
  ])

  const accounts: Account[] = userRows.map(r => ({
    id: num(r.id),
    email: String(r.email ?? ''),
    name: r.name == null || r.name === '' ? null : String(r.name),
    provider: r.provider == null || r.provider === '' ? null : String(r.provider),
    createdMs: serverLocalToMs(r.created_at, offset) ?? 0,
    listings: num(r.listings),
  }))
  const userIds = accounts.map(a => a.id)

  /* 1. Signup events (earliest per account) and visitors linked to the accounts. */
  const [eventRows, linkedVisitors] = userIds.length === 0 ? [[], []] : await Promise.all([
    anQuery(
      `SELECT e.user_id, e.visitor_id, e.session_id, e.ts, e.props
         FROM an_events e
        WHERE e.name = 'signup_completed' AND e.user_id IN (?)
        ORDER BY e.ts ASC, e.id ASC`,
      [userIds],
    ),
    anQuery(`SELECT ${VISITOR_COLS} FROM an_visitors v WHERE v.user_id IN (?)`, [userIds]),
  ])

  const events = new Map<number, SignupEvent>()
  for (const r of eventRows) {
    const uid = num(r.user_id)
    if (events.has(uid)) continue
    const props = parseProps(r.props)
    events.set(uid, {
      visitorId: r.visitor_id == null ? null : num(r.visitor_id),
      sessionId: r.session_id == null ? null : num(r.session_id),
      ms: sqlUtcToMs(r.ts as string) ?? 0,
      method: typeof props?.method === 'string' && props.method ? props.method : null,
    })
  }

  // Visitors named by events but not linked by user_id (e.g. linked later on another browser).
  const visitors = new Map<number, Record<string, unknown>>()
  for (const v of linkedVisitors) visitors.set(num(v.id), v)
  const missingIds = [...new Set([...events.values()].map(e => e.visitorId).filter((id): id is number => id != null && !visitors.has(id)))]
  const [extraVisitors, signupSessions] = await Promise.all([
    missingIds.length ? anQuery(`SELECT ${VISITOR_COLS} FROM an_visitors v WHERE v.id IN (?)`, [missingIds]) : Promise.resolve([]),
    (() => {
      const ids = [...new Set([...events.values()].map(e => e.sessionId).filter((id): id is number => id != null))]
      return ids.length
        ? anQuery('SELECT id, channel, source, entry_path FROM an_sessions WHERE id IN (?)', [ids])
        : Promise.resolve([] as Record<string, unknown>[])
    })(),
  ])
  for (const v of extraVisitors) visitors.set(num(v.id), v)
  const sessionById = new Map(signupSessions.map(s => [num(s.id), s]))

  /* 2. Pick the browser that represents each account: the one that signed
        up (event), else the linked browser that recorded the signup, else
        the linked browser seen first (it carries the earliest first touch). */
  const byUser = new Map<number, Record<string, unknown>[]>()
  for (const v of visitors.values()) {
    if (v.user_id == null) continue
    const list = byUser.get(num(v.user_id))
    if (list) list.push(v)
    else byUser.set(num(v.user_id), [v])
  }
  const chosen = new Map<number, Record<string, unknown>>()
  for (const a of accounts) {
    const ev = events.get(a.id)
    let v = ev?.visitorId != null ? visitors.get(ev.visitorId) : undefined
    if (!v) {
      const list = (byUser.get(a.id) ?? []).slice().sort((x, y) =>
        Number(y.signed_up_at != null) - Number(x.signed_up_at != null) ||
        String(x.first_seen_at).localeCompare(String(y.first_seen_at)))
      v = list[0]
    }
    if (v) chosen.set(a.id, v)
  }

  /* 3. Visits of the chosen browsers, to count what happened before signup. */
  const visitorIds = [...new Set([...chosen.values()].map(v => num(v.id)))]
  const visitRows = visitorIds.length
    ? await anQuery(
      'SELECT id, visitor_id, started_at, last_seen_at, pageviews FROM an_sessions WHERE visitor_id IN (?)',
      [visitorIds],
    )
    : []
  const visitsByVisitor = new Map<number, VisitSlice[]>()
  for (const r of visitRows) {
    const vid = num(r.visitor_id)
    const slice: VisitSlice = {
      id: num(r.id),
      startedMs: sqlUtcToMs(r.started_at as string) ?? 0,
      lastMs: sqlUtcToMs(r.last_seen_at as string) ?? 0,
      pageviews: num(r.pageviews),
    }
    const list = visitsByVisitor.get(vid)
    if (list) list.push(slice)
    else visitsByVisitor.set(vid, [slice])
  }

  const signupMs = (a: Account): number => {
    const ev = events.get(a.id)
    if (ev && ev.ms) return ev.ms
    const v = chosen.get(a.id)
    return sqlUtcToMs(v?.signed_up_at as string | null) ?? a.createdMs
  }

  // The visit in progress at signup time: count only its pages viewed up to that moment.
  const straddling = new Map<number, number>() // session id -> signup ms
  for (const a of accounts) {
    const v = chosen.get(a.id)
    if (!v) continue
    const t = signupMs(a)
    for (const s of visitsByVisitor.get(num(v.id)) ?? []) {
      if (s.startedMs <= t && s.lastMs > t) straddling.set(s.id, t)
    }
  }
  const straddleCounts = new Map<number, number>()
  if (straddling.size) {
    const pvRows = await anQuery('SELECT session_id, ts FROM an_pageviews WHERE session_id IN (?)', [[...straddling.keys()]])
    for (const r of pvRows) {
      const sid = num(r.session_id)
      const t = straddling.get(sid)
      const ms = sqlUtcToMs(r.ts as string)
      if (t != null && ms != null && ms <= t) straddleCounts.set(sid, (straddleCounts.get(sid) ?? 0) + 1)
    }
  }

  /* 4. Rows. */
  const rows: SignupRow[] = accounts.map(a => {
    const ev = events.get(a.id) ?? null
    const v = chosen.get(a.id) ?? null
    const t = signupMs(a)
    let sessionsBefore: number | null = null
    let pageviewsBefore: number | null = null
    let daysTo: number | null = null
    if (v) {
      sessionsBefore = 0
      pageviewsBefore = 0
      for (const s of visitsByVisitor.get(num(v.id)) ?? []) {
        if (s.startedMs > t) continue
        sessionsBefore++
        pageviewsBefore += s.lastMs <= t ? s.pageviews : straddleCounts.get(s.id) ?? 0
      }
      const firstMs = sqlUtcToMs(v.first_seen_at as string)
      if (firstMs != null) daysTo = Math.max(0, Math.floor((t - firstMs) / DAY_MS))
    }
    const ss = ev?.sessionId != null ? sessionById.get(ev.sessionId) : undefined
    return {
      userId: a.id,
      email: a.email,
      name: a.name,
      signedUpAt: new Date(a.createdMs).toISOString(),
      method: ev?.method ?? a.provider,
      visitorId: v ? num(v.id) : null,
      firstTouch: v ? firstTouchOf(v) : null,
      signupSession: ss
        ? { id: num(ss.id), channel: asChannel(ss.channel), source: String(ss.source ?? ''), entryPath: String(ss.entry_path ?? '') }
        : null,
      sessionsBeforeSignup: sessionsBefore,
      pageviewsBeforeSignup: pageviewsBefore,
      daysToSignup: daysTo,
      listings: a.listings,
    }
  })

  /* 5. Breakdowns over attributed signups + the daily/weekly series. */
  const attributedRows = rows.filter(r => r.visitorId != null)
  const attributed = attributedRows.length
  const tally = (keyOf: (r: SignupRow) => string | null, labelOf: (k: string) => string): BreakdownRow[] => {
    const counts = new Map<string, number>()
    for (const r of attributedRows) {
      const k = keyOf(r) ?? '(none)'
      counts.set(k, (counts.get(k) ?? 0) + 1)
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
      .map(([key, n]) => ({
        key,
        label: key === '(none)' ? '(not set)' : labelOf(key),
        visitors: n,
        sessions: n,
        share: attributed > 0 ? n / attributed : 0,
        extra: { signups: n },
      }))
  }

  const perBucket = new Map<string, number>()
  for (const a of accounts) {
    const k = bucketKeyOf(a.createdMs, range)
    perBucket.set(k, (perBucket.get(k) ?? 0) + 1)
  }

  return {
    range,
    total: Math.max(num(countRow?.n), accounts.length),
    attributed,
    rows,
    byChannel: tally(r => r.firstTouch?.channel ?? null, k => channelLabel(k)),
    byLanding: tally(r => r.firstTouch?.landing ?? null, k => k),
    series: bucketKeys(range).map(b => ({ t: b.t, label: b.label, signups: perBucket.get(b.t) ?? 0 })),
  }
}
