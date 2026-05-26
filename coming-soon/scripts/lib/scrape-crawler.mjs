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
export async function fetchPage(url, { timeout = 30000, waitForNetworkIdle = 5000 } = {}) {
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
    await ctx.close()
  }
}

/**
 * Try each path in order on the base. Returns the first 2xx (with the path
 * that worked) or null if every attempt failed / 404'd.
 */
export async function fetchWithFallback(baseUrl, paths, opts = {}) {
  for (const path of paths) {
    let fullUrl
    try {
      fullUrl = new URL(path, baseUrl).toString()
    } catch {
      continue
    }
    try {
      const res = await fetchPage(fullUrl, opts)
      if (res.status >= 200 && res.status < 300) {
        return { ...res, path, attemptedUrl: fullUrl }
      }
    } catch {
      // try the next path
    }
  }
  return null
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
