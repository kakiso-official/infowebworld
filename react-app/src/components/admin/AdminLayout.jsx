import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../../styles/dashboard.css'
import '../../styles/admin.css'

const navItems = [
  { label: 'Command Center', path: '/admin', icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></> },
  { label: 'Users', path: '/admin/users', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>, badge: '12' },
  { label: 'Listings', path: '/admin/listings', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>, badge: '5' },
  { label: 'Categories', path: '/admin/categories', icon: <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></> },
  { label: 'Reviews', path: '/admin/reviews', icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>, badge: '8' },
]

const systemItems = [
  { label: 'Revenue', path: '/admin/revenue', icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></> },
  { label: 'News', path: '/admin/news', icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></> },
]

export default function AdminLayout({ title, subtitle, children }) {
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
            <span className="adm-badge">Admin</span>
          </Link>
        </div>

        <nav className="db-side-nav">
          <div className="db-side-label">Platform</div>
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

          <div className="db-side-label">System</div>
          {systemItems.map(item => (
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
            <div className="db-side-avatar" style={{ background: 'linear-gradient(135deg, var(--coral), #e74c3c)' }}>SA</div>
            <div className="db-side-user-info">
              <div className="db-side-user-name">Super Admin</div>
              <div className="db-side-user-plan">Platform Owner</div>
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
              <div className="db-topbar-title">{title || 'Admin'}</div>
              {subtitle && <div className="db-topbar-sub">{subtitle}</div>}
            </div>
          </div>
          <div className="db-topbar-right">
            <button className="db-topbar-btn" title="Notifications">
              <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
              <span className="db-topbar-dot" />
            </button>
            <Link to="/admin" className="db-topbar-btn" title="Command Center">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
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
