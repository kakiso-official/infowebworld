import AdminTable from '../shared/AdminTable'

const columns = [
  {
    key: 'name',
    label: 'Category',
    sortable: true,
    render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>{row.icon}</span>
        <span style={{ fontWeight: 500 }}>{row.name}</span>
      </div>
    ),
  },
  {
    key: 'slug',
    label: 'Slug',
    sortable: true,
    render: (row) => (
      <code style={{ fontSize: 12, color: 'var(--text-light)', background: 'var(--bg)', padding: '2px 6px', borderRadius: 4 }}>{row.slug}</code>
    ),
  },
  {
    key: 'listings',
    label: 'Listings',
    sortable: true,
    render: (row) => row.listings.toLocaleString(),
  },
  {
    key: 'activeListings',
    label: 'Active',
    sortable: true,
    render: (row) => row.activeListings.toLocaleString(),
  },
  {
    key: 'views',
    label: 'Views',
    sortable: true,
    render: (row) => row.views.toLocaleString(),
  },
  {
    key: 'growth',
    label: 'Growth',
    sortable: true,
    render: (row) => (
      <span style={{ color: row.growthUp ? 'var(--emerald)' : 'var(--coral)', fontWeight: 500 }}>
        {row.growth}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (row) => (
      <span
        className={`db-badge ${row.status === 'active' ? 'db-badge--active' : 'db-badge--inactive'}`}
        style={{ cursor: 'pointer' }}
        title={`Click to ${row.status === 'active' ? 'deactivate' : 'activate'}`}
      >
        {row.status === 'active' ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    key: 'created',
    label: 'Created',
    sortable: true,
    cellStyle: { whiteSpace: 'nowrap', fontSize: 13, color: 'var(--text-light)' },
  },
  {
    key: 'actions',
    label: 'Actions',
    render: () => (
      <div style={{ display: 'flex', gap: 4 }}>
        <button className="db-btn db-btn--outline" style={{ padding: '3px 8px', fontSize: 11 }}>Edit</button>
        <button className="db-btn db-btn--danger" style={{ padding: '3px 8px', fontSize: 11 }}>Delete</button>
      </div>
    ),
  },
]

export default function CategoryTable({ categories, sortBy, sortDir, onSort }) {
  return (
    <AdminTable
      columns={columns}
      data={categories}
      onSort={onSort}
      sortBy={sortBy}
      sortDir={sortDir}
      pageSize={10}
    />
  )
}
