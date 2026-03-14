import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import StepBusiness from './StepBusiness'
import StepMedia from './StepMedia'
import StepProduct from './StepProduct'
import StepCompany from './StepCompany'
import StepPlan from './StepPlan'
import StepReview from './StepReview'
import SubmitSidebar from './SubmitSidebar'

const STEPS = [
  { id: 'business', label: 'Business Info', icon: <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></svg> },
  { id: 'media', label: 'Media & Branding', icon: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg> },
  { id: 'product', label: 'Product Details', icon: <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg> },
  { id: 'company', label: 'Company', icon: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
  { id: 'plan', label: 'Select Plan', icon: <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
  { id: 'review', label: 'Review & Submit', icon: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg> },
]

export default function SubmitListingForm() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const formTopRef = useRef(null)

  const [form, setForm] = useState({
    name: '', tagline: '', website: '', description: '', category: '', email: '', phone: '',
    logoPreview: null, screenshots: [], demoVideo: '',
    features: ['', '', ''],
    integrations: [], integrationsInput: '',
    pricingModel: 'subscription',
    pricingTiers: [
      { name: 'Starter', price: '', period: '/mo' },
      { name: 'Professional', price: '', period: '/mo' },
      { name: 'Enterprise', price: '', period: '/mo' },
    ],
    founded: '', teamSize: '', funding: '', hqLocation: '',
    linkedIn: '', twitter: '', facebook: '',
    plan: 'growth',
  })

  const up = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
  const goStep = (s) => {
    setStep(s)
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const next = () => goStep(Math.min(step + 1, STEPS.length - 1))
  const prev = () => goStep(Math.max(step - 1, 0))
  const handleSubmit = () => setSubmitted(true)

  const progress = ((step + 1) / STEPS.length) * 100

  if (submitted) {
    return (
      <div className="sl-form-wrap" style={{ maxWidth: 600, margin: '0 auto', padding: '60px 20px' }}>
        <div className="sl-success">
          <div className="sl-success-confetti">
            {[...Array(12)].map((_, i) => <span key={i} className="sl-confetti-piece" style={{ '--i': i }} />)}
          </div>
          <div className="sl-success-icon">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2>Your Listing Has Been Submitted!</h2>
          <p>
            Thank you for choosing InfoWebWorld. Our team will review your listing within 24-48 hours.
            You'll receive an email confirmation at <strong>{form.email || 'your email'}</strong> once your listing goes live.
          </p>
          <div className="sl-success-actions">
            <Link to="/" className="sl-btn sl-btn-primary sl-btn-lg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
              Go Home
            </Link>
            <Link to="/category" className="sl-btn sl-btn-secondary sl-btn-lg">
              Browse Listings
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Stepper */}
      <div className="sl-stepper" ref={formTopRef}>
        <div className="container">
          <div className="sl-stepper-inner">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`sl-step${i === step ? ' active' : ''}${i < step ? ' completed' : ''}`}
                onClick={() => i <= step && goStep(i)}
              >
                <span className="sl-step-num">
                  <span className="sl-step-num-text">{i + 1}</span>
                  <span className="sl-step-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></span>
                </span>
                <span className="sl-step-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sl-progress-bar">
          <div className="sl-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="container">
        <div className="sl-layout">
          {/* Main form area */}
          <div className="sl-main">
            {step === 0 && <StepBusiness form={form} up={up} />}
            {step === 1 && <StepMedia form={form} up={up} />}
            {step === 2 && <StepProduct form={form} up={up} />}
            {step === 3 && <StepCompany form={form} up={up} />}
            {step === 4 && <StepPlan form={form} up={up} />}
            {step === 5 && <StepReview form={form} />}

            {/* Navigation */}
            <div className="sl-nav">
              <div className="sl-nav-left">
                {step > 0 && (
                  <button className="sl-btn sl-btn-secondary" onClick={prev}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                    Back
                  </button>
                )}
                <span className="sl-save-indicator">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Draft auto-saved
                </span>
              </div>
              {step < STEPS.length - 1 ? (
                <button className="sl-btn sl-btn-primary" onClick={next}>
                  Continue
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              ) : (
                <button className="sl-btn sl-btn-success sl-btn-lg" onClick={handleSubmit}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  Submit Listing
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <SubmitSidebar step={step} totalSteps={STEPS.length} />
        </div>
      </div>
    </>
  )
}
