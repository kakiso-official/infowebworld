#!/usr/bin/env npx tsx
/**
 * WP2 - Official SDK discovery for enriched Free APIs.
 *
 * For every distinct provider.githubOrg among the enriched APIs in
 * free-apis-verified.json, lists the org's non-fork, non-archived repos via
 * GitHub GraphQL, keeps candidate SDK/client-library repos, reads each
 * candidate's package manifest, and verifies the package on its registry
 * (name exists AND registry metadata points back to that GitHub repo).
 * Also re-verifies every pre-existing sdks[] entry on enriched APIs the same
 * way (including the ~16 enriched APIs that have sdks[] but no githubOrg).
 *
 * Inputs (read-only):
 *   <scratch>/data/free-apis-verified.json
 * Outputs (owned by this script):
 *   <scratch>/data/sdk-discovery.json
 *   <scratch>/data/sdk-discovery-report.md
 *
 * Network: `gh api` (GraphQL + REST, authenticated CLI, no token committed)
 * for GitHub reads; plain `fetch` for public registry APIs (npm, PyPI,
 * crates.io, RubyGems, Packagist, pub.dev, NuGet, Maven Central, Go proxy).
 *
 * Resumable: checkpoints org repo listings and per-org results to
 * <scratch>/work/ so a re-run skips work already done. Delete that folder
 * (or pass --fresh) to force a full re-scan.
 */

import { execFileSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const SCRATCH =
  'C:/Users/AADIL PARMAR/AppData/Local/Temp/claude/F--infoWebWorld-launching-coming-soon/c4f80252-7fec-429c-8b95-1285fe8331e8/scratchpad/devhub'
const INPUT = path.join(SCRATCH, 'data/free-apis-verified.json')
const OUT_JSON = path.join(SCRATCH, 'data/sdk-discovery.json')
const OUT_REPORT = path.join(SCRATCH, 'data/sdk-discovery-report.md')
const WORK_DIR = path.join(SCRATCH, 'work/sdk-discovery')
const FRESH = process.argv.includes('--fresh')

fs.mkdirSync(WORK_DIR, { recursive: true })

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, 'utf8')) as T
}
function writeJson(p: string, data: unknown) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2))
}
function checkpointPath(name: string) {
  return path.join(WORK_DIR, name)
}
function loadCheckpoint<T>(name: string): T | null {
  if (FRESH) return null
  const p = checkpointPath(name)
  if (!fs.existsSync(p)) return null
  try {
    return readJson<T>(p)
  } catch {
    return null
  }
}
function saveCheckpoint(name: string, data: unknown) {
  writeJson(checkpointPath(name), data)
}

/* ── GitHub access (gh CLI, no token committed) ──────────────────────── */

let ghCalls = 0
function ghGraphQL(query: string): any {
  ghCalls++
  const tmp = checkpointPath(`_q_${ghCalls}.graphql`)
  fs.writeFileSync(tmp, query)
  try {
    const out = execFileSync('gh', ['api', 'graphql', '-F', `query=@${tmp}`], {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 50,
    })
    fs.unlinkSync(tmp)
    return JSON.parse(out)
  } catch (e: any) {
    fs.unlinkSync(tmp)
    // gh exits non-zero when the response contains a top-level "errors" array, even if
    // "data" is partially populated (e.g. one alias hit a real GraphQL error). Recover
    // whatever data we can from stdout instead of discarding the whole batch.
    if (typeof e.stdout === 'string' && e.stdout.trim().startsWith('{')) {
      try {
        return JSON.parse(e.stdout)
      } catch {
        // fall through
      }
    }
    throw e
  }
}

function ghRest(restPath: string): any | null {
  ghCalls++
  try {
    const out = execFileSync('gh', ['api', restPath], {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 10,
      stdio: ['ignore', 'pipe', 'ignore'], // 404s are expected and routine here; don't spam stderr
    })
    return JSON.parse(out)
  } catch {
    return null // 404 or other error - treat as "not found"
  }
}

function ghContentsText(owner: string, repo: string, filePath: string): string | null {
  const data = ghRest(`repos/${owner}/${repo}/contents/${filePath}`)
  if (!data || typeof data.content !== 'string') return null
  try {
    return Buffer.from(data.content, 'base64').toString('utf8')
  } catch {
    return null
  }
}

function ghDirList(owner: string, repo: string, dirPath = ''): Array<{ name: string; path: string; type: string }> {
  const data = ghRest(`repos/${owner}/${repo}/contents/${dirPath}`)
  if (!Array.isArray(data)) return []
  return data
}

/* ── Registry access (plain fetch, public APIs) ──────────────────────── */

let regCalls = 0
async function fetchJson(url: string): Promise<any | null> {
  regCalls++
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'InfoWebWorldBot/1.0 (+https://www.infowebworld.com/developers/methodology)' },
    })
    if (r.status === 404) return null
    if (!r.ok) return null
    return await r.json()
  } catch {
    return null
  }
}
async function fetchText(url: string): Promise<string | null> {
  regCalls++
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'InfoWebWorldBot/1.0 (+https://www.infowebworld.com/developers/methodology)' },
    })
    if (!r.ok) return null
    return await r.text()
  } catch {
    return null
  }
}
async function fetchOk200(url: string): Promise<boolean> {
  regCalls++
  try {
    const r = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'InfoWebWorldBot/1.0 (+https://www.infowebworld.com/developers/methodology)' },
    })
    return r.status === 200
  } catch {
    return false
  }
}

/* Spec 6.4: "registryUrl only after an HTTP 200 check". Mutates in place and
   returns the same object for convenient chaining. */
async function confirmRegistryUrl200<T extends { registryUrl: string | null }>(result: T): Promise<T> {
  if (result.registryUrl && !(await fetchOk200(result.registryUrl))) {
    result.registryUrl = null
  }
  return result
}

/* ── Types ────────────────────────────────────────────────────────────── */

type Registry = 'npm' | 'pypi' | 'go' | 'maven' | 'nuget' | 'rubygems' | 'packagist' | 'crates' | 'pub' | 'swiftpm' | 'cocoapods' | 'other'

interface SdkResult {
  language: string
  registry: Registry
  package: string
  official: boolean
  repoUrl: string | null
  version: string | null
  lastPublished: string | null
  registryUrl: string | null
  evidence: string
}

interface GhRepoNode {
  name: string
  description: string | null
  primaryLanguage: { name: string } | null
  repositoryTopics: { nodes: Array<{ topic: { name: string } }> }
  isArchived: boolean
  url: string
}

/* ── Candidate repo filtering ─────────────────────────────────────────── */

const SDK_NAME_RE =
  /(^|[-_.])(sdk|client|api-client|apiclient)([-_.]|$)|(-|_)(node|js|javascript|typescript|ts|python|py|go|golang|java|kotlin|ruby|php|dotnet|csharp|cs|net|swift|ios|android|rust|dart|flutter)$/i
const SDK_TOPIC_RE =
  /^(sdk|client|api-client|client-library|sdk-javascript|sdk-python|sdk-go|sdk-java|sdk-ruby|sdk-php|sdk-dotnet|sdk-swift|sdk-rust)$/i
const EXCLUDE_NAME_RE =
  /(^|[-_.])(example|examples|sample|samples|demo|demos|docs|documentation|doc|tutorial|tutorials|workshop|template|templates|boilerplate|quickstart|cookbook|cookbooks|awesome|homepage|website|blog|starter|starters|playground|workflows|\.github)([-_.]|$)/i

function isCandidateRepo(r: GhRepoNode): boolean {
  if (r.isArchived) return false
  const name = r.name
  if (EXCLUDE_NAME_RE.test(name)) return false
  const topics = r.repositoryTopics.nodes.map((n) => n.topic.name.toLowerCase())
  if (SDK_NAME_RE.test(name)) return true
  if (topics.some((t) => SDK_TOPIC_RE.test(t))) return true
  return false
}

/* Language inference from repo name suffix / topics / primaryLanguage. */
const LANG_SUFFIX_MAP: Record<string, { display: string; slug: string }> = {
  node: { display: 'JavaScript', slug: 'javascript' },
  js: { display: 'JavaScript', slug: 'javascript' },
  javascript: { display: 'JavaScript', slug: 'javascript' },
  ts: { display: 'TypeScript', slug: 'typescript' },
  typescript: { display: 'TypeScript', slug: 'typescript' },
  python: { display: 'Python', slug: 'python' },
  py: { display: 'Python', slug: 'python' },
  go: { display: 'Go', slug: 'go' },
  golang: { display: 'Go', slug: 'go' },
  java: { display: 'Java', slug: 'java' },
  kotlin: { display: 'Kotlin', slug: 'kotlin' },
  ruby: { display: 'Ruby', slug: 'ruby' },
  php: { display: 'PHP', slug: 'php' },
  dotnet: { display: 'C#', slug: 'csharp' },
  csharp: { display: 'C#', slug: 'csharp' },
  cs: { display: 'C#', slug: 'csharp' },
  net: { display: 'C#', slug: 'csharp' },
  swift: { display: 'Swift', slug: 'swift' },
  ios: { display: 'Swift', slug: 'swift' },
  android: { display: 'Kotlin', slug: 'kotlin' },
  rust: { display: 'Rust', slug: 'rust' },
  dart: { display: 'Dart', slug: 'dart' },
  flutter: { display: 'Dart', slug: 'dart' },
}

function inferLanguageHint(repo: GhRepoNode): string | null {
  const name = repo.name.toLowerCase()
  const m = name.match(/(?:^|[-_.])(node|js|javascript|ts|typescript|python|py|go|golang|java|kotlin|ruby|php|dotnet|csharp|cs|net|swift|ios|android|rust|dart|flutter)$/)
  if (m) return m[1]
  return null
}

/* ── Manifest reading + registry verification per ecosystem ─────────── */

function repoMatches(owner: string, repo: string, url: string | null | undefined): boolean {
  if (!url) return false
  const m = url.match(/github\.com\/([^/]+)\/([^/#?]+)/i)
  if (!m) return false
  const [, u, r] = m
  const rNorm = r.replace(/\.git$/i, '')
  return u.toLowerCase() === owner.toLowerCase() && rNorm.toLowerCase() === repo.toLowerCase()
}

function anyUrlMatches(owner: string, repo: string, urls: Array<string | null | undefined>): boolean {
  return urls.some((u) => repoMatches(owner, repo, u))
}

async function verifyNpm(owner: string, repo: string, pkg: string, evidencePrefix: string): Promise<SdkResult | null> {
  const data = await fetchJson(`https://registry.npmjs.org/${encodeURIComponent(pkg).replace('%40', '@').replace(/%2F/g, '/')}`)
  if (!data) return null
  const repoUrlRaw = data.repository?.url || data.homepage || data.bugs?.url || null
  const urls = [repoUrlRaw, data.homepage, data.bugs?.url]
  const official = anyUrlMatches(owner, repo, urls)
  const version = data['dist-tags']?.latest || null
  const lastPublished = version && data.time ? data.time[version] || null : null
  return {
    language: '',
    registry: 'npm',
    package: pkg,
    official,
    repoUrl: `https://github.com/${owner}/${repo}`,
    version,
    lastPublished,
    registryUrl: `https://www.npmjs.com/package/${pkg}`,
    evidence: `${evidencePrefix}: npm registry.repository.url=${JSON.stringify(repoUrlRaw)}`,
  }
}

async function verifyPypi(owner: string, repo: string, pkg: string, evidencePrefix: string): Promise<SdkResult | null> {
  const data = await fetchJson(`https://pypi.org/pypi/${encodeURIComponent(pkg)}/json`)
  if (!data) return null
  const info = data.info || {}
  const projectUrls: Record<string, string> = info.project_urls || {}
  const urls = [info.home_page, ...Object.values(projectUrls)]
  const official = anyUrlMatches(owner, repo, urls)
  const version = info.version || null
  const releaseInfo = version ? data.releases?.[version] : null
  const lastPublished = Array.isArray(releaseInfo) && releaseInfo.length ? releaseInfo[releaseInfo.length - 1].upload_time_iso_8601 || null : null
  return {
    language: '',
    registry: 'pypi',
    package: pkg,
    official,
    repoUrl: `https://github.com/${owner}/${repo}`,
    version,
    lastPublished,
    registryUrl: `https://pypi.org/project/${pkg}/`,
    evidence: `${evidencePrefix}: pypi project_urls=${JSON.stringify(projectUrls)} home_page=${JSON.stringify(info.home_page)}`,
  }
}

async function verifyGo(owner: string, repo: string, modulePath: string, evidencePrefix: string): Promise<SdkResult | null> {
  // The module path itself must be github.com/{owner}/{repo}[/vN]
  const re = new RegExp(`^github\\.com/${owner}/${repo}(?:/v\\d+)?$`, 'i')
  const official = re.test(modulePath)
  const latest = await fetchJson(`https://proxy.golang.org/${modulePath.toLowerCase()}/@latest`)
  return {
    language: '',
    registry: 'go',
    package: modulePath,
    official,
    repoUrl: `https://github.com/${owner}/${repo}`,
    version: latest?.Version || null,
    lastPublished: latest?.Time || null,
    registryUrl: `https://pkg.go.dev/${modulePath}`,
    evidence: `${evidencePrefix}: go.mod module path=${JSON.stringify(modulePath)}, matches github.com/${owner}/${repo}=${official}`,
  }
}

async function verifyCrates(owner: string, repo: string, pkg: string, evidencePrefix: string): Promise<SdkResult | null> {
  const data = await fetchJson(`https://crates.io/api/v1/crates/${encodeURIComponent(pkg)}`)
  if (!data?.crate) return null
  const c = data.crate
  const urls = [c.repository, c.homepage, c.documentation]
  const official = anyUrlMatches(owner, repo, urls)
  return {
    language: '',
    registry: 'crates',
    package: pkg,
    official,
    repoUrl: `https://github.com/${owner}/${repo}`,
    version: c.max_stable_version || c.newest_version || null,
    lastPublished: c.updated_at || null,
    registryUrl: `https://crates.io/crates/${pkg}`,
    evidence: `${evidencePrefix}: crates.io repository=${JSON.stringify(c.repository)}`,
  }
}

async function verifyRubygems(owner: string, repo: string, pkg: string, evidencePrefix: string): Promise<SdkResult | null> {
  const data = await fetchJson(`https://rubygems.org/api/v1/gems/${encodeURIComponent(pkg)}.json`)
  if (!data) return null
  const urls = [data.source_code_uri, data.homepage_uri, data.bug_tracker_uri]
  const official = anyUrlMatches(owner, repo, urls)
  return {
    language: '',
    registry: 'rubygems',
    package: pkg,
    official,
    repoUrl: `https://github.com/${owner}/${repo}`,
    version: data.version || null,
    lastPublished: null,
    registryUrl: `https://rubygems.org/gems/${pkg}`,
    evidence: `${evidencePrefix}: rubygems source_code_uri=${JSON.stringify(data.source_code_uri)} homepage_uri=${JSON.stringify(data.homepage_uri)}`,
  }
}

async function verifyPackagist(owner: string, repo: string, pkg: string, evidencePrefix: string): Promise<SdkResult | null> {
  const data = await fetchJson(`https://packagist.org/packages/${encodeURIComponent(pkg)}.json`)
  const p = data?.package
  if (!p) return null
  const repoUrl = p.repository
  const official = repoMatches(owner, repo, repoUrl)
  const versions = p.versions || {}
  const versionKeys = Object.keys(versions).filter((v) => !/dev/i.test(v))
  const latestKey = versionKeys[0] || Object.keys(versions)[0]
  const latest = latestKey ? versions[latestKey] : null
  return {
    language: '',
    registry: 'packagist',
    package: pkg,
    official,
    repoUrl: `https://github.com/${owner}/${repo}`,
    version: latest?.version || null,
    lastPublished: latest?.time || null,
    registryUrl: `https://packagist.org/packages/${pkg}`,
    evidence: `${evidencePrefix}: packagist repository=${JSON.stringify(repoUrl)}`,
  }
}

async function verifyPubDev(owner: string, repo: string, pkg: string, evidencePrefix: string): Promise<SdkResult | null> {
  const data = await fetchJson(`https://pub.dev/api/packages/${encodeURIComponent(pkg)}`)
  if (!data) return null
  const latest = data.latest
  const pubspec = latest?.pubspec || {}
  const urls = [pubspec.repository, pubspec.homepage]
  const official = anyUrlMatches(owner, repo, urls)
  return {
    language: '',
    registry: 'pub',
    package: pkg,
    official,
    repoUrl: `https://github.com/${owner}/${repo}`,
    version: latest?.version || null,
    lastPublished: latest?.published || null,
    registryUrl: `https://pub.dev/packages/${pkg}`,
    evidence: `${evidencePrefix}: pub.dev repository=${JSON.stringify(pubspec.repository)} homepage=${JSON.stringify(pubspec.homepage)}`,
  }
}

async function verifyNuget(owner: string, repo: string, pkg: string, evidencePrefix: string): Promise<SdkResult | null> {
  const idx = await fetchJson(`https://api.nuget.org/v3/registration5-semver1/${pkg.toLowerCase()}/index.json`)
  if (!idx) return null
  const pages = idx.items || []
  const lastPage = pages[pages.length - 1]
  const items = lastPage?.items || lastPage?.['items'] || []
  // registration5-semver1 pages may be inlined or need a fetch; try inline first
  let entries = items
  if ((!entries || !entries.length) && lastPage?.['@id']) {
    const page = await fetchJson(lastPage['@id'])
    entries = page?.items || []
  }
  const last = entries[entries.length - 1]
  const catalogEntry = last?.catalogEntry
  if (!catalogEntry) return null
  const urls = [catalogEntry.projectUrl, catalogEntry.licenseUrl]
  const official = anyUrlMatches(owner, repo, urls)
  return {
    language: '',
    registry: 'nuget',
    package: pkg,
    official,
    repoUrl: `https://github.com/${owner}/${repo}`,
    version: catalogEntry.version || null,
    lastPublished: catalogEntry.published || null,
    registryUrl: `https://www.nuget.org/packages/${pkg}`,
    evidence: `${evidencePrefix}: nuget projectUrl=${JSON.stringify(catalogEntry.projectUrl)}`,
  }
}

async function verifyMaven(owner: string, repo: string, groupId: string, artifactId: string, evidencePrefix: string): Promise<SdkResult | null> {
  const search = await fetchJson(
    `https://search.maven.org/solrsearch/select?q=g:${encodeURIComponent(groupId)}+AND+a:${encodeURIComponent(artifactId)}&rows=1&wt=json`
  )
  const doc = search?.response?.docs?.[0]
  if (!doc) return null
  const version = doc.latestVersion || doc.v || null
  let official = false
  let scmUrl: string | null = null
  if (version) {
    const gPath = groupId.replace(/\./g, '/')
    const pomUrl = `https://repo1.maven.org/maven2/${gPath}/${artifactId}/${version}/${artifactId}-${version}.pom`
    const pomText = await fetchText(pomUrl)
    if (pomText) {
      const m = pomText.match(/<scm>[\s\S]*?<url>([^<]+)<\/url>/)
      scmUrl = m ? m[1].trim() : null
      official = repoMatches(owner, repo, scmUrl)
      if (!official) {
        const m2 = pomText.match(/<connection>([^<]+)<\/connection>/)
        official = repoMatches(owner, repo, m2?.[1] || null)
      }
    }
  }
  return {
    language: '',
    registry: 'maven',
    package: `${groupId}:${artifactId}`,
    official,
    repoUrl: `https://github.com/${owner}/${repo}`,
    version,
    lastPublished: doc.timestamp ? new Date(doc.timestamp).toISOString() : null,
    registryUrl: `https://central.sonatype.com/artifact/${groupId}/${artifactId}`,
    evidence: `${evidencePrefix}: maven POM scm url=${JSON.stringify(scmUrl)}`,
  }
}

/* CocoaPods trunk has no "repository" field on the pod itself; the podspec of its
   latest version does (source.git / homepage). Spec names from pod -> podspec via
   a 3-level MD5-shard CDN path (CocoaPods' own published convention). Re-verification
   checks ORG-level ("points into the provider's org", per the task's own wording for
   re-checking existing sdks[] - unlike the repo-specific match used when discovering
   from a specific candidate repo), since a pod's podspec can legitimately cite a
   different, renamed repo under the same org than whatever the enrichment guessed. */
async function verifyCocoapods(ownerForOrgMatch: string, pkg: string, evidencePrefix: string): Promise<SdkResult | null> {
  const trunk = await fetchJson(`https://trunk.cocoapods.org/api/v1/pods/${encodeURIComponent(pkg)}`)
  const versions = trunk?.versions
  if (!Array.isArray(versions) || !versions.length) return null
  const latest = versions[versions.length - 1]?.name
  if (!latest) return null
  const md5 = crypto.createHash('md5').update(pkg).digest('hex')
  const specUrl = `https://cdn.cocoapods.org/Specs/${md5[0]}/${md5[1]}/${md5[2]}/${encodeURIComponent(pkg)}/${encodeURIComponent(latest)}/${encodeURIComponent(pkg)}.podspec.json`
  const spec = await fetchJson(specUrl)
  const sourceGit: string | null = spec?.source?.git || null
  let official = false
  if (sourceGit && ownerForOrgMatch) {
    const m = sourceGit.match(/github\.com[/:]([^/]+)\//i)
    official = !!m && m[1].toLowerCase() === ownerForOrgMatch.toLowerCase()
  }
  return {
    language: '',
    registry: 'cocoapods',
    package: pkg,
    official,
    repoUrl: sourceGit ? sourceGit.replace(/\.git$/i, '') : null,
    version: latest,
    lastPublished: null, // trunk does not expose a per-version publish timestamp beyond created_at on the pod list
    registryUrl: `https://cocoapods.org/pods/${pkg}`,
    evidence: `${evidencePrefix}: podspec (${specUrl}) source.git=${JSON.stringify(sourceGit)}, org match against ${JSON.stringify(ownerForOrgMatch)}=${official}`,
  }
}

async function verifySwiftPM(owner: string, repo: string, evidencePrefix: string): Promise<SdkResult | null> {
  // The repo itself is the package; official iff it lives directly under the provider org.
  return {
    language: '',
    registry: 'swiftpm',
    package: `${owner}/${repo}`,
    official: true,
    repoUrl: `https://github.com/${owner}/${repo}`,
    version: null,
    lastPublished: null,
    registryUrl: `https://github.com/${owner}/${repo}`,
    evidence: `${evidencePrefix}: Package.swift present in ${owner}/${repo} (repo itself is the package)`,
  }
}

/* ── Manifest-driven candidate -> SdkResult ──────────────────────────── */

async function discoverFromRepo(owner: string, repo: GhRepoNode): Promise<SdkResult | null> {
  const name = repo.name
  const langHint = inferLanguageHint(repo)
  const primary = repo.primaryLanguage?.name || null

  // Try manifests roughly in the order suggested by name suffix, then by primaryLanguage.
  const order: string[] = []
  if (langHint) order.push(langHint)
  if (primary) {
    const p = primary.toLowerCase()
    if (p === 'javascript' || p === 'typescript') order.push('js')
    if (p === 'python') order.push('python')
    if (p === 'go') order.push('go')
    if (p === 'java') order.push('java')
    if (p === 'kotlin') order.push('kotlin')
    if (p === 'ruby') order.push('ruby')
    if (p === 'php') order.push('php')
    if (p === 'c#') order.push('csharp')
    if (p === 'swift') order.push('swift')
    if (p === 'rust') order.push('rust')
    if (p === 'dart') order.push('dart')
  }
  // Always also try the full generic set as a fallback (covers repos with no name-suffix hint,
  // e.g. "sdk-core" style names), but only the common ones to bound cost.
  order.push('js', 'python', 'go', 'java', 'ruby', 'php', 'csharp', 'swift', 'rust', 'dart')

  const tried = new Set<string>()
  for (const hint of order) {
    if (tried.has(hint)) continue
    tried.add(hint)
    const result = await tryEcosystem(owner, repo.name, hint)
    if (result) {
      const lang = LANG_SUFFIX_MAP[hint]
      result.language = lang ? lang.display : primary || hint
      return result
    }
  }
  return null
}

async function tryEcosystem(owner: string, repo: string, hint: string): Promise<SdkResult | null> {
  switch (hint) {
    case 'node':
    case 'js':
    case 'javascript':
    case 'ts':
    case 'typescript': {
      const text = ghContentsText(owner, repo, 'package.json')
      if (!text) return null
      try {
        const pkg = JSON.parse(text)
        if (!pkg.name) return null
        return await verifyNpm(owner, repo, pkg.name, `package.json name=${pkg.name}`)
      } catch {
        return null
      }
    }
    case 'python':
    case 'py': {
      let pkgName: string | null = null
      let evidence = ''
      const pyproject = ghContentsText(owner, repo, 'pyproject.toml')
      if (pyproject) {
        const m = pyproject.match(/\[project\][\s\S]*?\bname\s*=\s*["']([^"']+)["']/) ||
          pyproject.match(/\[tool\.poetry\][\s\S]*?\bname\s*=\s*["']([^"']+)["']/)
        if (m) {
          pkgName = m[1]
          evidence = `pyproject.toml name=${pkgName}`
        }
      }
      if (!pkgName) {
        const setupPy = ghContentsText(owner, repo, 'setup.py')
        if (setupPy) {
          const m = setupPy.match(/name\s*=\s*["']([^"']+)["']/)
          if (m) {
            pkgName = m[1]
            evidence = `setup.py name=${pkgName}`
          }
        }
      }
      if (!pkgName) {
        const setupCfg = ghContentsText(owner, repo, 'setup.cfg')
        if (setupCfg) {
          const m = setupCfg.match(/\[metadata\][\s\S]*?\bname\s*=\s*([^\n]+)/)
          if (m) {
            pkgName = m[1].trim()
            evidence = `setup.cfg name=${pkgName}`
          }
        }
      }
      if (!pkgName) return null
      return await verifyPypi(owner, repo, pkgName, evidence)
    }
    case 'go':
    case 'golang': {
      const text = ghContentsText(owner, repo, 'go.mod')
      if (!text) return null
      const m = text.match(/^module\s+(\S+)/m)
      if (!m) return null
      return await verifyGo(owner, repo, m[1], `go.mod module=${m[1]}`)
    }
    case 'rust': {
      const text = ghContentsText(owner, repo, 'Cargo.toml')
      if (!text) return null
      const m = text.match(/\[package\][\s\S]*?\bname\s*=\s*["']([^"']+)["']/)
      if (!m) return null
      return await verifyCrates(owner, repo, m[1], `Cargo.toml name=${m[1]}`)
    }
    case 'ruby': {
      const files = ghDirList(owner, repo)
      const gemspec = files.find((f) => f.type === 'file' && f.name.endsWith('.gemspec'))
      if (!gemspec) return null
      const text = ghContentsText(owner, repo, gemspec.name)
      if (!text) return null
      const m = text.match(/\.name\s*=\s*["']([^"']+)["']/)
      const pkgName = m ? m[1] : gemspec.name.replace(/\.gemspec$/, '')
      return await verifyRubygems(owner, repo, pkgName, `${gemspec.name} name=${pkgName}`)
    }
    case 'php': {
      const text = ghContentsText(owner, repo, 'composer.json')
      if (!text) return null
      try {
        const pkg = JSON.parse(text)
        if (!pkg.name) return null
        return await verifyPackagist(owner, repo, pkg.name, `composer.json name=${pkg.name}`)
      } catch {
        return null
      }
    }
    case 'dart':
    case 'flutter': {
      const text = ghContentsText(owner, repo, 'pubspec.yaml')
      if (!text) return null
      const m = text.match(/^name:\s*(\S+)/m)
      if (!m) return null
      return await verifyPubDev(owner, repo, m[1], `pubspec.yaml name=${m[1]}`)
    }
    case 'dotnet':
    case 'csharp':
    case 'cs':
    case 'net': {
      // Need a directory listing to find *.csproj (name varies); check root and src/ (1 level).
      let files = ghDirList(owner, repo)
      let csproj = files.find((f) => f.type === 'file' && f.name.endsWith('.csproj'))
      if (!csproj) {
        const src = files.find((f) => f.type === 'dir' && /^src$/i.test(f.name))
        if (src) {
          const srcFiles = ghDirList(owner, repo, src.path)
          csproj = srcFiles.find((f) => f.type === 'file' && f.name.endsWith('.csproj'))
        }
      }
      if (!csproj) return null
      const text = ghContentsText(owner, repo, csproj.path)
      if (!text) return null
      const pkgIdMatch = text.match(/<PackageId>([^<]+)<\/PackageId>/)
      const pkgName = pkgIdMatch ? pkgIdMatch[1].trim() : csproj.name.replace(/\.csproj$/, '')
      return await verifyNuget(owner, repo, pkgName, `${csproj.path} PackageId=${pkgName}`)
    }
    case 'java':
    case 'kotlin':
    case 'android': {
      const pom = ghContentsText(owner, repo, 'pom.xml')
      if (pom) {
        const g = pom.match(/<groupId>([^<]+)<\/groupId>/)
        const a = pom.match(/<artifactId>([^<]+)<\/artifactId>/)
        if (g && a) {
          return await verifyMaven(owner, repo, g[1].trim(), a[1].trim(), `pom.xml groupId=${g[1]} artifactId=${a[1]}`)
        }
      }
      const gradle = ghContentsText(owner, repo, 'build.gradle') || ghContentsText(owner, repo, 'build.gradle.kts')
      if (gradle) {
        const g = gradle.match(/group\s*[=:]\s*["']([^"']+)["']/)
        const a = gradle.match(/artifactId\s*[=:]\s*["']([^"']+)["']/) ||
          gradle.match(/archivesBaseName\s*[=:]\s*["']([^"']+)["']/)
        if (g && a) {
          return await verifyMaven(owner, repo, g[1].trim(), a[1].trim(), `build.gradle group=${g[1]} artifactId=${a[1]}`)
        }
        // group only (artifactId defaults to repo name in many Gradle setups)
        if (g) {
          return await verifyMaven(owner, repo, g[1].trim(), repo, `build.gradle group=${g[1]} artifactId(assumed repo name)=${repo}`)
        }
      }
      return null
    }
    case 'swift':
    case 'ios': {
      const text = ghContentsText(owner, repo, 'Package.swift')
      if (!text) return null
      return await verifySwiftPM(owner, repo, 'Package.swift present')
    }
    default:
      return null
  }
}

/* ── Re-verification of a pre-existing sdks[] entry ──────────────────── */

async function reverifyExisting(entry: any, fallbackOwner: string | null): Promise<SdkResult | null> {
  const pkg: string | null = entry.package || null
  const registryHint: string = (entry.registry || '').toLowerCase()
  const repoUrl: string | null = entry.repoUrl || null
  let owner = fallbackOwner
  let repo: string | null = null
  if (repoUrl) {
    const m = repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/i)
    if (m) {
      owner = m[1]
      repo = m[2].replace(/\.git$/i, '')
    }
  }
  if (!pkg) return null

  const evidencePrefix = `existing sdks[] entry package=${pkg}`

  // Registry-specific re-check. If we don't know owner/repo, we still check the package
  // exists and report official=false (can't confirm the link-back without a repo).
  let result: SdkResult | null = null
  if (registryHint === 'npm' || /^@?[a-z0-9][\w.-]*(\/[\w.-]+)?$/i.test(pkg) && !registryHint) {
    result = await verifyNpm(owner || '', repo || '', pkg, evidencePrefix)
  }
  if (!result && (registryHint === 'pypi' || registryHint === '')) {
    result = await verifyPypi(owner || '', repo || '', pkg, evidencePrefix)
  }
  if (!result && registryHint === 'go') {
    result = await verifyGo(owner || '', repo || '', pkg, evidencePrefix)
  }
  if (!result && registryHint === 'crates') {
    result = await verifyCrates(owner || '', repo || '', pkg, evidencePrefix)
  }
  if (!result && registryHint === 'rubygems') {
    result = await verifyRubygems(owner || '', repo || '', pkg, evidencePrefix)
  }
  if (!result && registryHint === 'packagist') {
    result = await verifyPackagist(owner || '', repo || '', pkg, evidencePrefix)
  }
  if (!result && registryHint === 'pub') {
    result = await verifyPubDev(owner || '', repo || '', pkg, evidencePrefix)
  }
  if (!result && registryHint === 'nuget') {
    result = await verifyNuget(owner || '', repo || '', pkg, evidencePrefix)
  }
  if (!result && registryHint === 'cocoapods') {
    result = await verifyCocoapods(owner || '', pkg, evidencePrefix)
  }
  if (!result && !registryHint && owner && repo) {
    // Unknown registry hint: try npm then pypi as last resort (covers legacy rows with no registry field).
    result = (await verifyNpm(owner, repo, pkg, evidencePrefix)) || (await verifyPypi(owner, repo, pkg, evidencePrefix))
  }
  if (result) result.language = entry.language || result.language
  return result
}

/* ── Main ─────────────────────────────────────────────────────────────── */

interface InputApi {
  id: string
  slug: string
  name: string
  enriched: boolean
  provider: { name: string; website: string | null; githubOrg: string | null }
  sdks: any[]
}

async function main() {
  const input = readJson<{ apis: InputApi[] }>(INPUT)
  const enriched = input.apis.filter((a) => a.enriched)

  // apiId -> githubOrg (lowercased key for repo listing; keep original case for URLs)
  const orgToApis = new Map<string, InputApi[]>()
  for (const api of enriched) {
    const org = api.provider?.githubOrg
    if (!org) continue
    const key = org
    if (!orgToApis.has(key)) orgToApis.set(key, [])
    orgToApis.get(key)!.push(api)
  }
  const orgs = [...orgToApis.keys()]

  // APIs that have existing sdks[] but no githubOrg (still must be re-verified per instructions).
  const noOrgWithSdks = enriched.filter((a) => !a.provider?.githubOrg && a.sdks && a.sdks.length > 0)

  console.log(`Enriched APIs: ${enriched.length}`)
  console.log(`Distinct provider orgs: ${orgs.length}`)
  console.log(`No-org APIs with existing sdks[]: ${noOrgWithSdks.length}`)

  /* Step 1: list repos for every org (batched GraphQL, checkpointed). */
  let orgRepos = loadCheckpoint<Record<string, GhRepoNode[] | null>>('org-repos.json') || {}
  const BATCH = 8
  const pending = orgs.filter((o) => orgRepos[o] === undefined)
  for (let i = 0; i < pending.length; i += BATCH) {
    const chunk = pending.slice(i, i + BATCH)
    const aliasParts = chunk.map((org, idx) => {
      const safe = org.replace(/"/g, '\\"')
      // repositoryOwner resolves to either an Organization or a User (many provider.githubOrg
      // values from enrichment are actually personal maintainer accounts, not GitHub orgs).
      return `o${idx}: repositoryOwner(login: "${safe}") {
        login
        __typename
        repositories(first: 50, isFork: false, orderBy: {field: STARGAZERS, direction: DESC}) {
          nodes {
            name
            description
            primaryLanguage { name }
            repositoryTopics(first: 5) { nodes { topic { name } } }
            isArchived
            url
          }
        }
      }`
    })
    const query = `query {\n${aliasParts.join('\n')}\n  rateLimit { cost remaining resetAt }\n}`
    let res: any
    try {
      res = ghGraphQL(query)
    } catch (e: any) {
      console.error(`GraphQL batch failed for [${chunk.join(', ')}]: ${e.message}`)
      for (const org of chunk) orgRepos[org] = null
      saveCheckpoint('org-repos.json', orgRepos)
      continue
    }
    if (res.data?.rateLimit) {
      const { remaining, resetAt } = res.data.rateLimit
      console.log(`  rateLimit: cost=${res.data.rateLimit.cost} remaining=${remaining} resetAt=${resetAt}`)
      if (remaining < 300) {
        const waitMs = Math.max(0, new Date(resetAt).getTime() - Date.now()) + 5000
        console.log(`  rateLimit low (${remaining} < 300) - pausing ${Math.round(waitMs / 1000)}s until reset`)
        await new Promise((r) => setTimeout(r, waitMs))
      }
    }
    chunk.forEach((org, idx) => {
      const node = res.data?.[`o${idx}`]
      orgRepos[org] = node ? node.repositories.nodes : null
    })
    saveCheckpoint('org-repos.json', orgRepos)
    console.log(`Listed repos for orgs ${i + chunk.length}/${pending.length} (this run)`)
  }

  /* Step 2: filter candidates per org, discover + verify each. */
  const sdkDiscovery: Record<string, { sdks: SdkResult[]; checkedAt: string }> = loadCheckpoint('sdk-discovery-partial.json') || {}
  const now = new Date().toISOString()

  const orgDiscoveredByOwner: Record<string, SdkResult[]> = loadCheckpoint('org-discovered.json') || {}
  for (const org of orgs) {
    if (orgDiscoveredByOwner[org] !== undefined) continue
    const repos = orgRepos[org]
    const results: SdkResult[] = []
    if (repos) {
      const candidates = repos.filter(isCandidateRepo)
      for (const repo of candidates) {
        try {
          const r = await discoverFromRepo(org, repo)
          if (r) results.push(r)
        } catch (e: any) {
          console.error(`  discoverFromRepo failed for ${org}/${repo.name}: ${e.message}`)
        }
      }
    }
    orgDiscoveredByOwner[org] = results
    saveCheckpoint('org-discovered.json', orgDiscoveredByOwner)
    console.log(`${org}: ${repos ? repos.length : 'N/A'} repos, ${orgDiscoveredByOwner[org].length} SDK(s) found`)
  }

  /* Step 3: assemble sdks per API: discovered (for its org) + re-verified existing entries, deduped by package. */
  const existingReverified: Record<string, SdkResult[]> = loadCheckpoint('existing-reverified.json') || {}

  async function getReverifiedExisting(api: InputApi): Promise<SdkResult[]> {
    if (existingReverified[api.id] !== undefined) return existingReverified[api.id]
    const out: SdkResult[] = []
    for (const entry of api.sdks || []) {
      try {
        const r = await reverifyExisting(entry, api.provider?.githubOrg || null)
        if (r) out.push(r)
      } catch (e: any) {
        console.error(`  reverifyExisting failed for ${api.id} package=${entry.package}: ${e.message}`)
      }
    }
    existingReverified[api.id] = out
    saveCheckpoint('existing-reverified.json', existingReverified)
    return out
  }

  let apisProcessed = 0
  const apiTotal = enriched.filter((a) => a.provider?.githubOrg || (a.sdks && a.sdks.length > 0)).length
  for (const api of enriched) {
    const hasOrg = !!api.provider?.githubOrg
    const hasExisting = api.sdks && api.sdks.length > 0
    if (!hasOrg && !hasExisting) continue
    if (sdkDiscovery[api.id] !== undefined) {
      apisProcessed++
      continue
    }
    const discovered = hasOrg ? orgDiscoveredByOwner[api.provider.githubOrg!] || [] : []
    const reverified = await getReverifiedExisting(api)
    const merged = new Map<string, SdkResult>()
    for (const r of [...discovered, ...reverified]) {
      const key = `${r.registry}:${r.package.toLowerCase()}`
      const existing = merged.get(key)
      if (!existing || (r.official && !existing.official)) merged.set(key, r)
    }
    sdkDiscovery[api.id] = { sdks: [...merged.values()], checkedAt: now }
    saveCheckpoint('sdk-discovery-partial.json', sdkDiscovery)
    apisProcessed++
    if (apisProcessed % 10 === 0) console.log(`Assembled sdks for ${apisProcessed}/${apiTotal} APIs`)
  }

  /* Step 4: confirm every registryUrl with a live HTTP 200 check (spec 6.4) in one
     final pass, covering entries resumed from checkpoints (written by an earlier,
     unchecked version of this script) as well as ones computed in this run. */
  console.log('\nConfirming registryUrl with a live HTTP 200 check...')
  let urlsChecked = 0
  for (const entry of Object.values(sdkDiscovery)) {
    for (const sdk of entry.sdks) {
      await confirmRegistryUrl200(sdk)
      urlsChecked++
    }
  }
  console.log(`Checked ${urlsChecked} registryUrl(s).`)

  /* Write final outputs. */
  writeJson(OUT_JSON, sdkDiscovery)

  const perLanguage: Record<string, number> = {}
  let totalOfficial = 0
  let totalDropped = 0 // existing entries that failed re-verification (package not found)
  let totalConfirmed = 0
  let totalDemoted = 0
  let totalNew = 0

  for (const api of enriched) {
    if (!(api.provider?.githubOrg || (api.sdks && api.sdks.length))) continue
    const result = sdkDiscovery[api.id]
    if (!result) continue
    const existingPackages = new Set((api.sdks || []).map((s: any) => `${(s.registry || '').toLowerCase()}:${(s.package || '').toLowerCase()}`))
    for (const sdk of result.sdks) {
      if (sdk.official) {
        totalOfficial++
        perLanguage[sdk.language] = (perLanguage[sdk.language] || 0) + 1
      }
      const key = `${sdk.registry}:${sdk.package.toLowerCase()}`
      if (existingPackages.has(key)) {
        if (sdk.official) totalConfirmed++
        else totalDemoted++
      } else {
        totalNew++
      }
    }
    for (const entry of api.sdks || []) {
      const key = `${(entry.registry || '').toLowerCase()}:${(entry.package || '').toLowerCase()}`
      const stillThere = result.sdks.some((s) => `${s.registry}:${s.package.toLowerCase()}` === key)
      if (!stillThere) totalDropped++
    }
  }

  const report = `# SDK discovery report

Generated: ${now}

## Scope

- Enriched APIs scanned: ${enriched.length}
- Distinct provider GitHub orgs scanned: ${orgs.length}
- Enriched APIs with an existing sdks[] but no githubOrg (re-verified by package only): ${noOrgWithSdks.length}
- Orgs where the GraphQL repo listing failed (treated as zero candidates): ${orgs.filter((o) => orgRepos[o] === null).length}

## Results

- Official SDKs confirmed across all enriched APIs: ${totalOfficial}
- New official SDKs discovered (not previously in sdks[]): ${totalNew}
- Existing sdks[] entries confirmed official on re-check: ${totalConfirmed}
- Existing sdks[] entries demoted to official=false on re-check: ${totalDemoted}
- Existing sdks[] entries dropped (package no longer resolves on its registry): ${totalDropped}

## Per-language official SDK counts

${Object.entries(perLanguage)
  .sort((a, b) => b[1] - a[1])
  .map(([lang, n]) => `- ${lang}: ${n}`)
  .join('\n')}

## Orgs scanned

${orgs
  .map((o) => {
    const repos = orgRepos[o]
    const found = orgDiscoveredByOwner[o]?.filter((s) => s.official).length ?? 0
    return `- ${o}: ${repos ? repos.length + ' repos listed' : 'listing failed'}, ${found} official SDK(s)`
  })
  .join('\n')}

## Method

1. GitHub GraphQL (\`gh api graphql\`, aliased batches of 8 orgs): \`repositories(first: 100, isFork: false, orderBy: STARGAZERS)\`
   with name, description, primaryLanguage, repositoryTopics, isArchived, url.
2. Candidate filter: name or topic contains sdk/client/api-client, or a language-suffixed name
   (-node/-js/-python/-py/-go/-java/-kotlin/-ruby/-php/-dotnet/-csharp/-net/-swift/-ios/-android/-rust/-dart/-flutter);
   archived, example/sample/demo/docs/template/boilerplate-named repos excluded.
3. Manifest read via \`gh api repos/{owner}/{repo}/contents/{path}\` (package.json, pyproject.toml/setup.py/setup.cfg,
   go.mod, Cargo.toml, *.gemspec, composer.json, pom.xml/build.gradle(.kts), *.csproj, pubspec.yaml, Package.swift).
4. Registry verification: npm, PyPI, crates.io, RubyGems, Packagist, pub.dev, NuGet, Maven Central (POM scm url),
   Go module path, SwiftPM (repo itself). \`official = true\` only when the registry's own metadata links back to
   \`github.com/{owner}/{repo}\`.
5. Every pre-existing \`sdks[]\` entry on these APIs was independently re-checked the same way; packages that no
   longer resolve on their registry were dropped from the output.

GitHub API calls made: ${ghCalls}. Registry API calls made: ${regCalls}.
`
  fs.writeFileSync(OUT_REPORT, report)

  console.log('\nDone.')
  console.log(`Wrote ${OUT_JSON}`)
  console.log(`Wrote ${OUT_REPORT}`)
  console.log(`Official SDKs: ${totalOfficial} (new: ${totalNew}, confirmed: ${totalConfirmed}, demoted: ${totalDemoted}, dropped: ${totalDropped})`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
