import { anQuery, sqlUtcToMs, toSqlUtc } from '../db'
import {
  addDays, daysInclusive, localMidnightUtcMs, num, offsetSegments, sessionConditions,
  type ReportParams, type SqlPart,
} from '../query'
import type { RetentionReport } from '../types'

/* ═══════════════════════════════════════════════════════════════════════════
   Retention report (?weeks=4..12, default 8).

   Cohort = browsers whose FIRST visit was in a given local week (Monday
   start, in the viewer's timezone). returned[k-1] = how many of them had a
   visit in week k after their cohort week. Only weeks that have started
   by now are listed, so the newest cohorts have shorter rows.

   Cohort weeks: every week that overlaps the date range. The first cohort
   starts on the Monday on or before the range start so every cohort is a
   whole week and sizes compare fairly.

   Filters apply to the visitor's first visit ("visitors who first came from
   organic search" etc.); later visits count whatever they look like.
   ═══════════════════════════════════════════════════════════════════════════ */

function clampInt(raw: string | null, min: number, max: number, dflt: number): number {
  const n = Number.parseInt(raw ?? '', 10)
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : dflt
}

/** Monday on or before `date` ('YYYY-MM-DD'). */
function mondayOf(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  const wd = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7
  return addDays(date, -wd)
}

/**
 * SQL for "the local Monday (YYYY-MM-DD) of the week this UTC column falls in".
 * Like query.ts bucketExpr('week') but DST-aware over a custom span: the
 * visits looked at here run up to `weeks` past the end of the date range.
 */
function localWeekExpr(column: string, startMs: number, endMs: number, tz: string): SqlPart {
  const segs = offsetSegments(startMs, Math.max(endMs, startMs + 1), tz)
  let lt: SqlPart
  if (segs.length === 1) lt = { sql: `DATE_ADD(${column}, INTERVAL ? MINUTE)`, params: [segs[0].offset] }
  else {
    const parts: string[] = []
    const params: unknown[] = []
    for (const s of segs) {
      if (s.untilMs == null) { parts.push('ELSE ?'); params.push(s.offset) }
      else { parts.push(`WHEN ${column} < ? THEN ?`); params.push(toSqlUtc(s.untilMs), s.offset) }
    }
    lt = { sql: `DATE_ADD(${column}, INTERVAL (CASE ${parts.join(' ')} END) MINUTE)`, params }
  }
  return {
    sql: `DATE_FORMAT(DATE_SUB(DATE(${lt.sql}), INTERVAL WEEKDAY(${lt.sql}) DAY), '%Y-%m-%d')`,
    params: [...lt.params, ...lt.params],
  }
}

const fmtLabel = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
const fmtLabelYear = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

export async function retentionReport(p: ReportParams): Promise<RetentionReport> {
  const range = p.range
  const tz = range.tz
  const weeks = clampInt(p.sp.get('weeks'), 4, 12, 8)
  const nowMs = Date.now()

  // Cohort weeks overlapping the range (Mondays, local), oldest first.
  const firstMonday = mondayOf(range.from)
  const cohorts: string[] = []
  for (let d = firstMonday; d <= range.to; d = addDays(d, 7)) cohorts.push(d)

  const cohortStartMs = localMidnightUtcMs(firstMonday, tz)
  const cohortEndMs = sqlUtcToMs(range.endUtc) ?? nowMs
  // Visits that can count: from week 1 of the first cohort to week `weeks` of the last one (or now).
  const lastCohort = cohorts[cohorts.length - 1]
  const visitsStartMs = localMidnightUtcMs(addDays(firstMonday, 7), tz)
  const visitsEndMs = Math.min(nowMs + 1, localMidnightUtcMs(addDays(lastCohort, 7 * (weeks + 1)), tz))
  const exprEndMs = Math.max(visitsEndMs, cohortEndMs)

  const filters = Object.keys(p.filters).length > 0
  const fc = sessionConditions(p.filters, null, 'fs')
  const firstJoin = filters ? 'JOIN an_sessions fs ON fs.id = v.first_session_id' : ''
  const firstCond = filters ? ` AND ${fc.sql}` : ''
  const firstParams = filters ? fc.params : []

  const cw = localWeekExpr('v.first_seen_at', cohortStartMs, exprEndMs, tz)
  const sw = localWeekExpr('s.started_at', cohortStartMs, exprEndMs, tz)
  const cohortBounds = [toSqlUtc(cohortStartMs), range.endUtc]

  const [sizeRows, returnRows] = await Promise.all([
    anQuery(
      `SELECT ${cw.sql} AS c, COUNT(*) AS n
         FROM an_visitors v ${firstJoin}
        WHERE v.first_seen_at >= ? AND v.first_seen_at < ?${firstCond}
        GROUP BY c`,
      [...cw.params, ...cohortBounds, ...firstParams],
    ),
    visitsEndMs > visitsStartMs
      ? anQuery(
        `SELECT ${cw.sql} AS c, ${sw.sql} AS w, COUNT(DISTINCT v.id) AS n
           FROM an_visitors v
           JOIN an_sessions s ON s.visitor_id = v.id AND s.started_at >= ? AND s.started_at < ?
           ${firstJoin}
          WHERE v.first_seen_at >= ? AND v.first_seen_at < ?${firstCond}
          GROUP BY c, w`,
        [...cw.params, ...sw.params, toSqlUtc(visitsStartMs), toSqlUtc(visitsEndMs), ...cohortBounds, ...firstParams],
      )
      : Promise.resolve([] as Record<string, unknown>[]),
  ])

  const sizes = new Map(sizeRows.map(r => [String(r.c), num(r.n)]))
  const returned = new Map<string, number>() // `${cohort}|${k}`
  for (const r of returnRows) {
    const c = String(r.c)
    const k = Math.round((daysInclusive(c, String(r.w)) - 1) / 7)
    if (k >= 1 && k <= weeks) returned.set(`${c}|${k}`, num(r.n))
  }

  const multiYear = range.from.slice(0, 4) !== range.to.slice(0, 4)
  return {
    range,
    weeks,
    cohorts: cohorts.map(c => {
      const [y, m, d] = c.split('-').map(Number)
      const date = new Date(Date.UTC(y, m - 1, d))
      const row: number[] = []
      for (let k = 1; k <= weeks; k++) {
        // Week k must have started already (fully or partly elapsed).
        if (localMidnightUtcMs(addDays(c, 7 * k), tz) > nowMs) break
        row.push(returned.get(`${c}|${k}`) ?? 0)
      }
      return {
        cohort: c,
        label: (multiYear ? fmtLabelYear : fmtLabel).format(date),
        size: sizes.get(c) ?? 0,
        returned: row,
      }
    }),
  }
}
