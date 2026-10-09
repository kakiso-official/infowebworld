import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faLaptopCode, faBrain, faServer, faRocket, faStore, faScaleBalanced,
} from '@fortawesome/free-solid-svg-icons'
import { sectorLandingPath } from '@/lib/sector-paths'

/* The six L1 sectors with the icon + accent colour the homepage category
   cards use (app/test-landing-page/CategoriesSection.tsx), and the current
   landing URL from lib/sector-paths.ts. Pages pick their own labels. */
export type SectorSlug =
  | 'software-saas' | 'ai-ml' | 'it-services-agencies'
  | 'startups-innovation' | 'local-businesses' | 'professional-services'

export type SectorLink = { slug: SectorSlug; href: string; icon: IconDefinition; accent: string }

export const SECTOR_LINKS: SectorLink[] = ([
  { slug: 'software-saas',         icon: faLaptopCode,    accent: '#3B82F6' },
  { slug: 'ai-ml',                 icon: faBrain,         accent: '#8B5CF6' },
  { slug: 'it-services-agencies',  icon: faServer,        accent: '#14B8A6' },
  { slug: 'startups-innovation',   icon: faRocket,        accent: '#E8553D' },
  { slug: 'local-businesses',      icon: faStore,         accent: '#F59E0B' },
  { slug: 'professional-services', icon: faScaleBalanced, accent: '#2FAE6A' },
] as const).map(s => ({ ...s, href: sectorLandingPath(s.slug) }))
