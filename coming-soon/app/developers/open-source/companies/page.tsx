import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/oss.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DvUnavailable from '../../_components/shell/DvUnavailable'
import CompaniesView, { companiesMetadata, resolveCompaniesPage } from '../../_components/oss/views/CompaniesView'

/* /developers/open-source/companies - companies with open source, page 1
   (spec 3.9). Deeper pages: companies/page/[page]. */

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  return companiesMetadata(await resolveCompaniesPage())
}

export default async function CompaniesIndexPage() {
  const res = await resolveCompaniesPage()
  if (res.kind === 'unavailable') return <DvUnavailable data="open source" />
  if (res.kind !== 'ok') notFound()
  return <CompaniesView {...res.value} />
}
