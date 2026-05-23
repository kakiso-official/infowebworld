/**
 * Read-only sanity check after running migration-aiml-taxonomy-v3.sql in
 * phpMyAdmin. Verifies:
 *   1. The 11 new AI&ML L2 categories exist with correct slugs
 *   2. Total descendants of 'ai-ml' L1 ≈ 1,392
 *   3. No old listing_types remain tied to AI&ML
 *   4. The 6 known submissions all have non-NULL category_id pointing at L5
 *
 *   node scripts/verify-aiml-v3-migration.mjs
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

const expectedL2 = [
  'ai-core-models','business-marketing','content-creative','customer-support',
  'development-technical','education-research','life-personal',
  'productivity-workflow','sales-commerce','social-communication','professional',
]
// Note: last 4 may shuffle order — script tolerates whichever subset exists.

console.log('1. New AI&ML L2 categories:')
const [l2Rows] = await conn.execute(`
  SELECT c.slug, c.name FROM categories c
   WHERE c.level = 2 AND c.parent_id = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1)
   ORDER BY c.sort_order
`)
console.log(`   Found ${l2Rows.length} L2s. Sample slugs: ${l2Rows.slice(0, 6).map(r => r.slug).join(', ')}`)
const l2Slugs = new Set(l2Rows.map(r => r.slug))
const missing = expectedL2.filter(s => !l2Slugs.has(s))
if (missing.length === 0) console.log('   ✓ All 11 expected L2 slugs present.')
else console.log(`   ✗ Missing L2 slugs: ${missing.join(', ')}`)

console.log()
console.log('2. Descendant count under ai-ml L1:')
const [[{n}]] = await conn.execute(`
  SELECT COUNT(*) AS n FROM categories c
    LEFT JOIN categories p   ON p.id   = c.parent_id
    LEFT JOIN categories gp  ON gp.id  = p.parent_id
    LEFT JOIN categories ggp ON ggp.id = gp.parent_id
   WHERE c.parent_id  = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1)
      OR p.parent_id  = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1)
      OR gp.parent_id = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1)
      OR ggp.parent_id = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1)
`)
console.log(`   Total: ${n}   (expected 1,392)`)
console.log(n === 1392 ? '   ✓ Match.' : `   ⚠ Off by ${n - 1392}`)

console.log()
console.log('3. listing_types tied to AI&ML (should be 0):')
const [[{lt}]] = await conn.execute(`
  SELECT COUNT(*) AS lt FROM listing_types lt
    JOIN categories c ON c.id = lt.category_id
    LEFT JOIN categories p ON p.id = c.parent_id
   WHERE c.parent_id = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1)
      OR p.parent_id = (SELECT id FROM categories WHERE slug='ai-ml' AND level=1)
`)
console.log(`   Found: ${lt}`)
console.log(lt === 0 ? '   ✓ Clean.' : `   ✗ Stale rows still exist.`)

console.log()
console.log('4. The 6 re-mapped submissions:')
const [subs] = await conn.execute(`
  SELECT s.id, s.company_name, s.category_id, c.slug, c.level
    FROM submissions s LEFT JOIN categories c ON c.id = s.category_id
   WHERE s.id IN (24, 25, 26, 27, 28, 31)
   ORDER BY s.id
`)
for (const r of subs) {
  const ok = r.category_id != null && r.level === 5
  console.log(`   id=${r.id}  ${r.company_name.padEnd(20)} category_id=${r.category_id}  slug=${r.slug}  level=${r.level}  ${ok ? '✓' : '✗'}`)
}

await conn.end()
