import { Link } from 'react-router-dom'

const actions = [
  {
    to: '/dashboard/profile',
    label: 'Edit Profile',
    desc: 'Update your business info and media',
    gradient: 'linear-gradient(135deg,var(--accent),var(--plum))',
    icon: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    badge: null,
  },
  {
    to: '/dashboard/analytics',
    label: 'Analytics',
    desc: 'Track views, clicks, and conversions',
    gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))',
    icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
    badge: null,
  },
  {
    to: '/dashboard/reviews',
    label: 'Reviews',
    desc: 'Read and respond to feedback',
    gradient: 'linear-gradient(135deg,var(--amber),var(--coral))',
    icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>,
    badge: 5,
  },
  {
    to: '/dashboard/leads',
    label: 'Leads',
    desc: 'Manage incoming inquiries',
    gradient: 'linear-gradient(135deg,var(--azure),var(--accent))',
    icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    badge: 3,
  },
  {
    to: '/submit-listing',
    label: 'Add Listing',
    desc: 'Create a new business listing',
    gradient: 'linear-gradient(135deg,var(--rose),var(--plum))',
    icon: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    badge: null,
  },
  {
    to: '/dashboard/billing',
    label: 'Billing',
    desc: 'Invoices, plans, and payment',
    gradient: 'linear-gradient(135deg,var(--teal),var(--emerald))',
    icon: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></>,
    badge: null,
  },
]

const hoverStyle = `
.db-quick-action-enhanced:hover .db-qa-label-text {
  background: var(--qa-grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.db-quick-action-enhanced:hover .db-qa-desc {
  color: var(--text-secondary) !important;
}
`

export default function QuickActionsGrid() {
  return (
    <div className="db-quick-actions">
      <style>{hoverStyle}</style>
      {actions.map(a => {
        return (
          <Link
            key={a.to}
            to={a.to}
            className="db-quick-action db-quick-action-enhanced"
            style={{
              '--qa-grad': a.gradient,
              position: 'relative',
            }}
          >
            <div className="db-quick-action-icon" style={{ background: a.gradient, position: 'relative' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{a.icon}</svg>
              {a.badge && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: 'var(--coral)',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,.2)',
                  border: '2px solid #fff',
                  lineHeight: 1,
                }}>
                  {a.badge}
                </span>
              )}
            </div>
            <span className="db-qa-label-text" style={{ fontWeight: 500, fontSize: 13, transition: 'all .2s' }}>{a.label}</span>
            <span className="db-qa-desc" style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              marginTop: 2,
              lineHeight: 1.3,
              transition: 'color .2s',
            }}>
              {a.desc}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
