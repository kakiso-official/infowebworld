/* ────────────────────────────────────────────────────────────
   Shared schema.org node builders for the info-page shell.
   Every page reuses the same Organization + WebSite @ids so the
   knowledge graph stays internally consistent for Google/Bing/
   Perplexity/ChatGPT crawlers.
   ──────────────────────────────────────────────────────────── */

export const BASE_URL = 'https://infowebworld.com'

export const ID_ORG     = `${BASE_URL}/#organization`
export const ID_WEBSITE = `${BASE_URL}/#website`
export const ID_BRAND   = `${BASE_URL}/#brand`
export const ID_LOGO    = `${BASE_URL}/#logo`

/** Best-effort parse for human dates like "April 21, 2026" → "2026-04-21". */
export function toISO(updated?: string): string | undefined {
  if (!updated) return undefined
  const t = Date.parse(updated)
  if (Number.isNaN(t)) return undefined
  return new Date(t).toISOString().split('T')[0]
}

/** Canonical Organization node — referenced by every page via @id. */
export const organizationNode = {
  '@type': ['Organization', 'OnlineBusiness'],
  '@id': ID_ORG,
  name: 'InfoWebWorld',
  alternateName: ['IWW', 'Info Web World'],
  legalName: 'Brain Stream Australia Pty Ltd',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    '@id': ID_LOGO,
    url: `${BASE_URL}/logo/infowebworldlogo-logoforlightbackgrounds.png`,
    contentUrl: `${BASE_URL}/logo/infowebworldlogo-logoforlightbackgrounds.png`,
    width: 512,
    height: 512,
    caption: 'InfoWebWorld logo',
  },
  image: { '@id': ID_LOGO },
  description:
    'Global business discovery platform — verified listings, real reviews, dofollow backlinks, and AI-era visibility across 80+ industries and 13,000+ categories.',
  foundingDate: '2026',
  founder: { '@type': 'Person', name: 'Aadil Parmar' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Parramatta',
    addressLocality: 'Parramatta',
    addressRegion: 'NSW',
    postalCode: '2150',
    addressCountry: 'AU',
  },
  location: {
    '@type': 'Place',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -33.8136,
      longitude: 151.0034,
    },
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['English'],
      areaServed: 'Worldwide',
      url: `${BASE_URL}/contact`,
    },
    {
      '@type': 'ContactPoint',
      contactType: 'press',
      url: `${BASE_URL}/media`,
      availableLanguage: ['English'],
    },
  ],
  brand: { '@id': ID_BRAND },
  knowsAbout: [
    'Business directory',
    'SEO',
    'Search engine optimization',
    'AEO',
    'Answer engine optimization',
    'GEO',
    'Generative engine optimization',
    'Dofollow backlinks',
    'Verified reviews',
    'Business listings',
    'AI search',
    'Lead generation',
  ],
  sameAs: [
    // sameAs entries help search engines disambiguate the entity — add real socials
    // here as they go live. Empty array is valid schema.
  ],
}

/** Brand node, distinct from Organization (Google prefers them split). */
export const brandNode = {
  '@type': 'Brand',
  '@id': ID_BRAND,
  name: 'InfoWebWorld',
  logo: { '@id': ID_LOGO },
  slogan: 'Discover. Compare. Decide. The global directory built for the AI era.',
}

/** Canonical WebSite node with SearchAction for sitelinks search box. */
export const websiteNode = {
  '@type': 'WebSite',
  '@id': ID_WEBSITE,
  url: BASE_URL,
  name: 'InfoWebWorld',
  publisher: { '@id': ID_ORG },
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

/** Build a BreadcrumbList from {name, url} pairs. */
export function breadcrumbNode(items: Array<{ name: string; url: string }>, breadcrumbId: string) {
  return {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}

/** FAQPage builder — pass Q&A pairs and an @id. */
export function faqNode(
  items: Array<{ q: string; a: string }>,
  faqId: string,
  partOfId?: string,
) {
  return {
    '@type': 'FAQPage',
    '@id': faqId,
    ...(partOfId ? { isPartOf: { '@id': partOfId } } : {}),
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a, inLanguage: 'en-US' },
    })),
  }
}

/** HowTo builder — for procedural pages like /write-review. */
export function howToNode(opts: {
  id: string
  name: string
  description: string
  steps: Array<{ name: string; text: string; url?: string }>
  totalTime?: string
}) {
  return {
    '@type': 'HowTo',
    '@id': opts.id,
    name: opts.name,
    description: opts.description,
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    step: opts.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
    })),
  }
}

/** ItemList builder — for indices, fact sheets, role lists, etc. */
export function itemListNode(
  items: Array<{ name: string; url?: string; description?: string }>,
  id: string,
  name: string,
) {
  return {
    '@type': 'ItemList',
    '@id': id,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      ...(it.url ? { url: it.url } : {}),
      ...(it.description ? { description: it.description } : {}),
    })),
  }
}

/** Service builder — for /affiliates, /agencies, /removals. */
export function serviceNode(opts: {
  id: string
  name: string
  description: string
  serviceType?: string
  audience?: string[]
  offers?: Array<{ name: string; description?: string; price?: string; priceCurrency?: string }>
  areaServed?: string
}) {
  return {
    '@type': 'Service',
    '@id': opts.id,
    name: opts.name,
    description: opts.description,
    ...(opts.serviceType ? { serviceType: opts.serviceType } : {}),
    provider: { '@id': ID_ORG },
    areaServed: opts.audience
      ? opts.audience.map(a => ({ '@type': 'Audience', audienceType: a }))
      : opts.areaServed ?? 'Worldwide',
    ...(opts.offers
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: opts.name,
            itemListElement: opts.offers.map(o => ({
              '@type': 'Offer',
              name: o.name,
              ...(o.description ? { description: o.description } : {}),
              ...(o.price ? { price: o.price, priceCurrency: o.priceCurrency ?? 'USD' } : {}),
            })),
          },
        }
      : {}),
  }
}

/** Article builder — for editorial-flavored pages like /category-guides, /content-guidelines. */
export function articleNode(opts: {
  id: string
  headline: string
  description: string
  pageUrl: string
  dateModified?: string
  datePublished?: string
  articleSection?: string
  wordCount?: number
  about?: string[]
  keywords?: string[]
}) {
  return {
    '@type': 'Article',
    '@id': opts.id,
    headline: opts.headline,
    description: opts.description,
    url: opts.pageUrl,
    mainEntityOfPage: opts.pageUrl,
    inLanguage: 'en-US',
    author: { '@id': ID_ORG },
    publisher: { '@id': ID_ORG },
    image: { '@id': ID_LOGO },
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...(opts.articleSection ? { articleSection: opts.articleSection } : {}),
    ...(opts.wordCount ? { wordCount: opts.wordCount } : {}),
    ...(opts.about
      ? { about: opts.about.map(name => ({ '@type': 'Thing', name })) }
      : {}),
    ...(opts.keywords ? { keywords: opts.keywords.join(', ') } : {}),
  }
}
