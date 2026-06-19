/**
 * Capture website screenshots for the 10 xlsx AI/ML products and EMIT SQL
 * (database/screenshots-xlsx-aiml.sql) that the user pastes in phpMyAdmin.
 *
 * - Reads slug + website from scripts/research-xlsx/aiml-{a,b}.json (no DB needed).
 * - 2 shots per site (hero + one scroll) at 1280x800.
 * - Uploads each PNG straight to cPanel (same multipart POST that app/api/upload
 *   makes internally) -> no dev server, no per-IP rate limit, no DB writes here.
 * - Emits `UPDATE submissions SET screenshots=JSON_ARRAY(...) WHERE slug=? AND listing_mode='product'`.
 *
 *   node scripts/capture-xlsx-aiml-screenshots.mjs
 */
import { chromium } from 'playwright'
import http from 'node:http'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const CPANEL_IP = '104.152.168.46'
const CPANEL_HOST = 'infowebworld.com'
const CPANEL_UPLOAD_PATH = '/infowebworld/api.php?action=file_upload'
const SHOTS = 2

const products = [
  ...JSON.parse(readFileSync('scripts/research-xlsx/aiml-a.json', 'utf8')),
  ...JSON.parse(readFileSync('scripts/research-xlsx/aiml-b.json', 'utf8')),
].map((p) => ({ slug: p.slug, name: p.name, website: p.website }))

/* ── cPanel upload (mirrors app/api/upload/route.ts internals) ──────────── */
function buildMultipart(name, type, bytes, fieldType) {
  const boundary = '----IWWxlsx' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  const CRLF = '\r\n'
  const chunks = []
  chunks.push(Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="file"; filename="${name.replace(/"/g, '')}"${CRLF}Content-Type: ${type}${CRLF}${CRLF}`))
  chunks.push(bytes)
  chunks.push(Buffer.from(CRLF))
  chunks.push(Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="type"${CRLF}${CRLF}${fieldType}${CRLF}`))
  chunks.push(Buffer.from(`--${boundary}--${CRLF}`))
  return { body: Buffer.concat(chunks), boundary }
}
function postToCpanel(body, boundary) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: CPANEL_IP, port: 80, method: 'POST', path: CPANEL_UPLOAD_PATH,
      headers: { Host: CPANEL_HOST, 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': body.length },
    }, (res) => {
      const parts = []; res.on('data', (c) => parts.push(c))
      res.on('end', () => resolve({ status: res.statusCode || 500, text: Buffer.concat(parts).toString('utf8') }))
    })
    req.on('error', (e) => resolve({ status: 502, text: String(e) }))
    req.setTimeout(30000, () => { req.destroy(); resolve({ status: 504, text: 'timeout' }) })
    req.write(body); req.end()
  })
}
async function uploadPng(name, bytes) {
  const { body, boundary } = buildMultipart(name, 'image/png', bytes, 'logo')
  const cp = await postToCpanel(body, boundary)
  let data = null; try { data = JSON.parse(cp.text) } catch {}
  if (!data || data.error || cp.status >= 400) throw new Error(`upload ${cp.status}: ${(data && data.error) || cp.text.slice(0, 120)}`)
  const raw = String(data.url || '')
  const m = raw.match(/\/infowebworld\/uploads\/(.+)$/)
  return m ? `/api/file/${m[1]}` : (raw.startsWith('http') ? raw : `https://www.infowebworld.com${raw}`)
}

/* ── Capture ─────────────────────────────────────────────────────────────── */
mkdirSync('exports/screenshots', { recursive: true })
const browser = await chromium.launch({ headless: true, args: ['--disable-http2'] })
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
})
const page = await ctx.newPage()

const results = []   // {slug, urls[]}
const failures = []
for (let i = 0; i < products.length; i++) {
  const r = products[i]
  const url = r.website.startsWith('http') ? r.website : `https://${r.website}`
  process.stdout.write(`[${i + 1}/${products.length}] ${r.name.padEnd(14)} ${url}  ...  `)
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25_000 })
    await page.waitForTimeout(1500)
    for (const sel of ['button:has-text("Accept all")', 'button:has-text("Accept All")', 'button:has-text("Accept")', 'button:has-text("I agree")', 'button:has-text("Got it")', 'button:has-text("Allow all")']) {
      try { const b = page.locator(sel).first(); if (await b.isVisible({ timeout: 300 })) await b.click({ timeout: 800 }) } catch {}
    }
    await page.waitForTimeout(500)
    const urls = []
    for (let k = 0; k < SHOTS; k++) {
      if (k > 0) { await page.evaluate((y) => window.scrollTo(0, y), k * 1400); await page.waitForTimeout(700) }
      const buf = await page.screenshot({ fullPage: false, type: 'png' })
      const fileName = `${r.slug}-${k + 1}.png`
      writeFileSync(join('exports', 'screenshots', fileName), buf)
      urls.push(await uploadPng(fileName, buf))
    }
    results.push({ slug: r.slug, urls })
    process.stdout.write(`OK ${urls.length} shots\n`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    process.stdout.write(`FAIL ${msg.slice(0, 110)}\n`)
    failures.push({ slug: r.slug, url, error: msg })
  }
  await page.waitForTimeout(1500)
}
await browser.close()

/* ── Emit SQL ────────────────────────────────────────────────────────────── */
let sql = `-- ============================================================
-- Screenshots for the 10 xlsx AI/ML products. Captured from each product's
-- live website (2 shots each) and uploaded to the InfoWebWorld file store.
-- Run in phpMyAdmin AFTER seed-xlsx-aiml-products.sql (works pending or active).
-- Re-runnable: each UPDATE overwrites one slug's screenshots.
-- Generated by scripts/capture-xlsx-aiml-screenshots.mjs.
-- ============================================================

`
for (const r of results) {
  const arr = r.urls.map((u) => `'${u.replace(/'/g, "''")}'`).join(', ')
  sql += `UPDATE submissions SET screenshots = JSON_ARRAY(${arr}) WHERE slug = '${r.slug}' AND listing_mode = 'product';\n`
}
if (failures.length) {
  sql += `\n-- NOT captured (site blocked/timed out) - left empty-state, retry later:\n`
  for (const f of failures) sql += `--   ${f.slug}: ${f.error.slice(0, 100)}\n`
}
writeFileSync('database/screenshots-xlsx-aiml.sql', sql)
writeFileSync('exports/screenshot-xlsx-failures.json', JSON.stringify(failures, null, 2))
console.log(`\nDone. captured ${results.length}/${products.length}; wrote database/screenshots-xlsx-aiml.sql`)
if (failures.length) console.log(`Failed: ${failures.map((f) => f.slug).join(', ')}`)
