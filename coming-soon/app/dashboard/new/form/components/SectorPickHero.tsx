'use client'

import { useMemo, useState } from 'react'
import type { Category } from '../../../../iww-hq/data/category-storage'

/* ──────────────────────────────────────────────────────────────────────
   Sector pick — minimal in-between step.

   Layout (top → bottom, no scroll):
     1. Title — "Where does your business live?"
     2. Subhead — short helper line
     3. Pill row — 6 simple text pills, the actual choice
     4. Mascot — at the bottom, friendly closing visual

   No scroll — everything sized to fit the form card body. The pills are
   pure shape: pill border, sector name inside, nothing else. Sector
   color is intentionally absent (the user wants pure pills, not colored
   chips with dots).

   See `.df-spk-*` rules in dashboard-form.css.
   ────────────────────────────────────────────────────────────────────── */

type Props = {
  categories: Category[]
  /** Called with the chosen L1's id. Parent sets form.l1Id (and resets l2/l3). */
  onPick: (l1Id: string) => void
}

export default function SectorPickHero({ categories, onPick }: Props) {

  const sectors = useMemo(
    () => categories.filter(c => c.level === 1).sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  )

  const [picking, setPicking] = useState<string | null>(null)

  const handlePick = (id: string) => {
    if (picking) return
    setPicking(id)
    setTimeout(() => onPick(id), 220)
  }

  return (
    <div className="df-spk">
      <div className="df-spk-copy">
        <h1 className="df-spk-title">Where does your business live?</h1>
        <p className="df-spk-sub">
          Pick a sector to begin — you&apos;ll narrow down to the exact category in the next step.
        </p>
      </div>

      <div className="df-spk-pills" role="list">
        {sectors.length === 0 && (
          /* Skeleton row while sectors fetch — keeps the layout honest. */
          Array.from({ length: 6 }).map((_, i) => (
            <span key={`skel-${i}`} className="df-spk-pill df-spk-pill--skel" aria-hidden="true" />
          ))
        )}
        {sectors.map((s) => {
          const isPick = picking === s.id
          const isFade = picking != null && picking !== s.id
          return (
            <button
              key={s.id}
              type="button"
              role="listitem"
              className={
                'df-spk-pill' +
                (isPick ? ' is-pick' : '') +
                (isFade ? ' is-fade' : '')
              }
              onClick={() => handlePick(s.id)}
              disabled={picking != null}
              aria-label={`Pick ${s.name}`}
            >
              {s.name}
            </button>
          )
        })}
      </div>

      <div className="df-spk-mascot-wrap">
        <img
          src="/illustrations/welcome-mascot.png"
          alt=""
          className="df-spk-mascot"
          draggable={false}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>
    </div>
  )
}
