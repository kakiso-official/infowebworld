import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
/* Font Awesome's own sizing CSS. FA only injects it at runtime when a client
   component renders an icon, so a page whose icons are all server-rendered
   (e.g. no reviewed listings in its client sections) showed them unsized. */
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/test-category-1-page.css'
import '../styles/test-landing-page.css'
import '../styles/home.css'
import '../styles/sector-directory.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSearch from '../sector-landing/HeroSearch'
import CategoriesSection from '../test-landing-page/CategoriesSection'
import PopularSubcategoriesSection from '../home-sections/PopularSubcategoriesSection'
import TopFirmsSection from '../test-category-1-page/TopFirmsSection'
import NewLaunchesSection from '../test-category-1-page/NewLaunchesSection'
import CountriesSection from '../home-sections/CountriesSection'
import ComparisonTableSection from '../home-sections/ComparisonTableSection'
import NewReviewsSection from '../test-landing-page/NewReviewsSection'
import LatestBlogSection from '../home-sections/LatestBlogSection'
import HomeFaqSection from '../home-sections/HomeFaqSection'
import FinalCtaSection from '../test-landing-page/FinalCtaSection'
import { getCuratedSubcategories } from '../home-sections/popular-subcategories-data'
import { getSectorCountryListingCounts } from '../home-sections/countries-data'
import { getTopicBlogPosts } from '../home-sections/latest-blog-data'
import {
  getDirectoryListingTotal, getDirectoryReviews, getDirectoryFeatured, getDirectoryLaunches,
} from './directory-data'
import { directoryCategoryItems, subcategoryTotal, floorLabel } from './taxonomy'
import { buildDirectoryJsonLd } from './seo'
import type { HeroStat, SectorDirectorySpec } from './types'

/* ════════════════════════════════════════════════════════════════════════
   Sector directory page - the "[sector] directory" landings rebuilt to the
   Oct 2026 SEO specs (/saas-directory, /it-directory, /startup-directory,
   /local-businesses-directory, /professional-service-directory). Each
   route passes its spec (./specs/). Each sector's category pages live
   under the same path (/saas-directory/{slug}); the old /{sector} and
   /{sector}/... URLs 308 here (next.config.ts, lib/sector-paths.ts).

   Section order (inside <main className="tlp tcat1 tcat-<sector> sdir">):
     1  Hero (H1, sector-scoped search, stat badges, CTAs)
     2  Browse ... by Category - the spec's L2 categories
     3  Popular / most searched sub-categories - the spec's picks
     4  Featured ... - L2 tabs, featured-plan listings first
     5  Recently added ... - newest listings (names H3)
     6  ... by country - countries with live listings (names H3)
     7  Why choose InfoWebWorld - comparison table + audience cards
     8  Reviews
     9  Insights and guides - topic-relevant posts first
     10 FAQs (the same array feeds the FAQPage node)
     11 Final CTA
   Shared .tlp-/.tcat- and hm- sections only receive copy through opt-in
   props, exactly as on the AI tools directory (app/ai-si-directory);
   the palette comes from ../styles/sector-directory.css.
   ════════════════════════════════════════════════════════════════════════ */

type LiveNumbers = { listings: number; countries: number; subcategories: number }

function statText(stat: HeroStat, n: LiveNumbers): string | null {
  switch (stat.kind) {
    case 'static':
      return stat.text
    case 'listings':
      return n.listings > 0 ? `${n.listings.toLocaleString('en-US')}+ ${stat.label}` : null
    case 'countries':
      return n.countries > 0 ? `${n.countries.toLocaleString('en-US')}+ ${stat.label}` : null
    case 'subcategories':
      return `${stat.roundTo ? floorLabel(n.subcategories, stat.roundTo) : n.subcategories.toLocaleString('en-US')} ${stat.label}`
  }
}

export default async function SectorDirectoryPage({ spec }: { spec: SectorDirectorySpec }) {
  const { sector } = spec

  /* One parallel round. Every fetcher is cached and never throws: a DB
     failure empties its section (or hides a count) instead of 500ing. */
  const [listingTotal, popularSubcats, featured, launches, countryRows, reviews, blogPosts] =
    await Promise.all([
      getDirectoryListingTotal(sector),
      getCuratedSubcategories(sector, spec.popular.picks),
      getDirectoryFeatured(sector),
      getDirectoryLaunches(sector),
      getSectorCountryListingCounts(sector),
      getDirectoryReviews(sector, 8),
      getTopicBlogPosts(spec.blog.topic, 3),
    ])

  /* On a DB failure the countries fetcher returns a fixed list of 12 big
     markets without counts. Several of these sectors have no listings in
     some of them, so here that fallback hides the section (and the
     country badge) instead of naming countries the sector isn't in. */
  const countries = countryRows.every(c => c.listings !== null) ? countryRows : []

  const totalSubcategories = subcategoryTotal(sector)
  const numbers: LiveNumbers = {
    listings: listingTotal,
    countries: countries.length,
    subcategories: totalSubcategories,
  }
  const stats = spec.hero.stats
    .map(stat => ({ stat, text: statText(stat, numbers) }))
    .filter((s): s is { stat: HeroStat; text: string } => s.text !== null)

  const categoryItems = directoryCategoryItems(spec)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildDirectoryJsonLd(spec, categoryItems)) }}
      />

      <Navbar sectorSlug={sector} />
      <main className={`tlp tcat1 tcat-${sector} sdir`}>
        <HeroSearch
          sectorSlug={sector}
          title={spec.hero.title}
          sub={spec.hero.sub}
          placeholder={spec.hero.searchPlaceholder}
          titleClassName="hm-hero-title"
          hideMeta
        >
          {stats.length > 0 && (
            <ul className="hm-hero-badges">
              {stats.map(({ stat, text }) => (
                <li key={text} className="hm-hero-badge">
                  <span className="hm-hero-badge-ico" aria-hidden="true">
                    <FontAwesomeIcon icon={stat.icon} />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="hm-hero-cta-row">
            <Link href={spec.hero.primaryCta.href} className="hm-btn hm-btn-primary">
              <span>{spec.hero.primaryCta.label}</span>
              <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </Link>
            <Link href={spec.hero.secondaryCta.href} className="hm-btn hm-btn-secondary">
              {spec.hero.secondaryCta.label}
            </Link>
          </div>
        </HeroSearch>

        <CategoriesSection
          heading={spec.categories.heading}
          sub={spec.categories.sub}
          items={categoryItems}
          gridClassName="hm-cats-grid--center"
        />

        <PopularSubcategoriesSection
          items={popularSubcats}
          heading={spec.popular.heading.replace('{n}', floorLabel(totalSubcategories, 100))}
          sub={spec.popular.sub}
          ctaLabel={spec.popular.cta.label}
          ctaHref={spec.popular.cta.href}
          icons={spec.popular.icons}
          accent={spec.accent}
          gridClassName="hm-needs-grid--center"
        />

        <TopFirmsSection
          cats={featured}
          sectorSlug={sector}
          title={spec.featured.heading}
          sub={spec.featured.sub}
          tabsLabel={spec.featured.tabsLabel}
          emptyNoun={spec.featured.emptyNoun}
          namesAsHeadings={spec.featured.namesAsHeadings}
        />

        <NewLaunchesSection
          launches={launches}
          sectorSlug={sector}
          title={spec.recent.heading}
          sub={spec.recent.sub}
          cta={spec.recent.ctaLabel}
        />

        <CountriesSection
          countries={countries}
          heading={spec.countries.heading}
          sub={spec.countries.sub}
          pillTemplate={spec.countries.pillTemplate}
        />

        <ComparisonTableSection
          heading={spec.comparison.heading}
          sub={spec.comparison.sub}
          caption={spec.comparison.caption}
          audiences={spec.comparison.audiences}
        />

        <NewReviewsSection
          reviews={reviews}
          title={spec.reviews.heading}
          subtitle={spec.reviews.sub}
          ctaLabel={spec.reviews.ctaLabel}
        />

        <LatestBlogSection
          posts={blogPosts}
          heading={spec.blog.heading}
          sub={spec.blog.sub}
          ctaLabel={spec.blog.ctaLabel}
        />

        <HomeFaqSection faqs={spec.faqs} />

        <FinalCtaSection
          title={spec.finalCta.title}
          subtitle={spec.finalCta.subtitle}
          ctaLabel={spec.finalCta.cta.label}
          ctaHref={spec.finalCta.cta.href}
        />
      </main>
      <Footer />
    </>
  )
}
