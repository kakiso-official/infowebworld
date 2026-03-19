export default function BillingAddress() {
  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          Billing Address
        </div>
        <span className="db-card-action">Edit</span>
      </div>
      <div className="db-card-body">
        <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--gray-700)', lineHeight: 1.8 }}>
          Aadil Parmar<br />
          CloudGuard Technologies<br />
          123 Business Ave, Suite 100<br />
          San Francisco, CA 94102<br />
          United States
        </div>
      </div>
    </div>
  )
}
