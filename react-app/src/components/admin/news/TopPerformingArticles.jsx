import DashboardCard from '../../dashboard/shared/DashboardCard'
import { allArticles } from '../../../data/admin/newsData'

const top5 = [...allArticles]
  .filter(a => a.status === 'published')
  .sort((a, b) => b.views - a.views)
  .slice(0, 5)

export default function TopPerformingArticles() {
  return (
    <DashboardCard
      title="Top Performing Articles"
      icon={<><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></>}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {top5.map((article, i) => (
          <div
            key={article.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 0',
              borderBottom: i < top5.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: i === 0 ? 'var(--accent)' : i === 1 ? 'var(--emerald)' : i === 2 ? 'var(--azure)' : 'var(--bg-alt)',
              color: i < 3 ? '#fff' : 'var(--text-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 12,
              flexShrink: 0,
            }}>
              {i + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {article.title}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0, fontSize: 12, color: 'var(--text-light)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
                {article.views.toLocaleString()}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                {article.shares.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
