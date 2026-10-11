#!/usr/bin/env -S npx tsx
/* ═══════════════════════════════════════════════════════════════════════
   validate-oss-data.ts - InfoWebWorld for Developers (WP2-oss)

   Shape + consistency checks on the committed OSS snapshot:
     data/developers/oss/{meta,companies,repos,issues}.json
     data/developers/iww-links.json

   Checks (per the build spec):
     - required fields present with the right primitive shape
     - company slugs unique and not a reserved /open-source/ segment
     - repo slugs unique within their company and not a reserved segment
       under /open-source/{company}/
     - one GitHub org login belongs to exactly one company
     - every repo.companySlug references a real company
     - every issue's repoSlug+companySlug references a real tracked repo,
       and is within the 180-day good-first-issue window
     - URLs we construct ourselves (iwwUrl, org.url, repo.url, issue.url,
       countryHubs) are https; external URLs we pass through (website,
       websiteUrl, homepageUrl) are absolute when present
     - no em dash (U+2012-2015) in any published string field
     - meta.counts matches the data; each file stays under 6 MB

   Exits 1 (and prints every finding) if any hard check fails; exits 0 and
   prints counts otherwise.

   Usage: npx tsx scripts/developers/validate-oss-data.ts
   ═══════════════════════════════════════════════════════════════════════ */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { isReservedCompanySlug, isReservedRepoSlug } from '../../lib/developers/paths'
import type { OssMeta, OssCompany, OssOrg, OssRepo, OssIssue, IwwLinks } from '../../lib/developers/types'

type Company = OssCompany & { iwwMode: 'company' | 'product' | null; iwwName: string | null }

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '../..')
const OSS_DIR = path.join(REPO_ROOT, 'data/developers/oss')
const IWW_LINKS_FILE = path.join(REPO_ROOT, 'data/developers/iww-links.json')
const MAX_FILE_BYTES = 6 * 1024 * 1024

const errors: string[] = []
const warnings: string[] = []
function fail(msg: string): void { errors.push(msg) }
function warn(msg: string): void { warnings.push(msg) }

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

const EM_DASH_RE = /[‒–—―]/
/** Walk every string in a JSON value and report em dashes, with a path
 *  like 'companies[12].oneLiner' for a quick fix. */
function scanEmDashes(value: unknown, where: string): void {
  if (typeof value === 'string') {
    if (EM_DASH_RE.test(value)) fail(`em dash in ${where}: ${JSON.stringify(value.slice(0, 120))}`)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => scanEmDashes(v, `${where}[${i}]`))
    return
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) scanEmDashes(v, where ? `${where}.${k}` : k)
  }
}

function isHttpsUrl(v: unknown): boolean {
  return typeof v === 'string' && /^https:\/\//i.test(v)
}
function isAbsoluteUrl(v: unknown): boolean {
  return typeof v === 'string' && /^https?:\/\//i.test(v)
}
function isIsoDate(v: unknown): boolean {
  return typeof v === 'string' && !Number.isNaN(Date.parse(v))
}
function isNonNegInt(v: unknown): boolean {
  return typeof v === 'number' && Number.isInteger(v) && v >= 0
}

/* ── Load ────────────────────────────────────────────────────────────── */
const metaPath = path.join(OSS_DIR, 'meta.json')
const companiesPath = path.join(OSS_DIR, 'companies.json')
const reposPath = path.join(OSS_DIR, 'repos.json')
const issuesPath = path.join(OSS_DIR, 'issues.json')

for (const p of [metaPath, companiesPath, reposPath, issuesPath, IWW_LINKS_FILE]) {
  if (!fs.existsSync(p)) fail(`missing file: ${p}`)
}
if (errors.length) {
  console.error('validate-oss-data: cannot continue, files missing:\n' + errors.join('\n'))
  process.exit(1)
}

const meta = readJson<OssMeta>(metaPath)
const companies = readJson<Company[]>(companiesPath)
const repos = readJson<OssRepo[]>(reposPath)
const issues = readJson<OssIssue[]>(issuesPath)
const iwwLinks = readJson<IwwLinks>(IWW_LINKS_FILE)

/* ── File size ───────────────────────────────────────────────────────── */
for (const p of [metaPath, companiesPath, reposPath, issuesPath, IWW_LINKS_FILE]) {
  const bytes = fs.statSync(p).size
  if (bytes >= MAX_FILE_BYTES) fail(`${path.basename(p)} is ${(bytes / 1024 / 1024).toFixed(2)} MB, must stay under 6 MB`)
}

/* ── meta shape ──────────────────────────────────────────────────────── */
if (meta.schemaVersion !== 1) fail(`meta.schemaVersion must be 1, got ${JSON.stringify(meta.schemaVersion)}`)
if (meta.source !== 'github-graphql') fail(`meta.source must be 'github-graphql', got ${JSON.stringify(meta.source)}`)
if (meta.reposPerOrgLimit !== 30) fail(`meta.reposPerOrgLimit must be 30, got ${JSON.stringify(meta.reposPerOrgLimit)}`)
if (!isIsoDate(meta.generatedAt)) fail(`meta.generatedAt is not a valid ISO date: ${JSON.stringify(meta.generatedAt)}`)

/* ── Company checks ──────────────────────────────────────────────────── */
const companySlugs = new Set<string>()
const orgLoginToCompany = new Map<string, string>()
const countryNameBySlug = new Map<string, string>()

companies.forEach((c, i) => {
  const where = `companies[${i}] (${c.slug})`
  if (!c.slug || typeof c.slug !== 'string') fail(`${where}: missing/invalid slug`)
  else {
    if (companySlugs.has(c.slug)) fail(`duplicate company slug: ${c.slug}`)
    companySlugs.add(c.slug)
    if (isReservedCompanySlug(c.slug)) fail(`company slug '${c.slug}' collides with a reserved /open-source/ segment`)
  }
  if (!c.name) fail(`${where}: missing name`)
  if (!c.industry) fail(`${where}: missing industry`)
  if (!c.industrySlug) fail(`${where}: missing industrySlug`)
  if (c.website != null && !isAbsoluteUrl(c.website)) fail(`${where}: website is not an absolute URL: ${c.website}`)
  if (typeof c.listedOnIww !== 'boolean') fail(`${where}: listedOnIww must be boolean`)
  if (c.listedOnIww) {
    if (!isHttpsUrl(c.iwwUrl)) fail(`${where}: listedOnIww true but iwwUrl is not https: ${c.iwwUrl}`)
    if (typeof c.iwwPath !== 'string' || !c.iwwPath.startsWith('/')) fail(`${where}: listedOnIww true but iwwPath is not a site-relative path: ${c.iwwPath}`)
    if (c.iwwMode !== 'company' && c.iwwMode !== 'product') fail(`${where}: listedOnIww true but iwwMode is ${JSON.stringify(c.iwwMode)}, expected 'company' or 'product'`)
    if (!c.iwwName) fail(`${where}: listedOnIww true but iwwName is empty`)
  } else {
    if (c.iwwUrl !== null || c.iwwPath !== null) fail(`${where}: listedOnIww false but iwwUrl/iwwPath not null`)
    if (c.iwwMode !== null || c.iwwName !== null) fail(`${where}: listedOnIww false but iwwMode/iwwName not null`)
  }
  if (c.countrySlug) {
    const prev = countryNameBySlug.get(c.countrySlug)
    if (prev && c.countryName && prev !== c.countryName) fail(`countrySlug '${c.countrySlug}' maps to two different countryName values: '${prev}' and '${c.countryName}'`)
    if (c.countryName) countryNameBySlug.set(c.countrySlug, c.countryName)
  }
  if (!Array.isArray(c.orgs) || c.orgs.length < 1 || c.orgs.length > 4) fail(`${where}: orgs must have 1-4 entries, has ${c.orgs?.length}`)
  c.orgs?.forEach((o: OssOrg, oi: number) => {
    const owhere = `${where}.orgs[${oi}] (${o.login})`
    if (!o.login) fail(`${owhere}: missing login`)
    if (!isHttpsUrl(o.url) || o.url !== `https://github.com/${o.login}`) fail(`${owhere}: url should be https://github.com/${o.login}, got ${o.url}`)
    if (!o.avatarUrl) fail(`${owhere}: missing avatarUrl`)
    if (typeof o.isVerified !== 'boolean') fail(`${owhere}: isVerified must be boolean`)
    if (!isNonNegInt(o.publicRepos)) fail(`${owhere}: publicRepos must be a non-negative integer`)
    if (o.websiteUrl != null && !isAbsoluteUrl(o.websiteUrl)) fail(`${owhere}: websiteUrl is not an absolute URL: ${o.websiteUrl}`)
    const loginLower = o.login.toLowerCase()
    const already = orgLoginToCompany.get(loginLower)
    if (already && already !== c.slug) fail(`org '${o.login}' appears under two companies: '${already}' and '${c.slug}'`)
    else orgLoginToCompany.set(loginLower, c.slug)
  })
})

/* ── Repo checks ─────────────────────────────────────────────────────── */
const repoSlugsByCompany = new Map<string, Set<string>>()
const repoKeyToSlug = new Map<string, string>() // `${companySlug}::${slug}` sanity, not strictly needed
let reposChecked = 0

repos.forEach((r, i) => {
  const where = `repos[${i}] (${r.id})`
  if (!r.id || !r.id.includes('/')) fail(`${where}: id must be 'owner/name'`)
  if (!r.slug) fail(`${where}: missing slug`)
  if (!companySlugs.has(r.companySlug)) fail(`${where}: companySlug '${r.companySlug}' does not exist in companies.json`)
  else {
    if (isReservedRepoSlug(r.slug)) fail(`${where}: repo slug '${r.slug}' collides with a reserved segment under /open-source/{company}/`)
    const set = repoSlugsByCompany.get(r.companySlug) ?? new Set<string>()
    if (set.has(r.slug)) fail(`duplicate repo slug '${r.slug}' within company '${r.companySlug}'`)
    set.add(r.slug)
    repoSlugsByCompany.set(r.companySlug, set)
    repoKeyToSlug.set(`${r.companySlug}::${r.slug}`, r.id)
  }
  if (!isHttpsUrl(r.url)) fail(`${where}: url must be https: ${r.url}`)
  if (r.homepageUrl != null && !isAbsoluteUrl(r.homepageUrl)) fail(`${where}: homepageUrl is not an absolute URL: ${r.homepageUrl}`)
  if (!isNonNegInt(r.stars)) fail(`${where}: stars must be a non-negative integer`)
  if (!isNonNegInt(r.forks)) fail(`${where}: forks must be a non-negative integer`)
  if (!isNonNegInt(r.openIssues)) fail(`${where}: openIssues must be a non-negative integer`)
  if (!isNonNegInt(r.goodFirstIssues)) fail(`${where}: goodFirstIssues must be a non-negative integer`)
  if (!isIsoDate(r.pushedAt)) fail(`${where}: pushedAt is not a valid date`)
  if (!isIsoDate(r.createdAt)) fail(`${where}: createdAt is not a valid date`)
  if (typeof r.isArchived !== 'boolean') fail(`${where}: isArchived must be boolean`)
  if (r.description != null && r.description.length > 300) fail(`${where}: description exceeds 300 chars (${r.description.length})`)
  if (!Array.isArray(r.topics) || r.topics.length > 10) fail(`${where}: topics must be an array of at most 10`)
  if (!Array.isArray(r.languages) || r.languages.length > 8) fail(`${where}: languages must be an array of at most 8`)
  if (r.latestRelease && !isIsoDate(r.latestRelease.publishedAt)) fail(`${where}: latestRelease.publishedAt is not a valid date`)
  reposChecked++
})

/* ── Issue checks ────────────────────────────────────────────────────── */
const cutoffMs = Date.parse(meta.generatedAt) - 180 * 86400000
issues.forEach((iss, i) => {
  const where = `issues[${i}]`
  if (!iss.title) fail(`${where}: missing title`)
  if (!isHttpsUrl(iss.url)) fail(`${where}: url must be https: ${iss.url}`)
  if (!companySlugs.has(iss.companySlug)) fail(`${where}: companySlug '${iss.companySlug}' does not exist`)
  const repoKey = `${iss.companySlug}::${iss.repoSlug}`
  if (!repoKeyToSlug.has(repoKey)) fail(`${where}: no tracked repo for companySlug '${iss.companySlug}' + repoSlug '${iss.repoSlug}'`)
  if (!isIsoDate(iss.createdAt)) fail(`${where}: createdAt is not a valid date`)
  else if (Date.parse(iss.createdAt) < cutoffMs) fail(`${where}: createdAt is older than the 180-day good-first-issue window`)
  if (!isNonNegInt(iss.comments)) fail(`${where}: comments must be a non-negative integer`)
  if (!Array.isArray(iss.labels)) fail(`${where}: labels must be an array`)
})

/* ── iww-links.json ──────────────────────────────────────────────────── */
if (!isIsoDate(iwwLinks.generatedAt)) fail(`iww-links.generatedAt is not a valid date`)
if (!Array.isArray(iwwLinks.countryHubs)) fail(`iww-links.countryHubs must be an array`)
else {
  iwwLinks.countryHubs.forEach((h, i) => {
    if (!/^\/[a-z0-9-]+-business-directory$/.test(h)) fail(`iww-links.countryHubs[${i}] is not a country hub path: ${h}`)
  })
  const dupHubs = iwwLinks.countryHubs.filter((h, i) => iwwLinks.countryHubs.indexOf(h) !== i)
  if (dupHubs.length) fail(`iww-links.countryHubs has duplicates: ${[...new Set(dupHubs)].join(', ')}`)
}

/* ── meta.counts vs. actual data ─────────────────────────────────────── */
const languageSet = new Set<string>()
const topicSet = new Set<string>()
const countrySet = new Set<string>()
for (const r of repos) {
  if (r.primaryLanguage) languageSet.add(r.primaryLanguage.name)
  for (const l of r.languages) languageSet.add(l.name)
  for (const t of r.topics) topicSet.add(t)
}
for (const c of companies) if (c.countrySlug) countrySet.add(c.countrySlug)

function checkCount(label: string, actual: number, expected: number): void {
  if (actual !== expected) fail(`meta.counts.${label} is ${expected}, actual data has ${actual}`)
}
checkCount('companies', companies.length, meta.counts.companies)
checkCount('orgs', companies.reduce((n, c) => n + c.orgs.length, 0), meta.counts.orgs)
checkCount('repos', repos.length, meta.counts.repos)
checkCount('issues', issues.length, meta.counts.issues)
checkCount('languages', languageSet.size, meta.counts.languages)
checkCount('topics', topicSet.size, meta.counts.topics)
checkCount('countries', countrySet.size, meta.counts.countries)

/* ── No em dashes anywhere in the published data ────────────────────── */
scanEmDashes(companies, 'companies')
scanEmDashes(repos, 'repos')
scanEmDashes(issues, 'issues')

/* ── Report ──────────────────────────────────────────────────────────── */
console.log('── validate-oss-data ───────────────────────────────────')
console.log('companies:', companies.length, ' orgs:', meta.counts.orgs, ' repos:', repos.length, ' issues:', issues.length)
console.log('languages:', languageSet.size, ' topics:', topicSet.size, ' countries:', countrySet.size)
console.log('listed on InfoWebWorld:', companies.filter(c => c.listedOnIww).length, '/', companies.length)
console.log('country hubs verified:', iwwLinks.countryHubs.length)
for (const p of [metaPath, companiesPath, reposPath, issuesPath, IWW_LINKS_FILE]) {
  console.log(`  ${path.relative(REPO_ROOT, p)}: ${(fs.statSync(p).size / 1024 / 1024).toFixed(2)} MB`)
}

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`)
  warnings.forEach(w => console.log('  - ' + w))
}
if (errors.length) {
  console.log(`\n${errors.length} ERROR(S):`)
  errors.forEach(e => console.log('  - ' + e))
  process.exit(1)
}
console.log('\nAll checks passed.')
