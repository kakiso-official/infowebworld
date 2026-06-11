/**
 * Sector landing-page configuration.
 *
 * One entry per L1 sector — palette name, scope CSS class, hero copy,
 * search placeholder, and 6 hand-picked L2 cards (slug + Font Awesome
 * icon) for the "Find verified ... across every category" grid.
 *
 * The 6 L2 picks are visible cards in the grid. The full sector
 * taxonomy still feeds every other section via real DB queries — these
 * are just the marquee tiles.
 *
 * Used by app/sector-landing/SectorLandingPage.tsx and the catch-all
 * /[...segments]/page.tsx isSector branch.
 */
import {
  faRobot, faImage, faCode, faGears, faBullhorn, faHeadset,
  faChartLine, faShieldHalved, faPeopleGroup, faChartBar,
  faUserGroup, faCalculator, faMobileScreen, faPaintBrush, faPalette, faGlobe,
  faUtensils, faHouseChimneyMedical, faHouseChimneyUser, faCar, faSpa, faBagShopping,
  faMoneyBillTrendUp, faHeartPulse, faGraduationCap, faLeaf, faBriefcase,
  faScaleBalanced, faHandshake, faChartPie, faFileInvoiceDollar,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export type CardDef = { slug: string; label: string; icon: IconDefinition }

/** Per-sector copy for every shared landing section. Headings, sub-copy,
 *  empty states, and "Browse all" CTA labels. Sector-specific so the AI/ML
 *  defaults baked into the test pages don't bleed onto Software, IT, etc. */
export type SectorSectionsCopy = {
  /** "Most Popular AI Categories" left-rail title (line break allowed). */
  popularCatsTitle: string
  /** TopFirms section sub-paragraph. */
  topFirmsSub: string
  /** TopFirms aria-label for the tablist (screen reader). */
  topFirmsTabsLabel: string
  /** "More top-rated {emptyNoun} are coming soon in <Cat>" empty-state noun. */
  topFirmsEmptyNoun: string
  /** "Just launched on InfoWebWorld" sub-paragraph. */
  newLaunchesSub: string
  /** "Browse all {noun}" CTA on NewLaunches. */
  newLaunchesCta: string
  /** "Most popular AI tools" PopularTools section title. */
  popularToolsTitle: string
  /** PopularTools section sub (when there are firms). */
  popularToolsSub: string
  /** PopularTools section sub (empty state). */
  popularToolsEmptySub: string
  /** "No AI tools to feature yet — check back soon." empty-state line. */
  popularToolsEmptyLine: string
  /** "Browse all AI tools" CTA on PopularTools. */
  popularToolsCta: string
}

export type SectorLandingConfig = {
  /** L1 slug — also the route segment (e.g. "ai-ml"). */
  slug: string
  /** Display name for crumbs / meta. */
  name: string
  /** Palette label (from the brand sheet). */
  paletteName: string
  /** Per-sector scope class on the <main>. Combined with `tcat1` base. */
  scopeClass: string
  /** Page <title>. */
  metaTitle: string
  /** Meta description (also reused in JSON-LD / sub copy where short). */
  metaDescription: string
  /** Hero H1. */
  heroTitle: string
  /** Hero supporting paragraph (under H1). */
  heroSub: string
  /** Search input placeholder. */
  heroPlaceholder: string
  /** CategoriesSection grid heading. */
  catsHeading: string
  /** CategoriesSection grid sub-heading. */
  catsSub: string
  /** "Explore all categories" CTA button label (sector-specific). */
  catsCtaLabel: string
  /** 6 hand-picked L2 cards (slug must exist under this sector). */
  cards: CardDef[]
  /** Per-section copy for the shared landing sections (Popular, TopFirms,
   *  NewLaunches, PopularTools). Keeps AI/ML copy from bleeding into other
   *  sector landings. */
  sections: SectorSectionsCopy
}

export const SECTOR_LANDINGS: Record<string, SectorLandingConfig> = {
  'ai-ml': {
    slug: 'ai-ml',
    name: 'AI & ML',
    paletteName: 'Lavender Neural',
    scopeClass: 'tcat-ai-ml',
    metaTitle: 'AI Tools Directory - Find, Compare & Submit AI Tools, Agents & Models | InfoWebWorld',
    metaDescription: 'AI tools directory to find, compare and review verified AI tools, agents, and models across 1,000+ categories - chatbots, copilots, image & video generators, and more. Submit your AI tool free.',
    heroTitle: 'AI tools directory: find, compare & review verified AI tools, agents, and models.',
    heroSub: 'Browse the AI tools directory - 1,000+ categories of verified AI tools, agents, copilots, and image & video generators, with real reviews. Or submit your AI tool free.',
    heroPlaceholder: 'Search AI tools, agents, models, categories…',
    catsHeading: 'Browse the AI tools directory by category',
    catsSub: 'Find verified AI assistants, image and video generators, copilots, agents, and frameworks across every category - moderated, reviewed, and never paid for.',
    catsCtaLabel: 'Explore all AI categories',
    cards: [
      { slug: 'ai-core-models',        label: 'AI Core & Models',        icon: faRobot    },
      { slug: 'content-creative',      label: 'Content & Creative',      icon: faImage    },
      { slug: 'development-technical', label: 'Development & Technical', icon: faCode     },
      { slug: 'business-marketing',    label: 'Business & Marketing',    icon: faBullhorn },
      { slug: 'productivity-workflow', label: 'Productivity & Workflow', icon: faGears    },
      { slug: 'customer-support',      label: 'Customer & Support',      icon: faHeadset  },
    ],
    sections: {
      popularCatsTitle: 'Most Popular\nAI Categories',
      topFirmsSub: 'InfoWebWorld helps you connect with top-ranked AI companies backed by trusted research and verified reviews.',
      topFirmsTabsLabel: 'AI categories',
      topFirmsEmptyNoun: 'AI tools',
      newLaunchesSub: 'The newest AI tools, agents, and models added to the directory — moderated and verified before they appear.',
      newLaunchesCta: 'Browse all AI tools',
      popularToolsTitle: 'Most popular AI tools',
      popularToolsSub: 'Hand-picked AI tools backed by real buyer reviews. Find the perfect fit for your business without the guesswork.',
      popularToolsEmptySub: 'Hand-picked AI tools vetted by real buyers. Find the perfect fit without the guesswork.',
      popularToolsEmptyLine: 'No AI tools to feature yet — check back soon.',
      popularToolsCta: 'Browse all AI tools',
    },
  },

  'software-saas': {
    slug: 'software-saas',
    name: 'Software & SaaS',
    paletteName: 'Sky Interface',
    scopeClass: 'tcat-software-saas',
    metaTitle: 'Software & SaaS — Find and compare the best software for your business',
    metaDescription: 'Verified buyer reviews across 900+ software & SaaS categories — CRM, marketing, analytics, cybersecurity, and more. Honest, moderated, and never paid for.',
    heroTitle: 'Find and compare the best software for your business.',
    heroSub: 'Verified buyer reviews across 900+ software & SaaS categories — CRM, marketing, support, analytics, cybersecurity, project management, and more.',
    heroPlaceholder: 'Search software, SaaS tools, categories…',
    catsHeading: 'Find verified software across every category',
    catsSub: 'Compare CRM platforms, marketing suites, support tools, analytics, and security software — all verified and never paid for.',
    catsCtaLabel: 'Explore all software categories',
    cards: [
      { slug: 'crm-sales-software',                 label: 'CRM & Sales',          icon: faChartLine     },
      { slug: 'marketing-software',                 label: 'Marketing',            icon: faBullhorn      },
      { slug: 'customer-service-support-software',  label: 'Customer Support',     icon: faHeadset       },
      { slug: 'data-analytics-software',            label: 'Data & Analytics',     icon: faChartBar      },
      { slug: 'cybersecurity-software',             label: 'Cybersecurity',        icon: faShieldHalved  },
      { slug: 'project-management-software',        label: 'Project Management',   icon: faGears         },
    ],
    sections: {
      popularCatsTitle: 'Most Popular\nSoftware Categories',
      topFirmsSub: 'InfoWebWorld helps you connect with top-rated software vendors backed by trusted research and verified buyer reviews.',
      topFirmsTabsLabel: 'Software categories',
      topFirmsEmptyNoun: 'software products',
      newLaunchesSub: 'The newest software platforms and SaaS tools added to the directory — moderated and verified before they appear.',
      newLaunchesCta: 'Browse all software',
      popularToolsTitle: 'Most popular software',
      popularToolsSub: 'Hand-picked software platforms backed by real buyer reviews. Find the perfect fit for your business without the guesswork.',
      popularToolsEmptySub: 'Hand-picked software vetted by real buyers. Find the perfect fit without the guesswork.',
      popularToolsEmptyLine: 'No software products to feature yet — check back soon.',
      popularToolsCta: 'Browse all software',
    },
  },

  'it-services-agencies': {
    slug: 'it-services-agencies',
    name: 'IT Services & Agencies',
    paletteName: 'Mint Circuit',
    scopeClass: 'tcat-it-services-agencies',
    metaTitle: 'IT Services & Agencies — Find verified development, design, and digital agencies',
    metaDescription: 'Verified reviews across 400+ IT service categories. Discover web, mobile, software development, design, and digital marketing agencies.',
    heroTitle: 'Find verified IT agencies, services, and tech partners.',
    heroSub: 'Compare web, mobile, and software development companies, design studios, digital marketing agencies, and BPO providers — all verified and reviewed by real clients.',
    heroPlaceholder: 'Search IT services, agencies, categories…',
    catsHeading: 'Find verified agencies across every service category',
    catsSub: 'Web, mobile, software, design, marketing — find specialized agencies vetted by InfoWebWorld and reviewed by real clients.',
    catsCtaLabel: 'Explore all service categories',
    cards: [
      { slug: 'web-development-services',         label: 'Web Development',       icon: faGlobe         },
      { slug: 'mobile-app-development-services',  label: 'Mobile App Dev',        icon: faMobileScreen  },
      { slug: 'software-development-services',    label: 'Software Development',  icon: faCode          },
      { slug: 'design-ux-services',               label: 'Design & UX',           icon: faPalette       },
      { slug: 'digital-marketing-seo-services',   label: 'Digital Marketing & SEO', icon: faBullhorn    },
      { slug: 'ai-emerging-tech-services',        label: 'AI & Emerging Tech',    icon: faRobot         },
    ],
    sections: {
      popularCatsTitle: 'Most Popular\nService Categories',
      topFirmsSub: 'InfoWebWorld helps you connect with top-rated IT agencies and service providers backed by trusted research and verified client reviews.',
      topFirmsTabsLabel: 'Service categories',
      topFirmsEmptyNoun: 'agencies',
      newLaunchesSub: 'The newest IT agencies and service providers added to the directory — moderated and verified before they appear.',
      newLaunchesCta: 'Browse all agencies',
      popularToolsTitle: 'Most popular agencies',
      popularToolsSub: 'Hand-picked IT agencies backed by real client reviews. Find the perfect partner for your project without the guesswork.',
      popularToolsEmptySub: 'Hand-picked agencies vetted by real clients. Find the perfect partner without the guesswork.',
      popularToolsEmptyLine: 'No agencies to feature yet — check back soon.',
      popularToolsCta: 'Browse all agencies',
    },
  },

  'startups-innovation': {
    slug: 'startups-innovation',
    name: 'Startups & Innovation',
    paletteName: 'Peach Ignite',
    scopeClass: 'tcat-startups-innovation',
    metaTitle: 'Startup Directory - Discover & Submit Verified Startups | InfoWebWorld',
    metaDescription: 'Startup directory to discover, compare and submit verified startups across FinTech, HealthTech, EdTech, ClimateTech, AI, and Web3 - curated, reviewed, never pay-to-play. Submit your startup free.',
    heroTitle: 'Startup directory: discover & submit verified startups across every sector.',
    heroSub: 'Browse the startup directory - real, verified startups in FinTech, HealthTech, EdTech, ClimateTech, AI, Web3, and beyond, with reviews. Or submit your startup free.',
    heroPlaceholder: 'Search startups, sectors, categories…',
    catsHeading: 'Browse the startup directory by sector',
    catsSub: 'From FinTech and HealthTech to AI, ClimateTech, and Web3 - discover the next breakthrough startup across every vertical, curated and reviewed.',
    catsCtaLabel: 'Explore all startup categories',
    cards: [
      { slug: 'fintech-financial-services-startups',         label: 'FinTech',           icon: faMoneyBillTrendUp },
      { slug: 'healthtech-medtech-startups',                 label: 'HealthTech',        icon: faHeartPulse       },
      { slug: 'edtech-learning-startups',                    label: 'EdTech',            icon: faGraduationCap    },
      { slug: 'climate-energy-sustainability-startups',      label: 'ClimateTech',       icon: faLeaf             },
      { slug: 'ai-ml-generative-ai-startups',                label: 'AI & ML Startups',  icon: faRobot            },
      { slug: 'web3-crypto-blockchain-startups',             label: 'Web3 & Crypto',     icon: faShieldHalved     },
    ],
    sections: {
      popularCatsTitle: 'Most Popular\nStartup Categories',
      topFirmsSub: 'InfoWebWorld helps you discover breakthrough startups backed by trusted research and verified reviews.',
      topFirmsTabsLabel: 'Startup categories',
      topFirmsEmptyNoun: 'startups',
      newLaunchesSub: 'The newest startups added to the directory — moderated and verified before they appear.',
      newLaunchesCta: 'Browse all startups',
      popularToolsTitle: 'Most popular startups',
      popularToolsSub: 'Hand-picked startups backed by real reviews. Discover the next breakthrough company without the guesswork.',
      popularToolsEmptySub: 'Hand-picked startups vetted by real buyers. Discover breakthroughs without the guesswork.',
      popularToolsEmptyLine: 'No startups to feature yet — check back soon.',
      popularToolsCta: 'Browse all startups',
    },
  },

  'local-businesses': {
    slug: 'local-businesses',
    name: 'Local Businesses',
    paletteName: 'Sage Community',
    scopeClass: 'tcat-local-businesses',
    metaTitle: 'Local Businesses — Find trusted neighborhood businesses near you',
    metaDescription: 'Find trusted local businesses across 800+ categories — restaurants, home services, health, automotive, beauty, retail, and more.',
    heroTitle: 'Find trusted local businesses in your area.',
    heroSub: 'Discover restaurants, contractors, doctors, salons, mechanics, shops, and more — real reviews from neighbors, vetted and never paid for.',
    heroPlaceholder: 'Search restaurants, contractors, services, categories…',
    catsHeading: 'Find verified local businesses across every category',
    catsSub: 'From restaurants and home services to health, automotive, and retail — trusted local businesses, reviewed by neighbors.',
    catsCtaLabel: 'Explore all local categories',
    cards: [
      { slug: 'restaurants-food-drink',     label: 'Restaurants & Food',  icon: faUtensils             },
      { slug: 'home-services-contractors',  label: 'Home Services',       icon: faHouseChimneyUser     },
      { slug: 'health-medical',             label: 'Health & Medical',    icon: faHouseChimneyMedical  },
      { slug: 'automotive',                 label: 'Automotive',          icon: faCar                  },
      { slug: 'beauty-personal-care',       label: 'Beauty & Personal',   icon: faSpa                  },
      { slug: 'shopping-retail',            label: 'Shopping & Retail',   icon: faBagShopping          },
    ],
    sections: {
      popularCatsTitle: 'Most Popular\nLocal Categories',
      topFirmsSub: 'InfoWebWorld helps you find top-rated local businesses backed by neighborhood reviews and verified credentials.',
      topFirmsTabsLabel: 'Local categories',
      topFirmsEmptyNoun: 'local businesses',
      newLaunchesSub: 'The newest local businesses added to the directory — moderated and verified before they appear.',
      newLaunchesCta: 'Browse all local businesses',
      popularToolsTitle: 'Most popular local businesses',
      popularToolsSub: 'Hand-picked local businesses backed by real neighbor reviews. Find the right one without the guesswork.',
      popularToolsEmptySub: 'Hand-picked local businesses vetted by real neighbors. Find the right one without the guesswork.',
      popularToolsEmptyLine: 'No local businesses to feature yet — check back soon.',
      popularToolsCta: 'Browse all local businesses',
    },
  },

  'professional-services': {
    slug: 'professional-services',
    name: 'Professional Services',
    paletteName: 'Blush Authority',
    scopeClass: 'tcat-professional-services',
    metaTitle: 'Professional Services Directory | InfoWebWorld',
    metaDescription: 'Professional services directory of verified accounting, legal, consulting, HR & financial firms - real client reviews, no pay-to-play, free to browse.',
    heroTitle: 'Professional Services Directory',
    heroSub: 'Find and compare verified accountants, lawyers, consultants, financial advisors, recruiters, and marketing firms across 19 fields and 2,400+ specialties - real client reviews, no pay-to-play.',
    heroPlaceholder: 'Search professionals, firms, specialties…',
    catsHeading: 'Browse the professional services directory by category',
    catsSub: 'Accountants, lawyers, advisors, consultants, recruiters - verified credentials and real client reviews across every specialty.',
    catsCtaLabel: 'Explore all professional categories',
    cards: [
      { slug: 'accounting-tax-services',            label: 'Accounting & Tax',      icon: faCalculator           },
      { slug: 'legal-services-pro',                 label: 'Legal Services',        icon: faScaleBalanced        },
      { slug: 'business-consulting-pro',            label: 'Business Consulting',   icon: faBriefcase            },
      { slug: 'financial-advisory-planning',        label: 'Financial Advisory',    icon: faFileInvoiceDollar    },
      { slug: 'hr-staffing-recruiting',             label: 'HR & Recruiting',       icon: faUserGroup            },
      { slug: 'marketing-advertising-communications', label: 'Marketing & Advertising', icon: faBullhorn          },
    ],
    sections: {
      popularCatsTitle: 'Most Popular\nProfessional Categories',
      topFirmsSub: 'InfoWebWorld helps you find experienced professionals backed by verified credentials and real client reviews.',
      topFirmsTabsLabel: 'Professional categories',
      topFirmsEmptyNoun: 'professionals',
      newLaunchesSub: 'The newest professionals and firms added to the directory — moderated and verified before they appear.',
      newLaunchesCta: 'Browse all professionals',
      popularToolsTitle: 'Most popular professionals',
      popularToolsSub: 'Hand-picked professionals backed by real client reviews. Find the right expert for your needs without the guesswork.',
      popularToolsEmptySub: 'Hand-picked professionals vetted by real clients. Find the right expert without the guesswork.',
      popularToolsEmptyLine: 'No professionals to feature yet — check back soon.',
      popularToolsCta: 'Browse all professionals',
    },
  },
}

export function getSectorLanding(slug: string): SectorLandingConfig | null {
  return SECTOR_LANDINGS[slug] ?? null
}
