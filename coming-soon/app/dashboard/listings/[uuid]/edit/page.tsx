import { notFound } from 'next/navigation'
import { requireDashboardUser } from '@/lib/user-auth'
import EditListingClient from './EditListingClient'
import { loadEditData } from './loadEditData'

export const dynamic = 'force-dynamic'

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params
  const user = await requireDashboardUser()

  /* Owner-gated load — only the listing's owner may open their edit form. */
  const data = await loadEditData(uuid, { ownerId: user.id })
  if (!data) notFound()

  return <EditListingClient {...data} />
}
