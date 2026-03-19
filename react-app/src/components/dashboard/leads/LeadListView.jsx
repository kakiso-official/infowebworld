import { priorityMap, statusMap, sourceIcons } from '../../../data/dashboard/leadsData'

export default function LeadListView({ filtered, expandedId, setExpandedId }) {
  return (
    <div className="db-card-body" style={{ padding: '0 20px' }}>
      {filtered.map(lead => (
        <div key={lead.id} style={{ padding: '16px 0', borderBottom: '1px solid var(--gray-100)', cursor: 'pointer', transition: 'background .15s' }}
          onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}>
          {/* Main row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: lead.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{lead.name.split(' ').map(n => n[0]).join('')}</span>
              {lead.status === 'new' && <span style={{ position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderRadius: '50%', background: 'var(--emerald)', border: '2px solid #fff' }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{lead.name}</span>
                <span style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>{lead.role}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-500)' }}>{lead.company}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              {lead.tags.slice(0, 2).map(t => (
                <span key={t} style={{ padding: '2px 8px', borderRadius: 10, background: 'var(--gray-100)', fontSize: 10, fontWeight: 500, color: 'var(--gray-500)', display: 'none' }} className="an-tag-desktop">{t}</span>
              ))}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 80 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>{lead.value}</div>
              <span style={{ fontSize: 10, fontWeight: 400, padding: '1px 6px', borderRadius: 4, background: priorityMap[lead.priority].bg, color: priorityMap[lead.priority].color }}>{lead.priority}</span>
            </div>
            <span className={`db-badge-pill ${statusMap[lead.status].cls}`} style={{ flexShrink: 0 }}>{statusMap[lead.status].label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, minWidth: 60, justifyContent: 'flex-end' }}>
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'var(--gray-400)', fill: 'none', strokeWidth: 1.5 }}><path d={sourceIcons[lead.source] || sourceIcons['Contact Form']} /></svg>
              <span style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>{lead.date.replace(', 2026', '')}</span>
            </div>
            <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: 'var(--gray-300)', fill: 'none', strokeWidth: 1.5, flexShrink: 0, transition: 'transform .2s', transform: expandedId === lead.id ? 'rotate(180deg)' : 'rotate(0)' }}><polyline points="6 9 12 15 18 9" /></svg>
          </div>

          {/* Expanded detail */}
          {expandedId === lead.id && (
            <div style={{ marginTop: 16, marginLeft: 58, background: 'var(--gray-50)', borderRadius: 'var(--r)', padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>Contact Info</div>
                  <div style={{ fontSize: 12.5, fontWeight: 400, color: 'var(--gray-700)', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'var(--gray-400)', fill: 'none', strokeWidth: 1.5 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22 6 12 13 2 6" /></svg>
                    {lead.email}
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 400, color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'var(--gray-400)', fill: 'none', strokeWidth: 1.5 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" /></svg>
                    {lead.phone}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>Lead Details</div>
                  <div style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-600)', marginBottom: 3 }}>Source: <strong style={{ color: 'var(--gray-800)' }}>{lead.source}</strong></div>
                  <div style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-600)', marginBottom: 3 }}>Submitted: <strong style={{ color: 'var(--gray-800)' }}>{lead.date} at {lead.time}</strong></div>
                  <div style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-600)' }}>Est. Value: <strong style={{ color: 'var(--emerald)' }}>{lead.value}</strong></div>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>Message</div>
                <p style={{ fontSize: 13, fontWeight: 350, color: 'var(--gray-700)', lineHeight: 1.65, margin: 0, padding: '10px 14px', background: '#fff', borderRadius: 'var(--r-sm)', border: '1px solid var(--gray-200)' }}>{lead.message}</p>
              </div>
              {lead.lastContact && (
                <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(108,114,241,.04)', borderRadius: 'var(--r-sm)', border: '1px solid rgba(108,114,241,.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'var(--accent)', fill: 'none', strokeWidth: 1.5, flexShrink: 0 }}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-600)' }}>Last activity: <strong style={{ color: 'var(--gray-800)' }}>{lead.lastContact}</strong> — {lead.lastContactDate}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {lead.tags.map(t => (
                  <span key={t} style={{ padding: '3px 10px', borderRadius: 10, background: 'var(--gray-100)', fontSize: 11, fontWeight: 500, color: 'var(--gray-500)' }}>{t}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="db-btn db-btn--primary" style={{ padding: '7px 16px', fontSize: 12 }}>
                  <svg viewBox="0 0 24 24" style={{ width: 13, height: 13 }}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Send Reply
                </button>
                <button className="db-btn db-btn--outline" style={{ padding: '7px 16px', fontSize: 12 }}>
                  <svg viewBox="0 0 24 24" style={{ width: 13, height: 13 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" /></svg>
                  Call
                </button>
                {lead.status === 'new' && <button className="db-btn db-btn--outline" style={{ padding: '7px 16px', fontSize: 12 }}>Mark Contacted</button>}
                {lead.status === 'contacted' && <button className="db-btn db-btn--outline" style={{ padding: '7px 16px', fontSize: 12, color: 'var(--emerald)', borderColor: 'var(--emerald)' }}>Mark Converted</button>}
                <button className="db-btn db-btn--outline" style={{ padding: '7px 16px', fontSize: 12, marginLeft: 'auto' }}>
                  <svg viewBox="0 0 24 24" style={{ width: 13, height: 13 }}><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                  Archive
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      {filtered.length === 0 && <div className="db-card-empty">No leads matching this filter</div>}
    </div>
  )
}
