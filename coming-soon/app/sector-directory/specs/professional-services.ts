import {
  faBriefcase, faUserCheck, faLayerGroup,
  faCalculator, faCompassDrafting, faChalkboardUser, faCalendarCheck, faPersonChalkboard,
  faChartLine, faUsers, faShieldHalved, faUserSecret, faBuildingColumns, faScaleBalanced,
  faBullhorn, faBuilding, faClipboardCheck, faLeaf, faMicrochip, faLanguage, faPenNib,
  faMoneyCheckDollar, faGraduationCap, faPassport, faCouch, faUserTie, faUserPlus, faStore,
  faMagnifyingGlassDollar, faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { sectorViewAllPath } from '@/lib/sector-paths'
import type { SectorDirectorySpec } from '../types'

/* ═══════════════════════════════════════════════════════════════════════
   Professional services directory - /professional-service-directory (was
   /professional-services). Copy is verbatim from the SEO specialist's
   brief (Oct 2026), with these exceptions:
   - meta title "#1Rated" reads "#1 Rated"
   - hero stats use live numbers (the brief's "2000+ Service Providers"
     and "2455 Sub-Categories" match them today)
   ═══════════════════════════════════════════════════════════════════════ */

const SECTOR = 'professional-services'
const VIEW_ALL = sectorViewAllPath(SECTOR)

export const PROFESSIONAL_SERVICES_DIRECTORY: SectorDirectorySpec = {
  sector: SECTOR,
  accent: '#C85580',
  breadcrumbName: 'Professional Services Directory',

  meta: {
    title: '#1 Rated Professional Service Directory: Find & List Services',
    description: 'Browse the InfoWebWorld professional services directory to find and compare service providers worldwide, read real reviews, or list your services for free.',
    keywords: [
      'professional service directory', 'professional services directory',
      'professional service providers', 'find service providers', 'list your firm',
      'accountants directory', 'lawyers directory', 'consultants directory',
      'professional services reviews', 'InfoWebWorld',
    ],
    ogImageAlt: 'InfoWebWorld Professional Services Directory',
    about: 'Professional service providers',
  },

  hero: {
    title: '#1 Rated Professional Services Directory to Find, Compare and List Service Providers',
    sub: 'Search lawyers, accountants, consultants, and more by service and country, then compare real client reviews.',
    searchPlaceholder: 'Search professionals, firms, specialties…',
    stats: [
      { kind: 'listings', label: 'Service Providers', icon: faBriefcase },
      { kind: 'static', text: '100% Verified Listings', icon: faUserCheck },
      { kind: 'subcategories', label: 'Sub-Categories', icon: faLayerGroup },
    ],
    primaryCta: { label: 'Find Service Providers', href: VIEW_ALL },
    secondaryCta: { label: 'List Your Firm', href: '/business' },
  },

  categories: {
    heading: 'Browse the Professional Services Directory by Category',
    sub: 'Every category lists providers with their services, location, and real reviews, so you can shortlist quickly.',
    listName: 'Professional service categories',
    l2: [
      { slug: 'accounting-tax-services',                     icon: faCalculator },
      { slug: 'architecture-engineering-design',             icon: faCompassDrafting },
      { slug: 'business-consulting-pro',                     icon: faBriefcase },
      { slug: 'coaching-professional-development',           icon: faChalkboardUser },
      { slug: 'corporate-event-planning-production',         icon: faCalendarCheck },
      { slug: 'corporate-training-learning',                 icon: faPersonChalkboard },
      { slug: 'financial-advisory-planning',                 icon: faChartLine },
      { slug: 'hr-staffing-recruiting',                      icon: faUsers },
      { slug: 'insurance-professional-services',             icon: faShieldHalved },
      { slug: 'investigative-forensic-services',             icon: faUserSecret },
      { slug: 'investment-banking-capital-markets',          icon: faBuildingColumns },
      { slug: 'legal-services-pro',                          icon: faScaleBalanced },
      { slug: 'marketing-advertising-communications',        icon: faBullhorn },
      { slug: 'real-estate-professional-services',           icon: faBuilding },
      { slug: 'risk-compliance-audit',                       icon: faClipboardCheck },
      { slug: 'sustainability-esg-environmental-consulting', icon: faLeaf },
      { slug: 'technology-advisory-services',                icon: faMicrochip },
      { slug: 'translation-language-services',               icon: faLanguage },
      { slug: 'writing-editing-research-services',           icon: faPenNib },
    ],
  },

  popular: {
    heading: 'Most Searched Professional Services',
    sub: 'Jump straight to the services people look for most.',
    cta: { label: 'Explore All Service Categories', href: VIEW_ALL },
    picks: [
      { slug: 'digital-marketing' },
      { slug: 'payroll' },
      { slug: 'college-education' },
      { slug: 'immigration' },
      { slug: 'content-writing-copywriting' },
      { slug: 'interior-design' },
      { slug: 'career-services' },
      { slug: 'staffing-agencies-pro' },
      { slug: 'small-business' },
      { slug: 'internal-audit-services' },
      { slug: 'audit-assurance' },
      { slug: 'cybersecurity-advisory' },
    ],
    icons: {
      'digital-marketing': faBullhorn,
      'payroll': faMoneyCheckDollar,
      'college-education': faGraduationCap,
      'immigration': faPassport,
      'content-writing-copywriting': faPenNib,
      'interior-design': faCouch,
      'career-services': faUserTie,
      'staffing-agencies-pro': faUserPlus,
      'small-business': faStore,
      'internal-audit-services': faMagnifyingGlassDollar,
      'audit-assurance': faClipboardCheck,
      'cybersecurity-advisory': faShieldHalved,
    },
  },

  featured: {
    heading: 'Featured Professional Service Providers',
    sub: 'Standout profiles from firms that chose featured placement on InfoWebWorld.',
    tabsLabel: 'Professional service categories',
    emptyNoun: 'service providers',
  },

  recent: {
    heading: 'Recently Added Professional Service Providers',
    sub: "Browse the newest profiles with services, reviews, and a direct link to each provider's website. Compare them and reach out to the ones that fit.",
    ctaLabel: 'Browse all service providers',
  },

  countries: {
    heading: 'List of Professional Service Providers by Country and City',
    sub: 'Need an expert in your region? Browse by location, or list your firm where local clients look.',
    pillTemplate: 'Verified service provider listings from {n} countries',
  },

  comparison: {
    heading: 'Why Choose InfoWebWorld as Your Professional Services Directory?',
    sub: 'Compare providers with confidence, or put your firm in front of clients ready to hire.',
    caption: 'InfoWebWorld compared with a typical free professional services directory',
    audiences: [
      {
        heading: 'For Businesses Looking for Professional Services',
        text: 'Find professional service providers by category and location, compare services and client reviews, and connect with firms that match your business needs.',
        icon: faMagnifyingGlass,
      },
      {
        heading: 'For Professional Service Providers Looking for Clients',
        text: 'List your firm for free, showcase your expertise and services, collect client reviews, and get found by businesses searching for professional services.',
        icon: faBriefcase,
      },
    ],
  },

  reviews: {
    heading: 'What Clients Say About Service Providers',
    sub: 'Read what real clients experienced, then add your own review to help others.',
    ctaLabel: 'Write a Review',
  },

  blog: {
    heading: 'Professional Services Insights and Guides',
    sub: 'Practical advice on choosing a provider, comparing services, and winning more clients.',
    ctaLabel: 'Read All Articles',
    topic: 'professional',
  },

  faqs: [
    {
      q: 'What is the InfoWebWorld Professional Services Directory?',
      a: 'InfoWebWorld is an online professional services directory that helps customers find and connect with businesses and professionals offering specialized services.',
    },
    {
      q: 'How Do I Find a Professional Service Provider on InfoWebWorld?',
      a: 'To find the exact service provider, pick a specific service category and sub-category, country, and city, then compare profiles and client reviews to build your shortlist.',
    },
    {
      q: 'Is There a List of Professional Service Providers by Country?',
      a: 'Yes. Browse the list of professional service providers by country and city, then open any profile for services and reviews.',
    },
    {
      q: 'What is a Professional Business Listing on InfoWebWorld?',
      a: "It's a business profile that shows your services, location, contact details, and a link to your website, with reviews from clients.",
    },
    {
      q: 'Can I List My Professional Services on InfoWebWorld for Free?',
      a: 'Yes. You can list your professional services on InfoWebWorld for free, with no credit card required. Paid plans ($49 - $239) offer additional benefits, including featured placement and a Verified badge.',
    },
  ],

  finalCta: {
    title: 'Your Next Client Is Already Searching for Professional Services',
    subtitle: 'List your service for free on InfoWebWorld, and let clients worldwide find, compare, and review it.',
    cta: { label: 'List Your Service', href: '/business' },
  },
}
