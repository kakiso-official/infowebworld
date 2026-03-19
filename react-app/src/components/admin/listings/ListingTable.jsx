import AdminTable from '../shared/AdminTable'
import { listingStatusMap } from '../../../data/admin/listingsData'

function qualityColor(score) {
  if (score >= 80) return 'var(--emerald)'
  if (score >= 60) return 'var(--amber)'
  return 'var(--coral)'
}

const columns = [
  {
    key: 'name',
    label: 'Name / Owner',
    sortable: true,
    render: (row) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
          {row.name}
          {row.verified && (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="var(--accent)" stroke="#fff" strokeWidth="2" style={{ marginLeft: 4, verticalAlign: 'middle' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{row.owner}</div>
      </div>
    ),
  },
  {
    key: 'category',
    label: 'Category',
    sortable: true,
    render: (row) => <span style={{ fontSize: 12 }}>{row.category}</span>,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (row) => {
      const s = listingStatusMap[row.status] || { label: row.status, cls: '' }
      return <span className={`db-badge ${s.cls}`}>{s.label}</span>
    },
  },
  {
    key: 'rating',
    label: 'Rating',
    sortable: true,
    render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <svg viewBox="0 0 24 24" width="13" height="13" fill="var(--amber)" stroke="var(--amber)" strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span style={{ fontWeight: 500, fontSize: 13 }}>{row.rating > 0 ? row.rating : '--'}</span>
        {row.reviews > 0 && <span style={{ fontSize: 11, color: 'var(--text-light)' }}>({row.reviews})</span>}
      </div>
    ),
  },
  {
    key: 'views',
    label: 'Views',
    sortable: true,
    render: (row) => <span style={{ fontSize: 13 }}>{row.views > 0 ? row.views.toLocaleString() : '--'}</span>,
  },
  {
    key: 'leads',
    label: 'Leads',
    sortable: true,
    render: (row) => <span style={{ fontSize: 13 }}>{row.leads > 0 ? row.leads.toLocaleString() : '--'}</span>,
  },
  {
    key: 'quality',
    label: 'Quality',
    sortable: true,
    render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--gray-200)', overflow: 'hidden' }}>
          <div style={{ width: `${row.quality}%`, height: '100%', borderRadius: 3, background: qualityColor(row.quality) }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, color: qualityColor(row.quality) }}>{row.quality}</span>
      </div>
    ),
  },
  {
    key: 'plan',
    label: 'Plan',
    sortable: true,
    render: (row) => <span style={{ fontSize: 12 }}>{row.plan}</span>,
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row) => (
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="db-btn db-btn--outline" style={{ fontSize: 11, padding: '3px 8px' }}>View</button>
        {row.status === 'active' && (
          <button className="db-btn db-btn--danger" style={{ fontSize: 11, padding: '3px 8px' }}>Suspend</button>
        )}
      </div>
    ),
  },
]

export default function ListingTable({ listings, sortBy, sortDir, onSort, selectedIds, onSelect, onSelectAll }) {
  return (
    <AdminTable
      columns={columns}
      data={listings}
      onSort={onSort}
      sortBy={sortBy}
      sortDir={sortDir}
      selectable
      selectedIds={selectedIds}
      onSelect={onSelect}
      onSelectAll={onSelectAll}
      pageSize={10}
    />
  )
}
