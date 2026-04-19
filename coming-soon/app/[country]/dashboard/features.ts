import { STARTER_ROWS, FREE_ROWS } from '../business/components/planGating'
import type { PlanTier } from '@/lib/user-plan-types'
import { canAccess } from '@/lib/user-plan-types'

/**
 * The dashboard feature catalog mirrors the /plans full comparison table,
 * grouped into 7 sections. A row's required tier is derived from the
 * plan-gating sets: in FREE_ROWS = free, in STARTER_ROWS = starter, else
 * yearly (Lifetime and Yearly unlock the same features at feature level).
 */

export interface FeatureSection {
  key: string
  title: string
  iconKey: string
  /** Light accent hue that colors the section's unlocked feature dots + progress bar. */
  color: string
  blurb: string
}

export interface Feature {
  slug: string
  label: string
  sectionKey: string
  requiredTier: PlanTier
}

export const SECTIONS: FeatureSection[] = [
  { key: 'listing',   title: 'Business Listing',       iconKey: 'building',      color: '#3B82F6', blurb: 'Profile details, media, links, and on-page content.' },
  { key: 'discovery', title: 'Discovery & Visibility', iconKey: 'search',        color: '#8B5CF6', blurb: 'Ranking, placement, SEO, and AI citations.' },
  { key: 'leads',     title: 'Lead Management',        iconKey: 'messageCircle', color: '#14B8A6', blurb: 'Inbound leads, RFQs, and buyer activity.' },
  { key: 'reviews',   title: 'Reviews & Reputation',   iconKey: 'star',          color: '#F59E0B', blurb: 'Verified reviews, badges, and marketing assets.' },
  { key: 'community', title: 'Community',              iconKey: 'users',         color: '#E8553D', blurb: 'Followers, bookmarks, Q&A, engagement.' },
  { key: 'analytics', title: 'Analytics & Insights',   iconKey: 'barChart',      color: '#EC4899', blurb: 'Traffic, conversion, and competitor data.' },
  { key: 'support',   title: 'Support & Admin',        iconKey: 'helpCircle',    color: '#6366F1', blurb: 'Help centre, team access, bug priority.' },
]

/**
 * The source-of-truth rows per section — identical strings to
 * app/[country]/plans/PlansPage.tsx so gating stays in sync. If you add a
 * row in one place, add it in the other.
 */
const ROWS_BY_SECTION: Record<string, string[]> = {
  listing: [
    'Business Information Profile & Listing',
    'human curation for business listing',
    'Detailed Business Information: Logo, Description, Founding Year, etc',
    'Profile Page Customisation (Colours, Layout)',
    'Product / Service / Tool Name Title & Tagline',
    'Product / Service / Tool Description',
    'Product Links (Website, App Store, Play Store)',
    'Pricing Info / Plans display',
    'Photo / Media Gallery',
    'Video Embed (YouTube, Vimeo, Loom)',
    'Multiple Product / Tool Launches - Releases Section',
    'Custom / Vanity URL on Directory Pages',
    'Use Cases / Case Studies',
    'Pros & Cons / SWOT - Display',
    'Quick-Action CTA Buttons (RFQ, Demo, Visit Website, Review, Testimonial, Message, Call)',
    'Social Media Links (X, Facebook, LinkedIn, Instagram, Reddit)',
    'Team & Founder Profiles / Bios',
    'Alternatives Comparison Section - Select upto 3',
    'Target Keywords & Keyword Tags',
    'Multi Category listing',
    'Listing by Location - Global and Local / Country and City/Area',
    'Promote Seasonal & Special offers',
    'Business Dashboard - Manage everything at one place',
    'API Access for Listing Management',
    'Multilingual Listing Support',
    'FAQ Section on Listing Page',
    'Integration / Tech Stack Display',
  ],
  discovery: [
    'Listing Indexed faster',
    'Category Listings — Prime Placement',
    'Featured Ranking / Top Spots in Category Pages',
    'Search Result Priority / Above Non-Verified Providers',
    'Homepage Visibility (Just Landed / Featured Section)',
    'Featured in Side-by-Side Comparisons',
    'Alternatives Comparison Section',
    'Enhanced Search Engine Visibility (SEO Optimised Profile)',
    'Schema Markup (Structured Data) on Business Profiles',
    'Promotional Tools for Your InfoWebWorld Listing',
    'Premium Placement on Directory Pages',
    'Permanent DoFollow Backlink to Your Website - Google SEO Juice',
    'GEO & AEO Citation (AI Engine Optimisation)',
    'Listing by Location - Global and Local',
    'Local Business Listings — NAP (Name, Address, Phone)',
    'News Spotlight Article',
    'Newsletter Mentions & Feature Inclusion',
    'Social Proof — Listing Shared on iWW Social Channels',
  ],
  leads: [
    'Performance overview (Leads Dashboard)',
    'Ai Lead Insights',
    'Respond to visitor messages',
    'Manage RFQ, Demo, Visit Website, Review, Testimonial, Message, Call',
    'Competitor Ads/ listings Removed from Your Profile',
    'Third-Party Ads Removed from Your Profile',
    'View Visitor / Active Buyer Profiles',
    'View users comparing competition alternatives',
    'Lead Notification Alerts (Email & In-App)',
  ],
  reviews: [
    'Collect Verified Reviews — Build Brand Confidence',
    'Photo & Video Reviews from Users',
    'AI-Powered Review Summary & Sentiment Analysis',
    'Respond to Reviews (Owner Replies)',
    'AI-Assisted Reply Drafts for Reviews',
    'Flag Suspicious / Fake Reviews',
    'InfoWebWorld Verified Badge',
    'Marketing Assets (Badges, Banners, Email Signatures)',
    'Embeddable Review Widgets for Your Website',
    'Review Invitation Tool (Email / Link to Request Reviews)',
    'Featured in AI-powered recommendation infoWebWorld engine',
    'Auto-Generated Pros & Cons on Listing Page',
    'Social Sharing Assets (Share Reviews on Social Media)',
    'Product of the Day / Week / Month Badge',
    'Leaderboard Badges (Top Rated, Most Visited, Most Bookmarked)',
  ],
  community: [
    'Follower system',
    'Community Bookmark Collections',
    'Upvotes / Likes on Listings',
    'User Comments on Listing Pages',
    'Q&A Section',
    'Badges & Awards for users',
    'User-Generated Content (Tips, Tutorials, Guides)',
  ],
  analytics: [
    'Real-Time Analytics Dashboard',
    'AI-Powered Analytics Summary & Recommendations',
    'Traffic Analytics (Page Views, Unique Visitors)',
    'Visitor Source Tracking (Organic, Social, Direct, Referral)',
    'Historical Data Retention — Up to 365 Days',
    'Competitor Benchmarking & Analysis',
    'KPI Metrics Dashboard (Leads, Views, Reviews, CTR)',
    'Search Engagement Reports (Impressions, Click-Through)',
    'View Profiles of Users Who Bookmarked Your Listing',
    'Monthly Analytics Report (Email PDF)',
    'Conversion Tracking (CTA Clicks, RFQ Submissions)',
    'Heatmap / Engagement Map on Profile Page',
  ],
  support: [
    'Email Support & Help Centre Access',
    'AI Chatbot Support (24/7)',
    'Dedicated Account Contact',
    'Expert Onboarding & Strategic Profile Setup',
    'Team User Logins (Multi-User Access)',
    'Additional Business Listings - Separate Domains (Paid Add-On)',
    'Priority Bug Fixes & Feature Requests',
  ],
}

function labelToSlug(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

function rowRequiredTier(label: string): PlanTier {
  if (FREE_ROWS.has(label)) return 'free'
  if (STARTER_ROWS.has(label)) return 'starter'
  return 'yearly'
}

/** Flat catalog of all features, with stable slugs. */
export const FEATURES: Feature[] = (() => {
  const seen = new Map<string, number>()
  const out: Feature[] = []
  for (const sec of SECTIONS) {
    for (const label of ROWS_BY_SECTION[sec.key] || []) {
      let slug = labelToSlug(label)
      // Disambiguate collisions across sections (e.g. "Alternatives Comparison Section" lives in two places).
      const n = seen.get(slug) || 0
      seen.set(slug, n + 1)
      if (n > 0) slug = `${slug}-${n + 1}`
      out.push({ slug, label, sectionKey: sec.key, requiredTier: rowRequiredTier(label) })
    }
  }
  return out
})()

const FEATURE_BY_SLUG = new Map(FEATURES.map(f => [f.slug, f]))
export function findFeature(slug: string): Feature | undefined {
  return FEATURE_BY_SLUG.get(slug)
}

export function featuresInSection(sectionKey: string): Feature[] {
  return FEATURES.filter(f => f.sectionKey === sectionKey)
}

/** Per-section unlocked count for a user tier — used in the sidebar + overview. */
export function unlockedBySection(tier: PlanTier): Record<string, { unlocked: number; total: number }> {
  const out: Record<string, { unlocked: number; total: number }> = {}
  for (const sec of SECTIONS) {
    const rows = featuresInSection(sec.key)
    const unlocked = rows.filter(r => canAccess(tier, r.requiredTier)).length
    out[sec.key] = { unlocked, total: rows.length }
  }
  return out
}

/** Global totals for headline stats ("You have unlocked X of Y features"). */
export function unlockedTotals(tier: PlanTier): { unlocked: number; total: number } {
  const total = FEATURES.length
  const unlocked = FEATURES.filter(f => canAccess(tier, f.requiredTier)).length
  return { unlocked, total }
}
