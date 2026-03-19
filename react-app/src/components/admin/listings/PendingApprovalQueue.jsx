import DashboardCard from '../../dashboard/shared/DashboardCard'
import { allListings } from '../../../data/admin/listingsData'

const pendingListings = allListings.filter(l => l.status === 'pending')

function qualityColor(score) {
  if (score >= 80) return 'var(--emerald)'
  if (score >= 60) return 'var(--amber)'
  return 'var(--coral)'
}

export default function PendingApprovalQueue() {
  return (
    <DashboardCard
      full
      title="Pending Approval"
      icon={<><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>}
      action={`${pendingListings.length} pending`}
    >
      <div className="adm-queue">
        {pendingListings.map(listing => (
          <div key={listing.id} className="adm-queue-card">
            <div className="adm-queue-header">
              <div className="adm-queue-title">{listing.name}</div>
              <span style={{ fontSize: 12, fontWeight: 600, color: qualityColor(listing.quality) }}>
                {listing.quality}/100
              </span>
            </div>
            <div className="adm-queue-meta">
              <span>{listing.owner}</span>
              <span>{listing.category}</span>
              <span>{listing.created}</span>
            </div>
            <div className="adm-queue-actions">
              <button className="db-btn" style={{ fontSize: 12, padding: '4px 12px' }}>Approve</button>
              <button className="db-btn db-btn--danger" style={{ fontSize: 12, padding: '4px 12px' }}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
