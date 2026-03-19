export default function CompanyDetailsStep({ form, up, totalSteps }) {
  return (
    <div className="db-card db-full">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          Company Details
        </div>
        <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Step 4 of {totalSteps}</span>
      </div>
      <div className="db-card-body">
        <div className="db-form-row">
          <div className="db-form-group">
            <label className="db-form-label">Year Founded</label>
            <input className="db-form-input" type="number" placeholder="e.g. 2020" min="1900" max="2026" value={form.founded} onChange={e => up('founded', e.target.value)} />
          </div>
          <div className="db-form-group">
            <label className="db-form-label">Team Size</label>
            <select className="db-form-select" value={form.teamSize} onChange={e => up('teamSize', e.target.value)}>
              <option value="">Select team size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1,000 employees</option>
              <option value="1000+">1,000+ employees</option>
            </select>
          </div>
        </div>

        <div className="db-form-row">
          <div className="db-form-group">
            <label className="db-form-label">Funding Stage</label>
            <select className="db-form-select" value={form.funding} onChange={e => up('funding', e.target.value)}>
              <option value="">Select funding stage</option>
              <option value="bootstrapped">Bootstrapped</option>
              <option value="pre-seed">Pre-Seed</option>
              <option value="seed">Seed</option>
              <option value="series-a">Series A</option>
              <option value="series-b">Series B</option>
              <option value="series-c+">Series C+</option>
              <option value="public">Publicly Traded</option>
              <option value="profitable">Profitable / Self-funded</option>
            </select>
          </div>
          <div className="db-form-group">
            <label className="db-form-label">Headquarters</label>
            <input className="db-form-input" placeholder="e.g. San Francisco, CA" value={form.hqLocation} onChange={e => up('hqLocation', e.target.value)} />
          </div>
        </div>

        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--gray-100)' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ width: 14, height: 14 }}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            Social Links
          </div>
          <div className="db-form-row">
            <div className="db-form-group">
              <label className="db-form-label">LinkedIn</label>
              <input className="db-form-input" placeholder="https://linkedin.com/company/..." value={form.linkedIn} onChange={e => up('linkedIn', e.target.value)} />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Twitter / X</label>
              <input className="db-form-input" placeholder="https://x.com/..." value={form.twitter} onChange={e => up('twitter', e.target.value)} />
            </div>
          </div>
          <div className="db-form-group" style={{ maxWidth: '50%' }}>
            <label className="db-form-label">Facebook</label>
            <input className="db-form-input" placeholder="https://facebook.com/..." value={form.facebook} onChange={e => up('facebook', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  )
}
