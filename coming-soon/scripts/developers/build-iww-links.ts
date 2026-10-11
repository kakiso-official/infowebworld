#!/usr/bin/env -S npx tsx
/* ═══════════════════════════════════════════════════════════════════════
   build-iww-links.ts - InfoWebWorld for Developers (WP2-oss)

   Live-verifies the cross-links into the rest of InfoWebWorld that the OSS
   snapshot asserts, against the real production site:

     1. Every OSS company with listedOnIww gets its iwwPath GET-checked on
        https://www.infowebworld.com. A non-200 delists it (listedOnIww
        -> false, iwwUrl/iwwPath/iwwMode/iwwName -> null) and is logged;
        data/developers/oss/companies.json is rewritten with the result.
     2. Every distinct country present in the companies rewrites to a
        countryHubPath() (lib/country-paths.ts); the ones that return 200
        are written to data/developers/iww-links.json.

   Read-only against the live site (no DB, no localhost). Re-runnable: it
   always starts from the current companies.json and re-checks every link.

   Usage: npx tsx scripts/developers/build-iww-links.ts
   ═══════════════════════════════════════════════════════════════════════ */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { countryHubPath } from '../../lib/country-paths'
import type { OssCompany, IwwLinks } from '../../lib/developers/types'

type Company = OssCompany & { iwwMode: 'company' | 'product' | null; iwwName: string | null }

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '../..')
const OSS_DIR = path.join(REPO_ROOT, 'data/developers/oss')
const COMPANIES_FILE = path.join(OSS_DIR, 'companies.json')
const OUT_FILE = path.join(REPO_ROOT, 'data/developers/iww-links.json')

const SITE_ORIGIN = 'https://www.infowebworld.com'
const USER_AGENT = 'Mozilla/5.0 (compatible; InfoWebWorldBot/1.0; +https://www.infowebworld.com/developers/methodology)'
const CONCURRENCY = 6
const TIMEOUT_MS = 15000
const RETRIES = 2 /* one retry after a short delay - avoid delisting on a transient blip */

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}
function writeJsonMin(p: string, data: unknown): void {
  fs.writeFileSync(p, JSON.stringify(data))
}
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function runWithConcurrency<T>(items: T[], limit: number, worker: (item: T) => Promise<void>): Promise<void> {
  let idx = 0
  const lanes = Math.max(1, Math.min(limit, items.length))
  async function lane(): Promise<void> {
    for (;;) {
      const i = idx++
      if (i >= items.length) return
      await worker(items[i])
    }
  }
  await Promise.all(Array.from({ length: lanes }, lane))
}

/** GET {SITE_ORIGIN}{pathname} with the bot UA; true only on a real 200,
 *  following redirects. One retry after a short delay before giving up. */
async function checkPath(pathname: string): Promise<boolean> {
  const url = `${SITE_ORIGIN}${pathname}`
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      const res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*' },
      })
      /* Drain the body so the connection can be reused/closed cleanly. */
      await res.arrayBuffer().catch(() => undefined)
      if (res.status === 200) return true
      if (attempt === RETRIES) return false
    } catch {
      if (attempt === RETRIES) return false
    } finally {
      clearTimeout(timer)
    }
    await sleep(2000)
  }
  return false
}

async function main(): Promise<void> {
  const companies = readJson<Company[]>(COMPANIES_FILE)

  /* ── 1. Company iwwPath checks ──────────────────────────────────────── */
  const listed = companies.filter((c): c is Company & { iwwPath: string } => Boolean(c.listedOnIww && c.iwwPath))
  console.log(`[iww-links] checking ${listed.length} company iwwPath(s) on ${SITE_ORIGIN}, concurrency ${CONCURRENCY}`)

  const delisted: Array<{ slug: string; iwwPath: string }> = []
  await runWithConcurrency(listed, CONCURRENCY, async (c) => {
    const ok = await checkPath(c.iwwPath)
    if (!ok) {
      delisted.push({ slug: c.slug, iwwPath: c.iwwPath })
      Object.assign(c, { listedOnIww: false, iwwUrl: null, iwwPath: null, iwwMode: null, iwwName: null })
    }
  })

  if (delisted.length) {
    console.log(`[iww-links] delisted ${delisted.length} compan(y/ies) (iwwPath did not return 200):`)
    for (const d of delisted) console.log(`  - ${d.slug}: ${d.iwwPath}`)
  }
  writeJsonMin(COMPANIES_FILE, companies)
  console.log(`[iww-links] ${listed.length - delisted.length}/${listed.length} company link(s) verified live; companies.json rewritten`)

  /* ── 2. Country hub checks ──────────────────────────────────────────── */
  const countrySlugs = [...new Set(companies.map(c => c.countrySlug).filter((s): s is string => Boolean(s)))].sort()
  console.log(`[iww-links] checking ${countrySlugs.length} country hub(s)`)

  const verifiedHubs: string[] = []
  const deadHubs: string[] = []
  await runWithConcurrency(countrySlugs, CONCURRENCY, async (slug) => {
    const p = countryHubPath(slug)
    const ok = await checkPath(p)
    if (ok) verifiedHubs.push(p)
    else deadHubs.push(p)
  })
  verifiedHubs.sort()
  if (deadHubs.length) console.log('[iww-links] country hub(s) not 200 (excluded):', deadHubs.sort().join(', '))

  const out: IwwLinks = { generatedAt: new Date().toISOString(), countryHubs: verifiedHubs }
  writeJsonMin(OUT_FILE, out)

  console.log('\n── build-iww-links summary ─────────────────────────────')
  console.log('companies checked:', listed.length, ' delisted:', delisted.length, ' still listed:', listed.length - delisted.length)
  console.log('country hubs checked:', countrySlugs.length, ' verified (200):', verifiedHubs.length)
  console.log('wrote:', COMPANIES_FILE)
  console.log('wrote:', OUT_FILE, `(${(fs.statSync(OUT_FILE).size / 1024).toFixed(1)} KB)`)
}

main().catch(err => { console.error(err); process.exit(1) })
