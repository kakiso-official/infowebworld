/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - the open-source store (spec 6.2).

   buildOssStore() turns the four committed snapshots (oss/meta.json,
   companies.json, repos.json, issues.json) into every index, derived stat,
   facet and selector the open-source pages need. After the store is built
   every lookup is a synchronous Map read.

   PURE: no fs, no network, no clock. lib/developers/store.ts reads the
   files and memoises the result; lib/developers/refresh.ts rebuilds it
   with refreshed volatile fields. That keeps this module unit-testable
   against a fixture with plain `tsx`.

   Ordering conventions (stable, so pages and the sitemap agree):
     repos      stars desc, then nameWithOwner A-Z
     companies  tracked stars desc, then name A-Z
     issues     newest first
   ═══════════════════════════════════════════════════════════════════════ */

import { formatNumber, isWithinDays, parseIsoDate } from './format'
import { isCompanyIndexable, isFacetIndexable, facetExists, isGfiIndexable, isRepoIndexable, gfiLanguageExists } from './indexing'
import { absoluteUrl, languageSlug, topicSlug, type OssFacetKind } from './paths'
import { noDash } from './seo'
import { LANGUAGE_FALLBACK_COLOR, humanizeTopic, languageNameFromSlug } from './taxonomy'
import type {
  FacetValue, GhLanguage, IsoDateTime, OssCompany, OssCompanyStats, OssIssue, OssMeta, OssRepo, RepoRow,
} from './types'

/* ── Store shape ─────────────────────────────────────────────────────── */

export interface LanguageShare {
  name: string
  slug: string
  color: string | null
  /** Bytes. */
  size: number
  /** 0-100. */
  pct: number
}

export interface GfiLanguage {
  slug: string
  name: string
  color: string | null
  issues: number
  indexable: boolean
}

export interface OssTotals {
  companies: number
  orgs: number
  /** Tracked repositories (forks excluded, up to the per-org limit). */
  repos: number
  /** Sum of every org's public repository count on GitHub. */
  publicRepos: number
  archivedRepos: number
  stars: number
  forks: number
  /** Open good first issues counted on the tracked repos (repo field sum). */
  goodFirstIssues: number
  /** Good first issues listed on the issues pages (opened within the window). */
  issues: number
  /** Primary languages with at least one repo. */
  languages: number
  /** Distinct GitHub topics across tracked repos. */
  topics: number
  countries: number
  industries: number
  /** Companies with a verified InfoWebWorld listing link (their own
   *  profile or one of their products; see companyIwwLink). */
  listedOnIww: number
}

export interface OssStore {
  /** Bumped on every build, so derived caches (search) can key on it. */
  version: number
  meta: OssMeta
  /** Snapshot time of the committed data (meta.generatedAt). */
  snapshotAt: IsoDateTime
  /** Freshest data time: the runtime refresh time when one succeeded,
   *  else the snapshot. Date gates, data lines and lastmod use this. */
  dataAt: IsoDateTime
  /** Companies with at least one tracked repo, ranked (stars desc). */
  companies: readonly OssCompany[]
  /** Every tracked repo, stars desc. Same array as reposAll. */
  repos: readonly OssRepo[]
  issues: readonly OssIssue[]

  companyBySlug: ReadonlyMap<string, OssCompany>
  /** Lowercased GitHub org login -> company. */
  companyByOrgLogin: ReadonlyMap<string, OssCompany>
  statsBySlug: ReadonlyMap<string, OssCompanyStats>
  /** 1-based rank by tracked stars. */
  rankBySlug: ReadonlyMap<string, number>
  /** '{companySlug}/{repoSlug}' -> repo. */
  repoByKey: ReadonlyMap<string, OssRepo>
  /** Lowercased nameWithOwner -> repo. */
  repoByNameWithOwner: ReadonlyMap<string, OssRepo>
  reposByCompany: ReadonlyMap<string, readonly OssRepo[]>
  reposAll: readonly OssRepo[]
  /** Language slug -> repos with that primary language. */
  reposByLanguage: ReadonlyMap<string, readonly OssRepo[]>
  /** Topic slug -> repos with that topic. */
  reposByTopic: ReadonlyMap<string, readonly OssRepo[]>
  /** Country slug -> companies. */
  companiesByCountry: ReadonlyMap<string, readonly OssCompany[]>
  /** Industry slug -> companies. */
  companiesByIndustry: ReadonlyMap<string, readonly OssCompany[]>
  issuesByCompany: ReadonlyMap<string, readonly OssIssue[]>
  /** '{companySlug}/{repoSlug}' -> issues. */
  issuesByRepo: ReadonlyMap<string, readonly OssIssue[]>
  /** Language slug (of the issue's repo) -> issues. */
  issuesByLanguage: ReadonlyMap<string, readonly OssIssue[]>
  /** Languages with at least one listed issue, most issues first. */
  gfiLanguages: readonly GfiLanguage[]

  /** Facet values whose pages exist, biggest first, with `indexable` set. */
  facets: Readonly<Record<OssFacetKind, readonly FacetValue[]>>
  facetBySlug: Readonly<Record<OssFacetKind, ReadonlyMap<string, FacetValue>>>
  /** Whole dataset by code size (top 8 + Other), for the hub language bar. */
  languageShares: readonly LanguageShare[]
  totals: OssTotals
}

let buildCount = 0

/* ── Small pure helpers ──────────────────────────────────────────────── */

function byStars(a: OssRepo, b: OssRepo): number {
  return b.stars - a.stars || a.nameWithOwner.localeCompare(b.nameWithOwner, 'en')
}

function byNewest(a: OssIssue, b: OssIssue): number {
  return (parseIsoDate(b.createdAt)?.getTime() ?? 0) - (parseIsoDate(a.createdAt)?.getTime() ?? 0) ||
    a.url.localeCompare(b.url, 'en')
}

function push<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const list = map.get(key)
  if (list) list.push(value)
  else map.set(key, [value])
}

/** Key of a repo inside the section: '{companySlug}/{repoSlug}'. */
export function repoKey(companySlug: string, repoSlugValue: string): string {
  return `${companySlug}/${repoSlugValue}`
}

/** Language slug of a repo's primary language, or null when GitHub has none. */
export function repoLanguageSlug(repo: Pick<OssRepo, 'primaryLanguage'>): string | null {
  return repo.primaryLanguage ? languageSlug(repo.primaryLanguage.name) : null
}

/** Avatar of a company: its first (main) GitHub org's avatar. */
export function companyAvatar(company: OssCompany): string {
  return company.orgs[0]?.avatarUrl ?? ''
}

/** GitHub org URLs of a company, in stored order. */
export function companyOrgUrls(company: OssCompany): string[] {
  return company.orgs.map(o => o.url)
}

/** A company's verified InfoWebWorld listing (2.6): its own business
 *  profile, or one of its products (Hugging Face -> the "Gradio AI"
 *  listing). Every "Listed on InfoWebWorld" badge, card and filter reads
 *  this, so the wording is the same everywhere. */
export interface IwwListingLink {
  /** 'company' = /profile/{slug}; 'product' = /listing/{slug}. */
  kind: 'company' | 'product'
  /** Site-relative path ('/profile/stripe', '/listing/gradio-ai'). */
  path: string
  /** Name of the listing: the company, or the product ('Gradio AI'). */
  name: string
  /** 'Listed on InfoWebWorld' / 'Gradio AI is listed on InfoWebWorld'. */
  label: string
  /** Link text: 'View profile' / 'View listing'. */
  cta: string
}

/** The company's IWW listing link, or null when it has none (only when
 *  listedOnIww AND iwwPath). iwwMode comes from the data; older snapshots
 *  without it fall back to the path ('/listing/' = a product). */
export function companyIwwLink(
  company: Pick<OssCompany, 'name' | 'listedOnIww' | 'iwwPath' | 'iwwMode' | 'iwwName'>,
): IwwListingLink | null {
  const path = company.iwwPath?.trim()
  if (!company.listedOnIww || !path || !path.startsWith('/')) return null
  const kind = company.iwwMode ?? (path.startsWith('/listing/') ? 'product' : 'company')
  if (kind === 'product') {
    const name = noDash(company.iwwName?.trim() || company.name)
    return { kind, path, name, label: `${name} is listed on InfoWebWorld`, cta: 'View listing' }
  }
  return { kind, path, name: noDash(company.name), label: 'Listed on InfoWebWorld', cta: 'View profile' }
}

/** The company's own InfoWebWorld profile URL, absolute, for JSON-LD
 *  sameAs; null for a product listing (it describes a different entity). */
export function companyIwwProfileUrl(
  company: Pick<OssCompany, 'name' | 'listedOnIww' | 'iwwPath' | 'iwwMode' | 'iwwName'>,
): string | null {
  const link = companyIwwLink(company)
  return link && link.kind === 'company' ? absoluteUrl(link.path) : null
}

/** Code-size breakdown of a set of repos: up to `max` languages, then one
 *  'Other' share for the rest (and for anything under `minPct`). Shares are
 *  of the summed bytes; colours come from GitHub (null when it has none). */
export function languageBreakdown(
  repos: readonly Pick<OssRepo, 'languages'>[],
  opts: { max?: number; minPct?: number } = {},
): LanguageShare[] {
  const max = opts.max ?? 8
  const minPct = opts.minPct ?? 0
  const sizes = new Map<string, { name: string; color: string | null; size: number }>()
  let total = 0
  for (const repo of repos) {
    for (const lang of repo.languages) {
      if (!(lang.size > 0)) continue
      total += lang.size
      const slug = languageSlug(lang.name)
      const cur = sizes.get(slug)
      if (cur) cur.size += lang.size
      else sizes.set(slug, { name: lang.name, color: lang.color, size: lang.size })
    }
  }
  if (total <= 0) return []
  const sorted = [...sizes.entries()]
    .map(([slug, v]) => ({ slug, name: v.name, color: v.color, size: v.size, pct: (v.size / total) * 100 }))
    .sort((a, b) => b.size - a.size || a.name.localeCompare(b.name, 'en'))
  const shown: LanguageShare[] = []
  let otherSize = 0
  for (const item of sorted) {
    if (shown.length < max && item.pct >= minPct && item.slug !== 'other') shown.push(item)
    else otherSize += item.size
  }
  if (otherSize > 0) {
    shown.push({ name: 'Other', slug: 'other', color: null, size: otherSize, pct: (otherSize / total) * 100 })
  }
  return shown
}

/* Stats of one company from its repos (stars desc). */
function companyStats(company: OssCompany, repos: readonly OssRepo[]): OssCompanyStats {
  let stars = 0
  let forks = 0
  let gfi = 0
  let archived = 0
  let lastPushed: Date | null = null
  for (const r of repos) {
    stars += r.stars
    forks += r.forks
    gfi += r.goodFirstIssues
    if (r.isArchived) archived++
    const pushed = parseIsoDate(r.pushedAt)
    if (pushed && (!lastPushed || pushed > lastPushed)) lastPushed = pushed
  }
  const top = repos[0]
  return {
    trackedRepos: repos.length,
    publicRepos: company.orgs.reduce((n, o) => n + (o.publicRepos || 0), 0),
    archivedRepos: archived,
    stars,
    forks,
    goodFirstIssues: gfi,
    lastPushedAt: lastPushed ? lastPushed.toISOString().replace(/\.\d{3}Z$/, 'Z') : null,
    topLanguages: languageBreakdown(repos, { max: 5 })
      .filter(l => l.slug !== 'other')
      .map(l => ({ name: l.name, color: l.color, pct: l.pct })),
    topRepo: top ? { slug: top.slug, name: top.name, stars: top.stars } : null,
  }
}

/* ── Builder ─────────────────────────────────────────────────────────── */

/** Build the open-source store from the snapshot rows. Rows that point at
 *  an unknown company or repo are skipped (the validator reports them);
 *  companies with no tracked repo are left out (their page would 404). */
export function buildOssStore(
  meta: OssMeta,
  companiesIn: readonly OssCompany[],
  reposIn: readonly OssRepo[],
  issuesIn: readonly OssIssue[],
): OssStore {
  const snapshotAt = meta.generatedAt
  const dataAt = meta.refreshedAt ?? meta.generatedAt

  const knownCompanies = new Map<string, OssCompany>()
  for (const c of companiesIn) if (!knownCompanies.has(c.slug)) knownCompanies.set(c.slug, c)

  /* Repos by company, stars desc. */
  const reposAll = reposIn.filter(r => knownCompanies.has(r.companySlug)).slice().sort(byStars)
  const reposByCompany = new Map<string, OssRepo[]>()
  const repoByKey = new Map<string, OssRepo>()
  const repoByNameWithOwner = new Map<string, OssRepo>()
  for (const r of reposAll) {
    push(reposByCompany, r.companySlug, r)
    repoByKey.set(repoKey(r.companySlug, r.slug), r)
    repoByNameWithOwner.set(r.nameWithOwner.toLowerCase(), r)
  }

  /* Companies: only those with repos, ranked by tracked stars. */
  const statsBySlug = new Map<string, OssCompanyStats>()
  for (const [slug, c] of knownCompanies) {
    const repos = reposByCompany.get(slug)
    if (repos && repos.length) statsBySlug.set(slug, companyStats(c, repos))
  }
  const companies = [...knownCompanies.values()]
    .filter(c => statsBySlug.has(c.slug))
    .sort((a, b) => (statsBySlug.get(b.slug)!.stars - statsBySlug.get(a.slug)!.stars) || a.name.localeCompare(b.name, 'en'))
  const companyBySlug = new Map(companies.map(c => [c.slug, c]))
  const rankBySlug = new Map(companies.map((c, i) => [c.slug, i + 1]))
  const companyByOrgLogin = new Map<string, OssCompany>()
  for (const c of companies) for (const o of c.orgs) companyByOrgLogin.set(o.login.toLowerCase(), c)

  /* Language, topic, country, industry groupings. */
  const reposByLanguage = new Map<string, OssRepo[]>()
  const reposByTopic = new Map<string, OssRepo[]>()
  for (const r of reposAll) {
    const lang = repoLanguageSlug(r)
    if (lang) push(reposByLanguage, lang, r)
    const seen = new Set<string>()
    for (const t of r.topics) {
      const slug = topicSlug(t)
      if (!slug || seen.has(slug)) continue
      seen.add(slug)
      push(reposByTopic, slug, r)
    }
  }
  const companiesByCountry = new Map<string, OssCompany[]>()
  const companiesByIndustry = new Map<string, OssCompany[]>()
  for (const c of companies) {
    if (c.countrySlug) push(companiesByCountry, c.countrySlug, c)
    if (c.industrySlug) push(companiesByIndustry, c.industrySlug, c)
  }

  /* Issues: only those whose repo is tracked; newest first. */
  const issues = issuesIn
    .filter(i => repoByKey.has(repoKey(i.companySlug, i.repoSlug)))
    .slice()
    .sort(byNewest)
  const issuesByCompany = new Map<string, OssIssue[]>()
  const issuesByRepo = new Map<string, OssIssue[]>()
  const issuesByLanguage = new Map<string, OssIssue[]>()
  for (const i of issues) {
    push(issuesByCompany, i.companySlug, i)
    const key = repoKey(i.companySlug, i.repoSlug)
    push(issuesByRepo, key, i)
    const repo = repoByKey.get(key)
    const lang = repo ? repoLanguageSlug(repo) : null
    if (lang) push(issuesByLanguage, lang, i)
  }
  const gfiLanguages: GfiLanguage[] = [...issuesByLanguage.entries()]
    .filter(([, list]) => gfiLanguageExists(list.length))
    .map(([slug, list]) => {
      const repo = repoByKey.get(repoKey(list[0].companySlug, list[0].repoSlug))
      return {
        slug,
        name: repo?.primaryLanguage?.name ?? languageNameFromSlug(slug) ?? slug,
        color: repo?.primaryLanguage?.color ?? null,
        issues: list.length,
        indexable: isGfiIndexable(list.length, true),
      }
    })
    .sort((a, b) => b.issues - a.issues || a.name.localeCompare(b.name, 'en'))

  /* Facets. */
  const repoFacet = (kind: 'language' | 'topic', slug: string, list: readonly OssRepo[]): FacetValue => {
    const companySet = new Set(list.map(r => r.companySlug))
    const first = list[0]
    const value: FacetValue = {
      kind,
      slug,
      name: kind === 'language'
        ? first.primaryLanguage?.name ?? languageNameFromSlug(slug) ?? slug
        : humanizeTopic(slug),
      repos: list.length,
      companies: companySet.size,
      stars: list.reduce((n, r) => n + r.stars, 0),
      goodFirstIssues: list.reduce((n, r) => n + r.goodFirstIssues, 0),
      indexable: false,
    }
    if (kind === 'language') value.color = first.primaryLanguage?.color ?? null
    value.indexable = isFacetIndexable(kind, value)
    return value
  }
  const companyFacet = (kind: 'country' | 'industry', slug: string, list: readonly OssCompany[]): FacetValue => {
    let repos = 0
    let stars = 0
    let gfi = 0
    for (const c of list) {
      const s = statsBySlug.get(c.slug)!
      repos += s.trackedRepos
      stars += s.stars
      gfi += s.goodFirstIssues
    }
    const first = list[0]
    const value: FacetValue = {
      kind,
      slug,
      name: kind === 'country' ? first.countryName ?? slug : first.industry,
      repos,
      companies: list.length,
      stars,
      goodFirstIssues: gfi,
      indexable: false,
    }
    if (kind === 'country' && first.hqCountry) value.iso2 = first.hqCountry
    value.indexable = isFacetIndexable(kind, value)
    return value
  }
  const byRepos = (a: FacetValue, b: FacetValue) =>
    b.repos - a.repos || b.stars - a.stars || a.name.localeCompare(b.name, 'en')
  const byCompanies = (a: FacetValue, b: FacetValue) =>
    b.companies - a.companies || b.stars - a.stars || a.name.localeCompare(b.name, 'en')

  const facets: Record<OssFacetKind, FacetValue[]> = {
    language: [...reposByLanguage.entries()].map(([s, l]) => repoFacet('language', s, l)).filter(f => facetExists('language', f)).sort(byRepos),
    topic: [...reposByTopic.entries()].map(([s, l]) => repoFacet('topic', s, l)).filter(f => facetExists('topic', f)).sort(byRepos),
    country: [...companiesByCountry.entries()].map(([s, l]) => companyFacet('country', s, l)).filter(f => facetExists('country', f)).sort(byCompanies),
    industry: [...companiesByIndustry.entries()].map(([s, l]) => companyFacet('industry', s, l)).filter(f => facetExists('industry', f)).sort(byCompanies),
  }
  const facetBySlug = {
    language: new Map(facets.language.map(f => [f.slug, f])),
    topic: new Map(facets.topic.map(f => [f.slug, f])),
    country: new Map(facets.country.map(f => [f.slug, f])),
    industry: new Map(facets.industry.map(f => [f.slug, f])),
  }

  let stars = 0
  let forks = 0
  let gfi = 0
  let archived = 0
  for (const r of reposAll) {
    stars += r.stars
    forks += r.forks
    gfi += r.goodFirstIssues
    if (r.isArchived) archived++
  }

  const totals: OssTotals = {
    companies: companies.length,
    orgs: companies.reduce((n, c) => n + c.orgs.length, 0),
    repos: reposAll.length,
    publicRepos: companies.reduce((n, c) => n + statsBySlug.get(c.slug)!.publicRepos, 0),
    archivedRepos: archived,
    stars,
    forks,
    goodFirstIssues: gfi,
    issues: issues.length,
    languages: reposByLanguage.size,
    topics: reposByTopic.size,
    countries: companiesByCountry.size,
    industries: companiesByIndustry.size,
    listedOnIww: companies.filter(c => companyIwwLink(c) !== null).length,
  }

  buildCount++
  return Object.freeze({
    version: buildCount,
    meta,
    snapshotAt,
    dataAt,
    companies,
    repos: reposAll,
    issues,
    companyBySlug,
    companyByOrgLogin,
    statsBySlug,
    rankBySlug,
    repoByKey,
    repoByNameWithOwner,
    reposByCompany,
    reposAll,
    reposByLanguage,
    reposByTopic,
    companiesByCountry,
    companiesByIndustry,
    issuesByCompany,
    issuesByRepo,
    issuesByLanguage,
    gfiLanguages,
    facets,
    facetBySlug,
    languageShares: languageBreakdown(reposAll, { max: 8 }),
    totals,
  })
}

/* ── Gates bound to the store's data date ────────────────────────────── */

/** Company page gate (3.6) for a company slug; false when unknown. */
export function isCompanyPageIndexable(store: OssStore, companySlug: string): boolean {
  const repos = store.reposByCompany.get(companySlug)
  return !!repos && repos.length > 0 && isCompanyIndexable(repos)
}

/** Repo page gate (3.7), measured against the store's data date. */
export function isRepoPageIndexable(store: OssStore, repo: OssRepo): boolean {
  return isRepoIndexable(repo, store.dataAt)
}

/** True when a topic slug has its own page (chips link only then). */
export function topicHasPage(store: OssStore, topic: string): boolean {
  return store.facetBySlug.topic.has(topicSlug(topic))
}

/* ── Selectors ───────────────────────────────────────────────────────── */

/** The client-island row payload for a repo. */
export function toRepoRow(store: OssStore, repo: OssRepo): RepoRow {
  const company = store.companyBySlug.get(repo.companySlug)
  return {
    id: repo.id,
    slug: repo.slug,
    companySlug: repo.companySlug,
    nameWithOwner: repo.nameWithOwner,
    description: repo.description,
    stars: repo.stars,
    forks: repo.forks,
    primaryLanguage: repo.primaryLanguage,
    topics: repo.topics,
    license: repo.license,
    pushedAt: repo.pushedAt,
    isArchived: repo.isArchived,
    goodFirstIssues: repo.goodFirstIssues,
    companyName: company?.name ?? repo.owner,
    avatarUrl: company?.orgs.find(o => o.login.toLowerCase() === repo.owner.toLowerCase())?.avatarUrl ??
      (company ? companyAvatar(company) : ''),
  }
}

/** The first `limit` repos of a stars-ranked list with at most
 *  `maxPerCompany` from any one company (archived repos skipped), so a
 *  showcase is not one company's whole catalogue. */
export function diverseRepos(repos: readonly OssRepo[], limit: number, maxPerCompany = 1): OssRepo[] {
  const out: OssRepo[] = []
  const perCompany = new Map<string, number>()
  for (const r of repos) {
    if (out.length >= limit) break
    if (r.isArchived) continue
    const n = perCompany.get(r.companySlug) ?? 0
    if (n >= maxPerCompany) continue
    perCompany.set(r.companySlug, n + 1)
    out.push(r)
  }
  return out
}

/** One page of a list (1-based page). */
export function pageSlice<T>(items: readonly T[], page: number, perPage: number): T[] {
  const p = Math.max(1, Math.floor(page))
  return items.slice((p - 1) * perPage, p * perPage)
}

/** The company's other repos (live ones first, then stars). */
export function moreFromCompany(store: OssStore, repo: OssRepo, limit = 6): OssRepo[] {
  return (store.reposByCompany.get(repo.companySlug) ?? [])
    .filter(r => r.id !== repo.id)
    .slice()
    .sort((a, b) => Number(a.isArchived) - Number(b.isArchived) || byStars(a, b))
    .slice(0, limit)
}

/** Jaccard similarity of two topic lists (0 when either is empty). */
export function topicJaccard(a: readonly string[], b: readonly string[]): number {
  if (!a.length || !b.length) return 0
  const sa = new Set(a.map(topicSlug))
  const sb = new Set(b.map(topicSlug))
  let inter = 0
  for (const t of sa) if (sb.has(t)) inter++
  const union = sa.size + sb.size - inter
  return union ? inter / union : 0
}

/** Similar projects from OTHER companies (3.7): shared topics (Jaccard)
 *  first, then the same primary language, then stars. Archived repos and
 *  repos with nothing in common are left out; at most two per company. */
export function similarRepos(store: OssStore, repo: OssRepo, limit = 6): OssRepo[] {
  const lang = repoLanguageSlug(repo)
  const candidates = new Set<OssRepo>()
  for (const t of repo.topics) for (const r of store.reposByTopic.get(topicSlug(t)) ?? []) candidates.add(r)
  if (lang) for (const r of store.reposByLanguage.get(lang) ?? []) candidates.add(r)

  const scored: Array<{ repo: OssRepo; jac: number; same: number }> = []
  for (const r of candidates) {
    if (r.companySlug === repo.companySlug || r.isArchived) continue
    const jac = topicJaccard(repo.topics, r.topics)
    const same = lang !== null && repoLanguageSlug(r) === lang ? 1 : 0
    if (jac === 0 && same === 0) continue
    scored.push({ repo: r, jac, same })
  }
  scored.sort((a, b) => b.jac - a.jac || b.same - a.same || byStars(a.repo, b.repo))

  const out: OssRepo[] = []
  const perCompany = new Map<string, number>()
  for (const s of scored) {
    if (out.length >= limit) break
    const n = perCompany.get(s.repo.companySlug) ?? 0
    if (n >= 2) continue
    perCompany.set(s.repo.companySlug, n + 1)
    out.push(s.repo)
  }
  return out
}

/** Similar companies (3.6): same industry first, then same country, then
 *  tracked stars. Companies sharing neither are left out. */
export function similarCompanies(store: OssStore, company: OssCompany, limit = 6): OssCompany[] {
  return store.companies
    .filter(c => c.slug !== company.slug)
    .map(c => ({
      c,
      industry: c.industrySlug === company.industrySlug ? 1 : 0,
      country: company.countrySlug !== null && c.countrySlug === company.countrySlug ? 1 : 0,
    }))
    .filter(x => x.industry || x.country)
    .sort((a, b) => b.industry - a.industry || b.country - a.country ||
      (store.statsBySlug.get(b.c.slug)!.stars - store.statsBySlug.get(a.c.slug)!.stars) ||
      a.c.name.localeCompare(b.c.name, 'en'))
    .slice(0, limit)
    .map(x => x.c)
}

/** Repos with a release published within `days` of the data date, newest
 *  release first (archived repos skipped). */
export function recentlyReleased(store: OssStore, limit = 9, days = 30): OssRepo[] {
  return store.reposAll
    .filter(r => !r.isArchived && r.latestRelease && isWithinDays(r.latestRelease.publishedAt, store.dataAt, days))
    .slice()
    .sort((a, b) => (parseIsoDate(b.latestRelease!.publishedAt)?.getTime() ?? 0) -
      (parseIsoDate(a.latestRelease!.publishedAt)?.getTime() ?? 0) || byStars(a, b))
    .slice(0, limit)
}

/** The newest listed good first issues, at most `maxPerCompany` from any
 *  one company (a teaser should not be one busy repo's backlog). */
export function newestIssues(store: OssStore, limit = 6, maxPerCompany = Infinity): OssIssue[] {
  const out: OssIssue[] = []
  const perCompany = new Map<string, number>()
  for (const issue of store.issues) {
    if (out.length >= limit) break
    const n = perCompany.get(issue.companySlug) ?? 0
    if (n >= maxPerCompany) continue
    perCompany.set(issue.companySlug, n + 1)
    out.push(issue)
  }
  return out
}

/** Counts behind the good-first-issues header (all, or one language). */
export function issueStats(issues: readonly OssIssue[], store: OssStore): {
  issues: number; repos: number; companies: number; languages: number
} {
  const repos = new Set<string>()
  const companies = new Set<string>()
  const languages = new Set<string>()
  for (const i of issues) {
    const key = repoKey(i.companySlug, i.repoSlug)
    repos.add(key)
    companies.add(i.companySlug)
    const repo = store.repoByKey.get(key)
    const lang = repo ? repoLanguageSlug(repo) : null
    if (lang) languages.add(lang)
  }
  return { issues: issues.length, repos: repos.size, companies: companies.size, languages: languages.size }
}

/** Companies with the most listed good first issues. */
export function companiesByIssueCount(store: OssStore, issues: readonly OssIssue[] = store.issues, limit = 12):
  Array<{ company: OssCompany; issues: number }> {
  const counts = new Map<string, number>()
  for (const i of issues) counts.set(i.companySlug, (counts.get(i.companySlug) ?? 0) + 1)
  return [...counts.entries()]
    .map(([slug, n]) => ({ company: store.companyBySlug.get(slug)!, issues: n }))
    .filter(x => x.company)
    .sort((a, b) => b.issues - a.issues || a.company.name.localeCompare(b.company.name, 'en'))
    .slice(0, limit)
}

/** Repos behind a facet page, stars desc: the facet's own repos for a
 *  language or topic, every repo of its companies for a country or
 *  industry. Empty for an unknown slug. */
export function facetRepos(store: OssStore, kind: OssFacetKind, slug: string): readonly OssRepo[] {
  if (kind === 'language') return store.reposByLanguage.get(slug) ?? []
  if (kind === 'topic') return store.reposByTopic.get(slug) ?? []
  const companies = (kind === 'country' ? store.companiesByCountry : store.companiesByIndustry).get(slug) ?? []
  return companies.flatMap(c => store.reposByCompany.get(c.slug) ?? []).sort(byStars)
}

/** Companies behind a facet page, ranked by tracked stars. For a language
 *  or topic: the companies that publish its repos. */
export function facetCompanies(store: OssStore, kind: OssFacetKind, slug: string): readonly OssCompany[] {
  if (kind === 'country') return store.companiesByCountry.get(slug) ?? []
  if (kind === 'industry') return store.companiesByIndustry.get(slug) ?? []
  const slugs = new Set(facetRepos(store, kind, slug).map(r => r.companySlug))
  return store.companies.filter(c => slugs.has(c.slug))
}

export interface RelatedFacet {
  kind: OssFacetKind
  facet: FacetValue
  /** How many of the page's repos (language/topic) or companies
   *  (country/industry) fall in this related value. */
  count: number
}

/** Related facet chips (3.11): topics inside a language, languages inside
 *  a topic, industries inside a country, countries inside an industry.
 *  Only values that have their own page. */
export function relatedFacets(store: OssStore, kind: OssFacetKind, slug: string, limit = 12): RelatedFacet[] {
  const counts = new Map<string, number>()
  let relKind: OssFacetKind
  if (kind === 'language' || kind === 'topic') {
    relKind = kind === 'language' ? 'topic' : 'language'
    for (const r of facetRepos(store, kind, slug)) {
      if (relKind === 'topic') {
        for (const t of new Set(r.topics.map(topicSlug))) counts.set(t, (counts.get(t) ?? 0) + 1)
      } else {
        const l = repoLanguageSlug(r)
        if (l) counts.set(l, (counts.get(l) ?? 0) + 1)
      }
    }
  } else {
    relKind = kind === 'country' ? 'industry' : 'country'
    for (const c of facetCompanies(store, kind, slug)) {
      const key = relKind === 'industry' ? c.industrySlug : c.countrySlug
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  if (relKind === kind) counts.delete(slug)
  const lookup = store.facetBySlug[relKind]
  return [...counts.entries()]
    .map(([s, count]) => ({ kind: relKind, facet: lookup.get(s), count }))
    .filter((x): x is RelatedFacet => !!x.facet)
    .sort((a, b) => b.count - a.count || b.facet.stars - a.facet.stars || a.facet.name.localeCompare(b.facet.name, 'en'))
    .slice(0, limit)
}

/** Facet chip label with its count, e.g. 'TypeScript (42)'. */
export function facetChipLabel(facet: Pick<FacetValue, 'name'>, count: number): string {
  return `${facet.name} (${formatNumber(count)})`
}

/** Dot colour of a language: GitHub's colour, else the neutral fallback. */
export function languageColor(lang: GhLanguage | null | undefined): string {
  return lang?.color || LANGUAGE_FALLBACK_COLOR
}
