export default function EngagementDeepDive() {
  const metrics = [
    { label: 'Scroll Depth', value: '72%', desc: 'Average of all visitors', bar: 72, color: 'var(--accent)' },
    { label: 'Click-Through Rate', value: '8.4%', desc: 'From listing to action', bar: 84, color: 'var(--emerald)' },
    { label: 'Photo Gallery Views', value: '43%', desc: 'Visitors who view photos', bar: 43, color: 'var(--azure)' },
    { label: 'Review Section Reach', value: '67%', desc: 'Visitors reaching reviews', bar: 67, color: 'var(--plum)' },
    { label: 'Contact Form Visibility', value: '58%', desc: 'Visitors seeing the form', bar: 58, color: 'var(--amber)' },
  ]

  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          Engagement Deep-Dive
        </div>
      </div>
      <div className="db-card-body">
        {metrics.map(m => (
          <div key={m.label} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--gray-700)' }}>{m.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{m.value}</span>
            </div>
            <div style={{ height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden', marginBottom: 2 }}>
              <div style={{ height: '100%', width: `${m.bar}%`, background: m.color, borderRadius: 3, opacity: .65 }} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
