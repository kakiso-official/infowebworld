/**
 * READ-ONLY pre-flight before reassigning listings to the InfoWebWorld
 * house account. Reports:
 *   1. Whether infowebworld.com@gmail.com exists as a business_users row.
 *   2. Every current submissions row with its current owner email.
 *
 * Nothing is written. Run with:
 *   node scripts/check-listing-reassign.mjs
 */
import mysql from 'mysql2/promise'
import fs from 'node:fs'

/* Load .env.local explicitly (dotenv loads .env only by default). */
const envPath = '.env.local'
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/i)
    if (m && !process.env[m[1]]) {
      let v = m[2]
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1)
      }
      process.env[m[1]] = v.replace(/\r$/, '')
    }
  }
}

const HOUSE_EMAIL = 'infowebworld.com@gmail.com'

const conn = await mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 3306),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
})

try {
  console.log('═══ House account check ═══')
  const [houseRows] = await conn.execute(
    `SELECT id, uuid, email, name, provider, created_at
       FROM business_users
      WHERE email = ?
      LIMIT 1`,
    [HOUSE_EMAIL]
  )
  if (houseRows.length === 0) {
    console.log(`❌ NOT FOUND: ${HOUSE_EMAIL}`)
    console.log('   → Sign in with Google at /business once using that email,')
    console.log('     then re-run this script. The signup creates the row.')
  } else {
    const h = houseRows[0]
    console.log(`✓ Found: id=${h.id} | uuid=${h.uuid} | provider=${h.provider}`)
    console.log(`  name="${h.name || ''}"  created=${h.created_at}`)
  }

  console.log()
  console.log('═══ Current submissions ═══')
  const [subs] = await conn.execute(
    `SELECT s.id, s.uuid, s.slug, s.company_name, s.status,
            COALESCE(s.listing_mode, 'product') AS listing_mode,
            s.user_id, s.email AS sub_email,
            u.email AS owner_email, u.name AS owner_name,
            s.created_at
       FROM submissions s
       LEFT JOIN business_users u ON u.id = s.user_id
      ORDER BY s.created_at DESC`
  )
  console.log(`Total submissions: ${subs.length}`)
  console.log()
  console.log('id   | mode    | status   | user_id | owner_email                          | company → slug')
  console.log('-----+---------+----------+---------+--------------------------------------+----------------------------')
  for (const s of subs) {
    const owner = s.owner_email || `(no user — submit email: ${s.sub_email || 'none'})`
    console.log(
      `${String(s.id).padEnd(4)} | ${String(s.listing_mode).padEnd(7)} | ${String(s.status).padEnd(8)} | ${String(s.user_id ?? '—').padEnd(7)} | ${owner.padEnd(36)} | ${s.company_name} → ${s.slug}`
    )
  }
  console.log()

  /* Count by current owner so the user can spot any non-house owners
     before authorising the bulk reassign. */
  const byOwner = new Map()
  for (const s of subs) {
    const k = s.owner_email || `<no user> (${s.sub_email || 'no email'})`
    byOwner.set(k, (byOwner.get(k) || 0) + 1)
  }
  console.log('═══ Grouped by current owner ═══')
  for (const [k, n] of [...byOwner.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${n.toString().padStart(3)} × ${k}`)
  }
} finally {
  await conn.end()
}
