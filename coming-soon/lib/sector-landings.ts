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
  /** 6 hand-picked L2 cards (slug must exist under this sector). */
  cards: CardDef[]
}

export const SECTOR_LANDINGS: Record<string, SectorLandingConfig> = {
  'ai-ml': {
    slug: 'ai-ml',
    name: 'AI & ML',
    paletteName: 'Lavender Neural',
    scopeClass: 'tcat-ai-ml',
    metaTitle: 'AI & ML — Find and compare the best AI tools, agents, and models',
    metaDescription: 'Verified buyer reviews across 1,000+ AI & ML categories. Discover AI assistants, agents, image and video tools, code copilots, and more — moderated and never paid for.',
    heroTitle: 'Find and compare the best AI tools, agents, and models.',
    heroSub: 'Verified buyer reviews across 1,000+ AI & ML categories — chatbots, copilots, image & video generators, agents, and more. Honest, moderated, and never paid for.',
    heroPlaceholder: 'Search AI tools, agents, models, categories…',
    catsHeading: 'Find verified AI tools across every category',
    catsSub: 'Discover trusted AI assistants, image and video generators, copilots, agents, and frameworks — all verified, moderated, and never paid for.',
    cards: [
      { slug: 'ai-core-models',        label: 'AI Core & Models',        icon: faRobot    },
      { slug: 'content-creative',      label: 'Content & Creative',      icon: faImage    },
      { slug: 'development-technical', label: 'Development & Technical', icon: faCode     },
      { slug: 'business-marketing',    label: 'Business & Marketing',    icon: faBullhorn },
      { slug: 'productivity-workflow', label: 'Productivity & Workflow', icon: faGears    },
      { slug: 'customer-support',      label: 'Customer & Support',      icon: faHeadset  },
    ],
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
    cards: [
      { slug: 'crm-sales-software',                 label: 'CRM & Sales',          icon: faChartLine     },
      { slug: 'marketing-software',                 label: 'Marketing',            icon: faBullhorn      },
      { slug: 'customer-service-support-software',  label: 'Customer Support',     icon: faHeadset       },
      { slug: 'data-analytics-software',            label: 'Data & Analytics',     icon: faChartBar      },
      { slug: 'cybersecurity-software',             label: 'Cybersecurity',        icon: faShieldHalved  },
      { slug: 'project-management-software',        label: 'Project Management',   icon: faGears         },
    ],
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
    cards: [
      { slug: 'web-development-services',         label: 'Web Development',       icon: faGlobe         },
      { slug: 'mobile-app-development-services',  label: 'Mobile App Dev',        icon: faMobileScreen  },
      { slug: 'software-development-services',    label: 'Software Development',  icon: faCode          },
      { slug: 'design-ux-services',               label: 'Design & UX',           icon: faPalette       },
      { slug: 'digital-marketing-seo-services',   label: 'Digital Marketing & SEO', icon: faBullhorn    },
      { slug: 'ai-emerging-tech-services',        label: 'AI & Emerging Tech',    icon: faRobot         },
    ],
  },

  'startups-innovation': {
    slug: 'startups-innovation',
    name: 'Startups & Innovation',
    paletteName: 'Peach Ignite',
    scopeClass: 'tcat-startups-innovation',
    metaTitle: 'Startups & Innovation — Discover breakthrough companies across every industry',
    metaDescription: 'Real, verified startups across FinTech, HealthTech, EdTech, ClimateTech, AI, Web3, and more — curated and reviewed.',
    heroTitle: 'Discover breakthrough startups across every industry.',
    heroSub: 'Explore real, verified startups in FinTech, HealthTech, EdTech, ClimateTech, AI, Web3, robotics, and beyond — moderated, curated, and never paid for.',
    heroPlaceholder: 'Search startups, sectors, categories…',
    catsHeading: 'Discover startups across every emerging industry',
    catsSub: 'From FinTech and HealthTech to AI, ClimateTech, and Web3 — find the next breakthrough company across every vertical.',
    cards: [
      { slug: 'fintech-financial-services-startups',         label: 'FinTech',           icon: faMoneyBillTrendUp },
      { slug: 'healthtech-medtech-startups',                 label: 'HealthTech',        icon: faHeartPulse       },
      { slug: 'edtech-learning-startups',                    label: 'EdTech',            icon: faGraduationCap    },
      { slug: 'climate-energy-sustainability-startups',      label: 'ClimateTech',       icon: faLeaf             },
      { slug: 'ai-ml-generative-ai-startups',                label: 'AI & ML Startups',  icon: faRobot            },
      { slug: 'web3-crypto-blockchain-startups',             label: 'Web3 & Crypto',     icon: faShieldHalved     },
    ],
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
    cards: [
      { slug: 'restaurants-food-drink',     label: 'Restaurants & Food',  icon: faUtensils             },
      { slug: 'home-services-contractors',  label: 'Home Services',       icon: faHouseChimneyUser     },
      { slug: 'health-medical',             label: 'Health & Medical',    icon: faHouseChimneyMedical  },
      { slug: 'automotive',                 label: 'Automotive',          icon: faCar                  },
      { slug: 'beauty-personal-care',       label: 'Beauty & Personal',   icon: faSpa                  },
      { slug: 'shopping-retail',            label: 'Shopping & Retail',   icon: faBagShopping          },
    ],
  },

  'professional-services': {
    slug: 'professional-services',
    name: 'Professional Services',
    paletteName: 'Blush Authority',
    scopeClass: 'tcat-professional-services',
    metaTitle: 'Professional Services — Find experienced lawyers, accountants, advisors, and consultants',
    metaDescription: 'Verified professional services across 2,400+ categories — accounting, legal, financial advisory, consulting, HR, and more.',
    heroTitle: 'Find experienced professionals — lawyers, accountants, advisors.',
    heroSub: 'Compare verified accountants, attorneys, financial advisors, consultants, recruiters, and more across 2,400+ professional service categories.',
    heroPlaceholder: 'Search professionals, firms, specialties…',
    catsHeading: 'Find verified professionals across every service area',
    catsSub: 'Accountants, lawyers, advisors, consultants, recruiters — verified credentials and real client reviews across every specialty.',
    cards: [
      { slug: 'accounting-tax-services',            label: 'Accounting & Tax',      icon: faCalculator           },
      { slug: 'legal-services-pro',                 label: 'Legal Services',        icon: faScaleBalanced        },
      { slug: 'business-consulting-pro',            label: 'Business Consulting',   icon: faBriefcase            },
      { slug: 'financial-advisory-planning',        label: 'Financial Advisory',    icon: faFileInvoiceDollar    },
      { slug: 'hr-staffing-recruiting',             label: 'HR & Recruiting',       icon: faUserGroup            },
      { slug: 'marketing-advertising-communications', label: 'Marketing & Advertising', icon: faBullhorn          },
    ],
  },
}

export function getSectorLanding(slug: string): SectorLandingConfig | null {
  return SECTOR_LANDINGS[slug] ?? null
}
