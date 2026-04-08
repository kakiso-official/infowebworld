'use client'
import { useState } from 'react'
import Link from '../../components/CountryLink'
import { I, ic } from '../../components/icons'

type Sub = { id: string; slug: string; name: string; listingCount: number }

const PREVIEW = 8

export default function SubcategoryChips({ subcategories, sectorSlug }: { subcategories: Sub[]; sectorSlug?: string }) {
  const [expanded, setExpanded] = useState(false)
  if (!subcategories.length) return null

  const sp = sectorSlug ? `/${sectorSlug}` : ''
  const hasMore = subcategories.length > PREVIEW
  const visible = expanded ? subcategories : subcategories.slice(0, PREVIEW)

  return (
    <div className="cd-subcats">
      <div className="cd-subcats-header">
        <h3 className="cd-subcats-title">
          <I d={ic.grid} size={14} color="var(--cd-color, var(--h-accent))" sw={2} />
          Subcategories
          <span className="cd-subcats-badge">{subcategories.length}</span>
        </h3>
        {hasMore && (
          <button className="cd-subcats-toggle" onClick={() => setExpanded(!expanded)} type="button">
            {expanded ? 'Show less' : `View all ${subcategories.length}`}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: 'transform .2s', transform: expanded ? 'rotate(180deg)' : 'none' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}
      </div>
      <div className={`cd-subcats-grid${expanded ? ' cd-subcats-grid--expanded' : ''}`}>
        {visible.map(sc => (
          <Link key={sc.id} href={`${sp}/${sc.slug}`} className="cd-subcat-item">
            <span className="cd-subcat-name">{sc.name}</span>
            <span className="cd-subcat-meta">
              {sc.listingCount > 0 && <span className="cd-subcat-count">{sc.listingCount}</span>}
              <I d={ic.arrow} size={11} color="var(--cd-color, var(--h-accent))" sw={2} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
