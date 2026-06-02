'use client'
import { useAuth } from '@/lib/use-auth'

/**
 * Renders its children for logged-out visitors only. Once `useAuth` confirms a
 * signed-in user, the children unmount and nothing is rendered.
 *
 * Hides only when a user is CONFIRMED (not while auth is still loading), so the
 * SSR/initial paint and crawlers keep the content — there's no flash-in for the
 * common logged-out case; it disappears only for signed-in users.
 *
 * Used to hide the footer newsletter from logged-in business users.
 */
export default function LoggedOutOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (user) return null
  return <>{children}</>
}
