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
import ListingForm from './ListingForm'

export default function GetListedLanding() {
  const [formOpen, setFormOpen] = useState(false)
  const [formMounted, setFormMounted] = useState(false)

  const openForm = useCallback(() => {
    setFormOpen(true)
    setFormMounted(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    document.body.style.overflow = ''
  }, [])

  /* Reset panel scroll to top each time it opens */
  useEffect(() => {
    if (formOpen) {
      const panel = document.querySelector('.gl-panel')
      if (panel) panel.scrollTop = 0
    }
  }, [formOpen])

  /* Restore body overflow on unmount (e.g. navigating away while panel is open) */
  useEffect(() => {
    return () => { document.body.style.overflow = '' }
  }, [])

  /* Intercept "get-listed" links and pricing CTA — open panel instead of navigating */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const link = el.closest('a[href], button') as HTMLElement | null
      if (!link) return

      /* Don't intercept clicks inside the panel itself */
      if (link.closest('.gl-panel')) return

      const href = link.getAttribute('href') || ''

      /* Links to /business → open panel */
      if (href.includes('/business')) {
        e.preventDefault()
        e.stopPropagation()
        openForm()
        return
      }

      /* Pricing CTA "Claim Founding Spot" → open panel */
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
      {/* Full landing page content — identical to home page */}
      <Hero />
      <Countdown />
      <FoundingCTA />
      <Stats />
      <Benefits />
      <EarlyBirdTiers />
      <Pricing />
      <HowItWorks />
      <Comparison />
      <FinalCTA />

      {/* ── Backdrop overlay ── */}
      <div
        className={`gl-overlay${formOpen ? ' gl-overlay--open' : ''}`}
        onClick={closeForm}
      />

      {/* ── Close button (fixed, above everything) ── */}
      {formOpen && (
        <button className="gl-panel-close" onClick={closeForm} aria-label="Close form">
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {/* ── Slide-in form panel ── */}
      <div className={`gl-panel${formOpen ? ' gl-panel--open' : ''}`}>
        {formMounted && <ListingForm />}
      </div>
    </>
  )
}
