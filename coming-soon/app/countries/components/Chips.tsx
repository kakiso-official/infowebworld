import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import type { CategoryCount, CityCount } from '../country-data'
import { categoryInCountryPath } from '../seo'

/* Category chips → the category page filtered to this country
   (/{sector directory}/{category}?country={country}). */
export function CategoryChips({
  categories, countrySlug, label,
}: {
  categories: CategoryCount[]
  countrySlug: string
  /** Small group label above the chips (e.g. "Subcategories"). */
  label?: string
}) {
  if (categories.length === 0) return null
  return (
    <div className="cdir-chip-group">
      {label ? <p className="cdir-chip-label">{label}</p> : null}
      <ul className="cdir-chips">
        {categories.map(c => (
          <li key={c.id}>
            <Link href={categoryInCountryPath(c.sector, c.slug, countrySlug)} className="cdir-chip cdir-chip--link">
              <span className="cdir-chip-name">{c.name}</span>
              <span className="cdir-chip-n">{c.listings.toLocaleString('en-US')}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* Popular cities - plain chips (no city pages exist, so no links). */
export function CityChips({ cities }: { cities: CityCount[] }) {
  if (cities.length === 0) return null
  return (
    <ul className="cdir-chips cdir-chips--cities">
      {cities.map(c => (
        <li key={c.city} className="cdir-chip">
          <span className="cdir-chip-ico" aria-hidden="true"><FontAwesomeIcon icon={faLocationDot} /></span>
          <span className="cdir-chip-name">{c.city}</span>
          <span className="cdir-chip-n">{c.listings.toLocaleString('en-US')}</span>
        </li>
      ))}
    </ul>
  )
}
