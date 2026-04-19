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

const [admins] = await conn.execute('DESCRIBE admins')
console.log('=== admins schema ===')
console.table(admins)
const [adminSess] = await conn.execute('DESCRIBE admin_sessions')
console.log('\n=== admin_sessions schema ===')
console.table(adminSess)

// Check if business_users / business_sessions already exist
const [tables] = await conn.execute("SHOW TABLES LIKE 'business_%'")
console.log('\n=== business_* tables ===')
console.log(tables)

// check submissions.user_id
const [subs] = await conn.execute('DESCRIBE submissions')
const userCol = subs.find(c => c.Field === 'user_id')
console.log('\n=== submissions.user_id column (should be missing) ===')
console.log(userCol || 'NOT PRESENT')

await conn.end()
