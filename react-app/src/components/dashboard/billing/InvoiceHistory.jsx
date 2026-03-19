import { invoices } from '../../../data/dashboard/billingData'

export default function InvoiceHistory() {
  return (
    <div className="db-card db-full">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
          Invoice History
        </div>
      </div>
      <div className="db-card-body" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="db-table">
          <thead>
            <tr><th>Invoice</th><th>Date</th><th>Amount</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td className="db-table-name">{inv.id}</td>
                <td>{inv.date}</td>
                <td>{inv.amount}</td>
                <td><span className="db-badge-pill db-badge--active">Paid</span></td>
                <td><button className="db-btn db-btn--outline" style={{ padding: '4px 12px', fontSize: 11 }}>Download</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
