'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import SafeMailLink from '../components/SafeMailLink'
import { addSubmission, uploadFile } from '../iww-hq/data/submissions-storage'
import { fetchLaunchedCategories } from '../iww-hq/data/category-storage'
import type { Category } from '../iww-hq/data/category-storage'

/* ══════════════════════════════════════════════════════════════
   STATIC DATA
   ══════════════════════════════════════════════════════════════ */

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

const teamSizes = ['Solo/Freelancer', '2-10', '11-50', '51-200', '201-500', '500+']
const fundingOptions = ['Bootstrapped', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Publicly Traded', 'Profitable']
const pricingModels = ['Subscription', 'One-time Purchase', 'Freemium', 'Usage-based', 'Contact for Pricing', 'Completely Free']
const tierPeriods = ['/ month', '/ year', 'one-time', 'lifetime']

const plans = [
  {
    id: 'founding', name: 'Founding Company', tag: 'First 200 Only', tagColor: '#E8553D',
    price: 240, period: 'one-time', periodLabel: 'Lifetime -- pay once, listed forever',
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

/* ══════════════════════════════════════════════════════════════
   SVG ICON HELPERS
   ══════════════════════════════════════════════════════════════ */

const Ck = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="#2FAE6A" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const FieldCheck = () => (
  <div className="ld-field-check">
    <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /><path d="M6 10.5l2.5 2.5L14 7.5" /></svg>
  </div>
)

const Arrow = () => (
  <svg className="ld-dd-arrow" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
)

/* Lucide-style inline icons */
const IconBuilding = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22V12h6v10" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" />
  </svg>
)

const IconUser = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
)

const IconMail = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const IconGlobe = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
  </svg>
)

const IconPhone = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const IconMapPin = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
)

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" />
  </svg>
)

const IconUsers = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconUpload = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const IconX = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const IconPlus = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const IconImage = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
  </svg>
)

const IconVideo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
  </svg>
)

const IconDollar = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const IconGrid = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
)

const IconLock = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const IconLinkedin = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
)

const IconTwitter = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const IconStar = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const IconTrendingUp = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
)

const IconLink = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

const IconInfo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#2FAE6A" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
  </svg>
)

/* ══════════════════════════════════════════════════════════════
   VALIDATION HELPERS
   ══════════════════════════════════════════════════════════════ */
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isUrl = (v: string) => !v || /^https?:\/\/.+\..+/.test(v)

/* ══════════════════════════════════════════════════════════════
   FORM TYPES
   ══════════════════════════════════════════════════════════════ */
type PricingTier = { name: string; price: string; period: string }

type FormData = {
  /* step 1 */
  companyName: string
  contactName: string
  email: string
  phoneCode: string
  phone: string
  website: string
  /* step 2 */
  categoryId: string
  categoryName: string
  categorySlug: string
  categoryColor: string
  categoryIcon: string
  tagline: string
  description: string
  country: string
  city: string
  founded: string
  employees: string
  /* step 3 */
  logoUrl: string
  screenshots: string[]
  demoVideo: string
  features: string[]
  integrations: string[]
  pricingModel: string
  pricingTiers: PricingTier[]
  /* step 4 */
  funding: string
  hqLocation: string
  linkedin: string
  twitter: string
  facebook: string
  /* step 5 */
  plan: string
}

const initial: FormData = {
  companyName: '', contactName: '', email: '', phoneCode: '+1', phone: '', website: '',
  categoryId: '', categoryName: '', categorySlug: '', categoryColor: '', categoryIcon: '',
  tagline: '', description: '', country: '', city: '', founded: '', employees: '',
  logoUrl: '', screenshots: [], demoVideo: '', features: [''], integrations: [],
  pricingModel: '', pricingTiers: [
    { name: 'Free', price: '0', period: '/ month' },
    { name: 'Pro', price: '', period: '/ month' },
    { name: 'Enterprise', price: '', period: '/ month' },
  ],
  funding: '', hqLocation: '', linkedin: '', twitter: '', facebook: '',
  plan: 'founding',
}

/* ══════════════════════════════════════════════════════════════
   STEP LABELS
   ══════════════════════════════════════════════════════════════ */
const stepLabels = [
  { n: 1, l: 'Business' },
  { n: 2, l: 'Category' },
  { n: 3, l: 'Media' },
  { n: 4, l: 'Details' },
  { n: 5, l: 'Plan' },
  { n: 6, l: 'Review' },
]

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function ListingForm() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(initial)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [paypalReady, setPaypalReady] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [openDd, setOpenDd] = useState<string | null>(null)
  const paypalContainerRef = useRef<HTMLDivElement>(null)
  const paypalRenderedPlan = useRef<string>('')
  const wrapRef = useRef<HTMLDivElement>(null)

  /* ── Category state ── */
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [catSelections, setCatSelections] = useState<string[]>([])
  const [catLoading, setCatLoading] = useState(false)

  /* ── Upload state ── */
  const [logoUploading, setLogoUploading] = useState(false)
  const [screenshotUploading, setScreenshotUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  /* ── Integration tag input ── */
  const [integrationInput, setIntegrationInput] = useState('')

  /* ── Feature input ── */
  const featureRefs = useRef<(HTMLInputElement | null)[]>([])

  /* ── Load categories ── */
  useEffect(() => {
    setCatLoading(true)
    fetchLaunchedCategories().then(cats => {
      setAllCategories(cats)
      setCatLoading(false)
    }).catch(() => setCatLoading(false))
  }, [])

  /* ── Helpers ── */
  const set = useCallback(<K extends keyof FormData>(f: K, v: FormData[K]) => {
    setForm(p => ({ ...p, [f]: v }))
  }, [])

  const setString = useCallback((f: keyof FormData, v: string) => {
    setForm(p => ({ ...p, [f]: v }))
  }, [])

  /* Scroll to top — uses panel container when inside slide-in panel, otherwise window */
  const scrollTop = useCallback(() => {
    const panel = wrapRef.current?.closest('.gl-panel')
    if (panel) {
      panel.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const next = () => { setStep(s => Math.min(s + 1, 6)); scrollTop() }
  const prev = () => { setStep(s => Math.max(s - 1, 1)); scrollTop() }
  const goToStep = (n: number) => { setStep(n); scrollTop() }

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    if (!openDd) return
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.ld-dd')) setOpenDd(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openDd])

  const toggleDd = (name: string) => setOpenDd(openDd === name ? null : name)

  /* ══════════════════════════════════════════════════════════════
     CATEGORY CASCADING LOGIC
     ══════════════════════════════════════════════════════════════ */
  const getCategoriesByParent = (parentId: string | null): Category[] => {
    return allCategories.filter(c => {
      if (parentId === null) return !c.parentId || c.parentId === '0' || c.parentId === ''
      return String(c.parentId) === String(parentId)
    }).sort((a, b) => a.name.localeCompare(b.name))
  }

  const handleCategorySelect = (level: number, catId: string) => {
    const cat = allCategories.find(c => c.id === catId)
    if (!cat) return
    const newSelections = catSelections.slice(0, level)
    newSelections[level] = catId
    setCatSelections(newSelections)

    /* Set the deepest selected category as the submission category */
    setForm(p => ({
      ...p,
      categoryId: cat.id,
      categoryName: cat.name,
      categorySlug: cat.slug,
      categoryColor: cat.color || '#E8553D',
      categoryIcon: cat.icon || 'grid',
    }))
  }

  /* Build cascading levels: level 0 = roots, level 1 = children of selections[0], etc. */
  const categoryLevels: { label: string; options: Category[]; selectedId: string }[] = []
  const roots = getCategoriesByParent(null)
  if (roots.length > 0) {
    categoryLevels.push({ label: 'Select Sector', options: roots, selectedId: catSelections[0] || '' })

    let currentParent = catSelections[0] || ''
    let levelIndex = 1
    while (currentParent) {
      const children = getCategoriesByParent(currentParent)
      if (children.length === 0) break
      const levelLabels = ['Select Category', 'Select Subcategory', 'Select Sub-subcategory', 'Select Option']
      categoryLevels.push({
        label: levelLabels[Math.min(levelIndex, levelLabels.length - 1)],
        options: children,
        selectedId: catSelections[levelIndex] || '',
      })
      currentParent = catSelections[levelIndex] || ''
      levelIndex++
    }
  }

  /* ══════════════════════════════════════════════════════════════
     FILE UPLOAD HANDLERS
     ══════════════════════════════════════════════════════════════ */
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoUploading(true)
    setUploadProgress(p => ({ ...p, logo: 0 }))
    try {
      /* Simulate progress since fetch doesn't expose upload progress */
      const interval = setInterval(() => {
        setUploadProgress(p => ({ ...p, logo: Math.min((p.logo || 0) + 15, 90) }))
      }, 200)
      const url = await uploadFile(file, 'logo')
      clearInterval(interval)
      setUploadProgress(p => ({ ...p, logo: 100 }))
      setString('logoUrl', url)
    } catch {
      /* silently fail — user can retry */
    }
    setLogoUploading(false)
    e.target.value = ''
  }

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const remaining = 5 - form.screenshots.length
    const toUpload = Array.from(files).slice(0, remaining)
    if (toUpload.length === 0) return

    setScreenshotUploading(true)
    const newUrls: string[] = []
    for (let i = 0; i < toUpload.length; i++) {
      const key = `ss-${i}`
      setUploadProgress(p => ({ ...p, [key]: 0 }))
      try {
        const interval = setInterval(() => {
          setUploadProgress(p => ({ ...p, [key]: Math.min((p[key] || 0) + 15, 90) }))
        }, 200)
        const url = await uploadFile(toUpload[i], 'screenshot')
        clearInterval(interval)
        setUploadProgress(p => ({ ...p, [key]: 100 }))
        newUrls.push(url)
      } catch {
        /* skip failed uploads */
      }
    }
    set('screenshots', [...form.screenshots, ...newUrls])
    setScreenshotUploading(false)
    e.target.value = ''
  }

  const removeScreenshot = (idx: number) => {
    set('screenshots', form.screenshots.filter((_, i) => i !== idx))
  }

  /* ══════════════════════════════════════════════════════════════
     FEATURES LIST HANDLERS
     ══════════════════════════════════════════════════════════════ */
  const updateFeature = (idx: number, val: string) => {
    const next = [...form.features]
    next[idx] = val
    set('features', next)
  }

  const addFeature = () => {
    if (form.features.length >= 20) return
    set('features', [...form.features, ''])
    setTimeout(() => {
      const last = featureRefs.current[form.features.length]
      last?.focus()
    }, 50)
  }

  const removeFeature = (idx: number) => {
    if (form.features.length <= 1) return
    set('features', form.features.filter((_, i) => i !== idx))
  }

  /* ══════════════════════════════════════════════════════════════
     INTEGRATIONS TAG INPUT
     ══════════════════════════════════════════════════════════════ */
  const addIntegration = () => {
    const val = integrationInput.trim()
    if (!val || form.integrations.includes(val)) return
    set('integrations', [...form.integrations, val])
    setIntegrationInput('')
  }

  const removeIntegration = (idx: number) => {
    set('integrations', form.integrations.filter((_, i) => i !== idx))
  }

  const handleIntegrationKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addIntegration()
    }
  }

  /* ══════════════════════════════════════════════════════════════
     PRICING TIERS
     ══════════════════════════════════════════════════════════════ */
  const updateTier = (idx: number, field: keyof PricingTier, val: string) => {
    const next = [...form.pricingTiers]
    next[idx] = { ...next[idx], [field]: val }
    set('pricingTiers', next)
  }

  const showPricingTiers = ['Subscription', 'One-time Purchase', 'Freemium'].includes(form.pricingModel)

  /* ══════════════════════════════════════════════════════════════
     PER-FIELD VALIDATION
     ══════════════════════════════════════════════════════════════ */
  const ok = (f: string): boolean => {
    const v = form[f as keyof FormData]
    if (f === 'email') return !!v && isEmail(v as string)
    if (f === 'website') return !!v && isUrl(v as string)
    if (f === 'tagline') return typeof v === 'string' && v.length > 0
    if (f === 'categoryName') return typeof v === 'string' && v.length > 0
    if (f === 'features') return Array.isArray(v) && v.length > 0 && (v as string[]).some(x => x.trim().length > 0)
    return !!v
  }

  const canProceed = () => {
    if (step === 1) return ok('companyName') && ok('contactName') && ok('email')
    if (step === 2) return ok('categoryName') && ok('country') && ok('tagline')
    if (step === 3) return ok('features')
    if (step === 4) return true
    if (step === 5) return !!form.plan
    return true
  }

  /* ══════════════════════════════════════════════════════════════
     PAYPAL INTEGRATION (Sandbox)
     ══════════════════════════════════════════════════════════════ */
  // PayPal Sandbox Client ID
  const PAYPAL_CLIENT_ID = 'ARGXO-MMxMj9R4KyB4dxQNN2X5Nkb4d1ziv-9srFlUN5g-SnoJ18Dp5ER_nj9V0aFZihZf533bfGIPTd'

  // Load PayPal SDK once
  useEffect(() => {
    if (document.getElementById('paypal-sdk')) { setPaypalReady(true); return }
    const script = document.createElement('script')
    script.id = 'paypal-sdk'
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`
    script.onload = () => setPaypalReady(true)
    script.onerror = () => setPaymentError('Failed to load payment system. Please refresh.')
    document.head.appendChild(script)
  }, [])

  // Render PayPal buttons when on step 6 and SDK is ready
  useEffect(() => {
    if (step !== 6 || !paypalReady || !paypalContainerRef.current) return
    if (paypalRenderedPlan.current === form.plan) return
    // @ts-expect-error PayPal SDK loaded globally
    const paypal = window.paypal
    if (!paypal) return

    paypalContainerRef.current.innerHTML = ''
    paypalRenderedPlan.current = form.plan
    const planObj = plans.find(p => p.id === form.plan)
    if (!planObj) return

    paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay', height: 45 },
      createOrder: (_data: unknown, actions: { order: { create: (o: unknown) => Promise<string> } }) => {
        return actions.order.create({
          purchase_units: [{
            description: `InfoWebWorld - ${planObj.name} Plan`,
            amount: { currency_code: 'USD', value: String(planObj.price) },
          }],
        })
      },
      onApprove: async (_data: { orderID: string }, actions: { order: { capture: () => Promise<{ id: string; status: string }> } }) => {
        setSubmitting(true)
        setPaymentError('')
        try {
          const details = await actions.order.capture()
          // Payment successful — now submit listing with paypal order ID
          await addSubmission({
            companyName: form.companyName,
            contactName: form.contactName,
            email: form.email,
            phoneCode: form.phoneCode,
            phone: form.phone,
            website: form.website,
            category: form.categoryName,
            categorySlug: form.categorySlug,
            categoryColor: form.categoryColor,
            categoryIcon: form.categoryIcon,
            country: form.country,
            city: form.city,
            tagline: form.tagline,
            description: form.description,
            logoUrl: form.logoUrl,
            screenshots: form.screenshots,
            demoVideo: form.demoVideo,
            features: form.features.filter(f => f.trim()),
            integrations: form.integrations,
            pricingModel: form.pricingModel,
            pricingTiers: showPricingTiers ? form.pricingTiers.filter(t => t.name.trim()) : [],
            founded: form.founded,
            employees: form.employees,
            funding: form.funding,
            hqLocation: form.hqLocation,
            linkedin: form.linkedin,
            twitter: form.twitter,
            facebook: form.facebook,
            plan: form.plan,
            paypalOrderId: details.id,
            paymentStatus: 'completed',
          })
          setSubmitted(true)
          scrollTop()
        } catch {
          setPaymentError('Payment was successful but submission failed. Please contact support with your PayPal receipt.')
        }
        setSubmitting(false)
      },
      onError: () => {
        setPaymentError('Payment failed. Please try again or use a different payment method.')
      },
      onCancel: () => {
        setPaymentError('Payment was cancelled. Your listing will not be submitted without payment.')
      },
    }).render(paypalContainerRef.current)
  }, [step, paypalReady, form.plan])

  const selectedPlan = plans.find(p => p.id === form.plan)

  /* ══════════════════════════════════════════════════════════════
     DROPDOWN RENDERER
     ══════════════════════════════════════════════════════════════ */
  const renderDropdown = (
    name: string,
    placeholder: string,
    value: string,
    options: string[],
    onSelect: (v: string) => void,
  ) => (
    <div className="ld-dd">
      <button
        type="button"
        className={`listing-input ld-dd-trigger${openDd === name ? ' ld-dd-trigger--open' : ''}${value ? ' ld-dd-trigger--filled' : ''}`}
        onClick={() => toggleDd(name)}
      >
        <span>{value || placeholder}</span>
        <Arrow />
      </button>
      {openDd === name && (
        <div className="ld-dd-menu">
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              className={`ld-dd-item${value === opt ? ' ld-dd-item--active' : ''}`}
              onClick={() => { onSelect(opt); setOpenDd(null) }}
            >
              {opt}
              {value === opt && (
                <svg viewBox="0 0 20 20" className="ld-dd-check"><circle cx="10" cy="10" r="10" /><path d="M6 10.5l2.5 2.5L14 7.5" /></svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  /* ══════════════════════════════════════════════════════════════
     SUCCESS STATE
     ══════════════════════════════════════════════════════════════ */
  if (submitted) {
    return (
      <section className="listing-section">
        <div className="container">
          <div className="listing-success">
            <div className="listing-success-icon">
              <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
            <h1 className="listing-success-title">Payment Successful!</h1>
            <p className="listing-success-sub">
              <strong>{form.companyName}</strong> has been submitted and paid. Your listing will be live within 24 hours!
            </p>
            <div className="listing-success-plan">
              <div className="listing-success-plan-tag" style={{ background: selectedPlan?.tagColor }}>{selectedPlan?.name} Plan</div>
              <div className="listing-success-plan-price">${selectedPlan?.price}<span>{selectedPlan?.period}</span></div>
            </div>
            <div className="listing-success-benefits">
              <h3>What happens next?</h3>
              <div className="listing-success-steps">
                {[
                  { t: 'Payment Confirmed', d: `Your payment of $${selectedPlan?.price} has been processed successfully via PayPal.` },
                  { t: 'Under Review', d: 'Our team will review your listing details within 24 hours.' },
                  { t: 'Listing Goes Live', d: `Your ${selectedPlan?.name} listing will be published and visible to all visitors within 24 hours.` },
                  { t: 'Get Discovered', d: 'Start receiving views, inquiries, and leads from professionals worldwide.' },
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
              <button type="button" className="listing-btn listing-btn--primary" onClick={() => { setSubmitted(false); setStep(1); setForm(initial); setCatSelections([]) }}>List Another Business</button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ══════════════════════════════════════════════════════════════
     FORM RENDER
     ══════════════════════════════════════════════════════════════ */
  return (
    <section className="listing-section">
      <div className="container" ref={wrapRef}>
        {/* ── Progress Bar ── */}
        <div className="listing-progress">
          {stepLabels.map(s => (
            <div
              key={s.n}
              className={`listing-progress-step${step >= s.n ? ' listing-progress-step--active' : ''}${step > s.n ? ' listing-progress-step--done' : ''}`}
            >
              <div className="listing-progress-dot">
                {step > s.n ? <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg> : s.n}
              </div>
              <span className="listing-progress-label">{s.l}</span>
            </div>
          ))}
          <div className="listing-progress-line">
            <div className="listing-progress-line-fill" style={{ width: `${((step - 1) / 5) * 100}%` }} />
          </div>
        </div>

        <div className="listing-card">
          {/* ══════════════════════════════════════════════════════════
             STEP 1: BUSINESS INFO
             ══════════════════════════════════════════════════════════ */}
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
                    <input
                      type="text"
                      className="listing-input"
                      placeholder="e.g. Acme Corporation"
                      value={form.companyName}
                      onChange={e => setString('companyName', e.target.value)}
                    />
                    {ok('companyName') && <FieldCheck />}
                  </div>
                </div>

                {/* Contact */}
                <div className="listing-field">
                  <label className="listing-label">Contact Person <span>*</span></label>
                  <div className="ld-input-wrap">
                    <input
                      type="text"
                      className="listing-input"
                      placeholder="Your full name"
                      value={form.contactName}
                      onChange={e => setString('contactName', e.target.value)}
                    />
                    {ok('contactName') && <FieldCheck />}
                  </div>
                </div>

                {/* Email */}
                <div className="listing-field">
                  <label className="listing-label">Business Email <span>*</span></label>
                  <div className="ld-input-wrap">
                    <input
                      type="email"
                      className="listing-input"
                      placeholder="hello@company.com"
                      value={form.email}
                      onChange={e => setString('email', e.target.value)}
                    />
                    {ok('email') && <FieldCheck />}
                  </div>
                </div>

                {/* Phone with country code */}
                <div className="listing-field">
                  <label className="listing-label">Phone Number</label>
                  <div className="ld-phone-row">
                    <div className="ld-dd ld-dd--code">
                      <button
                        type="button"
                        className={`ld-dd-trigger ld-code-trigger${openDd === 'phoneCode' ? ' ld-dd-trigger--open' : ''}`}
                        onClick={() => toggleDd('phoneCode')}
                      >
                        <span className="ld-code-val">{form.phoneCode}</span>
                        <Arrow />
                      </button>
                      {openDd === 'phoneCode' && (
                        <div className="ld-dd-menu ld-dd-menu--code">
                          {phoneCodes.map(p => (
                            <button
                              key={p.label + p.code}
                              type="button"
                              className={`ld-dd-item${form.phoneCode === p.code ? ' ld-dd-item--active' : ''}`}
                              onClick={() => { setString('phoneCode', p.code); setOpenDd(null) }}
                            >
                              <span className="ld-code-country">{p.label}</span>{p.code}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      className="listing-input ld-phone-input"
                      placeholder="(555) 000-0000"
                      value={form.phone}
                      onChange={e => setString('phone', e.target.value)}
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="listing-field">
                  <label className="listing-label">Website URL</label>
                  <div className="ld-input-wrap">
                    <input
                      type="url"
                      className="listing-input"
                      placeholder="https://www.company.com"
                      value={form.website}
                      onChange={e => setString('website', e.target.value)}
                    />
                    {form.website && ok('website') && <FieldCheck />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
             STEP 2: CATEGORY & DETAILS
             ══════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="listing-step">
              <div className="listing-step-header">
                <h2 className="listing-step-title">Category &amp; Details</h2>
                <p className="listing-step-desc">Help customers find you in the right category.</p>
              </div>
              <div className="listing-fields">
                {/* Cascading category dropdowns */}
                <div className="listing-field">
                  <label className="listing-label">Category <span>*</span></label>
                  {catLoading ? (
                    <div style={{ padding: '.75rem 0', fontFamily: 'var(--font-nunito)', fontSize: '.8rem', color: 'var(--h-muted)' }}>
                      Loading categories...
                    </div>
                  ) : categoryLevels.length === 0 ? (
                    <div style={{ padding: '.75rem 0', fontFamily: 'var(--font-nunito)', fontSize: '.8rem', color: 'var(--h-muted)' }}>
                      No categories available. Please try again later.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                      {categoryLevels.map((level, idx) => (
                        <div key={idx} className="ld-dd">
                          <button
                            type="button"
                            className={`listing-input ld-dd-trigger${openDd === `cat-${idx}` ? ' ld-dd-trigger--open' : ''}${level.selectedId ? ' ld-dd-trigger--filled' : ''}`}
                            onClick={() => toggleDd(`cat-${idx}`)}
                          >
                            <span>
                              {level.selectedId
                                ? allCategories.find(c => c.id === level.selectedId)?.name || level.label
                                : level.label
                              }
                            </span>
                            <Arrow />
                          </button>
                          {openDd === `cat-${idx}` && (
                            <div className="ld-dd-menu">
                              {level.options.map(cat => (
                                <button
                                  key={cat.id}
                                  type="button"
                                  className={`ld-dd-item${level.selectedId === cat.id ? ' ld-dd-item--active' : ''}`}
                                  onClick={() => { handleCategorySelect(idx, cat.id); setOpenDd(null) }}
                                >
                                  {cat.name}
                                  {level.selectedId === cat.id && (
                                    <svg viewBox="0 0 20 20" className="ld-dd-check"><circle cx="10" cy="10" r="10" /><path d="M6 10.5l2.5 2.5L14 7.5" /></svg>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {/* Show selected category path */}
                      {form.categoryName && (
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '.35rem',
                          padding: '.35rem .75rem', borderRadius: '999px',
                          background: `${form.categoryColor || '#E8553D'}12`,
                          color: form.categoryColor || '#E8553D',
                          fontFamily: 'var(--font-nunito)', fontSize: '.72rem', fontWeight: 700,
                          width: 'fit-content',
                        }}>
                          <Ck /> Selected: {form.categoryName}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Tagline */}
                <div className="listing-field">
                  <label className="listing-label">Tagline <span>*</span></label>
                  <div className="ld-input-wrap">
                    <input
                      type="text"
                      className="listing-input"
                      placeholder="A short, catchy description (max 80 chars)"
                      maxLength={80}
                      value={form.tagline}
                      onChange={e => setString('tagline', e.target.value)}
                    />
                    {ok('tagline') && <FieldCheck />}
                  </div>
                  <span className="listing-char-count">{form.tagline.length}/80</span>
                </div>

                {/* Description */}
                <div className="listing-field">
                  <label className="listing-label">Description</label>
                  <textarea
                    className="listing-input listing-textarea"
                    placeholder="Tell potential customers what makes your business special..."
                    rows={4}
                    maxLength={500}
                    value={form.description}
                    onChange={e => setString('description', e.target.value)}
                  />
                  <span className="listing-char-count">{form.description.length}/500</span>
                </div>

                {/* Country + City */}
                <div className="listing-row">
                  <div className="listing-field">
                    <label className="listing-label">Country <span>*</span></label>
                    {renderDropdown('country', 'Select country', form.country, countries, v => setString('country', v))}
                  </div>
                  <div className="listing-field">
                    <label className="listing-label">City</label>
                    <input
                      type="text"
                      className="listing-input"
                      placeholder="e.g. San Francisco"
                      value={form.city}
                      onChange={e => setString('city', e.target.value)}
                    />
                  </div>
                </div>

                {/* Founded + Team Size */}
                <div className="listing-row">
                  <div className="listing-field">
                    <label className="listing-label">Year Founded</label>
                    <input
                      type="text"
                      className="listing-input"
                      placeholder="e.g. 2020"
                      maxLength={4}
                      value={form.founded}
                      onChange={e => setString('founded', e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  <div className="listing-field">
                    <label className="listing-label">Team Size</label>
                    {renderDropdown('employees', 'Select size', form.employees, teamSizes, v => setString('employees', v))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
             STEP 3: MEDIA & PRODUCT
             ══════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="listing-step">
              <div className="listing-step-header">
                <h2 className="listing-step-title">Media &amp; Product</h2>
                <p className="listing-step-desc">Showcase your product with logos, screenshots, and details.</p>
              </div>
              <div className="listing-fields">
                {/* Logo Upload */}
                <div className="listing-field">
                  <label className="listing-label">Company Logo</label>
                  <p className="listing-hint" style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', color: 'var(--h-muted)', marginBottom: '.35rem' }}>
                    Square format recommended (min 200x200px). PNG or JPG.
                  </p>
                  {form.logoUrl ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '.85rem',
                      padding: '.75rem', borderRadius: '14px',
                      background: 'var(--h-bg)', border: '1.5px solid var(--h-border)',
                    }}>
                      <img
                        src={form.logoUrl}
                        alt="Logo"
                        style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--h-border-light)' }}
                      />
                      <div style={{ flex: 1, fontFamily: 'var(--font-nunito)', fontSize: '.75rem', color: 'var(--h-body)' }}>
                        Logo uploaded
                      </div>
                      <button
                        type="button"
                        onClick={() => setString('logoUrl', '')}
                        style={{
                          width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid var(--h-border)',
                          background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--h-muted)', transition: 'all .2s',
                        }}
                      >
                        <IconX />
                      </button>
                    </div>
                  ) : (
                    <label style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: '.5rem', padding: '1.5rem',
                      borderRadius: '14px', border: '2px dashed var(--h-border)',
                      background: 'var(--h-bg)', cursor: logoUploading ? 'wait' : 'pointer',
                      transition: 'all .3s cubic-bezier(.16,1,.3,1)',
                      opacity: logoUploading ? 0.6 : 1,
                    }}>
                      <div style={{ color: 'var(--h-muted)' }}><IconUpload /></div>
                      <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.75rem', fontWeight: 600, color: 'var(--h-muted)' }}>
                        {logoUploading ? `Uploading... ${uploadProgress.logo || 0}%` : 'Click to upload logo'}
                      </span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={logoUploading} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>

                {/* Screenshots Upload */}
                <div className="listing-field">
                  <label className="listing-label">Screenshots</label>
                  <p className="listing-hint" style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', color: 'var(--h-muted)', marginBottom: '.35rem' }}>
                    Up to 5 screenshots. PNG or JPG, 16:9 ratio recommended.
                  </p>
                  {form.screenshots.length > 0 && (
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                      gap: '.5rem', marginBottom: '.5rem',
                    }}>
                      {form.screenshots.map((url, i) => (
                        <div key={i} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--h-border-light)' }}>
                          <img
                            src={url}
                            alt={`Screenshot ${i + 1}`}
                            style={{ width: '100%', height: '64px', objectFit: 'cover', display: 'block' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeScreenshot(i)}
                            style={{
                              position: 'absolute', top: '4px', right: '4px',
                              width: '20px', height: '20px', borderRadius: '50%',
                              background: 'rgba(0,0,0,.55)', border: 'none', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff',
                            }}
                          >
                            <IconX />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {form.screenshots.length < 5 && (
                    <label style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '.5rem', padding: '1rem',
                      borderRadius: '14px', border: '2px dashed var(--h-border)',
                      background: 'var(--h-bg)', cursor: screenshotUploading ? 'wait' : 'pointer',
                      transition: 'all .3s cubic-bezier(.16,1,.3,1)',
                      opacity: screenshotUploading ? 0.6 : 1,
                    }}>
                      <div style={{ color: 'var(--h-muted)' }}><IconImage /></div>
                      <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.75rem', fontWeight: 600, color: 'var(--h-muted)' }}>
                        {screenshotUploading ? 'Uploading...' : `Add screenshots (${form.screenshots.length}/5)`}
                      </span>
                      <input type="file" accept="image/*" multiple onChange={handleScreenshotUpload} disabled={screenshotUploading} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>

                {/* Demo Video URL */}
                <div className="listing-field">
                  <label className="listing-label">Demo Video URL</label>
                  <div className="ld-input-wrap">
                    <input
                      type="url"
                      className="listing-input"
                      placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                      value={form.demoVideo}
                      onChange={e => setString('demoVideo', e.target.value)}
                    />
                    {form.demoVideo && isUrl(form.demoVideo) && <FieldCheck />}
                  </div>
                </div>

                {/* Features List */}
                <div className="listing-field">
                  <label className="listing-label">Key Features <span>*</span></label>
                  <p className="listing-hint" style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', color: 'var(--h-muted)', marginBottom: '.35rem' }}>
                    Add at least 1 feature. Highlight what makes your product stand out.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                    {form.features.map((feat, i) => (
                      <div key={i} style={{ display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                        <input
                          ref={el => { featureRefs.current[i] = el }}
                          type="text"
                          className="listing-input"
                          placeholder={`Feature ${i + 1}`}
                          value={feat}
                          onChange={e => updateFeature(i, e.target.value)}
                          style={{ flex: 1 }}
                        />
                        {form.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(i)}
                            style={{
                              width: '32px', height: '32px', borderRadius: '10px', border: '1.5px solid var(--h-border)',
                              background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'var(--h-muted)', flexShrink: 0, transition: 'all .2s',
                            }}
                          >
                            <IconX />
                          </button>
                        )}
                      </div>
                    ))}
                    {form.features.length < 20 && (
                      <button
                        type="button"
                        onClick={addFeature}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '.35rem',
                          padding: '.45rem .85rem', borderRadius: '999px',
                          border: '1.5px dashed var(--h-border)', background: 'transparent',
                          cursor: 'pointer', fontFamily: 'var(--font-nunito)', fontSize: '.72rem',
                          fontWeight: 700, color: 'var(--h-accent)', width: 'fit-content',
                          transition: 'all .25s cubic-bezier(.16,1,.3,1)',
                        }}
                      >
                        <IconPlus /> Add Feature
                      </button>
                    )}
                  </div>
                </div>

                {/* Integrations Tag Input */}
                <div className="listing-field">
                  <label className="listing-label">Integrations</label>
                  <p className="listing-hint" style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', color: 'var(--h-muted)', marginBottom: '.35rem' }}>
                    Type an integration name and press Enter or comma to add.
                  </p>
                  {form.integrations.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem', marginBottom: '.4rem' }}>
                      {form.integrations.map((tag, i) => (
                        <span
                          key={i}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '.3rem',
                            padding: '.3rem .6rem .3rem .75rem', borderRadius: '999px',
                            background: 'rgba(232,85,61,.08)', color: 'var(--h-accent)',
                            fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 700,
                          }}
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeIntegration(i)}
                            style={{
                              width: '16px', height: '16px', borderRadius: '50%', border: 'none',
                              background: 'rgba(232,85,61,.15)', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'var(--h-accent)', padding: 0,
                            }}
                          >
                            <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    type="text"
                    className="listing-input"
                    placeholder="e.g. Slack, Zapier, Stripe..."
                    value={integrationInput}
                    onChange={e => setIntegrationInput(e.target.value)}
                    onKeyDown={handleIntegrationKeyDown}
                    onBlur={addIntegration}
                  />
                </div>

                {/* Pricing Model */}
                <div className="listing-field">
                  <label className="listing-label">Pricing Model</label>
                  {renderDropdown('pricingModel', 'Select pricing model', form.pricingModel, pricingModels, v => setString('pricingModel', v))}
                </div>

                {/* Pricing Tiers (conditional) */}
                {showPricingTiers && (
                  <div className="listing-field">
                    <label className="listing-label">Pricing Tiers</label>
                    <p className="listing-hint" style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', color: 'var(--h-muted)', marginBottom: '.35rem' }}>
                      Define up to 3 pricing tiers for your product.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
                      {form.pricingTiers.map((tier, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'grid', gridTemplateColumns: '1fr 100px 1fr', gap: '.5rem',
                            alignItems: 'center',
                            padding: '.65rem', borderRadius: '14px',
                            background: 'var(--h-bg)', border: '1px solid var(--h-border-light)',
                          }}
                        >
                          <input
                            type="text"
                            className="listing-input"
                            placeholder="Tier name"
                            value={tier.name}
                            onChange={e => updateTier(i, 'name', e.target.value)}
                            style={{ height: '40px', fontSize: '.78rem' }}
                          />
                          <div style={{ position: 'relative' }}>
                            <span style={{
                              position: 'absolute', left: '.65rem', top: '50%', transform: 'translateY(-50%)',
                              fontFamily: 'var(--font-nunito)', fontSize: '.78rem', fontWeight: 700, color: 'var(--h-muted)',
                              pointerEvents: 'none',
                            }}>$</span>
                            <input
                              type="text"
                              className="listing-input"
                              placeholder="0"
                              value={tier.price}
                              onChange={e => updateTier(i, 'price', e.target.value.replace(/[^0-9.]/g, ''))}
                              style={{ height: '40px', fontSize: '.78rem', paddingLeft: '1.5rem' }}
                            />
                          </div>
                          {renderDropdown(`tier-period-${i}`, 'Period', tier.period, tierPeriods, v => updateTier(i, 'period', v))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
             STEP 4: COMPANY DETAILS
             ══════════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div className="listing-step">
              <div className="listing-step-header">
                <h2 className="listing-step-title">Company Details</h2>
                <p className="listing-step-desc">Additional details to build trust and credibility. All fields are optional.</p>
              </div>
              <div className="listing-fields">
                {/* Funding */}
                <div className="listing-field">
                  <label className="listing-label">Funding Stage</label>
                  {renderDropdown('funding', 'Select funding stage', form.funding, fundingOptions, v => setString('funding', v))}
                </div>

                {/* HQ Location */}
                <div className="listing-field">
                  <label className="listing-label">Headquarters Location</label>
                  <div className="ld-input-wrap">
                    <input
                      type="text"
                      className="listing-input"
                      placeholder="e.g. San Francisco, CA, USA"
                      value={form.hqLocation}
                      onChange={e => setString('hqLocation', e.target.value)}
                    />
                    {form.hqLocation && <FieldCheck />}
                  </div>
                </div>

                {/* Social Links */}
                <div className="listing-field">
                  <label className="listing-label">LinkedIn URL</label>
                  <div className="ld-input-wrap">
                    <input
                      type="url"
                      className="listing-input"
                      placeholder="https://linkedin.com/company/your-company"
                      value={form.linkedin}
                      onChange={e => setString('linkedin', e.target.value)}
                    />
                    {form.linkedin && isUrl(form.linkedin) && <FieldCheck />}
                  </div>
                </div>

                <div className="listing-field">
                  <label className="listing-label">Twitter / X URL</label>
                  <div className="ld-input-wrap">
                    <input
                      type="url"
                      className="listing-input"
                      placeholder="https://twitter.com/your_handle"
                      value={form.twitter}
                      onChange={e => setString('twitter', e.target.value)}
                    />
                    {form.twitter && isUrl(form.twitter) && <FieldCheck />}
                  </div>
                </div>

                <div className="listing-field">
                  <label className="listing-label">Facebook URL</label>
                  <div className="ld-input-wrap">
                    <input
                      type="url"
                      className="listing-input"
                      placeholder="https://facebook.com/your-page"
                      value={form.facebook}
                      onChange={e => setString('facebook', e.target.value)}
                    />
                    {form.facebook && isUrl(form.facebook) && <FieldCheck />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
             STEP 5: PLAN SELECTION
             ══════════════════════════════════════════════════════════ */}
          {step === 5 && (
            <div className="listing-step">
              <div className="listing-step-header">
                <h2 className="listing-step-title">Your Plan</h2>
                <p className="listing-step-desc">Price rises as spots fill. You&apos;re locking in the lowest rate -- it will never be this low again.</p>
              </div>
              <div className="listing-plans">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    className={`listing-plan${!plan.locked ? ' listing-plan--active' : ' listing-plan--locked'}`}
                  >
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
                <IconInfo />
                <span><strong>Incubators &amp; Portfolio Companies:</strong> Companies with 5+ tools/apps/startups get free listings. <SafeMailLink user="hello" domain="infowebworld.com" style={{ color: '#E8553D', fontWeight: 700 }}>Contact us</SafeMailLink></span>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
             STEP 6: REVIEW & SUBMIT
             ══════════════════════════════════════════════════════════ */}
          {step === 6 && (() => {
            const catColor = form.categoryColor || '#6B7280'
            const validFeatures = form.features.filter(f => f.trim())
            return (
              <div className="listing-step">
                <div className="listing-step-header">
                  <h2 className="listing-step-title">Review Your Listing</h2>
                  <p className="listing-step-desc">Here&apos;s a preview of your listing. Double-check everything before submitting.</p>
                </div>

                {/* ── Business Info Card ── */}
                <div className="rv-card">
                  <div className="rv-top">
                    <div className="rv-top-left">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem', marginBottom: '.35rem' }}>
                        {form.logoUrl && (
                          <img
                            src={form.logoUrl}
                            alt={form.companyName}
                            style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--h-border-light)' }}
                          />
                        )}
                        <h3 className="rv-company" style={{ marginBottom: 0 }}>{form.companyName}</h3>
                      </div>
                      {form.categoryName && (
                        <div className="rv-cat" style={{ background: `${catColor}15`, color: catColor }}>{form.categoryName}</div>
                      )}
                    </div>
                    <button className="rv-edit" type="button" onClick={() => goToStep(1)}>Edit Info</button>
                  </div>

                  {form.tagline && <p className="rv-tagline">&ldquo;{form.tagline}&rdquo;</p>}

                  <div className="rv-meta">
                    {(form.city || form.country) && (
                      <span className="rv-meta-item"><IconMapPin />{form.city ? `${form.city}, ` : ''}{form.country}</span>
                    )}
                    {form.founded && (
                      <span className="rv-meta-item"><IconCalendar />Est. {form.founded}</span>
                    )}
                    {form.employees && (
                      <span className="rv-meta-item"><IconUsers />{form.employees}</span>
                    )}
                    {form.funding && (
                      <span className="rv-meta-item"><IconTrendingUp />{form.funding}</span>
                    )}
                  </div>

                  {form.description && <p className="rv-desc">{form.description}</p>}

                  {/* Screenshots preview */}
                  {form.screenshots.length > 0 && (
                    <div style={{
                      display: 'grid', gridTemplateColumns: `repeat(${Math.min(form.screenshots.length, 3)}, 1fr)`,
                      gap: '.5rem', marginBottom: '.75rem', borderRadius: '12px', overflow: 'hidden',
                    }}>
                      {form.screenshots.slice(0, 3).map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`Screenshot ${i + 1}`}
                          style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--h-border-light)' }}
                        />
                      ))}
                    </div>
                  )}
                  {form.screenshots.length > 3 && (
                    <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.68rem', color: 'var(--h-muted)', marginBottom: '.5rem' }}>
                      +{form.screenshots.length - 3} more screenshot{form.screenshots.length - 3 > 1 ? 's' : ''}
                    </div>
                  )}

                  {/* Features */}
                  {validFeatures.length > 0 && (
                    <>
                      <div className="rv-divider" />
                      <div style={{ marginBottom: '.5rem' }}>
                        <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 700, color: 'var(--h-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '.4rem' }}>
                          Key Features
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem' }}>
                          {validFeatures.map((f, i) => (
                            <span key={i} style={{
                              display: 'inline-flex', alignItems: 'center', gap: '.3rem',
                              padding: '.2rem .55rem .2rem .35rem', borderRadius: '999px',
                              background: 'var(--h-bg)', fontFamily: 'var(--font-nunito)',
                              fontSize: '.68rem', fontWeight: 600, color: 'var(--h-body)',
                            }}>
                              <Ck />{f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Integrations */}
                  {form.integrations.length > 0 && (
                    <div style={{ marginBottom: '.5rem' }}>
                      <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 700, color: 'var(--h-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '.4rem' }}>
                        Integrations
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem' }}>
                        {form.integrations.map((tag, i) => (
                          <span key={i} style={{
                            display: 'inline-block', padding: '.2rem .55rem', borderRadius: '999px',
                            background: 'rgba(232,85,61,.06)', color: 'var(--h-accent)',
                            fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 700,
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing */}
                  {form.pricingModel && (
                    <div style={{ marginBottom: '.5rem' }}>
                      <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 700, color: 'var(--h-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '.4rem' }}>
                        Pricing
                      </div>
                      <span style={{
                        display: 'inline-block', padding: '.2rem .55rem', borderRadius: '999px',
                        background: 'var(--h-bg)', fontFamily: 'var(--font-nunito)',
                        fontSize: '.7rem', fontWeight: 700, color: 'var(--h-body)',
                      }}>
                        {form.pricingModel}
                      </span>
                      {showPricingTiers && form.pricingTiers.filter(t => t.name.trim()).length > 0 && (
                        <div style={{ display: 'flex', gap: '.5rem', marginTop: '.4rem', flexWrap: 'wrap' }}>
                          {form.pricingTiers.filter(t => t.name.trim()).map((t, i) => (
                            <div key={i} style={{
                              padding: '.35rem .65rem', borderRadius: '10px',
                              background: 'var(--h-bg)', border: '1px solid var(--h-border-light)',
                              fontFamily: 'var(--font-nunito)', fontSize: '.68rem', color: 'var(--h-body)',
                            }}>
                              <strong style={{ color: 'var(--h-heading)' }}>{t.name}</strong>{t.price ? ` - $${t.price}` : ''} {t.period}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Demo Video */}
                  {form.demoVideo && (
                    <div style={{ marginBottom: '.5rem' }}>
                      <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 700, color: 'var(--h-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '.25rem' }}>
                        Demo Video
                      </div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '.3rem',
                        fontFamily: 'var(--font-nunito)', fontSize: '.72rem', color: 'var(--h-accent)', fontWeight: 600,
                      }}>
                        <IconLink />{form.demoVideo}
                      </span>
                    </div>
                  )}

                  <div className="rv-divider" />

                  {/* Contact Details */}
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
                    {form.hqLocation && (
                      <div className="rv-contact-row">
                        <span className="rv-contact-label">HQ</span>
                        <span className="rv-contact-value">{form.hqLocation}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  {(form.linkedin || form.twitter || form.facebook) && (
                    <>
                      <div className="rv-divider" />
                      <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
                        {form.linkedin && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '.3rem',
                            fontFamily: 'var(--font-nunito)', fontSize: '.68rem', color: 'var(--h-body)', fontWeight: 600,
                          }}>
                            <IconLinkedin />LinkedIn
                          </span>
                        )}
                        {form.twitter && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '.3rem',
                            fontFamily: 'var(--font-nunito)', fontSize: '.68rem', color: 'var(--h-body)', fontWeight: 600,
                          }}>
                            <IconTwitter />Twitter
                          </span>
                        )}
                        {form.facebook && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '.3rem',
                            fontFamily: 'var(--font-nunito)', fontSize: '.68rem', color: 'var(--h-body)', fontWeight: 600,
                          }}>
                            <IconFacebook />Facebook
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  <div style={{ display: 'flex', gap: '.5rem', marginTop: '.85rem', flexWrap: 'wrap' }}>
                    <button className="rv-edit" type="button" onClick={() => goToStep(1)}>Edit Business</button>
                    <button className="rv-edit" type="button" onClick={() => goToStep(2)}>Edit Category</button>
                    <button className="rv-edit" type="button" onClick={() => goToStep(3)}>Edit Media</button>
                    <button className="rv-edit" type="button" onClick={() => goToStep(4)}>Edit Details</button>
                  </div>
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

                {/* ── PayPal Payment Section ── */}
                <div style={{
                  background: 'var(--h-bg)', borderRadius: 18, border: '1.5px solid var(--h-border)',
                  padding: 'clamp(1rem, 3vw, 1.5rem)', marginTop: '.5rem',
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '.35rem',
                      padding: '.25rem .75rem', borderRadius: 999,
                      background: '#2FAE6A10', color: '#2FAE6A',
                      fontFamily: 'var(--font-nunito)', fontSize: '.62rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.5rem',
                    }}>
                      <IconLock />
                      Secure Payment
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-bricolage)', fontWeight: 800,
                      fontSize: 'clamp(.95rem, 2.5vw, 1.15rem)', color: 'var(--h-heading)',
                      margin: '0 0 .25rem',
                    }}>
                      Complete Payment to Submit
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-nunito)', fontSize: '.75rem', color: 'var(--h-body)',
                      lineHeight: 1.55, maxWidth: 420, margin: '0 auto .75rem',
                    }}>
                      Your listing will be submitted automatically after payment. No submission without payment.
                    </p>
                    <div style={{
                      display: 'inline-flex', alignItems: 'baseline', gap: '.15rem',
                      marginBottom: '.85rem',
                    }}>
                      <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: '.85rem', fontWeight: 700, color: 'var(--h-muted)' }}>$</span>
                      <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--h-heading)' }}>{selectedPlan?.price}</span>
                      <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.75rem', fontWeight: 600, color: 'var(--h-muted)' }}>{selectedPlan?.period}</span>
                    </div>
                  </div>

                  {/* PayPal Buttons Container */}
                  {submitting ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                      <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="var(--h-accent)" strokeWidth={2} strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.8rem', color: 'var(--h-body)', marginTop: '.5rem' }}>Processing payment &amp; submitting your listing...</p>
                    </div>
                  ) : (
                    <div style={{ maxWidth: 420, margin: '0 auto' }}>
                      <div ref={paypalContainerRef}>
                        {!paypalReady && (
                          <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--h-muted)', fontFamily: 'var(--font-nunito)', fontSize: '.8rem' }}>Loading payment options...</div>
                        )}
                      </div>
                      {/* Sandbox test bypass — REMOVE IN PRODUCTION */}
                      <button
                        type="button"
                        onClick={async () => {
                          setSubmitting(true)
                          setPaymentError('')
                          try {
                            await addSubmission({
                              companyName: form.companyName, contactName: form.contactName,
                              email: form.email, phoneCode: form.phoneCode, phone: form.phone,
                              website: form.website, category: form.categoryName,
                              categorySlug: form.categorySlug, categoryColor: form.categoryColor,
                              categoryIcon: form.categoryIcon, country: form.country, city: form.city,
                              tagline: form.tagline, description: form.description,
                              logoUrl: form.logoUrl, screenshots: form.screenshots,
                              demoVideo: form.demoVideo,
                              features: form.features.filter(f => f.trim()),
                              integrations: form.integrations, pricingModel: form.pricingModel,
                              pricingTiers: showPricingTiers ? form.pricingTiers.filter(t => t.name.trim()) : [],
                              founded: form.founded, employees: form.employees,
                              funding: form.funding, hqLocation: form.hqLocation,
                              linkedin: form.linkedin, twitter: form.twitter, facebook: form.facebook,
                              plan: form.plan,
                              paypalOrderId: 'SANDBOX-TEST-' + Date.now(),
                              paymentStatus: 'completed',
                            })
                            setSubmitted(true)
                            scrollTop()
                          } catch { setPaymentError('Submission failed.') }
                          setSubmitting(false)
                        }}
                        style={{
                          width: '100%', marginTop: 10, padding: '12px 24px', borderRadius: 999,
                          background: '#F59E0B', color: '#fff', border: 'none', cursor: 'pointer',
                          fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '.85rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}
                      >
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                        Sandbox Test — Pay &amp; Submit Instantly
                      </button>
                    </div>
                  )}

                  {/* Payment error */}
                  {paymentError && (
                    <div style={{
                      marginTop: '.75rem', padding: '.65rem .85rem', borderRadius: 12,
                      background: '#EF444410', border: '1px solid #EF444420',
                      fontFamily: 'var(--font-nunito)', fontSize: '.75rem', color: '#DC2626',
                      fontWeight: 600, textAlign: 'center',
                    }}>
                      {paymentError}
                    </div>
                  )}

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '.4rem', justifyContent: 'center',
                    marginTop: '.85rem', padding: '.5rem',
                    fontFamily: 'var(--font-nunito)', fontSize: '.62rem', color: 'var(--h-muted)', fontWeight: 600,
                  }}>
                    <IconLock />
                    <span>256-bit SSL encrypted. Your payment details are never stored on our servers.</span>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* ── Navigation Buttons ── */}
          <div className="listing-actions">
            {step > 1 && (
              <button type="button" className="listing-btn listing-btn--secondary" onClick={prev}>
                <svg viewBox="0 0 24 24"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < 6 && (
              <button type="button" className="listing-btn listing-btn--primary" onClick={next} disabled={!canProceed()}>
                Continue<svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
