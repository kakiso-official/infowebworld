'use client'
import Link from '../../../../components/CountryLink'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  StarIcon, RocketIcon, FlashIcon, GridIcon, LayerIcon,
  Building01Icon, UserGroupIcon, ChartIncreaseIcon, Award01Icon, EyeIcon, Shield01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons'
import SectorCard from './SectorCard'
import type { SectorDemo } from '../sector-demo-data'

const SEC_ICONS: Record<string, typeof StarIcon> = {
  rocket: RocketIcon, star: StarIcon, zap: FlashIcon,
  grid: GridIcon, trendingUp: ChartIncreaseIcon, users: UserGroupIcon,
  building: Building01Icon, layers: LayerIcon, award: Award01Icon,
  eye: EyeIcon, shield: Shield01Icon,
}

export default function SectorSection({
  title, subtitle, iconKey, viewAll, alt, children,
}: {
  title: string; subtitle?: string; iconKey: string
  viewAll?: string; alt?: boolean; children: React.ReactNode
}) {
  const icon = SEC_ICONS[iconKey] || GridIcon
  return (
    <div className={`sl-section${alt ? ' sl-section--alt' : ''}`}>
      <div className="sl-section-inner">
        <div className="sl-section-header">
          <div className="sl-section-left">
            <span className="sl-section-icon">
              <HugeiconsIcon icon={icon} size={20} color="var(--sl-color)" strokeWidth={2} />
            </span>
            <div>
              <h2 className="sl-section-title">{title}</h2>
              {subtitle && <p className="sl-section-sub">{subtitle}</p>}
            </div>
          </div>
          {viewAll && (
            <Link href={viewAll} className="sl-section-viewall">
              View All
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="currentColor" strokeWidth={2.5} />
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
