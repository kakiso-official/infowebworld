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
      connectionLimit: 5,
      waitForConnections: true,
      connectTimeout: 10000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    })
  }
  return pool
}

export { getPool as default }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Params = any[]

export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: Params
): Promise<T[]> {
  const [rows] = await getPool().execute<RowDataPacket[]>(sql, params)
  return rows as T[]
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
  const [result] = await getPool().execute<ResultSetHeader>(sql, params)
  return { affectedRows: result.affectedRows, insertId: result.insertId }
}
