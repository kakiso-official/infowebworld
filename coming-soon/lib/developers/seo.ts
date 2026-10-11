/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - titles, descriptions, H1s and metadata
   for every page type in spec section 3.

   Rules (3.0, 3.20):
   - Title <= 60 chars (lib/seo.ts TITLE_BUDGET). Each page has a fallback
     chain: the first candidate that fits wins, the last one is trimmed at
     a word boundary. Core keyword first, single hyphen separators, never
     an em dash (data strings are cleaned too).
   - Description <= 145 chars via clampDescription(lead, suffix), so a
     trailing freshness clause is never the part that gets cut.
   - Counts are en-US grouped ('6,912'), stars compact ('44.1k'), month
     and year come from the dataset snapshot, never the server clock.
   - Zero rule: a clause that would print a 0 count is left out.

   Pure and isomorphic (no React, no Node APIs).
   ═══════════════════════════════════════════════════════════════════════ */

import type { Metadata } from 'next'
import { BASE_URL } from '../../app/components/seo-schema'
import { countryInPhrase } from '../country-paths'
import { DESC_BUDGET, TITLE_BUDGET, buildSerpTitle, clampDescription, trimToBudget } from '../seo'
import { countLabel, formatCompact, formatMonthShortYear, formatMonthYear, formatNumber, formatYear, joinList } from './format'
import { PAGE_SIZE, absoluteUrl, lastPage, type ApiCollectionSlug, type OssFacetKind } from './paths'
import { REGISTRY_LABELS } from './snippets'
import { apiCategoryPhrase, apiCategoryPhraseLower } from './taxonomy'
import type { ApiCategoryStats, SdkLanguageStat } from './apis'
import type { AuthType, FacetValue, FreeApi, IsoDateTime, OssCompany, OssCompanyStats, OssRepo } from './types'

/** Title, meta description and the page's H1 (also WebPage.name in JSON-LD). */
export interface PageSeo {
  title: string
  description: string
  h1: string
}

/* ── Building blocks ─────────────────────────────────────────────────── */

/* En dash (U+2013) and em dash (U+2014), built from code points so this
   source file itself carries neither character. */
const LONG_DASH_RE = new RegExp(`\\s*[${String.fromCharCode(0x2013, 0x2014)}]\\s*`, 'g')

/** Data strings may carry em or en dashes; titles and copy never do. */
export function noDash(text: string): string {
  return text.replace(LONG_DASH_RE, ' - ').replace(/\s+/g, ' ').trim()
}

/** The first candidate that fits the title budget, else the last one
 *  trimmed at a word boundary. Empty candidates are skipped. */
export function fitTitle(...candidates: Array<string | null | false | undefined>): string {
  const list = candidates.filter((c): c is string => typeof c === 'string' && c.trim() !== '').map(noDash)
  for (const c of list) if (c.length <= TITLE_BUDGET) return c
  return trimToBudget(list[list.length - 1] ?? '', TITLE_BUDGET)
}

/** A core title plus optional extras, each appended (' - ' separated) only
 *  while the title still fits: buildSerpTitle with dash cleaning. The core
 *  itself is trimmed at a word boundary if it is already too long. */
export function serpTitle(core: string, extras: Array<string | null | false | undefined> = []): string {
  const list = extras.filter((e): e is string => typeof e === 'string' && e.trim() !== '').map(e => ({ text: noDash(e) }))
  return buildSerpTitle(trimToBudget(noDash(core), TITLE_BUDGET), list, TITLE_BUDGET)
}

/* A lead that ends as a sentence, so a suffix never runs on from it. */
function sentence(text: string): string {
  const t = noDash(text)
  return !t || /[.!?]$/.test(t) ? t : `${t}.`
}

/** clampDescription with dash cleaning: <= 145 chars, suffix kept whole. */
export function fitDescription(lead: string, suffix = ''): string {
  const out = clampDescription(sentence(lead), noDash(suffix))
  return out.length <= DESC_BUDGET ? out : trimToBudget(out, DESC_BUDGET)
}

/* '1 star', '44.1k stars'. */
function starsLabel(n: number): string {
  return `${formatCompact(n)} ${n === 1 ? 'star' : 'stars'}`
}

/* '1 Project' / '12 Projects' with a capitalised noun. */
function countNoun(n: number, singular: string, plural = `${singular}s`): string {
  return `${formatNumber(n)} ${n === 1 ? singular : plural}`
}

function pageNote(page: number | undefined, last: number): string {
  return page && page > 1 ? `Page ${page} of ${Math.max(page, last)}.` : ''
}

/* ── Section hub, methodology, search ────────────────────────────────── */

/** /developers (3.1). Pass null counts when the OSS dataset did not load. */
export function hubSeo(input: { repos: number | null; companies: number | null; checkedAt: IsoDateTime | null }): PageSeo {
  const { repos, companies } = input
  const lead = repos && companies
    ? `Free APIs with checked free tiers and official SDKs, plus ${formatNumber(repos)} open source repos from ${formatNumber(companies)} real companies on GitHub.`
    : 'Free APIs with checked free tiers and official SDKs, plus open source projects from real companies on GitHub.'
  const month = formatMonthShortYear(input.checkedAt)
  return {
    title: fitTitle('Free APIs, SDKs and Open Source Projects for Developers'),
    description: fitDescription(lead, month ? `Checked ${month}.` : ''),
    h1: 'Free APIs, SDKs and Open Source Projects From Real Companies',
  }
}

/** /developers/methodology (3.2). */
export function methodologySeo(): PageSeo {
  return {
    title: fitTitle('How We Check Free APIs and Open Source Data'),
    description: fitDescription(
      'Where our free API and open source data comes from, how our checker tests links and sample requests, what Verified means and how to report a mistake.',
    ),
    h1: 'How We Collect and Check This Data',
  }
}

/** /developers/search?q= (3.3). Always noindex. */
export function searchSeo(q: string | null | undefined): PageSeo {
  const query = noDash((q ?? '').replace(/[\u0000-\u001f]/g, ' '))
  if (!query) {
    return {
      title: fitTitle('Search Developer APIs and Open Source'),
      description: fitDescription('Search free APIs, official SDKs, companies and open source repositories on InfoWebWorld for Developers.'),
      h1: 'Search the Developer Hub',
    }
  }
  const short = query.length > 30 ? `${query.slice(0, 30).trim()}...` : query
  return {
    title: fitTitle(`Search: ${short} - Developers`, `Search: ${short}`),
    description: fitDescription(`Free APIs, SDKs, companies and open source repositories matching "${short}" on InfoWebWorld for Developers.`),
    h1: `Results for "${query}"`,
  }
}

/* ── Open source ─────────────────────────────────────────────────────── */

/** /developers/open-source (3.5). */
export function ossHubSeo(input: { companies: number; repos: number }): PageSeo {
  const c = formatNumber(input.companies)
  const r = formatNumber(input.repos)
  const lead = input.companies > 0 && input.repos > 0
    ? `Browse ${r} open source repos from ${c} real companies by language, topic, country and industry.`
    : 'Browse open source repos from real companies by language, topic, country and industry.'
  return {
    title: fitTitle(
      input.companies > 0 && input.repos > 0 && `Open Source Projects by ${c} Companies - ${r} GitHub Repos`,
      input.companies > 0 && `Open Source Projects by ${c} Real Companies`,
      'Open Source Projects by Companies',
    ),
    description: fitDescription(lead, 'Stars, licenses and good first issues from GitHub.'),
    h1: 'Open Source Projects From Real Companies',
  }
}

/** /developers/open-source/{company} (3.6). */
export function companySeo(company: Pick<OssCompany, 'name' | 'orgs'>, stats: Pick<OssCompanyStats, 'publicRepos' | 'trackedRepos' | 'topRepo'>): PageSeo {
  const name = noDash(company.name)
  const repos = Math.max(stats.publicRepos, stats.trackedRepos)
  const n = countNoun(repos, 'Repo')
  const orgs = company.orgs.length
  const top = stats.topRepo
  const lead = `${name} has ${countLabel(repos, 'public repo')} on GitHub` +
    (orgs > 1 ? ` across ${formatNumber(orgs)} orgs` : '') +
    (top ? `, led by ${top.name} (${starsLabel(top.stars)})` : '') + '.'
  return {
    title: fitTitle(
      repos > 0 && `${name} Open Source Projects on GitHub - ${n}`,
      repos > 0 && `${name} Open Source Projects - ${n}`,
      `${name} Open Source on GitHub`,
      `${name} Open Source Projects`,
    ),
    description: fitDescription(lead, 'Languages, licenses and good first issues.'),
    h1: `${name} Open Source Projects`,
  }
}

/** /developers/open-source/{company}/{repo} (3.7). The H1 is
 *  '{name} by {Company}' (the page mutes the ' by {Company}' part). */
export function repoSeo(repo: Pick<OssRepo, 'name' | 'description' | 'stars' | 'license' | 'primaryLanguage'>, company: Pick<OssCompany, 'name'>): PageSeo {
  const name = noDash(repo.name)
  const owner = noDash(company.name)
  const lang = repo.primaryLanguage ? noDash(repo.primaryLanguage.name) : null
  const facts = [
    starsLabel(repo.stars),
    repo.license ? `${repo.license} license` : null,
    lang ? `written in ${lang}` : null,
  ].filter(Boolean).join(', ')
  return {
    title: fitTitle(
      lang && `${name} by ${owner} - Open Source ${lang} Project`,
      `${name} by ${owner} - Open Source Project`,
      `${name} - ${owner} Open Source`,
      `${name} by ${owner}`,
    ),
    description: fitDescription(repo.description || `${name} is an open source project by ${owner} on GitHub.`, `${facts}.`),
    h1: `${name} by ${owner}`,
  }
}

/** /developers/open-source/repos[/page/{n}] (3.8). */
export function reposRankingSeo(input: { repos: number; companies: number; dataAt: IsoDateTime; page?: number }): PageSeo {
  const page = input.page && input.page > 1 ? input.page : 0
  const month = formatMonthShortYear(input.dataAt)
  const last = lastPage(input.repos, PAGE_SIZE.repos)
  return {
    title: page
      ? fitTitle(`Most-Starred Open Source Projects by Companies - Page ${page}`, `Most-Starred Open Source Projects - Page ${page}`)
      : serpTitle('Most-Starred Open Source Projects by Companies', [month]),
    description: fitDescription(
      input.repos && input.companies
        ? `The ${formatNumber(input.repos)} most-starred open source repositories published by ${formatNumber(input.companies)} companies on GitHub, ranked by stars, with language, license and activity.`
        : 'The most-starred open source repositories published by companies on GitHub, ranked by stars, with language, license and activity.',
      pageNote(page, last),
    ),
    h1: 'Most-Starred Open Source Projects From Companies',
  }
}

/** /developers/open-source/companies[/page/{n}] (3.9). */
export function companiesIndexSeo(input: { companies: number; page?: number }): PageSeo {
  const page = input.page && input.page > 1 ? input.page : 0
  const n = formatNumber(input.companies)
  const last = lastPage(input.companies, PAGE_SIZE.companies)
  const base = input.companies ? `${n} Companies With Open Source Projects` : 'Companies With Open Source Projects'
  return {
    title: page
      ? fitTitle(`${base} on GitHub - Page ${page}`, `${base} - Page ${page}`, `Open Source Companies - Page ${page}`)
      : fitTitle(`${base} on GitHub`, base),
    description: fitDescription(
      input.companies
        ? `${countLabel(input.companies, 'real company', 'real companies')} that publish open source on GitHub, ranked by stars, with repo counts, top languages and links to their InfoWebWorld profiles.`
        : 'Real companies that publish open source on GitHub, ranked by stars, with repo counts, top languages and links to their InfoWebWorld profiles.',
      pageNote(page, last),
    ),
    h1: 'Companies With Open Source Projects',
  }
}

const FACET_INDEX: Readonly<Record<OssFacetKind, { title: string; noun: [string, string]; lead: (n: string) => string; h1: string }>> = {
  language: {
    title: 'Open Source Projects by Programming Language',
    noun: ['Language', 'Languages'],
    lead: n => `Browse open source projects from real companies by programming language: ${n} with repo counts, companies and GitHub stars.`,
    h1: 'Open Source Projects by Programming Language',
  },
  topic: {
    title: 'Open Source Projects by Topic',
    noun: ['GitHub Topic', 'GitHub Topics'],
    lead: n => `Browse open source projects from real companies by GitHub topic: ${n} with repo counts, companies and GitHub stars.`,
    h1: 'Open Source Projects by Topic',
  },
  country: {
    title: 'Open Source Companies by Country',
    noun: ['Country', 'Countries'],
    lead: n => `See where the companies that publish open source on GitHub are based: ${n} with company counts, repos and GitHub stars.`,
    h1: 'Open Source Companies by Country',
  },
  industry: {
    title: 'Open Source Companies by Industry',
    noun: ['Industry', 'Industries'],
    lead: n => `Browse the companies that publish open source on GitHub by industry: ${n} with company counts, repos and GitHub stars.`,
    h1: 'Open Source Companies by Industry',
  },
}

/** /developers/open-source/{languages|topics|countries|industries} (3.10).
 *  `count` = values listed on the page. */
export function facetIndexSeo(kind: OssFacetKind, count: number): PageSeo {
  const cfg = FACET_INDEX[kind]
  const label = countNoun(count, cfg.noun[0], cfg.noun[1])
  return {
    title: serpTitle(cfg.title, [count > 0 && label]),
    description: fitDescription(
      count > 0
        ? cfg.lead(label.toLowerCase().replace('github', 'GitHub'))
        : `${cfg.title} from real companies on GitHub, with repo counts, companies and GitHub stars.`,
    ),
    h1: cfg.h1,
  }
}

/** A language, topic, country or industry page (3.11). `page` > 1 only
 *  for the paginated language and topic lists. */
export function facetPageSeo(facet: Pick<FacetValue, 'kind' | 'name' | 'repos' | 'companies'>, page?: number): PageSeo {
  const name = noDash(facet.name)
  const p = page && page > 1 ? page : 0
  const repos = formatNumber(facet.repos)
  const companies = countLabel(facet.companies, 'real company', 'real companies')
  const last = lastPage(facet.repos, PAGE_SIZE.facetRepos)
  const suffix = pageNote(p, last)
  const pg = p ? ` - Page ${p}` : ''

  switch (facet.kind) {
    case 'language': {
      const projects = facet.repos === 1 ? 'Project' : 'Projects'
      return {
        title: fitTitle(
          `${repos} Open Source ${name} ${projects} by Companies${pg}`,
          `Open Source ${name} Projects by Companies${pg}`,
          `Open Source ${name} Projects${pg}`,
        ),
        description: fitDescription(
          `Browse ${repos} open source ${name} ${projects.toLowerCase()} from ${companies}, sorted by GitHub stars, with licenses, activity and good first issues.`,
          suffix,
        ),
        h1: `Open Source ${name} Projects From Real Companies`,
      }
    }
    case 'topic':
      return {
        title: fitTitle(
          !p && `Open Source ${name} Projects by Companies - ${countNoun(facet.repos, 'Repo')}`,
          `Open Source ${name} Projects by Companies${pg}`,
          `Open Source ${name} Projects${pg}`,
        ),
        description: fitDescription(
          `Browse ${repos} open source ${name} ${facet.repos === 1 ? 'project' : 'projects'} from ${companies}, sorted by GitHub stars, with licenses, activity and good first issues.`,
          suffix,
        ),
        h1: `Open Source ${name} Projects by Companies`,
      }
    case 'country': {
      const inPhrase = countryInPhrase(name)
      return {
        title: fitTitle(
          `Open Source Companies in ${inPhrase} - ${formatNumber(facet.companies)} on GitHub`,
          `Open Source Companies in ${inPhrase}`,
          `Open Source Companies in ${name}`,
        ),
        description: fitDescription(
          `Browse ${companies} in ${inPhrase} that publish open source on GitHub, with ${countLabel(facet.repos, 'repo')} sorted by stars, licenses and activity.`,
        ),
        h1: `Open Source Companies in ${inPhrase}`,
      }
    }
    default:
      return {
        title: fitTitle(
          `Open Source ${name} Companies on GitHub - ${formatNumber(facet.companies)}`,
          `Open Source ${name} Companies on GitHub`,
          `Open Source ${name} Companies`,
        ),
        description: fitDescription(
          `Browse ${countLabel(facet.companies, `real ${name} company`, `real ${name} companies`)} that publish open source on GitHub, with ${countLabel(facet.repos, 'repo')} sorted by stars, licenses and activity.`,
        ),
        h1: `Open Source Projects by ${name} Companies`,
      }
  }
}

/** /developers/open-source/good-first-issues[/{language}] (3.12). */
export function gfiSeo(input: {
  issues: number; repos: number; companies: number; dataAt: IsoDateTime; language?: { name: string } | null
}): PageSeo {
  const issues = countLabel(input.issues, 'open good first issue')
  const companies = countLabel(input.companies, 'real company', 'real companies')
  if (input.language) {
    const lang = noDash(input.language.name)
    return {
      title: fitTitle(
        input.issues > 0 && `Good First Issues in ${lang} - ${formatNumber(input.issues)} From Real Companies`,
        `Good First Issues in ${lang} From Real Companies`,
        `Good First ${lang} Issues`,
      ),
      description: fitDescription(
        input.issues > 0
          ? `${issues} in ${lang} from ${companies}' public repositories on GitHub. Each one links to the real GitHub issue.`
          : `Good first issues in ${lang} from real companies' public repositories on GitHub. Each one links to the real GitHub issue.`,
      ),
      h1: `Good First ${lang} Issues From Real Companies`,
    }
  }
  const month = formatMonthYear(input.dataAt)
  return {
    title: serpTitle('Good First Issues From Real Companies', [month]),
    description: fitDescription(
      input.issues > 0 && input.repos > 0
        ? `${issues} in ${countLabel(input.repos, 'repository', 'repositories')} from ${companies}, by language. Each one links to the real GitHub issue.`
        : 'Open good first issues from real companies on GitHub, by language. Each one links to the real GitHub issue.',
    ),
    h1: 'Good First Issues to Start Contributing',
  }
}

/* ── Free APIs ───────────────────────────────────────────────────────── */

/** /developers/free-apis (3.13). */
export function freeApisHubSeo(input: { apis: number; categories: number; checkedAt: IsoDateTime; generatedAt: IsoDateTime }): PageSeo {
  const year = formatYear(input.generatedAt)
  const month = formatMonthShortYear(input.checkedAt)
  const n = formatNumber(input.apis)
  return {
    title: fitTitle(
      input.apis > 0 && `${n} Free APIs and Official SDKs for Developers (${year})`,
      `Free APIs and Official SDKs for Developers (${year})`,
      'Free APIs and Official SDKs for Developers',
    ),
    description: fitDescription(
      input.apis > 0
        ? `${n} free APIs in ${countLabel(input.categories, 'category', 'categories')}, each link-checked ${month}. Filter by auth, HTTPS and CORS, compare free tiers and install official SDKs.`
        : 'Free APIs by category, each link-checked. Filter by auth, HTTPS and CORS, compare free tiers and install official SDKs.',
    ),
    h1: 'Free APIs and Official SDKs, Checked and Sorted',
  }
}

/** /developers/free-apis/{category} (3.14). */
export function apiCategorySeo(stats: Pick<ApiCategoryStats, 'slug' | 'name' | 'apis' | 'tryable'>, dates: { checkedAt: IsoDateTime; generatedAt: IsoDateTime }): PageSeo {
  const phrase = noDash(apiCategoryPhrase(stats.slug, stats.name))
  const lower = noDash(apiCategoryPhraseLower(stats.slug, stats.name))
  const year = formatYear(dates.generatedAt)
  const n = formatNumber(stats.apis)
  const apisWord = stats.apis === 1 ? 'API' : 'APIs'
  return {
    title: fitTitle(
      `${n} Free ${phrase} ${apisWord} for Developers (${year})`,
      `Free ${phrase} APIs for Developers (${year})`,
      `Free ${phrase} APIs (${year})`,
      `Free ${phrase} APIs`,
    ),
    description: fitDescription(
      `${n} free ${lower} ${apisWord}: auth type, HTTPS, CORS, free-tier limits and official SDKs, checked ${formatMonthShortYear(dates.checkedAt)}.`,
      stats.tryable > 0 ? 'Try no-key APIs live.' : '',
    ),
    h1: `Free ${phrase} APIs`,
  }
}

/** An API's name without a trailing ' API' ('Open-Meteo API' -> 'Open-Meteo'),
 *  so titles and the H1 never read 'API API'. */
export function apiBaseName(name: string): string {
  return noDash(name).replace(/\s+API$/i, '').trim() || noDash(name)
}

/** How an auth type reads in a description; null when it says nothing. */
export function authPhrase(auth: AuthType): string | null {
  switch (auth) {
    case 'none': return 'No API key needed'
    case 'apiKey': return 'API key required'
    case 'OAuth': return 'OAuth required'
    case 'X-Mashape-Key': return 'X-Mashape-Key header required'
    case 'User-Agent': return 'User-Agent header required'
    default: return null
  }
}

/** /developers/free-apis/{category}/{api} (3.15). */
export function apiDetailSeo(api: Pick<FreeApi, 'name' | 'description' | 'auth' | 'https' | 'cors' | 'category' | 'details'>): PageSeo {
  const name = apiBaseName(api.name)
  const d = api.details
  const phrase = noDash(apiCategoryPhrase(api.category.slug, api.category.name))
  const auth = d?.auth.type ?? api.auth
  const official = d ? d.sdks.filter(s => s.official).length : 0
  const freeTier = d?.freeTier.available === true
  const hasSample = !!d?.sample

  const facts = [authPhrase(auth), api.https ? 'HTTPS' : null, api.cors === 'yes' ? 'CORS' : null].filter(Boolean).join(', ')
  const suffix = [facts ? `${facts}.` : '', official > 0 ? `${countLabel(official, 'official SDK')}.` : ''].filter(Boolean).join(' ')
  const lead = d?.freeTier.summary
    ? `${name} API free tier: ${d.freeTier.summary}`
    : d?.summary || api.description

  return {
    title: fitTitle(
      auth === 'none' && `${name} API - Free ${phrase} API, No Key Needed`,
      official > 0 && freeTier && `${name} API - Free Tier, Limits and SDKs`,
      official > 0 && `${name} API - Free ${phrase} API With SDKs`,
      freeTier && hasSample && `${name} API - Free Tier, Limits and Example`,
      hasSample && `${name} API - Free ${phrase} API and Example`,
      `${name} API - Free ${phrase} API`,
      `${name} API`,
    ),
    description: fitDescription(lead, suffix),
    h1: `${name} API`,
  }
}

/** /developers/free-apis/{no-auth|cors-enabled|ai-llm} (3.16). `count` =
 *  APIs listed on the page; `checkedAt` = the links check date. */
export function apiCollectionSeo(slug: ApiCollectionSlug, input: { count: number; generatedAt: IsoDateTime; checkedAt: IsoDateTime }): PageSeo {
  const n = formatNumber(input.count)
  const apis = countLabel(input.count, 'free API')
  const month = formatMonthShortYear(input.checkedAt)
  switch (slug) {
    case 'no-auth':
      return {
        title: fitTitle(
          input.count > 0 && `${n} Free APIs With No Authentication or API Key`,
          'Free APIs With No Authentication or API Key',
        ),
        description: fitDescription(
          input.count > 0
            ? `${apis} that need no API key, OAuth or account, grouped by category, with HTTPS, CORS and the date we last checked each link.`
            : 'Free APIs that need no API key, OAuth or account, grouped by category, with HTTPS, CORS and the date we last checked each link.',
        ),
        h1: "Free APIs That Don't Require an API Key",
      }
    case 'cors-enabled':
      return {
        title: fitTitle(
          input.count > 0 && `Free APIs With CORS - ${n} APIs for Browser JavaScript`,
          'Free APIs With CORS for Browser JavaScript',
        ),
        description: fitDescription(
          input.count > 0
            ? `${apis} that allow CORS over HTTPS, so browser JavaScript can call them directly. Grouped by category, with auth type and check dates.`
            : 'Free APIs that allow CORS over HTTPS, so browser JavaScript can call them directly. Grouped by category, with auth type and check dates.',
        ),
        h1: 'Free APIs You Can Call From the Browser',
      }
    default: {
      const monthYear = formatMonthYear(input.generatedAt)
      return {
        title: serpTitle('Free AI and LLM APIs', [monthYear, 'Limits Compared']),
        description: fitDescription(
          input.count > 0
            ? `${countLabel(input.count, 'free AI and LLM API', 'free AI and LLM APIs')} compared: free-tier limits, card required or not, rate limits and official SDKs, each with its source.`
            : 'Free AI and LLM APIs compared: free-tier limits, card required or not, rate limits and official SDKs, each with its source.',
          month ? `Checked ${month}.` : '',
        ),
        h1: 'Free AI and LLM APIs, Compared',
      }
    }
  }
}

/** /developers/free-apis/sdks (3.17). `sdks` = official SDKs, `apis` = APIs
 *  with at least one official SDK. */
export function sdkIndexSeo(input: { sdks: number; apis: number }): PageSeo {
  return {
    title: fitTitle('Official SDKs for Free APIs by Programming Language'),
    description: fitDescription(
      input.sdks > 0 && input.apis > 0
        ? `${countLabel(input.sdks, 'official SDK')} for ${countLabel(input.apis, 'free API')}, by programming language, with install commands, versions and publish dates from npm, PyPI and more.`
        : 'Official SDKs for free APIs by programming language, with install commands, versions and publish dates from npm, PyPI and more.',
    ),
    h1: 'Official SDKs for Free APIs',
  }
}

/** /developers/free-apis/sdks/{language} (3.17). */
export function sdkLanguageSeo(stat: Pick<SdkLanguageStat, 'name' | 'official' | 'apis' | 'registries'>): PageSeo {
  const lang = noDash(stat.name)
  const registries = joinList(stat.registries.map(r => REGISTRY_LABELS[r]).filter(r => r !== 'Other'))
  const from = registries ? ` from ${registries}` : ''
  return {
    title: fitTitle(
      stat.official > 0 && `${formatNumber(stat.official)} Official ${lang} ${stat.official === 1 ? 'SDK' : 'SDKs'} for Free APIs`,
      `Official ${lang} SDKs for Free APIs`,
      `Official ${lang} SDKs`,
    ),
    description: fitDescription(
      stat.official > 0
        ? `${countLabel(stat.official, `official ${lang} package`)} for ${countLabel(stat.apis, 'free API')}, with install commands, latest versions and publish dates${from}.`
        : `${lang} packages for free APIs, with install commands, latest versions and publish dates${from}.`,
    ),
    h1: `Official ${lang} SDKs for Free APIs`,
  }
}

/* ── Metadata ────────────────────────────────────────────────────────── */

/** Meta robots for a gate result (3.0): full googleBot directives when
 *  indexed, 'noindex, follow' otherwise. Never nofollow. */
export function devRobots(indexable: boolean): NonNullable<Metadata['robots']> {
  return indexable
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
      }
    : { index: false, follow: true }
}

/** Page metadata in the site's shape (app/glossary/page.tsx): absolute
 *  canonical, Open Graph + Twitter with the site image, gate robots. */
export function devMetadata(opts: {
  path: string
  title: string
  description: string
  indexable: boolean
  keywords?: string[]
  imageAlt?: string
}): Metadata {
  const url = absoluteUrl(opts.path)
  const title = noDash(opts.title)
  const description = noDash(opts.description)
  return {
    title,
    description,
    ...(opts.keywords && opts.keywords.length ? { keywords: opts.keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'InfoWebWorld',
      type: 'website',
      locale: 'en_US',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: opts.imageAlt ?? title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/og-image.png`],
    },
    robots: devRobots(opts.indexable),
  }
}

/** devMetadata from a PageSeo. */
export function devPageMetadata(path: string, seo: Pick<PageSeo, 'title' | 'description'>, indexable: boolean): Metadata {
  return devMetadata({ path, title: seo.title, description: seo.description, indexable })
}

/** Title of every /developers 404 (an unknown slug or path). */
export const DEV_NOT_FOUND_TITLE = 'Page Not Found - InfoWebWorld for Developers'

/** Title of the section when a page sets none (the layout default). */
export const DEV_SECTION_TITLE = 'InfoWebWorld for Developers'

/** generateMetadata for an unknown slug (the page itself 404s). */
export function devNotFoundMetadata(): Metadata {
  return { title: DEV_NOT_FOUND_TITLE, robots: { index: false, follow: true } }
}

/** Metadata while a dataset cannot be loaded (DevDataError): the page
 *  shows a "refreshing" notice and must not be indexed for that render. */
export function devUnavailableMetadata(path: string, seo: Pick<PageSeo, 'title' | 'description'>): Metadata {
  return devMetadata({ path, title: seo.title, description: seo.description, indexable: false })
}
