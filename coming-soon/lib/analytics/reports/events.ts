import { anQuery, sqlUtcToIso } from '../db'
import { bucketExpr, bucketKeys, eventConditions, num, type ReportParams } from '../query'
import type { EventsReport, Filters, SearchTermRow } from '../types'
import {
  and, cond, curWin, effectiveRange, eventBreakdown, eventSummary, plainLabel, prevWin, trackingSince, type Win,
} from './_shared'

/* ═══════════════════════════════════════════════════════════════════════════
   Events: every event name with its count vs the previous period; with
   ?name= the detail of one event (trend, top targets, labels, pages); and
   the site-search terms incl. searches that found nothing (content gaps).
   Breakdown rows of the detail carry the event count in extra.count.
   ═══════════════════════════════════════════════════════════════════════════ */

const DETAIL_LIMIT = 50
const TERMS_LIMIT = 100
/** Same shape the collector accepts (EVENTS keys + CUSTOM_EVENT_NAME_RE), max column length. */
const NAME_RE = /^[a-z][a-z0-9_]{1,47}$/

export async function eventsReport(p: ReportParams): Promise<EventsReport> {
  const f = p.filters
  const range = effectiveRange(p.range, await trackingSince()).range
  const cur = curWin(range)
  const prev = prevWin(range)
  const rawName = (p.sp.get('name') || '').trim()
  const name = NAME_RE.test(rawName) ? rawName : null

  const [events, detail, searchTerms, zeroResultTerms] = await Promise.all([
    eventSummary(f, cur, prev),
    name ? eventDetail(p, cur, name) : null,
    searchTermRows(f, cur, false),
    searchTermRows(f, cur, true),
  ])

  return { range: p.range, events, detail, searchTerms, zeroResultTerms }
}

async function eventDetail(p: ReportParams, win: Win, name: string): Promise<NonNullable<EventsReport['detail']>> {
  const f = p.filters
  const isName = cond('e.name = ?', name)
  const b = bucketExpr('e.ts', p.range)
  const ec = eventConditions(f, win)
  const c = and(ec, isName)

  const [seriesRows, targets, labels, pages] = await Promise.all([
    anQuery<{ b: string; n: number }>(
      `SELECT ${b.sql} AS b, COUNT(*) AS n
         FROM an_events e ${ec.needsSessionJoin ? 'JOIN an_sessions s ON s.id = e.session_id' : ''}
        WHERE ${c.sql}
        GROUP BY b`,
      [...b.params, ...c.params],
    ),
    eventBreakdown(f, win, { dims: ['e.target'], where: isName, limit: DETAIL_LIMIT, label: plainLabel('(not set)') }),
    eventBreakdown(f, win, { dims: ['e.label'], where: isName, limit: DETAIL_LIMIT, label: plainLabel('(not set)') }),
    eventBreakdown(f, win, { dims: ['e.path'], where: isName, limit: DETAIL_LIMIT, label: plainLabel('(no page)') }),
  ])

  const byBucket = new Map(seriesRows.map(r => [String(r.b), num(r.n)]))
  return {
    name,
    series: bucketKeys(p.range).map(({ t, label }) => ({ t, label, count: byBucket.get(t) ?? 0 })),
    targets,
    labels,
    pages,
  }
}

/**
 * Site-search terms (the collector stores the trimmed, lower-cased query in
 * target and the result count in value). zeroOnly = terms that returned no
 * results at least once, most frequent first.
 */
async function searchTermRows(f: Filters, win: Win, zeroOnly: boolean): Promise<SearchTermRow[]> {
  const ec = eventConditions(f, win)
  const c = and(ec, cond(`e.name = 'search' AND e.target IS NOT NULL AND e.target <> ''`))
  const rows = await anQuery<{ q: string; searches: number; visitors: number; avg_results: number | null; zero: number | null; last_at: string }>(
    `SELECT e.target AS q,
            COUNT(*) AS searches,
            COUNT(DISTINCT e.visitor_id) AS visitors,
            AVG(e.value) AS avg_results,
            SUM(e.value = 0) AS zero,
            MAX(e.ts) AS last_at
       FROM an_events e ${ec.needsSessionJoin ? 'JOIN an_sessions s ON s.id = e.session_id' : ''}
      WHERE ${c.sql}
      GROUP BY e.target
      ${zeroOnly ? 'HAVING zero > 0' : ''}
      ORDER BY ${zeroOnly ? 'zero DESC, ' : ''}searches DESC, last_at DESC
      LIMIT ${TERMS_LIMIT}`,
    c.params,
  )
  return rows.map(r => ({
    query: String(r.q),
    searches: num(r.searches),
    visitors: num(r.visitors),
    avgResults: r.avg_results == null ? null : Math.round(num(r.avg_results) * 10) / 10,
    zeroResults: num(r.zero),
    lastSearched: sqlUtcToIso(r.last_at) ?? '',
  }))
}
