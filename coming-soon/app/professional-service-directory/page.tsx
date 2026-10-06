import type { Metadata } from 'next'
import SectorDirectoryPage from '../sector-directory/SectorDirectoryPage'
import { buildDirectoryMetadata } from '../sector-directory/seo'
import { PROFESSIONAL_SERVICES_DIRECTORY } from '../sector-directory/specs/professional-services'

/* Professional services directory - the professional-services sector landing (SEO-spec rebuild, Oct 2026).
   /professional-services 308-redirects here (next.config.ts), and its category pages
   moved under this path too (/professional-services/x → /professional-service-directory/x). Copy lives in
   the spec, layout in SectorDirectoryPage.

   ISR (10 min), like the homepage: nothing here reads cookies, headers
   or searchParams, and every DB fetch sits behind unstable_cache(600s). */
export const revalidate = 600

export const metadata: Metadata = buildDirectoryMetadata(PROFESSIONAL_SERVICES_DIRECTORY)

export default function ProfessionalServicesDirectoryPage() {
  return <SectorDirectoryPage spec={PROFESSIONAL_SERVICES_DIRECTORY} />
}
