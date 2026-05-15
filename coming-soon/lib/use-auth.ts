'use client'
import { useEffect, useState, useCallback } from 'react'

export interface AuthUser {
  uuid: string
  email: string
  name: string | null
  avatarUrl: string | null
  provider: string
  emailVerified: boolean
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      const j = await res.json()
      setUser(j.user || null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }, [])

  return { user, loading, refresh, logout }
}
