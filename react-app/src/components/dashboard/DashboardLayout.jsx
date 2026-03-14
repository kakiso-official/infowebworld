import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../../styles/dashboard.css'

const navItems = [
  { label: 'Overview', path: '/dashboard', icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></> },
  { label: 'Analytics', path: '/dashboard/analytics', icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></> },
  { label: 'Leads', path: '/dashboard/leads', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>, badge: '3' },
  { label: 'Reviews', path: '/dashboard/reviews', icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>, badge: '5' },
]

const settingsItems = [
  { label: 'Business Profile', path: '/dashboard/profile', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></> },
  { label: 'Billing & Plan', path: '/dashboard/billing', icon: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></> },
  { label: 'Settings', path: '/dashboard/settings', icon: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></> },
]

export default function DashboardLayout({ title, subtitle, children }) {
  const [sideOpen, setSideOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  return (
    <div className="db">
      {/* Mobile overlay */}
      <div className={`db-overlay${sideOpen ? ' open' : ''}`} onClick={() => setSideOpen(false)} />

      {/* Sidebar */}
      <aside className={`db-side${sideOpen ? ' open' : ''}`}>
        <div className="db-side-header">
          <Link to="/" className="db-side-logo">
            <img src="/logo/infowebworld-logo.png" alt="InfoWebWorld" />
          </Link>
        </div>

        <nav className="db-side-nav">
          <div className="db-side-label">Main</div>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`db-side-link${isActive(item.path) ? ' active' : ''}`}
              onClick={() => setSideOpen(false)}
            >
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
              {item.label}
              {item.badge && <span className="db-badge">{item.badge}</span>}
            </Link>
          ))}

          <div className="db-side-label">Account</div>
          {settingsItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`db-side-link${isActive(item.path) ? ' active' : ''}`}
              onClick={() => setSideOpen(false)}
            >
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="db-side-footer">
          <div className="db-side-user">
            <div className="db-side-avatar">AP</div>
            <div className="db-side-user-info">
              <div className="db-side-user-name">Aadil Parmar</div>
              <div className="db-side-user-plan">Pro Plan</div>
            </div>
            <button className="db-side-logout" onClick={() => navigate('/')} title="Sign out">
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="db-main">
        <header className="db-topbar">
          <div className="db-topbar-left">
            <button className="db-topbar-burger" onClick={() => setSideOpen(true)}>
              <svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <div>
              <div className="db-topbar-title">{title || 'Dashboard'}</div>
              {subtitle && <div className="db-topbar-sub">{subtitle}</div>}
            </div>
          </div>
          <div className="db-topbar-right">
            <button className="db-topbar-btn" title="Notifications">
              <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
              <span className="db-topbar-dot" />
            </button>
            <Link to="/search" className="db-topbar-btn" title="Search">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </Link>
            <Link to="/" className="db-topbar-btn" title="View site">
              <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            </Link>
          </div>
        </header>

        <div className="db-content">
          {children}
        </div>
      </div>
    </div>
  )
}
