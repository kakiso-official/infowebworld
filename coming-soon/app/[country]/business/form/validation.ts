import type { TagGroup } from '../../../iww-hq/data/tag-storage'
import type { FormState, PlanCaps, StepDef } from './types'

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
export const isUrl = (v: string) => /^https?:\/\/[^\s]+\.[^\s]+/.test(v.trim())

/**
 * Validate the given step. Returns an object of field → error message.
 * Empty object means the step is valid.
 *
 * tagGroups is optional — used by the Features step to enforce
 * "at least 1 tag selected per group".
 */
export function validateStep(
  step: StepDef,
  form: FormState,
  caps: PlanCaps,
  tagGroups: TagGroup[] = []
): Record<string, string> {
  const e: Record<string, string> = {}
  if (step.id === 'business') {
    if (!form.companyName.trim() || form.companyName.trim().length < 2) e.companyName = 'Company name is required'
    if (!form.tagline.trim() || form.tagline.trim().length < 5) e.tagline = 'Tagline must be at least 5 characters'
    if (!form.website.trim()) e.website = 'Website is required'
    else if (!isUrl(form.website)) e.website = 'Must start with http:// or https://'
  } else if (step.id === 'category') {
    if (!form.l1Id) e.l1Id = 'Please pick a sector'
    if (!form.l2Id) e.l2Id = 'Please pick a category'
    if (!form.l3Id) e.l3Id = 'Please pick a subcategory'
    if (form.l3Id && form.listingTypeIds.length < caps.minSpecializations) {
      e.listingTypeIds = `Pick at least ${caps.minSpecializations} specializations`
    }
  } else if (step.id === 'contact') {
    if (!form.contactName.trim()) e.contactName = 'Your name is required'
    if (!form.email.trim() || !isEmail(form.email)) e.email = 'Valid email required'
  } else if (step.id === 'location') {
    if (!form.country) e.country = 'Country is required'
  } else if (step.id === 'features') {
    /* Every tag group must have at least one tag selected. */
    const missing: string[] = []
    for (const g of tagGroups) {
      const hasOne = g.tags.some(t => form.tagIds.includes(t.id))
      if (!hasOne) missing.push(g.name)
    }
    if (missing.length > 0) {
      e.tagIds = `Pick at least 1 tag from each group. Still missing: ${missing.join(', ')}.`
    }
  }
  return e
}
