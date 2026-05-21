/**
 * Convert in-progress form state into the snake_case row shape that
 * ListingDetailPage / CompanyDetailPage consume via `initialData`.
 *
 * Lives next to the preview route — the only consumer. Kept self-contained
 * so the form import surface stays the same.
 */
import type { FormState } from '../../dashboard/new/form/types'
import { CATEGORIES, type StaticCategoryRow } from '../../config/categories-data'

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
