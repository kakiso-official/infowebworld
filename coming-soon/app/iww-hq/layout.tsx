'use client'
import { useState, useEffect } from 'react'
import { clearSession } from './utils/hash'
import AdminLogin from './components/AdminLogin'
import AdminShell from './components/AdminShell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/me', { credentials: 'same-origin', cache: 'no-store' })
      .then((res) => {
        if (cancelled) return
        if (res.ok) {
          setAuthed(true)
        } else {
          clearSession()
          setAuthed(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearSession()
          setAuthed(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  if (authed === null) return null // loading / hydration guard

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />

  return <>
    <meta name="robots" content="noindex, nofollow" />
    <AdminShell onLogout={() => setAuthed(false)}>{children}</AdminShell>
  </>
}
