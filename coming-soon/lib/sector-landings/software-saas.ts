import { faChartLine, faBullhorn, faHeadset, faChartBar, faShieldHalved, faGears } from '@fortawesome/free-solid-svg-icons'
import type { SectorLandingConfig } from './types'

export const softwareSaas: SectorLandingConfig = {
  slug: 'software-saas',
  name: 'Software & SaaS',
  paletteName: 'Sky Interface',
  scopeClass: 'tcat-software-saas',
  metaTitle: 'SaaS & Business Software Directory - Compare & List Verified Software | InfoWebWorld',
  metaDescription: 'SaaS directory to find, compare and list verified business software across 900+ categories - CRM, marketing, analytics, cybersecurity, and more. Real reviews, no pay-to-play. List your software free.',
  heroTitle: 'SaaS & business software directory: find, compare & list verified software.',
  heroSub: 'Browse the SaaS directory - 900+ categories of verified business software with real reviews: CRM, marketing, support, analytics, cybersecurity, project management, and more. Or list your software free.',
  heroPlaceholder: 'Search software, SaaS tools, categories…',
  catsHeading: 'Browse the SaaS & business software directory by category',
  catsSub: 'Compare CRM platforms, marketing suites, support tools, analytics, and security software - all verified, reviewed, and never paid for.',
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
}
