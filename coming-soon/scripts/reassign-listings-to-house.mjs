/**
 * One-shot: reassign seeded listings to the InfoWebWorld house account
 * + delete two junk test rows. Safety baked in:
 *   - Hard-coded ID lists (no broad UPDATE/DELETE by predicate).
 *   - Pre-check: every target ID must exist with the expected state.
 *   - Single transaction; rolls back on any error.
 *   - Real-user listings (Group B) are NEVER touched.
 *
 * Run with:
 *   node scripts/reassign-listings-to-house.mjs
 */
import mysql from 'mysql2/promise'
import fs from 'node:fs'

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

/* Group A — 11 seed listings to reassign. Listed by id so we
   can verify them in the pre-check before any write happens. */
const SEED_IDS = [24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36]
/* Group C — junk test rows to delete. */
const JUNK_IDS = [3, 10]
/* Group B — REAL user signups. Listed here only as a paranoia guard:
   the script aborts if any of them somehow appear in SEED_IDS/JUNK_IDS. */
const PROTECTED_IDS = [22, 23]

for (const id of [...SEED_IDS, ...JUNK_IDS]) {
  if (PROTECTED_IDS.includes(id)) {
    console.error(`✗ ABORT: id=${id} is a protected real-user listing. Cannot touch.`)
    process.exit(1)
  }
}

const conn = await mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 3306),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
})

try {
  /* ── House account ID resolution ── */
  const [houseRows] = await conn.execute(
    `SELECT id, email FROM business_users WHERE email = ? LIMIT 1`,
    [HOUSE_EMAIL]
  )
  if (houseRows.length === 0) {
    console.error(`✗ ABORT: house account ${HOUSE_EMAIL} not found.`)
    process.exit(1)
  }
  const houseId = houseRows[0].id
  console.log(`✓ House account: id=${houseId} email=${HOUSE_EMAIL}`)

  /* ── Pre-check all target rows. Reassignment targets must currently
        have user_id IS NULL (we never overwrite a real owner). Deletion
        targets must have status='rejected' (we never delete live data). ── */
  const placeholders = SEED_IDS.map(() => '?').join(',')
  const [seedRows] = await conn.execute(
    `SELECT id, user_id, status, company_name, slug
       FROM submissions WHERE id IN (${placeholders})`,
    SEED_IDS
  )
  if (seedRows.length !== SEED_IDS.length) {
    console.error(`✗ ABORT: expected ${SEED_IDS.length} seed rows, found ${seedRows.length}.`)
    process.exit(1)
  }
  for (const r of seedRows) {
    if (r.user_id != null) {
      console.error(`✗ ABORT: id=${r.id} (${r.company_name}) already has user_id=${r.user_id}; refusing to overwrite.`)
      process.exit(1)
    }
  }

  const junkPlaceholders = JUNK_IDS.map(() => '?').join(',')
  const [junkRows] = await conn.execute(
    `SELECT id, status, company_name FROM submissions WHERE id IN (${junkPlaceholders})`,
    JUNK_IDS
  )
  for (const r of junkRows) {
    if (r.status !== 'rejected') {
      console.error(`✗ ABORT: junk id=${r.id} (${r.company_name}) has status=${r.status}, expected rejected.`)
      process.exit(1)
    }
  }

  console.log()
  console.log('═══ Plan ═══')
  console.log(`  Reassign ${seedRows.length} seeded listings → user_id=${houseId}:`)
  for (const r of seedRows) console.log(`     id=${r.id}  ${r.company_name}  (${r.slug})`)
  console.log(`  Delete ${junkRows.length} junk rejected rows:`)
  for (const r of junkRows) console.log(`     id=${r.id}  ${r.company_name}`)
  console.log()

  /* ── Execute under a single transaction ── */
  await conn.beginTransaction()
  try {
    const [u] = await conn.execute(
      `UPDATE submissions SET user_id = ? WHERE id IN (${placeholders}) AND user_id IS NULL`,
      [houseId, ...SEED_IDS]
    )
    console.log(`✓ Reassigned ${u.affectedRows} rows.`)

    const [d] = await conn.execute(
      `DELETE FROM submissions WHERE id IN (${junkPlaceholders}) AND status = 'rejected'`,
      JUNK_IDS
    )
    console.log(`✓ Deleted ${d.affectedRows} junk rows.`)

    await conn.commit()
    console.log('✓ Transaction committed.')
  } catch (err) {
    await conn.rollback()
    console.error('✗ Rolled back due to error:', err)
    process.exit(1)
  }

  /* ── Verify final state ── */
  console.log()
  console.log('═══ Final state ═══')
  const [final] = await conn.execute(
    `SELECT s.id, s.status, s.user_id, u.email, s.company_name, s.slug,
            COALESCE(s.listing_mode, 'product') AS listing_mode
       FROM submissions s
       LEFT JOIN business_users u ON u.id = s.user_id
      ORDER BY s.created_at DESC`
  )
  console.log(`Total submissions: ${final.length}`)
  for (const r of final) {
    const owner = r.email || '(no user)'
    console.log(`  id=${String(r.id).padEnd(3)} | ${String(r.listing_mode).padEnd(7)} | ${String(r.status).padEnd(8)} | ${owner.padEnd(34)} | ${r.company_name}`)
  }
} finally {
  await conn.end()
}
