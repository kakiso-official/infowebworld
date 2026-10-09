import type { LinkedCopy, TextLink } from '../components/linked-text'
import type { SectorSlug } from '../components/sector-links'
import { sectorLandingPath } from '@/lib/sector-paths'

/* ═══════════════════════════════════════════════════════════════════════
   /about copy - one source for the visible page AND its JSON-LD (FAQPage,
   differentiator ItemList).

   From the SEO specialist's brief (Oct 2026). Sector links use the current
   directory URLs (lib/sector-paths.ts) instead of the brief's old
   redirecting ones. The brief's founder/leadership block is not built
   yet: it needs real names, roles, photos and LinkedIn links.
   ═══════════════════════════════════════════════════════════════════════ */

export type LeadItem = { title: string; text: string; links?: TextLink[] }
export type FaqItem = { q: string; a: string; links?: TextLink[] }

export const ABOUT_TITLE = 'About InfoWebWorld'
export const ABOUT_TAGLINE = 'The Online Business Directory for Verified Business Discovery Globally'
export const ABOUT_TRUST = ['80+ Industries', 'Human-reviewed listings', 'Search by country and city']

export const WHAT_IS: LinkedCopy[] = [
  {
    text: 'InfoWebWorld is a global business directory that connects buyers with real businesses. Every company profile shows a category, location, website, ratings and reviews, so you can shortlist quickly and contact the business directly.',
  },
  {
    text: 'The directory covers 80+ industries across six main categories, from software and SaaS and AI tools to local businesses and professional services. Searching is free, and any business can start with a free business listing.',
    links: [
      { text: 'software and SaaS', href: sectorLandingPath('software-saas') },
      { text: 'AI tools', href: sectorLandingPath('ai-ml') },
      { text: 'local businesses', href: sectorLandingPath('local-businesses') },
      { text: 'professional services', href: sectorLandingPath('professional-services') },
      { text: 'free business listing', href: '/business/plans' },
    ],
  },
]

export const MISSION: string[] = [
  'Finding a trustworthy supplier online is slow. Business information is scattered, listings go stale, and pay-to-play rankings reward the biggest budget instead of the best fit.',
  'InfoWebWorld exists to fix that. We rank on merit and reviews, check every listing before it goes live, and keep reviews tied to real buyers. Our goal is simple: help real buyers find real businesses faster, and help good businesses be found without paying for every click.',
]

export const HOW_IT_WORKS: LeadItem[] = [
  {
    title: 'For Buyers: Search, Compare and Review Companies',
    text: 'Search by category, country, and city, then narrow your shortlist. Use Compare Products to weigh software and tools, or Compare Companies to weigh agencies and service providers. After you buy, write a review to help the next buyer decide.',
    links: [
      { text: 'Compare Products', href: '/compare' },
      { text: 'Compare Companies', href: '/compare-companies' },
      { text: 'write a review', href: '/write-review' },
    ],
  },
  {
    title: 'For Businesses: Create a Free Business Listing',
    text: 'Choose the Free plan, add your business name, category, location, website, and description, and submit. Our team reviews each listing before it is published. Want more? Paid plans add verified reviews, a permanent dofollow backlink, analytics, and lead tools. See why list your business on InfoWebWorld, or manage your profile in the business dashboard.',
    links: [
      { text: 'Paid plans', href: '/business/plans' },
      { text: 'why list your business', href: '/business' },
      { text: 'business dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'For Agencies and Partners',
    text: 'Managing five or more client listings? The Agency Partner Program lets you handle client profiles from one dashboard with bulk upload and white-label reports. Prefer to refer businesses? Join the affiliate program.',
    links: [
      { text: 'Agency Partner Program', href: '/agencies' },
      { text: 'affiliate program', href: '/affiliates' },
    ],
  },
]

export const DIFFERENTIATORS: LeadItem[] = [
  { title: 'Verified, human-reviewed listings:', text: 'Our team checks each submission and rejects spam.' },
  { title: 'Real buyer reviews:', text: 'Ratings come from real buyers and pass anti-fake screening. Businesses cannot pay to remove a review.' },
  { title: 'Ranking on merit:', text: 'We do not sell ranking by the click or by the day. Research and rankings stay independent.' },
  { title: 'Visibility in search and AI answers:', text: 'Profiles use structured data so your business can be found in Google and in AI assistants such as ChatGPT and Perplexity. Paid listings include a permanent dofollow backlink.' },
  { title: 'Comparison built in:', text: 'Compare products and companies side by side before you decide.' },
  { title: 'Free to start:', text: 'Searching is free, and the Free plan requires no credit card.' },
]

export const CATEGORY_INTRO: LinkedCopy = {
  text: 'Every category page lists companies with ratings, reviews, and contact details. See all categories.',
  links: [{ text: 'See all categories', href: '/categories' }],
}

/* H3 per sector, in the brief's order. */
export const DIRECTORY_NAMES: Record<SectorSlug, string> = {
  'software-saas': 'Software & SaaS Directory',
  'ai-ml': 'AI & ML Tools Directory',
  'it-services-agencies': 'IT Services & Agencies Directory',
  'startups-innovation': 'Startups & Innovation Directory',
  'local-businesses': 'Local Business Directory',
  'professional-services': 'Professional Services Directory',
}

/* One line under each directory name - the same sector descriptions the
   homepage uses (app/page.tsx). */
export const DIRECTORY_DESCS: Record<SectorSlug, string> = {
  'software-saas': 'CRM, marketing, analytics, security, and project software.',
  'ai-ml': 'Verified AI tools, agents, models, copilots, and frameworks.',
  'it-services-agencies': 'Web, mobile, software, design, and marketing agencies.',
  'startups-innovation': 'Breakthrough companies in FinTech, HealthTech, ClimateTech, AI & Web3.',
  'local-businesses': 'Restaurants, home services, health, automotive, beauty, retail.',
  'professional-services': 'Accountants, attorneys, advisors, consultants, recruiters.',
}

export const VERIFY_STEPS: LeadItem[] = [
  { title: 'Submission check.', text: 'A person on our team reviews every new listing. Spam and duplicates are rejected, and we email the reason.' },
  { title: 'Profile completeness.', text: 'Listings need a real business name, category, location, and website.' },
  { title: 'Review screening.', text: 'Reviews pass anti-fake detection before they count toward a rating.' },
  {
    title: 'Clear rules.',
    text: 'Reviews are removed only if they break our content guidelines, for example, fake, paid, defamatory, or off-topic reviews.',
    links: [{ text: 'content guidelines', href: '/content-guidelines' }],
  },
  {
    title: 'Fresh data.',
    text: 'Listing data is regularly refreshed, and owners can edit their profile any time from the dashboard.',
    links: [{ text: 'dashboard', href: '/dashboard' }],
  },
]

export const VERIFY_FOOTNOTE: LinkedCopy = {
  text: 'Spotted something wrong? Contact Help & Support.',
  links: [{ text: 'Help & Support', href: '/help' }],
}

export const STORY: LinkedCopy = {
  text: 'InfoWebWorld launched in 2004 and is built by Brain Stream Australia Pty Ltd, a web, app and SEO company based in Parramatta, NSW. Years of building websites and growing search visibility for businesses showed us the same problem again and again: good businesses are hard to find, and buyers cannot tell whom to trust. InfoWebWorld is our answer: a directory that puts verified information and honest reviews first.',
  links: [{ text: 'Brain Stream Australia Pty Ltd', href: 'https://www.brainstream.com.au/' }],
}

export const AUDIENCES: LeadItem[] = [
  { title: 'Buyers and procurement teams', text: 'comparing software, AI tools, and suppliers.' },
  { title: 'Small and mid-size businesses', text: 'that want a free business listing and real reviews.' },
  { title: 'Startups', text: 'looking for early visibility and backlinks.' },
  {
    title: 'SEO agencies and marketers',
    text: 'managing client listings through the Agency Partner Program.',
    links: [{ text: 'Agency Partner Program', href: '/agencies' }],
  },
  { title: 'Local service providers', text: 'who want to be found by customers in their city.' },
]

export const ABOUT_FAQS: FaqItem[] = [
  {
    q: 'Is InfoWebWorld free to use?',
    a: 'Yes. Searching is free, and the Free plan lets any business create a basic listing with no credit card. Optional paid plans add review tools, a dofollow backlink, analytics, and lead management. See Plans & Pricing.',
    links: [{ text: 'Plans & Pricing', href: '/business/plans' }],
  },
  {
    q: 'How does InfoWebWorld verify business listings?',
    a: 'Our team reviews every submission before it is published, rejects spam and emails the reason when a listing is declined. Listing data is regularly refreshed.',
  },
  {
    q: 'What types of businesses are listed?',
    a: 'Software and SaaS companies, AI tools, IT agencies, startups, local businesses, and professional service firms across 80+ industries. See the full category list.',
    links: [{ text: 'full category list', href: '/categories' }],
  },
  {
    q: 'How do I list my business on InfoWebWorld?',
    a: 'Open Plans & Pricing, choose the Free plan, and complete the listing form with your business details. Once approved, your profile appears in its category and country pages.',
    links: [{ text: 'Plans & Pricing', href: '/business/plans' }],
  },
  {
    q: 'How can I contact InfoWebWorld?',
    a: 'Use the contact page or visit Help & Support.',
    links: [
      { text: 'contact page', href: '/contact' },
      { text: 'Help & Support', href: '/help' },
    ],
  },
]

export const CLOSING = 'Create a free listing and let buyers in your category and country find you.'
