import type { Metadata } from 'next'
import SectorDirectoryPage from '../sector-directory/SectorDirectoryPage'
import { buildDirectoryMetadata } from '../sector-directory/seo'
import { STARTUP_DIRECTORY } from '../sector-directory/specs/startups-innovation'

/* Startup directory - the startups-innovation sector landing (SEO-spec rebuild, Oct 2026).
   /startups-innovation 308-redirects here (next.config.ts), and its category pages
   moved under this path too (/startups-innovation/x → /startup-directory/x). Copy lives in
   the spec, layout in SectorDirectoryPage.

   ISR (10 min), like the homepage: nothing here reads cookies, headers
   or searchParams, and every DB fetch sits behind unstable_cache(600s). */
export const revalidate = 600

export const metadata: Metadata = buildDirectoryMetadata(STARTUP_DIRECTORY)

export default function StartupDirectoryPage() {
  return <SectorDirectoryPage spec={STARTUP_DIRECTORY} />
}
