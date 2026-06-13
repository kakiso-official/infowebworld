/**
 * Submissions storage — reads/writes from MySQL via api.php
 */

const API = '/api'

export type PricingTier = { name: string; price: string; period: string; features?: string[] }
export type FaqItem = { question: string; answer: string }
export type KeyFeature = { name: string; description: string }
export type Award = { name: string; year?: string }
export type IntegrationItem = { name: string; website?: string; description?: string }
/** Service Lines / Focus breakdown row — drives the company-page tab pie charts. */
export type ServiceShare = { name: string; percentage: number }
/** Client logo entry — name + favicon-resolvable URL + optional case-study link. */
export type ClientLogo = { name: string; logoUrl?: string; url?: string }

export type RealSubmission = {
  id: string
  companyName: string
  contactName: string
  email: string
  phoneCode: string
  phone: string
  website: string
  category: string
  categorySlug: string
  categoryColor: string
  categoryIcon: string
  country: string
  city: string
  state: string
  tagline: string
  description: string
  slug: string
  logoUrl: string
  screenshots: string[]
  demoVideo: string
  features: string[]
  integrations: IntegrationItem[]
  pricingModel: string
  pricingTiers: PricingTier[]
  founded: string
  employees: string
  funding: string
  hqLocation: string
  linkedin: string
  twitter: string
  facebook: string
  faqs: FaqItem[]
  listingType: string
  listingTypeSlug: string
  plan: string
  planName: string
  status: 'pending' | 'confirmed' | 'paid' | 'active' | 'rejected' | 'suspended'
  submittedAt: string
  approvedAt: string
  /* ── Listings V3 fields (capture every datum the live listing page renders) ── */
  headerTags: string[]
  pros: string[]
  cons: string[]
  industriesServed: string[]
  useCases: string[]
  targetCompanySizes: string[]
  keyFeatures: KeyFeature[]
  startingPrice: string
  startingPricePeriod: string
  hasFreeTrial: boolean
  hasFreeVersion: boolean
  supportChannels: string[]
  trainingOptions: string[]
  languages: string[]
  hasIosApp: boolean
  hasAndroidApp: boolean
  compliance: string[]
  awards: Award[]
  /* ── Verification state (resolved from submissions.verified columns) ── */
  verified: boolean
  verifiedAt: string
  /** 'product' | 'company' — defaults to 'product' for legacy rows. */
  listingMode: 'product' | 'company'
  /** Company-mode "we're hiring" flag — drives the Open Roles badge on /profile. */
  isHiring: boolean
  /** Parent company FK on product rows; null on company rows / unlinked products. */
  parentCompanyId: string
  /* ── Company-mode Clutch-style fields. Only populated on listing_mode='company';
        empty/blank on product rows. ── */
  minProjectSize: string
  hourlyRate: string
  commonProjectSize: string
  introVideoUrl: string
  timezones: string[]
  serviceLines: ServiceShare[]
  focusBreakdown: ServiceShare[]
  clientLogos: ClientLogo[]
  clientsSummary: string
  /* ── Reviews aggregate (joined from `reviews` table for category listing cards) ── */
  reviewCount: number
  reviewAvg: number
  latestReviewTitle: string
  latestReviewAuthor: string
  /* Tag slugs attached via submission_tags — drives the filter bar's
     tag-group dropdowns. */
  tagSlugs: string[]
}

function parseJson(val: unknown): unknown[] {
  if (!val) return []
  if (typeof val === 'string') { try { return JSON.parse(val) } catch { return [] } }
  if (Array.isArray(val)) return val
  return []
}

export function mapRow(r: Record<string, unknown>): RealSubmission {
  return {
    id: String(r.id ?? ''),
    companyName: String(r.company_name ?? ''),
    contactName: String(r.contact_name ?? ''),
    email: String(r.email ?? ''),
    phoneCode: String(r.phone_code ?? '+1'),
    phone: String(r.phone ?? ''),
    website: String(r.website ?? ''),
    category: String(r.category_name ?? r.category ?? ''),
    categorySlug: String(r.category_slug ?? ''),
    categoryColor: String(r.category_color ?? '#E8553D'),
    categoryIcon: String(r.category_icon ?? 'grid'),
    country: String(r.country_name ?? r.country ?? ''),
    city: String(r.city ?? ''),
    state: String(r.state ?? ''),
    tagline: String(r.tagline ?? ''),
    description: String(r.description ?? ''),
    slug: String(r.slug ?? ''),
    logoUrl: String(r.logo_url ?? ''),
    screenshots: parseJson(r.screenshots) as string[],
    demoVideo: String(r.demo_video ?? ''),
    features: parseJson(r.features) as string[],
    /* Tolerate legacy string[] payloads — wrap each as { name } so the live
       page never has to branch on shape. */
    integrations: (parseJson(r.integrations) as unknown[]).map((it) => {
      if (typeof it === 'string') return { name: it } as IntegrationItem
      if (it && typeof it === 'object') {
        const o = it as Record<string, unknown>
        return {
          name: String(o.name ?? ''),
          website: typeof o.website === 'string' ? o.website : undefined,
          description: typeof o.description === 'string' ? o.description : undefined,
        }
      }
      return { name: String(it) }
    }).filter(i => i.name) as IntegrationItem[],
    pricingModel: String(r.pricing_model ?? 'contact'),
    pricingTiers: parseJson(r.pricing_tiers) as PricingTier[],
    founded: String(r.founded_year ?? ''),
    employees: String(r.team_size ?? ''),
    funding: String(r.funding ?? ''),
    hqLocation: String(r.hq_location ?? ''),
    linkedin: String(r.linkedin ?? ''),
    twitter: String(r.twitter ?? ''),
    facebook: String(r.facebook ?? ''),
    faqs: parseJson(r.faqs) as FaqItem[],
    listingType: String(r.listing_type_name ?? ''),
    listingTypeSlug: String(r.listing_type_slug ?? ''),
    plan: String(r.plan_slug ?? r.plan ?? ''),
    planName: String(r.plan_name ?? ''),
    status: (r.status as RealSubmission['status']) || 'pending',
    submittedAt: String(r.created_at ?? ''),
    approvedAt: String(r.approved_at ?? ''),
    /* ── Listings V3 ── */
    headerTags: parseJson(r.header_tags) as string[],
    pros: parseJson(r.pros) as string[],
    cons: parseJson(r.cons) as string[],
    industriesServed: parseJson(r.industries_served) as string[],
    useCases: parseJson(r.use_cases) as string[],
    targetCompanySizes: parseJson(r.target_company_sizes) as string[],
    keyFeatures: parseJson(r.key_features) as KeyFeature[],
    startingPrice: r.starting_price != null ? String(r.starting_price) : '',
    startingPricePeriod: String(r.starting_price_period ?? ''),
    hasFreeTrial: Boolean(Number(r.has_free_trial ?? 0)),
    hasFreeVersion: Boolean(Number(r.has_free_version ?? 0)),
    supportChannels: parseJson(r.support_channels) as string[],
    trainingOptions: parseJson(r.training_options) as string[],
    languages: parseJson(r.languages) as string[],
    hasIosApp: Boolean(Number(r.has_ios_app ?? 0)),
    hasAndroidApp: Boolean(Number(r.has_android_app ?? 0)),
    compliance: parseJson(r.compliance) as string[],
    awards: parseJson(r.awards) as Award[],
    verified: Boolean(Number(r.verified ?? 0)),
    verifiedAt: String(r.verified_at ?? ''),
    listingMode: (r.listing_mode === 'company' ? 'company' : 'product'),
    isHiring: Boolean(Number(r.is_hiring ?? 0)),
    parentCompanyId: r.parent_company_id != null ? String(r.parent_company_id) : '',
    /* ── Company-mode Clutch-style fields ── */
    minProjectSize: String(r.min_project_size ?? ''),
    hourlyRate: String(r.hourly_rate ?? ''),
    commonProjectSize: String(r.common_project_size ?? ''),
    introVideoUrl: String(r.intro_video_url ?? ''),
    timezones: parseJson(r.timezones) as string[],
    serviceLines: (parseJson(r.service_lines) as unknown[])
      .map(it => {
        if (!it || typeof it !== 'object') return { name: '', percentage: 0 }
        const o = it as Record<string, unknown>
        return { name: String(o.name ?? ''), percentage: Number(o.percentage ?? 0) }
      })
      .filter(s => s.name) as ServiceShare[],
    focusBreakdown: (parseJson(r.focus_breakdown) as unknown[])
      .map(it => {
        if (!it || typeof it !== 'object') return { name: '', percentage: 0 }
        const o = it as Record<string, unknown>
        return { name: String(o.name ?? ''), percentage: Number(o.percentage ?? 0) }
      })
      .filter(s => s.name) as ServiceShare[],
    clientLogos: (parseJson(r.client_logos) as unknown[])
      .map(it => {
        if (!it || typeof it !== 'object') return { name: '' }
        const o = it as Record<string, unknown>
        return {
          name: String(o.name ?? ''),
          logoUrl: typeof o.logoUrl === 'string' ? o.logoUrl : undefined,
          url: typeof o.url === 'string' ? o.url : undefined,
        }
      })
      .filter(c => c.name) as ClientLogo[],
    clientsSummary: String(r.clients_summary ?? ''),
    reviewCount: Number(r.review_count ?? 0),
    reviewAvg: r.review_avg != null ? Number(r.review_avg) : 0,
    latestReviewTitle: String(r.latest_review_title ?? ''),
    latestReviewAuthor: String(r.latest_review_author ?? ''),
    tagSlugs: typeof r.tag_slugs === 'string' && r.tag_slugs
      ? r.tag_slugs.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [],
  }
}

export async function fetchAllSubmissions(): Promise<RealSubmission[]> {
  try {
    const res = await fetch(`${API}/submissions`)
    if (!res.ok) return []
    const rows: Record<string, unknown>[] = await res.json()
    return rows.map(mapRow)
  } catch { return [] }
}

export async function fetchSubmissionStats() {
  const subs = await fetchAllSubmissions()
  return {
    total: subs.length,
    pending: subs.filter(s => s.status === 'pending').length,
    confirmed: subs.filter(s => s.status === 'confirmed').length,
    paid: subs.filter(s => s.status === 'paid').length,
    active: subs.filter(s => s.status === 'active').length,
  }
}

export async function updateSubmissionStatus(id: string, status: string) {
  await fetch(`${API}/submissions/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).catch(() => {})
}

export async function deleteSubmission(id: string) {
  await fetch(`${API}/submissions/${id}`, {
    method: 'DELETE',
  }).catch(() => {})
}

export async function addSubmission(data: Record<string, unknown>) {
  const res = await fetch(`${API}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

/** Owner-only full update. `idOrUuid` is normally the uuid. */
export async function updateSubmission(
  idOrUuid: string,
  data: Record<string, unknown>,
) {
  const res = await fetch(`${API}/submissions/${encodeURIComponent(idOrUuid)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function uploadFile(file: File, type: 'logo' | 'screenshot'): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  form.append('type', type)
  const res = await fetch(`${API}/upload`, { method: 'POST', body: form })
  const data = await res.json()
  if (data.url) return data.url
  throw new Error(data.error || 'Upload failed')
}

export async function fetchListingBySlug(slug: string) {
  try {
    const res = await fetch(`${API}/listings/${encodeURIComponent(slug)}`)
    if (!res.ok) return null
    const data = await res.json()
    if (data.error) return null
    return {
      listing: mapRow(data.listing),
      breadcrumb: data.breadcrumb as { name: string; slug: string }[],
      related: (data.related || []).map((r: Record<string, unknown>) => mapRow(r)),
    }
  } catch { return null }
}

export async function fetchCategoryListings(categoryId: string, page = 1) {
  try {
    const res = await fetch(`${API}/categories/${categoryId}/listings?page=${page}`)
    if (!res.ok) return { data: [] as RealSubmission[], total: 0, page: 1 }
    const json = await res.json()
    return {
      data: (json.data || []).map((r: Record<string, unknown>) => mapRow(r)),
      total: json.total || 0,
      page: json.page || 1,
    }
  } catch { return { data: [] as RealSubmission[], total: 0, page: 1 } }
}
