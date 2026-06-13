import { notFound, redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import { loadEditData } from '../../../../dashboard/listings/[uuid]/edit/loadEditData'
import AdminEditClient from './AdminEditClient'

export const dynamic = 'force-dynamic'

/**
 * /iww-hq/submissions/[id]/edit — admin full-edit of ANY listing.
 *
 * The /iww-hq client layout only checks admin auth on the client, so this
 * server page (which loads privileged listing data) verifies the admin
 * session itself before reading anything. Loads any listing by numeric id or
 * uuid — no owner constraint — and renders the same dashboard form the owner
 * uses, in adminMode (submits to /api/admin/submissions/[id]).
 */
export default async function AdminEditSubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const admin = await getAdminSession()
  if (!admin) redirect('/iww-hq')

  const { id } = await params
  const data = await loadEditData(id)
  if (!data) notFound()

  return <AdminEditClient {...data} />
}
