/**
 * Feature gating for the 4 plans.
 *
 * Lifetime + Early Adopter get ✅ on every row (no gating needed — Set lookup
 * never happens for them). These Sets only define what Starter and Free include.
 *
 * Used by /plans full comparison table AND /business Pricing preview.
 */

export const STARTER_ROWS = new Set<string>([
  /* Business Listing */
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
  'Custom / Vanity URL on Directory Pages',
  'Quick-Action CTA Buttons (RFQ, Demo, Visit Website, Review, Testimonial, Message, Call)',
  'Social Media Links (X, Facebook, LinkedIn, Instagram, Reddit)',
  'Target Keywords & Keyword Tags',
  'Multi Category listing',
  'Listing by Location - Global and Local / Country and City/Area',
  'Business Dashboard - Manage everything at one place',
  'FAQ Section on Listing Page',
  /* Discovery & Visibility */
  'Enhanced Search Engine Visibility (SEO Optimised Profile)',
  'Schema Markup (Structured Data) on Business Profiles',
  'Permanent DoFollow Backlink to Your Website - Google SEO Juice',
  'Listing by Location - Global and Local',
  'Local Business Listings — NAP (Name, Address, Phone)',
  /* Reviews */
  'Collect Verified Reviews — Build Brand Confidence',
  'Photo & Video Reviews from Users',
  'Flag Suspicious / Fake Reviews',
  'InfoWebWorld Verified Badge',
  /* Community */
  'Follower system',
  'Community Bookmark Collections',
  'Upvotes / Likes on Listings',
  'User Comments on Listing Pages',
  'Q&A Section',
  /* Analytics */
  'Traffic Analytics (Page Views, Unique Visitors)',
  /* Support */
  'Email Support & Help Centre Access',
  'AI Chatbot Support (24/7)',
])

export const FREE_ROWS = new Set<string>([
  /* Business Listing — basics only */
  'Business Information Profile & Listing',
  'Detailed Business Information: Logo, Description, Founding Year, etc',
  'Product / Service / Tool Name Title & Tagline',
  'Product / Service / Tool Description',
  'Product Links (Website, App Store, Play Store)',
  'Social Media Links (X, Facebook, LinkedIn, Instagram, Reddit)',
  'Listing by Location - Global and Local / Country and City/Area',
  /* Discovery */
  'Listing by Location - Global and Local',
  /* Community */
  'Community Bookmark Collections',
  'Upvotes / Likes on Listings',
  /* Support */
  'Email Support & Help Centre Access',
  'AI Chatbot Support (24/7)',
])
