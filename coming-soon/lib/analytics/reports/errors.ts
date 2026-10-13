import { anQuery, sqlUtcToIso } from '../db'
import { bucketExpr, bucketKeys, eventConditions, num, pageviewConditions, type ReportParams } from '../query'
import type { ErrorsReport, Filters } from '../types'
import { and, cond, curWin, str, type Win } from './_shared'

/* ═══════════════════════════════════════════════════════════════════════════
   Errors: "page not found" views grouped by URL with where the broken link
   is (an internal page of ours -> fixable, an external site, or nothing),
   JavaScript errors grouped by message, and both per bucket.
   ═══════════════════════════════════════════════════════════════════════════ */

const NOT_FOUND_LIMIT = 100
const REFERRERS_PER_PATH = 5
const JS_ERROR_LIMIT = 50
/** GROUP_CONCAT separator (never in a path or browser name). */
const SEP = '|~|'
/** MySQL's default group_concat_max_len; a list this long may end in a cut-off item. */
const GROUP_CONCAT_MAX = 1024

const OWN_HOST_RE = /(^|\.)infowebworld\.com$/i

export async function errorsReport(p: ReportParams): Promise<ErrorsReport> {
  const f = p.filters
  const cur = curWin(p.range)

  const [notFoundRows, jsRows, nfSeries, jsSeries] = await Promise.all([
    notFoundPaths(f, cur),
    jsErrors(f, cur),
    notFoundPerBucket(p),
    jsErrorsPerBucket(p),
  ])
  const referrers = await notFoundReferrers(f, cur, notFoundRows.map(r => String(r.k)))

  const nf = new Map(nfSeries.map(r => [String(r.b), num(r.n)]))
  const js = new Map(jsSeries.map(r => [String(r.b), num(r.n)]))

  return {
    range: p.range,
    notFound: notFoundRows.map(r => ({
      path: String(r.k),
      hits: num(r.hits),
      visitors: num(r.visitors),
      lastSeen: sqlUtcToIso(r.last_at) ?? '',
      referrers: referrers.get(String(r.k)) ?? [],
    })),
    jsErrors: jsRows.map(r => ({
      message: String(r.k),
      hits: num(r.hits),
      sessions: num(r.sess),
      pages: splitList(r.pages),
      browsers: splitList(r.browsers),
      lastSeen: sqlUtcToIso(r.last_at) ?? '',
    })),
    series: bucketKeys(p.range).map(({ t, label }) => ({ t, label, notFound: nf.get(t) ?? 0, jsErrors: js.get(t) ?? 0 })),
  }
}

async function notFoundPaths(f: Filters, win: Win) {
  const pc = pageviewConditions(f, win)
  const c = and(pc, cond('p.status = 404'))
  return anQuery<{ k: string; hits: number; visitors: number; last_at: string }>(
    `SELECT p.path AS k, COUNT(*) AS hits, COUNT(DISTINCT p.visitor_id) AS visitors, MAX(p.ts) AS last_at
       FROM an_pageviews p ${pc.needsSessionJoin ? 'JOIN an_sessions s ON s.id = p.session_id' : ''}
      WHERE ${c.sql}
      GROUP BY p.path
      ORDER BY hits DESC, last_at DESC
      LIMIT ${NOT_FOUND_LIMIT}`,
    c.params,
  )
}

/**
 * Where each 404 view came from:
 *  - an earlier page of the same visit (prev_path) -> an internal link we can fix,
 *  - else, for the landing view, the visit's referrer host -> an external link,
 *  - else '(direct)' (typed, bookmarked, or the referrer was hidden).
 * The visit is only needed for landing views, so without visit filters it is
 * LEFT JOINed for seq = 1 rows only.
 */
async function notFoundReferrers(
  f: Filters, win: Win, paths: string[],
): Promise<Map<string, ErrorsReport['notFound'][number]['referrers']>> {
  const out = new Map<string, ErrorsReport['notFound'][number]['referrers']>()
  if (!paths.length) return out
  const pc = pageviewConditions(f, win)
  const join = pc.needsSessionJoin
    ? 'JOIN an_sessions s ON s.id = p.session_id'
    : 'LEFT JOIN an_sessions s ON s.id = p.session_id AND p.seq = 1'
  const c = and(pc, cond('p.status = 404'), cond('p.path IN (?)', paths))
  const rows = await anQuery<{ pth: string; k: string; via_page: number; hits: number }>(
    `SELECT p.path AS pth,
            CASE WHEN p.prev_path IS NOT NULL THEN p.prev_path
                 WHEN s.referrer_host IS NOT NULL AND s.referrer_host <> '' THEN s.referrer_host
                 ELSE '(direct)' END AS k,
            (p.prev_path IS NOT NULL) AS via_page,
            COUNT(*) AS hits
       FROM an_pageviews p ${join}
      WHERE ${c.sql}
      GROUP BY p.path, k, via_page
      ORDER BY hits DESC`,
    c.params,
  )
  for (const r of rows) {
    const path = String(r.pth)
    const list = out.get(path) ?? []
    if (!out.has(path)) out.set(path, list)
    if (list.length >= REFERRERS_PER_PATH) continue
    const key = String(r.k)
    const viaPage = num(r.via_page) === 1
    // A landing view referred by our own domain (an old tab, another subdomain) is still our link.
    const internal = viaPage || (key !== '(direct)' && OWN_HOST_RE.test(key))
    list.push({
      key,
      // internal: key/label = the page of ours that links to the broken URL.
      label: key === '(direct)' ? 'Direct / unknown' : key,
      hits: num(r.hits),
      internal,
    })
  }
  return out
}

async function jsErrors(f: Filters, win: Win) {
  const ec = eventConditions(f, win)
  // The visit is needed for the browser list; inner join only when filters require it.
  const join = ec.needsSessionJoin ? 'JOIN an_sessions s ON s.id = e.session_id' : 'LEFT JOIN an_sessions s ON s.id = e.session_id'
  const c = and(ec, cond(`e.name = 'js_error'`))
  return anQuery<{ k: string; hits: number; sess: number; pages: string | null; browsers: string | null; last_at: string }>(
    `SELECT COALESCE(NULLIF(e.label, ''), '(no message)') AS k,
            COUNT(*) AS hits,
            COUNT(DISTINCT e.session_id) AS sess,
            GROUP_CONCAT(DISTINCT e.path ORDER BY e.path SEPARATOR '${SEP}') AS pages,
            GROUP_CONCAT(DISTINCT s.browser ORDER BY s.browser SEPARATOR '${SEP}') AS browsers,
            MAX(e.ts) AS last_at
       FROM an_events e ${join}
      WHERE ${c.sql}
      GROUP BY k
      ORDER BY hits DESC, last_at DESC
      LIMIT ${JS_ERROR_LIMIT}`,
    c.params,
  )
}

/** First items of a GROUP_CONCAT list; drops a last item that may have been cut at the length limit. */
function splitList(v: string | null, max = 10): string[] {
  const s = str(v)
  if (!s) return []
  const items = s.split(SEP).filter(Boolean)
  if (Buffer.byteLength(s, 'utf8') >= GROUP_CONCAT_MAX - 1 && items.length > 1) items.pop()
  return items.slice(0, max)
}

async function notFoundPerBucket(p: ReportParams) {
  const b = bucketExpr('p.ts', p.range)
  const pc = pageviewConditions(p.filters, curWin(p.range))
  const c = and(pc, cond('p.status = 404'))
  return anQuery<{ b: string; n: number }>(
    `SELECT ${b.sql} AS b, COUNT(*) AS n
       FROM an_pageviews p ${pc.needsSessionJoin ? 'JOIN an_sessions s ON s.id = p.session_id' : ''}
      WHERE ${c.sql}
      GROUP BY b`,
    [...b.params, ...c.params],
  )
}

async function jsErrorsPerBucket(p: ReportParams) {
  const b = bucketExpr('e.ts', p.range)
  const ec = eventConditions(p.filters, curWin(p.range))
  const c = and(ec, cond(`e.name = 'js_error'`))
  return anQuery<{ b: string; n: number }>(
    `SELECT ${b.sql} AS b, COUNT(*) AS n
       FROM an_events e ${ec.needsSessionJoin ? 'JOIN an_sessions s ON s.id = e.session_id' : ''}
      WHERE ${c.sql}
      GROUP BY b`,
    [...b.params, ...c.params],
  )
}
