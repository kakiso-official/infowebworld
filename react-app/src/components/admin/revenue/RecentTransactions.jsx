import DashboardCard from '../../dashboard/shared/DashboardCard'
import { recentTransactions, transactionStatusMap } from '../../../data/admin/revenueData'

export default function RecentTransactions() {
  return (
    <DashboardCard
      full
      title="Recent Transactions"
      icon={<><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></>}
    >
      <div style={{ overflowX: 'auto' }}>
        <table className="db-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Date</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((t) => {
              const status = transactionStatusMap[t.status] || { label: t.status, cls: '' }
              return (
                <tr key={t.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{t.id}</td>
                  <td style={{ fontWeight: 500 }}>{t.customer}</td>
                  <td>{t.amount}</td>
                  <td>{t.plan}</td>
                  <td><span className={`db-badge ${status.cls}`}>{status.label}</span></td>
                  <td>{t.date}</td>
                  <td style={{ fontSize: 12 }}>{t.method}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  )
}
