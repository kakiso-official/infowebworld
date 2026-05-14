/* ─────────────────────────────────────────────────────────────
   /compare — shared types + URL slug parsing.

   URL pattern: /compare/<slug>(-vs-<slug>)*  up to 4 slugs.
   The optional catch-all route in [[...slugs]]/page.tsx hands us the
   path segments and parseCompareSlugs() turns them into a clean array
   of slugs (lowercased, deduped, capped at MAX_COMPARE).

   `-vs-` is the standard separator (matches G2/GetApp/Capterra URL
   patterns and reads naturally in social shares). A slug that itself
   contains the literal token "vs" would be ambiguous on the split,
   but our `slugify(name)` rule on /api/submissions makes that almost
   impossibly rare for product names — and an invalid candidate slug
   simply drops out at the DB-lookup step, so the worst case is a
   missing column rather than a broken page.
   ───────────────────────────────────────────────────────────── */

export const MAX_COMPARE = 4
export const SLUG_SEPARATOR = '-vs-'

export type CompareCategory = {
  id: number
  name: string
  slug: string
  color: string
}

export type CompareReview = {
  id: number
  rating: number
  title: string
  body: string
  createdAt: string
  userName: string | null
  userAvatar: string | null
}

export type CompareReviewQuote = CompareReview

export type CompareCol = {
  id: number
  slug: string
  companyName: string
  logoUrl: string | null
  tagline: string | null
  description: string | null
  website: string | null
  founded: number | null
  employees: string | null
  hqLocation: string | null
  plan: string
  verified: boolean
  category: CompareCategory | null
  /** L1 sector slug (walked up from the product's category) — used to
      gate the "Add to Compare" search so users can only add products
      from the same sector. Null when the product has no category. */
  sectorSlug: string | null

  // Reviews aggregate
  ratingAvg: number          // 0 if none
  ratingCount: number
  ratingDist: number[]       // [r5, r4, r3, r2, r1]
  recentReviews: CompareReview[]
  topPros: CompareReview[]   // up to 3 reviews with rating >= 4
  topCons: CompareReview[]   // up to 3 reviews with rating <= 3
  lastReviewAt: string | null

  // Owner-supplied JSON columns (always defined, may be empty)
  headerTags: string[]
  pros: string[]
  cons: string[]
  features: string[]
  keyFeatures: { name: string; description: string }[]
  integrations: { name: string; website?: string; description?: string }[]
  pricingTiers: { name: string; price: string; period: string; features?: string[] }[]
  screenshots: string[]
  faqs: { q: string; a: string }[]
  supportChannels: string[]
  trainingOptions: string[]
  industriesServed: string[]
  useCases: string[]
  targetCompanySizes: string[]
  languages: string[]
  compliance: string[]
  awards: { name: string; year?: number }[]

  // Scalars
  startingPrice: string | null
  startingPricePeriod: string | null
  hasFreeTrial: boolean
  hasFreeVersion: boolean
  hasIosApp: boolean
  hasAndroidApp: boolean
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
    Each column gets its own list of siblings in its own category — same
    pattern GetApp/Capterra use on their comparison pages. The `_shared`
    bucket is the union list used for the right rail "Compare similar
    apps" widget. */
export type AlternativesBySlug = Record<string, CompareAlternative[]> & { _shared?: CompareAlternative[] }

/** Split URL segments into a normalized slug array. */
export function parseCompareSlugs(segments: string[] | undefined): string[] {
  if (!segments || segments.length === 0) return []
  // The catch-all may give us one or many path segments; we treat the
  // entire joined path as a single string and split on -vs-.
  const raw = segments.join('/')
  const parts = raw.split(SLUG_SEPARATOR)
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 0)

  // De-dupe while preserving order
  const seen = new Set<string>()
  const out: string[] = []
  for (const p of parts) {
    if (!seen.has(p)) {
      seen.add(p)
      out.push(p)
    }
    if (out.length >= MAX_COMPARE) break
  }
  return out
}

/** Build the canonical URL for a given set of slugs. */
export function buildCompareUrl(slugs: string[]): string {
  if (slugs.length === 0) return '/compare'
  return `/compare/${slugs.slice(0, MAX_COMPARE).join(SLUG_SEPARATOR)}`
}
