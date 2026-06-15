'use client'

/* Listing-page styles — scoped to this component (and the profile page, which
   reuses the .tlp-main product cards) so they no longer ship on every page. */
import '../styles/listing.css'
import '../styles/test-listing-page.css'
import '../styles/claim-modal.css'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import type { RealSubmission, FaqItem, KeyFeature, Award } from '../iww-hq/data/submissions-storage'
import WriteReviewModal from './WriteReviewModal'
import LeadFormModal from './LeadFormModal'
import ClaimListingModal from './ClaimListingModal'
import SignupModal from '../components/auth/SignupModal'
import { withInfoWebWorldUtm } from '../lib/utm'
import { listingOutboundRel } from '@/lib/user-plan-types'
import { trackWebsiteClick } from '../lib/track-website-click'

/* ═══════════════════════════════════════════
   Listing Detail Page — GetApp-style company listing.
   Accepts optional initialData from /company/[slug]; falls back to
   sample (Mailchimp-themed) mock data so /test-listing-page still
   renders the design without a real DB record.
   Visual system: white bg, blue accents, orange stars,
   flat cards with 1px #E5E7EB borders, Inter font.
   ═══════════════════════════════════════════ */

export interface SiblingRow {
  id: number; slug: string; company_name: string; tagline: string
  logo_url: string; website: string; starting_price: string | number | null
  starting_price_period: string | null
  founded_year: string | null; team_size: string | null
  hq_location: string | null; city: string | null
  category_name: string; category_slug: string; category_color: string
}
export interface EngagementCounts {
  followers: number; likes: number; dislikes: number; bookmarks: number
}
export interface ReviewRow {
  id: number; rating: number; title: string; body: string
  created_at: string
  user_name: string | null; user_avatar_url: string | null
}
export interface ReviewsAgg {
  avgRating: number; reviewCount: number; recent: ReviewRow[]
}
export interface UserListingState {
  isFollowing: boolean
  reaction: 'like' | 'dislike' | null
  isBookmarked: boolean
  hasReviewed: boolean
  /** Authed reviewer identity — used for the "Reviewing as" pill in WriteReviewModal
   *  and for prefilling name/email in LeadFormModal so authed users don't retype. */
  currentUser?: { name: string | null; avatarUrl: string | null; email: string | null } | null
}

interface InitialData {
  listing: Record<string, unknown>
  /** Parent company linkage — populated when this product points at a
   *  /profile/[slug] company row. Drives the "Made by X ↗" hero badge. */
  parentCompany?: { name: string; slug: string; logo_url: string | null } | null
  breadcrumb: { name: string; slug: string }[]
  related: Record<string, unknown>[]
  /** Sibling/cousin categories derived from the static taxonomy on the
   *  server. Each entry resolves to a /{sectorSlug}/{slug} URL. Falls back
   *  to the hardcoded RELATED_CATS sample in preview mode only. */
  relatedCategories?: { name: string; slug: string; sectorSlug: string; color: string }[]
  siblings?: Record<string, unknown>[]
  engagement?: EngagementCounts
  reviews?: { avgRating: number; reviewCount: number; recent: Record<string, unknown>[] }
  userState?: UserListingState
  isAuthed?: boolean
}

interface ListingDetailPageProps {
  slug?: string
  initialData?: InitialData
}

function parseJsonArr(val: unknown): unknown[] {
  if (!val) return []
  if (typeof val === 'string') { try { return JSON.parse(val) } catch { return [] } }
  if (Array.isArray(val)) return val
  return []
}

/* Interpret a raw starting_price value (number | string | null) into the
   shape the UI needs. Treats 0 / '0' / '0.00' as FREE (not $0), strips any
   non-numeric chars, and returns null for missing/unparseable values so
   callers can cleanly hide the slot. Used across overview side card,
   alternatives grid, alternatives mini, customers-also-viewed, etc. */
type PriceDisplay =
  | { kind: 'paid'; num: string }
  | { kind: 'free' }
  | null
function formatStartingPrice(raw: string | number | null | undefined): PriceDisplay {
  if (raw === null || raw === undefined) return null
  const str = String(raw).trim()
  if (str === '') return null
  // Strip currency symbols/letters, keep digits + decimal
  const cleaned = str.replace(/[^\d.]/g, '')
  if (cleaned === '' || cleaned === '.') return null
  const num = parseFloat(cleaned)
  if (isNaN(num)) return null
  if (num === 0) return { kind: 'free' }
  return { kind: 'paid', num: cleaned }
}

function mapServerRow(r: Record<string, unknown>): Partial<RealSubmission> {
  return {
    id: String(r.id ?? ''),
    companyName: String(r.company_name ?? ''),
    email: String(r.email ?? ''),
    phoneCode: String(r.phone_code ?? '+1'),
    phone: String(r.phone ?? ''),
    website: String(r.website ?? ''),
    category: String(r.category_name ?? r.category ?? ''),
    categorySlug: String(r.category_slug ?? ''),
    categoryColor: String(r.category_color ?? '#E8553D'),
    country: String(r.country_name ?? r.country ?? ''),
    city: String(r.city ?? ''),
    state: String(r.state ?? ''),
    tagline: String(r.tagline ?? ''),
    description: String(r.description ?? ''),
    slug: String(r.slug ?? ''),
    logoUrl: String(r.logo_url ?? ''),
    screenshots: parseJsonArr(r.screenshots) as string[],
    features: parseJsonArr(r.features) as string[],
    /* Tolerate legacy string[] payloads — wrap each as { name } for the UI. */
    integrations: parseJsonArr(r.integrations).map((it) => {
      if (typeof it === 'string') return { name: it }
      if (it && typeof it === 'object') {
        const o = it as Record<string, unknown>
        return {
          name: String(o.name ?? ''),
          website: typeof o.website === 'string' ? o.website : undefined,
          description: typeof o.description === 'string' ? o.description : undefined,
        }
      }
      return { name: String(it) }
    }).filter(i => i.name) as RealSubmission['integrations'],
    pricingModel: String(r.pricing_model ?? 'contact'),
    pricingTiers: parseJsonArr(r.pricing_tiers) as RealSubmission['pricingTiers'],
    founded: String(r.founded_year ?? ''),
    employees: String(r.team_size ?? ''),
    funding: String(r.funding ?? ''),
    hqLocation: String(r.hq_location ?? ''),
    linkedin: String(r.linkedin ?? ''),
    twitter: String(r.twitter ?? ''),
    facebook: String(r.facebook ?? ''),
    faqs: parseJsonArr(r.faqs) as FaqItem[],
    listingType: String(r.listing_type_name ?? ''),
    plan: String(r.plan_slug ?? r.plan ?? ''),
    planName: String(r.plan_name ?? ''),
    /* ── Listings V3 ── */
    headerTags: parseJsonArr(r.header_tags) as string[],
    pros: parseJsonArr(r.pros) as string[],
    cons: parseJsonArr(r.cons) as string[],
    industriesServed: parseJsonArr(r.industries_served) as string[],
    useCases: parseJsonArr(r.use_cases) as string[],
    targetCompanySizes: parseJsonArr(r.target_company_sizes) as string[],
    keyFeatures: parseJsonArr(r.key_features) as KeyFeature[],
    startingPrice: r.starting_price != null ? String(r.starting_price) : '',
    startingPricePeriod: String(r.starting_price_period ?? ''),
    hasFreeTrial: Boolean(Number(r.has_free_trial ?? 0)),
    hasFreeVersion: Boolean(Number(r.has_free_version ?? 0)),
    supportChannels: parseJsonArr(r.support_channels) as string[],
    trainingOptions: parseJsonArr(r.training_options) as string[],
    languages: parseJsonArr(r.languages) as string[],
    hasIosApp: Boolean(Number(r.has_ios_app ?? 0)),
    hasAndroidApp: Boolean(Number(r.has_android_app ?? 0)),
    verified: Boolean(Number(r.verified ?? 0)),
    verifiedAt: String(r.verified_at ?? ''),
    compliance: parseJsonArr(r.compliance) as string[],
    awards: parseJsonArr(r.awards) as Award[],
  }
}

/* ── Logo helpers — Google's public favicon service (free, reliable) ── */
const clearbit = (domain: string, size = 128) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`
const MAILCHIMP_LOGO = clearbit('mailchimp.com', 256)

/* ── Short Pros / Cons labels for the overview side card ── */
const PROS_SHORT = [
  'Email Campaigns',
  'Audience Communication',
  'Marketing Campaigns',
]

const CONS_SHORT = [
  'Cumbersome security protocols',
  'Challenging user interface navigation',
  'Deliverability and spam concerns',
]

/* ── Longer pros / cons (kept for potential future section) ── */
const PROS = [
  'Free tier supports up to 500 contacts — great for small teams getting started.',
  'Drag-and-drop email builder is intuitive and forgiving.',
  'Extensive integrations catalog — Shopify, Canva, Salesforce, and 300+ more.',
  'Detailed campaign analytics, click maps, and A/B testing tools.',
]

const CONS = [
  'Pricing scales steeply once your contact list crosses 10k.',
  'Advanced automation features are locked behind higher tiers.',
  'Template design customization is sometimes restrictive.',
  'Customer support response on lower plans can be slow.',
]

/* ── Topic chips shown under "Select to learn more" ── */
const TOPIC_CHIPS: { label: string; kind: 'primary' | 'pos' | 'neg' | 'neutral' }[] = [
  { label: 'Email Marketing',                       kind: 'primary' },
  { label: 'Email Campaigns',                       kind: 'pos' },
  { label: 'Pricing',                               kind: 'neutral' },
  { label: 'Audience Communication',                kind: 'pos' },
  { label: 'Marketing Campaigns',                   kind: 'pos' },
  { label: 'Email Templates',                       kind: 'pos' },
  { label: 'Drag and Drop',                         kind: 'pos' },
  { label: 'Email Sending',                         kind: 'neutral' },
  { label: 'Spam Issues',                           kind: 'neutral' },
  { label: 'Email Lists',                           kind: 'neutral' },
  { label: 'Cumbersome security protocols',         kind: 'neg' },
  { label: 'Challenging user interface navigation', kind: 'neg' },
  { label: 'Deliverability and spam concerns',      kind: 'neg' },
  { label: 'Complex and costly list handling',      kind: 'neg' },
  { label: 'Limited editing flexibility',           kind: 'neg' },
  { label: 'Effortless email design tools',         kind: 'pos' },
  { label: 'Efficient client engagement platform', kind: 'pos' },
  { label: 'Versatile template customization',      kind: 'pos' },
]

/* ── Reviewer quotes shown below the long summary ── */
const INSIGHT_QUOTES = [
  {
    initials: 'FG',
    color:    '#0C9A9A',
    name:     'Fabrizio G.',
    role:     'Design Lead',
    quote:    'Very flexible Email marketing and campaign monitoring software that allows easy sales operation management and to generate leads and coordination across marketing teams is incredible.',
  },
  {
    initials: 'SD',
    color:    '#0C9A9A',
    name:     'Segun D.',
    role:     'Digital Marketing Manager',
    quote:    'With Mailchimp, I am able to automatically create, customize and send high volume outbound marketing emails that boost ROI in real-time.',
  },
  {
    initials: 'IG',
    color:    '#6B7280',
    name:     'Israel G.',
    role:     'CEO',
    quote:    'Mailchimp is a powerful and user-friendly email marketing platform that works well for small businesses, freelancers, and beginners, but it has some limitations as your needs grow.',
  },
  {
    initials: 'HS',
    color:    '#0C9A9A',
    name:     'Hannah S.',
    role:     'Web Developer and Marketing Specialist',
    quote:    'Mailchimp makes starting out with email marketing extremely simple, it offers tremendous features and templates, and opens up an avenue of marketing with really high ROI.',
  },
]

/* ── Legacy keyword + testimonial arrays (kept for other page sections) ── */
const KEYWORDS = [
  { label: 'Easy to use', sentiment: 'pos', count: 842 },
  { label: 'Email campaigns', sentiment: 'pos', count: 721 },
  { label: 'Free plan', sentiment: 'pos', count: 610 },
  { label: 'Analytics', sentiment: 'pos', count: 498 },
  { label: 'Templates', sentiment: 'pos', count: 451 },
  { label: 'Integrations', sentiment: 'pos', count: 388 },
  { label: 'Automations', sentiment: 'neutral', count: 327 },
  { label: 'Landing pages', sentiment: 'neutral', count: 295 },
  { label: 'Segmentation', sentiment: 'neutral', count: 241 },
  { label: 'Pricing', sentiment: 'neg', count: 212 },
  { label: 'Customer support', sentiment: 'neg', count: 189 },
  { label: 'Learning curve', sentiment: 'neg', count: 142 },
]
const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Marketing Manager', industry: 'E-commerce, 11–50 employees', rating: 5, quote: 'We moved off a legacy tool and had our first campaign out in under an hour.', date: 'March 14, 2026' },
  { name: 'Marcus T.', role: 'Founder', industry: 'SaaS, 2–10 employees', rating: 4, quote: 'Great starter tool for newsletters.', date: 'February 28, 2026' },
  { name: 'Priya V.', role: 'Digital Strategist', industry: 'Agency, 51–200 employees', rating: 5, quote: 'The reporting dashboard is the best in the category.', date: 'February 12, 2026' },
]

/* ── Company size split (3 segments, pct fill of each vertical bar) ── */
const COMPANY_SIZE = [
  { label: 'Small Businesses',   pct: 72 },
  { label: 'Enterprises',        pct: 14 },
  { label: 'Midsize Businesses', pct:  8 },
]

/* ── Industries (donut) — teal-shade palette + review counts ── */
const INDUSTRY = [
  { label: 'Marketing and Advertising Information', value: 11, reviews:  1661, color: '#006B6B' },
  { label: 'Technology and Services',               value:  7, reviews:  1057, color: '#0C9A9A' },
  { label: 'Computer Software Nonprofit',           value:  6, reviews:   906, color: '#4FB8B8' },
  { label: 'Organization Management',               value:  4, reviews:   604, color: '#8FD6D6' },
  { label: 'Others',                                value: 72, reviews: 10861, color: '#B7E6E6' },
]

/* ── Use cases (diamond cluster + legend) — darkest → lightest teal ── */
const USE_CASES = [
  { label: 'Email Marketing',     color: '#006B6B' },
  { label: 'Email Management',    color: '#0C9A9A' },
  { label: 'Campaign Management', color: '#4FB8B8' },
  { label: 'Email Tracking',      color: '#7FD0D0' },
  { label: 'Survey',              color: '#B7E6E6' },
]

/* ── Key features — each with description paragraph + optional reviewer quotes ── */
type Quote = { text: string; name: string; role: string; initials: string }
type Feature = { name: string; rating: number; desc: string; quotes?: Quote[] }

const KEY_FEATURES: Feature[] = [
  {
    name: 'Email campaign management',
    rating: 4.6,
    desc: "Reviewers praise Mailchimp's Email Campaign Management for how fast a non-technical team can ship a send. The drag-and-drop editor, template library, and scheduled delivery make launching, automating, and iterating straightforward. Open-rate and engagement tracking are cited as easy to read and act on, and segmentation and targeting controls come up as a recurring reason reviewers can personalize without bolting on separate systems. Social and third-party connections are called out as a meaningful extra surface. Of the 503 Mailchimp users who gave detailed accounts of their use of Email Campaign Management, 99% rated this feature as important or highly important.",
    quotes: [
      {
        text: 'Mailchimp keeps campaign setup friction-free. The templates and guided flows let us ship decent-looking emails without a designer, and the timezone-aware scheduling is something we lean on every week.',
        name: 'Matthew B.',
        role: 'Copywriter',
        initials: 'MB',
      },
      {
        text: 'The campaign tools let us run tight, targeted sends that actually convert. Between the automation recipes and the engagement breakdowns, it has become our core sending engine.',
        name: 'Tammy D.',
        role: 'Business Owner-Designer',
        initials: 'TD',
      },
    ],
  },
  {
    name: 'Email marketing',
    rating: 4.6,
    desc: "Reviewers describe Mailchimp's Email Marketing as approachable and effective. The pre-built templates and drag-and-drop canvas make producing professional emails easy, and the automation recipes — welcome series, cart abandonment, re-engagement — are called out as genuine time-savers. Integrations with common sales and commerce platforms are noted as a clean way to keep lists in sync. Reporting tools surface the engagement detail teams need to keep improving. Of the 185 Mailchimp users who gave detailed accounts of their use of Email Marketing, 98% rated this feature as important or highly important.",
  },
  {
    name: 'Contact database',
    rating: 4.4,
    desc: "Reviewers call Mailchimp's Contact Database efficient for keeping audiences organized. Importing is painless, tags and segments make targeted messaging simple, and the tools for cleaning and enriching records help keep data usable. A centralized view of contact activity paired with reporting is cited as a concrete lift for tracking engagement and tuning campaigns. Of the 238 Mailchimp users who gave detailed accounts of their use of Contact Database, 94% rated this feature as important or highly important.",
  },
  {
    name: 'Reporting/Analytics',
    rating: 4.4,
    desc: "Reviewers say Mailchimp's Reporting/Analytics gives a solid read on how campaigns are landing. Opens, clicks, and conversions are all tracked in detail, and the Google Analytics integration plus flexible report builder cover most needs. Audience insights are repeatedly called out as useful for understanding subscriber behavior, and the clarity of the data makes it easy to move from numbers to a decision. Of the 174 Mailchimp users who gave detailed accounts of their use of Reporting/Analytics, 94% rated this feature as important or highly important.",
  },
  {
    name: 'Mobile optimization',
    rating: 4.5,
    desc: "Reviewers feel Mailchimp's Mobile Optimization keeps emails looking good on any screen. Templates adjust automatically for mobile width, and the device-preview tool is cited as a reliable last check before scheduling. Given how much of every list opens on a phone, reviewers consistently call mobile responsiveness a must-have rather than nice-to-have. Of the 295 Mailchimp users who gave detailed accounts of their use of Mobile Optimization, 91% rated this feature as important or highly important.",
  },
  {
    name: 'CAN-SPAM compliance',
    rating: 4.4,
    desc: "Reviewers describe Mailchimp's CAN-SPAM Compliance tooling as essential for running a clean program. Opt-out handling, explicit consent capture, and automated legal footers all reduce the chance of blacklisting or deliverability damage. The built-in spam reporting is called out as a useful guardrail, and the platform's nudges toward best practice help teams stay aligned with regulation. Of the 132 Mailchimp users who gave detailed accounts of their use of CAN-SPAM Compliance, 84% rated this feature as important or highly important.",
  },
]

/* ── All Mailchimp features matrix: [name, rating, reviewCount] ── */
const ALL_FEATURES: [string, number, number][] = [
  ['Campaign tracking',            5.0,  2],
  ['Behavioral analytics',         5.0,  1],
  ['Pre-built templates',          5.0,  1],
  ['Multi-Channel communication',  5.0,  1],
  ['Mailing List Management',      4.5, 27],
  ['Unsubscribe Database',         5.0,  1],
  ['Lead segmentation',            4.5,  2],
  ['Social media monitoring',      4.0,  2],
  ['Geolocation',                  5.0,  3],
  ['AB Testing',                   4.6, 18],
  ['API Access',                   4.5,  9],
  ['Activity Dashboard',           4.4, 12],
  ['Audience Targeting',           4.6, 24],
  ['Auto-Responders',              4.5, 14],
  ['Campaign Analytics',           4.7, 31],
  ['Campaign Management',          4.6, 28],
  ['Campaign Scheduling',          4.7, 21],
  ['Click Tracking',               4.6, 16],
  ['Contact Database',             4.3, 11],
  ['Content Library',              4.2,  7],
  ['CRM',                          4.1,  9],
  ['Customer Segmentation',        4.5, 19],
  ['Drag & Drop Editor',           4.7, 42],
  ['Drip Campaigns',               4.4, 13],
  ['Dynamic Content',              4.3,  8],
  ['Email Distribution',           4.6, 22],
  ['Email Templates',              4.6, 35],
  ['Email Tracking',               4.5, 20],
  ['Engagement Tracking',          4.4, 17],
  ['Event Triggered Actions',      4.3,  6],
  ['Forms Management',             4.2,  8],
  ['GDPR Compliance',              4.4,  5],
  ['Geotargeting',                 4.0,  4],
  ['Image Library',                4.3, 10],
  ['Landing Pages',                4.2, 15],
  ['Lead Capture',                 4.3, 12],
  ['Lead Management',              4.1,  9],
  ['List Management',              4.4, 23],
  ['Marketing Automation',         4.3, 26],
  ['Mobile Optimized Emails',      4.6, 18],
  ['Newsletter Management',        4.7, 33],
  ['Performance Metrics',          4.5, 16],
  ['Personalization',              4.4, 14],
  ['Real-Time Analytics',          4.4, 11],
  ['Reporting & Statistics',       4.6, 29],
  ['ROI Tracking',                 4.2,  8],
  ['Segmentation',                 4.5, 25],
  ['Social Media Integration',     4.3, 10],
  ['Spam Compliance',              4.5,  9],
  ['Subscriber Management',        4.4, 13],
  ['Template Management',          4.5, 16],
  ['Third-Party Integrations',     4.5, 11],
  ['WYSIWYG Editor',               4.5, 14],
]

/* ── Alternatives compared (4 columns — Mailchimp is highlighted/filled) ── */
type AltRating = number | null
type Alt = {
  name: string; domain: string; rating: number; reviews: string
  startingPrice: string | null; period?: string
  freeTrial: boolean; freeVersion: boolean
  ratings: { ease: AltRating; features: AltRating; value: AltRating; support: AltRating }
  highlight: boolean
}
const ALTERNATIVES: Alt[] = [
  {
    name: 'Mailchimp', domain: 'mailchimp.com',
    rating: 4.5, reviews: '17.5K',
    startingPrice: '13', period: 'Per month',
    freeTrial: true, freeVersion: true,
    ratings: { ease: 4.4, features: 4.4, value: 4.4, support: 4.2 },
    highlight: true,
  },
  {
    name: 'Brevo', domain: 'brevo.com',
    rating: 4.6, reviews: '3.4K',
    startingPrice: null, period: 'No pricing info',
    freeTrial: true, freeVersion: false,
    ratings: { ease: null, features: null, value: null, support: null },
    highlight: false,
  },
  {
    name: 'ActiveCampaign', domain: 'activecampaign.com',
    rating: 4.6, reviews: '2.5K',
    startingPrice: null, period: 'No pricing info',
    freeTrial: true, freeVersion: false,
    ratings: { ease: null, features: null, value: null, support: null },
    highlight: false,
  },
  {
    name: 'MailerLite', domain: 'mailerlite.com',
    rating: 4.7, reviews: '2.2K',
    startingPrice: null, period: 'No pricing info',
    freeTrial: true, freeVersion: false,
    ratings: { ease: null, features: null, value: null, support: null },
    highlight: false,
  },
]

/* ── Pricing plans (single flat list, no monthly/yearly toggle) ── */
const PRICING_PLANS = [
  {
    name: 'Free',
    price: '0.00',
    features: [
      '2500 Monthly Email Sends',
      '1 User Seat',
      'Pre-Built Email Templates',
      '330+ Integrations',
      'Reporting & Analytics',
      'Forms and Landing Pages',
      'Creative Assistant',
      'Email support for first 30 days',
    ],
  },
  {
    name: 'Essentials',
    price: '13',
    features: [
      '3 Seats',
      'Owner & Admin',
      'Up to 50,000 Contacts',
      'Surveys',
      'Audience Dashboard',
      'Campaign Engagement',
      'Purchase Behavior',
      'Content Studio',
    ],
  },
  {
    name: 'Standard',
    price: '20',
    features: [
      '6000 Monthly Email Sends',
      '5 User Seats',
      '4 Roles',
      'Pre-Built Journeys',
      'Custom-Coded Templates',
      'Predictive Segmentation',
      'Content Optimizer',
      'Send Time Optimization',
      'Dynamic Content',
      '24/7 Email & Chat Support',
    ],
  },
]

/* ── User opinions about pricing/value (2 quotes w/ "Highly Relevant" badge) ── */
const VALUE_QUOTES = [
  {
    name: 'Haimal K.',
    role: 'Founder and CEO',
    initials: 'HK',
    color: '#0C9A9A',
    quote:
      'The automation feature of mailchimp eliminates the need to send a welcome email after each subscription to our service and most importantly, mailchimp also prevents most of our emails from going into spam folders.',
  },
  {
    name: 'Brian Y.',
    role: 'Visa Consulting Specialist',
    initials: 'BY',
    color: '#6B7280',
    quote:
      'I prefer creating clean email templates and updating them in advance that ensures that the clients are kept informed even during the peak times of consultations.',
  },
]

/* ── Integrations (rich card layout with quote + author + pagination) ── */
const INTEGRATIONS = [
  {
    name: 'WordPress', domain: 'wordpress.com', tag: 'Must-Have',
    rating: 4.6, reviewCount: 116, pageOf: 20, pageNum: 1,
    quote: 'I use WordPress everyday and have integrated Mailchimp with it with a lot of success. I feel that I have found my power combo of WordPress and Mailchimp. This integration is key for a successful website and email campaign integration. I highly recommend the combination. There are so many things you can do with both softwares and it is truly endless. Happy user here!',
    author: 'Justin L.', authorRole: 'Songwriter/Producer', authorInitials: 'JL', authorColor: '#6B7280',
  },
  {
    name: 'Zapier', domain: 'zapier.com', tag: 'Must-Have',
    rating: 4.5, reviewCount: 37, pageOf: 9, pageNum: 1,
    quote: 'Was very efficient in automating the importation of customer details into Mailchimp. As our budget was restricted, we ran into free use limits and imported the rest manually. But the connection worked great everytime.',
    author: 'Ukeje A.', authorRole: 'Researcher', authorInitials: 'UA', authorColor: '#0C9A9A',
  },
  {
    name: 'WooCommerce', domain: 'woocommerce.com', tag: 'Must-Have',
    rating: 4.4, reviewCount: 36, pageOf: 7, pageNum: 1,
    quote: 'When clients have a shop function it is a helpful tool for subscribing their leads for retargeting and future campaigns. Like customers who may be on the abandoned cart list, purchased at least once list, or did not purchase but signed up to be on the list. This allows each list to get the emails that will move them through the right funnels faster for better results.',
    author: 'Rosie H.', authorRole: 'Lead Marketing', authorInitials: 'RH', authorColor: '#0C9A9A',
  },
  {
    name: 'Squarespace', domain: 'squarespace.com', tag: 'Must-Have',
    rating: 4.7, reviewCount: 17, pageOf: 7, pageNum: 1,
    quote: 'We integrated our sales and customer contact from our Squarespace site with Mailchimp in order to manage our database and keep in contact with our customers using Mailchimp\u2019s advanced features.',
    author: 'Jesse C.', authorRole: 'Managing Director', authorInitials: 'JC', authorColor: '#0C9A9A',
  },
  {
    name: 'Shopify', domain: 'shopify.com', tag: 'Must-Have',
    rating: 4.4, reviewCount: 40, pageOf: 6, pageNum: 1,
    quote: 'It registers new clients and their marketing preferences, helps with abandoned cart emails and sales tracking. It\u2019s a great app to have in Shopify.',
    author: 'Alexandra L.', authorRole: 'Customer success manager', authorInitials: 'AL', authorColor: '#0C9A9A',
  },
  {
    name: 'Canva', domain: 'canva.com', tag: 'Must-Have',
    rating: 4.8, reviewCount: 24, pageOf: 6, pageNum: 1,
    quote: 'Perfect integration for quickly taking contact from my canna and directly sending it to my mailchimp account. No need for downloading then uploading over and over again.',
    author: 'Cassidy L.', authorRole: 'Owner/Operator', authorInitials: 'CL', authorColor: '#0C9A9A',
  },
]

/* ── Customer support — sentiment bullets + 3 quote cards ── */
const SUPPORT_BULLETS = [
  { kind: 'pos', text: 'A fair number of users say Mailchimp\u2019s customer service is fantastic, resolving issues quickly via chat or email.' },
  { kind: 'pos', text: 'Multiple users appreciate the 24/7 support availability and find the team helpful in addressing problems when contacted.' },
  { kind: 'neg', text: 'A portion of users report slow response times and difficulty reaching support, especially for non-premium accounts.' },
  { kind: 'neg', text: 'Multiple users mention lack of phone support and inconsistent or unhelpful responses from customer service representatives.' },
]

const SUPPORT_QUOTES = [
  {
    name: 'Garrett M.', role: 'Chief Marketing Officer',
    initials: 'GM', color: '#6B7280',
    quote: 'There are a wide variety of pricing models so that you can find one that fits your business and sending needs and we always experienced good deliverability and fantastic customer support.',
  },
  {
    name: 'Jess S.', role: 'Creative Director',
    initials: 'JS', color: '#0C9A9A',
    quote: 'Mailchimp offers a fantastic service that\u2019s easy to use, affords many options for customization, and provides reports, statistics, and helpful information for composing emails, collecting addresses, and improving interaction with subscribers.',
  },
  {
    name: 'Jeremy C.', role: 'Co-Founder',
    initials: 'JC', color: '#6B7280',
    quote: 'This effectively meant that our business was completely without customer communication — purchases were processed but not confirmed, etc. And because Mailchimp\u2019s customer support staff was slow and arrogant, we had to endure almost 24 hours without basic business functions.',
  },
]

/* ── FAQs (first has embedded "better value" alternatives) ── */
const FAQ_ALTS = [
  { name: 'Brevo',          domain: 'brevo.com',          rating: 4.6, reviews: '3.4K' },
  { name: 'ActiveCampaign', domain: 'activecampaign.com', rating: 4.6, reviews: '2.5K' },
  { name: 'MailerLite',     domain: 'mailerlite.com',     rating: 4.7, reviews: '2.2K' },
]

const FAQS = [
  {
    q: 'Q. Who are the typical users of Mailchimp?',
    a: 'Mailchimp has the following typical customers: Freelancers, Large Enterprises, Mid Size Businesses, Non Profit, Public Administrations, Small Business',
    showAlts: true,
  },
  {
    q: 'Q. What is Mailchimp used for?',
    a: 'Mailchimp is an email marketing and marketing automation platform used to design, send, and measure email campaigns — including newsletters, customer journeys, landing pages, and signup forms.',
    showAlts: false,
  },
  {
    q: 'Q. What are the benefits of using Mailchimp?',
    a: 'A generous free tier, beginner-friendly drag-and-drop editor, hundreds of integrations with commerce and CRM tools, and detailed reporting on opens, clicks, and revenue.',
    showAlts: false,
  },
  {
    q: 'Q. What languages does Mailchimp support?',
    a: 'The Mailchimp interface is available in English, Spanish, French, German, Portuguese (Brazil), and Italian. Emails and landing pages support any Unicode language.',
    showAlts: false,
  },
  {
    q: 'Q. Does Mailchimp support mobile devices?',
    a: 'Yes. Mailchimp has native iOS and Android apps for drafting campaigns, reviewing reports, and responding to audience activity on the go.',
    showAlts: false,
  },
]

/* ── Popular comparisons (15 cards, 3×5 grid) ── */
const COMPARISONS = [
  { b: 'Constant Contact',     bd: 'constantcontact.com' },
  { b: 'ActiveCampaign',       bd: 'activecampaign.com' },
  { b: 'HubSpot Marketing Hub', bd: 'hubspot.com' },
  { b: 'SendGrid',             bd: 'sendgrid.com' },
  { b: 'GetResponse',          bd: 'getresponse.com' },
  { b: 'Emma by Marigold',     bd: 'myemma.com' },
  { b: 'Moosend',              bd: 'moosend.com' },
  { b: 'Brevo',                bd: 'brevo.com' },
  { b: 'MailerLite',           bd: 'mailerlite.com' },
  { b: 'Drip',                 bd: 'drip.com' },
  { b: 'Keap',                 bd: 'keap.com' },
  { b: 'AWeber',               bd: 'aweber.com' },
  { b: 'MailUp',               bd: 'mailup.com' },
  { b: 'iContact',             bd: 'icontact.com' },
  { b: 'Kit',                  bd: 'kit.com' },
]

/* ── Related categories (12 items, folder-icon cards, 3×4 grid) ── */
const RELATED_CATS = [
  'Email Management', 'Social Media Marketing', 'Marketing Analytics',
  'CRM', 'Real Estate CRM', 'Email Tracking',
  'Lead Management', 'Marketing Automation', 'Email Marketing',
  'Survey', 'Landing Page', 'Campaign Management',
]

/* ── Table of Contents anchor list — labels are derived inside the
   render function so they include the real company name. */
const TOC_ITEMS: { id: string; label: (name: string) => string }[] = [
  { id: 'overview',      label: name => `${name} overview` },
  { id: 'ui',            label: () => 'User interface' },
  { id: 'insights',      label: () => 'Reviews' },
  { id: 'who-uses',      label: name => `Who uses ${name}?` },
  { id: 'key-features',  label: () => 'Key features' },
  { id: 'alternatives',  label: () => 'Alternatives' },
  { id: 'pricing',       label: () => 'Pricing' },
  { id: 'integrations',  label: () => 'Integrations' },
]
/** Backwards-compatible static array used by ToC scroll-spy (just needs ids). */
const TOC = TOC_ITEMS

/* ═══════════════════════════════════════════
   Small subcomponents
   ═══════════════════════════════════════════ */

/* Horizontal pricing carousel for 4+ plans — keeps cards full-size and scroll-
   snapped instead of letting the 4th wrap onto a new row. Prev/Next buttons
   scroll by one card width; touch + trackpad swipe also work natively. */
function PricingCarousel({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateNav = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    updateNav()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateNav, { passive: true })
    window.addEventListener('resize', updateNav)
    return () => {
      el.removeEventListener('scroll', updateNav)
      window.removeEventListener('resize', updateNav)
    }
  }, [updateNav])

  const scrollByCard = (dir: -1 | 1) => {
    const el = trackRef.current
    if (!el) return
    const first = el.querySelector<HTMLElement>('.tlp-plan')
    const step = first ? first.offsetWidth + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <div className="tlp-pricing-carousel">
      <button
        type="button"
        className="tlp-pricing-nav tlp-pricing-nav--prev"
        onClick={() => scrollByCard(-1)}
        disabled={!canPrev}
        aria-label="Previous plans"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <div className="tlp-pricing-track" ref={trackRef}>
        {children}
      </div>
      <button
        type="button"
        className="tlp-pricing-nav tlp-pricing-nav--next"
        onClick={() => scrollByCard(1)}
        disabled={!canNext}
        aria-label="Next plans"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  )
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const rounded = Math.round(value * 2) / 2
  return (
    <span className="tlp-stars" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map(i => {
        const state = i <= rounded ? 'full' : i - 0.5 === rounded ? 'half' : 'empty'
        return (
          <svg key={i} className={`tlp-star tlp-star--${state}`} viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <linearGradient id={`half-${i}-${value}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#E5E7EB" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z"
              fill={state === 'half' ? `url(#half-${i}-${value})` : state === 'full' ? 'currentColor' : '#E5E7EB'}
            />
          </svg>
        )
      })}
    </span>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="tlp-icon-check" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Cross() {
  return (
    <svg viewBox="0 0 24 24" className="tlp-icon-cross" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Header / identity icons (Clutch-style listing card) ── */
function VerifiedBadge({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 2l2.39 1.74 2.96-.13.92 2.82 2.39 1.74-1.05 2.78 1.05 2.78-2.39 1.74-.92 2.82-2.96-.13L12 22l-2.39-1.74-2.96.13-.92-2.82L3.34 15.7l1.05-2.78-1.05-2.78L5.73 8.4l.92-2.82 2.96.13L12 2z" fill="#2A77E0" />
      <path d="M8.5 12.2l2.4 2.4 4.6-4.6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckCircle({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#16A34A" />
      <path d="M8 12.4l2.6 2.6L16 9.6" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MapPinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function PhoneIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function FlagIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M5 21V4M5 5h11l-2 3.5L16 12H5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UsersIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="9" cy="9" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 11a3 3 0 1 0 0-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M21 19c0-2.4-1.7-4-4-4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ClockIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WalletIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 10h14a3 3 0 0 1 0 6H3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="17" cy="13" r="1.1" fill="currentColor" />
    </svg>
  )
}

function ExternalArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MailIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function PencilIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M4 20h4l10-10-4-4L4 16v4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 6l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ThumbsUpIcon({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M7 10h2v10H7a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 10l4-7a2.2 2.2 0 0 1 2 2.4l-.6 3.6h4.7a2 2 0 0 1 2 2.4l-1.4 6.6a2 2 0 0 1-2 1.6H9V10z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function ThumbsDownIcon({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M7 4h2v10H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 14l4 7a2.2 2.2 0 0 0 2-2.4l-.6-3.6h4.7a2 2 0 0 0 2-2.4l-1.4-6.6a2 2 0 0 0-2-1.6H9v10z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function BookmarkIcon({ size = 15, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M6 3.5h12a.5.5 0 0 1 .5.5v17l-6.5-4.5L5.5 21V4a.5.5 0 0 1 .5-.5z" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function BellIcon({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 20a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function CheckSm2({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* Header tag chips — primary categories / specialties for this listing */
const HEADER_TAGS = [
  'Email Marketing',
  'Marketing Automation',
  'SaaS',
  'Newsletters',
  'eCommerce',
] as const

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5M12 7.5v.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CheckFilled() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12l4 4 10-10" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MinusFilled() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 12h12" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

function CheckSm() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12l4 4 10-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlusSm() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

function XSm() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

function UserSilhouette() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle cx="12" cy="9" r="3.6" fill="currentColor" />
      <path d="M4.5 20c1.2-3.5 4.1-5.5 7.5-5.5s6.3 2 7.5 5.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}


function FolderIcon() {
  return (
    <svg viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
      <path fill="none" stroke="#0C9A9A" strokeWidth="1.8" strokeLinejoin="round"
        d="M6 14h12l3 4h21v22H6z" />
      <path fill="none" stroke="#0C9A9A" strokeWidth="1.8" strokeLinejoin="round" opacity=".55"
        d="M6 14l3 4h12l3 4h18" />
    </svg>
  )
}

function BracketIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="none" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        d="M9 5H6v14h3M15 5h3v14h-3" />
    </svg>
  )
}

/* Two-arrow zigzag "trend" icon used between the two logos in Popular
   Comparisons. Red arrow climbs up-right, dark arrow falls down-left —
   visually signals "stack X up against Y". */
function TrendIcon({ size = 30 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      {/* Red up-trend (with arrowhead at top-right) */}
      <path
        d="M5 31 L20 18 L30 26 L43 14"
        fill="none" stroke="#FF5A5F" strokeWidth="6.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M34 12 L46 12 L46 24"
        fill="none" stroke="#FF5A5F" strokeWidth="6.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Dark down-trend (with arrowhead at bottom-left) */}
      <path
        d="M59 33 L44 46 L34 38 L21 50"
        fill="none" stroke="#1F2937" strokeWidth="6.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M30 52 L18 52 L18 40"
        fill="none" stroke="#1F2937" strokeWidth="6.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowLeftSm() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SpeechBubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M5 3h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm2 5a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2H7zm0 3.5a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2H7z"
      />
    </svg>
  )
}

function LinkedInBadge() {
  return (
    <span className="tlp-li-badge" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="10" height="10">
        <path fill="#fff" d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3v9zM6.5 8.3a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zM19 19h-3v-4.7c0-1.1-.02-2.5-1.5-2.5-1.5 0-1.75 1.2-1.75 2.4V19h-3v-9h2.9v1.25h.04c.4-.77 1.4-1.57 2.9-1.57 3.1 0 3.66 2 3.66 4.7V19z" />
      </svg>
    </span>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase()
  const palette = ['#2563EB', '#7C3AED', '#DB2777', '#059669', '#DC2626', '#EA580C', '#0891B2']
  const hash = name.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  const color = palette[hash % palette.length]
  return (
    <div className="tlp-avatar" style={{ background: color }}>{initials}</div>
  )
}

/* ── Main product mock: onboarding "Ready to get started?" style ── */
function MainMock() {
  return (
    <div className="tlp-mk-frame" aria-hidden="true">
      {/* Dark/mint left sidebar */}
      <aside className="tlp-mk-side">
        <div className="tlp-mk-avatar">
          <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#111" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4 14c-1.5 1.2-3.6 2-6 2-1.5 0-2.8-.3-4-.8v-1.4c0-1.4 1.1-2.6 2.6-2.6h3.8c1.4 0 2.6 1.1 2.6 2.6V16z" /></svg>
        </div>
        <div className="tlp-mk-side-stack">
          {['edit','img','users','sync','box','grid','sq','search'].map(k => (
            <div key={k} className="tlp-mk-ico" />
          ))}
        </div>
        <div className="tlp-mk-side-foot">
          <div className="tlp-mk-chip-g">G+</div>
        </div>
      </aside>

      {/* Yellow vertical accent strip */}
      <div className="tlp-mk-strip" />

      {/* Main content */}
      <div className="tlp-mk-body">
        <div className="tlp-mk-hero">
          <div className="tlp-mk-title">Ready to get started?</div>
          <div className="tlp-mk-sub">Here&apos;s what we recommend you do next</div>
        </div>

        {/* Card 1: Send your first email */}
        <div className="tlp-mk-card">
          <div className="tlp-mk-img tlp-mk-img--email">
            <div className="tlp-mk-img-leaves" />
            <div className="tlp-mk-img-plate tlp-mk-img-plate--1" />
            <div className="tlp-mk-img-plate tlp-mk-img-plate--2" />
            <div className="tlp-mk-img-plate tlp-mk-img-plate--3" />
          </div>
          <div className="tlp-mk-card-body">
            <div className="tlp-mk-card-title">Send your first email</div>
            <div className="tlp-mk-card-desc">Choose a pre-designed template or use our drag-and-drop builder to launch a campaign in minutes.</div>
            <div className="tlp-mk-btn">Get Started</div>
          </div>
        </div>

        {/* Card 2: Create a website */}
        <div className="tlp-mk-card">
          <div className="tlp-mk-img tlp-mk-img--site">
            <div className="tlp-mk-site-hd" />
            <div className="tlp-mk-site-row tlp-mk-site-row--1" />
            <div className="tlp-mk-site-row tlp-mk-site-row--2" />
            <div className="tlp-mk-site-blocks">
              <span /><span /><span />
            </div>
          </div>
          <div className="tlp-mk-card-body">
            <div className="tlp-mk-card-title">Create a website</div>
            <div className="tlp-mk-card-desc">Build a free website with all the tools needed to market your business built right in. No coding skills needed.</div>
            <div className="tlp-mk-link">Get Started</div>
          </div>
        </div>

        {/* Card 3: Add your contacts */}
        <div className="tlp-mk-card">
          <div className="tlp-mk-img tlp-mk-img--contacts">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="tlp-mk-dot" />
            ))}
          </div>
          <div className="tlp-mk-card-body">
            <div className="tlp-mk-card-title">Add your contacts</div>
            <div className="tlp-mk-card-desc">Your contacts make up your audience. Once you add your contacts, you&apos;ll be able to send your first campaign.</div>
            <div className="tlp-mk-link">Import Contacts</div>
          </div>
        </div>
      </div>

      {/* Help button bottom right */}
      <div className="tlp-mk-help">?</div>
      {/* Feedback tab on right edge */}
      <div className="tlp-mk-feedback">Feedback</div>
    </div>
  )
}

/* ── 5 thumbnail mini-mocks (different UI views) ── */
function ThumbBars() {
  return (
    <svg viewBox="0 0 128 70" preserveAspectRatio="none" className="tlp-tb-svg">
      <rect width="128" height="12" fill="#F3F4F6" />
      <rect x="5" y="4" width="26" height="4" rx="1" fill="#D1D5DB" />
      <rect x="35" y="4" width="16" height="4" rx="1" fill="#D1D5DB" />
      <g fill="#60A5FA">
        <rect x="10" y="55" width="10" height="10" />
        <rect x="24" y="48" width="10" height="17" />
        <rect x="38" y="40" width="10" height="25" />
        <rect x="52" y="32" width="10" height="33" />
        <rect x="66" y="26" width="10" height="39" />
        <rect x="80" y="20" width="10" height="45" />
        <rect x="94" y="15" width="10" height="50" />
        <rect x="108" y="10" width="10" height="55" />
      </g>
    </svg>
  )
}

function ThumbEmail() {
  return (
    <svg viewBox="0 0 128 70" preserveAspectRatio="none" className="tlp-tb-svg">
      <rect width="128" height="12" fill="#1F2937" />
      <rect x="70" y="18" width="50" height="5" rx="1" fill="#9CA3AF" />
      <rect x="70" y="27" width="45" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="33" width="48" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="39" width="40" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="48" width="38" height="4" rx="1" fill="#E5E7EB" />
      <rect x="70" y="56" width="30" height="4" rx="1" fill="#E5E7EB" />
      <rect x="8" y="18" width="52" height="44" fill="#B91C1C" />
      <circle cx="34" cy="40" r="10" fill="#fff" opacity=".9" />
    </svg>
  )
}

function ThumbTable() {
  return (
    <svg viewBox="0 0 128 70" preserveAspectRatio="none" className="tlp-tb-svg">
      <rect width="128" height="12" fill="#F3F4F6" />
      <rect x="5" y="4" width="20" height="4" rx="1" fill="#D1D5DB" />
      <rect x="0" y="12" width="28" height="58" fill="#F9FAFB" />
      <rect x="5" y="17" width="18" height="3" rx="1" fill="#D1D5DB" />
      <rect x="5" y="24" width="16" height="3" rx="1" fill="#E5E7EB" />
      <rect x="5" y="31" width="18" height="3" rx="1" fill="#E5E7EB" />
      <rect x="5" y="38" width="14" height="3" rx="1" fill="#E5E7EB" />
      <g>
        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={i} x="32" y={18 + i * 10} width="90" height="7" rx="1" fill={i % 2 ? '#F3F4F6' : '#fff'} stroke="#E5E7EB" strokeWidth=".5" />
        ))}
      </g>
    </svg>
  )
}

function ThumbChart() {
  return (
    <svg viewBox="0 0 128 70" preserveAspectRatio="none" className="tlp-tb-svg">
      <rect width="128" height="12" fill="#F3F4F6" />
      <rect x="5" y="4" width="28" height="4" rx="1" fill="#D1D5DB" />
      <rect x="0" y="12" width="34" height="58" fill="#F9FAFB" />
      <rect x="5" y="18" width="20" height="3" rx="1" fill="#D1D5DB" />
      <rect x="5" y="24" width="24" height="3" rx="1" fill="#E5E7EB" />
      <rect x="5" y="30" width="18" height="3" rx="1" fill="#E5E7EB" />
      <defs>
        <linearGradient id="tb-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity=".45" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M38,55 L50,48 L62,50 L74,40 L86,44 L98,32 L110,36 L122,25 L122,66 L38,66 Z" fill="url(#tb-grad)" />
      <path d="M38,55 L50,48 L62,50 L74,40 L86,44 L98,32 L110,36 L122,25" fill="none" stroke="#2563EB" strokeWidth="1.5" />
    </svg>
  )
}

function ThumbMixed() {
  return (
    <svg viewBox="0 0 128 70" preserveAspectRatio="none" className="tlp-tb-svg">
      <rect width="128" height="12" fill="#F3F4F6" />
      <rect x="5" y="4" width="20" height="4" rx="1" fill="#D1D5DB" />
      <g>
        {Array.from({ length: 5 }).map((_, i) => (
          <g key={i}>
            <rect x="8" y={20 + i * 10} width="4" height="4" rx="1" fill="#22C55E" />
            <rect x="18" y={20 + i * 10} width="60" height="3" rx="1" fill="#D1D5DB" />
            <rect x="90" y={20 + i * 10} width="28" height="3" rx="1" fill="#E5E7EB" />
          </g>
        ))}
      </g>
    </svg>
  )
}

/* ═══════════════════════════════════════════
   Page component
   ═══════════════════════════════════════════ */

export default function ListingDetailPage(props: ListingDetailPageProps = {}) {
  const { initialData } = props

  /* Two render modes:
     - Real mode (initialData present): show ONLY the data the submitter
       provided. Empty fields and unsupported sections are hidden — no
       Mailchimp-style sample fillers.
     - Preview mode (no initialData): used by /test-listing-page for
       design preview. Sample arrays + Mailchimp string fallbacks are
       used so the layout reads as a fully populated listing. */
  const real: Partial<RealSubmission> | null = initialData
    ? mapServerRow(initialData.listing)
    : null
  const isPreview = !initialData
  const listingId = real?.id ? Number(real.id) : 0
  const listingSlug = real?.slug || (props.slug || '')
  /* Auth state is hydrated client-side from /api/listings/[slug]/me — the
     page itself is statically cached and identical for every visitor, so
     we can't trust any "authed" hint baked into the HTML. Defaults to
     anon; flips to true after the me-fetch resolves. */
  const [isAuthed, setIsAuthed] = useState(false)

  /* Last updated — pulled directly from the row, formatted human-friendly. */
  const updatedAtRaw = initialData?.listing?.updated_at as string | undefined
    ?? initialData?.listing?.created_at as string | undefined
  const lastUpdated = updatedAtRaw
    ? new Date(updatedAtRaw).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : ''

  /* Siblings server-derived for Alternatives / Customers Also Viewed / Popular
     Comparisons. Empty array in preview mode. */
  const siblings = (initialData?.siblings as unknown as SiblingRow[]) || []

  const companyName = (real?.companyName && real.companyName.trim())
    || (isPreview ? 'Mailchimp' : '')

  /* Logo fallback in real mode tries the site's favicon (Google s2 service)
     before giving up. Avoids leaking the Mailchimp logo onto a stranger's
     listing just because they didn't upload anything. */
  const websiteHost = (real?.website || '').replace(/^https?:\/\//, '').split('/')[0]
  const fallbackLogo = isPreview
    ? MAILCHIMP_LOGO
    : (websiteHost ? clearbit(websiteHost, 256) : '')

  const view = {
    companyName,
    logoUrl:     real?.logoUrl || fallbackLogo,
    tagline:     real?.tagline || '',
    description: real?.description || '',
    website:     real?.website || (isPreview ? 'https://mailchimp.com' : ''),
    founded:     real?.founded || (isPreview ? '2001' : ''),
    employees:   real?.employees || (isPreview ? '1,000+' : ''),
    hqLocation:  real?.hqLocation
      || [real?.city, real?.state, real?.country].filter(Boolean).join(', ')
      || (isPreview ? '675 Ponce de Leon Ave NE, Atlanta, GA, USA' : ''),
    phoneFmt:    real?.phone
      ? `${real.phoneCode || '+1'} ${real.phone}`
      : (isPreview ? '+1 678 999 0000' : ''),
    email:       real?.email || '',
    category:    real?.category || (isPreview ? 'Email Marketing' : ''),
    plan:        real?.planName || real?.plan || '',
    realFaqs:    (real?.faqs && real.faqs.length > 0) ? real.faqs : null,
    realPricing: (real?.pricingTiers && real.pricingTiers.length > 0) ? real.pricingTiers : null,
    realFeatures: (real?.features && real.features.length > 0) ? real.features : null,
    realIntegrations: (real?.integrations && real.integrations.length > 0) ? real.integrations : null,
    realScreenshots: (real?.screenshots && real.screenshots.length > 0) ? real.screenshots : null,
    breadcrumb:  initialData?.breadcrumb || [],
    categoryColor: real?.categoryColor || '#0066CC',
    /* ── Listings V3: optional submitter-supplied fields. Render code falls back
       to the hardcoded sample arrays when these are empty. ── */
    realHeaderTags:        (real?.headerTags && real.headerTags.length > 0) ? real.headerTags : null,
    realPros:              (real?.pros && real.pros.length > 0) ? real.pros : null,
    realCons:              (real?.cons && real.cons.length > 0) ? real.cons : null,
    realIndustries:        (real?.industriesServed && real.industriesServed.length > 0) ? real.industriesServed : null,
    realUseCases:          (real?.useCases && real.useCases.length > 0) ? real.useCases : null,
    realCompanySizes:      (real?.targetCompanySizes && real.targetCompanySizes.length > 0) ? real.targetCompanySizes : null,
    realKeyFeatures:       (real?.keyFeatures && real.keyFeatures.length > 0) ? real.keyFeatures : null,
    realStartingPrice:     real?.startingPrice || '',
    realStartingPeriod:    real?.startingPricePeriod || '',
    realHasFreeTrial:      Boolean(real?.hasFreeTrial),
    realHasFreeVersion:    Boolean(real?.hasFreeVersion),
    realSupportChannels:   (real?.supportChannels && real.supportChannels.length > 0) ? real.supportChannels : null,
    realTrainingOptions:   (real?.trainingOptions && real.trainingOptions.length > 0) ? real.trainingOptions : null,
    realLanguages:         (real?.languages && real.languages.length > 0) ? real.languages : null,
    realHasIosApp:         Boolean(real?.hasIosApp),
    realHasAndroidApp:     Boolean(real?.hasAndroidApp),
    realCompliance:        (real?.compliance && real.compliance.length > 0) ? real.compliance : null,
    realAwards:            (real?.awards && real.awards.length > 0) ? real.awards : null,
    /* Listing verification — flips the prominent "Verified by InfoWebWorld"
       badge in the hero. Preview mode shows verified to demo the visual. */
    verified:              isPreview ? true : Boolean(real?.verified),
    verifiedAt:            real?.verifiedAt || '',
    /* Claimable = an unowned (no user_id), unverified listing — the scraped/
       seeded majority. Drives the "Claim this listing" CTA in place of the
       muted Unverified pill. */
    claimable:             !isPreview && !real?.verified &&
                           !Number((initialData?.listing as { user_id?: number | null } | undefined)?.user_id ?? 0),
  }
  /** Helper: replace literal "Mailchimp" inside sample-data strings so reviewer
   *  quotes, FAQ answers, etc. read with the real company name when one is set. */
  const swap = (s: string): string => s.split('Mailchimp').join(companyName)

  /** Helper: render `text` with substrings matching `query` wrapped in <mark>
   *  for visible highlight. Case-insensitive. Returns the plain string when
   *  the query is empty so no-op renders stay cheap. */
  const highlightMatch = (text: string, query: string): React.ReactNode => {
    const q = query.trim()
    if (!q) return text
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const parts = String(text).split(new RegExp(`(${escaped})`, 'gi'))
    return parts.map((part, i) =>
      i % 2 === 1
        ? <mark key={i} className="tlp-af-hl">{part}</mark>
        : <span key={i}>{part}</span>
    )
  }

  const [featureQ, setFeatureQ] = useState('')
  const [integrationQ, setIntegrationQ] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [featuresExpanded, setFeaturesExpanded] = useState(false)
  const [industryHover, setIndustryHover] = useState<number | null>(null)
  const [keyFeaturesExpanded, setKeyFeaturesExpanded] = useState(false)
  const KEY_FEATURES_VISIBLE = 3
  const [activeSection, setActiveSection] = useState<string>(TOC[0]?.id ?? '')

  // ─── Engagement — initial state seeded from server (counts + this user's
  // own follow/reaction/bookmark). All toggles fire to /api/listings/[slug]/*
  // optimistically with HTTP-error rollback and per-action click dedup so a
  // mashed button can't race itself. Anonymous users get redirected to
  // /business with a return-to URL. ───
  const eng = initialData?.engagement
  /* Engagement counts come from the static snapshot at last revalidate.
     They're frozen between rebuilds — clicking still updates the DB and
     the local optimistic UI, but the public counter only refreshes on
     /company/[slug]'s 48h auto-revalidate or admin manual rebuild. */
  const [following, setFollowing] = useState(false)
  const [followers, setFollowers] = useState(eng?.followers ?? (isPreview ? 2_481 : 0))
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likes, setLikes] = useState(eng?.likes ?? (isPreview ? 127 : 0))
  const [dislikes, setDislikes] = useState(eng?.dislikes ?? (isPreview ? 8 : 0))
  /* Reviewer identity (name + avatar) — hydrated client-side from
     /api/listings/[slug]/me. Used by the "Reviewing as" pill + email
     prefill in LeadFormModal. */
  const [currentUser, setCurrentUser] = useState<{
    name: string | null; email: string | null; avatarUrl: string | null
  } | null>(null)

  /* Per-action in-flight gate. Like + dislike share a single 'reaction' slot
     so we never have two competing UPSERTs racing on the same UNIQUE row. */
  type EngKey = 'follow' | 'reaction' | 'bookmark'
  const [pending, setPending] = useState<Set<EngKey>>(new Set())
  const isPending = (k: EngKey) => pending.has(k)
  const startPending = (k: EngKey) =>
    setPending(p => { const next = new Set(p); next.add(k); return next })
  const endPending = (k: EngKey) =>
    setPending(p => { const next = new Set(p); next.delete(k); return next })

  /* Modal state for "Write a Review". Real listings navigate to the
     dedicated /write-review page (with voice-recording flow); the modal
     stays mounted only for /test-listing-page preview mode so the
     demo still works without a real slug. */
  const [reviewOpen, setReviewOpen] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const router = useRouter()
  const openReview = useCallback(() => {
    if (isPreview) { setReviewOpen(true); return }
    if (!isAuthed) { requireLogin(); return }
    router.push(`/write-review?company=${encodeURIComponent(listingSlug)}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreview, listingSlug, router])

  /* ─── Per-user hydration ───────────────────────────────────────────
     Page is statically cached (ISR), so the HTML is identical for every
     visitor. Right after mount we ask /api/listings/[slug]/me which
     reads the auth cookie and returns this user's relationship to the
     listing. Only fires for real listings (not /test-listing-page). */
  useEffect(() => {
    if (isPreview || !listingSlug) return
    let cancelled = false
    fetch(`/api/listings/${encodeURIComponent(listingSlug)}/me`, {
      credentials: 'same-origin', cache: 'no-store',
    })
      .then(r => r.ok ? r.json() : null)
      .then(j => {
        if (cancelled || !j?.ok) return
        setIsAuthed(Boolean(j.isAuthed))
        setFollowing(Boolean(j.isFollowing))
        setLiked(j.reaction === 'like')
        setDisliked(j.reaction === 'dislike')
        setBookmarked(Boolean(j.isBookmarked))
        setHasReviewed(Boolean(j.hasReviewed))
        setCurrentUser(j.currentUser ?? null)
      })
      .catch(() => { /* anon defaults already set */ })
    return () => { cancelled = true }
  }, [isPreview, listingSlug])
  /* Auth gate modal — opens whenever an anon user clicks an engagement button
     (follow / react / bookmark / write a review). Replaces the old full-page
     redirect to /business so the user keeps their context on the listing. */
  const [authOpen, setAuthOpen] = useState(false)
  const [claimOpen, setClaimOpen] = useState(false)
  /* Live mirror of the parent's review aggregate so the sticky head + insights
     reflect a just-published review without a full page reload. */
  const [reviewCount, setReviewCount] = useState(initialData?.reviews?.reviewCount ?? 0)
  /* Inbox-form state. */
  const [inboxEmail, setInboxEmail] = useState('')
  const [inboxStatus, setInboxStatus] = useState<'idle'|'sending'|'ok'|'err'>('idle')
  /* "Get a Quote" lead form modal — opens from the sticky-head CTA. The lead
     hits our DB first (listing_inbox_emails, source='quote_request') and the
     owner gets a "via InfoWebWorld" email so the source is provable end-to-end. */
  const [leadOpen, setLeadOpen] = useState(false)

  /* Anon fallback — open the in-page signup modal (Google + email/OTP) so
     the user keeps their context on the listing. The modal's nextUrl lands
     them back on this same /company/<slug> page after a successful auth. */
  const requireLogin = () => { setAuthOpen(true) }

  /* Centralised engagement fetch — returns res.ok | network error => false.
     The optimistic local update is the caller's responsibility; this just
     reports whether the server accepted the change so the caller can roll
     back on a 4xx/5xx exactly the same way it does on a network error. */
  const sendEngage = async (path: string, init?: RequestInit): Promise<boolean> => {
    try {
      const res = await fetch(path, init)
      return res.ok
    } catch {
      return false
    }
  }

  const toggleFollow = async () => {
    if (isPreview) { setFollowing(f => !f); setFollowers(c => c + (following ? -1 : 1)); return }
    if (!isAuthed) { requireLogin(); return }
    if (!listingId || isPending('follow')) return

    const nextFollowing = !following
    setFollowing(nextFollowing)
    setFollowers(c => c + (nextFollowing ? 1 : -1))
    startPending('follow')
    const ok = await sendEngage(`/api/listings/${listingSlug}/follow`, {
      method: nextFollowing ? 'POST' : 'DELETE',
    })
    if (!ok) {
      setFollowing(!nextFollowing)
      setFollowers(c => c + (nextFollowing ? -1 : 1))
    }
    endPending('follow')
  }

  // ─── Reviews insights (chips + quotes) — collapsed by default ───
  const [insightsExpanded, setInsightsExpanded] = useState(false)
  const CHIPS_VISIBLE = 8
  const QUOTES_VISIBLE = 2

  // ─── UI screenshots carousel — pure image gallery, 2 visible at once ───
  const ux = (id: string) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=520&q=70`
  const UI_IMAGES_FALLBACK = [
    ux('1611162617474-5b21e879e113'),
    ux('1488998427799-e3362cec87c3'),
    ux('1551288049-bebda4e38f71'),
    ux('1460925895917-afdab827c52f'),
    ux('1611926653458-09294b3142bf'),
    ux('1542744173-8e7e53415bb0'),
    ux('1556761175-b413da4baf72'),
    ux('1554224155-8d04cb21cd6c'),
  ]
  // Use real screenshots from DB when present, otherwise fall back to sample UI images.
  const UI_IMAGES = view.realScreenshots || UI_IMAGES_FALLBACK
  const [uiSlide, setUiSlide] = useState(0)
  // 2 images visible per view → last reachable position is length - 2
  const uiSlideCount = Math.max(1, UI_IMAGES.length - 1)
  const uiPrev = () => setUiSlide(i => (i - 1 + uiSlideCount) % uiSlideCount)
  const uiNext = () => setUiSlide(i => (i + 1) % uiSlideCount)
  // Keyboard arrow nav while focused inside the carousel
  const uiKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); uiPrev() }
    if (e.key === 'ArrowRight') { e.preventDefault(); uiNext() }
  }

  /* Reactions: like + dislike share one DB row (UNIQUE listing+user), so we
     compute the next reaction state, fire one request (POST upserts, DELETE
     clears), and roll back BOTH local flags on failure. The 'reaction' pending
     slot blocks both buttons while a request is in flight. */
  const toggleReaction = async (kind: 'like' | 'dislike') => {
    if (isPreview) {
      if (kind === 'like') {
        if (liked) { setLiked(false); setLikes(c => c - 1) }
        else { setLiked(true); setLikes(c => c + 1)
          if (disliked) { setDisliked(false); setDislikes(c => c - 1) } }
      } else {
        if (disliked) { setDisliked(false); setDislikes(c => c - 1) }
        else { setDisliked(true); setDislikes(c => c + 1)
          if (liked) { setLiked(false); setLikes(c => c - 1) } }
      }
      return
    }
    if (!isAuthed) { requireLogin(); return }
    if (!listingId || isPending('reaction')) return

    const wasLiked = liked, wasDisliked = disliked
    const wasLikes = likes, wasDislikes = dislikes

    let nextLiked = liked, nextDisliked = disliked
    let nextLikes = likes, nextDislikes = dislikes
    let action: 'POST' | 'DELETE' = 'POST'

    if (kind === 'like') {
      if (liked) {
        nextLiked = false; nextLikes = likes - 1; action = 'DELETE'
      } else {
        nextLiked = true; nextLikes = likes + 1
        if (disliked) { nextDisliked = false; nextDislikes = dislikes - 1 }
      }
    } else {
      if (disliked) {
        nextDisliked = false; nextDislikes = dislikes - 1; action = 'DELETE'
      } else {
        nextDisliked = true; nextDislikes = dislikes + 1
        if (liked) { nextLiked = false; nextLikes = likes - 1 }
      }
    }

    setLiked(nextLiked); setDisliked(nextDisliked)
    setLikes(nextLikes); setDislikes(nextDislikes)
    startPending('reaction')

    const ok = await sendEngage(`/api/listings/${listingSlug}/reactions`, {
      method: action,
      headers: action === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
      body: action === 'POST' ? JSON.stringify({ kind }) : undefined,
    })
    if (!ok) {
      setLiked(wasLiked); setDisliked(wasDisliked)
      setLikes(wasLikes); setDislikes(wasDislikes)
    }
    endPending('reaction')
  }
  const toggleLike = () => toggleReaction('like')
  const toggleDislike = () => toggleReaction('dislike')

  const toggleBookmark = async () => {
    if (isPreview) { setBookmarked(b => !b); return }
    if (!isAuthed) { requireLogin(); return }
    if (!listingId || isPending('bookmark')) return

    const nextBookmarked = !bookmarked
    setBookmarked(nextBookmarked)
    startPending('bookmark')
    const ok = await sendEngage(`/api/listings/${listingSlug}/bookmark`, {
      method: nextBookmarked ? 'POST' : 'DELETE',
    })
    if (!ok) setBookmarked(!nextBookmarked)
    endPending('bookmark')
  }
  const submitInboxEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!listingId || !inboxEmail.trim()) return
    setInboxStatus('sending')
    try {
      const res = await fetch(`/api/listings/${listingSlug}/inbox-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inboxEmail.trim() }),
      })
      if (res.ok) { setInboxStatus('ok'); setInboxEmail('') }
      else setInboxStatus('err')
    } catch { setInboxStatus('err') }
  }

  // Pin the identity + tabs to the top of the viewport once the user starts
  // scrolling. We can't rely on `position: sticky` because an ancestor has
  // `overflow-x: clip` which neutralises sticky in some browsers — so we
  // toggle `position: fixed` via a body class and reserve the vertical space
  // with a sibling spacer of measured height.
  useEffect(() => {
    let raf = 0
    let active = false

    const measureHead = () => {
      const head = document.querySelector<HTMLElement>('.tlp-sticky-head')
      if (!head) return
      // While the head is fixed we still need its natural height for the
      // spacer — so unset position briefly to read the layout height.
      const wasActive = document.body.classList.contains('tlp-subheader-active')
      if (wasActive) document.body.classList.remove('tlp-subheader-active')
      const h = head.getBoundingClientRect().height
      if (wasActive) document.body.classList.add('tlp-subheader-active')
      document.body.style.setProperty('--tlp-head-h', `${Math.round(h)}px`)
    }

    const getFullH = () => {
      const v = parseFloat(getComputedStyle(document.body).getPropertyValue('--tlp-head-h'))
      return Number.isFinite(v) && v > 0 ? v : 200
    }

    const handle = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const fullH = getFullH()
        // Trigger only after the full header has scrolled out of view, so the
        // spacer (full-height) is past the viewport and the compact pinned
        // head sits flush against the content below it (no empty gap).
        const next = active
          ? window.scrollY > fullH * 0.4   // hysteresis going back up
          : window.scrollY > fullH * 0.85  // arm point on scroll-down
        if (next === active) return
        active = next
        if (active) measureHead()
        document.body.classList.toggle('tlp-subheader-active', active)
      })
    }

    measureHead()
    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', () => { measureHead(); handle() })
    handle()
    return () => {
      window.removeEventListener('scroll', handle)
      // resize handler is anonymous; rely on page navigation cleanup
      if (raf) cancelAnimationFrame(raf)
      document.body.classList.remove('tlp-subheader-active')
      document.body.style.removeProperty('--tlp-head-h')
    }
  }, [])

  // ToC scroll-spy — track which section is currently in the viewport's top
  // band, so the active item in the sidebar reflects where the user is reading.
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length === 0) return
        // Pick the section whose top is closest to (just below) the header band
        const topmost = visible.reduce((a, b) =>
          b.boundingClientRect.top < a.boundingClientRect.top ? b : a
        )
        setActiveSection(topmost.target.id)
      },
      {
        // "Active zone" = roughly top 40% of the viewport below the header
        rootMargin: '-140px 0px -55% 0px',
        threshold: 0,
      }
    )
    const ids: string[] = []
    TOC.forEach(t => {
      const el = document.getElementById(t.id)
      if (el) {
        observer.observe(el)
        ids.push(t.id)
      }
    })
    return () => observer.disconnect()
  }, [])

  /* Base list of every feature for this listing — exposed separately from the
     filtered view so the title can show "X of Y" + the search bar stays
     visible even when the active query reduces matches to 0. */
  const allFeatures = useMemo<[string, number, number][]>(() => {
    return view.realFeatures
      ? view.realFeatures.map(name => [name, 0, 0] as [string, number, number])
      : (isPreview ? ALL_FEATURES : [])
  }, [view.realFeatures, isPreview])

  const filteredFeatures = useMemo(() => {
    const q = featureQ.trim().toLowerCase()
    if (!q) return allFeatures
    return allFeatures.filter(f => String(f[0]).toLowerCase().includes(q))
  }, [featureQ, allFeatures])

  const filteredIntegrations = useMemo(() => {
    const q = integrationQ.trim().toLowerCase()
    if (!q) return INTEGRATIONS
    return INTEGRATIONS.filter(i => i.name.toLowerCase().includes(q) || i.tag.toLowerCase().includes(q))
  }, [integrationQ])

  /* Aggregate review stats — read from server-side reviews aggregation when
     a real listing has any approved reviews; fall back to sample in preview.
     The count source is the live `reviewCount` state so a just-published or
     just-deleted review reflects in the sticky head + insights without a
     full page reload. */
  const reviewsData = initialData?.reviews
  const realAvgRating = reviewsData?.avgRating ?? 0
  const realReviewCount = reviewCount
  const overallRating = realReviewCount > 0
    ? Number(realAvgRating.toFixed(1))
    : (isPreview ? 4.4 : 0)
  const reviewsCount = realReviewCount > 0
    ? realReviewCount
    : (isPreview ? 17248 : 0)
  /* Approximation: anything 4★+ counts as positive sentiment. Replace with
     a real sentiment classifier once review NLP lands. */
  const sentimentPct = realReviewCount > 0
    ? Math.round((realAvgRating / 5) * 100)
    : (isPreview ? 87 : 0)
  const hasReviews = realReviewCount > 0

  return (
    <>
      <main className="tlp-main">
        {/* ─── Breadcrumb ─── */}
        <div className="tlp-crumb-bar">
          <div className="tlp-wrap">
            <nav className="tlp-crumb" aria-label="Breadcrumb">
              <a href="/" aria-label="Home"><HomeIcon /></a>
              {view.breadcrumb.length > 0 ? view.breadcrumb.map((bc, i) => {
                const sectorSlug = view.breadcrumb[0]?.slug
                const href = i === 0 ? `/${bc.slug}` : `/${sectorSlug}/${bc.slug}`
                return (
                  <span key={bc.slug} style={{ display: 'contents' }}>
                    <span className="tlp-crumb-sep"><ChevronRight size={12} /></span>
                    <a href={href}>{bc.name}</a>
                  </span>
                )
              }) : (
                <>
                  <span className="tlp-crumb-sep"><ChevronRight size={12} /></span>
                  <a href="#">{view.category}</a>
                </>
              )}
              <span className="tlp-crumb-sep"><ChevronRight size={12} /></span>
              <span className="tlp-crumb-current">{view.companyName}</span>
            </nav>
          </div>
        </div>

        {/* ─── Sticky head (identity + horizontal nav stay pinned together on scroll) ─── */}
        <div className="tlp-sticky-head">
        <header className="tlp-identity">
          <div className="tlp-identity-inner">
            {/* Logo — letter avatar fallback when no real logo or favicon. */}
            <div className="tlp-id-logo">
              {view.logoUrl
                ? <img src={view.logoUrl} alt={`${view.companyName} logo`} />
                : <span className="tlp-id-logo-fallback" aria-hidden="true">
                    {(view.companyName.trim().charAt(0) || '?').toUpperCase()}
                  </span>}
            </div>

            {/* Identity column */}
            <div className="tlp-id-body">
              <h1 className="tlp-id-name">
                {view.companyName}
                {view.verified && (
                  <span
                    className="tlp-id-verified"
                    aria-label="Verified by InfoWebWorld"
                    title="Verified by InfoWebWorld"
                  ><VerifiedBadge /></span>
                )}
              </h1>
              {(isPreview || hasReviews) && (
                <div className="tlp-id-meta">
                  <span className="tlp-id-rate-num">{overallRating.toFixed(1)}</span>
                  <Stars value={overallRating} size={15} />
                  <a href="#insights" className="tlp-id-reviews">
                    ({reviewsCount.toLocaleString()} Review{reviewsCount === 1 ? '' : 's'})
                  </a>
                  {view.verified && (
                    <span className="tlp-id-vpill"><CheckCircle /> Verified</span>
                  )}
                </div>
              )}
              {/* Category tags — only when the submitter provided them. */}
              {(view.realHeaderTags || (isPreview ? HEADER_TAGS : null)) && (
                <div className="tlp-id-tags" role="list" aria-label="Categories">
                  {(view.realHeaderTags || HEADER_TAGS).map(t => (
                    <a key={t} href="#" role="listitem" className="tlp-id-tag">{t}</a>
                  ))}
                </div>
              )}

              {/* Combined contact row — phone removed from public display.
                  Visitors get the phone number after submitting the lead form
                  (which gates on auth) so the request is recorded as a real
                  attributable lead. Location stays visible — it's already
                  publishable from public sources (LinkedIn, the company
                  website, etc.). */}
              {view.hqLocation && (
                <div className="tlp-id-line tlp-id-line--combo">
                  <span className="tlp-id-info"><span className="tlp-id-icn"><MapPinIcon /></span><span>{view.hqLocation}</span></span>
                </div>
              )}

              {/* Engagement bar — server-derived counts; toggles call the
                  /api/listings/[id]/* endpoints with optimistic local state. */}
              <div className="tlp-engage" role="group" aria-label="Engagement actions">

                <button
                  type="button"
                  className={`tlp-eng-btn tlp-eng-btn--like ${liked ? 'is-active' : ''} ${isPending('reaction') ? 'is-busy' : ''}`}
                  onClick={toggleLike}
                  disabled={isPending('reaction')}
                  aria-pressed={liked}
                  aria-busy={isPending('reaction')}
                  aria-label={liked ? 'Remove like' : 'Like this listing'}
                >
                  <ThumbsUpIcon />
                  <span>{likes.toLocaleString()}</span>
                </button>
                <button
                  type="button"
                  className={`tlp-eng-btn tlp-eng-btn--dislike ${disliked ? 'is-active' : ''} ${isPending('reaction') ? 'is-busy' : ''}`}
                  onClick={toggleDislike}
                  disabled={isPending('reaction')}
                  aria-pressed={disliked}
                  aria-busy={isPending('reaction')}
                  aria-label={disliked ? 'Remove dislike' : 'Dislike this listing'}
                >
                  <ThumbsDownIcon />
                  <span>{dislikes.toLocaleString()}</span>
                </button>
                <button
                  type="button"
                  className={`tlp-eng-btn tlp-eng-btn--bookmark ${bookmarked ? 'is-active' : ''} ${isPending('bookmark') ? 'is-busy' : ''}`}
                  onClick={toggleBookmark}
                  disabled={isPending('bookmark')}
                  aria-pressed={bookmarked}
                  aria-busy={isPending('bookmark')}
                  aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this listing'}
                >
                  <BookmarkIcon filled={bookmarked} />
                  <span>{bookmarked ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>

            <div className="tlp-id-divider" aria-hidden="true" />

            {/* Stats column */}
            <div className="tlp-id-stats">
              {view.founded && <div className="tlp-stat-row"><span className="tlp-id-icn"><FlagIcon /></span><span>Founded {view.founded}</span></div>}
              {view.employees && <div className="tlp-stat-row"><span className="tlp-id-icn"><UsersIcon /></span><span>{view.employees}</span></div>}
              {view.realPricing && view.realPricing.length > 0 && (
                <div className="tlp-stat-row"><span className="tlp-id-icn"><WalletIcon /></span><span>{view.realPricing.length} plan{view.realPricing.length === 1 ? '' : 's'}</span></div>
              )}
              {!view.realPricing && isPreview && (<>
                <div className="tlp-stat-row"><span className="tlp-id-icn"><ClockIcon /></span><span>Free–$350/mo</span></div>
                <div className="tlp-stat-row"><span className="tlp-id-icn"><WalletIcon /></span><span>4 plans</span></div>
              </>)}
            </div>

            <div className="tlp-id-divider" aria-hidden="true" />

            {/* Actions column — Follow lives here as a primary CTA above the
                transactional actions, paired with a follower count */}
            <div className="tlp-id-actions">
              <button
                type="button"
                className={`tlp-btn-follow ${following ? 'is-active' : ''} ${isPending('follow') ? 'is-busy' : ''}`}
                onClick={toggleFollow}
                disabled={isPending('follow')}
                aria-pressed={following}
                aria-busy={isPending('follow')}
                aria-label={following ? 'Unfollow this listing' : 'Follow this listing'}
              >
                <span className="tlp-btn-follow-main">
                  {following ? <CheckSm2 /> : <BellIcon />}
                  <span>{following ? 'Following' : 'Follow'}</span>
                </span>
                <span className="tlp-btn-follow-count">{followers.toLocaleString()}</span>
              </button>
              {view.website && (
                <a href={withInfoWebWorldUtm(view.website, listingSlug)} target="_blank" rel={listingOutboundRel(real?.plan)} className="tlp-btn-primary" onClick={() => trackWebsiteClick(listingSlug, 'listing')}>Visit website <ExternalArrowIcon /></a>
              )}
              {(view.email || isPreview) && (
                <button type="button" className="tlp-btn-outline" onClick={() => setLeadOpen(true)}>
                  Contact <MailIcon />
                </button>
              )}
              <button
                type="button"
                className="tlp-write-review"
                onClick={openReview}
              >
                {hasReviewed ? 'Edit your review' : 'Write a Review'} <PencilIcon />
              </button>
            </div>
          </div>
        </header>

        {/* ─── Horizontal section nav (part of the sticky head, scroll-spy active) ─── */}
        <nav className="tlp-tabs" aria-label="Page sections">
          <div className="tlp-tabs-inner">
            {TOC.map(t => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className={`tlp-tab-link ${t.id === activeSection ? 'is-active' : ''}`}
              >
                {t.label(view.companyName)}
              </a>
            ))}
          </div>
        </nav>
        </div>
        {/* Spacer reserves the head's vertical space when it switches to fixed */}
        <div className="tlp-sticky-head-spacer" aria-hidden="true" />

        {/* ─── Single-column content (left ToC removed) ─── */}
        <div className="tlp-wrap tlp-layout">
          <div className="tlp-content">

            {/* ─── Page title + verification block (inside content column) ─── */}
            <div className="tlp-title-block">
              <h1 className="tlp-page-title">
                {view.companyName}
                {isPreview && ' — 2026 Pricing, Features, Reviews & Alternatives'}
              </h1>
              {view.tagline && <p className="tlp-page-tagline">{view.tagline}</p>}

              {/* ── "Made by {Company} ↗" linkage ─────────────────────────
                  Renders a quiet inline badge linking to the parent company's
                  /profile page when the product was submitted with a
                  parent_company_id. */}
              {initialData?.parentCompany && (
                <a
                  href={`/profile/${initialData.parentCompany.slug}`}
                  className="tlp-made-by"
                >
                  {initialData.parentCompany.logo_url && (
                    <img
                      src={initialData.parentCompany.logo_url}
                      alt=""
                      className="tlp-made-by-logo"
                    />
                  )}
                  <span>
                    Made by <strong>{initialData.parentCompany.name}</strong>
                  </span>
                  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                    <path d="M7 17L17 7M7 7h10v10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}

              {/* ── Listing verification badge ──────────────────────────────
                  Verified: prominent mint card. Unverified: muted pill. Only
                  one of the two ever renders, never both. */}
              {view.verified ? (
                <div className="tlp-vbadge tlp-vbadge--ok" role="status" aria-label="Verified by InfoWebWorld">
                  <span className="tlp-vbadge-shield" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22">
                      <path fill="#0E8F6E" d="M12 2 4 5.5v5c0 5.2 3.4 9.6 8 10.5 4.6-.9 8-5.3 8-10.5v-5L12 2Zm-1.2 13.7-3.5-3.5 1.5-1.5 2 2 5-5 1.5 1.5-6.5 6.5Z"/>
                    </svg>
                  </span>
                  <span className="tlp-vbadge-body">
                    <span className="tlp-vbadge-eyebrow">Authenticated</span>
                    <span className="tlp-vbadge-title">Verified by InfoWebWorld</span>
                    <span className="tlp-vbadge-sub">
                      {view.companyName}'s identity has been confirmed by our review team
                      {(() => {
                        if (!view.verifiedAt) return '.'
                        const d = new Date(view.verifiedAt)
                        if (Number.isNaN(d.getTime())) return '.'
                        return ` on ${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`
                      })()}
                    </span>
                  </span>
                </div>
              ) : view.claimable ? (
                <button
                  type="button"
                  className="tlp-claim-cta"
                  onClick={() => setClaimOpen(true)}
                  aria-label={`Claim ${view.companyName}`}
                >
                  <span className="tlp-claim-cta-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2 4 5.5v5c0 5.2 3.4 9.6 8 10.5 4.6-.9 8-5.3 8-10.5v-5L12 2Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </span>
                  <span className="tlp-claim-cta-body">
                    <span className="tlp-claim-cta-eyebrow">Is this your business?</span>
                    <span className="tlp-claim-cta-title">Claim this listing</span>
                    <span className="tlp-claim-cta-sub">
                      Verify ownership of {view.companyName} to manage details, respond to reviews
                      and get the Verified badge — free.
                    </span>
                  </span>
                  <span className="tlp-claim-cta-arrow" aria-hidden="true">→</span>
                </button>
              ) : (
                <div className="tlp-vbadge tlp-vbadge--no" role="note" aria-label="Unverified by InfoWebWorld">
                  <span className="tlp-vbadge-shield tlp-vbadge-shield--muted" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2 4 5.5v5c0 5.2 3.4 9.6 8 10.5 4.6-.9 8-5.3 8-10.5v-5L12 2Z" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                  </span>
                  <span className="tlp-vbadge-body">
                    <span className="tlp-vbadge-title tlp-vbadge-title--muted">Unverified by InfoWebWorld</span>
                    <span className="tlp-vbadge-sub">
                      {view.companyName} hasn't completed identity verification yet.
                      Treat business details below as self-reported.
                    </span>
                  </span>
                </div>
              )}

              {isPreview && (
                <div className="tlp-verify">
                  <span className="tlp-verify-avatars" aria-hidden="true">
                    <span className="tlp-va" style={{ background: '#0C9A9A' }}>MR</span>
                    <span className="tlp-va" style={{ background: '#7C3AED' }}>KS</span>
                  </span>
                  <span>
                    All user reviews are verified by in-house moderators and provider data by
                    our software research team.{' '}
                    <a href="#" className="tlp-inline-link">Learn more</a>
                  </span>
                </div>
              )}
              {lastUpdated && <div className="tlp-updated">Last updated: {lastUpdated}</div>}
            </div>

            {/* ========== OVERVIEW CARD ========== */}
            {(isPreview || view.description || view.realIntegrations) && (
            <section id="overview" className="tlp-ovw-card">
              <div className="tlp-ovw-grid tlp-ovw-grid--full">

                {/* ── Left column: Q&A blocks (now full-width — overview
                       sidebar removed entirely per design) ── */}
                <div className="tlp-ovw-main">
                  <h2 className="tlp-ovw-title">{view.companyName} overview</h2>
                  {isPreview && (
                    <div className="tlp-ovw-verify">
                      <span className="tlp-verify-avatars" aria-hidden="true">
                        <span className="tlp-va" style={{ background: '#0C9A9A', fontSize: 10 }}>MR</span>
                        <span className="tlp-va" style={{ background: '#EA580C', fontSize: 10 }}>JL</span>
                      </span>
                      <span>Based on {reviewsCount.toLocaleString()} verified user reviews</span>
                    </div>
                  )}

                  {(view.description || isPreview) && (
                    <div className="tlp-qa">
                      <div className="tlp-qa-head">
                        <h3>What is {view.companyName}?</h3>
                      </div>
                      {/* Render description as separate <p> per paragraph. Scraped
                          descriptions use \n\n between paragraphs; legacy single-
                          paragraph descriptions render as one <p> unchanged. */}
                      {view.description
                        ? view.description
                            .split(/\n{2,}/)
                            .map(p => p.trim())
                            .filter(Boolean)
                            .map((para, i) => <p key={i}>{para}</p>)
                        : (
                          <p>{`${view.companyName} is a ${view.category.toLowerCase()} platform offering key features such as workflow automation, analytics, integrations, and team collaboration tools.`}</p>
                        )}
                    </div>
                  )}

                  {isPreview && (
                    <>
                      <div className="tlp-qa">
                        <div className="tlp-qa-head">
                          <h3>Who uses {view.companyName}?</h3>
                          <a href="#who-uses">See details</a>
                        </div>
                        <p>
                          Reviews for {view.companyName} come from a wide variety of industries, including
                          marketing and advertising, information technology and services, and computer
                          software. The most frequent use cases cited by reviewers include
                          {' '}{view.category.toLowerCase()}.
                        </p>
                      </div>

                      <div className="tlp-qa">
                        <div className="tlp-qa-head">
                          <h3>What do users say about {view.companyName} pricing?</h3>
                          <a href="#pricing">See details</a>
                        </div>
                        <p>
                          Reviewers indicate that {view.companyName}&apos;s free or starter plan is appealing for small
                          businesses, and they appreciate the ability to test core features without
                          upfront costs. Some users report that pricing increases as their usage grows.
                          Reviewers feel that essential features require paid upgrades, and some users
                          compare it against other platforms for better value.
                        </p>
                      </div>
                    </>
                  )}

                  {(view.realIntegrations || isPreview) && (
                    <div className="tlp-qa">
                      <div className="tlp-qa-head">
                        <h3>What are the most popular integrations for {view.companyName}?</h3>
                        <a href="#integrations">See details</a>
                      </div>
                      <p>
                        {view.realIntegrations && view.realIntegrations.length > 0 ? (
                          <>The {view.companyName} integrations most frequently cited by reviewers are: {view.realIntegrations.slice(0, 5).map(i => i.name).join(', ')}.</>
                        ) : (
                          <>The {view.companyName} integrations most frequently cited by reviewers cover marketing,
                          analytics, and e-commerce platforms.</>
                        )}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </section>
            )}

            {/* ========== UI SCREENSHOTS — carousel ========== */}
            {(view.realScreenshots || isPreview) && (
            <section id="ui" className="tlp-card">
              <div className="tlp-ui-head-row">
                <h2 className="tlp-sec-title">{view.companyName}&apos;s user interface</h2>
                {isPreview && (
                  <div className="tlp-ui-head">
                    <span className="tlp-ui-ease">Ease of use:</span>
                    <span className="tlp-ui-star" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                      </svg>
                    </span>
                    <span className="tlp-ui-rating-num">4.5</span>
                    <span className="tlp-ui-rating-count">(17.5K)</span>
                  </div>
                )}
              </div>

              <div
                className="tlp-car"
                role="region"
                aria-roledescription="carousel"
                aria-label="User interface screenshots"
                tabIndex={0}
                onKeyDown={uiKeyDown}
              >
                <div className="tlp-car-stage">
                  <button type="button" className="tlp-car-arrow tlp-car-arrow--prev" onClick={uiPrev} aria-label="Previous">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                  </button>

                  {/* Track — each slide is 50% wide so 2 are always visible */}
                  <div className="tlp-car-track" style={{ transform: `translateX(-${uiSlide * 50}%)` }}>
                    {UI_IMAGES.map((src, i) => (
                      <div key={i} className="tlp-car-slide tlp-car-slide--img">
                        <img src={src} alt={`Screenshot ${i + 1}`} loading="lazy" className="tlp-car-img" />
                      </div>
                    ))}
                  </div>

                  <button type="button" className="tlp-car-arrow tlp-car-arrow--next" onClick={uiNext} aria-label="Next">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
                  </button>
                </div>

                <div className="tlp-car-dots" role="tablist" aria-label="Position">
                  {Array.from({ length: uiSlideCount }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={i === uiSlide}
                      className={`tlp-car-dot ${i === uiSlide ? 'is-active' : ''}`}
                      onClick={() => setUiSlide(i)}
                      aria-label={`Position ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </section>
            )}

            {/* ========== INSIGHTS — renders real reviews when present, falls back
                to the sample chrome (sentiment bars, topic chips, sample quotes)
                in preview mode only. Hidden in real mode if no approved reviews yet. ========== */}
            {(
              <section id="insights" className="tlp-card">
                {!isPreview && (
                  <>
                    <h2 className="tlp-sec-title">{view.companyName} reviews and insights</h2>
                    <div className="tlp-in-grid">
                      {/* ── Left sidebar: overall rating + insights placeholder ── */}
                      <aside className="tlp-in-left">
                        <div className="tlp-in-block">
                          <h3 className="tlp-in-h3">Overall rating</h3>
                          {hasReviews ? (
                            <div className="tlp-in-rate-row">
                              <span className="tlp-in-rate-num">{overallRating.toFixed(1)}</span>
                              <Stars value={overallRating} size={15} />
                              <span className="tlp-in-rate-count">({realReviewCount.toLocaleString()})</span>
                            </div>
                          ) : (
                            <div className="tlp-in-rate-row">
                              <span className="tlp-in-rate-num tlp-in-rate-num--muted">—</span>
                              <span className="tlp-in-rate-count">No reviews yet</span>
                            </div>
                          )}
                        </div>
                        <div className="tlp-in-block">
                          <h3 className="tlp-in-h3">Topic insights</h3>
                          <p className="tlp-in-coming">
                            We&apos;ll surface trending topics and sentiment once {view.companyName} collects more reviews.
                          </p>
                        </div>
                      </aside>

                      {/* ── Right content: real reviews as quotes, or empty CTA ── */}
                      <div className="tlp-in-right">
                        {hasReviews && reviewsData && reviewsData.recent.length > 0 ? (
                          <>
                            <h3 className="tlp-in-q">What do users say about {view.companyName}?</h3>
                            <div className="tlp-in-quotes">
                              {reviewsData.recent.slice(0, 5).map((rev) => {
                                const r = rev as unknown as ReviewRow
                                const initials = (r.user_name || '?').slice(0, 2).toUpperCase()
                                return (
                                  <div key={r.id} className="tlp-in-quote">
                                    {r.title && <div className="tlp-in-quote-title">{r.title}</div>}
                                    <p className="tlp-in-quote-text">&ldquo;{r.body}&rdquo;</p>
                                    <div className="tlp-in-quote-who">
                                      {r.user_avatar_url
                                        ? <img src={r.user_avatar_url} alt="" className="tlp-in-quote-av tlp-in-quote-av--img" />
                                        : <span className="tlp-in-quote-av" style={{ background: '#0C9A9A' }}>{initials}</span>}
                                      <div>
                                        <div className="tlp-in-quote-name">{r.user_name || 'Anonymous'}</div>
                                        <div className="tlp-in-quote-role">
                                          <Stars value={Number(r.rating)} size={12} />
                                          <span className="tlp-in-quote-date">
                                            {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </>
                        ) : (
                          <div className="tlp-in-empty">
                            <span className="tlp-in-empty-ico" aria-hidden="true">
                              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                              </svg>
                            </span>
                            <h4 className="tlp-in-empty-title">No reviews yet for {view.companyName}</h4>
                            <p className="tlp-in-empty-sub">
                              Be the first to share your experience — your review will appear here and help other buyers compare.
                            </p>
                            <button
                              type="button"
                              className="tlp-in-empty-cta"
                              onClick={openReview}
                            >
                              Write the first review
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Sample-only chrome below — only renders in preview mode. */}
                {isPreview && (<>
              <h2 className="tlp-sec-title">{view.companyName} pros, cons and reviews insights</h2>

              <div className="tlp-in-grid">
                {/* ── Left sidebar ── */}
                <aside className="tlp-in-left">
                  {/* Avatar stack + info icon */}
                  <div className="tlp-in-avatars">
                    <span className="tlp-in-av tlp-in-av--fill" aria-hidden="true">
                      <UserSilhouette />
                    </span>
                    <span className="tlp-in-av" style={{ background: '#C2B8A3' }} aria-hidden="true" />
                    <span className="tlp-in-av" style={{ background: '#D4A5A5' }} aria-hidden="true" />
                    <span className="tlp-in-avatars-info"><InfoIcon /></span>
                  </div>

                  <p className="tlp-in-disclaimer">
                    To determine these pros and cons insights, we analyzed responses from{' '}
                    <a href="#">17,580 verified reviews</a>
                  </p>

                  {/* Overall rating */}
                  <div className="tlp-in-block">
                    <h3 className="tlp-in-h3">Overall rating</h3>
                    <div className="tlp-in-rate-row">
                      <span className="tlp-in-rate-num">{overallRating.toFixed(1)}</span>
                      <Stars value={overallRating} size={15} />
                      <span className="tlp-in-rate-count">(17.5K)</span>
                      <span className="tlp-in-rate-chev"><ChevronDown /></span>
                    </div>
                  </div>

                  {/* Reviews sentiment */}
                  <div className="tlp-in-block">
                    <h3 className="tlp-in-h3">
                      Reviews sentiment
                      <span className="tlp-info-ico"><InfoIcon /></span>
                    </h3>
                    <div className="tlp-in-sent-bar">
                      <span className="tlp-in-sent-red" />
                      <span className="tlp-in-sent-yellow" />
                      <span className="tlp-in-sent-green" />
                    </div>
                    <div className="tlp-in-sent-breakdown">
                      <span>
                        <svg viewBox="0 0 24 24" width="14" height="14">
                          <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                        </svg>
                        <strong>1-2</strong>
                        <em>(276)</em>
                      </span>
                      <span>
                        <svg viewBox="0 0 24 24" width="14" height="14">
                          <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                        </svg>
                        <strong>3-4</strong>
                        <em>(7,001)</em>
                      </span>
                      <span>
                        <svg viewBox="0 0 24 24" width="14" height="14">
                          <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                        </svg>
                        <strong>5</strong>
                        <em>(10,303)</em>
                      </span>
                    </div>
                  </div>
                </aside>

                {/* ── Right content ── */}
                <div className="tlp-in-right">
                  <h3 className="tlp-in-q">What do users say about {view.companyName}?</h3>
                  <p className="tlp-in-p">
                    {view.tagline || view.description
                      || `${view.companyName} is a ${view.category.toLowerCase()} platform offering key features such as workflow automation, analytics, integrations, and team collaboration tools.`}
                  </p>

                  <h4 className="tlp-in-sub">Select to learn more</h4>
                  <div className="tlp-in-tags">
                    {(insightsExpanded ? TOPIC_CHIPS : TOPIC_CHIPS.slice(0, CHIPS_VISIBLE)).map(c => (
                      <button
                        key={c.label}
                        type="button"
                        className={`tlp-in-tag tlp-in-tag--${c.kind}`}
                      >
                        {c.kind === 'pos' && (
                          <span className="tlp-in-tag-ico tlp-in-tag-ico--pos"><PlusSm /></span>
                        )}
                        {c.kind === 'neg' && (
                          <span className="tlp-in-tag-ico tlp-in-tag-ico--neg"><XSm /></span>
                        )}
                        <span>{c.label}</span>
                      </button>
                    ))}
                    {!insightsExpanded && TOPIC_CHIPS.length > CHIPS_VISIBLE && (
                      <span className="tlp-in-tag tlp-in-tag--ghost">
                        +{TOPIC_CHIPS.length - CHIPS_VISIBLE} more
                      </span>
                    )}
                  </div>

                  <p className="tlp-in-long">
                    Users report {view.companyName}&apos;s capabilities are user-friendly,
                    with intuitive workflows and a polished interface. Reviewers indicate
                    {' '}{view.companyName} supports the core jobs they need it for, and integrates
                    cleanly with the platforms they already use. Users appreciate the analytics for
                    optimizing their workflows and the responsiveness of the product team. Some
                    reviewers mention limitations on lower-tier plans. They find
                    {' '}{view.companyName}&apos;s starter plan helpful for small businesses, though
                    advanced automation is mostly available in paid plans.
                  </p>

                  {/* Quote blocks */}
                  <div className="tlp-in-quotes">
                    {(insightsExpanded ? INSIGHT_QUOTES : INSIGHT_QUOTES.slice(0, QUOTES_VISIBLE)).map(q => (
                      <div key={q.name} className="tlp-in-quote">
                        <p className="tlp-in-quote-text">&ldquo;{swap(q.quote)}&rdquo;</p>
                        <div className="tlp-in-quote-who">
                          <span
                            className="tlp-in-quote-av"
                            style={{ background: q.color }}
                            aria-hidden="true"
                          >
                            {q.initials}
                          </span>
                          <div>
                            <div className="tlp-in-quote-name">
                              {q.name}
                              <LinkedInBadge />
                            </div>
                            <div className="tlp-in-quote-role">{q.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Single consolidated View more / Show less toggle */}
                  {(TOPIC_CHIPS.length > CHIPS_VISIBLE || INSIGHT_QUOTES.length > QUOTES_VISIBLE) && (
                    <button
                      type="button"
                      className={`tlp-in-more ${insightsExpanded ? 'is-open' : ''}`}
                      onClick={() => setInsightsExpanded(e => !e)}
                      aria-expanded={insightsExpanded}
                    >
                      <span>
                        {insightsExpanded
                          ? 'Show less'
                          : `View more (${TOPIC_CHIPS.length - CHIPS_VISIBLE} topics, ${INSIGHT_QUOTES.length - QUOTES_VISIBLE} more reviews)`}
                      </span>
                      <svg viewBox="0 0 24 24" width="14" height="14" className="tlp-in-more-chev" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
                </>)}
              </section>
            )}

            {/* ========== WHO USES — render real submitter-supplied lists, fall back
                to sample charts in preview only. ========== */}
            {(view.realIndustries || view.realUseCases || view.realCompanySizes || isPreview) && (
            <section id="who-uses" className="tlp-card">
              <div className="tlp-wu-head">
                <h2 className="tlp-sec-title">Who uses {view.companyName}?</h2>
                {isPreview && (
                  <div className="tlp-wu-meta">
                    Based on {reviewsCount.toLocaleString()} verified user reviews.{' '}
                    <a href="#" className="tlp-inline-link">Learn more</a>
                  </div>
                )}
              </div>

              {/* Real-mode: render the same 3-column grid (bars + donut + diamond)
                  using submitter-supplied data. Each column shows a clean empty card
                  when its array is missing. No fake percentages — visual size of each
                  slice is equal-share (the data IS "owner picked these"). */}
              {!isPreview && (view.realIndustries || view.realUseCases || view.realCompanySizes) && (() => {
                const TEAL_PALETTE = ['#006B6B','#0C9A9A','#4FB8B8','#7FD0D0','#A4DFDF','#B7E6E6','#CFEFEF','#DFF5F5']
                const SIZE_BARS: { label: string; match: string }[] = [
                  { label: 'Small Businesses',   match: 'Small' },
                  { label: 'Midsize Businesses', match: 'Mid' },
                  { label: 'Enterprises',        match: 'Enterprise' },
                ]
                const sizesPicked = view.realCompanySizes || []
                const inds        = (view.realIndustries || []).slice(0, 8)
                  .map((label, idx) => ({ label, color: TEAL_PALETTE[idx % TEAL_PALETTE.length] }))
                const ucs         = (view.realUseCases || [])
                const ucsTop5     = ucs.slice(0, 5)
                  .map((label, idx) => ({ label, color: TEAL_PALETTE[idx] }))
                const diamondSlots = ['tlp-wu-d--big', 'tlp-wu-d--top', 'tlp-wu-d--rt', 'tlp-wu-d--bot', 'tlp-wu-d--tr']
                return (
                  <div className="tlp-wu-grid">
                    {/* ── Column 1: Company size bars ── */}
                    <div className="tlp-wu-col">
                      <h3 className="tlp-wu-h3">Company size</h3>
                      {sizesPicked.length > 0 ? (
                        <div className="tlp-wu-bars">
                          {SIZE_BARS.map(({ label, match }) => {
                            const picked = sizesPicked.some(s => s.startsWith(match))
                            return (
                              <div key={label} className={`tlp-wu-bar ${picked ? '' : 'is-faded'}`}>
                                <div className="tlp-wu-bar-track">
                                  <div className="tlp-wu-bar-fill" style={{ height: picked ? '100%' : '12%' }} />
                                </div>
                                <div className="tlp-wu-bar-label">{label}</div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="tlp-wu-empty">Not specified yet</div>
                      )}
                    </div>

                    {/* ── Column 2: Industries donut (equal-share slices) ── */}
                    <div className="tlp-wu-col">
                      <h3 className="tlp-wu-h3">Industries</h3>
                      {inds.length > 0 ? (() => {
                        const total  = inds.length
                        const r      = 52
                        const cx     = 70, cy = 70
                        const baseSt = 22
                        const circ   = 2 * Math.PI * r
                        const frac   = 1 / total
                        const dash   = circ * frac
                        return (
                          <div className="tlp-wu-donut-wrap">
                            <div className="tlp-wu-donut-box">
                              <svg viewBox="0 0 140 140" className="tlp-wu-donut">
                                {inds.map((i, idx) => {
                                  const rotate = (idx / total) * 360 - 90
                                  const isHot  = industryHover === idx
                                  const faded  = industryHover !== null && !isHot
                                  return (
                                    <circle
                                      key={i.label}
                                      r={r} cx={cx} cy={cy}
                                      fill="none"
                                      stroke={i.color}
                                      strokeWidth={isHot ? baseSt + 4 : baseSt}
                                      strokeDasharray={`${dash} ${circ - dash}`}
                                      transform={`rotate(${rotate} ${cx} ${cy})`}
                                      opacity={faded ? 0.45 : 1}
                                      style={{ cursor: 'pointer', transition: 'stroke-width .18s ease, opacity .18s ease' }}
                                      onMouseEnter={() => setIndustryHover(idx)}
                                      onMouseLeave={() => setIndustryHover(null)}
                                    />
                                  )
                                })}
                              </svg>
                              {industryHover !== null && (
                                <div className="tlp-wu-tooltip" aria-hidden="true">
                                  {inds[industryHover].label}
                                </div>
                              )}
                            </div>
                            <ul className="tlp-wu-legend">
                              {inds.map((i, idx) => (
                                <li
                                  key={i.label}
                                  className={industryHover === idx ? 'is-active' : ''}
                                  onMouseEnter={() => setIndustryHover(idx)}
                                  onMouseLeave={() => setIndustryHover(null)}
                                >
                                  <span className="tlp-wu-dot" style={{ background: i.color }} />
                                  <span className="tlp-wu-lbl">{i.label}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      })() : (
                        <div className="tlp-wu-empty">Not specified yet</div>
                      )}
                    </div>

                    {/* ── Column 3: Use cases diamond cluster ── */}
                    <div className="tlp-wu-col">
                      <h3 className="tlp-wu-h3">Use cases</h3>
                      {ucs.length > 0 ? (
                        <div className="tlp-wu-uc-wrap">
                          <div className="tlp-wu-diamonds" aria-hidden="true">
                            {ucsTop5.map((u, idx) => (
                              <span
                                key={u.label}
                                className={`tlp-wu-d ${diamondSlots[idx]}`}
                                style={{ background: u.color }}
                              />
                            ))}
                          </div>
                          <ul className="tlp-wu-legend">
                            {ucs.map((u, idx) => (
                              <li key={u}>
                                <span
                                  className="tlp-wu-dot tlp-wu-dot--sq"
                                  style={{ background: idx < 5 ? TEAL_PALETTE[idx] : '#9CA3AF' }}
                                />
                                <span className="tlp-wu-lbl">{u}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="tlp-wu-empty">Not specified yet</div>
                      )}
                    </div>
                  </div>
                )
              })()}

              {/* Sample-only chrome (donut + diamond + bars). */}
              {isPreview && (<>

              <div className="tlp-wu-grid">

                {/* ── Column 1: Company size (vertical capsule bars) ── */}
                <div className="tlp-wu-col">
                  <h3 className="tlp-wu-h3">Company size</h3>
                  <div className="tlp-wu-bars">
                    {COMPANY_SIZE.map(c => (
                      <div key={c.label} className="tlp-wu-bar">
                        <div className="tlp-wu-bar-track">
                          <div className="tlp-wu-bar-fill" style={{ height: `${c.pct}%` }} />
                        </div>
                        <div className="tlp-wu-bar-label">{c.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Column 2: Industries (teal-shade donut + legend, hover-driven tooltip) ── */}
                <div className="tlp-wu-col">
                  <h3 className="tlp-wu-h3">Industries</h3>
                  <div className="tlp-wu-donut-wrap">
                    <div className="tlp-wu-donut-box">
                      <svg viewBox="0 0 140 140" className="tlp-wu-donut">
                        {(() => {
                          const total  = INDUSTRY.reduce((s, i) => s + i.value, 0)
                          const r      = 52
                          const cx     = 70, cy = 70
                          const baseSt = 22
                          const circ   = 2 * Math.PI * r
                          let cursor   = 0
                          return INDUSTRY.map((i, idx) => {
                            const frac   = i.value / total
                            const dash   = circ * frac
                            const rotate = (cursor / total) * 360 - 90
                            cursor += i.value
                            const isHot  = industryHover === idx
                            const faded  = industryHover !== null && !isHot
                            return (
                              <circle
                                key={i.label}
                                r={r} cx={cx} cy={cy}
                                fill="none"
                                stroke={i.color}
                                strokeWidth={isHot ? baseSt + 4 : baseSt}
                                strokeDasharray={`${dash} ${circ - dash}`}
                                transform={`rotate(${rotate} ${cx} ${cy})`}
                                opacity={faded ? 0.45 : 1}
                                style={{ cursor: 'pointer', transition: 'stroke-width .18s ease, opacity .18s ease' }}
                                onMouseEnter={() => setIndustryHover(idx)}
                                onMouseLeave={() => setIndustryHover(null)}
                              />
                            )
                          })
                        })()}
                      </svg>
                      {industryHover !== null && (
                        <div className="tlp-wu-tooltip" aria-hidden="true">
                          {INDUSTRY[industryHover].value}% ({INDUSTRY[industryHover].reviews.toLocaleString()} reviews)
                        </div>
                      )}
                    </div>
                    <ul className="tlp-wu-legend">
                      {INDUSTRY.map((i, idx) => (
                        <li
                          key={i.label}
                          className={industryHover === idx ? 'is-active' : ''}
                          onMouseEnter={() => setIndustryHover(idx)}
                          onMouseLeave={() => setIndustryHover(null)}
                        >
                          <span className="tlp-wu-dot" style={{ background: i.color }} />
                          <span className="tlp-wu-lbl">{i.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ── Column 3: Use cases (diamond cluster + legend) ── */}
                <div className="tlp-wu-col">
                  <h3 className="tlp-wu-h3">Use cases</h3>
                  <div className="tlp-wu-uc-wrap">
                    <div className="tlp-wu-diamonds" aria-hidden="true">
                      <span className="tlp-wu-d tlp-wu-d--big"  style={{ background: USE_CASES[0].color }} />
                      <span className="tlp-wu-d tlp-wu-d--top"  style={{ background: USE_CASES[4].color }} />
                      <span className="tlp-wu-d tlp-wu-d--rt"   style={{ background: USE_CASES[2].color }} />
                      <span className="tlp-wu-d tlp-wu-d--bot"  style={{ background: USE_CASES[1].color }} />
                      <span className="tlp-wu-d tlp-wu-d--tr"   style={{ background: USE_CASES[3].color }} />
                    </div>
                    <ul className="tlp-wu-legend">
                      {USE_CASES.map(u => (
                        <li key={u.label}>
                          <span className="tlp-wu-dot tlp-wu-dot--sq" style={{ background: u.color }} />
                          <span className="tlp-wu-lbl">{u.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
              </>)}
            </section>
            )}

            {/* ========== KEY FEATURES — always render section (empty-state when
                neither realKeyFeatures nor realFeatures is provided). ========== */}
            <section id="key-features" className="tlp-sec tlp-kf-sec">
              <h2 className="tlp-sec-title tlp-kf-title">{view.companyName}&apos;s key features</h2>

              {isPreview ? (
                <p className="tlp-kf-intro">
                  <a href="#" className="tlp-inline-link">Based on our analysis</a>{' '}
                  of 984 verified user reviews collected between July 2021 and January 2026,
                  these are {view.companyName}&apos;s most critical features along with user sentiment
                  summarized beneath each one.{' '}
                  <a href="#" className="tlp-inline-link">Learn more about our reviews.</a>
                </p>
              ) : (view.realKeyFeatures || view.realFeatures) && (
                <p className="tlp-kf-intro">
                  Top features {view.companyName} highlights about themselves — what the team considers most important about the product.
                </p>
              )}

              {(() => {
                /* Source priority: realKeyFeatures (rich) → first 6 of realFeatures
                   mapped to name-only → preview sample → empty state. */
                let list: Feature[] = []
                if (view.realKeyFeatures) {
                  list = view.realKeyFeatures.map(kf => ({ name: kf.name, rating: 0, desc: kf.description || '' }))
                } else if (view.realFeatures) {
                  list = view.realFeatures.slice(0, 6).map(name => ({ name, rating: 0, desc: '' }))
                } else if (isPreview) {
                  list = KEY_FEATURES
                }
                if (list.length === 0) {
                  return (
                    <div className="tlp-empty-card">
                      <span className="tlp-empty-ico" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                        </svg>
                      </span>
                      <div className="tlp-empty-body">
                        <div className="tlp-empty-title">Key features coming soon</div>
                        <div className="tlp-empty-sub">{view.companyName} hasn&apos;t highlighted their top features yet.</div>
                      </div>
                    </div>
                  )
                }
                const visible = keyFeaturesExpanded ? list : list.slice(0, KEY_FEATURES_VISIBLE)
                return (
                  <>
                    <dl className="tlp-kf-list">
                      {visible.map(f => (
                        <div key={f.name} className="tlp-kf-row">
                          <dt className="tlp-kf-name">{f.name}</dt>
                          <dd className="tlp-kf-body">
                            {f.desc && <p className="tlp-kf-desc">{swap(f.desc)}</p>}
                            {f.rating > 0 && (
                              <span className="tlp-kf-rate">
                                <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                                  <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                                </svg>
                                <span>{f.rating.toFixed(1)}</span>
                              </span>
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {list.length > KEY_FEATURES_VISIBLE && (
                      <button
                        type="button"
                        className={`tlp-kf-more ${keyFeaturesExpanded ? 'is-open' : ''}`}
                        onClick={() => setKeyFeaturesExpanded(e => !e)}
                        aria-expanded={keyFeaturesExpanded}
                      >
                        <span>
                          {keyFeaturesExpanded
                            ? 'Show less'
                            : `View ${list.length - KEY_FEATURES_VISIBLE} more features`}
                        </span>
                        <svg viewBox="0 0 24 24" width="14" height="14" className="tlp-kf-more-chev" aria-hidden="true">
                          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                  </>
                )
              })()}

              {/* ── All features (inline, same section). Renders submitter list, or
                  an empty-state card when the owner has not shared one yet. ── */}
              <div id="all-features" className="tlp-af">
                <div className="tlp-af-head">
                  <div className="tlp-af-heading">
                    <h3 className="tlp-af-title">
                      All {view.companyName} features
                      {allFeatures.length > 0 && (
                        <span className="tlp-af-count" aria-hidden="true">
                          {featureQ.trim()
                            ? `· ${filteredFeatures.length} of ${allFeatures.length}`
                            : `· ${allFeatures.length}`}
                        </span>
                      )}
                    </h3>
                    {isPreview && (
                      <div className="tlp-af-meta">
                        <span>Features rating:</span>
                        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                          <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                        </svg>
                        <strong>4.4</strong>
                        <em>(17.5K)</em>
                      </div>
                    )}
                  </div>
                  {allFeatures.length > 9 && (
                    <div className="tlp-af-search">
                      <input
                        type="text"
                        placeholder="Search for a feature"
                        value={featureQ}
                        onChange={e => setFeatureQ(e.target.value)}
                      />
                      <svg viewBox="0 0 24 24" className="tlp-af-search-ico" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </div>

                {filteredFeatures.length > 0 ? (
                  <>
                    <div className="tlp-af-grid">
                      {(featuresExpanded ? filteredFeatures : filteredFeatures.slice(0, 9)).map(
                        ([name, rating, count]) => (
                          <div key={String(name)} className="tlp-af-row">
                            <span className="tlp-af-check" aria-hidden="true">
                              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            <span className="tlp-af-name">{highlightMatch(String(name), featureQ)}</span>
                            {Number(rating) > 0 && (
                              <span className="tlp-af-rate">
                                <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                                  <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                                </svg>
                                <strong>{Number(rating).toFixed(1)}</strong>
                                <em>({String(count)})</em>
                              </span>
                            )}
                          </div>
                        )
                      )}
                    </div>
                    {filteredFeatures.length > 9 && (
                      <button
                        type="button"
                        className="tlp-af-expand"
                        onClick={() => setFeaturesExpanded(!featuresExpanded)}
                      >
                        <span>{featuresExpanded ? 'Collapse list' : 'Expand list'}</span>
                        <span className={`tlp-af-expand-chev ${featuresExpanded ? 'is-open' : ''}`}>
                          <ChevronDown />
                        </span>
                      </button>
                    )}
                  </>
                ) : featureQ.trim() ? (
                  <div className="tlp-af-empty-search" role="status" aria-live="polite">
                    <span className="tlp-af-empty-search-ico" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M20 20l-3.5-3.5" />
                      </svg>
                    </span>
                    <div className="tlp-af-empty-search-body">
                      <div className="tlp-af-empty-search-title">
                        No features match &ldquo;<strong>{featureQ.trim()}</strong>&rdquo;
                      </div>
                      <div className="tlp-af-empty-search-sub">
                        Try a different search term or clear the search to see all {allFeatures.length} features.
                      </div>
                    </div>
                    <button
                      type="button"
                      className="tlp-af-empty-search-clear"
                      onClick={() => setFeatureQ('')}
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  <div className="tlp-empty-card">
                    <span className="tlp-empty-ico" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="16" rx="3" />
                        <path d="M7 9h10M7 13h7M7 17h4" />
                      </svg>
                    </span>
                    <div className="tlp-empty-body">
                      <div className="tlp-empty-title">Full feature list coming soon</div>
                      <div className="tlp-empty-sub">{view.companyName} hasn&apos;t shared the complete feature breakdown yet. Check back soon.</div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ========== ALTERNATIVES — server-derived from category siblings,
                falls back to the rich ALTERNATIVES sample in preview mode. ========== */}
            {(siblings.length > 0 || isPreview) && (
            <section id="alternatives" className="tlp-sec">
              <h2 className="tlp-sec-title">{view.companyName} alternatives</h2>

              {/* Real mode: rich card grid matching the test-page visual. Uses
                  ONLY submitter data — no fake ratings, no fake free-trial flags. */}
              {!isPreview && siblings.length > 0 && (
                <div className="tlp-alt-grid">
                  {siblings.slice(0, 4).map(s => {
                    const sDomain = s.website ? String(s.website).replace(/^https?:\/\//, '').split('/')[0] : ''
                    const sLogo = s.logo_url || (sDomain ? clearbit(sDomain, 128) : '')
                    const sPrice = formatStartingPrice(s.starting_price)
                    const priceNum = sPrice && sPrice.kind === 'paid' ? sPrice.num : ''
                    const isFreePrice = !!sPrice && sPrice.kind === 'free'
                    return (
                      <div key={s.id} className="tlp-alt">
                        <div className="tlp-alt-head">
                          {sLogo
                            ? <img src={sLogo} alt={`${s.company_name} logo`} className="tlp-alt-logo" />
                            : <span className="tlp-alt-logo tlp-alt-logo--letter" aria-hidden="true">{s.company_name.charAt(0).toUpperCase()}</span>}
                          <div className="tlp-alt-head-right">
                            <div className="tlp-alt-name">{s.company_name}</div>
                            {s.category_name && <div className="tlp-alt-sub">{s.category_name}</div>}
                          </div>
                        </div>

                        <div className="tlp-alt-cta-row">
                          <a href={`/listing/${s.slug}`} className="tlp-alt-cta">Learn More</a>
                          <a
                            href={`/compare/${listingSlug}-vs-${s.slug}`}
                            className="tlp-alt-cta tlp-alt-cta--outline"
                            aria-label={`Compare ${view.companyName} with ${s.company_name}`}
                          >
                            Compare
                          </a>
                        </div>

                        <div className="tlp-alt-price-block">
                          <div className="tlp-alt-price-head">
                            <span>Starting from</span>
                            <span className="tlp-info-ico"><InfoIcon /></span>
                          </div>
                          {isFreePrice ? (
                            <div className="tlp-alt-price">
                              <span className="tlp-alt-price-num">Free</span>
                            </div>
                          ) : priceNum ? (
                            <div className="tlp-alt-price">
                              <span className="tlp-alt-price-sym">$</span>
                              <span className="tlp-alt-price-num">{priceNum}</span>
                            </div>
                          ) : (
                            <div className="tlp-alt-price tlp-alt-price--none">
                              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                                <circle cx="12" cy="12" r="9" fill="none" stroke="#D1D5DB" strokeWidth="1.8" />
                                <path d="M12 7v5l3 3" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
                              </svg>
                            </div>
                          )}
                          <div className="tlp-alt-period">{
                            isFreePrice
                              ? (s.starting_price_period || 'forever')
                              : (s.starting_price_period || (priceNum ? '' : 'Pricing not shared'))
                          }</div>
                        </div>

                        {s.tagline && <p className="tlp-alt-tagline">{s.tagline}</p>}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Preview mode: the original rich ALTERNATIVES sample cards. */}
              {isPreview && (
              <div className="tlp-alt-grid">
                {ALTERNATIVES.map(a => {
                  // The "highlighted" column represents the listing being viewed
                  // — substitute the real company identity for that one row.
                  const name = a.highlight ? view.companyName : a.name
                  const logo = a.highlight ? view.logoUrl : clearbit(a.domain)
                  return (
                  <div key={a.name} className={`tlp-alt ${a.highlight ? 'tlp-alt--hl' : ''}`}>
                    {/* Logo + name + rating row */}
                    <div className="tlp-alt-head">
                      <img src={logo} alt={`${name} logo`} className="tlp-alt-logo" />
                      <div className="tlp-alt-head-right">
                        <div className="tlp-alt-name">{name}</div>
                        <div className="tlp-alt-mini-rating">
                          <svg viewBox="0 0 24 24" width="12" height="12">
                            <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                          </svg>
                          <strong>{a.rating.toFixed(1)}</strong>
                          <em>({a.reviews})</em>
                        </div>
                      </div>
                    </div>

                    <a href="#" className="tlp-alt-cta">Learn More</a>

                    {/* Starting from block */}
                    <div className="tlp-alt-price-block">
                      <div className="tlp-alt-price-head">
                        <span>Starting from</span>
                        <span className="tlp-info-ico"><InfoIcon /></span>
                      </div>
                      {a.startingPrice ? (
                        <div className="tlp-alt-price">
                          <span className="tlp-alt-price-sym">$</span>
                          <span className="tlp-alt-price-num">{a.startingPrice}</span>
                        </div>
                      ) : (
                        <div className="tlp-alt-price tlp-alt-price--none">
                          <svg viewBox="0 0 24 24" width="22" height="22">
                            <circle cx="12" cy="12" r="9" fill="none" stroke="#D1D5DB" strokeWidth="1.8" />
                            <path d="M8 12l2.5 2.5L16 9" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                      <div className="tlp-alt-period">{a.period}</div>

                      <ul className="tlp-alt-flags">
                        <li>
                          <span>Free trial</span>
                          {a.freeTrial
                            ? <span className="tlp-alt-yes"><CheckSm /></span>
                            : <span className="tlp-alt-no"><XSm /></span>}
                        </li>
                        <li>
                          <span>Free version</span>
                          {a.freeVersion
                            ? <span className="tlp-alt-yes"><CheckSm /></span>
                            : <span className="tlp-alt-no"><XSm /></span>}
                        </li>
                      </ul>
                    </div>

                    {/* Detailed rating list */}
                    <ul className="tlp-alt-ratings">
                      {([
                        ['Ease of Use',       a.ratings.ease],
                        ['Features',          a.ratings.features],
                        ['Value for Money',   a.ratings.value],
                        ['Customer Support',  a.ratings.support],
                      ] as [string, AltRating][]).map(([label, v]) => (
                        <li key={label}>
                          <svg viewBox="0 0 24 24" width="12" height="12">
                            <path fill={v != null ? '#FFA91C' : '#E5E7EB'}
                              d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                          </svg>
                          <span>{label}</span>
                          {v != null && <em>{v.toFixed(1)}</em>}
                        </li>
                      ))}
                    </ul>
                  </div>
                  )
                })}
              </div>
              )}
            </section>
            )}

            {/* ========== INBOX FORM — captures lead emails per listing.
                Hidden in real mode if no listing id (defensive). ========== */}
            {(listingId > 0 || isPreview) && (
            <section className="tlp-sec tlp-inbox">
              <div className="tlp-inbox-card">
                <h2 className="tlp-inbox-title">Send this {view.companyName ? `${view.companyName} ` : ''}info to my inbox</h2>
                {inboxStatus === 'ok' ? (
                  <p className="tlp-inbox-success">Got it — we&apos;ll email you the listing details shortly.</p>
                ) : (
                  <form className="tlp-inbox-form" onSubmit={submitInboxEmail}>
                    <label className="tlp-inbox-label">Email Address <span>*</span></label>
                    <input
                      className="tlp-inbox-input"
                      type="email"
                      required
                      value={inboxEmail}
                      onChange={e => setInboxEmail(e.target.value)}
                      disabled={inboxStatus === 'sending'}
                    />
                    <div className="tlp-inbox-foot">
                      <p className="tlp-inbox-legal">
                        By proceeding, you agree to our <a href="/terms">Terms Of Use</a> and <a href="/privacy">Privacy Policy</a>.
                      </p>
                      <button type="submit" className="tlp-inbox-btn" disabled={inboxStatus === 'sending'}>
                        {inboxStatus === 'sending' ? 'Sending…' : 'Send me the info'}
                      </button>
                    </div>
                    {inboxStatus === 'err' && (
                      <p className="tlp-inbox-error">Something went wrong. Please try again.</p>
                    )}
                  </form>
                )}
              </div>
            </section>
            )}

            {/* ========== PRICING ========== */}
            {(view.realPricing || isPreview) && (
            <section id="pricing" className="tlp-sec">
              <h2 className="tlp-sec-title">{view.companyName} pricing</h2>

              {isPreview && (
                <div className="tlp-price-meta">
                  <span>Value for money rating:</span>
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                  </svg>
                  <strong>4.4</strong>
                </div>
              )}

              <div className="tlp-price-sub">Pricing plans</div>
              {(view.realHasFreeTrial || view.realHasFreeVersion || isPreview) && (
                <div className="tlp-price-flags">
                  <span>Pricing details:</span>
                  {view.realHasFreeVersion && <span className="tlp-price-flag">Free plan <CheckSm /></span>}
                  {view.realHasFreeTrial && <span className="tlp-price-flag">Free trial <CheckSm /></span>}
                  {isPreview && !view.realHasFreeVersion && <span className="tlp-price-flag">Free plan <CheckSm /></span>}
                  {isPreview && !view.realHasFreeTrial && <span className="tlp-price-flag">Free trial <CheckSm /></span>}
                  {isPreview && <span className="tlp-price-flag">Subscription <CheckSm /></span>}
                </div>
              )}

              {(() => {
                const plans = view.realPricing
                  ? view.realPricing.map(p => ({
                      name: p.name || '',
                      price: p.price || '',
                      period: p.period || '',
                      features: p.features || [],
                    }))
                  : (isPreview ? PRICING_PLANS.map(p => ({ ...p, period: 'Per month' })) : [])
                if (plans.length === 0) return null
                const useCarousel = plans.length > 3
                const grid = (
                  <div
                    className={`tlp-pricing-grid${useCarousel ? ' tlp-pricing-grid--carousel' : ''}`}
                    data-count={plans.length}
                  >
                    {plans.map((p, idx) => {
                      const priceStr = String(p.price || '').trim()
                      const priceNum = priceStr.replace(/[^\d.]/g, '')
                      /* Explicit zero / "free" → Free. Empty/null/non-numeric
                         → Custom (NOT Free) so an unfilled Enterprise tier
                         doesn't accidentally read as a $0 freebie. */
                      const isFree   = /^(free|0(?:\.0+)?)$/i.test(priceStr) || (priceNum !== '' && parseFloat(priceNum) === 0)
                      const isCustom = !isFree && (priceStr === '' || priceNum === '' || /^(custom|contact(?: sales)?|enterprise|let'?s talk)$/i.test(priceStr))
                      // Parse price into integer + decimal parts for premium
                      // Apple-style typography (small decimal trailing the big digits).
                      let intPart = priceStr
                      let decPart: string | null = null
                      if (!isFree && !isCustom) {
                        const m = priceStr.match(/^(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?/)
                        if (m) {
                          intPart = m[1]
                          if (m[2] && parseInt(m[2], 10) > 0) decPart = m[2]
                        }
                      }
                      // Normalize the period string so the inline render is always
                      // "/ <unit>" — strip a leading "/" (so user-supplied "/ month"
                      // doesn't double-slash) AND a leading "Per " prefix.
                      const periodInline = p.period
                        ? p.period.replace(/^\s*\/\s*/, '').replace(/^per\s+/i, '').trim()
                        : ''
                      // Cycle through 5 pastel color variants by index
                      const COLOR_PALETTE = ['peach', 'lavender', 'mint', 'pink', 'sky']
                      const colorVariant = COLOR_PALETTE[idx % COLOR_PALETTE.length]
                      return (
                        <article
                          key={p.name || `plan-${idx}`}
                          className="tlp-plan"
                          data-color={colorVariant}
                        >
                          <div className="tlp-plan-top">
                            <div className="tlp-plan-price">
                              {isFree ? (
                                <span className="tlp-plan-amt">Free</span>
                              ) : isCustom ? (
                                <span className="tlp-plan-amt">Custom</span>
                              ) : (
                                <>
                                  <span className="tlp-plan-sym">$</span>
                                  <span className="tlp-plan-amt">{intPart}</span>
                                  {decPart && <span className="tlp-plan-dec">.{decPart}</span>}
                                </>
                              )}
                              {!isFree && !isCustom && periodInline && (
                                <span className="tlp-plan-per-inline">/ {periodInline}</span>
                              )}
                            </div>
                            {p.name && <div className="tlp-plan-name">{p.name}</div>}
                            {view.website && (
                              <a
                                href={withInfoWebWorldUtm(view.website, listingSlug)}
                                target="_blank"
                                rel={listingOutboundRel(real?.plan)}
                                className="tlp-plan-cta"
                                onClick={() => trackWebsiteClick(listingSlug, 'listing')}
                              >
                                Get Started
                              </a>
                            )}
                          </div>
                          {p.features && p.features.length > 0 && (
                            <ul className="tlp-plan-feat">
                              {p.features.map((f: string) => (
                                <li key={f}>
                                  <span className="tlp-plan-feat-check" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M5 13l4 4L19 7" />
                                    </svg>
                                  </span>
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </article>
                      )
                    })}
                  </div>
                )
                return useCarousel ? <PricingCarousel>{grid}</PricingCarousel> : grid
              })()}

              {isPreview && (
                <>
                  <h3 className="tlp-vo-title">User opinions about {view.companyName} price and value</h3>
                  <div className="tlp-price-meta">
                    <span>Value for money rating:</span>
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                    </svg>
                    <strong>4.4</strong>
                    <em>(17.5K)</em>
                  </div>
                  <p className="tlp-sec-lead">
                    To see what individual users think of {view.companyName}&apos;s price and value, check out the review snippets below.
                  </p>
                  <div className="tlp-vo-grid">
                    {VALUE_QUOTES.map(v => (
                      <div key={v.name} className="tlp-vo">
                        <div className="tlp-vo-badge">
                          <span className="tlp-vo-badge-ico"><CheckSm /></span>
                          Highly Relevant
                        </div>
                        <p className="tlp-vo-q">&ldquo;{swap(v.quote)}&rdquo;</p>
                        <div className="tlp-vo-who">
                          <span className="tlp-vo-av" style={{ background: v.color }}>{v.initials}</span>
                          <div>
                            <div className="tlp-vo-name">
                              {v.name}
                              <LinkedInBadge />
                            </div>
                            <div className="tlp-vo-role">{v.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Real-mode: same User Opinions block, sourced from real reviews
                  with a Write-a-review CTA when none exist yet. No fake quotes. */}
              {!isPreview && (
                <>
                  <h3 className="tlp-vo-title">User opinions about {view.companyName} price and value</h3>
                  <div className="tlp-price-meta">
                    <span>Value for money rating:</span>
                    {hasReviews ? (
                      <>
                        <svg viewBox="0 0 24 24" width="14" height="14">
                          <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                        </svg>
                        <strong>{overallRating.toFixed(1)}</strong>
                        <em>({realReviewCount.toLocaleString()})</em>
                      </>
                    ) : (
                      <span className="tlp-vo-norating">No ratings yet</span>
                    )}
                  </div>

                  {hasReviews && reviewsData && reviewsData.recent.length > 0 ? (
                    <>
                      <p className="tlp-sec-lead">
                        Review snippets covering pricing and value from {view.companyName} customers.
                      </p>
                      <div className="tlp-vo-grid">
                        {reviewsData.recent.slice(0, 4).map((rev) => {
                          const r = rev as unknown as ReviewRow
                          const initials = (r.user_name || '?').slice(0, 2).toUpperCase()
                          return (
                            <div key={r.id} className="tlp-vo">
                              <p className="tlp-vo-q">&ldquo;{r.body}&rdquo;</p>
                              <div className="tlp-vo-who">
                                {r.user_avatar_url
                                  ? <img src={r.user_avatar_url} alt="" className="tlp-vo-av tlp-vo-av--img" />
                                  : <span className="tlp-vo-av" style={{ background: '#0C9A9A' }}>{initials}</span>}
                                <div>
                                  <div className="tlp-vo-name">{r.user_name || 'Anonymous'}</div>
                                  <div className="tlp-vo-role">
                                    <Stars value={Number(r.rating)} size={12} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="tlp-vo-empty">
                      <span className="tlp-vo-empty-ico" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                        </svg>
                      </span>
                      <div className="tlp-vo-empty-body">
                        <h4 className="tlp-vo-empty-title">What do you think of {view.companyName} pricing?</h4>
                        <p className="tlp-vo-empty-sub">
                          Share your experience — your review will appear here and help future buyers compare value for money.
                        </p>
                        <button
                          type="button"
                          className="tlp-vo-empty-cta"
                          onClick={openReview}
                        >
                          Write a review
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
            )}

            {/* ========== INTEGRATIONS ========== */}
            {(view.realIntegrations || isPreview) && (
            <section id="integrations" className="tlp-sec">
              <div className="tlp-int-title-row">
                <h2 className="tlp-sec-title" style={{ margin: 0 }}>
                  {view.companyName} integrations
                  {view.realIntegrations ? ` (${view.realIntegrations.length})` : (isPreview ? ' (2,089)' : '')}
                </h2>
                {isPreview && (
                  <div className="tlp-af-search tlp-int-search">
                    <input
                      type="text"
                      placeholder="Search for an integration"
                      value={integrationQ}
                      onChange={e => setIntegrationQ(e.target.value)}
                    />
                    <svg viewBox="0 0 24 24" className="tlp-af-search-ico" aria-hidden="true">
                      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Real-mode: rich card grid. Each card uses the partner's website
                  to pull a logo and renders the submitter's description. Items
                  with no website fall back to a letter tile. No fake ratings,
                  no fake reviewer quotes. */}
              {view.realIntegrations && !isPreview && (() => {
                const rich = view.realIntegrations.filter(i => i.website || i.description)
                const simple = view.realIntegrations.filter(i => !i.website && !i.description)
                return (
                  <>
                    {rich.length > 0 && (
                      <div className="tlp-int-grid">
                        {rich.map(i => {
                          const domain = i.website ? String(i.website).replace(/^https?:\/\//, '').split('/')[0] : ''
                          const logo = domain ? clearbit(domain, 128) : ''
                          return (
                            <div key={i.name} className="tlp-int-card">
                              <div className="tlp-int-card-head">
                                {logo
                                  ? <img src={logo} alt={`${i.name} logo`} className="tlp-int-logo" />
                                  : <span className="tlp-int-logo tlp-int-logo--letter" aria-hidden="true">{i.name.charAt(0).toUpperCase()}</span>}
                                <div className="tlp-int-head-info">
                                  <div className="tlp-int-name">{i.name}</div>
                                  {i.website && (
                                    <a
                                      href={withInfoWebWorldUtm(i.website, listingSlug)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="tlp-int-link"
                                      onClick={() => trackWebsiteClick(listingSlug, 'integrations')}
                                    >
                                      {domain || 'Visit site'}
                                    </a>
                                  )}
                                </div>
                              </div>
                              {i.description && (
                                <p className="tlp-int-desc">{i.description}</p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                    {simple.length > 0 && (
                      <>
                        {rich.length > 0 && <div className="tlp-int-also">Also integrates with</div>}
                        <div className="tlp-int-chips">
                          {simple.map(i => (
                            <span key={i.name} className="tlp-int-chip">{i.name}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )
              })()}

              {isPreview && (<>
              <h3 className="tlp-int-sub">Integrations rated by users</h3>
              <p className="tlp-int-intro">
                We looked at user reviews to identify which products are mentioned as
                {' '}{view.companyName} integrations and how users feel about them.{' '}
                <a href="#" className="tlp-inline-link">Learn more about our reviews.</a>
              </p>

              <div className="tlp-int-grid">
                {(integrationQ ? filteredIntegrations : INTEGRATIONS).map(i => (
                  <div key={i.name} className="tlp-int-card">
                    <div className="tlp-int-card-head">
                      <img src={clearbit(i.domain)} alt={`${i.name} logo`} className="tlp-int-logo" />
                      <div className="tlp-int-head-info">
                        <div className="tlp-int-name">{i.name}</div>
                        <span className="tlp-int-tag">{(i as typeof INTEGRATIONS[number]).tag ?? 'Must-Have'}</span>
                      </div>
                      <div className="tlp-int-rate">
                        <div className="tlp-int-rate-lbl">Integration rating:</div>
                        <div className="tlp-int-rate-val">
                          <svg viewBox="0 0 24 24" width="13" height="13">
                            <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                          </svg>
                          <strong>{i.rating.toFixed(1)}</strong>
                          <em>({(i as typeof INTEGRATIONS[number]).reviewCount ?? 0})</em>
                        </div>
                      </div>
                    </div>
                    <p className="tlp-int-quote">
                      &ldquo;{swap((i as typeof INTEGRATIONS[number]).quote ?? '')}&rdquo;
                    </p>
                    <div className="tlp-int-foot">
                      <div className="tlp-int-author">
                        <span
                          className="tlp-int-av"
                          style={{ background: (i as typeof INTEGRATIONS[number]).authorColor ?? '#6B7280' }}
                        >
                          {(i as typeof INTEGRATIONS[number]).authorInitials ?? ''}
                        </span>
                        <div>
                          <div className="tlp-int-author-name">
                            {(i as typeof INTEGRATIONS[number]).author ?? ''}
                          </div>
                          <div className="tlp-int-author-role">
                            {(i as typeof INTEGRATIONS[number]).authorRole ?? ''}
                          </div>
                        </div>
                      </div>
                      <div className="tlp-int-pager" aria-hidden="true">
                        <button type="button" className="tlp-int-arrow"><ArrowLeftSm /></button>
                        <span>
                          {(i as typeof INTEGRATIONS[number]).pageNum ?? 1}
                          /{(i as typeof INTEGRATIONS[number]).pageOf ?? 1}
                        </span>
                        <button type="button" className="tlp-int-arrow tlp-int-arrow--r">
                          <ArrowLeftSm />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" className="tlp-int-expand">
                Expand list <ChevronDown />
              </button>
              </>)}
            </section>
            )}

            {/* ========== CUSTOMER SUPPORT — Trustpilot-style 2-col layout.
                LEFT: question → inline rating → intro → mixed pros/cons bullets
                RIGHT: bordered card containing Support + Training option lists
                BELOW: review-snippet quote cards with "Highly Relevant" tag
                ============================================================ */}
            <section id="support" className="tlp-sec">
              <h2 className="tlp-sec-title">{view.companyName} customer support</h2>

              <div className="tlp-cs-grid">
                {/* ── LEFT column ── */}
                <div className="tlp-cs-main">
                  <h3 className="tlp-cs-q">What do users say about {view.companyName} customer support?</h3>

                  <div className="tlp-cs-rate">
                    <span className="tlp-cs-rate-lbl">Customer support rating:</span>
                    {isPreview ? (
                      <>
                        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                          <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                        </svg>
                        <strong>4.4</strong>
                      </>
                    ) : hasReviews ? (
                      <>
                        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                          <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                        </svg>
                        <strong>{overallRating.toFixed(1)}</strong>
                        <em>({realReviewCount.toLocaleString()})</em>
                      </>
                    ) : (
                      <span className="tlp-cs-rate-norating">No ratings yet</span>
                    )}
                  </div>

                  <p className="tlp-cs-intro">
                    {isPreview ? (
                      <>
                        We analyzed verified user reviews to identify positive and negative aspects of
                        {' '}{view.companyName} customer support.{' '}
                        <a href="#" className="tlp-inline-link">Learn more about our reviews.</a>
                      </>
                    ) : hasReviews ? (
                      <>See review snippets below to learn what users say about {view.companyName}&apos;s support team.</>
                    ) : (
                      <>{view.companyName} hasn&apos;t collected enough reviews to surface support insights yet — write the first one to share your experience.</>
                    )}
                  </p>

                  {/* Mixed pros/cons bullet list — single list with green check
                      for pros and red X for cons. In preview, uses the static
                      SUPPORT_BULLETS sample. In real mode, derives bullets from
                      the listing's own pros/cons so the icons show up for any
                      listing that has them populated. */}
                  {(() => {
                    type Bullet = { text: string; kind: 'pos' | 'neg' }
                    const bullets: Bullet[] = isPreview
                      ? (SUPPORT_BULLETS as Bullet[])
                      : [
                          ...(view.realPros || []).map(p => ({ text: p, kind: 'pos' as const })),
                          ...(view.realCons || []).map(c => ({ text: c, kind: 'neg' as const })),
                        ]
                    if (bullets.length === 0) return null
                    return (
                      <ul className="tlp-cs-bullets">
                        {bullets.map(b => (
                          <li key={b.text}>
                            <span className={`tlp-cs-bullet tlp-cs-bullet--${b.kind}`} aria-hidden="true">
                              {b.kind === 'pos' ? <CheckSm /> : <XSm />}
                            </span>
                            <span>{isPreview ? swap(b.text) : b.text}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  })()}
                </div>

                {/* ── RIGHT sidebar: Support + Training options card ── */}
                {(() => {
                  const supportList = view.realSupportChannels
                    || (isPreview ? ['24/7 (live rep)', 'FAQs/forum', 'Phone support', 'Email/help desk', 'Chat', 'Knowledge base'] : null)
                  const trainingList = view.realTrainingOptions
                    || (isPreview ? ['In person', 'Documentation', 'Webinars', 'Live online', 'Videos'] : null)
                  if (!supportList && !trainingList) {
                    return (
                      <aside className="tlp-cs-opts tlp-cs-opts--empty">
                        Support &amp; training options coming soon — {view.companyName} hasn&apos;t shared their channels yet.
                      </aside>
                    )
                  }
                  return (
                    <aside className="tlp-cs-opts">
                      {supportList && (
                        <>
                          <div className="tlp-cs-opts-h">Support options</div>
                          <ul className="tlp-cs-opts-list">
                            {supportList.map(o => (
                              <li key={o}>
                                <span>{o}</span>
                                <CheckSm />
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      {trainingList && (
                        <>
                          <div className={`tlp-cs-opts-h ${supportList ? 'tlp-cs-opts-h--spaced' : ''}`}>Training options</div>
                          <ul className="tlp-cs-opts-list">
                            {trainingList.map(o => (
                              <li key={o}>
                                <span>{o}</span>
                                <CheckSm />
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </aside>
                  )
                })()}
              </div>

              {/* (3) ───── Voices ───── */}
              {isPreview && (
                <>
                  <p className="tlp-cs-lead">
                    To see what individual users say about {view.companyName}&apos;s customer support, check the review snippets below.
                  </p>
                  <div className="tlp-cs-quotes">
                    {SUPPORT_QUOTES.map(q => (
                      <div key={q.name} className="tlp-cs-quote">
                        <div className="tlp-cs-quote-tag" aria-hidden="true">
                          <span className="tlp-cs-quote-tag-ico"><CheckSm /></span>
                          <span className="tlp-cs-quote-tag-text">Highly Relevant</span>
                        </div>
                        <p className="tlp-cs-quote-text">&ldquo;{swap(q.quote)}&rdquo;</p>
                        <div className="tlp-cs-quote-who">
                          <span className="tlp-cs-quote-av" style={{ background: q.color }}>{q.initials}</span>
                          <div>
                            <div className="tlp-cs-quote-name">
                              {q.name}
                              <LinkedInBadge />
                            </div>
                            <div className="tlp-cs-quote-role">{q.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!isPreview && (
                hasReviews && reviewsData && reviewsData.recent.length > 0 ? (
                  <>
                    <p className="tlp-cs-lead">
                      Review snippets covering {view.companyName} customer support and team responsiveness.
                    </p>
                    <div className="tlp-cs-quotes">
                      {reviewsData.recent.slice(0, 3).map((rev) => {
                        const r = rev as unknown as ReviewRow
                        const initials = (r.user_name || '?').slice(0, 2).toUpperCase()
                        return (
                          <div key={r.id} className="tlp-cs-quote">
                            <div className="tlp-cs-quote-tag" aria-hidden="true">
                              <span className="tlp-cs-quote-tag-ico"><CheckSm /></span>
                              <span className="tlp-cs-quote-tag-text">Verified Review</span>
                            </div>
                            <p className="tlp-cs-quote-text">&ldquo;{r.body}&rdquo;</p>
                            <div className="tlp-cs-quote-who">
                              {r.user_avatar_url
                                ? <img src={r.user_avatar_url} alt="" className="tlp-cs-quote-av tlp-cs-quote-av--img" />
                                : <span className="tlp-cs-quote-av" style={{ background: '#0C9A9A' }}>{initials}</span>}
                              <div>
                                <div className="tlp-cs-quote-name">{r.user_name || 'Anonymous'}</div>
                                <div className="tlp-cs-quote-role">
                                  <Stars value={Number(r.rating)} size={12} />
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <div className="tlp-vo-empty">
                    <span className="tlp-vo-empty-ico" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </span>
                    <div className="tlp-vo-empty-body">
                      <h4 className="tlp-vo-empty-title">How was your experience with {view.companyName} support?</h4>
                      <p className="tlp-vo-empty-sub">
                        Be the first to share — your review will appear here and help future buyers gauge what to expect.
                      </p>
                      <button
                        type="button"
                        className="tlp-vo-empty-cta"
                        onClick={openReview}
                      >
                        Write a review
                      </button>
                    </div>
                  </div>
                )
              )}
            </section>

            {/* ========== FAQS — always render section. Empty state when the
                owner has not added any. ========== */}
            <section id="faqs" className="tlp-sec">
              <h2 className="tlp-sec-title">{view.companyName} FAQs</h2>
              <p className="tlp-sec-lead">Here are some of the questions we get asked most often.</p>

              {(() => {
                // Use real FAQs when present; otherwise the preview-only sample
                // (for design preview on /test-listing-page).
                const items = view.realFaqs
                  ? view.realFaqs.map(f => ({ q: f.question, a: f.answer, showAlts: false }))
                  : (isPreview ? FAQS : [])
                if (items.length === 0) {
                  return (
                    <div className="tlp-empty-card">
                      <span className="tlp-empty-ico" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      </span>
                      <div className="tlp-empty-body">
                        <div className="tlp-empty-title">FAQs coming soon</div>
                        <div className="tlp-empty-sub">{view.companyName} hasn&apos;t added frequently asked questions yet. Check back soon — or <a href="/contact" className="tlp-inline-link">reach out</a> with your question.</div>
                      </div>
                    </div>
                  )
                }
                return (
                  <ul className="tlp-faq-list">
                    {items.map((f, i) => (
                      <li key={f.q + i} className={`tlp-faq ${openFaq === i ? 'is-open' : ''}`}>
                        <button
                          className="tlp-faq-q"
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          aria-expanded={openFaq === i}
                        >
                          <span>{swap(f.q)}</span>
                          <span className={`tlp-faq-chev ${openFaq === i ? 'is-open' : ''}`} aria-hidden="true">
                            <ChevronDown />
                          </span>
                        </button>
                        {openFaq === i && (
                          <div className="tlp-faq-a">
                            <p>{swap(f.a)}</p>
                            {f.showAlts && (
                              <>
                                <div className="tlp-faq-alts-h">These products have better value for money</div>
                                <div className="tlp-faq-alts">
                                  {FAQ_ALTS.map(alt => (
                                    <a key={alt.name} href="#" className="tlp-faq-alt">
                                      <img src={clearbit(alt.domain)} alt={alt.name} />
                                      <div>
                                        <div className="tlp-faq-alt-name">{alt.name}</div>
                                        <div className="tlp-faq-alt-rate">
                                          <svg viewBox="0 0 24 24" width="12" height="12">
                                            <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                                          </svg>
                                          <strong>{alt.rating.toFixed(1)}</strong>
                                          <em>({alt.reviews})</em>
                                        </div>
                                      </div>
                                    </a>
                                  ))}
                                </div>
                                <a href="#alternatives" className="tlp-faq-see">See free alternatives</a>
                              </>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )
              })()}
            </section>

            {/* ========== POPULAR COMPARISONS — pair self with up to 9 siblings.
                Clean two-row card: logos + TrendIcon, then names + "vs". ========== */}
            {(siblings.length > 0 || isPreview) && (
            <section id="compare" className="tlp-sec tlp-cmp-sec">
              <h2 className="tlp-sec-title">Popular comparisons with {view.companyName}</h2>

              <div className="tlp-cmp-grid">
                {!isPreview && siblings.length > 0
                  ? siblings.slice(0, 9).map(s => {
                      const sLogo = s.logo_url
                        || (s.website ? clearbit(String(s.website).replace(/^https?:\/\//, '').split('/')[0], 64) : '')
                      return (
                        <a
                          key={s.id}
                          href={`/compare/${listingSlug}-vs-${s.slug}`}
                          className="tlp-cmp"
                          aria-label={`Compare ${view.companyName} with ${s.company_name}`}
                        >
                          <div className="tlp-cmp-row tlp-cmp-logos">
                            {view.logoUrl
                              ? <img src={view.logoUrl} alt={view.companyName} className="tlp-cmp-logo" />
                              : <span className="tlp-cmp-logo tlp-cmp-letter">{view.companyName.charAt(0).toUpperCase()}</span>}
                            <span className="tlp-cmp-trend"><TrendIcon /></span>
                            {sLogo
                              ? <img src={sLogo} alt={s.company_name} className="tlp-cmp-logo" />
                              : <span className="tlp-cmp-logo tlp-cmp-letter">{s.company_name.charAt(0).toUpperCase()}</span>}
                          </div>
                          <div className="tlp-cmp-row tlp-cmp-names">
                            <span className="tlp-cmp-name tlp-cmp-name--muted">{view.companyName}</span>
                            <span className="tlp-cmp-vs">vs</span>
                            <span className="tlp-cmp-name">{s.company_name}</span>
                          </div>
                        </a>
                      )
                    })
                  : COMPARISONS.map(c => {
                      const otherSlug = c.b.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                      return (
                        <a
                          key={c.b}
                          href={`/compare/${listingSlug}-vs-${otherSlug}`}
                          className="tlp-cmp"
                          aria-label={`Compare ${view.companyName} with ${c.b}`}
                        >
                          <div className="tlp-cmp-row tlp-cmp-logos">
                            <img src={view.logoUrl} alt={view.companyName} className="tlp-cmp-logo" />
                            <span className="tlp-cmp-trend"><TrendIcon /></span>
                            <img src={clearbit(c.bd)} alt={c.b} className="tlp-cmp-logo" />
                          </div>
                          <div className="tlp-cmp-row tlp-cmp-names">
                            <span className="tlp-cmp-name tlp-cmp-name--muted">{view.companyName}</span>
                            <span className="tlp-cmp-vs">vs</span>
                            <span className="tlp-cmp-name">{c.b}</span>
                          </div>
                        </a>
                      )
                    })}
              </div>

              <div className="tlp-cmp-more-wrap">
                <a href="#alternatives" className="tlp-cmp-browse">Browse all alternatives</a>
              </div>
            </section>
            )}

            {/* ========== CUSTOMERS ALSO VIEWED — siblings beyond the first 4
                used for Alternatives, with sample-rich card layout in preview. ========== */}
            {(siblings.length > 4 || isPreview) && (
            <section className="tlp-sec tlp-cav-sec">
              <div className="tlp-cav-head">
                <h2 className="tlp-sec-title">Customers also viewed</h2>
                <p className="tlp-cav-sub">Popular tools that businesses choose alongside {view.companyName}</p>
              </div>

              {/* Real mode — simple sibling cards (skip first 4 used in Alternatives). */}
              {!isPreview && siblings.length > 4 && (
                <div className="tlp-sib-grid">
                  {siblings.slice(4, 12).map(s => {
                    const sLogo = s.logo_url
                      || (s.website ? clearbit(String(s.website).replace(/^https?:\/\//, '').split('/')[0], 128) : '')
                    return (
                      <a key={s.id} href={`/listing/${s.slug}`} className="tlp-sib-card">
                        <div className="tlp-sib-head">
                          {sLogo
                            ? <img src={sLogo} alt={`${s.company_name} logo`} className="tlp-sib-logo" />
                            : <span className="tlp-sib-letter">{s.company_name.charAt(0).toUpperCase()}</span>}
                          <div className="tlp-sib-id">
                            <div className="tlp-sib-name">{s.company_name}</div>
                            <div className="tlp-sib-cat">{s.category_name}</div>
                          </div>
                        </div>
                        {s.tagline && <p className="tlp-sib-tagline">{s.tagline}</p>}
                        <div className="tlp-sib-foot">
                          <span className="tlp-sib-cta">View →</span>
                        </div>
                      </a>
                    )
                  })}
                </div>
              )}

              {isPreview && (() => {
                const RELATED = [
                  { name: 'HubSpot',          domain: 'hubspot.com',        tag: 'All-in-one CRM & marketing hub',   rating: 4.5, reviews: '13.2K', cat: 'CRM',          tier: 'Free plan',     featured: true  },
                  { name: 'Klaviyo',          domain: 'klaviyo.com',        tag: 'Email & SMS for ecommerce brands',  rating: 4.6, reviews: '7.4K',  cat: 'Email',        tier: 'Free up to 250',                  },
                  { name: 'Brevo',            domain: 'brevo.com',          tag: 'Email + SMS marketing platform',    rating: 4.5, reviews: '9.1K',  cat: 'Email',        tier: 'Free plan',                        },
                  { name: 'ActiveCampaign',   domain: 'activecampaign.com', tag: 'Marketing automation & journeys',   rating: 4.6, reviews: '5.8K',  cat: 'Automation',   tier: '14-day trial',  featured: true  },
                  { name: 'ConvertKit',       domain: 'convertkit.com',     tag: 'Email built for creators',          rating: 4.6, reviews: '4.2K',  cat: 'Newsletters',  tier: 'Free plan',                        },
                  { name: 'Constant Contact', domain: 'constantcontact.com', tag: 'Email marketing for small biz',    rating: 4.3, reviews: '6.7K',  cat: 'Email',        tier: '60-day trial',                     },
                  { name: 'beehiiv',          domain: 'beehiiv.com',        tag: 'Modern newsletter platform',        rating: 4.7, reviews: '1.9K',  cat: 'Newsletters',  tier: 'Free plan',                        },
                  { name: 'Drip',             domain: 'drip.com',           tag: 'Ecommerce CRM & email automation',  rating: 4.4, reviews: '2.5K',  cat: 'Ecommerce',    tier: '14-day trial',                     },
                ]
                return (
                  <>
                    <div className="tlp-cav-grid">
                      {RELATED.map(r => (
                        <a key={r.name} href="#" className="tlp-cav-card">
                          {r.featured && <span className="tlp-cav-badge">Featured</span>}
                          <div className="tlp-cav-card-top">
                            <img
                              src={clearbit(r.domain)}
                              alt={`${r.name} logo`}
                              className="tlp-cav-logo"
                              loading="lazy"
                            />
                            <div className="tlp-cav-card-id">
                              <span className="tlp-cav-name">{r.name}</span>
                              <span className="tlp-cav-cat">{r.cat}</span>
                            </div>
                          </div>
                          <p className="tlp-cav-tag">{r.tag}</p>
                          <div className="tlp-cav-meta">
                            <span className="tlp-cav-rate">
                              <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                                <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                              </svg>
                              <strong>{r.rating}</strong>
                              <em>({r.reviews})</em>
                            </span>
                            <span className="tlp-cav-tier">{r.tier}</span>
                          </div>
                          <span className="tlp-cav-cta">
                            View listing
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </span>
                        </a>
                      ))}
                    </div>
                    <div className="tlp-cav-foot">
                      <a href="#" className="tlp-cav-foot-link">
                        Browse all email marketing tools
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </>
                )
              })()}
            </section>
            )}

            {/* ========== RELATED CATEGORIES — server-derived siblings of the
                listing's L3 category. Broadens to cousins when sparse. Each
                link routes to /{sectorSlug}/{slug}. Falls back to the
                hardcoded sample only in preview mode. ========== */}
            {(() => {
              const rc = initialData?.relatedCategories
              const cats: { name: string; slug: string; sectorSlug: string }[] =
                rc && rc.length > 0
                  ? rc
                  : (isPreview
                      ? RELATED_CATS.map(name => ({ name, slug: '', sectorSlug: '' }))
                      : [])
              if (cats.length === 0) return null
              return (
                <section className="tlp-sec tlp-rc-sec">
                  <h2 className="tlp-sec-title tlp-rc-title">
                    <span className="tlp-rc-accent" aria-hidden="true" />
                    Related categories
                  </h2>
                  <div className="tlp-rc-grid">
                    {cats.map(c => {
                      const href = c.sectorSlug && c.slug
                        ? `/${c.sectorSlug}/${c.slug}`
                        : '#'
                      return (
                        <a key={c.slug || c.name} href={href} className="tlp-rc">
                          <span className="tlp-rc-icon"><FolderIcon /></span>
                          <span className="tlp-rc-lbl">{c.name}</span>
                        </a>
                      )
                    })}
                  </div>
                </section>
              )
            })()}

          </div>
        </div>

      </main>

      <WriteReviewModal
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        listingSlug={listingSlug}
        companyName={view.companyName}
        companyLogo={view.logoUrl}
        hasExistingReview={hasReviewed}
        isAuthed={isAuthed}
        isPreview={isPreview}
        currentUserName={currentUser?.name ?? null}
        currentUserAvatar={currentUser?.avatarUrl ?? null}
        onSuccess={(review) => {
          setHasReviewed(true)
          if (!review.existed) setReviewCount(c => c + 1)
        }}
        onDelete={() => {
          setHasReviewed(false)
          setReviewCount(c => Math.max(0, c - 1))
        }}
      />

      <SignupModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        nextUrl={listingSlug ? `/listing/${listingSlug}` : undefined}
      />

      <ClaimListingModal
        open={claimOpen}
        onClose={() => setClaimOpen(false)}
        listingSlug={listingSlug}
        companyName={view.companyName}
        website={view.website}
        isAuthed={isAuthed}
        onRequireAuth={() => { setClaimOpen(false); setAuthOpen(true) }}
      />

      <LeadFormModal
        isOpen={leadOpen}
        onClose={() => setLeadOpen(false)}
        listingSlug={listingSlug}
        companyName={view.companyName}
        companyLogo={view.logoUrl}
        prefillName={currentUser?.name ?? null}
        prefillEmail={currentUser?.email ?? null}
        isPreview={isPreview}
        requireAuth={!isPreview}
        isAuthed={isAuthed}
        onRequireAuth={() => setAuthOpen(true)}
        listingContact={isPreview ? null : {
          email: view.email || undefined,
          phone: view.phoneFmt || undefined,
        }}
      />
    </>
  )
}
