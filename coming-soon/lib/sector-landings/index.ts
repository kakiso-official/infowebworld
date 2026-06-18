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
 * One file per sector in this folder (./ai-ml, ./software-saas, …); this
 * index assembles them into the SECTOR_LANDINGS map and re-exports the
 * shared types.
 *
 * Used by app/sector-landing/SectorLandingPage.tsx and the catch-all
 * /[...segments]/page.tsx isSector branch.
 */
import type { SectorLandingConfig } from './types'
import { aiMl } from './ai-ml'
import { softwareSaas } from './software-saas'
import { itServicesAgencies } from './it-services-agencies'
import { startupsInnovation } from './startups-innovation'
import { localBusinesses } from './local-businesses'
import { professionalServices } from './professional-services'

export type { CardDef, SectorSectionsCopy, SectorLandingConfig } from './types'

export const SECTOR_LANDINGS: Record<string, SectorLandingConfig> = {
  'ai-ml': aiMl,
  'software-saas': softwareSaas,
  'it-services-agencies': itServicesAgencies,
  'startups-innovation': startupsInnovation,
  'local-businesses': localBusinesses,
  'professional-services': professionalServices,
}

export function getSectorLanding(slug: string): SectorLandingConfig | null {
  return SECTOR_LANDINGS[slug] ?? null
}
