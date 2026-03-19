import DashboardCard from '../../dashboard/shared/DashboardCard'
import { revenueByCategory } from '../../../data/admin/revenueData'

export default function RevenueByCategory() {
  return (
    <DashboardCard
      title="Revenue by Category"
      icon={<><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>}
    >
      <div style={{ overflowX: 'auto' }}>
        <table className="db-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Revenue</th>
              <th>Listings</th>
              <th>Avg/Listing</th>
              <th>Growth</th>
            </tr>
          </thead>
          <tbody>
            {revenueByCategory.map((c, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{c.category}</td>
                <td>{c.revenue}</td>
                <td>{c.listings.toLocaleString()}</td>
                <td>{c.avgPerListing}</td>
                <td style={{ color: 'var(--emerald)', fontWeight: 500 }}>{c.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  )
}
