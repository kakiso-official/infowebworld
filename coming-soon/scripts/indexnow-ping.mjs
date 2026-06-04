#!/usr/bin/env node
/* ────────────────────────────────────────────────────────────
   IndexNow ping — instant URL submission to Bing, Yandex,
   Naver, Seznam, and IndexNow-compliant search engines.
   Google does NOT participate, but Bing-powered AI search
   surfaces (ChatGPT search, Copilot) pick up changes fast.

   Usage:
     node scripts/indexnow-ping.mjs                   # ping all 21 indexable URLs
     node scripts/indexnow-ping.mjs /faqs /glossary   # ping specific paths

   Key file lives at /public/<KEY>.txt and must be reachable
   at https://www.infowebworld.com/<KEY>.txt before pings succeed.
   ──────────────────────────────────────────────────────────── */

const KEY = '8f3c4e2d6b914a5e87cd0192f6e4b3a7'
const HOST = 'infowebworld.com'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const ENDPOINT = 'https://api.indexnow.org/indexnow'

const DEFAULT_PATHS = [
  '/', '/business', '/business/plans', '/categories',
  '/about', '/terms', '/privacy', '/cookies', '/content-guidelines', '/do-not-sell',
  '/faqs', '/help', '/glossary', '/category-guides', '/removals',
  '/agencies', '/affiliates', '/media', '/team', '/team/past', '/insights', '/write-review',
]

const args = process.argv.slice(2)
const paths = args.length > 0 ? args : DEFAULT_PATHS
const urls = paths.map(p => `https://${HOST}${p === '/' ? '' : p}`)

console.log(`[IndexNow] Pinging ${urls.length} URL(s) via ${ENDPOINT}`)
console.log(`[IndexNow] Key location: ${KEY_LOCATION}`)

const body = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urls,
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
})

const text = await res.text()
console.log(`[IndexNow] HTTP ${res.status}`)
if (text) console.log(`[IndexNow] Response: ${text}`)

if (res.status === 200 || res.status === 202) {
  console.log(`[IndexNow] OK — ${urls.length} URL(s) submitted.`)
  process.exit(0)
} else {
  console.error(`[IndexNow] FAIL — non-2xx response.`)
  process.exit(1)
}
