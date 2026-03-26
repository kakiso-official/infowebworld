import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { query, queryOne } from '@/lib/db'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ListingDetailPage from '../../listing/ListingDetailPage'

/* ── Types ── */
interface ListingRow {
  id: number; slug: string; company_name: string; contact_name: string
  email: string; phone: string; phone_code: string; website: string
  tagline: string; description: string; logo_url: string
  features: string; integrations: string; pricing_model: string
  pricing_tiers: string; screenshots: string; demo_video: string
  founded_year: string; team_size: string; funding: string; hq_location: string
  linkedin: string; twitter: string; facebook: string; faqs: string
  city: string; state: string; status: string; created_at: string; updated_at: string
  category_id: number; category_name: string; category_slug: string
  category_color: string; category_icon: string; country_name: string
  plan_name: string; plan_slug: string
}

interface BreadcrumbItem { name: string; slug: string }
interface FaqItem { question: string; answer: string }

/* ── Data fetching (server-side) ── */
async function getListingBySlug(slug: string) {
  const listing = await queryOne<ListingRow>(
    `SELECT s.*, p.name as plan_name, p.slug as plan_slug,
            c.name as category_name, c.slug as category_slug,
            c.color as category_color, c.icon as category_icon,
            co.name as country_name
     FROM submissions s
     LEFT JOIN plans p ON p.id = s.plan_id
     LEFT JOIN categories c ON c.id = s.category_id
     LEFT JOIN countries co ON co.id = s.country_id
     WHERE s.slug = ? AND s.status IN ('active','paid')
     LIMIT 1`,
    [slug]
  )
  if (!listing) return null

  // Build breadcrumb
  interface CatRow { id: number; name: string; slug: string; parent_id: number | null }
  const crumbs: BreadcrumbItem[] = []
  let currentId: number | null = listing.category_id
  while (currentId) {
    const cat: CatRow | null = await queryOne<CatRow>(
      'SELECT id, name, slug, parent_id FROM categories WHERE id = ?',
      [currentId]
    )
    if (!cat) break
    crumbs.unshift({ name: cat.name, slug: cat.slug })
    currentId = cat.parent_id
  }

  return { listing, breadcrumb: crumbs }
}

function parseJson(val: unknown): unknown[] {
  if (!val) return []
  if (typeof val === 'string') { try { return JSON.parse(val) } catch { return [] } }
  if (Array.isArray(val)) return val
  return []
}

/* Map DB row → client RealSubmission shape (String() matches client-side mapRow) */
function toClientListing(r: ListingRow) {
  return {
    id: String(r.id ?? ''),
    companyName: String(r.company_name ?? ''),
    contactName: String(r.contact_name ?? ''),
    email: String(r.email ?? ''),
    phoneCode: String(r.phone_code ?? '+1'),
    phone: String(r.phone ?? ''),
    website: String(r.website ?? ''),
    category: String(r.category_name ?? ''),
    categorySlug: String(r.category_slug ?? ''),
    categoryColor: String(r.category_color ?? '#E8553D'),
    categoryIcon: String(r.category_icon ?? 'grid'),
    country: String(r.country_name ?? ''),
    city: String(r.city ?? ''),
    state: String(r.state ?? ''),
    tagline: String(r.tagline ?? ''),
    description: String(r.description ?? ''),
    slug: String(r.slug ?? ''),
    logoUrl: String(r.logo_url ?? ''),
    screenshots: parseJson(r.screenshots) as string[],
    demoVideo: String(r.demo_video ?? ''),
    features: parseJson(r.features) as string[],
    integrations: parseJson(r.integrations) as string[],
    pricingModel: String(r.pricing_model ?? 'contact'),
    pricingTiers: parseJson(r.pricing_tiers) as { name: string; price: string; period: string }[],
    founded: String(r.founded_year ?? ''),
    employees: String(r.team_size ?? ''),
    funding: String(r.funding ?? ''),
    hqLocation: String(r.hq_location ?? ''),
    linkedin: String(r.linkedin ?? ''),
    twitter: String(r.twitter ?? ''),
    facebook: String(r.facebook ?? ''),
    faqs: parseJson(r.faqs) as { question: string; answer: string }[],
    plan: String(r.plan_slug ?? ''),
    planName: String(r.plan_name ?? ''),
    status: (String(r.status) as 'active' | 'paid' | 'pending') || 'pending',
    submittedAt: String(r.created_at ?? ''),
    approvedAt: '',
  }
}

/* Fetch related listings in same category */
async function getRelated(categoryId: number, excludeId: number) {
  const rows = await query<ListingRow>(
    `SELECT s.*, c.name as category_name, c.slug as category_slug,
            c.color as category_color, c.icon as category_icon,
            co.name as country_name, p.name as plan_name, p.slug as plan_slug
     FROM submissions s
     LEFT JOIN plans p ON p.id = s.plan_id
     LEFT JOIN categories c ON c.id = s.category_id
     LEFT JOIN countries co ON co.id = s.country_id
     WHERE s.category_id = ? AND s.id != ? AND s.status IN ('active','paid')
     LIMIT 4`,
    [categoryId, excludeId]
  )
  return rows.map(toClientListing)
}

/* ══════════════════════════════════════════════════════════════
   generateMetadata — server-side SEO (CRITICAL for crawlers)
   ══════════════════════════════════════════════════════════════ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = await getListingBySlug(slug)
  if (!data) return { title: 'Listing Not Found | InfoWebWorld' }

  const L = data.listing
  const companyName = L.company_name
  const category = L.category_name || 'Business'
  const city = L.city || ''
  const country = L.country_name || ''
  const location = [city, country].filter(Boolean).join(', ')
  const tagline = L.tagline || `${companyName} — discover, compare, and connect on InfoWebWorld`

  // Title: {Company} - {Category} | InfoWebWorld (max ~60 chars)
  const title = `${companyName} - ${category} | InfoWebWorld`

  // Description: 120-155 chars, action-oriented, with keywords
  const descParts = [
    `Discover ${companyName}: ${tagline}.`,
    location ? `${location}.` : '',
    `Read reviews, compare pricing & connect on InfoWebWorld.`,
  ]
  const description = descParts.filter(Boolean).join(' ').slice(0, 160)

  const url = `https://infowebworld.com/company/${slug}`
  const ogImage = L.logo_url || 'https://infowebworld.com/logo/infowebworldlogo-logoforlightbackgrounds.png'

  return {
    title,
    description,
    keywords: [companyName, category, 'business directory', 'reviews', 'compare', location, 'InfoWebWorld'].filter(Boolean),
    authors: [{ name: 'InfoWebWorld' }],
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1 as number,
      'max-image-preview': 'large' as const,
      'max-video-preview': -1 as number,
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      siteName: 'InfoWebWorld',
      locale: 'en_US',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${companyName} profile on InfoWebWorld`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      site: '@infowebworld',
    },
    other: {
      'geo.region': country || '',
      'geo.placename': city || '',
    },
  }
}

/* ══════════════════════════════════════════════════════════════
   Build JSON-LD @graph — the GOD-LEVEL structured data
   ══════════════════════════════════════════════════════════════ */
function buildJsonLd(listing: ListingRow, breadcrumb: BreadcrumbItem[]) {
  const L = listing
  const companyName = L.company_name
  const url = `https://infowebworld.com/company/${L.slug}`
  const features = parseJson(L.features) as string[]
  const faqs = parseJson(L.faqs) as FaqItem[]

  // ── 1. WebPage schema ──
  const webPage: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: `${companyName} - ${L.category_name || 'Business'} | InfoWebWorld`,
    description: L.tagline || `${companyName} on InfoWebWorld`,
    isPartOf: { '@id': 'https://infowebworld.com#website' },
    about: { '@id': `${url}#business` },
    datePublished: L.created_at ? new Date(L.created_at).toISOString().split('T')[0] : undefined,
    dateModified: (L.updated_at || L.created_at) ? new Date(L.updated_at || L.created_at).toISOString().split('T')[0] : undefined,
    breadcrumb: { '@id': `${url}#breadcrumb` },
    inLanguage: 'en-US',
  }

  // ── 2. BreadcrumbList schema ──
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://infowebworld.com' },
    { '@type': 'ListItem', position: 2, name: 'Categories', item: 'https://infowebworld.com/categories' },
    ...breadcrumb.map((bc, i) => ({
      '@type': 'ListItem',
      position: i + 3,
      name: bc.name,
      item: `https://infowebworld.com/category/${bc.slug}`,
    })),
    { '@type': 'ListItem', position: breadcrumb.length + 3, name: companyName },
  ]

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: breadcrumbItems,
  }

  // ── 3. LocalBusiness / Organization schema (full) ──
  const sameAs: string[] = []
  if (L.website) sameAs.push(L.website)
  if (L.linkedin) sameAs.push(L.linkedin)
  if (L.twitter) sameAs.push(L.twitter)
  if (L.facebook) sameAs.push(L.facebook)

  const business: Record<string, unknown> = {
    '@type': 'LocalBusiness',
    '@id': `${url}#business`,
    name: companyName,
    description: L.description || L.tagline || `${companyName} — listed on InfoWebWorld`,
    url: L.website || url,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    image: L.logo_url || undefined,
    logo: L.logo_url
      ? { '@type': 'ImageObject', url: L.logo_url, width: 512, height: 512 }
      : undefined,
  }

  // Address
  if (L.hq_location || L.city || L.country_name) {
    business.address = {
      '@type': 'PostalAddress',
      ...(L.hq_location && { streetAddress: L.hq_location }),
      ...(L.city && { addressLocality: L.city }),
      ...(L.state && { addressRegion: L.state }),
      ...(L.country_name && { addressCountry: L.country_name }),
    }
  }

  // Contact
  if (L.phone) business.telephone = `${L.phone_code || ''}${L.phone}`
  if (L.email) business.email = L.email

  // Company details
  if (L.founded_year) business.foundingDate = L.founded_year
  if (L.team_size) {
    business.numberOfEmployees = {
      '@type': 'QuantitativeValue',
      value: L.team_size,
    }
  }

  // Area served
  if (L.country_name) {
    business.areaServed = {
      '@type': 'Country',
      name: L.country_name,
    }
  }

  // Social profiles
  if (sameAs.length) business.sameAs = sameAs

  // Services / features as offer catalog
  if (features.length > 0) {
    business.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: `${companyName} Features & Services`,
      itemListElement: features.slice(0, 10).map(f => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: f,
        },
      })),
    }
  }

  // Category
  if (L.category_name) {
    business.additionalType = `https://infowebworld.com/category/${L.category_slug}`
  }

  // ── 4. FAQPage schema (CRITICAL for AI Overview — 3.2x more likely to appear) ──
  let faqSchema: Record<string, unknown> | null = null
  if (faqs.length > 0) {
    faqSchema = {
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    }
  }

  // ── 5. WebSite reference ──
  const webSite = {
    '@type': 'WebSite',
    '@id': 'https://infowebworld.com#website',
    name: 'InfoWebWorld',
    url: 'https://infowebworld.com',
    description: 'The global business discovery platform. Search, compare, and review businesses across 80+ industries.',
    publisher: { '@id': 'https://infowebworld.com#organization' },
  }

  // ── 6. Publisher Organization ──
  const publisher = {
    '@type': 'Organization',
    '@id': 'https://infowebworld.com#organization',
    name: 'InfoWebWorld',
    url: 'https://infowebworld.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://infowebworld.com/logo/infowebworldlogo-logoforlightbackgrounds.png',
    },
    sameAs: [
      'https://twitter.com/infowebworld',
      'https://linkedin.com/company/infowebworld',
      'https://instagram.com/infowebworld',
    ],
  }

  // ── Combine into @graph ──
  const graph: Record<string, unknown>[] = [
    webSite,
    publisher,
    webPage,
    breadcrumbSchema,
    business,
  ]
  if (faqSchema) graph.push(faqSchema)

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

/* ══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getListingBySlug(slug)

  if (!data) notFound()

  const jsonLd = buildJsonLd(data.listing, data.breadcrumb)
  const clientListing = toClientListing(data.listing)
  const relatedListings = await getRelated(data.listing.category_id, data.listing.id)

  return (
    <>
      {/* Server-rendered JSON-LD — visible to ALL crawlers, Google AI Overview, social bots */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Navbar />
      <ListingDetailPage
        slug={slug}
        initialData={{
          listing: clientListing,
          breadcrumb: data.breadcrumb,
          related: relatedListings,
        }}
      />
      <Footer />
    </>
  )
}
