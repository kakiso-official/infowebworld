/**
 * Screenshot capture — 1440x900 desktop, JPEG (smaller than PNG).
 *
 * 2 shots per listing required:
 *   1. Home page (compulsory)
 *   2. One useful secondary — pricing > features > about > /
 *      (whichever has the most informative-looking visual content)
 *
 * Output: writes to public/scrape-screenshots/<slug>-<kind>.jpg so the
 * file is served by Next.js at /scrape-screenshots/<slug>-<kind>.jpg.
 * Later phases can swap in Vercel Blob without changing callers.
 */
import { chromium } from 'playwright'
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const REAL_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'

/**
 * Capture a single screenshot to outPath.
 *
 * @param {string} url
 * @param {string} outPath                Absolute file path, .jpg
 * @param {object} [opts]
 * @param {number} [opts.width=1440]
 * @param {number} [opts.height=900]
 * @param {number} [opts.maxScrollHeight=1800]   Crop limit even if page is taller
 * @param {number} [opts.settleMs=1500]
 * @param {number} [opts.quality=82]
 */
export async function captureScreenshot(url, outPath, opts = {}) {
  const {
    width = 1440,
    height = 900,
    maxScrollHeight = 1800,
    settleMs = 1500,
    quality = 82,
  } = opts
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
  try {
    const ctx = await browser.newContext({
      userAgent: REAL_UA,
      viewport: { width, height },
      locale: 'en-US',
      ignoreHTTPSErrors: true,
    })
    const page = await ctx.newPage()
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {})
    await page.waitForTimeout(settleMs)

    // Dismiss obvious cookie banners by hitting common dismiss buttons.
    await dismissOverlays(page).catch(() => {})

    mkdirSync(dirname(outPath), { recursive: true })
    await page.screenshot({
      path: outPath,
      type: 'jpeg',
      quality,
      clip: { x: 0, y: 0, width, height: Math.min(maxScrollHeight, height * 2) },
    })
    return outPath
  } finally {
    await browser.close()
  }
}

async function dismissOverlays(page) {
  const selectors = [
    'button:has-text("Accept all")',
    'button:has-text("Accept All")',
    'button:has-text("Accept")',
    'button:has-text("Got it")',
    'button:has-text("I agree")',
    'button:has-text("Allow all")',
    'button[aria-label="Accept all"]',
    'button[aria-label*="accept" i]',
    '#onetrust-accept-btn-handler',
    '.cookie-accept',
  ]
  for (const sel of selectors) {
    const btn = await page.$(sel).catch(() => null)
    if (btn) {
      await btn.click({ timeout: 1000 }).catch(() => {})
      await page.waitForTimeout(300)
    }
  }
}

/**
 * Upload a captured screenshot to the site's /api/upload endpoint, which
 * proxies to cPanel storage and returns a /api/file/<path> URL that
 * Vercel's edge can serve in production.
 *
 * Falls back to throwing — caller decides whether to use local path
 * instead. The existing capture-screenshots.mjs script uses the same
 * endpoint, so the 100 AI/ML listings already have their screenshots
 * there; new scrapes use the same storage.
 *
 * @param {string} filePath           Absolute path to the local .jpg file
 * @param {string} filename           Suggested filename for the upload
 * @param {string} [siteBase]         e.g. http://localhost:3000 (default)
 *                                    or https://infowebworld.com
 * @returns {Promise<string>}         Public URL (e.g. /api/file/logos/abc.jpg)
 */
export async function uploadScreenshot(filePath, filename, siteBase = 'http://localhost:3000') {
  const buf = readFileSync(filePath)
  const fd = new FormData()
  const blob = new Blob([buf], { type: 'image/jpeg' })
  fd.append('file', blob, filename)
  const resp = await fetch(`${siteBase}/api/upload`, { method: 'POST', body: fd })
  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    throw new Error(`upload HTTP ${resp.status}: ${text.slice(0, 200)}`)
  }
  const json = await resp.json().catch(() => ({}))
  if (!json.ok || !json.url) {
    throw new Error(`bad upload response: ${JSON.stringify(json).slice(0, 200)}`)
  }
  return json.url
}

/**
 * Convenience: produce both screenshots for a listing in one call.
 * The home shot is mandatory; secondary is best-effort.
 *
 * @param {object} args
 * @param {string} args.slug                            Listing slug (filename root)
 * @param {string} args.homeUrl                         Home page URL
 * @param {string|null} args.secondaryUrl               URL for shot 2 (pricing / features / about)
 * @param {string} args.outDir                          Base directory (e.g. .../public/scrape-screenshots)
 * @param {string} args.publicBase                      URL prefix for the returned paths (e.g. '/scrape-screenshots')
 *
 * @returns {Promise<{ home: string, secondary: string|null, errors: string[] }>}
 */
export async function captureListingScreenshots({ slug, homeUrl, secondaryUrl, outDir, publicBase = '/scrape-screenshots' }) {
  const errors = []
  const homeFile = join(outDir, `${slug}-home.jpg`)
  try {
    await captureScreenshot(homeUrl, homeFile)
  } catch (err) {
    errors.push(`home: ${err.message}`)
    throw err   // home is compulsory
  }

  let secondaryPublic = null
  if (secondaryUrl) {
    const secondaryFile = join(outDir, `${slug}-secondary.jpg`)
    try {
      await captureScreenshot(secondaryUrl, secondaryFile)
      secondaryPublic = `${publicBase}/${slug}-secondary.jpg`
    } catch (err) {
      errors.push(`secondary: ${err.message}`)
      // not fatal
    }
  }

  return {
    home: `${publicBase}/${slug}-home.jpg`,
    secondary: secondaryPublic,
    errors,
  }
}
