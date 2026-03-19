import { Link } from 'react-router-dom'
import { LISTING } from '../../../data/dashboard/listingData'

export default function ListingHero() {
  return (
    <div className="db-card db-full" style={{ marginBottom: 20 }}>
      <div className="db-card-body" style={{ padding: 0 }}>
        <div className="dbl-hero">
          <div className="dbl-hero-left">
            <div className="dbl-hero-avatar" style={{ background: `linear-gradient(135deg, ${LISTING.color}, ${LISTING.color}88)` }}>
              {LISTING.logo}
            </div>
            <div className="dbl-hero-info">
              <div className="dbl-hero-name">
                {LISTING.name}
                <span className="db-badge-pill db-badge--active">
                  <svg viewBox="0 0 24 24" style={{ width: 10, height: 10, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
                  Active
                </span>
              </div>
              <div className="dbl-hero-tagline">{LISTING.tagline}</div>
              <div className="dbl-hero-meta">
                <span className="dbl-hero-meta-item">
                  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                  {LISTING.category}
                </span>
                <span className="dbl-hero-meta-item">
                  <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                  {LISTING.url}
                </span>
                <span className="dbl-hero-meta-item">
                  <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {LISTING.rating} ({LISTING.reviews} reviews)
                </span>
              </div>
              <div className="dbl-hero-badges">
                {LISTING.verified && <span className="db-badge-pill db-badge--active">Verified</span>}
                <span className="db-badge-pill db-badge--neutral">{LISTING.plan} Plan</span>
                {LISTING.featured && <span className="db-badge-pill db-badge--pending">Featured</span>}
                <span className="dbl-hero-date">Listed {LISTING.createdAt} · Updated {LISTING.lastUpdated}</span>
              </div>
            </div>
          </div>
          <div className="dbl-hero-actions">
            <Link to="/listing" className="db-btn db-btn--outline" target="_blank">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview Listing
            </Link>
            <Link to="/dashboard/listing/create" className="db-btn db-btn--primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Create New Listing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
