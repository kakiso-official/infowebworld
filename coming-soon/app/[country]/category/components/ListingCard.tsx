'use client'
import { useState } from 'react'
import Link from '../../../components/CountryLink'
import { I, ic, type IconKey } from './icons'
import Stars from './Stars'
import type { RealSubmission } from '../../../iww-hq/data/submissions-storage'

/* ── Demo listing type ── */
export type DemoListing = {
  name: string; tagline: string; description?: string
  logoIcon: string; logoColor: string
  score: string; stars: number; reviews: string
  cat: string; listingType: string; verified: boolean
  features: string[]
  website: string
  tags: string[]
}

/* ── Shared action buttons ── */
function CardActions({ website, name, color }: { website: string; name: string; color: string }) {
  const [saved, setSaved] = useState(false)
  return (
    <div className="cd-lc-actions">
      <a
        href={website === '#' ? `https://${name.toLowerCase().replace(/\s+/g, '')}.com` : website}
        target="_blank"
        rel="noopener noreferrer"
        className="cd-lc-visit"
        style={{ background: color }}
      >
        VISIT WEBSITE
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><path d="M15 3h6v6" /><path d="M10 14L21 3" /></svg>
      </a>
      <div className="cd-lc-secondary">
        <button className="cd-lc-btn-outline" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
          Compare
        </button>
        <button
          className={`cd-lc-btn-outline cd-lc-btn-save${saved ? ' cd-lc-btn-save--active' : ''}`}
          type="button"
          onClick={() => setSaved(!saved)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? '#E8553D' : 'none'} stroke={saved ? '#E8553D' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
          Save
        </button>
      </div>
    </div>
  )
}

/* ── Demo card ── */
export function DemoListingCard({ item, isPreview }: { item: DemoListing; isPreview: boolean }) {
  const desc = item.description || item.tagline
  const displayUrl = item.website === '#' ? `${item.name.toLowerCase().replace(/\s+/g, '')}.com` : item.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

  return (
    <div className="cd-lc">
      {/* ── Header row: logo + info + actions ── */}
      <div className="cd-lc-header">
        <div className="cd-lc-logo" style={{ background: `${item.logoColor}12` }}>
          <I d={ic[item.logoIcon as IconKey] || ic.grid} size={28} color={item.logoColor} />
        </div>

        <div className="cd-lc-info">
          <div className="cd-lc-name-row">
            <h3 className="cd-lc-name">
              {item.name}
              <svg className="cd-lc-ext-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><path d="M15 3h6v6" /><path d="M10 14L21 3" /></svg>
            </h3>
            {isPreview && (
              <span className="cd-lc-badge-preview">
                <I d={ic.eye} size={9} color="var(--h-muted)" sw={2} /> Preview
              </span>
            )}
          </div>

          <div className="cd-lc-rating-row">
            <span className="cd-lc-score">{item.score}</span>
            <Stars rating={item.stars} size={16} />
            <span className="cd-lc-reviews">({item.reviews})</span>
          </div>

          <p className="cd-lc-subtitle">{item.tagline}</p>
        </div>

        <CardActions website={item.website} name={item.name} color={item.logoColor} />
      </div>

      {/* ── Description ── */}
      <div className="cd-lc-desc-section">
        <p className="cd-lc-desc">{desc}</p>
        <a href="#" className="cd-lc-readmore">Read more about {item.name}</a>
      </div>

      {/* ── Tags / features ── */}
      <div className="cd-lc-tags-row">
        <span className="cd-lc-tag">{item.cat}</span>
        <span className="cd-lc-tag">{item.listingType}</span>
        {item.verified && <span className="cd-lc-tag cd-lc-tag--verified">Verified</span>}
        {item.features.slice(0, 2).map((f, i) => (
          <span key={i} className="cd-lc-tag cd-lc-tag--feat">{f}</span>
        ))}
      </div>
    </div>
  )
}

/* ── Real card ── */
export function RealListingCard({ item, color }: { item: RealSubmission; color: string }) {
  const initial = item.companyName.charAt(0).toUpperCase()
  const itemColor = item.categoryColor || color
  const desc = item.description || item.tagline || ''
  const displayUrl = item.website ? item.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : ''

  return (
    <div className="cd-lc">
      {/* ── Header row: logo + info + actions ── */}
      <div className="cd-lc-header">
        {item.logoUrl ? (
          <div className="cd-lc-logo">
            <img src={item.logoUrl} alt={item.companyName} />
          </div>
        ) : (
          <div className="cd-lc-logo" style={{ background: `${itemColor}12` }}>
            <span className="cd-lc-logo-initial" style={{ color: itemColor }}>{initial}</span>
          </div>
        )}

        <div className="cd-lc-info">
          <div className="cd-lc-name-row">
            <h3 className="cd-lc-name">
              <Link href={`/company/${item.slug}`}>{item.companyName}</Link>
              <svg className="cd-lc-ext-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><path d="M15 3h6v6" /><path d="M10 14L21 3" /></svg>
            </h3>
            {(item.city || item.country) && (
              <span className="cd-lc-location">
                <I d={ic.mapPin} size={11} color="var(--h-muted)" sw={2} />
                {[item.city, item.state, item.country].filter(Boolean).join(', ')}
              </span>
            )}
          </div>

          <div className="cd-lc-rating-row">
            <span className="cd-lc-score">4.5</span>
            <Stars rating={4} size={16} />
            <span className="cd-lc-reviews">(0)</span>
          </div>

          <p className="cd-lc-subtitle">{item.tagline}</p>
        </div>

        <CardActions website={item.website || '#'} name={item.companyName} color={itemColor} />
      </div>

      {/* ── Description ── */}
      {desc && (
        <div className="cd-lc-desc-section">
          <p className="cd-lc-desc">{desc}</p>
          <Link href={`/company/${item.slug}`} className="cd-lc-readmore">Read more about {item.companyName}</Link>
        </div>
      )}

      {/* ── Tags ── */}
      <div className="cd-lc-tags-row">
        <span className="cd-lc-tag">{item.category}</span>
        {item.listingType && <span className="cd-lc-tag">{item.listingType}</span>}
        {item.status === 'active' && <span className="cd-lc-tag cd-lc-tag--verified">Verified</span>}
        {item.features.slice(0, 3).map((f, i) => (
          <span key={i} className="cd-lc-tag cd-lc-tag--feat">{f}</span>
        ))}
      </div>
    </div>
  )
}
