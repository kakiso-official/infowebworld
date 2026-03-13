import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

/* ===== STEP DEFINITIONS ===== */
const STEPS = [
  { id: 'business', label: 'Business Info', icon: <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></svg> },
  { id: 'media', label: 'Media & Branding', icon: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg> },
  { id: 'product', label: 'Product Details', icon: <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg> },
  { id: 'company', label: 'Company', icon: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
  { id: 'plan', label: 'Select Plan', icon: <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
  { id: 'review', label: 'Review & Submit', icon: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg> },
]

/* ===== CATEGORY DATA ===== */
const CATEGORIES = [
  { id: 'technology-saas', name: 'Technology & SaaS', color: 'rgba(108,114,241,.1)', stroke: 'var(--accent)', paths: [<path key="a" d="M16 18l6-6-6-6" />, <path key="b" d="M8 6l-6 6 6 6" />] },
  { id: 'restaurants-food', name: 'Restaurants & Food', color: 'rgba(239,107,74,.1)', stroke: 'var(--coral)', paths: [<path key="a" d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />, <path key="b" d="M7 2v20" />] },
  { id: 'healthcare-wellness', name: 'Healthcare & Wellness', color: 'rgba(47,174,106,.1)', stroke: 'var(--emerald)', paths: [<path key="a" d="M22 12h-4l-3 9L9 3l-3 9H2" />] },
  { id: 'real-estate', name: 'Real Estate & Property', color: 'rgba(59,130,246,.1)', stroke: 'var(--azure)', paths: [<path key="a" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />, <path key="b" d="M9 22V12h6v10" />] },
  { id: 'legal-financial', name: 'Legal & Financial', color: 'rgba(139,92,246,.1)', stroke: 'var(--plum)', paths: [<line key="a" x1="12" y1="1" x2="12" y2="23" />, <path key="b" d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />] },
  { id: 'education-training', name: 'Education & Training', color: 'rgba(20,184,166,.1)', stroke: 'var(--teal)', paths: [<path key="a" d="M22 10v6M2 10l10-5 10 5-10 5z" />, <path key="b" d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />] },
  { id: 'marketing-creative', name: 'Marketing & Creative', color: 'rgba(236,72,153,.1)', stroke: 'var(--rose)', paths: [<path key="a" d="M3 11l18-5v12L3 13v-2z" />] },
  { id: 'home-services', name: 'Home Services & Trades', color: 'rgba(245,158,11,.1)', stroke: 'var(--amber)', paths: [<path key="a" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />] },
]

/* ===== PLAN DATA ===== */
const PLANS = [
  {
    id: 'free', name: 'Free', price: '$0', period: '', badge: null,
    iconBg: 'var(--gray-500)', icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /></svg>,
    features: [
      { text: 'Basic listing profile', yes: true },
      { text: 'Nofollow backlink', yes: true },
      { text: 'Up to 3 screenshots', yes: true },
      { text: 'Standard category placement', yes: true },
      { text: 'Dofollow backlink', yes: false },
      { text: 'Review responses', yes: false },
      { text: 'Analytics dashboard', yes: false },
      { text: 'Featured placement', yes: false },
    ]
  },
  {
    id: 'growth', name: 'Growth', price: '$240', period: '/year', badge: 'Most Popular', badgeClass: 'sl-plan-badge--popular',
    iconBg: 'var(--accent)', icon: <svg viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>,
    features: [
      { text: 'Everything in Free', yes: true },
      { text: 'Dofollow backlink (SEO boost)', yes: true },
      { text: 'Up to 10 screenshots', yes: true },
      { text: 'Review responses', yes: true },
      { text: 'Basic analytics', yes: true },
      { text: 'Priority support', yes: true },
      { text: 'Buyer intent data', yes: false },
      { text: 'Featured placement', yes: false },
    ]
  },
  {
    id: 'professional', name: 'Professional', price: '$599', period: '/year', badge: 'Best Value', badgeClass: 'sl-plan-badge--best',
    iconBg: 'var(--plum)', icon: <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>,
    features: [
      { text: 'Everything in Growth', yes: true },
      { text: 'Featured category placement', yes: true },
      { text: 'Buyer intent data & leads', yes: true },
      { text: 'Lead capture forms', yes: true },
      { text: 'Badge eligibility', yes: true },
      { text: 'Advanced analytics', yes: true },
      { text: 'Unlimited screenshots', yes: true },
      { text: 'Custom landing page', yes: false },
    ]
  },
  {
    id: 'enterprise', name: 'Enterprise', price: '$1,499', period: '/year', badge: null,
    iconBg: 'var(--emerald)', icon: <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>,
    features: [
      { text: 'Everything in Professional', yes: true },
      { text: 'Custom landing page', yes: true },
      { text: 'API access', yes: true },
      { text: 'Dedicated account manager', yes: true },
      { text: 'White-glove onboarding', yes: true },
      { text: 'Custom integrations', yes: true },
      { text: 'Multi-language listing', yes: true },
      { text: 'Priority review moderation', yes: true },
    ]
  }
]

/* ===== COMPONENT ===== */
export default function SubmitListingForm() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const formTopRef = useRef(null)

  // Form data
  const [form, setForm] = useState({
    // Step 1: Business Info
    name: '', tagline: '', website: '', description: '', category: '', email: '', phone: '',
    // Step 2: Media
    logoPreview: null, screenshots: [],
    demoVideo: '',
    // Step 3: Product Details
    features: ['', '', ''],
    integrations: [],
    integrationsInput: '',
    pricingModel: 'subscription',
    pricingTiers: [
      { name: 'Starter', price: '', period: '/mo' },
      { name: 'Professional', price: '', period: '/mo' },
      { name: 'Enterprise', price: '', period: '/mo' },
    ],
    // Step 4: Company
    founded: '', teamSize: '', funding: '', hqLocation: '',
    linkedIn: '', twitter: '', facebook: '',
    // Step 5: Plan
    plan: 'growth',
  })

  const up = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
  const goStep = (s) => {
    setStep(s)
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const next = () => goStep(Math.min(step + 1, STEPS.length - 1))
  const prev = () => goStep(Math.max(step - 1, 0))

  // Feature list helpers
  const addFeature = () => up('features', [...form.features, ''])
  const removeFeature = (i) => up('features', form.features.filter((_, idx) => idx !== i))
  const updateFeature = (i, v) => { const f = [...form.features]; f[i] = v; up('features', f) }

  // Integrations tag helper
  const addIntegration = (e) => {
    if (e.key === 'Enter' && form.integrationsInput.trim()) {
      e.preventDefault()
      up('integrations', [...form.integrations, form.integrationsInput.trim()])
      up('integrationsInput', '')
    }
  }
  const removeIntegration = (i) => up('integrations', form.integrations.filter((_, idx) => idx !== i))

  // Pricing tier helpers
  const updateTier = (i, key, v) => {
    const t = [...form.pricingTiers]; t[i] = { ...t[i], [key]: v }; up('pricingTiers', t)
  }

  const handleSubmit = () => setSubmitted(true)

  const progress = ((step + 1) / STEPS.length) * 100

  // ROI estimates based on plan
  const roiData = {
    free: { traffic: '200-500', leads: '5-15', backlink: 'Nofollow' },
    growth: { traffic: '1K-3K', leads: '25-75', backlink: 'Dofollow' },
    professional: { traffic: '3K-8K', leads: '75-200', backlink: 'Dofollow' },
    enterprise: { traffic: '8K-20K', leads: '200-500', backlink: 'Dofollow' },
  }
  const currentRoi = roiData[form.plan] || roiData.growth

  if (submitted) {
    return (
      <div className="sl-form-wrap" style={{ maxWidth: 600, margin: '0 auto', padding: '60px 20px' }}>
        <div className="sl-success">
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
      {/* ===== STEPPER ===== */}
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
        <div className="sl-form-wrap">

          {/* ======================== STEP 1: BUSINESS INFO ======================== */}
          {step === 0 && (
            <>
              <div className="sl-section">
                <div className="sl-section-header">
                  <div className="sl-section-icon" style={{ background: 'var(--accent)' }}>
                    <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></svg>
                  </div>
                  <div className="sl-section-info">
                    <div className="sl-section-title">Business Information</div>
                    <div className="sl-section-desc">Tell us about your product or service</div>
                  </div>
                </div>

                <div className="sl-row">
                  <div className="sl-field">
                    <label className="sl-label">Business / Product Name</label>
                    <input className="sl-input" placeholder="e.g. CloudSync Pro" value={form.name} onChange={e => up('name', e.target.value)} />
                  </div>
                  <div className="sl-field">
                    <label className="sl-label">Tagline <span className="sl-label-opt">(optional)</span></label>
                    <input className="sl-input" placeholder="e.g. Enterprise cloud sync made simple" value={form.tagline} onChange={e => up('tagline', e.target.value)} maxLength={80} />
                    <div className="sl-char-count">{form.tagline.length}/80</div>
                  </div>
                </div>

                <div className="sl-row">
                  <div className="sl-field">
                    <label className="sl-label">Website URL</label>
                    <input className="sl-input" type="url" placeholder="https://your-product.com" value={form.website} onChange={e => up('website', e.target.value)} />
                  </div>
                  <div className="sl-field">
                    <label className="sl-label">Business Email</label>
                    <input className="sl-input" type="email" placeholder="hello@your-product.com" value={form.email} onChange={e => up('email', e.target.value)} />
                  </div>
                </div>

                <div className="sl-field">
                  <label className="sl-label">Description</label>
                  <span className="sl-label-hint">Describe your product in 150-500 characters. This appears in search results and your listing profile.</span>
                  <textarea className="sl-input" placeholder="What does your product do? What problems does it solve? Who is it for?" value={form.description} onChange={e => up('description', e.target.value)} maxLength={500} rows={4} />
                  <div className="sl-char-count">{form.description.length}/500</div>
                </div>

                <div className="sl-field">
                  <label className="sl-label">Phone Number <span className="sl-label-opt">(optional)</span></label>
                  <input className="sl-input" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => up('phone', e.target.value)} style={{ maxWidth: 280 }} />
                </div>
              </div>

              {/* Category Selection */}
              <div className="sl-section">
                <div className="sl-section-header">
                  <div className="sl-section-icon" style={{ background: 'var(--plum)' }}>
                    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                  </div>
                  <div className="sl-section-info">
                    <div className="sl-section-title">Primary Category</div>
                    <div className="sl-section-desc">Choose the category that best fits your business</div>
                  </div>
                </div>

                <div className="sl-cat-grid">
                  {CATEGORIES.map(cat => (
                    <div
                      key={cat.id}
                      className={`sl-cat-option${form.category === cat.id ? ' selected' : ''}`}
                      onClick={() => up('category', cat.id)}
                    >
                      <div className="sl-cat-option-icon" style={{ background: cat.color }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke={cat.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                          {cat.paths}
                        </svg>
                      </div>
                      <span className="sl-cat-option-text">{cat.name}</span>
                      <span className="sl-cat-check">
                        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ======================== STEP 2: MEDIA ======================== */}
          {step === 1 && (
            <div className="sl-section">
              <div className="sl-section-header">
                <div className="sl-section-icon" style={{ background: 'var(--azure)' }}>
                  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                </div>
                <div className="sl-section-info">
                  <div className="sl-section-title">Media & Branding</div>
                  <div className="sl-section-desc">Upload your logo, screenshots, and media assets</div>
                </div>
              </div>

              {/* Logo */}
              <div className="sl-field">
                <label className="sl-label">Company Logo</label>
                <span className="sl-label-hint">Recommended: 256x256px or larger, PNG/SVG with transparent background</span>
                <div className="sl-upload-zone" style={{ marginTop: 6 }}>
                  <div className="sl-upload-preview">
                    {form.logoPreview
                      ? <img src={form.logoPreview} alt="Logo preview" />
                      : <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                    }
                  </div>
                  <div className="sl-upload-info">
                    <div className="sl-upload-title"><span>Click to upload</span> or drag & drop</div>
                    <div className="sl-upload-hint">PNG, SVG, JPG up to 5MB</div>
                  </div>
                </div>
              </div>

              {/* Screenshots */}
              <div className="sl-field">
                <label className="sl-label">Product Screenshots</label>
                <span className="sl-label-hint">Upload up to 10 screenshots showcasing your product. 16:10 aspect ratio recommended.</span>
                <div className="sl-screenshots">
                  {[0,1,2,3,4].map(i => (
                    <div className="sl-screenshot-slot" key={i}>
                      <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      <span>Screenshot {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo Video */}
              <div className="sl-field">
                <label className="sl-label">Demo Video URL <span className="sl-label-opt">(optional)</span></label>
                <span className="sl-label-hint">Link to a YouTube or Vimeo demo of your product</span>
                <input className="sl-input" type="url" placeholder="https://youtube.com/watch?v=..." value={form.demoVideo} onChange={e => up('demoVideo', e.target.value)} />
              </div>
            </div>
          )}

          {/* ======================== STEP 3: PRODUCT DETAILS ======================== */}
          {step === 2 && (
            <>
              {/* Key Features */}
              <div className="sl-section">
                <div className="sl-section-header">
                  <div className="sl-section-icon" style={{ background: 'var(--emerald)' }}>
                    <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                  </div>
                  <div className="sl-section-info">
                    <div className="sl-section-title">Key Features</div>
                    <div className="sl-section-desc">List the top features of your product (minimum 3)</div>
                  </div>
                </div>

                <div className="sl-feature-list">
                  {form.features.map((f, i) => (
                    <div className="sl-feature-item" key={i}>
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="1" /><circle cx="12" cy="15" r="1" /></svg>
                      <input
                        placeholder={`Feature ${i + 1} (e.g. "Real-time collaboration")`}
                        value={f}
                        onChange={e => updateFeature(i, e.target.value)}
                      />
                      {form.features.length > 3 && (
                        <button className="sl-feature-remove" onClick={() => removeFeature(i)}>
                          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {form.features.length < 15 && (
                  <button className="sl-add-btn" onClick={addFeature}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Add Feature
                  </button>
                )}
              </div>

              {/* Integrations */}
              <div className="sl-section">
                <div className="sl-section-header">
                  <div className="sl-section-icon" style={{ background: 'var(--teal)' }}>
                    <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                  </div>
                  <div className="sl-section-info">
                    <div className="sl-section-title">Integrations</div>
                    <div className="sl-section-desc">What tools and platforms does your product integrate with?</div>
                  </div>
                </div>

                <div className="sl-tags-wrap">
                  {form.integrations.map((t, i) => (
                    <span className="sl-tag" key={i}>
                      {t}
                      <span className="sl-tag-remove" onClick={() => removeIntegration(i)}>
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </span>
                    </span>
                  ))}
                  <input
                    className="sl-tags-input"
                    placeholder="Type and press Enter (e.g. Slack, Salesforce)"
                    value={form.integrationsInput}
                    onChange={e => up('integrationsInput', e.target.value)}
                    onKeyDown={addIntegration}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="sl-section">
                <div className="sl-section-header">
                  <div className="sl-section-icon" style={{ background: 'var(--amber)' }}>
                    <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                  </div>
                  <div className="sl-section-info">
                    <div className="sl-section-title">Pricing Information</div>
                    <div className="sl-section-desc">Help users understand your pricing model</div>
                  </div>
                </div>

                <div className="sl-field">
                  <label className="sl-label">Pricing Model</label>
                  <select className="sl-input" value={form.pricingModel} onChange={e => up('pricingModel', e.target.value)} style={{ maxWidth: 280 }}>
                    <option value="subscription">Subscription (Monthly/Annual)</option>
                    <option value="one-time">One-time Purchase</option>
                    <option value="freemium">Freemium</option>
                    <option value="usage">Usage-based / Pay-per-use</option>
                    <option value="contact">Contact for Pricing</option>
                    <option value="free">Completely Free</option>
                  </select>
                </div>

                <div className="sl-field">
                  <label className="sl-label">Pricing Tiers <span className="sl-label-opt">(optional)</span></label>
                  <div className="sl-pricing-builder">
                    {form.pricingTiers.map((tier, i) => (
                      <div className="sl-pricing-tier" key={i}>
                        <div className="sl-pricing-tier-head">Tier {i + 1}</div>
                        <div className="sl-field" style={{ marginBottom: 8 }}>
                          <input className="sl-input" placeholder="Plan name" value={tier.name} onChange={e => updateTier(i, 'name', e.target.value)} />
                        </div>
                        <div className="sl-field" style={{ marginBottom: 0 }}>
                          <input className="sl-input" placeholder="$0" value={tier.price} onChange={e => updateTier(i, 'price', e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ======================== STEP 4: COMPANY ======================== */}
          {step === 3 && (
            <div className="sl-section">
              <div className="sl-section-header">
                <div className="sl-section-icon" style={{ background: 'var(--coral)' }}>
                  <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <div className="sl-section-info">
                  <div className="sl-section-title">Company Details</div>
                  <div className="sl-section-desc">Additional information about your company</div>
                </div>
              </div>

              <div className="sl-row">
                <div className="sl-field">
                  <label className="sl-label">Year Founded</label>
                  <input className="sl-input" type="number" placeholder="e.g. 2020" min="1900" max="2026" value={form.founded} onChange={e => up('founded', e.target.value)} />
                </div>
                <div className="sl-field">
                  <label className="sl-label">Team Size</label>
                  <select className="sl-input" value={form.teamSize} onChange={e => up('teamSize', e.target.value)}>
                    <option value="">Select team size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1,000 employees</option>
                    <option value="1000+">1,000+ employees</option>
                  </select>
                </div>
              </div>

              <div className="sl-row">
                <div className="sl-field">
                  <label className="sl-label">Funding Stage <span className="sl-label-opt">(optional)</span></label>
                  <select className="sl-input" value={form.funding} onChange={e => up('funding', e.target.value)}>
                    <option value="">Select funding stage</option>
                    <option value="bootstrapped">Bootstrapped</option>
                    <option value="pre-seed">Pre-Seed</option>
                    <option value="seed">Seed</option>
                    <option value="series-a">Series A</option>
                    <option value="series-b">Series B</option>
                    <option value="series-c+">Series C+</option>
                    <option value="public">Publicly Traded</option>
                    <option value="profitable">Profitable / Self-funded</option>
                  </select>
                </div>
                <div className="sl-field">
                  <label className="sl-label">Headquarters</label>
                  <input className="sl-input" placeholder="e.g. San Francisco, CA" value={form.hqLocation} onChange={e => up('hqLocation', e.target.value)} />
                </div>
              </div>

              <div style={{ marginTop: 8, marginBottom: 4, fontSize: 12, fontWeight: 500, color: 'var(--gray-700)' }}>Social Links</div>
              <div className="sl-row-3">
                <div className="sl-field">
                  <label className="sl-label" style={{ fontSize: 11, fontWeight: 400 }}>LinkedIn</label>
                  <input className="sl-input" placeholder="https://linkedin.com/company/..." value={form.linkedIn} onChange={e => up('linkedIn', e.target.value)} />
                </div>
                <div className="sl-field">
                  <label className="sl-label" style={{ fontSize: 11, fontWeight: 400 }}>Twitter / X</label>
                  <input className="sl-input" placeholder="https://x.com/..." value={form.twitter} onChange={e => up('twitter', e.target.value)} />
                </div>
                <div className="sl-field">
                  <label className="sl-label" style={{ fontSize: 11, fontWeight: 400 }}>Facebook</label>
                  <input className="sl-input" placeholder="https://facebook.com/..." value={form.facebook} onChange={e => up('facebook', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* ======================== STEP 5: SELECT PLAN ======================== */}
          {step === 4 && (
            <>
              <div className="sl-section">
                <div className="sl-section-header">
                  <div className="sl-section-icon" style={{ background: 'var(--accent)' }}>
                    <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                  </div>
                  <div className="sl-section-info">
                    <div className="sl-section-title">Choose Your Listing Plan</div>
                    <div className="sl-section-desc">Select the plan that fits your goals. Upgrade or downgrade anytime.</div>
                  </div>
                </div>

                <div className="sl-plans">
                  {PLANS.map(plan => (
                    <div
                      key={plan.id}
                      className={`sl-plan${form.plan === plan.id ? ' selected' : ''}${plan.badge === 'Most Popular' ? ' popular' : ''}`}
                      onClick={() => up('plan', plan.id)}
                    >
                      {plan.badge && <span className={`sl-plan-badge ${plan.badgeClass}`}>{plan.badge}</span>}
                      <div className="sl-plan-icon" style={{ background: plan.iconBg }}>{plan.icon}</div>
                      <div className="sl-plan-name">{plan.name}</div>
                      <div className="sl-plan-price">{plan.price}{plan.period && <span>{plan.period}</span>}</div>
                      <div className="sl-plan-period">{plan.id === 'free' ? 'Forever free' : 'Billed annually'}</div>
                      <ul className="sl-plan-features">
                        {plan.features.map((f, i) => (
                          <li key={i} className={f.yes ? 'yes' : 'no'}>
                            <svg viewBox="0 0 24 24">
                              {f.yes
                                ? <polyline points="20 6 9 17 4 12" />
                                : <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                              }
                            </svg>
                            {f.text}
                          </li>
                        ))}
                      </ul>
                      <button className="sl-plan-select">
                        {form.plan === plan.id ? 'Selected' : 'Select Plan'}
                      </button>
                    </div>
                  ))}
                </div>

                {/* ROI Calculator */}
                <div className="sl-roi">
                  <div className="sl-roi-title">
                    <svg viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>
                    Estimated ROI for {PLANS.find(p => p.id === form.plan)?.name} Plan
                  </div>
                  <div className="sl-roi-grid">
                    <div className="sl-roi-item">
                      <div className="sl-roi-item-num" style={{ color: 'var(--accent)' }}>{currentRoi.traffic}</div>
                      <div className="sl-roi-item-label">Monthly Visitors</div>
                    </div>
                    <div className="sl-roi-item">
                      <div className="sl-roi-item-num" style={{ color: 'var(--emerald)' }}>{currentRoi.leads}</div>
                      <div className="sl-roi-item-label">Monthly Leads</div>
                    </div>
                    <div className="sl-roi-item">
                      <div className="sl-roi-item-num" style={{ color: currentRoi.backlink === 'Dofollow' ? 'var(--emerald)' : 'var(--gray-400)' }}>{currentRoi.backlink}</div>
                      <div className="sl-roi-item-label">Backlink Type</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ======================== STEP 6: REVIEW ======================== */}
          {step === 5 && (
            <>
              <div className="sl-review">
                <div className="sl-review-header">
                  <h3>Review Your Listing</h3>
                  <p>Please verify all information before submitting. You can edit your listing after approval.</p>
                </div>
                <div className="sl-review-body">
                  <div className="sl-review-grid">
                    <div className="sl-review-item">
                      <div className="sl-review-item-icon" style={{ background: 'var(--accent)' }}>
                        <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></svg>
                      </div>
                      <div>
                        <div className="sl-review-item-label">Business Name</div>
                        <div className="sl-review-item-value">{form.name || '—'}</div>
                      </div>
                    </div>
                    <div className="sl-review-item">
                      <div className="sl-review-item-icon" style={{ background: 'var(--azure)' }}>
                        <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                      </div>
                      <div>
                        <div className="sl-review-item-label">Website</div>
                        <div className="sl-review-item-value">{form.website || '—'}</div>
                      </div>
                    </div>
                    <div className="sl-review-item">
                      <div className="sl-review-item-icon" style={{ background: 'var(--plum)' }}>
                        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                      </div>
                      <div>
                        <div className="sl-review-item-label">Category</div>
                        <div className="sl-review-item-value">{CATEGORIES.find(c => c.id === form.category)?.name || '—'}</div>
                      </div>
                    </div>
                    <div className="sl-review-item">
                      <div className="sl-review-item-icon" style={{ background: 'var(--emerald)' }}>
                        <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                      </div>
                      <div>
                        <div className="sl-review-item-label">Selected Plan</div>
                        <div className="sl-review-item-value">{PLANS.find(p => p.id === form.plan)?.name} — {PLANS.find(p => p.id === form.plan)?.price}{PLANS.find(p => p.id === form.plan)?.period}</div>
                      </div>
                    </div>
                    <div className="sl-review-item">
                      <div className="sl-review-item-icon" style={{ background: 'var(--coral)' }}>
                        <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                      </div>
                      <div>
                        <div className="sl-review-item-label">Email</div>
                        <div className="sl-review-item-value">{form.email || '—'}</div>
                      </div>
                    </div>
                    <div className="sl-review-item">
                      <div className="sl-review-item-icon" style={{ background: 'var(--teal)' }}>
                        <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                      </div>
                      <div>
                        <div className="sl-review-item-label">Team & Location</div>
                        <div className="sl-review-item-value">{form.teamSize || '—'} &middot; {form.hqLocation || '—'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Features summary */}
                  {form.features.filter(Boolean).length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-700)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.03em' }}>Key Features</div>
                      <div className="sl-review-features">
                        {form.features.filter(Boolean).map((f, i) => (
                          <div className="sl-review-feature" key={i}>
                            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Integrations summary */}
                  {form.integrations.length > 0 && (
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-700)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.03em' }}>Integrations</div>
                      <div className="sl-review-tags">
                        {form.integrations.map((t, i) => (
                          <span className="sl-review-tag" key={i}>{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="sl-section" style={{ textAlign: 'center', padding: '20px 28px' }}>
                <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--gray-500)', lineHeight: 1.6, maxWidth: 500, margin: '0 auto' }}>
                  By submitting, you agree to InfoWebWorld's <Link to="/terms" style={{ color: 'var(--accent)', fontWeight: 400 }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: 'var(--accent)', fontWeight: 400 }}>Privacy Policy</Link>.
                  Listings are reviewed within 24-48 hours. You can edit your listing at any time after approval.
                </p>
              </div>
            </>
          )}

          {/* ===== NAVIGATION BUTTONS ===== */}
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

          {/* Trust badges */}
          <div className="sl-trust">
            <div className="sl-trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              SSL Encrypted
            </div>
            <div className="sl-trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><polyline points="20 6 9 17 4 12" /></svg>
              24-48hr Review
            </div>
            <div className="sl-trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--plum)" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              Cancel Anytime
            </div>
            <div className="sl-trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--azure)" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
              30-Day Guarantee
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
