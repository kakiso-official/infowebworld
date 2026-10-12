import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/oss.css'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import DvUnavailable from '../../../../_components/shell/DvUnavailable'
import CompaniesView, { companiesMetadata, resolveCompaniesPage } from '../../../../_components/oss/views/CompaniesView'

/* /developers/open-source/companies/page/{n} (spec 3.9): /page/1 308s to
   the clean URL, a page past the end is a real 404. */

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

interface Params { page: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { page } = await params
  return companiesMetadata(await resolveCompaniesPage(page))
}

export default async function CompaniesIndexPageN({ params }: { params: Promise<Params> }) {
  const { page } = await params
  const res = await resolveCompaniesPage(page)
  if (res.kind === 'redirect') permanentRedirect(res.path)
  if (res.kind === 'not-found') notFound()
  if (res.kind === 'unavailable') return <DvUnavailable data="open source" />
  return <CompaniesView {...res.value} />
}
