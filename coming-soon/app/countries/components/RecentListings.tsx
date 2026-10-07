import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { cleanText } from '@/lib/seo'
import { SECTOR_COUNTRY_COPY } from '@/lib/country-paths'
import type { ListingRow } from '../country-data'
import { listingPath } from '../seo'

/* "Recently added" - a compact card grid (logo, name as H3, category,
   city, one-line blurb). Lighter than the full listing card so the hub
   does not stack two long card lists. Server component. */
export default function RecentListings({ rows, showSector = false }: { rows: ListingRow[]; showSector?: boolean }) {
  if (rows.length === 0) return null
  return (
    <ul className="cdir-recent-grid">
      {rows.map(r => {
        const name = String(r.company_name ?? '')
        const logo = String(r.logo_url ?? '').replace(/^http:\/\//, 'https://')
        const blurb = cleanText(r.tagline, '', 20) || cleanText(r.description, '', 40)
        const city = String(r.city ?? '').trim()
        const sector = String(r.sector_slug ?? '')
        const category = String(r.category_name ?? '')
        const sectorName = showSector ? SECTOR_COUNTRY_COPY[sector]?.name : undefined
        return (
          <li key={String(r.id)} className={'cdir-recent' + (sector ? ` tcat-${sector}` : '')}>
            <Link href={listingPath(r)} className="cdir-recent-link">
              <span className="cdir-recent-top">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="cdir-recent-logo" src={logo} alt="" width={44} height={44} loading="lazy" decoding="async" />
                ) : (
                  <span className="cdir-recent-logo cdir-recent-logo--ph" aria-hidden="true">
                    {(name || '?').charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="cdir-recent-id">
                  <h3 className="cdir-recent-name">
                    {name}
                    {Number(r.verified) ? (
                      <FontAwesomeIcon icon={faCircleCheck} className="cdir-recent-verified" aria-label="Verified" />
                    ) : null}
                  </h3>
                  {category ? <span className="cdir-recent-cat">{category}</span> : null}
                </span>
              </span>
              {blurb ? <span className="cdir-recent-blurb">{blurb}</span> : null}
              <span className="cdir-recent-foot">
                {city ? (
                  <span className="cdir-recent-city">
                    <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" /> {city}
                  </span>
                ) : <span />}
                {sectorName ? <span className="cdir-recent-sector">{sectorName}</span> : null}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
