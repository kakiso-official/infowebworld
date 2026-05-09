import { NextRequest } from 'next/server'
import { execute, queryOne } from '@/lib/db'
import { getUserFromRequest } from '@/lib/user-auth'

/**
 * Listing verification endpoints — owner-facing.
 *
 *   GET    /api/dashboard/listings/[uuid]/verify
 *     → Current verification state for the listing + latest request row.
 *
 *   POST   /api/dashboard/listings/[uuid]/verify
 *     → Submit a new application. Inserts a 'pending' row and returns it.
 *       Blocks when listing is already verified or a pending request exists.
 *
 * Auth: logged-in business user whose id matches submissions.user_id.
 * `uuid` is the listing uuid as it appears in dashboard URLs; numeric pk is
 * also accepted for symmetry with the rest of the dashboard API.
 */

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
  updated_at: string | null
}

interface ListingRow {
  id: number
  uuid: string
  slug: string
  user_id: number | null
  company_name: string
  verified: number
  verified_at: string | null
  verification_request_id: number | null
}

async function loadListing(idOrUuid: string): Promise<ListingRow | null> {
  const isUuid = /^[0-9a-f]{8}-/i.test(idOrUuid)
  return await queryOne<ListingRow>(
    isUuid
      ? `SELECT id, uuid, slug, user_id, company_name,
                COALESCE(verified, 0) AS verified,
                verified_at, verification_request_id
           FROM submissions WHERE uuid = ? LIMIT 1`
      : `SELECT id, uuid, slug, user_id, company_name,
                COALESCE(verified, 0) AS verified,
                verified_at, verification_request_id
           FROM submissions WHERE id = ? LIMIT 1`,
    [idOrUuid]
  )
}

async function loadLatestRequest(listingId: number): Promise<RequestRow | null> {
  return await queryOne<RequestRow>(
    `SELECT id, status, legal_name, business_email, business_phone,
            registration_number, owner_role, document_url,
            CAST(social_proof AS CHAR) AS social_proof,
            applicant_notes, admin_notes, reviewed_at, created_at, updated_at
       FROM listing_verification_requests
      WHERE listing_id = ?
      ORDER BY created_at DESC
      LIMIT 1`,
    [listingId]
  )
}

function shapeRequest(r: RequestRow | null) {
  if (!r) return null
  let social: Record<string, string> = {}
  try {
    if (r.social_proof) {
      const parsed = JSON.parse(r.social_proof)
      if (parsed && typeof parsed === 'object') social = parsed as Record<string, string>
    }
  } catch { /* ignore */ }
  return {
    id: r.id,
    status: r.status,
    legalName: r.legal_name || '',
    businessEmail: r.business_email || '',
    businessPhone: r.business_phone || '',
    registrationNumber: r.registration_number || '',
    ownerRole: r.owner_role || '',
    documentUrl: r.document_url || '',
    socialProof: social,
    applicantNotes: r.applicant_notes || '',
    adminNotes: r.admin_notes || '',
    reviewedAt: r.reviewed_at || '',
    createdAt: r.created_at || '',
    updatedAt: r.updated_at || '',
  }
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await ctx.params
    const user = await getUserFromRequest(request)
    if (!user) return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const listing = await loadListing(uuid)
    if (!listing) return Response.json({ ok: false, error: 'Not found' }, { status: 404 })
    if (listing.user_id !== user.id) {
      return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    }

    const latest = await loadLatestRequest(listing.id)

    return Response.json({
      ok: true,
      listing: {
        id: listing.id,
        uuid: listing.uuid,
        slug: listing.slug,
        companyName: listing.company_name,
        verified: Boolean(listing.verified),
        verifiedAt: listing.verified_at || '',
      },
      latest: shapeRequest(latest),
    })
  } catch (err) {
    console.error('GET /api/dashboard/listings/[uuid]/verify error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await ctx.params
    const user = await getUserFromRequest(request)
    if (!user) return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const listing = await loadListing(uuid)
    if (!listing) return Response.json({ ok: false, error: 'Not found' }, { status: 404 })
    if (listing.user_id !== user.id) {
      return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    }
    if (Number(listing.verified) === 1) {
      return Response.json(
        { ok: false, error: 'This listing is already verified.' },
        { status: 409 }
      )
    }

    const latest = await loadLatestRequest(listing.id)
    if (latest && latest.status === 'pending') {
      return Response.json(
        { ok: false, error: 'A verification request is already pending review.' },
        { status: 409 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const trim = (v: unknown, max: number): string | null => {
      if (typeof v !== 'string') return null
      const t = v.trim()
      return t ? t.slice(0, max) : null
    }
    const legalName          = trim(body.legalName, 255)
    const businessEmail      = trim(body.businessEmail, 255)
    const businessPhone      = trim(body.businessPhone, 40)
    const registrationNumber = trim(body.registrationNumber, 120)
    const ownerRole          = trim(body.ownerRole, 120)
    const documentUrl        = trim(body.documentUrl, 500)
    const applicantNotes     = trim(body.applicantNotes, 2000)

    /* Need at least *something* — applicants who submit a blank form would
       just create work for admins to chase. Require either a business email,
       a registration number, or an applicant note. */
    if (!legalName && !businessEmail && !registrationNumber && !applicantNotes) {
      return Response.json(
        { ok: false, error: 'Please provide at least one piece of evidence.' },
        { status: 400 }
      )
    }

    /* Loose email shape check — same as elsewhere in the codebase. */
    if (businessEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
      return Response.json(
        { ok: false, error: 'Business email looks invalid.' },
        { status: 400 }
      )
    }

    /* Whitelist social_proof keys + cap value lengths so we don't store
       arbitrary blobs in the JSON column. */
    let socialProofJson: string | null = null
    const sp = body.socialProof
    if (sp && typeof sp === 'object' && !Array.isArray(sp)) {
      const out: Record<string, string> = {}
      for (const k of ['linkedin', 'twitter', 'github', 'facebook', 'other']) {
        const raw = (sp as Record<string, unknown>)[k]
        if (typeof raw === 'string' && raw.trim()) out[k] = raw.trim().slice(0, 300)
      }
      if (Object.keys(out).length > 0) socialProofJson = JSON.stringify(out)
    }

    const result = await execute(
      `INSERT INTO listing_verification_requests
         (listing_id, user_id, status, legal_name, business_email, business_phone,
          registration_number, owner_role, document_url, social_proof, applicant_notes)
       VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        listing.id, user.id,
        legalName, businessEmail, businessPhone,
        registrationNumber, ownerRole, documentUrl,
        socialProofJson, applicantNotes,
      ]
    )
    const insertId = result.insertId || 0
    const fresh = insertId
      ? await queryOne<RequestRow>(
          `SELECT id, status, legal_name, business_email, business_phone,
                  registration_number, owner_role, document_url,
                  CAST(social_proof AS CHAR) AS social_proof,
                  applicant_notes, admin_notes, reviewed_at, created_at, updated_at
             FROM listing_verification_requests WHERE id = ?`,
          [insertId]
        )
      : await loadLatestRequest(listing.id)

    return Response.json({ ok: true, request: shapeRequest(fresh) })
  } catch (err) {
    console.error('POST /api/dashboard/listings/[uuid]/verify error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
