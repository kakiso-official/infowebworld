import { anQuery, sqlUtcToMs, toSqlUtc } from '../db'
import { num, sessionConditions, windowOf, type ReportParams } from '../query'
import { PAGE_TYPE_META, SESSION_MAX_MS, type FlowNode, type FlowReport } from '../types'
import { backwardTrail, buildFlowGraph, forwardTrail, normalizePath, type TrailToken } from './_journey'
import { isPageType } from './_people'

/* ═══════════════════════════════════════════════════════════════════════════
   Journeys (Sankey flow) report.

   ?mode=entries  visits in the range -> their first `steps` pages
   ?mode=from     visits that viewed the anchor -> the anchor (first time it
                  was viewed in the visit), then the next pages
   ?mode=to       visits that viewed the anchor -> the pages before the FIRST
                  view of the anchor; the anchor is the last column and visits
                  that landed closer to it get an (entrance) node
   &anchor=       a path ("/saas-directory") or a page type ("category")
   &group=        path | page_type - what a column node represents
   &steps=3..6    number of columns, anchor column included
   &width=4..10   pages kept per column; the rest are folded into (other)
   &collapse=1    page_type mode only: merge consecutive repeats
                  (category -> category -> listing becomes category -> listing)

   A visit that ends before the last column gets an (exit) node (terminal).
   Only the 20 000 most recent qualifying visits are used (sampled: true).
   SQL returns compact (session, seq, key) rows; the graph is built in JS
   (./_journey.ts) so the definitions above are implemented in one place.
   ═══════════════════════════════════════════════════════════════════════════ */

const SESSION_CAP = 20_000

/* With collapse on, a run of same-type pages counts as one column, so more
   rows per visit are fetched to fill the columns: steps x 5, at most 30.
   A visit whose run is longer than that just stops at the last column we
   could fill (no exit is invented for it). */
const COLLAPSE_ROWS_PER_STEP = 5
const COLLAPSE_MAX_ROWS = 30

type Mode = FlowReport['mode']
type Group = FlowReport['group']

function clampInt(raw: string | null, min: number, max: number, dflt: number): number {
  const n = Number.parseInt(raw ?? '', 10)
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : dflt
}

function nodeLabel(group: Group) {
  return (key: string, kind: FlowNode['kind']): string => {
    if (kind === 'exit') return 'Left the site'
    if (kind === 'entrance') return 'Entered the site'
    if (kind === 'other') return group === 'page_type' ? 'Other page types' : 'Other pages'
    if (group === 'page_type') return isPageType(key) ? PAGE_TYPE_META[key].label : key
    return key
  }
}

interface VisitRows { started: string; aseq: number; rows: { seq: number; key: string }[] }

export async function flowReport(p: ReportParams): Promise<FlowReport> {
  const sp = p.sp
  const modeRaw = sp.get('mode')
  const mode: Mode = modeRaw === 'from' || modeRaw === 'to' ? modeRaw : 'entries'
  const anchorRaw = (sp.get('anchor') || '').trim().slice(0, 500)
  const groupRaw = sp.get('group')
  /* No explicit group: an anchor that looks like a path means exact pages,
     otherwise page types (exact paths of a whole directory are mostly
     "(other)", page types read better as a first view). */
  const group: Group = groupRaw === 'path' || groupRaw === 'page_type'
    ? groupRaw
    : anchorRaw.startsWith('/') ? 'path' : 'page_type'
  const steps = clampInt(sp.get('steps'), 3, 6, 4)
  const width = clampInt(sp.get('width'), 4, 10, 6)
  const collapse = group === 'page_type' && sp.get('collapse') === '1'

  let anchor: string | null = null
  if (mode !== 'entries' && anchorRaw) {
    if (group === 'path') anchor = normalizePath(anchorRaw)
    else if (isPageType(anchorRaw)) anchor = anchorRaw
  }

  const empty: FlowReport = {
    range: p.range, mode, anchor, group, steps, totalSessions: 0, sampled: false, nodes: [], links: [],
  }
  if (mode !== 'entries' && !anchor) return empty

  // Column identifiers are whitelisted, never taken from the request.
  const col = group === 'path' ? 'path' : 'page_type'
  const rowsPerVisit = collapse ? Math.min(steps * COLLAPSE_ROWS_PER_STEP, COLLAPSE_MAX_ROWS) : steps
  const cond = sessionConditions(p.filters, windowOf(p.range, 'cur'))

  let raw: Record<string, unknown>[]
  if (mode === 'entries') {
    /* Most recent visits first; LEFT JOIN keeps visits whose pageviews were
       already pruned so the cap check still counts them. */
    raw = await anQuery(
      `SELECT x.id AS sid, x.started_at AS st, 1 AS aseq, p.seq, p.${col} AS k
         FROM (SELECT s.id, s.started_at FROM an_sessions s
                WHERE ${cond.sql}
                ORDER BY s.started_at DESC, s.id DESC
                LIMIT ?) x
         LEFT JOIN an_pageviews p ON p.session_id = x.id AND p.seq <= ?`,
      [...cond.params, SESSION_CAP + 1, rowsPerVisit],
    )
  } else {
    /* aseq = the first time the anchor was viewed in the visit. The extra
       a.ts bounds are implied (a visit's pages come after it starts and
       within SESSION_MAX_MS) but let MySQL use the (path, ts) /
       (page_type, ts) indexes. */
    const endMs = (sqlUtcToMs(p.range.endUtc) ?? 0) + SESSION_MAX_MS
    const seqWindow = mode === 'from'
      ? 'p.seq >= x.aseq AND p.seq < x.aseq + ?'
      : 'p.seq <= x.aseq AND p.seq + ? > x.aseq' // not `x.aseq - ?`: UNSIGNED minus -> ER 1690 out of range
    raw = await anQuery(
      `SELECT x.id AS sid, x.started_at AS st, x.aseq, p.seq, p.${col} AS k
         FROM (SELECT s.id, s.started_at, MIN(a.seq) AS aseq
                 FROM an_sessions s
                 JOIN an_pageviews a ON a.session_id = s.id AND a.${col} = ? AND a.ts >= ? AND a.ts < ?
                WHERE ${cond.sql}
                GROUP BY s.id, s.started_at
                ORDER BY s.started_at DESC, s.id DESC
                LIMIT ?) x
         JOIN an_pageviews p ON p.session_id = x.id AND ${seqWindow}`,
      [anchor, p.range.startUtc, toSqlUtc(endMs), ...cond.params, SESSION_CAP + 1, rowsPerVisit],
    )
  }

  // Group rows per visit.
  const visits = new Map<number, VisitRows>()
  for (const r of raw) {
    const sid = num(r.sid)
    let v = visits.get(sid)
    if (!v) { v = { started: String(r.st ?? ''), aseq: num(r.aseq) || 1, rows: [] }; visits.set(sid, v) }
    if (r.seq != null && r.k != null) v.rows.push({ seq: num(r.seq), key: String(r.k) })
  }

  // Cap: keep the SESSION_CAP most recent visits (the query fetched one extra to detect it).
  let ids = [...visits.keys()]
  const sampled = ids.length > SESSION_CAP
  if (sampled) {
    ids.sort((a, b) => {
      const va = visits.get(a)!.started
      const vb = visits.get(b)!.started
      return va < vb ? 1 : va > vb ? -1 : b - a
    })
    ids = ids.slice(0, SESSION_CAP)
  }

  const trails: TrailToken[][] = []
  for (const id of ids) {
    const v = visits.get(id)!
    if (v.rows.length === 0) continue // pageviews pruned by retention
    v.rows.sort((a, b) => a.seq - b.seq)
    const keys = v.rows.map(r => r.key)
    if (mode === 'to') {
      // Reaches the landing page when the earliest page we hold is seq 1.
      trails.push(backwardTrail(keys, v.rows[0].seq === 1, steps, collapse))
    } else {
      /* We hold the visit up to its end when fewer rows came back than the
         fetch window allowed (the window starts at seq 1 or at the anchor). */
      const lastSeq = v.rows[v.rows.length - 1].seq
      const complete = lastSeq < v.aseq + rowsPerVisit - 1
      trails.push(forwardTrail(keys, complete, steps, collapse))
    }
  }

  // Every trail has at least its first column, so trails.length = visits in column 0 (or at the anchor).
  const { nodes, links } = buildFlowGraph(trails, width, nodeLabel(group))
  return { ...empty, totalSessions: trails.length, sampled, nodes, links }
}
