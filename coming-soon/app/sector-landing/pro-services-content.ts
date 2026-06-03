/**
 * Professional Services directory — shared SEO/AEO content.
 *
 * SINGLE SOURCE OF TRUTH for the /professional-services landing page's
 * directory-specific content. Both the visible block
 * (ProServicesDirectorySeo.tsx) AND the JSON-LD graph
 * (buildSectorJsonLd in app/[...segments]/page.tsx) import from here, so
 * the on-page FAQ + category list can never drift out of sync with the
 * FAQPage / ItemList schema (Google flags schema that isn't reflected in
 * visible content).
 *
 * Scoped to this one sector by design — nothing else imports this file.
 * If the Professional Services L2 taxonomy changes, refresh
 * PRO_SERVICES_VERTICALS from app/config/categories-data.ts
 * (sector_slug === 'professional-services' && level === 2).
 */

/** The 19 Level-2 fields under the Professional Services sector. name + slug
 *  map to /professional-services/<slug>. Order matches the taxonomy
 *  sort_order. */
export const PRO_SERVICES_VERTICALS: { name: string; slug: string }[] = [
  { name: 'Accounting & Tax Services', slug: 'accounting-tax-services' },
  { name: 'Architecture, Engineering & Design', slug: 'architecture-engineering-design' },
  { name: 'Business Consulting', slug: 'business-consulting-pro' },
  { name: 'Coaching & Professional Development', slug: 'coaching-professional-development' },
  { name: 'Corporate Event Planning & Production', slug: 'corporate-event-planning-production' },
  { name: 'Corporate Training & Learning', slug: 'corporate-training-learning' },
  { name: 'Financial Advisory & Planning', slug: 'financial-advisory-planning' },
  { name: 'HR, Staffing & Recruiting', slug: 'hr-staffing-recruiting' },
  { name: 'Insurance Professional Services', slug: 'insurance-professional-services' },
  { name: 'Investigative & Forensic Services', slug: 'investigative-forensic-services' },
  { name: 'Investment Banking & Capital Markets', slug: 'investment-banking-capital-markets' },
  { name: 'Legal Services', slug: 'legal-services-pro' },
  { name: 'Marketing, Advertising & Communications', slug: 'marketing-advertising-communications' },
  { name: 'Real Estate Professional Services', slug: 'real-estate-professional-services' },
  { name: 'Risk, Compliance & Audit', slug: 'risk-compliance-audit' },
  { name: 'Sustainability, ESG & Environmental Consulting', slug: 'sustainability-esg-environmental-consulting' },
  { name: 'Technology Advisory Services', slug: 'technology-advisory-services' },
  { name: 'Translation & Language Services', slug: 'translation-language-services' },
  { name: 'Writing, Editing & Research Services', slug: 'writing-editing-research-services' },
]

/** Answer-first FAQ. Each answer leads with a direct answer in the first
 *  sentence (featured-snippet + LLM-citation best practice) and naturally
 *  reinforces the "professional services directory" target phrase. Counts
 *  describe the taxonomy structure (19 fields, 2,400+ specialties — both
 *  real, from app/config/categories-data.ts), never an inflated firm count. */
export const PRO_SERVICES_FAQ: { q: string; a: string }[] = [
  {
    q: 'What is the InfoWebWorld professional services directory?',
    a: "InfoWebWorld's professional services directory is a free, curated platform for finding and comparing verified professional service firms across 19 fields - including accounting & tax, legal, business consulting, financial advisory, HR & recruiting, and marketing. Every firm is human-verified, every review is identity-checked, and rankings are merit-based, never pay-to-play.",
  },
  {
    q: 'Which professional services are listed in the directory?',
    a: 'The directory spans 19 professional service fields and more than 2,400 specialties: accounting & tax, legal services, business consulting, financial advisory & planning, HR/staffing & recruiting, marketing/advertising & communications, architecture/engineering & design, technology advisory, risk/compliance & audit, investment banking, insurance, investigative & forensic, translation, corporate training, coaching, ESG & sustainability consulting, real estate services, and writing/editing & research.',
  },
  {
    q: 'Is the professional services directory free to use?',
    a: 'Yes. Searching, comparing, and contacting firms in the professional services directory is completely free for buyers. Only firms pay to be listed, and a paid plan never buys a higher ranking.',
  },
  {
    q: 'How are firms in the directory verified?',
    a: 'Every firm is human-reviewed before it goes live, and owners can complete business verification to earn a verified badge. Reviews are identity-checked, so the ratings reflect real client engagements rather than anonymous or incentivized feedback.',
  },
  {
    q: 'How is InfoWebWorld different from Clutch, Yelp, or other directories?',
    a: 'InfoWebWorld brings 19 professional service fields into one directory with verified-only listings and identity-checked reviews - no pay-to-play placement and no fake reviews. You compare firms side by side across every specialty in a single place, instead of jumping between niche directories.',
  },
  {
    q: 'How do I choose the right professional services firm?',
    a: 'Shortlist firms by specialty and location, compare their verified profiles, services, and real client reviews side by side, then contact them directly through InfoWebWorld - free, with no middleman or referral fee.',
  },
]
