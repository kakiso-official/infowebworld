/**
 * Read-only dump of every submission whose current category lives under the
 * AI & ML L1 sector. Used to plan the AI&ML taxonomy v3 re-mapping.
 *
 *   node scripts/inspect-aiml-listings.mjs
 *
 * Writes exports/current-aiml-listings.json
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

console.log('Connected to', env.DATABASE_HOST)

/* Find the AI & ML L1 root. */
const [[root]] = await conn.execute(
  `SELECT id, name, slug FROM categories WHERE slug = 'ai-ml' AND level = 1 LIMIT 1`
)
if (!root) throw new Error('AI & ML L1 root (slug=ai-ml, level=1) not found')
console.log(`AI&ML L1: id=${root.id} name="${root.name}"`)

/* Every category that descends from AI & ML — any level. */
const [descendants] = await conn.execute(`
  SELECT c.id, c.level, c.name, c.slug,
         p.id AS p_id, p.name AS p_name, p.slug AS p_slug, p.level AS p_level,
         gp.id AS gp_id, gp.name AS gp_name, gp.slug AS gp_slug
    FROM categories c
    LEFT JOIN categories p  ON p.id = c.parent_id
    LEFT JOIN categories gp ON gp.id = p.parent_id
   WHERE
        c.parent_id = ?  -- L2 under AI&ML
     OR p.parent_id = ?  -- L3
     OR gp.parent_id = ? -- L4
`, [root.id, root.id, root.id])
console.log(`AI&ML descendants in categories: ${descendants.length}`)
const aimlCatIds = new Set(descendants.map(d => Number(d.id)))

/* Submissions whose category_id is in that set. */
if (aimlCatIds.size === 0) {
  console.log('No AI&ML categories found — abort.')
  await conn.end()
  process.exit(0)
}
const idList = [...aimlCatIds].join(',')

const [subs] = await conn.execute(`
  SELECT s.id, s.uuid, s.company_name, s.tagline, s.description, s.status,
         s.category_id, s.listing_type_id,
         c.name AS cat_name, c.slug AS cat_slug, c.level AS cat_level,
         p.name AS l2_name, p.slug AS l2_slug,
         gp.name AS l1_name, gp.slug AS l1_slug,
         lt.name AS lt_name, lt.slug AS lt_slug
    FROM submissions s
    LEFT JOIN categories c   ON c.id = s.category_id
    LEFT JOIN categories p   ON p.id = c.parent_id
    LEFT JOIN categories gp  ON gp.id = p.parent_id
    LEFT JOIN listing_types lt ON lt.id = s.listing_type_id
   WHERE s.category_id IN (${idList})
   ORDER BY s.id
`)

console.log(`Submissions under AI&ML: ${subs.length}`)

/* Also count listing_types about to be deleted. */
const [[ltCount]] = await conn.execute(`
  SELECT COUNT(*) AS n FROM listing_types
   WHERE category_id IN (${idList})
`)
console.log(`listing_types to delete: ${ltCount.n}`)

/* And category_seo_content rows. */
const [[seoCount]] = await conn.execute(`
  SELECT COUNT(*) AS n FROM category_seo_content
   WHERE category_id IN (${idList})
`)
console.log(`category_seo_content rows to delete: ${seoCount.n}`)

const out = {
  generated_at: new Date().toISOString(),
  source: `${env.DATABASE_NAME}@${env.DATABASE_HOST}`,
  ai_ml_root: { id: root.id, name: root.name, slug: root.slug },
  category_counts_to_delete: {
    total_descendants: descendants.length,
    by_level: descendants.reduce((a, d) => ((a[`L${d.level}`] = (a[`L${d.level}`] || 0) + 1), a), {}),
  },
  listing_types_to_delete: Number(ltCount.n),
  seo_content_to_delete: Number(seoCount.n),
  submissions: subs.map(r => ({
    id: Number(r.id),
    uuid: r.uuid,
    company_name: r.company_name,
    tagline: r.tagline,
    description: r.description ? String(r.description).slice(0, 400) : null,
    status: r.status,
    old_l1: r.l1_name || (r.cat_level === 1 ? r.cat_name : null),
    old_l2: r.l2_name || (r.cat_level === 2 ? r.cat_name : null),
    old_l3: r.cat_level === 3 ? r.cat_name : null,
    old_cat_slug: r.cat_slug,
    old_cat_level: r.cat_level,
    old_listing_type: r.lt_name || null,
  })),
}

const outPath = 'exports/current-aiml-listings.json'
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8')
console.log(`Wrote ${outPath}`)

await conn.end()
