'use client'
import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardListingForm, { type PlanKey } from './form/DashboardListingForm'
import { PLAN_CAPS } from './form/constants'
import DashboardHeader from '../DashboardHeader'
import { TIER_RANK, type PlanTier } from '@/lib/user-plan-types'

const VALID: PlanKey[] = ['free', 'starter', 'yearly', 'lifetime']

interface Props {
  /** Highest tier the user has already paid for. 'free' means no purchase yet. */
  paidTier: PlanTier
}

/**
 * Plan picker + listing form wrapper.
 * Without ?plan=, show a compact grid so the user can pick a plan tier first.
 * With ?plan=, render the listing form directly.
 *
 * Paid-tile clicks redirect to /dashboard/new/checkout?plan=X unless the user
 * has already paid for that tier or higher.
 */
export default function NewListingClient({ paidTier }: Props) {
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
      <div className="nl">
        <DashboardHeader
          title="Create a listing"
          subtitle="Pick a plan to start. You can change it before publishing."
        />

        <div className="nl-plans">
          {VALID.map(key => {
            const c = PLAN_CAPS[key]
            const owned = isOwned(key)
            const requiresPay = key !== 'free' && !owned
            return (
              <button key={key} type="button" className={`nl-plan nl-plan--${key}`}
                onClick={() => handlePick(key)}>
                <div className="nl-plan-head">
                  <span className="nl-plan-label">{c.label}</span>
                  <span className="nl-plan-price">{c.price}</span>
                </div>
                <p className="nl-plan-desc">{c.description}</p>
                <ul className="nl-plan-feats">
                  <li>Up to {c.maxFeatures} features</li>
                  <li>Up to {c.maxTags} tags</li>
                  {c.hasFaqs && <li>FAQ section</li>}
                  {c.hasKeyFeatures && <li>Rich key features</li>}
                  {c.hasPricingTiers && <li>Pricing tiers</li>}
                  {c.hasComplianceAndAwards && <li>Compliance &amp; awards</li>}
                </ul>
                <span className="nl-plan-pick">
                  {owned && key !== 'free' ? `Continue with ${c.label} →`
                    : requiresPay ? `Pay & continue →`
                    : `Select ${c.label} →`}
                </span>
              </button>
            )
          })}
        </div>
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

      <DashboardListingForm plan={plan} />
    </div>
  )
}
