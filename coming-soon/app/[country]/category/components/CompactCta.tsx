import Link from '../../../components/CountryLink'
import { I, ic } from './icons'

type Props = { categoryName: string; spotsLeft: number; color: string }

export default function CompactCta({ categoryName, spotsLeft, color }: Props) {
  return (
    <div className="cd-cta-inline">
      <div className="cd-cta-inline-icon" style={{ background: `${color}0A` }}>
        <I d={ic.rocket} size={20} color={color} />
      </div>
      <p className="cd-cta-inline-text">
        <strong>{spotsLeft} spots left</strong> in {categoryName}. Lifetime — $239.
      </p>
      <Link
        href={`/business?category=${encodeURIComponent(categoryName)}`}
        className="cd-cta-inline-btn"
        style={{ background: color }}
      >
        Get Listed
      </Link>
    </div>
  )
}
