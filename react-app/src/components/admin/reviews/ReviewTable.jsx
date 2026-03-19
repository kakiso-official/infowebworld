import AdminTable from '../shared/AdminTable'
import { reviewStatusMap } from '../../../data/admin/reviewsData'

const columns = [
  {
    key: 'author',
    label: 'Author',
    sortable: true,
    render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: row.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: '#fff', flexShrink: 0 }}>
          {row.avatar}
        </div>
        <span style={{ fontWeight: 500, fontSize: 13 }}>{row.author}</span>
      </div>
    ),
  },
  {
    key: 'listing',
    label: 'Listing',
    sortable: true,
    render: (row) => <span style={{ fontSize: 13 }}>{row.listing}</span>,
  },
  {
    key: 'rating',
    label: 'Rating',
    sortable: true,
    render: (row) => (
      <span style={{ color: 'var(--amber)', fontSize: 13, letterSpacing: 1 }}>
        {'★'.repeat(row.rating)}{'☆'.repeat(5 - row.rating)}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (row) => {
      const s = reviewStatusMap[row.status] || { label: row.status, cls: '' }
      return <span className={`db-badge ${s.cls}`}>{s.label}</span>
    },
  },
  {
    key: 'verified',
    label: 'Verified',
    render: (row) => row.verified ? (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--gray-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    key: 'helpful',
    label: 'Helpful',
    sortable: true,
    render: (row) => (
      <span style={{ fontSize: 13, color: row.helpful > 0 ? 'var(--text)' : 'var(--text-light)' }}>
        {row.helpful > 0 ? `${row.helpful}` : '0'}
      </span>
    ),
  },
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    render: (row) => <span style={{ fontSize: 12, color: 'var(--text-light)', whiteSpace: 'nowrap' }}>{row.date}</span>,
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row) => (
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="db-btn db-btn--outline" style={{ fontSize: 11, padding: '3px 10px' }}>Approve</button>
        <button className="db-btn db-btn--danger" style={{ fontSize: 11, padding: '3px 10px' }}>Remove</button>
      </div>
    ),
  },
]

export default function ReviewTable({ reviews, sortBy, sortDir, onSort }) {
  return (
    <AdminTable
      columns={columns}
      data={reviews}
      sortBy={sortBy}
      sortDir={sortDir}
      onSort={onSort}
      pageSize={10}
    />
  )
}
