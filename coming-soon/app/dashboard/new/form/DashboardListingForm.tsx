'use client'
/**
 * DashboardListingForm — replacement for ListingFormV2.
 *
 * Two-pane layout (220px left rail + content area). Captures every field the
 * live ListingDetailPage renders. Plan-gated extras render visible-but-locked
 * with an inline upgrade affordance instead of being hidden.
 *
 * State, draft autosave, validation and submit all live here. All rendering
 * is in form/steps/ and form/components/.
 */
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Country } from 'country-state-city'
import { addSubmission } from '../../../iww-hq/data/submissions-storage'
import { fetchLaunchedCategories } from '../../../iww-hq/data/category-storage'
import type { Category } from '../../../iww-hq/data/category-storage'
import { fetchAllTagGroups } from '../../../iww-hq/data/tag-storage'
import type { TagGroup } from '../../../iww-hq/data/tag-storage'
import { fetchListingTypes } from '../../../iww-hq/data/listing-type-storage'
import type { ListingType } from '../../../iww-hq/data/listing-type-storage'

import type { FormState, PlanKey, StepDef } from './types'
import { INITIAL, PLAN_CAPS, URL_COUNTRY_ISO } from './constants'
import { validateStep } from './validation'

import RailNav from './components/RailNav'
import Footer from './components/Footer'
import { buildDemoForm } from './demo'
import Step1Identity from './steps/Step1Identity'
import Step2Category from './steps/Step2Category'
import Step3Contact from './steps/Step3Contact'
import Step4Story from './steps/Step4Story'
import Step5Features from './steps/Step5Features'
import Step6Pricing from './steps/Step6Pricing'
import Step7Review from './steps/Step7Review'

export type { PlanKey } from './types'

const STEPS: StepDef[] = [
  { id: 'identity', num: '01', label: 'Identity' },
  { id: 'category', num: '02', label: 'Category' },
  { id: 'contact',  num: '03', label: 'Contact' },
  { id: 'story',    num: '04', label: 'Story' },
  { id: 'features', num: '05', label: 'Features' },
  { id: 'pricing',  num: '06', label: 'Pricing' },
  { id: 'review',   num: '07', label: 'Review' },
]

export default function DashboardListingForm({ plan = 'free' }: { plan?: PlanKey }) {
  const caps = PLAN_CAPS[plan]
  const defaultIso = URL_COUNTRY_ISO['us']

  const [stepIdx, setStepIdx] = useState(0)
  const [visited, setVisited] = useState<Set<number>>(new Set([0]))
  const [form, setForm] = useState<FormState>(() => {
    const cInfo = Country.getCountryByCode(defaultIso)
    return cInfo
      ? {
          ...INITIAL,
          phoneIso: cInfo.isoCode,
          phoneCode: `+${cInfo.phonecode.replace('+', '')}`,
          countryCode: cInfo.isoCode,
          country: cInfo.name,
        }
      : INITIAL
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<{ slug: string } | null>(null)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const wrapRef = useRef<HTMLDivElement>(null)
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null)

  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([])
  const [listingTypes, setListingTypes] = useState<ListingType[]>([])

  /* Load reference data */
  useEffect(() => {
    fetchLaunchedCategories().then(setAllCategories).catch(() => {})
    fetchAllTagGroups().then(setTagGroups).catch(() => {})
  }, [])

  useEffect(() => {
    if (!form.l3Id) { setListingTypes([]); return }
    fetchListingTypes(form.l3Id).then(setListingTypes).catch(() => setListingTypes([]))
  }, [form.l3Id])

  /* Draft autosave */
  const draftKey = `iww_listing_draft_${plan}`
  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') setForm(prev => ({ ...prev, ...parsed }))
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(draftKey, JSON.stringify(form)); setDraftSavedAt(Date.now()) } catch {}
    }, 400)
    return () => clearTimeout(t)
  }, [form, draftKey])

  /* Scroll content panel to top on step change */
  useEffect(() => {
    const main = wrapRef.current?.querySelector('.df-content') as HTMLElement | null
    if (main) main.scrollTop = 0
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stepIdx])

  const set = useCallback(<K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(e => ({ ...e, [k as string]: '' }))
  }, [])

  const check = useCallback((idx: number): boolean => {
    const errs = validateStep(STEPS[idx], form, caps, tagGroups)
    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [form, caps, tagGroups])

  const goToIdx = (i: number) => {
    if (i > stepIdx && !check(stepIdx)) return
    setStepIdx(i)
    setVisited(v => new Set(v).add(i))
  }
  const back = () => {
    setStepIdx(i => {
      const next = Math.max(i - 1, 0)
      setVisited(v => new Set(v).add(next))
      return next
    })
  }
  const next = () => {
    if (!check(stepIdx)) return
    setStepIdx(i => {
      const nextI = Math.min(i + 1, STEPS.length - 1)
      setVisited(v => new Set(v).add(nextI))
      return nextI
    })
  }
  const goToStepId = (id: string) => {
    const i = STEPS.findIndex(s => s.id === id)
    if (i >= 0) goToIdx(i)
  }

  const onSubmit = async () => {
    if (submitting) return
    /* Re-validate every prior step */
    for (let i = 0; i < STEPS.length - 1; i++) {
      if (!check(i)) { setStepIdx(i); return }
    }
    setSubmitting(true); setSubmitError('')
    try {
      const chosenId = form.l3Id || form.l2Id || form.l1Id
      const chosenCat = allCategories.find(c => c.id === chosenId)
      const payload: Record<string, unknown> = {
        companyName: form.companyName.trim(),
        contactName: form.contactName.trim(),
        email: form.email.trim().toLowerCase(),
        phoneCode: form.phoneCode,
        phone: form.phone || null,
        website: form.website.trim(),
        category: chosenCat?.slug || chosenId,
        categorySlug: chosenCat?.slug,
        listingTypeId: form.listingTypeIds[0] || null,
        listingTypeIds: form.listingTypeIds,
        tagIds: form.tagIds,
        country: form.country,
        city: form.city || null,
        state: form.state || null,
        tagline: form.tagline.trim(),
        description: form.description || null,
        founded: form.founded || null,
        employees: form.employees || null,
        plan,
        logoUrl: form.logoUrl || null,
        screenshots: form.screenshots,
        demoVideo: form.demoVideo || null,
        features: form.features.filter(f => f.trim()),
        integrations: form.integrations.filter(x => x.trim()),
        pricingModel: form.pricingModel || null,
        pricingTiers: form.pricingTiers.filter(t => t.name.trim()),
        funding: form.funding || null,
        hqLocation: form.hqLocation || null,
        linkedin: form.linkedin || null,
        twitter: form.twitter || null,
        facebook: form.facebook || null,
        faqs: form.faqs.filter(f => f.question.trim() && f.answer.trim()),
        /* ── Listings V3 fields ── */
        headerTags: form.headerTags,
        pros: form.pros,
        cons: form.cons,
        industriesServed: form.industriesServed,
        useCases: form.useCases,
        targetCompanySizes: form.targetCompanySizes,
        keyFeatures: form.keyFeatures.filter(kf => kf.name.trim()),
        startingPrice: form.startingPrice || null,
        startingPricePeriod: form.startingPricePeriod || null,
        hasFreeTrial: form.hasFreeTrial,
        hasFreeVersion: form.hasFreeVersion,
        supportChannels: form.supportChannels,
        trainingOptions: form.trainingOptions,
        languages: form.languages,
        hasIosApp: form.hasIosApp,
        hasAndroidApp: form.hasAndroidApp,
        compliance: form.compliance,
        awards: form.awards.filter(a => a.name.trim()),
      }
      const res = await addSubmission(payload)
      if (res.ok && res.slug) {
        localStorage.removeItem(draftKey)
        setSubmitted({ slug: res.slug })
      } else {
        setSubmitError(res.error || 'Submission failed. Please try again.')
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Network error. Try again.')
    } finally { setSubmitting(false) }
  }

  const progressPct = useMemo(
    () => Math.round(((stepIdx + (visited.has(stepIdx) ? 1 : 0)) / STEPS.length) * 100),
    [stepIdx, visited],
  )

  if (submitted) {
    return (
      <div className="df-success">
        <div className="df-success-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="32" height="32">
            <path d="M5 12l5 5 9-11" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="df-success-title">You&apos;re in</h2>
        <p className="df-success-desc">
          Your <strong>{form.companyName}</strong> listing has been submitted for review.
          We&apos;ll email <strong>{form.email}</strong> when it&apos;s approved.
        </p>
        <div className="df-success-meta">
          <div className="df-success-row">
            <span className="df-success-label">Plan</span>
            <span className="df-success-val">{caps.label} · {caps.price}</span>
          </div>
          <div className="df-success-row">
            <span className="df-success-label">Future URL</span>
            <span className="df-success-val">/company/{submitted.slug}</span>
          </div>
        </div>
        <a href="/dashboard/listings" className="df-btn df-btn--primary">View my listings</a>
      </div>
    )
  }

  const current = STEPS[stepIdx]
  const isLast = stepIdx === STEPS.length - 1

  return (
    <div className="df-wrap" ref={wrapRef}>
      {/* Plan strip */}
      <div className="df-plan-strip">
        <div className="df-plan-strip-left">
          <span className="df-plan-tag">{caps.label}</span>
          <span className="df-plan-price">{caps.price}</span>
        </div>
        <div className="df-plan-strip-right">
          {draftSavedAt && (
            <span className="df-draft-status">Draft saved</span>
          )}
          <button
            type="button"
            className="df-demo-btn"
            onClick={() => setForm(prev => ({ ...prev, ...buildDemoForm(allCategories) }))}
            title="Fill every field with sample data (skips logo + screenshots)"
          >
            <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
              <path d="M12 2l2.39 4.84 5.34.78-3.86 3.77.91 5.32L12 14.27l-4.78 2.51.91-5.32-3.86-3.77 5.34-.78L12 2z"
                fill="currentColor" />
            </svg>
            Fill demo data
          </button>
        </div>
      </div>

      {/* Two-pane shell: rail + content */}
      <div className="df-grid">
        <RailNav
          steps={STEPS}
          current={stepIdx}
          onJump={goToIdx}
          visited={visited}
          progressPct={progressPct}
        />

        <div className="df-content">
          <main className="df-body">
            {current.id === 'identity' && <Step1Identity form={form} set={set} errors={errors} caps={caps} plan={plan} />}
            {current.id === 'category' && (
              <Step2Category
                form={form} set={set} errors={errors} caps={caps} plan={plan}
                allCategories={allCategories}
                listingTypes={listingTypes}
                tagGroups={tagGroups}
              />
            )}
            {current.id === 'contact'  && <Step3Contact  form={form} set={set} errors={errors} caps={caps} plan={plan} />}
            {current.id === 'story'    && <Step4Story    form={form} set={set} errors={errors} caps={caps} plan={plan} />}
            {current.id === 'features' && <Step5Features form={form} set={set} errors={errors} caps={caps} plan={plan} />}
            {current.id === 'pricing'  && <Step6Pricing  form={form} set={set} errors={errors} caps={caps} plan={plan} />}
            {current.id === 'review'   && (
              <Step7Review
                form={form} set={set} errors={errors} caps={caps} plan={plan}
                allCategories={allCategories}
                listingTypes={listingTypes}
                tagGroups={tagGroups}
                goToStep={goToStepId}
              />
            )}
          </main>

          <Footer
            step={stepIdx}
            total={STEPS.length}
            onBack={back}
            onNext={isLast ? onSubmit : next}
            isLast={isLast}
            submitting={submitting}
          />

          {submitError && <div className="df-submit-error">{submitError}</div>}
        </div>
      </div>
    </div>
  )
}
