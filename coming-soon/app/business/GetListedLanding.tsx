'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Hero from './components/Hero'
import FoundingCTA from './components/FoundingCTA'
import Stats from './components/Stats'
import Benefits from './components/Benefits'
import Pricing from './components/Pricing'
import Comparison from './components/Comparison'
import FinalCTA from './components/FinalCTA'
import ScrollToTop from './components/ScrollToTop'
import SignupModal from '../components/auth/SignupModal'
import { useAuth } from '@/lib/use-auth'
import type { PlanKey } from '../dashboard/new/form/DashboardListingForm'

const VALID_PLANS: PlanKey[] = ['free', 'starter', 'yearly', 'lifetime']

function planFromUrl(): PlanKey | null {
  if (typeof window === 'undefined') return null
  const p = new URLSearchParams(window.location.search).get('plan')
  return VALID_PLANS.includes(p as PlanKey) ? (p as PlanKey) : null
}

export default function GetListedLanding() {
  const router = useRouter()
  const [authOpen, setAuthOpen] = useState(false)
  const [authPlan, setAuthPlan] = useState<PlanKey>('free')
  const { user, loading: authLoading } = useAuth()

  /**
   * Auto-handle ?plan=X deep links — route authed users straight to checkout,
   * pop the signup modal for everyone else (lands on checkout post-auth).
   */
  useEffect(() => {
    if (authLoading) return
    const p = planFromUrl()
    if (!p) return
    if (user) {
      router.replace(`/dashboard/new/checkout?plan=${p}`)
    } else {
      setAuthPlan(p)
      setAuthOpen(true)
      const url = new URL(window.location.href)
      url.searchParams.delete('plan')
      window.history.replaceState({}, '', url.toString())
    }
  }, [user, authLoading, router])

  return (
    <>
      <Hero />
      <Benefits />
      <FoundingCTA />
      <Stats />
      <Pricing />
      <Comparison />
      <FinalCTA />
      <ScrollToTop />

      <SignupModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        nextUrl={`/dashboard/new/checkout?plan=${authPlan}`}
      />
    </>
  )
}
