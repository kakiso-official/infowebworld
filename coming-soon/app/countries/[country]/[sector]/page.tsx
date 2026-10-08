import type { Metadata } from 'next'
import Link from 'next/link'
import { cache } from 'react'
import { redirect, permanentRedirect } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBuilding, faLayerGroup, faLocationDot, faStar } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../../../styles/categories.css'
import '../../../styles/test-category-1-page.css'
import '../../../styles/test-landing-page.css'
import '../../../styles/home.css'
import '../../../styles/sector-directory.css'
import '../../../styles/country-directory.css'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import NewReviewsSection from '../../../test-landing-page/NewReviewsSection'
import HomeFaqSection from '../../../home-sections/HomeFaqSection'
import FinalCtaSection from '../../../test-landing-page/FinalCtaSection'
import { sectorLandingPath } from '@/lib/sector-paths'
import {
  COUNTRY_LISTINGS_PER_PAGE, COUNTRY_PAGE_MIN_LISTINGS, SECTOR_COUNTRY_COPY,
  countryHubPath, countryInPhrase, countrySectorPath, sectorFromCountrySegment,
} from '@/lib/country-paths'
import {
  getCountriesWithListings, getCountryBySlug, getCountryCities, getCountryListings,
  getCountryReviewStats, getCountryReviews, getCountrySectorCounts, getCountrySectorPairs,
  getCountryTopCategories, type CountryInfo,
} from '../../country-data'
import {
  buildMetadata, buildSectorFaqs, buildSectorJsonLd, fmt, hubName, plural, sectorCrumbs,
  sectorDescription, sectorH1, sectorIndexable, sectorPagePath, sectorTitle,
} from '../../seo'
import CountryHero, { type HeroStat } from '../../components/CountryHero'
import Section from '../../components/Section'
import SectorCards from '../../components/SectorCards'
import { CategoryChips, CityChips } from '../../components/Chips'
import CountryCards from '../../components/CountryCards'
import CountryListingGrid from '../../components/CountryListingGrid'
import CountryPagination from '../../components/CountryPagination'

/* ═══════════════════════════════════════════════════════════════════════
   /{country}-business-directory/{sector directory} - one sector in one
   country, e.g. /india-business-directory/it-directory. Served from this
   route by middleware.ts (lib/country-paths.ts). Every live listing,
   paginated (?page=N, page 1 = the clean URL), in the sector palette.

     1  Hero (flag, breadcrumb, H1 "{noun} in {Country}", stats)
     2  Browse by category (L2 + popular L3 → category ?country= pages)
     3  All {noun} in {Country} - grid + numbered pagination
     4  Popular cities
     5  Reviews (only when there are any)
     6  FAQs (same array as the FAQPage node)
     7  {noun} in other countries
     8  Other sectors in {Country}
     9  Final CTA

   Unknown country / sector segment, or a sector with no listings here
   → /url-removed (real 404). Alias / wrong case → 308 to canonical.
   Bad ?page (non-integer, < 1, past the end, or "1") → the clean URL.
   ═══════════════════════════════════════════════════════════════════════ */

export const dynamic = 'force-dynamic'

type Params = Promise<{ country: string; sector: string }>
type SearchParams = Promise<Record<string, string | string[] | undefined>>

type Resolved = {
  country: CountryInfo
  sector: string
  listings: number
  page: number
  totalPages: number
}

function decode(raw: string): string {
  try { return decodeURIComponent(raw) } catch { return raw }
}

const lookupCountry = cache((slug: string) => getCountryBySlug(slug))
const loadSectors = cache((countryId: number) => getCountrySectorCounts(countryId))
const loadCities = cache((countryId: number, sector: string) => getCountryCities(countryId, sector, 24))

async function resolvePage(params: Params, searchParams: SearchParams): Promise<Resolved> {
  const p = await params
  const rawCountry = decode(p.country)
  const rawSector = decode(p.sector)

  const country = await lookupCountry(rawCountry.toLowerCase())
  const sector = sectorFromCountrySegment(rawSector.toLowerCase())
  if (!country || country.listings < 1 || !sector || !SECTOR_COUNTRY_COPY[sector]) redirect('/url-removed')

  const sectors = await loadSectors(country.id)
  const listings = sectors.find(s => s.sector === sector)?.listings ?? 0
  if (listings < COUNTRY_PAGE_MIN_LISTINGS) redirect('/url-removed')

  const totalPages = Math.max(1, Math.ceil(listings / COUNTRY_LISTINGS_PER_PAGE))

  /* ?page: absent → 1. Anything but a canonical integer 2..last → clean URL. */
  const sp = await searchParams
  const rawPage = sp.page
  let page = 1
  let pageInvalid = false
  if (rawPage !== undefined) {
    const v = Array.isArray(rawPage) ? rawPage[0] : rawPage
    if (Array.isArray(rawPage) || !/^[1-9]\d{0,5}$/.test(v ?? '')) pageInvalid = true
    else {
      page = Number(v)
      if (page < 2 || page > totalPages) { pageInvalid = true; page = 1 }
    }
  }

  const canonicalPath = countrySectorPath(country.slug, sector)
  if (pageInvalid) redirect(canonicalPath)
  if (rawCountry !== country.slug || rawSector !== canonicalPath.split('/').pop()) {
    permanentRedirect(sectorPagePath(country.slug, sector, page))
  }

  return { country, sector, listings, page, totalPages }
}

export async function generateMetadata(
  { params, searchParams }: { params: Params; searchParams: SearchParams },
): Promise<Metadata> {
  const { country, sector, listings, page } = await resolvePage(params, searchParams)
  const cities = await loadCities(country.id, sector)
  return buildMetadata({
    path: sectorPagePath(country.slug, sector, page),
    title: sectorTitle(country, sector, page),
    description: sectorDescription(country, sector, listings, cities),
    indexable: sectorIndexable(listings, page),
    imageAlt: `${SECTOR_COUNTRY_COPY[sector].noun} in ${countryInPhrase(country.name)} - InfoWebWorld`,
  })
}

export default async function CountrySectorPage(
  { params, searchParams }: { params: Params; searchParams: SearchParams },
) {
  const { country, sector, listings, page, totalPages } = await resolvePage(params, searchParams)
  const id = country.id
  const copy = SECTOR_COUNTRY_COPY[sector]
  const C = countryInPhrase(country.name)

  const [sectors, list, topL2, topL3, cities, reviews, reviewStats, pairs, allCountries] = await Promise.all([
    loadSectors(id),
    getCountryListings(id, sector, page, COUNTRY_LISTINGS_PER_PAGE),
    getCountryTopCategories(id, sector, 2, 12),
    getCountryTopCategories(id, sector, 3, 16),
    loadCities(id, sector),
    getCountryReviews(id, sector, 8),
    getCountryReviewStats(id, sector),
    getCountrySectorPairs(),
    getCountriesWithListings(),
  ])

  const rows = list.rows
  const total = list.total > 0 ? list.total : listings
  const from = rows.length > 0 ? (page - 1) * COUNTRY_LISTINGS_PER_PAGE + 1 : 0
  const to = rows.length > 0 ? from + rows.length - 1 : 0

  const title = sectorTitle(country, sector, page)
  const description = sectorDescription(country, sector, listings, cities)
  const categoriesForFaq = topL2.length > 0 ? topL2 : topL3
  const faqs = buildSectorFaqs({ country, sector, listings, cities, categories: categoriesForFaq, reviewStats })

  /* Same sector in other countries (pairs with >= 1 listing only). */
  const byId = new Map(allCountries.map(c => [c.id, c]))
  const otherCountries = pairs
    .filter(p => p.sector === sector && p.countryId !== id && p.listings >= COUNTRY_PAGE_MIN_LISTINGS)
    .sort((a, b) => b.listings - a.listings)
    .map(p => ({ p, c: byId.get(p.countryId) }))
    .filter((x): x is { p: typeof x.p; c: CountryInfo } => Boolean(x.c))
    .slice(0, 12)
    .map(({ p, c }) => ({
      key: c.slug, name: c.name, code: c.code,
      href: countrySectorPath(c.slug, sector), listings: p.listings,
    }))

  const otherSectors = sectors.filter(s => s.sector !== sector && s.listings > 0)

  const categoryCount = topL2.length
  const stats: HeroStat[] = [
    { icon: faBuilding, text: plural(listings, 'live listing', 'live listings') },
  ]
  if (categoryCount > 0) stats.push({ icon: faLayerGroup, text: `${fmt(categoryCount)}${categoryCount >= 12 ? '+' : ''} ${categoryCount === 1 ? 'category' : 'categories'}` })
  if (cities.length > 0) stats.push({ icon: faLocationDot, text: `${fmt(cities.length)}${cities.length >= 24 ? '+' : ''} ${cities.length === 1 ? 'city' : 'cities'}` })
  if (reviewStats.count > 0) stats.push({ icon: faStar, text: `${reviewStats.avg.toFixed(1)} avg from ${plural(reviewStats.count, 'review', 'reviews')}` })

  const cityNames = cities.slice(0, 3).map(c => c.city)
  const sub = (listings === 1 ? `See the ${copy.name} listing in ${C}` : `Compare ${fmt(listings)} ${copy.nounLower} in ${C}`) +
    (cityNames.length > 0 ? `, from ${cityNames.join(', ')} and beyond` : '') +
    '. Featured and verified listings first, every one reviewed by our team before it goes live.'

  const hrefFor = (n: number) => sectorPagePath(country.slug, sector, n)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSectorJsonLd({ country, sector, page, rows, title, description, faqs })) }}
      />
      <Navbar sectorSlug={sector} />
      <main className={`tlp tcat1 tcat-${sector} sdir cdir`}>
        <CountryHero
          flagCode={country.code}
          flagAlt={`${country.name} flag`}
          crumbs={sectorCrumbs(country, sector)}
          title={sectorH1(country, sector)}
          sub={sub}
          stats={stats}
          primary={{ label: listings === 1 ? 'See the listing' : `See all ${fmt(listings)} listings`, href: '#listings' }}
          secondary={{ label: 'List your business', href: '/business' }}
        />

        {(topL2.length > 0 || topL3.length > 0) && (
          <Section
            id="categories"
            title={`Browse ${copy.noun} in ${C} by Category`}
            sub={`Categories with live ${copy.name} listings in ${C}. Each opens the category filtered to ${country.name}.`}
          >
            <CategoryChips categories={topL2} countrySlug={country.slug} label={topL3.length > 0 ? 'Categories' : undefined} />
            <CategoryChips categories={topL3} countrySlug={country.slug} label={topL2.length > 0 ? 'Popular subcategories' : undefined} />
          </Section>
        )}

        <Section
          id="listings"
          tone="wash"
          title={`All ${copy.noun} in ${C}`}
          sub={rows.length > 0
            ? <>Showing <strong>{fmt(from)}-{fmt(to)}</strong> of <strong>{fmt(total)}</strong>{totalPages > 1 ? ` (page ${page} of ${totalPages})` : ''}. Featured and verified listings first, then the most reviewed.</>
            : undefined}
          action={
            <Link href={sectorLandingPath(sector)} className="cdir-more-link">
              <span>{copy.directoryName}</span>
              <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </Link>
          }
          wide
        >
          <CountryListingGrid
            rows={rows}
            sector={sector}
            emptyText={`No ${copy.nounLower} on this page.`}
          />
          <CountryPagination
            page={page}
            totalPages={totalPages}
            hrefFor={hrefFor}
            label={`${copy.noun} in ${C} - pages`}
          />
        </Section>

        {cities.length > 0 && (
          <Section
            id="cities"
            title={`Popular Cities for ${copy.noun} in ${C}`}
            sub="By number of live listings."
          >
            <CityChips cities={cities.slice(0, 18)} />
          </Section>
        )}

        {reviews.length > 0 && (
          <NewReviewsSection
            reviews={reviews}
            title={`Latest Reviews of ${copy.noun} in ${C}`}
            subtitle={reviewStats.count > 0
              ? `${plural(reviewStats.count, 'approved review', 'approved reviews')}, ${reviewStats.avg.toFixed(1)} out of 5 on average.`
              : undefined}
          />
        )}

        <HomeFaqSection faqs={faqs} heading={`FAQs: ${copy.noun} in ${C}`} />

        {otherCountries.length > 0 && (
          <Section
            id="other-countries"
            tone="wash"
            title={`${copy.noun} in Other Countries`}
            sub={`The same ${copy.name} directory, country by country.`}
            action={
              <Link href={sectorLandingPath(sector)} className="cdir-more-link">
                <span>All {copy.nounLower}</span>
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </Link>
            }
            wide
          >
            <CountryCards items={otherCountries} compact />
          </Section>
        )}

        {otherSectors.length > 0 && (
          <Section
            id="other-sectors"
            title={`Other Sectors in ${C}`}
            sub={`More of the ${country.name} business directory.`}
            action={
              <Link href={countryHubPath(country.slug)} className="cdir-more-link">
                <span>{hubName(country)}</span>
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </Link>
            }
          >
            <SectorCards countrySlug={country.slug} sectors={otherSectors} />
          </Section>
        )}

        <FinalCtaSection
          title={`List your business in ${C}`}
          subtitle={`Reach buyers comparing ${copy.nounLower} in ${C}. Free listings are reviewed by our team before they go live.`}
          ctaLabel="List your business"
          ctaHref="/business"
        />
      </main>
      <Footer />
    </>
  )
}
