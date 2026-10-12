import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/oss.css'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import DvUnavailable from '../../../_components/shell/DvUnavailable'
import FacetPageView, { facetPageMetadata, resolveFacetPage } from '../../../_components/oss/views/FacetPageView'

/* /developers/open-source/languages/{language} (spec 3.11). An unknown language
   is a real 404; a non-canonical slug 308s to the canonical one. */

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

interface Params { language: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { language } = await params
  return facetPageMetadata('language', await resolveFacetPage('language', language), language)
}

export default async function LanguagePage({ params }: { params: Promise<Params> }) {
  const { language } = await params
  const res = await resolveFacetPage('language', language)
  if (res.kind === 'redirect') permanentRedirect(res.path)
  if (res.kind === 'not-found') notFound()
  if (res.kind === 'unavailable') return <DvUnavailable data="open source" />
  return <FacetPageView {...res.value} />
}
