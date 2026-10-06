import {
  faLayerGroup, faUserCheck, faRocket,
  faMoneyBillTransfer, faHeartPulse, faGraduationCap, faSolarPanel, faSeedling, faBuilding,
  faHelmetSafety, faCarSide, faSatellite, faRobot, faBrain, faBitcoinSign, faCode,
  faShieldHalved, faListCheck, faChartLine, faCartShopping, faClapperboard, faGamepad, faTv,
  faPlaneDeparture, faDumbbell, faBabyCarriage, faUserPlus, faGavel, faSitemap,
  faMoneyBillTrendUp, faUserTie,
  faBuildingColumns, faShieldHeart, faArrowRightArrowLeft, faHouseLaptop, faLock, faPassport,
  faBaby, faHandHoldingDollar, faHeart, faStopwatch, faStethoscope, faLink,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { sectorViewAllPath } from '@/lib/sector-paths'
import type { SectorDirectorySpec } from '../types'

/* ═══════════════════════════════════════════════════════════════════════
   Startup directory - /startup-directory (was /startups-innovation). Copy
   is verbatim from the SEO specialist's brief (Oct 2026), with these
   exceptions:
   - hero stats use live numbers (the brief's "2400+" categories and
     "1,000+" listings hold today)
   - "Browse Startup Listings" and "Browse All Startup Categories" go to
     the category index; the brief linked both to the FinTech category
   - the category grid shows the brief's 28 categories (the sector has 43;
     the rest are one click away on the category index)
   ═══════════════════════════════════════════════════════════════════════ */

const SECTOR = 'startups-innovation'
const VIEW_ALL = sectorViewAllPath(SECTOR)

export const STARTUP_DIRECTORY: SectorDirectorySpec = {
  sector: SECTOR,
  accent: '#D96236',
  breadcrumbName: 'Startup Directory',

  meta: {
    title: '#1 Rated Startup Directory: Find & List Startups',
    description: 'Browse the startup directory to find startup companies, businesses, and innovative ventures by category and country. List your startup and get discovered globally.',
    keywords: [
      'startup directory', 'startup companies', 'list of startups', 'startup database',
      'global startup directory', 'startups by country', 'list your startup',
      'submit your startup', 'startup reviews', 'InfoWebWorld',
    ],
    ogImageAlt: 'InfoWebWorld Startup Directory',
    about: 'Startups and emerging companies',
  },

  hero: {
    title: '#1 Rated Startup Directory to Find, Compare, and List Startups',
    sub: 'Find startups and emerging companies by industry, category, country, and business focus. Explore startup profiles, products, services, and company information to discover businesses and innovative ventures worldwide.',
    searchPlaceholder: 'Search startups, sectors, categories…',
    stats: [
      { kind: 'subcategories', label: 'Startup Categories', icon: faLayerGroup, roundTo: 100 },
      { kind: 'static', text: '100% Manually Verified', icon: faUserCheck },
      { kind: 'listings', label: 'Startup Listings', icon: faRocket },
    ],
    primaryCta: { label: 'Browse Startup Listings', href: VIEW_ALL },
    secondaryCta: { label: 'List Your Startup', href: '/business' },
  },

  categories: {
    heading: 'Browse the Startup Directory by Category',
    sub: 'Find startups by industry, business model, technology, and market focus. Browse categories to identify emerging companies, innovative businesses, and startups operating in different sectors.',
    listName: 'Startup categories',
    l2: [
      { slug: 'fintech-financial-services-startups',           icon: faMoneyBillTransfer },
      { slug: 'healthtech-medtech-startups',                   icon: faHeartPulse },
      { slug: 'edtech-learning-startups',                      icon: faGraduationCap },
      { slug: 'climate-energy-sustainability-startups',        icon: faSolarPanel },
      { slug: 'agritech-foodtech-beverage-startups',           icon: faSeedling },
      { slug: 'proptech-real-estate-startups',                 icon: faBuilding },
      { slug: 'contech-construction-startups',                 icon: faHelmetSafety },
      { slug: 'mobility-transportation-auto-tech-startups',    icon: faCarSide },
      { slug: 'spacetech-aerospace-startups',                  icon: faSatellite },
      { slug: 'robotics-hardware-deeptech-startups',           icon: faRobot },
      { slug: 'ai-ml-generative-ai-startups',                  icon: faBrain },
      { slug: 'web3-crypto-blockchain-startups',               icon: faBitcoinSign },
      { slug: 'developer-tools-devops-startups',               icon: faCode },
      { slug: 'cybersecurity-startups',                        icon: faShieldHalved },
      { slug: 'productivity-workflow-future-of-work-startups', icon: faListCheck },
      { slug: 'sales-marketing-growth-startups',               icon: faChartLine },
      { slug: 'e-commerce-retail-startups',                    icon: faCartShopping },
      { slug: 'creator-economy-content-startups',              icon: faClapperboard },
      { slug: 'gaming-esports-startups',                       icon: faGamepad },
      { slug: 'media-entertainment-streaming-startups',        icon: faTv },
      { slug: 'travel-hospitality-lifestyle-startups',         icon: faPlaneDeparture },
      { slug: 'wellness-fitness-personal-startups',            icon: faDumbbell },
      { slug: 'family-kids-pet-startups',                      icon: faBabyCarriage },
      { slug: 'hr-talent-future-of-work-startups',             icon: faUserPlus },
      { slug: 'legaltech-compliance-startups',                 icon: faGavel },
      { slug: 'startups-by-business-model',                    icon: faSitemap },
      { slug: 'startups-by-funding-stage',                     icon: faMoneyBillTrendUp },
      { slug: 'startups-by-founder-type',                      icon: faUserTie },
    ],
  },

  popular: {
    heading: 'Popular Startup Categories and Business Sectors',
    sub: 'Jump to the startup industries and business sectors people explore most. Find companies based on their industry, technology, market, and business focus.',
    cta: { label: 'Browse All Startup Categories', href: VIEW_ALL },
    picks: [
      { slug: 'digital-banking-startups' },
      { slug: 'health-insurance-tech' },
      { slug: 'secondary-market-startups' },
      { slug: 'remote-first-companies' },
      { slug: 'data-security-startups' },
      { slug: 'visa-innovation-companies' },
      { slug: 'ivf-tech-startups' },
      { slug: 'strategic-investors' },
      { slug: 'heart-health-startups' },
      { slug: 'time-tracking-startups' },
      { slug: 'medical-device-startups' },
      { slug: 'affiliate-program-startups' },
    ],
    icons: {
      'digital-banking-startups': faBuildingColumns,
      'health-insurance-tech': faShieldHeart,
      'secondary-market-startups': faArrowRightArrowLeft,
      'remote-first-companies': faHouseLaptop,
      'data-security-startups': faLock,
      'visa-innovation-companies': faPassport,
      'ivf-tech-startups': faBaby,
      'strategic-investors': faHandHoldingDollar,
      'heart-health-startups': faHeart,
      'time-tracking-startups': faStopwatch,
      'medical-device-startups': faStethoscope,
      'affiliate-program-startups': faLink,
    },
  },

  featured: {
    heading: 'Featured Startup Companies and Emerging Businesses',
    sub: 'See featured startups and emerging companies listed on InfoWebWorld. Explore their company profiles, products, services, industries, and business information in one place.',
    tabsLabel: 'Startup categories',
    emptyNoun: 'startups',
    namesAsHeadings: true,
  },

  recent: {
    heading: 'Recently Added and Verified Startup Listings',
    sub: 'See the latest startups added to the directory. Newly submitted companies are reviewed before publication to help visitors find relevant and reliable startup businesses.',
    ctaLabel: 'Browse all startups',
  },

  countries: {
    heading: 'Startup Companies and Businesses by Country',
    sub: 'Find startups by country and region to identify emerging companies operating in local and global markets. Browse startup businesses based on their location and target market.',
    pillTemplate: 'Verified startup listings from {n} countries',
  },

  comparison: {
    heading: 'Why Choose InfoWebWorld for Startup Discovery?',
    sub: "Whether you're researching emerging companies or building visibility for your startup, InfoWebWorld connects startup businesses with people and organizations looking for innovative companies.",
    caption: 'InfoWebWorld compared with a typical free startup directory',
    audiences: [
      {
        heading: 'For People Looking for Startups and New Businesses',
        text: 'Find startups by industry and country, review company information, explore products and services, and identify emerging businesses that match your interests or business needs.',
        icon: faMagnifyingGlass,
      },
      {
        heading: 'For Startups Looking for Customers and Opportunities',
        text: 'List your startup, showcase your products and services, build your company profile, collect reviews, and get discovered by businesses and people searching for innovative companies.',
        icon: faRocket,
      },
    ],
  },

  reviews: {
    heading: 'Trusted by Founders, Customers, and Business Users',
    sub: 'Read reviews and feedback about startups listed on InfoWebWorld. Share your experience to help other users evaluate companies, products, and services.',
    ctaLabel: 'Write a Review',
  },

  blog: {
    heading: 'Latest Startup News, Guides, and Insights',
    sub: "Stay updated with startup trends, emerging industries, founder resources, business insights, and guides to help you understand today's startup ecosystem.",
    ctaLabel: 'Read All Articles',
    topic: 'startups',
  },

  faqs: [
    {
      q: 'What is an InfoWebWorld Startup Directory?',
      a: 'InfoWebWorld startup directory is an online database of startup companies and emerging businesses organized by industry, category, location, and business focus.',
    },
    {
      q: 'Is InfoWebWorld a Global Startup Directory?',
      a: 'Yes. InfoWebWorld provides startup and business listings across countries and regions, allowing users to find startups operating in different markets around the world.',
    },
    {
      q: 'What Can I Find in the InfoWebWorld Startup Directory?',
      a: 'You can find startup companies, emerging businesses, technology startups, SaaS companies, AI startups, FinTech companies, HealthTech startups, and businesses across many other industries and categories.',
      links: [{ text: 'many other industries and categories', href: VIEW_ALL }],
    },
    {
      q: 'Where Can I Find a List of Startup Companies?',
      a: 'The InfoWebWorld startup company directory provides a searchable list of startups organized by category and country, helping users find emerging companies across different industries and markets.',
    },
    {
      q: 'Can I Review a Startup Listed on InfoWebWorld?',
      a: 'Yes. Users who have experience with a listed business can share a review, helping other users learn more about the company and its products or services.',
      links: [{ text: 'share a review', href: '/write-review' }],
    },
  ],

  finalCta: {
    title: 'Put Your Startup in Front of Global Audiences',
    subtitle: 'List your startup on InfoWebWorld and create a company profile that helps potential customers, partners, and business users find your company, products, and services.',
    cta: { label: 'List Your Startup', href: '/business' },
  },
}
