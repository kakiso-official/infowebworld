import Link from '../../../components/CountryLink'
import { I, ic, type IconKey } from './icons'
import Stars from './Stars'
import type { RealSubmission } from '../../../iww-hq/data/submissions-storage'

/* ── Demo listing type ── */
export type DemoListing = {
  name: string; tagline: string
  logoIcon: string; logoColor: string
  score: string; stars: number; reviews: string
  cat: string; listingType: string; verified: boolean
  features: string[]
  website: string
  tags: string[]
}

/* ── Demo card ── */
export function DemoListingCard({ item, isPreview }: { item: DemoListing; isPreview: boolean }) {
  return (
    <div className="cd-listing">
      <div className="cd-listing-inner">
        {/* Logo */}
        <div className="cd-listing-logo" style={{ background: `${item.logoColor}10` }}>
          <I d={ic[item.logoIcon as IconKey] || ic.grid} size={24} color={item.logoColor} />
        </div>

        {/* Content */}
        <div className="cd-listing-body">
          <div className="cd-listing-top">
            <div>
              <h3 className="cd-listing-name">{item.name}</h3>
              <a href={item.website} target="_blank" rel="noopener noreferrer" className="cd-listing-url">
                {item.website === '#' ? `${item.name.toLowerCase().replace(/\s+/g, '')}.com` : item.website}
              </a>
            </div>
            {isPreview && (
              <span className="cd-listing-preview">
                <I d={ic.eye} size={9} color="var(--h-muted)" sw={2} /> Preview
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="cd-listing-rating">
            <Stars rating={item.stars} size={16} />
            <span className="cd-listing-score">{item.score}</span>
            <span className="cd-listing-reviews-sep">&middot;</span>
            <span className="cd-listing-reviews">{item.reviews} reviews</span>
          </div>

          {/* Tagline */}
          <p className="cd-listing-tagline">{item.tagline}</p>

          {/* Tags */}
          <div className="cd-listing-tags">
            <span className="cd-listing-tag">{item.cat}</span>
            <span className="cd-listing-tag">{item.listingType}</span>
            {item.verified && (
              <span className="cd-listing-tag cd-listing-tag--verified">Verified</span>
            )}
            {item.features.slice(0, 2).map((f, i) => (
              <span key={i} className="cd-listing-tag cd-listing-tag--feat">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Real card ── */
export function RealListingCard({ item, color }: { item: RealSubmission; color: string }) {
  const initial = item.companyName.charAt(0).toUpperCase()
  const itemColor = item.categoryColor || color

  return (
    <div className="cd-listing">
      <div className="cd-listing-inner">
        {/* Logo */}
        {item.logoUrl ? (
          <div className="cd-listing-logo">
            <img src={item.logoUrl} alt={item.companyName} />
          </div>
        ) : (
          <div className="cd-listing-logo" style={{ background: `${itemColor}14` }}>
            <span style={{ fontFamily: 'var(--font-bricolage), sans-serif', fontWeight: 800, fontSize: '1.1rem', color: itemColor }}>{initial}</span>
          </div>
        )}

        {/* Content */}
        <div className="cd-listing-body">
          <div className="cd-listing-top">
            <div>
              <Link href={`/company/${item.slug}`} className="cd-listing-name">
                {item.companyName}
              </Link>
              {item.website && (
                <a href={item.website} target="_blank" rel="noopener noreferrer" className="cd-listing-url">
                  {item.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a>
              )}
            </div>
            {(item.city || item.country) && (
              <span className="cd-listing-location">
                {[item.city, item.state, item.country].filter(Boolean).join(', ')}
              </span>
            )}
          </div>

          {/* Tagline */}
          {item.tagline && <p className="cd-listing-tagline">{item.tagline}</p>}

          {/* Tags */}
          <div className="cd-listing-tags">
            <span className="cd-listing-tag">{item.category}</span>
            {item.listingType && (
              <span className="cd-listing-tag">{item.listingType}</span>
            )}
            {item.status === 'active' && (
              <span className="cd-listing-tag cd-listing-tag--verified">Verified</span>
            )}
            {item.features.slice(0, 3).map((f, i) => (
              <span key={i} className="cd-listing-tag cd-listing-tag--feat">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
