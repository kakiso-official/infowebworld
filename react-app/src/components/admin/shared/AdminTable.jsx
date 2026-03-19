import React, { useState } from 'react'

export default function AdminTable({ columns, data, onSort, sortBy, sortDir, selectable, selectedIds, onSelect, onSelectAll, expandedId, onExpand, renderExpanded, pageSize = 10 }) {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(data.length / pageSize)
  const paged = data.slice(page * pageSize, (page + 1) * pageSize)
  const allSelected = paged.length > 0 && paged.every(r => selectedIds?.includes(r.id))

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="db-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            {selectable && (
              <th style={{ width: 36 }}>
                <input type="checkbox" checked={allSelected} onChange={() => onSelectAll?.(paged.map(r => r.id))} />
              </th>
            )}
            {columns.map(col => (
              <th key={col.key} style={{ cursor: col.sortable ? 'pointer' : 'default', whiteSpace: 'nowrap', ...col.style }} onClick={() => col.sortable && onSort?.(col.key)}>
                {col.label}
                {sortBy === col.key && <span style={{ marginLeft: 4, fontSize: 10 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paged.map(row => (
            <React.Fragment key={row.id}>
              <tr>
                {selectable && (
                  <td><input type="checkbox" checked={selectedIds?.includes(row.id)} onChange={() => onSelect?.(row.id)} /></td>
                )}
                {columns.map(col => (
                  <td key={col.key} style={col.cellStyle}>
                    {col.render ? col.render(row, { expandedId, onExpand }) : row[col.key]}
                  </td>
                ))}
              </tr>
              {expandedId === row.id && renderExpanded && (
                <tr>
                  <td colSpan={(selectable ? 1 : 0) + columns.length} style={{ padding: 0 }}>
                    {renderExpanded(row)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', fontSize: 13, color: 'var(--text-light)' }}>
          <span>Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, data.length)} of {data.length}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="db-btn db-btn--outline" disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{ padding: '4px 10px', fontSize: 12 }}>Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={`db-btn ${i === page ? '' : 'db-btn--outline'}`} onClick={() => setPage(i)} style={{ padding: '4px 10px', fontSize: 12, minWidth: 32 }}>{i + 1}</button>
            ))}
            <button className="db-btn db-btn--outline" disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)} style={{ padding: '4px 10px', fontSize: 12 }}>Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
