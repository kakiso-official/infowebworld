'use client'
import Link from 'next/link'
import { I, ic } from '../../components/icons'
import HIcon from './HIcon'
import Stars from '../../components-category/Stars'
import type { SectorDemo } from '../sector-demo-data'

export default function SectorCard({ item, rank }: { item: SectorDemo; rank?: number }) {
  return (
    <div className="sl-card">
      {rank && <span className="sl-card-rank">#{rank}</span>}

      <div className="sl-card-logo" style={{ background: `${item.color}14` }}>
        <HIcon name={item.icon} size={26} color={item.color} />
      </div>

      <div className="sl-card-rating">
        <span className="sl-card-score">{item.score.toFixed(1)}</span>
        <Stars rating={Math.round(item.score)} size={14} />
        <span className="sl-card-reviews">({item.reviews})</span>
      </div>

      <h3 className="sl-card-name">{item.name}</h3>
      <p className="sl-card-tagline">{item.tagline}</p>

      <div className="sl-card-pills">
        <span className="sl-card-pill" style={{ borderColor: `${item.color}40`, color: item.color }}>{item.category}</span>
        <span className="sl-card-pill sl-card-pill--muted">{item.type}</span>
      </div>

      {item.badges.includes('verified') && (
        <div className="sl-card-badges">
          <span className="sl-card-badge sl-card-badge--verified">
            <I d={ic.check} size={10} color="#2FAE6A" sw={3} /> Verified
          </span>
          {item.badges.includes('new') && <span className="sl-card-badge sl-card-badge--new">New</span>}
          {item.badges.includes('featured') && (
            <span className="sl-card-badge sl-card-badge--featured">
              <I d={ic.award} size={10} color="#F59E0B" sw={2} /> Featured
            </span>
          )}
          {item.badges.includes('trending') && (
            <span className="sl-card-badge sl-card-badge--trending">
              <I d={ic.trendingUp} size={10} color="#E8553D" sw={2.5} /> Trending
            </span>
          )}
        </div>
      )}

      <Link href="/business" className="sl-card-cta" style={{ color: item.color }}>
        Learn More
        <I d={ic.arrow} size={14} color={item.color} sw={2.5} />
      </Link>
    </div>
  )
}
