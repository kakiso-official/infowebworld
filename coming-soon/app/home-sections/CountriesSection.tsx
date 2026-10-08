import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import type { CountryCount } from './countries-data'
import { countryHubPath, countrySectorPath, countrySlug } from '@/lib/country-paths'

/* ════════════════════════════════════════════════════════════════════════
   "Businesses Near You, Businesses Around the World" - homepage section
   showcasing the countries InfoWebWorld has live listings from.

   Server Component - `countries` is fetched by the caller (app/page.tsx)
   via getCountryListingCounts() and passed in as a prop. The AI tools
   directory passes sector-scoped counts plus its own heading/sub/pill.

   One button below the tiles: "Show all {n} countries" opens the rest in
   place (Oct 2026 SEO spec: one button, not two - the separate "Browse all
   countries" link to /countries was dropped; the footer links there).
   ════════════════════════════════════════════════════════════════════════ */

const VISIBLE_COUNT = 12

function formatListings(n: number | null): string | null {
  if (n == null) return null
  return `${n.toLocaleString('en-US')} listing${n === 1 ? '' : 's'}`
}

export interface CountriesSectionProps {
  countries: CountryCount[]
  heading?: string
  sub?: string
  /** Live-mode pill text; "{n}" becomes the formatted country count. */
  pillTemplate?: string
  /** Scopes every tile's link to one sector's country page
   *  (/{country}-business-directory/{sector path}) instead of the country hub. */
  sectorSlug?: string
}

export default function CountriesSection({
  countries,
  heading = 'Businesses Near You, Businesses Around the World',
  sub = 'Browse verified listings by country, from local shops and agencies to global software companies.',
  pillTemplate = 'Verified listings from {n} countries',
  sectorSlug,
}: CountriesSectionProps) {
  if (!countries.length) return null

  /* Live mode = every row carries a real DB-computed count. The static
     fallback (DB failure) sets listings: null throughout, so a single null
     check is enough to tell the two apart - never show the count pill, and
     never render the "show all" disclosure, in fallback mode. Fallback tiles
     stay plain (no country page is guaranteed to exist for them). */
  const isLive = countries.every(c => c.listings !== null)

  const hrefFor = (c: CountryCount) => {
    const slug = countrySlug(c.name)
    return sectorSlug ? countrySectorPath(slug, sectorSlug) : countryHubPath(slug)
  }

  const visible = countries.slice(0, VISIBLE_COUNT)
  const rest = countries.slice(VISIBLE_COUNT)

  return (
    <section className="hm-geo" aria-labelledby="hm-geo-h">
      <div className="hm-geo-inner">
        <div className="hm-geo-head">
          <h2 id="hm-geo-h" className="hm-geo-title">
            {heading}
          </h2>
          <p className="hm-geo-sub">
            {sub}
          </p>
          {isLive && (
            <p className="hm-geo-pill">
              <span>{pillTemplate.replace('{n}', countries.length.toLocaleString('en-US'))}</span>
            </p>
          )}
        </div>

        {/* Tiles link to the country's page (hub, or this sector's country
            page when sectorSlug is set). In fallback mode (DB failure,
            listings: null) a page is not guaranteed to exist for every
            static entry, so those tiles stay plain non-interactive cards. */}
        <ul className="hm-geo-grid">
          {visible.map(c => {
            const listingsLabel = formatListings(c.listings)
            const tileContent = (
              <>
                <img
                  className="hm-geo-flag"
                  src={`https://flagcdn.com/w80/${c.code.toLowerCase()}.png`}
                  width={40}
                  height={30}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <h3 className="hm-geo-name">{c.name}</h3>
                {listingsLabel && <span className="hm-geo-count">{listingsLabel}</span>}
              </>
            )
            return (
              <li key={c.code} className="hm-geo-tile">
                {isLive ? (
                  <Link href={hrefFor(c)} className="hm-geo-link">
                    {tileContent}
                  </Link>
                ) : tileContent}
              </li>
            )
          })}
        </ul>

        {isLive && rest.length > 0 && (
          <details className="hm-geo-more">
            <summary className="hm-geo-more-summary">
              <span>Show all {countries.length.toLocaleString('en-US')} countries</span>
              <span className="hm-geo-chevron" aria-hidden="true">
                <FontAwesomeIcon icon={faChevronDown} />
              </span>
            </summary>
            <ul className="hm-geo-chips">
              {rest.map(c => (
                <li key={c.code} className="hm-geo-chip">
                  <Link href={hrefFor(c)} className="hm-geo-chip-link">
                    {c.name} · {(c.listings ?? 0).toLocaleString('en-US')}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </section>
  )
}
