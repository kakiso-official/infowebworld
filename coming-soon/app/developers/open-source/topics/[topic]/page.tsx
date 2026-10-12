import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/oss.css'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import DvUnavailable from '../../../_components/shell/DvUnavailable'
import FacetPageView, { facetPageMetadata, resolveFacetPage } from '../../../_components/oss/views/FacetPageView'

/* /developers/open-source/topics/{topic} (spec 3.11). An unknown topic
   is a real 404; a non-canonical slug 308s to the canonical one. */

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

interface Params { topic: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { topic } = await params
  return facetPageMetadata('topic', await resolveFacetPage('topic', topic), topic)
}

export default async function TopicPage({ params }: { params: Promise<Params> }) {
  const { topic } = await params
  const res = await resolveFacetPage('topic', topic)
  if (res.kind === 'redirect') permanentRedirect(res.path)
  if (res.kind === 'not-found') notFound()
  if (res.kind === 'unavailable') return <DvUnavailable data="open source" />
  return <FacetPageView {...res.value} />
}
