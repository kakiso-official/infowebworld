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
export default async function SectorLandingPage({ cfg }: { cfg: SectorLandingConfig }) {
  /* Serial — the MySQL pool size is 2 and getPopularByL2 already fans out
     internally. Doing all four in parallel here blows the queue when more
     than one sector page is being rendered at the same time. */
  const popular = await getPopularByL2(cfg.slug, 10)
  const reviews = await getLatestSectorReviews(cfg.slug, 8)
  const launches = await getRecentSectorLaunches(cfg.slug, 8)
  const popularTools = await getPopularSectorTools(cfg.slug, 6)
  return (
    <>
      <Navbar sectorSlug={cfg.slug} />
      <main className={`tlp tcat1 ${cfg.scopeClass}`}>
        <HeroSearch
          sectorSlug={cfg.slug}
          title={cfg.heroTitle}
          sub={cfg.heroSub}
          placeholder={cfg.heroPlaceholder}
        />
        <SectorCategoriesSection
          sectorSlug={cfg.slug}
          heading={cfg.catsHeading}
          sub={cfg.catsSub}
          cards={cfg.cards}
        />
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
