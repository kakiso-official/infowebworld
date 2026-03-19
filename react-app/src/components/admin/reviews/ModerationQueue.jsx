import DashboardCard from '../../dashboard/shared/DashboardCard'
import { allReviews } from '../../../data/admin/reviewsData'

const flaggedReviews = allReviews.filter(r => r.flagged)

function StarRating({ rating }) {
  return (
    <span style={{ color: 'var(--amber)', fontSize: 13, letterSpacing: 1 }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

export default function ModerationQueue() {
  return (
    <DashboardCard
      full
      title="Moderation Queue"
      icon={<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {flaggedReviews.map(review => (
          <div key={review.id} className="adm-mod-card">
            <div className="adm-mod-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: review.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff', flexShrink: 0 }}>
                  {review.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{review.author}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{review.listing}</div>
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <div className="adm-mod-reason">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              {review.flagReason}
            </div>
            <div className="adm-mod-text">{review.text}</div>
            <div className="adm-mod-actions">
              <button className="db-btn" style={{ fontSize: 12, padding: '5px 14px' }}>Approve</button>
              <button className="db-btn db-btn--danger" style={{ fontSize: 12, padding: '5px 14px' }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
