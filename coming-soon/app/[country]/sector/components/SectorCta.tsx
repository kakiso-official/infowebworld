'use client'
import Link from '../../../components/CountryLink'
import { HugeiconsIcon } from '@hugeicons/react'
import { RocketIcon, ArrowRight01Icon, Shield01Icon } from '@hugeicons/core-free-icons'

type Props = {
  shortName: string
  color: string
}

export default function SectorCta({ shortName, color }: Props) {
  return (
    <div className="sl-cta">
      <div className="sl-cta-inner">
        <div className="sl-cta-icon">
          <HugeiconsIcon icon={RocketIcon} size={28} color={color} strokeWidth={2} />
        </div>
        <h2 className="sl-cta-title">List Your {shortName} Business on InfoWebWorld</h2>
        <p className="sl-cta-desc">Join hundreds of companies already growing with verified reviews, SEO backlinks and qualified leads.</p>
        <div className="sl-cta-row">
          <Link href="/business" className="sl-cta-btn">
            Get Listed
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="#fff" strokeWidth={2.5} />
          </Link>
          <span className="sl-cta-note">
            <HugeiconsIcon icon={Shield01Icon} size={14} color={color} strokeWidth={2} />
            Free to list &middot; Premium plans from $99/yr
          </span>
        </div>
      </div>
    </div>
  )
}
