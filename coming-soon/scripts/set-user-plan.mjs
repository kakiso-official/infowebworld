/**
 * Testing helper — flip a business user's dashboard plan tier without
 * running PayPal. The dashboard derives the tier from the user's
 * submissions (highest-tier plan across active/paid/pending rows), so
 * this script either UPDATEs an existing submission's plan_id or
 * INSERTs a dummy "active" submission with that plan.
 *
 * Usage:
 *   node scripts/set-user-plan.mjs <email> <plan-slug>
 *
 * plan-slug: free | starter | yearly | lifetime  (founding / early-adopter also work)
 *
 * Examples:
 *   node scripts/set-user-plan.mjs aadil.parmar25official@gmail.com lifetime
 *   node scripts/set-user-plan.mjs aadil.parmar25official@gmail.com free
 */
import { readFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import mysql from 'mysql2/promise'

const [, , emailArg, planSlug] = process.argv
if (!emailArg || !planSlug) {
  console.error('Usage: node scripts/set-user-plan.mjs <email> <plan-slug>')
  console.error('Valid plan slugs: free, starter, yearly, lifetime (also founding, early-adopter)')
  process.exit(1)
}
const email = emailArg.toLowerCase().trim()

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

// 1. Find user
const [users] = await conn.execute(
  'SELECT id, email, name FROM business_users WHERE email = ? LIMIT 1',
  [email]
)
if (users.length === 0) {
  console.error(`No business user with email "${email}".`)
  await conn.end()
  process.exit(2)
}
const user = users[0]
console.log(`✓ User: id=${user.id} · ${user.email} · ${user.name || '(no name)'}`)

// 2. Find plan
const [plans] = await conn.execute(
  'SELECT id, slug, name, price, period FROM plans WHERE slug = ? LIMIT 1',
  [planSlug]
)
if (plans.length === 0) {
  console.error(`No plan with slug "${planSlug}". Run \`node -e "import('mysql2/promise')..."\` or check the plans table.`)
  await conn.end()
  process.exit(3)
}
const plan = plans[0]
console.log(`✓ Plan: id=${plan.id} · ${plan.slug} · ${plan.name} · $${plan.price} ${plan.period}`)

// 3. Look up an existing submission owned by this user
const [subs] = await conn.execute(
  'SELECT id, uuid, slug, company_name, status, plan_id FROM submissions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
  [user.id]
)

if (subs.length > 0) {
  const sub = subs[0]
  console.log(`↻ Updating existing submission id=${sub.id} (${sub.company_name || '(no name)'}): plan_id ${sub.plan_id} → ${plan.id}`)
  await conn.execute(
    `UPDATE submissions
        SET plan_id = ?,
            status = 'active',
            payment_status = 'paid'
      WHERE id = ?`,
    [plan.id, sub.id]
  )
} else {
  // No existing submission — pull any valid country row to satisfy the FK,
  // then insert a dummy "active" submission so the dashboard plan resolver
  // has something to latch onto.
  const [countries] = await conn.execute(
    `SELECT id FROM countries ORDER BY (CASE code WHEN 'IN' THEN 1 WHEN 'US' THEN 2 ELSE 3 END), id LIMIT 1`
  )
  if (countries.length === 0) {
    console.error('No countries row available — cannot create a dummy submission.')
    await conn.end()
    process.exit(4)
  }
  const countryId = countries[0].id

  const uuid = randomBytes(16).toString('hex').replace(
    /(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5'
  )
  const slug = `test-${planSlug}-${randomBytes(4).toString('hex')}`
  const [res] = await conn.execute(
    `INSERT INTO submissions
       (uuid, slug, user_id, plan_id, country_id, company_name, tagline, status, payment_status)
     VALUES
       (?, ?, ?, ?, ?, 'Test Business', 'Test listing for plan tier preview', 'active', 'paid')`,
    [uuid, slug, user.id, plan.id, countryId]
  )
  console.log(`+ Inserted dummy submission id=${res.insertId} (${slug}) on plan ${plan.slug}, country_id=${countryId}`)
}

// 4. Verify — read back what the getUserPlan resolver would see
const [verify] = await conn.execute(
  `SELECT p.slug, p.name, p.price, s.status
   FROM submissions s
   LEFT JOIN plans p ON p.id = s.plan_id
   WHERE s.user_id = ? AND s.status IN ('active','paid','pending')
   ORDER BY (
     CASE p.slug
       WHEN 'lifetime'      THEN 4
       WHEN 'founding'      THEN 4
       WHEN 'yearly'        THEN 3
       WHEN 'early-adopter' THEN 3
       WHEN 'starter'       THEN 2
       WHEN 'free'          THEN 1
       ELSE 0
     END
   ) DESC
   LIMIT 1`,
  [user.id]
)
console.log('Resolved plan after update:', verify[0])

await conn.end()
console.log('\nDone. Reload /in/dashboard in your browser to see the new tier.')
