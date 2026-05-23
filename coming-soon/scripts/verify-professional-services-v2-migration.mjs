/**
 * Read-only check after running migration-professional-services-taxonomy-v2.sql.
 *   node scripts/verify-professional-services-v2-migration.mjs
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

console.log('1. New PS L2 categories:')
const [l2Rows] = await conn.execute(`
  SELECT c.slug, c.name FROM categories c
   WHERE c.level = 2 AND c.parent_id = (SELECT id FROM categories WHERE slug='professional-services' AND level=1)
   ORDER BY c.sort_order
`)
console.log(`   Found ${l2Rows.length}  (expected 19)`)
console.log(`   Sample: ${l2Rows.slice(0, 6).map(r => r.slug).join(', ')}`)

console.log()
console.log('2. Total descendants under professional-services:')
const [[{n}]] = await conn.execute(`
  SELECT COUNT(*) AS n FROM categories c
    LEFT JOIN categories p   ON p.id   = c.parent_id
    LEFT JOIN categories gp  ON gp.id  = p.parent_id
   WHERE c.parent_id  = (SELECT id FROM categories WHERE slug='professional-services' AND level=1)
      OR p.parent_id  = (SELECT id FROM categories WHERE slug='professional-services' AND level=1)
      OR gp.parent_id = (SELECT id FROM categories WHERE slug='professional-services' AND level=1)
`)
console.log(`   Total: ${n}  (expected 2,474)`)
console.log(n === 2474 ? '   ✓ Match.' : `   ⚠ Off by ${n - 2474}`)

console.log()
console.log('3. listing_types tied to professional-services (should be 0):')
const [[{lt}]] = await conn.execute(`
  SELECT COUNT(*) AS lt FROM listing_types lt
    JOIN categories c ON c.id = lt.category_id
    LEFT JOIN categories p ON p.id = c.parent_id
   WHERE c.parent_id = (SELECT id FROM categories WHERE slug='professional-services' AND level=1)
      OR p.parent_id = (SELECT id FROM categories WHERE slug='professional-services' AND level=1)
`)
console.log(`   Found: ${lt}`)
console.log(lt === 0 ? '   ✓ Clean.' : '   ✗ Stale rows.')

console.log()
console.log('4. AZB & Partners (id=22) remap:')
const [subs] = await conn.execute(`
  SELECT s.id, s.company_name, s.category_id, c.slug, c.level
    FROM submissions s LEFT JOIN categories c ON c.id = s.category_id
   WHERE s.id = 22
`)
for (const r of subs) {
  const ok = r.category_id != null && r.level === 4 && r.slug === 'mergers-acquisitions-lawyers'
  console.log(`   id=${r.id}  ${r.company_name}  category_id=${r.category_id}  slug=${r.slug}  level=${r.level}  ${ok ? '✓' : '✗'}`)
}

await conn.end()
