/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - JSON-LD (spec 3.0 and each page spec).

   Every page emits ONE <script type="application/ld+json"> whose @graph is:
     Organization, Brand, WebSite (shared @ids from seo-schema.ts),
     BreadcrumbList (url#breadcrumb),
     WebPage | CollectionPage | AboutPage | SearchResultsPage (url#webpage,
       name = the H1),
     ...page nodes (ItemList, FAQPage, SoftwareSourceCode, WebAPI, Dataset,
       HowTo).

   The same DevCrumb[] trail feeds the visible breadcrumbs and the
   BreadcrumbList, so they never drift. Nodes describe only verified,
   non-null facts: no ratings (stars are not ratings), no Offer unless a
   documented, card-free free tier has a source.

   Composes app/components/seo-schema.ts (never edits it). Pure.
   ═══════════════════════════════════════════════════════════════════════ */

import {
  ID_ORG, ID_WEBSITE, brandNode, breadcrumbNode, faqNode, howToNode, itemListNode, organizationNode, websiteNode,
} from '../../app/components/seo-schema'
import { isoDate } from './format'
import { companyIwwProfileUrl } from './oss'
import {
  absoluteUrl, apiCategoryPath, apiCollectionPath, apiPath, devHubPath, devSearchPath, freeApisPath,
  gfiPath, methodologyPath, ossCompaniesPath, ossCompanyPath, ossFacetIndexPath, ossFacetPath, ossHubPath, ossRepoPath,
  ossReposPath, sdkPath, type ApiCollectionSlug, type OssFacetKind,
} from './paths'
import { noDash } from './seo'
import type { DevFaq } from './copy/faqs'
import type { FreeApi, IsoDateTime, OssCompany, OssRepo } from './types'

/* ── Breadcrumb trails (2.4) ─────────────────────────────────────────── */

/** One breadcrumb: a display name and a site-relative path. */
export interface DevCrumb {
  name: string
  path: string
}

const HOME: DevCrumb = { name: 'Home', path: '/' }
const DEV: DevCrumb = { name: 'Developers', path: devHubPath() }
const OSS: DevCrumb = { name: 'Open Source', path: ossHubPath() }
const APIS: DevCrumb = { name: 'Free APIs', path: freeApisPath() }

const FACET_INDEX_NAMES: Readonly<Record<OssFacetKind, string>> = {
  language: 'Languages',
  topic: 'Topics',
  country: 'Countries',
  industry: 'Industries',
}

const COLLECTION_NAMES: Readonly<Record<ApiCollectionSlug, string>> = {
  'no-auth': 'No API Key',
  'cors-enabled': 'CORS Enabled',
  'ai-llm': 'AI and LLM',
}

/** Breadcrumb trails for every page type. The last crumb is the page. */
export const devCrumbs = {
  hub: (): DevCrumb[] => [HOME, DEV],
  methodology: (): DevCrumb[] => [HOME, DEV, { name: 'How We Check Data', path: methodologyPath() }],
  search: (): DevCrumb[] => [HOME, DEV, { name: 'Search', path: devSearchPath() }],
  ossHub: (): DevCrumb[] => [HOME, DEV, OSS],
  reposRanking: (): DevCrumb[] => [HOME, DEV, OSS, { name: 'Top Repositories', path: ossReposPath() }],
  companies: (): DevCrumb[] => [HOME, DEV, OSS, { name: 'Companies', path: ossCompaniesPath() }],
  facetIndex: (kind: OssFacetKind): DevCrumb[] => [HOME, DEV, OSS, { name: FACET_INDEX_NAMES[kind], path: ossFacetIndexPath(kind) }],
  facet: (kind: OssFacetKind, slug: string, name: string): DevCrumb[] => [
    ...devCrumbs.facetIndex(kind),
    { name: noDash(name), path: ossFacetPath(kind, slug) },
  ],
  gfi: (language?: { slug: string; name: string } | null): DevCrumb[] => [
    HOME, DEV, OSS, { name: 'Good First Issues', path: gfiPath() },
    ...(language ? [{ name: noDash(language.name), path: gfiPath(language.slug) }] : []),
  ],
  company: (company: Pick<OssCompany, 'slug' | 'name'>): DevCrumb[] => [
    HOME, DEV, OSS, { name: noDash(company.name), path: ossCompanyPath(company.slug) },
  ],
  repo: (company: Pick<OssCompany, 'slug' | 'name'>, repo: Pick<OssRepo, 'slug' | 'name'>): DevCrumb[] => [
    ...devCrumbs.company(company),
    { name: noDash(repo.name), path: ossRepoPath(company.slug, repo.slug) },
  ],
  freeApis: (): DevCrumb[] => [HOME, DEV, APIS],
  collection: (slug: ApiCollectionSlug): DevCrumb[] => [HOME, DEV, APIS, { name: COLLECTION_NAMES[slug], path: apiCollectionPath(slug) }],
  sdks: (language?: { slug: string; name: string } | null): DevCrumb[] => [
    HOME, DEV, APIS, { name: 'SDKs', path: sdkPath() },
    ...(language ? [{ name: noDash(language.name), path: sdkPath(language.slug) }] : []),
  ],
  category: (category: { slug: string; name: string }): DevCrumb[] => [
    HOME, DEV, APIS, { name: noDash(category.name), path: apiCategoryPath(category.slug) },
  ],
  api: (api: Pick<FreeApi, 'slug' | 'name' | 'category'>): DevCrumb[] => [
    ...devCrumbs.category(api.category),
    { name: noDash(api.name), path: apiPath(api.category.slug, api.slug) },
  ],
}

/* ── Ids ─────────────────────────────────────────────────────────────── */

/** Absolute URL and fragment @ids of a page. */
export function pageIds(path: string) {
  const url = absoluteUrl(path)
  return {
    url,
    webpage: `${url}#webpage`,
    breadcrumb: `${url}#breadcrumb`,
    faq: `${url}#faq`,
    list: `${url}#list`,
    org: `${url}#org`,
    code: `${url}#code`,
    api: `${url}#api`,
    dataset: `${url}#dataset`,
    howto: `${url}#howto`,
  }
}

/* ── Page graph ──────────────────────────────────────────────────────── */

export type DevPageType = 'WebPage' | 'CollectionPage' | 'AboutPage' | 'SearchResultsPage'

type Node = Record<string, unknown>

/** The page node (url#webpage) of spec 3.0: name = the H1, part of the
 *  site's WebSite, linked to the breadcrumb, dated by the data snapshot. */
export function webPageNode(opts: {
  path: string
  /** The H1. */
  name: string
  type?: DevPageType
  description?: string | null
  dateModified?: IsoDateTime | null
  about?: Node | Node[] | null
  /** @id of the node the page is mainly about (a repo, an API). */
  mainEntityId?: string | null
}): Node {
  const ids = pageIds(opts.path)
  const modified = isoDate(opts.dateModified ?? null)
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': ids.webpage,
    url: ids.url,
    name: noDash(opts.name),
    ...(opts.description ? { description: noDash(opts.description) } : {}),
    isPartOf: { '@id': ID_WEBSITE },
    breadcrumb: { '@id': ids.breadcrumb },
    publisher: { '@id': ID_ORG },
    inLanguage: 'en-US',
    ...(modified ? { dateModified: modified } : {}),
    ...(opts.about ? { about: opts.about } : {}),
    ...(opts.mainEntityId ? { mainEntity: { '@id': opts.mainEntityId } } : {}),
  }
}

/** CollectionPage node: hubs, indexes, facet, category and collection pages. */
export function collectionPageNode(opts: Omit<Parameters<typeof webPageNode>[0], 'type'>): Node {
  return webPageNode({ ...opts, type: 'CollectionPage' })
}

/** BreadcrumbList (url#breadcrumb) from the same trail as the visible crumbs. */
export function devBreadcrumbNode(path: string, crumbs: readonly DevCrumb[]): Node {
  return breadcrumbNode(crumbs.map(c => ({ name: noDash(c.name), url: absoluteUrl(c.path) })), pageIds(path).breadcrumb)
}

/** The page's @graph (3.0): shared site nodes, the breadcrumb, the page
 *  node (name = the H1) and the page's own nodes (null entries skipped). */
export function devPageGraph(opts: Parameters<typeof webPageNode>[0] & {
  crumbs: readonly DevCrumb[]
  nodes?: ReadonlyArray<Node | null | undefined | false>
}): { '@context': 'https://schema.org'; '@graph': Node[] } {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode,
      brandNode,
      websiteNode,
      devBreadcrumbNode(opts.path, opts.crumbs),
      webPageNode(opts),
      ...((opts.nodes ?? []).filter(Boolean) as Node[]),
    ],
  }
}

/* '<' written as its JSON escape, so a data string can never close the
   script tag. Built from char codes: this file stores no escape text. */
const LT_JSON = `${String.fromCharCode(92)}u003c`

/** JSON-LD text safe to put inside <script type="application/ld+json">. */
export function serializeJsonLd(graph: unknown): string {
  return JSON.stringify(graph).replace(/</g, LT_JSON)
}

/* ── Node builders ───────────────────────────────────────────────────── */

/** A schema.org Thing by name ('Open-source software'). */
export function thing(name: string, type = 'Thing'): Node {
  return { '@type': type, name: noDash(name) }
}

/** FAQPage for the page's FAQ block, or null when there are no questions. */
export function faqGraphNode(path: string, faqs: readonly Pick<DevFaq, 'q' | 'a'>[]): Node | null {
  if (!faqs.length) return null
  const ids = pageIds(path)
  return faqNode(faqs.map(f => ({ q: noDash(f.q), a: noDash(f.a) })), ids.faq, ids.webpage)
}

/** ItemList (url#list). Entries are a name + url (seo-schema itemListNode,
 *  urls made absolute) or, for rich lists, a full `item` node
 *  (SoftwareSourceCode, Organization, WebAPI). */
export function listNode(
  path: string,
  name: string,
  items: ReadonlyArray<{ name: string; url?: string | null; item?: Node | null }>,
  idSuffix = 'list',
): Node {
  const id = `${absoluteUrl(path)}#${idSuffix}`
  if (!items.some(it => it.item)) {
    return itemListNode(
      items.map(it => ({ name: noDash(it.name), ...(it.url ? { url: absoluteUrl(it.url) } : {}) })),
      id,
      noDash(name),
    )
  }
  return {
    '@type': 'ItemList',
    '@id': id,
    name: noDash(name),
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      ...(it.item
        ? { item: it.item }
        : { name: noDash(it.name), ...(it.url ? { url: absoluteUrl(it.url) } : {}) }),
    })),
  }
}

/** SPDX license URL for a real SPDX id ('MIT' ->
 *  'https://spdx.org/licenses/MIT.html'); null for missing or placeholder ids. */
export function spdxLicenseUrl(id: string | null | undefined): string | null {
  if (!id || /^(noassertion|other|none)$/i.test(id) || !/^[A-Za-z0-9][A-Za-z0-9.+-]*$/.test(id)) return null
  return `https://spdx.org/licenses/${id}.html`
}

/* Absolute URLs, deduped, nulls dropped. */
function urls(list: ReadonlyArray<string | null | undefined>): string[] {
  return [...new Set(list.filter((u): u is string => !!u).map(u => absoluteUrl(u)))]
}

/** Organization node for an OSS company (3.6): @id {company page}#org,
 *  website, GitHub avatar as logo, sameAs (GitHub orgs, website, our
 *  profile when listed), HQ country when known. */
export function orgNode(company: OssCompany): Node {
  const ids = pageIds(ossCompanyPath(company.slug))
  const avatar = company.orgs[0]?.avatarUrl
  const sameAs = urls([
    ...company.orgs.map(o => o.url),
    company.website,
    companyIwwProfileUrl(company),
  ])
  return {
    '@type': 'Organization',
    '@id': ids.org,
    name: noDash(company.name),
    url: company.website ?? company.orgs[0]?.url ?? ids.url,
    ...(avatar ? { logo: avatar } : {}),
    ...(company.oneLiner ? { description: noDash(company.oneLiner) } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(company.hqCountry ? { address: { '@type': 'PostalAddress', addressCountry: company.hqCountry } } : {}),
  }
}

/* A company as an inline Organization (when its own node is not in the graph). */
function inlineOrg(company: OssCompany): Node {
  const sameAs = urls([company.orgs[0]?.url, companyIwwProfileUrl(company)])
  return {
    '@type': 'Organization',
    name: noDash(company.name),
    url: company.website ?? company.orgs[0]?.url ?? absoluteUrl(ossCompanyPath(company.slug)),
    ...(sameAs.length ? { sameAs } : {}),
  }
}

/** SoftwareSourceCode for a repo.
 *  - 'item' (lists): name, our page, GitHub repo, language, license, author
 *    (the company's #org @id when `authorId` is given, else inline).
 *  - 'page' (the repo page, 3.7): everything verified, with author and
 *    maintainer, part of the company page. */
export function softwareSourceCodeNode(
  repo: OssRepo,
  company: OssCompany,
  opts: { variant?: 'item' | 'page'; authorId?: string | null } = {},
): Node {
  const page = pageIds(ossRepoPath(repo.companySlug, repo.slug))
  const license = spdxLicenseUrl(repo.license)
  const author = opts.authorId ? { '@id': opts.authorId } : inlineOrg(company)
  const base: Node = {
    '@type': 'SoftwareSourceCode',
    name: noDash(repo.name),
    url: page.url,
    codeRepository: repo.url,
    ...(repo.primaryLanguage ? { programmingLanguage: repo.primaryLanguage.name } : {}),
    ...(license ? { license } : {}),
  }
  if (opts.variant !== 'page') return { ...base, author }
  return {
    ...base,
    '@id': page.code,
    ...(repo.description ? { description: noDash(repo.description) } : {}),
    ...(repo.createdAt ? { dateCreated: isoDate(repo.createdAt) } : {}),
    ...(repo.pushedAt ? { dateModified: isoDate(repo.pushedAt) } : {}),
    ...(repo.latestRelease ? { version: repo.latestRelease.tag } : {}),
    ...(repo.topics.length ? { keywords: repo.topics.join(', ') } : {}),
    author,
    maintainer: author,
    isPartOf: { '@id': pageIds(ossCompanyPath(company.slug)).webpage },
  }
}

/** WebAPI node for a reviewed API (3.15). The Offer is added only for a
 *  documented free tier that needs no card and has a source. Official SDKs
 *  are hasPart SoftwareSourceCode. Null for an unreviewed API. */
export function webApiNode(api: FreeApi, opts: { providerSameAs?: ReadonlyArray<string | null | undefined> } = {}): Node | null {
  const d = api.details
  if (!d) return null
  const ids = pageIds(apiPath(api.category.slug, api.slug))
  const githubOrgUrl = d.provider.githubOrg ? `https://github.com/${d.provider.githubOrg}` : null
  /* Only a business profile describes the provider itself; a product
     listing (/listing/x) is a different entity, so it is never sameAs. */
  const providerProfile = d.provider.iwwPath?.startsWith('/profile/') ? d.provider.iwwPath : null
  const providerSameAs = urls([githubOrgUrl, providerProfile, ...(opts.providerSameAs ?? [])])
  const ft = d.freeTier
  const official = d.sdks.filter(s => s.official)
  return {
    '@type': 'WebAPI',
    '@id': ids.api,
    name: noDash(api.name),
    description: noDash(d.summary || api.description),
    url: ids.url,
    ...(d.docsUrl ? { documentation: d.docsUrl } : {}),
    provider: {
      '@type': 'Organization',
      name: noDash(d.provider.name),
      ...(d.provider.website ? { url: d.provider.website } : {}),
      ...(providerSameAs.length ? { sameAs: providerSameAs } : {}),
    },
    ...(ft.available === true && ft.requiresCard === false && ft.sourceUrl
      ? {
          offers: {
            '@type': 'Offer',
            price: 0,
            priceCurrency: 'USD',
            ...(ft.summary ? { description: noDash(ft.summary) } : {}),
            url: ft.sourceUrl,
          },
        }
      : {}),
    ...(official.length
      ? {
          hasPart: official.map(s => ({
            '@type': 'SoftwareSourceCode',
            name: s.package,
            programmingLanguage: s.language,
            ...(s.repoUrl ? { codeRepository: s.repoUrl } : {}),
            ...(s.version ? { version: s.version } : {}),
          })),
        }
      : {}),
  }
}

/** Dataset node for a section hub (Google Dataset Search). */
export function datasetNode(opts: {
  path: string
  name: string
  description: string
  dateModified: IsoDateTime
  isBasedOn: string
  variableMeasured: readonly string[]
  citation?: string
  license?: string
}): Node {
  const ids = pageIds(opts.path)
  return {
    '@type': 'Dataset',
    '@id': ids.dataset,
    name: noDash(opts.name),
    description: noDash(opts.description),
    url: ids.url,
    creator: { '@id': ID_ORG },
    publisher: { '@id': ID_ORG },
    dateModified: isoDate(opts.dateModified),
    isBasedOn: opts.isBasedOn,
    variableMeasured: [...opts.variableMeasured],
    isAccessibleForFree: true,
    inLanguage: 'en-US',
    ...(opts.citation ? { citation: opts.citation } : {}),
    ...(opts.license ? { license: opts.license } : {}),
  }
}

/** The open-source hub's Dataset (3.5). */
export function ossDatasetNode(dataAt: IsoDateTime): Node {
  return datasetNode({
    path: ossHubPath(),
    name: 'Open source projects by companies',
    description: 'Public, non-fork GitHub repositories published by real companies, with stars, forks, open issues, good first issues, primary language and license, collected from the GitHub GraphQL API.',
    dateModified: dataAt,
    isBasedOn: 'https://docs.github.com/en/graphql',
    variableMeasured: ['stars', 'forks', 'open issues', 'good first issues', 'primary language', 'license'],
  })
}

/** The free-APIs hub's Dataset (3.13), with the public-apis MIT citation. */
export function apisDatasetNode(dataAt: IsoDateTime): Node {
  return datasetNode({
    path: freeApisPath(),
    name: 'InfoWebWorld Free APIs list',
    description: 'Free and public APIs by category with auth type, HTTPS and CORS support and link-check status; reviewed APIs add free-tier limits, sample requests and official SDKs.',
    dateModified: dataAt,
    isBasedOn: 'https://github.com/public-apis/public-apis',
    citation: 'public-apis (MIT License, Copyright (c) 2022 public-apis)',
    variableMeasured: ['auth', 'https', 'cors', 'status', 'free tier', 'official SDKs'],
  })
}

/** HowTo node with the page's #howto id (good first issues, 3.12). */
export function devHowToNode(path: string, opts: { name: string; description: string; steps: Array<{ name: string; text: string; url?: string }> }): Node {
  return howToNode({
    id: pageIds(path).howto,
    name: noDash(opts.name),
    description: noDash(opts.description),
    steps: opts.steps.map(s => ({ name: noDash(s.name), text: noDash(s.text), ...(s.url ? { url: absoluteUrl(s.url) } : {}) })),
  })
}
