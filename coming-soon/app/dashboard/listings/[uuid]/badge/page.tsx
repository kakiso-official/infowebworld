import Link from 'next/link'
import { notFound } from 'next/navigation'
import { queryOne } from '@/lib/db'
import { requireDashboardUser } from '@/lib/user-auth'
import DashboardHeader from '../../../DashboardHeader'
import BadgeCard, { type BadgeStatus } from './BadgeCard'

export const dynamic = 'force-dynamic'

interface Row {
  id: number
  uuid: string
  slug: string
  company_name: string
  listing_mode: string
  website: string | null
  status: string
  backlink_status: string | null
  backlink_url: string | null
}

export default async function BadgePage({
  params,
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params
  const user = await requireDashboardUser()

  const FULL = `SELECT id, uuid, slug, company_name, COALESCE(listing_mode,'product') AS listing_mode,
                       website, status, backlink_status, backlink_url
                  FROM submissions WHERE uuid = ? AND user_id = ? LIMIT 1`
  const LEGACY = `SELECT id, uuid, slug, company_name, COALESCE(listing_mode,'product') AS listing_mode,
                         website, status, NULL AS backlink_status, NULL AS backlink_url
                    FROM submissions WHERE uuid = ? AND user_id = ? LIMIT 1`

  let row: Row | null = null
  try {
    row = await queryOne<Row>(FULL, [uuid, user.id])
  } catch (err) {
    /* backlink_* columns not migrated yet -> fall back so the page still loads. */
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column.*backlink_/.test(msg)) throw err
    row = await queryOne<Row>(LEGACY, [uuid, user.id])
  }
  if (!row) notFound()

  const publicPath = row.listing_mode === 'company' ? `/profile/${row.slug}` : `/listing/${row.slug}`

  return (
    <div className="dash">
      <DashboardHeader title="Your InfoWebWorld badge" subtitle={row.company_name} />
      <BadgeCard
        slug={row.slug}
        companyName={row.company_name}
        publicPath={publicPath}
        website={row.website}
        initialStatus={(row.backlink_status as BadgeStatus) || 'none'}
      />
      <p style={{ marginTop: 16 }}>
        <Link href="/dashboard/listings" className="dash-list-btn dash-list-btn--ghost">
          &larr; Back to listings
        </Link>
      </p>
    </div>
  )
}
