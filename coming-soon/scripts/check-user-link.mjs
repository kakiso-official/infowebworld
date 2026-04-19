import { readFileSync } from 'node:fs'
import mysql from 'mysql2/promise'

const env = {}
const raw = readFileSync('.env.local', 'utf8')
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (!m) continue
  let v = m[2]
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
  env[m[1]] = v
}

const conn = await mysql.createConnection({
  host: env.DATABASE_HOST, port: Number(env.DATABASE_PORT || 3306),
  database: env.DATABASE_NAME, user: env.DATABASE_USER, password: env.DATABASE_PASSWORD,
  ssl: env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
})

const [rows] = await conn.execute(
  `SELECT s.slug, s.company_name, s.user_id, u.email AS owner_email, u.name AS owner_name
   FROM submissions s
   LEFT JOIN business_users u ON u.id = s.user_id
   WHERE s.company_name = 'Auth-Linked Co'
   ORDER BY s.id DESC LIMIT 1`
)
console.log('latest auth-linked submission:', rows[0])

const [counts] = await conn.execute(
  `SELECT provider, COUNT(*) AS n FROM business_users GROUP BY provider`
)
console.log('\nusers by provider:')
console.table(counts)

await conn.end()
