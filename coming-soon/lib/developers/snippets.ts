/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - code snippets for API pages (spec 3.18).

   Quick start requests (cURL / JavaScript / Python), SDK install commands
   and package registry links. Nothing is invented: the request URL is the
   recorded sample exactly as stored (with its documented key placeholder),
   no header name or query parameter is ever guessed, and an install
   command is only written for a registry whose syntax is certain.

   Pure and isomorphic (no React, no Node APIs).
   ═══════════════════════════════════════════════════════════════════════ */

import type { ApiDetails, ApiSdk, SdkRegistry } from './types'
import type { HighlightLang } from './highlight'

type Sample = NonNullable<ApiDetails['sample']>
type Check = ApiDetails['check']

export type SnippetId = 'curl' | 'javascript' | 'python'

export interface Snippet {
  id: SnippetId
  /** Tab label: 'cURL', 'JavaScript', 'Python'. */
  label: string
  /** Tokenizer for lib/developers/highlight.ts. */
  lang: HighlightLang
  /** The exact text the Copy button copies (no '$' prompt). */
  code: string
}

/* ── Quick start requests ────────────────────────────────────────────── */

/* A documented key placeholder in a sample URL: YOUR_API_KEY, YOUR_KEY,
   YOUR_TOKEN, {api_key}, <apikey>, ... */
const KEY_PLACEHOLDER_RE = /YOUR_[A-Z0-9_]*(?:KEY|TOKEN|SECRET)[A-Z0-9_]*|\{[^{}\s"]*(?:key|token|secret)[^{}\s"]*\}|<[^<>\s"]*(?:key|token|secret)[^<>\s"]*>/i

/** The key placeholder written in a sample URL ('YOUR_API_KEY'), or null. */
export function keyPlaceholder(url: string): string | null {
  const m = url.match(KEY_PLACEHOLDER_RE)
  return m ? m[0] : null
}

/** The comment a key-needing sample carries (3.18), without comment marks. */
export function keyComment(url: string): string {
  return keyPlaceholder(url)
    ? 'Replace the key placeholder with your key (see "How to get an API key")'
    : 'Add your API key as described in the docs'
}

/** True when a recorded content type is JSON ('application/json',
 *  'application/problem+json; charset=utf-8', ...). */
export function isJsonContentType(contentType: string | null | undefined): boolean {
  return !!contentType && /[/+]json\b/i.test(contentType)
}

/* JSON unless the check recorded something else. Samples without a check
   are the key-needing REST calls, which document JSON responses. */
function readsJson(check: Check): boolean {
  return !check?.contentType || isJsonContentType(check.contentType)
}

/** A string as a double-quoted shell word ("...", with \ " $ ` escaped). */
export function shellQuote(value: string): string {
  return `"${value.replace(/(["\\$`])/g, '\\$1')}"`
}

/* JSON string syntax is valid JavaScript and Python string syntax. */
function codeString(value: string): string {
  return JSON.stringify(value)
}

/** cURL request: `curl "{url}"` for GET, `curl -X {METHOD} "{url}"` otherwise. */
export function curlSnippet(sample: Sample): string {
  const lines: string[] = []
  if (sample.needsKey) lines.push(`# ${keyComment(sample.url)}`)
  lines.push(sample.method === 'GET' ? `curl ${shellQuote(sample.url)}` : `curl -X ${sample.method} ${shellQuote(sample.url)}`)
  return lines.join('\n')
}

/** JavaScript (fetch) request for a GET sample. */
export function jsSnippet(sample: Sample, check: Check): string {
  const lines: string[] = []
  if (sample.needsKey) lines.push(`// ${keyComment(sample.url)}`)
  lines.push(`const res = await fetch(${codeString(sample.url)});`)
  lines.push(readsJson(check) ? 'const data = await res.json();' : 'const data = await res.text();')
  return lines.join('\n')
}

/** Python (requests) request for a GET sample. */
export function pythonSnippet(sample: Sample, check: Check): string {
  const lines: string[] = ['import requests', '']
  if (sample.needsKey) lines.push(`# ${keyComment(sample.url)}`)
  lines.push(`r = requests.get(${codeString(sample.url)}, timeout=10)`)
  lines.push(readsJson(check) ? 'print(r.json())' : 'print(r.text)')
  return lines.join('\n')
}

/** Quick start tabs for an API's recorded sample: cURL, JavaScript and
 *  Python for a GET request, cURL only for any other method, none without
 *  a sample URL. */
export function buildSnippets(sample: ApiDetails['sample'], check: Check): Snippet[] {
  /* A sample without a URL documents nothing to call. */
  if (!sample || typeof sample.url !== 'string' || !sample.url) return []
  const out: Snippet[] = [{ id: 'curl', label: 'cURL', lang: 'shell', code: curlSnippet(sample) }]
  if (sample.method === 'GET') {
    out.push({ id: 'javascript', label: 'JavaScript', lang: 'js', code: jsSnippet(sample, check) })
    out.push({ id: 'python', label: 'Python', lang: 'python', code: pythonSnippet(sample, check) })
  }
  return out
}

/** True when the Try it panel may run this sample in the browser (4.11):
 *  a GET over https that needs no key and passed our CORS check. */
export function isTryable(sample: ApiDetails['sample'], check: Check): boolean {
  return !!sample && sample.method === 'GET' && typeof sample.url === 'string' && sample.url.startsWith('https://') && !sample.needsKey && check?.tryable === true
}

/* ── SDK install commands ────────────────────────────────────────────── */

/** Registry names as their owners write them. */
export const REGISTRY_LABELS: Readonly<Record<SdkRegistry, string>> = {
  npm: 'npm',
  pypi: 'PyPI',
  go: 'Go modules',
  maven: 'Maven Central',
  nuget: 'NuGet',
  rubygems: 'RubyGems',
  packagist: 'Packagist',
  crates: 'crates.io',
  pub: 'pub.dev',
  cocoapods: 'CocoaPods',
  swiftpm: 'Swift Package Manager',
  other: 'Other',
}

export interface InstallCommand {
  /** The exact text to copy. */
  code: string
  /** 'shell' = run it in a terminal (CodeBlock shows a '$' prompt);
   *  'manifest' = a line for a build file (no prompt). */
  kind: 'shell' | 'manifest'
  /** Code block caption: 'bash', 'build.gradle.kts', 'Podfile', 'Package.swift'. */
  label: string
  /** Tokenizer for lib/developers/highlight.ts. */
  lang: HighlightLang
}

/* Characters real package ids use. Anything else gets no command (the
   registry link still shows), so a stored value can never become shell
   syntax. */
const SAFE_PACKAGE_RE = /^[A-Za-z0-9@][A-Za-z0-9@._/:+~-]*$/
const SAFE_VERSION_RE = /^[A-Za-z0-9][A-Za-z0-9._+-]*$/

/* The package id trimmed; '' for a missing one (no command, no link). */
function packageId(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim() : ''
}

/** The install command for an SDK (3.18), or null when the registry has
 *  no certain one-line command or a needed fact (version, repo) is missing. */
export function installCommand(sdk: Pick<ApiSdk, 'registry' | 'package' | 'version' | 'repoUrl'>): InstallCommand | null {
  const pkg = packageId(sdk.package)
  if (!SAFE_PACKAGE_RE.test(pkg)) return null
  const version = sdk.version && SAFE_VERSION_RE.test(sdk.version.trim()) ? sdk.version.trim() : null
  const shell = (code: string): InstallCommand => ({ code, kind: 'shell', label: 'bash', lang: 'shell' })

  switch (sdk.registry) {
    case 'npm': return shell(`npm install ${pkg}`)
    case 'pypi': return shell(`pip install ${pkg}`)
    case 'go': return shell(`go get ${pkg}`)
    case 'crates': return shell(`cargo add ${pkg}`)
    case 'rubygems': return shell(`gem install ${pkg}`)
    case 'packagist': return shell(`composer require ${pkg}`)
    case 'nuget': return shell(`dotnet add package ${pkg}`)
    case 'pub': return shell(`dart pub add ${pkg}`)
    case 'maven':
      /* Gradle coordinates need group:artifact AND a version. */
      if (!/^[^:\s]+:[^:\s]+$/.test(pkg) || !version) return null
      return { code: `implementation("${pkg}:${version}")`, kind: 'manifest', label: 'build.gradle.kts', lang: 'js' }
    case 'cocoapods':
      return { code: `pod '${pkg}'`, kind: 'manifest', label: 'Podfile', lang: 'shell' }
    case 'swiftpm': {
      const repo = sdk.repoUrl?.trim() ?? ''
      if (!version || !/^https:\/\/[^\s"]+$/.test(repo)) return null
      /* SwiftPM versions are bare semver: a 'v1.2.0' tag is from: "1.2.0". */
      return {
        code: `.package(url: "${repo}", from: "${version.replace(/^v(?=\d)/, '')}")`,
        kind: 'manifest',
        label: 'Package.swift',
        lang: 'js',
      }
    }
    default:
      return null
  }
}

/** The package's page on its registry (3.18), or null when the registry
 *  has no package page or the id has the wrong shape. Pages should prefer
 *  the stored `registryUrl` (checked for HTTP 200 at snapshot time). */
export function registryPageUrl(sdk: Pick<ApiSdk, 'registry' | 'package'>): string | null {
  const pkg = packageId(sdk.package)
  if (!SAFE_PACKAGE_RE.test(pkg)) return null
  const p = encodeURI(pkg)
  switch (sdk.registry) {
    case 'npm': return `https://www.npmjs.com/package/${p}`
    case 'pypi': return `https://pypi.org/project/${p}/`
    case 'go': return `https://pkg.go.dev/${p}`
    case 'crates': return `https://crates.io/crates/${p}`
    case 'rubygems': return `https://rubygems.org/gems/${p}`
    case 'packagist': return `https://packagist.org/packages/${p}`
    case 'nuget': return `https://www.nuget.org/packages/${p}`
    case 'pub': return `https://pub.dev/packages/${p}`
    case 'cocoapods': return `https://cocoapods.org/pods/${p}`
    case 'maven': {
      const m = pkg.match(/^([^:\s]+):([^:\s]+)$/)
      return m ? `https://central.sonatype.com/artifact/${encodeURI(m[1])}/${encodeURI(m[2])}` : null
    }
    default:
      return null
  }
}
