import mysql, { type RowDataPacket, type ResultSetHeader } from 'mysql2/promise'

let pool: ReturnType<typeof mysql.createPool>

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT || 3306),
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      connectionLimit: 2,
      waitForConnections: true,
      queueLimit: 50,
      connectTimeout: 10000,
      enableKeepAlive: false,
      idleTimeout: 30000,
      maxIdle: 1,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    })
  }
  return pool
}

export { getPool as default }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Params = any[]

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      // Retry on connection errors
      if (i < retries && (msg.includes('max_user_connections') || msg.includes('ECONNREFUSED') || msg.includes('ETIMEDOUT') || msg.includes('PROTOCOL_CONNECTION_LOST'))) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)))
        continue
      }
      throw err
    }
  }
  throw new Error('DB: max retries exceeded')
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: Params
): Promise<T[]> {
  return withRetry(async () => {
    const [rows] = await getPool().execute<RowDataPacket[]>(sql, params)
    return rows as T[]
  })
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params?: Params
): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] ?? null
}

export async function execute(
  sql: string,
  params?: Params
): Promise<{ affectedRows: number; insertId: number }> {
  return withRetry(async () => {
    const [result] = await getPool().execute<ResultSetHeader>(sql, params)
    return { affectedRows: result.affectedRows, insertId: result.insertId }
  })
}
