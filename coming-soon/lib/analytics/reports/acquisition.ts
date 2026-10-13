import { anQuery, anQueryOne } from '../db'
import { bucketExpr, bucketKeys, num, pageviewConditions, sessionConditions, type ReportParams } from '../query'
import { CHANNELS, type AcquisitionReport, type Channel, type ChannelSeries } from '../types'
import {
  channelLabel, cond, curWin, effectiveRange, latestSql, pageRowsRaw, plainLabel, prevWin,
  sessionBreakdown, sourceName, toPageRow, trackingSince, type Win,
} from './_shared'

/* ═══════════════════════════════════════════════════════════════════════════
   Traffic sources: channels (with the previous period), channel mix over
   time, and the tabs Sources / Referrers / Referrer URLs / Campaigns /
   AI assistants / Search engines / Social, plus landing pages.
   Every list is a breakdown of visits started in the range (filters apply).
   ═══════════════════════════════════════════════════════════════════════════ */

const LIST_LIMIT = 50
const URL_LIMIT = 100

export async function acquisitionReport(p: ReportParams): Promise<AcquisitionReport> {
  const f = p.filters
  const range = effectiveRange(p.range, await trackingSince()).range
  const cur = curWin(range)
  const prev = prevWin(range)
  const ses = (dims: string[], extra: Partial<Parameters<typeof sessionBreakdown>[2]> = {}) =>
    sessionBreakdown(f, cur, { dims, limit: LIST_LIMIT, label: plainLabel('(not set)'), ...extra })

  const [
    channels, channelSeries, sources, referrers, referrerUrls, campaigns,
    aiAssistants, searchEngines, socialNetworks, landingRaw, totalViews,
  ] = await Promise.all([
    ses(['s.channel'], { limit: CHANNELS.length + 1, label: channelLabel, prevWin: prev }),
    channelMix(p, cur),
    ses(['s.source'], { label: sourceName, dominant: { channel: 's.channel' }, prevWin: prev }),
    // Referrer host; extra.sampleUrl = the most recent full referrer URL from that host.
    // '(internal)' visits (our own pages, sign-in / payment redirects) are not referrals.
    ses(['s.referrer_host'], {
      where: cond(`s.referrer_host IS NOT NULL AND s.referrer_host <> '' AND s.source <> '(internal)'`),
      extraAgg: { sampleUrl: latestSql(`NULLIF(s.referrer, '')`, 's.started_at') },
      dominant: { channel: 's.channel' },
      prevWin: prev,
    }),
    // key = full URL (not a filter value); filter with extra.host (f.referrer).
    ses(['s.referrer'], {
      limit: URL_LIMIT,
      where: cond(`s.referrer IS NOT NULL AND s.referrer <> '' AND s.source <> '(internal)'`),
      dominant: { host: 's.referrer_host', channel: 's.channel' },
    }),
    ses(['s.campaign'], {
      where: cond(`s.campaign IS NOT NULL AND s.campaign <> ''`),
      dominant: { source: 's.source', medium: 's.medium' },
      prevWin: prev,
    }),
    ses(['s.source'], { label: sourceName, where: cond(`s.channel = 'ai_assistant'`), prevWin: prev }),
    ses(['s.source'], { label: sourceName, where: cond(`s.channel = 'organic_search'`), prevWin: prev }),
    ses(['s.source'], { label: sourceName, where: cond(`s.channel = 'social'`), prevWin: prev }),
    pageRowsRaw(f, cur, { group: 'entry', limit: LIST_LIMIT }),
    pageviewTotal(p, cur),
  ])

  return {
    range: p.range,
    channels,
    channelSeries,
    sources,
    referrers,
    referrerUrls,
    campaigns,
    aiAssistants,
    searchEngines,
    socialNetworks,
    landingPages: landingRaw.map(r => toPageRow(r, totalViews)),
  }
}

/** Visits per channel per bucket (zero-filled); only channels that had visits, in CHANNELS order. */
async function channelMix(p: ReportParams, win: Win): Promise<ChannelSeries> {
  const b = bucketExpr('s.started_at', p.range)
  const c = sessionConditions(p.filters, win)
  const rows = await anQuery<{ b: string; ch: string; n: number }>(
    `SELECT ${b.sql} AS b, s.channel AS ch, COUNT(*) AS n
       FROM an_sessions s WHERE ${c.sql}
      GROUP BY b, ch`,
    [...b.params, ...c.params],
  )
  const labels = bucketKeys(p.range)
  const index = new Map(labels.map((l, i) => [l.t, i]))
  const byChannel = new Map<Channel, number[]>()
  for (const r of rows) {
    const ch = String(r.ch) as Channel
    if (!CHANNELS.includes(ch)) continue
    const i = index.get(String(r.b))
    if (i == null) continue
    let arr = byChannel.get(ch)
    if (!arr) byChannel.set(ch, (arr = labels.map(() => 0)))
    arr[i] += num(r.n)
  }
  return {
    bucket: p.range.bucket,
    labels,
    series: CHANNELS.filter(ch => byChannel.has(ch)).map(channel => ({ channel, sessions: byChannel.get(channel)! })),
  }
}

/** All pageviews in the range (denominator for the landing pages' view share). */
async function pageviewTotal(p: ReportParams, win: Win): Promise<number> {
  const pc = pageviewConditions(p.filters, win)
  const row = await anQueryOne<{ n: number }>(
    `SELECT COUNT(*) AS n FROM an_pageviews p ${pc.needsSessionJoin ? 'JOIN an_sessions s ON s.id = p.session_id' : ''} WHERE ${pc.sql}`,
    pc.params,
  )
  return num(row?.n)
}
