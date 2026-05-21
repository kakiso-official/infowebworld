import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSearchClient from './HeroSearchClient'
import CategoriesSection from './CategoriesSection'
import TopFirmsSection, { type FirmRow } from './TopFirmsSection'
import NewReviewsSection, { type ReviewRow } from './NewReviewsSection'
import PopularSection, { type PopFirmRow } from './PopularSection'
import StoriesSection from './StoriesSection'
import TrustSection from './TrustSection'
import CompareSection from './CompareSection'
import FinalCtaSection from './FinalCtaSection'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * /test-landing-page — work-in-progress landing redesign.
 *
 * Lives outside the timer-gated public homepage so we can iterate freely
 * before launch. Not indexed; nothing else on the site links to it.
 */
export const metadata: Metadata = {
  title: 'InfoWebWorld — Find the right tool, company, or partner',
  robots: { index: false, follow: false },
}

const SECTORS: { slug: string; label: string }[] = [
  { slug: 'software-saas',         label: 'Software & SaaS' },
  { slug: 'ai-ml',                 label: 'AI & ML' },
  { slug: 'it-services-agencies',  label: 'IT Services & Agencies' },
  { slug: 'startups-innovation',   label: 'Startups & Innovation' },
  { slug: 'local-businesses',      label: 'Local Businesses' },
  { slug: 'professional-services', label: 'Professional Services' },
]

/* Pull the top 9 active listings per L1 sector, ordered by rating then
   recency. We walk up to 3 levels of category hierarchy so listings
   whose `category_id` points at L2 or L3 still attribute to the right
   L1. Reviews aggregates come from subqueries against the `reviews`
   table (`status = 'approved'`). */
async function getFirmsForSector(sectorSlug: string): Promise<FirmRow[]> {
  try {
    const rows = await query<{
      slug: string; company_name: string; logo_url: string | null
      rating_avg: number | null; rating_count: number | null
      listing_mode: 'product' | 'company' | null
    }>(
      `SELECT s.slug, s.company_name, s.logo_url,
              (SELECT AVG(rating) FROM reviews
                WHERE listing_id = s.id AND status = 'approved') AS rating_avg,
              (SELECT COUNT(*)   FROM reviews
                WHERE listing_id = s.id AND status = 'approved') AS rating_count,
              COALESCE(s.listing_mode, 'product') AS listing_mode
         FROM submissions s
         LEFT JOIN categories c    ON c.id   = s.category_id
         LEFT JOIN categories cp   ON cp.id  = c.parent_id
         LEFT JOIN categories cgp  ON cgp.id = cp.parent_id
        WHERE s.status IN ('active','paid')
          AND (c.slug = ? OR cp.slug = ? OR cgp.slug = ?)
        ORDER BY rating_avg DESC, s.created_at DESC
        LIMIT 9`,
      [sectorSlug, sectorSlug, sectorSlug]
    )
    return rows.map(r => ({
      slug: r.slug,
      company_name: r.company_name,
      logo_url: r.logo_url,
      rating_avg: Number(r.rating_avg ?? 0),
      rating_count: Number(r.rating_count ?? 0),
      listing_mode: r.listing_mode || 'product',
    }))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) {
      console.warn('[test-landing-page] firm fetch failed for', sectorSlug, err)
    }
    return []
  }
}

/* Pull the most recent approved reviews across the entire directory.
   Joined to submissions for the listing identity (slug, name, logo, mode)
   and to business_users for the reviewer identity (name, avatar). */
async function getLatestReviews(limit = 8): Promise<ReviewRow[]> {
  try {
    const rows = await query<{
      id: number; rating: number; title: string; body: string; created_at: string
      user_name: string | null; user_avatar: string | null; user_email: string | null
      listing_slug: string; listing_name: string; listing_logo: string | null
      listing_mode: 'product' | 'company' | null
    }>(
      `SELECT r.id, r.rating, r.title, r.body, r.created_at,
              u.name AS user_name, u.avatar_url AS user_avatar, u.email AS user_email,
              s.slug AS listing_slug, s.company_name AS listing_name,
              s.logo_url AS listing_logo,
              COALESCE(s.listing_mode, 'product') AS listing_mode
         FROM reviews r
         JOIN business_users u ON u.id = r.user_id
         JOIN submissions    s ON s.id = r.listing_id
        WHERE r.status = 'approved'
          AND s.status IN ('active','paid')
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
      listing_mode: r.listing_mode || 'product',
    }))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) {
      console.warn('[test-landing-page] reviews fetch failed:', err)
    }
    return []
  }
}

/* Fetch top AI/ML listings with pricing + trial fields for the
   "Most popular AI tools" block. We pull `has_free_trial`,
   `has_free_version`, `starting_price`, and `starting_price_period`
   (all added in migration-listings-v3.sql) so the card meta row reads
   real values. Defensive try/catch — pre-v3 installs render the
   section empty rather than 500ing. */
async function getPopularAiTools(limit = 6): Promise<PopFirmRow[]> {
  try {
    const rows = await query<{
      slug: string; company_name: string; logo_url: string | null
      starting_price: string | number | null
      starting_price_period: string | null
      has_free_trial: number | null
      has_free_version: number | null
      rating_avg: number | null; rating_count: number | null
      listing_mode: 'product' | 'company' | null
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
         LEFT JOIN categories c   ON c.id   = s.category_id
         LEFT JOIN categories cp  ON cp.id  = c.parent_id
         LEFT JOIN categories cgp ON cgp.id = cp.parent_id
        WHERE s.status IN ('active','paid')
          AND (c.slug = 'ai-ml' OR cp.slug = 'ai-ml' OR cgp.slug = 'ai-ml')
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
      listing_mode: r.listing_mode || 'product',
      starting_price: r.starting_price != null ? String(r.starting_price) : '',
      starting_price_period: r.starting_price_period || '',
      has_free_trial: Boolean(Number(r.has_free_trial ?? 0)),
      has_free_version: Boolean(Number(r.has_free_version ?? 0)),
    }))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) {
      console.warn('[test-landing-page] popular AI fetch failed:', err)
    }
    return []
  }
}

export default async function TestLandingPage() {
  /* Parallel fetch — sectors, reviews, popular AI tools — all in one round. */
  const [firmsBySectorArr, reviews, popularAi] = await Promise.all([
    Promise.all(SECTORS.map(s => getFirmsForSector(s.slug))),
    getLatestReviews(8),
    getPopularAiTools(6),
  ])
  const firmsBySector: Record<string, FirmRow[]> = {}
  SECTORS.forEach((s, i) => { firmsBySector[s.slug] = firmsBySectorArr[i] })

  return (
    <>
      <Navbar />
      <main className="tlp">
        <HeroSearchClient />
        <CategoriesSection />
        <TopFirmsSection sectors={SECTORS} firmsBySector={firmsBySector} />
        <NewReviewsSection reviews={reviews} />
        <PopularSection firms={popularAi} />
        <StoriesSection />
        <TrustSection />
        <CompareSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  )
}
