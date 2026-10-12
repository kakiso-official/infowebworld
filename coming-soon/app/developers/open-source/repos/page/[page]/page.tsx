import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/oss.css'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import DvUnavailable from '../../../../_components/shell/DvUnavailable'
import ReposView, { reposMetadata, resolveReposPage } from '../../../../_components/oss/views/ReposView'

/* /developers/open-source/repos/page/{n} (spec 3.8): /page/1 308s to the
   clean URL, a page past the end (or not a plain number) is a real 404. */

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

interface Params { page: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { page } = await params
  return reposMetadata(await resolveReposPage(page))
}

export default async function ReposRankingPageN({ params }: { params: Promise<Params> }) {
  const { page } = await params
  const res = await resolveReposPage(page)
  if (res.kind === 'redirect') permanentRedirect(res.path)
  if (res.kind === 'not-found') notFound()
  if (res.kind === 'unavailable') return <DvUnavailable data="open source" />
  return <ReposView {...res.value} />
}
