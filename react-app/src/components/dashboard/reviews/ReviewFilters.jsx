export default function ReviewFilters({ filter, setFilter, searchQuery, setSearchQuery, sortBy, setSortBy, unrepliedCount }) {
  return (
    <div className="db-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
        {[
          { key: 'all', label: 'All' },
          { key: 'unreplied', label: `Needs Reply (${unrepliedCount})` },
          { key: 'positive', label: 'Positive' },
          { key: 'negative', label: 'Critical' },
          { key: '5', label: '5\u2605' },
          { key: '4', label: '4\u2605' },
          { key: '3', label: '3\u2605' },
          { key: '2', label: '2\u2605' },
        ].map(f => (
          <button key={f.key} className={`db-btn ${filter === f.key ? 'db-btn--primary' : 'db-btn--outline'}`} style={{ padding: '5px 12px', fontSize: 11 }} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', stroke: 'var(--gray-400)', fill: 'none', strokeWidth: 1.5 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input className="db-form-input" placeholder="Search reviews..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 30, width: 170, height: 32, fontSize: 12, margin: 0 }} />
        </div>
        <select className="db-form-select" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 120, height: 32, fontSize: 11, padding: '0 28px 0 10px', margin: 0 }}>
          <option value="newest">Newest</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>
    </div>
  )
}
