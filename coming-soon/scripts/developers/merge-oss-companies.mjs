#!/usr/bin/env node
/**
 * merge-oss-companies.mjs
 *
 * Merges the 4 OSS-candidate research segments (bigtech, devtools, ai,
 * regional) with the InfoWebWorld GitHub matches into one de-duplicated,
 * live-re-verified company list for the "Open Source Projects by
 * Companies" devhub section.
 *
 * Pipeline (all pure, deterministic — same inputs always produce the
 * same output, modulo what GitHub returns live):
 *   1. LOAD      4 candidate files + iww-github-matches.json.
 *   2. MERGE-IWW iww matches grouped by listingId (one InfoWebWorld
 *                listing can match >1 GitHub org on its homepage) ->
 *                one company per listing, orgs merged.
 *   3. DEDUPE    candidate companies across the 4 segment files: same
 *                slug, same registrable website domain, or a shared org
 *                login all union two entries into one company. Orgs
 *                merged (deduped by login).
 *   4. VERIFY    every unique org login (candidates + iww matches) via
 *                batched GitHub GraphQL (gh api graphql), ~20 aliases per
 *                query, cached to disk so a re-run only queries new
 *                logins. Drops logins that no longer resolve. Refreshes
 *                top5Stars (sum of the top 5 non-archived repos' stars)
 *                and lastPushedAt (latest non-archived push) from live
 *                data, not the candidate files' numbers.
 *   5. ATTACH    iww-matched companies that share a domain/login with a
 *                merged candidate are attached to it (listedOnIww: true)
 *                instead of appearing twice; the rest become new
 *                companies.
 *   6. QUALITY   non-InfoWebWorld companies must have >=1 org with a
 *                non-archived repo pushed within 24 months AND
 *                top5Stars >= 1000 (>= 300 outside the US). InfoWebWorld
 *                matches are exempt (point 4 of the task) and always
 *                kept. Drops are logged with the reason.
 *   7. VALIDATE  ISO-2 hqCountry, industry from the fixed allowed list
 *                (iww-matched companies get it inferred from their
 *                InfoWebWorld sector + a keyword pass over their GitHub
 *                description), oneLiner <= 160 chars, unique clean slugs.
 *   8. WRITE     oss-companies.json + oss-companies-report.md.
 *
 * Usage:
 *   node scripts/developers/merge-oss-companies.mjs
 *   node scripts/developers/merge-oss-companies.mjs --stage=verify   # only re-run GraphQL verify (resumes from cache)
 *
 * Never invents an org login, URL, number or date — everything not
 * confirmed live by GitHub's API is left null and logged in the report.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'

/* ── Config ─────────────────────────────────────────────────────────── */
const DATA_DIR = process.env.DEVHUB_DATA_DIR ||
  'C:/Users/AADIL PARMAR/AppData/Local/Temp/claude/F--infoWebWorld-launching-coming-soon/c4f80252-7fec-429c-8b95-1285fe8331e8/scratchpad/devhub/data'

const IN = {
  bigtech: path.join(DATA_DIR, 'oss-candidates-bigtech.json'),
  devtools: path.join(DATA_DIR, 'oss-candidates-devtools.json'),
  ai: path.join(DATA_DIR, 'oss-candidates-ai.json'),
  regional: path.join(DATA_DIR, 'oss-candidates-regional.json'),
  iwwMatches: path.join(DATA_DIR, 'iww-github-matches.json'),
}
const OWNER_CACHE_FILE = path.join(DATA_DIR, 'oss-merge-owners-cache.json')
const OUT_COMPANIES = path.join(DATA_DIR, 'oss-companies.json')
const OUT_REPORT = path.join(DATA_DIR, 'oss-companies-report.md')
const GENERATED_AT = '2026-10-11'

const TODAY = new Date('2026-10-11T00:00:00Z')
const CUTOFF_24MO = new Date(TODAY)
CUTOFF_24MO.setUTCMonth(CUTOFF_24MO.getUTCMonth() - 24)

const MAX_ORGS_PER_COMPANY = 4
const STAR_BAR_US = 1000
const STAR_BAR_NON_US = 300
const VERIFY_BATCH = 20

const args = new Set(process.argv.slice(2))
const stageArg = [...args].find(a => a.startsWith('--stage='))
const ONLY_STAGE = stageArg ? stageArg.split('=')[1] : null
const runStage = (name) => !ONLY_STAGE || ONLY_STAGE === name

function log(...a) { console.log(new Date().toISOString().slice(11, 19), ...a) }

/* ── eTLD+1 extraction (same approach as scan-iww-github.mjs — no PSL
   package installed; covers common multi-label suffixes, falls back to
   last-two-labels otherwise) ─────────────────────────────────────────── */
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

function normalizeUrl(u) {
  if (!u) return u
  if (!/^https?:\/\//i.test(u)) return `https://${u}`
  return u
}

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

/* ── slug helpers ──────────────────────────────────────────────────── */
function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

function uniqueSlug(base, used) {
  let slug = slugify(base) || 'company'
  if (!used.has(slug)) { used.add(slug); return slug }
  let i = 2
  while (used.has(`${slug}-${i}`)) i++
  const final = `${slug}-${i}`
  used.add(final)
  return final
}

/* ── allowed industry list + ISO-2 country set ────────────────────── */
const ALLOWED_INDUSTRIES = [
  'Big Tech', 'Cloud & Infrastructure', 'Developer Tools', 'Data & Databases',
  'AI & Machine Learning', 'Security', 'Fintech & Payments', 'E-commerce & Retail',
  'Consumer Internet & Social', 'Media & Entertainment', 'Mobility & Travel',
  'Enterprise Software', 'Hardware & Semiconductors', 'Telecom', 'Gaming',
  'Healthcare', 'Education', 'IT Services & Consulting', 'Government & Public Sector',
]
const ALLOWED_INDUSTRY_SET = new Set(ALLOWED_INDUSTRIES)

// ISO 3166-1 alpha-2 (just the codes that can plausibly appear here; used
// only to validate, never to invent a country).
const ISO2 = new Set('AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' '))

function validCountry(code) {
  return code && ISO2.has(String(code).toUpperCase()) ? String(code).toUpperCase() : null
}

/* Keyword -> industry classifier. Checked in order; first match wins.
   Used to validate/repair a candidate's given industry and to infer an
   industry for new InfoWebWorld-matched companies on top of their
   sector's base mapping. */
const INDUSTRY_RULES = [
  [/blockchain|crypto|web3|defi\b|nft\b|digital asset/i, 'Fintech & Payments'],
  [/payment|fintech|neobank|banking|lending|invoicing|payroll|credential.*(issu|verif)/i, 'Fintech & Payments'],
  [/pen(etration)? test|red team|security|vulnerabilit|threat detection|firewall|zero trust|cyberse/i, 'Security'],
  [/database|data warehouse|data lake|time.series|analytics engine/i, 'Data & Databases'],
  [/machine learning|artificial intelligence|\bllm\b|large language model|neural network|computer vision|\bnlp\b|\bai\b/i, 'AI & Machine Learning'],
  [/kubernetes|cloud native|infrastructure|devops|container|serverless|observability|monitoring platform/i, 'Cloud & Infrastructure'],
  [/\bgame\b|gaming|esports/i, 'Gaming'],
  [/health|medical|clinical|patient|telehealth/i, 'Healthcare'],
  [/education|learning platform|university|edtech|\bcourse/i, 'Education'],
  [/media|publishing|newsletter|streaming|video platform|podcast/i, 'Media & Entertainment'],
  [/ecommerce|e-commerce|retail|marketplace|shopping/i, 'E-commerce & Retail'],
  [/mobility|travel|ride.hailing|logistics|delivery|transport/i, 'Mobility & Travel'],
  [/telecom|telco|carrier network/i, 'Telecom'],
  [/semiconductor|chip design|silicon\b/i, 'Hardware & Semiconductors'],
  [/government|public sector|civic tech/i, 'Government & Public Sector'],
  [/\bcrm\b|sales platform|permissions|developer platform|api platform|cloud platform|software platform|\bsaas\b/i, 'Enterprise Software'],
  [/social network|community platform|consumer app/i, 'Consumer Internet & Social'],
  [/developer tool|\bcli\b|\bsdk\b|open source framework|build tool/i, 'Developer Tools'],
]
function classifyIndustry(text, fallback) {
  for (const [re, industry] of INDUSTRY_RULES) {
    if (re.test(text)) return industry
  }
  return fallback
}
function validIndustry(value, inferredFallbackText, sectorDefault) {
  if (value && ALLOWED_INDUSTRY_SET.has(value)) return value
  return classifyIndustry(inferredFallbackText || '', sectorDefault || 'Developer Tools')
}

const SECTOR_DEFAULT_INDUSTRY = {
  'ai-ml': 'AI & Machine Learning',
  'it-services-agencies': 'IT Services & Consulting',
  'software-saas': 'Enterprise Software',
  'startups-innovation': 'Enterprise Software',
  'professional-services': 'IT Services & Consulting',
}

/* A handful of real country-name / major-city fragments that commonly
   appear in GitHub org "location" free text, mapped to ISO-2. Anything
   not recognized here stays null — never guessed. */
const LOCATION_HINTS = [
  [/united states|usa\b|\bU\.S\.A?\.?\b/i, 'US'],
  [/united kingdom|\bUK\b/i, 'GB'],
  [/germany/i, 'DE'], [/france/i, 'FR'], [/netherlands/i, 'NL'],
  [/canada/i, 'CA'], [/australia/i, 'AU'], [/india/i, 'IN'],
  [/singapore/i, 'SG'], [/ireland/i, 'IE'], [/israel/i, 'IL'],
  [/sweden/i, 'SE'], [/finland/i, 'FI'], [/denmark/i, 'DK'],
  [/switzerland/i, 'CH'], [/austria/i, 'AT'], [/belgium/i, 'BE'],
  [/spain/i, 'ES'], [/poland/i, 'PL'], [/czech/i, 'CZ'],
  [/hungary/i, 'HU'], [/turkey|türkiye/i, 'TR'], [/china/i, 'CN'],
  [/japan/i, 'JP'], [/korea/i, 'KR'], [/new zealand/i, 'NZ'],
  [/brazil/i, 'BR'], [/argentina/i, 'AR'], [/nigeria/i, 'NG'],
  [/indonesia/i, 'ID'], [/latvia/i, 'LV'], [/sri lanka/i, 'LK'],
  [/san francisco|new york|nyc|seattle|boston|austin|chicago|los angeles/i, 'US'],
  [/london/i, 'GB'], [/berlin|munich|hamburg/i, 'DE'], [/paris/i, 'FR'],
  [/amsterdam/i, 'NL'], [/toronto|vancouver/i, 'CA'], [/sydney|melbourne/i, 'AU'],
  [/bangalore|bengaluru|mumbai|delhi|hyderabad|pune/i, 'IN'],
  [/tokyo/i, 'JP'], [/seoul/i, 'KR'], [/warsaw/i, 'PL'], [/tel aviv/i, 'IL'],
]
function inferCountryFromLocation(location) {
  if (!location) return null
  for (const [re, code] of LOCATION_HINTS) if (re.test(location)) return code
  return null
}

function truncateOneLiner(text) {
  if (!text) return null
  const clean = String(text).replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim()
  if (!clean) return null
  if (clean.length <= 160) return clean
  return `${clean.slice(0, 157).trim()}...`
}

/* ── load inputs ───────────────────────────────────────────────────── */
function loadJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'))
}

/* ── Stage 1: group iww matches by listingId (one listing can match >1
   GitHub org) into one company-shaped record per listing ───────────── */
function buildIwwCompanies(matches) {
  const byListing = new Map()
  for (const m of matches) {
    const key = m.listingId
    if (!byListing.has(key)) byListing.set(key, { ...m, orgs: [] })
    const rec = byListing.get(key)
    rec.orgs.push({ login: m.github.login, type: m.github.type })
  }
  return [...byListing.values()].map(rec => {
    const loginsSeen = new Set()
    const orgs = []
    for (const o of rec.orgs) {
      const k = o.login.toLowerCase()
      if (loginsSeen.has(k)) continue
      loginsSeen.add(k)
      orgs.push({ login: o.login })
    }
    return {
      listingId: rec.listingId,
      slug: rec.slug,
      mode: rec.mode,
      iwwUrl: rec.iwwUrl,
      name: rec.name,
      website: rec.website,
      sector: rec.sector,
      description: rec.github.description || null,
      orgLogins: orgs.map(o => o.login),
    }
  })
}

/* ── Stage 2: dedupe candidates across the 4 segment files ──────────── */
function buildCandidateCompanies(files) {
  const entries = []
  for (const [segment, file] of Object.entries(files)) {
    const list = loadJson(file)
    for (const c of list) entries.push({ ...c, _segment: segment })
  }

  // union-find over entry indices
  const parent = entries.map((_, i) => i)
  function find(i) { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i] } return i }
  function union(a, b) { a = find(a); b = find(b); if (a !== b) parent[Math.max(a, b)] = Math.min(a, b) }

  const byDomain = new Map()
  const byLogin = new Map()
  entries.forEach((e, i) => {
    const dom = registrableDomain(e.website)
    if (dom) { if (!byDomain.has(dom)) byDomain.set(dom, []); byDomain.get(dom).push(i) }
    for (const o of e.orgs) {
      const k = o.login.toLowerCase()
      if (!byLogin.has(k)) byLogin.set(k, [])
      byLogin.get(k).push(i)
    }
  })
  for (const idxs of byDomain.values()) for (let j = 1; j < idxs.length; j++) union(idxs[0], idxs[j])
  for (const idxs of byLogin.values()) for (let j = 1; j < idxs.length; j++) union(idxs[0], idxs[j])

  const groups = new Map()
  entries.forEach((e, i) => {
    const root = find(i)
    if (!groups.has(root)) groups.set(root, [])
    groups.get(root).push(e)
  })

  const companies = []
  for (const group of groups.values()) {
    const primary = group[0] // first-encountered = segment file order (bigtech, devtools, ai, regional)
    const orgsByLogin = new Map()
    const segments = new Set()
    for (const e of group) {
      segments.add(e._segment)
      for (const o of e.orgs) {
        const k = o.login.toLowerCase()
        if (!orgsByLogin.has(k)) orgsByLogin.set(k, o)
      }
    }
    companies.push({
      slug: primary.slug,
      name: primary.company,
      website: primary.website,
      hqCountry: primary.hqCountry,
      industry: primary.industry,
      oneLiner: primary.oneLiner,
      orgs: [...orgsByLogin.values()],
      _mergedFromSegments: [...segments],
      _mergedCount: group.length,
    })
  }
  return companies
}

/* ── Stage 3: batched GraphQL re-verification ────────────────────────── */
function loadOwnerCache() {
  if (!existsSync(OWNER_CACHE_FILE)) return new Map()
  const raw = JSON.parse(readFileSync(OWNER_CACHE_FILE, 'utf8'))
  return new Map(Object.entries(raw))
}
function saveOwnerCache(cache) {
  writeFileSync(OWNER_CACHE_FILE, JSON.stringify(Object.fromEntries(cache), null, 2))
}

function buildOwnerQuery(logins) {
  const parts = logins.map((login, i) => `
    o${i}: repositoryOwner(login: ${JSON.stringify(login)}) {
      login
      __typename
      avatarUrl
      ... on Organization { name description websiteUrl location isVerified }
      ... on User { name bio websiteUrl location }
      repositories(first: 50, isFork: false, privacy: PUBLIC, orderBy: {field: STARGAZERS, direction: DESC}) {
        nodes { name stargazerCount pushedAt isArchived }
      }
    }`).join('\n')
  return `query {\n${parts}\n  rateLimit { cost remaining resetAt }\n}`
}

function ghGraphQL(query) {
  const out = execFileSync('gh', ['api', 'graphql', '-f', `query=${query}`], {
    encoding: 'utf8', maxBuffer: 20 * 1024 * 1024,
  })
  return JSON.parse(out)
}

function summarizeOwnerNode(node) {
  if (!node) return null
  const nonArchived = (node.repositories?.nodes || []).filter(r => !r.isArchived)
  const top5 = [...nonArchived].sort((a, b) => b.stargazerCount - a.stargazerCount).slice(0, 5)
  const top5Stars = top5.reduce((sum, r) => sum + r.stargazerCount, 0)
  const lastPushedAt = nonArchived.reduce((latest, r) => {
    if (!r.pushedAt) return latest
    return !latest || r.pushedAt > latest ? r.pushedAt : latest
  }, null)
  return {
    login: node.login,
    type: node.__typename,
    name: node.name || null,
    description: node.description ?? node.bio ?? null,
    websiteUrl: node.websiteUrl || null,
    location: node.location || null,
    isVerified: node.__typename === 'Organization' ? Boolean(node.isVerified) : false,
    avatarUrl: node.avatarUrl || null,
    publicRepoSample: node.repositories?.nodes?.length || 0,
    top5Stars,
    top5Repos: top5.map(r => ({ name: r.name, stars: r.stargazerCount, pushedAt: r.pushedAt })),
    lastPushedAt,
    hasNonArchivedRepo: nonArchived.length > 0,
  }
}

async function verifyLogins(allLogins) {
  const cache = loadOwnerCache()
  const unknown = allLogins.filter(l => !cache.has(l.toLowerCase()))
  log(`VERIFY: ${cache.size} logins cached, ${unknown.length} new logins to query (${allLogins.length} total)`)

  for (let i = 0; i < unknown.length; i += VERIFY_BATCH) {
    const batch = unknown.slice(i, i + VERIFY_BATCH)
    const query = buildOwnerQuery(batch)
    let resp
    try {
      resp = ghGraphQL(query)
    } catch (err) {
      log(`VERIFY: batch at ${i} failed, falling back to single queries: ${err instanceof Error ? err.message.slice(0, 200) : err}`)
      for (const login of batch) {
        try {
          const single = ghGraphQL(buildOwnerQuery([login]))
          cache.set(login.toLowerCase(), summarizeOwnerNode(single.data?.o0))
        } catch {
          cache.set(login.toLowerCase(), null)
        }
      }
      saveOwnerCache(cache)
      continue
    }
    batch.forEach((login, j) => {
      cache.set(login.toLowerCase(), summarizeOwnerNode(resp.data?.[`o${j}`]))
    })
    saveOwnerCache(cache)
    if ((i / VERIFY_BATCH) % 5 === 0) log(`VERIFY: queried ${Math.min(i + VERIFY_BATCH, unknown.length)}/${unknown.length} new logins`)
  }
  return cache
}

/* ── main ─────────────────────────────────────────────────────────── */
async function main() {
  const matches = loadJson(IN.iwwMatches)
  const iwwCompanies = buildIwwCompanies(matches)
  const candidateCompanies = buildCandidateCompanies({
    bigtech: IN.bigtech, devtools: IN.devtools, ai: IN.ai, regional: IN.regional,
  })
  log(`LOAD: ${matches.length} iww matches -> ${iwwCompanies.length} iww companies (by listingId); ${candidateCompanies.length} merged candidate companies`)

  const allLogins = new Set()
  for (const c of candidateCompanies) for (const o of c.orgs) allLogins.add(o.login)
  for (const c of iwwCompanies) for (const login of c.orgLogins) allLogins.add(login)

  if (!runStage('verify') && ONLY_STAGE && ONLY_STAGE !== 'verify') {
    log(`Unknown --stage=${ONLY_STAGE}; running full pipeline`)
  }
  const ownerCache = await verifyLogins([...allLogins])

  /* -- refresh orgs on candidate companies, drop invalid logins -- */
  const droppedLogins = []
  for (const c of candidateCompanies) {
    const refreshed = []
    for (const o of c.orgs) {
      const live = ownerCache.get(o.login.toLowerCase())
      if (!live) {
        droppedLogins.push({ company: c.slug, login: o.login, reason: 'org login no longer resolves on GitHub' })
        continue
      }
      refreshed.push(live)
    }
    refreshed.sort((a, b) => b.top5Stars - a.top5Stars)
    c.orgs = refreshed.slice(0, MAX_ORGS_PER_COMPANY)
    if (refreshed.length > MAX_ORGS_PER_COMPANY) {
      for (const extra of refreshed.slice(MAX_ORGS_PER_COMPANY)) {
        droppedLogins.push({ company: c.slug, login: extra.login, reason: `over the ${MAX_ORGS_PER_COMPANY}-org cap (kept the ${MAX_ORGS_PER_COMPANY} with the most stars)` })
      }
    }
  }

  /* -- refresh orgs on iww companies the same way -- */
  for (const c of iwwCompanies) {
    const refreshed = []
    for (const login of c.orgLogins) {
      const live = ownerCache.get(login.toLowerCase())
      if (!live) {
        droppedLogins.push({ company: c.slug, login, reason: 'org login no longer resolves on GitHub (InfoWebWorld listing kept without this org)' })
        continue
      }
      refreshed.push(live)
    }
    refreshed.sort((a, b) => b.top5Stars - a.top5Stars)
    c.orgs = refreshed.slice(0, MAX_ORGS_PER_COMPANY)
  }

  /* -- attach iww matches to an existing candidate company when they share
     a domain or an org login; otherwise they become new companies -- */
  const candByDomain = new Map()
  const candByLogin = new Map()
  candidateCompanies.forEach((c, i) => {
    const dom = registrableDomain(c.website)
    if (dom) candByDomain.set(dom, i)
    for (const o of c.orgs) candByLogin.set(o.login.toLowerCase(), i)
  })

  const usedSlugs = new Set()
  const newIwwOnlyCompanies = []
  let attachedCount = 0

  for (const ic of iwwCompanies) {
    const dom = registrableDomain(ic.website)
    let targetIdx = dom && candByDomain.has(dom) ? candByDomain.get(dom) : null
    if (targetIdx == null) {
      for (const o of ic.orgs) {
        const k = o.login.toLowerCase()
        if (candByLogin.has(k)) { targetIdx = candByLogin.get(k); break }
      }
    }
    if (targetIdx != null) {
      const target = candidateCompanies[targetIdx]
      target.listedOnIww = true
      target.iwwUrl = ic.iwwUrl
      target.listingId = ic.listingId
      target.mode = ic.mode
      attachedCount++
      continue
    }
    // new company sourced purely from the InfoWebWorld match
    const industry = validIndustry(null, `${ic.name} ${ic.description || ''}`, SECTOR_DEFAULT_INDUSTRY[ic.sector] || 'Developer Tools')
    const bestOrg = ic.orgs[0] || null
    const hqCountry = inferCountryFromLocation(bestOrg?.location)
    newIwwOnlyCompanies.push({
      slug: uniqueSlug(ic.slug, usedSlugs),
      name: ic.name,
      website: ic.website,
      hqCountry,
      industry,
      oneLiner: truncateOneLiner(ic.description) || truncateOneLiner(`${ic.name} is a real company listed on InfoWebWorld with public code on GitHub.`),
      orgs: ic.orgs,
      listedOnIww: true,
      iwwUrl: ic.iwwUrl,
      listingId: ic.listingId,
      mode: ic.mode,
    })
  }
  log(`ATTACH: ${attachedCount} iww matches attached to existing candidates; ${newIwwOnlyCompanies.length} new iww-only companies`)

  /* -- quality bar on non-iww candidate companies -- */
  const droppedCompanies = []
  const keptCandidates = []
  for (const c of candidateCompanies) {
    if (c.listedOnIww) { keptCandidates.push(c); continue } // exempt per task point 4
    const best = c.orgs[0] // already sorted desc by top5Stars
    const bar = c.hqCountry === 'US' ? STAR_BAR_US : STAR_BAR_NON_US
    const hasRecentRepo = best && best.lastPushedAt && new Date(best.lastPushedAt) >= CUTOFF_24MO && best.hasNonArchivedRepo
    const meetsStarBar = best && best.top5Stars >= bar
    if (!best) {
      droppedCompanies.push({ slug: c.slug, name: c.name, reason: 'no org logins resolved on GitHub after verification' })
      continue
    }
    if (!hasRecentRepo) {
      droppedCompanies.push({ slug: c.slug, name: c.name, reason: `no non-archived repo pushed within 24 months (last push ${best.lastPushedAt || 'never'})` })
      continue
    }
    if (!meetsStarBar) {
      droppedCompanies.push({ slug: c.slug, name: c.name, reason: `top5Stars ${best.top5Stars} below the ${bar}-star bar for ${c.hqCountry || 'unknown-country'} companies` })
      continue
    }
    keptCandidates.push(c)
  }
  log(`QUALITY: ${keptCandidates.length} candidate companies kept, ${droppedCompanies.length} dropped`)

  /* -- combine + validate fields -- */
  let combined = [...keptCandidates, ...newIwwOnlyCompanies]

  for (const c of combined) {
    if (!usedSlugs.has(c.slug)) usedSlugs.add(c.slug) // candidates not yet registered
  }
  // re-run slug uniqueness pass now that both pools share one namespace
  const finalUsed = new Set()
  for (const c of combined) {
    c.slug = uniqueSlug(c.slug, finalUsed)
  }

  const countryFixes = []
  const industryFixes = []
  for (const c of combined) {
    const beforeCountry = c.hqCountry
    c.hqCountry = validCountry(c.hqCountry)
    if (beforeCountry && !c.hqCountry) countryFixes.push({ slug: c.slug, was: beforeCountry })

    const beforeIndustry = c.industry
    c.industry = validIndustry(c.industry, `${c.name} ${c.orgs[0]?.description || ''}`, 'Developer Tools')
    if (beforeIndustry !== c.industry) industryFixes.push({ slug: c.slug, was: beforeIndustry, now: c.industry })

    c.oneLiner = truncateOneLiner(c.oneLiner) || truncateOneLiner(`${c.name} is a real technology company with public code on GitHub.`)
    c.name = c.name || c.orgs[0]?.name || c.slug

    const primary = c.orgs[0] || null
    c.primaryOrgLogin = primary?.login || null
    c.totalTop5Stars = primary?.top5Stars || 0
    c.lastPushedAt = c.orgs.reduce((latest, o) => (!latest || (o.lastPushedAt && o.lastPushedAt > latest)) ? (o.lastPushedAt || latest) : latest, null)
    c.listedOnIww = Boolean(c.listedOnIww)
    c.iwwUrl = c.iwwUrl || null
    c.listingId = c.listingId ?? null
    c.mode = c.mode || null

    delete c._mergedFromSegments
    delete c._mergedCount
  }

  combined.sort((a, b) => b.totalTop5Stars - a.totalTop5Stars)

  const output = { generatedAt: GENERATED_AT, companies: combined }
  writeFileSync(OUT_COMPANIES, JSON.stringify(output, null, 2))
  log(`WRITE: ${combined.length} companies -> ${OUT_COMPANIES}`)

  /* -- report -- */
  const byIndustry = {}
  const byCountry = {}
  let listedOnIwwCount = 0
  for (const c of combined) {
    byIndustry[c.industry] = (byIndustry[c.industry] || 0) + 1
    const ck = c.hqCountry || 'Unknown'
    byCountry[ck] = (byCountry[ck] || 0) + 1
    if (c.listedOnIww) listedOnIwwCount++
  }
  const top30 = [...combined].slice(0, 30)

  const md = []
  md.push(`# OSS companies merge report`)
  md.push(``)
  md.push(`Generated: ${GENERATED_AT}`)
  md.push(``)
  md.push(`- Candidate segments loaded: ${Object.values({ bigtech: IN.bigtech, devtools: IN.devtools, ai: IN.ai, regional: IN.regional }).length} files, merged into ${candidateCompanies.length} unique companies before the quality bar`)
  md.push(`- InfoWebWorld GitHub matches: ${matches.length} match rows -> ${iwwCompanies.length} unique listings -> ${attachedCount} attached to an existing candidate, ${newIwwOnlyCompanies.length} new companies`)
  md.push(`- Final company count: **${combined.length}**`)
  md.push(`- Listed on InfoWebWorld: **${listedOnIwwCount}**`)
  md.push(`- Unique org logins re-verified live: ${allLogins.size}`)
  md.push(`- Org logins dropped (no longer resolve / over the 4-org cap): ${droppedLogins.length}`)
  md.push(`- Companies dropped for the quality bar: ${droppedCompanies.length}`)
  md.push(``)
  md.push(`## Counts by industry`)
  md.push(``)
  for (const [k, v] of Object.entries(byIndustry).sort((a, b) => b[1] - a[1])) md.push(`- ${k}: ${v}`)
  md.push(``)
  md.push(`## Counts by country`)
  md.push(``)
  for (const [k, v] of Object.entries(byCountry).sort((a, b) => b[1] - a[1])) md.push(`- ${k}: ${v}`)
  md.push(``)
  md.push(`## Top 30 by stars`)
  md.push(``)
  top30.forEach((c, i) => md.push(`${i + 1}. **${c.name}** (${c.slug}) - ${c.totalTop5Stars.toLocaleString('en-US')} top5Stars - ${c.industry}${c.listedOnIww ? ' - on InfoWebWorld' : ''}`))
  md.push(``)
  md.push(`## Dropped companies (quality bar)`)
  md.push(``)
  if (droppedCompanies.length === 0) md.push(`None.`)
  for (const d of droppedCompanies) md.push(`- **${d.name}** (${d.slug}): ${d.reason}`)
  md.push(``)
  md.push(`## Dropped / capped org logins`)
  md.push(``)
  if (droppedLogins.length === 0) md.push(`None.`)
  for (const d of droppedLogins) md.push(`- ${d.login} (${d.company}): ${d.reason}`)
  md.push(``)
  if (countryFixes.length) {
    md.push(`## Country fixes (invalid ISO-2 -> null)`)
    md.push(``)
    for (const f of countryFixes) md.push(`- ${f.slug}: was "${f.was}"`)
    md.push(``)
  }
  if (industryFixes.length) {
    md.push(`## Industry fixes (invalid/inferred)`)
    md.push(``)
    for (const f of industryFixes) md.push(`- ${f.slug}: "${f.was}" -> "${f.now}"`)
    md.push(``)
  }

  writeFileSync(OUT_REPORT, md.join('\n'))
  log(`WRITE: report -> ${OUT_REPORT}`)

  console.log('\n=== SUMMARY ===')
  console.log(`Final companies: ${combined.length}`)
  console.log(`Listed on InfoWebWorld: ${listedOnIwwCount}`)
  console.log(`Dropped (quality bar): ${droppedCompanies.length}`)
  console.log(`Dropped/capped org logins: ${droppedLogins.length}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
