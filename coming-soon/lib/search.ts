/**
 * Unified site search — server-side data layer for the dedicated /search page.
 *
 * Mirrors the dropdown endpoint at app/api/search/route.ts but returns a
 * RICHER, larger result set (ratings, location, listing mode) suited to a
 * full results page rather than an 8-row autocomplete.
 *
 * Three result groups, fetched in parallel:
 *   - categories — taxonomy nodes (sectors / L2 / L3 / L4), navigable
 *   - companies  — active/paid submissions (products → /listing, companies → /profile)
 *   - articles   — published blog posts
 *
 * Optional `sector` scopes categories + companies to one L1 sector by walking
 * the category parent chain (self → parent → … → L1), matching the behaviour
 * the sector-landing hero searches already pass via `?sector=`.
 *
 * Every query is defensively wrapped: a missing column (pre-migration installs
 * lacking listing_mode) or a missing table (reviews / countries) degrades to a
 * slimmer query or an empty group instead of 500ing the whole page.
 */
import { query } from './db'

export type SearchCategoryHit = {
  id: number
  name: string
  slug: string
  level: number
  color: string
  icon: string
  description: string
  parentName: string | null
  parentSlug: string | null
  sectorSlug: string | null
  listingCount: number
}

export type SearchCompanyHit = {
  id: number
  slug: string
  companyName: string
  tagline: string | null
  logoUrl: string | null
  website: string | null
  listingMode: 'product' | 'company'
  category: { name: string | null; slug: string | null; color: string | null } | null
  location: string | null
  ratingAvg: number
  ratingCount: number
}

export type SearchArticleHit = {
  id: number
  slug: string
  title: string
  excerpt: string
  coverImage: string | null
  author: string | null
  category: string | null
}

export type SearchResults = {
  query: string
  sector: string | null
  categories: SearchCategoryHit[]
  companies: SearchCompanyHit[]
  articles: SearchArticleHit[]
  counts: { categories: number; companies: number; articles: number; total: number }
  /** True when a group hit its fetch cap — the page appends a "+" to the count. */
  capped: { categories: boolean; companies: boolean; articles: boolean }
}

/* Generous caps — large enough that a typical query shows "everything" without
   pagination, small enough to keep the page query cheap. */
const CAP = { categories: 48, companies: 48, articles: 18 } as const

export const MIN_QUERY_LEN = 2

export async function searchAll(
  qRaw: string,
  opts: { sector?: string | null } = {},
): Promise<SearchResults> {
  const q = (qRaw || '').trim()
  const sector = (opts.sector || '').trim()
  const sectorOn = sector.length > 0

  const base: SearchResults = {
    query: q,
    sector: sectorOn ? sector : null,
    categories: [],
    companies: [],
    articles: [],
    counts: { categories: 0, companies: 0, articles: 0, total: 0 },
    capped: { categories: false, companies: false, articles: false },
  }
  if (q.length < MIN_QUERY_LEN) return base

  const like = `%${q}%`
  const prefix = `${q}%`

  const [categories, companies, articles] = await Promise.all([
    searchCategories(like, prefix, sector, sectorOn),
    searchCompanies(like, prefix, sector, sectorOn),
    searchArticles(like, prefix),
  ])

  return {
    ...base,
    categories,
    companies,
    articles,
    counts: {
      categories: categories.length,
      companies: companies.length,
      articles: articles.length,
      total: categories.length + companies.length + articles.length,
    },
    capped: {
      categories: categories.length >= CAP.categories,
      companies: companies.length >= CAP.companies,
      articles: articles.length >= CAP.articles,
    },
  }
}

/* ── Categories — name + description match, navigable nodes only. The CASE
   resolves each hit's L1 sector slug by walking up to 5 levels so an L3/L4
   hit still links under the right /{sector}/ namespace. ── */
type CatRow = {
  id: number; name: string; slug: string; level: number
  color: string | null; icon: string | null; description: string | null
  parent_name: string | null; parent_slug: string | null
  sector_slug: string | null; listing_count: number | null
}
async function searchCategories(
  like: string, prefix: string, sector: string, sectorOn: boolean,
): Promise<SearchCategoryHit[]> {
  try {
    const rows = await query<CatRow>(
      `SELECT c.id, c.name, c.slug, c.level, c.color, c.icon, c.description, c.listing_count,
              p.name AS parent_name, p.slug AS parent_slug,
              CASE WHEN c.level = 1 THEN c.slug
                   WHEN c.level = 2 THEN p.slug
                   WHEN c.level = 3 THEN gp.slug
                   WHEN c.level = 4 THEN ggp.slug
                   WHEN c.level = 5 THEN gggp.slug END AS sector_slug
       FROM categories c
       LEFT JOIN categories p    ON p.id    = c.parent_id
       LEFT JOIN categories gp   ON gp.id   = p.parent_id
       LEFT JOIN categories ggp  ON ggp.id  = gp.parent_id
       LEFT JOIN categories gggp ON gggp.id = ggp.parent_id
       WHERE c.is_launched = 1 AND c.is_navigation = 1
         AND (c.name LIKE ? OR c.description LIKE ?)
         ${sectorOn ? 'AND (c.slug = ? OR p.slug = ? OR gp.slug = ? OR ggp.slug = ? OR gggp.slug = ?)' : ''}
       ORDER BY
         CASE WHEN c.name LIKE ? THEN 0 ELSE 1 END,
         c.listing_count DESC, c.level ASC, c.name ASC
       LIMIT ${CAP.categories}`,
      sectorOn
        ? [like, like, sector, sector, sector, sector, sector, prefix]
        : [like, like, prefix],
    )
    return rows.map(r => ({
      id: Number(r.id),
      name: r.name,
      slug: r.slug,
      level: Number(r.level),
      color: r.color || '#003B2A',
      icon: r.icon || '',
      description: r.description || '',
      parentName: r.parent_name,
      parentSlug: r.parent_slug,
      sectorSlug: r.sector_slug,
      listingCount: Number(r.listing_count ?? 0),
    }))
  } catch (err) {
    console.warn('[search] categories query failed:', err instanceof Error ? err.message : err)
    return []
  }
}

/* ── Companies — both listing modes. Products link to /listing/<slug>,
   company-mode listings to /profile/<slug>. Ratings come from the reviews
   table; location is a "City, State, Country" join. ── */
type CompanyRow = {
  id: number; slug: string; company_name: string; tagline: string | null
  logo_url: string | null; website: string | null
  category_name: string | null; category_slug: string | null; category_color: string | null
  listing_mode: string | null
  city: string | null; state: string | null; country_name: string | null
  rating_avg: number | string | null; rating_count: number | string | null
}
function mapCompany(r: CompanyRow): SearchCompanyHit {
  const loc = [r.city, r.state, r.country_name].filter(Boolean).join(', ')
  return {
    id: Number(r.id),
    slug: r.slug,
    companyName: r.company_name,
    tagline: r.tagline,
    logoUrl: r.logo_url,
    website: r.website,
    listingMode: r.listing_mode === 'company' ? 'company' : 'product',
    category: r.category_slug
      ? { name: r.category_name, slug: r.category_slug, color: r.category_color }
      : null,
    location: loc || null,
    ratingAvg: r.rating_avg != null ? Number(r.rating_avg) : 0,
    ratingCount: Number(r.rating_count ?? 0),
  }
}
async function searchCompanies(
  like: string, prefix: string, sector: string, sectorOn: boolean,
): Promise<SearchCompanyHit[]> {
  const sectorJoins = sectorOn
    ? `LEFT JOIN categories cp    ON cp.id    = c.parent_id
       LEFT JOIN categories cgp   ON cgp.id   = cp.parent_id
       LEFT JOIN categories cggp  ON cggp.id  = cgp.parent_id
       LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id`
    : ''
  const sectorWhere = sectorOn
    ? 'AND (c.slug = ? OR cp.slug = ? OR cgp.slug = ? OR cggp.slug = ? OR cgggp.slug = ?)'
    : ''
  const sectorParams = sectorOn ? [sector, sector, sector, sector, sector] : []

  try {
    const rows = await query<CompanyRow>(
      `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url, s.website,
              c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
              COALESCE(s.listing_mode, 'product') AS listing_mode,
              s.city, s.state, co.name AS country_name,
              (SELECT AVG(rating) FROM reviews WHERE listing_id = s.id AND status = 'approved') AS rating_avg,
              (SELECT COUNT(*)   FROM reviews WHERE listing_id = s.id AND status = 'approved') AS rating_count
       FROM submissions s
       LEFT JOIN categories c  ON c.id  = s.category_id
       LEFT JOIN countries  co ON co.id = s.country_id
       ${sectorJoins}
       WHERE s.status IN ('active', 'paid')
         AND (s.company_name LIKE ? OR s.tagline LIKE ? OR s.description LIKE ?)
         ${sectorWhere}
       ORDER BY
         CASE WHEN s.company_name LIKE ? THEN 0 ELSE 1 END,
         rating_count DESC, rating_avg DESC, s.approved_at DESC
       LIMIT ${CAP.companies}`,
      [like, like, like, ...sectorParams, prefix],
    )
    return rows.map(mapCompany)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    /* Pre-migration tolerance: listing_mode column, or the reviews / countries
       tables, may be absent on an older install. Fall back to a slim query that
       references none of them. Sector scoping is dropped in the fallback (rare
       path) to keep it dependency-free. */
    if (/Unknown column|doesn't exist|reviews|listing_mode|country/i.test(msg)) {
      try {
        const rows = await query<CompanyRow>(
          `SELECT s.id, s.slug, s.company_name, s.tagline, s.logo_url, s.website,
                  c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
                  'product' AS listing_mode,
                  NULL AS city, NULL AS state, NULL AS country_name,
                  NULL AS rating_avg, 0 AS rating_count
           FROM submissions s
           LEFT JOIN categories c ON c.id = s.category_id
           WHERE s.status IN ('active', 'paid')
             AND (s.company_name LIKE ? OR s.tagline LIKE ? OR s.description LIKE ?)
           ORDER BY CASE WHEN s.company_name LIKE ? THEN 0 ELSE 1 END, s.id DESC
           LIMIT ${CAP.companies}`,
          [like, like, like, prefix],
        )
        return rows.map(mapCompany)
      } catch (err2) {
        console.warn('[search] companies fallback failed:', err2 instanceof Error ? err2.message : err2)
        return []
      }
    }
    console.warn('[search] companies query failed:', msg)
    return []
  }
}

/* ── Articles — published blog posts, title/excerpt match. ── */
type ArticleRow = {
  id: number; slug: string; title: string; excerpt: string | null
  cover_image: string | null; author: string | null; category: string | null
}
async function searchArticles(like: string, prefix: string): Promise<SearchArticleHit[]> {
  try {
    const rows = await query<ArticleRow>(
      `SELECT id, slug, title, excerpt, cover_image, author, category
       FROM blog_posts
       WHERE status = 'published'
         AND (title LIKE ? OR excerpt LIKE ?)
       ORDER BY
         CASE WHEN title LIKE ? THEN 0 ELSE 1 END,
         published_at DESC
       LIMIT ${CAP.articles}`,
      [like, like, prefix],
    )
    return rows.map(r => ({
      id: Number(r.id),
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt || '',
      coverImage: r.cover_image,
      author: r.author,
      category: r.category,
    }))
  } catch (err) {
    console.warn('[search] articles query failed:', err instanceof Error ? err.message : err)
    return []
  }
}
