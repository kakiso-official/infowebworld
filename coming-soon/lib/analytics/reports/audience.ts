import { anQuery, anQueryOne } from '../db'
import { NONE_VALUE, localTimeExpr, num, sessionConditions, type ReportParams } from '../query'
import type { AudienceReport } from '../types'
import { countryName, curWin, deviceLabel, languageName, plainLabel, sessionBreakdown } from './_shared'

/* ═══════════════════════════════════════════════════════════════════════════
   Audience: where visitors are, what they use, how often they come back and
   when (hour of the week in the viewer's timezone). All numbers are over
   visits started in the range, with the page filters applied.
   ═══════════════════════════════════════════════════════════════════════════ */

const LIST_LIMIT = 50
const FREQUENCY_BUCKETS = ['1', '2', '3-5', '6-10', '11+'] as const

export async function audienceReport(p: ReportParams): Promise<AudienceReport> {
  const f = p.filters
  const cur = curWin(p.range)
  const sc = sessionConditions(f, cur)
  const ses = (dims: string[], label: (k: string, parts: string[]) => string, extra?: (parts: string[]) => Record<string, string | null>) =>
    sessionBreakdown(f, cur, { dims, limit: LIST_LIMIT, label, extra })
  const cc = (v: string | undefined) => (v == null || v === NONE_VALUE ? null : v)
  const lt = localTimeExpr('s.started_at', p.range)

  const [
    countries, regions, cities, languages, devices, browsers, os, screens,
    newVsReturning, frequency, hours,
  ] = await Promise.all([
    ses(['s.country'], countryName),
    // Composite keys: the same region / city name can exist in several countries.
    ses(['s.country', 's.region'], plainLabel('(not set)'), parts => ({ country: cc(parts[0]) })),
    ses(['s.country', 's.region', 's.city'], plainLabel('(not set)'), parts => ({ country: cc(parts[0]), region: cc(parts[1]) })),
    // Primary language only ("en-US" and "en-GB" are both English).
    ses([`LOWER(SUBSTRING_INDEX(REPLACE(s.language, '_', '-'), '-', 1))`], languageName),
    ses(['s.device_type'], deviceLabel),
    ses(['s.browser'], plainLabel('Unknown')),
    ses(['s.os'], plainLabel('Unknown')),
    ses([`CONCAT(s.screen_w, 'x', s.screen_h)`], plainLabel('Unknown')),
    anQueryOne<{ nv: number; rv: number; ns: number; rs: number }>(
      `SELECT COUNT(DISTINCT IF(s.is_new = 1, s.visitor_id, NULL)) AS nv,
              COUNT(DISTINCT IF(s.is_new = 0, s.visitor_id, NULL)) AS rv,
              SUM(s.is_new = 1) AS ns,
              SUM(s.is_new = 0) AS rs
         FROM an_sessions s WHERE ${sc.sql}`,
      sc.params,
    ),
    // Visits per visitor inside the range.
    anQuery<{ bucket: string; visitors: number }>(
      `SELECT CASE WHEN x.c = 1 THEN '1' WHEN x.c = 2 THEN '2' WHEN x.c <= 5 THEN '3-5'
                   WHEN x.c <= 10 THEN '6-10' ELSE '11+' END AS bucket,
              COUNT(*) AS visitors
         FROM (SELECT s.visitor_id, COUNT(*) AS c FROM an_sessions s WHERE ${sc.sql} GROUP BY s.visitor_id) x
        GROUP BY bucket`,
      sc.params,
    ),
    anQuery<{ wd: number; h: number; n: number }>(
      `SELECT WEEKDAY(${lt.sql}) AS wd, HOUR(${lt.sql}) AS h, COUNT(*) AS n
         FROM an_sessions s WHERE ${sc.sql}
        GROUP BY wd, h`,
      [...lt.params, ...lt.params, ...sc.params],
    ),
  ])

  const freq = new Map(frequency.map(r => [String(r.bucket), num(r.visitors)]))
  const hourOfWeek = Array.from({ length: 7 }, () => new Array<number>(24).fill(0))
  for (const r of hours) {
    const wd = num(r.wd)
    const h = num(r.h)
    if (wd >= 0 && wd < 7 && h >= 0 && h < 24) hourOfWeek[wd][h] += num(r.n)
  }

  return {
    range: p.range,
    countries,
    regions,
    cities,
    languages,
    devices,
    browsers,
    os,
    screens,
    newVsReturning: {
      newVisitors: num(newVsReturning?.nv),
      returningVisitors: num(newVsReturning?.rv),
      newSessions: num(newVsReturning?.ns),
      returningSessions: num(newVsReturning?.rs),
    },
    frequency: FREQUENCY_BUCKETS.map(bucket => ({ bucket, visitors: freq.get(bucket) ?? 0 })),
    hourOfWeek,
  }
}
