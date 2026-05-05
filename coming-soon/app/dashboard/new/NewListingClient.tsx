'use client'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import DashboardListingForm, { type PlanKey } from './form/DashboardListingForm'
import { PLAN_CAPS } from './form/constants'
import DashboardHeader from '../DashboardHeader'

const VALID: PlanKey[] = ['free', 'starter', 'yearly', 'lifetime']

/**
 * Plan picker + listing form wrapper.
 * Without ?plan=, show a compact grid so the user can pick a plan tier first.
 * With ?plan=, render the listing form directly.
 */
export default function NewListingClient() {
  const sp = useSearchParams()
  const queryPlan = sp.get('plan') as PlanKey | null
  const initial: PlanKey | null = queryPlan && VALID.includes(queryPlan) ? queryPlan : null

  const [plan, setPlan] = useState<PlanKey | null>(initial)

  const selectedCaps = useMemo(() => plan ? PLAN_CAPS[plan] : null, [plan])

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
            return (
              <button key={key} type="button" className={`nl-plan nl-plan--${key}`}
                onClick={() => setPlan(key)}>
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
                <span className="nl-plan-pick">Select {c.label} →</span>
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
