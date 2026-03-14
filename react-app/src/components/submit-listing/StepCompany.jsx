export default function StepCompany({ form, up }) {
  return (
    <div className="sl-section">
      <div className="sl-section-header">
        <div className="sl-section-icon" style={{ background: 'var(--coral)' }}>
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        </div>
        <div className="sl-section-info">
          <div className="sl-section-title">Company Details</div>
          <div className="sl-section-desc">Additional information about your company</div>
        </div>
      </div>

      <div className="sl-row">
        <div className="sl-field">
          <label className="sl-label">Year Founded</label>
          <input className="sl-input" type="number" placeholder="e.g. 2020" min="1900" max="2026" value={form.founded} onChange={e => up('founded', e.target.value)} />
        </div>
        <div className="sl-field">
          <label className="sl-label">Team Size</label>
          <select className="sl-input" value={form.teamSize} onChange={e => up('teamSize', e.target.value)}>
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

      <div className="sl-row">
        <div className="sl-field">
          <label className="sl-label">Funding Stage <span className="sl-label-opt">(optional)</span></label>
          <select className="sl-input" value={form.funding} onChange={e => up('funding', e.target.value)}>
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
        <div className="sl-field">
          <label className="sl-label">Headquarters</label>
          <input className="sl-input" placeholder="e.g. San Francisco, CA" value={form.hqLocation} onChange={e => up('hqLocation', e.target.value)} />
        </div>
      </div>

      <div style={{ marginTop: 8, marginBottom: 4, fontSize: 12, fontWeight: 500, color: 'var(--gray-700)' }}>Social Links</div>
      <div className="sl-row-3">
        <div className="sl-field">
          <label className="sl-label" style={{ fontSize: 11, fontWeight: 400 }}>LinkedIn</label>
          <input className="sl-input" placeholder="https://linkedin.com/company/..." value={form.linkedIn} onChange={e => up('linkedIn', e.target.value)} />
        </div>
        <div className="sl-field">
          <label className="sl-label" style={{ fontSize: 11, fontWeight: 400 }}>Twitter / X</label>
          <input className="sl-input" placeholder="https://x.com/..." value={form.twitter} onChange={e => up('twitter', e.target.value)} />
        </div>
        <div className="sl-field">
          <label className="sl-label" style={{ fontSize: 11, fontWeight: 400 }}>Facebook</label>
          <input className="sl-input" placeholder="https://facebook.com/..." value={form.facebook} onChange={e => up('facebook', e.target.value)} />
        </div>
      </div>
    </div>
  )
}
