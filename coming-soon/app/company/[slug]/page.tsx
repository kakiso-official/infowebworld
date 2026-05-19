import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { query, queryOne } from '@/lib/db'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ListingDetailPage from '../../listing/ListingDetailPage'
import { CATEGORIES } from '../../config/categories-data'

/* ─── Static-only config ──────────────────────────────────────────────
   Fully pre-built at deploy time, exactly like /categories. Every
   active/paid listing at deploy time gets baked to static HTML and
   served from the CDN. Slugs not in the build return 404 — newly
   approved listings need a redeploy to go public.

   Tradeoff (deliberate):
   - Pro: every visit is instant, including first-ever. Zero SSR cost.
          No DB calls at request time, ever.
   - Con: an admin approval doesn't make the listing publicly visible
          until the next Vercel deploy. Workflow: approve → deploy.

   Refreshing already-deployed listings:
   - Auto: every 48h the next visitor triggers a background revalidate
           with current DB data (stale-while-revalidate; visitor sees
           old page instantly, fresh one builds in the background).
   - Manual: admin "Rebuild static page" button on /iww-hq/submissions
             calls revalidatePath() to force-refresh that one listing.

   Per-user state (isFollowing / liked / bookmarked / reviewed / current
   user identity) is fetched client-side from /api/listings/[slug]/me on
   mount, so the same cached HTML works for every visitor.
   ──────────────────────────────────────────────────────────────────── */
export const revalidate = 172800        // 48h auto-revalidate of deployed slugs
export const dynamicParams = false       // slugs not in the build → 404 until next deploy

/* Pre-render every active/paid listing at build time. This is the only
   way a listing becomes publicly visible — admin approval alone isn't
   enough; a deploy must happen after approval. */
export async function generateStaticParams() {
  /* Pre-render PRODUCT slugs only — company-mode rows live at /profile,
     not /company. The page query also filters product-only at request
     time as a backup, but pre-rendering only product slugs keeps the
     build output clean. */
  try {
    const rows = await query<{ slug: string }>(
      `SELECT slug FROM submissions
        WHERE status IN ('active','paid')
          AND slug IS NOT NULL AND slug != ''
          AND COALESCE(listing_mode, 'product') = 'product'`
    )
    return rows.map(r => ({ slug: r.slug }))
  } catch (err) {
    /* listing_mode missing → fall back to all-rows query so existing
       prod sites keep building before the migration runs. */
    const msg = err instanceof Error ? err.message : String(err)
    if (/Unknown column.*listing_mode/.test(msg)) {
      try {
        const rows = await query<{ slug: string }>(
          `SELECT slug FROM submissions
            WHERE status IN ('active','paid') AND slug IS NOT NULL AND slug != ''`
        )
        return rows.map(r => ({ slug: r.slug }))
      } catch { return [] }
    }
    console.error('generateStaticParams: DB unreachable, no slugs pre-rendered', err)
    return []
  }
}

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
  /* Strict mode filter: /company/<slug> only resolves PRODUCT listings.
     Company-mode rows (listing_mode='company') live exclusively at
     /profile/<slug>; if a company row happens to share a slug with a
     product (different namespace = same slug allowed since S36), the
     product wins here and the company is invisible at this URL. Pre-
     migration installs without the listing_mode column fall through to
     legacy behaviour via COALESCE. */
  let listing: ListingRow | null = null
  try {
    listing = await queryOne<ListingRow>(
      `SELECT s.*, p.name as plan_name, p.slug as plan_slug,
              c.name as category_name, c.slug as category_slug,
              c.color as category_color, c.icon as category_icon,
              co.name as country_name
       FROM submissions s
       LEFT JOIN plans p ON p.id = s.plan_id
       LEFT JOIN categories c ON c.id = s.category_id
       LEFT JOIN countries co ON co.id = s.country_id
       WHERE s.slug = ? AND s.status IN ('active','paid')
         AND COALESCE(s.listing_mode, 'product') = 'product'
       LIMIT 1`,
      [slug]
    )
  } catch (err) {
    /* listing_mode column not yet migrated — fall back to the
       pre-S36 query so existing product pages still resolve. */
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column.*listing_mode/.test(msg)) throw err
    listing = await queryOne<ListingRow>(
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
  }
  if (!listing) return null

  /* Parent-company linkage — wraps in try/catch so the product page still
     renders for sites that haven't run migration-listings-company-mode.sql
     yet. When set, the hero shows "Made by {Company} ↗" linking to /profile. */
  let parentCompany: { name: string; slug: string; logo_url: string | null } | null = null
  try {
    const row = listing as unknown as { parent_company_id?: number | null }
    if (row.parent_company_id) {
      parentCompany = await queryOne<{ name: string; slug: string; logo_url: string | null }>(
        `SELECT company_name AS name, slug, logo_url
           FROM submissions
          WHERE id = ? AND listing_mode = 'company' AND status IN ('active','paid')
          LIMIT 1`,
        [row.parent_company_id]
      )
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column.*(?:parent_company_id|listing_mode)/.test(msg)) throw err
    /* Pre-migration — skip the join, no badge. */
  }

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

  // Related listings from same category
  const related = await query(
    `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url, s.website,
            c.name as category_name, c.color as category_color
     FROM submissions s
     LEFT JOIN categories c ON c.id = s.category_id
     WHERE s.category_id = ? AND s.id != ? AND s.status IN ('active','paid')
     ORDER BY s.created_at DESC LIMIT 4`,
    [listing.category_id, listing.id]
  )

  /* Siblings — same L3 category first; if fewer than 9 results, broaden to
     the L2 parent's children. Used to drive Alternatives, Customers Also
     Viewed and Popular Comparisons sections in real mode. */
  const SIBLING_COLS = `
    s.id, s.slug, s.company_name, s.tagline, s.logo_url, s.website,
    s.starting_price, s.starting_price_period, s.founded_year, s.team_size,
    s.hq_location, s.city, s.country_id,
    c.name as category_name, c.slug as category_slug, c.color as category_color`

  let siblings = await query(
    `SELECT ${SIBLING_COLS}
       FROM submissions s
       LEFT JOIN categories c ON c.id = s.category_id
      WHERE s.category_id = ? AND s.id != ? AND s.status IN ('active','paid')
      ORDER BY s.created_at DESC
      LIMIT 16`,
    [listing.category_id, listing.id]
  ) as Record<string, unknown>[]

  /* Sibling broadening — walks UP the taxonomy tree:
     L3 → all L3s under same L2 parent → all listings under same L1 sector.
     Ensures even a lone L2 listing (no L3 siblings) finds neighbors at the
     sector level. Stops once we have ≥ 9 siblings. */
  if (siblings.length < 9) {
    const have = new Set(siblings.map(s => Number(s.id)))
    have.add(listing.id)

    /* Step 1: walk one level up — find siblings under the same parent
       category (e.g. same L2 when the listing is an L3). */
    const parent = await queryOne<{ parent_id: number | null }>(
      'SELECT parent_id FROM categories WHERE id = ?',
      [listing.category_id]
    )
    if (parent?.parent_id) {
      const broader = await query(
        `SELECT ${SIBLING_COLS}
           FROM submissions s
           LEFT JOIN categories c ON c.id = s.category_id
          WHERE c.parent_id = ? AND s.status IN ('active','paid')
          ORDER BY s.created_at DESC
          LIMIT 32`,
        [parent.parent_id]
      ) as Record<string, unknown>[]
      for (const r of broader) {
        if (siblings.length >= 16) break
        if (!have.has(Number(r.id))) { siblings.push(r); have.add(Number(r.id)) }
      }
    }

    /* Step 2: still thin — walk one more level up to the L1 sector root.
       This catches the case where the current listing sits in an L2
       directly (no L3) and its L2 has no peer L3s with listings — but
       there ARE listings deeper inside *other* L2s of the same L1. */
    if (siblings.length < 9) {
      const sectorRoot = await queryOne<{ root_id: number }>(
        `WITH RECURSIVE chain AS (
           SELECT id, parent_id FROM categories WHERE id = ?
           UNION ALL
           SELECT c.id, c.parent_id FROM categories c
             JOIN chain ch ON ch.parent_id = c.id
         )
         SELECT id AS root_id FROM chain WHERE parent_id IS NULL LIMIT 1`,
        [listing.category_id]
      )
      if (sectorRoot?.root_id) {
        const sectorBroader = await query(
          `WITH RECURSIVE descendants AS (
             SELECT id FROM categories WHERE id = ?
             UNION ALL
             SELECT c.id FROM categories c
               JOIN descendants d ON d.id = c.parent_id
           )
           SELECT ${SIBLING_COLS}
             FROM submissions s
             LEFT JOIN categories c ON c.id = s.category_id
            WHERE s.category_id IN (SELECT id FROM descendants)
              AND s.status IN ('active','paid')
            ORDER BY s.created_at DESC
            LIMIT 32`,
          [sectorRoot.root_id]
        ) as Record<string, unknown>[]
        for (const r of sectorBroader) {
          if (siblings.length >= 16) break
          if (!have.has(Number(r.id))) { siblings.push(r); have.add(Number(r.id)) }
        }
      }
    }
  }

  /* Related categories — derived from the static taxonomy, zero DB cost.
     Strategy:
       1) Same parent_id (true siblings of the listing's L3 category).
       2) If <12, broaden to "cousins": L3s whose parent is a sibling of the
          listing's parent — i.e. share a grandparent.
       3) Sorted by listing_count desc so populated categories surface first.
     Returns [{ name, slug, sectorSlug, color }] with sectorSlug used to build
     the canonical /{sector}/{slug} URL on the listing page. */
  type RelatedCat = { name: string; slug: string; sectorSlug: string; color: string }
  let relatedCategories: RelatedCat[] = []
  if (listing.category_id) {
    const myCat = CATEGORIES.find(c => c.id === listing.category_id)
    if (myCat) {
      const candidates = CATEGORIES.filter(c =>
        c.parent_id === myCat.parent_id &&
        c.id !== myCat.id &&
        c.level === myCat.level
      )
      if (candidates.length < 12 && myCat.parent_id != null) {
        const myParent = CATEGORIES.find(c => c.id === myCat.parent_id)
        if (myParent?.parent_id != null) {
          const auntsAndUncles = new Set(
            CATEGORIES
              .filter(c => c.parent_id === myParent.parent_id && c.id !== myParent.id)
              .map(c => c.id)
          )
          const have = new Set(candidates.map(c => c.id))
          const cousins = CATEGORIES.filter(c =>
            c.parent_id != null && auntsAndUncles.has(c.parent_id) &&
            c.level === myCat.level &&
            !have.has(c.id)
          )
          for (const c of cousins) {
            if (candidates.length >= 12) break
            candidates.push(c)
            have.add(c.id)
          }
        }
      }
      candidates.sort((a, b) => {
        if (b.listing_count !== a.listing_count) return b.listing_count - a.listing_count
        return a.name.localeCompare(b.name)
      })
      relatedCategories = candidates.slice(0, 12).map(c => ({
        name: c.name,
        slug: c.slug,
        sectorSlug: c.sector_slug || '',
        color: c.color,
      }))
    }
  }

  /* Engagement counts — three aggregate queries. Cheap. */
  const followsRow = await queryOne<{ c: number }>(
    'SELECT COUNT(*) AS c FROM listing_follows WHERE listing_id = ?',
    [listing.id]
  )
  const likesRow = await queryOne<{ c: number }>(
    "SELECT COUNT(*) AS c FROM listing_reactions WHERE listing_id = ? AND kind = 'like'",
    [listing.id]
  )
  const dislikesRow = await queryOne<{ c: number }>(
    "SELECT COUNT(*) AS c FROM listing_reactions WHERE listing_id = ? AND kind = 'dislike'",
    [listing.id]
  )
  const bookmarksRow = await queryOne<{ c: number }>(
    'SELECT COUNT(*) AS c FROM listing_bookmarks WHERE listing_id = ?',
    [listing.id]
  )

  /* Reviews aggregate. */
  const reviewAggRow = await queryOne<{ avg_rating: number | null; review_count: number }>(
    `SELECT AVG(rating) AS avg_rating, COUNT(*) AS review_count
       FROM reviews WHERE listing_id = ? AND status = 'approved'`,
    [listing.id]
  )

  /* Latest 6 reviews, lazy-loaded for the insights section. */
  const recentReviews = await query(
    `SELECT r.id, r.rating, r.title, r.body, r.created_at,
            u.name AS user_name, u.avatar_url AS user_avatar_url
       FROM reviews r
       LEFT JOIN business_users u ON u.id = r.user_id
      WHERE r.listing_id = ? AND r.status = 'approved'
      ORDER BY r.created_at DESC LIMIT 6`,
    [listing.id]
  )

  /* No cookies() / per-user fetch here — that would force the page out of
     the static cache. The client hydrates per-user state via
     GET /api/listings/[slug]/me right after mount. Default to anon shape. */
  return {
    listing,
    parentCompany,
    breadcrumb: crumbs,
    related: related as Record<string, unknown>[],
    relatedCategories,
    siblings,
    engagement: {
      followers: Number(followsRow?.c || 0),
      likes: Number(likesRow?.c || 0),
      dislikes: Number(dislikesRow?.c || 0),
      bookmarks: Number(bookmarksRow?.c || 0),
    },
    reviews: {
      avgRating: reviewAggRow?.avg_rating ? Number(reviewAggRow.avg_rating) : 0,
      reviewCount: Number(reviewAggRow?.review_count || 0),
      recent: recentReviews as Record<string, unknown>[],
    },
    /* These two are intentionally anon-defaulted on the server. Client
       hydrates the real values from /api/listings/[slug]/me. */
    userState: {
      isFollowing: false,
      reaction: null as 'like' | 'dislike' | null,
      isBookmarked: false,
      hasReviewed: false,
      currentUser: null as { name: string | null; avatarUrl: string | null; email: string | null } | null,
    },
    isAuthed: false,
  }
}

/* ── Safely serialize mysql2 row to plain JSON (strips Buffers etc.) ── */
function serialize<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj, (_key, value) => {
    if (value && typeof value === 'object' && value.type === 'Buffer' && Array.isArray(value.data)) {
      return Buffer.from(value.data).toString('utf8')
    }
    return value
  }))
}

function parseJson(val: unknown): unknown[] {
  if (!val) return []
  if (typeof val === 'string') { try { return JSON.parse(val) } catch { return [] } }
  if (Array.isArray(val)) return val
  return []
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
    robots: { index: false, follow: false },
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
    ...breadcrumb.map((bc, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      name: bc.name,
      item: i === 0 ? `https://infowebworld.com/${bc.slug}` : `https://infowebworld.com/${breadcrumb[0].slug}/${bc.slug}`,
    })),
    { '@type': 'ListItem', position: breadcrumb.length + 2, name: companyName },
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
    business.additionalType = `https://infowebworld.com/${L.category_slug}`
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

  // Serialize to plain JSON to avoid mysql2 Buffer objects breaking client hydration.
  const initialData = serialize({
    listing: data.listing as unknown as Record<string, unknown>,
    parentCompany: data.parentCompany,
    breadcrumb: data.breadcrumb,
    related: data.related,
    relatedCategories: data.relatedCategories,
    siblings: data.siblings,
    engagement: data.engagement,
    reviews: data.reviews,
    userState: data.userState,
    isAuthed: data.isAuthed,
  })

  return (
    <>
      {/* Server-rendered JSON-LD — visible to ALL crawlers, Google AI Overview, social bots */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Navbar />
      <Suspense><ListingDetailPage slug={slug} initialData={initialData} /></Suspense>
      <Footer />
    </>
  )
}
