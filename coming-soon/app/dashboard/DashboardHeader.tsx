'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { I, ic } from '../components/icons'
import { useDashboardCtx } from './DashboardShell'

export interface CrumbLink { label: string; href: string }

interface Props {
  /** The page <h1>. */
  title: string
  /** Optional supporting line shown below the breadcrumb. */
  subtitle?: React.ReactNode
  /**
   * Breadcrumb trail rendered BELOW the title row.
   * trail = the linked predecessors; current = the final un-linked label.
   */
  breadcrumb?: { trail?: CrumbLink[]; current: string }
}

/**
 * Top-of-page header used on every dashboard page.
 *
 *   ┌─────────────────────────────────────────────────────────┐
 *   │ Page title                            [info][bell][AJ]  │  ← title row
 *   │ Crumb › Crumb › Current                                 │  ← breadcrumb
 *   │ optional subtitle                                       │
 *   └─────────────────────────────────────────────────────────┘
 *
 * Icons + avatar are read from DashboardCtx — pages don't need to thread
 * the user through.
 */
export default function DashboardHeader({ title, subtitle, breadcrumb }: Props) {
  const { user, logout, loggingOut } = useDashboardCtx()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const initials = (user.name || user.email).slice(0, 2).toUpperCase()
  const displayName = user.name || user.email.split('@')[0]

  return (
    <header className="tp-page-head">
      <div className="tp-page-head-row">
        <h1 className="tp-page-title">{title}</h1>

        <div className="tp-page-head-actions">
          <button type="button" className="tp-iconbtn" aria-label="Information">
            <I d={ic.info} size={20} sw={1.7} />
          </button>
          <button type="button" className="tp-iconbtn" aria-label="Notifications">
            <I d={ic.bell} size={20} sw={1.8} />
          </button>
          <div className="tp-userwrap" ref={menuRef}>
            <button
              type="button"
              className={'tp-user' + (menuOpen ? ' tp-user--open' : '')}
              onClick={() => setMenuOpen(v => !v)}
              aria-haspopup="menu" aria-expanded={menuOpen}
              aria-label="Account menu"
            >
              {user.avatarUrl
                ? <img src={user.avatarUrl} alt="" />
                : <span className="tp-user-initials">{initials}</span>}
            </button>
            {menuOpen && (
              <div className="tp-user-menu" role="menu">
                <div className="tp-user-menu-head">
                  <div className="tp-user-menu-name">{displayName}</div>
                  <div className="tp-user-menu-email">{user.email}</div>
                </div>
                <Link href="/dashboard/settings" className="tp-user-menu-item" role="menuitem"
                  onClick={() => setMenuOpen(false)}>Settings</Link>
                <Link href="/" className="tp-user-menu-item" role="menuitem"
                  onClick={() => setMenuOpen(false)}>Browse site</Link>
                <button type="button" className="tp-user-menu-item tp-user-menu-item--danger"
                  onClick={logout} disabled={loggingOut} role="menuitem">
                  {loggingOut ? 'Signing out…' : 'Log out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {breadcrumb && (
        <nav className="tp-breadcrumb" aria-label="Breadcrumb">
          {(breadcrumb.trail || []).map((c, i) => (
            <span key={c.href + i} className="tp-breadcrumb-seg">
              <Link href={c.href}>{c.label}</Link>
              <span className="tp-breadcrumb-sep" aria-hidden="true">›</span>
            </span>
          ))}
          <span className="tp-breadcrumb-current">{breadcrumb.current}</span>
        </nav>
      )}

      {subtitle && <p className="tp-page-sub">{subtitle}</p>}
    </header>
  )
}
