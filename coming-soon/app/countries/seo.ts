import type { Metadata } from 'next'
import { buildFaqPageJsonLd, type HomeFaq } from '../home-sections/home-faq-data'
import { buildSerpTitle, clampDescription, DESC_BUDGET, TITLE_BUDGET } from '@/lib/seo'
import { sectorCategoryPath } from '@/lib/sector-paths'
import {
  COUNTRIES_INDEX_PATH, COUNTRY_INDEX_MIN_LISTINGS, COUNTRY_HUB_TITLES, SECTOR_COUNTRY_COPY,
  countryHubPath, countryInPhrase, countrySectorPath, pickTitle,
} from '@/lib/country-paths'
import type { CategoryCount, CityCount, CountryInfo, CountryReviewStats, ListingRow, SectorCount } from './country-data'

/* ═══════════════════════════════════════════════════════════════════════
   Country directory pages - titles, descriptions, FAQs, metadata and the
   JSON-LD @graph. Pure module (no React, no DB): every string is built
   from the real counts the page fetched, and the same FAQ array feeds the
   visible accordion and the FAQPage node.
   ═══════════════════════════════════════════════════════════════════════ */

export const SITE = 'https://www.infowebworld.com'
const OG_IMAGE = `${SITE}/og-image.png`

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function now() {
  const d = new Date()
  return { year: d.getUTCFullYear(), month: MONTHS[d.getUTCMonth()] }
}

function updatedSuffix(): string {
  const { year, month } = now()
  return `Updated ${month} ${year}.`
}

export function fmt(n: number): string {
  return n.toLocaleString('en-US')
}

/** "a", "a and b", "a, b and c". */
export function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

export function plural(n: number, one: string, many: string): string {
  return `${fmt(n)} ${n === 1 ? one : many}`
}

/* ── Paths and URLs ─────────────────────────────────────────────────── */

export function absolute(path: string): string {
  return `${SITE}${path}`
}

/** Page 1 is never ?page=1. */
export function sectorPagePath(countrySlugValue: string, sector: string, page: number): string {
  const base = countrySectorPath(countrySlugValue, sector)
  return page > 1 ? `${base}?page=${page}` : base
}

/** A category page filtered to one country - the catch-all's ?country= variant. */
export function categoryInCountryPath(sector: string, categorySlug: string, countrySlugValue: string): string {
  return `${sectorCategoryPath(sector, categorySlug)}?country=${encodeURIComponent(countrySlugValue)}`
}

export function listingPath(row: ListingRow): string {
  const slug = String(row.slug ?? '')
  return (row.listing_mode === 'company' ? '/profile/' : '/listing/') + slug
}

/* ── Titles ─────────────────────────────────────────────────────────── */

export function hubTitle(country: CountryInfo): string {
  return pickTitle(COUNTRY_HUB_TITLES, { name: country.name, year: now().year }, TITLE_BUDGET)
}

/** The sector title; page N > 1 appends " - Page N" when it still fits,
 *  otherwise the "({Y})..." tail of the best candidate gives way to it. */
export function sectorTitle(country: CountryInfo, sector: string, page = 1): string {
  const copy = SECTOR_COUNTRY_COPY[sector]
  const vars = { name: country.name, year: now().year }
  const base = pickTitle(copy.titles, vars, TITLE_BUDGET)
  if (page <= 1) return base

  const suffix = ` - Page ${page}`
  if (base.length + suffix.length <= TITLE_BUDGET) return base + suffix

  /* Fill each candidate on its own, best first. */
  const filled = copy.titles.map(t => pickTitle([t], vars, 999))
  for (const t of filled) {
    if (t.length + suffix.length <= TITLE_BUDGET) return t + suffix
    const cut = t.indexOf(' (')
    if (cut > 0) {
      const head = t.slice(0, cut)
      if (head.length + suffix.length <= TITLE_BUDGET) return head + suffix
    }
  }
  const last = filled[filled.length - 1]
  const cut = last.indexOf(' (')
  return (cut > 0 ? last.slice(0, cut) : last) + suffix
}

export function indexTitle(countryCount: number): string {
  return buildSerpTitle('Business Directory by Country', [{ text: `Browse ${fmt(countryCount)} Countries` }])
}

/* ── H1s ────────────────────────────────────────────────────────────── */

export function hubH1(country: CountryInfo): string {
  return `${country.name} Business Directory`
}

export function sectorH1(country: CountryInfo, sector: string): string {
  return `${SECTOR_COUNTRY_COPY[sector].noun} in ${countryInPhrase(country.name)}`
}

/* ── Descriptions ───────────────────────────────────────────────────── */

const SECTOR_DESC_TAIL: Record<string, string> = {
  'ai-ml': 'See features, pricing, reviews and company details, then shortlist the right tool.',
  'software-saas': 'See features, pricing, reviews and company details, then shortlist the right software.',
  'it-services-agencies': 'See services, reviews and company details, then shortlist the right partner.',
  'startups-innovation': 'See what they build, who founded them and what customers say.',
  'local-businesses': 'See services, hours, reviews and contact details in one place.',
  'professional-services': 'See services, reviews and company details, then shortlist the right firm.',
}

/* Short sector labels for meta descriptions, where every character counts. */
const SECTOR_SHORT: Record<string, string> = {
  'ai-ml': 'AI tools',
  'software-saas': 'SaaS companies',
  'it-services-agencies': 'IT agencies',
  'startups-innovation': 'startups',
  'local-businesses': 'local businesses',
  'professional-services': 'professional services firms',
}

/** First candidate lead that fits the description budget next to the
 *  "Updated {Month} {Year}." suffix without being cut; falls back to
 *  clampDescription's word-boundary trim of the last one. */
function fitDescription(leads: string[]): string {
  const suffix = updatedSuffix()
  const room = DESC_BUDGET - suffix.length - 1
  const lead = leads.find(l => l.length <= room) ?? leads[leads.length - 1]
  return clampDescription(lead, suffix)
}

export function hubDescription(country: CountryInfo, sectors: SectorCount[]): string {
  const C = countryInPhrase(country.name)
  const live = sectors.filter(s => s.listings > 0).sort((a, b) => b.listings - a.listings)
  const labels = live.map(s => SECTOR_SHORT[s.sector]).filter(Boolean)
  const what = country.listings === 1 ? '1 business' : `${fmt(country.listings)} businesses`
  const leads: string[] = []
  if (live.length > 1) {
    /* "a, b and more" while sectors are left out; "a, b and c" when all fit. */
    const list = (n: number) => n >= labels.length ? joinList(labels) : `${labels.slice(0, n).join(', ')} and more`
    for (const n of [3, 2, 1]) {
      leads.push(`Find and compare ${what} in ${C} across ${live.length} sectors: ${list(n)}, with reviews and company details.`)
      leads.push(`Compare ${what} in ${C} across ${live.length} sectors: ${list(n)}.`)
    }
  } else if (labels.length === 1) {
    leads.push(`Find and compare ${what} in ${C} among ${labels[0]}, with reviews and company details.`)
    leads.push(`Compare ${what} in ${C} among ${labels[0]}.`)
  } else {
    leads.push(`Find and compare ${what} in ${C}, with reviews and company details.`)
  }
  return fitDescription(leads)
}

export function sectorDescription(
  country: CountryInfo,
  sector: string,
  listings: number,
  cities: CityCount[],
): string {
  const copy = SECTOR_COUNTRY_COPY[sector]
  const C = countryInPhrase(country.name)
  const tail = SECTOR_DESC_TAIL[sector] ?? ''
  const leads: string[] = []
  const head = (n: number) => {
    const names = cities.slice(0, n).map(c => c.city)
    const where = names.length > 1 ? ` across ${joinList(names)}` : names.length === 1 ? `, including ${names[0]}` : ''
    return listings > 1
      ? `Compare ${fmt(listings)} ${copy.nounLower} in ${C}${where}.`
      : `Discover ${copy.nounLower} in ${C}${where} listed on InfoWebWorld.`
  }
  for (const n of [3, 2, 1, 0]) {
    leads.push(`${head(n)} ${tail}`)
    leads.push(`${head(n)} See reviews and company details.`)
  }
  leads.push(head(3))
  return fitDescription(leads)
}

export function indexDescription(countries: CountryInfo[]): string {
  const total = countries.reduce((s, c) => s + c.listings, 0)
  const names = countries.map(c => countryInPhrase(c.name))
  const leads: string[] = []
  for (const n of [3, 2, 1]) {
    const led = joinList(names.slice(0, n))
    leads.push(`Browse ${fmt(total)} business listings from ${fmt(countries.length)} countries, led by ${led}. Pick a country to see its companies by sector.`)
    leads.push(`Browse ${fmt(total)} business listings from ${fmt(countries.length)} countries, led by ${led}, by sector and city.`)
  }
  return fitDescription(leads)
}

/* ── Metadata ───────────────────────────────────────────────────────── */

function robots(index: boolean): Metadata['robots'] {
  return index
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
      }
    : { index: false, follow: true, googleBot: { index: false, follow: true } }
}

export function buildMetadata(opts: {
  path: string
  title: string
  description: string
  indexable: boolean
  imageAlt: string
}): Metadata {
  const url = absolute(opts.path)
  const { title, description } = opts
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { 'en-US': url, 'x-default': url },
    },
    openGraph: {
      type: 'website',
      url,
      siteName: 'InfoWebWorld',
      locale: 'en_US',
      title,
      description,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: opts.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
      site: '@infowebworld',
    },
    robots: robots(opts.indexable),
  }
}

export function hubIndexable(country: CountryInfo): boolean {
  return country.listings >= COUNTRY_INDEX_MIN_LISTINGS
}

export function sectorIndexable(listings: number, page: number): boolean {
  return listings >= COUNTRY_INDEX_MIN_LISTINGS && page === 1
}

/* ── FAQs (visible accordion + FAQPage node) ────────────────────────── */

const LIST_ANSWER =
  'Start with a free listing on the Get Listed page. The InfoWebWorld team reviews every submission before it goes live and emails you the result. Paid plans add a dofollow website link and featured placement.'

function verifiedAnswer(where: string): string {
  return `Every listing ${where} is reviewed by the InfoWebWorld team before it goes live. Listings that also complete our verification show a Verified badge, so look for the badge when you shortlist.`
}

function reviewAnswer(stats: CountryReviewStats, subject: string): string {
  return `${subject} have ${plural(stats.count, 'approved review', 'approved reviews')} on InfoWebWorld, with an average rating of ${stats.avg.toFixed(1)} out of 5. Every review is moderated before it is published.`
}

function catCountText(c: CategoryCount): string {
  return `${c.name} (${fmt(c.listings)})`
}

function cityCountText(c: CityCount): string {
  return `${c.city} (${fmt(c.listings)})`
}

export function buildHubFaqs(input: {
  country: CountryInfo
  sectors: SectorCount[]
  cities: CityCount[]
  categories: CategoryCount[]
  reviewStats: CountryReviewStats
}): HomeFaq[] {
  const { country, sectors, cities, categories, reviewStats } = input
  const C = countryInPhrase(country.name)
  const live = sectors.filter(s => s.listings > 0).sort((a, b) => b.listings - a.listings)
  const faqs: HomeFaq[] = []

  const breakdown = live.slice(0, 3).map(s => `${SECTOR_COUNTRY_COPY[s.sector]?.name ?? s.sector} (${fmt(s.listings)})`)
  faqs.push({
    q: `How many businesses are listed in ${C} on InfoWebWorld?`,
    a: `InfoWebWorld lists ${plural(country.listings, 'live business', 'live businesses')} in ${C} across ${plural(live.length, 'sector', 'sectors')}.` +
      (breakdown.length > 1 ? ` The largest are ${joinList(breakdown)}.` : ''),
  })

  if (cities.length > 0) {
    faqs.push({
      q: `Which cities in ${C} have the most listings?`,
      a: cities.length > 1
        ? `The cities with the most listings in ${C} are ${joinList(cities.slice(0, 5).map(cityCountText))}.`
        : `Most listings in ${C} are in ${cityCountText(cities[0])}.`,
    })
  }

  if (categories.length > 0) {
    faqs.push({
      q: `What are the most common business categories in ${C}?`,
      a: `By number of live listings, the top categories in ${C} are ${joinList(categories.slice(0, 5).map(catCountText))}.`,
    })
  }

  if (reviewStats.count > 0) {
    faqs.push({
      q: `How are businesses in ${C} rated?`,
      a: reviewAnswer(reviewStats, `Businesses in ${C}`),
    })
  }

  faqs.push({
    q: `How do I list my business in ${C}?`,
    a: LIST_ANSWER,
    links: [{ text: 'Get Listed', href: '/business' }],
  })

  faqs.push({
    q: 'Are these listings verified?',
    a: verifiedAnswer(`in ${C}`),
  })

  return faqs
}

export function buildSectorFaqs(input: {
  country: CountryInfo
  sector: string
  listings: number
  cities: CityCount[]
  categories: CategoryCount[]
  reviewStats: CountryReviewStats
}): HomeFaq[] {
  const { country, sector, listings, cities, categories, reviewStats } = input
  const copy = SECTOR_COUNTRY_COPY[sector]
  const C = countryInPhrase(country.name)
  const faqs: HomeFaq[] = []

  faqs.push({
    q: `How many ${copy.nounLower} are listed in ${C}?`,
    a: `InfoWebWorld lists ${plural(listings, 'live listing', 'live listings')} in ${copy.name} in ${C}` +
      (categories.length > 0 ? `, spread over ${plural(categories.length, 'category', 'categories')}.` : '.') +
      ' Featured and verified listings are shown first.',
  })

  if (cities.length > 0) {
    faqs.push({
      q: `Which cities in ${C} have the most ${copy.nounLower}?`,
      a: cities.length > 1
        ? `The cities with the most ${copy.nounLower} in ${C} are ${joinList(cities.slice(0, 5).map(cityCountText))}.`
        : `Most ${copy.nounLower} listed in ${C} are in ${cityCountText(cities[0])}.`,
    })
  }

  if (categories.length > 0) {
    faqs.push({
      q: `Which ${copy.name} categories are most common in ${C}?`,
      a: `By number of live listings, the top ${copy.name} categories in ${C} are ${joinList(categories.slice(0, 5).map(catCountText))}.`,
    })
  }

  if (reviewStats.count > 0) {
    faqs.push({
      q: `How are ${copy.nounLower} in ${C} rated?`,
      a: reviewAnswer(reviewStats, `${copy.noun} in ${C}`),
    })
  }

  faqs.push({
    q: `How do I list my business in ${C}?`,
    a: LIST_ANSWER,
    links: [{ text: 'Get Listed', href: '/business' }],
  })

  faqs.push({
    q: 'Are these listings verified?',
    a: verifiedAnswer(`in ${copy.name} in ${C}`),
  })

  return faqs
}

/* ── JSON-LD ────────────────────────────────────────────────────────── */

function orgAndSite() {
  return [
    {
      '@type': 'Organization',
      '@id': `${SITE}#org`,
      name: 'InfoWebWorld',
      url: SITE,
      logo: `${SITE}/logo/infowebworldlogo-logoforlightbackgrounds.png`,
      sameAs: [
        'https://x.com/infowebworld_x',
        'https://www.linkedin.com/company/infowebworld/',
        'https://www.instagram.com/infowebworld',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}#website`,
      url: SITE,
      name: 'InfoWebWorld',
      publisher: { '@id': `${SITE}#org` },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ]
}

export type Crumb = { name: string; path: string }

type ListItem = { name: string; path: string }

function pageGraph(opts: {
  path: string
  title: string
  description: string
  crumbs: Crumb[]
  countryName?: string
  listName: string
  items: ListItem[]
  faqs?: HomeFaq[]
}) {
  const url = absolute(opts.path)
  const listId = `${url}#list`
  const graph: Record<string, unknown>[] = [
    ...orgAndSite(),
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: opts.crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: absolute(c.path),
      })),
    },
    {
      '@type': 'CollectionPage',
      '@id': `${url}#page`,
      url,
      name: opts.title,
      description: opts.description,
      inLanguage: 'en-US',
      isPartOf: { '@id': `${SITE}#website` },
      publisher: { '@id': `${SITE}#org` },
      breadcrumb: { '@id': `${url}#breadcrumb` },
      ...(opts.countryName ? { about: { '@type': 'Country', name: opts.countryName } } : {}),
      mainEntity: { '@id': listId },
      primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE, width: 1200, height: 630 },
      dateModified: new Date().toISOString(),
    },
    {
      '@type': 'ItemList',
      '@id': listId,
      name: opts.listName,
      numberOfItems: opts.items.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: opts.items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: absolute(it.path),
      })),
    },
  ]
  if (opts.faqs && opts.faqs.length > 0) graph.push(buildFaqPageJsonLd(opts.faqs, url))
  return { '@context': 'https://schema.org', '@graph': graph }
}

export function indexCrumbs(): Crumb[] {
  return [
    { name: 'Home', path: '/' },
    { name: 'Countries', path: COUNTRIES_INDEX_PATH },
  ]
}

export function hubCrumbs(country: CountryInfo): Crumb[] {
  return [...indexCrumbs(), { name: country.name, path: countryHubPath(country.slug) }]
}

export function sectorCrumbs(country: CountryInfo, sector: string): Crumb[] {
  return [
    ...hubCrumbs(country),
    { name: SECTOR_COUNTRY_COPY[sector].directoryName, path: countrySectorPath(country.slug, sector) },
  ]
}

export function buildIndexJsonLd(countries: CountryInfo[], title: string, description: string) {
  return pageGraph({
    path: COUNTRIES_INDEX_PATH,
    title,
    description,
    crumbs: indexCrumbs(),
    listName: 'Countries with business listings on InfoWebWorld',
    items: countries.map(c => ({ name: `${c.name} Business Directory`, path: countryHubPath(c.slug) })),
  })
}

export function buildHubJsonLd(opts: {
  country: CountryInfo
  sectors: SectorCount[]
  title: string
  description: string
  faqs: HomeFaq[]
}) {
  const { country } = opts
  return pageGraph({
    path: countryHubPath(country.slug),
    title: opts.title,
    description: opts.description,
    crumbs: hubCrumbs(country),
    countryName: country.name,
    listName: `Business sectors in ${countryInPhrase(country.name)}`,
    items: opts.sectors
      .filter(s => s.listings > 0)
      .map(s => ({
        name: `${SECTOR_COUNTRY_COPY[s.sector]?.noun ?? s.sector} in ${countryInPhrase(country.name)}`,
        path: countrySectorPath(country.slug, s.sector),
      })),
    faqs: opts.faqs,
  })
}

export function buildSectorJsonLd(opts: {
  country: CountryInfo
  sector: string
  page: number
  rows: ListingRow[]
  title: string
  description: string
  faqs: HomeFaq[]
}) {
  const { country, sector, page } = opts
  return pageGraph({
    path: sectorPagePath(country.slug, sector, page),
    title: opts.title,
    description: opts.description,
    crumbs: sectorCrumbs(country, sector),
    countryName: country.name,
    listName: `${SECTOR_COUNTRY_COPY[sector].noun} in ${countryInPhrase(country.name)}`,
    items: opts.rows.map(r => ({ name: String(r.company_name ?? ''), path: listingPath(r) })),
    faqs: opts.faqs,
  })
}
