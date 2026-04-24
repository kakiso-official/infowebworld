import type { Metadata } from 'next'
import { Suspense } from 'react'

/* Fully static — taxonomy comes from app/config/categories-data.ts (generated
   by scripts/export-categories.mjs). No DB queries, no ISR, no force-dynamic.
   Pages are pre-rendered at deploy time and served from the CDN for free. */
export const dynamic = 'force-static'

import { VALID_COUNTRIES, COUNTRY_LABELS } from '../../config/countries'
import type { CountryCode } from '../../config/countries'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import AiDisclaimer from '../../components/AiDisclaimer'
import CategoriesBrowse from './CategoriesBrowse'
import { CATEGORIES } from '../../config/categories-data'

const DOMAIN = 'https://infowebworld.com'

/* Pre-render every supported country at build time — 7 pages total. */
export async function generateStaticParams() {
  return VALID_COUNTRIES.map((country) => ({ country }))
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params
  const countryName = COUNTRY_LABELS[country as CountryCode] || 'United States'
  const year = new Date().getFullYear()

  const title = `Business Categories in ${countryName} ${year} | InfoWebWorld`
  const description = `Browse 500+ business categories across AI, SaaS, IT Services, Startups & more. Compare verified companies in ${countryName}.`
  const url = `${DOMAIN}${country === 'global' ? '' : `/${country}`}/categories`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en-IN': `${DOMAIN}/in/categories`,
        'en-US': `${DOMAIN}/us/categories`,
        'en-GB': `${DOMAIN}/uk/categories`,
        'en-AU': `${DOMAIN}/au/categories`,
        'en-CA': `${DOMAIN}/ca/categories`,
        'x-default': `${DOMAIN}/categories`,
      },
    },
    openGraph: { title, description, url, siteName: 'InfoWebWorld', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: false, follow: false },
  }
}

export default async function CategoriesPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const countryName = COUNTRY_LABELS[country as CountryCode] || 'United States'

  /* Stats come from the static file — used only for the SEO skeleton below.
     The actual tree is imported directly inside <CategoriesBrowse> (client),
     so the 14K rows never get serialized into the HTML hydration payload. */
  const sectors = CATEGORIES.filter(r => r.level === 1).length
  const l2Count = CATEGORIES.filter(r => r.level === 2).length
  const l3Count = CATEGORIES.filter(r => r.level === 3).length

  const year = new Date().getFullYear()
  const title = `Business Categories in ${countryName} ${year} | InfoWebWorld`
  const description = `Browse 500+ business categories across AI, SaaS, IT Services, Startups & more. Compare verified companies in ${countryName}.`
  const url = `${DOMAIN}${country === 'global' ? '' : `/${country}`}/categories`

  const jsonLd = {
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: DOMAIN },
        { '@type': 'ListItem', position: 2, name: 'Categories' },
      ],
    },
    collection: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url,
      numberOfItems: CATEGORIES.length,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.collection) }}
      />
      <Navbar />
      <div className="cd-server-skeleton">
        <h1 className="cd-server-h1">Business Categories in {countryName}</h1>
        <p className="cd-server-desc">Explore {sectors} industry sectors, {l2Count} categories, and {l3Count} subcategories. Find and compare verified businesses across every industry.</p>
        <h2 className="cd-server-h2">All Sectors</h2>
      </div>
      <Suspense fallback={null}>
        <CategoriesBrowse />
      </Suspense>
      <AiDisclaimer />
      <Footer />
    </>
  )
}
