'use client'
import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardListingForm, { type PlanKey } from './form/DashboardListingForm'
import { PLAN_CAPS } from './form/constants'
import DashboardHeader from '../DashboardHeader'
import FeatureComparison, { type AnyPlan } from '../../business/components/FeatureComparison'
import { TIER_RANK, type PlanTier } from '@/lib/user-plan-types'

const VALID: PlanKey[] = ['free', 'starter', 'yearly', 'lifetime']

interface ExistingContext {
  /** True when the user has at least one listing in any state. Locks the sector hero. */
  hasAny: boolean
  /** True when the user already has a company listing (any state). Locks the mode hero. */
  hasCompany: boolean
  /** L1 sector id from the user's most recent listing (or null). Pre-fills the form's sector. */
  l1Id: string | null
  /** Company snapshot (when company exists). Used to one-time prefill the product form. */
  companyPrefill: {
    contactName: string; email: string; phoneCode: string; phone: string
    countryCode: string; country: string; stateCode: string; state: string; city: string
    hqLocation: string; linkedin: string; twitter: string; facebook: string
    founded: string; employees: string
  } | null
}

interface Props {
  /** Highest tier the user has already paid for. 'free' means no purchase yet. */
  paidTier: PlanTier
  existingContext: ExistingContext
}

/**
 * Plan picker + listing form wrapper.
 * Without ?plan=, show a compact grid so the user can pick a plan tier first.
 * With ?plan=, render the listing form directly.
 *
 * Paid-tile clicks redirect to /dashboard/new/checkout?plan=X unless the user
 * has already paid for that tier or higher.
 */
export default function NewListingClient({ paidTier, existingContext }: Props) {
  const sp = useSearchParams()
  const router = useRouter()
  const queryPlan = sp.get('plan') as PlanKey | null
  const initial: PlanKey | null = queryPlan && VALID.includes(queryPlan) ? queryPlan : null

  const [plan, setPlan] = useState<PlanKey | null>(initial)

  const selectedCaps = useMemo(() => plan ? PLAN_CAPS[plan] : null, [plan])

  /** True when the user already owns this tier (or higher). */
  const isOwned = (key: PlanKey): boolean => TIER_RANK[paidTier] >= TIER_RANK[key as PlanTier]

  const handlePick = (key: PlanKey) => {
    if (key === 'free' || isOwned(key)) {
      setPlan(key)
      return
    }
    router.push(`/dashboard/new/checkout?plan=${key}`)
  }

  if (!plan) {
    return (
      <div className="nl nl--compare">
        <DashboardHeader
          title="Create a listing"
          subtitle="Pick a plan to start. You can change it before publishing."
        />
        <FeatureComparison onChoosePlan={(p: AnyPlan) => handlePick(p as PlanKey)} />
      </div>
    )
  }

  return (
    <div className="nl nl--form">
      <DashboardHeader
        title="New listing"
        subtitle={
          <>
            {selectedCaps?.label} plan · {selectedCaps?.price}
            {' · '}
            <button type="button" className="nl-change-plan" onClick={() => setPlan(null)}>
              change plan
            </button>
          </>
        }
      />

      <DashboardListingForm plan={plan} existingContext={existingContext} />
    </div>
  )
}
