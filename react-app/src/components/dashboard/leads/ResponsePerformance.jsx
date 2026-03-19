export default function ResponsePerformance() {
  const metrics = [
    { label: 'Avg. First Response', value: '2.4 hours', target: 'Target: < 4h', pct: 85, color: 'var(--emerald)' },
    { label: 'Avg. Time to Convert', value: '4.2 days', target: 'Target: < 7 days', pct: 72, color: 'var(--accent)' },
    { label: 'Follow-up Rate', value: '94%', target: 'Target: > 90%', pct: 94, color: 'var(--azure)' },
    { label: 'Lead Score Accuracy', value: '87%', target: 'ML-powered scoring', pct: 87, color: 'var(--plum)' },
  ]

  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Response Performance
        </div>
      </div>
      <div className="db-card-body">
        {metrics.map(m => (
          <div key={m.label} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--gray-700)' }}>{m.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{m.value}</span>
            </div>
            <div style={{ height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden', marginBottom: 3 }}>
              <div style={{ height: '100%', width: `${m.pct}%`, background: m.color, borderRadius: 3, opacity: .65 }} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>{m.target}</div>
          </div>
        ))}
        {/* SLA compliance */}
        <div style={{ background: 'linear-gradient(135deg,rgba(47,174,106,.04),rgba(20,184,166,.04))', border: '1px solid rgba(47,174,106,.15)', borderRadius: 'var(--r-sm)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <div style={{ width: 48, height: 48, position: 'relative', flexShrink: 0 }}>
            <svg viewBox="0 0 48 48" width="48" height="48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="var(--gray-200)" strokeWidth="4" />
              <circle cx="24" cy="24" r="20" fill="none" stroke="var(--emerald)" strokeWidth="4" strokeDasharray={`${94 * 1.256} ${125.6 - 94 * 1.256}`} strokeLinecap="round" transform="rotate(-90 24 24)" />
            </svg>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--emerald)' }}>94%</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>SLA Compliance</div>
            <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-500)' }}>94% of leads responded within SLA target</div>
          </div>
        </div>
      </div>
    </div>
  )
}
