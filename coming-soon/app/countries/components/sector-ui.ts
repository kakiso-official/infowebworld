import {
  faBrain, faLaptopCode, faServer, faRocket, faStore, faScaleBalanced,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

/* Icon + accent per sector - same pairs as the homepage sector cards
   (app/test-landing-page/CategoriesSection.tsx). Server-only use: icon
   definitions are never passed to client components. */
export const SECTOR_UI: Record<string, { icon: IconDefinition; accent: string }> = {
  'ai-ml':                 { icon: faBrain,         accent: '#8B5CF6' },
  'software-saas':         { icon: faLaptopCode,    accent: '#3B82F6' },
  'it-services-agencies':  { icon: faServer,        accent: '#14B8A6' },
  'startups-innovation':   { icon: faRocket,        accent: '#E8553D' },
  'local-businesses':      { icon: faStore,         accent: '#F59E0B' },
  'professional-services': { icon: faScaleBalanced, accent: '#2FAE6A' },
}
