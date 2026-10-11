#!/usr/bin/env node
/**
 * scan-iww-github.mjs
 *
 * Finds which InfoWebWorld-listed companies/products have a real GitHub
 * presence, so a new "Open Source Projects by Companies" section can
 * feature them and link back to their InfoWebWorld page.
 *
 * Pipeline (all stages are resumable — re-run the same command to continue):
 *   1. DB:      one mysql2 createConnection, read-only SELECT of live
 *               listings with a website (local-businesses sector skipped),
 *               connection closed immediately. Cached to disk.
 *   2. FETCH:   homepage HTML fetched for each listing (concurrency 12,
 *               12s timeout, <=1.5MB, follows redirects). Each result is
 *               appended to a JSONL progress file as it completes, and
 *               already-done listings are skipped on re-run. Time-boxed
 *               per invocation (default 8 minutes) so it fits one tool call.
 *   3. EXTRACT: github.com/OWNER[/REPO] hrefs pulled out of the fetched
 *               HTML, GitHub's own non-org paths filtered out.
 *   4. VERIFY:  candidate owners checked via GitHub GraphQL (gh api graphql),
 *               batched with aliases, cached to disk so a re-run only
 *               queries new owners.
 *   5. MATCH:   domain-match or name-match + has-public-repos rule applied;
 *               writes the final matches JSON + a markdown report.
 *
 * Usage:
 *   node scripts/developers/scan-iww-github.mjs                 # run everything, resuming
 *   node scripts/developers/scan-iww-github.mjs --stage=fetch   # only run the fetch stage
 *   node scripts/developers/scan-iww-github.mjs --stage=verify  # only run the verify+match stage
 *   MAX_RUNTIME_MS=480000 node scripts/developers/scan-iww-github.mjs
 *
 * Reads credentials from .env.local (repo root's parent working dir — this
 * script is run with the Next.js project as cwd). Never writes to the DB.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'

/* ── Config ─────────────────────────────────────────────────────────── */
const DATA_DIR = process.env.DEVHUB_DATA_DIR ||
  'C:/Users/AADIL PARMAR/AppData/Local/Temp/claude/F--infoWebWorld-launching-coming-soon/c4f80252-7fec-429c-8b95-1285fe8331e8/scratchpad/devhub/data'
const TARGETS_FILE   = path.join(DATA_DIR, 'iww-listings-with-website.json')
const PROGRESS_FILE  = path.join(DATA_DIR, 'iww-homepage-fetch-progress.jsonl')
const CANDIDATES_FILE = path.join(DATA_DIR, 'iww-github-candidates.json')
const OWNERS_CACHE_FILE = path.join(DATA_DIR, 'iww-github-owners-cache.json')
const MATCHES_FILE   = path.join(DATA_DIR, 'iww-github-matches.json')
const REPORT_FILE    = path.join(DATA_DIR, 'iww-github-scan-report.md')

const MAX_RUNTIME_MS = Number(process.env.MAX_RUNTIME_MS || 8 * 60 * 1000)
const FETCH_CONCURRENCY = 12
const FETCH_TIMEOUT_MS = 12_000
const MAX_BYTES = 1.5 * 1024 * 1024
const USER_AGENT = 'Mozilla/5.0 (compatible; InfoWebWorldBot/1.0; +https://www.infowebworld.com/about)'
const START = Date.now()
const timeLeft = () => MAX_RUNTIME_MS - (Date.now() - START)

const args = new Set(process.argv.slice(2))
const stageArg = [...args].find(a => a.startsWith('--stage='))
const ONLY_STAGE = stageArg ? stageArg.split('=')[1] : null
const runStage = (name) => !ONLY_STAGE || ONLY_STAGE === name

mkdirSync(DATA_DIR, { recursive: true })

function log(...a) { console.log(new Date().toISOString().slice(11, 19), ...a) }

/* ── .env.local parsing (same approach as scripts/export-categories.mjs) ─ */
function loadEnv() {
  const env = {}
  const raw = readFileSync('.env.local', 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    let v = m[2]
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    env[m[1]] = v
  }
  return env
}

/* ── Stage 1: DB read (one connection, closed immediately) ─────────────── */
async function fetchTargets() {
  if (existsSync(TARGETS_FILE)) {
    const cached = JSON.parse(readFileSync(TARGETS_FILE, 'utf8'))
    log(`DB: using cached target list (${cached.length} listings) from ${TARGETS_FILE}`)
    return cached
  }

  log('DB: connecting (read-only)...')
  const mysql = await import('mysql2/promise')
  const env = loadEnv()
  const conn = await mysql.createConnection({
    host: env.DATABASE_HOST,
    port: Number(env.DATABASE_PORT || 3306),
    database: env.DATABASE_NAME,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    ssl: env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    connectTimeout: 10_000,
  })
  try {
    /* Sector resolution mirrors scripts/export-categories.mjs: climb up to
       4 parents to reach the L1 ancestor's slug. local-businesses is
       excluded per task instructions (cheap to resolve here, so we do). */
    const [rows] = await conn.execute(`
      SELECT
        s.id, s.slug, COALESCE(s.listing_mode, 'product') AS mode,
        s.company_name AS name, s.website,
        CASE
          WHEN c.level = 1 THEN c.slug
          WHEN c.level = 2 THEN p.slug
          WHEN c.level = 3 THEN gp.slug
          WHEN c.level = 4 THEN ggp.slug
          WHEN c.level = 5 THEN gggp.slug
        END AS sector_slug
      FROM submissions s
      LEFT JOIN categories c    ON c.id    = s.category_id
      LEFT JOIN categories p    ON p.id    = c.parent_id
      LEFT JOIN categories gp   ON gp.id   = p.parent_id
      LEFT JOIN categories ggp  ON ggp.id  = gp.parent_id
      LEFT JOIN categories gggp ON gggp.id = ggp.parent_id
      WHERE s.status IN ('active', 'paid')
        AND s.website IS NOT NULL AND s.website != ''
      ORDER BY s.id ASC
    `)
    const targets = rows
      .filter(r => r.sector_slug !== 'local-businesses')
      .map(r => ({
        id: r.id,
        slug: r.slug,
        mode: r.mode === 'company' ? 'company' : 'product',
        iwwUrl: r.mode === 'company' ? `/profile/${r.slug}` : `/listing/${r.slug}`,
        name: r.name,
        website: r.website,
        sector: r.sector_slug || null,
      }))
    writeFileSync(TARGETS_FILE, JSON.stringify(targets, null, 2))
    log(`DB: ${rows.length} live listings with a website, ${targets.length} after excluding local-businesses -> ${TARGETS_FILE}`)
    return targets
  } finally {
    await conn.end()
    log('DB: connection closed')
  }
}

/* ── Stage 2: homepage fetch (resumable, time-boxed) ────────────────────── */
function loadProgress() {
  const done = new Map()
  if (!existsSync(PROGRESS_FILE)) return done
  const raw = readFileSync(PROGRESS_FILE, 'utf8')
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue
    try {
      const rec = JSON.parse(line)
      done.set(rec.id, rec)
    } catch { /* skip corrupt line */ }
  }
  return done
}

function normalizeUrl(u) {
  if (!/^https?:\/\//i.test(u)) return `https://${u}`
  return u
}

async function fetchOne(target) {
  const url = normalizeUrl(target.website)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*' },
    })
    const reader = res.body?.getReader?.()
    let html = ''
    if (reader) {
      const decoder = new TextDecoder('utf-8', { fatal: false })
      let total = 0
      while (total < MAX_BYTES) {
        const { done, value } = await reader.read()
        if (done) break
        total += value.length
        html += decoder.decode(value, { stream: true })
      }
      try { await reader.cancel() } catch { /* ignore */ }
    } else {
      html = await res.text()
    }
    if (html.length > MAX_BYTES) html = html.slice(0, MAX_BYTES)
    return {
      id: target.id, ok: true, status: res.status,
      finalUrl: res.url || url, htmlLength: html.length, html,
    }
  } catch (err) {
    return { id: target.id, ok: false, error: err instanceof Error ? err.message : String(err) }
  } finally {
    clearTimeout(timer)
  }
}

/* GitHub href extraction happens here, immediately after fetch, so the
   progress JSONL stores only small extracted hrefs, not full HTML
   (keeps the resumable file small and avoids holding megabytes of HTML
   across runs). */
const GITHUB_HREF_RE = /href\s*=\s*["']\s*(https?:\/\/(?:www\.)?github\.com\/[^"'\s#]+)/gi

function extractGithubHrefs(html) {
  const hrefs = new Set()
  let m
  while ((m = GITHUB_HREF_RE.exec(html))) hrefs.add(m[1])
  return [...hrefs]
}

async function runFetchStage(targets) {
  const done = loadProgress()
  const pending = targets.filter(t => !done.has(t.id))
  log(`FETCH: ${done.size} already done, ${pending.length} pending`)
  if (pending.length === 0) return done

  let idx = 0
  let completedThisRun = 0
  const budgetExceeded = () => timeLeft() < 15_000 // leave 15s margin to flush

  async function worker() {
    while (idx < pending.length && !budgetExceeded()) {
      const target = pending[idx++]
      const result = await fetchOne(target)
      const rec = result.ok
        ? { id: target.id, ok: true, status: result.status, finalUrl: result.finalUrl,
            htmlLength: result.htmlLength, githubHrefs: extractGithubHrefs(result.html) }
        : { id: target.id, ok: false, error: result.error }
      appendFileSync(PROGRESS_FILE, JSON.stringify(rec) + '\n')
      completedThisRun++
      if (completedThisRun % 100 === 0) {
        log(`FETCH: ${completedThisRun}/${pending.length} this run (${idx}/${pending.length} attempted), ${Math.round(timeLeft() / 1000)}s left`)
      }
    }
  }

  const workers = Array.from({ length: FETCH_CONCURRENCY }, () => worker())
  await Promise.all(workers)
  log(`FETCH: run finished — ${completedThisRun} completed this invocation, ${idx}/${pending.length} attempted`)
  return loadProgress()
}

/* ── Stage 3: extract candidate owners ──────────────────────────────── */
const GITHUB_RESERVED = new Set([
  'about', 'features', 'pricing', 'login', 'join', 'sponsors', 'marketplace',
  'topics', 'collections', 'trending', 'explore', 'enterprise',
  'customer-stories', 'site', 'security', 'readme', 'apps', 'settings',
  'notifications', 'new', 'team', 'contact', 'events', 'solutions',
  'resources', 'customers', 'partners', 'premium-support', 'github',
  'octocat', 'orgs', 'users', 'search', 'codespaces', 'copilot', 'pulls',
  'issues', 'notifications', 'watching', 'stars', 'sponsors', 'settings',
  'dashboard', 'notifications', 'marketplace', 'explore', 'topics',
  'about', 'security', 'pricing', 'nonprofit', 'education', 'contact',
  'support', 'shop', 'mobile', 'desktop', 'cli', 'docs', 'blog', 'press',
  'status', 'legal', 'privacy', 'terms', 'sitemap', 'home', 'features',
])

function ownerFromGithubUrl(href) {
  try {
    const u = new URL(href)
    if (!/(^|\.)github\.com$/i.test(u.hostname)) return null
    let parts = u.pathname.split('/').filter(Boolean)
    if (parts[0] === 'orgs' && parts[1]) parts = [parts[1]]
    if (parts.length === 0) return null
    const owner = parts[0].toLowerCase()
    if (GITHUB_RESERVED.has(owner)) return null
    if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(parts[0])) return null
    return parts[0] // preserve original case for the GraphQL lookup
  } catch {
    return null
  }
}

function runExtractStage(targets) {
  const done = loadProgress()
  const byId = new Map(targets.map(t => [t.id, t]))
  /* owner (lowercased) -> { owner, listingIds: Set, rawHrefs: Set } */
  const candidates = new Map()
  let homepagesOk = 0
  let homepagesFailed = 0

  for (const [id, rec] of done) {
    if (!rec.ok) { homepagesFailed++; continue }
    homepagesOk++
    const target = byId.get(id)
    if (!target) continue
    for (const href of rec.githubHrefs || []) {
      const owner = ownerFromGithubUrl(href)
      if (!owner) continue
      const key = owner.toLowerCase()
      if (!candidates.has(key)) candidates.set(key, { owner, listingIds: new Set(), rawHrefs: new Set() })
      const c = candidates.get(key)
      c.listingIds.add(id)
      c.rawHrefs.add(href)
    }
  }

  const list = [...candidates.values()].map(c => ({
    owner: c.owner,
    listingIds: [...c.listingIds],
    rawHrefs: [...c.rawHrefs].slice(0, 5),
  }))
  writeFileSync(CANDIDATES_FILE, JSON.stringify(list, null, 2))
  log(`EXTRACT: ${homepagesOk} homepages OK, ${homepagesFailed} failed, ${list.length} candidate owners -> ${CANDIDATES_FILE}`)
  return { list, homepagesOk, homepagesFailed }
}

/* ── Stage 4: verify owners via GitHub GraphQL (gh api graphql) ─────── */
function loadOwnerCache() {
  if (!existsSync(OWNERS_CACHE_FILE)) return new Map()
  const raw = JSON.parse(readFileSync(OWNERS_CACHE_FILE, 'utf8'))
  return new Map(Object.entries(raw))
}
function saveOwnerCache(cache) {
  const obj = Object.fromEntries(cache)
  writeFileSync(OWNERS_CACHE_FILE, JSON.stringify(obj, null, 2))
}

function buildOwnerQuery(owners) {
  const parts = owners.map((login, i) => `
    o${i}: repositoryOwner(login: ${JSON.stringify(login)}) {
      login
      ... on Organization {
        __typename
        name
        websiteUrl
        description
        location
      }
      ... on User {
        __typename
        name
        websiteUrl
        bio
        location
      }
      repositories(first: 5, isFork: false, privacy: PUBLIC, orderBy: {field: STARGAZERS, direction: DESC}) {
        totalCount
        nodes { name stargazerCount pushedAt }
      }
    }`).join('\n')
  return `query {\n${parts}\n  rateLimit { cost remaining resetAt }\n}`
}

async function ghGraphQL(query) {
  const out = execFileSync('gh', ['api', 'graphql', '-f', `query=${query}`], {
    encoding: 'utf8', maxBuffer: 20 * 1024 * 1024,
  })
  return JSON.parse(out)
}

async function runVerifyStage(candidates) {
  const cache = loadOwnerCache()
  const unknown = candidates.filter(c => !cache.has(c.owner.toLowerCase()))
  log(`VERIFY: ${cache.size} owners cached, ${unknown.length} new owners to query`)

  const BATCH = 40
  for (let i = 0; i < unknown.length; i += BATCH) {
    if (timeLeft() < 20_000) { log('VERIFY: time budget hit, stopping — re-run to continue'); break }
    const batch = unknown.slice(i, i + BATCH)
    const query = buildOwnerQuery(batch.map(c => c.owner))
    let resp
    try {
      resp = await ghGraphQL(query)
    } catch (err) {
      log(`VERIFY: batch ${i / BATCH} failed: ${err instanceof Error ? err.message.slice(0, 300) : err}`)
      // Fall back to per-owner queries for this batch so one bad login
      // (renamed/deleted user) doesn't lose the whole batch.
      for (const c of batch) {
        try {
          const single = await ghGraphQL(buildOwnerQuery([c.owner]))
          const node = single.data?.o0
          cache.set(c.owner.toLowerCase(), node || null)
        } catch {
          cache.set(c.owner.toLowerCase(), null)
        }
      }
      saveOwnerCache(cache)
      continue
    }
    batch.forEach((c, j) => {
      const node = resp.data?.[`o${j}`]
      cache.set(c.owner.toLowerCase(), node || null)
    })
    saveOwnerCache(cache)
    if ((i / BATCH) % 5 === 0) log(`VERIFY: queried ${Math.min(i + BATCH, unknown.length)}/${unknown.length} owners`)
  }
  return cache
}

/* ── Stage 5: matching rules ─────────────────────────────────────────── */
/* Approximate eTLD+1 extraction. No PSL package is installed; this covers
   the common multi-label public suffixes we're likely to see on company
   homepages and falls back to "last two labels" otherwise. Good enough
   for a same-registrable-domain comparison, not a legal-grade PSL impl. */
const MULTI_LABEL_SUFFIXES = new Set([
  'co.uk', 'org.uk', 'me.uk', 'ltd.uk', 'plc.uk', 'net.uk', 'sch.uk',
  'co.in', 'net.in', 'org.in', 'firm.in', 'gen.in', 'ind.in',
  'com.au', 'net.au', 'org.au', 'edu.au', 'gov.au', 'id.au',
  'co.nz', 'net.nz', 'org.nz',
  'co.jp', 'or.jp', 'ne.jp', 'ac.jp',
  'co.kr', 'or.kr', 'ne.kr',
  'com.br', 'net.br', 'org.br',
  'com.mx', 'com.ar', 'com.co', 'com.pe', 'com.cl',
  'co.za', 'org.za', 'net.za',
  'com.sg', 'com.my', 'com.hk', 'com.tw', 'com.ph', 'com.vn', 'com.pk',
  'com.cn', 'net.cn', 'org.cn',
  'com.tr', 'com.ua', 'com.pl',
  'co.id', 'or.id',
  'com.ng', 'com.eg', 'com.sa', 'com.ae',
])

function registrableDomain(rawUrl) {
  try {
    const u = new URL(normalizeUrl(rawUrl))
    const host = u.hostname.toLowerCase().replace(/^www\./, '')
    const labels = host.split('.')
    if (labels.length <= 2) return host
    const lastTwo = labels.slice(-2).join('.')
    if (MULTI_LABEL_SUFFIXES.has(lastTwo) && labels.length >= 3) {
      return labels.slice(-3).join('.')
    }
    return lastTwo
  } catch {
    return null
  }
}

/* Exactly the suffix list the task specifies — deliberately not extended
   with generic business words (solutions, systems, group, ...), since
   stripping those risks false-positive name matches between unrelated
   companies that happen to share a generic word. */
const NAME_SUFFIXES = /\b(inc|incorporated|ltd|limited|llc|pty|labs|hq|io|ai|app)\b/g

function normalizeName(name) {
  if (!name) return ''
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(NAME_SUFFIXES, ' ')
    .replace(/\s+/g, '')
    .trim()
}

function runMatchStage(targets, candidates, ownerCache) {
  const byId = new Map(targets.map(t => [t.id, t]))
  const matches = []
  const rejectedExamples = []

  for (const cand of candidates) {
    const node = ownerCache.get(cand.owner.toLowerCase())
    if (!node) { rejectedExamples.push({ owner: cand.owner, reason: 'owner not found on GitHub' }); continue }

    const repoCount = node.repositories?.totalCount ?? 0
    if (repoCount < 1) { rejectedExamples.push({ owner: cand.owner, reason: 'zero public non-fork repos' }); continue }

    for (const listingId of cand.listingIds) {
      const target = byId.get(listingId)
      if (!target) continue

      let matchReason = null
      const listingDomain = registrableDomain(target.website)
      const ownerDomain = node.websiteUrl ? registrableDomain(node.websiteUrl) : null
      if (listingDomain && ownerDomain && listingDomain === ownerDomain) {
        matchReason = 'domain'
      } else if (node.__typename === 'Organization') {
        const normOwnerLogin = normalizeName(node.login)
        const normOwnerName = normalizeName(node.name || '')
        const normListingName = normalizeName(target.name)
        if (normListingName && (normOwnerLogin === normListingName || (normOwnerName && normOwnerName === normListingName))) {
          matchReason = 'name'
        }
      }

      if (!matchReason) {
        rejectedExamples.push({ owner: cand.owner, listing: target.name, reason: 'no domain/name match' })
        continue
      }

      matches.push({
        listingId: target.id,
        slug: target.slug,
        mode: target.mode,
        iwwUrl: target.iwwUrl,
        name: target.name,
        website: target.website,
        sector: target.sector,
        github: {
          login: node.login,
          type: node.__typename === 'Organization' ? 'Organization' : 'User',
          name: node.name || null,
          websiteUrl: node.websiteUrl || null,
          description: node.description || node.bio || null,
          location: node.location || null,
          publicRepos: repoCount,
          top5Stars: (node.repositories?.nodes || []).map(n => ({ name: n.name, stars: n.stargazerCount, pushedAt: n.pushedAt })),
          lastPushedAt: (node.repositories?.nodes || [])[0]?.pushedAt || null,
        },
        matchReason,
      })
    }
  }

  // De-dupe (same listing+owner could appear twice if candidate list had dup entries)
  const seen = new Set()
  const deduped = matches.filter(m => {
    const key = `${m.listingId}:${m.github.login.toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  writeFileSync(MATCHES_FILE, JSON.stringify(deduped, null, 2))
  log(`MATCH: ${deduped.length} verified matches -> ${MATCHES_FILE}`)
  return { matches: deduped, rejectedExamples }
}

/* ── Report ──────────────────────────────────────────────────────────── */
function writeReport({ targetsCount, homepagesOk, homepagesFailed, candidatesCount, matches, rejectedExamples }) {
  const byReason = { domain: 0, name: 0 }
  for (const m of matches) byReason[m.matchReason] = (byReason[m.matchReason] || 0) + 1

  const topByStars = [...matches]
    .sort((a, b) => (b.github.top5Stars[0]?.stars || 0) - (a.github.top5Stars[0]?.stars || 0))
    .slice(0, 25)

  const lines = []
  lines.push('# InfoWebWorld x GitHub scan report')
  lines.push('')
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('## Counts')
  lines.push(`- Listings scanned (live, with website, excluding local-businesses): ${targetsCount}`)
  lines.push(`- Homepages fetched OK: ${homepagesOk}`)
  lines.push(`- Homepages failed/timed out: ${homepagesFailed}`)
  lines.push(`- Candidate GitHub owners found in homepage HTML: ${candidatesCount}`)
  lines.push(`- Verified matches: ${matches.length} (domain: ${byReason.domain || 0}, name: ${byReason.name || 0})`)
  lines.push('')
  lines.push('## Top matches by stars (top 5-repo leader)')
  lines.push('')
  lines.push('| InfoWebWorld listing | Sector | GitHub owner | Type | Top repo stars | Match reason |')
  lines.push('|---|---|---|---|---|---|')
  for (const m of topByStars) {
    lines.push(`| [${m.name}](${m.iwwUrl}) | ${m.sector || '—'} | [${m.github.login}](https://github.com/${m.github.login}) | ${m.github.type} | ${m.github.top5Stars[0]?.stars ?? 0} | ${m.matchReason} |`)
  }
  lines.push('')
  lines.push('## Rejected candidate examples (sample)')
  lines.push('')
  for (const r of rejectedExamples.slice(0, 30)) {
    lines.push(`- \`${r.owner}\`${r.listing ? ` (looked at for "${r.listing}")` : ''} — ${r.reason}`)
  }
  writeFileSync(REPORT_FILE, lines.join('\n') + '\n')
  log(`REPORT: -> ${REPORT_FILE}`)
}

/* ── Main ────────────────────────────────────────────────────────────── */
async function main() {
  log(`START (budget ${Math.round(MAX_RUNTIME_MS / 1000)}s, stage=${ONLY_STAGE || 'all'})`)
  const targets = await fetchTargets()

  if (runStage('fetch')) {
    await runFetchStage(targets)
  }

  const done = loadProgress()
  const stillPending = targets.length - done.size
  if (stillPending > 0) {
    log(`FETCH: ${stillPending} listings still pending — re-run this script to continue fetching before extract/verify/match give final numbers.`)
  }

  if (ONLY_STAGE === 'fetch') return

  const { list: candidates, homepagesOk, homepagesFailed } = runExtractStage(targets)

  if (ONLY_STAGE === 'extract') return

  const ownerCache = await runVerifyStage(candidates)

  if (ONLY_STAGE === 'verify') return

  const { matches, rejectedExamples } = runMatchStage(targets, candidates, ownerCache)
  writeReport({
    targetsCount: targets.length,
    homepagesOk, homepagesFailed,
    candidatesCount: candidates.length,
    matches, rejectedExamples,
  })

  log('DONE')
}

main()
  .then(() => process.exit(0)) // undici can keep sockets open past completion; force exit so the process doesn't hang
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
