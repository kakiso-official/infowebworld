import Sparkline from '../shared/Sparkline'

export default function PeriodComparison() {
  const rows = [
    { metric: 'Page Views', curr: '38,421', prev: '31,380', change: '+22.4%', up: true, spark: [18,22,19,28,25,32,30,38] },
    { metric: 'Unique Visitors', curr: '12,847', prev: '10,870', change: '+18.2%', up: true, spark: [8,12,10,15,13,18,16,20] },
    { metric: 'Avg. Session Duration', curr: '2m 34s', prev: '2m 22s', change: '+8.1%', up: true, spark: [100,115,108,125,118,132,128,140] },
    { metric: 'Bounce Rate', curr: '24.3%', prev: '25.8%', change: '-5.7%', up: true, spark: [30,28,29,27,26,25,25,24] },
    { metric: 'Conversion Rate', curr: '16.6%', prev: '14.2%', change: '+16.9%', up: true, spark: [10,11,12,12,13,14,15,17] },
    { metric: 'Quote Requests', curr: '847', prev: '718', change: '+18.0%', up: true, spark: [50,55,60,58,65,70,72,80] },
    { metric: 'Phone Clicks', curr: '412', prev: '381', change: '+8.1%', up: true, spark: [30,32,34,33,35,37,38,42] },
  ]

  return (
    <div className="db-card db-full">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
          Period Comparison
        </div>
        <span className="db-card-action">This month vs. last month</span>
      </div>
      <div className="db-card-body" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="db-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>This Month</th>
              <th>Last Month</th>
              <th>Change</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.metric}>
                <td className="db-table-name">{r.metric}</td>
                <td style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{r.curr}</td>
                <td>{r.prev}</td>
                <td>
                  <span className={`db-stat-change ${r.up ? 'db-stat-change--up' : 'db-stat-change--down'}`} style={{ fontSize: 10 }}>
                    <svg viewBox="0 0 24 24">{r.up ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}</svg>
                    {r.change}
                  </span>
                </td>
                <td><Sparkline data={r.spark} color={r.up ? 'var(--emerald)' : 'var(--coral)'} width={60} height={20} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
