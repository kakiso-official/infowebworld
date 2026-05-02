import type { Metadata } from 'next'
import { Suspense } from 'react'

/* Fully static — taxonomy comes from app/config/categories-data.ts (generated
   by scripts/export-categories.mjs). No DB queries, no ISR, no force-dynamic.
   Pages are pre-rendered at deploy time and served from the CDN for free. */
export const dynamic = 'force-static'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AiDisclaimer from '../components/AiDisclaimer'
import CategoriesBrowse from './CategoriesBrowse'
import { CATEGORIES } from '../config/categories-data'

const DOMAIN = 'https://infowebworld.com'

export async function generateMetadata(): Promise<Metadata> {
  const year = new Date().getFullYear()

  const title = `Business Categories ${year} | InfoWebWorld`
  const description = `Browse 500+ business categories across AI, SaaS, IT Services, Startups & more. Compare verified companies worldwide.`
  const url = `${DOMAIN}/categories`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'InfoWebWorld', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: false, follow: false },
  }
}

export default async function CategoriesPage() {
  /* Stats come from the static file — used only for the SEO skeleton below.
     The actual tree is imported directly inside <CategoriesBrowse> (client),
     so the 14K rows never get serialized into the HTML hydration payload. */
  const sectors = CATEGORIES.filter(r => r.level === 1).length
  const l2Count = CATEGORIES.filter(r => r.level === 2).length
  const l3Count = CATEGORIES.filter(r => r.level === 3).length

  const year = new Date().getFullYear()
  const title = `Business Categories ${year} | InfoWebWorld`
  const description = `Browse 500+ business categories across AI, SaaS, IT Services, Startups & more. Compare verified companies worldwide.`
  const url = `${DOMAIN}/categories`

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
        <h1 className="cd-server-h1">Business Categories</h1>
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
