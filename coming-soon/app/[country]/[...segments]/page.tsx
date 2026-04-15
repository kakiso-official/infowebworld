import { Suspense } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import AiDisclaimer from '../../components/AiDisclaimer'
import CategoryPage from '../CategoryPage'
import SectorAllBrowse from '../components-category/SectorAllBrowse'
import { getSectorMeta } from '../sector/sector-demo-data'
import { COUNTRY_LABELS, VALID_COUNTRIES } from '../../config/countries'
import type { CountryCode } from '../../config/countries'
import { query, queryOne } from '@/lib/db'

/** No ISR — render dynamically on each request to avoid Vercel ISR write quota */
export const dynamic = 'force-dynamic'

/* ── Known L1 sector slugs ── */
const L1_SLUGS = new Set([
  'ai-ml', 'software-saas', 'it-services-agencies',
  'startups-innovation', 'local-business', 'professional-services',
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
            CASE WHEN c.level = 1 THEN c.slug WHEN c.level = 2 THEN p.slug WHEN c.level = 3 THEN gp.slug END as sector_slug
     FROM categories c LEFT JOIN categories p ON p.id = c.parent_id LEFT JOIN categories gp ON gp.id = p.parent_id
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

/** Real countries get /{country}/ prefix, global gets root */
function canonicalUrl(country: string, path: string) {
  const prefix = country === 'global' ? '' : `/${country}`
  return `${DOMAIN}${prefix}${path}`
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
        END as sector_slug
      FROM categories c
      LEFT JOIN categories p ON p.id = c.parent_id
      LEFT JOIN categories gp ON gp.id = p.parent_id
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
         UNION SELECT c3.id FROM categories c3 JOIN categories c2 ON c2.id = c3.parent_id WHERE c2.parent_id = ? AND c3.is_active = 1
       )`,
      [cid, cid, cid]
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
              CASE WHEN c.level = 1 THEN c.slug WHEN c.level = 2 THEN p.slug WHEN c.level = 3 THEN gp.slug END as sector_slug
       FROM categories c
       LEFT JOIN categories p ON p.id = c.parent_id
       LEFT JOIN categories gp ON gp.id = p.parent_id
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

    // Shared WHERE clause for descendant category IDs (used by listings + count)
    const descendantWhere = `s.category_id IN (
      SELECT id FROM categories WHERE id = ? AND is_active = 1
      UNION SELECT id FROM categories WHERE parent_id = ? AND is_active = 1
      UNION SELECT c3.id FROM categories c3 JOIN categories c2 ON c2.id = c3.parent_id WHERE c2.parent_id = ? AND c3.is_active = 1
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
      // Listings + total count in ONE query using SQL_CALC_FOUND_ROWS pattern (avoids duplicate count query)
      query(
        `SELECT s.id, s.company_name, s.slug, s.tagline, s.description, s.website, s.logo_url,
                s.city, s.state, s.country_id, s.category_id, s.status, s.listing_type_id,
                s.features, s.pricing_model, s.pricing_tiers, s.founded_year, s.team_size,
                s.screenshots, s.approved_at, s.created_at,
                co.name as country_name,
                c.name as category_name, c.slug as category_slug, c.color as category_color, c.icon as category_icon,
                lt.name as listing_type_name, lt.slug as listing_type_slug
         FROM submissions s
         LEFT JOIN categories c ON c.id = s.category_id
         LEFT JOIN listing_types lt ON lt.id = s.listing_type_id
         LEFT JOIN countries co ON co.id = s.country_id
         WHERE s.status IN ('active','paid') AND ${descendantWhere}
         ORDER BY s.approved_at DESC, s.created_at DESC LIMIT 20`,
        [cid, cid, cid]
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

    // Get total count from a single lightweight query (replaces 2 duplicate count queries)
    const countRow = await queryOne(
      `SELECT COUNT(*) as cnt FROM submissions s WHERE s.status IN ('active','paid') AND ${descendantWhere}`,
      [cid, cid, cid]
    ).catch(() => ({ cnt: 0 }))

    const totalCount = Number(countRow?.cnt ?? 0)

    return JSON.parse(JSON.stringify({
      category: { ...catRow, subcategories: subcats, listingTypes, parent: parentRow, activeListings: totalCount },
      allCategories: allCats,
      tagGroups: tagGroupsData,
      listings: listingsWithCount,
      listingTotal: totalCount,
      seoContent: seoContentRow || null,
    }))
  } catch (err) {
    console.error('fetchCategoryPageData error:', err)
    return null
  }
}

/* ── Build metadata for L2/L3 categories ── */
function buildCategoryMeta(cat: CatSeo, country: string, countryName: string, monthYear: string, sectorSlug: string): Metadata {
  const baseName = cat.seoTitle || cat.name
  // Title: 50-60 chars max
  const year = new Date().getFullYear()
  const title = `Best ${baseName} in ${countryName} ${year} | InfoWebWorld`

  // Description: 100-130 chars max
  const countText = cat.listingCount > 0 ? `${cat.listingCount}+ ` : ''
  const description = `Compare ${countText}${baseName} companies in ${countryName}. Verified reviews, pricing & features. Updated ${monthYear}.`

  const url = canonicalUrl(country, `/${sectorSlug}/${cat.slug}`)
  const ogImage = cat.seoOgImage || cat.coverImage || `${DOMAIN}/og-image.png`

  // Merge DB keywords + auto-generated
  const autoKw = [
    baseName.toLowerCase(),
    `best ${baseName.toLowerCase()}`,
    `${baseName.toLowerCase()} ${countryName.toLowerCase()}`,
    `${baseName.toLowerCase()} reviews`,
    `${baseName.toLowerCase()} comparison`,
    `top ${baseName.toLowerCase()} software`,
    `${baseName.toLowerCase()} tools ${new Date().getFullYear()}`,
  ]
  const keywords = [...new Set([...cat.seoKeywords.map(k => k.toLowerCase()), ...autoKw])].join(', ')

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: cat.seoCanonical || url,
      languages: {
        'en-IN': `${DOMAIN}/in/${sectorSlug}/${cat.slug}`,
        'en-US': `${DOMAIN}/us/${sectorSlug}/${cat.slug}`,
        'en-GB': `${DOMAIN}/uk/${sectorSlug}/${cat.slug}`,
        'en-AU': `${DOMAIN}/au/${sectorSlug}/${cat.slug}`,
        'en-CA': `${DOMAIN}/ca/${sectorSlug}/${cat.slug}`,
        'x-default': `${DOMAIN}/${sectorSlug}/${cat.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'InfoWebWorld',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: baseName }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: { index: false, follow: false },
  }
}

/* ── Build JSON-LD schemas for L2/L3 categories ── */
function buildJsonLd(cat: CatSeo, country: string, countryName: string, monthYear: string, sectorSlug: string, geminiFaq?: { q: string; a: string }[] | null) {
  const baseName = cat.seoTitle || cat.name
  const baseDesc = cat.seoDescription || cat.description
  const url = canonicalUrl(country, `/${sectorSlug}/${cat.slug}`)

  // BreadcrumbList
  const bcItems: Record<string, unknown>[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: DOMAIN },
    { '@type': 'ListItem', position: 2, name: 'Categories', item: canonicalUrl(country, '/categories') },
  ]
  let pos = 3
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

  // CollectionPage
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Best ${baseName} in ${countryName}`,
    description: baseDesc || `Explore top ${baseName} businesses on InfoWebWorld.`,
    url,
    isPartOf: { '@type': 'WebSite', name: 'InfoWebWorld', url: DOMAIN },
    ...(cat.listingCount > 0 ? { numberOfItems: cat.listingCount } : {}),
  }

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
      { '@type': 'Question' as const, name: `How to find the best ${baseName} companies in ${countryName}?`, acceptedAnswer: { '@type': 'Answer' as const, text: `Browse verified ${baseName} companies on InfoWebWorld, compare services, read reviews, and connect directly. Updated ${monthYear}.` } },
      { '@type': 'Question' as const, name: `Is it free to list my ${baseName} business on InfoWebWorld?`, acceptedAnswer: { '@type': 'Answer' as const, text: 'Yes, InfoWebWorld offers free business listing with optional premium plans for enhanced visibility, dofollow backlinks, and lead generation.' } },
      { '@type': 'Question' as const, name: `How are ${baseName} companies ranked on InfoWebWorld?`, acceptedAnswer: { '@type': 'Answer' as const, text: 'Rankings are based on verified reviews, user satisfaction scores, and market presence. Our team verifies every listing to ensure quality and trust.' } },
      { '@type': 'Question' as const, name: `Can I compare ${baseName} solutions side by side?`, acceptedAnswer: { '@type': 'Answer' as const, text: `Yes! Use our comparison tools to evaluate ${baseName} solutions side by side across features, pricing, reviews, and satisfaction scores.` } },
    ]
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqEntities,
  }

  return { breadcrumb, collection, faq }
}

/* ════════════════════════════════════════
   generateMetadata — ALL category levels
   ════════════════════════════════════════ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; segments: string[] }>
}): Promise<Metadata> {
  const { country, segments } = await params
  const slug = segments?.[0]
  if (!slug) return {}

  const countryName = COUNTRY_LABELS[country as CountryCode] || 'United States'
  const monthYear = currentMonthYear()

  // Check if this is a view-all-sub-categories page
  const viewAllPrefix = 'view-all-sub-categories-'
  const isViewAll = slug.startsWith(viewAllPrefix)
  const viewAllSector = isViewAll ? slug.slice(viewAllPrefix.length) : null

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
    const title = `All ${meta.seoTitle} Categories in ${countryName} | InfoWebWorld`
    const description = `Browse all categories and subcategories within ${meta.seoTitle}. Find, compare, and connect with the best tools and services.`
    const url = canonicalUrl(country, `/${viewAllSlug(viewAllSector)}`)
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
    const title = `${meta.seoTitle} in ${countryName} ${monthYear} | InfoWebWorld`
    const description = `${meta.seoDescription} Compare the best in ${countryName}, ${monthYear}. InfoWebWorld.com`
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
        images: [{ url: meta.heroImage, width: 1200, height: 630, alt: meta.seoTitle }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [meta.heroImage],
      },
      robots: { index: false, follow: false },
    }
  }

  /* ── L2 / L3 — fetch from DB ── */
  const cat = await fetchCategoryForSeo(categorySlug)
  if (!cat) return {}

  // If no sectorSlug yet (old URL without L1 prefix), look it up from DB
  if (!sectorSlug) {
    sectorSlug = (await getSectorSlugForCategory(categorySlug)) || ''
  }

  return buildCategoryMeta(cat, country, countryName, monthYear, sectorSlug)
}

/* ════════════════════════════════════════
   Page component — renders JSON-LD + page
   ════════════════════════════════════════ */
export default async function CategoryDetailRoute({
  params,
}: {
  params: Promise<{ country: string; segments: string[] }>
}) {
  const { country, segments } = await params
  const slug = segments?.[0]
  const countryName = COUNTRY_LABELS[country as CountryCode] || 'United States'
  const monthYear = currentMonthYear()

  // Check if this is a view-all page
  const viewAllPrefix2 = 'view-all-sub-categories-'
  const isViewAll2 = slug ? slug.startsWith(viewAllPrefix2) : false
  const viewAllSector2 = isViewAll2 ? slug!.slice(viewAllPrefix2.length) : null

  // Determine actual category slug and sector prefix
  let categorySlug = slug || ''
  let sectorSlug = ''
  if (!isViewAll2 && slug && L1_SLUGS.has(slug) && segments.length >= 2) {
    sectorSlug = slug
    categorySlug = segments[1]
  }

  /* ── Redirect old /all URLs to new view-all format ── */
  if (segments.length === 2 && segments[1] === 'all' && slug && L1_SLUGS.has(slug)) {
    const prefix = country === 'global' ? '' : `/${country}`
    redirect(`${prefix}/${viewAllSlug(slug)}`)
  }

  /* ── Redirect old URLs without L1 prefix to new prefixed URLs ── */
  if (!isViewAll2 && slug && !L1_SLUGS.has(segments[0])) {
    const sector = await getSectorSlugForCategory(segments[0])
    if (sector) {
      const prefix = country === 'global' ? '' : `/${country}`
      redirect(`${prefix}/${sector}/${segments.join('/')}`)
    }
  }

  /* ── view-all page — render sector browse ── */
  if (isViewAll2 && viewAllSector2 && L1_SLUGS.has(viewAllSector2)) {
    const allRows = await query(
      `SELECT c.*, p.name as parent_name, p.slug as parent_slug,
              CASE WHEN c.level = 1 THEN c.slug WHEN c.level = 2 THEN p.slug WHEN c.level = 3 THEN gp.slug END as sector_slug
       FROM categories c LEFT JOIN categories p ON p.id = c.parent_id LEFT JOIN categories gp ON gp.id = p.parent_id
       WHERE c.is_launched = 1 AND c.is_active = 1 AND c.is_navigation = 1 ORDER BY c.sort_order`
    ).catch(() => [])
    const initialCategories = JSON.parse(JSON.stringify(allRows))

    const sectorMeta = getSectorMeta(viewAllSector2)
    const sectorName = sectorMeta.seoTitle
    const sectorRow = allRows.find((r: any) => String(r.slug) === viewAllSector2)
    const sectorId = sectorRow ? Number(sectorRow.id) : 0
    const l2InSector = allRows.filter((r: any) => Number(r.parent_id) === sectorId).length

    const allJsonLd = (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://infowebworld.com' },
            { '@type': 'ListItem', position: 2, name: 'Categories', item: canonicalUrl(country, '/categories') },
            { '@type': 'ListItem', position: 3, name: sectorName },
          ]
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'CollectionPage',
          name: `All ${sectorName} Categories`, url: canonicalUrl(country, `/${viewAllSlug(viewAllSector2)}`),
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
        <Suspense><SectorAllBrowse sectorSlug={viewAllSector2} initialCategories={initialCategories} /></Suspense>
        <AiDisclaimer />
        <Footer />
      </>
    )
  }

  const isSector = slug && L1_SLUGS.has(slug) && segments.length === 1
  const navSector = sectorSlug || (isSector ? slug : undefined)
  const isL2L3 = categorySlug && !L1_SLUGS.has(categorySlug)

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
    jsonLdScripts = (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: DOMAIN },
            { '@type': 'ListItem', position: 2, name: 'Categories', item: canonicalUrl(country, '/categories') },
            { '@type': 'ListItem', position: 3, name: sName },
          ]
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'CollectionPage',
          name: `Best ${sName} in ${countryName}`, description: sMeta.seoDescription, url: sUrl,
          isPartOf: { '@type': 'WebSite', name: 'InfoWebWorld', url: DOMAIN },
          numberOfItems: l2Count + l3Count,
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: sectorFaqEntities,
        })}} />
      </>
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
    const schemas = buildJsonLd(catSeo, country, countryName, monthYear, resolvedSector, geminiFaq)
    jsonLdScripts = (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.collection) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }} />
      </>
    )
  }

  /* ── Server-side skeleton — in DOM for crawlers (sr-only CSS) ── */
  let serverSkeleton: React.ReactNode = null

  // L1 sector skeleton — includes Gemini content for Google crawlers
  if (isSector && slug) {
    const sMeta = getSectorMeta(slug)
    const sName = sMeta.seoTitle
    const year = new Date().getFullYear()
    const sc1 = pageData?.seoContent
    const jp1 = (v: unknown) => { if (!v) return null; if (typeof v === 'string') { try { return JSON.parse(v) } catch { return null } } return v }
    const richDesc1 = sc1?.rich_description ? String(sc1.rich_description) : ''
    const bg1 = jp1(sc1?.buyers_guide) as { features?: { title: string; description: string }[]; questions?: string[]; pitfalls?: { mistake: string; consequence: string }[] } | null
    const uc1 = jp1(sc1?.use_cases) as { title: string; description: string }[] | null
    const cmp1 = jp1(sc1?.comparisons) as { title: string; summary: string; differences?: string[] }[] | null
    const faq1 = jp1(sc1?.extended_faq) as { question: string; answer: string }[] | null
    const kw1 = jp1(sc1?.long_tail_keywords) as Record<string, string[]> | null
    const cc1 = jp1(sc1?.complementary_categories) as { name: string; slug?: string; description: string }[] | null
    const l2s = (pageData?.allCategories || []).filter((c: any) => Number(c.level) === 2)
    const l3s = (pageData?.allCategories || []).filter((c: any) => Number(c.level) === 3)
    const defaultFaq = [
      { question: `What is ${sName}?`, answer: sMeta.description },
      { question: `How to find the best ${sName} companies?`, answer: `Browse verified ${sName} companies on InfoWebWorld. Compare services, read reviews and connect directly.` },
      { question: `Is it free to list my business?`, answer: 'Yes, InfoWebWorld offers free business listing with premium plans for enhanced visibility.' },
    ]
    const faqItems1 = faq1 && faq1.length > 0 ? faq1 : defaultFaq

    serverSkeleton = (
      <div className="cd-server-skeleton">
        <nav className="cd-server-breadcrumb" aria-label="Breadcrumb">
          <a href="/" aria-label="Home"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></a><span> &gt; </span><a href="/categories">Categories</a><span> &gt; </span><span>{sName}</span>
        </nav>
        <h1 className="cd-server-h1">{sName} in {countryName} {year}</h1>
        <p className="cd-server-desc">{sMeta.seoDescription}</p>
        <div className="cd-server-stats"><span><strong>{l2s.length}</strong> categories</span><span><strong>{l3s.length}</strong> subcategories</span></div>
        <h2 className="cd-server-h2">Browse {sName} Categories</h2>
        <nav aria-label={`${sName} categories`}><ul>{l2s.map((c: any) => <li key={c.id}><a href={`/${slug}/${c.slug}`}>{c.name}</a></li>)}</ul></nav>
        {richDesc1 && (<article><h2 className="cd-server-h2">About {sName}</h2>{richDesc1.split('\n').filter(Boolean).map((p: string, i: number) => <p key={i}>{p}</p>)}</article>)}
        {bg1?.features && (<section><h2 className="cd-server-h2">How to Choose {sName} Solutions</h2><ul>{bg1.features.map((f, i) => <li key={i}><strong>{f.title}</strong>: {f.description}</li>)}</ul>{bg1.questions && <ol>{bg1.questions.map((q, i) => <li key={i}>{q}</li>)}</ol>}{bg1.pitfalls && <ul>{bg1.pitfalls.map((p, i) => <li key={i}><strong>{p.mistake}</strong> — {p.consequence}</li>)}</ul>}</section>)}
        {uc1 && uc1.length > 0 && (<section><h2 className="cd-server-h2">Who Uses {sName}?</h2>{uc1.map((u, i) => <div key={i}><h3>{u.title}</h3><p>{u.description}</p></div>)}</section>)}
        {cmp1 && cmp1.length > 0 && (<section><h2 className="cd-server-h2">{sName} vs Alternatives</h2>{cmp1.map((c, i) => <div key={i}><h3>{c.title}</h3><p>{c.summary}</p>{c.differences && <ul>{c.differences.map((d, j) => <li key={j}>{d}</li>)}</ul>}</div>)}</section>)}
        {l3s.length > 0 && (<nav aria-label={`${sName} subcategories`}><h2 className="cd-server-h2">Explore All Subcategories</h2><ul>{l3s.slice(0, 200).map((c: any) => <li key={c.id}><a href={`/${slug}/${c.slug}`}>{c.name}</a></li>)}</ul></nav>)}
        {kw1 && (<nav aria-label="Related searches"><h2 className="cd-server-h2">Find the Best {sName}</h2>{Object.entries(kw1).map(([g, t]) => <div key={g}><strong>{g}</strong>: {(t as string[]).join(', ')}</div>)}</nav>)}
        {cc1 && cc1.length > 0 && (<nav aria-label="Related categories"><h2 className="cd-server-h2">Also Explore</h2><ul>{cc1.map((c, i) => <li key={i}>{c.slug ? <a href={`/${c.slug}`}>{c.name}</a> : c.name} — {c.description}</li>)}</ul></nav>)}
        <section><h2 className="cd-server-h2">Frequently Asked Questions about {sName}</h2>{faqItems1.map((f, i) => <div key={i} className="cd-server-faq-item"><h3 className="cd-server-h3">{f.question}</h3><p>{f.answer}</p></div>)}</section>
      </div>
    )
  }

  // L2/L3 skeleton — includes REAL Gemini content for Google crawlers
  if (isL2L3) {
    const catInfo = pageData?.category
    const catName = catInfo?.name ? String(catInfo.name) : categorySlug
    const catDesc = catInfo?.seo_description || catInfo?.description || `Compare the best ${catName} companies in ${countryName}.`
    const parentName = catInfo?.parent_name ? String(catInfo.parent_name) : ''
    const parentSlug = catInfo?.parent_slug ? String(catInfo.parent_slug) : ''
    const catLevel = Number(catInfo?.level ?? 2)
    const listingCount = pageData?.listingTotal ?? 0
    const subCount = Array.isArray(catInfo?.subcategories) ? catInfo.subcategories.length : 0
    const parentHref = parentSlug ? (catLevel === 3 && sectorSlug ? `/${sectorSlug}/${parentSlug}` : `/${parentSlug}`) : null
    const year = new Date().getFullYear()
    const sc = pageData?.seoContent

    // Parse Gemini JSON fields safely
    const jp = (v: unknown) => { if (!v) return null; if (typeof v === 'string') { try { return JSON.parse(v) } catch { return null } } return v }
    const richDesc = sc?.rich_description ? String(sc.rich_description) : ''
    const buyersGuide = jp(sc?.buyers_guide) as { features?: { title: string; description: string }[]; questions?: string[]; pitfalls?: { mistake: string; consequence: string }[] } | null
    const useCases = jp(sc?.use_cases) as { title: string; description: string }[] | null
    const comparisons = jp(sc?.comparisons) as { title: string; summary: string; differences?: string[] }[] | null
    const extFaq = jp(sc?.extended_faq) as { question: string; answer: string }[] | null
    const ltKeywords = jp(sc?.long_tail_keywords) as Record<string, string[]> | null
    const complementary = jp(sc?.complementary_categories) as { name: string; slug?: string; description: string }[] | null

    // Resolve [LINK:slug:Text] in rich description to real <a> tags
    const resolveLinks = (text: string) => text.replace(/\[LINK:([^:]+):([^\]]+)\]/g, (_, slug, label) => {
      const matchedCat = (pageData?.allCategories || []).find((c: any) => c.slug === slug)
      if (matchedCat) {
        const ss = String(matchedCat.sector_slug || matchedCat.parent_slug || '')
        const href = ss ? `/${ss}/${slug}` : `/${slug}`
        return `<a href="${href}">${label}</a>`
      }
      return label
    })

    // Fallback FAQ if no Gemini FAQ
    const faqItems = extFaq && extFaq.length > 0
      ? extFaq
      : [
        { question: `What is ${catName}?`, answer: String(catInfo?.description || `${catName} encompasses businesses and solutions that help organizations succeed.`) },
        { question: `How do I find the best ${catName} companies?`, answer: `Browse verified ${catName} companies on InfoWebWorld. Use filters to narrow by listing type, features, and tags.` },
        { question: `Is it free to list my ${catName} business?`, answer: 'Yes, InfoWebWorld offers a free listing option. Premium plans are available for enhanced visibility.' },
        { question: `How are ${catName} companies ranked?`, answer: 'Rankings are based on verified reviews, satisfaction scores, and market presence.' },
        { question: `Can I compare ${catName} solutions?`, answer: `Yes! Compare ${catName} solutions across features, pricing, satisfaction scores, and more.` },
      ]

    // Subcategory internal links for crawlers
    const subcatLinks = Array.isArray(catInfo?.subcategories) ? catInfo.subcategories : []

    serverSkeleton = (
      <div className="cd-server-skeleton">
        <nav className="cd-server-breadcrumb" aria-label="Breadcrumb">
          <a href="/" aria-label="Home"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></a><span> &gt; </span>
          <a href="/categories">Categories</a>
          {parentName && parentHref && (<><span> &gt; </span><a href={parentHref}>{parentName}</a></>)}
          <span> &gt; </span><span>{catName}</span>
        </nav>
        <h1 className="cd-server-h1">Best {catName} in {countryName} {year}</h1>
        <p className="cd-server-desc">{catDesc}</p>
        <div className="cd-server-stats">
          <span><strong>{listingCount}</strong> companies</span>
          {subCount > 0 && <span><strong>{subCount}</strong> subcategories</span>}
        </div>

        {/* Subcategory internal links — crawlable navigation */}
        {subcatLinks.length > 0 && (
          <nav aria-label={`${catName} subcategories`}>
            <h2 className="cd-server-h2">Explore {catName} Subcategories</h2>
            <ul>{subcatLinks.map((s: any) => {
              const href = sectorSlug ? `/${sectorSlug}/${s.slug}` : `/${s.slug}`
              return <li key={s.id}><a href={href}>{s.name}</a></li>
            })}</ul>
          </nav>
        )}

        <h2 className="cd-server-h2">Top {catName} Companies in {countryName}</h2>
        <p className="cd-server-section-desc">Browse and compare verified {catName} providers. Read reviews, compare features, and connect directly.</p>

        {/* Rich description — full Gemini article with internal links */}
        {richDesc && (
          <article>
            <h2 className="cd-server-h2">About {catName}</h2>
            <div dangerouslySetInnerHTML={{ __html: resolveLinks(richDesc).split('\n').filter(Boolean).map(p => `<p>${p}</p>`).join('') }} />
          </article>
        )}

        {/* Buyer's Guide */}
        {buyersGuide && (
          <section>
            <h2 className="cd-server-h2">What to Look for in {catName}</h2>
            {buyersGuide.features && <ul>{buyersGuide.features.map((f, i) => <li key={i}><strong>{f.title}</strong>: {f.description}</li>)}</ul>}
            {buyersGuide.questions && (<><h3>Questions to Ask Vendors</h3><ol>{buyersGuide.questions.map((q, i) => <li key={i}>{q}</li>)}</ol></>)}
            {buyersGuide.pitfalls && (<><h3>Common Mistakes to Avoid</h3><ul>{buyersGuide.pitfalls.map((p, i) => <li key={i}><strong>{p.mistake}</strong> — {p.consequence}</li>)}</ul></>)}
          </section>
        )}

        {/* Use Cases */}
        {useCases && useCases.length > 0 && (
          <section>
            <h2 className="cd-server-h2">{catName} Use Cases</h2>
            {useCases.map((uc, i) => <div key={i}><h3>{uc.title}</h3><p>{uc.description}</p></div>)}
          </section>
        )}

        {/* Comparisons */}
        {comparisons && comparisons.length > 0 && (
          <section>
            <h2 className="cd-server-h2">{catName} vs Alternatives</h2>
            {comparisons.map((cmp, i) => (
              <div key={i}>
                <h3>{cmp.title}</h3>
                <p>{cmp.summary}</p>
                {cmp.differences && <ul>{cmp.differences.map((d, j) => <li key={j}>{d}</li>)}</ul>}
              </div>
            ))}
          </section>
        )}

        {/* Long-tail keywords */}
        {ltKeywords && (
          <nav aria-label="Related searches">
            <h2 className="cd-server-h2">Find the Best {catName}</h2>
            {Object.entries(ltKeywords).map(([group, terms]) => (
              <div key={group}><strong>{group}</strong>: {(terms as string[]).join(', ')}</div>
            ))}
          </nav>
        )}

        {/* Complementary categories — internal links */}
        {complementary && complementary.length > 0 && (
          <nav aria-label="Related categories">
            <h2 className="cd-server-h2">Also Explore</h2>
            <ul>{complementary.map((cc, i) => (
              <li key={i}>{cc.slug ? <a href={sectorSlug ? `/${sectorSlug}/${cc.slug}` : `/${cc.slug}`}>{cc.name}</a> : cc.name} — {cc.description}</li>
            ))}</ul>
          </nav>
        )}

        {/* FAQ — full answers for Google rich snippets */}
        <section>
          <h2 className="cd-server-h2">Frequently Asked Questions about {catName}</h2>
          {faqItems.map((f, i) => (
            <div key={i} className="cd-server-faq-item">
              <h3 className="cd-server-h3">{f.question}</h3>
              <p>{f.answer}</p>
            </div>
          ))}
        </section>
      </div>
    )
  }

  const catSegments = L1_SLUGS.has(segments[0]) && segments.length > 1 ? segments.slice(1) : segments

  return (
    <>
      {jsonLdScripts}
      <Navbar sectorSlug={navSector} />
      {serverSkeleton}
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
