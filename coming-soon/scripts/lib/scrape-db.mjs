/**
 * MySQL connection helper for the scraper scripts.
 *
 * One cached connection per script process. mysql2/promise.
 *
 * Transient connection errors (PROTOCOL_CONNECTION_LOST, ECONNRESET, etc.)
 * cause the cached connection to be discarded and recreated on the next
 * call. Without this the long-running worker would crash the first time
 * the DB blinks (cPanel mysqld restarts overnight, brief network hiccup,
 * idle timeout). The retry is bounded — query-level errors propagate.
 */
import mysql from 'mysql2/promise'

let connection = null

/* Errors that mean "the connection is dead, throw it away and reopen"
   rather than "the query itself failed". Anything not in this list
   bubbles up immediately so we don't hide real bugs behind retries. */
const RECONNECT_CODES = new Set([
  'PROTOCOL_CONNECTION_LOST',
  'ECONNRESET',
  'ECONNREFUSED',
  'EPIPE',
  'ETIMEDOUT',
  'ER_SERVER_SHUTDOWN',
  'ER_QUERY_INTERRUPTED',
])

function isConnectionError(err) {
  if (!err) return false
  if (RECONNECT_CODES.has(err.code)) return true
  if (err.fatal === true) return true
  const msg = String(err.message || '')
  return /connection.*(lost|closed|timeout)/i.test(msg)
}

export async function getDb(env) {
  if (!connection) {
    connection = await mysql.createConnection({
      host: env.DATABASE_HOST,
      port: Number(env.DATABASE_PORT || 3306),
      database: env.DATABASE_NAME,
      user: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      ssl: env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      multipleStatements: false,
      dateStrings: true,
    })
    /* If mysql2 detects a fatal error on the connection it'll emit 'error'
       — make sure we drop the cached handle so the next call reconnects
       cleanly instead of reusing a corpse. */
    connection.on('error', () => { connection = null })
  }
  return connection
}

export async function closeDb() {
  if (connection) {
    try { await connection.end() } catch {}
    connection = null
  }
}

async function withReconnect(env, fn, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const db = await getDb(env)
      return await fn(db)
    } catch (err) {
      if (attempt < retries && isConnectionError(err)) {
        /* Tear down the cached connection so the next iteration reopens.
           Short sleep so we don't hammer a recovering server. */
        try { await connection?.end?.() } catch {}
        connection = null
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
        continue
      }
      throw err
    }
  }
  /* Unreachable, but keeps the compiler happy. */
  throw new Error('scrape-db: withReconnect exhausted')
}

/** SELECT helper — returns rows[]. */
export async function q(env, sql, params = []) {
  return withReconnect(env, async db => {
    const [rows] = await db.execute(sql, params)
    return rows
  })
}

/** SELECT one — returns first row or null. */
export async function q1(env, sql, params = []) {
  const rows = await q(env, sql, params)
  return rows[0] ?? null
}

/** INSERT / UPDATE / DELETE helper — returns { affectedRows, insertId }. */
export async function exec(env, sql, params = []) {
  return withReconnect(env, async db => {
    const [result] = await db.execute(sql, params)
    return { affectedRows: result.affectedRows, insertId: result.insertId }
  })
}
