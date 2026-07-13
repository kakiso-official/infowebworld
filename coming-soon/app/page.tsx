import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HeroSearchClient from './test-landing-page/HeroSearchClient'
import CategoriesSection from './test-landing-page/CategoriesSection'
import TopFirmsSection, { type FirmRow } from './test-landing-page/TopFirmsSection'
import NewReviewsSection, { type ReviewRow } from './test-landing-page/NewReviewsSection'
import PopularSection, { type PopFirmRow } from './test-landing-page/PopularSection'
import TrustSection from './test-landing-page/TrustSection'
import CompareSection from './test-landing-page/CompareSection'
import FinalCtaSection from './test-landing-page/FinalCtaSection'
import { query } from '@/lib/db'
import { unstable_cache } from 'next/cache'
import './styles/test-landing-page.css'

/* ════════════════════════════════════════════════════════════════════════
   Live homepage — the directory landing.

   Rendered dynamically so the per-sector firm rows, latest reviews, and
   popular-tools strip reflect current DB state (edge-cached ~1h via
   middleware, so the origin is hit at most once per hour per region).

   The section components are authored under ./test-landing-page/; that route
   now 308-redirects here, so this is the single canonical landing. The SEO
   @graph below (Organization, WebSite + SearchAction, the 6-sector ItemList +
   SiteNavigationElements that drive sitelink selection, and the FAQPage) is
   preserved from the previous homepage so nothing regresses on launch.

   ISR (10 min), not force-dynamic: nothing here reads cookies/headers/
   searchParams and every DB fetch already sits behind unstable_cache(600s).
   As a static page, utm/fbclid query-string variants all serve the same
   cached payload instead of each one invoking a function (July 2026 cost
   fix). */
export const revalidate = 600

const SITE = 'https://www.infowebworld.com'

/* The 6 L1 sectors — these are exactly the pages we want Google to surface
   as sitelinks under the InfoWebWorld brand result. Each one becomes:
   - a SiteNavigationElement node (primary navigation hint)
   - a ListItem inside the homepage ItemList (mainEntity)
   - a hasPart edge on the WebSite entity
   Triple-anchoring maximises the chance Google picks all 6 for sitelinks. */
const SECTORS = [
  { slug: 'ai-ml',                  name: 'AI & ML',                desc: 'Verified AI tools, agents, models, copilots, and frameworks.' },
  { slug: 'software-saas',          name: 'Software & SaaS',        desc: 'CRM, marketing, analytics, security, and project software.' },
  { slug: 'it-services-agencies',   name: 'IT Services & Agencies', desc: 'Web, mobile, software, design, and marketing agencies.' },
  { slug: 'startups-innovation',    name: 'Startups & Innovation',  desc: 'Breakthrough companies in FinTech, HealthTech, ClimateTech, AI & Web3.' },
  { slug: 'local-businesses',       name: 'Local Businesses',       desc: 'Restaurants, home services, health, automotive, beauty, retail.' },
  { slug: 'professional-services',  name: 'Professional Services',  desc: 'Accountants, attorneys, advisors, consultants, recruiters.' },
]

/* Sectors driving the live data sections (TopFirms tabs + per-sector firm
   fetch). Order mirrors the section design (Software first) and is kept
   separate from the SEO SECTORS list above, whose order is tuned for
   sitelink selection. */
const LANDING_SECTORS: { slug: string; label: string }[] = [
  { slug: 'software-saas',         label: 'Software & SaaS' },
  { slug: 'ai-ml',                 label: 'AI & ML' },
  { slug: 'it-services-agencies',  label: 'IT Services & Agencies' },
  { slug: 'startups-innovation',   label: 'Startups & Innovation' },
  { slug: 'local-businesses',      label: 'Local Businesses' },
  { slug: 'professional-services', label: 'Professional Services' },
]

const organization = {
  '@type': 'Organization',
  '@id': `${SITE}#org`,
  name: 'InfoWebWorld',
  slogan: 'The global business directory for verified business discovery',
  url: SITE,
  logo: 'https://www.infowebworld.com/logo/infowebworldlogo-logoforlightbackgrounds.png',
  description: 'Global business directory with verified reviews, dofollow backlinks, and lead generation across 80+ industries.',
  knowsAbout: ['Global business directory', 'Online business directory', 'Business listings', 'Company profiles', 'Verified business reviews', 'B2B company database', 'Business discovery'],
  foundingDate: '2026',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Brain Stream Australia Pty Ltd',
    addressLocality: 'Parramatta',
    addressRegion: 'NSW',
    postalCode: '2150',
    addressCountry: 'AU',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'iww@brainstream.com.au',
    url: `${SITE}/contact`,
  },
  sameAs: [
    'https://x.com/infowebworld_x',
    'https://www.linkedin.com/company/infowebworld/',
    'https://www.instagram.com/infowebworld',
  ],
}

/* WebSite + SearchAction qualifies the homepage for the sitelinks search
   box (the prominent search input under the brand result in SERP).
   hasPart links the 6 sectors so Google reads them as primary children. */
const website = {
  '@type': 'WebSite',
  '@id': `${SITE}#website`,
  url: SITE,
  name: 'InfoWebWorld',
  description: 'The global business directory to search, compare, and review businesses across 80+ industries in 12 countries.',
  publisher: { '@id': `${SITE}#org` },
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/search?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
  hasPart: SECTORS.map(s => ({ '@type': 'WebPage', '@id': `${SITE}/${s.slug}`, url: `${SITE}/${s.slug}`, name: s.name })),
}

/* SiteNavigationElement nodes — Google reads these as the site's primary
   navigation. Each carries the sector name + URL + description. Strong
   sitelink signal when combined with the homepage ItemList below. */
const siteNavElements = SECTORS.map(s => ({
  '@type': 'SiteNavigationElement',
  '@id': `${SITE}/${s.slug}#nav`,
  name: s.name,
  description: s.desc,
  url: `${SITE}/${s.slug}`,
}))

/* ItemList of the 6 primary sections — emitted as the homepage's mainEntity
   so Google understands the page is a hub directing to these six children.
   Highest-signal way to influence sitelink selection short of in-product
   click data. */
const sectorList = {
  '@type': 'ItemList',
  '@id': `${SITE}#primary-sections`,
  name: 'InfoWebWorld primary sectors',
  description: 'The six primary sectors covered by InfoWebWorld.',
  numberOfItems: SECTORS.length,
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  itemListElement: SECTORS.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${SITE}/${s.slug}`,
    name: s.name,
    description: s.desc,
  })),
}

const webPage = {
  '@type': 'WebPage',
  '@id': `${SITE}#homepage`,
  url: SITE,
  name: 'Global Business Directory - Find, Compare & Review Verified Businesses',
  description: 'Global business directory to search verified businesses, tools, agencies, and professionals across 80+ industries - with real reviews, transparent pricing, and dofollow listings.',
  isPartOf: { '@id': `${SITE}#website` },
  about: { '@id': `${SITE}#org` },
  mainEntity: { '@id': `${SITE}#primary-sections` },
  primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}/og-image.png` },
  inLanguage: 'en-US',
}

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.infowebworld.com' },
}

const faqJsonLd = {
  '@type': 'FAQPage',
  '@id': `${SITE}#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a global business directory?',
      acceptedAnswer: { '@type': 'Answer', text: 'A global business directory is an online platform that lists and connects companies across industries and countries - with searchable company profiles, industry categories, key contacts, locations, and reviews - so buyers can discover, compare, and vet businesses worldwide. InfoWebWorld is a global business directory covering 80+ industries across 12+ countries, with verified reviews and dofollow listings.' },
    },
    {
      '@type': 'Question',
      name: 'What is InfoWebWorld?',
      acceptedAnswer: { '@type': 'Answer', text: 'InfoWebWorld is a global business directory where users can search, compare, and review businesses across 80+ industries in 12+ countries. It helps professionals find the best solutions through verified reviews and detailed company profiles.' },
    },
    {
      '@type': 'Question',
      name: 'How does InfoWebWorld work?',
      acceptedAnswer: { '@type': 'Answer', text: 'Users can search businesses by category or location, compare companies side by side, read verified reviews, and connect directly with service providers. Every listing includes satisfaction scores, feature breakdowns, and real user feedback.' },
    },
    {
      '@type': 'Question',
      name: 'Is it free to list a business on InfoWebWorld?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes, businesses can submit listings for free on InfoWebWorld. Free listings include a company profile, category placement, and a dofollow backlink. Optional premium plans are available for enhanced visibility and lead generation features.' },
    },
    {
      '@type': 'Question',
      name: 'What industries does InfoWebWorld cover?',
      acceptedAnswer: { '@type': 'Answer', text: 'InfoWebWorld covers 80+ industries including SaaS, marketing, cybersecurity, cloud computing, HR tech, fintech, e-commerce, healthcare, legal services, education technology, and many more. New categories are added regularly based on market demand.' },
    },
    {
      '@type': 'Question',
      name: 'How can I add my business to InfoWebWorld?',
      acceptedAnswer: { '@type': 'Answer', text: 'Visit the Get Listed page to submit your business details. Fill in your company information, choose a category, and submit for review. Once approved, your listing goes live with a verified badge and dofollow backlink.' },
    },
  ],
}

/* ── Live data fetchers ──────────────────────────────────────────────────
   Each is defensively wrapped: a missing column / table (pre-migration
   install) renders the section empty rather than 500ing the homepage. */

/* Top 9 active listings per L1 sector, ordered by rating then recency.
   Walks up to 4 levels of category hierarchy so listings attached to
   L2/L3/L4 still attribute to the right L1. */
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
         LEFT JOIN categories c     ON c.id     = s.category_id
         LEFT JOIN categories cp    ON cp.id    = c.parent_id
         LEFT JOIN categories cgp   ON cgp.id   = cp.parent_id
         LEFT JOIN categories cggp  ON cggp.id  = cgp.parent_id
         LEFT JOIN categories cgggp ON cgggp.id = cggp.parent_id
        WHERE s.status IN ('active','paid')
          AND (c.slug = ? OR cp.slug = ? OR cgp.slug = ? OR cggp.slug = ? OR cgggp.slug = ?)
        ORDER BY rating_avg DESC, s.created_at DESC
        LIMIT 9`,
      [sectorSlug, sectorSlug, sectorSlug, sectorSlug, sectorSlug]
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
      console.warn('[home] firm fetch failed for', sectorSlug, err)
    }
    return []
  }
}

/* Most recent approved reviews across the directory, joined to the listing
   identity + reviewer identity. */
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
      console.warn('[home] reviews fetch failed:', err)
    }
    return []
  }
}

/* Top AI/ML listings with pricing + trial fields for the "Most popular AI
   tools" block (columns added in migration-listings-v3.sql). */
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
      listing_mode: r.listing_mode || 'product',
      starting_price: r.starting_price != null ? String(r.starting_price) : '',
      starting_price_period: r.starting_price_period || '',
      has_free_trial: Boolean(Number(r.has_free_trial ?? 0)),
      has_free_version: Boolean(Number(r.has_free_version ?? 0)),
    }))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) {
      console.warn('[home] popular AI fetch failed:', err)
    }
    return []
  }
}

/* Data-cache the homepage fetches so a cold render doesn't run 8 DB queries
   every time (the HTML is also edge-cached ~1h via middleware). Keyed by the
   function args; short revalidate keeps content fresh and lets a transient
   empty result self-heal quickly. */
const getCachedFirmsForSector = unstable_cache(getFirmsForSector, ['home-firms-v1'], { revalidate: 600 })
const getCachedLatestReviews  = unstable_cache(getLatestReviews,  ['home-reviews-v1'], { revalidate: 600 })
const getCachedPopularAi      = unstable_cache(getPopularAiTools, ['home-popular-ai-v1'], { revalidate: 600 })

export default async function Home() {
  /* Parallel fetch — sectors, reviews, popular AI tools — all in one round. */
  const [firmsBySectorArr, reviews, popularAi] = await Promise.all([
    Promise.all(LANDING_SECTORS.map(s => getCachedFirmsForSector(s.slug))),
    getCachedLatestReviews(8),
    getCachedPopularAi(6),
  ])
  const firmsBySector: Record<string, FirmRow[]> = {}
  LANDING_SECTORS.forEach((s, i) => { firmsBySector[s.slug] = firmsBySectorArr[i] })

  return (
    <>
      {/* JSON-LD — single @graph carrying Organization, WebSite+SearchAction
          (qualifies for the sitelinks search box), WebPage, ItemList of the
          6 primary sectors (drives sitelink selection), SiteNavigationElement
          per sector (primary nav hint), and FAQPage. All entities use @id
          cross-references for proper graph resolution. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [organization, website, webPage, sectorList, ...siteNavElements, faqJsonLd],
        }) }}
      />

      <Navbar />
      <main className="tlp">
        <HeroSearchClient />
        <CategoriesSection />
        <TopFirmsSection sectors={LANDING_SECTORS} firmsBySector={firmsBySector} />
        <NewReviewsSection reviews={reviews} />
        <PopularSection firms={popularAi} />
        <TrustSection />
        <CompareSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  )
}
