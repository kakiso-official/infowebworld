'use client'
import { useState, useEffect, useCallback } from 'react'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import FoundingCTA from './components/FoundingCTA'
import Stats from './components/Stats'
import Benefits from './components/Benefits'
import EarlyBirdTiers from './components/EarlyBirdTiers'
import Pricing from './components/Pricing'
import HowItWorks from './components/HowItWorks'
import Comparison from './components/Comparison'
import FinalCTA from './components/FinalCTA'
import ListingFormV2, { type PlanKey } from './ListingFormV2'
import ScrollToTop from './components/ScrollToTop'

const VALID_PLANS: PlanKey[] = ['free', 'starter', 'yearly', 'lifetime']

function planFromUrl(): PlanKey | null {
  if (typeof window === 'undefined') return null
  const p = new URLSearchParams(window.location.search).get('plan')
  return VALID_PLANS.includes(p as PlanKey) ? (p as PlanKey) : null
}

export default function GetListedLanding() {
  const [formOpen, setFormOpen] = useState(false)
  const [formMounted, setFormMounted] = useState(false)
  const [plan, setPlan] = useState<PlanKey>('free')

  const openForm = useCallback((withPlan?: PlanKey) => {
    if (withPlan) setPlan(withPlan)
    setFormOpen(true)
    setFormMounted(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    document.body.style.overflow = ''
    /* clean ?plan= from URL */
    if (typeof window !== 'undefined' && window.location.search.includes('plan=')) {
      const url = new URL(window.location.href)
      url.searchParams.delete('plan')
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

  /* Auto-open from URL (?plan=X) after modals redirect to /business?plan=X */
  useEffect(() => {
    const p = planFromUrl()
    if (p) {
      setPlan(p)
      openForm(p)
    }
  }, [openForm])

  /* Reset panel scroll to top each time it opens */
  useEffect(() => {
    if (formOpen) {
      const panel = document.querySelector('.gl-panel')
      if (panel) panel.scrollTop = 0
    }
  }, [formOpen])

  /* Restore body overflow on unmount */
  useEffect(() => {
    return () => { document.body.style.overflow = '' }
  }, [])

  /* Intercept /business links — open panel instead of navigating.
     Extracts ?plan= from the href if present. */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const link = el.closest('a[href], button') as HTMLElement | null
      if (!link) return
      if (link.closest('.gl-panel')) return

      const href = link.getAttribute('href') || ''
      if (href.includes('/business')) {
        e.preventDefault()
        e.stopPropagation()
        /* Try to read ?plan= from the link's href */
        try {
          const hrefUrl = new URL(href, window.location.origin)
          const p = hrefUrl.searchParams.get('plan')
          openForm(VALID_PLANS.includes(p as PlanKey) ? (p as PlanKey) : undefined)
        } catch {
          openForm()
        }
        return
      }

      if (link.classList.contains('pr-cta--primary')) {
        e.preventDefault()
        e.stopPropagation()
        openForm()
      }
    }

    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [openForm])

  /* Close on Escape key */
  useEffect(() => {
    if (!formOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeForm()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [formOpen, closeForm])

  return (
    <>
      <Hero />
      <Countdown />
      <Benefits />
      <FoundingCTA />
      <Stats />
      {/* <EarlyBirdTiers /> */}
      <Pricing />
      {/* <HowItWorks /> */}
      <Comparison />
      <FinalCTA />
      <ScrollToTop />

      <div
        className={`gl-overlay${formOpen ? ' gl-overlay--open' : ''}`}
        onClick={closeForm}
      />

      {formOpen && (
        <button className="gl-panel-close" onClick={closeForm} aria-label="Close form">
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      <div className={`gl-panel${formOpen ? ' gl-panel--open' : ''}`}>
        {formMounted && <ListingFormV2 plan={plan} />}
      </div>
    </>
  )
}
