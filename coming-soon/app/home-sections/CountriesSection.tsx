import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import type { CountryCount } from './countries-data'

/* ════════════════════════════════════════════════════════════════════════
   "Businesses Near You, Businesses Around the World" - homepage section
   showcasing the countries InfoWebWorld has live listings from.

   Server Component - `countries` is fetched by the caller (app/page.tsx)
   via getCountryListingCounts() and passed in as a prop.
   ════════════════════════════════════════════════════════════════════════ */

const VISIBLE_COUNT = 12

function formatListings(n: number | null): string | null {
  if (n == null) return null
  return `${n.toLocaleString('en-US')} listing${n === 1 ? '' : 's'}`
}

export default function CountriesSection({ countries }: { countries: CountryCount[] }) {
  if (!countries.length) return null

  /* Live mode = every row carries a real DB-computed count. The static
     fallback (DB failure) sets listings: null throughout, so a single null
     check is enough to tell the two apart - never show the count pill, and
     never render the "show all" disclosure, in fallback mode. */
  const isLive = countries.every(c => c.listings !== null)

  const visible = countries.slice(0, VISIBLE_COUNT)
  const rest = countries.slice(VISIBLE_COUNT)

  return (
    <section className="hm-geo" aria-labelledby="hm-geo-h">
      <div className="hm-geo-inner">
        <div className="hm-geo-head">
          <h2 id="hm-geo-h" className="hm-geo-title">
            Businesses Near You, Businesses Around the World
          </h2>
          <p className="hm-geo-sub">
            Browse verified listings by country, from local shops and agencies to global software companies.
          </p>
          {isLive && (
            <p className="hm-geo-pill">
              <span>Verified listings from {countries.length.toLocaleString('en-US')} countries</span>
            </p>
          )}
        </div>

        {/* Country hub pages are planned next but do not exist yet, so these
            tiles are intentionally non-interactive (<ul>/<li>, no <Link>,
            default cursor, no hover lift). Once /countries/[slug] ships,
            wrap each tile's content in <Link href={`/countries/${slugOf(c)}`}>
            and promote the <li> back to a single-link card. */}
        <ul className="hm-geo-grid">
          {visible.map(c => {
            const listingsLabel = formatListings(c.listings)
            return (
              <li key={c.code} className="hm-geo-tile">
                <img
                  className="hm-geo-flag"
                  src={`https://flagcdn.com/w80/${c.code.toLowerCase()}.png`}
                  width={40}
                  height={30}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span className="hm-geo-name">{c.name}</span>
                {listingsLabel && <span className="hm-geo-count">{listingsLabel}</span>}
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
                  {c.name} · {(c.listings ?? 0).toLocaleString('en-US')}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </section>
  )
}
