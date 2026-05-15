import { readFileSync } from 'node:fs'
import mysql from 'mysql2/promise'

/* Add a nullable phone column to business_users. Idempotent — re-runnable. */

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

const [cols] = await conn.execute('DESCRIBE business_users')
const hasPhone = cols.some(c => c.Field === 'phone')
if (!hasPhone) {
  console.log('Adding business_users.phone')
  await conn.query(
    `ALTER TABLE business_users ADD COLUMN phone VARCHAR(40) NULL AFTER avatar_url`
  )
} else {
  console.log('business_users.phone already exists — skipping ALTER')
}

console.log('\n=== business_users schema ===')
const [u] = await conn.execute('DESCRIBE business_users')
console.table(u)

await conn.end()
console.log('\nMigration complete.')
