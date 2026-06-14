#!/usr/bin/env node
/**
 * Regression guard for the REMOVED country URL space.
 *
 * The site used to serve /{country}/* pages (/in, /us/ai-ml, /uk/blog, …).
 * Those are gone and MUST return a hard 404 so Google de-indexes them and
 * never re-indexes them.
 *
 * Why this guard exists: the failure mode is SILENT. If someone breaks the
 * middleware match (COUNTRY_PREFIX_RE), or makes app/url-removed/page.tsx
 * stream (e.g. adds `force-dynamic`, cookies(), headers()), or re-adds a
 * country redirect in next.config.ts, these URLs quietly go back to HTTP 200
 * (a "soft 404") and Google treats them as live pages again — the exact bug
 * that put /in back in the index. You can't see it by eyeballing the page; it
 * looks like a 404 but the STATUS CODE is 200. This script tests the status
 * code, which is the only thing that actually matters to Google.
 *
 * Usage:
 *   node scripts/check-country-404.mjs                       # checks production
 *   node scripts/check-country-404.mjs https://staging.url   # checks any origin
 *   npm run check:country-404
 *
 * Exit 0 = all correct. Exit 1 = at least one URL is wrong (so this can gate a
 * deploy or run on a schedule and alert).
 */

const BASE = (process.argv[2] || process.env.SMOKE_BASE_URL || 'https://www.infowebworld.com').replace(/\/+$/, '')

/* Must return 404 — bare country prefixes + representative sub-paths. Keep this
   list in sync with COUNTRY_PREFIX_RE in middleware.ts. /in/listing/claude is
   deliberately a country-prefixed version of a REAL listing: the prefix must
   still kill it. */
const MUST_404 = [
  '/in', '/us', '/uk', '/ca', '/au', '/eu', '/global',
  '/in/ai-ml', '/uk/blog', '/us/software-saas', '/in/listing/claude',
]

/* Must stay live (200) — guards the OTHER direction: an over-greedy match must
   not start eating real routes. /insights starts with "in", /investors with
   "in" too — the (\/|$) word boundary is what keeps them safe, so test them. */
const MUST_200 = [
  '/', '/about', '/categories', '/ai-ml', '/insights', '/investors',
]

async function statusOf(path) {
  try {
    const res = await fetch(BASE + path, {
      method: 'GET',
      redirect: 'follow', // apex→www is a 301; we want the FINAL status, not the hop
      headers: { 'user-agent': 'iww-country-404-guard' },
    })
    return res.status
  } catch (err) {
    return `ERR(${err.message})`
  }
}

const checks = [
  ...MUST_404.map((path) => ({ path, want: 404 })),
  ...MUST_200.map((path) => ({ path, want: 200 })),
]

console.log(`Checking ${checks.length} URLs against ${BASE}\n`)

let failed = 0
for (const c of checks) {
  const got = await statusOf(c.path)
  const ok = got === c.want
  if (!ok) failed++
  console.log(`${ok ? '✓' : '✗'}  want ${c.want}  got ${String(got).padEnd(7)}  ${c.path}`)
}

console.log('')
if (failed) {
  console.error(`FAIL — ${failed}/${checks.length} URL(s) wrong against ${BASE}.`)
  console.error('Country URLs are NOT cleanly 404ing — do NOT assume Google will drop them.')
  console.error('Check: middleware.ts (COUNTRY_PREFIX_RE rewrite) + app/url-removed/page.tsx (must stay static/non-streamed) + next.config.ts (no country redirect).')
  process.exit(1)
}
console.log(`PASS — all ${checks.length} URLs correct against ${BASE}.`)
