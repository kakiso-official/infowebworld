import { topPages } from '../../../data/dashboard/analyticsData'

export default function TopPages() {
  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          Top Pages
        </div>
        <span className="db-card-action">View all</span>
      </div>
      <div className="db-card-body" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="db-table">
          <thead>
            <tr>
              <th>Page</th>
              <th>Views</th>
              <th>Bounce</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {topPages.map(p => (
              <tr key={p.page}>
                <td className="db-table-name">{p.page}</td>
                <td>{p.views.toLocaleString()}</td>
                <td>
                  <span style={{ color: p.bounceRate > 30 ? 'var(--coral)' : 'var(--emerald)', fontWeight: 500 }}>{p.bounceRate}%</span>
                </td>
                <td>{p.avgTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
