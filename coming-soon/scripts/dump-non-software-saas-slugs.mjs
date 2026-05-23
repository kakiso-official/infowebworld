/**
 * Dump every category slug that is NOT under software-saas — used by the
 * Python migration generator for collision avoidance.
 *
 *   node scripts/dump-non-software-saas-slugs.mjs
 *
 * Writes exports/non-software-saas-slugs.json
 */
import mysql from 'mysql2/promise'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

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

const [[root]] = await conn.execute(
  `SELECT id FROM categories WHERE slug = 'software-saas' AND level = 1 LIMIT 1`
)
if (!root) throw new Error('software-saas L1 not found')

const [descendants] = await conn.execute(`
  SELECT c.id
    FROM categories c
    LEFT JOIN categories p   ON p.id   = c.parent_id
    LEFT JOIN categories gp  ON gp.id  = p.parent_id
    LEFT JOIN categories ggp ON ggp.id = gp.parent_id
    LEFT JOIN categories gggp ON gggp.id = ggp.parent_id
   WHERE c.id = ?
      OR c.parent_id = ?
      OR p.parent_id = ?
      OR gp.parent_id = ?
      OR ggp.parent_id = ?
      OR gggp.parent_id = ?
`, [root.id, root.id, root.id, root.id, root.id, root.id])
const ids = new Set(descendants.map(d => Number(d.id)))

const [all] = await conn.execute(`SELECT id, slug, level FROM categories`)
const nonSaas = all
  .filter(r => !ids.has(Number(r.id)))
  .map(r => ({ slug: r.slug, level: Number(r.level) }))

mkdirSync('exports', { recursive: true })
writeFileSync('exports/non-software-saas-slugs.json', JSON.stringify({
  generated_at: new Date().toISOString(),
  software_saas_descendant_count: ids.size,
  non_software_saas_slugs: nonSaas,
}, null, 2), 'utf8')
console.log(`Wrote exports/non-software-saas-slugs.json — ${nonSaas.length} slugs (software-saas descendants excluded: ${ids.size})`)

await conn.end()
