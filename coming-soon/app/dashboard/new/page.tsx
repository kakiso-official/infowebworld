import { Suspense } from 'react'
import { requireDashboardUser } from '@/lib/user-auth'
import { getUserHighestPaidPlan } from '@/lib/user-plan'
import { queryOne } from '@/lib/db'
import type { PlanTier } from '@/lib/user-plan-types'
import NewListingClient from './NewListingClient'

export const dynamic = 'force-dynamic'

/**
 * New listing page — rendered inside DashboardShell, so no navbar/footer.
 * The plan can be preset via ?plan=free|starter|yearly|lifetime; defaults
 * to 'free' when omitted.
 *
 * Auth: enforced here AND in the parent layout (defense in depth).
 * Anonymous traffic gets redirected to /business; we do not return a
 * Suspense fallback that an anonymous user could see.
 *
 * paidTier: the highest plan tier the user has actually paid for. The
 * picker uses this to decide whether to gate a tile behind /checkout.
 *
 * existingContext: snapshot of the user's prior listings, used to skip
 * the entry heroes intelligently. After ANY listing exists the sector
 * pick is locked (sourced from that listing's L1). After a COMPANY
 * listing exists the listing-mode pill is locked to 'product'.
 */
export default async function NewListingPage() {
  const user = await requireDashboardUser()
  const paidTier: PlanTier = await getUserHighestPaidPlan(user.id)

  /* Look up the user's most recent listing of any mode + sector chain.
     Walk parents to find the L1 since older rows might point at L2/L3.
     Also pull a snapshot of the company's reusable fields so the product
     form can prefill them (contact, location, socials etc.) when the
     user with a company starts a new product listing.
     Wrapped in try/catch — if the listing_mode column doesn't exist
     yet, treat the user as fresh (heroes show normally). */
  type CompanyPrefill = {
    contactName: string; email: string; phoneCode: string; phone: string
    countryCode: string; country: string; stateCode: string; state: string; city: string
    hqLocation: string; linkedin: string; twitter: string; facebook: string
    founded: string; employees: string
  }
  let existingContext: {
    hasAny: boolean
    hasCompany: boolean
    l1Id: string | null
    companyPrefill: CompanyPrefill | null
  } = {
    hasAny: false, hasCompany: false, l1Id: null, companyPrefill: null,
  }
  try {
    const recent = await queryOne<{ id: number; category_id: number | null; listing_mode: string }>(
      `SELECT id, category_id, COALESCE(listing_mode, 'product') AS listing_mode
         FROM submissions
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1`,
      [user.id]
    )
    if (recent) {
      existingContext.hasAny = true

      /* Walk up the category chain to find L1. Categories table has
         level + parent_id columns. Cap at 5 hops as a paranoia guard. */
      let l1: string | null = null
      let cur: number | null = recent.category_id
      for (let i = 0; cur && i < 5; i++) {
        const cat = await queryOne<{ id: number; level: number; parent_id: number | null }>(
          'SELECT id, level, parent_id FROM categories WHERE id = ?',
          [cur]
        )
        if (!cat) break
        if (cat.level === 1) { l1 = String(cat.id); break }
        cur = cat.parent_id
      }
      existingContext.l1Id = l1
    }

    /* Separate query — does the user have a company specifically?
       (recent could be a product, even if a company also exists.)
       Pull the reusable fields too so we can prefill the product form. */
    const co = await queryOne<{
      id: number; contact_name: string | null; email: string | null
      phone_code: string | null; phone: string | null
      country_id: number | null; city: string | null; state: string | null
      hq_location: string | null
      linkedin: string | null; twitter: string | null; facebook: string | null
      founded_year: string | null; team_size: string | null
      country_name: string | null; country_iso: string | null
    }>(
      `SELECT s.id, s.contact_name, s.email, s.phone_code, s.phone,
              s.country_id, s.city, s.state, s.hq_location,
              s.linkedin, s.twitter, s.facebook,
              s.founded_year, s.team_size,
              co.name AS country_name, co.code AS country_iso
         FROM submissions s
         LEFT JOIN countries co ON co.id = s.country_id
        WHERE s.user_id = ? AND s.listing_mode = 'company'
        LIMIT 1`,
      [user.id]
    )
    if (co) {
      existingContext.hasCompany = true
      existingContext.companyPrefill = {
        contactName: co.contact_name || '',
        email:       co.email || '',
        phoneCode:   co.phone_code || '+1',
        phone:       co.phone || '',
        countryCode: co.country_iso || '',
        country:     co.country_name || '',
        stateCode:   '',                        // ISO state code not stored — user re-picks
        state:       co.state || '',
        city:        co.city || '',
        hqLocation:  co.hq_location || '',
        linkedin:    co.linkedin || '',
        twitter:     co.twitter || '',
        facebook:    co.facebook || '',
        founded:     co.founded_year || '',
        employees:   co.team_size || '',
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column.*listing_mode/.test(msg)) throw err
    /* Pre-migration — heroes show normally. */
  }

  return (
    <Suspense>
      <NewListingClient paidTier={paidTier} existingContext={existingContext} />
    </Suspense>
  )
}
