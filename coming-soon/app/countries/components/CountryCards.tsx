import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faEarthAmericas } from '@fortawesome/free-solid-svg-icons'
import { flagUrl } from '@/lib/country-paths'

/* Flag cards linking to a country page (hub or country + sector); the
   caller decides the href. */
export type CountryCardItem = {
  key: string
  name: string
  code: string
  href: string
  listings: number
}

function Flag({ code }: { code: string }) {
  const ok = /^[a-z]{2}$/i.test(code) && code.toUpperCase() !== 'XX'
  if (!ok) {
    return (
      <span className="cdir-cc-flag cdir-cc-flag--ph" aria-hidden="true">
        <FontAwesomeIcon icon={faEarthAmericas} />
      </span>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="cdir-cc-flag"
      src={flagUrl(code, 80)}
      srcSet={`${flagUrl(code, 80)} 1x, ${flagUrl(code, 160)} 2x`}
      width={44}
      height={33}
      alt=""
      loading="lazy"
      decoding="async"
    />
  )
}

export default function CountryCards({ items, compact = false }: { items: CountryCardItem[]; compact?: boolean }) {
  if (items.length === 0) return null
  return (
    <ul className={'cdir-cc-grid' + (compact ? ' cdir-cc-grid--compact' : '')}>
      {items.map(c => (
        <li key={c.key}>
          <Link href={c.href} className="cdir-cc">
            <Flag code={c.code} />
            <span className="cdir-cc-body">
              <h3 className="cdir-cc-name">{c.name}</h3>
              <span className="cdir-cc-count">
                {c.listings.toLocaleString('en-US')} listing{c.listings === 1 ? '' : 's'}
              </span>
            </span>
            <span className="cdir-cc-arrow" aria-hidden="true"><FontAwesomeIcon icon={faArrowRight} /></span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
