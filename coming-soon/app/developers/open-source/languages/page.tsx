import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/oss.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DvUnavailable from '../../_components/shell/DvUnavailable'
import FacetIndexView, { facetIndexMetadata, resolveFacetIndex } from '../../_components/oss/views/FacetIndexView'

/* /developers/open-source/languages - every language with its own page (spec 3.10). */

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  return facetIndexMetadata('language', await resolveFacetIndex())
}

export default async function LanguageIndexPage() {
  const res = await resolveFacetIndex()
  if (res.kind === 'unavailable') return <DvUnavailable data="open source" />
  if (res.kind !== 'ok') notFound()
  return <FacetIndexView kind="language" store={res.value} />
}
