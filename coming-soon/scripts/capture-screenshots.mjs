/**
 * Capture real website screenshots for seeded listings and upload them to the
 * site's /api/upload endpoint. Updates submissions.screenshots with the
 * returned local URLs.
 *
 * Generic — works for any sector. Pass --sector=<slug> to scope the run, or
 * --where="status='active' AND screenshots IS NULL" for a custom filter.
 *
 * Setup once:
 *   npm install playwright
 *   npx playwright install chromium
 *
 * Run (defaults to all 'active' listings with no screenshots, any sector):
 *   node scripts/capture-screenshots.mjs
 *
 * Scope to one sector:
 *   node scripts/capture-screenshots.mjs --sector=ai-ml
 *
 * Re-do already-screenshotted listings:
 *   node scripts/capture-screenshots.mjs --sector=ai-ml --force
 *
 * Limits + politeness:
 *   - 1280x800 viewport, full-page disabled (just above-the-fold), 1 screenshot
 *     per listing for now (the hero of the home page).
 *   - Each visit gets up to 25s to settle, then a 1.5s nap before the snap.
 *   - 2s gap between domains so we're not hammering anyone.
 *   - All errors are logged and skipped; the script doesn't stop on a bad URL.
 */
import { chromium } from 'playwright'
import mysql from 'mysql2/promise'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

/* ─── Env + args ─────────────────────────────────────────────────────────── */
const env = {}
for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (!m) continue
  let v = m[2]
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
  env[m[1]] = v
}

const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => {
      const [k, ...rest] = a.slice(2).split('=')
      return [k, rest.length ? rest.join('=') : true]
    })
)
const SECTOR = args.sector || null
const FORCE  = !!args.force
const LIMIT  = args.limit ? Number(args.limit) : null
const SITE_BASE = env.SITE_BASE || 'http://localhost:3000'

const conn = await mysql.createConnection({
  host: env.DATABASE_HOST, port: Number(env.DATABASE_PORT || 3306),
  database: env.DATABASE_NAME, user: env.DATABASE_USER, password: env.DATABASE_PASSWORD,
  ssl: env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
})
console.log(`Connected: ${env.DATABASE_HOST}/${env.DATABASE_NAME}`)
console.log(`Sector: ${SECTOR || '(all)'}   Force: ${FORCE}   Site base: ${SITE_BASE}`)

/* ─── Pick listings ──────────────────────────────────────────────────────── */
const where = [`s.status IN ('active','paid')`, `s.website IS NOT NULL`, `s.website <> ''`]
const params = []
if (!FORCE) where.push(`(s.screenshots IS NULL OR JSON_LENGTH(s.screenshots) = 0)`)
if (SECTOR) {
  where.push(`(
    c.slug = ? OR cp.slug = ? OR cgp.slug = ? OR cggp.slug = ? OR cgggp.slug = ?
  )`)
  params.push(SECTOR, SECTOR, SECTOR, SECTOR, SECTOR)
}

const sql = `
  SELECT s.id, s.slug AS listing_slug, s.company_name, s.website
    FROM submissions s
    LEFT JOIN categories c     ON c.id     = s.category_id
    LEFT JOIN categories cp    ON cp.id    = c.parent_id
    LEFT JOIN categories cgp   ON cgp.id   = cp.parent_id
    LEFT JOIN categories cggp  ON cggp.id  = cgp.parent_id
    LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id
   WHERE ${where.join(' AND ')}
   ORDER BY s.id
   ${LIMIT ? `LIMIT ${LIMIT}` : ''}
`
const [rows] = await conn.execute(sql, params)
console.log(`Found ${rows.length} listings to capture.`)

if (rows.length === 0) {
  console.log('Nothing to do.')
  await conn.end()
  process.exit(0)
}

/* ─── Browser ─────────────────────────────────────────────────────────────── */
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
})
const page = await ctx.newPage()

mkdirSync('exports/screenshots', { recursive: true })

let success = 0
let failed = 0
const failures = []

for (let i = 0; i < rows.length; i++) {
  const r = rows[i]
  const url = r.website.startsWith('http') ? r.website : `https://${r.website}`
  process.stdout.write(`[${i + 1}/${rows.length}] ${r.company_name.padEnd(30)} ${url}  ...  `)

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25_000 })
    /* Let lazy-loaded hero images / fonts settle. */
    await page.waitForTimeout(1500)
    /* Dismiss obvious cookie / consent walls so the screenshot doesn't get
       eaten by a banner. Best-effort, no error if buttons aren't found. */
    for (const sel of [
      'button:has-text("Accept all")', 'button:has-text("Accept All")',
      'button:has-text("Accept")', 'button:has-text("I agree")',
      'button:has-text("OK")', 'button:has-text("Got it")',
      'button:has-text("Allow all")', '[id*="cookie"] button:has-text("Accept")',
    ]) {
      try {
        const btn = page.locator(sel).first()
        if (await btn.isVisible({ timeout: 300 })) await btn.click({ timeout: 800 })
      } catch { /* ignore */ }
    }
    await page.waitForTimeout(500)

    const buf = await page.screenshot({ fullPage: false, type: 'png' })
    const localPath = join('exports', 'screenshots', `${r.listing_slug || r.id}.png`)
    writeFileSync(localPath, buf)

    /* Upload via the existing /api/upload endpoint (multipart). The endpoint
       proxies to cPanel and returns a public URL. */
    const fd = new FormData()
    const blob = new Blob([buf], { type: 'image/png' })
    fd.append('file', blob, `${r.listing_slug || r.id}.png`)
    const up = await fetch(`${SITE_BASE}/api/upload`, { method: 'POST', body: fd })
    const upJson = await up.json().catch(() => ({}))
    if (!up.ok || !upJson.url) {
      throw new Error(`upload failed: HTTP ${up.status}  ${JSON.stringify(upJson).slice(0, 160)}`)
    }
    const publicUrl = upJson.url

    /* Update DB row. screenshots is JSON; write a single-element array. */
    await conn.execute(
      `UPDATE submissions SET screenshots = JSON_ARRAY(?) WHERE id = ?`,
      [publicUrl, r.id]
    )
    process.stdout.write(`✓\n`)
    success++
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    process.stdout.write(`✗ ${msg.slice(0, 120)}\n`)
    failures.push({ id: r.id, company: r.company_name, url, error: msg })
    failed++
  }

  /* Politeness gap. */
  await page.waitForTimeout(2000)
}

await browser.close()
await conn.end()

writeFileSync('exports/screenshot-failures.json', JSON.stringify(failures, null, 2), 'utf8')
console.log()
console.log(`Done. ✓ ${success}   ✗ ${failed}`)
if (failed > 0) {
  console.log(`Failures saved to exports/screenshot-failures.json — you can re-run targeted captures by passing --sector=<slug> --force on a subset later.`)
}
