import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import '../styles/claim-listing.css'
import ClaimStepper from '../components/claim-listing/ClaimStepper'
import StepSearch from '../components/claim-listing/StepSearch'
import StepVerify from '../components/claim-listing/StepVerify'
import StepPlan from '../components/claim-listing/StepPlan'
import StepProfile from '../components/claim-listing/StepProfile'
import StepSuccess from '../components/claim-listing/StepSuccess'
import ClaimSidebar from '../components/claim-listing/ClaimSidebar'

export default function ClaimListingPage() {
  const [step, setStep] = useState(0)
  const [listing, setListing] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState('growth')
  const [direction, setDirection] = useState('forward')
  const contentRef = useRef(null)
  const [form, setForm] = useState({
    fullName: '', jobTitle: '', workEmail: '', phone: '',
    website: '', linkedin: '', description: '',
  })

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const goStep = (nextStep) => {
    setDirection(nextStep > step ? 'forward' : 'backward')
    setStep(nextStep)
    window.scrollTo({ top: contentRef.current?.offsetTop - 80, behavior: 'smooth' })
  }

  const handleSelect = (l) => { setListing(l); goStep(1) }
  const handleVerified = () => goStep(2)
  const handlePlanContinue = () => goStep(3)
  const handleComplete = () => goStep(4)
  const handleBackToSearch = () => { setListing(null); goStep(0) }
  const handleBackToVerify = () => goStep(1)
  const handleBackToPlan = () => goStep(2)

  return (
    <>
      <Navbar />
      <div className="cl-page">
        {/* Hero Banner — split layout like submit-listing */}
        <div className="cl-hero">
          <div className="cl-hero-orb cl-hero-orb--1"></div>
          <div className="cl-hero-orb cl-hero-orb--2"></div>
          <div className="container">
            <div className="cl-hero-split">
              <div className="cl-hero-left">
                <div className="cl-hero-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  FREE CLAIM AVAILABLE
                </div>
                <h1>Claim Your Business Listing on InfoWebWorld</h1>
                <p>We've already created a listing for your business. Claim it to take full control — update info, respond to reviews, access analytics, and generate leads.</p>
                <div className="cl-hero-stats">
                  <div className="cl-hero-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <strong>2,500+</strong> claimed
                  </div>
                  <span className="cl-hero-stat-div" />
                  <div className="cl-hero-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    <strong>~5 min</strong> process
                  </div>
                  <span className="cl-hero-stat-div" />
                  <div className="cl-hero-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <strong>100%</strong> free tier
                  </div>
                </div>
              </div>
              <div className="cl-hero-right">
                <div className="cl-hero-benefit">
                  <div className="cl-hero-benefit-icon" style={{ background: 'rgba(47,174,106,.15)' }}>
                    <svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div>
                    <div className="cl-hero-benefit-title">Verified Trust Badge</div>
                    <div className="cl-hero-benefit-text">Verified listings get 3x more clicks</div>
                  </div>
                </div>
                <div className="cl-hero-benefit">
                  <div className="cl-hero-benefit-icon" style={{ background: 'rgba(108,114,241,.15)' }}>
                    <svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/></svg>
                  </div>
                  <div>
                    <div className="cl-hero-benefit-title">Lead Generation</div>
                    <div className="cl-hero-benefit-text">Receive & manage leads from your listing</div>
                  </div>
                </div>
                <div className="cl-hero-benefit">
                  <div className="cl-hero-benefit-icon" style={{ background: 'rgba(59,130,246,.15)' }}>
                    <svg viewBox="0 0 24 24" stroke="var(--azure)" fill="none" strokeWidth="1.5"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
                  </div>
                  <div>
                    <div className="cl-hero-benefit-title">Real-Time Analytics</div>
                    <div className="cl-hero-benefit-text">Track views, clicks & conversions</div>
                  </div>
                </div>
                <div className="cl-hero-benefit">
                  <div className="cl-hero-benefit-icon" style={{ background: 'rgba(245,158,11,.15)' }}>
                    <svg viewBox="0 0 24 24" stroke="var(--amber)" fill="none" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <div>
                    <div className="cl-hero-benefit-title">Reputation Management</div>
                    <div className="cl-hero-benefit-text">Respond to reviews & improve rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <ClaimStepper step={step} />

        {/* Content */}
        <div className="cl-container" ref={contentRef}>
          <div className={`cl-layout${step === 4 ? ' cl-layout--full' : ''}`}>
            <div className="cl-main">
              <div key={step} className={`cl-transition cl-transition--${direction}`}>
                {step === 0 && <StepSearch onSelect={handleSelect} />}
                {step === 1 && listing && <StepVerify listing={listing} onVerified={handleVerified} onBack={handleBackToSearch} />}
                {step === 2 && listing && <StepPlan listing={listing} selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} onContinue={handlePlanContinue} onBack={handleBackToVerify} />}
                {step === 3 && listing && <StepProfile listing={listing} form={form} up={up} onComplete={handleComplete} onBack={handleBackToPlan} />}
                {step === 4 && <StepSuccess listing={listing} />}
              </div>
            </div>
            {step < 4 && <ClaimSidebar step={step} />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
