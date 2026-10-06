import type { Metadata } from 'next'
import type { CategoryCardItem } from '../test-landing-page/CategoriesSection'
import { buildFaqPageJsonLd } from '../home-sections/home-faq-data'
import { sectorLandingPath } from '@/lib/sector-paths'
import type { SectorDirectorySpec } from './types'

/* ═══════════════════════════════════════════════════════════════════════
   Metadata + JSON-LD for the sector directory pages. The spec's exact
   meta title and description are reused verbatim by <title>, the meta
   description, Open Graph, the Twitter card and the CollectionPage node.
   ═══════════════════════════════════════════════════════════════════════ */

const SITE = 'https://www.infowebworld.com'

export function directoryUrl(sector: string): string {
  return `${SITE}${sectorLandingPath(sector)}`
}

function ogImage(sector: string): string {
  return `${SITE}/api/og/${sector}`
}

export function buildDirectoryMetadata(spec: SectorDirectorySpec): Metadata {
  const url = directoryUrl(spec.sector)
  const image = ogImage(spec.sector)
  const { title, description, keywords, ogImageAlt } = spec.meta
  return {
    title,
    description,
    keywords,
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
      images: [{ url: image, width: 1200, height: 630, alt: ogImageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      site: '@infowebworld',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  }
}

/* @graph: Organization + WebSite (same @ids as the homepage), the
   BreadcrumbList, the CollectionPage whose mainEntity is the ItemList of
   the categories in "Browse ... by Category", and the FAQPage built from
   the same array the accordion renders. Only visible content is marked up. */
export function buildDirectoryJsonLd(spec: SectorDirectorySpec, categories: CategoryCardItem[]) {
  const url = directoryUrl(spec.sector)
  const image = ogImage(spec.sector)
  const categoriesId = `${url}#categories`
  return {
    '@context': 'https://schema.org',
    '@graph': [
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
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: spec.breadcrumbName, item: url },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: spec.meta.title,
        description: spec.meta.description,
        inLanguage: 'en-US',
        isPartOf: { '@id': `${SITE}#website` },
        publisher: { '@id': `${SITE}#org` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        about: { '@type': 'Thing', name: spec.meta.about },
        mainEntity: { '@id': categoriesId },
        primaryImageOfPage: { '@type': 'ImageObject', url: image, width: 1200, height: 630 },
        dateModified: new Date().toISOString(),
      },
      {
        '@type': 'ItemList',
        '@id': categoriesId,
        name: spec.categories.listName,
        numberOfItems: categories.length,
        itemListOrder: 'https://schema.org/ItemListUnordered',
        itemListElement: categories.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.label,
          url: `${SITE}${c.href}`,
        })),
      },
      buildFaqPageJsonLd(spec.faqs, url),
    ],
  }
}
