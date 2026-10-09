import type { TextLink } from '../components/linked-text'

/* ═══════════════════════════════════════════════════════════════════════
   /faqs copy - single source for the visible accordions AND the FAQPage
   JSON-LD, so the two can never drift apart.

   Copy is from the SEO specialist's brief (Oct 2026). Deliberate fixes:
   "Elite Lifetime Funding" -> "Elite Lifetime Founding" (the plan's real
   name), "reviews tools" -> "review tools", "free listings approval" ->
   "free listing approval". Links point at current URLs, never redirects.
   ═══════════════════════════════════════════════════════════════════════ */

export type FaqItem = { q: string; a: string; links?: TextLink[] }
export type FaqGroup = { id: string; title: string; items: FaqItem[] }

export const FAQ_INTRO =
  'Find quick answers about InfoWebWorld, the global business directory: how to create a business listing, what each plan costs, how verified reviews work, what backlinks you get, and how to manage your account.'

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'about-infowebworld',
    title: 'About InfoWebWorld',
    items: [
      {
        q: 'What is InfoWebWorld?',
        a: 'InfoWebWorld is a free global business directory where buyers find, compare and review verified companies, software, AI tools and agencies, and businesses create a free listing to get discovered. Learn more about InfoWebWorld.',
        links: [
          { text: 'create a free listing', href: '/business' },
          { text: 'about InfoWebWorld', href: '/about' },
        ],
      },
      {
        q: 'Is InfoWebWorld free to use?',
        a: 'Yes. Searching the directory is free, and the Free plan lets any business create a basic listing with no credit card. Optional paid plans add review tools, a dofollow backlink and analytics. See Plans & Pricing.',
        links: [{ text: 'Plans & Pricing', href: '/business/plans' }],
      },
      {
        q: 'Who owns and runs InfoWebWorld?',
        a: 'InfoWebWorld is owned and operated by Brain Stream.',
        links: [{ text: 'Brain Stream', href: 'https://www.brainstream.com.au/' }],
      },
      {
        q: 'Which business categories can I search?',
        a: 'InfoWebWorld covers 80+ industries in six main categories.',
        links: [{ text: 'six main categories', href: '/categories' }],
      },
      {
        q: 'Which countries can I search for businesses?',
        a: 'You can filter listings by location, including the USA, India, the UK, Canada and Australia, then narrow by category or city. Start with Browse by Country.',
        links: [{ text: 'Browse by Country', href: '/countries' }],
      },
      {
        q: 'Is InfoWebWorld a trustworthy business directory?',
        a: 'InfoWebWorld uses human-reviewed listings, real buyer reviews with anti-fake screening, and does not sell rankings by the click or by the day. Read our content guidelines.',
        links: [{ text: 'content guidelines', href: '/content-guidelines' }],
      },
    ],
  },
  {
    id: 'business-listings',
    title: 'Business Listings',
    items: [
      {
        q: 'How do I list my business on InfoWebWorld?',
        a: 'Choose a plan on the Get Listed page, then complete the listing form with your business name, category, location, website and description.',
        links: [{ text: 'Get Listed page', href: '/business' }],
      },
      {
        q: 'How long does it take for my listing to be approved?',
        a: 'Paid listings are reviewed within 48 hours, and there is no specific timeline for free listing approval.',
      },
      {
        q: 'Can I list more than one business or location?',
        a: 'Yes. There is no set limit per account, and each listing has its own plan. Agencies managing 5 or more clients can join the Agency Partner Program.',
        links: [{ text: 'Agency Partner Program', href: '/agencies' }],
      },
      {
        q: 'Can I edit my business listing after it goes live?',
        a: 'Yes, from your business dashboard. Paid plans publish edits immediately, while free plans need a quick re-review.',
      },
      {
        q: 'Why was my listing rejected?',
        a: 'We email you the reason, usually a content-guideline issue. You can fix it and resubmit. Check the content guidelines first.',
        links: [{ text: 'content guidelines', href: '/content-guidelines' }],
      },
      {
        q: 'What does the Free plan include?',
        a: 'The Free plan includes a basic business listing, search visibility, a website link, social links and one category, for $0 with no credit card.',
      },
    ],
  },
  {
    id: 'plans-pricing-billing',
    title: 'Plans, Pricing and Billing',
    items: [
      {
        q: 'How much does an InfoWebWorld business listing cost?',
        a: 'The Free plan is $0. Starter is $49 one-time, Early Adopter is $99 per year, and Elite Lifetime Founding is $239 one-time. Launch offers can change, so check Plans & Pricing for current prices.',
        links: [{ text: 'Plans & Pricing', href: '/business/plans' }],
      },
      {
        q: 'What is the difference between Starter, Early Adopter and Elite Lifetime?',
        a: 'Starter is a one-time payment with core features: a permanent dofollow backlink, verified reviews, a custom URL, an FAQ section and analytics. Early Adopter is billed yearly with the full feature set. Elite Lifetime Founding is a one-time payment for the full feature set with no renewals.',
      },
      {
        q: 'How do I upgrade my plan?',
        a: 'Use the Upgrade option in your dashboard or visit Plans & Pricing. Upgrades are prorated, and downgrades take effect at your next renewal.',
        links: [{ text: 'Plans & Pricing', href: '/business/plans' }],
      },
      {
        q: 'What payment methods does InfoWebWorld accept?',
        a: 'InfoWebWorld accepts PayPal, which covers major cards and PayPal balance. More payment options are planned.',
      },
    ],
  },
  {
    id: 'reviews-and-ratings',
    title: 'Reviews and Ratings',
    items: [
      {
        q: 'How do I write a review on InfoWebWorld?',
        a: "Open Write a Review, search for the company, rate your experience, then write or speak your review and submit it. Our screening and moderation check it before it counts toward the company's rating.",
        links: [{ text: 'Write a Review', href: '/write-review' }],
      },
      {
        q: 'Are InfoWebWorld reviews real and verified?',
        a: 'Reviews come from real buyers and pass anti-fake screening and moderation. Businesses cannot pay for reviews or pay to have them removed.',
      },
      {
        q: 'Can I review a company that is not listed?',
        a: 'Not until it has a profile. Use Get Listed to add the company, then write your review.',
        links: [{ text: 'Get Listed', href: '/business' }],
      },
      {
        q: 'How can my business collect more customer reviews?',
        a: 'Paid plans include a Review Invitation Tool to send review links by email or SMS, plus an embeddable reviews widget for your website.',
      },
      {
        q: 'Can I remove a bad review?',
        a: 'Only if it breaks the content guidelines, such as fake, paid or defamatory reviews. Flag it in your dashboard, and moderators respond within 72 hours. Genuine negative reviews stay, but you can reply publicly.',
        links: [{ text: 'content guidelines', href: '/content-guidelines' }],
      },
    ],
  },
  {
    id: 'seo-backlinks-ai-visibility',
    title: 'SEO, Backlinks and AI Visibility',
    items: [
      {
        q: 'Does InfoWebWorld give dofollow backlinks?',
        a: 'Yes. Paid listings (Starter, Early Adopter and Elite Lifetime Founding) include a permanent dofollow backlink to your website. Free listings include a nofollow website link.',
      },
      {
        q: 'Will an InfoWebWorld listing improve my Google ranking?',
        a: 'A listing can support your SEO, but backlinks are only one of many ranking factors. InfoWebWorld makes no guaranteed ranking promises.',
      },
      {
        q: 'Can InfoWebWorld help my business appear in AI answers?',
        a: 'Listings use structured, schema-optimized profiles that search engines and AI assistants such as ChatGPT and Perplexity can read more easily. No placement in AI answers is guaranteed.',
      },
      {
        q: 'Can I pay for a better ranking?',
        a: 'Not by the click or by the day. Early Adopter and Elite Lifetime plans include premium placement as a feature, and ranking also depends on plan tier, engagement and review quality.',
      },
    ],
  },
  {
    id: 'search-compare-categories',
    title: 'Search, Compare and Categories',
    items: [
      {
        q: 'How do I find a company on InfoWebWorld?',
        a: 'Search by company name, or browse by category, country and city. Start with all categories or Browse by Country.',
        links: [
          { text: 'all categories', href: '/categories' },
          { text: 'Browse by Country', href: '/countries' },
        ],
      },
      {
        q: 'How do I compare companies or products?',
        a: 'Use Compare Products to weigh software and tools side by side, or Compare Companies to compare agencies and service providers.',
        links: [
          { text: 'Compare Products', href: '/compare' },
          { text: 'Compare Companies', href: '/compare-companies' },
        ],
      },
      {
        q: 'Which category should I choose for my listing?',
        a: 'Pick the category and find the sub-category that best matches what you sell.',
      },
      {
        q: 'What are category guides and the glossary?',
        a: 'The category guides explain how to choose in each category, and the glossary defines business and software terms in plain language.',
        links: [
          { text: 'category guides', href: '/category-guides' },
          { text: 'glossary', href: '/glossary' },
        ],
      },
      {
        q: 'How accurate is the listing data?',
        a: 'Listing data is regularly refreshed, and owners can update their own profile at any time from the dashboard.',
      },
    ],
  },
  {
    id: 'agency-partner-program',
    title: 'Agency Partner Program',
    items: [
      {
        q: 'What is the InfoWebWorld Agency Partner Program?',
        a: 'It lets agencies manage more than one client listing from one dashboard, with bulk upload, white-label reports and revenue share. See the Agency Partner Program.',
        links: [{ text: 'Agency Partner Program', href: '/agencies' }],
      },
      {
        q: 'Who can join the Agency Partner Program?',
        a: 'SEO, PR, growth and local-marketing agencies, consultancies and venture studios managing at least 5 client businesses or portfolio companies. Single-business owners are not a fit.',
      },
      {
        q: 'What features do agency partners get?',
        a: 'Bulk CSV upload with an import wizard, batch edits, scheduled publishing, a permanent dofollow backlink on each paid listing, branded monthly PDF reports per client and a dedicated account lead.',
      },
      {
        q: 'How does the agency revenue share work?',
        a: 'Agencies earn a recurring percentage on each paid listing they bring in. Payouts are monthly with a transparent ledger and no clawbacks on renewals.',
      },
    ],
  },
  {
    id: 'affiliate-program',
    title: 'Affiliate Program',
    items: [
      {
        q: 'How does the InfoWebWorld affiliate program work?',
        a: 'Affiliates earn 30% on the first payment of a referred paid plan and 15% recurring on each yearly renewal. Learn more about the affiliate program.',
        links: [{ text: 'affiliate program', href: '/affiliates' }],
      },
      {
        q: 'Who can become an InfoWebWorld affiliate?',
        a: 'Creators and consultants with an audience of business owners, marketers or founders, such as newsletter writers, YouTubers, SEO bloggers and LinkedIn creators.',
      },
      {
        q: 'How and when are affiliates paid?',
        a: 'Payouts are monthly via PayPal, Wise or bank transfer, with a $50 minimum. Referrals are tracked with a 90-day cookie from the first click.',
      },
      {
        q: 'How do I join the affiliate program?',
        a: 'Send a note through the contact page with [AFFILIATE] in the subject line, plus your audience, content format and one or two example pieces. Most applicants are approved within 48 hours.',
        links: [{ text: 'contact page', href: '/contact' }],
      },
    ],
  },
  {
    id: 'account-privacy-data',
    title: 'Account, Privacy and Data',
    items: [
      {
        q: 'How do I sign in with Google?',
        a: 'Select the Google sign-in button, choose your account in the popup and sign in without a password.',
      },
      {
        q: 'How do I delete my InfoWebWorld account?',
        a: 'Contact support through the contact page with [DELETE] in the subject line. Personal data is removed within 30 days after identity confirmation, except what the law requires us to keep.',
        links: [{ text: 'contact page', href: '/contact' }],
      },
      {
        q: 'Can I export my listing data?',
        a: 'Yes. Use the export tool in your dashboard, or ask support for a full CSV of your submissions, reviews and analytics.',
      },
      {
        q: 'How does InfoWebWorld protect my personal data?',
        a: 'Read the Privacy Policy, Terms of Use and Do Not Sell or Share My Personal Information pages for how your data is handled and your choices.',
        links: [
          { text: 'Privacy Policy', href: '/privacy' },
          { text: 'Terms of Use', href: '/terms' },
          { text: 'Do Not Sell or Share My Personal Information', href: '/do-not-sell' },
        ],
      },
    ],
  },
  {
    id: 'support-and-contact',
    title: 'Support and Contact',
    items: [
      {
        q: 'How do I contact InfoWebWorld support?',
        a: 'Email team@infowebworld.com, call +61 430 565 600, or use the contact page. You can also visit Help & Support.',
        links: [
          { text: 'team@infowebworld.com', href: 'mailto:team@infowebworld.com' },
          { text: '+61 430 565 600', href: 'tel:+61430565600' },
          { text: 'contact page', href: '/contact' },
          { text: 'Help & Support', href: '/help' },
        ],
      },
      {
        q: 'Where is InfoWebWorld based?',
        a: 'InfoWebWorld is headquartered in Parramatta, Sydney, NSW 2150, Australia, and lists businesses worldwide.',
      },
      {
        q: 'How do I report a problem with a listing or review?',
        a: 'Business owners can flag a review in the dashboard. Anyone can contact Help & Support or use the Removals page. Reviews are removed only if they break the content guidelines.',
        links: [
          { text: 'Help & Support', href: '/help' },
          { text: 'Removals page', href: '/removals' },
        ],
      },
      {
        q: 'Is InfoWebWorld hiring?',
        a: 'See open roles on the team page.',
        links: [{ text: 'team page', href: '/team#open-roles' }],
      },
    ],
  },
]
