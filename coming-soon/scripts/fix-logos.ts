/**
 * Fix logo URLs for seeded listings — uses DB directly
 * Run: npx tsx scripts/fix-logos.ts
 */
import { createPool } from 'mysql2/promise'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local
const envPath = resolve(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const env: Record<string, string> = {}
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '')
}

const pool = createPool({
  host: env.DATABASE_HOST,
  port: Number(env.DATABASE_PORT || 3306),
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  ssl: env.DATABASE_SSL === 'true' ? {} : undefined,
})

const updates = [
  { slug: 'chatgpt-by-openai', logo: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128' },
  { slug: 'intercom', logo: 'https://www.google.com/s2/favicons?domain=intercom.com&sz=128' },
  { slug: 'tidio', logo: 'https://www.google.com/s2/favicons?domain=tidio.com&sz=128' },
  { slug: 'ada', logo: 'https://www.google.com/s2/favicons?domain=ada.cx&sz=128' },
]

async function run() {
  for (const u of updates) {
    const [result] = await pool.execute(
      'UPDATE submissions SET logo_url = ? WHERE slug LIKE ? AND status = "active"',
      [u.logo, `${u.slug}%`]
    ) as any
    console.log(`  ${u.slug} → ${result.affectedRows} row(s) updated`)
  }
  await pool.end()
  console.log('\nDone! Logos updated.')
}

run().catch(console.error)
