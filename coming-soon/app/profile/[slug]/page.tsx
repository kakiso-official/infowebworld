import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { query, queryOne } from '@/lib/db'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CompanyDetailPage from '../CompanyDetailPage'

/* ─── Static-only config ──────────────────────────────────────────────
   Same delivery model as /company/[slug]: every active/paid company
   profile pre-built at deploy time and served from the CDN. Slugs not
   in the build return 404. Workflow: approve → deploy → visible.

   Refresh strategies:
   - Auto: 48h stale-while-revalidate
   - Manual: admin "Rebuild" button on /iww-hq/submissions

   No per-user state on this page in v1 (no follow/bookmark/review on
   companies yet — those are product-level). The same cached HTML
   serves every visitor. If we add company-level engagement later, hydrate
   client-side from /api/companies/[slug]/me without breaking SSG.
   ──────────────────────────────────────────────────────────────────── */
export const revalidate = 172800
export const dynamicParams = false

export async function generateStaticParams() {
  try {
    const rows = await query<{ slug: string }>(
      `SELECT slug FROM submissions
        WHERE listing_mode = 'company'
          AND status IN ('active','paid')
          AND slug IS NOT NULL AND slug != ''`
    )
    return rows.map(r => ({ slug: r.slug }))
  } catch (err) {
    console.error('generateStaticParams (profile): DB unreachable, no slugs pre-rendered', err)
    return []
  }
}

interface CompanyRow {
  id: number
  slug: string
  uuid: string
  company_name: string
  contact_name: string
  email: string
  phone: string | null
  phone_code: string | null
  website: string | null
  tagline: string
  description: string | null
  logo_url: string | null
  founded_year: string | null
  team_size: string | null
  hq_location: string | null
  city: string | null
  state: string | null
  linkedin: string | null
  twitter: string | null
  facebook: string | null
  funding: string | null
  is_hiring: number
  header_tags: string | null
  faqs: string | null
  status: string
  created_at: string
  updated_at: string
  verified: number
  verified_at: string | null
  category_id: number | null
  category_name: string | null
  category_slug: string | null
  category_color: string | null
  country_name: string | null
  plan_name: string | null
  plan_slug: string | null
}

interface ProductRow {
  id: number
  slug: string
  company_name: string
  tagline: string
  logo_url: string | null
  starting_price: string | number | null
  starting_price_period: string | null
  category_name: string | null
  category_slug: string | null
  category_color: string | null
}

async function getCompanyBySlug(slug: string) {
  /* Verification fields are tolerated when missing (pre-migration);
     the row simply comes back without them and the page reads them as
     undefined → false / empty string in the client. */
  let company: CompanyRow | null = null
  try {
    company = await queryOne<CompanyRow>(
      `SELECT s.*, p.name AS plan_name, p.slug AS plan_slug,
              c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
              co.name AS country_name
         FROM submissions s
         LEFT JOIN plans p       ON p.id  = s.plan_id
         LEFT JOIN categories c  ON c.id  = s.category_id
         LEFT JOIN countries co  ON co.id = s.country_id
        WHERE s.slug = ?
          AND s.listing_mode = 'company'
          AND s.status IN ('active','paid')
        LIMIT 1`,
      [slug]
    )
  } catch (err) {
    /* If the listing_mode column doesn't exist yet (pre-migration), the
       page can't render. Fall through to 404 — admin should run the
       migration. */
    const msg = err instanceof Error ? err.message : String(err)
    if (/Unknown column.*listing_mode/.test(msg)) {
      console.warn('[profile/[slug]] migration-listings-company-mode not yet applied')
      return null
    }
    throw err
  }
  if (!company) return null

  /* Products made by this company — for the "Products by us" section. */
  const products = await query<ProductRow>(
    `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url,
            s.starting_price, s.starting_price_period,
            c.name AS category_name, c.slug AS category_slug, c.color AS category_color
       FROM submissions s
       LEFT JOIN categories c ON c.id = s.category_id
      WHERE s.parent_company_id = ?
        AND s.listing_mode = 'product'
        AND s.status IN ('active','paid')
      ORDER BY s.created_at DESC
      LIMIT 24`,
    [company.id]
  )

  return { company, products }
}

function serialize<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj, (_key, value) => {
    if (value && typeof value === 'object' && value.type === 'Buffer' && Array.isArray(value.data)) {
      return Buffer.from(value.data).toString('utf8')
    }
    return value
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = await getCompanyBySlug(slug)
  if (!data) return { title: 'Company Not Found | InfoWebWorld' }

  const C = data.company
  const title = `${C.company_name} - Company Profile | InfoWebWorld`
  const desc = (C.tagline || `${C.company_name} on InfoWebWorld`).slice(0, 160)
  const url = `https://infowebworld.com/profile/${slug}`
  const ogImage = C.logo_url || 'https://infowebworld.com/logo/infowebworldlogo-logoforlightbackgrounds.png'

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    robots: { index: false, follow: false },
    openGraph: {
      type: 'profile',
      title,
      description: desc,
      url,
      siteName: 'InfoWebWorld',
      images: [{ url: ogImage, width: 1200, height: 630, alt: C.company_name }],
    },
    twitter: {
      card: 'summary_large_image',
      title, description: desc, images: [ogImage], site: '@infowebworld',
    },
  }
}

function buildJsonLd(c: CompanyRow) {
  const url = `https://infowebworld.com/profile/${c.slug}`
  const sameAs: string[] = []
  if (c.website) sameAs.push(c.website)
  if (c.linkedin) sameAs.push(c.linkedin)
  if (c.twitter) sameAs.push(c.twitter)
  if (c.facebook) sameAs.push(c.facebook)

  const org: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}#organization`,
    name: c.company_name,
    url: c.website || url,
    description: c.description || c.tagline,
    logo: c.logo_url || undefined,
    foundingDate: c.founded_year || undefined,
    numberOfEmployees: c.team_size
      ? { '@type': 'QuantitativeValue', value: c.team_size }
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  }
  if (c.hq_location || c.city || c.country_name) {
    org.address = {
      '@type': 'PostalAddress',
      ...(c.hq_location && { streetAddress: c.hq_location }),
      ...(c.city && { addressLocality: c.city }),
      ...(c.state && { addressRegion: c.state }),
      ...(c.country_name && { addressCountry: c.country_name }),
    }
  }
  if (c.email) org.email = c.email
  if (c.phone) org.telephone = `${c.phone_code || ''}${c.phone}`
  return org
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getCompanyBySlug(slug)
  if (!data) notFound()

  const jsonLd = buildJsonLd(data.company)
  const initialData = serialize({
    company: data.company as unknown as Record<string, unknown>,
    products: data.products as unknown as Record<string, unknown>[],
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Navbar />
      <Suspense><CompanyDetailPage slug={slug} initialData={initialData} /></Suspense>
      <Footer />
    </>
  )
}
