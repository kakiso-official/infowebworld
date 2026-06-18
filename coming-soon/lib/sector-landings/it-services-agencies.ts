import { faGlobe, faMobileScreen, faCode, faPalette, faBullhorn, faRobot } from '@fortawesome/free-solid-svg-icons'
import type { SectorLandingConfig } from './types'

export const itServicesAgencies: SectorLandingConfig = {
  slug: 'it-services-agencies',
  name: 'IT Services & Agencies',
  paletteName: 'Mint Circuit',
  scopeClass: 'tcat-it-services-agencies',
  metaTitle: 'IT & Digital Agency Directory - Find & Hire Verified Agencies | InfoWebWorld',
  metaDescription: 'Agency directory to find, compare and hire verified IT, web, software, design, and digital marketing agencies - by service and city, with real client reviews. No pay-to-play. List your agency free.',
  heroTitle: 'Agency directory: find & hire verified IT, web, software & marketing agencies.',
  heroSub: 'Browse the agency directory - verified web, mobile, and software development companies, design studios, and digital marketing agencies, reviewed by real clients. Or list your agency free.',
  heroPlaceholder: 'Search IT services, agencies, categories…',
  catsHeading: 'Browse the agency directory by service',
  catsSub: 'Web, mobile, software, design, marketing - find specialized agencies vetted by InfoWebWorld and reviewed by real clients.',
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
}
