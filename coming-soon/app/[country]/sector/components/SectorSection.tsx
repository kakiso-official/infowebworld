'use client'
import Link from '../../../components/CountryLink'
import { I, ic, getIconPath } from '../../../components/icons'
import SectorCard from './SectorCard'
import type { SectorDemo } from '../sector-demo-data'

const SEC_ICONS: Record<string, string> = {
  rocket: 'rocket', star: 'star', zap: 'zap',
  grid: 'grid', trendingUp: 'trendingUp', users: 'users',
  building: 'building', layers: 'layers', award: 'award',
  eye: 'eye', shield: 'shield',
}

export default function SectorSection({
  title, subtitle, iconKey, viewAll, alt, children,
}: {
  title: string; subtitle?: string; iconKey: string
  viewAll?: string; alt?: boolean; children: React.ReactNode
}) {
  const iconName = SEC_ICONS[iconKey] || 'grid'
  return (
    <div className={`sl-section${alt ? ' sl-section--alt' : ''}`}>
      <div className="sl-section-inner">
        <div className="sl-section-header">
          <div className="sl-section-left">
            <span className="sl-section-icon">
              <I d={getIconPath(iconName)} size={20} color="var(--sl-color)" sw={2} />
            </span>
            <div>
              <h2 className="sl-section-title">{title}</h2>
              {subtitle && <p className="sl-section-sub">{subtitle}</p>}
            </div>
          </div>
          {viewAll && (
            <Link href={viewAll} className="sl-section-viewall">
              View All
              <I d={ic.arrow} size={14} color="currentColor" sw={2.5} />
            </Link>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}

export function CardGrid({ items, ranked }: { items: SectorDemo[]; ranked?: boolean }) {
  return (
    <div className="sl-grid">
      {items.map((item, i) => (
        <SectorCard key={item.id} item={item} rank={ranked ? i + 1 : undefined} />
      ))}
    </div>
  )
}
