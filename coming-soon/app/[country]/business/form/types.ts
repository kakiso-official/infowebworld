import type { ReactNode } from 'react'

export type PlanKey = 'free' | 'starter' | 'yearly' | 'lifetime'

export type PricingTier = { name: string; price: string; period: string }
export type FaqItem = { question: string; answer: string }

export type FormState = {
  companyName: string
  tagline: string
  website: string
  l1Id: string
  l2Id: string
  l3Id: string
  listingTypeIds: string[] // multi-select specializations, min 2 required
  contactName: string
  email: string
  phoneIso: string
  phoneCode: string
  phone: string
  countryCode: string
  country: string
  stateCode: string
  state: string
  city: string
  description: string
  logoUrl: string
  screenshots: string[]
  features: string[]
  faqs: FaqItem[]
  tagIds: string[]
  integrations: string[]
  pricingModel: string
  pricingTiers: PricingTier[]
  demoVideo: string
  founded: string
  employees: string
  funding: string
  hqLocation: string
  linkedin: string
  twitter: string
  facebook: string
}

export type PlanCaps = {
  maxScreenshots: number
  maxFeatures: number
  maxFaqs: number
  maxTags: number
  minSpecializations: number
  hasFaqs: boolean
  hasPremium: boolean
  label: string
  price: string
  accent: string
  description: string
}

export type StepDef = { id: string; label: string; icon: ReactNode }

export type StepProps = {
  form: FormState
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void
  errors: Record<string, string>
}

export type SelectOpt = {
  value: string
  label: string
  icon?: ReactNode
  color?: string
}
