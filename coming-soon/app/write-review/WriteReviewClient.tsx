'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/use-auth'
import SignupModal from '../components/auth/SignupModal'
import CompanyPicker, { type CompanyHit } from './CompanyPicker'
import VoiceRecorder from './VoiceRecorder'
import ReviewEditor from './ReviewEditor'

/* ═══════════════════════════════════════════════════════════════════════
   /write-review — full review flow.

   Steps:
     1. pick-company   — autocomplete search (skipped if ?company=<slug>)
     2. pick-method    — Speak it vs Write it
     3a. voice-record  — live MediaRecorder, sends blob to /api/review/transcribe
     3b. (voice path) → confirm-edit using ReviewEditor with the AI draft
     3c. manual        — same ReviewEditor empty
     4. submitted      — success screen

   No audio is uploaded or stored; the blob is streamed to /api/review/transcribe
   and discarded server-side after Gemini returns the text draft.
   ═══════════════════════════════════════════════════════════════════════ */

type Step =
  | 'pick-company'
  | 'pick-method'
  | 'voice-record'
  | 'review-editor'   // shared by both voice-confirm and manual paths
  | 'submitted'

type Method = 'voice' | 'manual'

type Draft = { rating: number; title: string; body: string; language?: string }

export default function WriteReviewClient() {
  const sp = useSearchParams()
  const router = useRouter()
  const { user, loading: authLoading, refresh } = useAuth()

  const companyParam = (sp.get('company') || '').trim()

  const [step, setStep] = useState<Step>(companyParam ? 'pick-method' : 'pick-company')
  const [company, setCompany] = useState<CompanyHit | null>(null)
  const [method, setMethod] = useState<Method | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  /* Fetch company from URL param on mount so step 2 lands with the
     company already resolved. We use the same /api/search/companies
     endpoint with an exact-slug query so existing infra is reused. */
  const fetchingRef = useRef(false)
  useEffect(() => {
    if (!companyParam || fetchingRef.current || company) return
    fetchingRef.current = true
    ;(async () => {
      try {
        const r = await fetch(`/api/search/companies?q=${encodeURIComponent(companyParam)}`)
        const j = await r.json()
        const hit = (j.results as CompanyHit[] | undefined)?.find(c => c.slug === companyParam)
        if (hit) setCompany(hit)
        else {
          /* If exact match isn't first, take the top result so the page
             still works even if the slug is stale. */
          const top = j.results?.[0] as CompanyHit | undefined
          if (top) setCompany(top)
          else setStep('pick-company')
        }
      } catch {
        setStep('pick-company')
      } finally { fetchingRef.current = false }
    })()
  }, [companyParam, company])

  const handlePickCompany = useCallback((c: CompanyHit) => {
    setCompany(c)
    /* Push the slug into the URL so reload / bookmark / share carries it. */
    const url = new URL(window.location.href)
    url.searchParams.set('company', c.slug)
    window.history.replaceState({}, '', url.toString())
    setStep('pick-method')
  }, [])

  const handlePickMethod = useCallback((m: Method) => {
    setMethod(m)
    if (m === 'voice') setStep('voice-record')
    else { setDraft({ rating: 0, title: '', body: '' }); setStep('review-editor') }
  }, [])

  const handleDraftReady = useCallback((d: Draft) => {
    setDraft(d)
    setStep('review-editor')
  }, [])

  const handleSubmit = useCallback(async (payload: { rating: number; title: string; body: string }) => {
    if (!company) return
    if (!user) { setAuthOpen(true); return }
    setSubmitting(true); setSubmitError('')
    try {
      const r = await fetch(`/api/listings/${encodeURIComponent(company.slug)}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok || !j.ok) {
        setSubmitError(j.error || 'Could not save your review.')
      } else {
        setStep('submitted')
      }
    } catch {
      setSubmitError('Network error — please try again.')
    } finally { setSubmitting(false) }
  }, [company, user])

  /* When the auth modal succeeds and the user is back, re-fire the submit
     if a draft is in hand. */
  const handleAuthSuccess = useCallback(() => {
    setAuthOpen(false)
    refresh()
  }, [refresh])

  const resetToCompanyPick = () => {
    setCompany(null)
    setMethod(null)
    setDraft(null)
    setStep('pick-company')
    const url = new URL(window.location.href)
    url.searchParams.delete('company')
    window.history.replaceState({}, '', url.toString())
  }

  /* ── Render ─────────────────────────────────────────────────────────── */
  const isLanding = step === 'pick-company'

  return (
    <main className={'wr-page' + (isLanding ? ' wr-page--landing' : '')}>
      {/* ── Step 1 landing — minimal centered hero: title + subtitle +
              search bar. No mascot. ── */}
      {isLanding && (
        <div className="wr-land">
          <div className="wr-land-copy">
            <h1 className="wr-land-title">Which company would you like to review?</h1>
            <p className="wr-land-sub">
              Search to find the business you want to review — pick the right one and we&rsquo;ll
              walk you through the rest.
            </p>
          </div>

          <div className="wr-land-search">
            <CompanyPicker onPick={handlePickCompany} />
          </div>
        </div>
      )}

      <div className={'wr-wrap' + (isLanding ? ' wr-wrap--hidden' : '')}>

        {company && step !== 'submitted' && (
          <div className="wr-company">
            <div className="wr-company-id">
              {company.logoUrl
                ? <img className="wr-company-logo" src={company.logoUrl} alt="" />
                : <span className="wr-company-logo wr-company-logo--ph">{company.companyName.slice(0, 2).toUpperCase()}</span>}
              <div>
                <div className="wr-company-eyebrow">Reviewing</div>
                <div className="wr-company-name">{company.companyName}</div>
                {company.category?.name && (
                  <div className="wr-company-cat" style={{ color: company.category.color || '#4B5563' }}>
                    {company.category.name}
                  </div>
                )}
              </div>
            </div>
            <button type="button" className="wr-company-change" onClick={resetToCompanyPick}>
              Change company
            </button>
          </div>
        )}

        {/* Step 1 (pick company) is rendered outside .wr-wrap above as the
            full-bleed cream landing — see `isLanding` block. */}

        {/* ── Step 2: pick method ── */}
        {step === 'pick-method' && company && (
          <div className="wr-method-grid">
            <button
              type="button"
              className="wr-method"
              onClick={() => handlePickMethod('voice')}
            >
              <span className="wr-method-ico wr-method-ico--voice">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
                     stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </span>
              <span className="wr-method-name">Speak your review</span>
              <span className="wr-method-desc">
                Hit record, say what you think for up to 3 minutes. We will turn it into
                a polished English review you can edit before publishing.
              </span>
              <span className="wr-method-tag">Fastest · AI-assisted</span>
            </button>

            <button
              type="button"
              className="wr-method"
              onClick={() => handlePickMethod('manual')}
            >
              <span className="wr-method-ico">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
                     stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </span>
              <span className="wr-method-name">Write it yourself</span>
              <span className="wr-method-desc">
                Pick stars, write a title, write the body. The classic flow — no microphone
                needed.
              </span>
              <span className="wr-method-tag">Manual · Full control</span>
            </button>
          </div>
        )}

        {/* ── Step 3a: voice record ── */}
        {step === 'voice-record' && company && (
          <VoiceRecorder
            companyName={company.companyName}
            onDraftReady={handleDraftReady}
            onCancel={() => setStep('pick-method')}
            onSwitchToManual={() => {
              setMethod('manual')
              setDraft({ rating: 0, title: '', body: '' })
              setStep('review-editor')
            }}
          />
        )}

        {/* ── Step 3b: editor (shared by voice-confirm + manual) ── */}
        {step === 'review-editor' && company && draft && (
          <ReviewEditor
            initial={draft}
            generated={method === 'voice'}
            submitting={submitting}
            submitError={submitError}
            onBack={() => setStep(method === 'voice' ? 'voice-record' : 'pick-method')}
            onSubmit={handleSubmit}
            isAuthed={!!user}
            onRequestLogin={() => setAuthOpen(true)}
          />
        )}

        {/* ── Step 4: success ── */}
        {step === 'submitted' && company && (
          <div className="wr-success">
            <div className="wr-success-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="36" height="36">
                <path d="M5 12l5 5 9-11" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="wr-success-title">Thanks — your review is in.</h2>
            <p className="wr-success-desc">
              We&apos;ll moderate it shortly. Once approved it appears on{' '}
              <Link href={`/company/${company.slug}`} className="wr-success-link">
                {company.companyName}&apos;s page
              </Link>{' '}
              within a day.
            </p>
            <div className="wr-success-actions">
              <Link href={`/company/${company.slug}`} className="wr-btn wr-btn--ghost">
                See the listing
              </Link>
              <Link href="/categories" className="wr-btn wr-btn--primary">
                Review another company
              </Link>
            </div>
          </div>
        )}
      </div>

      <SignupModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode="login"
        onSuccess={handleAuthSuccess}
      />
    </main>
  )
}
