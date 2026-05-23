import mysql from 'mysql2/promise'
import fs from 'node:fs'

const envPath = '.env.local'
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/i)
    if (m && !process.env[m[1]]) {
      let v = m[2]
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
      process.env[m[1]] = v.replace(/\r$/, '')
    }
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
  const [cols] = await conn.execute(`SHOW COLUMNS FROM listing_outbound_clicks`)
  console.log(`✓ listing_outbound_clicks exists with ${cols.length} columns:`)
  for (const c of cols) console.log(`  - ${c.Field}  ${c.Type}`)
  const [count] = await conn.execute(`SELECT COUNT(*) AS n FROM listing_outbound_clicks`)
  console.log(`  rows: ${count[0].n}`)
} catch (err) {
  console.error('✗', err.message)
  process.exit(1)
} finally { await conn.end() }
