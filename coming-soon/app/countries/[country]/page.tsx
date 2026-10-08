import type { Metadata } from 'next'
import Link from 'next/link'
import { cache } from 'react'
import { redirect, permanentRedirect } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBuilding, faLayerGroup, faLocationDot, faStar } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../../styles/categories.css'
import '../../styles/test-category-1-page.css'
import '../../styles/test-landing-page.css'
import '../../styles/home.css'
import '../../styles/country-directory.css'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import NewReviewsSection from '../../test-landing-page/NewReviewsSection'
import HomeFaqSection from '../../home-sections/HomeFaqSection'
import FinalCtaSection from '../../test-landing-page/FinalCtaSection'
import {
  COUNTRIES_INDEX_PATH, SECTOR_COUNTRY_COPY, countryHubPath, countryInPhrase, countrySectorPath,
} from '@/lib/country-paths'
import {
  getCountriesWithListings, getCountryBySlug, getCountryCities, getCountryFeatured,
  getCountryRecent, getCountryReviewStats, getCountryReviews, getCountrySectorCounts,
  getCountryTopCategories, type CategoryCount, type CountryInfo,
} from '../country-data'
import {
  buildHubFaqs, buildHubJsonLd, buildMetadata, categoryInCountryPath, fmt, hubCrumbs,
  hubDescription, hubH1, hubIndexable, hubTitle, joinList, plural,
} from '../seo'
import CountryHero, { type HeroStat } from '../components/CountryHero'
import Section from '../components/Section'
import SectorCategoryTabs, { type SectorTab } from '../components/SectorCategoryTabs'
import { CityChips } from '../components/Chips'
import CountryCards from '../components/CountryCards'
import CountryListingGrid from '../components/CountryListingGrid'
import RecentListings from '../components/RecentListings'

/* ═══════════════════════════════════════════════════════════════════════
   /{country}-business-directory - the country hub: all six sectors mixed.
   Served from this route by middleware.ts (lib/country-paths.ts), so the
   `country` param is always the canonical country slug.

     1  Hero (flag, breadcrumb, H1 "#1 Rated {US} Business Directory", stats)
     2  Browse {Country} businesses by sector - one tab per sector, its top
        categories as cards (→ /{sector dir}/{category}?country=) and a CTA
        to /{country}-business-directory/{sector dir}
     3  Featured businesses (12, paid + verified first)
     4  Popular cities (chips)
     5  Recently added (8)
     6  Reviews (only when the country has any)
     7  FAQs (same array as the FAQPage node)
     8  Explore other countries
     9  Final CTA

   Unknown / zero-listing country → /url-removed (a real 404; notFound()
   here would stream a 200). A non-canonical slug → 308 to the hub URL.
   ═══════════════════════════════════════════════════════════════════════ */

/** Category cards per sector tab - the homepage Featured grid's 3 x 3. */
const CATEGORIES_PER_SECTOR = 9

/* Every L2 category with listings in the country, in one query: the tabs
   take each sector's top 9 from it, the FAQ the overall top 5. Above the
   whole taxonomy's L2 count, so no sector is ever cut short. */
const ALL_L2_LIMIT = 500

export const dynamic = 'force-dynamic'

type Params = Promise<{ country: string }>

function decode(raw: string): string {
  try { return decodeURIComponent(raw) } catch { return raw }
}

const lookupCountry = cache((slug: string) => getCountryBySlug(slug))
const loadSectors = cache((countryId: number) => getCountrySectorCounts(countryId))

/** The canonical country for this URL, or a redirect. */
async function resolveCountry(params: Params): Promise<CountryInfo> {
  const raw = decode((await params).country)
  const country = await lookupCountry(raw.toLowerCase())
  if (!country || country.listings < 1) redirect('/url-removed')
  if (raw !== country.slug) permanentRedirect(countryHubPath(country.slug))
  return country
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const country = await resolveCountry(params)
  const sectors = await loadSectors(country.id)
  return buildMetadata({
    path: countryHubPath(country.slug),
    title: hubTitle(country),
    description: hubDescription(country, sectors),
    indexable: hubIndexable(country),
    imageAlt: `${hubH1(country)} - InfoWebWorld`,
  })
}

export default async function CountryHubPage({ params }: { params: Params }) {
  const country = await resolveCountry(params)
  const id = country.id

  const [sectors, topL2, cities, featured, recentPool, reviews, reviewStats, allCountries] =
    await Promise.all([
      loadSectors(id),
      getCountryTopCategories(id, null, 2, ALL_L2_LIMIT),
      getCountryCities(id, null, 40),
      getCountryFeatured(id, 12),
      getCountryRecent(id, null, 20),
      getCountryReviews(id, null, 8),
      getCountryReviewStats(id, null),
      getCountriesWithListings(),
    ])

  const C = countryInPhrase(country.name)
  const live = sectors.filter(s => s.listings > 0).sort((a, b) => b.listings - a.listings)

  /* Recently added: newest listings that are not already in Featured. */
  const featuredIds = new Set(featured.map(r => String(r.id)))
  const recent = recentPool.filter(r => !featuredIds.has(String(r.id))).slice(0, 8)

  const title = hubTitle(country)
  const description = hubDescription(country, sectors)
  const faqs = buildHubFaqs({ country, sectors, cities, categories: topL2, reviewStats })

  /* One tab per live sector: its top categories here (topL2 is already
     sorted by listings, so each sector's list is too). */
  const l2BySector = new Map<string, CategoryCount[]>()
  for (const c of topL2) {
    const list = l2BySector.get(c.sector)
    if (list) list.push(c)
    else l2BySector.set(c.sector, [c])
  }
  const sectorTabs: SectorTab[] = live
    .filter(s => SECTOR_COUNTRY_COPY[s.sector])
    .map(s => {
      const copy = SECTOR_COUNTRY_COPY[s.sector]
      return {
        sector: s.sector,
        label: copy.name,
        listings: s.listings,
        href: countrySectorPath(country.slug, s.sector),
        cta: s.listings === 1
          ? `See the ${copy.name} listing in ${C}`
          : `View all ${fmt(s.listings)} ${copy.noun} in ${C}`,
        categories: (l2BySector.get(s.sector) ?? []).slice(0, CATEGORIES_PER_SECTOR).map(c => ({
          id: c.id,
          name: c.name,
          listings: c.listings,
          href: categoryInCountryPath(c.sector, c.slug, country.slug),
        })),
        emptyText: `Every ${copy.name} listing in ${C} is on the sector page.`,
      }
    })

  const stats: HeroStat[] = [
    { icon: faBuilding, text: `${plural(country.listings, 'live listing', 'live listings')}` },
    { icon: faLayerGroup, text: plural(live.length, 'sector', 'sectors') },
  ]
  if (cities.length > 0) {
    stats.push({ icon: faLocationDot, text: `${fmt(cities.length)}${cities.length >= 40 ? '+' : ''} ${cities.length === 1 ? 'city' : 'cities'}` })
  }
  if (reviewStats.count > 0) {
    stats.push({ icon: faStar, text: `${reviewStats.avg.toFixed(1)} avg from ${plural(reviewStats.count, 'review', 'reviews')}` })
  }

  const topNouns = live.slice(0, 3).map(s => SECTOR_COUNTRY_COPY[s.sector]?.nounLower).filter(Boolean) as string[]
  const sub = live.length > 1
    ? `Compare ${plural(country.listings, 'business', 'businesses')} in ${C} across ${live.length} sectors, from ${joinList(topNouns)}. Every listing is reviewed by our team before it goes live.`
    : `Compare ${plural(country.listings, 'business', 'businesses')} in ${C}${topNouns[0] ? ` among ${topNouns[0]}` : ''}. Every listing is reviewed by our team before it goes live.`

  const otherCountries = allCountries
    .filter(c => c.id !== country.id)
    .slice(0, 12)
    .map(c => ({ key: c.slug, name: c.name, code: c.code, href: countryHubPath(c.slug), listings: c.listings }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHubJsonLd({ country, sectors, title, description, faqs })) }}
      />
      <Navbar />
      <main className="tlp cdir">
        <CountryHero
          flagCode={country.code}
          flagAlt={`${country.name} flag`}
          crumbs={hubCrumbs(country)}
          title={hubH1(country)}
          sub={sub}
          stats={stats}
          primary={{ label: 'List your business', href: '/business' }}
        />

        <SectorCategoryTabs
          id="sectors"
          title={`Browse ${country.name} Businesses by Sector`}
          sub={`Pick a sector to see its most popular categories in ${C}, ranked by live listings. Open a category to compare its businesses, or view every listing in the sector.`}
          tabs={sectorTabs}
        />

        <Section
          id="featured"
          title={`Featured Businesses in ${C}`}
          sub="Featured and verified listings first, then the most reviewed."
          wide
        >
          <CountryListingGrid rows={featured} emptyText={`No featured listings in ${C} yet.`} />
        </Section>

        {cities.length > 0 && (
          <Section
            id="cities"
            tone="wash"
            title={`Popular Cities in ${C}`}
            sub={`Where ${country.name} listings on InfoWebWorld are based, by number of live listings.`}
          >
            <CityChips cities={cities.slice(0, 18)} />
          </Section>
        )}

        {recent.length > 0 && (
          <Section
            id="recent"
            title={`Recently Added in ${C}`}
            sub="The newest listings to go live after review."
            wide
          >
            <RecentListings rows={recent} showSector />
          </Section>
        )}

        {reviews.length > 0 && (
          <NewReviewsSection
            reviews={reviews}
            title={`Latest Reviews of Businesses in ${C}`}
            subtitle={reviewStats.count > 0
              ? `${plural(reviewStats.count, 'approved review', 'approved reviews')}, ${reviewStats.avg.toFixed(1)} out of 5 on average.`
              : undefined}
          />
        )}

        <HomeFaqSection faqs={faqs} heading={`FAQs: Businesses in ${C}`} />

        {otherCountries.length > 0 && (
          <Section
            id="other-countries"
            tone="wash"
            title="Explore Other Countries"
            sub="Business directories for the countries with the most live listings."
            action={
              <Link href={COUNTRIES_INDEX_PATH} className="cdir-more-link">
                <span>All countries</span>
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </Link>
            }
            wide
          >
            <CountryCards items={otherCountries} compact />
          </Section>
        )}

        <FinalCtaSection
          title={`List your business in ${C}`}
          subtitle={`Get in front of buyers comparing businesses in ${C}. Free listings are reviewed by our team before they go live.`}
          ctaLabel="List your business"
          ctaHref="/business"
        />
      </main>
      <Footer />
    </>
  )
}
