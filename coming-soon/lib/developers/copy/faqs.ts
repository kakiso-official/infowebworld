/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - FAQ copy (spec 3.21) and the generated
   FAQs of company, repo, facet, API category and API pages.

   One array per block feeds both the visible DvFaq accordion and the
   FAQPage JSON-LD (jsonld.ts faqGraphNode), so they cannot drift. Same
   shape as app/home-sections/home-faq-data.ts: `links[].text` must appear
   verbatim in the answer, and DvFaq turns it into a link.

   Fixed copy carries no numbers (counts change with every snapshot).
   Generated answers only state verified, non-null fields of the data, with
   the date they were true; a question whose answer would be empty or
   unknown is left out.

   Pure and isomorphic (no React, no Node APIs).
   ═══════════════════════════════════════════════════════════════════════ */

import { formatDate, formatNumber, joinList } from '../format'
import { facetCompanies, facetRepos } from '../oss'
import { apiCollectionPath, gfiPath, methodologyPath, sdkPath, type OssFacetKind } from '../paths'
import { REGISTRY_LABELS, isTryable } from '../snippets'
import { apiCategoryPhraseLower } from '../taxonomy'
import { countryInPhrase } from '../../country-paths'
import { apiBaseName, noDash } from '../seo'
import type { OssStore } from '../oss'
import type { FreeApi, IsoDateTime, OssCompany, OssRepo } from '../types'

export interface DevFaq {
  q: string
  a: string
  links?: Array<{ text: string; href: string }>
}

/* ── Small helpers ───────────────────────────────────────────────────── */

/* "Stripe's", "Databricks'". */
function possessive(name: string): string {
  return /s$/i.test(name) ? `${name}'` : `${name}'s`
}

/* 'a, b, c, d, e and 3 more' for long lists (the count is data). */
function namesList(names: readonly string[], max = 5): string {
  if (names.length <= max) return joinList(names)
  const rest = names.length - max
  return `${names.slice(0, max).join(', ')} and ${formatNumber(rest)} more`
}

function plural(n: number, one: string, many: string): string {
  return `${formatNumber(n)} ${n === 1 ? one : many}`
}

/* Keep only links whose text is really in the answer. */
function faq(q: string, a: string, links?: DevFaq['links']): DevFaq {
  const answer = noDash(a)
  const kept = (links ?? []).filter(l => answer.includes(l.text))
  return kept.length ? { q: noDash(q), a: answer, links: kept } : { q: noDash(q), a: answer }
}

const CONTACT = '/contact'

/* ── Fixed sets (3.21) ───────────────────────────────────────────────── */

/** /developers. `refreshLive` = the daily GitHub refresh is running
 *  (meta.refresh.live), so the freshness answer is only made while true. */
export function hubFaqs(opts: { refreshLive: boolean }): DevFaq[] {
  return [
    faq(
      'What is InfoWebWorld for Developers?',
      'Two free tools on top of the InfoWebWorld business directory: the public open source projects that companies publish on GitHub, and a directory of free APIs with their official SDKs.',
    ),
    faq(
      'Are these APIs really free?',
      'Free means you can use the API without paying, either because it is fully free or because it has a free tier. Each reviewed API page says which, and links to the source we checked.',
    ),
    faq(
      'How do you check that an API still works?',
      'Our checker requests every API link. Reviewed APIs also have their sample request checked, and each page shows the date of the last check. Read how we check for the details.',
      [{ text: 'how we check', href: methodologyPath() }],
    ),
    faq(
      'How fresh is the GitHub data?',
      opts.refreshLive
        ? 'Stars, forks, pushes and good first issues refresh from the GitHub API every day, and each page shows the date of its data.'
        : 'Stars, forks, pushes and good first issues come from the GitHub API, and each page shows the date they were collected.',
    ),
    faq(
      'What is the difference between an API and an SDK?',
      'An API is the service you call over HTTP. An SDK is a library in your programming language that calls the API for you. Official means the API provider publishes it.',
    ),
    faq(
      'How do companies get their open source listed here?',
      'List the company on InfoWebWorld and tell us its GitHub organization. We add its public projects once the organization matches the company domain.',
      [{ text: 'List the company on InfoWebWorld', href: '/business' }],
    ),
    faq(
      'How do I report a wrong fact?',
      'Use the "Tell us" link at the bottom of any page, or contact us with the page and the correction.',
      [{ text: 'contact us', href: CONTACT }],
    ),
  ]
}

/** /developers/open-source. `reposPerOrg` = meta.reposPerOrgLimit. */
export function ossHubFaqs(opts: { reposPerOrg: number }): DevFaq[] {
  return [
    faq(
      'Which companies are included?',
      'Companies whose GitHub organization we could match to the company itself, through GitHub\'s verified domain or the organization\'s own website. Forks are left out.',
    ),
    faq(
      'Why only some repositories per company?',
      `We track the ${formatNumber(opts.reposPerOrg)} most-starred public, non-fork repositories of each GitHub organization, so every company page stays focused on the projects people use.`,
    ),
    faq(
      'What does "Listed on InfoWebWorld" mean?',
      'The company also has a business profile on InfoWebWorld, with its details, reviews and alternatives. We link to it from the company page.',
    ),
    faq(
      'What is a good first issue?',
      'A small, well-described task that the maintainers have labelled as a safe place for a new contributor to start. Browse good first issues by language.',
      [{ text: 'Browse good first issues', href: gfiPath() }],
    ),
    faq(
      'Is this only big tech?',
      'No. It includes startups, developer tools, data companies and businesses from many countries. Filter by country or industry to find them.',
    ),
  ]
}

/** /developers/free-apis. */
export function freeApisHubFaqs(): DevFaq[] {
  return [
    faq(
      'What counts as a free API here?',
      'An API you can use without paying: fully free, or with a free tier. Reviewed APIs show the free-tier limits with a link to the provider page that documents them.',
    ),
    faq(
      'Which free APIs don\'t need an API key?',
      'The no-key APIs answer requests without a key, OAuth or an account, so you can try an idea in minutes. See all free APIs with no API key.',
      [{ text: 'free APIs with no API key', href: apiCollectionPath('no-auth') }],
    ),
    faq(
      'What is CORS and why does it matter?',
      'CORS is how an API tells a browser that a page on another site may call it. Without it, browser JavaScript cannot read the response, so you would need a server. See the free APIs with CORS.',
      [{ text: 'free APIs with CORS', href: apiCollectionPath('cors-enabled') }],
    ),
    faq(
      'What is the difference between a free tier and a free API?',
      'A free API costs nothing at any volume. A free tier is the free part of a paid API, usually with limits on requests, features or time.',
    ),
    faq(
      'What does "Verified" mean?',
      'Our checker ran the API\'s sample request on the date shown and got a valid response, and the facts on the page were checked against the provider\'s docs.',
    ),
    faq(
      'How do I suggest an API?',
      'Send us the API\'s docs link and we will check it and add it, free. Contact us to suggest one.',
      [{ text: 'Contact us', href: CONTACT }],
    ),
  ]
}

/** /developers/open-source/good-first-issues[/{language}]. */
export function gfiFaqs(opts: { dataAt: IsoDateTime }): DevFaq[] {
  const date = formatDate(opts.dataAt)
  return [
    faq(
      'What is a good first issue?',
      'A small, well-described task that the maintainers have labelled as a safe place for a new contributor to start.',
    ),
    faq(
      'Do I need to ask before working on one?',
      'It is good practice. Comment on the issue to say you would like to work on it, and wait for a maintainer to reply before you start.',
    ),
    faq(
      'Are these issues still open?',
      date
        ? `They were open on ${date}. Open the issue on GitHub to check its current state.`
        : 'They were open when we collected them. Open the issue on GitHub to check its current state.',
    ),
  ]
}

/** /developers/free-apis/no-auth. */
export function noAuthFaqs(): DevFaq[] {
  return [
    faq(
      'Are no-key APIs safe to use in production?',
      'They are fine for prototypes and light use. Without a key the provider cannot tell clients apart, so limits are shared and the service can change without notice. Check the provider\'s terms before you rely on one.',
    ),
    faq(
      'What is CORS and why does it matter?',
      'CORS is how an API tells a browser that a page on another site may call it. Without it, browser JavaScript cannot read the response, so you would need a server. See the free APIs with CORS.',
      [{ text: 'free APIs with CORS', href: apiCollectionPath('cors-enabled') }],
    ),
  ]
}

/** /developers/free-apis/cors-enabled. */
export function corsFaqs(): DevFaq[] {
  return [
    faq(
      'What is CORS and why does it matter?',
      'CORS is how an API tells a browser that a page on another site may call it. These APIs allow it over HTTPS, so browser JavaScript can call them directly.',
    ),
    faq(
      'Can I call these APIs from a server too?',
      'Yes. CORS only matters in the browser. Servers, scripts and mobile apps can call any of these APIs directly.',
    ),
    faq(
      'Do any of them need a key?',
      'Some do. A key used in browser code is visible to anyone, so only use keys the provider marks as safe for public clients. See the free APIs with no API key.',
      [{ text: 'free APIs with no API key', href: apiCollectionPath('no-auth') }],
    ),
  ]
}

/** /developers/free-apis/ai-llm. */
export function aiLlmFaqs(): DevFaq[] {
  return [
    faq(
      'Are these AI and LLM APIs really free?',
      'Each one has a free tier or free access documented by the provider. The limits differ a lot, so each row shows the free tier and links to the source.',
    ),
    faq(
      'Why do some need a card?',
      'Some providers ask for a payment card to open the free tier, to stop abuse. The table shows which ones need a card, when the provider says so.',
    ),
    faq(
      'How is this list ordered?',
      'APIs that need no card come first, then the rest by name. We do not rank by opinion.',
    ),
  ]
}

/** /developers/free-apis/sdks. */
export function sdkIndexFaqs(): DevFaq[] {
  return [
    faq(
      'What is the difference between an API and an SDK?',
      'An API is the service you call over HTTP. An SDK is a library in your programming language that calls the API for you, with requests and auth handled.',
    ),
    faq(
      'What does "official" mean?',
      'Published by the API provider, confirmed from the provider\'s docs or the owner of the package\'s repository. Other packages are marked as community libraries.',
    ),
    faq(
      'Where do the versions and dates come from?',
      'From the package registries themselves, such as npm and PyPI. We only link a package after its registry page answered our check.',
    ),
  ]
}

/* ── Generated: open source ──────────────────────────────────────────── */

/** Company page FAQ (3.6): up to 3 questions from verified data. */
export function companyFaqs(store: OssStore, company: OssCompany): DevFaq[] {
  const stats = store.statsBySlug.get(company.slug)
  if (!stats) return []
  const name = noDash(company.name)
  const date = formatDate(store.dataAt)
  const orgs = company.orgs.map(o => o.login)
  const repos = Math.max(stats.publicRepos, stats.trackedRepos)
  const out: DevFaq[] = []

  const orgPhrase = orgs.length === 1
    ? ` under the ${orgs[0]} organization`
    : orgs.length > 1 ? ` under the ${joinList(orgs)} organizations` : ''
  out.push(faq(
    `Does ${name} have open source projects?`,
    `Yes. ${name} publishes ${plural(repos, 'public repository', 'public repositories')} on GitHub${orgPhrase}.` +
      (stats.topRepo ? ` The most-starred is ${stats.topRepo.name}.` : ''),
  ))

  if (stats.topRepo) {
    const top = store.repoByKey.get(`${company.slug}/${stats.topRepo.slug}`)
    out.push(faq(
      `What is ${possessive(name)} most popular open source project?`,
      `${stats.topRepo.name}, with ${plural(stats.topRepo.stars, 'GitHub star', 'GitHub stars')}${date ? ` as of ${date}` : ''}.` +
        (top?.description ? ` ${top.description}` : ''),
    ))
  }

  if (stats.goodFirstIssues > 0) {
    out.push(faq(
      `How can I contribute to ${name} open source?`,
      `Start with a good first issue: ${possessive(name)} tracked repositories had ${plural(stats.goodFirstIssues, 'open good first issue', 'open good first issues')}${date ? ` on ${date}` : ''}. Read the project's contributing guide, fork the repository and open a pull request.`,
    ))
  }
  return out
}

/** Repo page FAQ: license, language, maintenance and contributing, each
 *  only when the fact is known. */
export function repoFaqs(store: OssStore, repo: OssRepo): DevFaq[] {
  const company = store.companyBySlug.get(repo.companySlug)
  if (!company) return []
  const name = noDash(repo.name)
  const owner = noDash(company.name)
  const date = formatDate(store.dataAt)
  const out: DevFaq[] = []

  out.push(faq(
    `Is ${name} open source?`,
    repo.license
      ? `Yes. ${owner} publishes ${name} on GitHub under the ${repo.license} license.`
      : `${name} is public on GitHub, but GitHub found no standard license for it, so check the repository before you reuse the code.`,
  ))

  if (repo.primaryLanguage) {
    const others = repo.languages
      .map(l => l.name)
      .filter(n => n !== repo.primaryLanguage!.name)
      .slice(0, 3)
    out.push(faq(
      `What language is ${name} written in?`,
      `Mainly ${repo.primaryLanguage.name}` + (others.length ? `, with ${joinList(others)}.` : '.'),
    ))
  }

  const pushed = formatDate(repo.pushedAt)
  if (repo.isArchived) {
    out.push(faq(`Is ${name} still maintained?`, `No. ${owner} has archived it on GitHub, so it is read-only.`))
  } else if (pushed) {
    const release = repo.latestRelease && formatDate(repo.latestRelease.publishedAt)
    out.push(faq(
      `Is ${name} still maintained?`,
      `Its last push on GitHub was on ${pushed}` +
        (repo.latestRelease && release ? `, and its latest release is ${repo.latestRelease.tag} from ${release}.` : '.'),
    ))
  }

  if (!repo.isArchived) {
    out.push(faq(
      `How can I contribute to ${name}?`,
      repo.goodFirstIssues > 0
        ? `Start with a good first issue: it had ${plural(repo.goodFirstIssues, 'open good first issue', 'open good first issues')}${date ? ` on ${date}` : ''}. Comment on the issue first, then fork the repository and open a pull request.`
        : 'Read the contributing guide on GitHub, comment on an open issue you would like to fix, then fork the repository and open a pull request.',
    ))
  }
  return out
}

/* 'next.js by Vercel (130,412 stars)'. */
function repoMention(store: OssStore, r: OssRepo): string {
  const owner = store.companyBySlug.get(r.companySlug)?.name ?? r.owner
  return `${r.name} by ${noDash(owner)} (${plural(r.stars, 'star', 'stars')})`
}

/** Facet page FAQ (3.11): the most-starred projects and the companies
 *  behind them, with the data date. */
export function facetFaqs(store: OssStore, kind: OssFacetKind, slug: string): DevFaq[] {
  const facet = store.facetBySlug[kind].get(slug)
  if (!facet) return []
  const name = noDash(facet.name)
  const date = formatDate(store.dataAt)
  const top = facetRepos(store, kind, slug).filter(r => !r.isArchived).slice(0, 3)
  const companies = facetCompanies(store, kind, slug).map(c => noDash(c.name))
  const out: DevFaq[] = []

  const scope = kind === 'country'
    ? `from companies in ${countryInPhrase(name)}`
    : kind === 'industry'
      ? `from ${name} companies`
      : `${name} projects from companies`

  if (top.length) {
    const q = kind === 'language' || kind === 'topic'
      ? `What are the most popular open source ${name} projects from companies?`
      : `What are the most-starred open source projects ${scope}?`
    out.push(faq(q, `By GitHub stars${date ? ` as of ${date}` : ''}: ${joinList(top.map(r => repoMention(store, r)))}.`))
  }

  if (companies.length) {
    const q = kind === 'country'
      ? `Which companies in ${countryInPhrase(name)} publish open source on GitHub?`
      : kind === 'industry'
        ? `Which ${name} companies publish open source on GitHub?`
        : `Which companies publish open source ${name} projects?`
    out.push(faq(q, `${namesList(companies)}, ranked by the GitHub stars of their tracked projects.`))
  }

  if (kind === 'language') {
    const gfi = store.gfiLanguages.find(l => l.slug === slug)
    if (gfi && gfi.indexable) {
      out.push(faq(
        `Where can I find good first issues in ${name}?`,
        `See the good first issues in ${name} from these companies, each linking to the real GitHub issue.`,
        [{ text: `good first issues in ${name}`, href: gfiPath(slug) }],
      ))
    }
  }
  return out
}

/* ── Generated: free APIs ────────────────────────────────────────────── */

/** API category FAQ (3.14): no-key, official SDK and browser questions,
 *  each only when its answer is non-empty. `apis` = the category's list. */
export function apiCategoryFaqs(category: { slug: string; name: string }, apis: readonly FreeApi[]): DevFaq[] {
  const lower = noDash(apiCategoryPhraseLower(category.slug, category.name))
  const out: DevFaq[] = []

  const noKey = apis.filter(a => a.auth === 'none').map(a => noDash(a.name))
  if (noKey.length) {
    out.push(faq(
      `Which ${lower} APIs are free without an API key?`,
      `${namesList(noKey)} ${noKey.length === 1 ? 'answers' : 'answer'} requests without an API key, according to the listing.`,
    ))
  }

  const withSdks = apis
    .filter(a => a.details && a.details.sdks.some(s => s.official))
    .map(a => {
      const langs = [...new Set(a.details!.sdks.filter(s => s.official).map(s => s.language))]
      return `${noDash(a.name)} (${joinList(langs)})`
    })
  if (withSdks.length) {
    out.push(faq(
      `Which ${lower} APIs have official SDKs?`,
      `${namesList(withSdks)}. Each API page lists the packages with install commands.`,
    ))
  }

  const browser = apis.filter(a => a.cors === 'yes' && a.https).map(a => noDash(a.name))
  if (browser.length) {
    out.push(faq(
      `Which ${lower} APIs work from the browser?`,
      `${namesList(browser)} ${browser.length === 1 ? 'allows' : 'allow'} cross-origin (CORS) requests over HTTPS, so browser JavaScript can call ${browser.length === 1 ? 'it' : 'them'} directly.`,
    ))
  }
  return out
}

/** API detail FAQ (3.15), built only from non-null reviewed fields. */
export function apiFaqs(api: FreeApi): DevFaq[] {
  const d = api.details
  if (!d) return []
  const name = apiBaseName(api.name)
  const out: DevFaq[] = []

  const ft = d.freeTier
  if (ft.available === true) {
    const card = ft.requiresCard === false ? ' No card is needed.' : ft.requiresCard === true ? ' The provider asks for a payment card.' : ''
    const summary = ft.summary ? ` ${noDash(ft.summary).replace(/[.]?$/, '.')}` : ''
    out.push(faq(`Is the ${name} API free?`, `Yes, it has a free tier.${summary}${card}`))
  } else if (ft.available === false) {
    out.push(faq(
      `Is the ${name} API free?`,
      'The provider does not document a free tier. Check its pricing page before you build on it.',
    ))
  }

  const auth = d.auth.type
  const howTo = d.auth.howToGet ? ` ${noDash(d.auth.howToGet).replace(/[.]?$/, '.')}` : ' See the provider\'s docs to get one.'
  const authAnswer =
    auth === 'none' ? 'No. It answers requests without an API key or an account.'
      : auth === 'apiKey' ? `Yes, it needs an API key.${howTo}`
        : auth === 'OAuth' ? `Yes, it uses OAuth.${howTo}`
          : auth === 'X-Mashape-Key' ? `Yes, it needs a key sent in the X-Mashape-Key header.${howTo}`
            : auth === 'User-Agent' ? 'No key, but it asks every request to send a User-Agent header that identifies your app.'
              : null
  if (authAnswer) out.push(faq(`Does the ${name} API need an API key?`, authAnswer))

  const official = d.sdks.filter(s => s.official)
  const community = d.sdks.filter(s => !s.official)
  const pkg = (s: (typeof d.sdks)[number]) => `${s.package} for ${s.language} (${REGISTRY_LABELS[s.registry]})`
  if (official.length) {
    out.push(faq(
      `Does the ${name} API have an official SDK?`,
      `Yes: ${namesList(official.map(pkg), 4)}. See the SDKs in your language.`,
      official.length === 1 ? [{ text: 'SDKs in your language', href: sdkPath(official[0].languageSlug) }] : undefined,
    ))
  } else if (community.length) {
    out.push(faq(
      `Does the ${name} API have an official SDK?`,
      `No official SDK was found, but there are community libraries: ${namesList(community.map(pkg), 4)}.`,
    ))
  } else {
    out.push(faq(
      `Does the ${name} API have an official SDK?`,
      'No official SDK was found. Call the REST API directly with the Quick start request.',
    ))
  }

  if (api.cors === 'yes' && api.https) {
    out.push(faq(
      `Can I call the ${name} API from the browser?`,
      'Yes. It allows cross-origin (CORS) requests over HTTPS, so browser JavaScript can call it directly.' +
        (isTryable(d.sample, d.check) ? ' You can try the sample request live on this page.' : ''),
    ))
  } else if (api.cors === 'no') {
    out.push(faq(
      `Can I call the ${name} API from the browser?`,
      'Not directly. It does not allow cross-origin (CORS) requests, so call it from your server instead.',
    ))
  }
  return out
}
