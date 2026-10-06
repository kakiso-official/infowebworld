import {
  faStore, faLayerGroup, faEarthAmericas,
  faUtensils, faScrewdriverWrench, faHeartPulse, faCar, faSpa, faBagShopping, faDumbbell,
  faPaw, faSchool, faCalendarCheck, faMasksTheater, faPlaneDeparture, faHouse,
  faPlaceOfWorship, faCoins, faPrint, faDove,
  faBolt, faTruckFast, faScissors, faFaucetDrip, faHouseChimney, faKey, faCouch,
  faSuitcaseRolling, faDog, faUserDoctor, faWrench, faCamera, faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { sectorViewAllPath } from '@/lib/sector-paths'
import type { SectorDirectorySpec } from '../types'

/* ═══════════════════════════════════════════════════════════════════════
   Local business directory - /local-businesses-directory (was
   /local-businesses). Copy is verbatim from the SEO specialist's brief
   (Oct 2026), with these exceptions:
   - hero stats use the sector's live numbers, not the brief's directory-
     wide "7,000+ listings" / "63+ countries"
   - "Find Local Businesses" goes to the category index; the brief linked
     the landing's own old URL (now a redirect to this page)
   - FAQ 5's answer stops after its last complete sentence (the brief's
     third sentence breaks off at "Results also")
   ═══════════════════════════════════════════════════════════════════════ */

const SECTOR = 'local-businesses'
const VIEW_ALL = sectorViewAllPath(SECTOR)

export const LOCAL_BUSINESS_DIRECTORY: SectorDirectorySpec = {
  sector: SECTOR,
  accent: '#659A22',
  breadcrumbName: 'Local Business Directory',

  meta: {
    title: '#1 Rated Local Business Directory: Find or List Local Business',
    description: 'Browse local business directory to list, find, compare, and add reviews for businesses worldwide. List your business now to improve local business visibility.',
    keywords: [
      'local business directory', 'local businesses', 'find local businesses',
      'list your business', 'local business listing', 'free local business listing',
      'add business to directory', 'local business reviews', 'business directory',
      'InfoWebWorld',
    ],
    ogImageAlt: 'InfoWebWorld Local Business Directory',
    about: 'Local businesses',
  },

  hero: {
    title: '#1 Rated Local Business Directory to List, Compare, and Find Local Businesses',
    sub: 'Search local businesses by country, category, and sub-category, then compare real buyer reviews to pick the right one.',
    searchPlaceholder: 'Search restaurants, contractors, services, categories…',
    stats: [
      { kind: 'listings', label: 'Live Business Listings', icon: faStore },
      { kind: 'subcategories', label: 'Sub-Categories', icon: faLayerGroup, roundTo: 100 },
      { kind: 'countries', label: 'Countries Served', icon: faEarthAmericas },
    ],
    primaryCta: { label: 'Find Local Businesses', href: VIEW_ALL },
    secondaryCta: { label: 'List Your Business', href: '/business' },
  },

  categories: {
    heading: 'Browse the Local Business Directory by Category',
    sub: 'Every category lists businesses with their services, contact details, and real reviews, so you can shortlist quickly.',
    listName: 'Local business categories',
    l2: [
      { slug: 'restaurants-food-drink',        icon: faUtensils },
      { slug: 'home-services-contractors',     icon: faScrewdriverWrench },
      { slug: 'health-medical',                icon: faHeartPulse },
      { slug: 'automotive',                    icon: faCar },
      { slug: 'beauty-personal-care',          icon: faSpa },
      { slug: 'shopping-retail',               icon: faBagShopping },
      { slug: 'active-life-fitness',           icon: faDumbbell },
      { slug: 'pets-animals',                  icon: faPaw },
      { slug: 'education-childcare',           icon: faSchool },
      { slug: 'event-services-planning',       icon: faCalendarCheck },
      { slug: 'entertainment-arts',            icon: faMasksTheater },
      { slug: 'travel-hotels-transportation',  icon: faPlaneDeparture },
      { slug: 'real-estate',                   icon: faHouse },
      { slug: 'religious-community-public',    icon: faPlaceOfWorship },
      { slug: 'financial-insurance',           icon: faCoins },
      { slug: 'media-printing-signage',        icon: faPrint },
      { slug: 'funeral-end-of-life-services',  icon: faDove },
    ],
  },

  popular: {
    heading: 'Search from {n} Local Business Sub-categories Across the Globe',
    sub: 'List your business in the right category, so your profile appears whenever people search for that category.',
    cta: { label: 'Explore All Local Categories', href: VIEW_ALL },
    picks: [
      { slug: 'electrical' },
      { slug: 'food-delivery-catering' },
      { slug: 'hair-salons' },
      { slug: 'plumbing' },
      { slug: 'roofing-exterior' },
      { slug: 'real-estate-services-local' },
      { slug: 'home-furniture' },
      { slug: 'travel-services' },
      { slug: 'pet-services' },
      { slug: 'doctors-clinics' },
      { slug: 'auto-services' },
      { slug: 'photography-video' },
    ],
    icons: {
      'electrical': faBolt,
      'food-delivery-catering': faTruckFast,
      'hair-salons': faScissors,
      'plumbing': faFaucetDrip,
      'roofing-exterior': faHouseChimney,
      'real-estate-services-local': faKey,
      'home-furniture': faCouch,
      'travel-services': faSuitcaseRolling,
      'pet-services': faDog,
      'doctors-clinics': faUserDoctor,
      'auto-services': faWrench,
      'photography-video': faCamera,
    },
  },

  featured: {
    heading: 'Top Featured Local Business Listings, Easily Noticed',
    sub: 'Featured placement puts these local businesses at the top of their categories.',
    tabsLabel: 'Local business categories',
    emptyNoun: 'local businesses',
  },

  recent: {
    heading: 'Recently Added Local Business Listings',
    sub: "Browse the newest profiles with services, reviews, and a direct link to each business's website. Compare them and reach out to the ones that fit your needs.",
    ctaLabel: 'Browse all local businesses',
  },

  countries: {
    heading: 'Find and List Businesses by Country and City for Better Local Visibility',
    sub: 'Searching nearby or serving a specific area? Browse by location, or put your business where local buyers look.',
    pillTemplate: 'Verified local business listings from {n} countries',
  },

  comparison: {
    heading: 'Why Choose InfoWebWorld for Your Local Business Listing?',
    sub: 'Create a free InfoWebWorld profile and put your services in front of buyers who search by location.',
    caption: 'InfoWebWorld compared with a typical free local business directory',
    audiences: [
      {
        heading: 'For People Searching for Local Businesses',
        text: 'Find local businesses by category and location, compare services and reviews, and connect directly with businesses that match your needs.',
        icon: faMagnifyingGlass,
      },
      {
        heading: 'For Local Businesses Looking for Customers',
        text: 'List your business for free, showcase your services and location, collect customer reviews, and reach people actively searching for local businesses.',
        icon: faStore,
      },
    ],
  },

  reviews: {
    heading: 'Trusted Feedback from Local Customers, For Local Businesses',
    sub: 'Read what people experienced, then add your own review to help others.',
    ctaLabel: 'Write a Review',
  },

  blog: {
    heading: 'Local Business Insights and Guides',
    sub: 'Practical tips on getting found, earning reviews, and growing your local presence.',
    ctaLabel: 'Read All Articles',
    topic: 'local',
  },

  faqs: [
    {
      q: 'What is the InfoWebWorld Local Business Directory?',
      a: 'InfoWebWorld is a local business directory that lets you find, list, compare, and add reviews of local businesses worldwide.',
      links: [{ text: 'add reviews', href: '/write-review' }],
    },
    {
      q: 'How Do I Find Local Businesses on InfoWebWorld?',
      a: 'Pick your country, city, and category, then compare profiles and buyer reviews to shortlist the best fit.',
      links: [{ text: 'compare profiles', href: '/compare-companies' }],
    },
    {
      q: 'Can I Edit My Business Listing Later?',
      a: 'Yes. You can update your business listing details from your dashboard at any time.',
    },
    {
      q: 'Can I List My Local Business on InfoWebWorld for Free?',
      a: 'Yes. You can list your local business on the InfoWebWorld local business directory for free, and you can also get a featured listing from $49 to $239.',
    },
    {
      q: 'Does a Local Business Listing Help My Local SEO?',
      a: 'Yes, but it mainly depends on your overall local SEO. A listing gives your business a consistent online profile and a link to your website.',
    },
  ],

  finalCta: {
    title: 'Your Next Customer Is Already Searching Locally.',
    subtitle: 'Join a trusted network of local business owners. Get discovered by thousands of worldwide customers today.',
    cta: { label: 'List Your Local Business', href: '/business' },
  },
}
