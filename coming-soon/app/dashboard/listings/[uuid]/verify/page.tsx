import { notFound } from 'next/navigation'
import { queryOne } from '@/lib/db'
import { requireDashboardUser } from '@/lib/user-auth'
import DashboardHeader from '../../../DashboardHeader'
import VerifyApplyClient from './VerifyApplyClient'

export const dynamic = 'force-dynamic'

interface ListingRow {
  id: number
  uuid: string
  slug: string
  company_name: string
  tagline: string
  logo_url: string | null
  website: string | null
  status: string
  verified: number
  verified_at: string | null
}

interface RequestRow {
  id: number
  status: 'pending' | 'approved' | 'rejected'
  legal_name: string | null
  business_email: string | null
  business_phone: string | null
  registration_number: string | null
  owner_role: string | null
  document_url: string | null
  social_proof: string | null
  applicant_notes: string | null
  admin_notes: string | null
  reviewed_at: string | null
  created_at: string
}

export interface InitialVerifyState {
  listing: {
    uuid: string
    slug: string
    companyName: string
    tagline: string
    logoUrl: string
    website: string
    listingStatus: string
    verified: boolean
    verifiedAt: string
  }
  latest: {
    id: number
    status: 'pending' | 'approved' | 'rejected'
    legalName: string
    businessEmail: string
    businessPhone: string
    registrationNumber: string
    ownerRole: string
    documentUrl: string
    socialProof: Record<string, string>
    applicantNotes: string
    adminNotes: string
    reviewedAt: string
    createdAt: string
  } | null
}

export default async function VerifyApplyPage({
  params,
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params
  const user = await requireDashboardUser()

  /* Tolerate the migration not having run yet: fall back to a query that
     doesn't reference the new column, and pretend nobody has applied yet. */
  let row: ListingRow | null = null
  try {
    row = await queryOne<ListingRow>(
      `SELECT id, uuid, slug, company_name, tagline, logo_url, website, status,
              COALESCE(verified, 0) AS verified, verified_at
         FROM submissions
        WHERE uuid = ? AND user_id = ?
        LIMIT 1`,
      [uuid, user.id]
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (/Unknown column.*verified/.test(msg)) {
      console.warn('[verify-page] verification columns missing — falling back')
      const base = await queryOne<Omit<ListingRow, 'verified' | 'verified_at'>>(
        `SELECT id, uuid, slug, company_name, tagline, logo_url, website, status
           FROM submissions
          WHERE uuid = ? AND user_id = ?
          LIMIT 1`,
        [uuid, user.id]
      )
      row = base ? { ...base, verified: 0, verified_at: null } : null
    } else {
      throw err
    }
  }
  if (!row) notFound()

  let latestRow: RequestRow | null = null
  try {
    latestRow = await queryOne<RequestRow>(
      `SELECT id, status, legal_name, business_email, business_phone,
              registration_number, owner_role, document_url,
              CAST(social_proof AS CHAR) AS social_proof,
              applicant_notes, admin_notes, reviewed_at, created_at
         FROM listing_verification_requests
        WHERE listing_id = ?
        ORDER BY created_at DESC
        LIMIT 1`,
      [row.id]
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (/listing_verification_requests/.test(msg)) {
      latestRow = null
    } else {
      throw err
    }
  }

  let socialProof: Record<string, string> = {}
  if (latestRow?.social_proof) {
    try {
      const parsed = JSON.parse(latestRow.social_proof)
      if (parsed && typeof parsed === 'object') socialProof = parsed as Record<string, string>
    } catch { /* ignore */ }
  }

  const initial: InitialVerifyState = {
    listing: {
      uuid: row.uuid,
      slug: row.slug,
      companyName: row.company_name,
      tagline: row.tagline,
      logoUrl: row.logo_url || '',
      website: row.website || '',
      listingStatus: row.status,
      verified: Number(row.verified) === 1,
      verifiedAt: row.verified_at || '',
    },
    latest: latestRow ? {
      id: latestRow.id,
      status: latestRow.status,
      legalName: latestRow.legal_name || '',
      businessEmail: latestRow.business_email || '',
      businessPhone: latestRow.business_phone || '',
      registrationNumber: latestRow.registration_number || '',
      ownerRole: latestRow.owner_role || '',
      documentUrl: latestRow.document_url || '',
      socialProof,
      applicantNotes: latestRow.applicant_notes || '',
      adminNotes: latestRow.admin_notes || '',
      reviewedAt: latestRow.reviewed_at || '',
      createdAt: latestRow.created_at || '',
    } : null,
  }

  return (
    <div className="dash">
      <DashboardHeader
        title="Verification"
        subtitle={row.company_name}
      />
      <VerifyApplyClient initial={initial} />
    </div>
  )
}
