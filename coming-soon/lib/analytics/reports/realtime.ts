import { anQuery, anQueryOne, sqlUtcToIso, toSqlUtc } from '../db'
import { eventConditions, num, pageviewConditions, sessionConditions, type ReportParams } from '../query'
import { ACTIVE_NOW_MS, type DeviceType, type FeedItem, type RealtimeReport } from '../types'
import {
  and, asChannel, cond, countryName, deviceLabel, latestSql, plainLabel, sessionBreakdown, sourceName, str,
} from './_shared'

/* ═══════════════════════════════════════════════════════════════════════════
   Realtime: who is on the site right now. Ignores the date range (the UI
   polls this every 10-30 s); the page filters still apply so the "online"
   count matches the filtered view. Every query is bounded by a short recent
   time window on an indexed column (last_seen_at / ts), so polling is cheap.
   ═══════════════════════════════════════════════════════════════════════════ */

const MINUTE = 60_000
const PER_MINUTE_SPAN = 30
/** The feed shows the newest activity of the last 24 hours (quiet sites still see something). */
const FEED_LOOKBACK_MS = 24 * 60 * MINUTE
const FEED_SIZE = 50
const LIST_LIMIT = 10

interface FeedRaw {
  ts: string
  session_id: number
  visitor_id: number
  path: string | null
  title?: string | null
  name?: string | null
  target?: string | null
  country: string | null
  city: string | null
  device_type: string
  channel: string
  source: string
  is_new: number
  user_id: number | null
}

const FEED_SESSION_COLS = 's.country, s.city, s.device_type, s.channel, s.source, s.is_new, s.user_id'

export async function realtimeReport(p: ReportParams): Promise<RealtimeReport> {
  const f = p.filters
  const nowMs = Date.now()
  const active5 = toSqlUtc(nowMs - ACTIVE_NOW_MS)
  const active30 = toSqlUtc(nowMs - 30 * MINUTE)
  const firstMinute = Math.floor(nowMs / MINUTE) * MINUTE - (PER_MINUTE_SPAN - 1) * MINUTE
  // Small margin past "now": hit times come from this server's clock, but
  // the DB may round a few ms up.
  const upper = toSqlUtc(nowMs + MINUTE)

  const sessionsActive = (since: string) => and(sessionConditions(f, null), cond('s.last_seen_at >= ?', since))
  const activeWhere = cond('s.last_seen_at >= ?', active5)
  const list = (dims: string[], label: (k: string) => string, extraAgg?: Record<string, string>) =>
    sessionBreakdown(f, null, { dims, where: activeWhere, limit: LIST_LIMIT, label, extraAgg })

  const pvWin = { startUtc: toSqlUtc(firstMinute), endUtc: upper }
  const pc = pageviewConditions(f, pvWin)
  const feedWin = { startUtc: toSqlUtc(nowMs - FEED_LOOKBACK_MS), endUtc: upper }
  const fpc = pageviewConditions(f, feedWin)
  const fec = eventConditions(f, feedWin)

  const counts = (since: string) => {
    const c = sessionsActive(since)
    return anQueryOne<{ n: number }>(`SELECT COUNT(DISTINCT s.visitor_id) AS n FROM an_sessions s WHERE ${c.sql}`, c.params)
  }

  const [now5, now30, minutes, pages, sources, countries, devices, pvFeed, evFeed] = await Promise.all([
    counts(active5),
    counts(active30),
    anQuery<{ m: string; pv: number; v: number }>(
      `SELECT DATE_FORMAT(p.ts, '%Y-%m-%d %H:%i') AS m, COUNT(*) AS pv, COUNT(DISTINCT p.visitor_id) AS v
         FROM an_pageviews p ${pc.needsSessionJoin ? 'JOIN an_sessions s ON s.id = p.session_id' : ''}
        WHERE ${pc.sql}
        GROUP BY m`,
      pc.params,
    ),
    // The page each active visit is on now = its latest page (extra.pageType = that page's type).
    list(['s.exit_path'], plainLabel('(unknown)'), { pageType: latestSql(`NULLIF(s.exit_type, '')`, 's.last_seen_at') }),
    list(['s.source'], sourceName, { channel: latestSql('s.channel', 's.last_seen_at') }),
    list(['s.country'], countryName),
    list(['s.device_type'], deviceLabel),
    anQuery<FeedRaw>(
      `SELECT p.ts, p.session_id, p.visitor_id, p.path, p.title, ${FEED_SESSION_COLS}
         FROM an_pageviews p JOIN an_sessions s ON s.id = p.session_id
        WHERE ${fpc.sql}
        ORDER BY p.ts DESC, p.id DESC
        LIMIT ${FEED_SIZE}`,
      fpc.params,
    ),
    // Events without a visit (server events from browsers we never saw) can't be shown in a visit feed.
    anQuery<FeedRaw>(
      `SELECT e.ts, e.session_id, s.visitor_id, e.path, e.name, e.target, ${FEED_SESSION_COLS}
         FROM an_events e JOIN an_sessions s ON s.id = e.session_id
        WHERE ${fec.sql}
        ORDER BY e.ts DESC, e.id DESC
        LIMIT ${FEED_SIZE}`,
      fec.params,
    ),
  ])

  const byMinute = new Map(minutes.map(r => [String(r.m), r]))
  const perMinute: RealtimeReport['perMinute'] = []
  for (let i = 0; i < PER_MINUTE_SPAN; i++) {
    const t = firstMinute + i * MINUTE
    const r = byMinute.get(toSqlUtc(t).slice(0, 16))
    perMinute.push({ t: new Date(t).toISOString(), pageviews: num(r?.pv), visitors: num(r?.v) })
  }

  const feed = [
    ...pvFeed.map(r => feedItem(r, 'pageview')),
    ...evFeed.map(r => feedItem(r, 'event')),
  ]
    // Newest first; on the same millisecond the event (which follows its pageview) goes on top.
    .sort((a, b) => (a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : a.kind === b.kind ? 0 : a.kind === 'event' ? -1 : 1))
    .slice(0, FEED_SIZE)

  return {
    serverTime: new Date(nowMs).toISOString(),
    activeNow: num(now5?.n),
    active30m: num(now30?.n),
    perMinute,
    pages,
    sources,
    countries,
    devices,
    feed,
  }
}

function feedItem(r: FeedRaw, kind: FeedItem['kind']): FeedItem {
  const device = String(r.device_type)
  return {
    kind,
    ts: sqlUtcToIso(r.ts) ?? '',
    sessionId: num(r.session_id),
    visitorId: num(r.visitor_id),
    path: str(r.path),
    title: kind === 'pageview' ? str(r.title) : null,
    name: kind === 'event' ? str(r.name) : null,
    target: kind === 'event' ? str(r.target) : null,
    country: str(r.country),
    city: str(r.city),
    deviceType: (device === 'mobile' || device === 'tablet' ? device : 'desktop') as DeviceType,
    channel: asChannel(r.channel),
    source: String(r.source ?? ''),
    isNewVisitor: num(r.is_new) === 1,
    userId: r.user_id == null ? null : num(r.user_id),
  }
}
