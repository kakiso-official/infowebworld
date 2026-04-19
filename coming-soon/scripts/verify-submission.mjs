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

const uuid = '220da9cd-313b-47f3-9f46-53d6c20c1d5a'

const [rows] = await conn.execute(
  `SELECT s.id, s.uuid, s.slug, s.company_name, s.email, s.logo_url, s.plan_id, s.status,
          s.payment_status, s.features, s.tagline, p.slug AS plan_slug, p.name AS plan_name,
          c.name AS category_name, co.name AS country_name
   FROM submissions s
   LEFT JOIN plans p ON p.id = s.plan_id
   LEFT JOIN categories c ON c.id = s.category_id
   LEFT JOIN countries co ON co.id = s.country_id
   WHERE s.uuid = ? LIMIT 1`,
  [uuid]
)
console.log('=== submission row ===')
console.log(rows[0])

const [tags] = await conn.execute(
  `SELECT st.tag_id, t.name FROM submission_tags st
   LEFT JOIN tags t ON t.id = st.tag_id
   WHERE st.submission_id = ?`,
  [rows[0]?.id]
)
console.log('\n=== attached tags ===')
console.table(tags)

await conn.end()
