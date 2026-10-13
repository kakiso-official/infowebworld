import mysql, { type ResultSetHeader, type RowDataPacket } from 'mysql2/promise'
import { RAW_RETENTION_DAYS, SESSION_RETENTION_DAYS } from './types'
import { analyticsWritable, handleAnalyticsDbError } from './collector-state'

/* ═══════════════════════════════════════════════════════════════════════════
   Retention cleanup for the an_* tables, triggered opportunistically by
   the collector (no cron to maintain):

     an_pageviews, an_events   older than RAW_RETENTION_DAYS (400)
     an_sessions               older than SESSION_RETENTION_DAYS (760)
     an_filtered_daily         older than 400 days
     an_visitors               kept forever

   At most once per 6 h per process, and across processes (a rolling
   deploy briefly runs two containers) only the holder of the MySQL named
   lock 'iww_an_maint' works. Deletes go in batches of 5 000 rows with a
   short pause between them, max 200 batches per run, so a cleanup never
   holds long row locks against the collector's inserts.

   Why its own short-lived connection instead of the analytics pool:
   GET_LOCK / RELEASE_LOCK belong to one MySQL session, and a pool hands
   each query to whichever connection is free - the release could land on
   another connection and leave the lock held by an idle one for hours.
   One extra connection for a few seconds every 6 h is well inside the
   50-connection cap, and the cleanup never takes a pool slot the
   collector needs.
   ═══════════════════════════════════════════════════════════════════════════ */

const RUN_EVERY_MS = 6 * 60 * 60 * 1000
/* First run 10 minutes after the process starts, not on the first request
   after a deploy. */
const FIRST_RUN_DELAY_MS = 10 * 60 * 1000
const BATCH_ROWS = 5_000
const MAX_BATCHES_PER_RUN = 200
const PAUSE_BETWEEN_BATCHES_MS = 150
const FILTERED_RETENTION_DAYS = 400
const LOCK_NAME = 'iww_an_maint'

interface MaintenanceState { lastRunAt: number; running: boolean }
const STATE_KEY = Symbol.for('iww.analytics.maintenance')
const store = globalThis as unknown as Record<symbol, MaintenanceState | undefined>
const state: MaintenanceState = store[STATE_KEY] ??= {
  lastRunAt: Date.now() - RUN_EVERY_MS + FIRST_RUN_DELAY_MS,
  running: false,
}

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

/** Run the retention cleanup if it is due. Cheap no-op otherwise; never throws. */
export async function maybeRunMaintenance(): Promise<void> {
  if (state.running || Date.now() - state.lastRunAt < RUN_EVERY_MS || !analyticsWritable()) return
  state.running = true
  state.lastRunAt = Date.now()
  try {
    await runMaintenance()
  } catch (err) {
    handleAnalyticsDbError('maintenance', err)
  } finally {
    state.running = false
  }
}

type Conn = Awaited<ReturnType<typeof mysql.createConnection>>

async function runMaintenance(): Promise<void> {
  const conn = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT || 3306),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    connectTimeout: 10_000,
    timezone: 'Z',
    dateStrings: true,
    supportBigNumbers: true,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  })
  try {
    const [lock] = await conn.query<RowDataPacket[]>('SELECT GET_LOCK(?, 0) AS got', [LOCK_NAME])
    if (Number(lock[0]?.got) !== 1) return       // another process is cleaning up
    try {
      let budget = MAX_BATCHES_PER_RUN
      budget = await purgeOlderThan(conn, 'an_pageviews', 'ts', RAW_RETENTION_DAYS, budget)
      budget = await purgeOlderThan(conn, 'an_events', 'ts', RAW_RETENTION_DAYS, budget)
      await purgeOlderThan(conn, 'an_sessions', 'started_at', SESSION_RETENTION_DAYS, budget)
      await conn.query(
        'DELETE FROM an_filtered_daily WHERE day < UTC_DATE() - INTERVAL ? DAY',
        [FILTERED_RETENTION_DAYS],
      )
    } finally {
      await conn.query('SELECT RELEASE_LOCK(?)', [LOCK_NAME])
    }
  } finally {
    await conn.end().catch(() => conn.destroy())
  }
}

/** Delete rows of `table` whose `column` is older than `days`, in id-ordered
    batches. Returns the batch budget left.

    The newest expired row's id is found first through the time index, and
    every DELETE is bounded by `id <= that id`: a primary-key range that
    stops at the boundary, instead of an ORDER BY id scan that would walk
    the whole table once nothing old is left. Rows written out of order
    (hit time up to an hour before insert) are caught by the next run. */
async function purgeOlderThan(conn: Conn, table: string, column: string, days: number, budget: number): Promise<number> {
  if (budget <= 0) return 0
  const [rows] = await conn.query<RowDataPacket[]>(
    `SELECT id FROM ${table} WHERE ${column} < UTC_TIMESTAMP(3) - INTERVAL ? DAY ORDER BY ${column} DESC LIMIT 1`,
    [days],
  )
  if (!rows.length) return budget
  const maxId = Number(rows[0].id)
  while (budget > 0) {
    const [res] = await conn.query<ResultSetHeader>(
      `DELETE FROM ${table}
        WHERE id <= ? AND ${column} < UTC_TIMESTAMP(3) - INTERVAL ? DAY
        ORDER BY id LIMIT ${BATCH_ROWS}`,
      [maxId, days],
    )
    budget--
    if (res.affectedRows < BATCH_ROWS) break
    await sleep(PAUSE_BETWEEN_BATCHES_MS)
  }
  return budget
}
