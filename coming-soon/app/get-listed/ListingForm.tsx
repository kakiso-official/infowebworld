'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { addSubmission } from '../iww-hq/data/submissions-storage'

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

const phoneCodes = [
  { label: 'US', code: '+1' },
  { label: 'IN', code: '+91' },
  { label: 'UK', code: '+44' },
  { label: 'CA', code: '+1' },
  { label: 'AU', code: '+61' },
  { label: 'DE', code: '+49' },
  { label: 'FR', code: '+33' },
  { label: 'NL', code: '+31' },
  { label: 'SG', code: '+65' },
  { label: 'AE', code: '+971' },
]

const teamSizes = ['Solo / Freelancer', '2–10', '11–50', '51–200', '201–500', '500+']

/* ── Plan data ── */
const plans = [
  {
    id: 'founding', name: 'Founding Company', tag: 'First 200 Only', tagColor: '#E8553D',
    price: 240, period: 'one-time', periodLabel: 'Lifetime — pay once, listed forever',
    locked: false, lockNote: '',
    features: ['Permanent lifetime listing', 'Founding Member badge', 'Dofollow backlink (DA 72+)', 'Priority placement in search', 'Verified business profile', 'Analytics dashboard', 'Unlimited photos & media', 'Lead generation tools'],
  },
  {
    id: 'early-adopter', name: 'Early Adopter', tag: 'First 1,000', tagColor: '#4361EE',
    price: 99, period: '/year', periodLabel: '59% off standard yearly price',
    locked: true, lockNote: 'Unlocks after 200 Founding spots fill',
    features: ['Full business listing', 'Dofollow backlink (DA 72+)', 'Verified profile badge', 'Review management', 'Analytics dashboard', 'Lead generation tools', 'Priority support', 'Social media integration'],
  },
  {
    id: 'standard', name: 'Standard', tag: 'Post-Launch', tagColor: '#2FAE6A',
    price: 240, period: '/year', periodLabel: 'Regular launch pricing',
    locked: true, lockNote: 'Unlocks after Early Adopter tier fills',
    features: ['Full business listing', 'Dofollow backlink (DA 72+)', 'Verified profile badge', 'Review management', 'Analytics dashboard', 'Lead generation tools'],
  },
]

const Ck = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="#2FAE6A" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

/* ── Reusable small check for validated fields ── */
const FieldCheck = () => (
  <div className="ld-field-check">
    <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /><path d="M6 10.5l2.5 2.5L14 7.5" /></svg>
  </div>
)

/* ── Dropdown arrow ── */
const Arrow = () => (
  <svg className="ld-dd-arrow" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
)

/* ── Validation helpers ── */
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isUrl = (v: string) => !v || /^https?:\/\/.+\..+/.test(v)

type FormData = {
  companyName: string; website: string; email: string; phone: string; phoneCode: string; contactName: string
  category: string; country: string; city: string; tagline: string; description: string; founded: string; employees: string
  plan: string
}

const initial: FormData = {
  companyName: '', website: '', email: '', phone: '', phoneCode: '+1', contactName: '',
  category: '', country: '', city: '', tagline: '', description: '', founded: '', employees: '',
  plan: 'founding',
}

export default function ListingForm() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(initial)
  const [submitted, setSubmitted] = useState(false)
  const [openDd, setOpenDd] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const set = (f: keyof FormData, v: string) => setForm(p => ({ ...p, [f]: v }))
  const next = () => { setStep(s => Math.min(s + 1, 4)); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const prev = () => { setStep(s => Math.max(s - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!openDd) return
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.ld-dd')) setOpenDd(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openDd])

  const toggleDd = (name: string) => setOpenDd(openDd === name ? null : name)

  /* ── Per-field validation ── */
  const ok = (f: string): boolean => {
    const v = form[f as keyof FormData]
    if (f === 'email') return !!v && isEmail(v)
    if (f === 'website') return !!v && isUrl(v)
    if (f === 'tagline') return !!v && v.length > 0
    return !!v
  }

  const canProceed = () => {
    if (step === 1) return ok('companyName') && ok('contactName') && ok('email')
    if (step === 2) return ok('category') && ok('country') && ok('tagline')
    if (step === 3) return !!form.plan
    return true
  }

  const handleSubmit = () => {
    addSubmission({
      companyName: form.companyName, contactName: form.contactName, email: form.email,
      phoneCode: form.phoneCode, phone: form.phone, website: form.website,
      category: form.category, country: form.country, city: form.city,
      tagline: form.tagline, description: form.description, founded: form.founded,
      employees: form.employees, plan: form.plan,
    })
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const selectedPlan = plans.find(p => p.id === form.plan)

  /* ══════════ SUCCESS STATE ══════════ */
  if (submitted) {
    return (
      <section className="listing-section">
        <div className="container">
          <div className="listing-success">
            <div className="listing-success-icon">
              <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
            <h1 className="listing-success-title">You&apos;re In!</h1>
            <p className="listing-success-sub">
              <strong>{form.companyName}</strong> has been submitted for pre-launch listing on InfoWebWorld.
            </p>
            <div className="listing-success-plan">
              <div className="listing-success-plan-tag" style={{ background: selectedPlan?.tagColor }}>{selectedPlan?.name} Plan</div>
              <div className="listing-success-plan-price">${selectedPlan?.price}<span>{selectedPlan?.period}</span></div>
            </div>
            <div className="listing-success-benefits">
              <h3>What happens next?</h3>
              <div className="listing-success-steps">
                {[
                  { t: 'Confirmation Email', d: `Check ${form.email} for your confirmation and payment link.` },
                  { t: 'Complete Payment', d: `Secure your ${selectedPlan?.name} spot by completing payment via the link.` },
                  { t: 'Profile Setup', d: "Once paid, complete your full business profile with photos, hours, and more." },
                  { t: 'Go Live on Launch Day', d: 'Your listing goes live automatically when we launch. Founding members get priority.' },
                ].map((s, i) => (
                  <div key={i} className="listing-success-step">
                    <div className="listing-success-step-num">{i + 1}</div>
                    <div><strong>{s.t}</strong><p>{s.d}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="listing-success-perks">
              <h3>Your {selectedPlan?.name} Benefits</h3>
              <ul>{selectedPlan?.features.map((f, i) => <li key={i}><Ck /><span>{f}</span></li>)}</ul>
            </div>
            <div className="listing-success-actions">
              <Link href="/" className="listing-btn listing-btn--secondary">Back to Home</Link>
              <button type="button" className="listing-btn listing-btn--primary" onClick={() => { setSubmitted(false); setStep(1); setForm(initial) }}>List Another Business</button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ══════════ FORM ══════════ */
  return (
    <section className="listing-section">
      <div className="container" ref={wrapRef}>
        {/* ── Progress ── */}
        <div className="listing-progress">
          {[{ n: 1, l: 'Business Info' }, { n: 2, l: 'Details' }, { n: 3, l: 'Plan' }, { n: 4, l: 'Review' }].map(s => (
            <div key={s.n} className={`listing-progress-step${step >= s.n ? ' listing-progress-step--active' : ''}${step > s.n ? ' listing-progress-step--done' : ''}`}>
              <div className="listing-progress-dot">
                {step > s.n ? <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg> : s.n}
              </div>
              <span className="listing-progress-label">{s.l}</span>
            </div>
          ))}
          <div className="listing-progress-line"><div className="listing-progress-line-fill" style={{ width: `${((step - 1) / 3) * 100}%` }} /></div>
        </div>

        <div className="listing-card">
          {/* ══════════ STEP 1 ══════════ */}
          {step === 1 && (
            <div className="listing-step">
              <div className="listing-step-header">
                <h1 className="listing-step-title">Tell Us About Your Business</h1>
                <p className="listing-step-desc">Basic information to get your listing started.</p>
              </div>
              <div className="listing-fields">
                {/* Company Name */}
                <div className="listing-field">
                  <label className="listing-label">Company / Business Name <span>*</span></label>
                  <div className="ld-input-wrap">
                    <input type="text" className="listing-input" placeholder="e.g. Acme Corporation" value={form.companyName} onChange={e => set('companyName', e.target.value)} />
                    {ok('companyName') && <FieldCheck />}
                  </div>
                </div>

                {/* Contact */}
                <div className="listing-field">
                  <label className="listing-label">Contact Person <span>*</span></label>
                  <div className="ld-input-wrap">
                    <input type="text" className="listing-input" placeholder="Your full name" value={form.contactName} onChange={e => set('contactName', e.target.value)} />
                    {ok('contactName') && <FieldCheck />}
                  </div>
                </div>

                {/* Email */}
                <div className="listing-field">
                  <label className="listing-label">Business Email <span>*</span></label>
                  <div className="ld-input-wrap">
                    <input type="email" className="listing-input" placeholder="hello@company.com" value={form.email} onChange={e => set('email', e.target.value)} />
                    {ok('email') && <FieldCheck />}
                  </div>
                </div>

                {/* Phone with country code */}
                <div className="listing-field">
                  <label className="listing-label">Phone Number</label>
                  <div className="ld-phone-row">
                    <div className="ld-dd ld-dd--code">
                      <button type="button" className={`ld-dd-trigger ld-code-trigger${openDd === 'phoneCode' ? ' ld-dd-trigger--open' : ''}`} onClick={() => toggleDd('phoneCode')}>
                        <span className="ld-code-val">{form.phoneCode}</span>
                        <Arrow />
                      </button>
                      {openDd === 'phoneCode' && (
                        <div className="ld-dd-menu ld-dd-menu--code">
                          {phoneCodes.map(p => (
                            <button key={p.label + p.code} type="button" className={`ld-dd-item${form.phoneCode === p.code ? ' ld-dd-item--active' : ''}`} onClick={() => { set('phoneCode', p.code); setOpenDd(null) }}>
                              <span className="ld-code-country">{p.label}</span>{p.code}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input type="tel" className="listing-input ld-phone-input" placeholder="(555) 000-0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                </div>

                {/* Website */}
                <div className="listing-field">
                  <label className="listing-label">Website URL</label>
                  <div className="ld-input-wrap">
                    <input type="url" className="listing-input" placeholder="https://www.company.com" value={form.website} onChange={e => set('website', e.target.value)} />
                    {form.website && ok('website') && <FieldCheck />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ STEP 2 ══════════ */}
          {step === 2 && (
            <div className="listing-step">
              <div className="listing-step-header">
                <h2 className="listing-step-title">Category &amp; Details</h2>
                <p className="listing-step-desc">Help customers find you in the right category.</p>
              </div>
              <div className="listing-fields">
                {/* Category chips */}
                <div className="listing-field">
                  <label className="listing-label">Category <span>*</span></label>
                  <div className="listing-cats">
                    {categories.map(c => (
                      <button key={c.name} type="button"
                        className={`listing-cat-chip${form.category === c.name ? ' listing-cat-chip--selected' : ''}`}
                        style={{ background: form.category === c.name ? c.color : `${c.color}12`, color: form.category === c.name ? '#fff' : c.color, borderColor: form.category === c.name ? c.color : 'transparent' }}
                        onClick={() => set('category', c.name)}
                      >{c.name}</button>
                    ))}
                  </div>
                </div>

                {/* Country dropdown + City */}
                <div className="listing-row">
                  <div className="listing-field">
                    <label className="listing-label">Country <span>*</span></label>
                    <div className="ld-dd">
                      <button type="button" className={`listing-input ld-dd-trigger${openDd === 'country' ? ' ld-dd-trigger--open' : ''}${form.country ? ' ld-dd-trigger--filled' : ''}`} onClick={() => toggleDd('country')}>
                        <span>{form.country || 'Select country'}</span>
                        <Arrow />
                      </button>
                      {openDd === 'country' && (
                        <div className="ld-dd-menu">
                          {countries.map(c => (
                            <button key={c} type="button" className={`ld-dd-item${form.country === c ? ' ld-dd-item--active' : ''}`} onClick={() => { set('country', c); setOpenDd(null) }}>
                              {c}
                              {form.country === c && <svg viewBox="0 0 20 20" className="ld-dd-check"><circle cx="10" cy="10" r="10" /><path d="M6 10.5l2.5 2.5L14 7.5" /></svg>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="listing-field">
                    <label className="listing-label">City</label>
                    <input type="text" className="listing-input" placeholder="e.g. San Francisco" value={form.city} onChange={e => set('city', e.target.value)} />
                  </div>
                </div>

                {/* Tagline */}
                <div className="listing-field">
                  <label className="listing-label">Tagline <span>*</span></label>
                  <div className="ld-input-wrap">
                    <input type="text" className="listing-input" placeholder="A short, catchy description (max 80 chars)" maxLength={80} value={form.tagline} onChange={e => set('tagline', e.target.value)} />
                    {ok('tagline') && <FieldCheck />}
                  </div>
                  <span className="listing-char-count">{form.tagline.length}/80</span>
                </div>

                {/* Description */}
                <div className="listing-field">
                  <label className="listing-label">Description</label>
                  <textarea className="listing-input listing-textarea" placeholder="Tell potential customers what makes your business special..." rows={4} maxLength={500} value={form.description} onChange={e => set('description', e.target.value)} />
                  <span className="listing-char-count">{form.description.length}/500</span>
                </div>

                {/* Founded + Team Size */}
                <div className="listing-row">
                  <div className="listing-field">
                    <label className="listing-label">Year Founded</label>
                    <input type="text" className="listing-input" placeholder="e.g. 2020" maxLength={4} value={form.founded} onChange={e => set('founded', e.target.value)} />
                  </div>
                  <div className="listing-field">
                    <label className="listing-label">Team Size</label>
                    <div className="ld-dd">
                      <button type="button" className={`listing-input ld-dd-trigger${openDd === 'employees' ? ' ld-dd-trigger--open' : ''}${form.employees ? ' ld-dd-trigger--filled' : ''}`} onClick={() => toggleDd('employees')}>
                        <span>{form.employees || 'Select size'}</span>
                        <Arrow />
                      </button>
                      {openDd === 'employees' && (
                        <div className="ld-dd-menu">
                          {teamSizes.map(s => (
                            <button key={s} type="button" className={`ld-dd-item${form.employees === s ? ' ld-dd-item--active' : ''}`} onClick={() => { set('employees', s); setOpenDd(null) }}>
                              {s}
                              {form.employees === s && <svg viewBox="0 0 20 20" className="ld-dd-check"><circle cx="10" cy="10" r="10" /><path d="M6 10.5l2.5 2.5L14 7.5" /></svg>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ STEP 3 ══════════ */}
          {step === 3 && (
            <div className="listing-step">
              <div className="listing-step-header">
                <h2 className="listing-step-title">Your Plan</h2>
                <p className="listing-step-desc">Price rises as spots fill. You&apos;re locking in the lowest rate — it will never be this low again.</p>
              </div>
              <div className="listing-plans">
                {plans.map(plan => (
                  <div key={plan.id} className={`listing-plan${!plan.locked ? ' listing-plan--active' : ' listing-plan--locked'}`}>
                    {!plan.locked && <div className="listing-plan-now">Now Open</div>}
                    <div className="listing-plan-tag" style={{ background: `${plan.tagColor}15`, color: plan.tagColor }}>{plan.tag}</div>
                    <div className="listing-plan-name">{plan.name}</div>
                    <div className="listing-plan-price">
                      <span className="listing-plan-currency">$</span>
                      <span className="listing-plan-amount">{plan.price}</span>
                      <span className="listing-plan-period">{plan.period}</span>
                    </div>
                    <div className="listing-plan-note">{plan.periodLabel}</div>
                    <ul className="listing-plan-features">{plan.features.map((f, i) => <li key={i}><Ck /><span>{f}</span></li>)}</ul>
                    {plan.locked && <div className="listing-plan-lock">{plan.lockNote}</div>}
                  </div>
                ))}
              </div>
              <div className="listing-portfolio-note">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="#2FAE6A" fill="none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                <span><strong>Incubators &amp; Portfolio Companies:</strong> Companies with 5+ tools/apps/startups get free listings. <a href="mailto:hello@infowebworld.com" style={{ color: '#E8553D', fontWeight: 700 }}>Contact us</a></span>
              </div>
            </div>
          )}

          {/* ══════════ STEP 4: Listing Preview ══════════ */}
          {step === 4 && (() => {
            const catColor = categories.find(c => c.name === form.category)?.color || '#6B7280'
            return (
              <div className="listing-step">
                <div className="listing-step-header">
                  <h2 className="listing-step-title">Review Your Listing</h2>
                  <p className="listing-step-desc">Here&apos;s a preview of your listing. Double-check everything before submitting.</p>
                </div>

                {/* ── Listing Preview Card ── */}
                <div className="rv-card">
                  <div className="rv-top">
                    <div className="rv-top-left">
                      <h3 className="rv-company">{form.companyName}</h3>
                      <div className="rv-cat" style={{ background: `${catColor}15`, color: catColor }}>{form.category}</div>
                    </div>
                    <button className="rv-edit" type="button" onClick={() => setStep(1)}>Edit Info</button>
                  </div>

                  <p className="rv-tagline">&ldquo;{form.tagline}&rdquo;</p>

                  <div className="rv-meta">
                    <span className="rv-meta-item">
                      <svg viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                      {form.city ? `${form.city}, ` : ''}{form.country}
                    </span>
                    {form.founded && (
                      <span className="rv-meta-item">
                        <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>
                        Est. {form.founded}
                      </span>
                    )}
                    {form.employees && (
                      <span className="rv-meta-item">
                        <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        {form.employees}
                      </span>
                    )}
                  </div>

                  {form.description && <p className="rv-desc">{form.description}</p>}

                  <div className="rv-divider" />

                  <div className="rv-contact">
                    <div className="rv-contact-row">
                      <span className="rv-contact-label">Contact</span>
                      <span className="rv-contact-value">{form.contactName}</span>
                    </div>
                    <div className="rv-contact-row">
                      <span className="rv-contact-label">Email</span>
                      <span className="rv-contact-value">{form.email}</span>
                    </div>
                    {form.phone && (
                      <div className="rv-contact-row">
                        <span className="rv-contact-label">Phone</span>
                        <span className="rv-contact-value">{form.phoneCode} {form.phone}</span>
                      </div>
                    )}
                    {form.website && (
                      <div className="rv-contact-row">
                        <span className="rv-contact-label">Website</span>
                        <span className="rv-contact-value rv-contact-value--link">{form.website}</span>
                      </div>
                    )}
                  </div>

                  <button className="rv-edit rv-edit--details" type="button" onClick={() => setStep(2)}>Edit Details</button>
                </div>

                {/* ── Plan Banner ── */}
                {selectedPlan && (
                  <div className="rv-plan">
                    <div className="rv-plan-top">
                      <div>
                        <div className="rv-plan-name">{selectedPlan.name}</div>
                        <div className="rv-plan-tag" style={{ background: `${selectedPlan.tagColor}15`, color: selectedPlan.tagColor }}>{selectedPlan.tag}</div>
                      </div>
                      <div className="rv-plan-price">
                        <span className="rv-plan-currency">$</span>
                        <span className="rv-plan-amount">{selectedPlan.price}</span>
                        <span className="rv-plan-period">{selectedPlan.period}</span>
                      </div>
                    </div>
                    <div className="rv-plan-features">
                      {selectedPlan.features.map((f, i) => <span key={i} className="rv-plan-feat"><Ck />{f}</span>)}
                    </div>
                  </div>
                )}

                <div className="listing-submit-note">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="#9A9590" fill="none" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  <span>After submitting, you&apos;ll receive a secure payment link via email. Your listing is reserved for 48 hours.</span>
                </div>
              </div>
            )
          })()}

          {/* ── Nav buttons ── */}
          <div className="listing-actions">
            {step > 1 && (
              <button type="button" className="listing-btn listing-btn--secondary" onClick={prev}>
                <svg viewBox="0 0 24 24"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < 4 ? (
              <button type="button" className="listing-btn listing-btn--primary" onClick={next} disabled={!canProceed()}>
                Continue<svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </button>
            ) : (
              <button type="button" className="listing-btn listing-btn--primary listing-btn--submit" onClick={handleSubmit}>
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
