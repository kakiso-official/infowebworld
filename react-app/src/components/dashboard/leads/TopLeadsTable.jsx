import { allLeads, priorityMap, statusMap } from '../../../data/dashboard/leadsData'

export default function TopLeadsTable() {
  return (
    <div className="db-card db-full">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
          Top Leads by Value
        </div>
        <span className="db-card-action">Pipeline forecast</span>
      </div>
      <div className="db-card-body" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="db-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Company</th>
              <th>Value</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Source</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {[...allLeads].filter(l => l.status !== 'archived').sort((a, b) => parseInt(b.value.replace(/\D/g, '')) - parseInt(a.value.replace(/\D/g, ''))).slice(0, 6).map(lead => (
              <tr key={lead.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: lead.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>{lead.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <span className="db-table-name">{lead.name}</span>
                  </div>
                </td>
                <td>{lead.company}</td>
                <td style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{lead.value}</td>
                <td><span style={{ fontSize: 10.5, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: priorityMap[lead.priority].bg, color: priorityMap[lead.priority].color }}>{lead.priority}</span></td>
                <td><span className={`db-badge-pill ${statusMap[lead.status].cls}`}>{statusMap[lead.status].label}</span></td>
                <td style={{ fontSize: 12 }}>{lead.source}</td>
                <td style={{ fontSize: 12, color: 'var(--gray-400)' }}>{lead.date.replace(', 2026', '')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
