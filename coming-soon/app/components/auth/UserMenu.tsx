'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/use-auth'
import SignupModal from './SignupModal'

/**
 * Header auth affordance. Two states:
 * - Logged out → compact "Sign in" pill that opens the signup modal
 * - Logged in → avatar + dropdown (Dashboard, Sign out)
 *
 * Mounted in Navbar's .nh-actions row. Matches the neo-brutalism palette
 * (coral, black, cream, white) — same visual language as the listing form.
 */
export default function UserMenu() {
  const { user, loading, logout } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropOpen) return
    const click = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setDropOpen(false)
    }
    document.addEventListener('mousedown', click)
    return () => document.removeEventListener('mousedown', click)
  }, [dropOpen])

  if (loading) return null

  if (!user) {
    return (
      <>
        <button type="button" className="um-signin" onClick={() => setModalOpen(true)}>
          Sign in
        </button>
        <SignupModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          initialMode="login"
        />
      </>
    )
  }

  const initials = (user.name || user.email).trim().slice(0, 2).toUpperCase()

  return (
    <div className="um-wrap" ref={wrapRef}>
      <button type="button" className="um-trigger"
        onClick={() => setDropOpen(o => !o)}
        aria-haspopup="true" aria-expanded={dropOpen}
        aria-label="Account menu">
        <span className="um-avatar">
          {user.avatarUrl
            ? <img src={user.avatarUrl} alt="" />
            : <span>{initials}</span>}
        </span>
      </button>

      {dropOpen && (
        <div className="um-drop" role="menu">
          <div className="um-drop-head">
            <div className="um-drop-name">{user.name || user.email.split('@')[0]}</div>
            <div className="um-drop-email">{user.email}</div>
          </div>
          <Link href="/dashboard" className="um-drop-item" onClick={() => setDropOpen(false)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
            </svg>
            Dashboard
          </Link>
          <Link href="/dashboard/new" className="um-drop-item" onClick={() => setDropOpen(false)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New listing
          </Link>
          <div className="um-drop-sep" />
          <button type="button" className="um-drop-item um-drop-item--danger"
            onClick={async () => { await logout(); setDropOpen(false); window.location.href = '/' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
