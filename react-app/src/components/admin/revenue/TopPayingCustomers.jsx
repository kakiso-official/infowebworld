import DashboardCard from '../../dashboard/shared/DashboardCard'
import { topPayingCustomers } from '../../../data/admin/revenueData'

const planCls = {
  Enterprise: 'db-badge--active',
  Pro: 'db-badge--pending',
  Basic: 'db-badge--inactive',
}

export default function TopPayingCustomers() {
  return (
    <DashboardCard
      full
      title="Top Paying Customers"
      icon={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /></>}
    >
      <div style={{ overflowX: 'auto' }}>
        <table className="db-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Company</th>
              <th>Plan</th>
              <th>Monthly</th>
              <th>Lifetime</th>
              <th>Since</th>
            </tr>
          </thead>
          <tbody>
            {topPayingCustomers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td>{c.company}</td>
                <td><span className={`db-badge ${planCls[c.plan] || ''}`}>{c.plan}</span></td>
                <td>{c.monthly}</td>
                <td style={{ fontWeight: 500 }}>{c.lifetime}</td>
                <td>{c.since}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  )
}
