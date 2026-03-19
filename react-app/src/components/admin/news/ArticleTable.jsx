import AdminTable from '../shared/AdminTable'
import { articleStatusMap } from '../../../data/admin/newsData'

export default function ArticleTable({ articles, sortBy, sortDir, onSort }) {
  const columns = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontWeight: 500, color: 'var(--text)' }}>{row.title}</span>
          {row.featured && (
            <span style={{ color: 'var(--amber)', fontSize: 14, flexShrink: 0 }} title="Featured">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="var(--amber)" stroke="var(--amber)" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => {
        const s = articleStatusMap[row.status] || { label: row.status, cls: '' }
        return <span className={`db-badge ${s.cls}`}>{s.label}</span>
      },
    },
    {
      key: 'author',
      label: 'Author',
      sortable: true,
    },
    {
      key: 'views',
      label: 'Views',
      sortable: true,
      render: (row) => row.views.toLocaleString(),
    },
    {
      key: 'shares',
      label: 'Shares',
      sortable: true,
      render: (row) => row.shares.toLocaleString(),
    },
    {
      key: 'publishDate',
      label: 'Publish Date',
      sortable: true,
      render: (row) => row.publishDate || '\u2014',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="db-btn db-btn--outline" style={{ padding: '4px 10px', fontSize: 12 }}>Edit</button>
          <button className="db-btn db-btn--danger" style={{ padding: '4px 10px', fontSize: 12 }}>Delete</button>
        </div>
      ),
    },
  ]

  return (
    <AdminTable
      columns={columns}
      data={articles}
      sortBy={sortBy}
      sortDir={sortDir}
      onSort={onSort}
      pageSize={10}
    />
  )
}
