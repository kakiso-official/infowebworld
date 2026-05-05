'use client'
import type { StepDef } from '../types'

type Props = {
  steps: StepDef[]
  current: number
  onJump: (idx: number) => void
  /** Visited steps so we can show check marks for "done" rows. */
  visited: Set<number>
  progressPct: number
}

/**
 * Compact left rail mirroring the dashboard sidebar's pill geometry:
 * 32px tall, 999px radius, transparent inactive, cream-filled active w/ chevron.
 * Mobile/tablet: rail collapses (handled by CSS) into a horizontal scroll strip.
 */
export default function RailNav({ steps, current, onJump, visited, progressPct }: Props) {
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
      <div className="df-rail-progress">
        <div className="df-rail-progress-track">
          <div className="df-rail-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="df-rail-progress-text">{progressPct}% complete</div>
      </div>
    </aside>
  )
}
