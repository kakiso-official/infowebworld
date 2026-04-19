import { readFileSync } from 'node:fs'
import mysql from 'mysql2/promise'

const env = {}
const raw = readFileSync('.env.local', 'utf8')
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (!m) continue
  let v = m[2]
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1)
  }
  env[m[1]] = v
}

const conn = await mysql.createConnection({
  host: env.DATABASE_HOST,
  port: Number(env.DATABASE_PORT || 3306),
  database: env.DATABASE_NAME,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  ssl: env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
})

const uuid = '220da9cd-313b-47f3-9f46-53d6c20c1d5a'
const [res] = await conn.execute(
  `UPDATE submissions SET status = 'active' WHERE uuid = ?`,
  [uuid]
)
console.log('updated rows:', res.affectedRows)

const [check] = await conn.execute(
  `SELECT slug, company_name, status, logo_url FROM submissions WHERE uuid = ?`,
  [uuid]
)
console.log('after:', check[0])

await conn.end()
