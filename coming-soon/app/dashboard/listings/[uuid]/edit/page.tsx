import { notFound } from 'next/navigation'
import { State } from 'country-state-city'
import { queryOne, query } from '@/lib/db'
import { requireDashboardUser } from '@/lib/user-auth'
import EditListingClient from './EditListingClient'
import type {
  PlanKey, FormState, IntegrationItem, KeyFeature, Award, FaqItem, PricingTier,
  ServiceShare, ClientLogo,
} from '../../../new/form/types'

export const dynamic = 'force-dynamic'

const VALID_PLANS: PlanKey[] = ['free', 'starter', 'yearly', 'lifetime']

interface ListingRow {
  id: number
  uuid: string
  user_id: number | null
  slug: string
  company_name: string
  contact_name: string
  email: string
  phone: string | null
  phone_code: string | null
  website: string | null
  category_id: number | null
  listing_type_id: number | null
  country_id: number | null
  city: string | null
  state: string | null
  tagline: string
  description: string | null
  founded_year: number | null
  team_size: string | null
  plan_id: number | null
  logo_url: string | null
  screenshots: string | null
  demo_video: string | null
  features: string | null
  integrations: string | null
  pricing_model: string | null
  pricing_tiers: string | null
  funding: string | null
  hq_location: string | null
  linkedin: string | null
  twitter: string | null
  facebook: string | null
  faqs: string | null
  header_tags: string | null
  pros: string | null
  cons: string | null
  industries_served: string | null
  use_cases: string | null
  target_company_sizes: string | null
  key_features: string | null
  starting_price: number | string | null
  starting_price_period: string | null
  has_free_trial: number
  has_free_version: number
  support_channels: string | null
  training_options: string | null
  languages: string | null
  has_ios_app: number
  has_android_app: number
  compliance: string | null
  awards: string | null
  country_name: string | null
  country_code: string | null
  plan_slug: string | null
  listing_mode: 'product' | 'company' | null
  /* ── Company-mode Clutch-style fields (S37). Tolerated when missing
     (pre-migration); the row simply comes back without them and the
     parser treats them as null/empty. ── */
  min_project_size: string | null
  hourly_rate: string | null
  common_project_size: string | null
  intro_video_url: string | null
  timezones: string | null
  service_lines: string | null
  focus_breakdown: string | null
  client_logos: string | null
  clients_summary: string | null
}

function parseJsonArr<T = unknown>(val: unknown): T[] {
  if (!val) return []
  if (typeof val === 'string') { try { return JSON.parse(val) as T[] } catch { return [] } }
  if (Array.isArray(val)) return val as T[]
  return []
}

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params
  const user = await requireDashboardUser()

  const row = await queryOne<ListingRow>(
    `SELECT s.*, co.name AS country_name, co.code AS country_code, p.slug AS plan_slug
     FROM submissions s
     LEFT JOIN countries co ON co.id = s.country_id
     LEFT JOIN plans p ON p.id = s.plan_id
     WHERE s.uuid = ? AND s.user_id = ?
     LIMIT 1`,
    [uuid, user.id]
  )
  if (!row) notFound()

  /* Walk parent chain to recover the L1/L2/L3 picker selection. */
  let l1Id = '', l2Id = '', l3Id = ''
  if (row.category_id) {
    type CatRow = { id: number; parent_id: number | null }
    const chain: CatRow[] = []
    let cur: number | null = row.category_id
    while (cur) {
      const cat: CatRow | null = await queryOne<CatRow>(
        'SELECT id, parent_id FROM categories WHERE id = ?',
        [cur]
      )
      if (!cat) break
      chain.unshift(cat)
      cur = cat.parent_id
    }
    if (chain[0]) l1Id = String(chain[0].id)
    if (chain[1]) l2Id = String(chain[1].id)
    if (chain[2]) l3Id = String(chain[2].id)
  }

  const tagRows = await query<{ tag_id: number }>(
    'SELECT tag_id FROM submission_tags WHERE submission_id = ?',
    [row.id]
  )
  const tagIds = tagRows.map(r => String(r.tag_id))

  const countryIso = row.country_code || ''
  let stateCode = ''
  if (countryIso && row.state) {
    const states = State.getStatesOfCountry(countryIso)
    const match = states.find(s => s.name === row.state)
    stateCode = match?.isoCode || ''
  }

  /* Tolerate legacy string[] integrations (pre-S35 rows). */
  const rawIntegrations = parseJsonArr(row.integrations)
  const integrations: IntegrationItem[] = rawIntegrations
    .map(it => {
      if (typeof it === 'string') return { name: it, website: '', description: '' }
      if (it && typeof it === 'object') {
        const o = it as Record<string, unknown>
        return {
          name: String(o.name ?? ''),
          website: typeof o.website === 'string' ? o.website : '',
          description: typeof o.description === 'string' ? o.description : '',
        }
      }
      return { name: '', website: '', description: '' }
    })
    .filter(i => i.name)

  const initialFormState: Partial<FormState> = {
    /* Critical: thread listing_mode through so the form picks the right
       steps array (4-step company vs 7-step product) and renders the
       Company* step components instead of falling back to product. */
    listingMode: row.listing_mode === 'company' ? 'company' : 'product',
    companyName: row.company_name || '',
    tagline: row.tagline || '',
    website: row.website || '',
    logoUrl: row.logo_url || '',
    headerTags: parseJsonArr<string>(row.header_tags),
    description: row.description || '',
    l1Id, l2Id, l3Id,
    listingTypeIds: row.listing_type_id ? [String(row.listing_type_id)] : [],
    tagIds,
    contactName: row.contact_name || '',
    email: row.email || '',
    phoneIso: countryIso,
    phoneCode: row.phone_code || '+1',
    phone: row.phone || '',
    countryCode: countryIso,
    country: row.country_name || '',
    stateCode,
    state: row.state || '',
    city: row.city || '',
    hqLocation: row.hq_location || '',
    screenshots: parseJsonArr<string>(row.screenshots),
    demoVideo: row.demo_video || '',
    founded: row.founded_year ? String(row.founded_year) : '',
    employees: row.team_size || '',
    funding: row.funding || '',
    linkedin: row.linkedin || '',
    twitter: row.twitter || '',
    facebook: row.facebook || '',
    hasIosApp: Boolean(Number(row.has_ios_app)),
    hasAndroidApp: Boolean(Number(row.has_android_app)),
    compliance: parseJsonArr<string>(row.compliance),
    awards: parseJsonArr<Award>(row.awards),
    languages: parseJsonArr<string>(row.languages),
    industriesServed: parseJsonArr<string>(row.industries_served),
    useCases: parseJsonArr<string>(row.use_cases),
    targetCompanySizes: parseJsonArr<string>(row.target_company_sizes),
    supportChannels: parseJsonArr<string>(row.support_channels),
    trainingOptions: parseJsonArr<string>(row.training_options),
    features: parseJsonArr<string>(row.features),
    keyFeatures: parseJsonArr<KeyFeature>(row.key_features),
    integrations,
    startingPrice: row.starting_price != null ? String(row.starting_price) : '',
    startingPricePeriod: row.starting_price_period || '/ month',
    hasFreeTrial: Boolean(Number(row.has_free_trial)),
    hasFreeVersion: Boolean(Number(row.has_free_version)),
    pricingModel: row.pricing_model || '',
    pricingTiers: parseJsonArr<PricingTier>(row.pricing_tiers),
    pros: parseJsonArr<string>(row.pros),
    cons: parseJsonArr<string>(row.cons),
    faqs: parseJsonArr<FaqItem>(row.faqs),
    /* ── Company-mode Clutch fields ── */
    minProjectSize:    row.min_project_size || '',
    hourlyRate:        row.hourly_rate || '',
    commonProjectSize: row.common_project_size || '',
    introVideoUrl:     row.intro_video_url || '',
    timezones:         parseJsonArr<string>(row.timezones),
    serviceLines:      parseJsonArr<ServiceShare>(row.service_lines),
    focusBreakdown:    parseJsonArr<ServiceShare>(row.focus_breakdown),
    clientLogos:       parseJsonArr<ClientLogo>(row.client_logos),
    clientsSummary:    row.clients_summary || '',
  }

  const planSlug: PlanKey =
    row.plan_slug && VALID_PLANS.includes(row.plan_slug as PlanKey)
      ? (row.plan_slug as PlanKey)
      : 'free'

  return (
    <EditListingClient
      submissionUuid={row.uuid}
      slug={row.slug}
      companyName={row.company_name}
      plan={planSlug}
      listingMode={row.listing_mode === 'company' ? 'company' : 'product'}
      initialFormState={initialFormState}
    />
  )
}
