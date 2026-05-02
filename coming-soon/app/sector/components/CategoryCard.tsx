'use client'
import Link from 'next/link'
import { I, ic } from '../../components/icons'
import HIcon from './HIcon'

type Props = {
  cat: { name: string; slug: string; listingCount: number; childCount: number; icon?: string }
  color: string
  sectorSlug?: string
}

export default function CategoryCard({ cat, color, sectorSlug }: Props) {
  return (
    <Link href={sectorSlug ? `/${sectorSlug}/${cat.slug}` : `/${cat.slug}`} className="sl-cat">
      <div className="sl-cat-icon" style={{ background: `${color}14` }}>
        <HIcon name={cat.icon || 'grid'} size={22} color={color} />
      </div>
      <div className="sl-cat-body">
        <h3 className="sl-cat-name">{cat.name}</h3>
        <span className="sl-cat-meta">{cat.childCount} subcategories</span>
      </div>
      <I d={ic.arrow} size={16} color={color} sw={2} />
    </Link>
  )
}
