import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { query, queryOne } from '@/lib/db'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CompanyDetailPage from '../CompanyDetailPage'
import LocalBusinessProfilePage from '../LocalBusinessProfilePage'

/* ─── Static-only config ──────────────────────────────────────────────
   Same delivery model as /company/[slug]: every active/paid company
   profile pre-built at deploy time and served from the CDN. Slugs not
   in the build return 404. Workflow: approve → deploy → visible.

   Refresh strategies:
   - Auto: 48h stale-while-revalidate
   - Manual: admin "Rebuild" button on /iww-hq/submissions

   Per-user state (follow / bookmark / write-review) hydrates client-side
   from /api/listings/[slug]/me on mount, so the same cached HTML serves
   every visitor.
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
  user_id: number | null
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
  /* ── Listings V3 (industries / awards / languages / sizes shared with profile) ── */
  industries_served: string | null
  target_company_sizes: string | null
  languages: string | null
  awards: string | null
  /* ── Clutch-style fields (S37) ── */
  min_project_size: string | null
  hourly_rate: string | null
  common_project_size: string | null
  intro_video_url: string | null
  timezones: string | null
  service_lines: string | null
  focus_breakdown: string | null
  client_logos: string | null
  clients_summary: string | null
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

/** Cross-marketing — companies in same/similar sector. Drives the
 *  "Similar agencies" + "Compare alternatives" sections. */
interface SimilarCompanyRow {
  id: number
  slug: string
  company_name: string
  tagline: string | null
  logo_url: string | null
  min_project_size: string | null
  hourly_rate: string | null
  team_size: string | null
  founded_year: string | null
  city: string | null
  state: string | null
  category_name: string | null
  category_color: string | null
  country_name: string | null
}

/** Cross-marketing — products by OTHER companies in same sector. */
interface PopularToolRow {
  id: number
  slug: string
  company_name: string
  tagline: string | null
  logo_url: string | null
  starting_price: string | number | null
  starting_price_period: string | null
  category_name: string | null
  category_color: string | null
  parent_company_name: string | null
  parent_company_slug: string | null
}

/** Cross-marketing — sibling L2 categories under the same L1 sector for
 *  the bottom Related categories folder-icon grid. */
interface RelatedCategoryRow {
  id: number
  name: string
  slug: string
  color: string | null
}

async function getCompanyBySlug(slug: string) {
  /* All Clutch-style fields tolerated when missing (pre-migration); the
     row simply comes back without them and the client reads them as ''. */
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
       migration. The Clutch-style columns are tolerated automatically by
       the SELECT s.* — missing columns just don't appear in the row. */
    const msg = err instanceof Error ? err.message : String(err)
    if (/Unknown column.*listing_mode/.test(msg)) {
      console.warn('[profile/[slug]] migration-listings-company-mode not yet applied')
      return null
    }
    /* Ditto Clutch-style columns: if any of them are missing the SELECT
       returns just the columns that exist. mysql2 won't error on SELECT *.
       Only an explicit reference to a missing column would. */
    throw err
  }
  if (!company) return null

  /* Breadcrumb — walk the category ancestry (L1 → leaf) so the company page
     renders the same crumb trail as the product page. */
  interface CrumbCat { id: number; name: string; slug: string; parent_id: number | null }
  const breadcrumb: { name: string; slug: string }[] = []
  let crumbId: number | null = company.category_id
  for (let hop = 0; crumbId && hop < 8; hop++) {
    const cat: CrumbCat | null = await queryOne<CrumbCat>(
      'SELECT id, name, slug, parent_id FROM categories WHERE id = ? LIMIT 1',
      [crumbId]
    )
    if (!cat) break
    breadcrumb.unshift({ name: cat.name, slug: cat.slug })
    crumbId = cat.parent_id
  }

  /* Products made by this company — for the "Products by us" section.
     Match by parent_company_id (set automatically on submit since S36) OR
     by same user_id (covers legacy products created before the migration
     ran, since one-company-per-user means the owner's other products are
     unambiguously theirs). */
  const products = await query<ProductRow>(
    `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url,
            s.starting_price, s.starting_price_period,
            c.name AS category_name, c.slug AS category_slug, c.color AS category_color
       FROM submissions s
       LEFT JOIN categories c ON c.id = s.category_id
      WHERE (s.parent_company_id = ? OR (s.user_id = ? AND s.user_id IS NOT NULL))
        AND s.listing_mode = 'product'
        AND s.status IN ('active','paid')
      ORDER BY s.created_at DESC
      LIMIT 24`,
    [company.id, company.user_id]
  )

  /* ── Cross-marketing fetches (3 sections at the bottom of the page).
        All cheap — limited row counts, simple JOINs. Cached for 48h via
        the page's `revalidate` constant. ── */

  /* Similar companies — same category as this one (or same parent if
     too few). Used for both "Similar agencies" and "Compare alternatives"
     sections. */
  let similarCompanies: SimilarCompanyRow[] = []
  try {
    similarCompanies = await query<SimilarCompanyRow>(
      `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url,
              s.min_project_size, s.hourly_rate, s.team_size, s.founded_year,
              s.city, s.state,
              c.name AS category_name, c.color AS category_color,
              co.name AS country_name
         FROM submissions s
         LEFT JOIN categories c ON c.id = s.category_id
         LEFT JOIN countries co ON co.id = s.country_id
        WHERE s.id != ?
          AND s.listing_mode = 'company'
          AND s.status IN ('active','paid')
          ${company.category_id ? 'AND s.category_id = ?' : ''}
        ORDER BY s.created_at DESC
        LIMIT 8`,
      company.category_id ? [company.id, company.category_id] : [company.id]
    )
    /* Broaden to all categories if we found fewer than 4 — better to show
       cross-sector neighbours than a half-empty grid. */
    if (similarCompanies.length < 4) {
      const seen = new Set(similarCompanies.map(s => s.id))
      seen.add(company.id)
      const broader = await query<SimilarCompanyRow>(
        `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url,
                s.min_project_size, s.hourly_rate, s.team_size, s.founded_year,
                s.city, s.state,
                c.name AS category_name, c.color AS category_color,
                co.name AS country_name
           FROM submissions s
           LEFT JOIN categories c ON c.id = s.category_id
           LEFT JOIN countries co ON co.id = s.country_id
          WHERE s.listing_mode = 'company'
            AND s.status IN ('active','paid')
          ORDER BY s.created_at DESC
          LIMIT 16`
      )
      for (const r of broader) {
        if (similarCompanies.length >= 8) break
        if (!seen.has(r.id)) { similarCompanies.push(r); seen.add(r.id) }
      }
    }
  } catch (err) {
    /* Tolerate missing min_project_size / hourly_rate columns
       (pre-Clutch-migration). Fall through to a slim SELECT. */
    const msg = err instanceof Error ? err.message : String(err)
    if (/Unknown column.*(?:min_project_size|hourly_rate)/.test(msg)) {
      similarCompanies = await query<SimilarCompanyRow>(
        `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url,
                NULL AS min_project_size, NULL AS hourly_rate,
                s.team_size, s.founded_year, s.city, s.state,
                c.name AS category_name, c.color AS category_color,
                co.name AS country_name
           FROM submissions s
           LEFT JOIN categories c ON c.id = s.category_id
           LEFT JOIN countries co ON co.id = s.country_id
          WHERE s.id != ?
            AND s.listing_mode = 'company'
            AND s.status IN ('active','paid')
          ORDER BY s.created_at DESC LIMIT 8`,
        [company.id]
      )
    } else { throw err }
  }

  /* Popular tools — products by OTHER companies in the same sector.
     Cross-marketing surface: visitors browsing one agency see what tools
     other agencies in the same space have launched. */
  let popularTools: PopularToolRow[] = []
  try {
    popularTools = await query<PopularToolRow>(
      `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url,
              s.starting_price, s.starting_price_period,
              c.name AS category_name, c.color AS category_color,
              parent.company_name AS parent_company_name,
              parent.slug AS parent_company_slug
         FROM submissions s
         LEFT JOIN categories c ON c.id = s.category_id
         LEFT JOIN submissions parent ON parent.id = s.parent_company_id
        WHERE s.listing_mode = 'product'
          AND s.status IN ('active','paid')
          AND (s.parent_company_id IS NULL OR s.parent_company_id != ?)
          AND (s.user_id IS NULL OR s.user_id != ?)
        ORDER BY s.created_at DESC
        LIMIT 12`,
      [company.id, company.user_id]
    )
  } catch { /* ignore — empty grid is fine */ }

  /* Related categories — sibling L2 categories under the company's L1
     sector. Walks the parent chain up to L1, then fetches up to 12
     launched L2 children of that L1. Used for the bottom Related
     categories grid (folder-icon cards mirroring the product page). */
  let relatedCategories: RelatedCategoryRow[] = []
  if (company.category_id) {
    try {
      type CatChain = { id: number; parent_id: number | null; level: number }
      let cur: number | null = company.category_id
      let l1Id: number | null = null
      for (let hop = 0; hop < 5 && cur; hop++) {
        const cat: CatChain | null = await queryOne<CatChain>(
          'SELECT id, parent_id, level FROM categories WHERE id = ? LIMIT 1',
          [cur]
        )
        if (!cat) break
        if (cat.level === 1) { l1Id = cat.id; break }
        cur = cat.parent_id
      }
      if (l1Id) {
        relatedCategories = await query<RelatedCategoryRow>(
          `SELECT id, name, slug, color
             FROM categories
            WHERE parent_id = ? AND level = 2 AND is_launched = 1 AND id != ?
            ORDER BY sort_order ASC, name ASC
            LIMIT 12`,
          [l1Id, company.category_id]
        )
        /* Backfill — if fewer than 6 launched siblings, broaden to all L2s
           under the L1 (launched flag relaxed). Keeps the grid full. */
        if (relatedCategories.length < 6) {
          const have = new Set(relatedCategories.map(r => r.id))
          have.add(company.category_id)
          const broader = await query<RelatedCategoryRow>(
            `SELECT id, name, slug, color
               FROM categories
              WHERE parent_id = ? AND level = 2
              ORDER BY name ASC
              LIMIT 24`,
            [l1Id]
          )
          for (const r of broader) {
            if (relatedCategories.length >= 12) break
            if (!have.has(r.id)) { relatedCategories.push(r); have.add(r.id) }
          }
        }
      }
    } catch { /* ignore — empty grid is fine */ }
  }

  /* Engagement aggregates — cheap COUNTs over indexed listing_id columns.
     Wrapped individually so a missing engagement table (extreme edge —
     migration not yet run) just zeros that one count instead of crashing
     the whole page. */
  let followerCount = 0
  let bookmarkCount = 0
  try {
    const r = await queryOne<{ c: number }>(
      'SELECT COUNT(*) AS c FROM listing_follows WHERE listing_id = ?',
      [company.id]
    )
    followerCount = Number(r?.c || 0)
  } catch { /* engagement table missing — leave 0 */ }
  try {
    const r = await queryOne<{ c: number }>(
      'SELECT COUNT(*) AS c FROM listing_bookmarks WHERE listing_id = ?',
      [company.id]
    )
    bookmarkCount = Number(r?.c || 0)
  } catch { /* engagement table missing — leave 0 */ }

  /* Reviews aggregate + recent for "What clients have said" + ★ rating. */
  let avgRating = 0
  let reviewCount = 0
  const reviewDist = [0, 0, 0, 0, 0] // approved counts: [1★, 2★, 3★, 4★, 5★]
  let recentReviews: Record<string, unknown>[] = []
  try {
    const agg = await queryOne<{ avg_rating: number | null; review_count: number }>(
      `SELECT AVG(rating) AS avg_rating, COUNT(*) AS review_count
         FROM reviews WHERE listing_id = ? AND status = 'approved'`,
      [company.id]
    )
    avgRating = agg?.avg_rating ? Number(agg.avg_rating) : 0
    reviewCount = Number(agg?.review_count || 0)
    const distRows = await query<{ rating: number; c: number }>(
      `SELECT rating, COUNT(*) AS c
         FROM reviews WHERE listing_id = ? AND status = 'approved'
        GROUP BY rating`,
      [company.id]
    )
    for (const row of distRows) {
      const s = Number(row.rating)
      if (s >= 1 && s <= 5) reviewDist[s - 1] = Number(row.c)
    }
    recentReviews = await query(
      `SELECT r.id, r.rating, r.title, r.body, r.created_at,
              u.name AS user_name, u.avatar_url AS user_avatar_url
         FROM reviews r
         LEFT JOIN business_users u ON u.id = r.user_id
        WHERE r.listing_id = ? AND r.status = 'approved'
        ORDER BY r.created_at DESC LIMIT 6`,
      [company.id]
    ) as Record<string, unknown>[]
  } catch { /* reviews table missing — leave defaults */ }

  return {
    company,
    breadcrumb,
    products,
    similarCompanies,
    popularTools,
    relatedCategories,
    engagement: { followers: followerCount, bookmarks: bookmarkCount },
    reviews: { avgRating, reviewCount, distribution: reviewDist, recent: recentReviews },
  }
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
  const url = `https://www.infowebworld.com/profile/${slug}`
  const ogImage = C.logo_url || 'https://www.infowebworld.com/logo/infowebworldlogo-logoforlightbackgrounds.png'

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

function buildJsonLd(c: CompanyRow, reviewsAgg: { avgRating: number; reviewCount: number }) {
  const url = `https://www.infowebworld.com/profile/${c.slug}`
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
  if (reviewsAgg.reviewCount > 0) {
    org.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(reviewsAgg.avgRating.toFixed(1)),
      reviewCount: reviewsAgg.reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }
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

  const jsonLd = buildJsonLd(data.company, data.reviews)
  const initialData = serialize({
    company: data.company as unknown as Record<string, unknown>,
    breadcrumb: data.breadcrumb,
    products: data.products as unknown as Record<string, unknown>[],
    similarCompanies: data.similarCompanies as unknown as Record<string, unknown>[],
    popularTools: data.popularTools as unknown as Record<string, unknown>[],
    relatedCategories: data.relatedCategories as unknown as Record<string, unknown>[],
    engagement: data.engagement,
    reviews: data.reviews,
  })

  /* Local-business companies get the Yelp-style page by default; every other
     sector keeps the Clutch-style CompanyDetailPage. Sector = the breadcrumb
     root (L1). Admins can flip a single local-business listing to the standard
     CompanyDetailPage via lb_design_mode = 'classic' (default 'yelp'). */
  const isLocalBusiness = data.breadcrumb.some((b: { slug: string }) => b.slug === 'local-businesses')
  const designClassic = String((data.company as unknown as { lb_design_mode?: string }).lb_design_mode ?? 'yelp') === 'classic'
  const useYelpDesign = isLocalBusiness && !designClassic

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Navbar />
      <Suspense>
        {useYelpDesign
          ? <LocalBusinessProfilePage slug={slug} initialData={initialData} />
          : <CompanyDetailPage slug={slug} initialData={initialData} />}
      </Suspense>
      <Footer />
    </>
  )
}
