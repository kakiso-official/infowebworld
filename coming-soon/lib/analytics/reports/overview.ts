import { anQuery, anQueryOne, sqlUtcToIso, sqlUtcToMs, toSqlUtc } from '../db'
import { NONE_VALUE, num, pageviewConditions, sessionConditions, type ReportParams } from '../query'
import { ACTIVE_NOW_MS, CHANNELS, type BreakdownRow, type Insight, type OverviewReport, type PageRow, type ResolvedRange } from '../types'
import {
  and, channelLabel, cond, countryName, curWin, deviceLabel, effectiveRange, eventSummary,
  headline, pageRowsRaw, plainLabel, prevWin, sessionBreakdown, sourceName, toPageRow, trackingSince,
  type PeriodTotals, type Win,
} from './_shared'

/* ═══════════════════════════════════════════════════════════════════════════
   Overview: KPIs + main chart + the top-10 of every panel + "What stands out".
   ~25 small queries, all independent, run in parallel on the 3-connection
   analytics pool.
   ═══════════════════════════════════════════════════════════════════════════ */

const PANEL = 10
const BASE = '/iww-hq/analytics'

export async function overviewReport(p: ReportParams): Promise<OverviewReport> {
  const f = p.filters
  const since = await trackingSince()
  const eff = effectiveRange(p.range, since)
  const range = eff.range
  const cur = curWin(range)
  const prev = prevWin(range)
  const ses = (dims: string[], extra: Partial<Parameters<typeof sessionBreakdown>[2]> = {}) =>
    sessionBreakdown(f, cur, { dims, limit: PANEL, label: plainLabel('Unknown'), ...extra })

  const [
    head, channels, prevChannels, sources, aiAssistants, campaigns,
    topRaw, entryRaw, exitRaw, countries, cities, devices, browsers, os,
    keyEvents, notFound, keySources, activeNow,
  ] = await Promise.all([
    headline(f, range),
    // All 11 channels fit; previous counts come from an unrestricted query so a
    // channel that dropped to zero still shows up in the insights.
    ses(['s.channel'], { limit: CHANNELS.length + 1, label: channelLabel }),
    prev ? channelCounts(p, prev) : null,
    ses(['s.source'], { label: sourceName, dominant: { channel: 's.channel' }, prevWin: prev }),
    ses(['s.source'], { label: sourceName, where: cond(`s.channel = 'ai_assistant'`) }),
    ses(['s.campaign'], {
      label: plainLabel('(not set)'),
      where: cond(`s.campaign IS NOT NULL AND s.campaign <> ''`),
      dominant: { source: 's.source', medium: 's.medium' },
    }),
    pageRowsRaw(f, cur, { group: 'path', limit: PANEL }),
    pageRowsRaw(f, cur, { group: 'entry', limit: PANEL }),
    pageRowsRaw(f, cur, { group: 'exit', limit: PANEL }),
    ses(['s.country'], { label: countryName }),
    ses(['s.country', 's.city'], {
      label: plainLabel('(not set)'),
      extra: parts => ({ country: parts[0] === NONE_VALUE ? null : parts[0] }),
    }),
    ses(['s.device_type'], { label: deviceLabel }),
    ses(['s.browser'], {}),
    ses(['s.os'], {}),
    eventSummary(f, cur, prev, cond('e.is_key = 1')),
    notFoundCount(p, cur),
    topKeySources(p, cur),
    activeVisitors(p),
  ])

  // Previous visitors/visits per channel from the unrestricted query.
  if (prevChannels) {
    for (const r of channels) r.previous = prevChannels.get(r.key) ?? { visitors: 0, sessions: 0 }
  } else if (p.range.prev) {
    for (const r of channels) r.previous = null
  }

  const totalViews = head.cur.pageviews
  const topPages = topRaw.map(r => toPageRow(r, totalViews))
  const entryPages = entryRaw.map(r => toPageRow(r, totalViews))
  const exitPages = exitRaw.map(r => toPageRow(r, totalViews))

  const insights = buildInsights({
    range: p.range,
    hasFilters: Object.keys(f).length > 0,
    since,
    prevDropped: eff.prevDropped,
    prevPartial: eff.prevPartial,
    cur: head.cur,
    prev: head.prev,
    channels,
    prevChannels,
    aiAssistants,
    entryPages,
    topPages,
    keySources,
    notFound,
  })

  return {
    range: p.range,
    trackingSince: sqlUtcToIso(since),
    kpis: head.kpis,
    series: head.series,
    channels,
    sources,
    aiAssistants,
    campaigns,
    topPages,
    entryPages,
    exitPages,
    countries,
    cities,
    devices,
    browsers,
    os,
    keyEvents,
    insights,
    activeNow,
  }
}

/* ── Small queries ──────────────────────────────────────────────────────── */

async function channelCounts(p: ReportParams, win: Win): Promise<Map<string, { visitors: number; sessions: number }>> {
  const c = sessionConditions(p.filters, win)
  const rows = await anQuery<{ k: string; visitors: number; sessions: number }>(
    `SELECT s.channel AS k, COUNT(DISTINCT s.visitor_id) AS visitors, COUNT(*) AS sessions
       FROM an_sessions s WHERE ${c.sql} GROUP BY s.channel`,
    c.params,
  )
  return new Map(rows.map(r => [String(r.k), { visitors: num(r.visitors), sessions: num(r.sessions) }]))
}

async function notFoundCount(p: ReportParams, win: Win): Promise<{ hits: number; paths: number }> {
  const pc = pageviewConditions(p.filters, win)
  const c = and(pc, cond('p.status = 404'))
  const row = await anQueryOne<{ hits: number; paths: number }>(
    `SELECT COUNT(*) AS hits, COUNT(DISTINCT p.path) AS paths
       FROM an_pageviews p ${pc.needsSessionJoin ? 'JOIN an_sessions s ON s.id = p.session_id' : ''}
      WHERE ${c.sql}`,
    c.params,
  )
  return { hits: num(row?.hits), paths: num(row?.paths) }
}

/** Sources whose visits produced the most key actions (counted on the visits). */
async function topKeySources(p: ReportParams, win: Win): Promise<{ source: string; keyEvents: number }[]> {
  const c = and(sessionConditions(p.filters, win), cond('s.key_events > 0'))
  const rows = await anQuery<{ k: string; ke: number }>(
    `SELECT s.source AS k, SUM(s.key_events) AS ke
       FROM an_sessions s WHERE ${c.sql}
      GROUP BY s.source ORDER BY ke DESC, k LIMIT 3`,
    c.params,
  )
  return rows.map(r => ({ source: String(r.k), keyEvents: num(r.ke) }))
}

/** Visitors with activity in the last 5 minutes (same filters as the page). */
async function activeVisitors(p: ReportParams): Promise<number> {
  const c = and(sessionConditions(p.filters, null), cond('s.last_seen_at >= ?', toSqlUtc(Date.now() - ACTIVE_NOW_MS)))
  const row = await anQueryOne<{ n: number }>(
    `SELECT COUNT(DISTINCT s.visitor_id) AS n FROM an_sessions s WHERE ${c.sql}`,
    c.params,
  )
  return num(row?.n)
}

/* ── "What stands out" ──────────────────────────────────────────────────── */

interface InsightInput {
  range: ResolvedRange
  hasFilters: boolean
  since: string | null
  prevDropped: boolean
  prevPartial: boolean
  cur: PeriodTotals
  prev: PeriodTotals | null
  channels: BreakdownRow[]
  prevChannels: Map<string, { visitors: number; sessions: number }> | null
  aiAssistants: BreakdownRow[]
  entryPages: PageRow[]
  topPages: PageRow[]
  keySources: { source: string; keyEvents: number }[]
  notFound: { hits: number; paths: number }
}

/** Minimum visits in BOTH periods before we talk about a trend. */
const TREND_MIN_SESSIONS = 20
/** A channel move must be at least this many visits and this relative size. */
const CHANNEL_MIN_DIFF = 10
const CHANNEL_MIN_REL = 0.2
/** Landing pages: enough entrances to judge, and a clearly high bounce rate. */
const LANDING_MIN_ENTRIES = 20
const LANDING_BOUNCE = 0.7
const KEY_MIN_TOTAL = 5

const n = (v: number) => Math.round(v).toLocaleString('en-US')
function pct(r: number): string {
  const v = r * 100
  if (v > 0 && v < 1) return '<1%'
  return `${v < 10 && v % 1 !== 0 ? v.toFixed(1).replace(/\.0$/, '') : Math.round(v)}%`
}
const plural = (count: number, one: string, many = `${one}s`) => `${n(count)} ${count === 1 ? one : many}`
const pageHref = (path: string) => `${BASE}/pages/detail?path=${encodeURIComponent(path)}`
const filterHref = (page: string, key: string, value: string) => `${BASE}/${page}?f.${key}=${encodeURIComponent(value)}`

function sinceDate(since: string, tz: string): string {
  const ms = sqlUtcToMs(since) ?? Date.now()
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: tz }).format(ms)
  } catch {
    return since.slice(0, 10)
  }
}

/**
 * 3-6 deterministic plain-English sentences, most important first. Every
 * rule has a minimum sample so a handful of visits never produces a scary
 * "+300%". Comparisons are skipped when the previous period isn't fully
 * covered by tracking.
 */
export function buildInsights(x: InsightInput): Insight[] {
  const out: Insight[] = []
  const cmp = x.range.compare === 'year' ? 'the same period last year' : 'the previous period'
  const prevUsable = !!x.prev && !x.prevPartial

  if (x.cur.sessions === 0) {
    out.push({
      id: 'no-data',
      tone: 'neutral',
      text: !x.since
        ? 'No visits have been recorded yet. Numbers appear here as soon as the tracker records the first visit.'
        : x.hasFilters
          ? 'No visits match these filters in this period.'
          : 'No visits were recorded in this period.',
    })
    return out
  }

  // Tracking started recently: say so instead of comparing with a half-empty period.
  if (x.since && (x.prevDropped || x.prevPartial)) {
    out.push({
      id: 'tracking-start',
      tone: 'neutral',
      text: `Tracking started on ${sinceDate(x.since, x.range.tz)}, so there is no complete earlier period to compare with yet.`,
    })
  }

  // Visitors trend.
  if (prevUsable && x.prev && x.cur.sessions >= TREND_MIN_SESSIONS && x.prev.sessions >= TREND_MIN_SESSIONS && x.prev.visitors > 0) {
    const change = (x.cur.visitors - x.prev.visitors) / x.prev.visitors
    if (Math.abs(change) < 0.05) {
      out.push({ id: 'visitors-trend', tone: 'neutral', text: `Visitors held steady: ${n(x.cur.visitors)}, compared with ${n(x.prev.visitors)} in ${cmp}.` })
    } else {
      const up = change > 0
      out.push({
        id: 'visitors-trend',
        tone: up ? 'good' : 'bad',
        text: `Visitors are ${up ? 'up' : 'down'} ${pct(Math.abs(change))} to ${n(x.cur.visitors)}, from ${n(x.prev.visitors)} in ${cmp}.`,
        href: `${BASE}/acquisition`,
      })
    }
  }

  // Biggest growing / declining channel (by visits).
  if (prevUsable && x.prevChannels) {
    const curMap = new Map(x.channels.map(r => [r.key, r.sessions]))
    const keys = new Set([...curMap.keys(), ...x.prevChannels.keys()])
    let up: { k: string; c: number; p: number } | null = null
    let down: { k: string; c: number; p: number } | null = null
    for (const k of keys) {
      const c = curMap.get(k) ?? 0
      const pv = x.prevChannels.get(k)?.sessions ?? 0
      const diff = c - pv
      if (diff >= CHANNEL_MIN_DIFF && (pv === 0 || diff / pv >= CHANNEL_MIN_REL) && (!up || diff > up.c - up.p)) up = { k, c, p: pv }
      if (-diff >= CHANNEL_MIN_DIFF && pv > 0 && -diff / pv >= CHANNEL_MIN_REL && (!down || -diff > down.p - down.c)) down = { k, c, p: pv }
    }
    if (up) {
      const name = channelLabel(up.k)
      out.push({
        id: 'channel-up',
        tone: 'good',
        text: up.p === 0
          ? `${name} sent ${plural(up.c, 'visit')}, up from none in ${cmp}.`
          : `${name} sent ${n(up.c - up.p)} more visits than in ${cmp} (${n(up.c)}, up ${pct((up.c - up.p) / up.p)}).`,
        href: filterHref('acquisition', 'channel', up.k),
      })
    }
    if (down) {
      out.push({
        id: 'channel-down',
        tone: 'bad',
        text: `Visits from ${channelLabel(down.k)} fell by ${n(down.p - down.c)} to ${n(down.c)} (down ${pct((down.p - down.c) / down.p)}) compared with ${cmp}.`,
        href: filterHref('acquisition', 'channel', down.k),
      })
    }
  }

  // AI assistants.
  const aiVisits = x.channels.find(r => r.key === 'ai_assistant')?.sessions ?? 0
  if (aiVisits > 0) {
    const named = x.aiAssistants.filter(r => r.sessions > 0).slice(0, 3).map(r => `${r.label} ${n(r.sessions)}`)
    const share = x.cur.sessions >= TREND_MIN_SESSIONS ? ` (${pct(aiVisits / x.cur.sessions)} of all visits)` : ''
    out.push({
      id: 'ai-assistants',
      tone: 'good',
      text: `AI assistants sent ${plural(aiVisits, 'visit')}${named.length ? `: ${named.join(', ')}` : ''}${share}.`,
      href: filterHref('acquisition', 'channel', 'ai_assistant'),
    })
  }

  // A landing page that loses most of its visitors.
  const leaky = x.entryPages
    .filter(r => r.entries >= LANDING_MIN_ENTRIES && r.bounceRate != null && r.bounceRate >= LANDING_BOUNCE)
    .sort((a, b) => b.entries - a.entries)[0]
  if (leaky && leaky.bounceRate != null) {
    const bounced = Math.round(leaky.bounceRate * leaky.entries)
    out.push({
      id: 'landing-bounce',
      tone: 'bad',
      text: `${n(bounced)} of ${n(leaky.entries)} visits that landed on ${leaky.path} left without engaging (${pct(leaky.bounceRate)} bounce rate).`,
      href: pageHref(leaky.path),
    })
  }

  // Broken links.
  if (x.notFound.hits > 0) {
    out.push({
      id: 'not-found',
      tone: 'bad',
      text: `${plural(x.notFound.hits, 'pageview')} hit a "page not found" error on ${plural(x.notFound.paths, 'URL')} - fix the links or add redirects.`,
      href: `${BASE}/errors`,
    })
  }

  // Which source brings the visits that convert.
  const topKey = x.keySources[0]
  if (topKey && x.cur.sessionKeyEvents >= KEY_MIN_TOTAL && topKey.keyEvents >= 2) {
    out.push({
      id: 'key-source',
      tone: 'good',
      text: `${sourceName(topKey.source)} brought the visits with the most key actions: ${n(topKey.keyEvents)} of ${n(x.cur.sessionKeyEvents)} (${pct(topKey.keyEvents / x.cur.sessionKeyEvents)}).`,
      href: filterHref('acquisition', 'source', topKey.source),
    })
  }

  // Fill up to three with plain facts.
  const fillers: Insight[] = []
  const topChannel = [...x.channels].sort((a, b) => b.sessions - a.sessions)[0]
  if (topChannel && topChannel.sessions > 0) {
    fillers.push({
      id: 'top-channel',
      tone: 'neutral',
      text: `${topChannel.label} brought the most visits: ${n(topChannel.sessions)} of ${n(x.cur.sessions)} (${pct(topChannel.sessions / x.cur.sessions)}).`,
      href: filterHref('acquisition', 'channel', topChannel.key),
    })
  }
  const topPage = x.topPages[0]
  if (topPage && topPage.views > 0) {
    fillers.push({
      id: 'top-page',
      tone: 'neutral',
      text: `The most viewed page was ${topPage.path}, with ${plural(topPage.views, 'view')} (${pct(topPage.share)} of all pageviews).`,
      href: pageHref(topPage.path),
    })
  }
  fillers.push({
    id: 'engagement',
    tone: 'neutral',
    text: `${pct(x.cur.engaged / x.cur.sessions)} of visits were engaged (10+ seconds of active time, 2+ pages, or a key action).`,
  })
  for (const fi of fillers) if (out.length < 3) out.push(fi)

  return out.slice(0, 6)
}
