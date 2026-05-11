import type { FormState, PlanCaps, PlanKey, StepDef } from './types'

/* Step definitions for the two listing modes. The product flow is the
   long 7-step form we already built. The company flow is a focused
   3-step intake: identity -> details -> review. */

export const PRODUCT_STEPS: StepDef[] = [
  { id: 'identity', num: '01', label: 'Identity' },
  { id: 'category', num: '02', label: 'Category' },
  { id: 'contact',  num: '03', label: 'Contact' },
  { id: 'story',    num: '04', label: 'Story' },
  { id: 'features', num: '05', label: 'Features' },
  { id: 'pricing',  num: '06', label: 'Pricing' },
  { id: 'review',   num: '07', label: 'Review' },
]

export const COMPANY_STEPS: StepDef[] = [
  { id: 'company_identity', num: '01', label: 'Identity' },
  { id: 'company_details',  num: '02', label: 'Details'  },
  { id: 'company_services', num: '03', label: 'Services & pricing' },
  { id: 'company_review',   num: '04', label: 'Review'   },
]


export const INITIAL: FormState = {
  /* Listing meta */
  listingMode: '',

  /* Identity */
  companyName: '',
  tagline: '',
  website: '',
  logoUrl: '',
  headerTags: [],
  description: '',

  /* Category */
  l1Id: '',
  l2Id: '',
  l3Id: '',
  listingTypeIds: [],
  tagIds: [],

  /* Contact & Location */
  contactName: '',
  email: '',
  phoneIso: 'US',
  phoneCode: '+1',
  phone: '',
  countryCode: '',
  country: '',
  stateCode: '',
  state: '',
  city: '',
  hqLocation: '',

  /* Story & media */
  screenshots: [],
  demoVideo: '',
  founded: '',
  employees: '',
  funding: '',
  linkedin: '',
  twitter: '',
  facebook: '',
  isHiring: false,
  hasIosApp: false,
  hasAndroidApp: false,
  compliance: [],
  awards: [],
  languages: [],
  industriesServed: [],
  useCases: [],
  targetCompanySizes: [],
  supportChannels: [],
  trainingOptions: [],

  /* Features & pricing */
  features: [],
  keyFeatures: [],
  integrations: [],
  startingPrice: '',
  startingPricePeriod: '/ month',
  hasFreeTrial: false,
  hasFreeVersion: false,
  pricingModel: '',
  pricingTiers: [],
  pros: [],
  cons: [],
  faqs: [],

  /* Company-mode Clutch-style fields */
  minProjectSize: '',
  hourlyRate: '',
  commonProjectSize: '',
  introVideoUrl: '',
  timezones: [],
  serviceLines: [],
  focusBreakdown: [],
  clientLogos: [],
  clientsSummary: '',
}

/* Every plan now collects the same data — at the initial-launch stage we
   want the full info from every submitter regardless of tier. The plan
   tier still drives what gets PUBLISHED on the live listing page (gated
   downstream), but the form UI is identical. */
const SHARED_CAPS = {
  maxScreenshots: 10,
  maxFeatures: 50,
  maxKeyFeatures: 8,
  maxFaqs: 20,
  maxTags: 30,
  maxPricingTiers: 5,
  maxAwards: 15,
  maxLanguages: 30,
  maxIndustries: 10,
  maxUseCases: 10,
  minSpecializations: 0,
  hasFaqs: true,
  hasKeyFeatures: true,
  hasPricingTiers: true,
  hasAudienceSection: true,
  hasComplianceAndAwards: true,
} as const

export const PLAN_CAPS: Record<PlanKey, PlanCaps> = {
  free: {
    ...SHARED_CAPS,
    label: 'Free',
    price: '$0',
    description: 'Basic listing to get your business online',
  },
  starter: {
    ...SHARED_CAPS,
    label: 'Starter',
    price: '$49 one-time',
    description: 'SEO-ready listing with reviews and backlink',
  },
  yearly: {
    ...SHARED_CAPS,
    label: 'Early Adopter',
    price: '$99 / yr',
    description: 'Full listing with leads, analytics and premium tools',
  },
  lifetime: {
    ...SHARED_CAPS,
    label: 'Lifetime',
    price: '$239 one-time',
    description: 'Lifetime founding listing — every premium field unlocked',
  },
}

/** URL country prefix → country-state-city ISO code for phone/country defaults. */
export const URL_COUNTRY_ISO: Record<string, string> = {
  in: 'IN', us: 'US', uk: 'GB', gb: 'GB', ca: 'CA', au: 'AU', eu: 'DE',
}

/** Multi-select options. Pure constants — no API call needed. */
export const COMPANY_SIZE_OPTIONS = [
  'Small (1-50)',
  'Mid-market (51-500)',
  'Enterprise (500+)',
]

export const SUPPORT_CHANNEL_OPTIONS = [
  'Email/help desk',
  'Chat',
  'Knowledge base',
  'FAQs/forum',
  '24/7 (live rep)',
  'Phone support',
]

export const TRAINING_OPTION_OPTIONS = [
  'Live online',
  'Videos',
  'Webinars',
  'Documentation',
  'In-person',
]

export const COMPLIANCE_OPTIONS = [
  'GDPR',
  'CAN-SPAM',
  'SOC 2',
  'HIPAA',
  'ISO 27001',
  'PCI-DSS',
  'CCPA',
  'FERPA',
]

export const TEAM_SIZE_OPTIONS = [
  'Solo / Freelancer',
  '2-10',
  '11-50',
  '51-200',
  '201-500',
  '500+',
]

export const FUNDING_STAGE_OPTIONS = [
  'Bootstrapped',
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+',
  'Publicly Traded',
  'Profitable',
]

export const PRICING_MODEL_OPTIONS = [
  'Subscription',
  'One-time Purchase',
  'Freemium',
  'Usage-based',
  'Contact for Pricing',
  'Completely Free',
]

export const PRICING_PERIOD_OPTIONS = ['/ month', '/ year', 'one-time', 'lifetime']

/** Common UI languages for the languages field — submitter can also free-add. */
export const COMMON_LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Portuguese',
  'Italian', 'Dutch', 'Japanese', 'Chinese (Simplified)',
  'Chinese (Traditional)', 'Korean', 'Arabic', 'Hindi',
  'Russian', 'Turkish', 'Vietnamese', 'Polish', 'Swedish',
]

/** Common timezones for company-mode "Timezones" pill list. Submitter can free-add too. */
export const COMMON_TIMEZONES = [
  'GMT-08:00 (Pacific)', 'GMT-07:00 (Mountain)', 'GMT-06:00 (Central)', 'GMT-05:00 (Eastern)',
  'GMT-03:00 (Brasilia)', 'GMT+00:00 (London)', 'GMT+01:00 (Berlin)', 'GMT+02:00 (Cairo)',
  'GMT+03:00 (Moscow)', 'GMT+04:00 (Dubai)', 'GMT+05:30 (India)', 'GMT+07:00 (Bangkok)',
  'GMT+08:00 (Singapore)', 'GMT+09:00 (Tokyo)', 'GMT+10:00 (Sydney)',
]
