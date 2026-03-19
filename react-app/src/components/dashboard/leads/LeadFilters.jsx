export default function LeadFilters({ filter, setFilter, searchQuery, setSearchQuery, sortBy, setSortBy, viewMode, setViewMode, allLeads }) {
  return (
    <div className="db-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
        {['all', 'new', 'contacted', 'converted', 'archived'].map(f => (
          <button key={f} className={`db-btn ${filter === f ? 'db-btn--primary' : 'db-btn--outline'}`} style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? allLeads.length : allLeads.filter(l => l.status === f).length})
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', stroke: 'var(--gray-400)', fill: 'none', strokeWidth: 1.5 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input
            className="db-form-input"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 30, width: 180, height: 34, fontSize: 12, margin: 0 }}
          />
        </div>
        {/* Sort */}
        <select className="db-form-select" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 120, height: 34, fontSize: 12, padding: '0 28px 0 10px', margin: 0 }}>
          <option value="date">Newest</option>
          <option value="value">Highest Value</option>
          <option value="priority">Priority</option>
        </select>
        {/* View toggle */}
        <div style={{ display: 'flex', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
          <button onClick={() => setViewMode('list')} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: viewMode === 'list' ? 'var(--accent-soft)' : '#fff' }}>
            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: viewMode === 'list' ? 'var(--accent)' : 'var(--gray-400)', fill: 'none', strokeWidth: 1.5 }}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
          </button>
          <button onClick={() => setViewMode('grid')} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderLeft: '1px solid var(--gray-200)', cursor: 'pointer', background: viewMode === 'grid' ? 'var(--accent-soft)' : '#fff' }}>
            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: viewMode === 'grid' ? 'var(--accent)' : 'var(--gray-400)', fill: 'none', strokeWidth: 1.5 }}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
