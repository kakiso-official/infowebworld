import type { Metadata } from 'next'
import SectorDirectoryPage from '../sector-directory/SectorDirectoryPage'
import { buildDirectoryMetadata } from '../sector-directory/seo'
import { IT_DIRECTORY } from '../sector-directory/specs/it-services-agencies'

/* IT directory - the it-services-agencies sector landing (SEO-spec rebuild, Oct 2026).
   /it-services-agencies 308-redirects here (next.config.ts), and its category pages
   moved under this path too (/it-services-agencies/x → /it-directory/x). Copy lives in
   the spec, layout in SectorDirectoryPage.

   ISR (10 min), like the homepage: nothing here reads cookies, headers
   or searchParams, and every DB fetch sits behind unstable_cache(600s). */
export const revalidate = 600

export const metadata: Metadata = buildDirectoryMetadata(IT_DIRECTORY)

export default function ItDirectoryPage() {
  return <SectorDirectoryPage spec={IT_DIRECTORY} />
}
