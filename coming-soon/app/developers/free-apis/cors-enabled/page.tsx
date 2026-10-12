import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/apis.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DvUnavailable from '../../_components/shell/DvUnavailable'
import ApiCollectionView, { collectionMetadata, resolveApisStore } from '../../_components/apis/views/ApiCollectionView'

/* /developers/free-apis/cors-enabled - free APIs that browser JavaScript
   can call (CORS over HTTPS), grouped by category (spec 3.16). */

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  return collectionMetadata('cors-enabled', await resolveApisStore())
}

export default async function CorsApisPage() {
  const res = await resolveApisStore()
  if (res.kind === 'unavailable') return <DvUnavailable data="free API" />
  if (res.kind !== 'ok') notFound()
  return <ApiCollectionView slug="cors-enabled" store={res.value} />
}
