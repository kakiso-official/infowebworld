import Link from '../../../components/CountryLink'

type Sub = { id: string; slug: string; name: string; listingCount: number }

export default function SubcategoryChips({ subcategories }: { subcategories: Sub[] }) {
  if (!subcategories.length) return null
  return (
    <div className="cd-subcats">
      <h3 className="cd-subcats-label">Subcategories</h3>
      <div className="cd-subcats-list">
        {subcategories.map(sc => (
          <Link
            key={sc.id}
            href={`/category/${sc.slug}`}
            className="cd-subcat-chip"
          >
            {sc.name}
            {sc.listingCount > 0 && <span style={{ opacity: .5, marginLeft: '.25rem' }}>({sc.listingCount})</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}
