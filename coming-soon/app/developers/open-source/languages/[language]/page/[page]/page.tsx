import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/oss.css'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import DvUnavailable from '../../../../../_components/shell/DvUnavailable'
import FacetPageView, { facetPageMetadata, resolveFacetPage } from '../../../../../_components/oss/views/FacetPageView'

/* /developers/open-source/languages/{language}/page/{n} (spec 3.11): 48 repos a
   page; /page/1 308s to the clean URL, a page past the end is a real 404. */

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

interface Params { language: string; page: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { language, page } = await params
  return facetPageMetadata('language', await resolveFacetPage('language', language, page), language)
}

export default async function LanguagePageN({ params }: { params: Promise<Params> }) {
  const { language, page } = await params
  const res = await resolveFacetPage('language', language, page)
  if (res.kind === 'redirect') permanentRedirect(res.path)
  if (res.kind === 'not-found') notFound()
  if (res.kind === 'unavailable') return <DvUnavailable data="open source" />
  return <FacetPageView {...res.value} />
}
