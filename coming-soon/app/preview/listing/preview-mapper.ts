/**
 * Convert in-progress form state into the snake_case row shape that
 * ListingDetailPage / CompanyDetailPage consume via `initialData`.
 *
 * Lives next to the preview route — the only consumer. Kept self-contained
 * so the form import surface stays the same.
 */
import type { FormState } from '../../dashboard/new/form/types'
import { CATEGORIES, type StaticCategoryRow } from '../../config/categories-data'
import type { RealSubmission } from '../../iww-hq/data/submissions-storage'

export type PreviewPayload = {
  plan: string
  form: FormState
  savedAt: number
}

export const PREVIEW_STORAGE_KEY = 'iww_listing_preview'

const arr = <T>(v: unknown): T[] => Array.isArray(v) ? (v as T[]) : []

function pickCategory(form: FormState): StaticCategoryRow | null {
  const id = Number(form.l3Id || form.l2Id || form.l1Id || 0)
  if (!id) return null
  return CATEGORIES.find(c => c.id === id) || null
}

function buildBreadcrumb(form: FormState): { name: string; slug: string }[] {
  const out: { name: string; slug: string }[] = []
  for (const idStr of [form.l1Id, form.l2Id, form.l3Id]) {
    const id = Number(idStr || 0)
    if (!id) continue
    const cat = CATEGORIES.find(c => c.id === id)
    if (cat) out.push({ name: cat.name, slug: cat.slug })
  }
  return out
}

function slugifyPreview(name: string): string {
  return (name || 'untitled-listing')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'untitled-listing'
}

/**
 * Build the InitialData ListingDetailPage expects from a FormState.
 * Siblings/related left empty — the preview surfaces only what the user
 * has typed; cross-marketing rails populate on the real page after publish.
 */
export function buildProductInitialData(form: FormState) {
  const cat = pickCategory(form)
  const slug = slugifyPreview(form.companyName)
  const listing: Record<string, unknown> = {
    id: 0,
    slug,
    company_name: form.companyName || 'Your listing name',
    contact_name: form.contactName,
    email: form.email,
    phone: form.phone,
    phone_code: form.phoneCode,
    website: form.website,
    tagline: form.tagline || 'Add a tagline to summarize what you do',
    description: form.description,
    logo_url: form.logoUrl,
    screenshots: form.screenshots,
    demo_video: form.demoVideo,
    features: form.features,
    integrations: form.integrations,
    pricing_model: form.pricingModel,
    pricing_tiers: form.pricingTiers,
    founded_year: form.founded,
    team_size: form.employees,
    funding: form.funding,
    hq_location: form.hqLocation,
    linkedin: form.linkedin,
    twitter: form.twitter,
    facebook: form.facebook,
    faqs: form.faqs,
    city: form.city,
    state: form.state,
    country_name: form.country,
    status: 'preview',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: cat?.id ?? null,
    category_name: cat?.name ?? '',
    category_slug: cat?.slug ?? '',
    category_color: cat?.color ?? '#E8553D',
    plan_name: form.companyName ? 'Preview' : '',
    plan_slug: '',
    /* V3 fields */
    header_tags: form.headerTags,
    pros: form.pros,
    cons: form.cons,
    industries_served: form.industriesServed,
    use_cases: form.useCases,
    target_company_sizes: form.targetCompanySizes,
    key_features: form.keyFeatures,
    starting_price: form.startingPrice,
    starting_price_period: form.startingPricePeriod,
    has_free_trial: form.hasFreeTrial ? 1 : 0,
    has_free_version: form.hasFreeVersion ? 1 : 0,
    support_channels: form.supportChannels,
    training_options: form.trainingOptions,
    languages: form.languages,
    has_ios_app: form.hasIosApp ? 1 : 0,
    has_android_app: form.hasAndroidApp ? 1 : 0,
    /* Preview never shows the Verified badge — verification is post-publish. */
    verified: 0,
    verified_at: null,
    compliance: form.compliance,
    awards: form.awards,
  }
  void arr
  return {
    listing,
    parentCompany: null,
    breadcrumb: buildBreadcrumb(form),
    related: [],
    relatedCategories: [],
    siblings: [],
    engagement: { followers: 0, likes: 0, dislikes: 0, bookmarks: 0 },
    reviews: { avgRating: 0, reviewCount: 0, recent: [] },
    userState: {
      isFollowing: false,
      reaction: null as 'like' | 'dislike' | null,
      isBookmarked: false,
      hasReviewed: false,
      currentUser: null,
    },
    isAuthed: false,
  }
}

/**
 * Build the InitialData CompanyDetailPage expects from a FormState.
 * Companies map to /profile/[slug]. Mirrors the row shape served by
 * the server query in app/profile/[slug]/page.tsx.
 */
export function buildCompanyInitialData(form: FormState) {
  const cat = pickCategory(form)
  const slug = slugifyPreview(form.companyName)
  const company: Record<string, unknown> = {
    id: 0,
    slug,
    uuid: 'preview',
    company_name: form.companyName || 'Your company name',
    tagline: form.tagline || 'Add a tagline to describe your company',
    description: form.description,
    logo_url: form.logoUrl,
    website: form.website,
    email: form.email,
    phone: form.phone,
    phone_code: form.phoneCode,
    founded_year: form.founded,
    team_size: form.employees,
    hq_location: form.hqLocation,
    city: form.city,
    state: form.state,
    country_name: form.country,
    linkedin: form.linkedin,
    twitter: form.twitter,
    facebook: form.facebook,
    funding: form.funding,
    is_hiring: form.isHiring ? 1 : 0,
    header_tags: form.headerTags,
    status: 'preview',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    verified: 0,
    verified_at: null,
    category_name: cat?.name ?? '',
    category_slug: cat?.slug ?? '',
    category_color: cat?.color ?? '#0C9A9A',
    plan_name: '',
    plan_slug: '',
    industries_served: form.industriesServed,
    target_company_sizes: form.targetCompanySizes,
    languages: form.languages,
    awards: form.awards,
    min_project_size: form.minProjectSize,
    hourly_rate: form.hourlyRate,
    common_project_size: form.commonProjectSize,
    intro_video_url: form.introVideoUrl,
    timezones: form.timezones,
    service_lines: form.serviceLines,
    focus_breakdown: form.focusBreakdown,
    client_logos: form.clientLogos,
    clients_summary: form.clientsSummary,
  }
  return {
    company,
    products: [],
    similarCompanies: [],
    popularTools: [],
    relatedCategories: [],
    engagement: { followers: 0, bookmarks: 0 },
    reviews: { avgRating: 0, reviewCount: 0, recent: [] },
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   Admin submission preview — RealSubmission → initialData

   The dashboard form preview above maps FormState. The /iww-hq/submissions
   admin preview instead has a fully-saved RealSubmission (camelCase, already
   joined with its category). These two builders produce the exact same
   snake_case `initialData` shape the real ListingDetailPage / CompanyDetailPage
   consume on /listing/[slug] and /profile/[slug] — so an admin sees precisely
   how the public page will render after approval. Cross-marketing rails
   (related / siblings / similar) populate from OTHER listings post-publish,
   so they're intentionally left empty here.
   ═══════════════════════════════════════════════════════════════════════ */

/** Rebuild the L1→L3 breadcrumb from a leaf category slug by walking the
 *  static taxonomy upward via parent_id. Mirrors the server-built crumb on
 *  the live page so breadcrumb links match exactly. */
function breadcrumbFromCategorySlug(categorySlug: string): { name: string; slug: string }[] {
  if (!categorySlug) return []
  let cur: StaticCategoryRow | undefined = CATEGORIES.find(c => c.slug === categorySlug)
  const chain: { name: string; slug: string }[] = []
  for (let guard = 0; cur && guard < 8; guard++) {
    chain.unshift({ name: cur.name, slug: cur.slug })
    cur = cur.parent_id != null ? CATEGORIES.find(c => c.id === cur!.parent_id) : undefined
  }
  return chain
}

/** Product/tool submission → ListingDetailPage initialData. */
export function submissionToProductInitialData(sub: RealSubmission) {
  const cat = CATEGORIES.find(c => c.slug === sub.categorySlug)
  const stamp = sub.submittedAt || new Date().toISOString()
  const listing: Record<string, unknown> = {
    id: 0,
    slug: sub.slug || slugifyPreview(sub.companyName),
    company_name: sub.companyName || 'Your listing name',
    contact_name: sub.contactName,
    email: sub.email,
    phone: sub.phone,
    phone_code: sub.phoneCode,
    website: sub.website,
    tagline: sub.tagline || 'Add a tagline to summarize what you do',
    description: sub.description,
    logo_url: sub.logoUrl,
    screenshots: sub.screenshots,
    demo_video: sub.demoVideo,
    features: sub.features,
    integrations: sub.integrations,
    pricing_model: sub.pricingModel,
    pricing_tiers: sub.pricingTiers,
    founded_year: sub.founded,
    team_size: sub.employees,
    funding: sub.funding,
    hq_location: sub.hqLocation,
    linkedin: sub.linkedin,
    twitter: sub.twitter,
    facebook: sub.facebook,
    faqs: sub.faqs,
    city: sub.city,
    state: sub.state,
    country_name: sub.country,
    status: sub.status,
    created_at: stamp,
    updated_at: stamp,
    category_id: cat?.id ?? null,
    category_name: sub.category || cat?.name || '',
    category_slug: sub.categorySlug || cat?.slug || '',
    category_color: sub.categoryColor || cat?.color || '#E8553D',
    plan_name: sub.planName,
    plan_slug: sub.plan,
    /* V3 fields */
    header_tags: sub.headerTags,
    pros: sub.pros,
    cons: sub.cons,
    industries_served: sub.industriesServed,
    use_cases: sub.useCases,
    target_company_sizes: sub.targetCompanySizes,
    key_features: sub.keyFeatures,
    starting_price: sub.startingPrice,
    starting_price_period: sub.startingPricePeriod,
    has_free_trial: sub.hasFreeTrial ? 1 : 0,
    has_free_version: sub.hasFreeVersion ? 1 : 0,
    support_channels: sub.supportChannels,
    training_options: sub.trainingOptions,
    languages: sub.languages,
    has_ios_app: sub.hasIosApp ? 1 : 0,
    has_android_app: sub.hasAndroidApp ? 1 : 0,
    /* Show the real verified state — that's how it looks once live. */
    verified: sub.verified ? 1 : 0,
    verified_at: sub.verifiedAt || null,
    compliance: sub.compliance,
    awards: sub.awards,
  }
  return {
    listing,
    parentCompany: null,
    breadcrumb: breadcrumbFromCategorySlug(sub.categorySlug),
    related: [],
    relatedCategories: [],
    siblings: [],
    engagement: { followers: 0, likes: 0, dislikes: 0, bookmarks: 0 },
    reviews: { avgRating: 0, reviewCount: 0, recent: [] },
    userState: {
      isFollowing: false,
      reaction: null as 'like' | 'dislike' | null,
      isBookmarked: false,
      hasReviewed: false,
      currentUser: null,
    },
    isAuthed: false,
  }
}

/** Company submission → CompanyDetailPage initialData. */
export function submissionToCompanyInitialData(sub: RealSubmission) {
  const cat = CATEGORIES.find(c => c.slug === sub.categorySlug)
  const stamp = sub.submittedAt || new Date().toISOString()
  const company: Record<string, unknown> = {
    id: 0,
    slug: sub.slug || slugifyPreview(sub.companyName),
    uuid: 'preview',
    company_name: sub.companyName || 'Your company name',
    tagline: sub.tagline || 'Add a tagline to describe your company',
    description: sub.description,
    logo_url: sub.logoUrl,
    website: sub.website,
    email: sub.email,
    phone: sub.phone,
    phone_code: sub.phoneCode,
    founded_year: sub.founded,
    team_size: sub.employees,
    hq_location: sub.hqLocation,
    city: sub.city,
    state: sub.state,
    country_name: sub.country,
    linkedin: sub.linkedin,
    twitter: sub.twitter,
    facebook: sub.facebook,
    funding: sub.funding,
    is_hiring: sub.isHiring ? 1 : 0,
    header_tags: sub.headerTags,
    status: sub.status,
    created_at: stamp,
    updated_at: stamp,
    verified: sub.verified ? 1 : 0,
    verified_at: sub.verifiedAt || null,
    category_name: sub.category || cat?.name || '',
    category_slug: sub.categorySlug || cat?.slug || '',
    category_color: sub.categoryColor || cat?.color || '#0C9A9A',
    plan_name: sub.planName,
    plan_slug: sub.plan,
    industries_served: sub.industriesServed,
    target_company_sizes: sub.targetCompanySizes,
    languages: sub.languages,
    awards: sub.awards,
    min_project_size: sub.minProjectSize,
    hourly_rate: sub.hourlyRate,
    common_project_size: sub.commonProjectSize,
    intro_video_url: sub.introVideoUrl,
    timezones: sub.timezones,
    service_lines: sub.serviceLines,
    focus_breakdown: sub.focusBreakdown,
    client_logos: sub.clientLogos,
    clients_summary: sub.clientsSummary,
  }
  return {
    company,
    products: [],
    similarCompanies: [],
    popularTools: [],
    relatedCategories: [],
    engagement: { followers: 0, bookmarks: 0 },
    reviews: { avgRating: 0, reviewCount: 0, recent: [] },
  }
}
