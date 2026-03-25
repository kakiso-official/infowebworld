/**
 * Submissions storage — reads/writes from MySQL via api.php
 */

const API = '/api'

export type PricingTier = { name: string; price: string; period: string }
export type FaqItem = { question: string; answer: string }

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
  integrations: string[]
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
  plan: string
  planName: string
  status: 'pending' | 'confirmed' | 'paid' | 'active' | 'rejected' | 'suspended'
  submittedAt: string
  approvedAt: string
}

function parseJson(val: unknown): unknown[] {
  if (!val) return []
  if (typeof val === 'string') { try { return JSON.parse(val) } catch { return [] } }
  if (Array.isArray(val)) return val
  return []
}

function mapRow(r: Record<string, unknown>): RealSubmission {
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
    integrations: parseJson(r.integrations) as string[],
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
    plan: String(r.plan_slug ?? r.plan ?? ''),
    planName: String(r.plan_name ?? ''),
    status: (r.status as RealSubmission['status']) || 'pending',
    submittedAt: String(r.created_at ?? ''),
    approvedAt: String(r.approved_at ?? ''),
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
