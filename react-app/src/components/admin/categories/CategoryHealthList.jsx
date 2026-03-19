import DashboardCard from '../../dashboard/shared/DashboardCard'
import { allCategories } from '../../../data/admin/categoriesData'

function getIssues(cat) {
  const issues = []
  if (cat.listings < 100) {
    issues.push({ text: `Low listings (${cat.listings})`, action: 'Promote to attract more vendors' })
  }
  if (!cat.growthUp) {
    issues.push({ text: `Negative growth (${cat.growth})`, action: 'Review category relevance and SEO' })
  }
  if (cat.status === 'inactive') {
    issues.push({ text: 'Category is inactive', action: 'Consider reactivating or merging' })
  }
  return issues
}

export default function CategoryHealthList() {
  const needsAttention = allCategories
    .map(cat => ({ ...cat, issues: getIssues(cat) }))
    .filter(cat => cat.issues.length > 0)

  return (
    <DashboardCard
      title="Categories Needing Attention"
      icon={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>}
    >
      {needsAttention.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--emerald)' }}>
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--emerald)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div style={{ fontWeight: 500 }}>All categories healthy</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {needsAttention.map(cat => (
            <div key={cat.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 20, lineHeight: 1 }}>{cat.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 4 }}>{cat.name}</div>
                {cat.issues.map((issue, i) => (
                  <div key={i} style={{ fontSize: 12, marginBottom: 2 }}>
                    <span style={{ color: 'var(--coral)' }}>{issue.text}</span>
                    <span style={{ color: 'var(--text-light)', marginLeft: 6 }}>— {issue.action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  )
}
