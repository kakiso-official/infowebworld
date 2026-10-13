import { anQuery, anQueryOne } from '../db'
import { bucketExpr, bucketKeys, likeEscape, num, pageviewConditions, type ReportParams } from '../query'
import type { BreakdownRow, Filters, Metric, PageDetailReport, PageRow, PagesReport } from '../types'
import {
  PAGE_AGG, VITALS_ANY_SQL, VITALS_ROW_CAP, and, asPageType, cond, countryName, curWin, deviceLabel,
  effectiveRange, eventBreakdown, eventSummary, latestSql, pageJoin, pageRowsRaw, pageTypeLabel,
  pageviewBreakdown, pageviewBreakdownWithTotal, prevWin, ratio, sessionBreakdown, sourceName, str,
  summarizeVitals, toPageRow, trackingSince, viewsByPath, withoutPageFilters,
  type PageAggRaw, type PageGroup, type VitalSample, type Win,
} from './_shared'

/* ═══════════════════════════════════════════════════════════════════════════
   Pages (?group=path|page_type|entry|exit, q, sort, dir, limit, offset) and
   Page details (?path=). Page metrics follow SPEC 7 "Page metrics": views,
   visitors, entrances, exits, exit rate, bounce rate of entrances, average
   engaged time and scroll per view.
   ═══════════════════════════════════════════════════════════════════════════ */

const GROUPS = ['path', 'page_type', 'entry', 'exit'] as const
type Group = (typeof GROUPS)[number]

export async function pagesReport(p: ReportParams): Promise<PagesReport> {
  const rawGroup = p.sp.get('group')
  const groupBy: Group = (GROUPS as readonly string[]).includes(rawGroup ?? '') ? rawGroup as Group : 'path'
  const range = effectiveRange(p.range, await trackingSince()).range
  const cur = curWin(range)
  const prev = prevWin(range)

  if (groupBy === 'page_type') {
    const { total, rows } = await pageTypeRows(p, cur, prev)
    return { range: p.range, groupBy, total, rows }
  }

  const [raw, totals] = await Promise.all([
    pageRowsRaw(p.filters, cur, { group: groupBy, q: p.q, sort: p.sort, dir: p.dir, limit: p.limit, offset: p.offset }),
    pageTotals(p.filters, cur, groupBy, p.q),
  ])
  const prevViews = prev ? await viewsByPath(p.filters, prev, raw.map(r => String(r.k))) : null
  return {
    range: p.range,
    groupBy,
    total: totals.groups,
    rows: raw.map(r => toPageRow(r, totals.views, prevViews ? prevViews.get(String(r.k)) ?? 0 : null)),
  }
}

/** All views in the window (share denominator) + how many rows the grouping has (for paging). */
async function pageTotals(f: Filters, win: Win, group: PageGroup, q: string | null): Promise<{ views: number; groups: number }> {
  const pc = pageviewConditions(f, win)
  const rowCond = group === 'entry' ? 'p.seq = 1' : group === 'exit' ? 'p.is_exit = 1' : '1'
  const qCond = q ? `p.path LIKE ? ESCAPE '\\\\'` : '1'
  const row = await anQueryOne<{ views: number; grp_count: number }>(
    `SELECT COUNT(*) AS views, COUNT(DISTINCT IF(${rowCond} AND ${qCond}, p.path, NULL)) AS grp_count
       FROM an_pageviews p ${pc.needsSessionJoin ? 'JOIN an_sessions s ON s.id = p.session_id' : ''}
      WHERE ${pc.sql}`,
    [...(q ? [`%${likeEscape(q)}%`] : []), ...pc.params],
  )
  return { views: num(row?.views), groups: num(row?.grp_count) }
}

/** Sortable PageRow fields for the page-type grouping (sorted in JS: at most ~18 rows). */
const ROW_SORT: Record<string, (r: PageRow) => number | string | null> = {
  views: r => r.views, visitors: r => r.visitors, entries: r => r.entries, exits: r => r.exits,
  exitRate: r => r.exitRate, bounceRate: r => r.bounceRate, avgEngagedMs: r => r.avgEngagedMs,
  avgScrollPct: r => r.avgScrollPct, path: r => r.path, title: r => r.title,
}

/** Rows are page types: path = the type key, title = its label. */
async function pageTypeRows(p: ReportParams, cur: Win, prev: Win | null): Promise<{ total: number; rows: PageRow[] }> {
  const typeAgg = (win: Win) => {
    const pc = pageviewConditions(p.filters, win)
    return anQuery<PageAggRaw>(
      `SELECT p.page_type AS k, ${PAGE_AGG}
         FROM an_pageviews p ${pageJoin(pc.needsSessionJoin)}
        WHERE ${pc.sql}
        GROUP BY p.page_type`,
      pc.params,
    )
  }
  const [curRows, prevRows] = await Promise.all([typeAgg(cur), prev ? typeAgg(prev) : null])
  const totalViews = curRows.reduce((sum, r) => sum + num(r.views), 0)
  const prevMap = new Map((prevRows ?? []).map(r => [String(r.k), num(r.views)]))

  let rows = curRows.map(r => toPageRow(
    { ...r, title: pageTypeLabel(String(r.k)), ptype: String(r.k) },
    totalViews,
    prevRows ? prevMap.get(String(r.k)) ?? 0 : null,
  ))
  if (p.q) {
    const q = p.q.toLowerCase()
    rows = rows.filter(r => r.path.toLowerCase().includes(q) || (r.title ?? '').toLowerCase().includes(q))
  }
  const get = ROW_SORT[p.sort ?? ''] ?? ROW_SORT.views
  const sign = p.dir === 'asc' ? 1 : -1
  rows.sort((a, b) => {
    const x = get(a)
    const y = get(b)
    if (x == null || y == null) return x == null ? (y == null ? 0 : 1) : -1 // missing values last
    if (x === y) return b.views - a.views
    return (x < y ? -1 : 1) * sign
  })
  return { total: rows.length, rows: rows.slice(p.offset, p.offset + p.limit) }
}

/* ── Page details ───────────────────────────────────────────────────────── */

/** Same normalization the collector applies before storing a path. */
function normalizePath(raw: string | null): string {
  let s = (raw ?? '').trim()
  const cut = s.search(/[?#]/)
  if (cut >= 0) s = s.slice(0, cut)
  try {
    if (/^https?:\/\//i.test(s)) s = new URL(s).pathname
  } catch { /* keep as is */ }
  if (!s.startsWith('/')) s = '/' + s
  s = s.replace(/\/{2,}/g, '/')
  if (s.length > 1) s = s.replace(/\/+$/, '')
  return s.slice(0, 500) || '/'
}

interface DetailAggRaw extends PageAggRaw {
  exit_visitors: number
  s0: number; s1: number; s2: number; s3: number
}

async function detailAgg(f: Filters, win: Win, path: string): Promise<DetailAggRaw | null> {
  const pc = pageviewConditions(f, win)
  const c = and(pc, cond('p.path = ?', path))
  return anQueryOne<DetailAggRaw>(
    `SELECT ${PAGE_AGG},
            ${latestSql(`NULLIF(p.title, '')`, 'p.ts')} AS title,
            ${latestSql('p.page_type', 'p.ts')} AS ptype,
            COUNT(DISTINCT IF(p.is_exit = 1, p.visitor_id, NULL)) AS exit_visitors,
            SUM(p.scroll_pct < 25) AS s0,
            SUM(p.scroll_pct >= 25 AND p.scroll_pct < 50) AS s1,
            SUM(p.scroll_pct >= 50 AND p.scroll_pct < 75) AS s2,
            SUM(p.scroll_pct >= 75) AS s3
       FROM an_pageviews p ${pageJoin(pc.needsSessionJoin)}
      WHERE ${c.sql}`,
    c.params,
  ).then(r => (r ? { ...r, k: path } : null))
}

export async function pageDetailReport(p: ReportParams): Promise<PageDetailReport> {
  const path = normalizePath(p.sp.get('path'))
  // The page is given by ?path=; a page / page-type filter on top would only empty the report.
  const f = withoutPageFilters(p.filters)
  const range = effectiveRange(p.range, await trackingSince()).range
  const cur = curWin(range)
  const prev = prevWin(range)
  const onPath = cond('p.path = ?', path)
  const pc = pageviewConditions(f, cur)
  const pjoin = pc.needsSessionJoin ? 'JOIN an_sessions s ON s.id = p.session_id' : ''
  const sc = and(pc, onPath)
  const vc = and(pc, onPath, cond(VITALS_ANY_SQL))
  const sb = bucketExpr('p.ts', range)

  const [curAgg, prevAgg, seriesRows, previousPages, next, entrySources, countries, devices, vitalRows, events, outboundTargets] = await Promise.all([
    detailAgg(f, cur, path),
    prev ? detailAgg(f, prev, path) : null,
    anQuery<{ b: string; views: number; visitors: number }>(
      `SELECT ${sb.sql} AS b, COUNT(*) AS views, COUNT(DISTINCT p.visitor_id) AS visitors
         FROM an_pageviews p ${pjoin}
        WHERE ${sc.sql}
        GROUP BY b`,
      [...sb.params, ...sc.params],
    ),
    // Where views of this page came from: the previous page of the visit, or '(entrance)'.
    pageviewBreakdown(f, cur, {
      dims: ['p.prev_path'], noneKey: '(entrance)', where: onPath, limit: 10,
      label: k => (k === '(entrance)' ? 'Entered the site here' : k),
    }),
    // Where visitors went next: views whose previous page was this one.
    pageviewBreakdownWithTotal(f, cur, { dims: ['p.path'], where: cond('p.prev_path = ?', path), limit: 10, label: k => k }),
    sessionBreakdown(f, cur, {
      dims: ['s.source'], where: cond('s.entry_path = ?', path), limit: 10, label: sourceName,
      dominant: { channel: 's.channel' },
    }),
    pageviewBreakdown(f, cur, { dims: ['s.country'], joinSessions: true, where: onPath, limit: 10, label: countryName }),
    pageviewBreakdown(f, cur, { dims: ['s.device_type'], joinSessions: true, where: onPath, limit: 5, label: deviceLabel }),
    anQuery<VitalSample>(
      `SELECT p.lcp_ms, p.inp_ms, p.cls, p.fcp_ms, p.ttfb_ms
         FROM an_pageviews p ${pjoin}
        WHERE ${vc.sql}
        ORDER BY p.ts DESC
        LIMIT ${VITALS_ROW_CAP}`,
      vc.params,
    ),
    eventSummary(f, cur, prev, cond('e.path = ?', path)),
    eventBreakdown(f, cur, {
      dims: ['e.target'],
      where: and(cond('e.path = ?', path), cond('e.name IN (?)', ['outbound_click', 'website_click'])),
      limit: 20,
      label: k => k,
      extraAgg: { websiteClicks: `SUM(e.name = 'website_click')` },
    }),
  ])

  const c = metricsOf(curAgg)
  const pr = prevAgg ? metricsOf(prevAgg) : null
  const m = (k: keyof ReturnType<typeof metricsOf>): Metric => ({ value: c[k], previous: pr ? pr[k] : null })

  // '(entrance)' row: the channel that brought most of the visits landing here.
  const entrance = previousPages.find(r => r.key === '(entrance)')
  if (entrance) {
    const byChannel = new Map<string, number>()
    for (const r of entrySources) {
      const ch = r.extra?.channel
      if (typeof ch === 'string') byChannel.set(ch, (byChannel.get(ch) ?? 0) + r.sessions)
    }
    const top = [...byChannel.entries()].sort((a, b) => b[1] - a[1])[0]
    entrance.extra = { ...(entrance.extra ?? {}), channel: top ? top[0] : null }
  }

  // Next pages + '(exit)' (visits that ended here). Shares are of everything that happened next.
  const exits = num(curAgg?.exits)
  const nextTotal = next.total + exits
  const nextPages: BreakdownRow[] = next.rows.map(r => ({ ...r, share: ratio(r.pageviews ?? 0, nextTotal) }))
  if (exits > 0) {
    nextPages.push({
      key: '(exit)',
      label: 'Left the site',
      visitors: num(curAgg?.exit_visitors),
      sessions: exits,
      pageviews: exits,
      share: ratio(exits, nextTotal),
    })
  }
  nextPages.sort((a, b) => (b.pageviews ?? 0) - (a.pageviews ?? 0))

  const vitals = vitalRows.length ? summarizeVitals(vitalRows) : null
  const byBucket = new Map(seriesRows.map(r => [String(r.b), r]))

  return {
    range: p.range,
    path,
    title: str(curAgg?.title) ?? str(prevAgg?.title),
    pageType: asPageType(str(curAgg?.ptype) ?? str(prevAgg?.ptype)),
    kpis: {
      views: m('views'), visitors: m('visitors'), entries: m('entries'), exits: m('exits'),
      exitRate: m('exitRate'), bounceRate: m('bounceRate'), avgEngagedMs: m('avgEngagedMs'), avgScrollPct: m('avgScrollPct'),
    },
    series: {
      bucket: range.bucket,
      points: bucketKeys(range).map(({ t, label }) => ({
        t, label, views: num(byBucket.get(t)?.views), visitors: num(byBucket.get(t)?.visitors),
      })),
    },
    previousPages,
    nextPages,
    entrySources,
    countries,
    devices,
    scroll: [
      { bucket: '0-25%', views: num(curAgg?.s0) },
      { bucket: '25-50%', views: num(curAgg?.s1) },
      { bucket: '50-75%', views: num(curAgg?.s2) },
      { bucket: '75-100%', views: num(curAgg?.s3) },
    ],
    vitals,
    events,
    outboundTargets,
  }
}

/** KPI numbers of the page; bounce rate is 0 (not "no data") when nobody landed here. */
function metricsOf(r: DetailAggRaw | null) {
  const row = toPageRow(r ?? { k: '', views: 0, visitors: 0, entries: 0, exits: 0, bounced: 0, avg_eng: 0, avg_scroll: 0 }, 0)
  return {
    views: row.views,
    visitors: row.visitors,
    entries: row.entries,
    exits: row.exits,
    exitRate: row.exitRate,
    bounceRate: row.bounceRate ?? 0,
    avgEngagedMs: row.avgEngagedMs,
    avgScrollPct: row.avgScrollPct,
  }
}
