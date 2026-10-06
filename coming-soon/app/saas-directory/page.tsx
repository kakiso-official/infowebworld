import type { Metadata } from 'next'
import SectorDirectoryPage from '../sector-directory/SectorDirectoryPage'
import { buildDirectoryMetadata } from '../sector-directory/seo'
import { SAAS_DIRECTORY } from '../sector-directory/specs/software-saas'

/* SaaS directory - the software-saas sector landing (SEO-spec rebuild, Oct 2026).
   /software-saas 308-redirects here (next.config.ts), and its category pages
   moved under this path too (/software-saas/x → /saas-directory/x). Copy lives in
   the spec, layout in SectorDirectoryPage.

   ISR (10 min), like the homepage: nothing here reads cookies, headers
   or searchParams, and every DB fetch sits behind unstable_cache(600s). */
export const revalidate = 600

export const metadata: Metadata = buildDirectoryMetadata(SAAS_DIRECTORY)

export default function SaasDirectoryPage() {
  return <SectorDirectoryPage spec={SAAS_DIRECTORY} />
}
