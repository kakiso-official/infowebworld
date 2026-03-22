'use client'
import { useState, useEffect } from 'react'
import { checkSession } from './utils/hash'
import AdminLogin from './components/AdminLogin'
import AdminShell from './components/AdminShell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => { setAuthed(checkSession()) }, [])

  if (authed === null) return null // SSR/hydration guard

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />

  return <AdminShell onLogout={() => setAuthed(false)}>{children}</AdminShell>
}
