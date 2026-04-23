'use client'

import { useState, useMemo, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { CountryProvider } from '../config/country-context'
import { DEFAULT_COUNTRY } from '../config/countries'

/* ═══════════════════════════════════════════
   Test Listing Page — GetApp-style Mailchimp listing
   Layout: sticky ToC (left) + main column (right)
   Visual system: white bg, blue accents, orange stars,
   flat cards with 1px #E5E7EB borders, Inter font.
   ═══════════════════════════════════════════ */

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

/* ── Alternatives compared ── */
const ALTERNATIVES = [
  {
    name: 'Mailchimp',
    domain: 'mailchimp.com',
    startingPrice: '$13',
    period: '/mo',
    freeVersion: true,
    freeTrial: true,
    ratings: { ease: 4.4, value: 4.1, features: 4.4, support: 4.0 },
    highlight: true,
  },
  {
    name: 'ActiveCampaign',
    domain: 'activecampaign.com',
    startingPrice: '$15',
    period: '/mo',
    freeVersion: false,
    freeTrial: true,
    ratings: { ease: 4.3, value: 4.4, features: 4.6, support: 4.5 },
    highlight: false,
  },
  {
    name: 'MailerLite',
    domain: 'mailerlite.com',
    startingPrice: '$9',
    period: '/mo',
    freeVersion: true,
    freeTrial: true,
    ratings: { ease: 4.7, value: 4.7, features: 4.4, support: 4.6 },
    highlight: false,
  },
]

/* ── Pricing plans ── */
const PRICING = {
  monthly: [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      cta: 'Get started',
      features: [
        '500 contacts',
        '1,000 sends per month',
        'Marketing CRM',
        'Creative Assistant',
        'Website builder',
      ],
    },
    {
      name: 'Essentials',
      price: '$13',
      period: '/month',
      cta: 'Start 14-day trial',
      features: [
        '500 contacts included',
        '5,000 sends per month',
        'All Free features',
        'A/B testing',
        '24/7 email & chat support',
        'Custom branding',
      ],
      popular: true,
    },
    {
      name: 'Standard',
      price: '$20',
      period: '/month',
      cta: 'Start 14-day trial',
      features: [
        '500 contacts included',
        '6,000 sends per month',
        'All Essentials features',
        'Customer Journey Builder',
        'Behavioral targeting',
        'Send-time optimization',
        'Predictive segmentation',
      ],
    },
  ],
  yearly: [
    {
      name: 'Free',
      price: '$0',
      period: '/year',
      cta: 'Get started',
      features: [
        '500 contacts',
        '1,000 sends per month',
        'Marketing CRM',
        'Creative Assistant',
        'Website builder',
      ],
    },
    {
      name: 'Essentials',
      price: '$140',
      period: '/year',
      cta: 'Start 14-day trial',
      features: [
        '500 contacts included',
        '5,000 sends per month',
        'All Free features',
        'A/B testing',
        '24/7 email & chat support',
        'Custom branding',
      ],
      popular: true,
    },
    {
      name: 'Standard',
      price: '$216',
      period: '/year',
      cta: 'Start 14-day trial',
      features: [
        '500 contacts included',
        '6,000 sends per month',
        'All Essentials features',
        'Customer Journey Builder',
        'Behavioral targeting',
        'Send-time optimization',
        'Predictive segmentation',
      ],
    },
  ],
} as const

/* ── User opinions about pricing (demo quotes) ── */
const VALUE_QUOTES = [
  {
    name: 'Jessica R.',
    role: 'Head of Marketing',
    industry: 'Non-profit, 11–50 employees',
    thumb: 'up',
    quote:
      'For a small non-profit, the free plan got us running campaigns without touching our budget. We upgraded to Essentials once we grew past 500 contacts and the jump felt reasonable.',
  },
  {
    name: 'Daniel B.',
    role: 'E-commerce Lead',
    industry: 'Retail, 51–200 employees',
    thumb: 'down',
    quote:
      'Moving from 10k to 25k contacts tripled our bill. Features like Customer Journey Builder are strong, but the contact-tier pricing is hard to justify for seasonal retailers.',
  },
  {
    name: 'Linh P.',
    role: 'Digital Marketing Manager',
    industry: 'Agency, 2–10 employees',
    thumb: 'up',
    quote:
      'Good value on Standard for agency work. Being able to manage multiple client audiences from one login is worth the price for us.',
  },
]

/* ── Integrations ── */
const INTEGRATIONS = [
  { name: 'WordPress', domain: 'wordpress.com', rating: 4.6, category: 'CMS' },
  { name: 'Zapier', domain: 'zapier.com', rating: 4.7, category: 'Automation' },
  { name: 'WooCommerce', domain: 'woocommerce.com', rating: 4.5, category: 'E-commerce' },
  { name: 'Squarespace', domain: 'squarespace.com', rating: 4.4, category: 'Website builder' },
  { name: 'Shopify', domain: 'shopify.com', rating: 4.6, category: 'E-commerce' },
  { name: 'Canva', domain: 'canva.com', rating: 4.7, category: 'Design' },
  { name: 'Salesforce', domain: 'salesforce.com', rating: 4.3, category: 'CRM' },
  { name: 'Stripe', domain: 'stripe.com', rating: 4.7, category: 'Payments' },
  { name: 'HubSpot', domain: 'hubspot.com', rating: 4.4, category: 'CRM' },
  { name: 'Google Analytics', domain: 'analytics.google.com', rating: 4.5, category: 'Analytics' },
  { name: 'Slack', domain: 'slack.com', rating: 4.6, category: 'Team chat' },
  { name: 'Eventbrite', domain: 'eventbrite.com', rating: 4.3, category: 'Events' },
]

/* ── Customer support testimonials ── */
const SUPPORT_QUOTES = [
  {
    name: 'Amanda S.',
    role: 'Customer Support',
    industry: 'Retail, 11–50 employees',
    sentiment: 'pos',
    quote:
      'Chat agents are responsive on Essentials and up. Knowledge base articles cover most of what a small team needs — we rarely escalate.',
  },
  {
    name: 'Omar H.',
    role: 'IT Administrator',
    industry: 'Non-profit, 2–10 employees',
    sentiment: 'neg',
    quote:
      'Free plan support is email-only and response times can be 48+ hours. Upgrade path is clear but small orgs notice the gap.',
  },
]

/* ── FAQs ── */
const FAQS = [
  {
    q: 'Who are the typical users of Mailchimp?',
    a: 'Mailchimp is used by small businesses, e-commerce shops, marketing agencies, non-profits, content creators, and in-house marketing teams at mid-sized companies. The free and Essentials tiers are most popular with solopreneurs and teams under 50 people.',
  },
  {
    q: 'What is the cost of using Mailchimp?',
    a: 'Mailchimp offers a free plan for up to 500 contacts. Paid plans start at $13/month (Essentials), $20/month (Standard), and $350/month (Premium). Pricing scales with contact-list size.',
  },
  {
    q: 'Does Mailchimp have a mobile app?',
    a: 'Yes. Mailchimp has free iOS and Android apps that let you draft campaigns, review analytics, and respond to contact activity on the go.',
  },
  {
    q: 'What level of customer support does Mailchimp offer?',
    a: 'Mailchimp offers 24/7 email & chat support from Essentials and up, and phone support on Premium. A large self-serve knowledge base and community forum are available to all users.',
  },
  {
    q: 'Does Mailchimp integrate with other tools?',
    a: 'Yes — Mailchimp has 300+ integrations including Shopify, WooCommerce, Salesforce, Canva, WordPress, Zapier, Stripe, and Google Analytics.',
  },
  {
    q: 'Which languages does Mailchimp support?',
    a: 'The Mailchimp UI is available in English, Spanish, French, German, Portuguese (Brazil), and Italian. Email templates and landing pages support Unicode.',
  },
]

/* ── Popular comparisons ── */
const COMPARISONS = [
  { a: 'Mailchimp', b: 'Constant Contact', ad: 'mailchimp.com', bd: 'constantcontact.com' },
  { a: 'Mailchimp', b: 'HubSpot Marketing', ad: 'mailchimp.com', bd: 'hubspot.com' },
  { a: 'Mailchimp', b: 'Klaviyo',          ad: 'mailchimp.com', bd: 'klaviyo.com' },
  { a: 'Mailchimp', b: 'ActiveCampaign',   ad: 'mailchimp.com', bd: 'activecampaign.com' },
  { a: 'Mailchimp', b: 'Brevo',            ad: 'mailchimp.com', bd: 'brevo.com' },
  { a: 'Mailchimp', b: 'GetResponse',      ad: 'mailchimp.com', bd: 'getresponse.com' },
  { a: 'Mailchimp', b: 'MailerLite',       ad: 'mailchimp.com', bd: 'mailerlite.com' },
  { a: 'Mailchimp', b: 'Omnisend',         ad: 'mailchimp.com', bd: 'omnisend.com' },
  { a: 'Mailchimp', b: 'Campaign Monitor', ad: 'mailchimp.com', bd: 'campaignmonitor.com' },
]

/* ── Related categories ── */
const RELATED_CATS = [
  'Email Marketing', 'Marketing Automation', 'Email Tracking',
  'Email Management', 'Newsletter', 'Landing Page',
  'Lead Generation', 'Campaign Management', 'SMS Marketing',
]

/* ── Table of Contents anchor list ── */
const TOC = [
  { id: 'overview',      label: 'Mailchimp overview' },
  { id: 'ui',            label: 'User interface' },
  { id: 'insights',      label: 'Reviews' },
  { id: 'who-uses',      label: 'Who uses Mailchimp?' },
  { id: 'key-features',  label: 'Key features' },
  { id: 'alternatives',  label: 'Alternatives' },
  { id: 'pricing',       label: 'Pricing' },
  { id: 'integrations',  label: 'Integrations' },
]

/* ═══════════════════════════════════════════
   Small subcomponents
   ═══════════════════════════════════════════ */

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

export default function TestListingPage() {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [featureQ, setFeatureQ] = useState('')
  const [integrationQ, setIntegrationQ] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [featuresExpanded, setFeaturesExpanded] = useState(false)
  const [industryHover, setIndustryHover] = useState<number | null>(null)
  const [expandedFeatures, setExpandedFeatures] = useState<Set<number>>(() => new Set([0]))
  const [scrolled, setScrolled] = useState(false)

  const toggleFeature = (idx: number) => {
    setExpandedFeatures(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  // Combined scroll handler:
  //  1) Toggle the compact sub-header when user scrolls past the identity strip
  //  2) Pin the Table of Contents at the top of the viewport when scrolled into
  //     the layout area — plain JS fixed-position, so it works regardless of
  //     whatever ancestor overflow/transform might be breaking CSS `sticky`.
  useEffect(() => {
    let raf = 0
    let tocFixed = false

    const handle = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0

        const identity = document.querySelector<HTMLElement>('.tlp-identity')
        const toc      = document.querySelector<HTMLElement>('.tlp-toc')
        const layout   = document.querySelector<HTMLElement>('.tlp-layout')
        if (!identity || !toc || !layout) return

        // — Sub-header visibility —
        const idRect = identity.getBoundingClientRect()
        const subOn  = idRect.bottom < 130
        setScrolled(subOn)

        // — ToC pinning —
        const offsetTop   = subOn ? 76 : 132
        const layoutRect  = layout.getBoundingClientRect()
        const tocHeight   = toc.offsetHeight
        const shouldPin   = layoutRect.top < offsetTop &&
                            layoutRect.bottom > offsetTop + tocHeight

        if (shouldPin && !tocFixed) {
          const r = toc.getBoundingClientRect()
          toc.style.position = 'fixed'
          toc.style.left     = `${r.left}px`
          toc.style.width    = `${r.width}px`
          toc.style.top      = `${offsetTop}px`
          toc.style.zIndex   = '20'
          tocFixed = true
        } else if (!shouldPin && tocFixed) {
          toc.style.position = ''
          toc.style.left     = ''
          toc.style.width    = ''
          toc.style.top      = ''
          toc.style.zIndex   = ''
          tocFixed = false
        } else if (shouldPin) {
          // still pinned — just keep top correct as sub-header toggles
          toc.style.top = `${offsetTop}px`
        }
      })
    }

    // on resize: unpin to remeasure, then let next frame re-pin if needed
    const onResize = () => {
      const toc = document.querySelector<HTMLElement>('.tlp-toc')
      if (toc && tocFixed) {
        toc.style.position = ''
        toc.style.left     = ''
        toc.style.width    = ''
        toc.style.top      = ''
        toc.style.zIndex   = ''
        tocFixed = false
      }
      handle()
    }

    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', onResize)
    handle()
    return () => {
      window.removeEventListener('scroll', handle)
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const filteredFeatures = useMemo(() => {
    const q = featureQ.trim().toLowerCase()
    if (!q) return ALL_FEATURES
    return ALL_FEATURES.filter(f => String(f[0]).toLowerCase().includes(q))
  }, [featureQ])

  const filteredIntegrations = useMemo(() => {
    const q = integrationQ.trim().toLowerCase()
    if (!q) return INTEGRATIONS
    return INTEGRATIONS.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
  }, [integrationQ])

  const overallRating = 4.4
  const reviewsCount = 17248
  const sentimentPct = 87

  return (
    <CountryProvider country={DEFAULT_COUNTRY}>
      <Navbar />

      {/* ─── Compact sticky sub-header (slides in on scroll) ─── */}
      <div className={`tlp-subheader ${scrolled ? 'is-visible' : ''}`} aria-hidden={!scrolled}>
        <div className="tlp-sub-inner">
          <div className="tlp-sub-logo">
            <img src={MAILCHIMP_LOGO} alt="Mailchimp" />
          </div>
          <div className="tlp-sub-name">Mailchimp</div>
          <div className="tlp-sub-rate">
            <span className="tlp-sub-rate-num">{overallRating.toFixed(1)}</span>
            <Stars value={overallRating} size={13} />
            <span className="tlp-sub-rate-count">(17.5K)</span>
          </div>
          <div className="tlp-sub-tag">Email and SMS marketing automation platform</div>
          <a href="#" className="tlp-sub-cta">Learn more</a>
        </div>
      </div>

      <main className="tlp-main">
        {/* ─── Breadcrumb ─── */}
        <div className="tlp-crumb-bar">
          <div className="tlp-wrap">
            <nav className="tlp-crumb" aria-label="Breadcrumb">
              <a href="/" aria-label="Home"><HomeIcon /></a>
              <span className="tlp-crumb-sep"><ChevronRight size={12} /></span>
              <a href="#">Email Marketing</a>
              <span className="tlp-crumb-sep"><ChevronRight size={12} /></span>
              <span className="tlp-crumb-current">Mailchimp</span>
            </nav>
          </div>
        </div>

        {/* ─── Compact identity strip (logo + name + rating + tagline) ─── */}
        <header className="tlp-identity">
          <div className="tlp-identity-inner">
            <div className="tlp-id-logo">
              <img src={MAILCHIMP_LOGO} alt="Mailchimp logo" />
            </div>
            <div className="tlp-id-body">
              <h2 className="tlp-id-name">Mailchimp</h2>
              <div className="tlp-id-rate">
                <span className="tlp-id-rate-num">{overallRating.toFixed(1)}</span>
                <Stars value={overallRating} size={13} />
                <span className="tlp-id-rate-count">(17.5K)</span>
                <span className="tlp-id-chev"><ChevronDown /></span>
              </div>
              <div className="tlp-id-tagline">Email and SMS marketing automation platform</div>
            </div>
          </div>
        </header>

        {/* ─── Overview tab strip ─── */}
        <nav className="tlp-tabs" aria-label="Product sections">
          <div className="tlp-tabs-inner">
            <a href="#overview" className="tlp-tab-link is-active">Overview</a>
          </div>
        </nav>

        {/* ─── Two-column layout: sticky ToC + content ─── */}
        <div className="tlp-wrap tlp-layout">
          <div className="tlp-toc-col">
            <aside className="tlp-toc" aria-label="Table of Contents">
              <div className="tlp-toc-title">Table of Contents</div>
              <ul>
                {TOC.map((t, i) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className={i === 0 ? 'is-active' : ''}>{t.label}</a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="tlp-content">

            {/* ─── Page title + verification block (inside content column) ─── */}
            <div className="tlp-title-block">
              <h1 className="tlp-page-title">
                Mailchimp — 2026 Pricing, Features, Reviews &amp; Alternatives
              </h1>
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
              <div className="tlp-updated">Last updated: April 2026</div>
            </div>

            {/* ========== OVERVIEW CARD ========== */}
            <section id="overview" className="tlp-ovw-card">
              <div className="tlp-ovw-grid">

                {/* ── Left column: Q&A blocks ── */}
                <div className="tlp-ovw-main">
                  <h2 className="tlp-ovw-title">Mailchimp overview</h2>
                  <div className="tlp-ovw-verify">
                    <span className="tlp-verify-avatars" aria-hidden="true">
                      <span className="tlp-va" style={{ background: '#0C9A9A', fontSize: 10 }}>MR</span>
                      <span className="tlp-va" style={{ background: '#EA580C', fontSize: 10 }}>JL</span>
                    </span>
                    <span>Based on {reviewsCount.toLocaleString()} verified user reviews</span>
                  </div>

                  <div className="tlp-qa">
                    <div className="tlp-qa-head">
                      <h3>What is Mailchimp?</h3>
                      <a href="#key-features">See key features</a>
                    </div>
                    <p>
                      Mailchimp is an email marketing program offering key features such as
                      email campaign management, contact database, reporting/analytics, and
                      mobile optimization, among others.
                    </p>
                  </div>

                  <div className="tlp-qa">
                    <div className="tlp-qa-head">
                      <h3>Who uses Mailchimp?</h3>
                      <a href="#who-uses">See details</a>
                    </div>
                    <p>
                      Reviews for Mailchimp come from a wide variety of industries, including
                      marketing and advertising (11% of reviewers), information technology and
                      services (7%), and computer software (6%). The most frequent use case for
                      Mailchimp cited by reviewers is email marketing (83% of reviewers).
                    </p>
                  </div>

                  <div className="tlp-qa">
                    <div className="tlp-qa-head">
                      <h3>What do users say about Mailchimp pricing?</h3>
                      <a href="#pricing">See details</a>
                    </div>
                    <p>
                      Reviewers indicate that Mailchimp&apos;s free plan is appealing for small
                      businesses, and they appreciate the ability to test core features without
                      upfront costs. Some users report that pricing increases quickly as contact
                      lists grow, and they find the structure confusing. Reviewers feel that
                      essential features require paid upgrades, and some users say other
                      platforms offer better value at lower prices.
                    </p>
                  </div>

                  <div className="tlp-qa">
                    <div className="tlp-qa-head">
                      <h3>What are the most popular integrations for Mailchimp?</h3>
                      <a href="#integrations">See details</a>
                    </div>
                    <p>
                      The Mailchimp integrations most frequently cited by reviewers are:
                      WordPress (a website builder product rated 4.7 out of 5 for its integration
                      with Mailchimp), Shopify (an eCommerce product, 4.5), and WooCommerce
                      (an eCommerce product, 4.4).
                    </p>
                  </div>
                </div>

                {/* ── Right column: 3 stacked side blocks ── */}
                <aside className="tlp-ovw-side">

                  {/* Starting price */}
                  <div className="tlp-side-block">
                    <div className="tlp-side-head">
                      <span className="tlp-side-title">
                        Starting price <span className="tlp-info-ico"><InfoIcon /></span>
                      </span>
                      <a href="#pricing">See details</a>
                    </div>
                    <div className="tlp-side-price">
                      <span className="tlp-side-price-sym">$</span>
                      <span className="tlp-side-price-num">13</span>
                      <span className="tlp-side-price-unit">flat rate /<br />per month</span>
                    </div>
                    <div className="tlp-side-trials">
                      <span className="tlp-side-trial">
                        Free Trial <span className="tlp-check-sm"><CheckSm /></span>
                      </span>
                      <span className="tlp-side-trial">
                        Free Version <span className="tlp-check-sm"><CheckSm /></span>
                      </span>
                    </div>
                  </div>

                  {/* Alternatives with better value for money */}
                  <div className="tlp-side-block">
                    <div className="tlp-side-head">
                      <span className="tlp-side-title">Alternatives</span>
                    </div>
                    <div className="tlp-side-sub">with better value for money</div>
                    <a href="#alternatives" className="tlp-alt-mini">
                      <span className="tlp-alt-mini-logo" aria-hidden="true">B</span>
                      <span className="tlp-alt-mini-info">
                        <span className="tlp-alt-mini-name">Brevo</span>
                        <span className="tlp-alt-mini-rate">
                          <Stars value={4.6} size={11} />
                          <span>4.6</span>
                          <em>(3.4K)</em>
                        </span>
                      </span>
                      <span className="tlp-alt-mini-chev"><ChevronRight size={18} /></span>
                    </a>
                  </div>

                  {/* Pros & Cons */}
                  <div className="tlp-side-block">
                    <div className="tlp-side-head">
                      <span className="tlp-side-title">
                        Pros &amp; Cons <span className="tlp-info-ico"><InfoIcon /></span>
                      </span>
                    </div>
                    <ul className="tlp-pc-list">
                      {PROS_SHORT.map(p => (
                        <li key={p}>
                          <span className="tlp-pc-bullet tlp-pc-bullet--pos"><CheckFilled /></span>
                          <span>{p}</span>
                        </li>
                      ))}
                      {CONS_SHORT.map(c => (
                        <li key={c}>
                          <span className="tlp-pc-bullet tlp-pc-bullet--neg"><MinusFilled /></span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="#" className="tlp-pc-see">See all pros and cons</a>
                  </div>

                </aside>
              </div>
            </section>

            {/* ========== UI SCREENSHOTS ========== */}
            <section id="ui" className="tlp-card">
              <h2 className="tlp-sec-title">Mailchimp&apos;s user interface</h2>
              <div className="tlp-ui-head">
                <span className="tlp-ui-ease">Ease of use rating:</span>
                <span className="tlp-ui-star" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                  </svg>
                </span>
                <span className="tlp-ui-rating-num">4.5</span>
                <span className="tlp-ui-rating-count">(17.5K)</span>
              </div>

              <div className="tlp-ui-grid">
                <div className="tlp-ui-main-wrap">
                  <MainMock />
                </div>
                <div className="tlp-ui-thumbs">
                  <button type="button" className="tlp-ui-thumb"><ThumbBars /></button>
                  <button type="button" className="tlp-ui-thumb"><ThumbEmail /></button>
                  <button type="button" className="tlp-ui-thumb"><ThumbTable /></button>
                  <button type="button" className="tlp-ui-thumb"><ThumbChart /></button>
                  <button type="button" className="tlp-ui-thumb tlp-ui-thumb--dim"><ThumbMixed /></button>
                  <button type="button" className="tlp-ui-more" aria-label="Show more">
                    <ChevronDown />
                  </button>
                </div>
              </div>
            </section>

            {/* ========== INSIGHTS ========== */}
            <section id="insights" className="tlp-card">
              <h2 className="tlp-sec-title">Mailchimp pros, cons and reviews insights</h2>

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
                  <h3 className="tlp-in-q">What do users say about Mailchimp?</h3>
                  <p className="tlp-in-p">
                    Mailchimp is an email marketing program offering key features such as email
                    campaign management, contact database, reporting/analytics, and mobile
                    optimization, among others.
                  </p>

                  <h4 className="tlp-in-sub">Select to learn more</h4>
                  <div className="tlp-in-tags">
                    {TOPIC_CHIPS.map(c => (
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
                  </div>

                  <p className="tlp-in-long">
                    Users report Mailchimp&apos;s Email Marketing capabilities are user-friendly,
                    with customizable templates and a drag-and-drop builder. Reviewers indicate
                    Mailchimp supports automated sequences, bulk sending, and targeted messaging.
                    They say Mailchimp integrates with websites and e-commerce platforms, making
                    list management seamless. Users appreciate the analytics for optimizing
                    campaigns and the high deliverability rates. Some reviewers mention
                    limitations in template customization and image editing. They find
                    Mailchimp&apos;s free tier helpful for small businesses, though automation is
                    mostly available in paid plans. Of the 205 Mailchimp users who gave detailed
                    accounts of their use of Email Marketing, 98% rated this feature as important
                    or highly important.
                  </p>

                  {/* Quote blocks */}
                  <div className="tlp-in-quotes">
                    {INSIGHT_QUOTES.map(q => (
                      <div key={q.name} className="tlp-in-quote">
                        <p className="tlp-in-quote-text">&ldquo;{q.quote}&rdquo;</p>
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
                </div>
              </div>
            </section>

            {/* ========== WHO USES ========== */}
            <section id="who-uses" className="tlp-card">
              <div className="tlp-wu-head">
                <h2 className="tlp-sec-title">Who uses Mailchimp?</h2>
                <div className="tlp-wu-meta">
                  Based on {reviewsCount.toLocaleString()} verified user reviews.{' '}
                  <a href="#" className="tlp-inline-link">Learn more</a>
                </div>
              </div>

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
            </section>

            {/* ========== KEY FEATURES ========== */}
            <section id="key-features" className="tlp-sec tlp-kf-sec">
              <h2 className="tlp-sec-title tlp-kf-title">Mailchimp&apos;s key features</h2>

              <p className="tlp-kf-intro">
                <a href="#" className="tlp-inline-link">Based on our analysis</a>{' '}
                of 984 verified user reviews collected between July 2021 and January 2026,
                these are Mailchimp&apos;s most critical features along with user sentiment
                summarized beneath each one.{' '}
                <a href="#" className="tlp-inline-link">Learn more about our reviews.</a>
              </p>

              {KEY_FEATURES.map((f, idx) => {
                const open = expandedFeatures.has(idx)
                return (
                  <div key={f.name} className="tlp-kf">
                    <div className="tlp-kf-head">
                      <span className="tlp-kf-bullet" aria-hidden="true">•</span>
                      <span className="tlp-kf-name">{f.name}</span>
                      <span className="tlp-kf-rate">
                        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                          <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                        </svg>
                        <span>{f.rating.toFixed(1)}</span>
                      </span>
                    </div>

                    <p className="tlp-kf-desc">{f.desc}</p>

                    <button
                      type="button"
                      className="tlp-kf-toggle"
                      onClick={() => toggleFeature(idx)}
                      aria-expanded={open}
                    >
                      <span className="tlp-kf-toggle-ico"><SpeechBubbleIcon /></span>
                      <span className="tlp-kf-toggle-lbl">See related user reviews</span>
                      <span className={`tlp-kf-toggle-chev ${open ? 'is-open' : ''}`}>
                        <ChevronDown />
                      </span>
                    </button>

                    {open && f.quotes && f.quotes.length > 0 && (
                      <div className="tlp-kf-quotes">
                        {f.quotes.map(q => (
                          <div key={q.name} className="tlp-kf-quote">
                            <p className="tlp-kf-quote-text">&ldquo;{q.text}&rdquo;</p>
                            <div className="tlp-kf-quote-who">
                              <span className="tlp-kf-quote-av">{q.initials}</span>
                              <div>
                                <div className="tlp-kf-quote-name">{q.name}</div>
                                <div className="tlp-kf-quote-role">{q.role}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* ── All Mailchimp features (inline, same section) ── */}
              <div id="all-features" className="tlp-af">
                <div className="tlp-af-head">
                  <div className="tlp-af-heading">
                    <h3 className="tlp-af-title">All Mailchimp features</h3>
                    <div className="tlp-af-meta">
                      <span>Features rating:</span>
                      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                        <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                      </svg>
                      <strong>4.4</strong>
                      <em>(17.5K)</em>
                    </div>
                  </div>
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
                </div>

                <div className="tlp-af-grid">
                  {(featuresExpanded ? filteredFeatures : filteredFeatures.slice(0, 9)).map(
                    ([name, rating, count]) => (
                      <div key={String(name)} className="tlp-af-row">
                        <span className="tlp-af-name">{name}</span>
                        <span className="tlp-af-rate">
                          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                            <path fill="#FFA91C" d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                          </svg>
                          <strong>{Number(rating).toFixed(1)}</strong>
                          <em>({String(count)})</em>
                        </span>
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
              </div>
            </section>

            {/* ========== ALTERNATIVES ========== */}
            <section id="alternatives" className="tlp-sec">
              <h2 className="tlp-sec-title">Mailchimp alternatives</h2>

              <div className="tlp-alt-grid">
                {ALTERNATIVES.map(a => (
                  <div key={a.name} className={`tlp-alt ${a.highlight ? 'tlp-alt--hl' : ''}`}>
                    <div className="tlp-alt-head">
                      <img src={clearbit(a.domain)} alt={`${a.name} logo`} className="tlp-alt-logo" />
                      <div className="tlp-alt-name">{a.name}</div>
                    </div>
                    <a href="#" className="tlp-btn tlp-btn--outline">Learn more</a>
                    <div className="tlp-alt-price-block">
                      <div className="tlp-alt-price-lbl">Starting from</div>
                      <div className="tlp-alt-price">
                        <strong>{a.startingPrice}</strong><span>{a.period}</span>
                      </div>
                      <div className="tlp-alt-badges">
                        {a.freeVersion && <span className="tlp-chip tlp-chip--pos">Free version</span>}
                        {a.freeTrial && <span className="tlp-chip tlp-chip--pos">Free trial</span>}
                      </div>
                    </div>
                    <ul className="tlp-alt-ratings">
                      <li><span>Ease of use</span><Stars value={a.ratings.ease} size={12} /><em>{a.ratings.ease.toFixed(1)}</em></li>
                      <li><span>Value for money</span><Stars value={a.ratings.value} size={12} /><em>{a.ratings.value.toFixed(1)}</em></li>
                      <li><span>Features</span><Stars value={a.ratings.features} size={12} /><em>{a.ratings.features.toFixed(1)}</em></li>
                      <li><span>Customer support</span><Stars value={a.ratings.support} size={12} /><em>{a.ratings.support.toFixed(1)}</em></li>
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* ========== INBOX FORM ========== */}
            <section className="tlp-sec tlp-inbox">
              <div className="tlp-inbox-card">
                <h2 className="tlp-inbox-title">Send this software info to my inbox</h2>
                <form className="tlp-inbox-form" onSubmit={e => { e.preventDefault() }}>
                  <label className="tlp-inbox-label">Email Address <span>*</span></label>
                  <div className="tlp-inbox-row">
                    <input type="email" placeholder="name@company.com" required />
                    <button type="submit" className="tlp-btn tlp-btn--primary">Send to my inbox</button>
                  </div>
                  <p className="tlp-inbox-legal">
                    By proceeding, you agree to our <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
                  </p>
                </form>
              </div>
            </section>

            {/* ========== PRICING ========== */}
            <section id="pricing" className="tlp-sec">
              <h2 className="tlp-sec-title">Mailchimp pricing</h2>
              <div className="tlp-price-head">
                <div>
                  <div className="tlp-price-rate-lbl">Value for money rating</div>
                  <div className="tlp-price-rate-val">
                    <Stars value={4.1} size={14} />
                    <span>4.1 / 5</span>
                  </div>
                </div>
                <div className="tlp-price-tabs" role="tablist">
                  <button
                    className={`tlp-tab ${period === 'monthly' ? 'is-active' : ''}`}
                    onClick={() => setPeriod('monthly')}
                    role="tab"
                  >Monthly</button>
                  <button
                    className={`tlp-tab ${period === 'yearly' ? 'is-active' : ''}`}
                    onClick={() => setPeriod('yearly')}
                    role="tab"
                  >Yearly</button>
                </div>
              </div>

              <div className="tlp-pricing-grid">
                {PRICING[period].map(p => {
                  const popular = 'popular' in p && p.popular
                  return (
                    <div key={p.name} className={`tlp-plan ${popular ? 'tlp-plan--pop' : ''}`}>
                      {popular && <div className="tlp-plan-rib">Most popular</div>}
                      <div className="tlp-plan-name">{p.name}</div>
                      <div className="tlp-plan-price">
                        <span className="tlp-plan-amt">{p.price}</span>
                        <span className="tlp-plan-per">{p.period}</span>
                      </div>
                      <div className="tlp-plan-feat-head">Features included:</div>
                      <ul className="tlp-plan-feat">
                        {p.features.map(f => <li key={f}><Check />{f}</li>)}
                      </ul>
                      <a href="#" className={`tlp-btn ${popular ? 'tlp-btn--primary' : 'tlp-btn--outline'}`}>{p.cta}</a>
                    </div>
                  )
                })}
              </div>

              <h3 className="tlp-h3 tlp-h3--spaced">User opinions about Mailchimp price and value</h3>
              <p className="tlp-sec-lead">
                To see what individual users think of Mailchimp&apos;s price and value, check out the review snippets below.
              </p>
              <div className="tlp-vq-grid">
                {VALUE_QUOTES.map(v => (
                  <div key={v.name} className={`tlp-vq tlp-vq--${v.thumb}`}>
                    <div className="tlp-vq-thumb" aria-hidden="true">
                      {v.thumb === 'up' ? (
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.3a2 2 0 0 0 2-1.7l1.4-9a2 2 0 0 0-2-2.3H14zM2 22h4V11H2v11z"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.7a2 2 0 0 0-2 1.7L2.3 12.7a2 2 0 0 0 2 2.3H10zm12-13h-4v11h4V2z"/></svg>
                      )}
                    </div>
                    <div className="tlp-vq-body">
                      <p className="tlp-vq-q">&ldquo;{v.quote}&rdquo;</p>
                      <div className="tlp-vq-who">
                        <Avatar name={v.name} />
                        <div>
                          <div className="tlp-vq-name">{v.name}</div>
                          <div className="tlp-vq-role">{v.role} · {v.industry}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ========== INTEGRATIONS ========== */}
            <section id="integrations" className="tlp-sec">
              <h2 className="tlp-sec-title">Mailchimp integrations ({(17200).toLocaleString()})</h2>
              <p className="tlp-sec-lead">Integrations rated by users</p>

              <div className="tlp-int-head">
                <p className="tlp-int-intro">
                  We looked at {(17248).toLocaleString()} user reviews to identify which products are mentioned as
                  Mailchimp integrations and how users feel about them.{' '}
                  <a href="#" className="tlp-inline-link">Learn more about our methodology.</a>
                </p>
                <div className="tlp-int-search">
                  <svg viewBox="0 0 24 24" className="tlp-allf-ico"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  <input
                    type="text"
                    placeholder="Search for an integration"
                    value={integrationQ}
                    onChange={e => setIntegrationQ(e.target.value)}
                  />
                </div>
              </div>

              <div className="tlp-int-grid">
                {filteredIntegrations.map(i => (
                  <div key={i.name} className="tlp-int-card">
                    <img src={clearbit(i.domain)} alt={`${i.name} logo`} className="tlp-int-logo" />
                    <div className="tlp-int-info">
                      <div className="tlp-int-name">{i.name}</div>
                      <div className="tlp-int-cat">{i.category}</div>
                      <div className="tlp-int-rating">
                        <Stars value={i.rating} size={12} />
                        <span>{i.rating.toFixed(1)} / 5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ========== CUSTOMER SUPPORT ========== */}
            <section id="support" className="tlp-sec">
              <h2 className="tlp-sec-title">Mailchimp customer support</h2>
              <p className="tlp-sec-lead">What do users say about Mailchimp customer support?</p>

              <div className="tlp-sup-grid">
                <div className="tlp-sup-left">
                  <div className="tlp-sup-rate">
                    <div className="tlp-sup-num">4.0</div>
                    <div>
                      <div className="tlp-sup-lbl">Customer support rating</div>
                      <Stars value={4.0} size={14} />
                      <div className="tlp-sup-sm">Based on {reviewsCount.toLocaleString()} user reviews</div>
                    </div>
                  </div>
                  <div className="tlp-sup-bars">
                    {[
                      { k: 'Excellent', v: 62, c: '#22C55E' },
                      { k: 'Good',      v: 23, c: '#84CC16' },
                      { k: 'Average',   v: 9,  c: '#EAB308' },
                      { k: 'Poor',      v: 4,  c: '#F97316' },
                      { k: 'Very poor', v: 2,  c: '#EF4444' },
                    ].map(b => (
                      <div key={b.k} className="tlp-sup-bar">
                        <span className="tlp-sup-bar-k">{b.k}</span>
                        <div className="tlp-sup-bar-t"><div style={{ width: `${b.v}%`, background: b.c }} /></div>
                        <span className="tlp-sup-bar-v">{b.v}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="tlp-sup-right">
                  <div className="tlp-sup-col">
                    <div className="tlp-sup-col-h">Support options</div>
                    <ul>
                      <li><Check /> Knowledge Base</li>
                      <li><Check /> Email / Help Desk</li>
                      <li><Check /> Chat</li>
                      <li><Check /> FAQs / Forum</li>
                      <li><Check /> Phone (Premium)</li>
                    </ul>
                  </div>
                  <div className="tlp-sup-col">
                    <div className="tlp-sup-col-h">Training options</div>
                    <ul>
                      <li><Check /> Documentation</li>
                      <li><Check /> Videos</li>
                      <li><Check /> Webinars</li>
                      <li><Check /> Live Online</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="tlp-sup-quotes">
                {SUPPORT_QUOTES.map(q => (
                  <div key={q.name} className={`tlp-tm tlp-tm--${q.sentiment}`}>
                    <div className="tlp-tm-head">
                      <Avatar name={q.name} />
                      <div>
                        <div className="tlp-tm-name">{q.name}</div>
                        <div className="tlp-tm-role">{q.role} · {q.industry}</div>
                      </div>
                    </div>
                    <p className="tlp-tm-quote">&ldquo;{q.quote}&rdquo;</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ========== FAQS ========== */}
            <section id="faqs" className="tlp-sec">
              <h2 className="tlp-sec-title">Mailchimp FAQs</h2>
              <p className="tlp-sec-lead">Here are the questions most often asked by users.</p>

              <ul className="tlp-faq-list">
                {FAQS.map((f, i) => (
                  <li key={f.q} className={`tlp-faq ${openFaq === i ? 'is-open' : ''}`}>
                    <button className="tlp-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span>{f.q}</span>
                      <span className="tlp-faq-tog" aria-hidden="true">{openFaq === i ? '−' : '+'}</span>
                    </button>
                    <div className="tlp-faq-a">
                      <p>{f.a}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* ========== POPULAR COMPARISONS ========== */}
            <section id="compare" className="tlp-sec">
              <h2 className="tlp-sec-title">Popular comparisons with Mailchimp</h2>
              <div className="tlp-cmp-grid">
                {COMPARISONS.map(c => (
                  <a key={c.b} href="#" className="tlp-cmp">
                    <span className="tlp-cmp-pair">
                      <img src={clearbit(c.ad)} alt="" />
                      <span className="tlp-cmp-vs">vs</span>
                      <img src={clearbit(c.bd)} alt="" />
                    </span>
                    <span className="tlp-cmp-names">{c.a} <span className="tlp-cmp-mute">vs</span> {c.b}</span>
                  </a>
                ))}
              </div>
              <a href="#" className="tlp-inline-link tlp-cmp-more">Browse all alternatives →</a>
            </section>

            {/* ========== RELATED CATEGORIES ========== */}
            <section className="tlp-sec tlp-rc-sec">
              <h2 className="tlp-sec-title">Related categories</h2>
              <div className="tlp-rc-grid">
                {RELATED_CATS.map(c => (
                  <a key={c} href="#" className="tlp-rc">{c}</a>
                ))}
              </div>
            </section>

          </div>
        </div>

      </main>

      <Footer />
    </CountryProvider>
  )
}
