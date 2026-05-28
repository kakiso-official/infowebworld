import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import BusinessCTA from './components/BusinessCTA'
import Footer from './components/Footer'

const SITE = 'https://infowebworld.com'

/* The 6 L1 sectors — these are exactly the pages we want Google to surface
   as sitelinks under the InfoWebWorld brand result. Each one becomes:
   - a SiteNavigationElement node (primary navigation hint)
   - a ListItem inside the homepage ItemList (mainEntity)
   - a hasPart edge on the WebSite entity
   Triple-anchoring maximises the chance Google picks all 6 for sitelinks. */
const SECTORS = [
  { slug: 'ai-ml',                  name: 'AI & ML',                desc: 'Verified AI tools, agents, models, copilots, and frameworks.' },
  { slug: 'software-saas',          name: 'Software & SaaS',        desc: 'CRM, marketing, analytics, security, and project software.' },
  { slug: 'it-services-agencies',   name: 'IT Services & Agencies', desc: 'Web, mobile, software, design, and marketing agencies.' },
  { slug: 'startups-innovation',    name: 'Startups & Innovation',  desc: 'Breakthrough companies in FinTech, HealthTech, ClimateTech, AI & Web3.' },
  { slug: 'local-businesses',       name: 'Local Businesses',       desc: 'Restaurants, home services, health, automotive, beauty, retail.' },
  { slug: 'professional-services',  name: 'Professional Services',  desc: 'Accountants, attorneys, advisors, consultants, recruiters.' },
]

const organization = {
  '@type': 'Organization',
  '@id': `${SITE}#org`,
  name: 'InfoWebWorld',
  url: SITE,
  logo: 'https://infowebworld.com/logo/infowebworldlogo-logoforlightbackgrounds.png',
  description: 'Global business discovery platform with verified reviews, dofollow backlinks, and lead generation across 80+ industries.',
  foundingDate: '2026',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Brain Stream Australia Pty Ltd',
    addressLocality: 'Parramatta',
    addressRegion: 'NSW',
    postalCode: '2150',
    addressCountry: 'AU',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'iww@brainstream.com.au',
    url: `${SITE}/contact`,
  },
  sameAs: [
    'https://x.com/infowebworld_x',
    'https://www.linkedin.com/company/infowebworld/',
    'https://www.instagram.com/infowebworld',
  ],
}

/* WebSite + SearchAction qualifies the homepage for the sitelinks search
   box (the prominent search input under the brand result in SERP).
   hasPart links the 6 sectors so Google reads them as primary children. */
const website = {
  '@type': 'WebSite',
  '@id': `${SITE}#website`,
  url: SITE,
  name: 'InfoWebWorld',
  description: 'The global business discovery platform. Search, compare, and review businesses across 80+ industries in 12 countries.',
  publisher: { '@id': `${SITE}#org` },
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/all?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
  hasPart: SECTORS.map(s => ({ '@type': 'WebPage', '@id': `${SITE}/${s.slug}`, url: `${SITE}/${s.slug}`, name: s.name })),
}

/* SiteNavigationElement nodes — Google reads these as the site's primary
   navigation. Each carries the sector name + URL + description. Strong
   sitelink signal when combined with the homepage ItemList below. */
const siteNavElements = SECTORS.map(s => ({
  '@type': 'SiteNavigationElement',
  '@id': `${SITE}/${s.slug}#nav`,
  name: s.name,
  description: s.desc,
  url: `${SITE}/${s.slug}`,
}))

/* ItemList of the 6 primary sections — emitted as the homepage's mainEntity
   so Google understands the page is a hub directing to these six children.
   Highest-signal way to influence sitelink selection short of in-product
   click data. */
const sectorList = {
  '@type': 'ItemList',
  '@id': `${SITE}#primary-sections`,
  name: 'InfoWebWorld primary sectors',
  description: 'The six primary sectors covered by InfoWebWorld.',
  numberOfItems: SECTORS.length,
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  itemListElement: SECTORS.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${SITE}/${s.slug}`,
    name: s.name,
    description: s.desc,
  })),
}

const webPage = {
  '@type': 'WebPage',
  '@id': `${SITE}#homepage`,
  url: SITE,
  name: 'InfoWebWorld — Find, Compare & Review Verified Businesses',
  description: 'Search verified businesses, tools, agencies, and professionals across 80+ industries — with real reviews, transparent pricing, and dofollow listings.',
  isPartOf: { '@id': `${SITE}#website` },
  about: { '@id': `${SITE}#org` },
  mainEntity: { '@id': `${SITE}#primary-sections` },
  primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}/og-image.png` },
  inLanguage: 'en-US',
}

export const metadata: Metadata = {
  alternates: { canonical: 'https://infowebworld.com' },
}

const faqJsonLd = {
  '@type': 'FAQPage',
  '@id': `${SITE}#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is InfoWebWorld?',
      acceptedAnswer: { '@type': 'Answer', text: 'InfoWebWorld is a global business discovery platform where users can search, compare, and review businesses across 80+ industries in 12+ countries. It helps professionals find the best solutions through verified reviews and detailed company profiles.' },
    },
    {
      '@type': 'Question',
      name: 'How does InfoWebWorld work?',
      acceptedAnswer: { '@type': 'Answer', text: 'Users can search businesses by category or location, compare companies side by side, read verified reviews, and connect directly with service providers. Every listing includes satisfaction scores, feature breakdowns, and real user feedback.' },
    },
    {
      '@type': 'Question',
      name: 'Is it free to list a business on InfoWebWorld?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes, businesses can submit listings for free on InfoWebWorld. Free listings include a company profile, category placement, and a dofollow backlink. Optional premium plans are available for enhanced visibility and lead generation features.' },
    },
    {
      '@type': 'Question',
      name: 'What industries does InfoWebWorld cover?',
      acceptedAnswer: { '@type': 'Answer', text: 'InfoWebWorld covers 80+ industries including SaaS, marketing, cybersecurity, cloud computing, HR tech, fintech, e-commerce, healthcare, legal services, education technology, and many more. New categories are added regularly based on market demand.' },
    },
    {
      '@type': 'Question',
      name: 'How can I add my business to InfoWebWorld?',
      acceptedAnswer: { '@type': 'Answer', text: 'Visit the Get Listed page to submit your business details. Fill in your company information, choose a category, and submit for review. Once approved, your listing goes live with a verified badge and dofollow backlink.' },
    },
  ],
}

export default function Home() {
  return (
    <>
      {/* JSON-LD — single @graph carrying Organization, WebSite+SearchAction
          (qualifies for the sitelinks search box), WebPage, ItemList of the
          6 primary sectors (drives sitelink selection), SiteNavigationElement
          per sector (primary nav hint), and FAQPage. All entities use @id
          cross-references for proper graph resolution. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [organization, website, webPage, sectorList, ...siteNavElements, faqJsonLd],
        }) }}
      />

      <Navbar />

      {/* 1. Hero — Email capture + visual showcase */}
      <Hero />

      {/* 2. Countdown timer — urgency */}
      <Countdown />

      {/* 3. Business CTA */}
      <BusinessCTA />

      {/* 4. Footer */}
      <Footer />
    </>
  )
}
