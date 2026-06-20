'use client'
import { useState, useEffect, Fragment } from 'react'
import { fetchConfig } from '../../config/site-config'
import { STARTER_ROWS, FREE_ROWS } from './planGating'
import { PLAN_FEATURE_SECTIONS } from './planFeatures'

export type AnyPlan = 'free' | 'starter' | 'yearly' | 'lifetime'

interface Props {
  /** Called when the user picks a plan from any plan-button in the table. */
  onChoosePlan: (plan: AnyPlan) => void
}

const Ck = () => (
  <svg viewBox="0 0 24 24" className="pr-ck"><path d="M20 6 9 17l-5-5" /></svg>
)

const sections = PLAN_FEATURE_SECTIONS

/**
 * Full Feature Comparison — desktop 4-column grid + mobile tabbed checklist.
 * Extracted from PlansPage so it can be reused inside the dashboard's
 * /dashboard/new plan-picker step. All copy, plan data and gating come
 * from the same single sources of truth (planFeatures.ts, planGating.ts,
 * site-config.ts slot counts).
 */
export default function FeatureComparison({ onChoosePlan }: Props) {
  const [slots, setSlots] = useState({ ltEx: false, yrEx: false })
  const [mobileTab, setMobileTab] = useState<AnyPlan>('lifetime')

  useEffect(() => {
    fetchConfig().then(c => setSlots({
      ltEx: c.lifetimeSlotsClaimed >= c.lifetimeSlotsTotal,
      yrEx: c.yearlySlotsClaimed >= c.yearlySlotsTotal,
    }))
  }, [])

  const planHas = (plan: AnyPlan, row: string): boolean => {
    if (plan === 'lifetime' || plan === 'yearly') return true
    if (plan === 'starter') return STARTER_ROWS.has(row)
    return FREE_ROWS.has(row)
  }

  return (
    <section className="pr-section">
      <div className="container">
        <h2 className="pln-table-heading">Full Feature Comparison</h2>

        {/* ── Mobile-only: tabs + filtered checklist ── */}
        <div className="pln-mcompare">
          {(() => {
            const META = {
              lifetime: { cls: 'lt' as const, label: 'Lifetime',  short: 'LT', name: 'Elite Lifetime Founding', desc: 'Recommended For Businesses', price: slots.ltEx ? '999' : '239', period: 'one-time, forever',  badge: 'Recommend',
                slash: !slots.ltEx ? <><span className="fc-strikethrough">$999</span> after the launch offer</> : null,
                btnLabel: 'Claim Lifetime Spot', btnCls: 'pr-col-btn--primary', onClick: () => onChoosePlan('lifetime') },
              yearly:   { cls: 'yr' as const, label: 'Yearly',    short: 'YR', name: 'Early Adopter',           desc: 'Flexible Membership',         price: slots.yrEx ? '239' : '99',  period: 'per year Locked Forever', badge: null,
                slash: !slots.yrEx ? <><span className="fc-strikethrough">$239/yr</span> after the launch offer</> : null,
                btnLabel: 'Get Started',          btnCls: 'pr-col-btn--secondary', onClick: () => onChoosePlan('yearly') },
              starter:  { cls: 'st' as const, label: 'Starter',   short: 'ST', name: 'Starter Plan',            desc: 'Pay Once, Yours Forever',     price: '49',                       period: 'one-time',                badge: null,
                slash: 'no renewals · 14-day refund' as React.ReactNode,
                btnLabel: 'Get Starter',          btnCls: 'pr-col-btn--starter',   onClick: () => onChoosePlan('starter') },
              free:     { cls: 'fr' as const, label: 'Free',      short: 'FR', name: 'Free Plan',               desc: 'Basic Listing',               price: '0',                        period: 'forever',                 badge: null,
                slash: 'no card required' as React.ReactNode,
                btnLabel: 'Get Started',          btnCls: 'pr-col-btn--free',      onClick: () => onChoosePlan('free') },
            }
            const m = META[mobileTab]
            const isGated = mobileTab === 'starter' || mobileTab === 'free'
            const includedCount = sections.reduce((n, s) => n + s.rows.filter(r => planHas(mobileTab, r)).length, 0)
            const totalCount = sections.reduce((n, s) => n + s.rows.length, 0)
            const missingCount = totalCount - includedCount

            return (
              <>
                <div className="pln-mtabs" role="tablist" aria-label="Choose a plan">
                  {(['lifetime', 'yearly', 'starter', 'free'] as const).map(k => {
                    const t = META[k]
                    const active = mobileTab === k
                    return (
                      <button
                        key={k}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        className={`pln-mtab pln-mtab--${t.cls} ${active ? 'is-active' : ''}`}
                        onClick={() => setMobileTab(k)}
                      >
                        <span className="pln-mtab-label">{t.label}</span>
                        <span className="pln-mtab-price">${t.price}</span>
                      </button>
                    )
                  })}
                </div>

                <article className={`pln-msel pln-msel--${m.cls}`}>
                  {m.badge && <span className="pln-msel-badge">{m.badge}</span>}
                  <h3 className="pln-msel-name">{m.name}</h3>
                  <p className="pln-msel-desc">{m.desc}</p>
                  <div className="pln-msel-price"><span>$</span>{m.price}</div>
                  <div className="pln-msel-period">{m.period}</div>
                  {m.slash && <div className="pln-msel-slash">{m.slash}</div>}
                  <button type="button" className={`pr-col-btn ${m.btnCls} pln-msel-btn`} onClick={m.onClick}>
                    {m.btnLabel}
                  </button>
                  <div className="pln-msel-meta">
                    <span className="pln-msel-meta-yes">{includedCount} features included</span>
                    {missingCount > 0 && <span className="pln-msel-meta-no">+{missingCount} more in higher plans</span>}
                  </div>
                </article>

                <div className="pln-mlist">
                  {sections.map(sec => {
                    const visibleRows = sec.rows.filter(r => planHas(mobileTab, r))
                    if (visibleRows.length === 0) return null
                    return (
                      <section key={sec.title} className="pln-msec">
                        <h4 className="pln-msec-title">{sec.title}</h4>
                        <ul className="pln-msec-list">
                          {visibleRows.map(r => (
                            <li key={r} className="pln-msec-row">
                              <span className={`pln-msec-mark pln-msec-mark--${m.cls}`}><Ck /></span>
                              <span className="pln-msec-name">{r}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )
                  })}
                </div>

                {isGated && missingCount > 0 && (
                  <div className="pln-mexcl">
                    <header className="pln-mexcl-head">
                      <h4 className="pln-mexcl-title">Not in {m.label} — unlock with Lifetime / Yearly</h4>
                      <p className="pln-mexcl-sub">{missingCount} more features available on premium plans.</p>
                    </header>
                    <div className="pln-mlist pln-mlist--dim">
                      {sections.map(sec => {
                        const missingRows = sec.rows.filter(r => !planHas(mobileTab, r))
                        if (missingRows.length === 0) return null
                        return (
                          <section key={sec.title} className="pln-msec pln-msec--dim">
                            <h5 className="pln-msec-title pln-msec-title--dim">{sec.title}</h5>
                            <ul className="pln-msec-list">
                              {missingRows.map(r => (
                                <li key={r} className="pln-msec-row pln-msec-row--locked">
                                  <span className="pln-msec-lock">
                                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect x="5" y="11" width="14" height="9" rx="2" />
                                      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                                    </svg>
                                  </span>
                                  <span className="pln-msec-name">{r}</span>
                                </li>
                              ))}
                            </ul>
                          </section>
                        )
                      })}
                    </div>
                    <button
                      type="button"
                      className="pr-col-btn pr-col-btn--primary pln-mexcl-cta"
                      onClick={() => { setMobileTab('lifetime') }}
                    >
                      See full Lifetime plan
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )
          })()}
        </div>

        <div className="pr-cols-scroll">
        <div className="pr-cols pr-cols--4plans">
          <div className="pr-col-spacer" />
          <div className="pr-col-head pr-col-head--lt">
            <div className="pr-col-badge">Recommend</div>
            <div className="pr-col-name">Elite Lifetime Founding Business Plan</div>
            <div className="pr-col-desc">Recommended For Businesses</div>
            <div className="pr-col-price"><span>$</span>{slots.ltEx ? '999' : '239'}</div>
            <div className="pr-col-period">one-time, forever</div>
            {!slots.ltEx && <div className="pr-col-slash"><span className="fc-strikethrough">$999</span> after the launch offer</div>}
            <button type="button" className="pr-col-btn pr-col-btn--primary" onClick={() => onChoosePlan('lifetime')}>Claim Lifetime Spot</button>
          </div>
          <div className="pr-col-head pr-col-head--yr">
            <div className="pr-col-name">Early Adopter Plan</div>
            <div className="pr-col-desc">Flexible Membership</div>
            <div className="pr-col-price"><span>$</span>{slots.yrEx ? '239' : '99'}</div>
            <div className="pr-col-period">per year Locked forever</div>
            {!slots.yrEx && <div className="pr-col-slash"><span className="fc-strikethrough">$239/yr</span> after the launch offer</div>}
            <button type="button" className="pr-col-btn pr-col-btn--secondary" onClick={() => onChoosePlan('yearly')}>Get Started</button>
          </div>
          <div className="pr-col-head pr-col-head--st">
            <div className="pr-col-name">Starter Plan</div>
            <div className="pr-col-desc">Pay Once, Yours Forever</div>
            <div className="pr-col-price"><span>$</span>49</div>
            <div className="pr-col-period">one-time</div>
            <div className="pr-col-slash">no renewals · 14-day refund</div>
            <button type="button" className="pr-col-btn pr-col-btn--starter" onClick={() => onChoosePlan('starter')}>Get Starter</button>
          </div>
          <div className="pr-col-head pr-col-head--fr">
            <div className="pr-col-name">Free Plan</div>
            <div className="pr-col-desc">Basic Listing</div>
            <div className="pr-col-price"><span>$</span>0</div>
            <div className="pr-col-period">forever</div>
            <div className="pr-col-slash">no card required</div>
            <button type="button" className="pr-col-btn pr-col-btn--free" onClick={() => onChoosePlan('free')}>Get Started</button>
          </div>

          {sections.map((sec, si) => (
            <Fragment key={sec.title}>
              <div className="pr-col-cat">{sec.title}</div>
              <div className="pr-col-cat-cell pr-col-cat-cell--lt" />
              <div className="pr-col-cat-cell pr-col-cat-cell--yr" />
              <div className="pr-col-cat-cell pr-col-cat-cell--st" />
              <div className="pr-col-cat-cell pr-col-cat-cell--fr" />

              {sec.rows.map((row, ri) => {
                const isLast = si === sections.length - 1 && ri === sec.rows.length - 1
                const hasStarter = STARTER_ROWS.has(row)
                const hasFree = FREE_ROWS.has(row)
                return (
                  <Fragment key={row}>
                    <div className="pr-col-row">{row}</div>
                    <div className={`pr-col-check pr-col-check--lt${isLast ? ' pr-col-check--last' : ''}`}><Ck /></div>
                    <div className={`pr-col-check pr-col-check--yr${isLast ? ' pr-col-check--last' : ''}`}><Ck /></div>
                    <div className={`pr-col-check pr-col-check--st${isLast ? ' pr-col-check--last' : ''}`}>
                      {hasStarter ? <Ck /> : <span className="pr-col-dash">—</span>}
                    </div>
                    <div className={`pr-col-check pr-col-check--fr${isLast ? ' pr-col-check--last' : ''}`}>
                      {hasFree ? <Ck /> : <span className="pr-col-dash">—</span>}
                    </div>
                  </Fragment>
                )
              })}
            </Fragment>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}
