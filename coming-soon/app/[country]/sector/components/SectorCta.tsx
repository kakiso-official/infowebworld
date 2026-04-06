'use client'
import Link from '../../../components/CountryLink'
import { I, ic } from '../../../components/icons'

type Props = {
  shortName: string
  color: string
}

export default function SectorCta({ shortName, color }: Props) {
  return (
    <div className="sl-cta">
      <div className="sl-cta-inner">
        <div className="sl-cta-icon">
          <I d={ic.rocket} size={28} color={color} sw={2} />
        </div>
        <h2 className="sl-cta-title">List Your {shortName} Business on InfoWebWorld</h2>
        <p className="sl-cta-desc">Join hundreds of companies already growing with verified reviews, SEO backlinks and qualified leads.</p>
        <div className="sl-cta-row">
          <Link href="/business" className="sl-cta-btn">
            Get Listed
            <I d={ic.arrow} size={16} color="#fff" sw={2.5} />
          </Link>
          <span className="sl-cta-note">
            <I d={ic.shield} size={14} color={color} sw={2} />
            Free to list &middot; Premium plans from $99/yr
          </span>
        </div>
      </div>
    </div>
  )
}
