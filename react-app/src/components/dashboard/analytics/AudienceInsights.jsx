import { audienceInsights } from '../../../data/dashboard/analyticsData'

export default function AudienceInsights() {
  return (
    <div className="db-stats" style={{ marginBottom: 24 }}>
      {audienceInsights.map(a => (
        <div key={a.label} style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--r)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--r-sm)', background: a.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{a.value}</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{a.label}</div>
            <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>{a.sub}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
