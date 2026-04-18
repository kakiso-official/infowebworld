'use client'
/**
 * ListingFormV2 — thin orchestrator.
 *
 * State, step gating, draft autosave, submit logic live here.
 * All rendering is in form/steps/ and form/components/.
 */
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { Country } from 'country-state-city'
import { addSubmission } from '../../iww-hq/data/submissions-storage'
import { fetchLaunchedCategories } from '../../iww-hq/data/category-storage'
import type { Category } from '../../iww-hq/data/category-storage'
import { fetchAllTagGroups } from '../../iww-hq/data/tag-storage'
import type { TagGroup } from '../../iww-hq/data/tag-storage'
import { fetchListingTypes } from '../../iww-hq/data/listing-type-storage'
import type { ListingType } from '../../iww-hq/data/listing-type-storage'

import type { FormState, PlanKey, StepDef } from './form/types'
import { INITIAL, PLAN_CAPS, URL_COUNTRY_ISO } from './form/constants'
import { validateStep } from './form/validation'
import { I } from './form/icons'

import StepBusiness from './form/steps/StepBusiness'
import StepCategory from './form/steps/StepCategory'
import StepContact from './form/steps/StepContact'
import StepLocation from './form/steps/StepLocation'
import StepAbout from './form/steps/StepAbout'
import StepFeatures from './form/steps/StepFeatures'
import StepFaq from './form/steps/StepFaq'
import StepPremium from './form/steps/StepPremium'
import StepReview from './form/steps/StepReview'

export type { PlanKey } from './form/types'

export default function ListingFormV2({ plan = 'free' }: { plan?: PlanKey }) {
  const caps = PLAN_CAPS[plan]
  const pathname = usePathname() || ''
  const urlCountry = (pathname.split('/')[1] || '').toLowerCase()
  const defaultIso = URL_COUNTRY_ISO[urlCountry] || 'US'

  const steps = useMemo<StepDef[]>(() => {
    const s: StepDef[] = [
      { id: 'business', label: 'Business', icon: I.building },
      { id: 'category', label: 'Category', icon: I.star },
      { id: 'contact',  label: 'Contact',  icon: I.contact },
      { id: 'location', label: 'Location', icon: I.pin },
      { id: 'about',    label: 'About',    icon: I.image },
      { id: 'features', label: 'Features', icon: I.star },
    ]
    if (caps.hasFaqs) s.push({ id: 'faq', label: 'FAQ', icon: I.sparkle })
    if (caps.hasPremium) s.push({ id: 'premium', label: 'Premium', icon: I.diamond })
    s.push({ id: 'review', label: 'Review', icon: I.sparkle })
    return s
  }, [caps.hasFaqs, caps.hasPremium])

  const [stepIdx, setStepIdx] = useState(0)
  const [form, setForm] = useState<FormState>(() => {
    const cInfo = Country.getCountryByCode(defaultIso)
    return cInfo
      ? { ...INITIAL, phoneIso: cInfo.isoCode, phoneCode: `+${cInfo.phonecode.replace('+', '')}`, countryCode: cInfo.isoCode, country: cInfo.name }
      : INITIAL
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<{ slug: string } | null>(null)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const wrapRef = useRef<HTMLDivElement>(null)

  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([])
  const [listingTypes, setListingTypes] = useState<ListingType[]>([])

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
      try { localStorage.setItem(draftKey, JSON.stringify(form)) } catch {}
    }, 400)
    return () => clearTimeout(t)
  }, [form, draftKey])

  /* Scroll panel to top on step change */
  useEffect(() => {
    const panel = wrapRef.current?.closest('.gl-panel') as HTMLElement | null
    if (panel) panel.scrollTo({ top: 0, behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stepIdx])

  const set = useCallback(<K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(e => ({ ...e, [k as string]: '' }))
  }, [])

  const check = useCallback((idx: number): boolean => {
    const errs = validateStep(steps[idx], form, caps, tagGroups)
    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [steps, form, caps, tagGroups])

  const next = () => { if (!check(stepIdx)) return; setStepIdx(i => Math.min(i + 1, steps.length - 1)) }
  const back = () => setStepIdx(i => Math.max(i - 1, 0))
  const goto = (i: number) => { if (i > stepIdx && !check(stepIdx)) return; setStepIdx(i) }

  const onSubmit = async () => {
    if (submitting) return
    for (let i = 0; i < steps.length - 1; i++) {
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
        /* primary specialization for existing DB column */
        listingTypeId: form.listingTypeIds[0] || null,
        /* full array for future multi-listing-type support */
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
      }
      const res = await addSubmission(payload)
      if (res.ok && res.slug) { localStorage.removeItem(draftKey); setSubmitted({ slug: res.slug }) }
      else setSubmitError(res.error || 'Submission failed. Please try again.')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Network error. Try again.')
    } finally { setSubmitting(false) }
  }

  if (submitted) {
    return (
      <div className="lf2-wrap" ref={wrapRef}>
        <div className="lf2-success">
          <div className="lf2-success-icon">{I.check}</div>
          <h2 className="lf2-success-title">You&apos;re in</h2>
          <p className="lf2-success-desc">
            Your <strong>{form.companyName}</strong> listing has been submitted for review.
            We&apos;ll email <strong>{form.email}</strong> when it&apos;s approved.
          </p>
          <div className="lf2-success-meta">
            <div className="lf2-success-meta-row">
              <span className="lf2-success-meta-label">Plan</span>
              <span className="lf2-success-meta-val">{caps.label} · {caps.price}</span>
            </div>
            <div className="lf2-success-meta-row">
              <span className="lf2-success-meta-label">Future URL</span>
              <span className="lf2-success-meta-val">/{submitted.slug}</span>
            </div>
          </div>
          <a href="/" className="lf2-success-cta">Back to Home {I.arrow}</a>
        </div>
      </div>
    )
  }

  const currentStep = steps[stepIdx]
  const progressPct = Math.round((stepIdx / (steps.length - 1)) * 100)

  return (
    <div className="lf2-wrap" ref={wrapRef}>
      <header className="lf2-top">
        <div className="lf2-top-badge">
          <span className="lf2-hero-dot" />
          {caps.label} · {caps.price}
        </div>
        <div className="lf2-progress"><div className="lf2-progress-bar" style={{ width: `${progressPct}%` }} /></div>
        <div className="lf2-top-count">Step {stepIdx + 1} / {steps.length}</div>
      </header>

      <nav className="lf2-steps" aria-label="Progress">
        {steps.map((s, i) => {
          const state = i < stepIdx ? 'done' : i === stepIdx ? 'active' : 'pending'
          return (
            <button key={s.id} type="button"
              className={`lf2-step lf2-step--${state}`}
              onClick={() => goto(i)}
              disabled={i > stepIdx && !form.companyName.trim()}>
              <span className="lf2-step-ico" aria-hidden>{state === 'done' ? I.check : s.icon}</span>
              <span className="lf2-step-lbl">{s.label}</span>
            </button>
          )
        })}
      </nav>

      <main className="lf2-body">
        {currentStep.id === 'business' && <StepBusiness form={form} set={set} errors={errors} />}
        {currentStep.id === 'category' && <StepCategory form={form} set={set} errors={errors} allCategories={allCategories} listingTypes={listingTypes} caps={caps} />}
        {currentStep.id === 'contact'  && <StepContact  form={form} set={set} errors={errors} />}
        {currentStep.id === 'location' && <StepLocation form={form} set={set} errors={errors} />}
        {currentStep.id === 'about'    && <StepAbout    form={form} set={set} errors={errors} caps={caps} />}
        {currentStep.id === 'features' && <StepFeatures form={form} set={set} errors={errors} caps={caps} tagGroups={tagGroups} />}
        {currentStep.id === 'faq'      && <StepFaq      form={form} set={set} errors={errors} caps={caps} />}
        {currentStep.id === 'premium'  && <StepPremium  form={form} set={set} errors={errors} />}
        {currentStep.id === 'review'   && <StepReview   form={form} plan={plan} allCategories={allCategories} tagGroups={tagGroups} listingTypes={listingTypes} />}
      </main>

      <footer className="lf2-nav">
        {stepIdx > 0 && (
          <button type="button" className="lf2-nav-back" onClick={back} disabled={submitting} aria-label="Back">
            {I.back}
          </button>
        )}
        {currentStep.id === 'review' ? (
          <button type="button" className="lf2-nav-main" onClick={onSubmit} disabled={submitting}>
            <span className="lf2-nav-main-text">{submitting ? 'Submitting…' : 'Submit Listing'}</span>
            <span className="lf2-nav-main-arrow">{I.arrow}</span>
          </button>
        ) : (
          <button type="button" className="lf2-nav-main" onClick={next}>
            <span className="lf2-nav-main-text">Continue</span>
            <span className="lf2-nav-main-arrow">{I.arrow}</span>
          </button>
        )}
      </footer>

      {submitError && <div className="lf2-submit-error">{submitError}</div>}
    </div>
  )
}
