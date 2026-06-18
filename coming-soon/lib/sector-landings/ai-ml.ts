import { faRobot, faImage, faCode, faGears, faBullhorn, faHeadset } from '@fortawesome/free-solid-svg-icons'
import type { SectorLandingConfig } from './types'

export const aiMl: SectorLandingConfig = {
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
}
