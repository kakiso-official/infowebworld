import { useState } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import StepProgress, { STEPS } from '../components/dashboard/create-listing/StepProgress'
import BusinessInfoStep from '../components/dashboard/create-listing/BusinessInfoStep'
import MediaBrandingStep from '../components/dashboard/create-listing/MediaBrandingStep'
import ProductDetailsStep from '../components/dashboard/create-listing/ProductDetailsStep'
import CompanyDetailsStep from '../components/dashboard/create-listing/CompanyDetailsStep'
import ReviewSubmitStep from '../components/dashboard/create-listing/ReviewSubmitStep'
import SuccessView from '../components/dashboard/create-listing/SuccessView'
import StepNavigation from '../components/dashboard/create-listing/StepNavigation'

export default function DashboardCreateListingPage() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

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
    address: '',
  })

  const up = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const goStep = (s) => {
    setStep(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = () => setSubmitted(true)

  // Features helpers
  const addFeature = () => up('features', [...form.features, ''])
  const removeFeature = (i) => up('features', form.features.filter((_, idx) => idx !== i))
  const updateFeature = (i, v) => { const f = [...form.features]; f[i] = v; up('features', f) }

  // Integrations helpers
  const addIntegration = (e) => {
    if (e.key === 'Enter' && form.integrationsInput.trim()) {
      e.preventDefault()
      up('integrations', [...form.integrations, form.integrationsInput.trim()])
      up('integrationsInput', '')
    }
  }
  const removeIntegration = (i) => up('integrations', form.integrations.filter((_, idx) => idx !== i))

  // Pricing helpers
  const updateTier = (i, key, v) => {
    const t = [...form.pricingTiers]; t[i] = { ...t[i], [key]: v }; up('pricingTiers', t)
  }

  const onCreateAnother = () => {
    setSubmitted(false)
    setStep(0)
    setForm(f => ({ ...f, name: '', tagline: '', website: '', description: '', category: '', email: '', phone: '', features: ['', '', ''], integrations: [], founded: '', teamSize: '', funding: '', hqLocation: '', linkedIn: '', twitter: '', facebook: '' }))
  }

  if (submitted) {
    return <SuccessView form={form} onCreateAnother={onCreateAnother} />
  }

  return (
    <DashboardLayout title="Create New Listing" subtitle="Add a new business listing to your account">
      <StepProgress step={step} totalSteps={STEPS.length} goStep={goStep} />

      {step === 0 && <BusinessInfoStep form={form} up={up} totalSteps={STEPS.length} />}
      {step === 1 && <MediaBrandingStep form={form} up={up} totalSteps={STEPS.length} />}
      {step === 2 && (
        <ProductDetailsStep
          form={form} up={up} totalSteps={STEPS.length}
          addFeature={addFeature} removeFeature={removeFeature} updateFeature={updateFeature}
          addIntegration={addIntegration} removeIntegration={removeIntegration}
          updateTier={updateTier}
        />
      )}
      {step === 3 && <CompanyDetailsStep form={form} up={up} totalSteps={STEPS.length} />}
      {step === 4 && <ReviewSubmitStep form={form} totalSteps={STEPS.length} />}

      <StepNavigation step={step} setStep={setStep} onSubmit={handleSubmit} />
    </DashboardLayout>
  )
}
