'use client'
import type { PlanCaps, PlanKey, StepDef } from '../types'

type Props = {
  steps: StepDef[]
  current: number
  onJump: (idx: number) => void
  /** Visited steps so we can show check marks for "done" rows. */
  visited: Set<number>
  progressPct: number
  /** Plan info for the in-rail "Your plan" card. */
  plan: PlanKey
  caps: PlanCaps
  /** Timestamp for "Draft saved" status; null when nothing saved yet. */
  draftSavedAt: number | null
}

/* Accent palette — one color per plan tier so each plan reads distinct.
   The accent shows as a vertical stripe + the FREE/STARTER/etc. pill. */
const PLAN_ACCENT: Record<PlanKey, string> = {
  free:     '#6B7280', // neutral slate
  starter:  '#E8553D', // brand coral
  yearly:   '#D97706', // amber
  lifetime: '#7C3AED', // violet (premium)
}

/**
 * Compact left rail mirroring the dashboard sidebar's pill geometry:
 * 32px tall, 999px radius, transparent inactive, cream-filled active w/ chevron.
 * Mobile/tablet: rail collapses (handled by CSS) into a horizontal scroll strip.
 *
 * Below the step list — a "Your plan" card showing the tier + price + a one-
 * liner description, accented per-tier. Anchors to the bottom of the rail
 * (margin-top: auto in CSS) so it sits with the progress block.
 */
export default function RailNav({
  steps, current, onJump, visited, progressPct, plan, caps, draftSavedAt,
}: Props) {
  const accent = PLAN_ACCENT[plan] || '#6B7280'

  return (
    <aside className="df-rail" aria-label="Form steps">
      <ol className="df-rail-list">
        {steps.map((s, i) => {
          const state = i === current ? 'active' : visited.has(i) ? 'done' : 'pending'
          return (
            <li key={s.id}>
              <button
                type="button"
                className={'df-rail-item df-rail-item--' + state}
                onClick={() => onJump(i)}
              >
                <span className="df-rail-num">
                  {state === 'done' ? (
                    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                      <path d="M5 12l5 5 9-11" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : s.num}
                </span>
                <span className="df-rail-label">{s.label}</span>
                {state === 'active' && (
                  <svg viewBox="0 0 24 24" width="14" height="14" className="df-rail-chev" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </li>
          )
        })}
      </ol>

      {/* Plan card — fills the empty rail space with useful context. */}
      <div
        className={`df-rail-plan df-rail-plan--${plan}`}
        style={{ '--plan-accent': accent } as React.CSSProperties}
      >
        <span className="df-rail-plan-eyebrow">Your plan</span>
        <div className="df-rail-plan-row">
          <span className="df-rail-plan-tag">{caps.label}</span>
        </div>
        <div className="df-rail-plan-price">{caps.price}</div>
        {caps.description && (
          <p className="df-rail-plan-desc">{caps.description}</p>
        )}
        {draftSavedAt && (
          <div className="df-rail-plan-saved">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12l5 5 9-11" />
            </svg>
            Draft saved
          </div>
        )}
      </div>

      <div className="df-rail-progress">
        <div className="df-rail-progress-track">
          <div className="df-rail-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="df-rail-progress-text">{progressPct}% complete</div>
      </div>
    </aside>
  )
}
