'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/use-auth'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    google?: any
    __iwwOneTapInit?: boolean
  }
}

/** Paths where we DON'T want to pop the One Tap (logged-in surfaces + admin). */
const SKIP_PREFIXES = ['/dashboard', '/iww-hq']

/**
 * Google One Tap — auto-prompts anonymous visitors with their Google
 * account in the top-right corner, like the Firebase reference. On
 * accept, we POST the ID token to /api/auth/google/one-tap which verifies
 * it and mints a session cookie. The page then refreshes so SSR sees the
 * logged-in state.
 */
export default function GoogleOneTap() {
  const pathname = usePathname() || ''
  const { user, loading, refresh } = useAuth()
  const armedRef = useRef(false)

  useEffect(() => {
    // Don't bother the user if we already know they're signed in, still
    // resolving auth, or they're on a logged-in-only surface.
    if (loading) return
    if (user) return
    if (SKIP_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))) return
    if (armedRef.current) return
    armedRef.current = true

    let cancelled = false

    ;(async () => {
      // Pull the client id from our tiny config endpoint so the GSI lib
      // initializes with the right value without duplicating env vars.
      let clientId = ''
      try {
        const res = await fetch('/api/auth/google/config', { cache: 'force-cache' })
        const j = await res.json()
        clientId = String(j.clientId || '')
      } catch { /* ignore */ }
      if (!clientId || cancelled) return

      await ensureGsiScript()
      if (cancelled) return
      if (!window.google?.accounts?.id) return

      const onCredential = async (resp: { credential: string }) => {
        if (!resp?.credential) return
        try {
          const r = await fetch('/api/auth/google/one-tap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: resp.credential }),
          })
          const j = await r.json()
          if (r.ok && j.ok) {
            refresh()
            window.location.reload() // let server components pick up the session
          }
        } catch { /* ignore */ }
      }

      const tryPrompt = (useFedcm: boolean) => {
        if (!window.google?.accounts?.id) return
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: onCredential,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: useFedcm,
          context: 'signin',
          itp_support: true,
        })
        try {
          window.google.accounts.id.prompt((notification: {
            isNotDisplayed?: () => boolean
            isSkippedMoment?: () => boolean
            isDismissedMoment?: () => boolean
            getNotDisplayedReason?: () => string
            getSkippedReason?: () => string
            getDismissedReason?: () => string
          }) => {
            const reason =
              notification?.isNotDisplayed?.() ? notification.getNotDisplayedReason?.() :
              notification?.isSkippedMoment?.() ? notification.getSkippedReason?.() :
              notification?.isDismissedMoment?.() ? notification.getDismissedReason?.() :
              null
            if (reason) {
              console.info('[GoogleOneTap] not shown:', reason, useFedcm ? '(FedCM)' : '(legacy)')
              // FedCM can fail on first load if the origin isn't registered
              // or third-party cookies are blocked. Fall back once to the
              // legacy UX before giving up.
              if (useFedcm && (reason === 'opt_out_or_no_session' || reason === 'unknown_reason' || reason === 'browser_not_supported' || reason === 'fedcm_disabled')) {
                tryPrompt(false)
              }
            }
          })
        } catch (err) {
          console.info('[GoogleOneTap] prompt threw, trying legacy:', err)
          if (useFedcm) tryPrompt(false)
        }
      }

      // Legacy mode first — avoids the noisy "[GSI_LOGGER]: FedCM get()
      // rejects with AbortError: signal is aborted without reason" console
      // error that fires whenever FedCM's AbortController cancels on
      // navigation/re-render. Legacy still renders the same top-right One
      // Tap card. We'll revisit FedCM when Chrome mandates it.
      tryPrompt(false)
      window.__iwwOneTapInit = true
    })()

    return () => { cancelled = true }
  }, [user, loading, pathname, refresh])

  return null
}

/* ── Loads https://accounts.google.com/gsi/client exactly once. ── */
function ensureGsiScript(): Promise<void> {
  return new Promise(resolve => {
    if (typeof window === 'undefined') { resolve(); return }
    if (window.google?.accounts?.id) { resolve(); return }
    const existing = document.getElementById('gsi-client') as HTMLScriptElement | null
    if (existing) {
      if ((existing as HTMLScriptElement & { __loaded?: boolean }).__loaded) { resolve(); return }
      existing.addEventListener('load', () => resolve(), { once: true })
      return
    }
    const s = document.createElement('script')
    s.id = 'gsi-client'
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.defer = true
    s.addEventListener('load', () => {
      ;(s as HTMLScriptElement & { __loaded?: boolean }).__loaded = true
      resolve()
    })
    s.addEventListener('error', () => resolve()) // don't block; One Tap just won't show
    document.head.appendChild(s)
  })
}
