import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/dashboard/DashboardLayout'

const CATEGORIES = [
  { id: 'technology-saas', name: 'Technology & SaaS', icon: <><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></>, color: 'var(--accent)' },
  { id: 'restaurants-food', name: 'Restaurants & Food', icon: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/></>, color: 'var(--coral)' },
  { id: 'healthcare-wellness', name: 'Healthcare & Wellness', icon: <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>, color: 'var(--emerald)' },
  { id: 'real-estate', name: 'Real Estate & Property', icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></>, color: 'var(--azure)' },
  { id: 'legal-financial', name: 'Legal & Financial', icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>, color: 'var(--plum)' },
  { id: 'education-training', name: 'Education & Training', icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></>, color: 'var(--teal)' },
  { id: 'marketing-creative', name: 'Marketing & Creative', icon: <><path d="M3 11l18-5v12L3 13v-2z"/></>, color: 'var(--rose)' },
  { id: 'home-services', name: 'Home Services & Trades', icon: <><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></>, color: 'var(--amber)' },
]

const STEPS = [
  { id: 'business', label: 'Business Info' },
  { id: 'media', label: 'Media & Branding' },
  { id: 'product', label: 'Product Details' },
  { id: 'company', label: 'Company' },
  { id: 'review', label: 'Review & Submit' },
]

export default function DashboardCreateListingPage() {
  const navigate = useNavigate()
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
  const next = () => goStep(Math.min(step + 1, STEPS.length - 1))
  const prev = () => goStep(Math.max(step - 1, 0))
  const handleSubmit = () => setSubmitted(true)

  const progress = ((step + 1) / STEPS.length) * 100

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

  if (submitted) {
    return (
      <DashboardLayout title="Listing Created" subtitle="Your new listing has been submitted">
        <div className="db-card db-full">
          <div className="db-card-body" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div className="dcl-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--gray-900)', margin: '16px 0 8px' }}>Listing Submitted Successfully!</h2>
            <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--gray-500)', maxWidth: 420, margin: '0 auto 24px', lineHeight: 1.7 }}>
              Your listing <strong style={{ color: 'var(--gray-700)', fontWeight: 500 }}>{form.name || 'New Listing'}</strong> has been submitted for review.
              Our team will review it within 24-48 hours. You'll receive an email at <strong style={{ color: 'var(--gray-700)', fontWeight: 500 }}>{form.email || 'your email'}</strong> once it goes live.
            </p>
            <div className="dcl-success-plan">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ width: 16, height: 16 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Your listing is covered under your current <strong>Pro Plan</strong> — no additional charges.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
              <button className="db-btn db-btn--primary" onClick={() => navigate('/dashboard/listing')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 14, height: 14 }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Manage Listing
              </button>
              <button className="db-btn db-btn--outline" onClick={() => { setSubmitted(false); setStep(0); setForm(f => ({ ...f, name: '', tagline: '', website: '', description: '', category: '', email: '', phone: '', features: ['', '', ''], integrations: [], founded: '', teamSize: '', funding: '', hqLocation: '', linkedIn: '', twitter: '', facebook: '' })) }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 14, height: 14 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                Create Another
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Create New Listing" subtitle="Add a new business listing to your account">

      {/* ── Progress & Steps ── */}
      <div className="db-card db-full">
        <div className="db-card-body" style={{ padding: '16px 20px' }}>
          <div className="dcl-steps">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`dcl-step${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}
                onClick={() => i <= step && goStep(i)}
              >
                <div className="dcl-step-num">
                  {i < step
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    : <span>{i + 1}</span>
                  }
                </div>
                <span className="dcl-step-label">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="dcl-progress">
            <div className="dcl-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* ══════════ STEP 1: BUSINESS INFO ══════════ */}
      {step === 0 && (
        <>
          <div className="db-card db-full">
            <div className="db-card-header">
              <div className="db-card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3"/></svg>
                Business Information
              </div>
              <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Step 1 of {STEPS.length}</span>
            </div>
            <div className="db-card-body">
              <div className="db-form-row">
                <div className="db-form-group">
                  <label className="db-form-label">Business / Product Name <span className="dcl-req">*</span></label>
                  <input className="db-form-input" placeholder="e.g. CloudSync Pro" value={form.name} onChange={e => up('name', e.target.value)} />
                </div>
                <div className="db-form-group">
                  <label className="db-form-label">Tagline</label>
                  <input className="db-form-input" placeholder="e.g. Enterprise cloud sync made simple" value={form.tagline} onChange={e => up('tagline', e.target.value)} maxLength={80} />
                  <div className="db-form-hint">{form.tagline.length}/80 characters</div>
                </div>
              </div>

              <div className="db-form-row">
                <div className="db-form-group">
                  <label className="db-form-label">Website URL <span className="dcl-req">*</span></label>
                  <input className="db-form-input" type="url" placeholder="https://your-product.com" value={form.website} onChange={e => up('website', e.target.value)} />
                </div>
                <div className="db-form-group">
                  <label className="db-form-label">Business Email <span className="dcl-req">*</span></label>
                  <input className="db-form-input" type="email" placeholder="hello@your-product.com" value={form.email} onChange={e => up('email', e.target.value)} />
                </div>
              </div>

              <div className="db-form-group">
                <label className="db-form-label">Description <span className="dcl-req">*</span></label>
                <div className="db-form-hint" style={{ marginBottom: 4 }}>Describe your product in 150-500 characters. Appears in search results.</div>
                <textarea className="db-form-textarea" placeholder="What does your product do? What problems does it solve?" value={form.description} onChange={e => up('description', e.target.value)} maxLength={500} rows={4} />
                <div className="db-form-hint">{form.description.length}/500 characters</div>
              </div>

              <div className="db-form-row">
                <div className="db-form-group">
                  <label className="db-form-label">Phone Number</label>
                  <input className="db-form-input" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => up('phone', e.target.value)} />
                </div>
                <div className="db-form-group">
                  <label className="db-form-label">Business Address</label>
                  <input className="db-form-input" placeholder="123 Main St, City, State" value={form.address} onChange={e => up('address', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="db-card db-full">
            <div className="db-card-header">
              <div className="db-card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Primary Category <span className="dcl-req">*</span>
              </div>
            </div>
            <div className="db-card-body">
              <div className="dcl-cat-grid">
                {CATEGORIES.map(cat => (
                  <div
                    key={cat.id}
                    className={`dcl-cat-option${form.category === cat.id ? ' selected' : ''}`}
                    onClick={() => up('category', cat.id)}
                  >
                    <div className="dcl-cat-icon" style={{ background: `${cat.color}12`, color: cat.color }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{cat.icon}</svg>
                    </div>
                    <span className="dcl-cat-name">{cat.name}</span>
                    <div className="dcl-cat-check">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════ STEP 2: MEDIA & BRANDING ══════════ */}
      {step === 1 && (
        <div className="db-card db-full">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Media & Branding
            </div>
            <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Step 2 of {STEPS.length}</span>
          </div>
          <div className="db-card-body">
            {/* Logo Upload */}
            <div style={{ marginBottom: 24 }}>
              <label className="db-form-label">Company Logo</label>
              <div className="db-form-hint" style={{ marginBottom: 8 }}>Recommended: 256x256px or larger, PNG/SVG with transparent background</div>
              <div className="dcl-upload-zone">
                <div className="dcl-upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div className="dcl-upload-text">
                  <span style={{ fontWeight: 500, color: 'var(--accent)' }}>Click to upload</span> or drag & drop
                </div>
                <div className="dcl-upload-hint">PNG, SVG, JPG up to 5MB</div>
              </div>
            </div>

            {/* Screenshots */}
            <div style={{ marginBottom: 24 }}>
              <label className="db-form-label">Product Screenshots</label>
              <div className="db-form-hint" style={{ marginBottom: 8 }}>Upload up to 10 screenshots. 16:10 aspect ratio recommended.</div>
              <div className="dcl-screenshot-grid">
                {[0,1,2,3,4].map(i => (
                  <div className="dcl-screenshot-slot" key={i}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span>Screenshot {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cover Image */}
            <div style={{ marginBottom: 24 }}>
              <label className="db-form-label">Cover Image</label>
              <div className="db-form-hint" style={{ marginBottom: 8 }}>1200x400px recommended (PNG, JPG)</div>
              <div className="dbl-cover-upload">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ width: 28, height: 28 }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>Drag & drop your cover image or click to browse</span>
              </div>
            </div>

            {/* Demo Video */}
            <div className="db-form-group">
              <label className="db-form-label">Demo Video URL</label>
              <input className="db-form-input" type="url" placeholder="https://youtube.com/watch?v=..." value={form.demoVideo} onChange={e => up('demoVideo', e.target.value)} />
              <div className="db-form-hint">Link to a YouTube or Vimeo demo of your product</div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ STEP 3: PRODUCT DETAILS ══════════ */}
      {step === 2 && (
        <>
          {/* Key Features */}
          <div className="db-card db-full">
            <div className="db-card-header">
              <div className="db-card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                Key Features
              </div>
              <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Step 3 of {STEPS.length}</span>
            </div>
            <div className="db-card-body">
              <div className="db-form-hint" style={{ marginBottom: 12 }}>List the top features of your product (minimum 3)</div>
              <div className="dcl-feature-list">
                {form.features.map((f, i) => (
                  <div className="dcl-feature-item" key={i}>
                    <div className="dcl-feature-num">{i + 1}</div>
                    <input className="db-form-input" placeholder={`Feature ${i + 1} (e.g. "Real-time collaboration")`} value={f} onChange={e => updateFeature(i, e.target.value)} style={{ flex: 1 }} />
                    {form.features.length > 3 && (
                      <button className="dcl-feature-remove" onClick={() => removeFeature(i)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {form.features.length < 15 && (
                <button className="db-btn db-btn--outline" style={{ marginTop: 10, fontSize: 12 }} onClick={addFeature}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Feature
                </button>
              )}
            </div>
          </div>

          {/* Integrations */}
          <div className="db-card db-full">
            <div className="db-card-header">
              <div className="db-card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                Integrations
              </div>
            </div>
            <div className="db-card-body">
              <div className="db-form-hint" style={{ marginBottom: 12 }}>What tools and platforms does your product integrate with?</div>
              <div className="dcl-tags-wrap">
                {form.integrations.map((t, i) => (
                  <span className="dcl-tag" key={i}>
                    {t}
                    <button className="dcl-tag-remove" onClick={() => removeIntegration(i)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </span>
                ))}
                <input
                  className="db-form-input dcl-tags-input"
                  placeholder="Type and press Enter (e.g. Slack, Salesforce)"
                  value={form.integrationsInput}
                  onChange={e => up('integrationsInput', e.target.value)}
                  onKeyDown={addIntegration}
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="db-card db-full">
            <div className="db-card-header">
              <div className="db-card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                Pricing Information
              </div>
            </div>
            <div className="db-card-body">
              <div className="db-form-group">
                <label className="db-form-label">Pricing Model</label>
                <select className="db-form-select" value={form.pricingModel} onChange={e => up('pricingModel', e.target.value)} style={{ maxWidth: 300 }}>
                  <option value="subscription">Subscription (Monthly/Annual)</option>
                  <option value="one-time">One-time Purchase</option>
                  <option value="freemium">Freemium</option>
                  <option value="usage">Usage-based / Pay-per-use</option>
                  <option value="contact">Contact for Pricing</option>
                  <option value="free">Completely Free</option>
                </select>
              </div>

              <label className="db-form-label">Pricing Tiers</label>
              <div className="db-form-hint" style={{ marginBottom: 10 }}>Optional — helps users understand your pricing at a glance</div>
              <div className="dcl-pricing-grid">
                {form.pricingTiers.map((tier, i) => (
                  <div className="dcl-pricing-tier" key={i}>
                    <div className="dcl-pricing-tier-head">Tier {i + 1}</div>
                    <input className="db-form-input" placeholder="Plan name" value={tier.name} onChange={e => updateTier(i, 'name', e.target.value)} style={{ marginBottom: 6 }} />
                    <input className="db-form-input" placeholder="$0" value={tier.price} onChange={e => updateTier(i, 'price', e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════ STEP 4: COMPANY DETAILS ══════════ */}
      {step === 3 && (
        <div className="db-card db-full">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              Company Details
            </div>
            <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Step 4 of {STEPS.length}</span>
          </div>
          <div className="db-card-body">
            <div className="db-form-row">
              <div className="db-form-group">
                <label className="db-form-label">Year Founded</label>
                <input className="db-form-input" type="number" placeholder="e.g. 2020" min="1900" max="2026" value={form.founded} onChange={e => up('founded', e.target.value)} />
              </div>
              <div className="db-form-group">
                <label className="db-form-label">Team Size</label>
                <select className="db-form-select" value={form.teamSize} onChange={e => up('teamSize', e.target.value)}>
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

            <div className="db-form-row">
              <div className="db-form-group">
                <label className="db-form-label">Funding Stage</label>
                <select className="db-form-select" value={form.funding} onChange={e => up('funding', e.target.value)}>
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
              <div className="db-form-group">
                <label className="db-form-label">Headquarters</label>
                <input className="db-form-input" placeholder="e.g. San Francisco, CA" value={form.hqLocation} onChange={e => up('hqLocation', e.target.value)} />
              </div>
            </div>

            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--gray-100)' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ width: 14, height: 14 }}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                Social Links
              </div>
              <div className="db-form-row">
                <div className="db-form-group">
                  <label className="db-form-label">LinkedIn</label>
                  <input className="db-form-input" placeholder="https://linkedin.com/company/..." value={form.linkedIn} onChange={e => up('linkedIn', e.target.value)} />
                </div>
                <div className="db-form-group">
                  <label className="db-form-label">Twitter / X</label>
                  <input className="db-form-input" placeholder="https://x.com/..." value={form.twitter} onChange={e => up('twitter', e.target.value)} />
                </div>
              </div>
              <div className="db-form-group" style={{ maxWidth: '50%' }}>
                <label className="db-form-label">Facebook</label>
                <input className="db-form-input" placeholder="https://facebook.com/..." value={form.facebook} onChange={e => up('facebook', e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ STEP 5: REVIEW & SUBMIT ══════════ */}
      {step === 4 && (
        <>
          <div className="db-card db-full">
            <div className="db-card-header">
              <div className="db-card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Review Your Listing
              </div>
              <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Step 5 of {STEPS.length}</span>
            </div>
            <div className="db-card-body">
              <div className="db-form-hint" style={{ marginBottom: 16 }}>Please verify all information before submitting. You can edit your listing after approval.</div>

              <div className="dcl-review-grid">
                {[
                  { label: 'Business Name', value: form.name, color: 'var(--accent)', icon: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3"/></> },
                  { label: 'Website', value: form.website, color: 'var(--azure)', icon: <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></> },
                  { label: 'Category', value: CATEGORIES.find(c => c.id === form.category)?.name, color: 'var(--plum)', icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></> },
                  { label: 'Plan', value: 'Pro Plan (Current)', color: 'var(--emerald)', icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></> },
                  { label: 'Email', value: form.email, color: 'var(--coral)', icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></> },
                  { label: 'Team & Location', value: `${form.teamSize || '—'} · ${form.hqLocation || '—'}`, color: 'var(--teal)', icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></> },
                ].map((item, i) => (
                  <div key={i} className="dcl-review-item">
                    <div className="dcl-review-icon" style={{ background: `${item.color}12` }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
                    </div>
                    <div>
                      <div className="dcl-review-label">{item.label}</div>
                      <div className="dcl-review-value">{item.value || '—'}</div>
                    </div>
                  </div>
                ))}
              </div>

              {form.description && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--gray-100)' }}>
                  <div className="dcl-review-section-title">Description</div>
                  <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--gray-600)', lineHeight: 1.6, margin: 0 }}>{form.description}</p>
                </div>
              )}

              {form.features.filter(Boolean).length > 0 && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--gray-100)' }}>
                  <div className="dcl-review-section-title">Key Features</div>
                  <div className="dcl-review-features">
                    {form.features.filter(Boolean).map((f, i) => (
                      <div className="dcl-review-feature" key={i}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2" style={{ width: 14, height: 14, flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {form.integrations.length > 0 && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--gray-100)' }}>
                  <div className="dcl-review-section-title">Integrations</div>
                  <div className="dcl-review-tags">
                    {form.integrations.map((t, i) => (
                      <span className="dcl-tag" key={i} style={{ cursor: 'default' }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Plan Notice */}
          <div className="db-card db-full">
            <div className="db-card-body">
              <div className="dcl-plan-notice">
                <div className="dcl-plan-notice-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <div className="dcl-plan-notice-title">Covered Under Your Pro Plan</div>
                  <div className="dcl-plan-notice-desc">This listing will be created under your existing Pro Plan. No additional payment required. You can manage your plan from <Link to="/dashboard/billing" style={{ color: 'var(--accent)', fontWeight: 500 }}>Billing & Plan</Link>.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="db-card db-full">
            <div className="db-card-body" style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--gray-500)', lineHeight: 1.6, maxWidth: 500, margin: '0 auto' }}>
                By submitting, you agree to InfoWebWorld's <Link to="/terms" style={{ color: 'var(--accent)', fontWeight: 400 }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: 'var(--accent)', fontWeight: 400 }}>Privacy Policy</Link>.
                Listings are reviewed within 24-48 hours.
              </p>
            </div>
          </div>
        </>
      )}

      {/* ── Navigation Bar ── */}
      <div className="dcl-nav">
        <div className="dcl-nav-left">
          {step > 0 && (
            <button className="db-btn db-btn--outline" onClick={prev}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
          )}
          <span className="dcl-auto-save">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5" style={{ width: 12, height: 12 }}><polyline points="20 6 9 17 4 12"/></svg>
            Draft auto-saved
          </span>
        </div>
        <div className="dcl-nav-right">
          <button className="db-btn db-btn--outline" onClick={() => navigate('/dashboard/listing')}>
            Cancel
          </button>
          {step < STEPS.length - 1 ? (
            <button className="db-btn db-btn--primary" onClick={next}>
              Continue
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          ) : (
            <button className="db-btn db-btn--primary" style={{ background: 'var(--emerald)' }} onClick={handleSubmit}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Submit Listing
            </button>
          )}
        </div>
      </div>

    </DashboardLayout>
  )
}
