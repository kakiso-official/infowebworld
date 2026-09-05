import { Suspense, cache } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { query, queryOne } from '@/lib/db'
import { clampDescription, cleanText } from '@/lib/seo'
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
/* Hybrid pre-build (May 8 session plan, shipped July 13): newest 500 slugs
   baked at build, the ~5.2K long tail ISR-renders on first visit — every
   deploy used to re-render all ~5.7K profile pages against the slow cPanel
   MySQL. Unknown slugs still 404 via `if (!data) notFound()` below. */
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const rows = await query<{ slug: string }>(
      `SELECT slug FROM submissions
        WHERE listing_mode = 'company'
          AND status IN ('active','paid')
          AND slug IS NOT NULL AND slug != ''
        ORDER BY id DESC
        LIMIT 500`
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

/* Wrapped in React `cache()` so generateMetadata and the page component
   share ONE fetch per request. Without it this whole loader — 14-22
   sequential round trips to a remote cPanel MySQL — ran TWICE for every
   profile render, which is a large part of why the 2026-08-25 crawl saw
   /profile pages take 6-9.7s (sisense 9.68s, eacomm 9.15s). */
const getCompanyBySlug = cache(async function getCompanyBySlug(slug: string) {
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

  /* Breadcrumb — the category ancestry (L1 → leaf), same crumb trail as the
     product page.

     This used to be a hop-by-hop loop issuing up to 8 SEPARATE queries to a
     remote cPanel MySQL — a meaningful slice of the 6-9.7s render times the
     2026-08-25 crawl measured. Collapsed to ONE self-joined query using the
     same 5-level LEFT JOIN pattern fetchCategoryPageData already uses (the
     taxonomy is L1..L5, so 5 hops is the true maximum).

     The resolved L1 id is captured here and reused by relatedCategories
     below, which was independently re-walking the same chain. */
  interface AncestryRow {
    l0_id: number | null; l0_name: string | null; l0_slug: string | null; l0_level: number | null
    l1_id: number | null; l1_name: string | null; l1_slug: string | null; l1_level: number | null
    l2_id: number | null; l2_name: string | null; l2_slug: string | null; l2_level: number | null
    l3_id: number | null; l3_name: string | null; l3_slug: string | null; l3_level: number | null
    l4_id: number | null; l4_name: string | null; l4_slug: string | null; l4_level: number | null
  }
  const breadcrumb: { name: string; slug: string }[] = []
  let sectorL1Id: number | null = null
  if (company.category_id) {
    try {
      const anc = await queryOne<AncestryRow>(
        `SELECT c.id  AS l0_id, c.name  AS l0_name, c.slug  AS l0_slug, c.level  AS l0_level,
                p.id  AS l1_id, p.name  AS l1_name, p.slug  AS l1_slug, p.level  AS l1_level,
                gp.id AS l2_id, gp.name AS l2_name, gp.slug AS l2_slug, gp.level AS l2_level,
                ggp.id AS l3_id, ggp.name AS l3_name, ggp.slug AS l3_slug, ggp.level AS l3_level,
                gggp.id AS l4_id, gggp.name AS l4_name, gggp.slug AS l4_slug, gggp.level AS l4_level
           FROM categories c
           LEFT JOIN categories p    ON p.id    = c.parent_id
           LEFT JOIN categories gp   ON gp.id   = p.parent_id
           LEFT JOIN categories ggp  ON ggp.id  = gp.parent_id
           LEFT JOIN categories gggp ON gggp.id = ggp.parent_id
          WHERE c.id = ? LIMIT 1`,
        [company.category_id]
      )
      if (anc) {
        /* Deepest ancestor first so the trail reads L1 → leaf. */
        const chain = [
          { id: anc.l4_id, name: anc.l4_name, slug: anc.l4_slug, level: anc.l4_level },
          { id: anc.l3_id, name: anc.l3_name, slug: anc.l3_slug, level: anc.l3_level },
          { id: anc.l2_id, name: anc.l2_name, slug: anc.l2_slug, level: anc.l2_level },
          { id: anc.l1_id, name: anc.l1_name, slug: anc.l1_slug, level: anc.l1_level },
          { id: anc.l0_id, name: anc.l0_name, slug: anc.l0_slug, level: anc.l0_level },
        ]
        for (const c of chain) {
          if (c.id == null || !c.name || !c.slug) continue
          breadcrumb.push({ name: c.name, slug: c.slug })
          if (Number(c.level) === 1) sectorL1Id = Number(c.id)
        }
      }
    } catch (err) {
      /* The company row already loaded — degrade the crumb trail rather
         than failing the whole page. */
      console.error('[profile/[slug]] ancestry query failed, rendering without breadcrumb:', err)
    }
  }

  /* Products made by this company — for the "Products by us" section.
     Match by parent_company_id (set automatically on submit since S36) OR
     by same user_id (covers legacy products created before the migration
     ran, since one-company-per-user means the owner's other products are
     unambiguously theirs). */
  /* Started here but awaited at the return — the cross-marketing blocks
     below don't depend on it, so this one overlaps them instead of
     adding its own serial round trip. */
  const productsPromise = query<ProductRow>(
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
      /* Reuses the L1 already resolved by the breadcrumb ancestry query
         above — this block used to re-walk the identical parent chain with
         up to 5 more round trips of its own. */
      const l1Id = sectorL1Id
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
  const [followRes, bookmarkRes] = await Promise.all([
    queryOne<{ c: number }>(
      'SELECT COUNT(*) AS c FROM listing_follows WHERE listing_id = ?',
      [company.id]
    ).catch(() => null),
    queryOne<{ c: number }>(
      'SELECT COUNT(*) AS c FROM listing_bookmarks WHERE listing_id = ?',
      [company.id]
    ).catch(() => null),
  ])
  followerCount = Number(followRes?.c || 0)
  bookmarkCount = Number(bookmarkRes?.c || 0)

  /* Reviews aggregate + recent for "What clients have said" + ★ rating. */
  let avgRating = 0
  let reviewCount = 0
  const reviewDist = [0, 0, 0, 0, 0] // approved counts: [1★, 2★, 3★, 4★, 5★]
  let recentReviews: Record<string, unknown>[] = []
  try {
    /* All three read the same table but are independent of each other —
       issued together rather than one after another. */
    const [agg, distRows, recent] = await Promise.all([
      queryOne<{ avg_rating: number | null; review_count: number }>(
        `SELECT AVG(rating) AS avg_rating, COUNT(*) AS review_count
           FROM reviews WHERE listing_id = ? AND status = 'approved'`,
        [company.id]
      ),
      query<{ rating: number; c: number }>(
        `SELECT rating, COUNT(*) AS c
           FROM reviews WHERE listing_id = ? AND status = 'approved'
          GROUP BY rating`,
        [company.id]
      ),
      query(
      `SELECT r.id, r.rating, r.title, r.body, r.created_at,
              u.name AS user_name, u.avatar_url AS user_avatar_url
         FROM reviews r
         LEFT JOIN business_users u ON u.id = r.user_id
        WHERE r.listing_id = ? AND r.status = 'approved'
        ORDER BY r.created_at DESC LIMIT 6`,
        [company.id]
      ),
    ])
    avgRating = agg?.avg_rating ? Number(agg.avg_rating) : 0
    reviewCount = Number(agg?.review_count || 0)
    for (const row of distRows) {
      const n = Number(row.rating)
      if (n >= 1 && n <= 5) reviewDist[n - 1] = Number(row.c)
    }
    recentReviews = recent as Record<string, unknown>[]
  } catch { /* reviews table missing — leave defaults */ }

  const products = await productsPromise

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
})

function serialize<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj, (_key, value) => {
    if (value && typeof value === 'object' && value.type === 'Buffer' && Array.isArray(value.data)) {
      return Buffer.from(value.data).toString('utf8')
    }
    return value
  }))
}

/* Count a JSON array column safely.

   mysql2 auto-parses MySQL `JSON` columns into real JS values before this
   code ever sees them (no `jsonStrings` option is set on the pool), so
   these arrive as arrays, NOT as JSON strings — but the CompanyRow type
   declares them `string | null` and legacy rows really can hold a string.
   Handle both, exactly like parseJsonArr in CompanyDetailPage. */
function jsonLen(val: unknown): number {
  if (!val) return 0
  let arr: unknown = val
  if (typeof val === 'string') {
    try { arr = JSON.parse(val) } catch { return 0 }
  }
  return Array.isArray(arr) ? arr.length : 0
}

/* ── Indexing gate for company profiles ────────────────────────────────
   All 5,655 profiles used to be hard `noindex, nofollow` while the sitemap
   simultaneously submitted 5,723 of them to Google — a guaranteed
   "Submitted URL marked noindex" error, and it invited Googlebot to crawl
   the slowest pages on the site for nothing.

   Blanket-indexing them instead would be just as wrong: most are bulk
   seed rows whose body is largely template. So a profile earns indexing
   by carrying content a searcher would actually want — either a real
   written bio, or several independent proof points. */
function hasSubstantiveProfile(data: Awaited<ReturnType<typeof getCompanyBySlug>>): boolean {
  if (!data) return false
  const c = data.company

  /* Junk descriptions (scraper-error text, abbreviation fragments) count
     as no description at all. */
  const bioLen = cleanText(c.description, '', 25).length

  /* An owner who claimed or verified the listing has vouched for it — that
     outranks any automated content test. */
  if (c.verified === 1 || c.user_id) return bioLen >= 100

  /* DISTINCTIVE signals only.
     Measured over the real 5,723 live company rows (Sep 2026), the fields
     the seed generators DERIVE are useless as evidence of substance:
       service_lines    4,897 / 5,723  (85.6%) — derived from header_tags
       firmographics    2,851 / 5,723  (49.8%)
       description >=150 chars 5,012   (87.6%)
     Gating on those would have indexed 87%+ of the estate — ~5,000
     template-shaped pages onto a DA-22 domain at once.

     These are the signals that actually came from the company's own site
     or from real activity, and they are genuinely scarce:
       client logos     1,005  (17.6%)
       awards             928  (16.2%)
       intro video        393   (6.9%)
       description >=300  694  (12.1%)  — a real write-up, not one sentence */
  const distinctive =
    (bioLen >= 300 ? 1 : 0) +
    (jsonLen(c.awards) > 0 ? 1 : 0) +
    (jsonLen(c.client_logos) > 0 ? 1 : 0) +
    (c.intro_video_url ? 1 : 0) +
    (data.reviews.reviewCount > 0 ? 1 : 0) +
    (data.products.length > 0 ? 1 : 0)

  /* One distinctive signal earns indexing, but the page still has to carry
     a readable body — a video on an otherwise empty profile is thin. */
  return distinctive >= 1 && bioLen >= 150
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

  /* Never emit a scraper-error string or an abbreviation-truncated
     fragment as the snippet — 157 seeded rows carry exactly that
     ("Page verification failed...", "C.H.", "Arthur J."). Fall back to
     the tagline, then to a constructed line. */
  const bio = cleanText(C.description, '', 60)
  const tagline = cleanText(C.tagline, '', 20)
  const sector = C.category_name ? `${C.category_name} company` : 'company'
  const location = C.hq_location || C.country_name || ''
  const desc = clampDescription(
    bio || tagline ||
    `${C.company_name} - ${sector}${location ? ` based in ${location}` : ''}. Reviews, services and company details on InfoWebWorld.`,
  )

  const url = `https://www.infowebworld.com/profile/${slug}`
  const ogImage = C.logo_url || 'https://www.infowebworld.com/logo/infowebworldlogo-logoforlightbackgrounds.png'

  /* `follow` even when not indexed, so link equity still reaches the
     categories and listings this profile points at. */
  const indexable = hasSubstantiveProfile(data)

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    robots: indexable
      ? { index: true, follow: true, googleBot: { index: true, follow: true } }
      : { index: false, follow: true },
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
    /* Same junk guard as the meta description — never publish a scraper
       error string into structured data. */
    description: cleanText(c.description, '', 60) || cleanText(c.tagline, '', 20) || undefined,
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
