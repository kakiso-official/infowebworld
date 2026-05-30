import dynamic from 'next/dynamic'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSearch from './HeroSearch'
import SectorCategoriesSection from './SectorCategoriesSection'
import PopularSection from '../test-category-1-page/PopularSection'
import TopFirmsSection from '../test-category-1-page/TopFirmsSection'
import NewReviewsSection from '../test-landing-page/NewReviewsSection'
import NewLaunchesSection from '../test-category-1-page/NewLaunchesSection'
import PopularToolsSection from '../test-landing-page/PopularSection'
import TrustSection from '../test-landing-page/TrustSection'
import CompareSection from '../test-landing-page/CompareSection'
import FinalCtaSection from '../test-landing-page/FinalCtaSection'
import {
  getPopularByL2, getLatestSectorReviews, getRecentSectorLaunches, getPopularSectorTools,
} from './queries'
import type { SectorLandingConfig } from '@/lib/sector-landings'

const SeoSections = dynamic(() => import('../components-category/SeoSections'), { ssr: true })

/* ═══════════════════════════════════════════════════════════════════════
   Shared L1 sector landing page.

   Called by:
     · the catch-all /[...segments]/page.tsx isSector branch for the
       6 sector URLs (/ai-ml, /software-saas, etc.)
     · /test-category-1-page (legacy demo, kept as alias for /ai-ml)

   Every data section pulls real DB rows scoped to `cfg.slug`. The
   per-sector palette lives in app/styles/test-category-1-page.css —
   the .tcat-<slug> class on the <main> below redefines the CSS
   custom properties (--c1..--c4-dark) that the shared .tcat1 rules
   reference.
   ═══════════════════════════════════════════════════════════════════════ */
export default async function SectorLandingPage({
  cfg,
  seoContent = null,
  allCategories = [],
  jsonLd,
  avgRating = 0,
  totalReviews = 0,
  totalListings = 0,
}: {
  cfg: SectorLandingConfig
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  seoContent?: any
  allCategories?: Array<{ name: string; slug: string; level: number; sectorSlug?: string; sector_slug?: string }>
  /** Pre-built @graph JSON string from the page route. Rendered at top of
      the page in a single application/ld+json script for the SEO surface. */
  jsonLd?: string
  /** Aggregate signals from the sector tree for the hero meta strip. */
  avgRating?: number
  totalReviews?: number
  totalListings?: number
}) {
  /* Serial — the MySQL pool size is 2 and getPopularByL2 already fans out
     internally. Doing all four in parallel here blows the queue when more
     than one sector page is being rendered at the same time. */
  const popular = await getPopularByL2(cfg.slug, 10)
  const reviews = await getLatestSectorReviews(cfg.slug, 8)
  const launches = await getRecentSectorLaunches(cfg.slug, 8)
  const popularTools = await getPopularSectorTools(cfg.slug, 6)
  return (
    <>
      {/* Killer SEO/AEO/GEO surface — full @graph carrying Organization +
          WebSite/SearchAction + BreadcrumbList + CollectionPage + Article +
          DefinedTerm + HowTo + FAQPage with Speakable + per-listing
          Product / SoftwareApplication / LocalBusiness entities. */}
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      )}
      <Navbar sectorSlug={cfg.slug} />
      <main className={`tlp tcat1 ${cfg.scopeClass}`}>
        <HeroSearch
          sectorSlug={cfg.slug}
          title={cfg.heroTitle}
          sub={cfg.heroSub}
          placeholder={cfg.heroPlaceholder}
          avgRating={avgRating}
          totalReviews={totalReviews}
          totalListings={totalListings}
        />
        <SectorCategoriesSection
          sectorSlug={cfg.slug}
          heading={cfg.catsHeading}
          sub={cfg.catsSub}
          cards={cfg.cards}
          ctaLabel={cfg.catsCtaLabel}
        />
        <PopularSection
          cats={popular}
          sectorSlug={cfg.slug}
          title={cfg.sections.popularCatsTitle}
        />
        <TopFirmsSection
          cats={popular}
          sectorSlug={cfg.slug}
          sub={cfg.sections.topFirmsSub}
          tabsLabel={cfg.sections.topFirmsTabsLabel}
          emptyNoun={cfg.sections.topFirmsEmptyNoun}
        />
        <NewReviewsSection reviews={reviews} />
        <NewLaunchesSection
          launches={launches}
          sectorSlug={cfg.slug}
          sub={cfg.sections.newLaunchesSub}
          cta={cfg.sections.newLaunchesCta}
        />
        <PopularToolsSection
          firms={popularTools}
          sectorSlug={cfg.slug}
          title={cfg.sections.popularToolsTitle}
          sub={cfg.sections.popularToolsSub}
          emptySub={cfg.sections.popularToolsEmptySub}
          emptyLine={cfg.sections.popularToolsEmptyLine}
          cta={cfg.sections.popularToolsCta}
        />
        <TrustSection />
        <CompareSection />
        {/* Gemini-generated SEO content — same sticky-TOC editorial block used
            on L2/L3/L4 category pages. Renders only when Gemini content exists
            in category_seo_content for this sector. Sits above the final CTA
            so it's prominent but doesn't bury the conversion CTA. */}
        {seoContent && (
          <div className="cd-page tlp-seo-wrap">
            <div className="cd-wrap">
              <SeoSections
                seoContent={seoContent}
                categoryName={cfg.name}
                categorySlug={cfg.slug}
                sectorSlug={cfg.slug}
                allCategories={allCategories}
              />
            </div>
          </div>
        )}
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  )
}
