import type { Metadata } from 'next'
import { cache } from 'react'
import { faBuilding, faEarthAmericas, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/test-category-1-page.css'
import '../styles/test-landing-page.css'
import '../styles/home.css'
import '../styles/country-directory.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FinalCtaSection from '../test-landing-page/FinalCtaSection'
import { COUNTRIES_INDEX_PATH, SECTOR_COUNTRY_COPY, countryHubPath } from '@/lib/country-paths'
import { getCountriesWithListings, getCountrySectorPairs } from './country-data'
import { buildIndexJsonLd, buildMetadata, fmt, indexCrumbs, indexDescription, indexTitle } from './seo'
import CountryHero from './components/CountryHero'
import Section from './components/Section'
import CountryCards, { type CountryCardItem } from './components/CountryCards'

/* ═══════════════════════════════════════════════════════════════════════
   /countries - every country with live listings, biggest first. Each
   card opens the country hub (/countries/{country}). The fetchers throw
   on a DB failure, so a DB outage is a 500 (retried), never an empty
   index that would be cached and crawled.
   ═══════════════════════════════════════════════════════════════════════ */

/* Rendered per request (the fetchers are cached for 10 minutes), not
   prerendered at build: a fetcher that throws during the Coolify build
   would fail the whole deploy. */
export const dynamic = 'force-dynamic'

const loadIndex = cache(async () => {
  const [countries, pairs] = await Promise.all([getCountriesWithListings(), getCountrySectorPairs()])
  return { countries, pairs }
})

export async function generateMetadata(): Promise<Metadata> {
  const { countries } = await loadIndex()
  return buildMetadata({
    path: COUNTRIES_INDEX_PATH,
    title: indexTitle(countries.length),
    description: indexDescription(countries),
    indexable: true,
    imageAlt: 'InfoWebWorld business directory by country',
  })
}

export default async function CountriesIndexPage() {
  const { countries, pairs } = await loadIndex()

  /* Each country's biggest sector, for the card's meta line. */
  const topSector = new Map<number, { sector: string; listings: number }>()
  for (const p of pairs) {
    const cur = topSector.get(p.countryId)
    if (!cur || p.listings > cur.listings) topSector.set(p.countryId, { sector: p.sector, listings: p.listings })
  }
  const sectorsLive = new Set(pairs.map(p => p.sector)).size

  const totalListings = countries.reduce((s, c) => s + c.listings, 0)
  const title = indexTitle(countries.length)
  const description = indexDescription(countries)

  const items: CountryCardItem[] = countries.map(c => {
    const top = topSector.get(c.id)
    const noun = top ? SECTOR_COUNTRY_COPY[top.sector]?.noun : undefined
    return {
      key: c.slug,
      name: c.name,
      code: c.code,
      href: countryHubPath(c.slug),
      listings: c.listings,
      meta: noun ? `Top: ${noun}` : undefined,
    }
  })

  const top3 = countries.slice(0, 3).map(c => c.name)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildIndexJsonLd(countries, title, description)) }}
      />
      <Navbar />
      <main className="tlp cdir">
        <CountryHero
          crumbs={indexCrumbs()}
          title="Business Directory by Country"
          sub={`Browse ${fmt(totalListings)} live business listings from ${fmt(countries.length)} countries. Open a country to see its companies by sector, city and category, with reviews and company details.`}
          stats={[
            { icon: faEarthAmericas, text: `${fmt(countries.length)} countries` },
            { icon: faBuilding, text: `${fmt(totalListings)} live listings` },
            ...(sectorsLive > 0 ? [{ icon: faLayerGroup, text: `${sectorsLive} sectors` }] : []),
          ]}
          primary={{ label: 'Browse all countries', href: '#all-countries' }}
          secondary={{ label: 'List your business', href: '/business' }}
        />

        <Section
          id="all-countries"
          title="All countries"
          sub={top3.length > 0
            ? `Sorted by live listings. ${top3.join(', ')} lead the directory; every country here has at least one reviewed, live listing.`
            : 'Sorted by live listings.'}
          wide
        >
          <CountryCards items={items} />
        </Section>

        <FinalCtaSection
          title="Put your business on the map"
          subtitle="Add a free listing in your country. Our team reviews every submission before it goes live."
          ctaLabel="List your business"
          ctaHref="/business"
        />
      </main>
      <Footer />
    </>
  )
}
