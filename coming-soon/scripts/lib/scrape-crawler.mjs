/**
 * Playwright-based site crawler for the scraper pipeline.
 *
 * Singleton browser per process. Each page fetch gets its own fresh context
 * (no cookies leaking between domains). Returns clean HTML + plain text,
 * plus the final URL (post-redirect) and bytes for the step log.
 *
 * fetchWithFallback tries each path in order against a base URL and returns
 * the first 200-OK response. Used to find /pricing in the half-dozen
 * places different sites put it.
 */
import { chromium } from 'playwright'

let browser = null

async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
    })
  }
  return browser
}

export async function closeCrawler() {
  if (browser) {
    await browser.close()
    browser = null
  }
}

const REAL_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'

/**
 * Fetch a single page. Returns { status, html, text, bytes, finalUrl, title }.
 * Throws only on network-level errors (timeout, DNS, etc.). Non-2xx returns
 * the status — caller decides whether to retry / fall back.
 */
export async function fetchPage(url, { timeout = 18000, waitForNetworkIdle = 2500 } = {}) {
  const b = await getBrowser()
  const ctx = await b.newContext({
    userAgent: REAL_UA,
    viewport: { width: 1440, height: 900 },
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
    ignoreHTTPSErrors: true,
  })
  const page = await ctx.newPage()
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout })
    const status = resp ? resp.status() : 0
    // Best-effort net idle — don't block forever if a third-party tag never quits
    await page.waitForLoadState('networkidle', { timeout: waitForNetworkIdle }).catch(() => {})
    const html = await page.content()
    const title = await page.title().catch(() => '')
    const text = await page.evaluate(() => document.body?.innerText ?? '').catch(() => '')
    return {
      status,
      html,
      text,
      bytes: Buffer.byteLength(html, 'utf8'),
      finalUrl: page.url(),
      title,
    }
  } finally {
    /* Swallow context-close errors but log them — a leaked context
       eventually OOMs the chromium process. Without this catch, a
       close-time error in one job kills the worker mid-pipeline. */
    await ctx.close().catch(err => {
      console.warn(`[crawler] context close failed for ${url}: ${err.message}`)
    })
  }
}

/* Soft-404 heuristic. Some sites return HTTP 200 for /pricing even when
   there is no pricing page (sneaky redirects to home, error templates
   that render with status 200, single-page apps that render their 404
   route client-side). If the body is tiny or the title looks like an
   error page, we don't want to use it as the pricing source — fall
   back to the next path in the chain. */
function looksLikeSoft404(res) {
  const text = String(res?.text || '').trim()
  if (text.length < 200) return true
  const title = String(res?.title || '').toLowerCase()
  if (/^(404|not found|page not found|error)\b/.test(title)) return true
  return false
}

/**
 * Try each path in order on the base. Returns the first 2xx (with the path
 * that worked) or null if every attempt failed / 404'd.
 */
export async function fetchWithFallback(baseUrl, paths, opts = {}) {
  /* Keep the best soft-404 candidate as a last resort: a single 2xx that
     looked like an error page is still better than null when none of the
     other paths returned anything at all. maxAttempts caps how many candidate
     paths we probe — most sites put the page at the first 1-2 paths, and
     probing all 10 sequentially is the main per-section latency sink. */
  const { maxAttempts = 5, ...fetchOpts } = opts
  let softFallback = null
  for (const path of paths.slice(0, maxAttempts)) {
    let fullUrl
    try {
      fullUrl = new URL(path, baseUrl).toString()
    } catch {
      continue
    }
    try {
      const res = await fetchPage(fullUrl, fetchOpts)
      if (res.status >= 200 && res.status < 300) {
        if (looksLikeSoft404(res)) {
          if (!softFallback) softFallback = { ...res, path, attemptedUrl: fullUrl }
          continue
        }
        return { ...res, path, attemptedUrl: fullUrl }
      }
    } catch {
      // try the next path
    }
  }
  return softFallback
}

// Canonical fallback chains — order matters (most common first).
export const PRICING_FALLBACKS = [
  '/pricing', '/plans', '/buy', '/price', '/subscriptions', '/subscribe',
  '/upgrade', '/billing', '/membership', '/pricing-plans',
]
export const FEATURES_FALLBACKS = [
  '/features', '/product', '/platform', '/capabilities', '/solutions',
  '/use-cases', '/why', '/what-we-do',
]
export const FAQ_FALLBACKS = [
  '/faq', '/faqs', '/help', '/support', '/help-center',
  '/knowledge-base', '/docs/faq', '/learn/faq',
]
export const ABOUT_FALLBACKS = [
  '/about', '/about-us', '/company', '/team', '/who-we-are',
]
export const INTEGRATIONS_FALLBACKS = [
  '/integrations', '/apps', '/marketplace', '/partners',
  '/works-with', '/ecosystem', '/connectors', '/extensions',
  '/integrations/all', '/app-directory',
]
