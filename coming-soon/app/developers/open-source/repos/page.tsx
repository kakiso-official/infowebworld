import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/oss.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DvUnavailable from '../../_components/shell/DvUnavailable'
import ReposView, { reposMetadata, resolveReposPage } from '../../_components/oss/views/ReposView'

/* /developers/open-source/repos - the most-starred company repositories,
   page 1 (spec 3.8). Deeper pages: repos/page/[page]. */

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  return reposMetadata(await resolveReposPage())
}

export default async function ReposRankingPage() {
  const res = await resolveReposPage()
  if (res.kind === 'unavailable') return <DvUnavailable data="open source" />
  if (res.kind !== 'ok') notFound()
  return <ReposView {...res.value} />
}
