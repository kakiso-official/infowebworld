import Sparkline from '../shared/Sparkline'

export default function LeadStatCards({ newCount, convRate, totalValue }) {
  const stats = [
    { label: 'New Leads', value: newCount, sub: '+4 this week', gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))', spark: [3,5,4,6,8,7,9,12], sparkColor: 'var(--emerald)', icon: 'M12 4v16m8-8H4' },
    { label: 'Response Time', value: '2.4h', sub: '32% faster', gradient: 'linear-gradient(135deg,var(--azure),var(--accent))', spark: [8,6,7,5,4,5,3,2], sparkColor: 'var(--azure)', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Conversion Rate', value: `${convRate}%`, sub: '+8% vs last month', gradient: 'linear-gradient(135deg,var(--accent),var(--plum))', spark: [12,14,13,16,18,17,20,22], sparkColor: 'var(--accent)', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { label: 'Pipeline Value', value: `$${(totalValue / 1000).toFixed(0)}K`, sub: '10 active deals', gradient: 'linear-gradient(135deg,var(--amber),var(--coral))', spark: [180,200,220,210,240,260,280,320], sparkColor: 'var(--amber)', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ]

  return (
    <div className="db-stats">
      {stats.map(s => (
        <div className="db-stat" key={s.label}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="db-stat-icon" style={{ background: s.gradient }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
            </div>
            <Sparkline data={s.spark} color={s.sparkColor} />
          </div>
          <div className="db-stat-value">{s.value}</div>
          <div className="db-stat-label">{s.label}</div>
          <div className="db-stat-change db-stat-change--up">
            <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
            {s.sub}
          </div>
        </div>
      ))}
    </div>
  )
}
