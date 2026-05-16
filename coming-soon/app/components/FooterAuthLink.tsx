'use client'
import { useState, useCallback } from 'react'
import SignupModal from './auth/SignupModal'
import { useAuth } from '@/lib/use-auth'

/**
 * Footer "Business Login" link.
 * - Anonymous: opens the SignupModal (login mode); on success redirects to /dashboard.
 * - Authenticated: navigates directly to /dashboard.
 */
export default function FooterAuthLink({
  label = 'Business Login',
  className = 'ft-col-link',
  nextUrl = '/dashboard',
}: {
  label?: string
  className?: string
  nextUrl?: string
}) {
  const [authOpen, setAuthOpen] = useState(false)
  const { user, loading: authLoading } = useAuth()

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (authLoading) { e.preventDefault(); return }
    if (!user) {
      e.preventDefault()
      setAuthOpen(true)
    }
  }, [user, authLoading])

  return (
    <>
      <a href={nextUrl} onClick={handleClick} className={className}>
        {label}
      </a>
      <SignupModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        nextUrl={nextUrl}
        initialMode="login"
      />
    </>
  )
}
