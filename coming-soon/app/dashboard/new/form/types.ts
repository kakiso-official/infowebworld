import type { ReactNode } from 'react'
import type { Category } from '../../../iww-hq/data/category-storage'
import type { TagGroup } from '../../../iww-hq/data/tag-storage'
import type { ListingType } from '../../../iww-hq/data/listing-type-storage'

export type PlanKey = 'free' | 'starter' | 'yearly' | 'lifetime'

export type PricingTier = {
  name: string
  price: string
  period: string
  features?: string[]
}
export type FaqItem = { question: string; answer: string }
export type KeyFeature = { name: string; description: string }
export type Award = { name: string; year?: string }

export type FormState = {
  /* Identity */
  companyName: string
  tagline: string
  website: string
  logoUrl: string
  headerTags: string[]
  description: string

  /* Category */
  l1Id: string
  l2Id: string
  l3Id: string
  listingTypeIds: string[]
  tagIds: string[]

  /* Contact & Location */
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
  hqLocation: string

  /* Story & Media */
  screenshots: string[]
  demoVideo: string
  founded: string
  employees: string
  funding: string
  linkedin: string
  twitter: string
  facebook: string
  hasIosApp: boolean
  hasAndroidApp: boolean
  compliance: string[]
  awards: Award[]
  languages: string[]
  industriesServed: string[]
  useCases: string[]
  targetCompanySizes: string[]
  supportChannels: string[]
  trainingOptions: string[]

  /* Features & pricing */
  features: string[]
  keyFeatures: KeyFeature[]
  integrations: string[]
  startingPrice: string
  startingPricePeriod: string
  hasFreeTrial: boolean
  hasFreeVersion: boolean
  pricingModel: string
  pricingTiers: PricingTier[]
  pros: string[]
  cons: string[]
  faqs: FaqItem[]
}

export type PlanCaps = {
  maxScreenshots: number
  maxFeatures: number
  maxKeyFeatures: number
  maxFaqs: number
  maxTags: number
  maxPricingTiers: number
  maxAwards: number
  maxLanguages: number
  maxIndustries: number
  maxUseCases: number
  minSpecializations: number
  hasFaqs: boolean
  hasKeyFeatures: boolean
  hasPricingTiers: boolean
  hasAudienceSection: boolean
  hasComplianceAndAwards: boolean
  label: string
  price: string
  description: string
}

export type StepDef = {
  id: string
  num: string
  label: string
  /** When set, fields gated by this required tier will show "Upgrade to unlock" inline. */
  minTier?: PlanKey
}

export type StepProps = {
  form: FormState
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void
  errors: Record<string, string>
  caps: PlanCaps
  plan: PlanKey
}

export type CategoryStepProps = StepProps & {
  allCategories: Category[]
  listingTypes: ListingType[]
  tagGroups: TagGroup[]
}

export type ReviewStepProps = StepProps & {
  allCategories: Category[]
  listingTypes: ListingType[]
  tagGroups: TagGroup[]
  goToStep: (id: string) => void
}

export type SelectOpt = {
  value: string
  label: string
  icon?: ReactNode
  color?: string
}
