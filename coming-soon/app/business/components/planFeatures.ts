/**
 * Feature sections — word-for-word from the Growth Platform spec.
 * Single source of truth shared by:
 *   - app/business/plans/PlansPage.tsx (Full Feature Comparison table)
 *   - app/dashboard/new/checkout/CheckoutClient.tsx (per-plan included list)
 *
 * Pair with STARTER_ROWS / FREE_ROWS in ./planGating.ts to determine
 * inclusion per tier. Lifetime + Yearly include every row.
 */

export interface PlanFeatureSection {
  title: string
  rows: string[]
}

export const PLAN_FEATURE_SECTIONS: PlanFeatureSection[] = [
  {
    title: 'Business Listing Features',
    rows: [
      'Business Information Profile & Listing',
      'Human curation for business listing',
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
  },
  {
    title: 'Discovery & Visibility',
    rows: [
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
  },
  {
    title: 'Lead Management',
    rows: [
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
  },
  {
    title: 'Reviews & Reputation — Credibility & Trust',
    rows: [
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
  },
  {
    title: 'Community & Engagement',
    rows: [
      'Follower system',
      'Community Bookmark Collections',
      'Upvotes / Likes on Listings',
      'User Comments on Listing Pages',
      'Q&A Section',
      'Badges & Awards for users',
      'User-Generated Content (Tips, Tutorials, Guides)',
    ],
  },
  {
    title: 'Analytics & Insights',
    rows: [
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
  },
  {
    title: 'Support & Admin',
    rows: [
      'Email Support & Help Centre Access',
      'AI Chatbot Support (24/7)',
      'Dedicated Account Contact',
      'Expert Onboarding & Strategic Profile Setup',
      'Team User Logins (Multi-User Access)',
      'Additional Business Listings - Separate Domains (Paid Add-On)',
      'Priority Bug Fixes & Feature Requests',
    ],
  },
]

export type PaidPlanKey = 'starter' | 'yearly' | 'lifetime'

/** Returns true if the named feature row is included on the given paid plan. */
export function planIncludesRow(plan: PaidPlanKey, row: string, starterRows: Set<string>): boolean {
  if (plan === 'lifetime' || plan === 'yearly') return true
  return starterRows.has(row)
}
