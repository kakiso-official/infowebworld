import DashboardCard from '../../dashboard/shared/DashboardCard'
import { paymentFailures } from '../../../data/admin/revenueData'

export default function PaymentFailures() {
  return (
    <DashboardCard
      title="Payment Failures"
      icon={<><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {paymentFailures.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: i < paymentFailures.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--text)' }}>{f.customer}</div>
              <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 2 }}>
                {f.amount} &middot; {f.reason}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>
                {f.attempts} attempt{f.attempts > 1 ? 's' : ''} &middot; Last: {f.lastAttempt}
              </div>
            </div>
            <button className="db-btn db-btn--outline" style={{ fontSize: 12, padding: '4px 12px', whiteSpace: 'nowrap' }}>
              Retry
            </button>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
