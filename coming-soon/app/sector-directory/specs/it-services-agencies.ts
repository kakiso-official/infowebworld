import {
  faEarthAmericas, faLayerGroup, faBuildingCircleCheck,
  faCode, faMobileScreen, faLaptopCode, faCartShopping, faPenRuler, faBullhorn,
  faMicrochip, faServer, faFilm, faHeadset,
  faSitemap, faDesktop, faPrint, faChessKnight, faMagnifyingGlassChart, faGamepad,
  faRectangleAd, faCubes, faStore, faComments, faBriefcase, faIndustry, faVideo,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { sectorViewAllPath } from '@/lib/sector-paths'
import type { SectorDirectorySpec } from '../types'

/* ═══════════════════════════════════════════════════════════════════════
   IT directory - /it-directory (was /it-services-agencies). Copy is
   verbatim from the SEO specialist's brief (Oct 2026), with these
   exceptions:
   - hero stats use live numbers. The brief's "7,000+ Live Business
     Listings" (a directory-wide figure) and "800+ Sub-Categories" (the
     local-business number) are not IT figures; IT's live listing count is
     already the "Verified Companies" badge, so the first badge shows the
     countries those companies are in, and sub-categories are IT's own.
   - the two audience paragraphs under the comparison table were the local
     page's text ("Find local businesses ..."); reworded for IT companies
   - FAQ 1 brand casing "InfoWebWorld"; FAQ 4 "Paid plans (239)" reads
     "($49 - $239)" as on the other directory pages
   - "eCommerce Specialization" uses the category's official name
   ═══════════════════════════════════════════════════════════════════════ */

const SECTOR = 'it-services-agencies'
const VIEW_ALL = sectorViewAllPath(SECTOR)

export const IT_DIRECTORY: SectorDirectorySpec = {
  sector: SECTOR,
  accent: '#1D9E75',
  breadcrumbName: 'IT Directory',

  meta: {
    title: '#1 Rated IT Directory: Find or List IT Companies',
    description: 'Browse IT directory to find and compare IT companies, add reviews, or list your IT company for free. Get featured to improve IT business visibility worldwide.',
    keywords: [
      'it directory', 'it companies directory', 'it business directory',
      'it services directory', 'list of it companies', 'top it companies',
      'it service providers', 'list your it company', 'it company reviews',
      'InfoWebWorld',
    ],
    ogImageAlt: 'InfoWebWorld IT Directory',
    about: 'IT companies',
  },

  hero: {
    title: '#1 Rated IT Directory to Find, Compare and List IT Companies Worldwide',
    sub: 'Search IT service providers by service and country, then compare real buyer reviews to choose with confidence.',
    searchPlaceholder: 'Search IT services, agencies, categories…',
    stats: [
      { kind: 'countries', label: 'Countries Served', icon: faEarthAmericas },
      { kind: 'subcategories', label: 'Sub-Categories', icon: faLayerGroup, roundTo: 100 },
      { kind: 'listings', label: 'Verified Companies', icon: faBuildingCircleCheck },
    ],
    primaryCta: { label: 'Find IT Companies', href: VIEW_ALL },
    secondaryCta: { label: 'List Your IT Company', href: '/business' },
  },

  categories: {
    heading: 'Browse IT Business Directory for the IT Services You Need',
    sub: 'Every category lists IT companies with their services, location, and real reviews, so you can shortlist quickly.',
    listName: 'IT service categories',
    l2: [
      { slug: 'web-development-services',        icon: faCode },
      { slug: 'mobile-app-development-services', icon: faMobileScreen },
      { slug: 'software-development-services',   icon: faLaptopCode },
      { slug: 'ecommerce-development-services',  icon: faCartShopping },
      { slug: 'design-ux-services',              icon: faPenRuler },
      { slug: 'digital-marketing-seo-services',  icon: faBullhorn },
      { slug: 'ai-emerging-tech-services',       icon: faMicrochip },
      { slug: 'it-services-consulting',          icon: faServer },
      { slug: 'creative-production-services',    icon: faFilm },
      { slug: 'business-services-bpo',           icon: faHeadset },
    ],
  },

  popular: {
    heading: 'Most Searched IT Services Globally',
    sub: 'Browse our curated selection of IT service categories to find leading providers for your business needs.',
    cta: { label: 'Explore All IT Services', href: VIEW_ALL },
    picks: [
      { slug: 'custom-web-development' },
      { slug: 'cms-development' },
      { slug: 'web-design' },
      { slug: 'ui-ux-design' },
      { slug: 'graphic-print-design' },
      { slug: 'it-consulting-strategy' },
      { slug: 'search-engine-optimization-seo' },
      { slug: 'game-development-services' },
      { slug: 'paid-advertising-ppc' },
      { slug: 'erp-implementation' },
      { slug: 'ecommerce-specializations' },
      { slug: 'chatbots-conversational-ai' },
      { slug: 'business-consulting' },
      { slug: 'engineering-manufacturing' },
      { slug: 'video-production' },
    ],
    icons: {
      'custom-web-development': faCode,
      'cms-development': faSitemap,
      'web-design': faDesktop,
      'ui-ux-design': faPenRuler,
      'graphic-print-design': faPrint,
      'it-consulting-strategy': faChessKnight,
      'search-engine-optimization-seo': faMagnifyingGlassChart,
      'game-development-services': faGamepad,
      'paid-advertising-ppc': faRectangleAd,
      'erp-implementation': faCubes,
      'ecommerce-specializations': faStore,
      'chatbots-conversational-ai': faComments,
      'business-consulting': faBriefcase,
      'engineering-manufacturing': faIndustry,
      'video-production': faVideo,
    },
  },

  featured: {
    heading: 'Featured IT Companies Serving Businesses Worldwide',
    sub: 'Standout profiles from companies that chose featured placement on InfoWebWorld.',
    tabsLabel: 'IT service categories',
    emptyNoun: 'IT companies',
  },

  recent: {
    heading: 'Recently Added and Verified IT Business Listings',
    sub: 'See the latest IT companies, software providers, and technology service businesses added and verified on InfoWebWorld.',
    ctaLabel: 'Browse all IT companies',
  },

  countries: {
    heading: 'IT Companies Listed Across Countries and Regions',
    sub: 'Need a provider in your region or time zone? Browse by location, or list your company where buyers look.',
    pillTemplate: 'Verified IT company listings from {n} countries',
  },

  comparison: {
    heading: 'Why People Choose InfoWebWorld IT Directory?',
    sub: 'Compare providers with confidence, or put your company in front of businesses ready to hire.',
    caption: 'InfoWebWorld compared with a typical free IT directory',
    audiences: [
      {
        heading: 'For Businesses Hiring IT Providers',
        text: 'Find IT companies by service and location, compare services and customer reviews, and connect directly with providers that match your needs.',
        icon: faMagnifyingGlass,
      },
      {
        heading: 'For IT Companies Looking for Clients',
        text: 'List your IT company for free, showcase your services and location, collect customer reviews, and get found by businesses searching for IT providers.',
        icon: faLaptopCode,
      },
    ],
  },

  reviews: {
    heading: 'What Clients Say About IT Companies',
    sub: 'Read what real buyers experienced, then add your own review to help others.',
    ctaLabel: 'Write a Review',
  },

  blog: {
    heading: 'IT Insights and Buying Guides',
    sub: 'Practical advice on choosing an IT provider, comparing services, and winning more clients.',
    ctaLabel: 'Read All Articles',
    topic: 'it',
  },

  faqs: [
    {
      q: 'What is the InfoWebWorld IT Directory?',
      a: 'InfoWebWorld is an IT business directory that allows IT service providers to list their businesses and customers to find the right IT service provider worldwide.',
    },
    {
      q: 'How Do I Find the Right IT Company on InfoWebWorld?',
      a: 'Pick a service and country, then compare profiles and buyer reviews to build your shortlist.',
    },
    {
      q: 'Is There a List of Top IT Companies on InfoWebWorld?',
      a: 'Yes. Browse the list of top IT companies, ranked by buyer ratings and profile views.',
    },
    {
      q: 'Can I List My IT Company on InfoWebWorld for Free?',
      a: 'Yes. You can list your IT company for free, with no credit card required. Paid plans ($49 - $239) offer additional benefits, including featured placement and a verified badge.',
    },
    {
      q: 'How Do I Add My IT Company to InfoWebWorld?',
      a: 'Open the Get Listed page, choose a plan, fill in your company details, and submit. Our team reviews it and emails you the decision.',
      links: [{ text: 'Get Listed page', href: '/business' }],
    },
    {
      q: 'How is InfoWebWorld Different from Other Business Directories?',
      a: 'InfoWebWorld focuses on IT providers with real buyer reviews, country-based browsing, and a free listing option.',
      links: [{ text: 'real buyer reviews', href: '/write-review' }],
    },
  ],

  finalCta: {
    title: 'Your Next Client Is Already Searching for IT Providers.',
    subtitle: 'List your IT company free on InfoWebWorld, and let businesses worldwide find, compare and review it.',
    cta: { label: 'List Your IT Company Free', href: '/business' },
  },
}
