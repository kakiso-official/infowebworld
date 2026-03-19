export default function AdminFilters({ searchQuery, setSearchQuery, searchPlaceholder, filters = [], children }) {
  return (
    <div className="db-card-header" style={{ flexWrap: 'wrap', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--text-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="db-form-input"
          placeholder={searchPlaceholder || 'Search...'}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ border: 'none', background: 'transparent', padding: '4px 0', fontSize: 13, flex: 1 }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {filters.map((f, i) => (
          <select key={i} className="db-form-select" value={f.value} onChange={e => f.onChange(e.target.value)} style={{ padding: '5px 10px', fontSize: 12, minWidth: 100 }}>
            {f.options.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ))}
        {children}
      </div>
    </div>
  )
}
