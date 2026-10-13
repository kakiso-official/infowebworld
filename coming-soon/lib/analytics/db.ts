import mysql, { type ResultSetHeader } from 'mysql2/promise'

/* ═══════════════════════════════════════════════════════════════════════════
   Analytics database access - a SEPARATE, small pool.

   Why a second pool:
   - Isolation: tracking writes and admin reports can use at most
     AN_POOL_LIMIT connections, so a traffic burst can never starve the page
     renders that share lib/db.ts (cPanel caps the user at 50 connections;
     the main pool is 8, this one is 3).
   - Correct time handling: timezone 'Z' + dateStrings means DATETIME values
     go in and come out as UTC strings, no matter what timezone the Node
     process or the MySQL server runs in.
   - decimalNumbers: SUM()/AVG() come back as numbers, not strings.

   Uses pool.query (text protocol, client-side escaping), not execute:
   - `IN (?)` expands arrays, LIMIT ? works, no prepared-statement cache
     growth from the many dynamic report queries.
   ═══════════════════════════════════════════════════════════════════════════ */

const AN_POOL_LIMIT = 3

type Pool = ReturnType<typeof mysql.createPool>
let pool: Pool | null = null

function getAnPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT || 3306),
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      connectionLimit: AN_POOL_LIMIT,
      waitForConnections: true,
      queueLimit: 2000,
      connectTimeout: 10000,
      enableKeepAlive: false,
      idleTimeout: 30000,
      maxIdle: 1,
      timezone: 'Z',
      dateStrings: true,
      decimalNumbers: true,
      supportBigNumbers: true,
      bigNumberStrings: false,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    })
  }
  return pool
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Params = any[]

const RETRYABLE = /max_user_connections|ECONNREFUSED|ETIMEDOUT|PROTOCOL_CONNECTION_LOST|ECONNRESET/

async function withRetry<T>(fn: () => Promise<T>, retries = 1): Promise<T> {
  for (let i = 0; ; i++) {
    try {
      return await fn()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (i < retries && RETRYABLE.test(msg)) {
        await new Promise(r => setTimeout(r, 750 * (i + 1)))
        continue
      }
      throw err
    }
  }
}

export async function anQuery<T = Record<string, unknown>>(sql: string, params: Params = []): Promise<T[]> {
  return withRetry(async () => {
    const [rows] = await getAnPool().query(sql, params)
    return rows as T[]
  })
}

export async function anQueryOne<T = Record<string, unknown>>(sql: string, params: Params = []): Promise<T | null> {
  const rows = await anQuery<T>(sql, params)
  return rows[0] ?? null
}

export async function anExecute(sql: string, params: Params = []): Promise<{ affectedRows: number; insertId: number }> {
  return withRetry(async () => {
    const [result] = await getAnPool().query<ResultSetHeader>(sql, params)
    return { affectedRows: result.affectedRows, insertId: Number(result.insertId) }
  })
}

/* ── Tables + "migration not run yet" detection ─────────────────────────── */

export const AN_TABLES = ['an_visitors', 'an_sessions', 'an_pageviews', 'an_events', 'an_filtered_daily'] as const

/** True for MySQL "table doesn't exist" (ER_NO_SUCH_TABLE, errno 1146). */
export function isMissingTable(err: unknown): boolean {
  const e = err as { errno?: number; code?: string; message?: string } | null
  if (!e) return false
  return e.errno === 1146 || e.code === 'ER_NO_SUCH_TABLE' || /doesn't exist/i.test(e.message || '')
}

/** Which an_* tables are missing (empty array = migration has run). Cached 60s. */
let missingCache: { at: number; missing: string[] } | null = null
export async function missingAnalyticsTables(): Promise<string[]> {
  if (missingCache && Date.now() - missingCache.at < 60_000) return missingCache.missing
  const rows = await anQuery<{ name: string }>(
    `SELECT TABLE_NAME AS name FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN (?)`,
    [AN_TABLES as unknown as string[]],
  )
  const present = new Set(rows.map(r => r.name))
  const missing = AN_TABLES.filter(t => !present.has(t))
  missingCache = { at: Date.now(), missing }
  return missing
}

/* ── UTC time helpers (every an_* timestamp is UTC DATETIME(3)) ─────────── */

const pad = (n: number, w = 2) => String(n).padStart(w, '0')

/** Date -> 'YYYY-MM-DD HH:MM:SS.mmm' (UTC), ready for a DATETIME(3) column. */
export function toSqlUtc(d: Date | number): string {
  const x = typeof d === 'number' ? new Date(d) : d
  return `${x.getUTCFullYear()}-${pad(x.getUTCMonth() + 1)}-${pad(x.getUTCDate())} ` +
    `${pad(x.getUTCHours())}:${pad(x.getUTCMinutes())}:${pad(x.getUTCSeconds())}.${pad(x.getUTCMilliseconds(), 3)}`
}

/** 'YYYY-MM-DD HH:MM:SS[.mmm]' (UTC, as returned with dateStrings) -> ISO 8601 'Z'. */
export function sqlUtcToIso(s: string | null | undefined): string | null {
  if (!s) return null
  const [date, time = '00:00:00'] = String(s).split(' ')
  const [hms, ms = '0'] = time.split('.')
  return `${date}T${hms}.${ms.padEnd(3, '0').slice(0, 3)}Z`
}

/** 'YYYY-MM-DD HH:MM:SS[.mmm]' UTC -> epoch ms. */
export function sqlUtcToMs(s: string | null | undefined): number | null {
  const iso = sqlUtcToIso(s)
  return iso ? Date.parse(iso) : null
}

/* ── Server-local time (for older tables like business_users.created_at,
      which use MySQL's own clock, not UTC) ──────────────────────────────── */

let serverOffset: { at: number; minutes: number } | null = null
/** Minutes to ADD to a UTC time to get MySQL's NOW() clock. Cached 1h. */
export async function mysqlServerOffsetMinutes(): Promise<number> {
  if (serverOffset && Date.now() - serverOffset.at < 3_600_000) return serverOffset.minutes
  const row = await anQueryOne<{ m: number }>('SELECT TIMESTAMPDIFF(MINUTE, UTC_TIMESTAMP(), NOW()) AS m')
  const minutes = Math.round(Number(row?.m ?? 0) / 15) * 15
  serverOffset = { at: Date.now(), minutes }
  return minutes
}

/** UTC SQL time -> the same instant on MySQL's NOW() clock (SQL string). */
export async function utcToServerLocal(sqlUtc: string): Promise<string> {
  const ms = sqlUtcToMs(sqlUtc) ?? Date.now()
  const off = await mysqlServerOffsetMinutes()
  return toSqlUtc(ms + off * 60_000).slice(0, 19)
}
