/**
 * Admin UI session hints (sessionStorage only).
 *
 * Real authentication lives in server-side HttpOnly cookies validated via
 * /api/admin/me, /api/admin/login, /api/admin/logout. These helpers are only
 * used as a UX signal so the shell does not flash the login screen when
 * navigating inside an already-authenticated session.
 */

const SESSION_KEY = 'iww_adm'
const EXPIRY_MS = 4 * 60 * 60 * 1000 // 4 hours

export function setSession() {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ t: Date.now() }))
}

export function clearSession() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(SESSION_KEY)
}

export function hasSessionHint(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return false
    const { t } = JSON.parse(raw)
    return Date.now() - t < EXPIRY_MS
  } catch { return false }
}
