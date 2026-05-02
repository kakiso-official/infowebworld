'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import FoundingCTA from './components/FoundingCTA'
import Stats from './components/Stats'
import Benefits from './components/Benefits'
import Pricing from './components/Pricing'
import Comparison from './components/Comparison'
import FinalCTA from './components/FinalCTA'
import ScrollToTop from './components/ScrollToTop'
import SignupModal from '../components/auth/SignupModal'
import { useAuth } from '@/lib/use-auth'
import type { PlanKey } from './ListingFormV2'

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

  /** Send authed users straight to the dashboard form; others into the signup modal. */
  const goToPlan = useCallback((plan: PlanKey) => {
    if (authLoading) return
    if (!user) {
      setAuthPlan(plan)
      setAuthOpen(true)
      return
    }
    router.push(`/dashboard/new?plan=${plan}`)
  }, [user, authLoading, router])

  /**
   * Auto-handle ?plan=X coming from old deep-links, PaymentModal success, etc.
   * Route to /dashboard/new?plan=X when authed, otherwise pop the signup modal.
   */
  useEffect(() => {
    if (authLoading) return
    const p = planFromUrl()
    if (!p) return
    if (user) {
      router.replace(`/dashboard/new?plan=${p}`)
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
      <Countdown />
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
        nextUrl={`/dashboard/new?plan=${authPlan}`}
      />
    </>
  )
}
