/**
 * One-time migration: convert the Starter plan from $9/year to $49 one-time.
 *
 * Safe to re-run — uses UPDATE with explicit values, idempotent.
 * Run with:  node scripts/migrate-starter-to-lifetime.mjs
 */
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

// Show the current row first so the before/after is visible in the log.
const [before] = await conn.execute(
  'SELECT id, slug, name, price, period, is_active FROM plans WHERE slug = ?',
  ['starter']
)
console.log('BEFORE:', before[0] || '(no starter row found — will insert)')

if (before.length === 0) {
  // Edge case: run seed-new-plans.mjs instead
  const [res] = await conn.execute(
    `INSERT INTO plans (slug, name, price, currency, period, is_active, is_locked, sort_order)
     VALUES ('starter', 'Starter', 49, 'USD', 'one-time', 1, 0, 20)`
  )
  console.log(`INSERTED starter (id=${res.insertId}) @ $49 one-time`)
} else {
  const [res] = await conn.execute(
    `UPDATE plans
        SET price = 49,
            period = 'one-time',
            name = 'Starter',
            is_active = 1,
            is_locked = 0
      WHERE slug = 'starter'`
  )
  console.log(`UPDATED ${res.affectedRows} row(s) — starter is now $49 one-time`)
}

// Blow away the stale PayPal subscription plan id cached by the old code path —
// the /api/paypal/starter-plan route is deleted, but cleaning the settings
// entry prevents any downstream confusion.
await conn.execute("DELETE FROM settings WHERE `key_name` IN ('paypal_starter_plan_id', 'paypal_starter_plan_id_v2')")
console.log('Cleared cached PayPal subscription plan ids from settings.')

const [after] = await conn.execute(
  'SELECT id, slug, name, price, period, is_active FROM plans WHERE slug = ?',
  ['starter']
)
console.log('AFTER: ', after[0])

await conn.end()
