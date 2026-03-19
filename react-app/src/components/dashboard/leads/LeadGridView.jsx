import { priorityMap, statusMap } from '../../../data/dashboard/leadsData'

export default function LeadGridView({ filtered, expandedId, setExpandedId }) {
  return (
    <div className="db-card-body" style={{ padding: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
        {filtered.map(lead => (
          <div key={lead.id} style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--r)', padding: 18, background: '#fff', transition: 'all .25s', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}>
            {/* Priority stripe */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: priorityMap[lead.priority].color, opacity: .6 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: lead.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{lead.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 1 }}>{lead.name}</div>
                <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>{lead.role} at {lead.company}</div>
              </div>
              <span className={`db-badge-pill ${statusMap[lead.status].cls}`}>{statusMap[lead.status].label}</span>
            </div>
            <p style={{ fontSize: 12.5, fontWeight: 350, color: 'var(--gray-600)', lineHeight: 1.55, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{lead.message}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {lead.tags.map(t => (
                <span key={t} style={{ padding: '2px 8px', borderRadius: 10, background: 'var(--gray-100)', fontSize: 10, fontWeight: 500, color: 'var(--gray-500)' }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--gray-100)', paddingTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)' }}>{lead.value}</span>
                <span style={{ fontSize: 10, fontWeight: 400, padding: '2px 6px', borderRadius: 4, background: priorityMap[lead.priority].bg, color: priorityMap[lead.priority].color }}>{lead.priority}</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>{lead.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
