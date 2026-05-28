import { Suspense } from 'react'
import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AiDisclaimer from '../components/AiDisclaimer'
import CategoryPage from '../CategoryPage'
import SectorAllBrowse from '../components-category/SectorAllBrowse'
import { getSectorMeta } from '../sector/sector-demo-data'
import { query, queryOne } from '@/lib/db'
import { CATEGORIES as STATIC_CATEGORIES } from '../config/categories-data'
import { SECTOR_LANDINGS } from '@/lib/sector-landings'
import SectorLandingPage from '../sector-landing/SectorLandingPage'

/** No ISR — render dynamically on each request to avoid Vercel ISR write quota */
export const dynamic = 'force-dynamic'

/* ── Known L1 sector slugs ── */
const L1_SLUGS = new Set([
  'ai-ml', 'software-saas', 'it-services-agencies',
  'startups-innovation', 'local-businesses', 'professional-services',
])

/** Helper: build the view-all slug for a sector */
function viewAllSlug(sectorSlug: string) {
  return `view-all-sub-categories-${sectorSlug}`
}

/* generateStaticParams removed — was pre-building 72 pages that generated ISR writes on every revalidation cycle */

/* ── Sector-scoped categories (only the L1 + its L2/L3 children, ~200-3K rows instead of 14K) ── */
async function getSectorCategories(sectorId: number) {
  const rows = await query(
    `SELECT c.id, c.name, c.slug, c.level, c.parent_id, c.sort_order, c.color, c.icon,
            p.name as parent_name, p.slug as parent_slug,
            CASE WHEN c.level = 1 THEN c.slug
                 WHEN c.level = 2 THEN p.slug
                 WHEN c.level = 3 THEN gp.slug
                 WHEN c.level = 4 THEN ggp.slug
                 WHEN c.level = 5 THEN gggp.slug END as sector_slug
     FROM categories c
       LEFT JOIN categories p    ON p.id    = c.parent_id
       LEFT JOIN categories gp   ON gp.id   = p.parent_id
       LEFT JOIN categories ggp  ON ggp.id  = gp.parent_id
       LEFT JOIN categories gggp ON gggp.id = ggp.parent_id
     WHERE c.is_launched = 1 AND c.is_active = 1 AND c.is_navigation = 1
       AND (c.id = ? OR c.parent_id = ? OR c.parent_id IN (SELECT id FROM categories WHERE parent_id = ?))
     ORDER BY c.sort_order`,
    [sectorId, sectorId, sectorId]
  )
  return JSON.parse(JSON.stringify(rows))
}

/* ── All L1+L2 only (for navbar/mega-menu, small payload ~300 rows) ── */
const getCachedAllCategories = unstable_cache(
  async () => {
    const rows = await query(
      `SELECT c.id, c.name, c.slug, c.level, c.parent_id, c.sort_order, c.color,
              p.name as parent_name, p.slug as parent_slug,
              CASE WHEN c.level = 1 THEN c.slug ELSE p.slug END as sector_slug
       FROM categories c LEFT JOIN categories p ON p.id = c.parent_id
       WHERE c.is_launched = 1 AND c.is_active = 1 AND c.is_navigation = 1 AND c.level IN (1, 2)
       ORDER BY c.sort_order`
    )
    return JSON.parse(JSON.stringify(rows))
  },
  ['all-categories-l1l2-v3'],
  { revalidate: 86400 }
)

const getCachedTagsWithGroups = unstable_cache(
  async () => {
    const [groups, tags] = await Promise.all([
      query('SELECT id, name, slug, description, icon, color FROM tag_groups WHERE is_active = 1 ORDER BY sort_order'),
      query('SELECT t.id, t.tag_group_id, t.name, t.slug FROM tags t JOIN tag_groups tg ON tg.id = t.tag_group_id WHERE t.is_active = 1 AND tg.is_active = 1 ORDER BY t.sort_order'),
    ])
    const tagsByGroup = new Map<number, unknown[]>()
    for (const t of tags as Array<{ id: number; tag_group_id: number; name: string; slug: string }>) {
      const list = tagsByGroup.get(t.tag_group_id) ?? []
      list.push({ id: t.id, tagGroupId: t.tag_group_id, name: t.name, slug: t.slug })
      tagsByGroup.set(t.tag_group_id, list)
    }
    const data = (groups as Array<Record<string, unknown>>).map(g => ({
      id: String(g.id), name: String(g.name), slug: String(g.slug),
      description: String(g.description ?? ''), icon: String(g.icon ?? ''), color: String(g.color ?? ''),
      sortOrder: Number(g.sort_order ?? 0), isActive: true,
      tags: (tagsByGroup.get(Number(g.id)) ?? []),
    }))
    return JSON.parse(JSON.stringify(data))
  },
  ['tag-groups-with-tags'],
  { revalidate: 86400 }
)

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function currentMonthYear() {
  const d = new Date()
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

const DOMAIN = 'https://infowebworld.com'

/** Single global URL space — country prefix removed */
function canonicalUrl(_country: string, path: string) {
  return `${DOMAIN}${path}`
}

/* ── Look up L1 sector slug for any category (L1/L2/L3) ── */
async function getSectorSlugForCategory(categorySlug: string): Promise<string | null> {
  try {
    const row = await queryOne(
      `SELECT
        CASE
          WHEN c.level = 1 THEN c.slug
          WHEN c.level = 2 THEN p.slug
          WHEN c.level = 3 THEN gp.slug
          WHEN c.level = 4 THEN ggp.slug
          WHEN c.level = 5 THEN gggp.slug
        END as sector_slug
      FROM categories c
      LEFT JOIN categories p    ON p.id    = c.parent_id
      LEFT JOIN categories gp   ON gp.id   = p.parent_id
      LEFT JOIN categories ggp  ON ggp.id  = gp.parent_id
      LEFT JOIN categories gggp ON gggp.id = ggp.parent_id
      WHERE c.slug = ? AND c.is_active = 1
      LIMIT 1`,
      [categorySlug]
    )
    return row?.sector_slug ? String(row.sector_slug) : null
  } catch { return null }
}

/* ── Fetch category from DB for SEO (server-side only) ── */
type CatSeo = {
  id: number; name: string; slug: string; level: number
  description: string; coverImage: string
  seoTitle: string; seoDescription: string; seoKeywords: string[]
  seoOgImage: string; seoCanonical: string
  parentName: string; parentSlug: string
  listingCount: number; subcategoryCount: number
}

async function fetchCategoryForSeo(slug: string): Promise<CatSeo | null> {
  try {
    const row = await queryOne(
      `SELECT c.id, c.name, c.slug, c.level, c.description, c.cover_image,
              c.seo_title, c.seo_description, c.seo_keywords, c.seo_og_image, c.seo_canonical,
              p.name as parent_name, p.slug as parent_slug
       FROM categories c
       LEFT JOIN categories p ON p.id = c.parent_id
       WHERE c.slug = ? AND c.is_active = 1
       LIMIT 1`,
      [slug]
    )
    if (!row) return null

    const cid = Number(row.id)

    const countRow = await queryOne(
      `SELECT COUNT(*) as cnt FROM submissions s
       WHERE s.status IN ('active','paid')
       AND s.category_id IN (
         SELECT id FROM categories WHERE id = ? AND is_active = 1
         UNION SELECT id FROM categories WHERE parent_id = ? AND is_active = 1
         UNION SELECT c3.id FROM categories c3
           JOIN categories c2 ON c2.id = c3.parent_id
          WHERE c2.parent_id = ? AND c3.is_active = 1
         UNION SELECT c4.id FROM categories c4
           JOIN categories c3 ON c3.id = c4.parent_id
           JOIN categories c2 ON c2.id = c3.parent_id
          WHERE c2.parent_id = ? AND c4.is_active = 1
         UNION SELECT c5.id FROM categories c5
           JOIN categories c4 ON c4.id = c5.parent_id
           JOIN categories c3 ON c3.id = c4.parent_id
           JOIN categories c2 ON c2.id = c3.parent_id
          WHERE c2.parent_id = ? AND c5.is_active = 1
       )`,
      [cid, cid, cid, cid, cid]
    )

    const subRow = await queryOne(
      `SELECT COUNT(*) as cnt FROM categories WHERE parent_id = ? AND is_active = 1 AND is_navigation = 1`,
      [cid]
    )

    let seoKw: string[] = []
    if (typeof row.seo_keywords === 'string' && row.seo_keywords) {
      try { seoKw = JSON.parse(row.seo_keywords) } catch { /* ignore */ }
    } else if (Array.isArray(row.seo_keywords)) {
      seoKw = row.seo_keywords
    }

    return {
      id: cid,
      name: String(row.name ?? ''),
      slug: String(row.slug ?? ''),
      level: Number(row.level ?? 1),
      description: String(row.description ?? ''),
      coverImage: String(row.cover_image ?? ''),
      seoTitle: String(row.seo_title ?? ''),
      seoDescription: String(row.seo_description ?? ''),
      seoKeywords: seoKw,
      seoOgImage: String(row.seo_og_image ?? ''),
      seoCanonical: String(row.seo_canonical ?? ''),
      parentName: String(row.parent_name ?? ''),
      parentSlug: String(row.parent_slug ?? ''),
      listingCount: Number(countRow?.cnt ?? 0),
      subcategoryCount: Number(subRow?.cnt ?? 0),
    }
  } catch {
    return null
  }
}

/* ── Fetch category page data — 2 DB round trips + cached shared data ── */
async function fetchCategoryPageData(categorySlug: string) {
  try {
    // Round trip 1: category row (everything else depends on this)
    const catRow = await queryOne(
      `SELECT c.*, p.name as parent_name, p.slug as parent_slug,
              CASE WHEN c.level = 1 THEN c.slug
                   WHEN c.level = 2 THEN p.slug
                   WHEN c.level = 3 THEN gp.slug
                   WHEN c.level = 4 THEN ggp.slug
                   WHEN c.level = 5 THEN gggp.slug END as sector_slug
       FROM categories c
       LEFT JOIN categories p    ON p.id    = c.parent_id
       LEFT JOIN categories gp   ON gp.id   = p.parent_id
       LEFT JOIN categories ggp  ON ggp.id  = gp.parent_id
       LEFT JOIN categories gggp ON gggp.id = ggp.parent_id
       WHERE c.slug = ? AND c.is_active = 1 LIMIT 1`,
      [categorySlug]
    )
    if (!catRow) return null

    const cid = Number(catRow.id)
    const level = Number(catRow.level)
    // Resolve sector ID for scoped category fetch
    const sectorSlug = String(catRow.sector_slug || '')
    const sectorRow = sectorSlug ? await queryOne('SELECT id FROM categories WHERE slug = ? AND level = 1', [sectorSlug]) : null
    const sectorId = sectorRow ? Number(sectorRow.id) : cid

    // Shared WHERE clause for descendant category IDs (used by listings + count).
    // 5-level deep to support the AI&ML v3 tree (L1→L2→L3→L4→L5). Pre-v3 sectors
    // only go 3 levels; the extra UNION clauses just match zero rows for them.
    const descendantWhere = `s.category_id IN (
      SELECT id FROM categories WHERE id = ? AND is_active = 1
      UNION SELECT id FROM categories WHERE parent_id = ? AND is_active = 1
      UNION SELECT c3.id FROM categories c3
        JOIN categories c2 ON c2.id = c3.parent_id
       WHERE c2.parent_id = ? AND c3.is_active = 1
      UNION SELECT c4.id FROM categories c4
        JOIN categories c3 ON c3.id = c4.parent_id
        JOIN categories c2 ON c2.id = c3.parent_id
       WHERE c2.parent_id = ? AND c4.is_active = 1
      UNION SELECT c5.id FROM categories c5
        JOIN categories c4 ON c4.id = c5.parent_id
        JOIN categories c3 ON c3.id = c4.parent_id
        JOIN categories c2 ON c2.id = c3.parent_id
       WHERE c2.parent_id = ? AND c5.is_active = 1
    )`

    // Round trip 2: all queries in parallel (7 queries, down from 10 — merged count + listings into one, removed duplicate count)
    const [subcats, listingTypes, parentRow, listingsWithCount, allCats, tagGroupsData, seoContentRow] = await Promise.all([
      query(
        `SELECT c.id, c.name, c.slug, c.level, c.parent_id, c.sort_order, c.color, c.icon, c.description, c.listing_count,
                (SELECT COUNT(*) FROM submissions s WHERE s.category_id = c.id AND s.status IN ('active','paid')) as active_count
         FROM categories c WHERE c.parent_id = ? AND c.is_active = 1 AND c.is_navigation = 1 ORDER BY c.sort_order`,
        [cid]
      ),
      level === 3
        ? query('SELECT id, name, slug, sort_order FROM listing_types WHERE category_id = ? ORDER BY sort_order', [cid])
        : level === 2
        ? query('SELECT lt.id, lt.name, lt.slug, lt.sort_order FROM listing_types lt JOIN categories c ON c.id = lt.category_id WHERE c.parent_id = ? AND c.is_active = 1 ORDER BY lt.sort_order', [cid])
        : query('SELECT lt.id, lt.name, lt.slug, lt.sort_order FROM listing_types lt JOIN categories c3 ON c3.id = lt.category_id JOIN categories c2 ON c2.id = c3.parent_id WHERE c2.parent_id = ? AND c3.is_active = 1 ORDER BY lt.sort_order LIMIT 200', [cid]),
      catRow.parent_id ? queryOne('SELECT id, name, slug, icon, color FROM categories WHERE id = ?', [catRow.parent_id]) : Promise.resolve(null),
      // Listings + reviews aggregate + latest review + tag slugs (for the
      // filter bar's tag-group dropdowns to actually filter listings).
      query(
        `SELECT s.*,
                co.name as country_name,
                c.name as category_name, c.slug as category_slug, c.color as category_color, c.icon as category_icon,
                lt.name as listing_type_name, lt.slug as listing_type_slug,
                (SELECT COUNT(*) FROM reviews r WHERE r.listing_id = s.id AND r.status = 'approved') AS review_count,
                (SELECT AVG(r.rating) FROM reviews r WHERE r.listing_id = s.id AND r.status = 'approved') AS review_avg,
                (SELECT r.title FROM reviews r WHERE r.listing_id = s.id AND r.status = 'approved' ORDER BY r.created_at DESC LIMIT 1) AS latest_review_title,
                (SELECT u.name FROM reviews r JOIN business_users u ON u.id = r.user_id WHERE r.listing_id = s.id AND r.status = 'approved' ORDER BY r.created_at DESC LIMIT 1) AS latest_review_author,
                (SELECT GROUP_CONCAT(t.slug) FROM submission_tags st JOIN tags t ON t.id = st.tag_id WHERE st.submission_id = s.id) AS tag_slugs
         FROM submissions s
         LEFT JOIN categories c ON c.id = s.category_id
         LEFT JOIN listing_types lt ON lt.id = s.listing_type_id
         LEFT JOIN countries co ON co.id = s.country_id
         WHERE s.status IN ('active','paid') AND ${descendantWhere}
         ORDER BY s.approved_at DESC, s.created_at DESC LIMIT 100`,
        [cid, cid, cid, cid, cid]
      ),
      // Sector-scoped categories (only this L1 + its L2/L3 children)
      getSectorCategories(sectorId),
      getCachedTagsWithGroups(),
      // SEO content — only needed columns (skip large unused fields if any)
      queryOne(
        `SELECT ai_summary, rich_description, buyers_guide, use_cases, comparisons,
                long_tail_keywords, complementary_categories, extended_faq, generated_at
         FROM category_seo_content WHERE category_id = ?`, [cid]
      ).catch(() => null),
    ])

    // Total listing count + aggregate review stats (avg rating + total review
    // count across the entire category tree). Powers the hero rating row.
    const [countRow, reviewAggRow] = await Promise.all([
      queryOne(
        `SELECT COUNT(*) as cnt FROM submissions s WHERE s.status IN ('active','paid') AND ${descendantWhere}`,
        [cid, cid, cid, cid, cid]
      ).catch(() => ({ cnt: 0 })),
      queryOne(
        `SELECT AVG(r.rating) as avg_rating, COUNT(*) as total_reviews
         FROM reviews r
         JOIN submissions s ON s.id = r.listing_id
         WHERE r.status = 'approved' AND s.status IN ('active','paid') AND ${descendantWhere}`,
        [cid, cid, cid, cid, cid]
      ).catch(() => ({ avg_rating: null, total_reviews: 0 })),
    ])

    const totalCount = Number(countRow?.cnt ?? 0)
    const avgRating = reviewAggRow?.avg_rating != null ? Number(reviewAggRow.avg_rating) : 0
    const totalReviews = Number(reviewAggRow?.total_reviews ?? 0)

    return JSON.parse(JSON.stringify({
      category: { ...catRow, subcategories: subcats, listingTypes, parent: parentRow, activeListings: totalCount },
      allCategories: allCats,
      tagGroups: tagGroupsData,
      listings: listingsWithCount,
      listingTotal: totalCount,
      seoContent: seoContentRow || null,
      avgRating,
      totalReviews,
    }))
  } catch (err) {
    console.error('fetchCategoryPageData error:', err)
    return null
  }
}

/* ── Build metadata for L2/L3 categories — full SEO surface ── */
function buildCategoryMeta(
  cat: CatSeo,
  country: string,
  countryName: string,
  monthYear: string,
  sectorSlug: string,
  rating?: { avg: number; total: number },
): Metadata {
  const baseName = cat.seoTitle || cat.name
  const year = new Date().getFullYear()

  /* Title — keyword leading, year + brand trailing. Keep under ~60 chars
     so SERP doesn't truncate. Includes count when listings exist. */
  const countText = cat.listingCount > 0 ? `(${cat.listingCount}+) ` : ''
  const title = `Top ${baseName} ${countText}— ${year} | InfoWebWorld`

  /* Description — rating + count + freshness signal + value prop. ~155 chars. */
  const ratingClause = rating && rating.total > 0
    ? `Rated ${rating.avg.toFixed(1)}/5 by ${rating.total.toLocaleString()} verified users. `
    : ''
  const countClause = cat.listingCount > 0 ? `${cat.listingCount}+ ` : ''
  const description = `Compare the best ${countClause}${baseName.toLowerCase()} companies. ${ratingClause}Pricing, reviews, features & hourly rates. Updated ${monthYear}.`.trim()

  const url = canonicalUrl(country, `/${sectorSlug}/${cat.slug}`)
  const ogImage = cat.seoOgImage || cat.coverImage || `${DOMAIN}/og-image.png`

  /* Keyword stack — DB seo_keywords + targeted variants pulling in the
     buying intent ("hire", "cost", "agency"), comparative ("vs", "top
     rated"), and temporal ("2026") modifiers Google rewards. */
  const lcName = baseName.toLowerCase()
  const autoKw = [
    lcName,
    `best ${lcName}`,
    `top ${lcName}`,
    `top ${lcName} companies`,
    `top ${lcName} agencies`,
    `${lcName} companies`,
    `${lcName} reviews`,
    `${lcName} comparison`,
    `${lcName} pricing`,
    `${lcName} services`,
    `hire ${lcName}`,
    `${lcName} ${year}`,
    `${lcName} list`,
    `${lcName} rankings`,
  ]
  const keywords = [...new Set([...cat.seoKeywords.map(k => k.toLowerCase()), ...autoKw])].join(', ')

  return {
    title,
    description,
    keywords,
    alternates: { canonical: cat.seoCanonical || url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'InfoWebWorld',
      type: 'website',
      locale: 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${baseName} — Top Companies` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      site: '@infowebworld',
    },
    /* Conditional indexing — only categories with 5+ listings (counting the
       whole descendant tree) get index:true. Sparse categories stay
       noindex,follow so PageRank still flows down the tree, but Google
       doesn't waste crawl budget on thin pages and we don't dilute site-
       wide quality signal with empty CollectionPages. */
    robots: cat.listingCount >= 5
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
          },
        }
      : { index: false, follow: true },
  }
}

/* Richer listing shape for per-card Product / LocalBusiness / SoftwareApp
   schema emission. Mirrors the columns we already pull in the listings
   query — no extra DB hits. */
type ListingSchemaSeed = {
  id: string | number
  companyName: string
  slug: string
  tagline?: string
  description?: string
  logoUrl?: string
  website?: string
  listingMode?: string
  city?: string
  state?: string
  country?: string
  hourlyRate?: string
  minProjectSize?: string
  employees?: string
  founded?: string
  reviewAvg?: number
  reviewCount?: number
  pricingModel?: string
  categoryName?: string
}

/* ── Build JSON-LD schemas for L2/L3 categories ── */
function buildJsonLd(
  cat: CatSeo,
  country: string,
  countryName: string,
  monthYear: string,
  sectorSlug: string,
  geminiFaq?: { q: string; a: string }[] | null,
  rating?: { avg: number; total: number },
  topListings?: Array<{ companyName: string; slug: string; logoUrl?: string; listingMode?: string }>,
  seedListings?: ListingSchemaSeed[],
  articleMeta?: { datePublished?: string },
  /* SeoContent for GEO entities (DefinedTerm + HowTo). Pulled from
     category_seo_content table so re-generating Gemini content auto-updates
     all of this on next page render — no extra wiring needed. */
  seoContent?: {
    rich_description?: string
    buyers_guide?: unknown
    extended_faq?: unknown
  } | null,
) {
  const baseName = cat.seoTitle || cat.name
  const baseDesc = cat.seoDescription || cat.description
  const url = canonicalUrl(country, `/${sectorSlug}/${cat.slug}`)

  // BreadcrumbList
  const bcItems: Record<string, unknown>[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: DOMAIN },
  ]
  let pos = 2
  if (cat.parentName && cat.parentSlug) {
    // If parent is L1 (cat.level === 2), link directly to /{parentSlug}
    // If parent is L2 (cat.level === 3), link to /{sectorSlug}/{parentSlug}
    const parentUrl = cat.level === 2
      ? canonicalUrl(country, `/${cat.parentSlug}`)
      : canonicalUrl(country, `/${sectorSlug}/${cat.parentSlug}`)
    bcItems.push({
      '@type': 'ListItem', position: pos++,
      name: cat.parentName,
      item: parentUrl,
    })
  }
  bcItems.push({ '@type': 'ListItem', position: pos, name: cat.name })

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: bcItems,
  }

  // CollectionPage — enriched with AggregateRating (rich snippet trigger),
  // mainEntity ItemList of top listings, and publisher reference.
  const itemListEntities = (topListings || []).slice(0, 10).map((l, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: canonicalUrl(country, `${l.listingMode === 'company' ? '/profile/' : '/listing/'}${l.slug}`),
    name: l.companyName,
    ...(l.logoUrl ? { image: l.logoUrl } : {}),
  }))
  const collection: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Top ${baseName} Companies`,
    description: baseDesc || `Explore top ${baseName} businesses on InfoWebWorld.`,
    url,
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', name: 'InfoWebWorld', url: DOMAIN },
    publisher: { '@type': 'Organization', name: 'InfoWebWorld', url: DOMAIN, logo: { '@type': 'ImageObject', url: `${DOMAIN}/favicon-512.png` } },
    dateModified: new Date().toISOString(),
    ...(cat.listingCount > 0 ? { numberOfItems: cat.listingCount } : {}),
  }
  if (rating && rating.total > 0) {
    collection.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.avg.toFixed(1),
      reviewCount: rating.total,
      bestRating: 5,
      worstRating: 1,
    }
  }
  if (itemListEntities.length > 0) {
    collection.mainEntity = {
      '@type': 'ItemList',
      name: `Top ${baseName} Companies`,
      numberOfItems: itemListEntities.length,
      itemListElement: itemListEntities,
    }
  }

  /* ── Per-listing schemas — Product / SoftwareApplication / LocalBusiness
     based on sector + listing mode. Each entity gets its own @id so the
     CollectionPage's ItemList can reference them as proper graph nodes.
     This is what unlocks Google product carousels in SERP. */
  const sectorIsSoftware = sectorSlug === 'ai-ml' || sectorSlug === 'software-saas'
  const seedSchemas = (seedListings || []).slice(0, 12).map(l => {
    const href = (l.listingMode === 'company' ? '/profile/' : '/listing/') + l.slug
    const fullUrl = canonicalUrl(country, href)
    const isCompany = l.listingMode === 'company'
    const type = isCompany ? 'LocalBusiness' : (sectorIsSoftware ? 'SoftwareApplication' : 'Product')
    const node: Record<string, unknown> = {
      '@type': type,
      '@id': `${fullUrl}#listing`,
      name: l.companyName,
      url: fullUrl,
      ...(l.tagline || l.description ? { description: (l.tagline || l.description || '').slice(0, 300) } : {}),
      ...(l.logoUrl ? { image: l.logoUrl, logo: l.logoUrl } : {}),
      brand: { '@type': 'Brand', name: l.companyName },
    }
    if (l.reviewAvg && l.reviewCount && l.reviewCount > 0) {
      node.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: l.reviewAvg.toFixed(1),
        reviewCount: l.reviewCount,
        bestRating: 5,
        worstRating: 1,
      }
    }
    /* Address for LocalBusiness — city/state/country only since we don't
       collect street addresses. Google accepts partial addresses. */
    if (isCompany && (l.city || l.country)) {
      node.address = {
        '@type': 'PostalAddress',
        ...(l.city ? { addressLocality: l.city } : {}),
        ...(l.state ? { addressRegion: l.state } : {}),
        ...(l.country ? { addressCountry: l.country } : {}),
      }
    }
    /* SoftwareApplication category — sector-derived. */
    if (type === 'SoftwareApplication') {
      node.applicationCategory = sectorSlug === 'ai-ml' ? 'BusinessApplication' : 'BusinessApplication'
      node.operatingSystem = 'Web'
    }
    /* Offers — emit when we know pricing. hourlyRate for service-style,
       minProjectSize for fixed-quote, pricingModel as free-text. */
    if (l.hourlyRate) {
      node.offers = {
        '@type': 'Offer',
        priceSpecification: { '@type': 'UnitPriceSpecification', referenceQuantity: { '@type': 'QuantitativeValue', unitCode: 'HUR' }, price: l.hourlyRate, priceCurrency: 'USD' },
        availability: 'https://schema.org/InStock',
      }
    } else if (l.pricingModel && l.pricingModel !== 'contact') {
      node.offers = {
        '@type': 'Offer',
        category: l.pricingModel,
        availability: 'https://schema.org/InStock',
      }
    }
    if (l.founded) node.foundingDate = l.founded
    if (l.employees) node.numberOfEmployees = l.employees
    if (l.website) node.sameAs = [l.website]
    if (l.categoryName) node.category = l.categoryName
    return node
  })

  // FAQPage — use Gemini-generated FAQ when available (12 rich Q&As > 5 generic)
  const desc = baseDesc || `${baseName} encompasses a range of tools, platforms, and services.`
  const faqEntities = geminiFaq && geminiFaq.length > 0
    ? geminiFaq.map(f => ({
        '@type': 'Question' as const,
        name: f.q,
        acceptedAnswer: { '@type': 'Answer' as const, text: f.a },
      }))
    : [
      { '@type': 'Question' as const, name: `What is ${baseName}?`, acceptedAnswer: { '@type': 'Answer' as const, text: desc } },
      { '@type': 'Question' as const, name: `How to find the best ${baseName} companies?`, acceptedAnswer: { '@type': 'Answer' as const, text: `Browse verified ${baseName} companies on InfoWebWorld, compare services, read reviews, and connect directly. Updated ${monthYear}.` } },
      { '@type': 'Question' as const, name: `Is it free to list my ${baseName} business on InfoWebWorld?`, acceptedAnswer: { '@type': 'Answer' as const, text: 'Yes, InfoWebWorld offers free business listing with optional premium plans for enhanced visibility, dofollow backlinks, and lead generation.' } },
      { '@type': 'Question' as const, name: `How are ${baseName} companies ranked on InfoWebWorld?`, acceptedAnswer: { '@type': 'Answer' as const, text: 'Rankings are based on verified reviews, user satisfaction scores, and market presence. Our team verifies every listing to ensure quality and trust.' } },
      { '@type': 'Question' as const, name: `Can I compare ${baseName} solutions side by side?`, acceptedAnswer: { '@type': 'Answer' as const, text: `Yes! Use our comparison tools to evaluate ${baseName} solutions side by side across features, pricing, reviews, and satisfaction scores.` } },
    ]
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    /* Speakable — voice assistants (Google Assistant) prefer FAQ content
       marked speakable. Targets our rendered question + answer DOM. */
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.seo-faq-q', '.seo-faq-a'],
    },
    mainEntity: faqEntities,
  }

  /* WebSite + SearchAction — qualifies for the SERP sitelinks search box
     by declaring our /all search URL as the EntryPoint. */
  const website = {
    '@type': 'WebSite',
    '@id': `${DOMAIN}#website`,
    url: DOMAIN,
    name: 'InfoWebWorld',
    publisher: { '@id': `${DOMAIN}#org` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${DOMAIN}/all?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  /* Organization — anchor entity referenced by website/publisher/etc via
     @id. Establishes the brand for Google's Knowledge Graph. */
  const organization = {
    '@type': 'Organization',
    '@id': `${DOMAIN}#org`,
    name: 'InfoWebWorld',
    url: DOMAIN,
    logo: { '@type': 'ImageObject', url: `${DOMAIN}/favicon-512.png` },
    sameAs: [
      'https://twitter.com/infowebworld',
      'https://www.linkedin.com/company/infowebworld',
    ],
  }

  /* Article entity for the long-form Gemini SEO content. Author + publisher
     established as InfoWebWorld editorial. datePublished tracks the
     generated_at timestamp when the Gemini content was produced. */
  const article = {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: `${baseName} — Buyer's Guide, Comparisons & FAQs`,
    description: baseDesc || `Complete buyer's guide to ${baseName} companies.`,
    image: cat.seoOgImage || cat.coverImage || `${DOMAIN}/og-image.png`,
    author: { '@id': `${DOMAIN}#org` },
    publisher: { '@id': `${DOMAIN}#org` },
    datePublished: articleMeta?.datePublished || new Date().toISOString(),
    dateModified: new Date().toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: 'en-US',
  }

  /* DefinedTerm — anchors the category as a named concept LLMs cite when
     asked "what is X?". Slot into the GraphQL-style InfoWebWorld category
     vocabulary so multiple categories reference one shared term set. */
  const richDescFirstPara = (() => {
    const rd = seoContent?.rich_description
    if (typeof rd !== 'string') return ''
    return rd.split('\n\n')[0] || ''
  })()
  const definedTerm = {
    '@type': 'DefinedTerm',
    '@id': `${url}#term`,
    name: baseName,
    description: (richDescFirstPara || baseDesc || `${baseName} — verified providers on InfoWebWorld.`).slice(0, 600),
    termCode: cat.slug,
    url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': `${DOMAIN}#categoryset`,
      name: 'InfoWebWorld Category Index',
      url: `${DOMAIN}/categories`,
    },
  }

  /* HowTo — emitted when the Gemini buyers_guide contains questions or
     features. Maps to "how to choose X provider" AI answers + Google
     "how to" rich results. Each question becomes a HowToStep. */
  const bgParsed = (() => {
    const bg = seoContent?.buyers_guide
    if (!bg) return null
    if (typeof bg === 'string') { try { return JSON.parse(bg) } catch { return null } }
    if (typeof bg === 'object') return bg as Record<string, unknown>
    return null
  })()
  const bgQuestions = Array.isArray(bgParsed?.questions) ? bgParsed.questions as string[] : []
  const bgFeatures = Array.isArray(bgParsed?.features) ? bgParsed.features as Array<{ title?: string; description?: string }> : []
  const howToSteps = bgQuestions.length > 0
    ? bgQuestions.slice(0, 12).map((q, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: q.length > 90 ? q.slice(0, 87) + '…' : q,
        text: q,
      }))
    : bgFeatures.slice(0, 12).map((f, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: String(f.title || ''),
        text: String(f.description || f.title || ''),
      }))
  const howTo = howToSteps.length > 0 ? {
    '@type': 'HowTo',
    '@id': `${url}#howto`,
    name: `How to Choose the Right ${baseName} Provider`,
    description: `Step-by-step framework to evaluate and select the right ${baseName} provider, based on InfoWebWorld's editorial methodology.`,
    image: cat.seoOgImage || `${DOMAIN}/og-image.png`,
    totalTime: 'PT15M',
    step: howToSteps,
  } : null

  return {
    breadcrumb, collection, faq, website, organization, article,
    definedTerm, howTo,
    listingNodes: seedSchemas,
  }
}

/* ════════════════════════════════════════
   generateMetadata — ALL category levels
   ════════════════════════════════════════ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ segments: string[] }>
}): Promise<Metadata> {
  const { segments  } = await params; const country = ""
  const slug = segments?.[0]
  if (!slug) return {}

  const countryName = 'Worldwide'
  const monthYear = currentMonthYear()

  // Check if this is a view-all-sub-categories page (new nested form: /{sector}/view-all-sub-categories-{sector})
  const viewAllPrefix = 'view-all-sub-categories-'
  const isViewAll =
    segments.length === 2 &&
    L1_SLUGS.has(slug) &&
    segments[1].startsWith(viewAllPrefix)
  const viewAllSector = isViewAll ? segments[1].slice(viewAllPrefix.length) : null

  // Determine actual category slug: if first segment is L1 and there's a second, category is segments[1]
  let categorySlug = slug
  let sectorSlug = ''
  if (!isViewAll && L1_SLUGS.has(slug) && segments.length >= 2) {
    sectorSlug = slug
    categorySlug = segments[1]
  }

  /* ── view-all page — sector categories browse ── */
  if (isViewAll && viewAllSector && L1_SLUGS.has(viewAllSector)) {
    const meta = getSectorMeta(viewAllSector)
    const title = `All ${meta.seoTitle} Categories | InfoWebWorld`
    const description = `Browse all categories and subcategories within ${meta.seoTitle}. Find, compare, and connect with the best tools and services.`
    const url = canonicalUrl(country, `/${viewAllSector}/${viewAllSlug(viewAllSector)}`)
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: { title, description, url, siteName: 'InfoWebWorld', type: 'website' },
      robots: { index: false, follow: false },
    }
  }

  /* ── L1 Sectors — hardcoded rich meta (only when L1 is the sole segment) ── */
  if (L1_SLUGS.has(slug) && segments.length === 1) {
    const meta = getSectorMeta(slug)
    const title = `${meta.seoTitle} ${monthYear} | InfoWebWorld`
    const description = `${meta.seoDescription} Compare the best on InfoWebWorld, ${monthYear}.`
    const url = canonicalUrl(country, `/${slug}`)

    return {
      title,
      description,
      keywords: meta.seoKeywords.join(', '),
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        siteName: 'InfoWebWorld',
        type: 'website',
        locale: 'en_US',
        images: [{ url: meta.heroImage, width: 1200, height: 630, alt: meta.seoTitle }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [meta.heroImage],
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

  /* ── L2 / L3 — fetch from DB ── */
  const cat = await fetchCategoryForSeo(categorySlug)
  if (!cat) return {}

  // If no sectorSlug yet (old URL without L1 prefix), look it up from DB
  if (!sectorSlug) {
    sectorSlug = (await getSectorSlugForCategory(categorySlug)) || ''
  }

  /* Pull the aggregate rating so the meta description can advertise it. */
  let ratingArg: { avg: number; total: number } | undefined
  try {
    const aggRow = await queryOne(
      `SELECT AVG(r.rating) as avg_rating, COUNT(*) as total_reviews
       FROM reviews r
       JOIN submissions s ON s.id = r.listing_id
       WHERE r.status = 'approved' AND s.status IN ('active','paid') AND s.category_id IN (
         SELECT id FROM categories WHERE id = ? AND is_active = 1
         UNION SELECT id FROM categories WHERE parent_id = ? AND is_active = 1
         UNION SELECT c3.id FROM categories c3 JOIN categories c2 ON c2.id = c3.parent_id WHERE c2.parent_id = ? AND c3.is_active = 1
         UNION SELECT c4.id FROM categories c4 JOIN categories c3 ON c3.id = c4.parent_id JOIN categories c2 ON c2.id = c3.parent_id WHERE c2.parent_id = ? AND c4.is_active = 1
       )`,
      [cat.id, cat.id, cat.id, cat.id]
    )
    if (aggRow?.avg_rating != null && Number(aggRow?.total_reviews ?? 0) > 0) {
      ratingArg = { avg: Number(aggRow.avg_rating), total: Number(aggRow.total_reviews) }
    }
  } catch { /* aggregate is optional */ }

  return buildCategoryMeta(cat, country, countryName, monthYear, sectorSlug, ratingArg)
}

/* ════════════════════════════════════════
   Page component — renders JSON-LD + page
   ════════════════════════════════════════ */
export default async function CategoryDetailRoute({
  params,
}: {
  params: Promise<{ segments: string[] }>
}) {
  const { segments  } = await params; const country = ""
  const slug = segments?.[0]
  const countryName = 'Worldwide'
  const monthYear = currentMonthYear()

  // Check if this is a view-all page (new nested form: /{sector}/view-all-sub-categories-{sector})
  const viewAllPrefix2 = 'view-all-sub-categories-'
  const isViewAll2 =
    segments.length === 2 &&
    !!slug &&
    L1_SLUGS.has(slug) &&
    segments[1].startsWith(viewAllPrefix2)
  const viewAllSector2 = isViewAll2 ? segments[1].slice(viewAllPrefix2.length) : null

  /* ── Redirect old flat /view-all-sub-categories-{sector} → /{sector}/view-all-sub-categories-{sector} ── */
  if (slug && slug.startsWith(viewAllPrefix2) && segments.length === 1) {
    const legacySector = slug.slice(viewAllPrefix2.length)
    if (L1_SLUGS.has(legacySector)) {
      redirect(`/${legacySector}/${viewAllSlug(legacySector)}`)
    }
  }

  // Determine actual category slug and sector prefix
  let categorySlug = slug || ''
  let sectorSlug = ''
  if (!isViewAll2 && slug && L1_SLUGS.has(slug) && segments.length >= 2) {
    sectorSlug = slug
    categorySlug = segments[1]
  }

  /* ── Redirect old /sector/all URLs to new view-all nested format ── */
  if (segments.length === 2 && segments[1] === 'all' && slug && L1_SLUGS.has(slug)) {
    redirect(`/${slug}/${viewAllSlug(slug)}`)
  }

  /* ── Redirect old URLs without L1 prefix to new prefixed URLs ── */
  if (!isViewAll2 && slug && !L1_SLUGS.has(segments[0])) {
    const sector = await getSectorSlugForCategory(segments[0])
    if (sector) {
      redirect(`/${sector}/${segments.join('/')}`)
    }
  }

  /* ── view-all page — render sector browse ── */
  if (isViewAll2 && viewAllSector2 && L1_SLUGS.has(viewAllSector2)) {
    /* Stats come from the static taxonomy import — no DB query, no 9+ MB prop
       payload serialized into the HTML. <SectorAllBrowse> imports the same
       static data directly (client file), so the tree lives in a hashed JS
       chunk cached forever, not in every page's hydration blob. */
    const sectorMeta = getSectorMeta(viewAllSector2)
    const sectorName = sectorMeta.seoTitle
    const sectorRow = STATIC_CATEGORIES.find(r => r.slug === viewAllSector2 && r.level === 1)
    const sectorId = sectorRow ? sectorRow.id : 0
    const l2InSector = STATIC_CATEGORIES.filter(r => r.parent_id === sectorId && r.level === 2).length

    const allJsonLd = (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://infowebworld.com' },
            { '@type': 'ListItem', position: 2, name: sectorName },
          ]
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'CollectionPage',
          name: `All ${sectorName} Categories`, url: canonicalUrl(country, `/${viewAllSector2}/${viewAllSlug(viewAllSector2)}`),
        })}} />
      </>
    )

    return (
      <>
        {allJsonLd}
        <Navbar sectorSlug={viewAllSector2} />
        <div className="cd-server-skeleton">
          <nav className="cd-server-breadcrumb" aria-label="Breadcrumb">
            <a href="/" aria-label="Home"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></a><span> &gt; </span><a href="/categories">All Categories</a><span> &gt; </span><span>{sectorName}</span>
          </nav>
          <h1 className="cd-server-h1">All {sectorName} Categories</h1>
          <p className="cd-server-desc">Browse all categories and subcategories within {sectorName}. {l2InSector} categories to explore.</p>
          <h2 className="cd-server-h2">Categories in {sectorName}</h2>
        </div>
        <Suspense><SectorAllBrowse sectorSlug={viewAllSector2} /></Suspense>
        <AiDisclaimer />
        <Footer />
      </>
    )
  }

  const isSector = slug && L1_SLUGS.has(slug) && segments.length === 1
  const navSector = sectorSlug || (isSector ? slug : undefined)
  const isL2L3 = categorySlug && !L1_SLUGS.has(categorySlug)

  /* ── L1 sector landing — sector-themed grid + real data sections.
     Bypasses the legacy CategoryPage / SectorAllBrowse pipeline. Each of the
     6 known sectors has a palette + hero copy + 6 marquee L2 cards configured
     in lib/sector-landings.ts; the layout (HeroSearch + CategoriesSection +
     Popular/TopFirms/Reviews/Launches/Tools/Trust/Compare/CTA) is shared
     across all six, scoped by a .tcat-<slug> class that overrides the palette
     CSS custom properties. */
  if (isSector && slug && SECTOR_LANDINGS[slug]) {
    return <SectorLandingPage cfg={SECTOR_LANDINGS[slug]} />
  }

  /* ── Fetch ALL data server-side ── */
  let pageData: Awaited<ReturnType<typeof fetchCategoryPageData>> = null

  if (isSector && slug) {
    // L1 sector: fetch allCategories (cached) + listings for this sector
    const catRow = await queryOne(
      `SELECT c.id, c.name, c.slug, c.level, c.parent_id, c.color, c.icon, c.description FROM categories c WHERE c.slug = ? AND c.is_active = 1 LIMIT 1`, [slug]
    ).catch(() => null)
    const cid = catRow ? Number(catRow.id) : 0
    const [allCats, seoContentRow] = await Promise.all([
      cid ? getSectorCategories(cid) : Promise.resolve([]),
      cid ? queryOne(
        `SELECT ai_summary, rich_description, buyers_guide, use_cases, comparisons,
                long_tail_keywords, complementary_categories, extended_faq, generated_at
         FROM category_seo_content WHERE category_id = ?`, [cid]
      ).catch(() => null) : Promise.resolve(null),
    ])
    pageData = JSON.parse(JSON.stringify({
      category: catRow,
      allCategories: allCats,
      tagGroups: [],
      listings: [],
      listingTotal: 0,
      seoContent: seoContentRow || null,
    }))
  } else if (isL2L3) {
    pageData = await fetchCategoryPageData(categorySlug)
  }

  /* ── Unknown route — render the designed app/not-found.tsx ──
     Hits when the slug isn't an L1 sector, isn't a view-all path, and the
     L2/L3 lookup found no match in the DB. Without this, the client falls
     through to CategoryPage and shows an inline "Category Not Found" stub. */
  if (!isSector && !isViewAll2 && !pageData?.category) {
    notFound()
  }

  /* ── JSON-LD ── */
  let jsonLdScripts: React.ReactNode = null

  // L1 sector JSON-LD (server-side instead of client)
  if (isSector && slug) {
    const sMeta = getSectorMeta(slug)
    const sName = sMeta.seoTitle
    const sUrl = canonicalUrl(country, `/${slug}`)
    // Parse Gemini FAQ for richer JSON-LD
    const jpSec = (v: unknown) => { if (!v) return null; if (typeof v === 'string') { try { return JSON.parse(v) } catch { return null } } return v }
    const sectorGeminiFaq = jpSec(pageData?.seoContent?.extended_faq) as { q: string; a: string }[] | null
    const sectorFaqEntities = sectorGeminiFaq && sectorGeminiFaq.length > 0
      ? sectorGeminiFaq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
      : [
          { '@type': 'Question', name: `What is ${sName}?`, acceptedAnswer: { '@type': 'Answer', text: sMeta.description } },
          { '@type': 'Question', name: `How to find the best ${sName} companies?`, acceptedAnswer: { '@type': 'Answer', text: `Browse verified ${sName} companies on InfoWebWorld. Compare services, read reviews and connect directly.` } },
          { '@type': 'Question', name: `Is it free to list my business?`, acceptedAnswer: { '@type': 'Answer', text: 'Yes, InfoWebWorld offers free business listing with optional premium plans.' } },
        ]
    const l2Count = (pageData?.allCategories || []).filter((c: any) => Number(c.level) === 2).length
    const l3Count = (pageData?.allCategories || []).filter((c: any) => Number(c.level) === 3).length
    /* All three sector schemas in one @graph script — half the DOM weight. */
    const sectorGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: DOMAIN },
            { '@type': 'ListItem', position: 2, name: sName },
          ],
        },
        {
          '@type': 'CollectionPage',
          name: `Top ${sName} Companies`,
          description: sMeta.seoDescription,
          url: sUrl,
          inLanguage: 'en-US',
          isPartOf: { '@type': 'WebSite', name: 'InfoWebWorld', url: DOMAIN },
          publisher: { '@type': 'Organization', name: 'InfoWebWorld', url: DOMAIN, logo: { '@type': 'ImageObject', url: `${DOMAIN}/favicon-512.png` } },
          dateModified: new Date().toISOString(),
          numberOfItems: l2Count + l3Count,
        },
        { '@type': 'FAQPage', mainEntity: sectorFaqEntities },
      ],
    }
    jsonLdScripts = (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sectorGraph) }} />
    )
  }

  // L2/L3 JSON-LD
  if (isL2L3 && pageData?.category) {
    const c = pageData.category
    const resolvedSector = sectorSlug || String(c.sector_slug || '')
    // Build CatSeo from pageData to reuse buildJsonLd
    const catSeo: CatSeo = {
      id: Number(c.id), name: String(c.name ?? ''), slug: String(c.slug ?? ''), level: Number(c.level ?? 2),
      description: String(c.description ?? ''), coverImage: String(c.cover_image ?? ''),
      seoTitle: String(c.seo_title ?? ''), seoDescription: String(c.seo_description ?? ''),
      seoKeywords: (() => { try { return typeof c.seo_keywords === 'string' ? JSON.parse(c.seo_keywords || '[]') : (c.seo_keywords ?? []) } catch { return [] } })(),
      seoOgImage: String(c.seo_og_image ?? ''), seoCanonical: String(c.seo_canonical ?? ''),
      parentName: String(c.parent_name ?? ''), parentSlug: String(c.parent_slug ?? ''),
      listingCount: pageData.listingTotal ?? 0,
      subcategoryCount: Array.isArray(c.subcategories) ? c.subcategories.length : 0,
    }
    // Parse Gemini extended_faq for JSON-LD rich snippets
    const jpFaq = (v: unknown) => { if (!v) return null; if (typeof v === 'string') { try { return JSON.parse(v) } catch { return null } } return v }
    const geminiFaq = jpFaq(pageData?.seoContent?.extended_faq) as { q: string; a: string }[] | null
    /* Pull the top 10 listings + aggregate rating from pageData and pass them
       through so the CollectionPage JSON-LD ships AggregateRating (rich
       snippet stars in SERP) + ItemList (rich product entities). */
    const ratingArg = pageData?.totalReviews && pageData.totalReviews > 0
      ? { avg: Number(pageData.avgRating ?? 0), total: Number(pageData.totalReviews) }
      : undefined
    const topListings = (pageData?.listings || []).slice(0, 10).map((l: Record<string, unknown>) => ({
      companyName: String(l.company_name ?? ''),
      slug: String(l.slug ?? ''),
      logoUrl: l.logo_url ? String(l.logo_url) : undefined,
      listingMode: l.listing_mode ? String(l.listing_mode) : 'product',
    }))
    /* Richer per-listing seeds for Product / SoftwareApplication /
       LocalBusiness schemas — pulls every signal we have into the graph
       so Google can render product carousels + local pack + ratings. */
    const seedListings: ListingSchemaSeed[] = (pageData?.listings || []).slice(0, 12).map((l: Record<string, unknown>) => ({
      id: String(l.id ?? ''),
      companyName: String(l.company_name ?? ''),
      slug: String(l.slug ?? ''),
      tagline: l.tagline ? String(l.tagline) : undefined,
      description: l.description ? String(l.description) : undefined,
      logoUrl: l.logo_url ? String(l.logo_url) : undefined,
      website: l.website ? String(l.website) : undefined,
      listingMode: l.listing_mode ? String(l.listing_mode) : 'product',
      city: l.city ? String(l.city) : undefined,
      state: l.state ? String(l.state) : undefined,
      country: l.country_name ? String(l.country_name) : undefined,
      hourlyRate: l.hourly_rate ? String(l.hourly_rate) : undefined,
      minProjectSize: l.min_project_size ? String(l.min_project_size) : undefined,
      employees: l.team_size ? String(l.team_size) : undefined,
      founded: l.founded_year ? String(l.founded_year) : undefined,
      reviewAvg: l.review_avg != null ? Number(l.review_avg) : undefined,
      reviewCount: l.review_count != null ? Number(l.review_count) : undefined,
      pricingModel: l.pricing_model ? String(l.pricing_model) : undefined,
      categoryName: l.category_name ? String(l.category_name) : undefined,
    }))
    const articleMeta = pageData?.seoContent?.generated_at
      ? { datePublished: new Date(String(pageData.seoContent.generated_at)).toISOString() }
      : undefined
    const schemas = buildJsonLd(
      catSeo, country, countryName, monthYear, resolvedSector,
      geminiFaq, ratingArg, topListings, seedListings, articleMeta,
      pageData?.seoContent || null,
    )
    /* All entities in one @graph — Google + Bing prefer this form, half
       the DOM weight, single network payload, @id cross-references work.
       Now carries: Organization, WebSite + SearchAction, BreadcrumbList,
       CollectionPage + AggregateRating + ItemList, Article, FAQPage +
       Speakable, DefinedTerm (GEO), HowTo (GEO), and per-listing
       Product / SoftwareApplication / LocalBusiness. */
    const graph = {
      '@context': 'https://schema.org',
      '@graph': [
        schemas.organization,
        schemas.website,
        schemas.breadcrumb,
        schemas.collection,
        schemas.article,
        schemas.definedTerm,
        ...(schemas.howTo ? [schemas.howTo] : []),
        schemas.faq,
        ...schemas.listingNodes,
      ],
    }
    jsonLdScripts = (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
    )
  }

  /* ── Minimal server-side skeleton — breadcrumb + H1 + stats only.
     The heavy Gemini SEO content (rich description, buyer's guide, use cases,
     comparisons, long-tail keywords, complementary categories, extended FAQ)
     was stripped because every category page is robots: noindex — crawlers
     don't need the content. Client-side <SeoSections> inside <CategoryPage>
     still renders it all for real users after hydration. Drops server HTML
     from ~700-800 KB to ~120 KB per page. ── */
  /* Server skeleton block REMOVED — it duplicated CategoryHero's H1 +
     breadcrumb + description. CategoryPage is a 'use client' component but
     Next.js SSRs it on initial paint, so the hero markup is already in the
     HTML for crawlers. No need for a separate <div> that renders the same
     content again. View source is now ~50% lighter. */

  const catSegments = L1_SLUGS.has(segments[0]) && segments.length > 1 ? segments.slice(1) : segments

  return (
    <>
      {jsonLdScripts}
      <Navbar sectorSlug={navSector} />
      <Suspense>
        <CategoryPage
          segments={catSegments}
          sectorSlug={sectorSlug || slug || ''}
          initialData={pageData || undefined}
        />
      </Suspense>
      <AiDisclaimer />
      <Footer />
    </>
  )
}
