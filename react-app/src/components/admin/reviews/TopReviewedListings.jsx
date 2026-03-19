import DashboardCard from '../../dashboard/shared/DashboardCard'
import { topReviewedListings } from '../../../data/admin/reviewsData'

const sentimentBadge = {
  positive: { label: 'Positive', cls: 'db-badge--active' },
  neutral: { label: 'Neutral', cls: 'db-badge--pending' },
  negative: { label: 'Negative', cls: 'db-badge--inactive' },
}

export default function TopReviewedListings() {
  return (
    <DashboardCard
      title="Most Reviewed Listings"
      icon={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>}
    >
      <div style={{ overflowX: 'auto' }}>
        <table className="db-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ textAlign: 'right' }}>Reviews</th>
              <th style={{ textAlign: 'right' }}>Avg Rating</th>
              <th>Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {topReviewedListings.map((listing, i) => {
              const badge = sentimentBadge[listing.sentiment] || sentimentBadge.neutral
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 500, fontSize: 13 }}>{listing.name}</td>
                  <td style={{ textAlign: 'right', fontSize: 13 }}>{listing.reviews}</td>
                  <td style={{ textAlign: 'right', fontSize: 13 }}>
                    <span style={{ color: 'var(--amber)', marginRight: 4 }}>★</span>
                    {listing.avgRating}
                  </td>
                  <td>
                    <span className={`db-badge ${badge.cls}`}>{badge.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  )
}
