import { ENGAGED_SESSION_MS, SESSION_MAX_MS, SESSION_TIMEOUT_MS } from './types'

/* ═══════════════════════════════════════════════════════════════════════════
   SQL fragments for UPDATE an_sessions, shared by the collector and server
   events so both apply exactly the same session rules.

   MySQL applies SET assignments left to right and later expressions see
   the new values, so put these AFTER the counters they depend on
   (pageviews, engaged_ms, key_events, last_seen_at).
   ═══════════════════════════════════════════════════════════════════════════ */

/** Engaged = 10 s+ of active time, 2+ pages, or any key action. */
export const ENGAGED_SQL = `is_engaged = (engaged_ms >= ${ENGAGED_SESSION_MS} OR pageviews >= 2 OR key_events > 0)`

/** Wall-clock length of the visit (INT UNSIGNED, never negative). */
export const DURATION_SQL =
  'duration_ms = LEAST(GREATEST(TIMESTAMPDIFF(MICROSECOND, started_at, last_seen_at) DIV 1000, 0), 4294967295)'

/** Activity that isn't a pageview (heartbeat, click, server conversion)
    keeps a visit alive only while the visit is still open: a click on a tab
    left idle overnight is recorded on its old visit but doesn't stretch
    that visit to 14 hours. Takes 3 params: the hit time (SQL UTC), 3 times. */
export const EXTEND_LAST_SEEN_SQL =
  `last_seen_at = IF(TIMESTAMPDIFF(MICROSECOND, last_seen_at, ?) BETWEEN 1 AND ${SESSION_TIMEOUT_MS * 1000}
                     AND TIMESTAMPDIFF(MICROSECOND, started_at, ?) < ${SESSION_MAX_MS * 1000}, ?, last_seen_at)`

/** Session flag columns an event may set (whitelist: the name goes into SQL). */
const FLAG_COLUMNS: ReadonlySet<string> = new Set(['did_signup', 'did_login', 'did_listing', 'did_lead', 'did_outbound'])

/** ', did_x = 1' for a valid flag, else ''. */
export function flagSql(flag: string | undefined): string {
  return flag && FLAG_COLUMNS.has(flag) ? `, ${flag} = 1` : ''
}
