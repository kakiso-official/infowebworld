import Link from '../../../components/CountryLink'
import { I, ic, type IconKey } from './icons'
import type { Category } from '../../../iww-hq/data/category-storage'

export default function RelatedSidebar({ categories, color }: { categories: Category[]; color: string }) {
  if (!categories.length) return null
  return (
    <div className="cd-related-side">
      <div className="cd-related-side-header">
        <h3 className="cd-related-side-title">Related categories</h3>
        <Link href="/categories" className="cd-related-side-link">Show all</Link>
      </div>
      <div>
        {categories.slice(0, 5).map(rc => {
          const rcColor = rc.color || '#E8553D'
          return (
            <Link
              key={rc.id}
              href={`/category/${rc.slug}`}
              className="cd-related-side-item"
            >
              <div className="cd-related-side-icon" style={{ background: `${rcColor}10` }}>
                <I d={ic[rc.icon as IconKey] || ic.grid} size={16} color={rcColor} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="cd-related-side-name">{rc.name}</div>
                {rc.parentName && <div className="cd-related-side-parent">{rc.parentName}</div>}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
