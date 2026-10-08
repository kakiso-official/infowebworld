import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { SECTOR_COUNTRY_COPY, countrySectorPath } from '@/lib/country-paths'
import type { SectorCount } from '../country-data'
import { SECTOR_UI } from './sector-ui'

/* Sector cards linking to /{country}-business-directory/{sector directory}. Same
   card markup + styles as the homepage "Browse by Category" grid (hm-cat-*),
   but the count is the sector's live listings in this country. Only
   sectors with listings are rendered, so every card is a real page. */
export default function SectorCards({
  countrySlug, sectors, exclude,
}: {
  countrySlug: string
  sectors: SectorCount[]
  exclude?: string
}) {
  const items = sectors.filter(s => s.listings > 0 && s.sector !== exclude && SECTOR_COUNTRY_COPY[s.sector])
  if (items.length === 0) return null
  return (
    <ul className="hm-cats-grid cdir-sector-grid">
      {items.map(s => {
        const copy = SECTOR_COUNTRY_COPY[s.sector]
        const ui = SECTOR_UI[s.sector]
        const count = `${s.listings.toLocaleString('en-US')} listing${s.listings === 1 ? '' : 's'}`
        return (
          <li key={s.sector} className="cdir-sector-li">
            <Link
              href={countrySectorPath(countrySlug, s.sector)}
              className="hm-cat-card cdir-sector-card"
              aria-label={`${copy.noun} - ${count}`}
            >
              <span
                className="hm-cat-card-ico"
                style={{ background: `${ui.accent}1F`, color: ui.accent }}
                aria-hidden="true"
              >
                <FontAwesomeIcon icon={ui.icon} />
              </span>
              <span className="hm-cat-card-body">
                <h3 className="hm-cat-card-name">{copy.noun}</h3>
                <span className="hm-cat-card-count">{count}</span>
              </span>
              <span className="hm-cat-card-arrow" aria-hidden="true">
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
