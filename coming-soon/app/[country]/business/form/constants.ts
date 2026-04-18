import type { FormState, PlanCaps, PlanKey } from './types'

export const INITIAL: FormState = {
  companyName: '', tagline: '', website: '',
  l1Id: '', l2Id: '', l3Id: '', listingTypeIds: [],
  contactName: '', email: '', phoneIso: 'US', phoneCode: '+1', phone: '',
  countryCode: '', country: '', stateCode: '', state: '', city: '',
  description: '', logoUrl: '', screenshots: [],
  features: [''], faqs: [{ question: '', answer: '' }], tagIds: [],
  integrations: [], pricingModel: '',
  pricingTiers: [
    { name: 'Free', price: '0', period: '/ month' },
    { name: 'Pro', price: '', period: '/ month' },
    { name: 'Enterprise', price: '', period: '/ month' },
  ],
  demoVideo: '', founded: '', employees: '', funding: '', hqLocation: '',
  linkedin: '', twitter: '', facebook: '',
}

export const PLAN_CAPS: Record<PlanKey, PlanCaps> = {
  free: {
    /* maxTags must be >= number of tag groups (6) since every group requires >=1 selection. */
    maxScreenshots: 1, maxFeatures: 3, maxFaqs: 0, maxTags: 8, minSpecializations: 2,
    hasFaqs: false, hasPremium: false,
    label: 'Free', price: '$0', accent: '#E8553D',
    description: 'Basic listing to get your business online',
  },
  starter: {
    maxScreenshots: 3, maxFeatures: 8, maxFaqs: 3, maxTags: 12, minSpecializations: 2,
    hasFaqs: true, hasPremium: false,
    label: 'Starter', price: '$49/yr', accent: '#E8553D',
    description: 'SEO-ready listing with reviews and backlink',
  },
  yearly: {
    maxScreenshots: 10, maxFeatures: 15, maxFaqs: 12, maxTags: 30, minSpecializations: 2,
    hasFaqs: true, hasPremium: true,
    label: 'Early Adopter', price: '$99/yr', accent: '#E8553D',
    description: 'Full listing with leads, analytics and premium tools',
  },
  lifetime: {
    maxScreenshots: 10, maxFeatures: 15, maxFaqs: 12, maxTags: 30, minSpecializations: 2,
    hasFaqs: true, hasPremium: true,
    label: 'Elite Lifetime', price: '$239', accent: '#E8553D',
    description: 'Lifetime founding listing — top placement, every feature',
  },
}

/** URL country prefix → country-state-city ISO code for phone/country defaults. */
export const URL_COUNTRY_ISO: Record<string, string> = {
  in: 'IN', us: 'US', uk: 'GB', gb: 'GB', ca: 'CA', au: 'AU', eu: 'DE',
}
