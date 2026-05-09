'use client'

import { useMemo, useState } from 'react'
import type { ListingMode } from '../types'

/* ──────────────────────────────────────────────────────────────────────
   Listing-mode pick — the second entry-point hero, shown after the
   sector pick and before the rail/form. Asks whether the user is
   listing the COMPANY/ENTITY itself, or one of its specific
   OFFERINGS (a product, tool, service, etc.).

   Pill labels and subhead adapt to the L1 sector picked in the
   previous hero — "AI Tool" instead of "Product Listing" for an AI
   company, "Service" for an agency, "Startup" instead of "Company"
   for the entity side, etc. Underlying value stays 'company' |
   'product' so downstream form code doesn't have to branch on every
   sector — only the displayed wording changes.

   Same visual rhythm as SectorPickHero (centered title + subhead +
   pills, mascot bottom corner) but the mascot lives bottom-LEFT here
   so successive heroes don't feel identical. Image is a different
   pose of the same mascot for visual continuity.
   ────────────────────────────────────────────────────────────────────── */

type Props = {
  /** Picked sector from the previous hero — drives pill / subhead wording. */
  sector: { id: string; slug: string; name: string } | null
  onPick: (mode: 'company' | 'product') => void
}

/* Per-sector wording. Keyed by L1 slug. The `value` on each pill is
   ALWAYS 'company' or 'product' — only the label changes. Unknown
   slugs fall back to the generic copy at the bottom. */
type SectorCopy = {
  companyLabel: string
  productLabel: string
  subhead: string
}
const COPY_BY_SLUG: Record<string, SectorCopy> = {
  'artificial-intelligence-ml': {
    companyLabel: 'AI Company',
    productLabel: 'AI Tool',
    subhead: 'Are you listing an AI company, or one of the tools they\u2019ve built?',
  },
  'software-saas': {
    companyLabel: 'Company',
    productLabel: 'Product',
    subhead: 'Are you listing a software company, or one of their products?',
  },
  'industry-specific-software': {
    companyLabel: 'Company',
    productLabel: 'Software',
    subhead: 'Are you listing the software company, or one of their software products?',
  },
  'it-services-agencies': {
    companyLabel: 'Agency',
    productLabel: 'Service',
    subhead: 'Are you listing the agency itself, or one specific service they offer?',
  },
  'startups-innovation': {
    companyLabel: 'Startup',
    productLabel: 'Product',
    subhead: 'Are you listing the startup, or one of the products they\u2019re building?',
  },
  'local-businesses': {
    companyLabel: 'Business',
    productLabel: 'Service',
    subhead: 'Are you listing the business itself, or one specific service they offer?',
  },
  'professional-services': {
    companyLabel: 'Firm',
    productLabel: 'Service',
    subhead: 'Are you listing the firm itself, or one specific service they offer?',
  },
  'local-professional-services': {
    companyLabel: 'Business',
    productLabel: 'Service',
    subhead: 'Are you listing the business or firm, or one specific service they offer?',
  },
}

const DEFAULT_COPY: SectorCopy = {
  companyLabel: 'Company',
  productLabel: 'Product',
  subhead: 'Are you putting up the company itself, or one specific offering?',
}

export default function ListingModePickHero({ sector, onPick }: Props) {
  const [picking, setPicking] = useState<ListingMode>('')

  const copy = useMemo<SectorCopy>(() => {
    if (sector?.slug && COPY_BY_SLUG[sector.slug]) return COPY_BY_SLUG[sector.slug]
    return DEFAULT_COPY
  }, [sector?.slug])

  const options: { value: 'company' | 'product'; label: string }[] = useMemo(() => ([
    { value: 'company', label: copy.companyLabel },
    { value: 'product', label: copy.productLabel },
  ]), [copy])

  const handlePick = (mode: 'company' | 'product') => {
    if (picking) return
    setPicking(mode)
    setTimeout(() => onPick(mode), 220)
  }

  return (
    <div className="df-spk df-spk--left">
      <div className="df-spk-copy">
        <h1 className="df-spk-title">What are you listing?</h1>
        <p className="df-spk-sub">{copy.subhead}</p>
      </div>

      <div className="df-spk-pills" role="list">
        {options.map(opt => {
          const isPick = picking === opt.value
          const isFade = picking !== '' && picking !== opt.value
          return (
            <button
              key={opt.value}
              type="button"
              role="listitem"
              className={
                'df-spk-pill' +
                (isPick ? ' is-pick' : '') +
                (isFade ? ' is-fade' : '')
              }
              onClick={() => handlePick(opt.value)}
              disabled={picking !== ''}
              aria-label={`Pick ${opt.label}`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      <div className="df-spk-mascot-wrap df-spk-mascot-wrap--left">
        <img
          src="/illustrations/welcome-mascot-2.png"
          alt=""
          className="df-spk-mascot df-spk-mascot--left"
          draggable={false}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>
    </div>
  )
}
