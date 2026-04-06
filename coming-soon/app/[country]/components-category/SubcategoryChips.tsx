import Link from '../../components/CountryLink'
import { I, ic } from '../../components/icons'

type Sub = { id: string; slug: string; name: string; listingCount: number }

export default function SubcategoryChips({ subcategories, sectorSlug }: { subcategories: Sub[]; sectorSlug?: string }) {
  if (!subcategories.length) return null
  const sp = sectorSlug ? `/${sectorSlug}` : ''
  return (
    <nav className="cd-subcats" aria-label="Subcategories">
      <div className="cd-subcats-list">
        {subcategories.map(sc => (
          <Link
            key={sc.id}
            href={`${sp}/${sc.slug}`}
            className="cd-subcat-chip"
          >
            <span className="cd-subcat-name">{sc.name}</span>
            {sc.listingCount > 0 && (
              <span className="cd-subcat-count">{sc.listingCount}</span>
            )}
            <I d={ic.arrow} size={12} color="currentColor" sw={2} />
          </Link>
        ))}
      </div>
    </nav>
  )
}
