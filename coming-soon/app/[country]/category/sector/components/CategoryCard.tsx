'use client'
import Link from '../../../../components/CountryLink'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import HIcon from './HIcon'

type Props = {
  cat: { name: string; slug: string; listingCount: number; childCount: number; icon?: string }
  color: string
}

export default function CategoryCard({ cat, color }: Props) {
  return (
    <Link href={`/category/${cat.slug}`} className="sl-cat">
      <div className="sl-cat-icon" style={{ background: `${color}14` }}>
        <HIcon name={cat.icon || 'grid'} size={22} color={color} />
      </div>
      <div className="sl-cat-body">
        <h3 className="sl-cat-name">{cat.name}</h3>
        <span className="sl-cat-meta">{cat.childCount} subcategories</span>
      </div>
      <HugeiconsIcon icon={ArrowRight01Icon} size={16} color={color} strokeWidth={2} className="sl-cat-arrow" />
    </Link>
  )
}
