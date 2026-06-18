import { faCalculator, faScaleBalanced, faBriefcase, faFileInvoiceDollar, faUserGroup, faBullhorn } from '@fortawesome/free-solid-svg-icons'
import type { SectorLandingConfig } from './types'

export const professionalServices: SectorLandingConfig = {
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
}
