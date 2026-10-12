import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/oss.css'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import DvUnavailable from '../../../_components/shell/DvUnavailable'
import FacetPageView, { facetPageMetadata, resolveFacetPage } from '../../../_components/oss/views/FacetPageView'

/* /developers/open-source/countries/{country} (spec 3.11). An unknown country
   is a real 404; a non-canonical slug 308s to the canonical one. */

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

interface Params { country: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { country } = await params
  return facetPageMetadata('country', await resolveFacetPage('country', country), country)
}

export default async function CountryPage({ params }: { params: Promise<Params> }) {
  const { country } = await params
  const res = await resolveFacetPage('country', country)
  if (res.kind === 'redirect') permanentRedirect(res.path)
  if (res.kind === 'not-found') notFound()
  if (res.kind === 'unavailable') return <DvUnavailable data="open source" />
  return <FacetPageView {...res.value} />
}
