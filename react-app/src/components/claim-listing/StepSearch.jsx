import { useState } from 'react'
import { Link } from 'react-router-dom'

const SAMPLE_LISTINGS = [
  { name: 'CloudGuard Technologies', tagline: 'Enterprise-grade cloud security & compliance platform', category: 'Cybersecurity', rating: 4.8, reviews: 127, logo: 'CG', color: '#6C72F1', url: 'cloudguard.io', location: 'San Francisco, CA' },
  { name: 'DataPulse Analytics', tagline: 'Real-time business intelligence & data visualization', category: 'Analytics', rating: 4.6, reviews: 89, logo: 'DP', color: '#2FAE6A', url: 'datapulse.io', location: 'New York, NY' },
  { name: 'NexaPay Solutions', tagline: 'Next-gen payment processing for modern businesses', category: 'FinTech', rating: 4.5, reviews: 64, logo: 'NP', color: '#3B82F6', url: 'nexapay.com', location: 'Austin, TX' },
]

export default function StepSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = () => { if (query.trim().length > 0) setSearched(true) }

  const filtered = searched
    ? SAMPLE_LISTINGS.filter(l =>
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.url.toLowerCase().includes(query.toLowerCase()) ||
        l.category.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase() === 'cloud' || query.trim().length > 0
      )
    : []

  const results = filtered.length > 0 ? filtered : searched ? SAMPLE_LISTINGS.slice(0, 1) : []

  return (
    <div className="cl-step-content">
      <div className="cl-card">
        <div className="cl-card-header">
          <div className="cl-card-icon" style={{ background: 'rgba(108,114,241,.08)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <div>
            <h3>Find Your Business</h3>
            <p>Search by business name, domain, or category to find your listing</p>
          </div>
        </div>

        {/* Search */}
        <div className="cl-search-box">
          <div className="cl-search-input-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              className="cl-search-input"
              type="text"
              placeholder="e.g., CloudGuard Technologies, cloudguard.io, cybersecurity..."
              value={query}
              onChange={e => { setQuery(e.target.value); if (!e.target.value) setSearched(false) }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            {query && (
              <button className="cl-search-clear" onClick={() => { setQuery(''); setSearched(false) }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
          <button className="cl-search-btn" onClick={handleSearch}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Search Listings
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div className="cl-results">
            <div className="cl-results-header">
              <span className="cl-results-count">{results.length} listing{results.length !== 1 ? 's' : ''} found</span>
              <span className="cl-results-hint">Select your business below</span>
            </div>

            {results.map((listing, idx) => (
              <div key={idx} className="cl-result-card">
                <div className="cl-result-top">
                  <div className="cl-result-logo" style={{ background: `linear-gradient(135deg, ${listing.color}, ${listing.color}88)` }}>
                    {listing.logo}
                  </div>
                  <div className="cl-result-info">
                    <div className="cl-result-name">
                      {listing.name}
                      <span className="cl-result-unclaimed">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        Unclaimed
                      </span>
                    </div>
                    <div className="cl-result-tagline">{listing.tagline}</div>
                    <div className="cl-result-meta">
                      <span className="cl-result-badge cl-result-badge--cat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                        {listing.category}
                      </span>
                      <span className="cl-result-badge cl-result-badge--loc">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {listing.location}
                      </span>
                      <span className="cl-result-badge cl-result-badge--url">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                        {listing.url}
                      </span>
                    </div>
                  </div>
                  <div className="cl-result-rating">
                    <div className="cl-result-score">{listing.rating}</div>
                    <div className="cl-result-stars">
                      {[1, 2, 3, 4, 5].map(s => (
                        <svg key={s} viewBox="0 0 24 24" fill={s <= Math.round(listing.rating) ? 'var(--amber)' : 'var(--gray-200)'} stroke="none">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                    <div className="cl-result-reviews">{listing.reviews} reviews</div>
                  </div>
                </div>

                <div className="cl-result-preview">
                  <div className="cl-result-preview-label">Current listing status</div>
                  <div className="cl-result-preview-items">
                    <div className="cl-result-preview-item cl-result-preview-item--ok">
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      Basic business information
                    </div>
                    <div className="cl-result-preview-item cl-result-preview-item--ok">
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      {listing.reviews} verified user reviews
                    </div>
                    <div className="cl-result-preview-item cl-result-preview-item--missing">
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      No owner response to reviews
                    </div>
                    <div className="cl-result-preview-item cl-result-preview-item--missing">
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Missing contact details & hours
                    </div>
                  </div>
                </div>

                <button className="cl-claim-btn" onClick={() => onSelect(listing)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Claim This Listing
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            ))}

            <div className="cl-not-found">
              <p>Can't find your business?</p>
              <Link to="/submit-listing" className="cl-not-found-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                Submit a New Listing Instead
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
