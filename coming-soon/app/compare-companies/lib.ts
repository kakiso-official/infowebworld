/* ─────────────────────────────────────────────────────────────
   /compare-companies — shared types + URL helpers for COMPANY
   comparison. Deliberately ISOLATED from /compare (products) so the
   product comparison is never touched and the two URL spaces never mix:
   a company slug can only resolve here, a product slug only under /compare.

   URL: /compare-companies/<slug>(-vs-<slug>)*  up to 4 slugs.
   Same `-vs-` grammar as products for familiarity.
   ───────────────────────────────────────────────────────────── */

export const MAX_COMPARE = 4
export const SLUG_SEPARATOR = '-vs-'

export type CompareCategory = { id: number; name: string; slug: string; color: string }

export type CompareReview = {
  id: number
  rating: number
  title: string
  body: string
  createdAt: string
  userName: string | null
  userAvatar: string | null
}

export type ServiceShare = { name: string; percentage: number }
export type ClientLogo = { name: string; logoUrl?: string; url?: string }
export type AwardItem = { name: string; year?: number | null }

export type CompanyCol = {
  id: number
  slug: string
  companyName: string
  logoUrl: string | null
  tagline: string | null
  description: string | null
  website: string | null
  founded: string | null            // founded_year
  employees: string | null          // team_size band
  hqLocation: string | null
  city: string | null
  state: string | null
  country: string | null
  verified: boolean
  isHiring: boolean
  planSlug: string
  category: CompareCategory | null
  /** L1 sector slug (walked up the category tree) — gates "add to compare"
      search to the SAME sector and selects same-sector alternatives. */
  sectorSlug: string | null

  // Reviews aggregate
  ratingAvg: number                 // 0 if none
  ratingCount: number
  ratingDist: number[]              // [r5, r4, r3, r2, r1]
  recentReviews: CompareReview[]
  topPros: CompareReview[]          // up to 3 reviews rating >= 4
  topCons: CompareReview[]          // up to 3 reviews rating <= 3
  lastReviewAt: string | null

  // Owner-supplied JSON (always defined, may be empty)
  headerTags: string[]
  industriesServed: string[]
  languages: string[]
  timezones: string[]
  awards: AwardItem[]
  serviceLines: ServiceShare[]
  focusBreakdown: ServiceShare[]
  clientLogos: ClientLogo[]
  faqs: { q: string; a: string }[]

  // Scalars
  minProjectSize: string | null
  hourlyRate: string | null
  commonProjectSize: string | null
  clientsSummary: string | null
  introVideoUrl: string | null
}

export type CompareAlternative = {
  slug: string
  companyName: string
  logoUrl: string | null
  website: string | null
  tagline: string | null
  categoryName: string | null
  categorySlug: string | null
  categoryColor: string | null
  ratingAvg: number
  ratingCount: number
}

/** Alternatives keyed by the slug of the column they are alternatives FOR.
    `_shared` is the deduped union for the right-rail widget. */
export type AlternativesBySlug = Record<string, CompareAlternative[]> & { _shared?: CompareAlternative[] }

/** Split URL segments into a normalized slug array (lowercased, deduped, capped). */
export function parseCompareSlugs(segments: string[] | undefined): string[] {
  if (!segments || segments.length === 0) return []
  const raw = segments.join('/')
  const parts = raw.split(SLUG_SEPARATOR).map((s) => s.trim().toLowerCase()).filter((s) => s.length > 0)
  const seen = new Set<string>()
  const out: string[] = []
  for (const p of parts) {
    if (!seen.has(p)) { seen.add(p); out.push(p) }
    if (out.length >= MAX_COMPARE) break
  }
  return out
}

/** Build the canonical /compare-companies URL for a set of slugs. */
export function buildCompareUrl(slugs: string[]): string {
  if (slugs.length === 0) return '/compare-companies'
  return `/compare-companies/${slugs.slice(0, MAX_COMPARE).join(SLUG_SEPARATOR)}`
}
