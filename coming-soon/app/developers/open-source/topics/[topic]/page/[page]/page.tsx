import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/oss.css'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import DvUnavailable from '../../../../../_components/shell/DvUnavailable'
import FacetPageView, { facetPageMetadata, resolveFacetPage } from '../../../../../_components/oss/views/FacetPageView'

/* /developers/open-source/topics/{topic}/page/{n} (spec 3.11): 48 repos a
   page; /page/1 308s to the clean URL, a page past the end is a real 404. */

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

interface Params { topic: string; page: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { topic, page } = await params
  return facetPageMetadata('topic', await resolveFacetPage('topic', topic, page), topic)
}

export default async function TopicPageN({ params }: { params: Promise<Params> }) {
  const { topic, page } = await params
  const res = await resolveFacetPage('topic', topic, page)
  if (res.kind === 'redirect') permanentRedirect(res.path)
  if (res.kind === 'not-found') notFound()
  if (res.kind === 'unavailable') return <DvUnavailable data="open source" />
  return <FacetPageView {...res.value} />
}
