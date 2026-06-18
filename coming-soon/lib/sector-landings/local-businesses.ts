import { faUtensils, faHouseChimneyUser, faHouseChimneyMedical, faCar, faSpa, faBagShopping } from '@fortawesome/free-solid-svg-icons'
import type { SectorLandingConfig } from './types'

export const localBusinesses: SectorLandingConfig = {
  slug: 'local-businesses',
  name: 'Local Businesses',
  paletteName: 'Sage Community',
  scopeClass: 'tcat-local-businesses',
  metaTitle: 'Local Business Directory - Find & Review the Best Businesses in Your City | InfoWebWorld',
  metaDescription: 'Local business directory to find, compare and review verified local businesses across 800+ categories - restaurants, home services, health, automotive, beauty, retail, and more. List your business free.',
  heroTitle: 'Local business directory: find & review the best businesses in your city.',
  heroSub: 'Browse the local business directory - verified restaurants, contractors, doctors, salons, mechanics, and shops with real reviews. Find the best in your city, or list your local business free.',
  heroPlaceholder: 'Search restaurants, contractors, services, categories…',
  catsHeading: 'Browse the local business directory by category',
  catsSub: 'From restaurants and home services to health, automotive, beauty, and retail - find trusted local businesses, reviewed by real customers.',
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
}
