import { Suspense } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CategoryPage from '../CategoryPage'
import SectorAllBrowse from '../components-category/SectorAllBrowse'
import { getSectorMeta } from '../sector/sector-demo-data'
import { COUNTRY_LABELS, ROOT_COUNTRY, VALID_COUNTRIES } from '../../config/countries'
import type { CountryCode } from '../../config/countries'
import { query, queryOne } from '@/lib/db'

/** ISR: cache on Vercel edge for 60s */
export const revalidate = 60

/* ── Known L1 sector slugs ── */
const L1_SLUGS = new Set([
  'artificial-intelligence-ml', 'software-saas', 'it-services-agencies',
  'startups-innovation', 'local-business', 'professional-services',
])

/** Pre-build L1 sector pages at deploy time — instant 10ms from CDN */
export async function generateStaticParams() {
  const params: { country: string; segments: string[] }[] = []
  for (const country of VALID_COUNTRIES) {
    for (const slug of L1_SLUGS) {
      params.push({ country, segments: [slug] })
    }
  }
  return params
}

/* ── Cached shared data (same across ALL category pages, cached 5 min) ── */
const getCachedAllCategories = unstable_cache(
  async () => {
    const rows = await query(
      `SELECT c.*, p.name as parent_name, p.slug as parent_slug,
              CASE WHEN c.level = 1 THEN c.slug WHEN c.level = 2 THEN p.slug WHEN c.level = 3 THEN gp.slug END as sector_slug
       FROM categories c LEFT JOIN categories p ON p.id = c.parent_id LEFT JOIN categories gp ON gp.id = p.parent_id
       WHERE c.is_launched = 1 AND c.is_active = 1 AND c.is_navigation = 1 ORDER BY c.sort_order`
    )
    return JSON.parse(JSON.stringify(rows))
  },
  ['all-categories'],
  { revalidate: 300 }
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
  { revalidate: 300 }
)

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function currentMonthYear() {
  const d = new Date()
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

const DOMAIN = 'https://infowebworld.com'

/** US (ROOT_COUNTRY) gets root paths, others get /{country}/ prefix */
function canonicalUrl(country: string, path: string) {
  const prefix = country === ROOT_COUNTRY ? '' : `/${country}`
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

    // Round trip 2: all category-specific queries + cached shared data (parallel)
    const [subcats, listingTypes, parentRow, countRow, listings, listingCount, allCats, tagGroupsData] = await Promise.all([
      query(
        `SELECT c.*, (SELECT COUNT(*) FROM submissions s WHERE s.category_id = c.id AND s.status IN ('active','paid')) as listing_count
         FROM categories c WHERE c.parent_id = ? AND c.is_active = 1 AND c.is_navigation = 1 ORDER BY c.sort_order`,
        [cid]
      ),
      level === 3
        ? query('SELECT id, name, slug, sort_order FROM listing_types WHERE category_id = ? ORDER BY sort_order', [cid])
        : level === 2
        ? query('SELECT lt.id, lt.name, lt.slug, lt.sort_order FROM listing_types lt JOIN categories c ON c.id = lt.category_id WHERE c.parent_id = ? AND c.is_active = 1 ORDER BY lt.sort_order', [cid])
        : query('SELECT lt.id, lt.name, lt.slug, lt.sort_order FROM listing_types lt JOIN categories c3 ON c3.id = lt.category_id JOIN categories c2 ON c2.id = c3.parent_id WHERE c2.parent_id = ? AND c3.is_active = 1 ORDER BY lt.sort_order LIMIT 200', [cid]),
      catRow.parent_id ? queryOne('SELECT id, name, slug, icon, color FROM categories WHERE id = ?', [catRow.parent_id]) : Promise.resolve(null),
      queryOne(
        `SELECT COUNT(*) as cnt FROM submissions s WHERE s.status IN ('active','paid') AND s.category_id IN (
          SELECT id FROM categories WHERE id = ? AND is_active = 1
          UNION SELECT id FROM categories WHERE parent_id = ? AND is_active = 1
          UNION SELECT c3.id FROM categories c3 JOIN categories c2 ON c2.id = c3.parent_id WHERE c2.parent_id = ? AND c3.is_active = 1
        )`, [cid, cid, cid]
      ),
      query(
        `SELECT s.*, c.name as category_name, c.slug as category_slug, c.color as category_color, c.icon as category_icon,
                lt.name as listing_type_name, lt.slug as listing_type_slug
         FROM submissions s
         LEFT JOIN categories c ON c.id = s.category_id
         LEFT JOIN listing_types lt ON lt.id = s.listing_type_id
         WHERE s.status IN ('active','paid') AND s.category_id IN (
           SELECT id FROM categories WHERE id = ? AND is_active = 1
           UNION SELECT id FROM categories WHERE parent_id = ? AND is_active = 1
           UNION SELECT c3.id FROM categories c3 JOIN categories c2 ON c2.id = c3.parent_id WHERE c2.parent_id = ? AND c3.is_active = 1
         ) ORDER BY s.approved_at DESC, s.created_at DESC LIMIT 20`,
        [cid, cid, cid]
      ),
      queryOne(
        `SELECT COUNT(*) as cnt FROM submissions s WHERE s.status IN ('active','paid') AND s.category_id IN (
          SELECT id FROM categories WHERE id = ? AND is_active = 1
          UNION SELECT id FROM categories WHERE parent_id = ? AND is_active = 1
          UNION SELECT c3.id FROM categories c3 JOIN categories c2 ON c2.id = c3.parent_id WHERE c2.parent_id = ? AND c3.is_active = 1
        )`, [cid, cid, cid]
      ),
      // These are CACHED — ~0ms after first call (shared across all pages)
      getCachedAllCategories(),
      getCachedTagsWithGroups(),
    ])

    return JSON.parse(JSON.stringify({
      category: { ...catRow, subcategories: subcats, listingTypes, parent: parentRow, activeListings: Number(countRow?.cnt ?? 0) },
      allCategories: allCats,
      tagGroups: tagGroupsData,
      listings,
      listingTotal: Number(listingCount?.cnt ?? 0),
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
        'en-US': `${DOMAIN}/${sectorSlug}/${cat.slug}`,
        'en-GB': `${DOMAIN}/uk/${sectorSlug}/${cat.slug}`,
        'en-AU': `${DOMAIN}/au/${sectorSlug}/${cat.slug}`,
        'en-CA': `${DOMAIN}/ca/${sectorSlug}/${cat.slug}`,
        'en': `${DOMAIN}/${sectorSlug}/${cat.slug}`,
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
function buildJsonLd(cat: CatSeo, country: string, countryName: string, monthYear: string, sectorSlug: string) {
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

  // FAQPage
  const desc = baseDesc || `${baseName} encompasses a range of tools, platforms, and services.`
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${baseName}?`,
        acceptedAnswer: { '@type': 'Answer', text: desc },
      },
      {
        '@type': 'Question',
        name: `How to find the best ${baseName} companies in ${countryName}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Browse verified ${baseName} companies on InfoWebWorld, compare services, read reviews, and connect directly. Updated ${monthYear}.` },
      },
      {
        '@type': 'Question',
        name: `Is it free to list my ${baseName} business on InfoWebWorld?`,
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, InfoWebWorld offers free business listing with optional premium plans for enhanced visibility, dofollow backlinks, and lead generation.' },
      },
      {
        '@type': 'Question',
        name: `How are ${baseName} companies ranked on InfoWebWorld?`,
        acceptedAnswer: { '@type': 'Answer', text: 'Rankings are based on verified reviews, user satisfaction scores, and market presence. Our team verifies every listing to ensure quality and trust.' },
      },
      {
        '@type': 'Question',
        name: `Can I compare ${baseName} solutions side by side?`,
        acceptedAnswer: { '@type': 'Answer', text: `Yes! Use our comparison tools to evaluate ${baseName} solutions side by side across features, pricing, reviews, and satisfaction scores.` },
      },
    ],
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

  // Determine actual category slug: if first segment is L1 and there's a second, category is segments[1]
  let categorySlug = slug
  let sectorSlug = ''
  if (L1_SLUGS.has(slug) && segments.length >= 2 && segments[1] !== 'all') {
    sectorSlug = slug
    categorySlug = segments[1]
  }

  /* ── /all page — sector categories browse ── */
  if (segments.length === 2 && segments[1] === 'all' && L1_SLUGS.has(slug)) {
    const meta = getSectorMeta(slug)
    const title = `All ${meta.seoTitle} Categories in ${countryName} | InfoWebWorld`
    const description = `Browse all categories and subcategories within ${meta.seoTitle}. Find, compare, and connect with the best tools and services.`
    const url = canonicalUrl(country, `/${slug}/all`)
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
    const title = `Best ${meta.seoTitle} in ${countryName} ${monthYear} | InfoWebWorld`
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

  // Determine actual category slug and sector prefix
  let categorySlug = slug || ''
  let sectorSlug = ''
  if (slug && L1_SLUGS.has(slug) && segments.length >= 2 && segments[1] !== 'all') {
    sectorSlug = slug
    categorySlug = segments[1]
  }

  /* ── Redirect old URLs without L1 prefix to new prefixed URLs ── */
  if (slug && !L1_SLUGS.has(segments[0])) {
    const sector = await getSectorSlugForCategory(segments[0])
    if (sector) {
      const prefix = country === ROOT_COUNTRY ? '' : `/${country}`
      redirect(`${prefix}/${sector}/${segments.join('/')}`)
    }
  }

  /* ── /all page — render sector browse ── */
  if (segments.length === 2 && segments[1] === 'all' && slug && L1_SLUGS.has(slug)) {
    const allRows = await query(
      `SELECT c.*, p.name as parent_name, p.slug as parent_slug,
              CASE WHEN c.level = 1 THEN c.slug WHEN c.level = 2 THEN p.slug WHEN c.level = 3 THEN gp.slug END as sector_slug
       FROM categories c LEFT JOIN categories p ON p.id = c.parent_id LEFT JOIN categories gp ON gp.id = p.parent_id
       WHERE c.is_launched = 1 AND c.is_active = 1 AND c.is_navigation = 1 ORDER BY c.sort_order`
    ).catch(() => [])
    const initialCategories = JSON.parse(JSON.stringify(allRows))

    const sectorMeta = getSectorMeta(slug)
    const sectorName = sectorMeta.seoTitle
    const sectorRow = allRows.find((r: any) => String(r.slug) === slug)
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
          name: `All ${sectorName} Categories`, url: canonicalUrl(country, `/${slug}/all`),
        })}} />
      </>
    )

    return (
      <>
        {allJsonLd}
        <Navbar sectorSlug={slug} />
        <div className="cd-server-skeleton">
          <nav className="cd-server-breadcrumb" aria-label="Breadcrumb">
            <a href="/categories">All Categories</a><span> &gt; </span><span>{sectorName}</span>
          </nav>
          <h1 className="cd-server-h1">All {sectorName} Categories</h1>
          <p className="cd-server-desc">Browse all categories and subcategories within {sectorName}. {l2InSector} categories to explore.</p>
          <h2 className="cd-server-h2">Categories in {sectorName}</h2>
        </div>
        <Suspense><SectorAllBrowse sectorSlug={slug} initialCategories={initialCategories} /></Suspense>
        <Footer />
      </>
    )
  }

  const isSector = slug && L1_SLUGS.has(slug) && segments.length === 1
  const navSector = sectorSlug || (isSector ? slug : undefined)
  const isL2L3 = categorySlug && !L1_SLUGS.has(categorySlug)

  /* ── Fetch ALL data for L2/L3 pages in a single server-side batch ── */
  const pageData = isL2L3 ? await fetchCategoryPageData(categorySlug) : null

  /* ── JSON-LD — built from pageData (no extra DB call) ── */
  let jsonLdScripts: React.ReactNode = null
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
    const schemas = buildJsonLd(catSeo, country, countryName, monthYear, resolvedSector)
    jsonLdScripts = (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.collection) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }} />
      </>
    )
  }

  /* ── Server-side skeleton — visible in initial HTML for crawlers + fast paint ── */
  let serverSkeleton: React.ReactNode = null
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

    const faqItems = [
      { q: `What is ${catName}?`, a: String(catInfo?.description || `${catName} encompasses businesses and solutions that help organizations succeed.`) },
      { q: `How do I find the best ${catName} companies?`, a: `Browse verified ${catName} companies on InfoWebWorld. Use filters to narrow by listing type, features, and tags.` },
      { q: `Is it free to list my ${catName} business?`, a: 'Yes, InfoWebWorld offers a free listing option. Premium plans are available for enhanced visibility.' },
      { q: `How are ${catName} companies ranked?`, a: 'Rankings are based on verified reviews, satisfaction scores, and market presence.' },
      { q: `Can I compare ${catName} solutions?`, a: `Yes! Compare ${catName} solutions across features, pricing, satisfaction scores, and more.` },
    ]

    serverSkeleton = (
      <div className="cd-server-skeleton">
        <nav className="cd-server-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a><span> &gt; </span>
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
        <h2 className="cd-server-h2">Top {catName} Companies in {countryName}</h2>
        <p className="cd-server-section-desc">Browse and compare verified {catName} providers. Read reviews, compare features, and connect directly.</p>
        {subCount > 0 && <h2 className="cd-server-h2">Explore {catName} Subcategories</h2>}
        <section className="cd-server-faq">
          <h2 className="cd-server-h2">Frequently Asked Questions</h2>
          {faqItems.map((f, i) => (
            <div key={i} className="cd-server-faq-item"><h3 className="cd-server-h3">{f.q}</h3><p>{f.a}</p></div>
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
      <Footer />
    </>
  )
}
