import { Suspense } from 'react'
import '../styles/categories.css'
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
import { PRO_SERVICES_VERTICALS, PRO_SERVICES_FAQ } from '../sector-landing/pro-services-content'
import {
  BASE_URL as SEO_BASE_URL, ID_ORG, ID_WEBSITE,
  organizationNode, brandNode, websiteNode,
  breadcrumbNode, faqNode, howToNode,
} from '../components/seo-schema'

/** No ISR — render dynamically on each request to avoid Vercel ISR write quota */
export const dynamic = 'force-dynamic'

/* ── Known L1 sector slugs ── */
const L1_SLUGS = new Set([
  'ai-ml', 'software-saas', 'it-services-agencies',
  'startups-innovation', 'local-businesses', 'professional-services',
])

/* Sector accent colors — same palette as SectorAllBrowse's sectorMeta()
   client helper, redeclared here so the server-rendered .va-card grid on
   view-all pages can be tinted via --sec without a client component. */
const SECTOR_ACCENT: Record<string, string> = {
  'ai-ml': '#8B5CF6',
  'software-saas': '#3B82F6',
  'it-services-agencies': '#14B8A6',
  'startups-innovation': '#E8553D',
  'local-businesses': '#F59E0B',
  'professional-services': '#2FAE6A',
}

/* Inline closed-folder glyph used in the .va-card grid on view-all pages.
   Stroke = currentColor so it inherits the sector accent set on the parent. */
function VaFolderIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"
        d="M6 14h12l3 4h21v22H6z" />
      <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" opacity=".55"
        d="M6 14l3 4h12l3 4h18" />
    </svg>
  )
}

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

const DOMAIN = 'https://www.infowebworld.com'

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

/* ════════════════════════════════════════════════════════════════════════
   L1 sector @graph builder — killer SEO/AEO/GEO surface for the 6 main
   sector landing pages. Emits Organization + WebSite + SearchAction +
   BreadcrumbList + CollectionPage + Article + DefinedTerm + HowTo +
   FAQPage with Speakable + per-listing Product/SoftwareApplication/
   LocalBusiness entities, all in one @graph with @id cross-references.
   ════════════════════════════════════════════════════════════════════════ */
async function buildSectorJsonLd(
  sectorSlug: string,
  country: string,
  monthYear: string,
  seoContent: { rich_description?: string; buyers_guide?: unknown; extended_faq?: unknown; generated_at?: string } | null,
): Promise<string> {
  const meta = getSectorMeta(sectorSlug)
  const sName = meta.seoTitle
  const sUrl = canonicalUrl(country, `/${sectorSlug}`)
  const year = new Date().getFullYear()

  /* Pull top 12 sector listings + aggregate review row in parallel — these
     feed the per-listing schemas + drive the freshness signal on Article. */
  let topListings: Array<Record<string, unknown>> = []
  try {
    topListings = await query(
      `SELECT s.id, s.slug, s.company_name, s.tagline, s.description,
              s.website, s.logo_url, s.city, s.state, s.team_size, s.founded_year,
              s.hourly_rate, s.pricing_model, COALESCE(s.listing_mode,'product') as listing_mode,
              co.name as country_name, c.name as category_name,
              (SELECT AVG(r.rating) FROM reviews r WHERE r.listing_id = s.id AND r.status='approved') AS review_avg,
              (SELECT COUNT(*) FROM reviews r WHERE r.listing_id = s.id AND r.status='approved') AS review_count
         FROM submissions s
         LEFT JOIN categories c ON c.id = s.category_id
         LEFT JOIN categories cp ON cp.id = c.parent_id
         LEFT JOIN categories cgp ON cgp.id = cp.parent_id
         LEFT JOIN categories cggp ON cggp.id = cgp.parent_id
         LEFT JOIN countries co ON co.id = s.country_id
        WHERE s.status IN ('active','paid')
          AND ((SELECT slug FROM categories WHERE id = c.id) = ?
            OR (SELECT slug FROM categories WHERE id = cp.id) = ?
            OR (SELECT slug FROM categories WHERE id = cgp.id) = ?
            OR (SELECT slug FROM categories WHERE id = cggp.id) = ?)
        ORDER BY review_avg DESC, review_count DESC, s.approved_at DESC
        LIMIT 12`,
      [sectorSlug, sectorSlug, sectorSlug, sectorSlug]
    )
  } catch { /* listings are optional for the graph */ }

  /* Sector type for per-listing schema selection. */
  const sectorIsSoftware = sectorSlug === 'ai-ml' || sectorSlug === 'software-saas'

  const parseHourly = (s?: string): { low: number; high: number } | { single: number } | null => {
    if (!s) return null
    const nums = s.match(/\d+/g)
    if (!nums || nums.length === 0) return null
    if (nums.length >= 2) {
      const lo = Number(nums[0]); const hi = Number(nums[1])
      if (hi > lo) return { low: lo, high: hi }
      return { single: lo }
    }
    return { single: Number(nums[0]) }
  }

  /* Per-listing schemas — Product / SoftwareApplication / LocalBusiness
     based on listing mode + sector. Type-disciplined: only the fields each
     @type defines, so Rich Results Test validates green. */
  const listingNodes = topListings.map(l => {
    const isCompany = l.listing_mode === 'company'
    /* Professional-services entries are firms, not products — type them as
       Organization so Google doesn't require offers/review/aggregateRating on
       a directory listing that legitimately has none yet (the standalone
       /listing/[slug] page already uses Organization for the same reason).
       Other sectors keep their existing type. */
    const type = isCompany
      ? 'LocalBusiness'
      : sectorIsSoftware
        ? 'SoftwareApplication'
        : sectorSlug === 'professional-services'
          ? 'Organization'
          : 'Product'
    const href = (isCompany ? '/profile/' : '/listing/') + String(l.slug)
    const fullUrl = canonicalUrl(country, href)
    const node: Record<string, unknown> = {
      '@type': type,
      '@id': `${fullUrl}#listing`,
      name: String(l.company_name),
      url: fullUrl,
      ...(l.tagline || l.description ? { description: String(l.tagline || l.description).slice(0, 300) } : {}),
      ...(l.logo_url ? { image: String(l.logo_url) } : {}),
    }
    const avg = l.review_avg != null ? Number(l.review_avg) : 0
    const cnt = Number(l.review_count ?? 0)
    if (avg > 0 && cnt > 0) {
      node.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: Number(avg.toFixed(1)),
        reviewCount: cnt,
        bestRating: 5,
        worstRating: 1,
      }
    }
    const hr = parseHourly(l.hourly_rate as string | undefined)
    if (hr) {
      node.offers = 'low' in hr
        ? { '@type': 'AggregateOffer', priceCurrency: 'USD', lowPrice: hr.low, highPrice: hr.high, availability: 'https://schema.org/InStock' }
        : { '@type': 'Offer', priceCurrency: 'USD', price: hr.single, availability: 'https://schema.org/InStock' }
    }
    if (l.website) node.sameAs = [String(l.website)]
    if (type === 'LocalBusiness') {
      if (l.city || l.state || l.country_name) {
        node.address = {
          '@type': 'PostalAddress',
          ...(l.city ? { addressLocality: String(l.city) } : {}),
          ...(l.state ? { addressRegion: String(l.state) } : {}),
          ...(l.country_name ? { addressCountry: String(l.country_name) } : {}),
        }
      }
      if (l.founded_year) node.foundingDate = String(l.founded_year)
      if (l.team_size) {
        const empNums = String(l.team_size).match(/\d+/g)
        if (empNums && empNums.length >= 1) {
          node.numberOfEmployees = empNums.length >= 2
            ? { '@type': 'QuantitativeValue', minValue: Number(empNums[0]), maxValue: Number(empNums[1]) }
            : { '@type': 'QuantitativeValue', value: Number(empNums[0]) }
        }
      }
    }
    if (type === 'SoftwareApplication') {
      node.applicationCategory = 'BusinessApplication'
      node.operatingSystem = 'Web'
    }
    if (type === 'Product') {
      node.brand = { '@type': 'Brand', name: String(l.company_name) }
      if (l.category_name) node.category = String(l.category_name)
    }
    return node
  })

  /* Parse Gemini SEO content for entity bodies. */
  const jpSafe = (v: unknown): unknown => {
    if (!v) return null
    if (typeof v === 'object') return v
    if (typeof v === 'string') { try { return JSON.parse(v) } catch { return null } }
    return null
  }
  const richDescFirstPara = (() => {
    const rd = seoContent?.rich_description
    if (typeof rd !== 'string') return ''
    return rd.split('\n\n')[0] || ''
  })()
  const sectorGeminiFaq = jpSafe(seoContent?.extended_faq) as { q: string; a: string }[] | null
  const faqEntities = sectorGeminiFaq && sectorGeminiFaq.length > 0
    ? sectorGeminiFaq.map(f => ({
        '@type': 'Question' as const,
        name: f.q,
        acceptedAnswer: { '@type': 'Answer' as const, text: f.a },
      }))
    : [
        { '@type': 'Question' as const, name: `What is ${sName}?`, acceptedAnswer: { '@type': 'Answer' as const, text: meta.description } },
        { '@type': 'Question' as const, name: `How to find the best ${sName} companies?`, acceptedAnswer: { '@type': 'Answer' as const, text: `Browse verified ${sName} companies on InfoWebWorld. Compare services, read reviews and connect directly.` } },
        { '@type': 'Question' as const, name: `Is it free to list my ${sName.toLowerCase()} business?`, acceptedAnswer: { '@type': 'Answer' as const, text: 'Yes, InfoWebWorld offers free business listing with optional premium plans for enhanced visibility, dofollow backlinks, and lead generation.' } },
        { '@type': 'Question' as const, name: `How are ${sName} companies ranked on InfoWebWorld?`, acceptedAnswer: { '@type': 'Answer' as const, text: 'Rankings are based on verified reviews, user satisfaction scores, and market presence. Our team verifies every listing.' } },
      ]
  const bgParsed = jpSafe(seoContent?.buyers_guide) as Record<string, unknown> | null
  const bgQuestions = Array.isArray(bgParsed?.questions) ? bgParsed.questions as string[] : []
  const bgFeatures = Array.isArray(bgParsed?.features) ? bgParsed.features as Array<{ title?: string; description?: string }> : []
  const howToSteps = bgQuestions.length > 0
    ? bgQuestions.slice(0, 12).map((q, i) => ({
        '@type': 'HowToStep' as const,
        position: i + 1,
        name: q.length > 90 ? q.slice(0, 87) + '…' : q,
        text: q,
      }))
    : bgFeatures.slice(0, 12).map((f, i) => ({
        '@type': 'HowToStep' as const,
        position: i + 1,
        name: String(f.title || ''),
        text: String(f.description || f.title || ''),
      }))

  /* ── Professional Services directory enrichments (scoped to this sector).
     FAQ + field list mirror the visible block (ProServicesDirectorySeo.tsx)
     via the shared pro-services-content module, so schema and on-page
     content stay in lockstep. Every other sector skips this entirely. ── */
  const isProServices = sectorSlug === 'professional-services'
  const proFaqEntities = PRO_SERVICES_FAQ.map(f => ({
    '@type': 'Question' as const,
    name: f.q,
    acceptedAnswer: { '@type': 'Answer' as const, text: f.a },
  }))
  const proItemListId = `${sUrl}#fields`
  const proFieldsItemList = {
    '@type': 'ItemList',
    '@id': proItemListId,
    name: 'Professional service fields',
    description: 'The 19 professional service fields listed in the InfoWebWorld professional services directory.',
    numberOfItems: PRO_SERVICES_VERTICALS.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: PRO_SERVICES_VERTICALS.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: v.name,
      url: canonicalUrl(country, `/professional-services/${v.slug}`),
    })),
  }

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': `${DOMAIN}#org`,
      name: 'InfoWebWorld',
      url: DOMAIN,
      logo: { '@type': 'ImageObject', url: `${DOMAIN}/favicon-512.png` },
      sameAs: ['https://x.com/infowebworld_x', 'https://www.linkedin.com/company/infowebworld/', 'https://www.instagram.com/infowebworld'],
    },
    {
      '@type': 'WebSite',
      '@id': `${DOMAIN}#website`,
      url: DOMAIN,
      name: 'InfoWebWorld',
      publisher: { '@id': `${DOMAIN}#org` },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${DOMAIN}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${sUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: DOMAIN },
        { '@type': 'ListItem', position: 2, name: sName, item: sUrl },
      ],
    },
    {
      '@type': 'CollectionPage',
      '@id': `${sUrl}#page`,
      name: isProServices ? 'Professional Services Directory' : `Top ${sName} Companies`,
      description: isProServices
        ? 'A free professional services directory to find and compare verified professional service firms across 19 fields and 2,400+ specialties - accounting, legal, consulting, financial advisory, HR, marketing and more. Human-verified listings, identity-checked reviews, merit-based rankings.'
        : meta.seoDescription,
      url: sUrl,
      inLanguage: 'en-US',
      isPartOf: { '@id': `${DOMAIN}#website` },
      publisher: { '@id': `${DOMAIN}#org` },
      dateModified: new Date().toISOString(),
      ...(isProServices ? {
        about: [
          { '@type': 'Thing', name: 'Professional services directory' },
          { '@type': 'Thing', name: 'Professional service providers' },
          { '@type': 'Thing', name: 'Business directory' },
        ],
        keywords: 'professional services directory, professional service providers, find professional services, verified professional firms, professional services reviews',
        mainEntity: { '@id': proItemListId },
        numberOfItems: PRO_SERVICES_VERTICALS.length,
      } : {}),
    },
    {
      '@type': 'Article',
      '@id': `${sUrl}#article`,
      headline: `${sName} - Buyer's Guide, Comparisons & FAQs (${year})`,
      description: meta.seoDescription,
      image: `${DOMAIN}/api/og/${sectorSlug}`,
      author: { '@id': `${DOMAIN}#org` },
      publisher: { '@id': `${DOMAIN}#org` },
      datePublished: seoContent?.generated_at
        ? new Date(String(seoContent.generated_at)).toISOString()
        : new Date().toISOString(),
      dateModified: new Date().toISOString(),
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${sUrl}#page` },
      inLanguage: 'en-US',
    },
    {
      '@type': 'DefinedTerm',
      '@id': `${sUrl}#term`,
      name: sName,
      description: (richDescFirstPara || meta.seoDescription || `${sName} - verified providers on InfoWebWorld.`).slice(0, 600),
      termCode: sectorSlug,
      url: sUrl,
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        '@id': `${DOMAIN}#categoryset`,
        name: 'InfoWebWorld Sector Index',
        url: `${DOMAIN}/categories`,
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${sUrl}#faq`,
      speakable: { '@type': 'SpeakableSpecification', cssSelector: isProServices ? ['.cat-seo-tldr-body', '.cat-seo-faq-item'] : ['.seo-faq-q', '.seo-faq-a'] },
      mainEntity: isProServices ? proFaqEntities : faqEntities,
    },
    ...(howToSteps.length > 0 ? [{
      '@type': 'HowTo',
      '@id': `${sUrl}#howto`,
      name: `How to Choose the Right ${sName} Provider`,
      description: `Step-by-step framework to evaluate and select the right ${sName} provider, based on InfoWebWorld's editorial methodology.`,
      image: meta.heroImage || `${DOMAIN}/og-image.png`,
      totalTime: 'PT15M',
      step: howToSteps,
    }] : []),
    ...(isProServices ? [proFieldsItemList] : []),
    ...listingNodes,
  ]
  // monthYear param accepted for future expansion (Article body templating);
  // current emission doesn't reference it directly so reference once to keep TS quiet.
  void monthYear

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}

/* Sector-aware name qualifier — disambiguates ambiguous category names
   like "Software", "Tools", "Models", "Services" when they sit inside a
   specific sector. Without this, a /ai-ml/software-development page would
   title as "Top Software Development Companies" and users (and Google)
   could confuse it with the /software-saas sector. Only applies when the
   category name doesn't already reference the sector concept. */
function qualifyCategoryName(name: string, sectorSlug: string): string {
  if (!name) return name
  const lc = name.toLowerCase()
  if (sectorSlug === 'ai-ml') {
    if (/\b(ai|ml|a\.i\.|m\.l\.|artificial[- ]intelligence|machine[- ]learning|llm|gpt|neural|deep[- ]learning|generative|nlp)\b/.test(lc)) return name
    return `AI & ML ${name}`
  }
  /* Other sectors keep their bare name for now — extend here per request. */
  return name
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
  const baseName = qualifyCategoryName(cat.seoTitle || cat.name, sectorSlug)
  const year = new Date().getFullYear()

  /* Title — buying-intent first ("Best"), "Companies" carries the high-CTR
     directory-search keyword, year for freshness, single hyphen separator
     (no em-dash), brand trailing. No listing count: thin-page categories
     would expose tiny numbers in the SERP, and dense ones would expose
     numbers that age fast. Keep ~55-65 chars so SERP doesn't truncate. */
  const title = `Best ${baseName} Companies (${year}) - Reviews & Pricing | InfoWebWorld`

  /* Description — buying-intent keyword stack + trust signal + freshness.
     ~155 chars. Rating is a trust signal (rich-snippet eligible via
     AggregateRating schema) and stays; the bare listing count does not. */
  const ratingClause = rating && rating.total > 0
    ? `Rated ${rating.avg.toFixed(1)}/5 by ${rating.total.toLocaleString()} verified users. `
    : ''
  const description = `Compare the best ${baseName.toLowerCase()} companies on InfoWebWorld - top picks, verified reviews, transparent pricing & features. ${ratingClause}Updated ${monthYear}.`.trim()

  const url = canonicalUrl(country, `/${sectorSlug}/${cat.slug}`)
  /* Dynamic per-category OG image — rendered at request time by
     /api/og/{sector}/{slug} with the category name, listing count, and
     sector palette. Replaces the static fallback so every category gets
     a distinct social share card + Google Discover thumbnail. DB-stored
     seoOgImage still wins if explicitly set. */
  const ogImage = cat.seoOgImage || `${DOMAIN}/api/og/${sectorSlug}/${cat.slug}`

  /* Keyword stack — DB seo_keywords + targeted variants spanning buying
     intent ("hire", "best", "buy"), comparison ("vs", "alternatives",
     "compare"), modifier ("top rated", "enterprise", "free"), and temporal
     ("2026") modifiers Google + AI search engines reward. */
  const lcName = baseName.toLowerCase()
  const autoKw = [
    lcName,
    `best ${lcName}`,
    `top ${lcName}`,
    `top rated ${lcName}`,
    `top ${lcName} companies`,
    `top ${lcName} agencies`,
    `${lcName} companies`,
    `${lcName} reviews`,
    `${lcName} comparison`,
    `compare ${lcName}`,
    `${lcName} alternatives`,
    `${lcName} pricing`,
    `${lcName} cost`,
    `${lcName} services`,
    `${lcName} tools`,
    `${lcName} software`,
    `${lcName} platforms`,
    `hire ${lcName}`,
    `best ${lcName} ${year}`,
    `${lcName} ${year}`,
    `${lcName} list`,
    `${lcName} rankings`,
    `${lcName} buyer's guide`,
    `enterprise ${lcName}`,
    `${lcName} for small business`,
  ]
  const keywords = [...new Set([...cat.seoKeywords.map(k => k.toLowerCase()), ...autoKw])].join(', ')

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: cat.seoCanonical || url,
      /* hreflang — declares the locale of this page. en-US explicit + x-default
         pointing at the same URL satisfies Google's international handling
         even though we're English-only right now. Enables future localization
         without breaking existing URLs. */
      languages: {
        'en-US': url,
        'x-default': url,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'InfoWebWorld',
      type: 'website',
      locale: 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${baseName} - Top Companies` }],
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
  const baseName = qualifyCategoryName(cat.seoTitle || cat.name, sectorSlug)
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
  /* AggregateRating intentionally NOT set on CollectionPage — Google's
     Review Snippet rich result whitelist is limited to Product, Service,
     LocalBusiness, SoftwareApplication, Organization, Book, Course,
     Event, HowTo, Movie, Recipe, MediaObject. CollectionPage isn't on
     that list, so emitting aggregateRating here triggers "Invalid object
     type for field" in Rich Results testing. Page-level rating signal
     is instead carried by the per-listing schemas below, which use valid
     review-snippet parent types. */
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
     Type discipline: only set fields the chosen @type actually defines —
     foundingDate / numberOfEmployees on LocalBusiness only, applicationCategory
     on SoftwareApplication only, etc. Mixing them up fails Google's Rich
     Results test with "Invalid object type for field" errors. */
  const sectorIsSoftware = sectorSlug === 'ai-ml' || sectorSlug === 'software-saas'

  /* Parse "$25-$49/hr" / "$50/hr" / "$25-$49" into AggregateOffer-friendly
     numbers. Returns null when no digits found. */
  const parseHourly = (s?: string): { low: number; high: number } | { single: number } | null => {
    if (!s) return null
    const nums = s.match(/\d+/g)
    if (!nums || nums.length === 0) return null
    if (nums.length >= 2) {
      const lo = Number(nums[0]); const hi = Number(nums[1])
      if (hi > lo) return { low: lo, high: hi }
      return { single: lo }
    }
    return { single: Number(nums[0]) }
  }

  const seedSchemas = (seedListings || []).slice(0, 12).map(l => {
    const href = (l.listingMode === 'company' ? '/profile/' : '/listing/') + l.slug
    const fullUrl = canonicalUrl(country, href)
    const isCompany = l.listingMode === 'company'
    const type = isCompany ? 'LocalBusiness' : (sectorIsSoftware ? 'SoftwareApplication' : 'Product')

    /* Base fields valid for every supported @type. */
    const node: Record<string, unknown> = {
      '@type': type,
      '@id': `${fullUrl}#listing`,
      name: l.companyName,
      url: fullUrl,
      ...(l.tagline || l.description ? { description: (l.tagline || l.description || '').slice(0, 300) } : {}),
      ...(l.logoUrl ? { image: l.logoUrl } : {}),
    }

    /* AggregateRating works on Product, SoftwareApplication, LocalBusiness,
       Service — all our chosen types. */
    if (l.reviewAvg && l.reviewCount && l.reviewCount > 0) {
      node.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: Number(l.reviewAvg.toFixed(1)),
        reviewCount: l.reviewCount,
        bestRating: 5,
        worstRating: 1,
      }
    }

    /* Offers — AggregateOffer for ranges, Offer for single price. Numbers
       only (no "$25-$49/hr" strings — Google's parser rejects those). */
    const hr = parseHourly(l.hourlyRate)
    if (hr) {
      node.offers = 'low' in hr
        ? {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            lowPrice: hr.low,
            highPrice: hr.high,
            availability: 'https://schema.org/InStock',
          }
        : {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: hr.single,
            availability: 'https://schema.org/InStock',
          }
    }

    /* sameAs works on every Thing-derived type. */
    if (l.website) node.sameAs = [l.website]

    /* ── LocalBusiness-only fields ── */
    if (type === 'LocalBusiness') {
      if (l.city || l.state || l.country) {
        node.address = {
          '@type': 'PostalAddress',
          ...(l.city ? { addressLocality: l.city } : {}),
          ...(l.state ? { addressRegion: l.state } : {}),
          ...(l.country ? { addressCountry: l.country } : {}),
        }
      }
      if (l.founded) node.foundingDate = String(l.founded)
      if (l.employees) {
        /* numberOfEmployees expects a QuantitativeValue, not a free string. */
        const empNums = String(l.employees).match(/\d+/g)
        if (empNums && empNums.length >= 1) {
          node.numberOfEmployees = empNums.length >= 2
            ? { '@type': 'QuantitativeValue', minValue: Number(empNums[0]), maxValue: Number(empNums[1]) }
            : { '@type': 'QuantitativeValue', value: Number(empNums[0]) }
        }
      }
    }

    /* ── SoftwareApplication-only fields ── */
    if (type === 'SoftwareApplication') {
      node.applicationCategory = 'BusinessApplication'
      node.operatingSystem = 'Web'
    }

    /* ── Product-only fields ── */
    if (type === 'Product') {
      node.brand = { '@type': 'Brand', name: l.companyName }
      if (l.categoryName) node.category = l.categoryName
    }

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
      target: { '@type': 'EntryPoint', urlTemplate: `${DOMAIN}/search?q={search_term_string}` },
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

  /* ── view-all page — sector categories browse ──
     Was noindex with a one-liner description. Now full SEO/AEO/GEO surface:
     unique title carrying counts + year, rich keyword stack, dynamic OG
     image, hreflang, indexable. Matches the /categories metadata depth. */
  if (isViewAll && viewAllSector && L1_SLUGS.has(viewAllSector)) {
    const meta = getSectorMeta(viewAllSector)
    const url = canonicalUrl(country, `/${viewAllSector}/${viewAllSlug(viewAllSector)}`)
    const year = new Date().getFullYear()

    /* Static taxonomy counts for this sector — no DB hit; the file lives
       in the same edge bundle as the page. */
    const sectorRow = STATIC_CATEGORIES.find(r => r.slug === viewAllSector && r.level === 1)
    const sectorId = sectorRow ? sectorRow.id : 0
    const l2InSector = STATIC_CATEGORIES.filter(r => r.parent_id === sectorId && r.level === 2).length
    const l2Ids = new Set(
      STATIC_CATEGORIES.filter(r => r.parent_id === sectorId && r.level === 2).map(r => r.id)
    )
    const l3InSector = STATIC_CATEGORIES.filter(
      r => r.level === 3 && r.parent_id != null && l2Ids.has(r.parent_id)
    ).length

    /* Use the short, clean sector label (e.g., "AI & ML") for the title and
       headings. Single hyphen separator (no em-dash). Suffix carries the
       buying-intent keyword "Companies" so the title hits both browse
       ("Categories") and buy ("Top Companies") search intents. */
    const shortName = meta.shortName
    const lcName = shortName.toLowerCase()
    const title = `${shortName} Categories (${year}) - Find Top Companies | InfoWebWorld`
    const description = `Every ${shortName} category on InfoWebWorld - browse top companies by topic, read verified reviews, compare pricing & features. Updated ${monthYear}.`

    /* Keyword stack — sector + browse/discovery intent + comparative +
       temporal modifiers that Google + AI engines reward. */
    const autoKw = [
      `${lcName} categories`,
      `${lcName} subcategories`,
      `${lcName} directory`,
      `${lcName} companies list`,
      `${lcName} taxonomy`,
      `browse ${lcName}`,
      `list of ${lcName} tools`,
      `${lcName} ${year}`,
      `find ${lcName}`,
      `${lcName} comparison`,
      `verified ${lcName} listings`,
      `${lcName} marketplace`,
      `top ${lcName} categories`,
    ]
    const keywords = [...new Set([...meta.seoKeywords.map(k => k.toLowerCase()), ...autoKw])].join(', ')

    const sectorOgImage = `${DOMAIN}/api/og/${viewAllSector}`

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: url,
        languages: { 'en-US': url, 'x-default': url },
      },
      openGraph: {
        title,
        description,
        url,
        siteName: 'InfoWebWorld',
        type: 'website',
        locale: 'en_US',
        images: [{ url: sectorOgImage, width: 1200, height: 630, alt: `${shortName} Categories — InfoWebWorld` }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [sectorOgImage],
        site: '@infowebworld',
      },
      /* Threshold doesn't apply here — view-all is a curated index page over a
         non-trivial sector taxonomy, always worth indexing. */
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
      other: {
        'article:section': `${shortName} Categories`,
        'article:tag': `${lcName}, business categories, directory, ${meta.seoKeywords.slice(0, 5).join(', ')}`,
        'article:modified_time': new Date().toISOString(),
        'DC.title': `${shortName} Categories — InfoWebWorld`,
        'DC.subject': `${lcName} taxonomy, business directory, category list`,
        'DC.language': 'en-US',
        'DC.coverage': 'Worldwide',
        'DC.type': 'Collection',
        'theme-color': '#E8553D',
      },
    }
  }

  /* ── L1 Sectors — full SEO/AEO/GEO metadata surface. ── */
  if (L1_SLUGS.has(slug) && segments.length === 1) {
    const meta = getSectorMeta(slug)
    const url = canonicalUrl(country, `/${slug}`)
    const year = new Date().getFullYear()

    /* Pull aggregate listing count + review aggregate for this sector tree —
       same UNION-across-levels pattern used for L2-L4 categories. Used to
       advertise count + rating in title/description, both of which drive
       SERP CTR. */
    let listingCount = 0
    let rating: { avg: number; total: number } | null = null
    try {
      const [cntRow, ratingRow] = await Promise.all([
        queryOne(
          `SELECT COUNT(*) as cnt FROM submissions s WHERE s.status IN ('active','paid') AND s.category_id IN (
             SELECT id FROM categories WHERE id = (SELECT id FROM categories WHERE slug = ? AND level = 1)
             UNION SELECT id FROM categories WHERE parent_id = (SELECT id FROM categories WHERE slug = ? AND level = 1)
             UNION SELECT c3.id FROM categories c3 JOIN categories c2 ON c2.id = c3.parent_id WHERE c2.parent_id = (SELECT id FROM categories WHERE slug = ? AND level = 1)
             UNION SELECT c4.id FROM categories c4 JOIN categories c3 ON c3.id = c4.parent_id JOIN categories c2 ON c2.id = c3.parent_id WHERE c2.parent_id = (SELECT id FROM categories WHERE slug = ? AND level = 1)
           )`,
          [slug, slug, slug, slug]
        ).catch(() => ({ cnt: 0 })),
        queryOne(
          `SELECT AVG(r.rating) as avg_rating, COUNT(*) as total_reviews
           FROM reviews r
           JOIN submissions s ON s.id = r.listing_id
           WHERE r.status = 'approved' AND s.status IN ('active','paid')
             AND s.category_id IN (
               SELECT id FROM categories WHERE id = (SELECT id FROM categories WHERE slug = ? AND level = 1)
               UNION SELECT id FROM categories WHERE parent_id = (SELECT id FROM categories WHERE slug = ? AND level = 1)
               UNION SELECT c3.id FROM categories c3 JOIN categories c2 ON c2.id = c3.parent_id WHERE c2.parent_id = (SELECT id FROM categories WHERE slug = ? AND level = 1)
               UNION SELECT c4.id FROM categories c4 JOIN categories c3 ON c3.id = c4.parent_id JOIN categories c2 ON c2.id = c3.parent_id WHERE c2.parent_id = (SELECT id FROM categories WHERE slug = ? AND level = 1)
             )`,
          [slug, slug, slug, slug]
        ).catch(() => ({ avg_rating: null, total_reviews: 0 })),
      ])
      listingCount = Number(cntRow?.cnt ?? 0)
      if (ratingRow?.avg_rating != null && Number(ratingRow?.total_reviews ?? 0) > 0) {
        rating = { avg: Number(ratingRow.avg_rating), total: Number(ratingRow.total_reviews) }
      }
    } catch { /* aggregate is optional */ }

    /* Title — sector seoTitle already leads with "Best" and includes a
       sector-noun (Tools/Services/Platforms/Businesses), so just wrap with
       (year) + brand. Single hyphen separator (no em-dash). No listing
       count: tiny numbers expose thin-page weakness, dense ones age fast. */
    let title = `${meta.seoTitle} (${year}) | InfoWebWorld`

    /* Description — value prop + buying-intent keywords + trust signal +
       freshness. ~155 chars. Rating stays (AggregateRating rich-snippet
       signal), listing count drops. */
    const ratingClause = rating
      ? `Rated ${rating.avg.toFixed(1)}/5 by ${rating.total.toLocaleString()} verified users. `
      : ''
    let description = `${meta.seoDescription} ${ratingClause}Compare verified providers - pricing, reviews, features & alternatives. Updated ${monthYear}.`.trim()

    /* ── Exact-match optimization for the "professional services directory"
       target query. Scoped to this ONE sector via the slug guard — every
       other L1 sector keeps the generic title/description built above. ── */
    if (slug === 'professional-services') {
      title = `Professional Services Directory (${year}) | InfoWebWorld`
      description = `Professional services directory of verified accounting, legal, consulting, HR & financial firms - real client reviews, no pay-to-play. Updated ${monthYear}.`
    }
    if (slug === 'ai-ml') {
      title = `AI Tools Directory (${year}) | InfoWebWorld`
      description = `AI tools directory of verified AI tools, agents & models with real user reviews - no pay-to-play. Submit your AI tool free. Updated ${monthYear}.`
    }
    if (slug === 'startups-innovation') {
      title = `Startup Directory (${year}) | InfoWebWorld`
      description = `Startup directory of verified startups across FinTech, HealthTech, EdTech, ClimateTech, AI & Web3 - real reviews, no pay-to-play. Submit your startup free. Updated ${monthYear}.`
    }

    /* Keyword stack — sector name + buying-intent + comparative + temporal
       modifiers Google + AI engines reward. Includes sector-specific verticals
       from getSectorMeta + auto-generated variants. */
    const lcName = meta.seoTitle.toLowerCase()
    const shortLc = meta.shortName.toLowerCase()
    const autoKw = [
      lcName,
      shortLc,
      `best ${shortLc}`,
      `top ${shortLc}`,
      `top rated ${shortLc}`,
      `top ${shortLc} companies`,
      `${shortLc} companies`,
      `${shortLc} reviews`,
      `${shortLc} comparison`,
      `compare ${shortLc}`,
      `${shortLc} alternatives`,
      `${shortLc} pricing`,
      `${shortLc} cost`,
      `${shortLc} services`,
      `hire ${shortLc}`,
      `best ${shortLc} ${year}`,
      `${shortLc} ${year}`,
      `${shortLc} list`,
      `${shortLc} rankings`,
      `${shortLc} buyer's guide`,
      `verified ${lcName}`,
      `${lcName} directory`,
    ]
    const keywords = [...new Set([...meta.seoKeywords.map(k => k.toLowerCase()), ...autoKw])].join(', ')

    /* Dynamic per-sector OG image — rendered at request time by
       /api/og/{sector} with sector name + listing count + brand palette. */
    const sectorOgImage = `${DOMAIN}/api/og/${slug}`

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: url,
        languages: {
          'en-US': url,
          'x-default': url,
        },
      },
      openGraph: {
        title,
        description,
        url,
        siteName: 'InfoWebWorld',
        type: 'website',
        locale: 'en_US',
        images: [{ url: sectorOgImage, width: 1200, height: 630, alt: `${meta.seoTitle} — Top Companies on InfoWebWorld` }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [sectorOgImage],
        site: '@infowebworld',
      },
      /* SEO-FIRST: index + follow. Every L1 sector page is a unique
         CollectionPage with curated listings + Gemini long-form content +
         aggregate review signal — exactly what Google wants to rank. */
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
    /* shortName ("AI & ML") reads cleanly in "{shortName} Directory" framing.
       The longer seoTitle ("Best AI & ML Tools, Platforms & Services") is
       reserved for the L1 landing page. fullSectorName is the canonical
       taxonomy name ("Artificial Intelligence & ML") — folded into body
       copy + schema to carry long-tail SEO signal alongside the short label. */
    const sectorName = sectorMeta.shortName
    const sectorRow = STATIC_CATEGORIES.find(r => r.slug === viewAllSector2 && r.level === 1)
    const fullSectorName = sectorRow?.name || sectorName
    const sectorId = sectorRow ? sectorRow.id : 0
    const l2RowsInSector = STATIC_CATEGORIES.filter(r => r.parent_id === sectorId && r.level === 2)
    const l2InSector = l2RowsInSector.length
    const l2IdSet = new Set(l2RowsInSector.map(r => r.id))
    const l3InSector = STATIC_CATEGORIES.filter(
      r => r.level === 3 && r.parent_id != null && l2IdSet.has(r.parent_id)
    ).length
    const totalListingsInSector = STATIC_CATEGORIES.reduce((s, r) => {
      if (r.level === 1 && r.id === sectorId) return s + (r.listing_count || 0)
      if (r.level === 2 && r.parent_id === sectorId) return s + (r.listing_count || 0)
      if (r.level === 3 && r.parent_id != null && l2IdSet.has(r.parent_id)) return s + (r.listing_count || 0)
      return s
    }, 0)

    const URL_VIEWALL = `${SEO_BASE_URL}/${viewAllSector2}/${viewAllSlug(viewAllSector2)}`
    const yearNow = new Date().getFullYear()
    const monthYearNow = currentMonthYear()
    const lcSectorName = sectorName.toLowerCase()

    /* ── Schema graph IDs ── */
    const ID_BREADCRUMB = `${URL_VIEWALL}#breadcrumb`
    const ID_WEBPAGE    = `${URL_VIEWALL}#webpage`
    const ID_ITEMLIST   = `${URL_VIEWALL}#categorylist`
    const ID_DATASET    = `${URL_VIEWALL}#dataset`
    const ID_TERMSET    = `${URL_VIEWALL}#hierarchy`
    const ID_HOWTO      = `${URL_VIEWALL}#howto`
    const ID_FAQ        = `${URL_VIEWALL}#faq`

    /* CollectionPage / WebPage — the focal entity. Carries all the AEO/GEO
       signals: about, mentions, audience, speakable, significantLink. */
    const webPageNode = {
      '@type': ['WebPage', 'CollectionPage'],
      '@id': ID_WEBPAGE,
      url: URL_VIEWALL,
      name: `${sectorName} Categories ${yearNow}`,
      headline: `${sectorName} Categories — ${l2InSector} Topics, ${l3InSector.toLocaleString()} Subcategories`,
      description: `Every ${sectorName} category on InfoWebWorld — ${l2InSector} topics and ${l3InSector.toLocaleString()} subcategories inside ${fullSectorName}, every verified company. Updated ${monthYearNow}.`,
      inLanguage: 'en-US',
      isPartOf: { '@id': ID_WEBSITE },
      breadcrumb: { '@id': ID_BREADCRUMB },
      publisher: { '@id': ID_ORG },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${DOMAIN}/api/og/${viewAllSector2}`,
        width: 1200, height: 630,
        caption: `${sectorName} Categories — InfoWebWorld`,
      },
      about: [
        { '@type': 'Thing', name: sectorName },
        { '@type': 'Thing', name: fullSectorName },
        { '@type': 'Thing', name: `${sectorName} categories` },
        { '@type': 'Thing', name: `${sectorName} directory` },
        { '@type': 'Thing', name: 'Business directory' },
        { '@type': 'Thing', name: 'Industry taxonomy' },
      ],
      audience: {
        '@type': 'Audience',
        audienceType: 'Business buyers, founders, marketers, technology evaluators',
      },
      accessibilityFeature: ['highContrastDisplay', 'readingOrder', 'structuralNavigation', 'tableOfContents'],
      accessibilityHazard: 'none',
      mentions: l2RowsInSector.slice(0, 15).map(l2 => ({
        '@type': 'Thing',
        name: l2.name,
        url: `${SEO_BASE_URL}/${viewAllSector2}/${l2.slug}`,
      })),
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.cd-server-h1', '.cd-server-desc', '.cd-server-h2'],
      },
      significantLink: l2RowsInSector.slice(0, 20).map(l2 => `${SEO_BASE_URL}/${viewAllSector2}/${l2.slug}`),
      mainEntity: { '@id': ID_ITEMLIST },
      mainEntityOfPage: URL_VIEWALL,
      numberOfItems: l2InSector + l3InSector,
      datePublished: '2026-04-24',
      dateModified: new Date().toISOString().split('T')[0],
      copyrightYear: yearNow,
      copyrightHolder: { '@id': ID_ORG },
      license: `${SEO_BASE_URL}/terms`,
      isAccessibleForFree: true,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SEO_BASE_URL}/search?q={search_term_string}&sector=${viewAllSector2}`,
        },
        'query-input': 'required name=search_term_string',
      },
      keywords: [
        `${lcSectorName} directory`,
        `${lcSectorName} categories`,
        `${lcSectorName} subcategories`,
        `complete ${lcSectorName} directory`,
        `browse ${lcSectorName}`,
        `${lcSectorName} taxonomy`,
        `${lcSectorName} ${yearNow}`,
        `${fullSectorName.toLowerCase()} directory`,
      ].join(', '),
    }

    /* ItemList of L2 categories in this sector — Google + LLM citation engines
       parse this to surface the sector's top categories as sitelinks-style
       answers. */
    const itemList = {
      '@type': 'ItemList',
      '@id': ID_ITEMLIST,
      name: `Categories in ${sectorName}`,
      description: `Top-level categories inside the ${lcSectorName} sector on InfoWebWorld. Each contains tens to hundreds of subcategories and verified businesses.`,
      numberOfItems: l2InSector,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: l2RowsInSector.map((l2, i) => {
        const l3sUnder = STATIC_CATEGORIES.filter(r => r.level === 3 && r.parent_id === l2.id).length
        return {
          '@type': 'ListItem',
          position: i + 1,
          url: `${SEO_BASE_URL}/${viewAllSector2}/${l2.slug}`,
          name: l2.name,
          item: {
            '@type': 'Thing',
            '@id': `${SEO_BASE_URL}/${viewAllSector2}/${l2.slug}#category`,
            name: l2.name,
            description: `${l2.name} — ${l3sUnder} subcategories inside ${sectorName} on InfoWebWorld.`,
            url: `${SEO_BASE_URL}/${viewAllSector2}/${l2.slug}`,
          },
        }
      }),
    }

    /* Dataset entity — the curated sector taxonomy slice. Dataset entities are
       a strong AEO signal (Google Dataset Search + LLM citation). */
    const datasetNode = {
      '@type': 'Dataset',
      '@id': ID_DATASET,
      name: `InfoWebWorld ${sectorName} taxonomy`,
      alternateName: `${sectorName} categories dataset`,
      description: `Human-curated taxonomy of ${l2InSector} categories and ${l3InSector.toLocaleString()} subcategories inside the ${lcSectorName} sector. Covers every verified business listing on InfoWebWorld within ${sectorName}.`,
      url: URL_VIEWALL,
      sameAs: URL_VIEWALL,
      creator: { '@id': ID_ORG },
      publisher: { '@id': ID_ORG },
      license: `${SEO_BASE_URL}/terms`,
      isAccessibleForFree: true,
      inLanguage: 'en-US',
      keywords: `${lcSectorName}, ${lcSectorName} categories, ${lcSectorName} subcategories, business directory, industry taxonomy`,
      datePublished: '2026-04-24',
      dateModified: new Date().toISOString().split('T')[0],
      variableMeasured: [
        { '@type': 'PropertyValue', name: 'Categories (Level 2)', value: l2InSector },
        { '@type': 'PropertyValue', name: 'Subcategories (Level 3)', value: l3InSector },
        { '@type': 'PropertyValue', name: 'Verified listings', value: totalListingsInSector },
      ],
      spatialCoverage: { '@type': 'Place', name: 'Worldwide' },
      temporalCoverage: '2026/..',
      distribution: {
        '@type': 'DataDownload',
        encodingFormat: 'text/html',
        contentUrl: URL_VIEWALL,
      },
    }

    /* DefinedTermSet — explains the 3-level hierarchy to crawlers + LLMs.
       Same structure as /categories but the term examples are sector-scoped. */
    const definedTermSet = {
      '@type': 'DefinedTermSet',
      '@id': ID_TERMSET,
      name: `${sectorName} category hierarchy terms`,
      inLanguage: 'en-US',
      hasDefinedTerm: [
        {
          '@type': 'DefinedTerm',
          '@id': `${URL_VIEWALL}#term-sector`,
          name: 'Sector',
          alternateName: 'L1',
          description: `The top-level industry grouping on InfoWebWorld. ${sectorName} is one of 6 sectors.`,
          inDefinedTermSet: { '@id': ID_TERMSET },
        },
        {
          '@type': 'DefinedTerm',
          '@id': `${URL_VIEWALL}#term-category`,
          name: 'Category',
          alternateName: 'L2',
          description: `A specific market inside ${sectorName}. ${sectorName} has ${l2InSector} categories — examples: ${l2RowsInSector.slice(0, 3).map(r => r.name).join(', ')}.`,
          inDefinedTermSet: { '@id': ID_TERMSET },
        },
        {
          '@type': 'DefinedTerm',
          '@id': `${URL_VIEWALL}#term-subcategory`,
          name: 'Subcategory',
          alternateName: 'L3',
          description: `The precise niche where buyers compare alternatives inside ${sectorName}. ${l3InSector.toLocaleString()} subcategories total.`,
          inDefinedTermSet: { '@id': ID_TERMSET },
        },
      ],
    }

    /* HowTo — the canonical 4-step flow for finding a business in this
       sector. Drives "how-to" rich-result eligibility + LLM step extraction. */
    const howToNodeBuilt = howToNode({
      id: ID_HOWTO,
      name: `How to find a ${lcSectorName} business on InfoWebWorld`,
      description: `Four steps to find verified businesses inside the ${lcSectorName} sector on InfoWebWorld — search by keyword, browse by category, drill into a subcategory, and compare alternatives.`,
      totalTime: 'PT2M',
      steps: [
        { name: `Open the ${sectorName} Categories page`, text: `Go to the ${sectorName} Categories index to see all ${l2InSector} top-level categories and ${l3InSector.toLocaleString()} subcategories.`, url: URL_VIEWALL },
        { name: 'Search by keyword', text: `Type a product, problem, or industry keyword in the search bar — the search is scoped to ${sectorName} so results are always relevant.` },
        { name: 'Or browse by category', text: `Click any of the ${l2InSector} category cards to expand its subcategories. Pick the subcategory closest to what you need.` },
        { name: 'Compare verified businesses', text: 'On the subcategory page, see every verified business listed there. Filter by location, plan tier, and rating; click any listing for the full profile, real reviews, and direct contact.' },
      ],
    })

    /* Sector-specific FAQs — answers the questions buyers actually ask. */
    const faqsForSector = [
      {
        q: `How many ${lcSectorName} categories are on InfoWebWorld?`,
        a: `InfoWebWorld lists ${l2InSector} top-level ${lcSectorName} categories and ${l3InSector.toLocaleString()} subcategories. Every category contains verified businesses with real reviews and side-by-side comparison.`,
      },
      {
        q: `How do I find ${lcSectorName} businesses by category?`,
        a: `Use the search bar on the ${sectorName} Categories page — it searches across every ${lcSectorName} category and subcategory instantly. Or browse the category grid: pick the L2 card closest to your need, then click any L3 subcategory to see all verified businesses listed under it.`,
      },
      {
        q: `What's the difference between an L2 category and an L3 subcategory in ${sectorName}?`,
        a: `An L2 category is a specific market inside ${sectorName} (${l2InSector} total). An L3 subcategory is the precise niche where buyers compare alternatives (${l3InSector.toLocaleString()} total). Listings are tagged to one primary L3 subcategory plus up to two secondary subcategories.`,
      },
      {
        q: `Are ${sectorName} listings on InfoWebWorld verified?`,
        a: `Yes. Every business listed under ${sectorName} on InfoWebWorld is human-verified before going live. Reviews are identity-checked. Rankings are merit-based — pay-to-play does not buy placement.`,
      },
      {
        q: `Is the ${sectorName} Categories page free to browse?`,
        a: `Yes. Browsing every ${lcSectorName} category, subcategory, and listing on InfoWebWorld is free for buyers. Only businesses pay to be listed (free and paid plans available).`,
      },
      {
        q: `How often is the ${sectorName} taxonomy updated?`,
        a: `New ${lcSectorName} categories and subcategories are added as new markets emerge. The taxonomy is reviewed quarterly and updated when buyer demand and listing supply justify a change.`,
      },
    ]
    const faqJsonLd = faqNode(faqsForSector, ID_FAQ, ID_WEBPAGE)

    const allJsonLdGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        organizationNode,
        brandNode,
        websiteNode,
        breadcrumbNode(
          [
            { name: 'Home', url: SEO_BASE_URL },
            { name: `${sectorName} Categories`, url: URL_VIEWALL },
          ],
          ID_BREADCRUMB,
        ),
        webPageNode,
        itemList,
        datasetNode,
        definedTermSet,
        howToNodeBuilt,
        faqJsonLd,
      ],
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(allJsonLdGraph) }}
        />
        <Navbar sectorSlug={viewAllSector2} />
        {/* sr-only skeleton — H1 + breadcrumb visible to crawlers / screen
            readers before client hydration. Speakable selectors target these
            classes so AI voice readers pick up the answer-first content. */}
        <div className="cd-server-skeleton">
          <nav className="cd-server-breadcrumb" aria-label="Breadcrumb">
            <a href="/" aria-label="Home"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></a><span> &gt; </span><span>{sectorName} Categories</span>
          </nav>
          <h1 className="cd-server-h1">
            {sectorName} Categories — {l2InSector} Topics, {l3InSector.toLocaleString()} Subcategories
          </h1>
          <p className="cd-server-desc">
            Every {fullSectorName} category on InfoWebWorld — {l2InSector} topics and {l3InSector.toLocaleString()} subcategories inside {sectorName}. Every verified company, free to browse.
          </p>
          <h2 className="cd-server-h2">Categories in {sectorName}</h2>
        </div>
        <Suspense><SectorAllBrowse sectorSlug={viewAllSector2} /></Suspense>

        {/* ════════════════════════════════════════════════════════════════
            Visible SEO/AEO/GEO content surface — mirrors the .cat-seo block
            on /categories, scoped to this single sector. Every element here
            is human-readable AND the @graph above schema-describes the same
            content, so Google + LLMs can cite, quote, or speak it back.
            ════════════════════════════════════════════════════════════════ */}
        <section className="cat-seo" aria-label={`Browse, hierarchy, and FAQ for ${sectorName}`}>
          {/* TL;DR — answer-first paragraph for AI engines + featured snippets */}
          <div className="cat-seo-wrap cat-seo-tldr">
            <div className="cat-seo-tldr-card">
              <span className="cat-seo-tldr-label">What is this page</span>
              <p className="cat-seo-tldr-body">
                <strong>InfoWebWorld&apos;s complete {sectorName} taxonomy.</strong> {l2InSector}{' '}
                categories, {l3InSector.toLocaleString()} subcategories, and{' '}
                {totalListingsInSector.toLocaleString()} verified businesses inside the{' '}
                {lcSectorName} sector. Every listing is human-verified, every review is
                identity-checked, every ranking is merit-based.
              </p>
              <p className="cat-seo-tldr-meta">
                <span>
                  Updated{' '}
                  <time dateTime={new Date().toISOString().split('T')[0]}>
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                </span>
                <span aria-hidden="true">·</span>
                <span>Human-curated</span>
                <span aria-hidden="true">·</span>
                <span>Free to browse</span>
              </p>
            </div>
          </div>

          {/* Browse Categories in {Sector} — 3-column .va-cards grid that
              mirrors the bordered folder+name card design from the listing
              page's subcategory list (Image #24). Each card: thin gray
              border, folder icon + bold name both tinted with the sector
              accent (--sec). Schema.org ItemList microdata still carried
              on every card so the DOM agrees with the @graph above. */}
          <div className="cat-seo-wrap">
            <header className="cat-seo-head">
              <h2 className="cat-seo-h2">Browse Categories in {sectorName}</h2>
              <p className="cat-seo-section-desc">
                Every category inside {sectorName}. Click any to see all subcategories and
                verified listings.
              </p>
            </header>
            <nav
              className="va-cards"
              aria-label={`Categories in ${sectorName}`}
              itemScope
              itemType="https://schema.org/ItemList"
              style={{ '--sec': SECTOR_ACCENT[viewAllSector2] || '#14B8A6' } as React.CSSProperties}
            >
              <meta itemProp="numberOfItems" content={String(l2RowsInSector.length)} />
              {l2RowsInSector.map((l2, i) => (
                <a
                  key={l2.slug}
                  href={`/${viewAllSector2}/${l2.slug}`}
                  className="va-card"
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  <meta itemProp="position" content={String(i + 1)} />
                  <link itemProp="url" href={`${SEO_BASE_URL}/${viewAllSector2}/${l2.slug}`} />
                  <span className="va-card-ico" aria-hidden="true">
                    <VaFolderIcon size={22} />
                  </span>
                  <span className="va-card-name" itemProp="name">{l2.name}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* How the Hierarchy Works — sector-scoped examples in the L2/L3
              term descriptions so each view-all page has a unique explainer. */}
          <div className="cat-seo-wrap">
            <header className="cat-seo-head">
              <h2 className="cat-seo-h2">How the {sectorName} Hierarchy Works</h2>
              <p className="cat-seo-section-desc">
                InfoWebWorld uses a 3-level taxonomy so buyers can search broad or narrow
                without losing relevance — even inside a single sector like {sectorName}.
              </p>
            </header>
            <div className="cat-seo-hierarchy">
              <article className="cat-seo-hier-card" itemScope itemType="https://schema.org/DefinedTerm">
                <span className="cat-seo-hier-level">Level 1</span>
                <h3 itemProp="name">Sector</h3>
                <p itemProp="description">
                  The broad industry grouping. <strong>{sectorName}</strong> is one of 6 sectors on
                  InfoWebWorld. Every business on the platform lives inside exactly one sector.
                </p>
              </article>
              <article className="cat-seo-hier-card" itemScope itemType="https://schema.org/DefinedTerm">
                <span className="cat-seo-hier-level">Level 2</span>
                <h3 itemProp="name">Category</h3>
                <p itemProp="description">
                  A specific market inside {sectorName}. <strong>{l2InSector} total</strong>.
                  {l2RowsInSector.length > 0
                    ? ` Examples: ${l2RowsInSector.slice(0, 3).map(r => r.name).join(', ')}.`
                    : ''}
                </p>
              </article>
              <article className="cat-seo-hier-card" itemScope itemType="https://schema.org/DefinedTerm">
                <span className="cat-seo-hier-level">Level 3</span>
                <h3 itemProp="name">Subcategory</h3>
                <p itemProp="description">
                  The precise niche where buyers compare alternatives inside {sectorName}.{' '}
                  <strong>{l3InSector.toLocaleString()} total</strong>. Listings are tagged to one
                  primary L3 plus up to two secondary subcategories.
                </p>
              </article>
            </div>
          </div>

          {/* How-to flow — answers "how do I find a {sector} business?" as an
              ordered list. Mirrors the HowTo @graph above. */}
          <div className="cat-seo-wrap">
            <header className="cat-seo-head">
              <h2 className="cat-seo-h2">How to Find {sectorName} Businesses</h2>
            </header>
            <ol className="cat-seo-steps">
              <li>
                <strong>Search by keyword.</strong> Type a product, problem, or sub-industry
                keyword in the search bar above; it matches across every {lcSectorName} category
                and subcategory instantly.
              </li>
              <li>
                <strong>Or browse by category.</strong> Click any of the {l2InSector} category
                cards to expand its subcategories. Pick the subcategory closest to what you need.
              </li>
              <li>
                <strong>Open the subcategory.</strong> See every verified {lcSectorName} business
                listed there, filterable by location, plan tier, specializations, and rating.
              </li>
              <li>
                <strong>Compare and contact.</strong> Open any listing for the full profile, real
                reviews, side-by-side comparison with alternatives, and direct contact.
              </li>
            </ol>
          </div>

          {/* FAQ — same six Q&As that the FAQPage @graph above carries, so the
              visible DOM matches the schema. Each <details> uses microdata so
              Google parses Q + A even without seeing the schema script. */}
          <div className="cat-seo-wrap">
            <header className="cat-seo-head">
              <h2 className="cat-seo-h2">Frequently Asked Questions</h2>
              <p className="cat-seo-section-desc">
                Everything buyers ask about finding a {lcSectorName} business on InfoWebWorld.
              </p>
            </header>
            <div className="cat-seo-faq">
              {faqsForSector.map(({ q, a }) => (
                <details key={q} className="cat-seo-faq-item" itemScope itemType="https://schema.org/Question">
                  <summary itemProp="name">{q}</summary>
                  <div className="cat-seo-faq-body" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    <p itemProp="text">{a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

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
  /* ── Fetch ALL data server-side ── */
  let pageData: Awaited<ReturnType<typeof fetchCategoryPageData>> = null

  if (isSector && slug) {
    // L1 sector: fetch allCategories (cached) + Gemini SEO content row.
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

  /* L1 sector pages — build a killer SEO/AEO/GEO @graph BEFORE rendering
     SectorLandingPage, then pass it through as a prop. Mirrors the depth of
     the L2-L4 @graph: Organization, WebSite + SearchAction, BreadcrumbList,
     CollectionPage, Article (sector buyer's guide), DefinedTerm (sector as
     a named concept), HowTo (when buyer's guide questions exist), FAQPage
     with Speakable, plus per-listing Product / SoftwareApplication /
     LocalBusiness schemas for the top firms in the sector. */
  if (isSector && slug && SECTOR_LANDINGS[slug]) {
    /* Sector-tree aggregates for the hero meta strip + per-listing schemas
       in the JSON-LD graph. Same UNION-across-levels pattern used in
       metadata generation. */
    const [sectorJsonLd, aggRow] = await Promise.all([
      buildSectorJsonLd(slug, country, monthYear, pageData?.seoContent || null),
      queryOne(
        `SELECT
           (SELECT COUNT(*) FROM submissions s
              LEFT JOIN categories sc    ON sc.id    = s.category_id
              LEFT JOIN categories scp   ON scp.id   = sc.parent_id
              LEFT JOIN categories scgp  ON scgp.id  = scp.parent_id
              LEFT JOIN categories scggp ON scggp.id = scgp.parent_id
             WHERE s.status IN ('active','paid')
               AND (sc.slug = ? OR scp.slug = ? OR scgp.slug = ? OR scggp.slug = ?)
           ) AS total_listings,
           (SELECT AVG(r.rating) FROM reviews r
              JOIN submissions s ON s.id = r.listing_id
              LEFT JOIN categories sc    ON sc.id    = s.category_id
              LEFT JOIN categories scp   ON scp.id   = sc.parent_id
              LEFT JOIN categories scgp  ON scgp.id  = scp.parent_id
              LEFT JOIN categories scggp ON scggp.id = scgp.parent_id
             WHERE r.status = 'approved' AND s.status IN ('active','paid')
               AND (sc.slug = ? OR scp.slug = ? OR scgp.slug = ? OR scggp.slug = ?)
           ) AS avg_rating,
           (SELECT COUNT(*) FROM reviews r
              JOIN submissions s ON s.id = r.listing_id
              LEFT JOIN categories sc    ON sc.id    = s.category_id
              LEFT JOIN categories scp   ON scp.id   = sc.parent_id
              LEFT JOIN categories scgp  ON scgp.id  = scp.parent_id
              LEFT JOIN categories scggp ON scggp.id = scgp.parent_id
             WHERE r.status = 'approved' AND s.status IN ('active','paid')
               AND (sc.slug = ? OR scp.slug = ? OR scgp.slug = ? OR scggp.slug = ?)
           ) AS total_reviews`,
        [slug, slug, slug, slug, slug, slug, slug, slug, slug, slug, slug, slug]
      ).catch(() => ({ total_listings: 0, avg_rating: null, total_reviews: 0 })),
    ])
    const totalListings = Number(aggRow?.total_listings ?? 0)
    const avgRating = aggRow?.avg_rating != null ? Number(aggRow.avg_rating) : 0
    const totalReviews = Number(aggRow?.total_reviews ?? 0)
    return (
      <SectorLandingPage
        cfg={SECTOR_LANDINGS[slug]}
        seoContent={pageData?.seoContent || null}
        allCategories={pageData?.allCategories || []}
        jsonLd={sectorJsonLd}
        avgRating={avgRating}
        totalReviews={totalReviews}
        totalListings={totalListings}
      />
    )
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

  /* L1 sector JSON-LD lives in SectorLandingPage now (built via
     buildSectorJsonLd above, passed as a prop). This branch is dead because
     the L1 early-return above renders SectorLandingPage directly. Kept as a
     comment marker so future readers don't add inline L1 graph here again. */

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
