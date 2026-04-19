'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import ListingFormV2, { type PlanKey } from '../../business/ListingFormV2'
import { PLAN_CAPS } from '../../business/form/constants'

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
        <header className="ds-page-head">
          <div>
            <h1 className="ds-page-title">Create a listing</h1>
            <p className="ds-page-sub">Pick a plan to start. You can change it before publishing.</p>
          </div>
        </header>

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
                  {c.hasPremium && <li>Premium details</li>}
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
      <header className="ds-page-head">
        <div>
          <h1 className="ds-page-title">New listing</h1>
          <p className="ds-page-sub">
            {selectedCaps?.label} plan · {selectedCaps?.price}
            {' · '}
            <button type="button" className="nl-change-plan" onClick={() => setPlan(null)}>
              change plan
            </button>
          </p>
        </div>
      </header>

      <ListingFormV2 plan={plan} />
    </div>
  )
}
