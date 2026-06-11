import type { Metadata } from 'next'
import '../styles/test-category-1-page.css'
import '../styles/test-landing-page.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSearchClient from './HeroSearchClient'
import CategoriesSection from './CategoriesSection'
import PopularSection, { type PopL2 } from './PopularSection'
import TopFirmsSection from './TopFirmsSection'
import NewReviewsSection, { type ReviewRow } from '../test-landing-page/NewReviewsSection'
import NewLaunchesSection, { type LaunchRow } from './NewLaunchesSection'
/* Aliased so the pricing-version PopularSection doesn't clash with
   our local L2-tabs PopularSection. Same component file, different
   identity on this page. */
import PopularToolsSection, { type PopFirmRow } from '../test-landing-page/PopularSection'
import TrustSection from '../test-landing-page/TrustSection'
import CompareSection from '../test-landing-page/CompareSection'
import FinalCtaSection from '../test-landing-page/FinalCtaSection'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * /test-category-1-page — WIP L1 sector landing demo (AI & ML).
 *
 * Hero is a 1:1 visual clone of /test-landing-page's hero — same
 * .tlp-* classes, same layout — but the copy is rewritten for AI/ML
 * and every search call passes `sector=ai-ml`.
 *
 * Below the hero, the "Most Popular AI Categories" block pulls REAL
 * listings out of the DB. No mocks. If the DB has no active AI/ML
 * listings yet the section simply doesn't render.
 */
export const metadata: Metadata = {
  title: 'AI & ML - Find and compare the best AI tools, agents, and models',
  description: 'Verified buyer reviews across 1,295+ AI & ML categories. Discover AI assistants, agents, image and video tools, code copilots, and more — moderated and never paid for.',
  robots: { index: false, follow: false },
}

/* ── Real-data fetch: top 10 L2 categories under AI/ML by listing
   count, each with its top 9 listings.

   Always returns at least 10 categories (subject to the launched
   taxonomy actually having that many) — empty L2s are kept in the
   list with `products: []` so the left rail stays populated and the
   right side can show the "be the first to list" empty state for
   un-listed categories. Sort: populated L2s first (DESC listing
   count), then empty L2s by taxonomy sort_order. */
async function getPopularByL2(): Promise<PopL2[]> {
  try {
    const cats = await query<{
      id: number; slug: string; name: string; listing_count: number
    }>(
      `SELECT c.id, c.slug, c.name,
              (SELECT COUNT(*)
                 FROM submissions s
                 LEFT JOIN categories sc   ON sc.id   = s.category_id
                 LEFT JOIN categories scp  ON scp.id  = sc.parent_id
                 LEFT JOIN categories scgp ON scgp.id = scp.parent_id
                 LEFT JOIN categories scggp ON scggp.id = scgp.parent_id
                WHERE s.status IN ('active', 'paid')
                  AND (sc.id = c.id OR scp.id = c.id OR scgp.id = c.id OR scggp.id = c.id)
              ) AS listing_count
         FROM categories c
        WHERE c.level = 2
          AND c.parent_id = (SELECT id FROM categories WHERE slug = 'ai-ml' AND level = 1)
          AND c.is_launched = 1
        ORDER BY listing_count DESC, c.sort_order ASC
        LIMIT 10`
    )

    const results = await Promise.all(cats.map(async (cat) => {
      const products = await query<{
        slug: string; company_name: string; logo_url: string | null;
        rating_avg: number | null; rating_count: number | null;
        listing_mode: 'product' | 'company' | string | null
      }>(
        `SELECT s.slug, s.company_name, s.logo_url,
                (SELECT AVG(rating) FROM reviews
                  WHERE listing_id = s.id AND status = 'approved') AS rating_avg,
                (SELECT COUNT(*)    FROM reviews
                  WHERE listing_id = s.id AND status = 'approved') AS rating_count,
                COALESCE(s.listing_mode, 'product') AS listing_mode
           FROM submissions s
           LEFT JOIN categories sc    ON sc.id    = s.category_id
           LEFT JOIN categories scp   ON scp.id   = sc.parent_id
           LEFT JOIN categories scgp  ON scgp.id  = scp.parent_id
           LEFT JOIN categories scggp ON scggp.id = scgp.parent_id
          WHERE s.status IN ('active', 'paid')
            AND (sc.id = ? OR scp.id = ? OR scgp.id = ? OR scggp.id = ?)
          ORDER BY rating_avg DESC, rating_count DESC, s.created_at DESC
          LIMIT 9`,
        [cat.id, cat.id, cat.id, cat.id]
      )
      return {
        slug: cat.slug,
        name: cat.name,
        products: products.map(p => ({
          slug: p.slug,
          name: p.company_name,
          logoUrl: p.logo_url,
          rating: Number(p.rating_avg ?? 0),
          reviews: Number(p.rating_count ?? 0),
          listingMode: (p.listing_mode === 'company' ? 'company' : 'product') as 'product' | 'company',
        })),
      }
    }))

    /* Don't filter — empty L2s are intentional. Their tab still shows
       in the left rail; the right side renders the empty-state CTA. */
    return results
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) {
      console.warn('[test-category-1-page] popular-by-L2 fetch failed:', err)
    }
    return []
  }
}

/* ── Latest approved reviews limited to AI/ML listings. Same join
   shape as /test-landing-page's getLatestReviews, plus a 3-level
   category traversal (c / cp / cgp) so a review on an L3-attached
   listing still attributes to the right L1 sector. */
async function getLatestAIMLReviews(limit = 8): Promise<ReviewRow[]> {
  try {
    const rows = await query<{
      id: number; rating: number; title: string; body: string; created_at: string
      user_name: string | null; user_avatar: string | null; user_email: string | null
      listing_slug: string; listing_name: string; listing_logo: string | null
      listing_mode: 'product' | 'company' | string | null
    }>(
      `SELECT r.id, r.rating, r.title, r.body, r.created_at,
              u.name AS user_name, u.avatar_url AS user_avatar, u.email AS user_email,
              s.slug AS listing_slug, s.company_name AS listing_name,
              s.logo_url AS listing_logo,
              COALESCE(s.listing_mode, 'product') AS listing_mode
         FROM reviews r
         JOIN business_users u ON u.id = r.user_id
         JOIN submissions    s ON s.id = r.listing_id
         LEFT JOIN categories c     ON c.id     = s.category_id
         LEFT JOIN categories cp    ON cp.id    = c.parent_id
         LEFT JOIN categories cgp   ON cgp.id   = cp.parent_id
         LEFT JOIN categories cggp  ON cggp.id  = cgp.parent_id
         LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id
        WHERE r.status = 'approved'
          AND s.status IN ('active','paid')
          AND (c.slug = 'ai-ml' OR cp.slug = 'ai-ml' OR cgp.slug = 'ai-ml' OR cggp.slug = 'ai-ml' OR cgggp.slug = 'ai-ml')
        ORDER BY r.created_at DESC
        LIMIT ?`,
      [limit]
    )
    return rows.map(r => ({
      id: r.id,
      rating: Number(r.rating),
      title: r.title || '',
      body: r.body || '',
      created_at: r.created_at,
      user_name: r.user_name,
      user_avatar: r.user_avatar,
      user_email: r.user_email,
      listing_slug: r.listing_slug,
      listing_name: r.listing_name,
      listing_logo: r.listing_logo,
      listing_mode: (r.listing_mode === 'company' ? 'company' : 'product') as 'product' | 'company',
    }))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) {
      console.warn('[test-category-1-page] reviews fetch failed:', err)
    }
    return []
  }
}

/* ── Most-recently-approved AI/ML listings.
   Same 3-level traversal (c / cp / cgp) as the reviews + popular
   fetches so an AI tool attached to an L3 still attributes to the
   ai-ml L1. Ordered by approved_at DESC (falling back to created_at
   for legacy rows where approved_at might be null). */
async function getRecentAIMLLaunches(limit = 8): Promise<LaunchRow[]> {
  try {
    const rows = await query<{
      slug: string; company_name: string; tagline: string | null;
      logo_url: string | null;
      listing_mode: 'product' | 'company' | string | null;
      approved_at: string | null; created_at: string | null;
      category_name: string | null; category_slug: string | null;
      rating_avg: number | null; rating_count: number | null;
    }>(
      `SELECT s.slug, s.company_name, s.tagline, s.logo_url,
              COALESCE(s.listing_mode, 'product') AS listing_mode,
              s.approved_at, s.created_at,
              c.name AS category_name, c.slug AS category_slug,
              (SELECT AVG(rating) FROM reviews
                WHERE listing_id = s.id AND status = 'approved') AS rating_avg,
              (SELECT COUNT(*)    FROM reviews
                WHERE listing_id = s.id AND status = 'approved') AS rating_count
         FROM submissions s
         LEFT JOIN categories c     ON c.id     = s.category_id
         LEFT JOIN categories cp    ON cp.id    = c.parent_id
         LEFT JOIN categories cgp   ON cgp.id   = cp.parent_id
         LEFT JOIN categories cggp  ON cggp.id  = cgp.parent_id
         LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id
        WHERE s.status IN ('active','paid')
          AND (c.slug = 'ai-ml' OR cp.slug = 'ai-ml' OR cgp.slug = 'ai-ml' OR cggp.slug = 'ai-ml' OR cgggp.slug = 'ai-ml')
        ORDER BY COALESCE(s.approved_at, s.created_at) DESC
        LIMIT ?`,
      [limit]
    )
    return rows.map(r => ({
      slug: r.slug,
      companyName: r.company_name,
      tagline: r.tagline,
      logoUrl: r.logo_url,
      listingMode: (r.listing_mode === 'company' ? 'company' : 'product') as 'product' | 'company',
      approvedAt: r.approved_at || r.created_at || '',
      categoryName: r.category_name,
      categorySlug: r.category_slug,
      rating: Number(r.rating_avg ?? 0),
      reviews: Number(r.rating_count ?? 0),
    }))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) {
      console.warn('[test-category-1-page] launches fetch failed:', err)
    }
    return []
  }
}

/* ── Hand-picked AI tools with pricing + trial fields, for the
   "Most popular AI tools" pricing-card section. Same shape as
   /test-landing-page's getPopularAiTools — joined to the categories
   chain so listings attached to AI/ML L2/L3 still surface. */
async function getPopularAiTools(limit = 6): Promise<PopFirmRow[]> {
  try {
    const rows = await query<{
      slug: string; company_name: string; logo_url: string | null
      starting_price: string | number | null
      starting_price_period: string | null
      has_free_trial: number | null
      has_free_version: number | null
      rating_avg: number | null; rating_count: number | null
      listing_mode: 'product' | 'company' | string | null
    }>(
      `SELECT s.slug, s.company_name, s.logo_url,
              s.starting_price, s.starting_price_period,
              s.has_free_trial, s.has_free_version,
              COALESCE(s.listing_mode, 'product') AS listing_mode,
              (SELECT AVG(rating) FROM reviews
                WHERE listing_id = s.id AND status = 'approved') AS rating_avg,
              (SELECT COUNT(*)   FROM reviews
                WHERE listing_id = s.id AND status = 'approved') AS rating_count
         FROM submissions s
         LEFT JOIN categories c     ON c.id     = s.category_id
         LEFT JOIN categories cp    ON cp.id    = c.parent_id
         LEFT JOIN categories cgp   ON cgp.id   = cp.parent_id
         LEFT JOIN categories cggp  ON cggp.id  = cgp.parent_id
         LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id
        WHERE s.status IN ('active','paid')
          AND (c.slug = 'ai-ml' OR cp.slug = 'ai-ml' OR cgp.slug = 'ai-ml' OR cggp.slug = 'ai-ml' OR cgggp.slug = 'ai-ml')
        ORDER BY rating_avg DESC, s.created_at DESC
        LIMIT ?`,
      [limit]
    )
    return rows.map(r => ({
      slug: r.slug,
      company_name: r.company_name,
      logo_url: r.logo_url,
      rating_avg: Number(r.rating_avg ?? 0),
      rating_count: Number(r.rating_count ?? 0),
      listing_mode: (r.listing_mode === 'company' ? 'company' : 'product') as 'product' | 'company',
      starting_price: r.starting_price != null ? String(r.starting_price) : '',
      starting_price_period: r.starting_price_period || '',
      has_free_trial: Boolean(Number(r.has_free_trial ?? 0)),
      has_free_version: Boolean(Number(r.has_free_version ?? 0)),
    }))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) {
      console.warn('[test-category-1-page] popular AI tools fetch failed:', err)
    }
    return []
  }
}

export default async function TestCategory1Page() {
  /* Parallel fetch — L2 cats + reviews + launches + pricing tools. */
  const [popular, reviews, launches, popularTools] = await Promise.all([
    getPopularByL2(),
    getLatestAIMLReviews(8),
    getRecentAIMLLaunches(8),
    getPopularAiTools(6),
  ])
  return (
    <>
      <Navbar />
      {/* .tcat1 scopes the AI/ML palette + boxier-radius overrides
          defined in app/styles/test-category-1-page.css. The base
          /test-landing-page mint look is unaffected. */}
      <main className="tlp tcat1">
        <HeroSearchClient />
        <CategoriesSection />
        <PopularSection cats={popular} />
        <TopFirmsSection cats={popular} />
        <NewReviewsSection reviews={reviews} />
        <NewLaunchesSection launches={launches} />
        <PopularToolsSection firms={popularTools} />
        <TrustSection />
        <CompareSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  )
}
