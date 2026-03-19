import DashboardCard from '../../dashboard/shared/DashboardCard'
import { topListings } from '../../../data/admin/overviewData'

export default function TopListingsTable() {
  return (
    <DashboardCard
      full
      title="Top Performing Listings"
      icon={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>}
      action="View All"
      actionLink="/admin/listings"
    >
      <div style={{ overflowX: 'auto' }}>
        <table className="db-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Views</th>
              <th>Leads</th>
              <th>Rating</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {topListings.map((listing, i) => (
              <tr key={listing.id}>
                <td>{i + 1}</td>
                <td style={{ fontWeight: 500 }}>{listing.name}</td>
                <td>{listing.category}</td>
                <td>{listing.views.toLocaleString()}</td>
                <td>{listing.leads.toLocaleString()}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="var(--amber)" stroke="var(--amber)" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {listing.rating}
                  </span>
                </td>
                <td><span className={`db-badge db-badge--${listing.status}`}>{listing.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  )
}
