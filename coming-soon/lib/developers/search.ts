/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - search (spec 6.6). Server only.

   searchDevhub() is an in-process, in-memory search over both datasets:
   companies, repositories, free APIs, SDK packages, API categories,
   languages and topics. No database, no network, no regex built from
   user input (every match is a plain startsWith/includes check).

   The index is built once per store "version" pair (store.ts bumps
   OssStore.version / ApisStore.version on every successful load or
   runtime refresh) and reused until either changes, so a request is a
   linear scan over plain arrays - a few ms even at full scale.

   Scoring (per matching entry): exact name/slug 100, name-prefix 60,
   word-prefix 40, exact topic/tag/category 30, substring in name 20,
   substring in description 10, plus log10(prior + 1) (GitHub stars for
   companies/repos; official SDK count + enriched for APIs; officialness
   for SDK rows; repo/API counts for facets and categories). An entry
   with no text match is dropped before any prior is added.
   ═══════════════════════════════════════════════════════════════════════ */

import 'server-only'
import { apiHref, officialSdks, type ApisStore } from './apis'
import { formatCompact, formatNumber } from './format'
import { companyAvatar, type OssStore } from './oss'
import { apiCategoryPath, ossCompanyPath, ossFacetPath, ossRepoPath } from './paths'
import { apiBaseName } from './seo'
import { REGISTRY_LABELS } from './snippets'
import { tryGetApis, tryGetOss } from './store'
import type { SearchHit, SearchKind, SearchResponse } from './types'

export const SEARCH_MIN_CHARS = 2
export const SEARCH_MAX_CHARS = 64
export const SEARCH_DEFAULT_LIMIT = 5
export const SEARCH_MAX_LIMIT = 30

export type SearchType = 'all' | 'api' | 'company' | 'repo' | 'sdk'
const SEARCH_TYPES: readonly SearchType[] = ['all', 'api', 'company', 'repo', 'sdk']

/** Narrows a raw `type` query param to a SearchType ('all' for anything else). */
export function isSearchType(value: string | null | undefined): value is SearchType {
  return !!value && (SEARCH_TYPES as readonly string[]).includes(value)
}

export interface SearchDevhubOptions {
  /** Max hits per group (1-30, default 5). */
  limit?: number
  type?: SearchType
}

/* ── Query normalising (6.6) ─────────────────────────────────────────── */

/** NFKC-normalised, diacritics folded, lowercased, trimmed, capped at 64
 *  chars. '' for anything shorter than 2 characters after folding, so the
 *  caller can short-circuit to an empty response. */
export function normalizeSearchQuery(raw: string): string {
  const folded = raw
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .slice(0, SEARCH_MAX_CHARS)
  return folded.length >= SEARCH_MIN_CHARS ? folded : ''
}

/** Clamp an arbitrary `limit` input to 1-30 (default 5 when missing/invalid). */
export function clampSearchLimit(raw: unknown): number {
  const n = typeof raw === 'string' ? Number(raw) : typeof raw === 'number' ? raw : NaN
  if (!Number.isFinite(n)) return SEARCH_DEFAULT_LIMIT
  return Math.min(SEARCH_MAX_LIMIT, Math.max(1, Math.floor(n)))
}

/* ── Index ──────────────────────────────────────────────────────────── */

interface Entry {
  hit: SearchHit
  /** Lowercased primary name + alternates (slug, org logins, package id). */
  names: string[]
  /** Lowercased exact-match tier: topics, tags, category name/slug. */
  tags: string[]
  description: string
  prior: number
}

/* Lowercase words, splitting on anything that is not a letter or digit. */
function words(s: string): string[] {
  return s.split(/[^a-z0-9]+/).filter(Boolean)
}

function buildIndex(oss: OssStore | null, apis: ApisStore | null): Entry[] {
  const entries: Entry[] = []

  if (oss) {
    for (const c of oss.companies) {
      const stats = oss.statsBySlug.get(c.slug)
      entries.push({
        hit: {
          kind: 'company',
          label: c.name,
          sub: c.industry,
          href: ossCompanyPath(c.slug),
          external: false,
          meta: stats ? `${formatCompact(stats.stars)} stars` : null,
          avatar: companyAvatar(c) || null,
        },
        names: [c.name.toLowerCase(), ...c.orgs.map(o => o.login.toLowerCase())],
        tags: [c.industry.toLowerCase(), ...(c.countryName ? [c.countryName.toLowerCase()] : [])],
        description: (c.oneLiner ?? '').toLowerCase(),
        prior: stats?.stars ?? 0,
      })
    }

    for (const r of oss.repos) {
      const company = oss.companyBySlug.get(r.companySlug)
      const sub = [company?.name, r.primaryLanguage?.name].filter(Boolean).join(' - ')
      entries.push({
        hit: {
          kind: 'repo',
          label: r.nameWithOwner,
          sub: sub || null,
          href: ossRepoPath(r.companySlug, r.slug),
          external: false,
          meta: `${formatCompact(r.stars)} stars`,
          avatar: company ? companyAvatar(company) || null : null,
          mono: true,
        },
        names: [r.name.toLowerCase(), r.nameWithOwner.toLowerCase(), r.owner.toLowerCase()],
        tags: r.topics.map(t => t.toLowerCase()),
        description: (r.description ?? '').toLowerCase(),
        prior: r.stars,
      })
    }

    for (const f of oss.facets.language) {
      entries.push({
        hit: {
          kind: 'language',
          label: f.name,
          sub: `${formatNumber(f.repos)} ${f.repos === 1 ? 'project' : 'projects'}`,
          href: ossFacetPath('language', f.slug),
          external: false,
          meta: null,
          color: f.color ?? null,
        },
        names: [f.name.toLowerCase(), f.slug],
        tags: [],
        description: '',
        prior: f.repos,
      })
    }

    for (const f of oss.facets.topic) {
      entries.push({
        hit: {
          kind: 'topic',
          label: f.name,
          sub: `${formatNumber(f.repos)} ${f.repos === 1 ? 'project' : 'projects'}`,
          href: ossFacetPath('topic', f.slug),
          external: false,
          meta: null,
        },
        names: [f.name.toLowerCase(), f.slug],
        tags: [f.slug],
        description: '',
        prior: f.repos,
      })
    }
  }

  if (apis) {
    for (const a of apis.apis) {
      const d = a.details
      const { href, external } = apiHref(a)
      const officialCount = officialSdks(a).length
      entries.push({
        hit: {
          kind: 'api',
          label: apiBaseName(a.name),
          sub: d?.provider.name || a.category.name,
          href,
          external,
          meta: officialCount ? `${formatNumber(officialCount)} official ${officialCount === 1 ? 'SDK' : 'SDKs'}` : null,
        },
        names: [a.name.toLowerCase(), a.slug],
        tags: [
          a.category.name.toLowerCase(), a.category.slug,
          ...(d?.tags.map(t => t.toLowerCase()) ?? []),
        ],
        description: (d?.summary || a.description || '').toLowerCase(),
        prior: officialCount + Number(a.enriched),
      })
    }

    for (const cat of apis.categories) {
      const stats = apis.categoryStats.get(cat.slug)
      entries.push({
        hit: {
          kind: 'category',
          label: cat.name,
          sub: stats ? `${formatNumber(stats.apis)} ${stats.apis === 1 ? 'API' : 'APIs'}` : null,
          href: apiCategoryPath(cat.slug),
          external: false,
          meta: null,
        },
        names: [cat.name.toLowerCase(), cat.slug],
        tags: [],
        description: '',
        prior: stats?.apis ?? 0,
      })
    }

    for (const row of apis.sdkRows) {
      entries.push({
        hit: {
          kind: 'sdk',
          label: row.sdk.package,
          sub: `${row.apiName} - ${row.sdk.language}`,
          href: row.href,
          external: false,
          meta: REGISTRY_LABELS[row.sdk.registry],
          mono: true,
        },
        names: [row.sdk.package.toLowerCase(), row.sdk.language.toLowerCase(), row.sdk.languageSlug],
        tags: [],
        description: '',
        prior: row.sdk.official ? 1 : 0,
      })
    }
  }

  return entries
}

/* Rebuilt only when the store version pair changes (module-level: cheap
   enough to rebuild once after a dev HMR reload too). */
let cacheKey = ''
let cacheEntries: Entry[] = []

function getIndex(oss: OssStore | null, apis: ApisStore | null): Entry[] {
  const key = `${oss?.version ?? 'x'}:${apis?.version ?? 'x'}`
  if (key !== cacheKey) {
    cacheEntries = buildIndex(oss, apis)
    cacheKey = key
  }
  return cacheEntries
}

/* ── Scoring ────────────────────────────────────────────────────────── */

function textScore(entry: Entry, q: string, qWords: readonly string[]): number {
  if (entry.names.includes(q)) return 100
  if (entry.names.some(n => n.startsWith(q))) return 60
  if (entry.names.some(n => words(n).some(w => qWords.some(qw => w.startsWith(qw))))) return 40
  if (entry.tags.includes(q)) return 30
  if (entry.names.some(n => n.includes(q))) return 20
  if (entry.description && entry.description.includes(q)) return 10
  return 0
}

const GROUP_OF: Readonly<Record<SearchKind, keyof SearchResponse['groups']>> = {
  api: 'apis',
  company: 'companies',
  repo: 'repos',
  sdk: 'sdks',
  category: 'other',
  language: 'other',
  topic: 'other',
}

const KIND_OF_TYPE: Readonly<Record<Exclude<SearchType, 'all'>, SearchKind>> = {
  api: 'api',
  company: 'company',
  repo: 'repo',
  sdk: 'sdk',
}

function emptyGroups(): SearchResponse['groups'] {
  return { apis: [], companies: [], repos: [], sdks: [], other: [] }
}

/** In-process search over both datasets (6.6), used directly by the search
 *  page and by /api/developers/search. Never throws: a dataset that failed
 *  to load simply contributes nothing. `total` is the true number of
 *  matches across the hub (never capped); each group array holds at most
 *  `limit` of its own matches, best first. */
export async function searchDevhub(rawQuery: string, opts: SearchDevhubOptions = {}): Promise<SearchResponse> {
  const started = Date.now()
  const q = normalizeSearchQuery(rawQuery)
  const limit = clampSearchLimit(opts.limit)

  if (!q) return { q: '', tookMs: Date.now() - started, total: 0, groups: emptyGroups() }

  const [oss, apis] = await Promise.all([tryGetOss(), tryGetApis()])
  const entries = getIndex(oss, apis)
  const qWords = words(q)
  const onlyKind = opts.type && opts.type !== 'all' ? KIND_OF_TYPE[opts.type] : null

  const scored: Array<{ hit: SearchHit; group: keyof SearchResponse['groups']; score: number }> = []
  for (const entry of entries) {
    if (onlyKind && entry.hit.kind !== onlyKind) continue
    const text = textScore(entry, q, qWords)
    if (text <= 0) continue
    scored.push({ hit: entry.hit, group: GROUP_OF[entry.hit.kind], score: text + Math.log10(entry.prior + 1) })
  }
  scored.sort((a, b) => b.score - a.score || a.hit.label.localeCompare(b.hit.label, 'en'))

  const groups = emptyGroups()
  let total = 0
  for (const { hit, group } of scored) {
    total++
    if (groups[group].length < limit) groups[group].push(hit)
  }

  return { q, tookMs: Date.now() - started, total, groups }
}
