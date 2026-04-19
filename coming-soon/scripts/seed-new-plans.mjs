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

const plans = [
  { slug: 'free', name: 'Free', price: 0, period: 'one-time', sort: 10 },
  { slug: 'starter', name: 'Starter', price: 49, period: 'one-time', sort: 20 },
  { slug: 'yearly', name: 'Early Adopter', price: 99, period: 'yearly', sort: 30 },
  { slug: 'lifetime', name: 'Founding Lifetime', price: 239, period: 'one-time', sort: 40 },
]

for (const p of plans) {
  const [existing] = await conn.execute('SELECT id FROM plans WHERE slug = ? LIMIT 1', [p.slug])
  if (existing.length > 0) {
    console.log(`SKIP ${p.slug} — already exists (id=${existing[0].id})`)
    continue
  }
  const [res] = await conn.execute(
    `INSERT INTO plans (slug, name, price, currency, period, is_active, is_locked, sort_order)
     VALUES (?, ?, ?, 'USD', ?, 1, 0, ?)`,
    [p.slug, p.name, p.price, p.period, p.sort]
  )
  console.log(`INSERTED ${p.slug} (id=${res.insertId})`)
}

const [allPlans] = await conn.execute('SELECT id, slug, name, price FROM plans ORDER BY sort_order, id')
console.log('\n=== all plans now ===')
console.table(allPlans)

await conn.end()
