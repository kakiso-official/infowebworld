import { anQuery } from '../db'
import { bucketExpr, bucketKeys, pageviewConditions, type ReportParams } from '../query'
import type { PageType, PerformanceReport, VitalsSummary } from '../types'
import {
  VITALS_ANY_SQL, VITALS_ROW_CAP, and, asPageType, cond, curWin, latestSql, p75, pageTypeLabel, str,
  summarizeVitals, vitalValues, type VitalSample,
} from './_shared'

/* ═══════════════════════════════════════════════════════════════════════════
   Core Web Vitals (real visitors, hard page loads only). One query fetches
   the newest VITALS_ROW_CAP pageviews that carry any vital - each row holds
   all five metrics, so every metric gets at most that many samples - and
   the 75th percentiles are computed here (MySQL 8 has no percentile
   aggregate). Shares good / needs improvement / poor use Google's lines.
   ═══════════════════════════════════════════════════════════════════════════ */

const SLOWEST_LIMIT = 20
/** A page needs this many LCP samples to be ranked (when enough pages have them). */
const SLOW_MIN_SAMPLES = 3

interface Row extends VitalSample { b: string; page_type: string; path: string }

export async function performanceReport(p: ReportParams): Promise<PerformanceReport> {
  const cur = curWin(p.range)
  const pc = pageviewConditions(p.filters, cur)
  const c = and(pc, cond(VITALS_ANY_SQL))
  const b = bucketExpr('p.ts', p.range)

  const rows = await anQuery<Row>(
    `SELECT ${b.sql} AS b, p.page_type, p.path, p.lcp_ms, p.inp_ms, p.cls, p.fcp_ms, p.ttfb_ms
       FROM an_pageviews p ${pc.needsSessionJoin ? 'JOIN an_sessions s ON s.id = p.session_id' : ''}
      WHERE ${c.sql}
      ORDER BY p.ts DESC
      LIMIT ${VITALS_ROW_CAP}`,
    [...b.params, ...c.params],
  )

  const byType = groupBy(rows, r => asPageType(r.page_type))
  const byPath = groupBy(rows, r => String(r.path))
  const byBucket = groupBy(rows, r => String(r.b))

  const byPageType = [...byType.entries()]
    .map(([key, list]): VitalsSummary & { key: PageType; label: string } => ({ key, label: pageTypeLabel(key), ...summarizeVitals(list) }))
    .sort((x, y) => y.samples - x.samples)

  // Slowest pages by LCP p75; pages with too few samples would rank on luck.
  const ranked = [...byPath.entries()].map(([path, list]) => {
    const lcp = vitalValues(list, 'lcp')
    return { path, list, lcpN: lcp.length, lcpP75: p75(lcp) }
  }).filter(x => x.lcpP75 != null)
  const minN = ranked.some(x => x.lcpN >= SLOW_MIN_SAMPLES) ? SLOW_MIN_SAMPLES : 1
  const slow = ranked
    .filter(x => x.lcpN >= minN)
    .sort((x, y) => (y.lcpP75 ?? 0) - (x.lcpP75 ?? 0) || y.lcpN - x.lcpN)
    .slice(0, SLOWEST_LIMIT)
  const titles = await latestTitles(cur.startUtc, cur.endUtc, slow.map(x => x.path))

  return {
    range: p.range,
    overall: summarizeVitals(rows),
    byPageType,
    slowestPages: slow.map(x => ({ path: x.path, title: titles.get(x.path) ?? null, ...summarizeVitals(x.list) })),
    series: bucketKeys(p.range).map(({ t, label }) => {
      const list = byBucket.get(t) ?? []
      const cls = p75(vitalValues(list, 'cls'))
      const lcp = p75(vitalValues(list, 'lcp'))
      const inp = p75(vitalValues(list, 'inp'))
      return {
        t,
        label,
        lcp: lcp == null ? null : Math.round(lcp),
        inp: inp == null ? null : Math.round(inp),
        cls: cls == null ? null : Math.round(cls * 1000) / 1000,
      }
    }),
  }
}

function groupBy<T, K>(rows: T[], key: (r: T) => K): Map<K, T[]> {
  const out = new Map<K, T[]>()
  for (const r of rows) {
    const k = key(r)
    const list = out.get(k)
    if (list) list.push(r)
    else out.set(k, [r])
  }
  return out
}

async function latestTitles(startUtc: string, endUtc: string, paths: string[]): Promise<Map<string, string | null>> {
  if (!paths.length) return new Map()
  const rows = await anQuery<{ k: string; title: string | null }>(
    `SELECT p.path AS k, ${latestSql(`NULLIF(p.title, '')`, 'p.ts')} AS title
       FROM an_pageviews p
      WHERE p.path IN (?) AND p.ts >= ? AND p.ts < ?
      GROUP BY p.path`,
    [paths, startUtc, endUtc],
  )
  return new Map(rows.map(r => [String(r.k), str(r.title)]))
}
