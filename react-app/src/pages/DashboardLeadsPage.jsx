import { useState } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'

/* ── Sparkline ── */
function Spark({ data, color = 'var(--accent)', w = 70, h = 24 }) {
  const max = Math.max(...data), min = Math.min(...data)
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 4) - 2}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <polygon points={`${pts} ${w},${h} 0,${h}`} fill={color} opacity=".12" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Lead data ── */
const allLeads = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah.m@techcorp.com', phone: '+1 (555) 234-5678', company: 'TechCorp Inc.', role: 'VP of Engineering', message: 'Interested in your enterprise security solutions. We have a team of 200+ and need a comprehensive audit. Looking to start Q2 2026.', date: 'Mar 14, 2026', time: '2:34 PM', status: 'new', source: 'Contact Form', priority: 'high', value: '$75,000', color: 'var(--emerald)', tags: ['Enterprise', 'Audit', 'Urgent'] },
  { id: 2, name: 'David Chen', email: 'dchen@startupxyz.io', phone: '+1 (555) 345-6789', company: 'StartupXYZ', role: 'CTO', message: 'Looking for a quote on cloud migration security. Budget around $50-80K for Q2. Need someone who understands AWS and Azure environments.', date: 'Mar 13, 2026', time: '11:15 AM', status: 'new', source: 'Quote Request', priority: 'high', value: '$65,000', color: 'var(--azure)', tags: ['Cloud', 'Migration', 'AWS'] },
  { id: 3, name: 'Emma Rodriguez', email: 'emma.r@financegroup.com', phone: '+1 (555) 456-7890', company: 'FinanceGroup', role: 'Compliance Officer', message: 'Need compliance consulting for SOC 2 certification. Timeline is 3 months. Currently have no formal security framework in place.', date: 'Mar 13, 2026', time: '9:42 AM', status: 'new', source: 'Phone Call', priority: 'medium', value: '$45,000', color: 'var(--plum)', tags: ['Compliance', 'SOC 2'] },
  { id: 4, name: 'James Wilson', email: 'jwilson@retail.co', phone: '+1 (555) 567-8901', company: 'RetailCo', role: 'IT Director', message: 'Our POS systems need a security review. 15 locations across the midwest. Also interested in ongoing monitoring.', date: 'Mar 12, 2026', time: '4:18 PM', status: 'contacted', source: 'Contact Form', priority: 'medium', value: '$35,000', color: 'var(--amber)', tags: ['Retail', 'POS', 'Monitoring'], lastContact: 'Sent proposal via email', lastContactDate: 'Mar 13, 2026' },
  { id: 5, name: 'Lisa Park', email: 'lpark@healthsys.org', phone: '+1 (555) 678-9012', company: 'HealthSys', role: 'CISO', message: 'HIPAA compliance audit needed for our new patient portal. Urgent timeline — board review next month.', date: 'Mar 11, 2026', time: '10:05 AM', status: 'contacted', source: 'Quote Request', priority: 'high', value: '$55,000', color: 'var(--coral)', tags: ['Healthcare', 'HIPAA', 'Urgent'], lastContact: 'Follow-up call scheduled', lastContactDate: 'Mar 12, 2026' },
  { id: 6, name: 'Robert Kim', email: 'rkim@edutechco.com', phone: '+1 (555) 789-0123', company: 'EduTech Co.', role: 'Head of Product', message: 'Looking for ongoing security monitoring for our SaaS platform. 50K+ student users. Annual contract preferred.', date: 'Mar 10, 2026', time: '3:30 PM', status: 'converted', source: 'Referral', priority: 'medium', value: '$42,000', color: 'var(--teal)', tags: ['SaaS', 'Monitoring', 'Education'], lastContact: 'Contract signed', lastContactDate: 'Mar 14, 2026' },
  { id: 7, name: 'Anna Thompson', email: 'athompson@lawfirm.com', phone: '+1 (555) 890-1234', company: 'Thompson & Associates', role: 'Managing Partner', message: 'Data protection review for client-sensitive legal documents. High priority. Need NDA before proceeding.', date: 'Mar 9, 2026', time: '1:22 PM', status: 'converted', source: 'Contact Form', priority: 'high', value: '$38,000', color: 'var(--rose)', tags: ['Legal', 'Data Protection', 'NDA'], lastContact: 'Project kickoff meeting', lastContactDate: 'Mar 13, 2026' },
  { id: 8, name: 'Mark Stevens', email: 'mstevens@mfg.co', phone: '+1 (555) 901-2345', company: 'MFG Industries', role: 'Operations Manager', message: 'OT/ICS security assessment for our manufacturing facility. Government contract requires it.', date: 'Mar 8, 2026', time: '8:50 AM', status: 'archived', source: 'Quote Request', priority: 'low', value: '$28,000', color: 'var(--gray-400)', tags: ['Manufacturing', 'OT/ICS', 'Government'] },
  { id: 9, name: 'Priya Sharma', email: 'psharma@globalretail.in', phone: '+91 98765 43210', company: 'GlobalRetail India', role: 'Security Architect', message: 'Multi-region deployment security review. Need expertise in APAC compliance regulations. 300+ microservices.', date: 'Mar 7, 2026', time: '6:15 AM', status: 'contacted', source: 'Referral', priority: 'high', value: '$95,000', color: 'var(--accent)', tags: ['Enterprise', 'APAC', 'Microservices'], lastContact: 'Technical deep-dive call', lastContactDate: 'Mar 11, 2026' },
  { id: 10, name: 'Tom Bradley', email: 'tbradley@finserv.com', phone: '+1 (555) 012-3456', company: 'FinServ Capital', role: 'CFO', message: 'Annual penetration testing and vulnerability assessment. Previous vendor contract ending. Budget approved.', date: 'Mar 6, 2026', time: '2:00 PM', status: 'new', source: 'Contact Form', priority: 'medium', value: '$52,000', color: 'var(--emerald)', tags: ['Finance', 'PenTest', 'Annual'] },
  { id: 11, name: 'Michelle Lee', email: 'mlee@cloudnative.dev', phone: '+1 (555) 123-4567', company: 'CloudNative Dev', role: 'CEO', message: 'Startup looking for security-as-a-service. Need to pass enterprise customer security questionnaires to close deals.', date: 'Mar 5, 2026', time: '11:30 AM', status: 'contacted', source: 'Phone Call', priority: 'medium', value: '$30,000', color: 'var(--azure)', tags: ['Startup', 'SecaaS', 'Questionnaires'], lastContact: 'Demo completed', lastContactDate: 'Mar 10, 2026' },
  { id: 12, name: 'Carlos Mendez', email: 'cmendez@logistix.com', phone: '+1 (555) 234-5679', company: 'Logistix Corp', role: 'IT Manager', message: 'Supply chain security review. ISO 27001 readiness assessment. 5 warehouses and central HQ.', date: 'Mar 4, 2026', time: '9:00 AM', status: 'archived', source: 'Quote Request', priority: 'low', value: '$22,000', color: 'var(--gray-400)', tags: ['Logistics', 'ISO 27001', 'Supply Chain'] },
]

const statusMap = {
  new: { label: 'New', cls: 'db-badge--active', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707' },
  contacted: { label: 'Contacted', cls: 'db-badge--pending', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  converted: { label: 'Converted', cls: 'db-badge--positive', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  archived: { label: 'Archived', cls: 'db-badge--inactive', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
}

const priorityMap = {
  high: { label: 'High', color: 'var(--coral)', bg: 'rgba(239,107,74,.08)' },
  medium: { label: 'Medium', color: 'var(--amber)', bg: 'rgba(245,158,11,.08)' },
  low: { label: 'Low', color: 'var(--gray-400)', bg: 'rgba(156,163,175,.08)' },
}

const sourceIcons = {
  'Contact Form': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'Quote Request': 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  'Phone Call': 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  'Referral': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
}

/* Pipeline stages for funnel */
const pipeline = [
  { stage: 'New Leads', count: 4, value: '$237K', pct: 100, color: 'var(--accent)' },
  { stage: 'Contacted', count: 4, value: '$215K', pct: 85, color: 'var(--azure)' },
  { stage: 'Proposal Sent', count: 3, value: '$175K', pct: 65, color: 'var(--emerald)' },
  { stage: 'Negotiation', count: 2, value: '$130K', pct: 45, color: 'var(--amber)' },
  { stage: 'Converted', count: 2, value: '$80K', pct: 30, color: 'var(--plum)' },
]

const weeklyLeads = [
  { week: 'W1', leads: 8 },
  { week: 'W2', leads: 12 },
  { week: 'W3', leads: 10 },
  { week: 'W4', leads: 15 },
  { week: 'W5', leads: 11 },
  { week: 'W6', leads: 18 },
  { week: 'W7', leads: 14 },
  { week: 'W8', leads: 22 },
]

const sourceBreakdown = [
  { source: 'Contact Form', count: 5, pct: 42, color: 'var(--accent)' },
  { source: 'Quote Request', count: 4, pct: 33, color: 'var(--emerald)' },
  { source: 'Phone Call', count: 2, pct: 17, color: 'var(--azure)' },
  { source: 'Referral', count: 2, pct: 17, color: 'var(--amber)' },
]

const recentActivity = [
  { text: 'Sarah Mitchell submitted a new inquiry via Contact Form', time: '2 hours ago', color: 'var(--emerald)' },
  { text: 'You replied to David Chen\'s quote request', time: '5 hours ago', color: 'var(--azure)' },
  { text: 'Robert Kim\'s deal was marked as converted — $42K', time: '1 day ago', color: 'var(--plum)' },
  { text: 'Follow-up reminder: Lisa Park (HealthSys) — 2 days overdue', time: '1 day ago', color: 'var(--coral)' },
  { text: 'Priya Sharma scheduled a technical deep-dive call', time: '3 days ago', color: 'var(--accent)' },
  { text: 'Anna Thompson signed the contract — $38K closed', time: '3 days ago', color: 'var(--teal)' },
]

export default function DashboardLeadsPage() {
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState('list')

  const filtered = allLeads
    .filter(l => filter === 'all' || l.status === filter)
    .filter(l => !searchQuery || l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.company.toLowerCase().includes(searchQuery.toLowerCase()) || l.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === 'value') return parseInt(b.value.replace(/\D/g, '')) - parseInt(a.value.replace(/\D/g, ''))
      if (sortBy === 'priority') { const o = { high: 0, medium: 1, low: 2 }; return o[a.priority] - o[b.priority] }
      return 0 // date is default order
    })

  const totalValue = allLeads.filter(l => l.status !== 'archived').reduce((a, l) => a + parseInt(l.value.replace(/\D/g, '')), 0)
  const newCount = allLeads.filter(l => l.status === 'new').length
  const contactedCount = allLeads.filter(l => l.status === 'contacted').length
  const convertedCount = allLeads.filter(l => l.status === 'converted').length
  const convRate = Math.round((convertedCount / (allLeads.length - allLeads.filter(l => l.status === 'archived').length)) * 100)
  const maxWeekly = Math.max(...weeklyLeads.map(w => w.leads))

  return (
    <DashboardLayout title="Leads" subtitle={`${newCount} new inquiries`}>
      {/* ═══ Hero Banner ═══ */}
      <div className="db-welcome">
        <div className="db-welcome-bg" style={{ background: 'linear-gradient(135deg, #059669 0%, #0d9488 40%, #0891b2 70%, #0284c7 100%)' }} />
        <div className="db-welcome-content">
          <div className="db-welcome-text">
            <div className="db-welcome-title">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span className="an-pulse" style={{ background: '#fbbf24' }} />
                Lead Pipeline — ${ (totalValue / 1000).toFixed(0) }K in progress
              </span>
            </div>
            <div className="db-welcome-desc">
              You have <strong>{newCount} new leads</strong> waiting for response. Average response time is <strong>2.4 hours</strong>.
              Your conversion rate this month is <strong>{convRate}%</strong> — up 8% from last month. Keep the momentum going!
            </div>
            <div className="db-welcome-actions">
              <button className="db-btn" style={{ background: '#fff', color: '#059669' }}>Export All Leads</button>
              <button className="db-btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '1px solid rgba(255,255,255,.25)' }}>Import CSV</button>
            </div>
          </div>
          <div className="db-welcome-stats-mini">
            <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#4ade80' }} /> {newCount} new leads</div>
            <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#facc15' }} /> {contactedCount} in progress</div>
            <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#38bdf8' }} /> ${(totalValue / 1000).toFixed(0)}K pipeline</div>
          </div>
        </div>
      </div>

      {/* ═══ Stats Row with Sparklines ═══ */}
      <div className="db-stats">
        {[
          { label: 'New Leads', value: newCount, sub: '+4 this week', gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))', spark: [3,5,4,6,8,7,9,12], sparkColor: 'var(--emerald)', icon: 'M12 4v16m8-8H4' },
          { label: 'Response Time', value: '2.4h', sub: '32% faster', gradient: 'linear-gradient(135deg,var(--azure),var(--accent))', spark: [8,6,7,5,4,5,3,2], sparkColor: 'var(--azure)', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Conversion Rate', value: `${convRate}%`, sub: '+8% vs last month', gradient: 'linear-gradient(135deg,var(--accent),var(--plum))', spark: [12,14,13,16,18,17,20,22], sparkColor: 'var(--accent)', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
          { label: 'Pipeline Value', value: `$${(totalValue / 1000).toFixed(0)}K`, sub: '10 active deals', gradient: 'linear-gradient(135deg,var(--amber),var(--coral))', spark: [180,200,220,210,240,260,280,320], sparkColor: 'var(--amber)', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map(s => (
          <div className="db-stat" key={s.label}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="db-stat-icon" style={{ background: s.gradient }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
              </div>
              <Spark data={s.spark} color={s.sparkColor} />
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

      <div className="db-grid-2">
        {/* ═══ Sales Pipeline Funnel ═══ */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
              Sales Pipeline
            </div>
            <span className="db-card-action">{convRate}% win rate</span>
          </div>
          <div className="db-card-body">
            {pipeline.map((p, i) => (
              <div className="db-funnel-step" key={p.stage}>
                <div className="db-funnel-info" style={{ marginBottom: 4 }}>
                  <span className="db-funnel-label">{p.stage}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)', marginRight: 6 }}>{p.count} leads</span>
                  <span className="db-funnel-value">{p.value}</span>
                  {i > 0 && <span className="db-funnel-conv">{Math.round((p.count / pipeline[i - 1].count) * 100)}%</span>}
                </div>
                <div className="db-funnel-bar-wrap">
                  <div className="db-funnel-bar" style={{ width: `${p.pct}%`, background: p.color, opacity: .65 }} />
                </div>
              </div>
            ))}
            {/* Pipeline total */}
            <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--r-sm)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-700)' }}>Total Pipeline Value</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--emerald)' }}>${(totalValue / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>

        {/* ═══ Lead Sources + Weekly Trend ═══ */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
              Lead Sources & Trend
            </div>
          </div>
          <div className="db-card-body">
            {/* Source donut */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
                {(() => {
                  let acc = 0
                  return sourceBreakdown.map(s => {
                    const start = (acc / 100) * 360
                    acc += s.pct
                    const end = (acc / 100) * 360
                    const sR = ((start - 90) * Math.PI) / 180, eR = ((end - 90) * Math.PI) / 180
                    const r = 40, cx = 50, cy = 50
                    const x1 = cx + r * Math.cos(sR), y1 = cy + r * Math.sin(sR)
                    const x2 = cx + r * Math.cos(eR), y2 = cy + r * Math.sin(eR)
                    return <path key={s.source} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${end - start > 180 ? 1 : 0} 1 ${x2} ${y2} Z`} fill={s.color} opacity=".7" />
                  })
                })()}
                <circle cx="50" cy="50" r="24" fill="#fff" />
                <text x="50" y="48" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--gray-900)">{allLeads.length}</text>
                <text x="50" y="59" textAnchor="middle" fontSize="8" fill="var(--gray-400)" fontWeight="300">total</text>
              </svg>
              <div style={{ flex: 1 }}>
                {sourceBreakdown.map(s => (
                  <div key={s.source} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 400, color: 'var(--gray-600)' }}>{s.source}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-800)' }}>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Weekly bar chart */}
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 10 }}>Weekly Trend</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
              {weeklyLeads.map((w, i) => (
                <div key={w.week} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 500, color: 'var(--gray-600)' }}>{w.leads}</span>
                  <div style={{ width: '100%', height: `${(w.leads / maxWeekly) * 56}px`, background: i === weeklyLeads.length - 1 ? 'var(--accent)' : 'var(--accent)', borderRadius: '3px 3px 0 0', opacity: i === weeklyLeads.length - 1 ? .85 : .35 }} />
                  <span style={{ fontSize: 9, color: 'var(--gray-400)', fontWeight: 300 }}>{w.week}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Lead List Section ═══ */}
      <div className="db-card db-full">
        <div className="db-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
            {['all', 'new', 'contacted', 'converted', 'archived'].map(f => (
              <button key={f} className={`db-btn ${filter === f ? 'db-btn--primary' : 'db-btn--outline'}`} style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? allLeads.length : allLeads.filter(l => l.status === f).length})
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', stroke: 'var(--gray-400)', fill: 'none', strokeWidth: 1.5 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input
                className="db-form-input"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 30, width: 180, height: 34, fontSize: 12, margin: 0 }}
              />
            </div>
            {/* Sort */}
            <select className="db-form-select" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 120, height: 34, fontSize: 12, padding: '0 28px 0 10px', margin: 0 }}>
              <option value="date">Newest</option>
              <option value="value">Highest Value</option>
              <option value="priority">Priority</option>
            </select>
            {/* View toggle */}
            <div style={{ display: 'flex', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
              <button onClick={() => setViewMode('list')} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: viewMode === 'list' ? 'var(--accent-soft)' : '#fff' }}>
                <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: viewMode === 'list' ? 'var(--accent)' : 'var(--gray-400)', fill: 'none', strokeWidth: 1.5 }}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
              </button>
              <button onClick={() => setViewMode('grid')} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderLeft: '1px solid var(--gray-200)', cursor: 'pointer', background: viewMode === 'grid' ? 'var(--accent-soft)' : '#fff' }}>
                <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: viewMode === 'grid' ? 'var(--accent)' : 'var(--gray-400)', fill: 'none', strokeWidth: 1.5 }}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Grid View ── */}
        {viewMode === 'grid' ? (
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
        ) : (
          /* ── List View ── */
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
        )}
      </div>

      {/* ═══ Recent Activity + Quick Stats ═══ */}
      <div className="db-grid-2">
        {/* Activity Feed */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              Recent Activity
            </div>
          </div>
          <div className="db-card-body" style={{ padding: '4px 20px' }}>
            {recentActivity.map((a, i) => (
              <div className="db-activity-item" key={i}>
                <div className="db-activity-dot" style={{ background: a.color }} />
                <div className="db-activity-text" dangerouslySetInnerHTML={{ __html: a.text.replace(/\$\d+K/g, '<strong>$&</strong>') }} />
                <div className="db-activity-time">{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Metrics */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Response Performance
            </div>
          </div>
          <div className="db-card-body">
            {[
              { label: 'Avg. First Response', value: '2.4 hours', target: 'Target: < 4h', pct: 85, color: 'var(--emerald)' },
              { label: 'Avg. Time to Convert', value: '4.2 days', target: 'Target: < 7 days', pct: 72, color: 'var(--accent)' },
              { label: 'Follow-up Rate', value: '94%', target: 'Target: > 90%', pct: 94, color: 'var(--azure)' },
              { label: 'Lead Score Accuracy', value: '87%', target: 'ML-powered scoring', pct: 87, color: 'var(--plum)' },
            ].map(m => (
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
      </div>

      {/* ═══ Top Leads by Value ═══ */}
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
    </DashboardLayout>
  )
}
