export default function AdminBulkActions({ count, onClear, actions = [] }) {
  if (count === 0) return null
  return (
    <div className="adm-bulk">
      <span><span className="adm-bulk-count">{count}</span> selected</span>
      {actions.map((a, i) => (
        <button key={i} className={`adm-bulk-btn${a.danger ? ' adm-bulk-btn--danger' : ''}`} onClick={a.onClick}>
          {a.label}
        </button>
      ))}
      <button className="adm-bulk-btn" onClick={onClear} style={{ marginLeft: 'auto' }}>Clear</button>
    </div>
  )
}
