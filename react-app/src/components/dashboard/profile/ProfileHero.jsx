export default function ProfileHero() {
  return (
    <div className="db-profile-hero">
      <div className="db-profile-avatar-lg">AP</div>
      <div className="db-profile-info">
        <div className="db-profile-name">CloudGuard Technologies</div>
        <div className="db-profile-email">contact@cloudguard.tech &middot; San Francisco, CA</div>
        <div className="db-profile-badges">
          <span className="db-badge-pill db-badge--active">Verified</span>
          <span className="db-badge-pill db-badge--neutral">Pro Plan</span>
          <span className="db-badge-pill db-badge--pending">Featured</span>
        </div>
      </div>
      <button className="db-btn db-btn--outline">View Public Listing</button>
    </div>
  )
}
