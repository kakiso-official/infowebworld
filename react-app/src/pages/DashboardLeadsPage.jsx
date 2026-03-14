import { useState } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'

const allLeads = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah.m@techcorp.com', phone: '+1 (555) 234-5678', message: 'Interested in your enterprise security solutions. We have a team of 200+ and need a comprehensive audit.', date: 'Mar 14, 2026', status: 'new', source: 'Contact Form', color: 'var(--emerald)' },
  { id: 2, name: 'David Chen', email: 'dchen@startupxyz.io', phone: '+1 (555) 345-6789', message: 'Looking for a quote on cloud migration security. Budget around $50-80K for Q2.', date: 'Mar 13, 2026', status: 'new', source: 'Quote Request', color: 'var(--azure)' },
  { id: 3, name: 'Emma Rodriguez', email: 'emma.r@financegroup.com', phone: '+1 (555) 456-7890', message: 'Need compliance consulting for SOC 2 certification. Timeline is 3 months.', date: 'Mar 13, 2026', status: 'new', source: 'Phone Call', color: 'var(--plum)' },
  { id: 4, name: 'James Wilson', email: 'jwilson@retail.co', phone: '+1 (555) 567-8901', message: 'Our POS systems need a security review. 15 locations across the midwest.', date: 'Mar 12, 2026', status: 'contacted', source: 'Contact Form', color: 'var(--amber)' },
  { id: 5, name: 'Lisa Park', email: 'lpark@healthsys.org', phone: '+1 (555) 678-9012', message: 'HIPAA compliance audit needed for our new patient portal. Urgent timeline.', date: 'Mar 11, 2026', status: 'contacted', source: 'Quote Request', color: 'var(--coral)' },
  { id: 6, name: 'Robert Kim', email: 'rkim@edutechco.com', phone: '+1 (555) 789-0123', message: 'Looking for ongoing security monitoring for our SaaS platform.', date: 'Mar 10, 2026', status: 'converted', source: 'Referral', color: 'var(--teal)' },
  { id: 7, name: 'Anna Thompson', email: 'athompson@lawfirm.com', phone: '+1 (555) 890-1234', message: 'Data protection review for client-sensitive legal documents. High priority.', date: 'Mar 9, 2026', status: 'converted', source: 'Contact Form', color: 'var(--rose)' },
  { id: 8, name: 'Mark Stevens', email: 'mstevens@mfg.co', phone: '+1 (555) 901-2345', message: 'OT/ICS security assessment for our manufacturing facility.', date: 'Mar 8, 2026', status: 'archived', source: 'Quote Request', color: 'var(--gray-400)' },
]

const statusMap = { new: { label: 'New', cls: 'db-badge--active' }, contacted: { label: 'Contacted', cls: 'db-badge--pending' }, converted: { label: 'Converted', cls: 'db-badge--positive' }, archived: { label: 'Archived', cls: 'db-badge--inactive' } }

export default function DashboardLeadsPage() {
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const filtered = filter === 'all' ? allLeads : allLeads.filter(l => l.status === filter)

  return (
    <DashboardLayout title="Leads" subtitle={`${allLeads.filter(l => l.status === 'new').length} new inquiries`}>
      <div className="db-stats">
        {[
          { label: 'New Leads', value: allLeads.filter(l => l.status === 'new').length, gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))' },
          { label: 'Contacted', value: allLeads.filter(l => l.status === 'contacted').length, gradient: 'linear-gradient(135deg,var(--amber),var(--coral))' },
          { label: 'Converted', value: allLeads.filter(l => l.status === 'converted').length, gradient: 'linear-gradient(135deg,var(--accent),var(--plum))' },
          { label: 'Total Leads', value: allLeads.length, gradient: 'linear-gradient(135deg,var(--azure),var(--accent))' },
        ].map(s => (
          <div className="db-stat" key={s.label}>
            <div className="db-stat-icon" style={{ background: s.gradient }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
            </div>
            <div className="db-stat-value">{s.value}</div>
            <div className="db-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="db-card db-full">
        <div className="db-card-header" style={{ flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['all', 'new', 'contacted', 'converted', 'archived'].map(f => (
              <button key={f} className={`db-btn ${filter === f ? 'db-btn--primary' : 'db-btn--outline'}`} style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? allLeads.length : allLeads.filter(l => l.status === f).length})
              </button>
            ))}
          </div>
        </div>
        <div className="db-card-body" style={{ padding: '4px 20px' }}>
          {filtered.map(lead => (
            <div className="db-lead" key={lead.id} style={{ flexDirection: 'column', alignItems: 'stretch', cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="db-lead-icon" style={{ background: lead.color }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{lead.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="db-lead-info">
                  <div className="db-lead-name">{lead.name}</div>
                  <div className="db-lead-detail">{lead.source} &middot; {lead.date}</div>
                </div>
                <span className={`db-badge-pill ${statusMap[lead.status].cls}`}>{statusMap[lead.status].label}</span>
              </div>
              {expandedId === lead.id && (
                <div style={{ marginTop: 12, paddingLeft: 50 }}>
                  <p style={{ fontSize: 13, fontWeight: 350, color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 10 }}>{lead.message}</p>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--gray-400)', marginBottom: 12, flexWrap: 'wrap' }}>
                    <span>{lead.email}</span>
                    <span>{lead.phone}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="db-btn db-btn--primary" style={{ padding: '6px 14px', fontSize: 12 }}>Reply</button>
                    <button className="db-btn db-btn--outline" style={{ padding: '6px 14px', fontSize: 12 }}>Mark Contacted</button>
                    <button className="db-btn db-btn--outline" style={{ padding: '6px 14px', fontSize: 12 }}>Archive</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="db-card-empty">No leads matching this filter</div>}
        </div>
      </div>
    </DashboardLayout>
  )
}
