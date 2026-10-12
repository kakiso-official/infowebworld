import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/oss.css'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import DvUnavailable from '../../../_components/shell/DvUnavailable'
import IssuesView, { issuesMetadata, resolveIssuesPage } from '../../../_components/oss/views/IssuesView'

/* /developers/open-source/good-first-issues/{language} (spec 3.12). The page
   exists while the language has at least one listed issue. */

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

interface Params { language: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { language } = await params
  return issuesMetadata(await resolveIssuesPage(language), language)
}

export default async function GoodFirstIssuesLanguagePage({ params }: { params: Promise<Params> }) {
  const { language } = await params
  const res = await resolveIssuesPage(language)
  if (res.kind === 'redirect') permanentRedirect(res.path)
  if (res.kind === 'not-found') notFound()
  if (res.kind === 'unavailable') return <DvUnavailable data="open source" />
  return <IssuesView {...res.value} />
}
