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
export type IntegrationItem = { name: string; website: string; description: string }
/** Service Lines / Focus breakdown row — drives the company-page tab pie charts. */
export type ServiceShare = { name: string; percentage: number }
/** Client logo entry — name + favicon-resolvable URL + optional case-study link. */
export type ClientLogo = { name: string; logoUrl?: string; url?: string }

export type ListingMode = '' | 'company' | 'product'

export type FormState = {
  /* Listing meta — picked in the entry hero before the form proper.
     'company' = the business itself (services, agencies, local biz);
     'product' = a specific product/SaaS the company makes. Drives later
     copy and which optional fields surface. */
  listingMode: ListingMode

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
  /** Company-only flag rendered as a "We're hiring" badge on /profile/[slug]. */
  isHiring: boolean
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
  integrations: IntegrationItem[]
  startingPrice: string
  startingPricePeriod: string
  hasFreeTrial: boolean
  hasFreeVersion: boolean
  pricingModel: string
  pricingTiers: PricingTier[]
  pros: string[]
  cons: string[]
  faqs: FaqItem[]

  /* ── Company-mode Clutch-style fields. All optional; rendered on
     /profile/[slug] when present, hidden when blank. The product flow
     never reads or writes these (zeroed in the submit payload). ── */
  /** "Min project size" stat — free text so "$10,000+" / "Contact us" both work. */
  minProjectSize: string
  /** "Hourly rate" stat — free text so "$150 - $199 / hr" / "Contact us" both work. */
  hourlyRate: string
  /** "Most Common Project Size" — free text e.g. "$50,000 - $199,999". */
  commonProjectSize: string
  /** "Watch our Video" link — YouTube/Vimeo/Loom. */
  introVideoUrl: string
  /** Timezones the team operates in — e.g. "America/Chicago", "GMT+5:30". */
  timezones: string[]
  /** Service Lines tab — slices for the pie chart. Sum should equal 100. */
  serviceLines: ServiceShare[]
  /** Focus tab — segments by client size / industry verticals. Sum should equal 100. */
  focusBreakdown: ServiceShare[]
  /** Clients tab — logos shown in a grid. */
  clientLogos: ClientLogo[]
  /** "What Clients Have Said" editorial paragraph for the Pricing Snapshot block. */
  clientsSummary: string
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
