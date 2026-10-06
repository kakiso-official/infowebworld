import {
  faLayerGroup, faUserCheck, faLaptopCode,
  faHandshake, faBullhorn, faHeadset, faUsers, faFileInvoiceDollar, faGears, faListCheck,
  faPeopleGroup, faComments, faServer, faShieldHalved, faChartPie, faCode, faCartShopping,
  faNewspaper, faPalette, faPhotoFilm, faRectangleAd, faIndustry, faMicrochip,
  faAddressBook, faEnvelopeOpenText, faDiagramProject, faWandMagicSparkles, faNetworkWired,
  faBookOpenReader, faHandHoldingHeart, faReceipt, faChartColumn, faHospital, faBug,
  faMagnifyingGlass, faRocket,
} from '@fortawesome/free-solid-svg-icons'
import { sectorViewAllPath } from '@/lib/sector-paths'
import type { SectorDirectorySpec } from '../types'

/* ═══════════════════════════════════════════════════════════════════════
   SaaS directory - /saas-directory (was /software-saas). Copy is verbatim
   from the SEO specialist's brief (Oct 2026), with these exceptions:
   - hero stats use live numbers: "1,000+ SaaS & Software Listings" is the
     sector's real live count (192 in Oct 2026), not the brief's 1,000+
   - "List Your SaaS Company" (no link in the brief) goes to /business
   ═══════════════════════════════════════════════════════════════════════ */

const SECTOR = 'software-saas'
const VIEW_ALL = sectorViewAllPath(SECTOR)

export const SAAS_DIRECTORY: SectorDirectorySpec = {
  sector: SECTOR,
  accent: '#3F8FD4',
  breadcrumbName: 'SaaS Directory',

  meta: {
    title: '#1 Rated SaaS Directory: Find, Compare & List SaaS Companies',
    description: 'Browse the SaaS directory to find, compare, and review SaaS companies, software products, and vendors. List your SaaS business and reach buyers worldwide.',
    keywords: [
      'saas directory', 'saas companies', 'saas companies list', 'software directory',
      'business software directory', 'saas products', 'software vendors',
      'list your saas', 'saas reviews', 'compare saas', 'InfoWebWorld',
    ],
    ogImageAlt: 'InfoWebWorld SaaS Directory',
    about: 'SaaS companies and business software',
  },

  hero: {
    title: '#1 Rated SaaS Directory to Find, Compare, and List SaaS Companies',
    sub: 'Find SaaS products, business software, and technology vendors by category, country, and use case. Compare software features, pricing, reviews, and company information to find the right solution.',
    searchPlaceholder: 'Search software, SaaS tools, categories…',
    stats: [
      { kind: 'subcategories', label: 'SaaS Categories', icon: faLayerGroup, roundTo: 1000 },
      { kind: 'static', text: '100% Manually Verified', icon: faUserCheck },
      { kind: 'listings', label: 'SaaS & Software Listings', icon: faLaptopCode },
    ],
    primaryCta: { label: 'Browse SaaS Listings', href: VIEW_ALL },
    secondaryCta: { label: 'List Your SaaS Company', href: '/business' },
  },

  categories: {
    heading: 'Browse the SaaS Directory by Category',
    sub: 'Find SaaS software by business function, industry, and use case. Browse categories to compare software products and identify vendors that match your business requirements.',
    listName: 'SaaS software categories',
    l2: [
      { slug: 'crm-sales-software',                  icon: faHandshake },
      { slug: 'marketing-software',                  icon: faBullhorn },
      { slug: 'customer-service-support-software',   icon: faHeadset },
      { slug: 'hr-people-management-software',       icon: faUsers },
      { slug: 'accounting-finance-software',         icon: faFileInvoiceDollar },
      { slug: 'erp-operations-software',             icon: faGears },
      { slug: 'project-management-software',         icon: faListCheck },
      { slug: 'collaboration-productivity-software', icon: faPeopleGroup },
      { slug: 'communication-software',              icon: faComments },
      { slug: 'it-management-software',              icon: faServer },
      { slug: 'cybersecurity-software',              icon: faShieldHalved },
      { slug: 'data-analytics-software',             icon: faChartPie },
      { slug: 'development-devops-software',         icon: faCode },
      { slug: 'ecommerce-software',                  icon: faCartShopping },
      { slug: 'content-management-software',         icon: faNewspaper },
      { slug: 'design-creative-software',            icon: faPalette },
      { slug: 'video-audio-software',                icon: faPhotoFilm },
      { slug: 'digital-advertising-software',        icon: faRectangleAd },
      { slug: 'industry-specific-software',          icon: faIndustry },
      { slug: 'emerging-technology',                 icon: faMicrochip },
    ],
  },

  popular: {
    heading: 'Popular SaaS Software Categories and Solutions',
    sub: 'Jump to the SaaS products and business software categories buyers search for most. Compare software by features, use case, pricing, and provider.',
    cta: { label: 'Browse All SaaS Software Categories', href: VIEW_ALL },
    picks: [
      { slug: 'crm-platforms' },
      { slug: 'sales-engagement-automation' },
      { slug: 'product-management-saas' },
      { slug: 'marketing-automation' },
      { slug: 'productivity-tools' },
      { slug: 'network-monitoring' },
      { slug: 'learning-development' },
      { slug: 'nonprofit-software' },
      { slug: 'tax-management' },
      { slug: 'business-intelligence-bi' },
      { slug: 'healthcare-software' },
      { slug: 'software-testing-saas' },
    ],
    icons: {
      'crm-platforms': faAddressBook,
      'sales-engagement-automation': faEnvelopeOpenText,
      'product-management-saas': faDiagramProject,
      'marketing-automation': faWandMagicSparkles,
      'productivity-tools': faListCheck,
      'network-monitoring': faNetworkWired,
      'learning-development': faBookOpenReader,
      'nonprofit-software': faHandHoldingHeart,
      'tax-management': faReceipt,
      'business-intelligence-bi': faChartColumn,
      'healthcare-software': faHospital,
      'software-testing-saas': faBug,
    },
  },

  featured: {
    heading: 'Featured SaaS Companies and Software Vendors',
    sub: 'See featured SaaS companies, software providers, and technology vendors listed on InfoWebWorld. Compare their products, services, features, and business information in one place.',
    tabsLabel: 'SaaS categories',
    emptyNoun: 'SaaS products',
  },

  recent: {
    heading: 'Recently Added and Verified SaaS Listings',
    sub: 'See the latest SaaS companies and software products added to the directory. Each listing is reviewed before publication to help businesses find relevant and reliable software providers.',
    ctaLabel: 'Browse all SaaS listings',
  },

  countries: {
    heading: 'SaaS Companies and Software Vendors by Country',
    sub: 'Find SaaS companies, software vendors, and business software providers by country. Browse local and global SaaS businesses based on where they operate or serve customers.',
    pillTemplate: 'Verified SaaS listings from {n} countries',
  },

  comparison: {
    heading: 'Why People Choose InfoWebWorld SaaS Directory',
    sub: "Whether you're searching for business software or promoting a SaaS product, InfoWebWorld brings software buyers and SaaS companies together in one searchable directory.",
    caption: 'InfoWebWorld compared with a typical free SaaS directory',
    audiences: [
      {
        heading: 'For Businesses Looking for SaaS Software',
        text: 'Find SaaS products by category and use case, compare features, pricing, and reviews, and connect with software vendors that match your business requirements.',
        icon: faMagnifyingGlass,
      },
      {
        heading: 'For SaaS Companies Looking for Customers',
        text: 'List your SaaS product, showcase its features and pricing, collect customer reviews, and get found by businesses actively searching for software solutions.',
        icon: faRocket,
      },
    ],
  },

  reviews: {
    heading: 'Trusted by Software Buyers and SaaS Companies',
    sub: 'Read reviews from customers and businesses about the SaaS products and software providers listed on InfoWebWorld. Share your experience to help other software buyers make informed decisions.',
    ctaLabel: 'Write a Review',
  },

  blog: {
    heading: 'Latest SaaS Software Guides and Insights',
    sub: 'Stay informed with practical guides, software comparisons, SaaS trends, and buying resources designed to help businesses evaluate and choose the right software.',
    ctaLabel: 'Read All SaaS Articles',
    topic: 'saas',
  },

  faqs: [
    {
      q: 'What is an InfoWebWorld SaaS Directory?',
      a: 'InfoWebWorld SaaS directory is an online database of software-as-a-service companies, products, and vendors organized by category, industry, use case, and location.',
    },
    {
      q: 'What Can I Find in the InfoWebWorld SaaS Directory?',
      a: 'You can find SaaS companies, business software, software vendors, and SaaS products across categories such as CRM, project management, accounting, marketing, HR, analytics, cybersecurity, customer support, and more.',
    },
    {
      q: 'How Do I Find the Right SaaS Software?',
      a: 'Start by selecting a software category or business use case. Compare relevant SaaS products based on features, pricing, reviews, company information, and other available details before contacting the provider.',
    },
    {
      q: 'Can SaaS Companies List Their Software on InfoWebWorld?',
      a: 'Yes. SaaS companies can create a listing on InfoWebWorld to showcase their software, company information, features, and other relevant details to businesses searching for SaaS solutions.',
      links: [{ text: 'create a listing on InfoWebWorld', href: '/business' }],
    },
    {
      q: 'What is the Difference Between a SaaS Directory and a Software Directory?',
      a: 'A SaaS directory focuses primarily on cloud-based software delivered as a service, while a broader software directory can include SaaS, desktop software, applications, platforms, and other types of software products.',
    },
  ],

  finalCta: {
    title: 'List Your SaaS Product and Reach More Buyers',
    subtitle: 'Put your SaaS company in front of businesses searching for software solutions. Create your listing, showcase your product, and help potential customers understand what your software offers.',
    cta: { label: 'List Your SaaS Company', href: '/business' },
  },
}
