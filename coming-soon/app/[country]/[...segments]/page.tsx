import { Suspense } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CategoryPage from '../CategoryPage'
import SectorAllBrowse from '../components-category/SectorAllBrowse'
import { getSectorMeta } from '../sector/sector-demo-data'
import { COUNTRY_LABELS, ROOT_COUNTRY } from '../../config/countries'
import type { CountryCode } from '../../config/countries'
import { queryOne } from '@/lib/db'

/* ── Known L1 sector slugs ── */
const L1_SLUGS = new Set([
  'artificial-intelligence-ml', 'software-saas', 'it-services-agencies',
  'startups-innovation', 'local-business', 'professional-services',
])

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
    robots: { index: true, follow: true },
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
      robots: { index: true, follow: true },
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
      robots: { index: true, follow: true },
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
    return (
      <>
        <Navbar sectorSlug={slug} />
        <Suspense><SectorAllBrowse sectorSlug={slug} /></Suspense>
        <Footer />
      </>
    )
  }

  // JSON-LD for L1 sectors (rendered via SectorLanding's own useEffect)
  // JSON-LD for L2/L3 — inject server-side via <script> tags
  let jsonLdScripts: React.ReactNode = null
  if (categorySlug && !L1_SLUGS.has(categorySlug)) {
    const cat = await fetchCategoryForSeo(categorySlug)
    if (cat) {
      // If no sectorSlug yet, look it up from DB
      const resolvedSector = sectorSlug || (await getSectorSlugForCategory(categorySlug)) || ''
      const schemas = buildJsonLd(cat, country, countryName, monthYear, resolvedSector)
      jsonLdScripts = (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.collection) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }}
          />
        </>
      )
    }
  }

  const isSector = slug && L1_SLUGS.has(slug) && segments.length === 1
  const navSector = sectorSlug || (isSector ? slug : undefined)

  /* ── Server-side skeleton for L2/L3 — full semantic HTML visible to crawlers ── */
  let serverSkeleton: React.ReactNode = null
  if (categorySlug && !L1_SLUGS.has(categorySlug)) {
    const cat = await fetchCategoryForSeo(categorySlug).catch(() => null)
    if (cat) {
      const year = new Date().getFullYear()
      const desc = cat.seoDescription || cat.description || `Compare the best ${cat.name} companies in ${countryName}. Verified reviews, pricing & features.`
      const parentHref = cat.parentSlug
        ? (cat.level === 3 && sectorSlug ? `/${sectorSlug}/${cat.parentSlug}` : `/${cat.parentSlug}`)
        : null

      // Generate FAQ server-side (same 5 Qs as client renders)
      const faqItems = [
        { q: `What is ${cat.name}?`, a: cat.description || `${cat.name} encompasses businesses and solutions that help organizations succeed.` },
        { q: `How do I find the best ${cat.name} companies?`, a: `Browse verified ${cat.name} companies on InfoWebWorld. Use filters to narrow by listing type, features, and tags.` },
        { q: `Is it free to list my ${cat.name} business?`, a: 'Yes, InfoWebWorld offers a free listing option. Premium plans are available for enhanced visibility and a verified badge.' },
        { q: `How are ${cat.name} companies ranked?`, a: 'Rankings are based on verified reviews, satisfaction scores, and market presence. Our team verifies every listing.' },
        { q: `Can I compare ${cat.name} solutions?`, a: `Yes! Compare ${cat.name} solutions across features, pricing, satisfaction scores, and more.` },
      ]

      serverSkeleton = (
        <div className="cd-server-skeleton">
          {/* Breadcrumb */}
          <nav className="cd-server-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span> &gt; </span>
            <a href="/categories">Categories</a>
            {cat.parentName && parentHref && (
              <>
                <span> &gt; </span>
                <a href={parentHref}>{cat.parentName}</a>
              </>
            )}
            <span> &gt; </span>
            <span>{cat.name}</span>
          </nav>

          {/* H1 */}
          <h1 className="cd-server-h1">Best {cat.name} in {countryName} {year}</h1>

          {/* Description */}
          <p className="cd-server-desc">{desc}</p>

          {/* Stats */}
          <div className="cd-server-stats">
            <span><strong>{cat.listingCount || 0}</strong> companies</span>
            {cat.subcategoryCount > 0 && <span><strong>{cat.subcategoryCount}</strong> subcategories</span>}
          </div>

          {/* Section headings — proper H2/H3 hierarchy for crawlers */}
          <h2 className="cd-server-h2">Top {cat.name} Companies in {countryName}</h2>
          <p className="cd-server-section-desc">Browse and compare verified {cat.name} providers. Read reviews, compare features, and connect directly.</p>

          {cat.subcategoryCount > 0 && (
            <h2 className="cd-server-h2">Explore {cat.name} Subcategories</h2>
          )}

          {/* FAQ */}
          <section className="cd-server-faq">
            <h2 className="cd-server-h2">Frequently Asked Questions</h2>
            {faqItems.map((f, i) => (
              <div key={i} className="cd-server-faq-item">
                <h3 className="cd-server-h3">{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </section>
        </div>
      )
    }
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
        />
      </Suspense>
      <Footer />
    </>
  )
}
