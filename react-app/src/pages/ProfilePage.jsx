import { Link } from 'react-router-dom'
import SharedLayout from '../components/shared/SharedLayout'
import '../styles/dashboard.css'

const savedBusinesses = [
  { name: 'CloudGuard Technologies', category: 'Technology', rating: 4.8, reviews: 342, gradient: 'linear-gradient(135deg,var(--coral),var(--amber))' },
  { name: 'TasteWise AI', category: 'Food & Dining', rating: 4.6, reviews: 189, gradient: 'linear-gradient(135deg,var(--amber),var(--coral))' },
  { name: 'LexFlow Legal', category: 'Legal', rating: 4.7, reviews: 256, gradient: 'linear-gradient(135deg,var(--plum),var(--rose))' },
  { name: 'UpSkill HQ', category: 'Education', rating: 4.5, reviews: 412, gradient: 'linear-gradient(135deg,var(--azure),var(--accent))' },
]

const myReviews = [
  { business: 'Remotely.io', rating: 5, text: 'Best remote work platform we\'ve ever used. The AI meeting assistant is a game-changer.', date: 'Mar 12, 2026' },
  { business: 'EmbeddPay', rating: 4, text: 'Great embedded finance solution. Integration was smooth and their support team is excellent.', date: 'Mar 8, 2026' },
  { business: 'PropView Analytics', rating: 5, text: 'Their AI valuations are incredibly accurate. Saved us thousands on property assessments.', date: 'Feb 28, 2026' },
]

export default function ProfilePage() {
  return (
    <SharedLayout>
      <div style={{ background: 'var(--gray-50)', minHeight: '80vh' }}>
        <div className="s-container" style={{ padding: '32px 0' }}>
          {/* Profile Header */}
          <div className="db-profile-hero">
            <div className="db-profile-avatar-lg">AP</div>
            <div className="db-profile-info">
              <div className="db-profile-name">Aadil Parmar</div>
              <div className="db-profile-email">aadil@cloudguard.tech &middot; Member since Jan 2025</div>
              <div className="db-profile-badges">
                <span className="db-badge-pill db-badge--active">Verified</span>
                <span className="db-badge-pill db-badge--neutral">Pro Member</span>
                <span className="db-badge-pill db-badge--positive">12 Reviews</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <Link to="/dashboard" className="db-btn db-btn--primary">Go to Dashboard</Link>
              <Link to="/dashboard/settings" className="db-btn db-btn--outline">Edit Profile</Link>
            </div>
          </div>

          <div className="db-grid-2">
            {/* Saved Businesses */}
            <div className="db-card">
              <div className="db-card-header">
                <div className="db-card-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                  Saved Businesses
                </div>
                <span className="db-card-action">{savedBusinesses.length} saved</span>
              </div>
              <div className="db-card-body" style={{ padding: '4px 20px' }}>
                {savedBusinesses.map(b => (
                  <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', background: b.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{b.name[0]}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{b.name}</div>
                      <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>{b.category}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 500, color: 'var(--amber)' }}>
                      <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, fill: 'var(--amber)', stroke: 'none' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                      {b.rating}
                      <span style={{ fontWeight: 300, color: 'var(--gray-400)', fontSize: 11 }}>({b.reviews})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Reviews */}
            <div className="db-card">
              <div className="db-card-header">
                <div className="db-card-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  My Reviews
                </div>
                <Link to="/write-review" className="db-card-action">Write Review</Link>
              </div>
              <div className="db-card-body" style={{ padding: '4px 20px' }}>
                {myReviews.map(r => (
                  <div key={r.business} style={{ padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{r.business}</span>
                      <div className="db-stars">
                        {[1,2,3,4,5].map(s => <svg key={s} viewBox="0 0 24 24" className={s > r.rating ? 'empty' : ''}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
                      </div>
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 300, color: 'var(--gray-500)', lineHeight: 1.5, marginBottom: 4 }}>{r.text}</div>
                    <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>{r.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="db-stats" style={{ marginTop: 24 }}>
            {[
              { label: 'Reviews Written', value: '12', gradient: 'linear-gradient(135deg,var(--accent),var(--plum))' },
              { label: 'Businesses Saved', value: '24', gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))' },
              { label: 'Helpful Votes', value: '87', gradient: 'linear-gradient(135deg,var(--amber),var(--coral))' },
              { label: 'Profile Views', value: '1,245', gradient: 'linear-gradient(135deg,var(--azure),var(--accent))' },
            ].map(s => (
              <div className="db-stat" key={s.label}>
                <div className="db-stat-icon" style={{ background: s.gradient }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /></svg>
                </div>
                <div className="db-stat-value">{s.value}</div>
                <div className="db-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SharedLayout>
  )
}
