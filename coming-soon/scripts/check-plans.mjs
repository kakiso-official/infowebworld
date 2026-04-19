import { readFileSync } from 'node:fs'
import mysql from 'mysql2/promise'

// Manually parse .env.local since Node doesn't load it automatically
const env = {}
try {
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
} catch (e) {
  console.error('Could not read .env.local:', e.message)
}

const conn = await mysql.createConnection({
  host: env.DATABASE_HOST,
  port: Number(env.DATABASE_PORT || 3306),
  database: env.DATABASE_NAME,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  ssl: env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
})

console.log('Connected to DB:', env.DATABASE_NAME)

const [plans] = await conn.execute('SELECT id, slug, name, price FROM plans ORDER BY id')
console.log('\n=== plans table ===')
console.table(plans)

const [desc] = await conn.execute('DESCRIBE plans')
console.log('\n=== plans schema ===')
console.table(desc)

const [subDesc] = await conn.execute('DESCRIBE submissions')
console.log('\n=== submissions.plan_id column ===')
const planCol = subDesc.find(c => c.Field === 'plan_id')
console.log(planCol)

await conn.end()
