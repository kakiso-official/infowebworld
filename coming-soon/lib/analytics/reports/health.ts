import type { NextRequest } from 'next/server'
import { AN_TABLES, anQuery, anQueryOne, missingAnalyticsTables, sqlUtcToIso } from '../db'
import { num } from '../query'
import {
  AN_IGNORE_COOKIE, RAW_RETENTION_DAYS, SESSION_RETENTION_DAYS, type HealthReport,
} from '../types'

/* ═══════════════════════════════════════════════════════════════════════════
   Tracking health (Settings page) + the "exclude this browser" action.

   healthReport must answer even before the migration has run - that is how
   the Settings page tells the admin to run it - so it never lets a "table
   doesn't exist" error escape (the API route would turn that into a 503).
   Every query is guarded on its own: one failing check shows as empty
   instead of hiding the rest.
   ═══════════════════════════════════════════════════════════════════════════ */

const ONE_YEAR_S = 365 * 24 * 60 * 60

/** Run a health query; any failure (missing table, timeout) -> fallback. */
async function guard<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    console.warn('[analytics] health check query failed:', err instanceof Error ? err.message : err)
    return fallback
  }
}

export async function healthReport(): Promise<HealthReport> {
  /* Not guarded: information_schema always exists, so a failure here is a
     real database problem and should surface as an error, not as
     "not installed". */
  const missingTables = await missingAnalyticsTables()
  const has = (t: string) => !missingTables.includes(t)
  const hasSessions = has('an_sessions')

  const [since, last24h, pv24h, ev24h, filtered7d, tables, geo] = await Promise.all([
    hasSessions
      ? guard(() => anQueryOne('SELECT MIN(started_at) AS since, MAX(last_seen_at) AS last_hit FROM an_sessions'), null)
      : null,
    hasSessions
      ? guard(() => anQueryOne(
        `SELECT COUNT(*) AS sessions, COUNT(DISTINCT visitor_id) AS visitors
           FROM an_sessions WHERE started_at >= UTC_TIMESTAMP(3) - INTERVAL 1 DAY`,
      ), null)
      : null,
    has('an_pageviews')
      ? guard(() => anQueryOne('SELECT COUNT(*) AS n FROM an_pageviews WHERE ts >= UTC_TIMESTAMP(3) - INTERVAL 1 DAY'), null)
      : null,
    has('an_events')
      ? guard(() => anQueryOne('SELECT COUNT(*) AS n FROM an_events WHERE ts >= UTC_TIMESTAMP(3) - INTERVAL 1 DAY'), null)
      : null,
    has('an_filtered_daily')
      ? guard(() => anQuery(
        `SELECT reason, SUM(hits) AS hits FROM an_filtered_daily
          WHERE day >= UTC_DATE() - INTERVAL 6 DAY
          GROUP BY reason ORDER BY hits DESC`,
      ), [])
      : [],
    guard(() => anQuery(
      `SELECT TABLE_NAME AS name, TABLE_ROWS AS row_count,
              ROUND((DATA_LENGTH + INDEX_LENGTH) / 1048576, 2) AS size_mb
         FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN (?)
        ORDER BY TABLE_NAME`,
      [AN_TABLES as unknown as string[]],
    ), []),
    /* Cloudflare always sends cf-ipcountry; city/region only arrive when the
       "Add visitor location headers" managed transform is on. EXISTS stops
       at the first matching visit. */
    hasSessions
      ? guard(() => anQueryOne(
        `SELECT EXISTS(SELECT 1 FROM an_sessions WHERE started_at >= UTC_TIMESTAMP(3) - INTERVAL 7 DAY AND country IS NOT NULL) AS country_hdr,
                EXISTS(SELECT 1 FROM an_sessions WHERE started_at >= UTC_TIMESTAMP(3) - INTERVAL 7 DAY AND city IS NOT NULL) AS city_hdr`,
      ), null)
      : null,
  ])

  return {
    installed: missingTables.length === 0,
    missingTables,
    trackingSince: sqlUtcToIso(since?.since as string | null),
    lastHitAt: sqlUtcToIso(since?.last_hit as string | null),
    last24h: {
      sessions: num(last24h?.sessions),
      pageviews: num(pv24h?.n),
      events: num(ev24h?.n),
      visitors: num(last24h?.visitors),
    },
    filtered7d: filtered7d.map(r => ({ reason: String(r.reason ?? ''), hits: num(r.hits) })),
    // TABLE_ROWS is InnoDB's estimate - good enough for "how big is it", not an exact count.
    tables: tables.map(r => ({ name: String(r.name ?? ''), rows: num(r.row_count), sizeMb: num(r.size_mb) })),
    geo: { countryHeader: num(geo?.country_hdr) === 1, cityHeader: num(geo?.city_hdr) === 1 },
    retention: { rawDays: RAW_RETENTION_DAYS, sessionDays: SESSION_RETENTION_DAYS },
  }
}

/**
 * POST /api/admin/analytics/exclude  body { exclude: boolean }
 * Sets (or clears) the cookie that makes the collector drop this browser's
 * hits. The admin cookie already excludes logged-in admin traffic; this
 * covers the admin's browser while logged out (and any other browser the
 * team wants to keep out of the numbers).
 */
export async function excludeAction(req: NextRequest): Promise<Response> {
  const headers = new Headers({ 'Cache-Control': 'private, no-store, max-age=0' })
  let body: unknown = null
  try {
    body = await req.json()
  } catch { /* handled below */ }
  const exclude = (body as { exclude?: unknown } | null)?.exclude
  if (typeof exclude !== 'boolean') {
    return Response.json({ ok: false, error: 'Body must be { "exclude": true | false }' }, { status: 400, headers })
  }

  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  headers.append(
    'Set-Cookie',
    exclude
      ? `${AN_IGNORE_COOKIE}=1; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=${ONE_YEAR_S}`
      : `${AN_IGNORE_COOKIE}=; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=0`,
  )
  return Response.json({ ok: true, excluded: exclude }, { headers })
}
