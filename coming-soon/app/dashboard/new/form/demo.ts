/**
 * Demo data helper — fills the entire form with realistic sample values so
 * the listing page can be smoke-tested without typing every field by hand.
 *
 * Skips: logoUrl, screenshots — user uploads those manually.
 */
import type { Category } from '../../../iww-hq/data/category-storage'
import type { FormState } from './types'

/**
 * Returns a partial FormState. Caller spreads this onto the existing form
 * so user-uploaded images are preserved.
 *
 * `categories` lets us auto-pick the first available L1/L2/L3 so the user
 * doesn't have to manually pick a category before everything else is filled.
 */
export function buildDemoForm(categories: Category[]): Partial<FormState> {
  /* Auto-pick first L1 → first L2 of that L1 → first L3 of that L2. Empty
     when categories aren't loaded yet — user picks manually in that case. */
  const l1 = categories.find(c => c.level === 1)
  const l2 = l1 ? categories.find(c => c.level === 2 && c.parentId === l1.id) : undefined
  const l3 = l2 ? categories.find(c => c.level === 3 && c.parentId === l2.id) : undefined

  return {
    /* Identity */
    companyName: 'Demo Mail Co',
    tagline: 'Lightweight email marketing for indie SaaS teams',
    website: 'https://example.com',
    headerTags: ['Email Marketing', 'SaaS', 'Newsletters', 'Automation'],
    description:
      'Demo Mail Co helps indie SaaS teams ship transactional and lifecycle email without an in-house deliverability expert. ' +
      'Build campaigns with a drag-and-drop editor, segment your audience by behaviour, and route everything through a managed ' +
      'sending infrastructure that handles SPF, DKIM, DMARC and bounce processing for you.\n\n' +
      'Founders use the free tier to validate product-market fit; growth-stage teams upgrade for the analytics, A/B testing and ' +
      'automation library that ships out of the box.',

    /* Category — auto-picked when DB data loaded */
    l1Id: l1?.id || '',
    l2Id: l2?.id || '',
    l3Id: l3?.id || '',
    /* listingTypeIds + tagIds left empty — they depend on the category and
       load asynchronously after l3Id changes. User picks them manually. */

    /* Contact & location */
    contactName: 'Demo Owner',
    email: 'demo@example.com',
    phoneIso: 'US',
    phoneCode: '+1',
    phone: '6789990000',
    countryCode: 'US',
    country: 'United States',
    stateCode: 'CA',
    state: 'California',
    city: 'San Francisco',
    hqLocation: '123 Demo Street, San Francisco, CA 94110, USA',

    /* Story & media — screenshots stay user-uploaded */
    demoVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    founded: '2021',
    employees: '11-50',
    funding: 'Seed',
    linkedin: 'https://linkedin.com/company/demo-mail-co',
    twitter: 'https://x.com/demo_mail_co',
    facebook: 'https://facebook.com/demomailco',
    hasIosApp: true,
    hasAndroidApp: true,
    compliance: ['GDPR', 'SOC 2', 'CAN-SPAM'],
    awards: [
      { name: 'G2 Leader',         year: '2026' },
      { name: 'Capterra Best Value', year: '2025' },
      { name: 'Product Hunt #1 of the day', year: '2024' },
    ],
    languages: ['English', 'Spanish', 'French', 'German', 'Portuguese'],
    industriesServed: ['SaaS', 'E-commerce', 'Agencies', 'Non-profit', 'Education'],
    useCases: ['Newsletters', 'Drip campaigns', 'Lead capture', 'Customer journeys', 'Transactional email'],
    targetCompanySizes: ['Small (1-50)', 'Mid-market (51-500)'],
    supportChannels: ['Email/help desk', 'Chat', 'Knowledge base', 'FAQs/forum', '24/7 (live rep)'],
    trainingOptions: ['Live online', 'Videos', 'Webinars', 'Documentation'],

    /* Features */
    features: [
      'Drag-and-drop email builder',
      'A/B testing',
      'Audience segmentation',
      'Automated drip campaigns',
      'Real-time analytics',
      'Template gallery',
      'Subscriber forms',
      'Spam compliance toolkit',
      'Bounce + unsubscribe handling',
      'Webhook event firehose',
    ],
    keyFeatures: [
      {
        name: 'Email campaigns',
        description:
          'Build, schedule and send broadcast campaigns from a drag-and-drop editor. Per-recipient personalisation, ' +
          'time-zone aware sending, and engagement tracking are all built in. The campaign view rolls open / click / ' +
          'unsubscribe / revenue into one report so you can decide what to ship next without exporting a CSV.',
      },
      {
        name: 'Marketing automation',
        description:
          'Trigger journeys from any user event — signup, abandoned cart, downgrade, payment failure. Branching ' +
          'logic, delays and exit conditions cover the recipes you actually need without forcing you into a 100-step ' +
          'visual canvas. The library ships welcome series, win-back, and upgrade prompts you can fork.',
      },
      {
        name: 'Reporting & analytics',
        description:
          'Per-campaign and per-segment dashboards, cohort retention, revenue attribution to send, and a clean export ' +
          'API. Reviewers say the dashboards are easy to read and easy to act on. Connect to GA, Mixpanel, or your ' +
          'warehouse via the export hooks.',
      },
    ],
    integrations: [
      'Stripe', 'Slack', 'Zapier', 'Shopify', 'WordPress',
      'Salesforce', 'HubSpot', 'Segment', 'Webflow', 'Make',
    ],

    /* Pricing & FAQ */
    startingPrice: '13',
    startingPricePeriod: '/ month',
    hasFreeTrial: true,
    hasFreeVersion: true,
    pricingModel: 'Subscription',
    pricingTiers: [
      {
        name: 'Free',
        price: '0',
        period: '/ month',
        features: ['500 contacts', '2,500 sends/mo', 'Drag-and-drop editor', 'Basic templates'],
      },
      {
        name: 'Essentials',
        price: '13',
        period: '/ month',
        features: ['50,000 contacts', '500,000 sends/mo', 'A/B testing', 'Custom branding', 'Email support'],
      },
      {
        name: 'Standard',
        price: '20',
        period: '/ month',
        features: ['Predictive segmentation', 'Send-time optimisation', 'Dynamic content', '24/7 chat'],
      },
    ],
    pros: ['Generous free tier', 'Drag-and-drop is intuitive', '300+ integrations'],
    cons: ['Pricing scales steeply at high contact counts', 'Advanced automation locked behind paid tiers'],
    faqs: [
      {
        question: 'Who are the typical users of Demo Mail Co?',
        answer:
          'Indie founders, growth marketers at Series A SaaS, and small e-commerce teams. The free tier is generous ' +
          'enough to validate product-market fit; the Essentials tier kicks in once you cross ~5k contacts.',
      },
      {
        question: 'What is Demo Mail Co used for?',
        answer:
          'Lifecycle email — onboarding, retention, win-back, transactional notifications, and broadcast newsletters. ' +
          'Most customers run all of these from one workspace.',
      },
      {
        question: 'Does Demo Mail Co support custom domains?',
        answer:
          'Yes. Verify a sending domain via DNS in under five minutes. SPF, DKIM and DMARC records are generated for ' +
          'you and the platform monitors deliverability per-domain after that.',
      },
    ],
  }
}
