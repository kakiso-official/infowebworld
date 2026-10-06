import type { Metadata } from 'next'
import SectorDirectoryPage from '../sector-directory/SectorDirectoryPage'
import { buildDirectoryMetadata } from '../sector-directory/seo'
import { LOCAL_BUSINESS_DIRECTORY } from '../sector-directory/specs/local-businesses'

/* Local business directory - the local-businesses sector landing (SEO-spec rebuild, Oct 2026).
   /local-businesses 308-redirects here (next.config.ts), and its category pages
   moved under this path too (/local-businesses/x → /local-businesses-directory/x). Copy lives in
   the spec, layout in SectorDirectoryPage.

   ISR (10 min), like the homepage: nothing here reads cookies, headers
   or searchParams, and every DB fetch sits behind unstable_cache(600s). */
export const revalidate = 600

export const metadata: Metadata = buildDirectoryMetadata(LOCAL_BUSINESS_DIRECTORY)

export default function LocalBusinessDirectoryPage() {
  return <SectorDirectoryPage spec={LOCAL_BUSINESS_DIRECTORY} />
}
