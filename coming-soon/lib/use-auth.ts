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

/* ── Module-level shared auth state ──────────────────────────────────────
   useAuth() is mounted by 15+ components — Navbar, UserMenu, footer links,
   GoogleOneTap, and one BookmarkButton PER listing card. Each instance used
   to fire its own /api/auth/me fetch, so a single category page view cost
   ~15-24 uncacheable function invocations (a top Vercel spend driver in the
   July 2026 audit). All instances now share one fetch + one cached result
   per page load, and a tiny pub-sub keeps every mounted instance in sync
   when auth state changes (login via One Tap, logout, refresh()). */
let cachedUser: AuthUser | null | undefined // undefined = not fetched yet
let inflight: Promise<AuthUser | null> | null = null
const listeners = new Set<(u: AuthUser | null) => void>()

function broadcast(u: AuthUser | null) {
  cachedUser = u
  listeners.forEach((l) => l(u))
}

function fetchMe(force = false): Promise<AuthUser | null> {
  if (!force) {
    if (cachedUser !== undefined) return Promise.resolve(cachedUser)
    if (inflight) return inflight
  }
  /* force always starts a fresh request — returning an in-flight pre-login
     fetch after a modal login would cache the stale anon state. */
  const p: Promise<AuthUser | null> = fetch('/api/auth/me', { cache: 'no-store' })
    .then((r) => r.json())
    .then((j) => {
      broadcast(j.user || null)
      return cachedUser as AuthUser | null
    })
    .catch(() => {
      broadcast(null)
      return null
    })
    .finally(() => {
      if (inflight === p) inflight = null
    })
  inflight = p
  return p
}

/** Force-refresh the shared auth state from anywhere (e.g. SignupModal after
    a login that doesn't reload the page). All mounted useAuth() instances
    update via the pub-sub — without this, the module cache would keep
    serving the stale anon state until a full reload. */
export function refreshAuth(): Promise<AuthUser | null> {
  return fetchMe(true)
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(cachedUser ?? null)
  const [loading, setLoading] = useState(cachedUser === undefined)

  useEffect(() => {
    const listener = (u: AuthUser | null) => {
      setUser(u)
      setLoading(false)
    }
    listeners.add(listener)
    fetchMe().then(() => {
      setUser(cachedUser ?? null)
      setLoading(false)
    })
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const refresh = useCallback(async () => {
    await fetchMe(true)
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    broadcast(null)
  }, [])

  return { user, loading, refresh, logout }
}
