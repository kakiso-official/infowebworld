import { anExecute, isMissingTable, toSqlUtc } from './db'

/* ═══════════════════════════════════════════════════════════════════════════
   Process-wide state shared by the collector (/api/pulse), server events
   and maintenance:

   - the write gate: production only (local dev talks to the PRODUCTION
     database, so it writes nothing unless ANALYTICS_DEV_WRITE=1), and off
     for 5 minutes after a "table doesn't exist" error, so a deploy that
     lands before the migration costs one failed query per 5 minutes,
   - in-memory counters of hits we dropped on purpose, flushed to
     an_filtered_daily at most once a minute,
   - error logging throttled to one line per minute (a DB outage must not
     flood the container log).

   Kept on globalThis so every route bundle (and dev hot reloads) shares
   one copy instead of each holding its own counters and gate.
   ═══════════════════════════════════════════════════════════════════════════ */

const MISSING_TABLE_PAUSE_MS = 5 * 60_000
const FLUSH_EVERY_MS = 60_000
const LOG_EVERY_MS = 60_000

/** Why a hit was dropped (an_filtered_daily.reason). */
export type FilterReason = 'internal' | 'bot_ua' | 'rate_limited' | 'invalid' | 'overloaded'

interface CollectorState {
  pausedUntil: number
  lastLogAt: number
  suppressedLogs: number
  /** `${YYYY-MM-DD}|${reason}` -> hits */
  filtered: Map<string, number>
  lastFlushAt: number
  flushing: boolean
}

const STATE_KEY = Symbol.for('iww.analytics.collectorState')
const store = globalThis as unknown as Record<symbol, CollectorState | undefined>
const state: CollectorState = store[STATE_KEY] ??= {
  pausedUntil: 0,
  lastLogAt: 0,
  suppressedLogs: 0,
  filtered: new Map(),
  lastFlushAt: Date.now(),
  flushing: false,
}

/** True where analytics may write at all: production, or local dev that
    explicitly opted in (ANALYTICS_DEV_WRITE=1). */
export function analyticsEnvAllowsWrites(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.ANALYTICS_DEV_WRITE === '1'
}

/** True when a write should be attempted right now. */
export function analyticsWritable(): boolean {
  return analyticsEnvAllowsWrites() && Date.now() >= state.pausedUntil
}

/** Log at most one analytics error per minute (with a count of the rest). */
export function logAnalyticsError(context: string, err: unknown): void {
  const now = Date.now()
  if (now - state.lastLogAt < LOG_EVERY_MS) { state.suppressedLogs++; return }
  const extra = state.suppressedLogs ? ` (+${state.suppressedLogs} more since last log)` : ''
  state.lastLogAt = now
  state.suppressedLogs = 0
  const msg = err instanceof Error ? err.message : String(err)
  console.error(`[analytics] ${context}: ${msg}${extra}`)
}

/** Central handler for any DB error in the write path. Never throws.
    Missing an_* tables (migration not run yet) pause writes silently. */
export function handleAnalyticsDbError(context: string, err: unknown): void {
  if (isMissingTable(err)) {
    state.pausedUntil = Date.now() + MISSING_TABLE_PAUSE_MS
    return
  }
  logAnalyticsError(context, err)
}

/** Count dropped hits (in memory; flushed by flushFilteredCounts). */
export function countFiltered(reason: FilterReason, hits = 1): void {
  if (!analyticsEnvAllowsWrites() || hits <= 0) return
  const key = `${toSqlUtc(Date.now()).slice(0, 10)}|${reason}`
  state.filtered.set(key, (state.filtered.get(key) ?? 0) + hits)
}

/** Write the dropped-hit counters to an_filtered_daily, at most once per
    minute. Safe to call after every request; never throws. */
export async function flushFilteredCounts(): Promise<void> {
  const now = Date.now()
  if (state.flushing || !state.filtered.size || now - state.lastFlushAt < FLUSH_EVERY_MS) return
  if (!analyticsWritable()) {
    /* Writes paused (missing tables): forget the counts rather than let
       them pile up until the migration runs. */
    if (analyticsEnvAllowsWrites()) state.filtered.clear()
    return
  }
  state.flushing = true
  state.lastFlushAt = now
  const snapshot = [...state.filtered.entries()]
  state.filtered.clear()
  try {
    const rows = snapshot.map(([key, hits]) => {
      const [day, reason] = key.split('|')
      return [day, reason, Math.min(hits, 4_000_000_000)]
    })
    await anExecute(
      `INSERT INTO an_filtered_daily (day, reason, hits) VALUES ?
       ON DUPLICATE KEY UPDATE hits = hits + VALUES(hits)`,
      [rows],
    )
  } catch (err) {
    handleAnalyticsDbError('filtered counts', err)
    /* Transient failure: put the counts back for the next flush. */
    if (!isMissingTable(err)) {
      for (const [key, hits] of snapshot) state.filtered.set(key, (state.filtered.get(key) ?? 0) + hits)
    }
  } finally {
    state.flushing = false
  }
}
