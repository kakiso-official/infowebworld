import AdminTable from '../shared/AdminTable'
import UserExpandedRow from './UserExpandedRow'
import { userStatusMap, userRoleMap } from '../../../data/admin/usersData'

const columns = [
  {
    key: 'name',
    label: 'User',
    sortable: true,
    render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          className="db-side-avatar"
          style={{ width: 30, height: 30, fontSize: 11, background: row.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 600, flexShrink: 0 }}
        >
          {row.avatar}
        </div>
        <div>
          <div style={{ fontWeight: 500, fontSize: 13 }}>{row.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{row.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    label: 'Role',
    sortable: false,
    render: (row) => {
      const r = userRoleMap[row.role]
      return <span className={`db-badge ${r?.cls || ''}`}>{r?.label || row.role}</span>
    },
  },
  {
    key: 'plan',
    label: 'Plan',
    sortable: false,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: false,
    render: (row) => {
      const s = userStatusMap[row.status]
      return <span className={`db-badge ${s?.cls || ''}`}>{s?.label || row.status}</span>
    },
  },
  {
    key: 'verified',
    label: 'Verified',
    sortable: false,
    render: (row) => row.verified
      ? <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      : <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--text-lighter)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    cellStyle: { textAlign: 'center' },
    style: { textAlign: 'center' },
  },
  {
    key: 'listings',
    label: 'Listings',
    sortable: true,
    cellStyle: { textAlign: 'center' },
    style: { textAlign: 'center' },
  },
  {
    key: 'lastActive',
    label: 'Last Active',
    sortable: false,
    cellStyle: { fontSize: 12, color: 'var(--text-light)', whiteSpace: 'nowrap' },
  },
  {
    key: 'actions',
    label: '',
    sortable: false,
    render: (row, { expandedId, onExpand }) => (
      <button
        className="db-btn db-btn--outline"
        style={{ fontSize: 11, padding: '3px 10px' }}
        onClick={() => onExpand?.(expandedId === row.id ? null : row.id)}
      >
        {expandedId === row.id ? 'Close' : 'Details'}
      </button>
    ),
    style: { width: 80 },
  },
]

export default function UserTable({ users, sortBy, sortDir, onSort, selectedIds, onSelect, onSelectAll, expandedId, setExpandedId }) {
  return (
    <>
      <AdminTable
        columns={columns}
        data={users}
        onSort={onSort}
        sortBy={sortBy}
        sortDir={sortDir}
        selectable
        selectedIds={selectedIds}
        onSelect={onSelect}
        onSelectAll={onSelectAll}
        expandedId={expandedId}
        onExpand={setExpandedId}
        renderExpanded={(row) => <UserExpandedRow user={row} />}
        pageSize={10}
      />
      {/* Expanded row rendered via AdminTable's renderExpanded */}
    </>
  )
}
