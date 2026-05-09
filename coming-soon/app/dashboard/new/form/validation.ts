import type { FormState, PlanCaps, StepDef } from './types'
import type { TagGroup } from '../../../iww-hq/data/tag-storage'

const URL_RE = /^https?:\/\/.+\..+/i
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateStep(
  step: StepDef,
  form: FormState,
  caps: PlanCaps,
  tagGroups: TagGroup[],
): Record<string, string> {
  const e: Record<string, string> = {}

  switch (step.id) {
    case 'identity': {
      if (!form.companyName.trim()) e.companyName = 'Company name is required.'
      else if (form.companyName.length > 100) e.companyName = 'Max 100 characters.'
      if (!form.tagline.trim()) e.tagline = 'Tagline is required.'
      else if (form.tagline.length > 150) e.tagline = 'Max 150 characters.'
      if (!form.website.trim()) e.website = 'Website is required.'
      else if (!URL_RE.test(form.website.trim())) e.website = 'Must start with https://'
      break
    }
    case 'category': {
      if (!form.l1Id) e.l1 = 'Pick a sector.'
      if (form.l1Id && !form.l2Id) e.l2 = 'Pick a category.'
      if (form.l2Id && !form.l3Id) e.l3 = 'Pick a subcategory.'
      /* Specializations are optional — no minimum enforced. */
      /* Every tag group needs at least one selection */
      const missing = tagGroups
        .map(g => g.tags.some(t => form.tagIds.includes(t.id)) ? null : g.name)
        .filter(Boolean) as string[]
      if (missing.length > 0) e.tagIds = `Pick a tag in: ${missing.join(', ')}.`
      break
    }
    case 'contact': {
      if (!form.contactName.trim()) e.contactName = 'Your name is required.'
      if (!form.email.trim()) e.email = 'Email is required.'
      else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Invalid email address.'
      if (!form.country.trim()) e.country = 'Country is required.'
      break
    }
    case 'story': {
      /* Description is optional but recommended. Plan-gated extras only validated for cap. */
      if (form.awards.length > caps.maxAwards) e.awards = `Max ${caps.maxAwards} awards.`
      if (form.languages.length > caps.maxLanguages) e.languages = `Max ${caps.maxLanguages} languages.`
      if (form.industriesServed.length > caps.maxIndustries) {
        e.industriesServed = `Max ${caps.maxIndustries} industries.`
      }
      if (form.useCases.length > caps.maxUseCases) e.useCases = `Max ${caps.maxUseCases} use cases.`
      break
    }
    case 'features': {
      if (form.features.filter(f => f.trim()).length === 0) {
        e.features = 'Add at least one feature.'
      }
      if (form.features.length > caps.maxFeatures) {
        e.features = `Max ${caps.maxFeatures} features on your plan.`
      }
      if (form.keyFeatures.length > caps.maxKeyFeatures) {
        e.keyFeatures = `Max ${caps.maxKeyFeatures} key features on your plan.`
      }
      break
    }
    case 'pricing': {
      if (form.pricingTiers.length > caps.maxPricingTiers) {
        e.pricingTiers = `Max ${caps.maxPricingTiers} pricing tiers on your plan.`
      }
      if (form.faqs.length > caps.maxFaqs) {
        e.faqs = `Max ${caps.maxFaqs} FAQs on your plan.`
      }
      break
    }
    case 'review': {
      /* Final review re-validates by walking earlier steps in the orchestrator. */
      break
    }

    /* ── Company-mode steps. The 3-step short flow only requires a small
       subset of fields; the rest are optional or unused. ── */
    case 'company_identity': {
      if (!form.companyName.trim()) e.companyName = 'Company name is required.'
      else if (form.companyName.length > 100) e.companyName = 'Max 100 characters.'
      if (!form.tagline.trim()) e.tagline = 'Tagline is required.'
      else if (form.tagline.length > 150) e.tagline = 'Max 150 characters.'
      if (!form.website.trim()) e.website = 'Website is required.'
      else if (!URL_RE.test(form.website.trim())) e.website = 'Must start with https://'
      if (form.founded && !/^\d{4}$/.test(form.founded)) {
        e.founded = 'Founded must be a 4-digit year.'
      }
      break
    }
    case 'company_details': {
      if (!form.contactName.trim()) e.contactName = 'Your name is required.'
      if (!form.email.trim()) e.email = 'Email is required.'
      else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Invalid email address.'
      if (!form.country.trim()) e.country = 'Country is required.'
      break
    }
    case 'company_review': {
      /* No extra checks; previous steps already validated. */
      break
    }
  }

  return e
}
