import type { Metadata } from 'next'
import { Suspense } from 'react'
import { query } from '@/lib/db'

/** Cache page on Vercel edge for 60s */
export const revalidate = 60
import { COUNTRY_LABELS, ROOT_COUNTRY } from '../../config/countries'
import type { CountryCode } from '../../config/countries'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CategoriesBrowse from './CategoriesBrowse'

const DOMAIN = 'https://infowebworld.com'

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params
  const countryName = COUNTRY_LABELS[country as CountryCode] || 'United States'
  const year = new Date().getFullYear()

  const title = `Business Categories in ${countryName} ${year} | InfoWebWorld`
  const description = `Browse 500+ business categories across AI, SaaS, IT Services, Startups & more. Compare verified companies in ${countryName}.`
  const url = country === ROOT_COUNTRY ? `${DOMAIN}/categories` : `${DOMAIN}/${country}/categories`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en-IN': `${DOMAIN}/in/categories`,
        'en-US': `${DOMAIN}/categories`,
        'en-GB': `${DOMAIN}/uk/categories`,
        'en-AU': `${DOMAIN}/au/categories`,
        'en-CA': `${DOMAIN}/ca/categories`,
        'en': `${DOMAIN}/categories`,
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

  const rows = await query(
    `SELECT c.*, p.name as parent_name, p.slug as parent_slug,
            CASE WHEN c.level = 1 THEN c.slug WHEN c.level = 2 THEN p.slug WHEN c.level = 3 THEN gp.slug END as sector_slug
     FROM categories c
     LEFT JOIN categories p ON p.id = c.parent_id
     LEFT JOIN categories gp ON gp.id = p.parent_id
     WHERE c.is_launched = 1 AND c.is_active = 1 AND c.is_navigation = 1
     ORDER BY c.sort_order`
  ).catch(() => [])
  const initialCategories = JSON.parse(JSON.stringify(rows))

  const sectors = rows.filter((r: any) => Number(r.level) === 1).length
  const l2Count = rows.filter((r: any) => Number(r.level) === 2).length
  const l3Count = rows.filter((r: any) => Number(r.level) === 3).length

  const year = new Date().getFullYear()
  const title = `Business Categories in ${countryName} ${year} | InfoWebWorld`
  const description = `Browse 500+ business categories across AI, SaaS, IT Services, Startups & more. Compare verified companies in ${countryName}.`
  const url = country === ROOT_COUNTRY ? `${DOMAIN}/categories` : `${DOMAIN}/${country}/categories`

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
      numberOfItems: rows.length,
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
        <h2 className="cd-server-h2">All Categories</h2>
      </div>
      <Suspense fallback={null}>
        <CategoriesBrowse initialCategories={initialCategories} />
      </Suspense>
      <Footer />
    </>
  )
}
