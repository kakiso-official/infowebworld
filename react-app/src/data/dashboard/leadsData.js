export const allLeads = [
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

export const statusMap = {
  new: { label: 'New', cls: 'db-badge--active', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707' },
  contacted: { label: 'Contacted', cls: 'db-badge--pending', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  converted: { label: 'Converted', cls: 'db-badge--positive', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  archived: { label: 'Archived', cls: 'db-badge--inactive', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
}

export const priorityMap = {
  high: { label: 'High', color: 'var(--coral)', bg: 'rgba(239,107,74,.08)' },
  medium: { label: 'Medium', color: 'var(--amber)', bg: 'rgba(245,158,11,.08)' },
  low: { label: 'Low', color: 'var(--gray-400)', bg: 'rgba(156,163,175,.08)' },
}

export const sourceIcons = {
  'Contact Form': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'Quote Request': 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  'Phone Call': 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  'Referral': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
}

export const pipeline = [
  { stage: 'New Leads', count: 4, value: '$237K', pct: 100, color: 'var(--accent)' },
  { stage: 'Contacted', count: 4, value: '$215K', pct: 85, color: 'var(--azure)' },
  { stage: 'Proposal Sent', count: 3, value: '$175K', pct: 65, color: 'var(--emerald)' },
  { stage: 'Negotiation', count: 2, value: '$130K', pct: 45, color: 'var(--amber)' },
  { stage: 'Converted', count: 2, value: '$80K', pct: 30, color: 'var(--plum)' },
]

export const weeklyLeads = [
  { week: 'W1', leads: 8 },
  { week: 'W2', leads: 12 },
  { week: 'W3', leads: 10 },
  { week: 'W4', leads: 15 },
  { week: 'W5', leads: 11 },
  { week: 'W6', leads: 18 },
  { week: 'W7', leads: 14 },
  { week: 'W8', leads: 22 },
]

export const sourceBreakdown = [
  { source: 'Contact Form', count: 5, pct: 42, color: 'var(--accent)' },
  { source: 'Quote Request', count: 4, pct: 33, color: 'var(--emerald)' },
  { source: 'Phone Call', count: 2, pct: 17, color: 'var(--azure)' },
  { source: 'Referral', count: 2, pct: 17, color: 'var(--amber)' },
]

export const recentActivity = [
  { text: 'Sarah Mitchell submitted a new inquiry via Contact Form', time: '2 hours ago', color: 'var(--emerald)' },
  { text: 'You replied to David Chen\'s quote request', time: '5 hours ago', color: 'var(--azure)' },
  { text: 'Robert Kim\'s deal was marked as converted — $42K', time: '1 day ago', color: 'var(--plum)' },
  { text: 'Follow-up reminder: Lisa Park (HealthSys) — 2 days overdue', time: '1 day ago', color: 'var(--coral)' },
  { text: 'Priya Sharma scheduled a technical deep-dive call', time: '3 days ago', color: 'var(--accent)' },
  { text: 'Anna Thompson signed the contract — $38K closed', time: '3 days ago', color: 'var(--teal)' },
]
