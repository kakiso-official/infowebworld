/**
 * Dump every category slug that is NOT under the AI & ML L1 sector.
 * The Python migration generator uses this list to avoid slug collisions
 * with the other 5 sectors when minting new AI&ML slugs.
 *
 *   node scripts/dump-non-aiml-slugs.mjs
 *
 * Writes exports/non-aiml-slugs.json
 */
import mysql from 'mysql2/promise'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const env = {}
for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (!m) continue
  let v = m[2]
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
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

const [[root]] = await conn.execute(
  `SELECT id FROM categories WHERE slug = 'ai-ml' AND level = 1 LIMIT 1`
)
if (!root) throw new Error('ai-ml L1 not found')

/* Build the set of AI&ML descendant ids (any depth). */
const [descendants] = await conn.execute(`
  SELECT c.id
    FROM categories c
    LEFT JOIN categories p  ON p.id = c.parent_id
    LEFT JOIN categories gp ON gp.id = p.parent_id
    LEFT JOIN categories ggp ON ggp.id = gp.parent_id
   WHERE c.id = ?
      OR c.parent_id = ?
      OR p.parent_id = ?
      OR gp.parent_id = ?
      OR ggp.parent_id = ?
`, [root.id, root.id, root.id, root.id, root.id])
const aimlIds = new Set(descendants.map(d => Number(d.id)))

const [all] = await conn.execute(`SELECT id, slug, level FROM categories`)
const nonAiml = all
  .filter(r => !aimlIds.has(Number(r.id)))
  .map(r => ({ slug: r.slug, level: Number(r.level) }))

mkdirSync('exports', { recursive: true })
writeFileSync('exports/non-aiml-slugs.json', JSON.stringify({
  generated_at: new Date().toISOString(),
  ai_ml_descendant_count: aimlIds.size,
  non_aiml_slugs: nonAiml,
}, null, 2), 'utf8')
console.log(`Wrote exports/non-aiml-slugs.json — ${nonAiml.length} slugs (AI&ML descendants excluded: ${aimlIds.size})`)

await conn.end()
