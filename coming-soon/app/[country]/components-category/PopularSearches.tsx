import Link from '../../components/CountryLink'
import { I, ic } from './icons'

type Pill = { name: string; href: string }

export default function PopularSearches({ searches }: { searches: Pill[] }) {
  if (!searches.length) return null
  return (
    <div className="cd-popular">
      <h3 className="cd-popular-title">Popular searches</h3>
      <div className="cd-popular-pills">
        {searches.map((pill, i) => (
          <Link
            key={i}
            href={pill.href}
            className="cd-popular-pill"
          >
            <I d={ic.search} size={12} color="currentColor" sw={2} />
            {pill.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
