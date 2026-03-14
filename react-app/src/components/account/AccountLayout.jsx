import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../../styles/dashboard.css'

const navItems = [
  { label: 'Overview', path: '/account', icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></> },
  { label: 'My Reviews', path: '/account/reviews', icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>, badge: '12' },
  { label: 'Saved Businesses', path: '/account/saved', icon: <><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></>, badge: '24' },
  { label: 'Notifications', path: '/account/notifications', icon: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>, badge: '7' },
]

const accountItems = [
  { label: 'Public Profile', path: '/profile', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></> },
  { label: 'Settings', path: '/account/settings', icon: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></> },
]

export default function AccountLayout({ title, subtitle, children }) {
  const [sideOpen, setSideOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  return (
    <div className="db">
      <div className={`db-overlay${sideOpen ? ' open' : ''}`} onClick={() => setSideOpen(false)} />

      <aside className={`db-side${sideOpen ? ' open' : ''}`}>
        <div className="db-side-header">
          <Link to="/" className="db-side-logo">
            <img src="/logo/infowebworld-logo.png" alt="InfoWebWorld" />
          </Link>
        </div>

        <nav className="db-side-nav">
          <div className="db-side-label">My Account</div>
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
          {accountItems.map(item => (
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

          {/* Explore section */}
          <div className="db-side-label">Explore</div>
          <Link to="/search" className="db-side-link" onClick={() => setSideOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            Find Businesses
          </Link>
          <Link to="/write-review" className="db-side-link" onClick={() => setSideOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            Write a Review
          </Link>
          <Link to="/category" className="db-side-link" onClick={() => setSideOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
            Browse Categories
          </Link>
        </nav>

        <div className="db-side-footer">
          <div className="db-side-user">
            <div className="db-side-avatar">AP</div>
            <div className="db-side-user-info">
              <div className="db-side-user-name">Aadil Parmar</div>
              <div className="db-side-user-plan">Member since Jan 2025</div>
            </div>
            <button className="db-side-logout" onClick={() => navigate('/')} title="Sign out">
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <div className="db-main">
        <header className="db-topbar">
          <div className="db-topbar-left">
            <button className="db-topbar-burger" onClick={() => setSideOpen(true)}>
              <svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <div>
              <div className="db-topbar-title">{title || 'My Account'}</div>
              {subtitle && <div className="db-topbar-sub">{subtitle}</div>}
            </div>
          </div>
          <div className="db-topbar-right">
            <Link to="/account/notifications" className="db-topbar-btn" title="Notifications">
              <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
              <span className="db-topbar-dot" />
            </Link>
            <Link to="/search" className="db-topbar-btn" title="Search">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </Link>
            <Link to="/" className="db-topbar-btn" title="View site">
              <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            </Link>
          </div>
        </header>
        <div className="db-content">{children}</div>
      </div>
    </div>
  )
}
