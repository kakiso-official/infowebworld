import { faMoneyBillTrendUp, faHeartPulse, faGraduationCap, faLeaf, faRobot, faShieldHalved } from '@fortawesome/free-solid-svg-icons'
import type { SectorLandingConfig } from './types'

export const startupsInnovation: SectorLandingConfig = {
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
}
