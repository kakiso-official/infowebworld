import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/oss.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DvUnavailable from '../../_components/shell/DvUnavailable'
import IssuesView, { issuesMetadata, resolveIssuesPage } from '../../_components/oss/views/IssuesView'

/* /developers/open-source/good-first-issues - every language (spec 3.12). */

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  return issuesMetadata(await resolveIssuesPage())
}

export default async function GoodFirstIssuesPage() {
  const res = await resolveIssuesPage()
  if (res.kind === 'unavailable') return <DvUnavailable data="open source" />
  if (res.kind !== 'ok') notFound()
  return <IssuesView {...res.value} />
}
