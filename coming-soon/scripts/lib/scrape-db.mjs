/**
 * MySQL connection helper for the scraper scripts.
 * One shared connection per script process. mysql2/promise.
 */
import mysql from 'mysql2/promise'

let connection = null

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
  }
  return connection
}

export async function closeDb() {
  if (connection) {
    await connection.end()
    connection = null
  }
}

/** SELECT helper — returns rows[]. */
export async function q(env, sql, params = []) {
  const db = await getDb(env)
  const [rows] = await db.execute(sql, params)
  return rows
}

/** SELECT one — returns first row or null. */
export async function q1(env, sql, params = []) {
  const rows = await q(env, sql, params)
  return rows[0] ?? null
}

/** INSERT / UPDATE / DELETE helper — returns { affectedRows, insertId }. */
export async function exec(env, sql, params = []) {
  const db = await getDb(env)
  const [result] = await db.execute(sql, params)
  return { affectedRows: result.affectedRows, insertId: result.insertId }
}
