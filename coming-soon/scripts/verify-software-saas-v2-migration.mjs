/**
 * Read-only sanity check after running migration-software-saas-taxonomy-v2.sql
 * in phpMyAdmin. Verifies:
 *   1. New 20 L2s exist under software-saas
 *   2. Total descendants ≈ 1,081
 *   3. No old listing_types remain tied to software-saas
 *   4. The 5 re-mapped submissions all point at L4
 *
 *   node scripts/verify-software-saas-v2-migration.mjs
 */
import mysql from 'mysql2/promise'
import { readFileSync } from 'node:fs'

const env = {}
for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
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

console.log('1. New software-saas L2 categories:')
const [l2Rows] = await conn.execute(`
  SELECT c.slug, c.name FROM categories c
   WHERE c.level = 2 AND c.parent_id = (SELECT id FROM categories WHERE slug='software-saas' AND level=1)
   ORDER BY c.sort_order
`)
console.log(`   Found ${l2Rows.length} L2s   (expected 20)`)
console.log(`   Sample: ${l2Rows.slice(0, 6).map(r => r.slug).join(', ')}`)

console.log()
console.log('2. Descendant count under software-saas L1:')
const [[{n}]] = await conn.execute(`
  SELECT COUNT(*) AS n FROM categories c
    LEFT JOIN categories p   ON p.id   = c.parent_id
    LEFT JOIN categories gp  ON gp.id  = p.parent_id
   WHERE c.parent_id  = (SELECT id FROM categories WHERE slug='software-saas' AND level=1)
      OR p.parent_id  = (SELECT id FROM categories WHERE slug='software-saas' AND level=1)
      OR gp.parent_id = (SELECT id FROM categories WHERE slug='software-saas' AND level=1)
`)
console.log(`   Total: ${n}   (expected 1,081)`)
console.log(n === 1081 ? '   ✓ Match.' : `   ⚠ Off by ${n - 1081}`)

console.log()
console.log('3. listing_types tied to software-saas (should be 0):')
const [[{lt}]] = await conn.execute(`
  SELECT COUNT(*) AS lt FROM listing_types lt
    JOIN categories c ON c.id = lt.category_id
    LEFT JOIN categories p ON p.id = c.parent_id
   WHERE c.parent_id = (SELECT id FROM categories WHERE slug='software-saas' AND level=1)
      OR p.parent_id = (SELECT id FROM categories WHERE slug='software-saas' AND level=1)
`)
console.log(`   Found: ${lt}`)
console.log(lt === 0 ? '   ✓ Clean.' : `   ✗ Stale rows still exist.`)

console.log()
console.log('4. The 5 re-mapped submissions:')
const [subs] = await conn.execute(`
  SELECT s.id, s.company_name, s.category_id, c.slug, c.level
    FROM submissions s LEFT JOIN categories c ON c.id = s.category_id
   WHERE s.id IN (32, 33, 34, 35, 36)
   ORDER BY s.id
`)
for (const r of subs) {
  const ok = r.category_id != null && r.level === 4
  console.log(`   id=${r.id}  ${r.company_name.padEnd(15)} category_id=${r.category_id}  slug=${r.slug}  level=${r.level}  ${ok ? '✓' : '✗'}`)
}

await conn.end()
