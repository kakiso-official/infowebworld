import type { TextLink } from '../components/linked-text'
import type { SectorSlug } from '../components/sector-links'
import { sectorLandingPath } from '@/lib/sector-paths'

/* ═══════════════════════════════════════════════════════════════════════
   /write-review copy - one source for the visible sections AND the HowTo
   + FAQPage JSON-LD.

   From the SEO specialist's brief (Oct 2026). Deliberate fix: the brief's
   FAQ "Use a list for them to add the company" is garbled; it now reads
   like the same answer on /faqs ("Use Get Listed to add the company").
   ═══════════════════════════════════════════════════════════════════════ */

export type LeadItem = { title: string; text: string; links?: TextLink[] }
export type FaqItem = { q: string; a: string; links?: TextLink[] }

export const WR_TITLE = 'Write a Review: Share Your Honest, Verified Company Experience'

export const WR_INTRO =
  'Write a review on InfoWebWorld in a few minutes: search for the company, give it a rating, then write your experience or speak it, and we will turn it into a clean English review. Every review is verified, moderated, and never paid, so the next buyer can trust what they read.'

export const WR_STEPS: LeadItem[] = [
  { title: 'Search for the company.', text: 'Type the business name and open its profile.' },
  { title: 'Rate your experience.', text: 'Give an overall rating based on what actually happened.' },
  { title: 'Write or speak your review.', text: 'Describe what you bought or used, what went well, and what did not.' },
  { title: 'Submit for verification.', text: "Our screening and moderation check the review before it counts toward the company's rating." },
]

export const WR_TIPS: LeadItem[] = [
  { title: 'Say what you bought or used.', text: 'The product, service, or project, and roughly when.' },
  { title: 'Be specific.', text: '"Replied within a day and fixed the issue" beats "great service".' },
  { title: 'Cover both sides.', text: 'Mention what worked and what could be better.' },
  { title: 'Stick to your own experience.', text: 'Write about what happened to you, not rumours.' },
  { title: 'Keep it civil.', text: 'Criticise the service, not the people.' },
  { title: 'Leave out private details.', text: 'No phone numbers, home addresses or payment information.' },
]

const GUIDELINES: TextLink = { text: 'content guidelines', href: '/content-guidelines' }

export const WR_ALLOWED: LeadItem = {
  title: 'Allowed:',
  text: 'honest reviews, positive or negative, based on a real experience with the company.',
}

export const WR_REMOVED: LeadItem = {
  title: 'Removed:',
  text: 'reviews that break our content guidelines, including fake reviews, paid or incentivised reviews, defamatory content, and off-topic posts. Read the full content guidelines before you submit.',
  links: [GUIDELINES],
}

export const WR_VERIFY: LeadItem[] = [
  { title: 'Real buyers only.', text: 'Ratings come from real buyers and are not manipulated.' },
  { title: 'Anti-fake screening.', text: 'Reviews pass anti-fake detection before they count.' },
  { title: 'Never paid.', text: 'Businesses cannot pay to remove or change a review.' },
  { title: 'Clear rules.', text: 'Removal happens only when a review breaks the content guidelines.' },
  {
    title: 'Questions or concerns?',
    text: 'Contact Help & Support. Learn more about InfoWebWorld.',
    links: [
      { text: 'Help & Support', href: '/help' },
      { text: 'about InfoWebWorld', href: '/about' },
    ],
  },
]

export const WR_WHY: LeadItem[] = [
  {
    title: 'Help Other Buyers Decide',
    text: 'Real reviews help people choose software, agencies, and local services with more confidence.',
    links: [
      { text: 'agencies', href: sectorLandingPath('it-services-agencies') },
      { text: 'local services', href: sectorLandingPath('local-businesses') },
    ],
  },
  {
    title: 'Give Good Businesses Credit',
    text: 'A fair, specific review is the best thank-you a business can get. It also helps strong companies rise on merit instead of on advertising spend.',
  },
  {
    title: 'Share Your Voice',
    text: 'Your experience counts, whether it was great or disappointing. Honest feedback pushes companies to improve.',
  },
]

export const WR_ADD_COMPANY = {
  text: 'If the business is not on InfoWebWorld yet, you can list it for them. Free listings are available, and once the profile is live, you can come back and write your review. Not sure which plan? See Plans & Pricing.',
  links: [
    { text: 'list it for them', href: '/business' },
    { text: 'Plans & Pricing', href: '/business/plans' },
  ],
}

export const WR_CATEGORIES_INTRO =
  'InfoWebWorld covers 80+ industries in six categories. Pick one to find a company you have used:'

export const WR_CATEGORY_LABELS: Record<SectorSlug, string> = {
  'software-saas': 'Software & SaaS',
  'ai-ml': 'AI & ML Tools',
  'it-services-agencies': 'IT Services & Agencies',
  'startups-innovation': 'Startups & Innovation',
  'local-businesses': 'Local Businesses',
  'professional-services': 'Professional Services',
}

export const WR_OWNERS = {
  text: "Want more genuine reviews? Paid plans let you send customers a direct review link by email or SMS and show a reviews widget on your website. Reviews still go through the same verification as everyone else's. See why list your business, compare plans, or sign in to your dashboard.",
  links: [
    { text: 'why list your business', href: '/business' },
    { text: 'compare plans', href: '/business/plans' },
  ],
}

export const WR_FAQS: FaqItem[] = [
  {
    q: 'How do I write a review on InfoWebWorld?',
    a: "Search for the company, open its profile, rate your experience, then write or speak your review and submit it. Our screening and moderation check it before it counts toward the company's rating.",
  },
  {
    q: 'Can I review a company that is not listed?',
    a: 'Not until it has a profile. Use Get Listed to add the company, then write your review.',
    links: [{ text: 'Get Listed', href: '/business' }],
  },
  {
    q: 'What kind of reviews get removed?',
    a: 'Reviews that break the content guidelines, such as fake, paid, defamatory or off-topic reviews.',
    links: [GUIDELINES],
  },
  {
    q: 'Does it cost anything to write a review?',
    a: 'No. Searching and writing reviews on InfoWebWorld is free.',
  },
  {
    q: 'Can a business pay to remove a bad review?',
    a: 'No. Reviews are removed only if they break the content guidelines. Businesses cannot pay to remove or change a review.',
  },
  {
    q: 'Who can I contact about a review?',
    a: 'Contact Help & Support, email team@infowebworld.com or visit the contact page.',
    links: [
      { text: 'Help & Support', href: '/help' },
      { text: 'team@infowebworld.com', href: 'mailto:team@infowebworld.com' },
      { text: 'contact page', href: '/contact' },
    ],
  },
]
