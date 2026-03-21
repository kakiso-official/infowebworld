'use client'
import { useState } from 'react'
import Link from 'next/link'

/* ── Category data ── */
const categories = [
  { name: 'Technology & SaaS', color: '#4361EE' },
  { name: 'Restaurants & Food', color: '#E8553D' },
  { name: 'Healthcare & Wellness', color: '#2FAE6A' },
  { name: 'Real Estate', color: '#3B82F6' },
  { name: 'Legal & Financial', color: '#8B5CF6' },
  { name: 'Education & Training', color: '#14B8A6' },
  { name: 'Marketing & Creative', color: '#EC4899' },
  { name: 'Home Services', color: '#F59E0B' },
  { name: 'Automotive', color: '#6B7280' },
  { name: 'Beauty & Spa', color: '#D4729A' },
  { name: 'Fitness & Sports', color: '#5CB8A2' },
  { name: 'Finance & Banking', color: '#D4A028' },
  { name: 'Travel & Hospitality', color: '#4A9BDE' },
  { name: 'Design & Architecture', color: '#FF6B8A' },
  { name: 'Manufacturing', color: '#2B4C8C' },
  { name: 'Non-Profit & NGO', color: '#7C5CFC' },
]

const countries = [
  'United States', 'India', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Netherlands', 'Singapore', 'UAE', 'Other',
]

/* ── Plan data ── */
const plans = [
  {
    id: 'founding',
    name: 'Founding Company',
    tag: 'First 200 Only',
    tagColor: '#E8553D',
    price: 240,
    period: 'one-time',
    periodLabel: 'Lifetime — pay once, listed forever',
    features: [
      'Permanent lifetime listing',
      'Founding Member badge',
      'Dofollow backlink',
      'Priority placement in search',
      'Verified business profile',
      'Analytics dashboard',
      'Unlimited photos & media',
      'Lead generation tools',
    ],
  },
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    tag: 'First 1,000',
    tagColor: '#4361EE',
    price: 140,
    period: '/year',
    periodLabel: '42% off standard yearly price',
    featured: true,
    features: [
      'Full business listing',
      'Dofollow backlink',
      'Verified profile badge',
      'Review management',
      'Analytics dashboard',
      'Lead generation tools',
      'Priority support',
      'Social media integration',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    tag: 'Post-Launch Price',
    tagColor: '#2FAE6A',
    price: 240,
    period: '/year',
    periodLabel: 'or $999 for lifetime access',
    features: [
      'Full business listing',
      'Dofollow backlink',
      'Verified profile badge',
      'Review management',
      'Analytics dashboard',
      'Lead generation tools',
    ],
  },
]

const check = (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="#2FAE6A" fill="none" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" />
  </svg>
)

type FormData = {
  /* Step 1 */
  companyName: string
  website: string
  email: string
  phone: string
  contactName: string
  /* Step 2 */
  category: string
  country: string
  city: string
  tagline: string
  description: string
  founded: string
  employees: string
  /* Step 3 */
  plan: string
}

const initial: FormData = {
  companyName: '', website: '', email: '', phone: '', contactName: '',
  category: '', country: '', city: '', tagline: '', description: '', founded: '', employees: '',
  plan: 'early-adopter',
}

export default function ListingForm() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(initial)
  const [submitted, setSubmitted] = useState(false)

  const set = (field: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const next = () => setStep(s => Math.min(s + 1, 4))
  const prev = () => setStep(s => Math.max(s - 1, 1))

  /* ── Validation ── */
  const canProceed = () => {
    if (step === 1) return form.companyName && form.email && form.contactName
    if (step === 2) return form.category && form.country && form.tagline
    if (step === 3) return form.plan
    return true
  }

  const handleSubmit = () => {
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectedPlan = plans.find(p => p.id === form.plan)

  /* ── SUCCESS STATE ── */
  if (submitted) {
    return (
      <section className="listing-section">
        <div className="container">
          <div className="listing-success">
            <div className="listing-success-icon">
              <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></svg>
            </div>
            <h1 className="listing-success-title">You&apos;re In!</h1>
            <p className="listing-success-sub">
              <strong>{form.companyName}</strong> has been submitted for pre-launch listing on InfoWebWorld.
            </p>

            <div className="listing-success-plan">
              <div className="listing-success-plan-tag" style={{ background: selectedPlan?.tagColor }}>
                {selectedPlan?.name} Plan
              </div>
              <div className="listing-success-plan-price">
                ${selectedPlan?.price}<span>{selectedPlan?.period}</span>
              </div>
            </div>

            <div className="listing-success-benefits">
              <h3>What happens next?</h3>
              <div className="listing-success-steps">
                <div className="listing-success-step">
                  <div className="listing-success-step-num">1</div>
                  <div>
                    <strong>Confirmation Email</strong>
                    <p>Check <strong>{form.email}</strong> for your confirmation and payment link.</p>
                  </div>
                </div>
                <div className="listing-success-step">
                  <div className="listing-success-step-num">2</div>
                  <div>
                    <strong>Complete Payment</strong>
                    <p>Secure your {selectedPlan?.name} spot by completing payment via the link.</p>
                  </div>
                </div>
                <div className="listing-success-step">
                  <div className="listing-success-step-num">3</div>
                  <div>
                    <strong>Profile Setup</strong>
                    <p>Once paid, you&apos;ll get access to complete your full business profile with photos, hours, and more.</p>
                  </div>
                </div>
                <div className="listing-success-step">
                  <div className="listing-success-step-num">4</div>
                  <div>
                    <strong>Go Live on Launch Day</strong>
                    <p>Your listing goes live automatically when we launch. Founding members get priority placement.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="listing-success-perks">
              <h3>Your {selectedPlan?.name} Benefits</h3>
              <ul>
                {selectedPlan?.features.map((f, i) => (
                  <li key={i}>{check}<span>{f}</span></li>
                ))}
              </ul>
            </div>

            <div className="listing-success-actions">
              <Link href="/" className="listing-btn listing-btn--secondary">Back to Home</Link>
              <Link href="/get-listed" className="listing-btn listing-btn--primary" onClick={() => { setSubmitted(false); setStep(1); setForm(initial) }}>
                List Another Business
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="listing-section">
      <div className="container">
        {/* ── Progress bar ── */}
        <div className="listing-progress">
          {[
            { n: 1, label: 'Business Info' },
            { n: 2, label: 'Details' },
            { n: 3, label: 'Select Plan' },
            { n: 4, label: 'Review' },
          ].map(s => (
            <div key={s.n} className={`listing-progress-step${step >= s.n ? ' listing-progress-step--active' : ''}${step > s.n ? ' listing-progress-step--done' : ''}`}>
              <div className="listing-progress-dot">
                {step > s.n ? (
                  <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                ) : s.n}
              </div>
              <span className="listing-progress-label">{s.label}</span>
            </div>
          ))}
          <div className="listing-progress-line">
            <div className="listing-progress-line-fill" style={{ width: `${((step - 1) / 3) * 100}%` }} />
          </div>
        </div>

        <div className="listing-card">
          {/* ══════════ STEP 1: Business Info ══════════ */}
          {step === 1 && (
            <div className="listing-step">
              <div className="listing-step-header">
                <h1 className="listing-step-title">Tell Us About Your Business</h1>
                <p className="listing-step-desc">Basic information to get your listing started.</p>
              </div>

              <div className="listing-fields">
                <div className="listing-field">
                  <label className="listing-label">Company / Business Name <span>*</span></label>
                  <input
                    type="text"
                    className="listing-input"
                    placeholder="e.g. Acme Corporation"
                    value={form.companyName}
                    onChange={e => set('companyName', e.target.value)}
                    required
                  />
                </div>

                <div className="listing-field">
                  <label className="listing-label">Contact Person <span>*</span></label>
                  <input
                    type="text"
                    className="listing-input"
                    placeholder="Your full name"
                    value={form.contactName}
                    onChange={e => set('contactName', e.target.value)}
                    required
                  />
                </div>

                <div className="listing-row">
                  <div className="listing-field">
                    <label className="listing-label">Business Email <span>*</span></label>
                    <input
                      type="email"
                      className="listing-input"
                      placeholder="hello@company.com"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="listing-field">
                    <label className="listing-label">Phone Number</label>
                    <input
                      type="tel"
                      className="listing-input"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="listing-field">
                  <label className="listing-label">Website URL</label>
                  <input
                    type="url"
                    className="listing-input"
                    placeholder="https://www.company.com"
                    value={form.website}
                    onChange={e => set('website', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ STEP 2: Category & Details ══════════ */}
          {step === 2 && (
            <div className="listing-step">
              <div className="listing-step-header">
                <h2 className="listing-step-title">Category &amp; Details</h2>
                <p className="listing-step-desc">Help customers find you in the right category.</p>
              </div>

              <div className="listing-fields">
                <div className="listing-field">
                  <label className="listing-label">Category <span>*</span></label>
                  <div className="listing-cats">
                    {categories.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        className={`listing-cat-chip${form.category === c.name ? ' listing-cat-chip--selected' : ''}`}
                        style={{
                          background: form.category === c.name ? c.color : `${c.color}12`,
                          color: form.category === c.name ? '#fff' : c.color,
                          borderColor: form.category === c.name ? c.color : 'transparent',
                        }}
                        onClick={() => set('category', c.name)}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="listing-row">
                  <div className="listing-field">
                    <label className="listing-label">Country <span>*</span></label>
                    <select
                      className="listing-input listing-select"
                      value={form.country}
                      onChange={e => set('country', e.target.value)}
                      required
                    >
                      <option value="">Select country</option>
                      {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="listing-field">
                    <label className="listing-label">City</label>
                    <input
                      type="text"
                      className="listing-input"
                      placeholder="e.g. San Francisco"
                      value={form.city}
                      onChange={e => set('city', e.target.value)}
                    />
                  </div>
                </div>

                <div className="listing-field">
                  <label className="listing-label">Tagline <span>*</span></label>
                  <input
                    type="text"
                    className="listing-input"
                    placeholder="A short, catchy description (max 80 chars)"
                    maxLength={80}
                    value={form.tagline}
                    onChange={e => set('tagline', e.target.value)}
                    required
                  />
                  <span className="listing-char-count">{form.tagline.length}/80</span>
                </div>

                <div className="listing-field">
                  <label className="listing-label">Description</label>
                  <textarea
                    className="listing-input listing-textarea"
                    placeholder="Tell potential customers what makes your business special..."
                    rows={4}
                    maxLength={500}
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                  />
                  <span className="listing-char-count">{form.description.length}/500</span>
                </div>

                <div className="listing-row">
                  <div className="listing-field">
                    <label className="listing-label">Year Founded</label>
                    <input
                      type="text"
                      className="listing-input"
                      placeholder="e.g. 2020"
                      maxLength={4}
                      value={form.founded}
                      onChange={e => set('founded', e.target.value)}
                    />
                  </div>
                  <div className="listing-field">
                    <label className="listing-label">Team Size</label>
                    <select
                      className="listing-input listing-select"
                      value={form.employees}
                      onChange={e => set('employees', e.target.value)}
                    >
                      <option value="">Select size</option>
                      <option value="1">Solo / Freelancer</option>
                      <option value="2-10">2–10</option>
                      <option value="11-50">11–50</option>
                      <option value="51-200">51–200</option>
                      <option value="201-500">201–500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ STEP 3: Select Plan ══════════ */}
          {step === 3 && (
            <div className="listing-step">
              <div className="listing-step-header">
                <h2 className="listing-step-title">Choose Your Plan</h2>
                <p className="listing-step-desc">Lock in pre-launch pricing — these rates won&apos;t last.</p>
              </div>

              <div className="listing-plans">
                {plans.map(plan => (
                  <button
                    key={plan.id}
                    type="button"
                    className={`listing-plan${form.plan === plan.id ? ' listing-plan--selected' : ''}${plan.featured ? ' listing-plan--featured' : ''}`}
                    onClick={() => set('plan', plan.id)}
                  >
                    {plan.featured && <div className="listing-plan-popular">Most Popular</div>}
                    <div className="listing-plan-radio">
                      <div className={`listing-plan-radio-dot${form.plan === plan.id ? ' listing-plan-radio-dot--active' : ''}`} />
                    </div>
                    <div className="listing-plan-tag" style={{ background: `${plan.tagColor}15`, color: plan.tagColor }}>
                      {plan.tag}
                    </div>
                    <div className="listing-plan-name">{plan.name}</div>
                    <div className="listing-plan-price">
                      <span className="listing-plan-currency">$</span>
                      <span className="listing-plan-amount">{plan.price}</span>
                      <span className="listing-plan-period">{plan.period}</span>
                    </div>
                    <div className="listing-plan-note">{plan.periodLabel}</div>
                    <ul className="listing-plan-features">
                      {plan.features.map((f, i) => (
                        <li key={i}>{check}<span>{f}</span></li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              <div className="listing-portfolio-note">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="#2FAE6A" fill="none" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                </svg>
                <span>
                  <strong>Incubators &amp; Portfolio Companies:</strong> Companies with 5+ tools/apps/startups get free listings.{' '}
                  <a href="mailto:hello@infowebworld.com" style={{ color: '#E8553D', fontWeight: 700 }}>Contact us</a>
                </span>
              </div>
            </div>
          )}

          {/* ══════════ STEP 4: Review & Submit ══════════ */}
          {step === 4 && (
            <div className="listing-step">
              <div className="listing-step-header">
                <h2 className="listing-step-title">Review Your Listing</h2>
                <p className="listing-step-desc">Double-check everything before submitting.</p>
              </div>

              <div className="listing-review">
                <div className="listing-review-section">
                  <div className="listing-review-section-title">
                    <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></svg>
                    Business Information
                    <button className="listing-review-edit" onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <div className="listing-review-grid">
                    <div className="listing-review-item">
                      <span className="listing-review-label">Company</span>
                      <span className="listing-review-value">{form.companyName}</span>
                    </div>
                    <div className="listing-review-item">
                      <span className="listing-review-label">Contact</span>
                      <span className="listing-review-value">{form.contactName}</span>
                    </div>
                    <div className="listing-review-item">
                      <span className="listing-review-label">Email</span>
                      <span className="listing-review-value">{form.email}</span>
                    </div>
                    {form.phone && (
                      <div className="listing-review-item">
                        <span className="listing-review-label">Phone</span>
                        <span className="listing-review-value">{form.phone}</span>
                      </div>
                    )}
                    {form.website && (
                      <div className="listing-review-item">
                        <span className="listing-review-label">Website</span>
                        <span className="listing-review-value">{form.website}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="listing-review-section">
                  <div className="listing-review-section-title">
                    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                    Listing Details
                    <button className="listing-review-edit" onClick={() => setStep(2)}>Edit</button>
                  </div>
                  <div className="listing-review-grid">
                    <div className="listing-review-item">
                      <span className="listing-review-label">Category</span>
                      <span className="listing-review-value">{form.category}</span>
                    </div>
                    <div className="listing-review-item">
                      <span className="listing-review-label">Location</span>
                      <span className="listing-review-value">{form.city ? `${form.city}, ` : ''}{form.country}</span>
                    </div>
                    <div className="listing-review-item listing-review-item--full">
                      <span className="listing-review-label">Tagline</span>
                      <span className="listing-review-value">{form.tagline}</span>
                    </div>
                    {form.description && (
                      <div className="listing-review-item listing-review-item--full">
                        <span className="listing-review-label">Description</span>
                        <span className="listing-review-value">{form.description}</span>
                      </div>
                    )}
                    {form.founded && (
                      <div className="listing-review-item">
                        <span className="listing-review-label">Founded</span>
                        <span className="listing-review-value">{form.founded}</span>
                      </div>
                    )}
                    {form.employees && (
                      <div className="listing-review-item">
                        <span className="listing-review-label">Team Size</span>
                        <span className="listing-review-value">{form.employees}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="listing-review-section">
                  <div className="listing-review-section-title">
                    <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                    Selected Plan
                    <button className="listing-review-edit" onClick={() => setStep(3)}>Edit</button>
                  </div>
                  {selectedPlan && (
                    <div className="listing-review-plan">
                      <div className="listing-review-plan-header">
                        <div>
                          <div className="listing-review-plan-name">{selectedPlan.name}</div>
                          <div className="listing-review-plan-tag" style={{ color: selectedPlan.tagColor }}>{selectedPlan.tag}</div>
                        </div>
                        <div className="listing-review-plan-price">
                          ${selectedPlan.price}<span>{selectedPlan.period}</span>
                        </div>
                      </div>
                      <ul className="listing-review-plan-features">
                        {selectedPlan.features.map((f, i) => (
                          <li key={i}>{check}<span>{f}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="listing-submit-note">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="#9A9590" fill="none" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>After submitting, you&apos;ll receive a secure payment link via email. Your listing is reserved for 48 hours.</span>
              </div>
            </div>
          )}

          {/* ── Navigation buttons ── */}
          <div className="listing-actions">
            {step > 1 && (
              <button type="button" className="listing-btn listing-btn--secondary" onClick={prev}>
                <svg viewBox="0 0 24 24"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < 4 ? (
              <button
                type="button"
                className="listing-btn listing-btn--primary"
                onClick={next}
                disabled={!canProceed()}
              >
                Continue
                <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </button>
            ) : (
              <button
                type="button"
                className="listing-btn listing-btn--primary listing-btn--submit"
                onClick={handleSubmit}
              >
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                Submit &amp; Get Payment Link
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
